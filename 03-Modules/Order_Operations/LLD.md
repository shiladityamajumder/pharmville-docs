# Order Operations LLD

## Acceptance Criteria

## Order orchestration and routing — implementation acceptance

**Proposed conditions for engineering handoff; never imply QA passed.**

## Draft features
- **OMS-01 / REQ-045:** Order list with filters (status, location, date, payment, Rx) and search by order number or phone (Must (draft)).
- **OMS-02 / REQ-046:** Order detail: items, batches, prescription, payment, delivery, full history (Must (draft)).
- **OMS-03 / REQ-047:** Automatic routing to the nearest open store with every item; warehouse as fallback (Must (draft)).
- **OMS-04 / REQ-048:** Reassign an order to another location, with a reason (Must (draft)).
- **OMS-05 / REQ-049:** Cancel, partly fulfil, raise return, add internal note (Must (draft)).
- **OMS-06 / REQ-050:** Attention queue: payment pending, stuck orders, failed deliveries (Must (draft)).
- **OMS-07 / REQ-051:** Assisted order entry for phone orders (Could (draft)).

## Required release checks
- Authorised happy path persists exactly the intended state.
- Invalid, cross-account and cross-location requests leave authoritative rows unchanged.
- Concurrent duplicate requests do not create duplicate money, stock or order effects.
- File, prescription and patient data are not exposed to unauthorised roles.
- Recoverable provider failure exposes a pending/retryable state; never claims success.
- Audit/trace data contains public references, not credentials or sensitive document contents.

Module test scenarios

## API Design

## Order Management & Routing — HTTP API responsibilities

All routes below are **Proposed REST v1 contracts**. The database repository does not implement them. Public UUIDs identify resources; staff scope and patient/order ownership are checked at each handler, not inferred from URL paths.

- API-039 GET /v1/admin/orders — Filter scoped order queue
- API-040 GET /v1/admin/orders/{order_id} — Review order timeline
- API-041 POST /v1/admin/orders/{order_id}/allocate — Allocate one qualified site
- API-042 POST /v1/admin/orders/{order_id}/reassign — Reassign with reason
- API-043 POST /v1/admin/orders/{order_id}/revisions — Propose order revision

## Cross-cutting request contract

Writes require validated body, stable intent key, expected current version when appropriate, auditable actor identity and an explicit outcome. Reads use safe pagination and permission-filtered fields. `401` indicates no valid session; `403/404` denied scope; `409` conflict; `422` business validation; `503` unknown upstream outcome. Read API_Conventions before implementing the endpoint.

**Business gate:** Route each order to only one licensed, permitted, open and adequately stocked location, or hold for intervention. A manual reassign must serialize with inventory holds and preserve audit reasons. For actual response fields, see the linked illustrative contract and approve a typed OpenAPI schema before implementation.

## Business Logic

## Order Management & Routing — business logic and invariants

**Rule origin:** the documented draft requirements, the documented draft requirements and database migration guards. Distinguish a **confirmed database guard** from a **proposed API orchestration** and **open numeric policy**.

## Core procedure

1. Authenticate the actor and resolve server-owned tenant/location/patient permission.
2. Re-read the relevant product, order, document, stock or ledger state from the owning tables.
3. Reject incomplete or stale input; validate the latest accepted revision and current classification where relevant.
4. Apply the module invariant: **Route each order to only one licensed, permitted, open and adequately stocked location, or hold for intervention. A manual reassign must serialize with inventory holds and preserve audit reasons.**
5. In a transaction, persist the minimal authoritative rows, version and audit outcome; publish notifications after commit.
6. Return a scoped read model; expose only approved information to the caller.

## Features implemented by this rule set

`OMS-01`, `OMS-02`, `OMS-03`, `OMS-04`, `OMS-05`, `OMS-06`, `OMS-07` (see full requirement descriptions).

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

## Components

## Order Management & Routing — internal components

**Status:** Proposed NestJS modular-monolith design informed by the decided stack in the master decisions checklist. This is not code already implemented in the SQLAlchemy repository.

| Component | Responsibility | Failure boundary |
| --- | --- | --- |
| HTTP controller / DTO validator | Accept typed requests for order management & routing, reject malformed payloads | `400/422`, no database change |
| Use-case service | Execute: Route accepted order; reassign with reason; resolve exceptions | Explicit domain errors, no invented outcomes |
| Policy/authorization service | Enforce user role, object ownership, business eligibility | `403/404` and audit denied attempt |
| Domain repository | Execute scoped PostgreSQL reads/writes within a transaction | Retry only on safe concurrency errors |
| Outbox / integration adapter | Publish committed changes toward other modules or third parties | Durable retry and dead-letter review if adopted |

### Boundaries

Route each order to only one licensed, permitted, open and adequately stocked location, or hold for intervention. A manual reassign must serialize with inventory holds and preserve audit reasons. Public controllers must not call database workflow functions with arbitrary SQL and must not accept a caller-supplied `actor_user_id`. Network IO belongs outside long-lived locks. Modules should depend on domain interfaces, not on each other's ORM entities. Consult Dependencies and Architecture_Overview.

## Database Usage

## Order Management & Routing — existing database usage

**Confirmed database:** 24 PostgreSQL schemas; SQL migration authority the checked-in SQL migration history. The tables below exist, but **a schema-domain association does not automatically mean this module owns every row or has write rights**. The database repository is not an HTTP service.

- `commerce.order_allocations` — columns · contracts
- `commerce.orders` — columns · contracts
- `fulfillment.fulfillment_events` — columns · contracts
- `fulfillment.fulfillment_order_items` — columns · contracts
- `fulfillment.fulfillment_orders` — columns · contracts
- `fulfillment.pack_tasks` — columns · contracts
- `fulfillment.package_items` — columns · contracts
- `fulfillment.packages` — columns · contracts
- `fulfillment.pick_task_items` — columns · contracts
- `fulfillment.pick_tasks` — columns · contracts
- `fulfillment.picking_wave_orders` — columns · contracts
- `fulfillment.picking_waves` — columns · contracts

## Ownership, transactions and change control

Proposed owning service: `Order_Operations`. Main read concerns: review queues, assign one eligible site, handle stuck and amended orders. Writes must be restricted by the actual foreign keys, CHECKs, unique contracts, crosswalks, policy and trigger guards. Use one transaction per domain state transition, use an outbox for reliable cross-module publication, and make any external retry idempotent.

**Safety:** Route each order to only one licensed, permitted, open and adequately stocked location, or hold for intervention. A manual reassign must serialize with inventory holds and preserve audit reasons.

Internal ID strategy: `identity.users.id` is UUID; most other tables have BIGINT internal PK with original immutable UUID alias. Never cast UUID to BIGINT or expose DB internal IDs as authorization tokens. All schema changes require new forward-only SQL migration under the source repo and a fresh PG15/PG18 parity test. Related Migration_Strategy.

## Dependencies

## Order Management & Routing — dependencies and ownership

**Underlying schemas:** `commerce`, `fulfillment`, `warehouse`, `organization`. These schemas are shared data domains; shared reads are not automatic write rights. Candidate collaborator modules are inferred from overlapping schema use:

- Admin_CMS
- Authentication_Access
- Cart_Checkout
- Customer_Orders
- Delivery_Operations
- Finance_Payments
- Inventory
- Pharmacist_Review

## Communication rules

Use the owning service interface for business changes rather than making uncontrolled cross-module writes. In the chosen modular-monolith style, synchronous application calls can remain in-process. BullMQ/Redis jobs serve slow notifications and integrations after commit; they should not become the source of order, payment, stock or clinical truth. Build independent adapters for Cashfree, POS/Techsmith, MSG91 and driver APIs; failures must remain visible.

**Data-access contract:** Route each order to only one licensed, permitted, open and adequately stocked location, or hold for intervention. A manual reassign must serialize with inventory holds and preserve audit reasons.. Related: Module_Dependencies and Database_Usage.

## Domain Models

## Order Management & Routing — domain objects and DTO boundaries

**Proposed objects, not new database tables.** A domain object is a service-level business concept; a DTO is a validated data transfer object (API input/output). Do not confuse them with the Python SQLAlchemy models used for schema verification.

| Proposed object | Source of truth / evidence | Rules |
| --- | --- | --- |
| `Order_OperationsCommand` | Authenticated HTTP request and expected version | Includes actor context, idempotency key and validated business input |
| `Order_OperationsAggregate` | Domain rows listed in Database Usage | Represents the current authoritative business facts |
| `Order_OperationsPolicy` | Approved master/role records and product rules | Route each order to only one licensed, permitted, open and adequately stocked location, or hold for intervention. A manual reassign must serialize with inventory holds and preserve audit reasons. |
| `Order_OperationsReadModel` | Role-filtered current state | Removes protected fields and translates internal statuses |
| `Order_OperationsEvent` | Committed state transition and audit ID | Events carry references and versions, not clinical documents |

**Existing representative tables:** `commerce.order_allocations`, `commerce.orders`, `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`, `fulfillment.fulfillment_orders`, `fulfillment.pack_tasks`, `fulfillment.package_items`, `fulfillment.packages`. Internal BIGINT primary keys are never used as authorization credentials, and original UUID public references must remain stable. Any DTO field not directly supported by a confirmed column must be labelled proposed until the API team approves the mapping. See Database_Usage.

## Error Handling

## Order Management & Routing — failure handling

**Primary rule:** Route each order to only one licensed, permitted, open and adequately stocked location, or hold for intervention. A manual reassign must serialize with inventory holds and preserve audit reasons.

- **Missing or invalid input:** respond with a field-specific problem code; do not leak sensitive data and do not write partial state.
- **Unauthorized object or location:** return `403` or privacy-safe `404`; record the attempted privileged action.
- **Duplicate submission:** return the persisted result when key + payload match; reject key reuse with different payload.
- **Stale/concurrent change:** database version/FK/CHECK guard must resolve a single winner; caller reloads latest projection.
- **Partial external failure:** leave the aggregate pending, never mark payment/stock/delivery success by assumption. Retry verified idempotent adapter calls; otherwise reconcile manually.
- **Safety or compliance policy unknown:** fail closed. Route staff to an exception queue and customer to a non-misleading status.

Use structured problem codes, request ID, retryability category and operator runbook reference. Sensitive Rx, financial tokens, OTPs and location traces must not be placed into logs. See Error_Responses and Incident_Triage.

## Interfaces And DTOs

## Order orchestration and routing — proposed interfaces and DTOs

**Business context:** One order must have one accepted revision and an auditable licensed location/fulfillment decision.

**Controller contract:** validate identity and scope before accepting a command; never expose internal BIGINT IDs. Typed inputs should carry allowed public identifiers, operation-specific fields, expected record version and a unique idempotency key on mutations.

**Use-case interface:** `execute(trustedContext, validatedRequest) -> acceptedResult | domainError`. This is pseudocode for a boundary, **not generated application code**.

**Repository interface:** require a database transaction handle, parameterised SQL/ORM queries, and a stored accepted transition. Return public UUIDs or approved opaque references only.

**Error DTO proposal:** `{"error":{"code":"STATE_CONFLICT","message":"Refresh the record and try again","request_id":"..."}}`. Do not expose SQL errors, provider secrets or prescription contents.

**Existing table candidates:** `commerce.orders`, `commerce.order_revisions`, `commerce.order_allocations`, `fulfillment.fulfillment_orders`, `organization.licenses`.

**Per-operation request and response examples:** API contract index. No generic DTO in this document overrides module-specific validation.

## Internal Architecture

## Order orchestration and routing — internal architecture

**Status: Proposed application design.** The database repo does not contain a NestJS HTTP implementation.

## Business behavior
One order must have one accepted revision and an auditable licensed location/fulfillment decision.

## Components
| Component | Responsibility | Data affected | Failure outcome |
| --- | --- | --- | --- |
| `Order_OperationsController` (proposed) | Validate DTO and request context | Public API request only | 400/401/403 without partial mutation |
| `Order_OperationsUseCase` (proposed) | Enforce module business invariant | commerce.orders, commerce.order_revisions, commerce.order_allocations | Domain status, do not guess provider truth |
| `Order_OperationsRepository` (proposed) | Scoped SQL transaction and concurrency guard | Exact migrated tables | Roll back on conflict or constraint error |
| `Order_OperationsIntegrationAdapter` (only when needed) | Map external IO and reconcile delivery | Outbox/inbox or verified provider record | Retries outside DB lock |

## Transaction and retry sequence

1. load accepted checkout/order revision.
2. evaluate license and eligible fulfillment location.
3. validate stock hold and split policy.
4. persist order allocation and fulfillment intent.
5. enqueue post-commit work and reconciliation.

## Existing tables (candidate responsibilities)
- commerce.orders — candidate entity; verify the exact operation and field set in the implementation review.
- commerce.order_revisions — candidate entity; verify the exact operation and field set in the implementation review.
- commerce.order_allocations — candidate entity; verify the exact operation and field set in the implementation review.
- fulfillment.fulfillment_orders — candidate entity; verify the exact operation and field set in the implementation review.
- organization.licenses — candidate entity; verify the exact operation and field set in the implementation review.

## Related
HLD · States · Permissions

## Observability

## Order orchestration and routing — observability

**Proposed runtime design:** Structured logs record correlation ID, module, operation, outcome code and elapsed time. Replace identifiers with approved pseudonymous references. No raw OTP, prescription text, secrets, payment credentials, addresses or GPS coordinates in logs.

**Candidate counters:** `order_operations_command_total{outcome}`, `order_operations_denied_total{reason}`, and `order_operations_provider_pending_total` when an external provider is involved. Names are proposed and require monitoring owner review.

**Actionable alerts:** persistent command rejection spikes, outbox backlog, stale integrations or reconciliation mismatches; thresholds are open questions, not fabricated service-level objectives.

Monitoring design

## Permissions

## Order Management & Routing — permission model

**Actors:** Ops Manager, Store Manager. **Proposed service scope:** `staff_ops`. Roles are application concepts; existing PostgreSQL NOLOGIN capability roles form a separate lower-level authorization layer.

| Operation class | Required entitlement | Enforcement |
| --- | --- | --- |
| Read own/scoped data | Authenticated identity + object or location ownership | Controller + service + database guard where provided |
| Create / edit | Explicit module action grant, approved master and domain status | Policy decision before transaction |
| Override / refund / pharmacist action | Specialized staff permission and documented approval reason | Distinct privilege, immutable audit evidence |
| Export / sensitive view | Purpose-limited role, retention and access logging | Recheck at download/stream time |

**Core constraint:** Route each order to only one licensed, permitted, open and adequately stocked location, or hold for intervention. A manual reassign must serialize with inventory holds and preserve audit reasons. A customer cannot infer another customer's resource existence. Do not connect app runtime through migration-owner credentials. Consult Roles_and_Permissions.

## Requirements

## Order Management & Routing — functional requirements

**Source:** the documented draft requirements. **Status:** Draft requirements, not proof of final business acceptance. 🔴/🟡/🟢 priorities have been normalized as Must/Should/Could without changing their meaning.

| Feature | Priority in v0.1 | Statement | Dependency |
| --- | --- | --- | --- |
| `OMS-01` | Must (draft) | Order list with filters (status, location, date, payment, Rx) and search by order number or phone | Not stated |
| `OMS-02` | Must (draft) | Order detail: items, batches, prescription, payment, delivery, full history | Not stated |
| `OMS-03` | Must (draft) | Automatic routing to the nearest open store with every item; warehouse as fallback | Q20, Q22 |
| `OMS-04` | Must (draft) | Reassign an order to another location, with a reason | Not stated |
| `OMS-05` | Must (draft) | Cancel, partly fulfil, raise return, add internal note | Q11 |
| `OMS-06` | Must (draft) | Attention queue: payment pending, stuck orders, failed deliveries | Not stated |
| `OMS-07` | Could (draft) | Assisted order entry for phone orders | Q28 — becomes 🔴 if phone orders continue |

## Interactions and acceptance basis

The user performs: Route accepted order; reassign with reason; resolve exceptions. Server-side enforcement must preserve this invariant: **Route each order to only one licensed, permitted, open and adequately stocked location, or hold for intervention. A manual reassign must serialize with inventory holds and preserve audit reasons.**

A feature becomes implementation-ready only after its inputs (especially any dependency listed above), permissions, workflow outcome, API body and database transaction are resolved. Confirm business thresholds before coding: a field existing in SQL is not proof that its value was approved.

See requirement coverage and test IDs.

## Sequence Diagrams

## Order orchestration and routing — request sequence

**Proposed design**, not a diagram of deployed services. Business-specific steps appear in Internal Architecture.

```mermaid
sequenceDiagram
  participant U as Caller
  participant C as Controller
  participant S as UseCase
  participant D as PostgreSQL
  participant E as Provider or outbox
  U->>C: Proposed command (actor authenticated)
  C->>S: Typed DTO + trusted scope
  S->>D: Read & lock current state
  D-->>S: Row version and constraints
  alt Invalid policy, permissions, stale version
    S-->>C: Domain conflict/error; no commit
    C-->>U: 4xx with safe recovery action
  else Valid intent
    S->>D: Commit versioned state + audit/outbox
    D-->>S: Durable success
    S-->>C: Public-id response
    C-->>U: 2xx with correlation ID
    S-->>E: Async post-commit work where required
  end
```

## Service Design

## Order Management & Routing — service design

**Proposed NestJS module:** `Order_OperationsModule` with a controller, application service, authorization policy, repository and adapters. The supplied database code is a schema/validation library; no running HTTP controller was found in Archive 2.

## Candidate service methods

- `API-039: filter_scoped_order_queue(actor_context, validated_command, expected_version) -> Result`
- `API-040: review_order_timeline(actor_context, validated_command, expected_version) -> Result`
- `API-041: allocate_one_qualified_site(actor_context, validated_command, expected_version) -> Result`
- `API-042: reassign_with_reason(actor_context, validated_command, expected_version) -> Result`
- `API-043: propose_order_revision(actor_context, validated_command, expected_version) -> Result`

## Transaction and integration contract

For each mutation: authenticate actor, validate inputs, read affected rows with a lock/version check, verify policy, update the minimum relevant rows and immutable audit/outbox in one transaction. A remote gateway, storage or GPS call should be performed outside the locked transaction and reconciled on callback/timeout. Use PostgreSQL to reject invalid writes even if application validation is bypassed.

**Module invariant:** Route each order to only one licensed, permitted, open and adequately stocked location, or hold for intervention. A manual reassign must serialize with inventory holds and preserve audit reasons.

**Timeouts/retries:** configure per provider, use exponential backoff with caps for safe reads and idempotent messages; never blindly repeat charge/refund/cash state changes. A dead-letter queue is an optional BullMQ operating pattern because BullMQ/Redis are selected in the checklist, but exact job topology needs signoff. **Telemetry:** actor pseudonym, request ID, action, state transition latency, retries and failure category; redact protected clinical and payment contents. See Database_Usage and Monitoring.

## State Transitions

## Order Management & Routing — state and transition policy

**Status:** State boundaries are derived from the unified order journey and existing SQL CHECK/trigger contracts; the following is a service design, not a claim that a single enum exists.

```mermaid
flowchart TD
 A[Request received] --> B{Actor and current state valid?}
 B -->|No| C[Denied or actionable correction]
 B -->|Yes| D{Domain gate satisfied?}
 D -->|No| E[Pending, held, or rejected with reason]
 D -->|Yes| F[Persist transition, revision and audit]
 F --> G[Publish committed event]
```

**Module-specific invariant:** Route each order to only one licensed, permitted, open and adequately stocked location, or hold for intervention. A manual reassign must serialize with inventory holds and preserve audit reasons.

Each transition must record the prior state, target state, reason where required, actor, accepted version and timestamp. A second command on the same state must either replay the prior idempotent result or fail with `409`. A failed external callback cannot roll an accepted state backward; reconcile with authoritative provider evidence. When an order changes, keep clinical, payment, inventory, fulfillment and delivery statuses separate, then derive one safe user-visible projection.

Read actual state constraints in Database_Usage and stage documents in Workflows.

## Testing

## Order Management & Routing — verification and acceptance

**Candidate test IDs** derived one-to-one from the v0.1 feature IDs. They are test-design work items, not claims that the tests have been implemented. Database-level tests reported in the source do not replace HTTP and browser tests.

| Stable test ID | Behavior | Expected result |
| --- | --- | --- |
| `TC-OMS-01-OK` | Order list with filters (status, location, date, payment, Rx) and search by order number or phone | Authorized valid input yields committed business effect and correct customer/staff projection |
| `TC-OMS-01-DENY` | Invalid actor, stale state, duplicate or unavailable dependency | No unauthorized/duplicate effect; safe error or pending state |
| `TC-OMS-02-OK` | Order detail: items, batches, prescription, payment, delivery, full history | Authorized valid input yields committed business effect and correct customer/staff projection |
| `TC-OMS-02-DENY` | Invalid actor, stale state, duplicate or unavailable dependency | No unauthorized/duplicate effect; safe error or pending state |
| `TC-OMS-03-OK` | Automatic routing to the nearest open store with every item; warehouse as fallback | Authorized valid input yields committed business effect and correct customer/staff projection |
| `TC-OMS-03-DENY` | Invalid actor, stale state, duplicate or unavailable dependency | No unauthorized/duplicate effect; safe error or pending state |
| `TC-OMS-04-OK` | Reassign an order to another location, with a reason | Authorized valid input yields committed business effect and correct customer/staff projection |
| `TC-OMS-04-DENY` | Invalid actor, stale state, duplicate or unavailable dependency | No unauthorized/duplicate effect; safe error or pending state |
| `TC-OMS-05-OK` | Cancel, partly fulfil, raise return, add internal note | Authorized valid input yields committed business effect and correct customer/staff projection |
| `TC-OMS-05-DENY` | Invalid actor, stale state, duplicate or unavailable dependency | No unauthorized/duplicate effect; safe error or pending state |
| `TC-OMS-06-OK` | Attention queue: payment pending, stuck orders, failed deliveries | Authorized valid input yields committed business effect and correct customer/staff projection |
| `TC-OMS-06-DENY` | Invalid actor, stale state, duplicate or unavailable dependency | No unauthorized/duplicate effect; safe error or pending state |
| `TC-OMS-07-OK` | Assisted order entry for phone orders | Authorized valid input yields committed business effect and correct customer/staff projection |
| `TC-OMS-07-DENY` | Invalid actor, stale state, duplicate or unavailable dependency | No unauthorized/duplicate effect; safe error or pending state |

## Cross-module contract tests

- Verify authenticated customer/staff/location ownership using actual restricted runtime roles.
- Verify concurrency and duplicate idempotency behavior against an isolated PostgreSQL database with authoritative migrations.
- Verify safe retry when callbacks or files arrive late or malformed.
- Verify audit and notification records are based on committed state and contain no confidential payloads.
- Verify this invariant: **Route each order to only one licensed, permitted, open and adequately stocked location, or hold for intervention. A manual reassign must serialize with inventory holds and preserve audit reasons.**

Coverage state: **Designed, not executed for the proposed application**. Link individual results to the associated test ID and requirement before go-live. Read Test_Strategy.

## Validations

## Order Management & Routing — validation checkpoints

| Boundary | Required validation | Rejection outcome |
| --- | --- | --- |
| Input | Required fields, type, size, allowed format and business master codes | `400/422`; no write |
| Actor | Session validity, role, location, customer/patient/parcel ownership | `401/403/404`; audit |
| Version | Accepted order revision or row version matches, if state-changing | `409`; fetch current state |
| Domain | Route each order to only one licensed, permitted, open and adequately stocked location, or hold for intervention. A manual reassign must serialize with inventory holds and preserve audit reasons. | Explicit blocked/pending/error status |
| Database | FK, PK, UNIQUE, CHECK, trigger and RLS outcome | Safe conflict/business error; rollback |
| Integration | Authenticated provider/callback, idempotency key and settled evidence | Keep pending; reconciliation task |

**Requirements:** `OMS-01`, `OMS-02`, `OMS-03`, `OMS-04`, `OMS-05`, `OMS-06`, `OMS-07`. Never trust browser-supplied patient, clinical decision, backend actor context, price or available quantity. Refer to Testing for negative tests.

## Workflows

## Order Management & Routing — operational workflows

**Entry points:** Route accepted order; reassign with reason; resolve exceptions. **User group:** Ops Manager, Store Manager. The following source-defined order journey stages identify primary ownership; supporting modules also participate without necessarily owning the stage.

- S17 — Find a store with the full order
- S18 — Resolve a stock or delivery problem
- S19 — Assign the order to a store
- S32 — Close the order records

## Shared processing rules

The requested action is first validated against user scope, current state and approved business master data. Read required evidence from real migrated tables; change only data this module owns; publish a safe event or notify the next module after commit.

**Alternative paths:** missing required input keeps the process actionable; a stale or duplicate request is deduplicated; another actor's update returns a version conflict; external unavailability produces a pending/blocked state. Prescriptions, inventory, payments and logistics never independently set the whole order to delivered.

**Module-specific rule:** Route each order to only one licensed, permitted, open and adequately stocked location, or hold for intervention. A manual reassign must serialize with inventory holds and preserve audit reasons.

See State_Transitions and Unified_Order.
