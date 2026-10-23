# Admin CMS LLD

<!-- ERD-NAV-START -->

## Database relationships

[`organization` ERD](../../04-Database/ER-Diagrams/16-organization.md) · [`platform` ERD](../../04-Database/ER-Diagrams/18-platform.md) · [FK catalog](../../04-Database/ER-Diagrams/Relationship-Catalog.md)

These diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](../../04-Database/Migrations.md) for the unresolved target-baseline limit.

<!-- ERD-NAV-END -->

[Business flow](../../00-Business-Guide/Admin-and-Operations.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## Admin masters and editorial pages — implementation acceptance

**Proposed conditions for engineering handoff; never imply QA passed.**

## Draft features
- **ADM-01 / REQ-036:** Dashboard per role: orders by status, pending prescriptions, alerts, deliveries in progress (Must (draft)).
- **ADM-02 / REQ-037:** Staff users: invite, assign role and location, deactivate, log out sessions (Must (draft)).
- **ADM-03 / REQ-038:** Roles and permissions for 16 roles, limited to own store or warehouse (Must (draft)).
- **ADM-04 / REQ-039:** CMS: home banners, FAQs, policy pages, with draft and publish (Must (draft)).
- **ADM-05 / REQ-040:** System settings (PRD section 8) (Must (draft)).
- **ADM-06 / REQ-041:** Catalogue admin: products, categories, brands, salt master, prices, GST and HSN (Must (draft)).
- **ADM-07 / REQ-042:** Bulk product import from Excel, with error report (Must (draft)).
- **ADM-08 / REQ-043:** Store and warehouse master: address, hours, GSTIN, service areas (Must (draft)).
- **ADM-09 / REQ-044:** Offer settings: start and end dates, maximum discount, first-order offer (Should (draft)).

## Required release checks
- Authorised happy path persists exactly the intended state.
- Invalid, cross-account and cross-location requests leave authoritative rows unchanged.
- Concurrent duplicate requests do not create duplicate money, stock or order effects.
- File, prescription and patient data are not exposed to unauthorised roles.
- Recoverable provider failure exposes a pending/retryable state; never claims success.
- Audit/trace data contains public references, not credentials or sensitive document contents.

Module test scenarios

## Admin Portal, CMS & Masters — HTTP API responsibilities

All routes below are **Proposed REST v1 contracts**. The database repository does not implement them. Public UUIDs identify resources; staff scope and patient/order ownership are checked at each handler, not inferred from URL paths.

- API-032 GET /v1/admin/dashboard — Scoped dashboard
- API-033 POST /v1/admin/staff — Invite scoped staff
- API-034 PATCH /v1/admin/staff/{staff_id} — Modify location/role/status
- API-035 GET /v1/admin/settings — Read approved settings
- API-036 PATCH /v1/admin/settings — Change approved settings
- API-037 POST /v1/admin/cms/pages/{page_id}/publish — Publish checked content
- API-038 POST /v1/admin/locations — Add verified location master

## Cross-cutting request contract

Writes require validated body, stable intent key, expected current version when appropriate, auditable actor identity and an explicit outcome. Reads use safe pagination and permission-filtered fields. `401` indicates no valid session; `403/404` denied scope; `409` conflict; `422` business validation; `503` unknown upstream outcome. Read [api conventions](../../05-APIs/README.md) before implementing the endpoint.

**Business gate:** A role editor cannot give itself new powers; owner/team signoff precedes policy changes. Draft and published content versions must remain distinguishable and published pages sanitized. For actual response fields, see the linked illustrative contract and approve a typed OpenAPI schema before implementation.

## Admin Portal, CMS & Masters — business logic and invariants

**Rule origin:** the documented draft requirements and database migration guards. Distinguish a **confirmed database guard** from a **proposed API orchestration** and **open numeric policy**.

## Core procedure

1. Authenticate the actor and resolve server-owned tenant/location/patient permission.
2. Re-read the relevant product, order, document, stock or ledger state from the owning tables.
3. Reject incomplete or stale input; validate the latest accepted revision and current classification where relevant.
4. Apply the module invariant: **A role editor cannot give itself new powers; owner/team signoff precedes policy changes. Draft and published content versions must remain distinguishable and published pages sanitized.**
5. In a transaction, persist the minimal authoritative rows, version and audit outcome; publish notifications after commit.
6. Return a scoped read model; expose only approved information to the caller.

## Features implemented by this rule set

`ADM-01`, `ADM-02`, `ADM-03`, `ADM-04`, `ADM-05`, `ADM-06`, `ADM-07`, `ADM-08`, `ADM-09` (see full requirement descriptions).

## Pseudocode — command boundary

```text
context := verify_session_and_resource_scope(request)
current := load_owned_aggregate_for_update(context, resource_id)
assert expected_version_matches(current)
assert domain_policy_allows_action(current, request)
result := transition_atomically(current, validated_request)
write_audit_and_outbox_in_same_transaction(result)
return filter_for_actor(result, context)
```

Unknown business thresholds (expiry freshness, COD cap, review deadlines, refund limits) must be policy data agreed by business owners, never hard-coded assumptions. On conflict, expose an actionable `409` and reload state. On an external provider timeout, keep the result pending rather than guessing success.

## Admin Portal, CMS & Masters — internal components

**Status:** Proposed NestJS modular-monolith design informed by the decided stack in the master decisions checklist. This is not code already implemented in the SQLAlchemy repository.

| Component | Responsibility | Failure boundary |
| --- | --- | --- |
| HTTP controller / DTO validator | Accept typed requests for admin portal, cms & masters, reject malformed payloads | `400/422`, no database change |
| Use-case service | Execute: Manage scoped staff; publish CMS; configure stores and reference choices | Explicit domain errors, no invented outcomes |
| Policy/authorization service | Enforce user role, object ownership, business eligibility | `403/404` and audit denied attempt |
| Domain repository | Execute scoped PostgreSQL reads/writes within a transaction | Retry only on safe concurrency errors |
| Outbox / integration adapter | Publish committed changes toward other modules or third parties | Durable retry and dead-letter review if adopted |

### Boundaries

A role editor cannot give itself new powers; owner/team signoff precedes policy changes. Draft and published content versions must remain distinguishable and published pages sanitized. Public controllers must not call database workflow functions with arbitrary SQL and must not accept a caller-supplied `actor_user_id`. Network IO belongs outside long-lived locks. Modules should depend on domain interfaces, not on each other's ORM entities. Consult Dependencies and [architecture overview](../../02-Architecture/System-HLD.md).

## Admin Portal, CMS & Masters — existing database usage

**Confirmed database:** 24 PostgreSQL schemas; SQL migration authority the checked-in SQL migration history. The tables below exist, but **a schema-domain association does not automatically mean this module owns every row or has write rights**. The database repository is not an HTTP service.

- `identity.roles` — columns · contracts
- `organization.bank_accounts` — columns · contracts
- `organization.departments` — columns · contracts
- `organization.licenses` — columns · contracts
- `organization.locations` — columns · contracts
- `organization.memberships` — columns · contracts
- `organization.organizations` — columns · contracts
- `platform.application_settings` — columns · contracts
- `platform.audit_logs` — columns · contracts
- `platform.cms_banners` — columns · contracts
- `platform.cms_page_versions` — columns · contracts
- `platform.cms_pages` — columns · contracts

## Ownership, transactions and change control

Proposed owning service: `Admin_CMS`. Main read concerns: role-limited operations console, content publishing, settings and staff masters. Writes must be restricted by the actual foreign keys, CHECKs, unique contracts, crosswalks, policy and trigger guards. Use one transaction per domain state transition, use an outbox for reliable cross-module publication, and make any external retry idempotent.

**Safety:** A role editor cannot give itself new powers; owner/team signoff precedes policy changes. Draft and published content versions must remain distinguishable and published pages sanitized.

Internal ID strategy: `identity.users.id` is UUID; most other tables have BIGINT internal PK with original immutable UUID alias. Never cast UUID to BIGINT or expose DB internal IDs as authorization tokens. All schema changes require new forward-only SQL migration under the source repo and a fresh PG15/PG18 parity test. Related [migration strategy](../../04-Database/Migrations.md).

## Admin Portal, CMS & Masters — dependencies and ownership

**Underlying schemas:** `platform`, `organization`, `identity`, `reference`. These schemas are shared data domains; shared reads are not automatic write rights. Candidate collaborator modules are inferred from overlapping schema use:

- Audit
- Authentication_Access
- Customer_Accounts
- Delivery_Operations
- Notifications
- Order_Operations
- Prescription_Upload
- Reporting

## Communication rules

Use the owning service interface for business changes rather than making uncontrolled cross-module writes. In the chosen modular-monolith style, synchronous application calls can remain in-process. BullMQ/Redis jobs serve slow notifications and integrations after commit; they should not become the source of order, payment, stock or clinical truth. Build independent adapters for Cashfree, POS/Techsmith, MSG91 and driver APIs; failures must remain visible.

**Data-access contract:** A role editor cannot give itself new powers; owner/team signoff precedes policy changes. Draft and published content versions must remain distinguishable and published pages sanitized.. Related: [module dependencies](../../02-Architecture/Module-Dependencies.md) and [database usage](../../04-Database/Module-Mapping.md).

## Admin Portal, CMS & Masters — domain objects and DTO boundaries

**Proposed objects, not new database tables.** A domain object is a service-level business concept; a DTO is a validated data transfer object (API input/output). Do not confuse them with the Python SQLAlchemy models used for schema verification.

| Proposed object | Source of truth / evidence | Rules |
| --- | --- | --- |
| `Admin_CMSCommand` | Authenticated HTTP request and expected version | Includes actor context, idempotency key and validated business input |
| `Admin_CMSAggregate` | Domain rows listed in Database Usage | Represents the current authoritative business facts |
| `Admin_CMSPolicy` | Approved master/role records and product rules | A role editor cannot give itself new powers; owner/team signoff precedes policy changes. Draft and published content versions must remain distinguishable and published pages sanitized. |
| `Admin_CMSReadModel` | Role-filtered current state | Removes protected fields and translates internal statuses |
| `Admin_CMSEvent` | Committed state transition and audit ID | Events carry references and versions, not clinical documents |

**Existing representative tables:** `identity.roles`, `organization.bank_accounts`, `organization.departments`, `organization.licenses`, `organization.locations`, `organization.memberships`, `organization.organizations`, `platform.application_settings`. Internal BIGINT primary keys are never used as authorization credentials, and original UUID public references must remain stable. Any DTO field not directly supported by a confirmed column must be labelled proposed until the API team approves the mapping. See [database usage](../../04-Database/Module-Mapping.md).

## Admin Portal, CMS & Masters — failure handling

**Primary rule:** A role editor cannot give itself new powers; owner/team signoff precedes policy changes. Draft and published content versions must remain distinguishable and published pages sanitized.

- **Missing or invalid input:** respond with a field-specific problem code; do not leak sensitive data and do not write partial state.
- **Unauthorized object or location:** return `403` or privacy-safe `404`; record the attempted privileged action.
- **Duplicate submission:** return the persisted result when key + payload match; reject key reuse with different payload.
- **Stale/concurrent change:** database version/FK/CHECK guard must resolve a single winner; caller reloads latest projection.
- **Partial external failure:** leave the aggregate pending, never mark payment/stock/delivery success by assumption. Retry verified idempotent adapter calls; otherwise reconcile manually.
- **Safety or compliance policy unknown:** fail closed. Route staff to an exception queue and customer to a non-misleading status.

Use structured problem codes, request ID, retryability category and operator runbook reference. Sensitive Rx, financial tokens, OTPs and location traces must not be placed into logs. See [error responses](../../05-APIs/README.md#standard-problem-response-behavior) and [incident triage](../../07-Engineering/Release-and-Incident-Handling.md).

## Admin masters and editorial pages — proposed interfaces and DTOs

**Business context:** Master data publication is an approved versioned action; staff scope is checked server-side.

**Controller contract:** validate identity and scope before accepting a command; never expose internal BIGINT IDs. Typed inputs should carry allowed public identifiers, operation-specific fields, expected record version and a unique idempotency key on mutations.

**Use-case interface:** `execute(trustedContext, validatedRequest) -> acceptedResult | domainError`. This is pseudocode for a boundary, **not generated application code**.

**Repository interface:** require a database transaction handle, parameterised SQL/ORM queries, and a stored accepted transition. Return public UUIDs or approved opaque references only.

**Error DTO proposal:** `{"error":{"code":"STATE_CONFLICT","message":"Refresh the record and try again","request_id":"..."}}`. Do not expose SQL errors, provider secrets or prescription contents.

**Existing table candidates:** `platform.cms_pages`, `platform.cms_page_versions`, `platform.cms_banners`, `platform.application_settings`, `organization.locations`.

**Per-operation request and response examples:** API contract index. No generic DTO in this document overrides module-specific validation.

## Admin masters and editorial pages — internal architecture

**Status: Proposed application design.** The database repo does not contain a NestJS HTTP implementation.

## Business behavior
Master data publication is an approved versioned action; staff scope is checked server-side.

## Components
| Component | Responsibility | Data affected | Failure outcome |
| --- | --- | --- | --- |
| `Admin_CMSController` (proposed) | Validate DTO and request context | Public API request only | 400/401/403 without partial mutation |
| `Admin_CMSUseCase` (proposed) | Enforce module business invariant | platform.cms_pages, platform.cms_page_versions, platform.cms_banners | Domain status, do not guess provider truth |
| `Admin_CMSRepository` (proposed) | Scoped SQL transaction and concurrency guard | Exact migrated tables | Roll back on conflict or constraint error |
| `Admin_CMSIntegrationAdapter` (only when needed) | Map external IO and reconcile delivery | Outbox/inbox or verified provider record | Retries outside DB lock |

## Transaction and retry sequence

1. verify staff privilege and location scope.
2. validate master data and publish prerequisites.
3. write versioned draft or approval.
4. invalidate affected catalog/search projections.
5. audit the privileged change.

## Existing tables (candidate responsibilities)
- platform.cms_pages — candidate entity; verify the exact operation and field set in the implementation review.
- platform.cms_page_versions — candidate entity; verify the exact operation and field set in the implementation review.
- platform.cms_banners — candidate entity; verify the exact operation and field set in the implementation review.
- platform.application_settings — candidate entity; verify the exact operation and field set in the implementation review.
- organization.locations — candidate entity; verify the exact operation and field set in the implementation review.

## Related
HLD · States · Permissions

## Admin masters and editorial pages — observability

**Proposed runtime design:** Structured logs record correlation ID, module, operation, outcome code and elapsed time. Replace identifiers with approved pseudonymous references. No raw OTP, prescription text, secrets, payment credentials, addresses or GPS coordinates in logs.

**Candidate counters:** `admin_cms_command_total{outcome}`, `admin_cms_denied_total{reason}`, and `admin_cms_provider_pending_total` when an external provider is involved. Names are proposed and require monitoring owner review.

**Actionable alerts:** persistent command rejection spikes, outbox backlog, stale integrations or reconciliation mismatches; thresholds are open questions, not fabricated service-level objectives.

Monitoring design

## Admin Portal, CMS & Masters — permission model

**Actors:** Super Admin, Central Admin, CMS Manager. **Proposed service scope:** `staff_admin`. Roles are application concepts; existing PostgreSQL NOLOGIN capability roles form a separate lower-level authorization layer.

| Operation class | Required entitlement | Enforcement |
| --- | --- | --- |
| Read own/scoped data | Authenticated identity + object or location ownership | Controller + service + database guard where provided |
| Create / edit | Explicit module action grant, approved master and domain status | Policy decision before transaction |
| Override / refund / pharmacist action | Specialized staff permission and documented approval reason | Distinct privilege, immutable audit evidence |
| Export / sensitive view | Purpose-limited role, retention and access logging | Recheck at download/stream time |

**Core constraint:** A role editor cannot give itself new powers; owner/team signoff precedes policy changes. Draft and published content versions must remain distinguishable and published pages sanitized. A customer cannot infer another customer's resource existence. Do not connect app runtime through migration-owner credentials. Consult [roles and permissions](../../07-Engineering/Security.md).

## Admin Portal, CMS & Masters — functional requirements

**Source:** the documented draft requirements. **Status:** Draft requirements, not proof of final business acceptance. 🔴/🟡/🟢 priorities have been normalized as Must/Should/Could without changing their meaning.

| Feature | Priority in v0.1 | Statement | Dependency |
| --- | --- | --- | --- |
| `ADM-01` | Must (draft) | Dashboard per role: orders by status, pending prescriptions, alerts, deliveries in progress | Not stated |
| `ADM-02` | Must (draft) | Staff users: invite, assign role and location, deactivate, log out sessions | Staff list |
| `ADM-03` | Must (draft) | Roles and permissions for 16 roles, limited to own store or warehouse | Not stated |
| `ADM-04` | Must (draft) | CMS: home banners, FAQs, policy pages, with draft and publish | Content, legal texts |
| `ADM-05` | Must (draft) | System settings (PRD section 8) | Not stated |
| `ADM-06` | Must (draft) | Catalogue admin: products, categories, brands, salt master, prices, GST and HSN | Not stated |
| `ADM-07` | Must (draft) | Bulk product import from Excel, with error report | Product list |
| `ADM-08` | Must (draft) | Store and warehouse master: address, hours, GSTIN, service areas | Master data |
| `ADM-09` | Should (draft) | Offer settings: start and end dates, maximum discount, first-order offer | Discount policy, Q10 |

## Interactions and acceptance basis

The user performs: Manage scoped staff; publish CMS; configure stores and reference choices. Server-side enforcement must preserve this invariant: **A role editor cannot give itself new powers; owner/team signoff precedes policy changes. Draft and published content versions must remain distinguishable and published pages sanitized.**

A feature becomes implementation-ready only after its inputs (especially any dependency listed above), permissions, workflow outcome, API body and database transaction are resolved. Confirm business thresholds before coding: a field existing in SQL is not proof that its value was approved.

See requirement coverage and test IDs.

## Admin masters and editorial pages — request sequence

**Proposed design**, not a diagram of deployed services. Business-specific steps appear in Internal Architecture.

```mermaid
sequenceDiagram
  participant A as Staff editor
  participant O as Admin CMS
  participant D as PostgreSQL
  A->>O: Publish approved content version
  O->>D: Check editor scope and expected draft version
  alt Gate fails or current version conflicts
    O-->>A: Keep draft and ask editor to resolve
  else Gate satisfied
    O->>D: Publish version and append history
    D-->>O: Committed evidence
    O-->>A: Published content version
  end
```

## Admin Portal, CMS & Masters — service design

**Proposed NestJS module:** `Admin_CMSModule` with a controller, application service, authorization policy, repository and adapters. The supplied database code is a schema/validation library; no running HTTP controller was found in Archive 2.

## Candidate service methods

- `API-032: scoped_dashboard(actor_context, validated_command, expected_version) -> Result`
- `API-033: invite_scoped_staff(actor_context, validated_command, expected_version) -> Result`
- `API-034: modify_location/role/status(actor_context, validated_command, expected_version) -> Result`
- `API-035: read_approved_settings(actor_context, validated_command, expected_version) -> Result`
- `API-036: change_approved_settings(actor_context, validated_command, expected_version) -> Result`
- `API-037: publish_checked_content(actor_context, validated_command, expected_version) -> Result`
- `API-038: add_verified_location_master(actor_context, validated_command, expected_version) -> Result`

## Transaction and integration contract

For each mutation: authenticate actor, validate inputs, read affected rows with a lock/version check, verify policy, update the minimum relevant rows and immutable audit/outbox in one transaction. A remote gateway, storage or GPS call should be performed outside the locked transaction and reconciled on callback/timeout. Use PostgreSQL to reject invalid writes even if application validation is bypassed.

**Module invariant:** A role editor cannot give itself new powers; owner/team signoff precedes policy changes. Draft and published content versions must remain distinguishable and published pages sanitized.

**Timeouts/retries:** configure per provider, use exponential backoff with caps for safe reads and idempotent messages; never blindly repeat charge/refund/cash state changes. A dead-letter queue is an optional BullMQ operating pattern because BullMQ/Redis are selected in the checklist, but exact job topology needs signoff. **Telemetry:** actor pseudonym, request ID, action, state transition latency, retries and failure category; redact protected clinical and payment contents. See [database usage](../../04-Database/Module-Mapping.md) and Monitoring.

## Admin Portal, CMS & Masters — state and transition policy

**Status:** State boundaries are derived from the unified order journey and existing SQL CHECK/trigger contracts; the following is a service design, not a claim that a single enum exists.

```mermaid
flowchart TD
  A["Publish approved content version"] --> B{"Draft and approval current?"}
  B -->|No| C["Keep draft and ask editor to resolve"]
  B -->|Yes| D["Publish version and append history"]
  D --> E["Published content version"]
```

**Module-specific invariant:** A role editor cannot give itself new powers; owner/team signoff precedes policy changes. Draft and published content versions must remain distinguishable and published pages sanitized.

Each transition must record the prior state, target state, reason where required, actor, accepted version and timestamp. A second command on the same state must either replay the prior idempotent result or fail with `409`. A failed external callback cannot roll an accepted state backward; reconcile with authoritative provider evidence. When an order changes, keep clinical, payment, inventory, fulfillment and delivery statuses separate, then derive one safe user-visible projection.

This flow shows command gates, not an entity enum. Legal entity transitions and recovery are specified in [state contracts](../../07-Engineering/State-and-Recovery-Contracts.md); the table catalog supplies actual stored values.

## Admin Portal, CMS & Masters — verification and acceptance

**Candidate test IDs** derived one-to-one from the v0.1 feature IDs. They are test-design work items, not claims that the tests have been implemented. Database-level tests reported in the source do not replace HTTP and browser tests.

| Stable test ID | Behavior | Expected result |
| --- | --- | --- |
| `TC-ADM-01-OK` | Dashboard per role: orders by status, pending prescriptions, alerts, deliveries in progress | Dashboard queues match staff role/location |
| `TC-ADM-01-DENY` | Store user changes location filter to another store | No other-location orders or patient counts disclosed; Manager corrects assignment; Security tests filter enforcement |
| `TC-ADM-02-OK` | Staff users: invite, assign role and location, deactivate, log out sessions | Approved invite/role/location changes are audited; deactivation revokes as policy requires |
| `TC-ADM-02-DENY` | Deactivated staff uses an old session | Protected command denied under approved revocation policy; Security verifies revocation propagation |
| `TC-ADM-03-OK` | Roles and permissions for 16 roles, limited to own store or warehouse | Server checks action and location on every staff operation |
| `TC-ADM-03-DENY` | Staff attempts to grant itself a privileged role | No self-authorized privilege increase; Authorized Security/manager reviews grants |
| `TC-ADM-04-OK` | CMS: home banners, FAQs, policy pages, with draft and publish | Only accepted content version publishes with history |
| `TC-ADM-04-DENY` | Two editors publish from the same stale draft | Stale publish conflicts; one accepted version remains; Editor reloads and resolves change |
| `TC-ADM-05-OK` | System settings (PRD section 8) | Approved versioned setting affects permitted subsequent actions |
| `TC-ADM-05-DENY` | Fee change is applied to an already accepted basket | No silent reprice; explicit revision if allowed; Product/Finance approves setting and customer consent path |
| `TC-ADM-06-OK` | Catalogue admin: products, categories, brands, salt master, prices, GST and HSN | Permitted catalog/tax edits use domain-owner interfaces |
| `TC-ADM-06-DENY` | Admin submits unsupported HSN/tax or clinical class | Invalid publication blocked; no direct bypass of Catalog/Finance/Pharmacy; Responsible catalog/tax/clinical owner corrects approved master |
| `TC-ADM-07-OK` | Bulk product import from Excel, with error report | Import reports accepted/rejected rows with safe replay identity |
| `TC-ADM-07-DENY` | Sheet contains duplicate SKU and malformed price | Specific row errors; no silent duplicate product or partial unknown outcome; Catalog owner reviews approved import atomicity and retries corrected input |
| `TC-ADM-08-OK` | Store and warehouse master: address, hours, GSTIN, service areas | Location hours, address, service area and identifiers save with permission |
| `TC-ADM-08-DENY` | Expired license site is marked operationally open | Open flag cannot make site eligible for regulated fulfillment; Operations/Pharmacy renew approved license evidence |
| `TC-ADM-09-OK` | Offer settings: start and end dates, maximum discount, first-order offer | Approved offer version obeys configured dates and discount limit |
| `TC-ADM-09-DENY` | Expired offer is submitted from an old basket | Reprice/reaccept; no stale unapproved discount; Product approves offer; customer reviews total |

## Cross-module contract tests

- Verify authenticated customer/staff/location ownership using actual restricted runtime roles.
- Verify concurrency and duplicate idempotency behavior against an isolated PostgreSQL database with authoritative migrations.
- Verify safe retry when callbacks or files arrive late or malformed.
- Verify audit and notification records are based on committed state and contain no confidential payloads.
- Verify this invariant: **A role editor cannot give itself new powers; owner/team signoff precedes policy changes. Draft and published content versions must remain distinguishable and published pages sanitized.**

Coverage state: **Designed, not executed for the proposed application**. Link individual results to the associated test ID and requirement before go-live. Read [test strategy](../../07-Engineering/Testing.md).

## Admin Portal, CMS & Masters — validation checkpoints

| Boundary | Required validation | Rejection outcome |
| --- | --- | --- |
| Input | Required fields, type, size, allowed format and business master codes | `400/422`; no write |
| Actor | Session validity, role, location, customer/patient/parcel ownership | `401/403/404`; audit |
| Version | Accepted order revision or row version matches, if state-changing | `409`; fetch current state |
| Domain | A role editor cannot give itself new powers; owner/team signoff precedes policy changes. Draft and published content versions must remain distinguishable and published pages sanitized. | Explicit blocked/pending/error status |
| Database | FK, PK, UNIQUE, CHECK, trigger and RLS outcome | Safe conflict/business error; rollback |
| Integration | Authenticated provider/callback, idempotency key and settled evidence | Keep pending; reconciliation task |

**Requirements:** `ADM-01`, `ADM-02`, `ADM-03`, `ADM-04`, `ADM-05`, `ADM-06`, `ADM-07`, `ADM-08`, `ADM-09`. Never trust browser-supplied patient, clinical decision, backend actor context, price or available quantity. Refer to Testing for negative tests.

## Admin Portal, CMS & Masters — operational workflows

**Entry points:** Manage scoped staff; publish CMS; configure stores and reference choices. **User group:** Super Admin, Central Admin, CMS Manager. The following source-defined order journey stages identify primary ownership; supporting modules also participate without necessarily owning the stage.

This module supports shared controls across multiple stages; no single stage is exclusively owned.

## Shared processing rules

The requested action is first validated against user scope, current state and approved business master data. Read required evidence from real migrated tables; change only data this module owns; publish a safe event or notify the next module after commit.

**Alternative paths:** missing required input keeps the process actionable; a stale or duplicate request is deduplicated; another actor's update returns a version conflict; external unavailability produces a pending/blocked state. Prescriptions, inventory, payments and logistics never independently set the whole order to delivered.

**Module-specific rule:** A role editor cannot give itself new powers; owner/team signoff precedes policy changes. Draft and published content versions must remain distinguishable and published pages sanitized.

See [state transitions](../../07-Engineering/State-and-Recovery-Contracts.md) and [unified order](../../00-Business-Guide/Pharmville-Complete-Business-Flow.md).
