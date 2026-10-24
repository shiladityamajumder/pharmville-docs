# Notifications LLD

<!-- ERD-NAV-START -->

## Database relationships

[`notification` ERD](../../04-Database/ER-Diagrams/15-notification.md) · [`platform` ERD](../../04-Database/ER-Diagrams/18-platform.md) · [FK catalog](../../04-Database/ER-Diagrams/Relationship-Catalog.md)

These diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](../../04-Database/Migrations.md) for the supplied source and deployment verification limits.

<!-- ERD-NAV-END -->

[Business flow](../../00-Business-Guide/Notifications-and-Support.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## Transactional customer/staff messaging — implementation acceptance

> [!NOTE]
> **Proposed conditions for engineering handoff; never imply QA passed.**

### Draft features

- **NOT-01 / REQ-106:** One notification service: templates, WhatsApp first, SMS fallback, email (Must (draft)).
- **NOT-02 / REQ-107:** Delivery log with retries (Must (draft)).
- **NOT-03 / REQ-108:** Rider push notifications (FCM) (Must (draft)).
- **NOT-04 / REQ-109:** Staff alerts in the admin panel (Must (draft)).
- **NOT-05 / REQ-110:** Customer browser push notifications (Could (draft)).

### Required release checks

- Authorised happy path persists exactly the intended state.
- Invalid, cross-account and cross-location requests leave authoritative rows unchanged.
- Concurrent duplicate requests do not create duplicate money, stock or order effects.
- File, prescription and patient data are not exposed to unauthorised roles.
- Recoverable provider failure exposes a pending/retryable state; never claims success.
- Audit/trace data contains public references, not credentials or sensitive document contents.

**Module test scenarios**

## Notifications & Communications — HTTP API responsibilities

All routes below are **Proposed REST v1 contracts**. The database repository does not implement them. Public UUIDs identify resources; staff scope and patient/order ownership are checked at each handler, not inferred from URL paths.

- `API-094` `POST /v1/internal/notifications/jobs` — Enqueue approved template
- `API-095` `GET /v1/admin/notifications/deliveries` — Review delivery failures
- `API-096` `POST /v1/rider/push-tokens` — Register current rider push token
- `API-097` `GET /v1/admin/notifications/alerts` — View role-scoped staff alerts

### Cross-cutting request contract

Writes require validated body, stable intent key, expected current version when appropriate, auditable actor identity and an explicit outcome. Reads use safe pagination and permission-filtered fields. `401` indicates no valid session; `403/404` denied scope; `409` conflict; `422` business validation; `503` unknown upstream outcome. Read [api conventions](../../05-APIs/README.md) before implementing the endpoint.

**Business gate:** Construct from committed events and approved templates. Delivery status is separate from order truth. Retries are bounded and deduplicated; never include protected prescriptions in WhatsApp/email payloads. For actual response fields, see the linked illustrative contract and approve a typed OpenAPI schema before implementation.

## Notifications & Communications — business logic and invariants

**Rule origin:** the documented draft requirements and database migration guards. Distinguish a **confirmed database guard** from a **proposed API orchestration** and **open numeric policy**.

### Core procedure

1. Authenticate the actor and resolve server-owned tenant/location/patient permission.
2. Re-read the relevant product, order, document, stock or ledger state from the owning tables.
3. Reject incomplete or stale input; validate the latest accepted revision and current classification where relevant.
4. Apply the module invariant: **Construct from committed events and approved templates. Delivery status is separate from order truth. Retries are bounded and deduplicated; never include protected prescriptions in WhatsApp/email payloads.**
5. In a transaction, persist the minimal authoritative rows, version and audit outcome; publish notifications after commit.
6. Return a scoped read model; expose only approved information to the caller.

### Features implemented by this rule set

`NOT-01`, `NOT-02`, `NOT-03`, `NOT-04`, `NOT-05` (see full requirement descriptions).

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

## Notifications & Communications — internal components

**Status:** Proposed NestJS modular-monolith design informed by the decided stack in the master decisions checklist. This is not code already implemented in the SQLAlchemy repository.

| Component | Responsibility | Failure boundary |
| --- | --- | --- |
| HTTP controller / DTO validator | Accept typed requests for notifications & communications, reject malformed payloads | `400/422`, no database change |
| Use-case service | Execute: Publish committed event; enqueue template; send; record receipt | Explicit domain errors, no invented outcomes |
| Policy/authorization service | Enforce user role, object ownership, business eligibility | `403/404` and audit denied attempt |
| Domain repository | Execute scoped PostgreSQL reads/writes within a transaction | Retry only on safe concurrency errors |
| Outbox / integration adapter | Publish committed changes toward other modules or third parties | Durable retry and dead-letter review if adopted |

### Boundaries

Construct from committed events and approved templates. Delivery status is separate from order truth. Retries are bounded and deduplicated; never include protected prescriptions in WhatsApp/email payloads. Public controllers must not call database workflow functions with arbitrary SQL and must not accept a caller-supplied `actor_user_id`.

Network IO belongs outside long-lived locks. Modules should depend on domain interfaces, not on each other's ORM entities. Consult Dependencies and [architecture overview](../../02-Architecture/System-HLD.md).

## Notifications & Communications — existing database usage

**Confirmed database:** 24 PostgreSQL schemas; SQL migration authority the checked-in SQL migration history. The tables below exist, but **a schema-domain association does not automatically mean this module owns every row or has write rights**. The database repository is not an HTTP service.

- `notification.device_endpoints` — columns · contracts
- `notification.in_app_notifications` — columns · contracts
- `notification.message_attachments` — columns · contracts
- `notification.message_attempts` — columns · contracts
- `notification.messages` — columns · contracts
- `notification.provider_configurations` — columns · contracts
- `notification.provider_webhooks` — columns · contracts
- `notification.suppressions` — columns · contracts
- `notification.templates` — columns · contracts
- `notification.user_channel_preferences` — columns · contracts

### Ownership, transactions and change control

Proposed owning service: `Notifications`. Main read concerns: transactional whatsapp/sms/email/push with delivery attempts. Writes must be restricted by the actual foreign keys, CHECKs, unique contracts, crosswalks, policy and trigger guards. Use one transaction per domain state transition, use an outbox for reliable cross-module publication, and make any external retry idempotent.

**Safety:** Construct from committed events and approved templates. Delivery status is separate from order truth. Retries are bounded and deduplicated; never include protected prescriptions in WhatsApp/email payloads.

Internal ID strategy: `identity.users.id` is UUID; most other tables have BIGINT internal PK with original immutable UUID alias. Never cast UUID to BIGINT or expose DB internal IDs as authorization tokens. All schema changes require new forward-only SQL migration under the source repo and a fresh PG15/PG18 parity test. Related [migration strategy](../../04-Database/Migrations.md).

## Notifications & Communications — dependencies and ownership

**Underlying schemas:** `notification`, `platform`. These schemas are shared data domains; shared reads are not automatic write rights. Candidate collaborator modules are inferred from overlapping schema use:

- Admin_CMS
- Audit
- Authentication_Access
- Prescription_Upload
- Reporting
- Rider_App

### Communication rules

Use the owning service interface for business changes rather than making uncontrolled cross-module writes. In the chosen modular-monolith style, synchronous application calls can remain in-process. BullMQ/Redis jobs serve slow notifications and integrations after commit; they should not become the source of order, payment, stock or clinical truth.

Build independent adapters for Cashfree, POS/Techsmith, MSG91 and driver APIs; failures must remain visible.

**Data-access contract:** Construct from committed events and approved templates. Delivery status is separate from order truth. Retries are bounded and deduplicated; never include protected prescriptions in WhatsApp/email payloads.. Related: [module dependencies](../../02-Architecture/Module-Dependencies.md) and [database usage](../../04-Database/Module-Mapping.md).

## Notifications & Communications — domain objects and DTO boundaries

**Proposed objects, not new database tables.** A domain object is a service-level business concept; a DTO is a validated data transfer object (API input/output). Do not confuse them with the Python SQLAlchemy models used for schema verification.

| Proposed object | Source of truth / evidence | Rules |
| --- | --- | --- |
| `NotificationsCommand` | Authenticated HTTP request and expected version | Includes actor context, idempotency key and validated business input |
| `NotificationsAggregate` | Domain rows listed in Database Usage | Represents the current authoritative business facts |
| `NotificationsPolicy` | Approved master/role records and product rules | Construct from committed events and approved templates. Delivery status is separate from order truth. Retries are bounded and deduplicated; never include protected prescriptions in WhatsApp/email payloads. |
| `NotificationsReadModel` | Role-filtered current state | Removes protected fields and translates internal statuses |
| `NotificationsEvent` | Committed state transition and audit ID | Events carry references and versions, not clinical documents |

**Existing representative tables:** `notification.device_endpoints`, `notification.in_app_notifications`, `notification.message_attachments`, `notification.message_attempts`, `notification.messages`, `notification.provider_configurations`, `notification.provider_webhooks`, `notification.suppressions`.

Internal BIGINT primary keys are never used as authorization credentials, and original UUID public references must remain stable. Any DTO field not directly supported by a confirmed column must be labelled proposed until the API team approves the mapping. See [database usage](../../04-Database/Module-Mapping.md).

## Notifications & Communications — failure handling

**Primary rule:** Construct from committed events and approved templates. Delivery status is separate from order truth. Retries are bounded and deduplicated; never include protected prescriptions in WhatsApp/email payloads.

- **Missing or invalid input:** respond with a field-specific problem code; do not leak sensitive data and do not write partial state.
- **Unauthorized object or location:** return `403` or privacy-safe `404`; record the attempted privileged action.
- **Duplicate submission:** return the persisted result when key + payload match; reject key reuse with different payload.
- **Stale/concurrent change:** database version/FK/CHECK guard must resolve a single winner; caller reloads latest projection.
- **Partial external failure:** leave the aggregate pending, never mark payment/stock/delivery success by assumption. Retry verified idempotent adapter calls; otherwise reconcile manually.
- **Safety or compliance policy unknown:** fail closed. Route staff to an exception queue and customer to a non-misleading status.

Use structured problem codes, request ID, retryability category and operator runbook reference. Sensitive Rx, financial tokens, OTPs and location traces must not be placed into logs. See [error responses](../../05-APIs/README.md#standard-problem-response-behavior) and [incident triage](../../07-Engineering/Release-and-Incident-Handling.md).

## Transactional customer/staff messaging — proposed interfaces and DTOs

**Business context:** Notification delivery is best effort after commit; it must never determine success of a stock or money action.

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

**Existing table candidates:** `notification.messages`, `notification.message_attempts`, `notification.templates`, `notification.user_channel_preferences`, `platform.outbox_events`.

**Per-operation request and response examples:** API contract index. No generic DTO in this document overrides module-specific validation.

## Transactional customer/staff messaging — internal architecture

**Status: Proposed application design.** The database repo does not contain a NestJS HTTP implementation.

### Business behavior

Notification delivery is best effort after commit; it must never determine success of a stock or money action.

### Components

| Component | Responsibility | Data affected | Failure outcome |
| --- | --- | --- | --- |
| `NotificationsController` (proposed) | Validate DTO and request context | Public API request only | 400/401/403 without partial mutation |
| `NotificationsUseCase` (proposed) | Enforce module business invariant | `notification.messages`, `notification.message_attempts`, `notification.templates` | Domain status, do not guess provider truth |
| `NotificationsRepository` (proposed) | Scoped SQL transaction and concurrency guard | Exact migrated tables | Roll back on conflict or constraint error |
| `NotificationsIntegrationAdapter` (only when needed) | Map external IO and reconcile delivery | Outbox/inbox or verified provider record | Retries outside DB lock |

### Transaction and retry sequence

1. read committed outbox item.
2. resolve channel consent and template version.
3. send through approved provider.
4. record attempt and provider correlation.
5. retry with deduplication without affecting originating business action.

### Existing tables (candidate responsibilities)

- `notification.messages` — candidate entity; verify the exact operation and field set in the implementation review.
- `notification.message_attempts` — candidate entity; verify the exact operation and field set in the implementation review.
- `notification.templates` — candidate entity; verify the exact operation and field set in the implementation review.
- `notification.user_channel_preferences` — candidate entity; verify the exact operation and field set in the implementation review.
- `platform.outbox_events` — candidate entity; verify the exact operation and field set in the implementation review.

### Related

HLD · States · Permissions

## Transactional customer/staff messaging — observability

**Proposed runtime design:** Structured logs record correlation ID, module, operation, outcome code and elapsed time. Replace identifiers with approved pseudonymous references. No raw OTP, prescription text, secrets, payment credentials, addresses or GPS coordinates in logs.

**Candidate counters:** `notifications_command_total{outcome}`, `notifications_denied_total{reason}`, and `notifications_provider_pending_total` when an external provider is involved. Names are proposed and require monitoring owner review.

**Actionable alerts:** persistent command rejection spikes, outbox backlog, stale integrations or reconciliation mismatches; thresholds are open questions, not fabricated service-level objectives.

**Monitoring design**

## Notifications & Communications — permission model

**Actors:** Customers, Staff, Rider.

**Proposed service scope:** `system`. Roles are application concepts; existing PostgreSQL NOLOGIN capability roles form a separate lower-level authorization layer.

| Operation class | Required entitlement | Enforcement |
| --- | --- | --- |
| Read own/scoped data | Authenticated identity + object or location ownership | Controller + service + database guard where provided |
| Create / edit | Explicit module action grant, approved master and domain status | Policy decision before transaction |
| Override / refund / pharmacist action | Specialized staff permission and documented approval reason | Distinct privilege, immutable audit evidence |
| Export / sensitive view | Purpose-limited role, retention and access logging | Recheck at download/stream time |

**Core constraint:** Construct from committed events and approved templates. Delivery status is separate from order truth. Retries are bounded and deduplicated; never include protected prescriptions in WhatsApp/email payloads. A customer cannot infer another customer's resource existence.

Do not connect app runtime through migration-owner credentials. Consult [roles and permissions](../../07-Engineering/Security.md).

## Notifications & Communications — functional requirements

**Source:** the documented draft requirements.

**Status:** Draft requirements, not proof of final business acceptance. 🔴/🟡/🟢 priorities have been normalized as Must/Should/Could without changing their meaning.

| Feature | Priority in v0.1 | Statement | Dependency |
| --- | --- | --- | --- |
| `NOT-01` | Must (draft) | One notification service: templates, WhatsApp first, SMS fallback, email | DLT, Meta approval |
| `NOT-02` | Must (draft) | Delivery log with retries | Not stated |
| `NOT-03` | Must (draft) | Rider push notifications (FCM) | Not stated |
| `NOT-04` | Must (draft) | Staff alerts in the admin panel | Not stated |
| `NOT-05` | Could (draft) | Customer browser push notifications | Not stated |

### Interactions and acceptance basis

The user performs: Publish committed event; enqueue template; send; record receipt. Server-side enforcement must preserve this invariant: **Construct from committed events and approved templates. Delivery status is separate from order truth. Retries are bounded and deduplicated; never include protected prescriptions in WhatsApp/email payloads.**

A feature becomes implementation-ready only after its inputs (especially any dependency listed above), permissions, workflow outcome, API body and database transaction are resolved. Confirm business thresholds before coding: a field existing in SQL is not proof that its value was approved.

See requirement coverage and test IDs.

## Transactional customer/staff messaging — request sequence

**Proposed design**, not a diagram of deployed services. Business-specific steps appear in Internal Architecture.

```mermaid
sequenceDiagram
  participant A as Committed event worker
  participant O as Notifications
  participant D as PostgreSQL
  A->>O: Deliver permitted event template
  O->>D: Read event identity recipient preference and prior attempts
  alt Gate fails or current version conflicts
    O-->>A: Suppress or leave failed attempt for reviewed retry
  else Gate satisfied
    O->>D: Persist attempt and approved channel outcome
    D-->>O: Committed evidence
    O-->>A: Recorded delivery attempt
  end
```

## Notifications & Communications — service design

**Proposed NestJS module:** `NotificationsModule` with a controller, application service, authorization policy, repository and adapters. The supplied database code is a schema/validation library; no running HTTP controller was found in Archive 2.

### Candidate service methods

- `API-094: enqueue_approved_template(actor_context, validated_command, expected_version) -> Result`
- `API-095: review_delivery_failures(actor_context, validated_command, expected_version) -> Result`
- `API-096: register_current_rider_push_token(actor_context, validated_command, expected_version) -> Result`
- `API-097: view_role-scoped_staff_alerts(actor_context, validated_command, expected_version) -> Result`

### Transaction and integration contract

For each mutation: authenticate actor, validate inputs, read affected rows with a lock/version check, verify policy, update the minimum relevant rows and immutable audit/outbox in one transaction. A remote gateway, storage or GPS call should be performed outside the locked transaction and reconciled on callback/timeout. Use PostgreSQL to reject invalid writes even if application validation is bypassed.

**Module invariant:** Construct from committed events and approved templates. Delivery status is separate from order truth. Retries are bounded and deduplicated; never include protected prescriptions in WhatsApp/email payloads.

**Timeouts/retries:** configure per provider, use exponential backoff with caps for safe reads and idempotent messages; never blindly repeat charge/refund/cash state changes. A dead-letter queue is an optional BullMQ operating pattern because BullMQ/Redis are selected in the checklist, but exact job topology needs signoff.

**Telemetry:** actor pseudonym, request ID, action, state transition latency, retries and failure category; redact protected clinical and payment contents. See [database usage](../../04-Database/Module-Mapping.md) and Monitoring.

## Notifications & Communications — state and transition policy

**Status:** State boundaries are derived from the unified order journey and existing SQL CHECK/trigger contracts; the following is a service design, not a claim that a single enum exists.

```mermaid
flowchart TD
  A["Deliver permitted event template"] --> B{"Allowed recipient and channel?"}
  B -->|No| C["Suppress or leave failed attempt for reviewed retry"]
  B -->|Yes| D["Persist attempt and approved channel outcome"]
  D --> E["Recorded delivery attempt"]
```

**Module-specific invariant:** Construct from committed events and approved templates. Delivery status is separate from order truth. Retries are bounded and deduplicated; never include protected prescriptions in WhatsApp/email payloads.

Each transition must record the prior state, target state, reason where required, actor, accepted version and timestamp. A second command on the same state must either replay the prior idempotent result or fail with `409`. A failed external callback cannot roll an accepted state backward; reconcile with authoritative provider evidence.

When an order changes, keep clinical, payment, inventory, fulfillment and delivery statuses separate, then derive one safe user-visible projection.

This flow shows command gates, not an entity enum. Legal entity transitions and recovery are specified in [state contracts](../../07-Engineering/State-and-Recovery-Contracts.md); the table catalog supplies actual stored values.

## Notifications & Communications — verification and acceptance

**Candidate test IDs** derived one-to-one from the v0.1 feature IDs. They are test-design work items, not claims that the tests have been implemented. Database-level tests reported in the source do not replace HTTP and browser tests.

| Stable test ID | Behavior | Expected result |
| --- | --- | --- |
| `TC-NOT-01-OK` | One notification service: templates, WhatsApp first, SMS fallback, email | Approved channel/template follows preferences and fallback rule |
| `TC-NOT-01-DENY` | Primary channel times out after uncertain delivery | One business event tracked; no uncontrolled fallback fan-out; Notification owner reconciles attempt under provider policy |
| `TC-NOT-02-OK` | Delivery log with retries | Attempts and retries retain provider outcome and event identity |
| `TC-NOT-02-DENY` | Retry worker restarts after send acknowledgment is lost | No business action replay; uncertain message remains traceable; Notification owner checks provider-supported deduplication |
| `TC-NOT-03-OK` | Rider push notifications (FCM) | Push task goes to authorized current rider endpoint |
| `TC-NOT-03-DENY` | Device token belongs to a previous rider session | No other rider’s task details sent; Rider re-registers permitted endpoint; Security checks ownership |
| `TC-NOT-04-OK` | Staff alerts in the admin panel | Staff panel alert is visible only to permitted role/location |
| `TC-NOT-04-DENY` | Staff changes alert location ID | No cross-location or prescription detail leak; Manager reviews role; Notifications filters scope |
| `TC-NOT-05-OK` | Customer browser push notifications | Browser push requires approved opt-in and endpoint ownership |
| `TC-NOT-05-DENY` | Customer refuses browser permission | No forced subscription; order status remains available in app; Product approves optional push scope; customer can use ordinary status |

### Cross-module contract tests

- Verify authenticated customer/staff/location ownership using actual restricted runtime roles.
- Verify concurrency and duplicate idempotency behavior against an isolated PostgreSQL database with authoritative migrations.
- Verify safe retry when callbacks or files arrive late or malformed.
- Verify audit and notification records are based on committed state and contain no confidential payloads.
- Verify this invariant: **Construct from committed events and approved templates. Delivery status is separate from order truth. Retries are bounded and deduplicated; never include protected prescriptions in WhatsApp/email payloads.**

Coverage state: **Designed, not executed for the proposed application**. Link individual results to the associated test ID and requirement before go-live. Read [test strategy](../../07-Engineering/Testing.md).

## Notifications & Communications — validation checkpoints

| Boundary | Required validation | Rejection outcome |
| --- | --- | --- |
| Input | Required fields, type, size, allowed format and business master codes | `400/422`; no write |
| Actor | Session validity, role, location, customer/patient/parcel ownership | `401/403/404`; audit |
| Version | Accepted order revision or row version matches, if state-changing | `409`; fetch current state |
| Domain | Construct from committed events and approved templates. Delivery status is separate from order truth. Retries are bounded and deduplicated; never include protected prescriptions in WhatsApp/email payloads. | Explicit blocked/pending/error status |
| Database | FK, PK, UNIQUE, CHECK, trigger and RLS outcome | Safe conflict/business error; rollback |
| Integration | Authenticated provider/callback, idempotency key and settled evidence | Keep pending; reconciliation task |

**Requirements:** `NOT-01`, `NOT-02`, `NOT-03`, `NOT-04`, `NOT-05`. Never trust browser-supplied patient, clinical decision, backend actor context, price or available quantity. Refer to Testing for negative tests.

## Notifications & Communications — operational workflows

**Entry points:** Publish committed event; enqueue template; send; record receipt.

**User group:** Customers, Staff, Rider. The following source-defined order journey stages identify primary ownership; supporting modules also participate without necessarily owning the stage.

This module supports shared controls across multiple stages; no single stage is exclusively owned.

### Shared processing rules

The requested action is first validated against user scope, current state and approved business master data. Read required evidence from real migrated tables; change only data this module owns; publish a safe event or notify the next module after commit.

**Alternative paths:** missing required input keeps the process actionable; a stale or duplicate request is deduplicated; another actor's update returns a version conflict; external unavailability produces a pending/blocked state. Prescriptions, inventory, payments and logistics never independently set the whole order to delivered.

**Module-specific rule:** Construct from committed events and approved templates. Delivery status is separate from order truth. Retries are bounded and deduplicated; never include protected prescriptions in WhatsApp/email payloads.

See [state transitions](../../07-Engineering/State-and-Recovery-Contracts.md) and [unified order](../../00-Business-Guide/Pharmville-Complete-Business-Flow.md).
