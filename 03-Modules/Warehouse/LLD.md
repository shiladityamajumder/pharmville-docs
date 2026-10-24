# Warehouse LLD

<!-- ERD-NAV-START -->

## Database relationships

[`warehouse` ERD](../../04-Database/ER-Diagrams/24-warehouse.md) · [`procurement` ERD](../../04-Database/ER-Diagrams/20-procurement.md) · [FK catalog](../../04-Database/ER-Diagrams/Relationship-Catalog.md)

These diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](../../04-Database/Migrations.md) for the supplied source and deployment verification limits.

<!-- ERD-NAV-END -->

[Business flow](../../00-Business-Guide/Store-and-Warehouse.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## Warehouse replenishment and transfers — implementation acceptance

> [!NOTE]
> **Proposed conditions for engineering handoff; never imply QA passed.**

### Draft features

- **WH-01 / REQ-064:** Receive stock: batch, manufacturing and expiry dates, quantity, supplier invoice (Must (draft)).
- **WH-02 / REQ-065:** Replenishment queue: approve, dispatch with note, stock "in transit" (Must (draft)).
- **WH-03 / REQ-066:** Urgent runs, up to two extra a day (Must (draft)).
- **WH-04 / REQ-067:** Pick, pack and dispatch fallback online orders (Must (draft)).
- **WH-05 / REQ-068:** Basic stock audit (Could (draft)).

### Required release checks

- Authorised happy path persists exactly the intended state.
- Invalid, cross-account and cross-location requests leave authoritative rows unchanged.
- Concurrent duplicate requests do not create duplicate money, stock or order effects.
- File, prescription and patient data are not exposed to unauthorised roles.
- Recoverable provider failure exposes a pending/retryable state; never claims success.
- Audit/trace data contains public references, not credentials or sensitive document contents.

**Module test scenarios**

## Warehouse & Store Replenishment — HTTP API responsibilities

All routes below are **Proposed REST v1 contracts**. The database repository does not implement them. Public UUIDs identify resources; staff scope and patient/order ownership are checked at each handler, not inferred from URL paths.

- `API-056` `POST /v1/staff/warehouse/receipts` — Receive lots with documents
- `API-057` `GET /v1/staff/warehouse/replenishments` — Review replenishment queue
- `API-058` `POST /v1/staff/warehouse/transfers/{transfer_id}/dispatch` — Dispatch authorized transfer
- `API-059` `GET /v1/staff/warehouse/fallback-orders` — Fallback online dispatch list

### Cross-cutting request contract

Writes require validated body, stable intent key, expected current version when appropriate, auditable actor identity and an explicit outcome. Reads use safe pagination and permission-filtered fields. `401` indicates no valid session; `403/404` denied scope; `409` conflict; `422` business validation; `503` unknown upstream outcome. Read [api conventions](../../05-APIs/README.md) before implementing the endpoint.

**Business gate:** Preserve transfer chain of custody across dispatch, in-transit and store receipt. A short shipment posts an exception, not an assumed full receipt. Advanced bin/wave workflows stay outside the agreed minimum. For actual response fields, see the linked illustrative contract and approve a typed OpenAPI schema before implementation.

## Warehouse & Store Replenishment — business logic and invariants

**Rule origin:** the documented draft requirements and database migration guards. Distinguish a **confirmed database guard** from a **proposed API orchestration** and **open numeric policy**.

### Core procedure

1. Authenticate the actor and resolve server-owned tenant/location/patient permission.
2. Re-read the relevant product, order, document, stock or ledger state from the owning tables.
3. Reject incomplete or stale input; validate the latest accepted revision and current classification where relevant.
4. Apply the module invariant: **Preserve transfer chain of custody across dispatch, in-transit and store receipt. A short shipment posts an exception, not an assumed full receipt. Advanced bin/wave workflows stay outside the agreed minimum.**
5. In a transaction, persist the minimal authoritative rows, version and audit outcome; publish notifications after commit.
6. Return a scoped read model; expose only approved information to the caller.

### Features implemented by this rule set

`WH-01`, `WH-02`, `WH-03`, `WH-04`, `WH-05` (see full requirement descriptions).

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

## Warehouse & Store Replenishment — internal components

**Status:** Proposed NestJS modular-monolith design informed by the decided stack in the master decisions checklist. This is proposed application design; the validated standalone SQL is structure, not an implemented API.

| Component | Responsibility | Failure boundary |
| --- | --- | --- |
| HTTP controller / DTO validator | Accept typed requests for warehouse & store replenishment, reject malformed payloads | `400/422`, no database change |
| Use-case service | Execute: Receive lot; approve transfer; dispatch; reconcile shortage | Explicit domain errors, no invented outcomes |
| Policy/authorization service | Enforce user role, object ownership, business eligibility | `403/404` and audit denied attempt |
| Domain repository | Execute scoped PostgreSQL reads/writes within a transaction | Retry only on safe concurrency errors |
| Outbox / integration adapter | Publish committed changes toward other modules or third parties | Durable retry and dead-letter review if adopted |

### Boundaries

Preserve transfer chain of custody across dispatch, in-transit and store receipt. A short shipment posts an exception, not an assumed full receipt. Advanced bin/wave workflows stay outside the agreed minimum. Public controllers must not call database workflow functions with arbitrary SQL and must not accept a caller-supplied `actor_user_id`.

Network IO belongs outside long-lived locks. Modules should depend on domain interfaces, not on each other's ORM entities. Consult Dependencies and [architecture overview](../../02-Architecture/System-HLD.md).

## Warehouse & Store Replenishment — existing database usage

**Confirmed database:** 24 PostgreSQL schemas; schema authority the canonical standalone SQL. The tables below exist, but **a schema-domain association does not automatically mean this module owns every row or has write rights**. The database repository is not an HTTP service.

- `procurement.goods_receipt_items` — columns · contracts
- `procurement.goods_receipt_quality_checks` — columns · contracts
- `procurement.goods_receipts` — columns · contracts
- `procurement.purchase_order_items` — columns · contracts
- `procurement.purchase_orders` — columns · contracts
- `procurement.purchase_requisition_items` — columns · contracts
- `procurement.purchase_requisitions` — columns · contracts
- `procurement.purchase_return_items` — columns · contracts
- `procurement.purchase_returns` — columns · contracts
- `procurement.supplier_invoices` — columns · contracts
- `procurement.supplier_licenses` — columns · contracts
- `procurement.supplier_products` — columns · contracts

### Ownership, transactions and change control

Proposed owning service: `Warehouse`. Main read concerns: basic receiving, stock transfers, urgent restocks and fallback online dispatch. Writes must be restricted by the actual foreign keys, CHECKs, unique contracts, crosswalks, policy and trigger guards. Use one transaction per domain state transition, use an outbox for reliable cross-module publication, and make any external retry idempotent.

**Safety:** Preserve transfer chain of custody across dispatch, in-transit and store receipt. A short shipment posts an exception, not an assumed full receipt. Advanced bin/wave workflows stay outside the agreed minimum.

Internal ID strategy: `identity.users.id` is UUID; most other tables have BIGINT internal PK with original immutable UUID alias. Never cast UUID to BIGINT or expose DB internal IDs as authorization tokens. All schema changes require new forward-only SQL migration under the source repo and a fresh PG15/PG18 parity test. Related [migration strategy](../../04-Database/Migrations.md).

## Warehouse & Store Replenishment — dependencies and ownership

**Underlying schemas:** `warehouse`, `procurement`, `fulfillment`. These schemas are shared data domains; shared reads are not automatic write rights. Candidate collaborator modules are inferred from overlapping schema use:

- Cart_Checkout
- Customer_Orders
- Delivery_Operations
- Inventory
- Order_Operations
- Store_Operations

### Communication rules

Use the owning service interface for business changes rather than making uncontrolled cross-module writes. In the chosen modular-monolith style, synchronous application calls can remain in-process. BullMQ/Redis jobs serve slow notifications and integrations after commit; they should not become the source of order, payment, stock or clinical truth.

Build independent adapters for Cashfree, POS/Techsmith, MSG91 and driver APIs; failures must remain visible.

**Data-access contract:** Preserve transfer chain of custody across dispatch, in-transit and store receipt. A short shipment posts an exception, not an assumed full receipt. Advanced bin/wave workflows stay outside the agreed minimum.. Related: [module dependencies](../../02-Architecture/Module-Dependencies.md) and [database usage](../../04-Database/Module-Mapping.md).

## Warehouse & Store Replenishment — domain objects and DTO boundaries

**Proposed objects, not new database tables.** A domain object is a service-level business concept; a DTO is a validated data transfer object (API input/output). Do not confuse them with the archived historical ORM models.

| Proposed object | Source of truth / evidence | Rules |
| --- | --- | --- |
| `WarehouseCommand` | Authenticated HTTP request and expected version | Includes actor context, idempotency key and validated business input |
| `WarehouseAggregate` | Domain rows listed in Database Usage | Represents the current authoritative business facts |
| `WarehousePolicy` | Approved master/role records and product rules | Preserve transfer chain of custody across dispatch, in-transit and store receipt. A short shipment posts an exception, not an assumed full receipt. Advanced bin/wave workflows stay outside the agreed minimum. |
| `WarehouseReadModel` | Role-filtered current state | Removes protected fields and translates internal statuses |
| `WarehouseEvent` | Committed state transition and audit ID | Events carry references and versions, not clinical documents |

**Existing representative tables:** `procurement.goods_receipt_items`, `procurement.goods_receipt_quality_checks`, `procurement.goods_receipts`, `procurement.purchase_order_items`, `procurement.purchase_orders`, `procurement.purchase_requisition_items`, `procurement.purchase_requisitions`, `procurement.purchase_return_items`.

Internal BIGINT primary keys are never used as authorization credentials, and original UUID public references must remain stable. Any DTO field not directly supported by a confirmed column must be labelled proposed until the API team approves the mapping. See [database usage](../../04-Database/Module-Mapping.md).

## Warehouse & Store Replenishment — failure handling

**Primary rule:** Preserve transfer chain of custody across dispatch, in-transit and store receipt. A short shipment posts an exception, not an assumed full receipt. Advanced bin/wave workflows stay outside the agreed minimum.

- **Missing or invalid input:** respond with a field-specific problem code; do not leak sensitive data and do not write partial state.
- **Unauthorized object or location:** return `403` or privacy-safe `404`; record the attempted privileged action.
- **Duplicate submission:** return the persisted result when key + payload match; reject key reuse with different payload.
- **Stale/concurrent change:** database version/FK/CHECK guard must resolve a single winner; caller reloads latest projection.
- **Partial external failure:** leave the aggregate pending, never mark payment/stock/delivery success by assumption. Retry verified idempotent adapter calls; otherwise reconcile manually.
- **Safety or compliance policy unknown:** fail closed. Route staff to an exception queue and customer to a non-misleading status.

Use structured problem codes, request ID, retryability category and operator runbook reference. Sensitive Rx, financial tokens, OTPs and location traces must not be placed into logs. See [error responses](../../05-APIs/README.md#standard-problem-response-behavior) and [incident triage](../../07-Engineering/Release-and-Incident-Handling.md).

## Warehouse replenishment and transfers — proposed interfaces and DTOs

**Business context:** Receiving and transfers create a traceable stock ledger and require location/lot scope.

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

**Existing table candidates:** `warehouse.warehouses`, `warehouse.stock_transfers`, `warehouse.stock_transfer_items`, `procurement.goods_receipts`, `warehouse.stock_ledger`.

**Per-operation request and response examples:** API contract index. No generic DTO in this document overrides module-specific validation.

## Warehouse replenishment and transfers — internal architecture

**Status: Proposed application design.** The database repo does not contain a NestJS HTTP implementation.

### Business behavior

Receiving and transfers create a traceable stock ledger and require location/lot scope.

### Components

| Component | Responsibility | Data affected | Failure outcome |
| --- | --- | --- | --- |
| `WarehouseController` (proposed) | Validate DTO and request context | Public API request only | 400/401/403 without partial mutation |
| `WarehouseUseCase` (proposed) | Enforce module business invariant | `warehouse.warehouses`, `warehouse.stock_transfers`, `warehouse.stock_transfer_items` | Domain status, do not guess provider truth |
| `WarehouseRepository` (proposed) | Scoped SQL transaction and concurrency guard | Exact migrated tables | Roll back on conflict or constraint error |
| `WarehouseIntegrationAdapter` (only when needed) | Map external IO and reconcile delivery | Outbox/inbox or verified provider record | Retries outside DB lock |

### Transaction and retry sequence

1. authorise sending/receiving warehouse.
2. validate source lot and transfer request.
3. reserve or transfer required quantity under lock.
4. record goods receipt/transfer and ledger.
5. reconcile variance instead of silently updating balance.

### Existing tables (candidate responsibilities)

- `warehouse.warehouses` — candidate entity; verify the exact operation and field set in the implementation review.
- `warehouse.stock_transfers` — candidate entity; verify the exact operation and field set in the implementation review.
- `warehouse.stock_transfer_items` — candidate entity; verify the exact operation and field set in the implementation review.
- `procurement.goods_receipts` — candidate entity; verify the exact operation and field set in the implementation review.
- `warehouse.stock_ledger` — candidate entity; verify the exact operation and field set in the implementation review.

### Related

HLD · States · Permissions

## Warehouse replenishment and transfers — observability

**Proposed runtime design:** Structured logs record correlation ID, module, operation, outcome code and elapsed time. Replace identifiers with approved pseudonymous references. No raw OTP, prescription text, secrets, payment credentials, addresses or GPS coordinates in logs.

**Candidate counters:** `warehouse_command_total{outcome}`, `warehouse_denied_total{reason}`, and `warehouse_provider_pending_total` when an external provider is involved. Names are proposed and require monitoring owner review.

**Actionable alerts:** persistent command rejection spikes, outbox backlog, stale integrations or reconciliation mismatches; thresholds are open questions, not fabricated service-level objectives.

**Monitoring design**

## Warehouse & Store Replenishment — permission model

**Actors:** Warehouse Manager, Warehouse Staff.

**Proposed service scope:** `staff_warehouse`. Roles are application concepts; existing PostgreSQL NOLOGIN capability roles form a separate lower-level authorization layer.

| Operation class | Required entitlement | Enforcement |
| --- | --- | --- |
| Read own/scoped data | Authenticated identity + object or location ownership | Controller + service + database guard where provided |
| Create / edit | Explicit module action grant, approved master and domain status | Policy decision before transaction |
| Override / refund / pharmacist action | Specialized staff permission and documented approval reason | Distinct privilege, immutable audit evidence |
| Export / sensitive view | Purpose-limited role, retention and access logging | Recheck at download/stream time |

**Core constraint:** Preserve transfer chain of custody across dispatch, in-transit and store receipt. A short shipment posts an exception, not an assumed full receipt. Advanced bin/wave workflows stay outside the agreed minimum. A customer cannot infer another customer's resource existence.

Do not connect app runtime through migration-owner credentials. Consult [roles and permissions](../../07-Engineering/Security.md).

## Warehouse & Store Replenishment — functional requirements

**Source:** the documented draft requirements.

**Status:** Draft requirements, not proof of final business acceptance. 🔴/🟡/🟢 priorities have been normalized as Must/Should/Could without changing their meaning.

| Feature | Priority in v0.1 | Statement | Dependency |
| --- | --- | --- | --- |
| `WH-01` | Must (draft) | Receive stock: batch, manufacturing and expiry dates, quantity, supplier invoice | Not stated |
| `WH-02` | Must (draft) | Replenishment queue: approve, dispatch with note, stock "in transit" | Not stated |
| `WH-03` | Must (draft) | Urgent runs, up to two extra a day | Not stated |
| `WH-04` | Must (draft) | Pick, pack and dispatch fallback online orders | Not stated |
| `WH-05` | Could (draft) | Basic stock audit | Not stated |

### Interactions and acceptance basis

The user performs: Receive lot; approve transfer; dispatch; reconcile shortage. Server-side enforcement must preserve this invariant: **Preserve transfer chain of custody across dispatch, in-transit and store receipt. A short shipment posts an exception, not an assumed full receipt. Advanced bin/wave workflows stay outside the agreed minimum.**

A feature becomes implementation-ready only after its inputs (especially any dependency listed above), permissions, workflow outcome, API body and database transaction are resolved. Confirm business thresholds before coding: a field existing in SQL is not proof that its value was approved.

See requirement coverage and test IDs.

## Warehouse replenishment and transfers — request sequence

**Proposed design**, not a diagram of deployed services. Business-specific steps appear in Internal Architecture.

```mermaid
sequenceDiagram
  participant A as Warehouse receiver
  participant O as Warehouse receiving
  participant D as PostgreSQL
  A->>O: Receive actual supplier batch
  O->>D: Check site supplier invoice expiry and quality evidence
  alt Gate fails or current version conflicts
    O-->>A: Hold or reject goods with discrepancy
  else Gate satisfied
    O->>D: Coordinate Inventory receipt for accepted quantity
    D-->>O: Committed evidence
    O-->>A: Accepted receipt and separate shortage evidence
  end
```

## Warehouse & Store Replenishment — service design

**Proposed NestJS module:** `WarehouseModule` with a controller, application service, authorization policy, repository and adapters. The supplied database code is a schema/validation library; no running HTTP controller was found in Archive 2.

### Candidate service methods

- `API-056: receive_lots_with_documents(actor_context, validated_command, expected_version) -> Result`
- `API-057: review_replenishment_queue(actor_context, validated_command, expected_version) -> Result`
- `API-058: dispatch_authorized_transfer(actor_context, validated_command, expected_version) -> Result`
- `API-059: fallback_online_dispatch_list(actor_context, validated_command, expected_version) -> Result`

### Transaction and integration contract

For each mutation: authenticate actor, validate inputs, read affected rows with a lock/version check, verify policy, update the minimum relevant rows and immutable audit/outbox in one transaction. A remote gateway, storage or GPS call should be performed outside the locked transaction and reconciled on callback/timeout. Use PostgreSQL to reject invalid writes even if application validation is bypassed.

**Module invariant:** Preserve transfer chain of custody across dispatch, in-transit and store receipt. A short shipment posts an exception, not an assumed full receipt. Advanced bin/wave workflows stay outside the agreed minimum.

**Timeouts/retries:** configure per provider, use exponential backoff with caps for safe reads and idempotent messages; never blindly repeat charge/refund/cash state changes. A dead-letter queue is an optional BullMQ operating pattern because BullMQ/Redis are selected in the checklist, but exact job topology needs signoff.

**Telemetry:** actor pseudonym, request ID, action, state transition latency, retries and failure category; redact protected clinical and payment contents. See [database usage](../../04-Database/Module-Mapping.md) and Monitoring.

## Warehouse & Store Replenishment — state and transition policy

**Status:** State boundaries are derived from the unified order journey and existing SQL CHECK/trigger contracts; the following is a service design, not a claim that a single enum exists.

```mermaid
flowchart TD
  A["Receive actual supplier batch"] --> B{"Usable accepted quantity evidenced?"}
  B -->|No| C["Hold or reject goods with discrepancy"]
  B -->|Yes| D["Coordinate Inventory receipt for accepted quantity"]
  D --> E["Accepted receipt and separate shortage evidence"]
```

**Module-specific invariant:** Preserve transfer chain of custody across dispatch, in-transit and store receipt. A short shipment posts an exception, not an assumed full receipt. Advanced bin/wave workflows stay outside the agreed minimum.

Each transition must record the prior state, target state, reason where required, actor, accepted version and timestamp. A second command on the same state must either replay the prior idempotent result or fail with `409`. A failed external callback cannot roll an accepted state backward; reconcile with authoritative provider evidence.

When an order changes, keep clinical, payment, inventory, fulfillment and delivery statuses separate, then derive one safe user-visible projection.

This flow shows command gates, not an entity enum. Legal entity transitions and recovery are specified in [state contracts](../../07-Engineering/State-and-Recovery-Contracts.md); the table catalog supplies actual stored values.

## Warehouse & Store Replenishment — verification and acceptance

**Candidate test IDs** derived one-to-one from the v0.1 feature IDs. They are test-design work items, not claims that the tests have been implemented. Database-level tests reported in the source do not replace HTTP and browser tests.

| Stable test ID | Behavior | Expected result |
| --- | --- | --- |
| `TC-WH-01-OK` | Receive stock: batch, manufacturing and expiry dates, quantity, supplier invoice | Receipt records accepted supplier quantities, invoice and eligible lots |
| `TC-WH-01-DENY` | Missing expiry or failed quality check | Unusable receipt cannot become orderable stock; Receiving/Pharmacy reviews; supplier discrepancy retained |
| `TC-WH-02-OK` | Replenishment queue: approve, dispatch with note, stock "in transit" | Approved transfer dispatch records in-transit stock and note |
| `TC-WH-02-DENY` | Dispatch repeats before destination receipt | One dispatch; destination gets no saleable credit until receipt; Warehouse/Store reconciles transfer quantities |
| `TC-WH-03-OK` | Urgent runs, up to two extra a day | Urgent runs follow approved capacity and scope |
| `TC-WH-03-DENY` | A third extra run is requested under draft two-run wording | No invented operational approval; explicit scheduling exception; Operations approves capacity/limit under D-002 |
| `TC-WH-04-OK` | Pick, pack and dispatch fallback online orders | Fallback order uses licensed-site and exact fulfillment gates |
| `TC-WH-04-DENY` | Warehouse has stock but lacks approved dispensing license | No fallback pick/dispatch authorization; Operations selects eligible site or resolves with Pharmacy |
| `TC-WH-05-OK` | Basic stock audit | Scoped audit records actual counts and approved discrepancies |
| `TC-WH-05-DENY` | Count disagrees with ledger | No silent stock correction or erased movement history; Inventory manager reviews adjustment evidence |

### Cross-module contract tests

- Verify authenticated customer/staff/location ownership using actual restricted runtime roles.
- Verify concurrency and duplicate idempotency behavior against an isolated PostgreSQL database installed from the canonical SQL.
- Verify safe retry when callbacks or files arrive late or malformed.
- Verify audit and notification records are based on committed state and contain no confidential payloads.
- Verify this invariant: **Preserve transfer chain of custody across dispatch, in-transit and store receipt. A short shipment posts an exception, not an assumed full receipt. Advanced bin/wave workflows stay outside the agreed minimum.**

Coverage state: **Designed, not executed for the proposed application**. Link individual results to the associated test ID and requirement before go-live. Read [test strategy](../../07-Engineering/Testing.md).

## Warehouse & Store Replenishment — validation checkpoints

| Boundary | Required validation | Rejection outcome |
| --- | --- | --- |
| Input | Required fields, type, size, allowed format and business master codes | `400/422`; no write |
| Actor | Session validity, role, location, customer/patient/parcel ownership | `401/403/404`; audit |
| Version | Accepted order revision or row version matches, if state-changing | `409`; fetch current state |
| Domain | Preserve transfer chain of custody across dispatch, in-transit and store receipt. A short shipment posts an exception, not an assumed full receipt. Advanced bin/wave workflows stay outside the agreed minimum. | Explicit blocked/pending/error status |
| Database | FK, PK, UNIQUE, CHECK, trigger and RLS outcome | Safe conflict/business error; rollback |
| Integration | Authenticated provider/callback, idempotency key and settled evidence | Keep pending; reconciliation task |

**Requirements:** `WH-01`, `WH-02`, `WH-03`, `WH-04`, `WH-05`. Never trust browser-supplied patient, clinical decision, backend actor context, price or available quantity. Refer to Testing for negative tests.

## Warehouse & Store Replenishment — operational workflows

**Entry points:** Receive lot; approve transfer; dispatch; reconcile shortage.

**User group:** Warehouse Manager, Warehouse Staff. The following source-defined order journey stages identify primary ownership; supporting modules also participate without necessarily owning the stage.

This module supports shared controls across multiple stages; no single stage is exclusively owned.

### Shared processing rules

The requested action is first validated against user scope, current state and approved business master data. Read required evidence from real migrated tables; change only data this module owns; publish a safe event or notify the next module after commit.

**Alternative paths:** missing required input keeps the process actionable; a stale or duplicate request is deduplicated; another actor's update returns a version conflict; external unavailability produces a pending/blocked state. Prescriptions, inventory, payments and logistics never independently set the whole order to delivered.

**Module-specific rule:** Preserve transfer chain of custody across dispatch, in-transit and store receipt. A short shipment posts an exception, not an assumed full receipt. Advanced bin/wave workflows stay outside the agreed minimum.

See [state transitions](../../07-Engineering/State-and-Recovery-Contracts.md) and [unified order](../../00-Business-Guide/Pharmville-Complete-Business-Flow.md).
