# Customer Orders LLD

[Business flow](../../00-Business-Guide/Orders-and-Fulfillment.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## Order tracking and aftercare — implementation acceptance

**Proposed conditions for engineering handoff; never imply QA passed.**

## Draft features
- **ORD-01 / REQ-027:** Order confirmation on screen, WhatsApp and email (Must (draft)).
- **ORD-02 / REQ-028:** Status timeline (placed → packed → out for delivery → delivered) (Must (draft)).
- **ORD-03 / REQ-029:** Order history with GST invoice download (Must (draft)).
- **ORD-04 / REQ-030:** Cancel before the order is packed (Must (draft)).
- **ORD-05 / REQ-031:** Return request within the return window (Should (draft)).
- **ORD-06 / REQ-032:** Refund status for cancelled and returned orders (Must (draft)).
- **ORD-07 / REQ-033:** Live rider location on a map, estimated arrival, masked call button (Must (draft)).
- **ORD-08 / REQ-034:** Delivery OTP shown to the customer (Must (draft)).
- **ORD-09 / REQ-035:** Change items or address after placing an order (Could (draft)).

## Required release checks
- Authorised happy path persists exactly the intended state.
- Invalid, cross-account and cross-location requests leave authoritative rows unchanged.
- Concurrent duplicate requests do not create duplicate money, stock or order effects.
- File, prescription and patient data are not exposed to unauthorised roles.
- Recoverable provider failure exposes a pending/retryable state; never claims success.
- Audit/trace data contains public references, not credentials or sensitive document contents.

Module test scenarios

## Customer Orders & Aftercare — HTTP API responsibilities

All routes below are **Proposed REST v1 contracts**. The database repository does not implement them. Public UUIDs identify resources; staff scope and patient/order ownership are checked at each handler, not inferred from URL paths.

- API-025 GET /v1/me/orders — Own order history
- API-026 GET /v1/me/orders/{order_id} — Own order details and states
- API-027 POST /v1/me/orders/{order_id}/cancel — Request cancellation
- API-028 POST /v1/me/orders/{order_id}/returns — Create return request
- API-029 GET /v1/me/orders/{order_id}/invoice — Retrieve permitted invoice
- API-030 GET /v1/me/orders/{order_id}/refunds — Check refund outcomes
- API-031 GET /v1/me/orders/{order_id}/delivery — Get privacy-limited tracking

## Cross-cutting request contract

Writes require validated body, stable intent key, expected current version when appropriate, auditable actor identity and an explicit outcome. Reads use safe pagination and permission-filtered fields. `401` indicates no valid session; `403/404` denied scope; `409` conflict; `422` business validation; `503` unknown upstream outcome. Read [api conventions](../../05-APIs/README.md) before implementing the endpoint.

**Business gate:** Project independent payment, clinical, fulfillment and delivery statuses into customer-friendly read models. Cancellation/return/refund must be distinguished and require stored authority. For actual response fields, see the linked illustrative contract and approve a typed OpenAPI schema before implementation.

## Customer Orders & Aftercare — business logic and invariants

**Rule origin:** the documented draft requirements and database migration guards. Distinguish a **confirmed database guard** from a **proposed API orchestration** and **open numeric policy**.

## Core procedure

1. Authenticate the actor and resolve server-owned tenant/location/patient permission.
2. Re-read the relevant product, order, document, stock or ledger state from the owning tables.
3. Reject incomplete or stale input; validate the latest accepted revision and current classification where relevant.
4. Apply the module invariant: **Project independent payment, clinical, fulfillment and delivery statuses into customer-friendly read models. Cancellation/return/refund must be distinguished and require stored authority.**
5. In a transaction, persist the minimal authoritative rows, version and audit outcome; publish notifications after commit.
6. Return a scoped read model; expose only approved information to the caller.

## Features implemented by this rule set

`ORD-01`, `ORD-02`, `ORD-03`, `ORD-04`, `ORD-05`, `ORD-06`, `ORD-07`, `ORD-08`, `ORD-09` (see full requirement descriptions).

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

## Customer Orders & Aftercare — internal components

**Status:** Proposed NestJS modular-monolith design informed by the decided stack in the master decisions checklist. This is not code already implemented in the SQLAlchemy repository.

| Component | Responsibility | Failure boundary |
| --- | --- | --- |
| HTTP controller / DTO validator | Accept typed requests for customer orders & aftercare, reject malformed payloads | `400/422`, no database change |
| Use-case service | Execute: See own order; cancel within policy; request return; get invoice | Explicit domain errors, no invented outcomes |
| Policy/authorization service | Enforce user role, object ownership, business eligibility | `403/404` and audit denied attempt |
| Domain repository | Execute scoped PostgreSQL reads/writes within a transaction | Retry only on safe concurrency errors |
| Outbox / integration adapter | Publish committed changes toward other modules or third parties | Durable retry and dead-letter review if adopted |

### Boundaries

Project independent payment, clinical, fulfillment and delivery statuses into customer-friendly read models. Cancellation/return/refund must be distinguished and require stored authority. Public controllers must not call database workflow functions with arbitrary SQL and must not accept a caller-supplied `actor_user_id`. Network IO belongs outside long-lived locks. Modules should depend on domain interfaces, not on each other's ORM entities. Consult Dependencies and [architecture overview](../../02-Architecture/System-HLD.md).

## Customer Orders & Aftercare — existing database usage

**Confirmed database:** 24 PostgreSQL schemas; SQL migration authority the checked-in SQL migration history. The tables below exist, but **a schema-domain association does not automatically mean this module owns every row or has write rights**. The database repository is not an HTTP service.

- `commerce.cancellations` — columns · contracts
- `commerce.order_items` — columns · contracts
- `commerce.orders` — columns · contracts
- `commerce.returns` — columns · contracts

## Ownership, transactions and change control

Proposed owning service: `Customer_Orders`. Main read concerns: order status, history, cancellations, return requests and invoices. Writes must be restricted by the actual foreign keys, CHECKs, unique contracts, crosswalks, policy and trigger guards. Use one transaction per domain state transition, use an outbox for reliable cross-module publication, and make any external retry idempotent.

**Safety:** Project independent payment, clinical, fulfillment and delivery statuses into customer-friendly read models. Cancellation/return/refund must be distinguished and require stored authority.

Internal ID strategy: `identity.users.id` is UUID; most other tables have BIGINT internal PK with original immutable UUID alias. Never cast UUID to BIGINT or expose DB internal IDs as authorization tokens. All schema changes require new forward-only SQL migration under the source repo and a fresh PG15/PG18 parity test. Related [migration strategy](../../04-Database/Migrations.md).

## Customer Orders & Aftercare — dependencies and ownership

**Underlying schemas:** `commerce`, `finance`, `logistics`, `fulfillment`. These schemas are shared data domains; shared reads are not automatic write rights. Candidate collaborator modules are inferred from overlapping schema use:

- Cart_Checkout
- Delivery_Operations
- Finance_Payments
- Order_Operations
- Pharmacist_Review
- Reporting
- Rider_App
- Store_Operations

## Communication rules

Use the owning service interface for business changes rather than making uncontrolled cross-module writes. In the chosen modular-monolith style, synchronous application calls can remain in-process. BullMQ/Redis jobs serve slow notifications and integrations after commit; they should not become the source of order, payment, stock or clinical truth. Build independent adapters for Cashfree, POS/Techsmith, MSG91 and driver APIs; failures must remain visible.

**Data-access contract:** Project independent payment, clinical, fulfillment and delivery statuses into customer-friendly read models. Cancellation/return/refund must be distinguished and require stored authority.. Related: [module dependencies](../../02-Architecture/Module-Dependencies.md) and [database usage](../../04-Database/Module-Mapping.md).

## Customer Orders & Aftercare — domain objects and DTO boundaries

**Proposed objects, not new database tables.** A domain object is a service-level business concept; a DTO is a validated data transfer object (API input/output). Do not confuse them with the Python SQLAlchemy models used for schema verification.

| Proposed object | Source of truth / evidence | Rules |
| --- | --- | --- |
| `Customer_OrdersCommand` | Authenticated HTTP request and expected version | Includes actor context, idempotency key and validated business input |
| `Customer_OrdersAggregate` | Domain rows listed in Database Usage | Represents the current authoritative business facts |
| `Customer_OrdersPolicy` | Approved master/role records and product rules | Project independent payment, clinical, fulfillment and delivery statuses into customer-friendly read models. Cancellation/return/refund must be distinguished and require stored authority. |
| `Customer_OrdersReadModel` | Role-filtered current state | Removes protected fields and translates internal statuses |
| `Customer_OrdersEvent` | Committed state transition and audit ID | Events carry references and versions, not clinical documents |

**Existing representative tables:** `commerce.cancellations`, `commerce.order_items`, `commerce.orders`, `commerce.returns`. Internal BIGINT primary keys are never used as authorization credentials, and original UUID public references must remain stable. Any DTO field not directly supported by a confirmed column must be labelled proposed until the API team approves the mapping. See [database usage](../../04-Database/Module-Mapping.md).

## Customer Orders & Aftercare — failure handling

**Primary rule:** Project independent payment, clinical, fulfillment and delivery statuses into customer-friendly read models. Cancellation/return/refund must be distinguished and require stored authority.

- **Missing or invalid input:** respond with a field-specific problem code; do not leak sensitive data and do not write partial state.
- **Unauthorized object or location:** return `403` or privacy-safe `404`; record the attempted privileged action.
- **Duplicate submission:** return the persisted result when key + payload match; reject key reuse with different payload.
- **Stale/concurrent change:** database version/FK/CHECK guard must resolve a single winner; caller reloads latest projection.
- **Partial external failure:** leave the aggregate pending, never mark payment/stock/delivery success by assumption. Retry verified idempotent adapter calls; otherwise reconcile manually.
- **Safety or compliance policy unknown:** fail closed. Route staff to an exception queue and customer to a non-misleading status.

Use structured problem codes, request ID, retryability category and operator runbook reference. Sensitive Rx, financial tokens, OTPs and location traces must not be placed into logs. See [error responses](../../05-APIs/README.md#standard-problem-response-behavior) and [incident triage](../../07-Engineering/Release-and-Incident-Handling.md).

## Order tracking and aftercare — proposed interfaces and DTOs

**Business context:** Customer cancellation or return requests must respect current order/fulfillment/payment states.

**Controller contract:** validate identity and scope before accepting a command; never expose internal BIGINT IDs. Typed inputs should carry allowed public identifiers, operation-specific fields, expected record version and a unique idempotency key on mutations.

**Use-case interface:** `execute(trustedContext, validatedRequest) -> acceptedResult | domainError`. This is pseudocode for a boundary, **not generated application code**.

**Repository interface:** require a database transaction handle, parameterised SQL/ORM queries, and a stored accepted transition. Return public UUIDs or approved opaque references only.

**Error DTO proposal:** `{"error":{"code":"STATE_CONFLICT","message":"Refresh the record and try again","request_id":"..."}}`. Do not expose SQL errors, provider secrets or prescription contents.

**Existing table candidates:** `commerce.orders`, `commerce.order_items`, `commerce.cancellations`, `commerce.returns`, `commerce.order_status_history`.

**Per-operation request and response examples:** API contract index. No generic DTO in this document overrides module-specific validation.

## Order tracking and aftercare — internal architecture

**Status: Proposed application design.** The database repo does not contain a NestJS HTTP implementation.

## Business behavior
Customer cancellation or return requests must respect current order/fulfillment/payment states.

## Components
| Component | Responsibility | Data affected | Failure outcome |
| --- | --- | --- | --- |
| `Customer_OrdersController` (proposed) | Validate DTO and request context | Public API request only | 400/401/403 without partial mutation |
| `Customer_OrdersUseCase` (proposed) | Enforce module business invariant | commerce.orders, commerce.order_items, commerce.cancellations | Domain status, do not guess provider truth |
| `Customer_OrdersRepository` (proposed) | Scoped SQL transaction and concurrency guard | Exact migrated tables | Roll back on conflict or constraint error |
| `Customer_OrdersIntegrationAdapter` (only when needed) | Map external IO and reconcile delivery | Outbox/inbox or verified provider record | Retries outside DB lock |

## Transaction and retry sequence

1. load order with current revision and status.
2. check cancellation/return eligibility.
3. record request and reason without mutating unrelated ledgers.
4. coordinate fulfilment and payment compensation.
5. return revised safe tracking view.

## Existing tables (candidate responsibilities)
- commerce.orders — candidate entity; verify the exact operation and field set in the implementation review.
- commerce.order_items — candidate entity; verify the exact operation and field set in the implementation review.
- commerce.cancellations — candidate entity; verify the exact operation and field set in the implementation review.
- commerce.returns — candidate entity; verify the exact operation and field set in the implementation review.
- commerce.order_status_history — candidate entity; verify the exact operation and field set in the implementation review.

## Related
HLD · States · Permissions

## Order tracking and aftercare — observability

**Proposed runtime design:** Structured logs record correlation ID, module, operation, outcome code and elapsed time. Replace identifiers with approved pseudonymous references. No raw OTP, prescription text, secrets, payment credentials, addresses or GPS coordinates in logs.

**Candidate counters:** `customer_orders_command_total{outcome}`, `customer_orders_denied_total{reason}`, and `customer_orders_provider_pending_total` when an external provider is involved. Names are proposed and require monitoring owner review.

**Actionable alerts:** persistent command rejection spikes, outbox backlog, stale integrations or reconciliation mismatches; thresholds are open questions, not fabricated service-level objectives.

Monitoring design

## Customer Orders & Aftercare — permission model

**Actors:** Customer. **Proposed service scope:** `customer`. Roles are application concepts; existing PostgreSQL NOLOGIN capability roles form a separate lower-level authorization layer.

| Operation class | Required entitlement | Enforcement |
| --- | --- | --- |
| Read own/scoped data | Authenticated identity + object or location ownership | Controller + service + database guard where provided |
| Create / edit | Explicit module action grant, approved master and domain status | Policy decision before transaction |
| Override / refund / pharmacist action | Specialized staff permission and documented approval reason | Distinct privilege, immutable audit evidence |
| Export / sensitive view | Purpose-limited role, retention and access logging | Recheck at download/stream time |

**Core constraint:** Project independent payment, clinical, fulfillment and delivery statuses into customer-friendly read models. Cancellation/return/refund must be distinguished and require stored authority. A customer cannot infer another customer's resource existence. Do not connect app runtime through migration-owner credentials. Consult [roles and permissions](../../07-Engineering/Security.md).

## Customer Orders & Aftercare — functional requirements

**Source:** the documented draft requirements. **Status:** Draft requirements, not proof of final business acceptance. 🔴/🟡/🟢 priorities have been normalized as Must/Should/Could without changing their meaning.

| Feature | Priority in v0.1 | Statement | Dependency |
| --- | --- | --- | --- |
| `ORD-01` | Must (draft) | Order confirmation on screen, WhatsApp and email | Not stated |
| `ORD-02` | Must (draft) | Status timeline (placed → packed → out for delivery → delivered) | Not stated |
| `ORD-03` | Must (draft) | Order history with GST invoice download | Invoice format, GSTIN decision |
| `ORD-04` | Must (draft) | Cancel before the order is packed | Not stated |
| `ORD-05` | Should (draft) | Return request within the return window | Return policy |
| `ORD-06` | Must (draft) | Refund status for cancelled and returned orders | Not stated |
| `ORD-07` | Must (draft) | Live rider location on a map, estimated arrival, masked call button | Not stated |
| `ORD-08` | Must (draft) | Delivery OTP shown to the customer | Not stated |
| `ORD-09` | Could (draft) | Change items or address after placing an order | Q25 |

## Interactions and acceptance basis

The user performs: See own order; cancel within policy; request return; get invoice. Server-side enforcement must preserve this invariant: **Project independent payment, clinical, fulfillment and delivery statuses into customer-friendly read models. Cancellation/return/refund must be distinguished and require stored authority.**

A feature becomes implementation-ready only after its inputs (especially any dependency listed above), permissions, workflow outcome, API body and database transaction are resolved. Confirm business thresholds before coding: a field existing in SQL is not proof that its value was approved.

See requirement coverage and test IDs.

## Order tracking and aftercare — request sequence

**Proposed design**, not a diagram of deployed services. Business-specific steps appear in Internal Architecture.

```mermaid
sequenceDiagram
  participant A as Customer
  participant O as Customer Orders facade
  participant D as PostgreSQL
  A->>O: Read current order or request cancellation
  O->>D: Check owner and current packing milestone
  alt Gate fails or current version conflicts
    O-->>A: Deny or show current eligible actions
  else Gate satisfied
    O->>D: Delegate permitted command to Order Operations
    D-->>O: Committed evidence
    O-->>A: Current order projection
  end
```

## Customer Orders & Aftercare — service design

**Proposed NestJS module:** `Customer_OrdersModule` with a controller, application service, authorization policy, repository and adapters. The supplied database code is a schema/validation library; no running HTTP controller was found in Archive 2.

## Candidate service methods

- `API-025: own_order_history(actor_context, validated_command, expected_version) -> Result`
- `API-026: own_order_details_and_states(actor_context, validated_command, expected_version) -> Result`
- `API-027: request_cancellation(actor_context, validated_command, expected_version) -> Result`
- `API-028: create_return_request(actor_context, validated_command, expected_version) -> Result`
- `API-029: retrieve_permitted_invoice(actor_context, validated_command, expected_version) -> Result`
- `API-030: check_refund_outcomes(actor_context, validated_command, expected_version) -> Result`
- `API-031: get_privacy-limited_tracking(actor_context, validated_command, expected_version) -> Result`

## Transaction and integration contract

For each mutation: authenticate actor, validate inputs, read affected rows with a lock/version check, verify policy, update the minimum relevant rows and immutable audit/outbox in one transaction. A remote gateway, storage or GPS call should be performed outside the locked transaction and reconciled on callback/timeout. Use PostgreSQL to reject invalid writes even if application validation is bypassed.

**Module invariant:** Project independent payment, clinical, fulfillment and delivery statuses into customer-friendly read models. Cancellation/return/refund must be distinguished and require stored authority.

**Timeouts/retries:** configure per provider, use exponential backoff with caps for safe reads and idempotent messages; never blindly repeat charge/refund/cash state changes. A dead-letter queue is an optional BullMQ operating pattern because BullMQ/Redis are selected in the checklist, but exact job topology needs signoff. **Telemetry:** actor pseudonym, request ID, action, state transition latency, retries and failure category; redact protected clinical and payment contents. See [database usage](../../04-Database/Module-Mapping.md) and Monitoring.

## Customer Orders & Aftercare — state and transition policy

**Status:** State boundaries are derived from the unified order journey and existing SQL CHECK/trigger contracts; the following is a service design, not a claim that a single enum exists.

```mermaid
flowchart TD
  A["Read current order or request cancellation"] --> B{"Owner and cancellation still eligible?"}
  B -->|No| C["Deny or show current eligible actions"]
  B -->|Yes| D["Delegate permitted command to Order Operations"]
  D --> E["Current order projection"]
```

**Module-specific invariant:** Project independent payment, clinical, fulfillment and delivery statuses into customer-friendly read models. Cancellation/return/refund must be distinguished and require stored authority.

Each transition must record the prior state, target state, reason where required, actor, accepted version and timestamp. A second command on the same state must either replay the prior idempotent result or fail with `409`. A failed external callback cannot roll an accepted state backward; reconcile with authoritative provider evidence. When an order changes, keep clinical, payment, inventory, fulfillment and delivery statuses separate, then derive one safe user-visible projection.

This flow shows command gates, not an entity enum. Legal entity transitions and recovery are specified in [state contracts](../../07-Engineering/State-and-Recovery-Contracts.md); the table catalog supplies actual stored values.

## Customer Orders & Aftercare — verification and acceptance

**Candidate test IDs** derived one-to-one from the v0.1 feature IDs. They are test-design work items, not claims that the tests have been implemented. Database-level tests reported in the source do not replace HTTP and browser tests.

| Stable test ID | Behavior | Expected result |
| --- | --- | --- |
| `TC-ORD-01-OK` | Order confirmation on screen, WhatsApp and email | Committed order reference appears in app and queues approved confirmation |
| `TC-ORD-01-DENY` | WhatsApp/email delivery fails after order commit | Order survives; failed message is tracked without another order; Notifications retries; customer uses existing status |
| `TC-ORD-02-OK` | Status timeline (placed → packed → out for delivery → delivered) | Timeline reflects committed clinical/payment/fulfillment/delivery facts |
| `TC-ORD-02-DENY` | Late event describes an earlier milestone | Timeline does not regress or imply delivery from packing; Order Operations rebuilds projection from authoritative facts |
| `TC-ORD-03-OK` | Order history with GST invoice download | Owner downloads the issued invoice for the selected order |
| `TC-ORD-03-DENY` | Another customer’s order ID is requested | No invoice URL or order existence leaked; Customer selects own order; Security reviews suspicious access |
| `TC-ORD-04-OK` | Cancel before the order is packed | Before-packed cancellation stops eligible work and records a reason |
| `TC-ORD-04-DENY` | Pack-close and cancellation race | At most one valid transition; no newly packed cancelled order; Operations reloads state; support explains current eligibility |
| `TC-ORD-05-OK` | Return request within the return window | Eligible return request records items, quantities and reason |
| `TC-ORD-05-DENY` | Item is outside approved return eligibility | Refusal reason; no refund or saleable-stock credit from request alone; Support reviews dispute under approved return policy |
| `TC-ORD-06-OK` | Refund status for cancelled and returned orders | Customer sees evidenced refund progress and reference |
| `TC-ORD-06-DENY` | Provider refund is pending but UI refreshes | Pending remains visible; no false completed payout; Finance checks trusted result; customer waits on same reference |
| `TC-ORD-07-OK` | Live rider location on a map, estimated arrival, masked call button | Only owner sees current assigned-rider tracking and masked contact |
| `TC-ORD-07-DENY` | Location stream stops or access expires | Last update is identified; unauthorized access denied; Dispatch checks rider; customer refreshes permitted view |
| `TC-ORD-08-OK` | Delivery OTP shown to the customer | Current delivery OTP is available only to its permitted customer |
| `TC-ORD-08-DENY` | Unrelated user requests the code | No OTP disclosure or challenge change; Security investigates; customer uses authenticated order |
| `TC-ORD-09-OK` | Change items or address after placing an order | Post-order edit requires an approved revision and gate revalidation |
| `TC-ORD-09-DENY` | New address is outside service area | Old accepted terms remain; no silent reroute or extra charge; Product approves edit contract; Operations reviews request |

## Cross-module contract tests

- Verify authenticated customer/staff/location ownership using actual restricted runtime roles.
- Verify concurrency and duplicate idempotency behavior against an isolated PostgreSQL database with authoritative migrations.
- Verify safe retry when callbacks or files arrive late or malformed.
- Verify audit and notification records are based on committed state and contain no confidential payloads.
- Verify this invariant: **Project independent payment, clinical, fulfillment and delivery statuses into customer-friendly read models. Cancellation/return/refund must be distinguished and require stored authority.**

Coverage state: **Designed, not executed for the proposed application**. Link individual results to the associated test ID and requirement before go-live. Read [test strategy](../../07-Engineering/Testing.md).

## Customer Orders & Aftercare — validation checkpoints

| Boundary | Required validation | Rejection outcome |
| --- | --- | --- |
| Input | Required fields, type, size, allowed format and business master codes | `400/422`; no write |
| Actor | Session validity, role, location, customer/patient/parcel ownership | `401/403/404`; audit |
| Version | Accepted order revision or row version matches, if state-changing | `409`; fetch current state |
| Domain | Project independent payment, clinical, fulfillment and delivery statuses into customer-friendly read models. Cancellation/return/refund must be distinguished and require stored authority. | Explicit blocked/pending/error status |
| Database | FK, PK, UNIQUE, CHECK, trigger and RLS outcome | Safe conflict/business error; rollback |
| Integration | Authenticated provider/callback, idempotency key and settled evidence | Keep pending; reconciliation task |

**Requirements:** `ORD-01`, `ORD-02`, `ORD-03`, `ORD-04`, `ORD-05`, `ORD-06`, `ORD-07`, `ORD-08`, `ORD-09`. Never trust browser-supplied patient, clinical decision, backend actor context, price or available quantity. Refer to Testing for negative tests.

## Customer Orders & Aftercare — operational workflows

**Entry points:** See own order; cancel within policy; request return; get invoice. **User group:** Customer. The following source-defined order journey stages identify primary ownership; supporting modules also participate without necessarily owning the stage.

- S28 — Cancel safely at the correct stage
- S29 — Raise a return, wrong item or quality complaint

## Shared processing rules

The requested action is first validated against user scope, current state and approved business master data. Read required evidence from real migrated tables; change only data this module owns; publish a safe event or notify the next module after commit.

**Alternative paths:** missing required input keeps the process actionable; a stale or duplicate request is deduplicated; another actor's update returns a version conflict; external unavailability produces a pending/blocked state. Prescriptions, inventory, payments and logistics never independently set the whole order to delivered.

**Module-specific rule:** Project independent payment, clinical, fulfillment and delivery statuses into customer-friendly read models. Cancellation/return/refund must be distinguished and require stored authority.

See [state transitions](../../07-Engineering/State-and-Recovery-Contracts.md) and [unified order](../../00-Business-Guide/Pharmville-Complete-Business-Flow.md).
