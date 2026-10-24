# Reporting LLD

<!-- ERD-NAV-START -->

## Database relationships

[`platform` ERD](../../04-Database/ER-Diagrams/18-platform.md) · [`finance` ERD](../../04-Database/ER-Diagrams/08-finance.md) · [FK catalog](../../04-Database/ER-Diagrams/Relationship-Catalog.md)

These diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](../../04-Database/Migrations.md) for the supplied source and deployment verification limits.

<!-- ERD-NAV-END -->

[Business flow](../../00-Business-Guide/Reporting-and-Audit.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## Scoped operations and financial reports — implementation acceptance

> [!NOTE]
> **Proposed conditions for engineering handoff; never imply QA passed.**

### Draft features

- **REP-01 / REQ-093:** Sales and orders, by date, store and product (Must (draft)).
- **REP-02 / REQ-094:** GST report for filing (Must (draft)).
- **REP-03 / REQ-095:** Stock, low stock and near-expiry (Must (draft)).
- **REP-04 / REQ-096:** COD, rider collections and deliveries per rider (Must (draft)).
- **REP-05 / REQ-097:** Refunds, cancellations and failed deliveries (Should (draft)).
- **REP-06 / REQ-098:** Replenishment transfers (Should (draft)).
- **REP-07 / REQ-099:** Excel export for every report (Must (draft)).

### Required release checks

- Authorised happy path persists exactly the intended state.
- Invalid, cross-account and cross-location requests leave authoritative rows unchanged.
- Concurrent duplicate requests do not create duplicate money, stock or order effects.
- File, prescription and patient data are not exposed to unauthorised roles.
- Recoverable provider failure exposes a pending/retryable state; never claims success.
- Audit/trace data contains public references, not credentials or sensitive document contents.

**Module test scenarios**

## Operational & Finance Reporting — HTTP API responsibilities

All routes below are **Proposed REST v1 contracts**. The database repository does not implement them. Public UUIDs identify resources; staff scope and patient/order ownership are checked at each handler, not inferred from URL paths.

- `API-082` `GET /v1/admin/reports/sales` — Scoped sales report
- `API-083` `GET /v1/admin/reports/tax` — Scoped GST report
- `API-084` `GET /v1/admin/reports/stock` — Scoped stock report
- `API-085` `GET /v1/admin/reports/deliveries` — Scoped COD/rider report
- `API-086` `POST /v1/admin/reports/exports` — Generate permissioned export job

### Cross-cutting request contract

Writes require validated body, stable intent key, expected current version when appropriate, auditable actor identity and an explicit outcome. Reads use safe pagination and permission-filtered fields. `401` indicates no valid session; `403/404` denied scope; `409` conflict; `422` business validation; `503` unknown upstream outcome. Read [api conventions](../../05-APIs/README.md) before implementing the endpoint.

**Business gate:** Read from a permission-limited reporting capability or approved aggregate. Export jobs must reauthorize on download and respect location/clinical redaction; cached reports are not unrestricted data extracts. For actual response fields, see the linked illustrative contract and approve a typed OpenAPI schema before implementation.

## Operational & Finance Reporting — business logic and invariants

**Rule origin:** the documented draft requirements and database migration guards. Distinguish a **confirmed database guard** from a **proposed API orchestration** and **open numeric policy**.

### Core procedure

1. Authenticate the actor and resolve server-owned tenant/location/patient permission.
2. Re-read the relevant product, order, document, stock or ledger state from the owning tables.
3. Reject incomplete or stale input; validate the latest accepted revision and current classification where relevant.
4. Apply the module invariant: **Read from a permission-limited reporting capability or approved aggregate. Export jobs must reauthorize on download and respect location/clinical redaction; cached reports are not unrestricted data extracts.**
5. In a transaction, persist the minimal authoritative rows, version and audit outcome; publish notifications after commit.
6. Return a scoped read model; expose only approved information to the caller.

### Features implemented by this rule set

`REP-01`, `REP-02`, `REP-03`, `REP-04`, `REP-05`, `REP-06`, `REP-07` (see full requirement descriptions).

### Pseudocode — command boundary

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

## Operational & Finance Reporting — internal components

**Status:** Proposed NestJS modular-monolith design informed by the decided stack in the master decisions checklist. This is not code already implemented in the SQLAlchemy repository.

| Component | Responsibility | Failure boundary |
| --- | --- | --- |
| HTTP controller / DTO validator | Accept typed requests for operational & finance reporting, reject malformed payloads | `400/422`, no database change |
| Use-case service | Execute: Run scoped views; request and download access-controlled exports | Explicit domain errors, no invented outcomes |
| Policy/authorization service | Enforce user role, object ownership, business eligibility | `403/404` and audit denied attempt |
| Domain repository | Execute scoped PostgreSQL reads/writes within a transaction | Retry only on safe concurrency errors |
| Outbox / integration adapter | Publish committed changes toward other modules or third parties | Durable retry and dead-letter review if adopted |

### Boundaries

Read from a permission-limited reporting capability or approved aggregate. Export jobs must reauthorize on download and respect location/clinical redaction; cached reports are not unrestricted data extracts. Public controllers must not call database workflow functions with arbitrary SQL and must not accept a caller-supplied `actor_user_id`.

Network IO belongs outside long-lived locks. Modules should depend on domain interfaces, not on each other's ORM entities. Consult Dependencies and [architecture overview](../../02-Architecture/System-HLD.md).

## Operational & Finance Reporting — existing database usage

**Confirmed database:** 24 PostgreSQL schemas; SQL migration authority the checked-in SQL migration history. The tables below exist, but **a schema-domain association does not automatically mean this module owns every row or has write rights**. The database repository is not an HTTP service.

- `commerce.orders` — columns · contracts
- `finance.accounts` — columns · contracts
- `finance.credit_notes` — columns · contracts
- `finance.invoice_items` — columns · contracts
- `finance.invoices` — columns · contracts
- `finance.journal_entries` — columns · contracts
- `finance.journal_lines` — columns · contracts
- `finance.settlement_items` — columns · contracts
- `finance.settlement_runs` — columns · contracts
- `platform.report_definitions` — columns · contracts
- `platform.report_runs` — columns · contracts

### Ownership, transactions and change control

Proposed owning service: `Reporting`. Main read concerns: scoped reports, exports, reconciliation and operational metrics. Writes must be restricted by the actual foreign keys, CHECKs, unique contracts, crosswalks, policy and trigger guards. Use one transaction per domain state transition, use an outbox for reliable cross-module publication, and make any external retry idempotent.

**Safety:** Read from a permission-limited reporting capability or approved aggregate. Export jobs must reauthorize on download and respect location/clinical redaction; cached reports are not unrestricted data extracts.

Internal ID strategy: `identity.users.id` is UUID; most other tables have BIGINT internal PK with original immutable UUID alias. Never cast UUID to BIGINT or expose DB internal IDs as authorization tokens. All schema changes require new forward-only SQL migration under the source repo and a fresh PG15/PG18 parity test. Related [migration strategy](../../04-Database/Migrations.md).

## Operational & Finance Reporting — dependencies and ownership

**Underlying schemas:** `platform`, `finance`, `commerce`. These schemas are shared data domains; shared reads are not automatic write rights. Candidate collaborator modules are inferred from overlapping schema use:

- Admin_CMS
- Audit
- Authentication_Access
- Cart_Checkout
- Customer_Orders
- Finance_Payments
- Notifications
- Order_Operations

### Communication rules

Use the owning service interface for business changes rather than making uncontrolled cross-module writes. In the chosen modular-monolith style, synchronous application calls can remain in-process. BullMQ/Redis jobs serve slow notifications and integrations after commit; they should not become the source of order, payment, stock or clinical truth.

Build independent adapters for Cashfree, POS/Techsmith, MSG91 and driver APIs; failures must remain visible.

**Data-access contract:** Read from a permission-limited reporting capability or approved aggregate. Export jobs must reauthorize on download and respect location/clinical redaction; cached reports are not unrestricted data extracts.. Related: [module dependencies](../../02-Architecture/Module-Dependencies.md) and [database usage](../../04-Database/Module-Mapping.md).

## Operational & Finance Reporting — domain objects and DTO boundaries

**Proposed objects, not new database tables.** A domain object is a service-level business concept; a DTO is a validated data transfer object (API input/output). Do not confuse them with the Python SQLAlchemy models used for schema verification.

| Proposed object | Source of truth / evidence | Rules |
| --- | --- | --- |
| `ReportingCommand` | Authenticated HTTP request and expected version | Includes actor context, idempotency key and validated business input |
| `ReportingAggregate` | Domain rows listed in Database Usage | Represents the current authoritative business facts |
| `ReportingPolicy` | Approved master/role records and product rules | Read from a permission-limited reporting capability or approved aggregate. Export jobs must reauthorize on download and respect location/clinical redaction; cached reports are not unrestricted data extracts. |
| `ReportingReadModel` | Role-filtered current state | Removes protected fields and translates internal statuses |
| `ReportingEvent` | Committed state transition and audit ID | Events carry references and versions, not clinical documents |

**Existing representative tables:** `commerce.orders`, `finance.accounts`, `finance.credit_notes`, `finance.invoice_items`, `finance.invoices`, `finance.journal_entries`, `finance.journal_lines`, `finance.settlement_items`. Internal BIGINT primary keys are never used as authorization credentials, and original UUID public references must remain stable.

Any DTO field not directly supported by a confirmed column must be labelled proposed until the API team approves the mapping. See [database usage](../../04-Database/Module-Mapping.md).

## Operational & Finance Reporting — failure handling

**Primary rule:** Read from a permission-limited reporting capability or approved aggregate. Export jobs must reauthorize on download and respect location/clinical redaction; cached reports are not unrestricted data extracts.

- **Missing or invalid input:** respond with a field-specific problem code; do not leak sensitive data and do not write partial state.
- **Unauthorized object or location:** return `403` or privacy-safe `404`; record the attempted privileged action.
- **Duplicate submission:** return the persisted result when key + payload match; reject key reuse with different payload.
- **Stale/concurrent change:** database version/FK/CHECK guard must resolve a single winner; caller reloads latest projection.
- **Partial external failure:** leave the aggregate pending, never mark payment/stock/delivery success by assumption. Retry verified idempotent adapter calls; otherwise reconcile manually.
- **Safety or compliance policy unknown:** fail closed. Route staff to an exception queue and customer to a non-misleading status.

Use structured problem codes, request ID, retryability category and operator runbook reference. Sensitive Rx, financial tokens, OTPs and location traces must not be placed into logs. See [error responses](../../05-APIs/README.md#standard-problem-response-behavior) and [incident triage](../../07-Engineering/Release-and-Incident-Handling.md).

## Scoped operations and financial reports — proposed interfaces and DTOs

**Business context:** Reports must be authorised by entity scope and must not export unapproved patient data.

**Controller contract:** validate identity and scope before accepting a command; never expose internal BIGINT IDs. Typed inputs should carry allowed public identifiers, operation-specific fields, expected record version and a unique idempotency key on mutations.

**Use-case interface:** `execute(trustedContext, validatedRequest) -> acceptedResult | domainError`. This is pseudocode for a boundary, **not generated application code**.

**Repository interface:** require a database transaction handle, parameterised SQL/ORM queries, and a stored accepted transition. Return public UUIDs or approved opaque references only.

**Error DTO proposal:**

```json
{
  "error": {
    "code": "STATE_CONFLICT",
    "message": "Refresh the record and try again",
    "request_id": "..."
  }
}
```

Do not expose SQL errors, provider secrets or prescription contents.

**Existing table candidates:** `platform.report_definitions`, `platform.report_runs`, `finance.settlement_runs`, `commerce.orders`, `platform.file_access_grants`.

**Per-operation request and response examples:** API contract index. No generic DTO in this document overrides module-specific validation.

## Scoped operations and financial reports — internal architecture

**Status: Proposed application design.** The database repo does not contain a NestJS HTTP implementation.

### Business behavior

Reports must be authorised by entity scope and must not export unapproved patient data.

### Components

| Component | Responsibility | Data affected | Failure outcome |
| --- | --- | --- | --- |
| `ReportingController` (proposed) | Validate DTO and request context | Public API request only | 400/401/403 without partial mutation |
| `ReportingUseCase` (proposed) | Enforce module business invariant | `platform.report_definitions`, `platform.report_runs`, `finance.settlement_runs` | Domain status, do not guess provider truth |
| `ReportingRepository` (proposed) | Scoped SQL transaction and concurrency guard | Exact migrated tables | Roll back on conflict or constraint error |
| `ReportingIntegrationAdapter` (only when needed) | Map external IO and reconcile delivery | Outbox/inbox or verified provider record | Retries outside DB lock |

### Transaction and retry sequence

1. validate staff report permission and data scope.
2. freeze approved query/filter definition.
3. execute read-only bounded report.
4. register export and short-lived access grant.
5. audit access and expire report artifact.

### Existing tables (candidate responsibilities)

- `platform.report_definitions` — candidate entity; verify the exact operation and field set in the implementation review.
- `platform.report_runs` — candidate entity; verify the exact operation and field set in the implementation review.
- `finance.settlement_runs` — candidate entity; verify the exact operation and field set in the implementation review.
- `commerce.orders` — candidate entity; verify the exact operation and field set in the implementation review.
- `platform.file_access_grants` — candidate entity; verify the exact operation and field set in the implementation review.

### Related

HLD · States · Permissions

## Scoped operations and financial reports — observability

**Proposed runtime design:** Structured logs record correlation ID, module, operation, outcome code and elapsed time. Replace identifiers with approved pseudonymous references. No raw OTP, prescription text, secrets, payment credentials, addresses or GPS coordinates in logs.

**Candidate counters:** `reporting_command_total{outcome}`, `reporting_denied_total{reason}`, and `reporting_provider_pending_total` when an external provider is involved. Names are proposed and require monitoring owner review.

**Actionable alerts:** persistent command rejection spikes, outbox backlog, stale integrations or reconciliation mismatches; thresholds are open questions, not fabricated service-level objectives.

**Monitoring design**

## Operational & Finance Reporting — permission model

**Actors:** Finance, Ops, Auditor.

**Proposed service scope:** `staff_reporting`. Roles are application concepts; existing PostgreSQL NOLOGIN capability roles form a separate lower-level authorization layer.

| Operation class | Required entitlement | Enforcement |
| --- | --- | --- |
| Read own/scoped data | Authenticated identity + object or location ownership | Controller + service + database guard where provided |
| Create / edit | Explicit module action grant, approved master and domain status | Policy decision before transaction |
| Override / refund / pharmacist action | Specialized staff permission and documented approval reason | Distinct privilege, immutable audit evidence |
| Export / sensitive view | Purpose-limited role, retention and access logging | Recheck at download/stream time |

**Core constraint:** Read from a permission-limited reporting capability or approved aggregate. Export jobs must reauthorize on download and respect location/clinical redaction; cached reports are not unrestricted data extracts. A customer cannot infer another customer's resource existence.

Do not connect app runtime through migration-owner credentials. Consult [roles and permissions](../../07-Engineering/Security.md).

## Operational & Finance Reporting — functional requirements

**Source:** the documented draft requirements.

**Status:** Draft requirements, not proof of final business acceptance. 🔴/🟡/🟢 priorities have been normalized as Must/Should/Could without changing their meaning.

| Feature | Priority in v0.1 | Statement | Dependency |
| --- | --- | --- | --- |
| `REP-01` | Must (draft) | Sales and orders, by date, store and product | Not stated |
| `REP-02` | Must (draft) | GST report for filing | Finance |
| `REP-03` | Must (draft) | Stock, low stock and near-expiry | Not stated |
| `REP-04` | Must (draft) | COD, rider collections and deliveries per rider | Not stated |
| `REP-05` | Should (draft) | Refunds, cancellations and failed deliveries | Not stated |
| `REP-06` | Should (draft) | Replenishment transfers | Not stated |
| `REP-07` | Must (draft) | Excel export for every report | Not stated |

### Interactions and acceptance basis

The user performs: Run scoped views; request and download access-controlled exports. Server-side enforcement must preserve this invariant: **Read from a permission-limited reporting capability or approved aggregate. Export jobs must reauthorize on download and respect location/clinical redaction; cached reports are not unrestricted data extracts.**

A feature becomes implementation-ready only after its inputs (especially any dependency listed above), permissions, workflow outcome, API body and database transaction are resolved. Confirm business thresholds before coding: a field existing in SQL is not proof that its value was approved.

See requirement coverage and test IDs.

## Scoped operations and financial reports — request sequence

**Proposed design**, not a diagram of deployed services. Business-specific steps appear in Internal Architecture.

```mermaid
sequenceDiagram
  participant A as Authorized report user
  participant O as Reporting
  participant D as PostgreSQL
  A->>O: Export filtered owner data
  O->>D: Check permitted fields scope and source time
  alt Gate fails or current version conflicts
    O-->>A: Deny export access or show pending run
  else Gate satisfied
    O->>D: Persist run and private output grant
    D-->>O: Committed evidence
    O-->>A: Scoped downloadable report
  end
```

## Operational & Finance Reporting — service design

**Proposed NestJS module:** `ReportingModule` with a controller, application service, authorization policy, repository and adapters. The supplied database code is a schema/validation library; no running HTTP controller was found in Archive 2.

### Candidate service methods

- `API-082: scoped_sales_report(actor_context, validated_command, expected_version) -> Result`
- `API-083: scoped_gst_report(actor_context, validated_command, expected_version) -> Result`
- `API-084: scoped_stock_report(actor_context, validated_command, expected_version) -> Result`
- `API-085: scoped_cod/rider_report(actor_context, validated_command, expected_version) -> Result`
- `API-086: generate_permissioned_export_job(actor_context, validated_command, expected_version) -> Result`

### Transaction and integration contract

For each mutation: authenticate actor, validate inputs, read affected rows with a lock/version check, verify policy, update the minimum relevant rows and immutable audit/outbox in one transaction. A remote gateway, storage or GPS call should be performed outside the locked transaction and reconciled on callback/timeout. Use PostgreSQL to reject invalid writes even if application validation is bypassed.

**Module invariant:** Read from a permission-limited reporting capability or approved aggregate. Export jobs must reauthorize on download and respect location/clinical redaction; cached reports are not unrestricted data extracts.

**Timeouts/retries:** configure per provider, use exponential backoff with caps for safe reads and idempotent messages; never blindly repeat charge/refund/cash state changes. A dead-letter queue is an optional BullMQ operating pattern because BullMQ/Redis are selected in the checklist, but exact job topology needs signoff.

**Telemetry:** actor pseudonym, request ID, action, state transition latency, retries and failure category; redact protected clinical and payment contents. See [database usage](../../04-Database/Module-Mapping.md) and Monitoring.

## Operational & Finance Reporting — state and transition policy

**Status:** State boundaries are derived from the unified order journey and existing SQL CHECK/trigger contracts; the following is a service design, not a claim that a single enum exists.

```mermaid
flowchart TD
  A["Export filtered owner data"] --> B{"Current permission at download?"}
  B -->|No| C["Deny export access or show pending run"]
  B -->|Yes| D["Persist run and private output grant"]
  D --> E["Scoped downloadable report"]
```

**Module-specific invariant:** Read from a permission-limited reporting capability or approved aggregate. Export jobs must reauthorize on download and respect location/clinical redaction; cached reports are not unrestricted data extracts.

Each transition must record the prior state, target state, reason where required, actor, accepted version and timestamp. A second command on the same state must either replay the prior idempotent result or fail with `409`. A failed external callback cannot roll an accepted state backward; reconcile with authoritative provider evidence.

When an order changes, keep clinical, payment, inventory, fulfillment and delivery statuses separate, then derive one safe user-visible projection.

This flow shows command gates, not an entity enum. Legal entity transitions and recovery are specified in [state contracts](../../07-Engineering/State-and-Recovery-Contracts.md); the table catalog supplies actual stored values.

## Operational & Finance Reporting — verification and acceptance

**Candidate test IDs** derived one-to-one from the v0.1 feature IDs. They are test-design work items, not claims that the tests have been implemented. Database-level tests reported in the source do not replace HTTP and browser tests.

| Stable test ID | Behavior | Expected result |
| --- | --- | --- |
| `TC-REP-01-OK` | Sales and orders, by date, store and product | Sales report states permitted scope, dates and included order states |
| `TC-REP-01-DENY` | Store filter requests unauthorized location | No out-of-scope totals or order detail; Reporting/Security reviews entitlement |
| `TC-REP-02-OK` | GST report for filing | GST report uses approved tax definitions and period |
| `TC-REP-02-DENY` | Underlying tax classification is unapproved | Report not described as filing-ready; unresolved data flagged; Finance/CA approves definitions and corrections |
| `TC-REP-03-OK` | Stock, low stock and near-expiry | Stock report separates usable, held and near-expiry evidence |
| `TC-REP-03-DENY` | Report is generated from stale observation | Data time/staleness visible; report not used as reservation authority; Inventory restores evidence; Reporting reruns |
| `TC-REP-04-OK` | COD, rider collections and deliveries per rider | COD/rider report distinguishes delivered, collected and deposited |
| `TC-REP-04-DENY` | Delivered parcel has unresolved COD shortage | Delivery is not counted as deposited cash; Finance resolves discrepancy; report preserves separate facts |
| `TC-REP-05-OK` | Refunds, cancellations and failed deliveries | Refund/cancellation/failure report retains current outcomes and period |
| `TC-REP-05-DENY` | Pending refund is counted as completed payout | Pending and completed separated, no false financial closure; Finance/Reporting corrects definitions and reruns |
| `TC-REP-06-OK` | Replenishment transfers | Transfer report separates dispatched, in-transit, received and short |
| `TC-REP-06-DENY` | Dispatched transfer lacks destination acknowledgment | Not reported as fully received; Warehouse/Store investigates receipt |
| `TC-REP-07-OK` | Excel export for every report | Excel export enforces permitted fields and current download access |
| `TC-REP-07-DENY` | User loses role while export runs | Download denied despite earlier job authorization; Security reviews access; Reporting expires/recreates authorized export |

### Cross-module contract tests

- Verify authenticated customer/staff/location ownership using actual restricted runtime roles.
- Verify concurrency and duplicate idempotency behavior against an isolated PostgreSQL database with authoritative migrations.
- Verify safe retry when callbacks or files arrive late or malformed.
- Verify audit and notification records are based on committed state and contain no confidential payloads.
- Verify this invariant: **Read from a permission-limited reporting capability or approved aggregate. Export jobs must reauthorize on download and respect location/clinical redaction; cached reports are not unrestricted data extracts.**

Coverage state: **Designed, not executed for the proposed application**. Link individual results to the associated test ID and requirement before go-live. Read [test strategy](../../07-Engineering/Testing.md).

## Operational & Finance Reporting — validation checkpoints

| Boundary | Required validation | Rejection outcome |
| --- | --- | --- |
| Input | Required fields, type, size, allowed format and business master codes | `400/422`; no write |
| Actor | Session validity, role, location, customer/patient/parcel ownership | `401/403/404`; audit |
| Version | Accepted order revision or row version matches, if state-changing | `409`; fetch current state |
| Domain | Read from a permission-limited reporting capability or approved aggregate. Export jobs must reauthorize on download and respect location/clinical redaction; cached reports are not unrestricted data extracts. | Explicit blocked/pending/error status |
| Database | FK, PK, UNIQUE, CHECK, trigger and RLS outcome | Safe conflict/business error; rollback |
| Integration | Authenticated provider/callback, idempotency key and settled evidence | Keep pending; reconciliation task |

**Requirements:** `REP-01`, `REP-02`, `REP-03`, `REP-04`, `REP-05`, `REP-06`, `REP-07`. Never trust browser-supplied patient, clinical decision, backend actor context, price or available quantity. Refer to Testing for negative tests.

## Operational & Finance Reporting — operational workflows

**Entry points:** Run scoped views; request and download access-controlled exports.

**User group:** Finance, Ops, Auditor. The following source-defined order journey stages identify primary ownership; supporting modules also participate without necessarily owning the stage.

This module supports shared controls across multiple stages; no single stage is exclusively owned.

### Shared processing rules

The requested action is first validated against user scope, current state and approved business master data. Read required evidence from real migrated tables; change only data this module owns; publish a safe event or notify the next module after commit.

**Alternative paths:** missing required input keeps the process actionable; a stale or duplicate request is deduplicated; another actor's update returns a version conflict; external unavailability produces a pending/blocked state. Prescriptions, inventory, payments and logistics never independently set the whole order to delivered.

**Module-specific rule:** Read from a permission-limited reporting capability or approved aggregate. Export jobs must reauthorize on download and respect location/clinical redaction; cached reports are not unrestricted data extracts.

See [state transitions](../../07-Engineering/State-and-Recovery-Contracts.md) and [unified order](../../00-Business-Guide/Pharmville-Complete-Business-Flow.md).
