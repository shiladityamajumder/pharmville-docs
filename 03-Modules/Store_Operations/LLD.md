# Store Operations LLD

<!-- ERD-NAV-START -->

## Database relationships

[`fulfillment` ERD](../../04-Database/ER-Diagrams/09-fulfillment.md) · [`warehouse` ERD](../../04-Database/ER-Diagrams/24-warehouse.md) · [`procurement` ERD](../../04-Database/ER-Diagrams/20-procurement.md) · [FK catalog](../../04-Database/ER-Diagrams/Relationship-Catalog.md)

These diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](../../04-Database/Migrations.md) for the supplied source and deployment verification limits.

<!-- ERD-NAV-END -->

[Business flow](../../00-Business-Guide/Store-and-Warehouse.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## Picking, packing and store replenishment — implementation acceptance

> [!NOTE]
> **Proposed conditions for engineering handoff; never imply QA passed.**

### Draft features

- **STO-01 / REQ-052:** Incoming order queue for my store, with sound alert (Must (draft)).
- **STO-02 / REQ-053:** Accept order, pick list, mark packed, hand over to rider (Must (draft)).
- **STO-03 / REQ-054:** Raise replenishment request (normal or urgent) (Must (draft)).
- **STO-04 / REQ-055:** Confirm receipt of a transfer; record shortages (Must (draft)).
- **STO-05 / REQ-056:** My store's stock, with low-stock and near-expiry alerts (Must (draft)).

### Required release checks

- Authorised happy path persists exactly the intended state.
- Invalid, cross-account and cross-location requests leave authoritative rows unchanged.
- Concurrent duplicate requests do not create duplicate money, stock or order effects.
- File, prescription and patient data are not exposed to unauthorised roles.
- Recoverable provider failure exposes a pending/retryable state; never claims success.
- Audit/trace data contains public references, not credentials or sensitive document contents.

**Module test scenarios**

## Store Picking & Replenishment — HTTP API responsibilities

All routes below are **Proposed REST v1 contracts**. The database repository does not implement them. Public UUIDs identify resources; staff scope and patient/order ownership are checked at each handler, not inferred from URL paths.

- `API-044` `GET /v1/staff/store/orders` — Load store work queue
- `API-045` `POST /v1/staff/store/orders/{order_id}/accept` — Accept authorized work
- `API-046` `POST /v1/staff/store/picks/{pick_id}/scan` — Verify exact SKU/lot
- `API-047` `POST /v1/staff/store/packs/{pack_id}/close` — Close validated pack
- `API-048` `POST /v1/staff/store/replenishments` — Request stock
- `API-049` `POST /v1/staff/store/transfers/{transfer_id}/receipt` — Confirm shortages and receipt

### Cross-cutting request contract

Writes require validated body, stable intent key, expected current version when appropriate, auditable actor identity and an explicit outcome. Reads use safe pagination and permission-filtered fields. `401` indicates no valid session; `403/404` denied scope; `409` conflict; `422` business validation; `503` unknown upstream outcome. Read [api conventions](../../05-APIs/README.md) before implementing the endpoint.

**Business gate:** Use order revision + license + approved P lines + reserved lot/bin + actor scope at each pick/pack command. A simple UI “packed” button cannot override database guards. For actual response fields, see the linked illustrative contract and approve a typed OpenAPI schema before implementation.

## Store Picking & Replenishment — business logic and invariants

**Rule origin:** the documented draft requirements and database migration guards. Distinguish a **confirmed database guard** from a **proposed API orchestration** and **open numeric policy**.

### Core procedure

1. Authenticate the actor and resolve server-owned tenant/location/patient permission.
2. Re-read the relevant product, order, document, stock or ledger state from the owning tables.
3. Reject incomplete or stale input; validate the latest accepted revision and current classification where relevant.
4. Apply the module invariant: **Use order revision + license + approved P lines + reserved lot/bin + actor scope at each pick/pack command. A simple UI “packed” button cannot override database guards.**
5. In a transaction, persist the minimal authoritative rows, version and audit outcome; publish notifications after commit.
6. Return a scoped read model; expose only approved information to the caller.

### Features implemented by this rule set

`STO-01`, `STO-02`, `STO-03`, `STO-04`, `STO-05` (see full requirement descriptions).

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

## Store Picking & Replenishment — internal components

**Status:** Proposed NestJS modular-monolith design informed by the decided stack in the master decisions checklist. This is not code already implemented in the SQLAlchemy repository.

| Component | Responsibility | Failure boundary |
| --- | --- | --- |
| HTTP controller / DTO validator | Accept typed requests for store picking & replenishment, reject malformed payloads | `400/422`, no database change |
| Use-case service | Execute: Accept work; pick approved SKU/batch; receive transfers | Explicit domain errors, no invented outcomes |
| Policy/authorization service | Enforce user role, object ownership, business eligibility | `403/404` and audit denied attempt |
| Domain repository | Execute scoped PostgreSQL reads/writes within a transaction | Retry only on safe concurrency errors |
| Outbox / integration adapter | Publish committed changes toward other modules or third parties | Durable retry and dead-letter review if adopted |

### Boundaries

Use order revision + license + approved P lines + reserved lot/bin + actor scope at each pick/pack command. A simple UI “packed” button cannot override database guards. Public controllers must not call database workflow functions with arbitrary SQL and must not accept a caller-supplied `actor_user_id`.

Network IO belongs outside long-lived locks. Modules should depend on domain interfaces, not on each other's ORM entities. Consult Dependencies and [architecture overview](../../02-Architecture/System-HLD.md).

## Store Picking & Replenishment — existing database usage

**Confirmed database:** 24 PostgreSQL schemas; SQL migration authority the checked-in SQL migration history. The tables below exist, but **a schema-domain association does not automatically mean this module owns every row or has write rights**. The database repository is not an HTTP service.

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
- `warehouse.aisles` — columns · contracts
- `warehouse.bins` — columns · contracts

### Ownership, transactions and change control

Proposed owning service: `Store_Operations`. Main read concerns: accept store queue, pick/pack, request replenishment and acknowledge transfers. Writes must be restricted by the actual foreign keys, CHECKs, unique contracts, crosswalks, policy and trigger guards.

Use one transaction per domain state transition, use an outbox for reliable cross-module publication, and make any external retry idempotent.

**Safety:** Use order revision + license + approved P lines + reserved lot/bin + actor scope at each pick/pack command. A simple UI “packed” button cannot override database guards.

Internal ID strategy: `identity.users.id` is UUID; most other tables have BIGINT internal PK with original immutable UUID alias. Never cast UUID to BIGINT or expose DB internal IDs as authorization tokens. All schema changes require new forward-only SQL migration under the source repo and a fresh PG15/PG18 parity test. Related [migration strategy](../../04-Database/Migrations.md).

## Store Picking & Replenishment — dependencies and ownership

**Underlying schemas:** `warehouse`, `fulfillment`, `procurement`. These schemas are shared data domains; shared reads are not automatic write rights. Candidate collaborator modules are inferred from overlapping schema use:

- Cart_Checkout
- Customer_Orders
- Delivery_Operations
- Inventory
- Order_Operations
- Warehouse

### Communication rules

Use the owning service interface for business changes rather than making uncontrolled cross-module writes. In the chosen modular-monolith style, synchronous application calls can remain in-process. BullMQ/Redis jobs serve slow notifications and integrations after commit; they should not become the source of order, payment, stock or clinical truth.

Build independent adapters for Cashfree, POS/Techsmith, MSG91 and driver APIs; failures must remain visible.

**Data-access contract:** Use order revision + license + approved P lines + reserved lot/bin + actor scope at each pick/pack command. A simple UI “packed” button cannot override database guards.. Related: [module dependencies](../../02-Architecture/Module-Dependencies.md) and [database usage](../../04-Database/Module-Mapping.md).

## Store Picking & Replenishment — domain objects and DTO boundaries

**Proposed objects, not new database tables.** A domain object is a service-level business concept; a DTO is a validated data transfer object (API input/output). Do not confuse them with the Python SQLAlchemy models used for schema verification.

| Proposed object | Source of truth / evidence | Rules |
| --- | --- | --- |
| `Store_OperationsCommand` | Authenticated HTTP request and expected version | Includes actor context, idempotency key and validated business input |
| `Store_OperationsAggregate` | Domain rows listed in Database Usage | Represents the current authoritative business facts |
| `Store_OperationsPolicy` | Approved master/role records and product rules | Use order revision + license + approved P lines + reserved lot/bin + actor scope at each pick/pack command. A simple UI “packed” button cannot override database guards. |
| `Store_OperationsReadModel` | Role-filtered current state | Removes protected fields and translates internal statuses |
| `Store_OperationsEvent` | Committed state transition and audit ID | Events carry references and versions, not clinical documents |

**Existing representative tables:** `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`, `fulfillment.fulfillment_orders`, `fulfillment.pack_tasks`, `fulfillment.package_items`, `fulfillment.packages`, `fulfillment.pick_task_items`, `fulfillment.pick_tasks`.

Internal BIGINT primary keys are never used as authorization credentials, and original UUID public references must remain stable. Any DTO field not directly supported by a confirmed column must be labelled proposed until the API team approves the mapping. See [database usage](../../04-Database/Module-Mapping.md).

## Store Picking & Replenishment — failure handling

**Primary rule:** Use order revision + license + approved P lines + reserved lot/bin + actor scope at each pick/pack command. A simple UI “packed” button cannot override database guards.

- **Missing or invalid input:** respond with a field-specific problem code; do not leak sensitive data and do not write partial state.
- **Unauthorized object or location:** return `403` or privacy-safe `404`; record the attempted privileged action.
- **Duplicate submission:** return the persisted result when key + payload match; reject key reuse with different payload.
- **Stale/concurrent change:** database version/FK/CHECK guard must resolve a single winner; caller reloads latest projection.
- **Partial external failure:** leave the aggregate pending, never mark payment/stock/delivery success by assumption. Retry verified idempotent adapter calls; otherwise reconcile manually.
- **Safety or compliance policy unknown:** fail closed. Route staff to an exception queue and customer to a non-misleading status.

Use structured problem codes, request ID, retryability category and operator runbook reference. Sensitive Rx, financial tokens, OTPs and location traces must not be placed into logs. See [error responses](../../05-APIs/README.md#standard-problem-response-behavior) and [incident triage](../../07-Engineering/Release-and-Incident-Handling.md).

## Picking, packing and store replenishment — proposed interfaces and DTOs

**Business context:** Store actors can mutate only scoped tasks and must report actual shortages, never silently substitute.

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

**Existing table candidates:** `fulfillment.pick_tasks`, `fulfillment.pack_tasks`, `fulfillment.packages`, `warehouse.stock_balances`, `procurement.purchase_requisitions`.

**Per-operation request and response examples:** API contract index. No generic DTO in this document overrides module-specific validation.

## Picking, packing and store replenishment — internal architecture

**Status: Proposed application design.** The database repo does not contain a NestJS HTTP implementation.

### Business behavior

Store actors can mutate only scoped tasks and must report actual shortages, never silently substitute.

### Components

| Component | Responsibility | Data affected | Failure outcome |
| --- | --- | --- | --- |
| `Store_OperationsController` (proposed) | Validate DTO and request context | Public API request only | 400/401/403 without partial mutation |
| `Store_OperationsUseCase` (proposed) | Enforce module business invariant | `fulfillment.pick_tasks`, `fulfillment.pack_tasks`, `fulfillment.packages` | Domain status, do not guess provider truth |
| `Store_OperationsRepository` (proposed) | Scoped SQL transaction and concurrency guard | Exact migrated tables | Roll back on conflict or constraint error |
| `Store_OperationsIntegrationAdapter` (only when needed) | Map external IO and reconcile delivery | Outbox/inbox or verified provider record | Retries outside DB lock |

### Transaction and retry sequence

1. claim scoped pick/pack task.
2. read reserved lot or physical stock.
3. record picked quantities and exceptions.
4. confirm pack and handoff identity.
5. commit stock ledger changes and audit.

### Existing tables (candidate responsibilities)

- `fulfillment.pick_tasks` — candidate entity; verify the exact operation and field set in the implementation review.
- `fulfillment.pack_tasks` — candidate entity; verify the exact operation and field set in the implementation review.
- `fulfillment.packages` — candidate entity; verify the exact operation and field set in the implementation review.
- `warehouse.stock_balances` — candidate entity; verify the exact operation and field set in the implementation review.
- `procurement.purchase_requisitions` — candidate entity; verify the exact operation and field set in the implementation review.

### Related

HLD · States · Permissions

## Picking, packing and store replenishment — observability

**Proposed runtime design:** Structured logs record correlation ID, module, operation, outcome code and elapsed time. Replace identifiers with approved pseudonymous references. No raw OTP, prescription text, secrets, payment credentials, addresses or GPS coordinates in logs.

**Candidate counters:** `store_operations_command_total{outcome}`, `store_operations_denied_total{reason}`, and `store_operations_provider_pending_total` when an external provider is involved. Names are proposed and require monitoring owner review.

**Actionable alerts:** persistent command rejection spikes, outbox backlog, stale integrations or reconciliation mismatches; thresholds are open questions, not fabricated service-level objectives.

**Monitoring design**

## Store Picking & Replenishment — permission model

**Actors:** Store Manager, Store Staff.

**Proposed service scope:** `staff_store`. Roles are application concepts; existing PostgreSQL NOLOGIN capability roles form a separate lower-level authorization layer.

| Operation class | Required entitlement | Enforcement |
| --- | --- | --- |
| Read own/scoped data | Authenticated identity + object or location ownership | Controller + service + database guard where provided |
| Create / edit | Explicit module action grant, approved master and domain status | Policy decision before transaction |
| Override / refund / pharmacist action | Specialized staff permission and documented approval reason | Distinct privilege, immutable audit evidence |
| Export / sensitive view | Purpose-limited role, retention and access logging | Recheck at download/stream time |

**Core constraint:** Use order revision + license + approved P lines + reserved lot/bin + actor scope at each pick/pack command. A simple UI “packed” button cannot override database guards. A customer cannot infer another customer's resource existence. Do not connect app runtime through migration-owner credentials. Consult [roles and permissions](../../07-Engineering/Security.md).

## Store Picking & Replenishment — functional requirements

**Source:** the documented draft requirements.

**Status:** Draft requirements, not proof of final business acceptance. 🔴/🟡/🟢 priorities have been normalized as Must/Should/Could without changing their meaning.

| Feature | Priority in v0.1 | Statement | Dependency |
| --- | --- | --- | --- |
| `STO-01` | Must (draft) | Incoming order queue for my store, with sound alert | Q24 (store devices) |
| `STO-02` | Must (draft) | Accept order, pick list, mark packed, hand over to rider | Not stated |
| `STO-03` | Must (draft) | Raise replenishment request (normal or urgent) | Which products stores request |
| `STO-04` | Must (draft) | Confirm receipt of a transfer; record shortages | Not stated |
| `STO-05` | Must (draft) | My store's stock, with low-stock and near-expiry alerts | Not stated |

### Interactions and acceptance basis

The user performs: Accept work; pick approved SKU/batch; receive transfers. Server-side enforcement must preserve this invariant: **Use order revision + license + approved P lines + reserved lot/bin + actor scope at each pick/pack command. A simple UI “packed” button cannot override database guards.**

A feature becomes implementation-ready only after its inputs (especially any dependency listed above), permissions, workflow outcome, API body and database transaction are resolved. Confirm business thresholds before coding: a field existing in SQL is not proof that its value was approved.

See requirement coverage and test IDs.

## Picking, packing and store replenishment — request sequence

**Proposed design**, not a diagram of deployed services. Business-specific steps appear in Internal Architecture.

```mermaid
sequenceDiagram
  participant A as Store worker
  participant O as Fulfillment
  participant D as PostgreSQL
  A->>O: Complete exact pick and pack
  O->>D: Check scoped task P evidence license and reserved batch
  alt Gate fails or current version conflicts
    O-->>A: Stop and report shortage or mismatch
  else Gate satisfied
    O->>D: Record actual complete nonempty package
    D-->>O: Committed evidence
    O-->>A: Prepared package for gated dispatch
  end
```

## Store Picking & Replenishment — service design

**Proposed NestJS module:** `Store_OperationsModule` with a controller, application service, authorization policy, repository and adapters. The supplied database code is a schema/validation library; no running HTTP controller was found in Archive 2.

### Candidate service methods

- `API-044: load_store_work_queue(actor_context, validated_command, expected_version) -> Result`
- `API-045: accept_authorized_work(actor_context, validated_command, expected_version) -> Result`
- `API-046: verify_exact_sku/lot(actor_context, validated_command, expected_version) -> Result`
- `API-047: close_validated_pack(actor_context, validated_command, expected_version) -> Result`
- `API-048: request_stock(actor_context, validated_command, expected_version) -> Result`
- `API-049: confirm_shortages_and_receipt(actor_context, validated_command, expected_version) -> Result`

### Transaction and integration contract

For each mutation: authenticate actor, validate inputs, read affected rows with a lock/version check, verify policy, update the minimum relevant rows and immutable audit/outbox in one transaction. A remote gateway, storage or GPS call should be performed outside the locked transaction and reconciled on callback/timeout. Use PostgreSQL to reject invalid writes even if application validation is bypassed.

**Module invariant:** Use order revision + license + approved P lines + reserved lot/bin + actor scope at each pick/pack command. A simple UI “packed” button cannot override database guards.

**Timeouts/retries:** configure per provider, use exponential backoff with caps for safe reads and idempotent messages; never blindly repeat charge/refund/cash state changes. A dead-letter queue is an optional BullMQ operating pattern because BullMQ/Redis are selected in the checklist, but exact job topology needs signoff.

**Telemetry:** actor pseudonym, request ID, action, state transition latency, retries and failure category; redact protected clinical and payment contents. See [database usage](../../04-Database/Module-Mapping.md) and Monitoring.

## Store Picking & Replenishment — state and transition policy

**Status:** State boundaries are derived from the unified order journey and existing SQL CHECK/trigger contracts; the following is a service design, not a claim that a single enum exists.

```mermaid
flowchart TD
  A["Complete exact pick and pack"] --> B{"Exact current eligible items packed?"}
  B -->|No| C["Stop and report shortage or mismatch"]
  B -->|Yes| D["Record actual complete nonempty package"]
  D --> E["Prepared package for gated dispatch"]
```

**Module-specific invariant:** Use order revision + license + approved P lines + reserved lot/bin + actor scope at each pick/pack command. A simple UI “packed” button cannot override database guards.

Each transition must record the prior state, target state, reason where required, actor, accepted version and timestamp. A second command on the same state must either replay the prior idempotent result or fail with `409`. A failed external callback cannot roll an accepted state backward; reconcile with authoritative provider evidence.

When an order changes, keep clinical, payment, inventory, fulfillment and delivery statuses separate, then derive one safe user-visible projection.

This flow shows command gates, not an entity enum. Legal entity transitions and recovery are specified in [state contracts](../../07-Engineering/State-and-Recovery-Contracts.md); the table catalog supplies actual stored values.

## Store Picking & Replenishment — verification and acceptance

**Candidate test IDs** derived one-to-one from the v0.1 feature IDs. They are test-design work items, not claims that the tests have been implemented. Database-level tests reported in the source do not replace HTTP and browser tests.

| Stable test ID | Behavior | Expected result |
| --- | --- | --- |
| `TC-STO-01-OK` | Incoming order queue for my store, with sound alert | Scoped incoming queue shows current tasks and alerts |
| `TC-STO-01-DENY` | Alert fails while order is committed | Order remains in queue; alert retry creates no duplicate task; Store refreshes queue; Notifications repairs alert |
| `TC-STO-02-OK` | Accept order, pick list, mark packed, hand over to rider | Exact accepted items are picked/packed and handed to assigned rider with gates |
| `TC-STO-02-DENY` | Wrong batch or stale P approval is scanned | Packing blocked; no stock commit or dispatch for mismatched evidence; Store reports discrepancy; Inventory/Pharmacy resolves |
| `TC-STO-03-OK` | Raise replenishment request (normal or urgent) | Scoped normal/urgent replenishment request records quantities once |
| `TC-STO-03-DENY` | Store submits the same replenishment after lost response | One request per intent, no duplicate dispatch demand; Store checks recorded request; Warehouse reviews it |
| `TC-STO-04-OK` | Confirm receipt of a transfer; record shortages | Transfer receipt credits actual accepted quantity once |
| `TC-STO-04-DENY` | Receiver reports fewer packs than dispatched | Shortage remains recorded; missing stock not credited; Warehouse/Inventory investigates in-transit discrepancy |
| `TC-STO-05-OK` | My store's stock, with low-stock and near-expiry alerts | Store stock/alerts are location and batch scoped |
| `TC-STO-05-DENY` | Staff requests another store’s near-expiry report | No cross-location disclosure or adjustment authority; Manager reviews scope; Inventory owns stock records |

### Cross-module contract tests

- Verify authenticated customer/staff/location ownership using actual restricted runtime roles.
- Verify concurrency and duplicate idempotency behavior against an isolated PostgreSQL database with authoritative migrations.
- Verify safe retry when callbacks or files arrive late or malformed.
- Verify audit and notification records are based on committed state and contain no confidential payloads.
- Verify this invariant: **Use order revision + license + approved P lines + reserved lot/bin + actor scope at each pick/pack command. A simple UI “packed” button cannot override database guards.**

Coverage state: **Designed, not executed for the proposed application**. Link individual results to the associated test ID and requirement before go-live. Read [test strategy](../../07-Engineering/Testing.md).

## Store Picking & Replenishment — validation checkpoints

| Boundary | Required validation | Rejection outcome |
| --- | --- | --- |
| Input | Required fields, type, size, allowed format and business master codes | `400/422`; no write |
| Actor | Session validity, role, location, customer/patient/parcel ownership | `401/403/404`; audit |
| Version | Accepted order revision or row version matches, if state-changing | `409`; fetch current state |
| Domain | Use order revision + license + approved P lines + reserved lot/bin + actor scope at each pick/pack command. A simple UI “packed” button cannot override database guards. | Explicit blocked/pending/error status |
| Database | FK, PK, UNIQUE, CHECK, trigger and RLS outcome | Safe conflict/business error; rollback |
| Integration | Authenticated provider/callback, idempotency key and settled evidence | Keep pending; reconciliation task |

**Requirements:** `STO-01`, `STO-02`, `STO-03`, `STO-04`, `STO-05`. Never trust browser-supplied patient, clinical decision, backend actor context, price or available quantity. Refer to Testing for negative tests.

## Store Picking & Replenishment — operational workflows

**Entry points:** Accept work; pick approved SKU/batch; receive transfers.

**User group:** Store Manager, Store Staff. The following source-defined order journey stages identify primary ownership; supporting modules also participate without necessarily owning the stage.

- S20 — Pick the exact ordered items
- S21 — Fix a picking mistake or shortage
- S22 — Check, invoice and seal the package
- S30 — Receive and inspect returned items

### Shared processing rules

The requested action is first validated against user scope, current state and approved business master data. Read required evidence from real migrated tables; change only data this module owns; publish a safe event or notify the next module after commit.

**Alternative paths:** missing required input keeps the process actionable; a stale or duplicate request is deduplicated; another actor's update returns a version conflict; external unavailability produces a pending/blocked state. Prescriptions, inventory, payments and logistics never independently set the whole order to delivered.

**Module-specific rule:** Use order revision + license + approved P lines + reserved lot/bin + actor scope at each pick/pack command. A simple UI “packed” button cannot override database guards.

See [state transitions](../../07-Engineering/State-and-Recovery-Contracts.md) and [unified order](../../00-Business-Guide/Pharmville-Complete-Business-Flow.md).

## Critical recovery scenarios

**Designed; NOT RUN.** Run against approved policy fixtures and actual restricted database roles. Inspect customer/staff result, state/history, stock and money effects together.

| Test | Input / interruption | Expected result and record assertions |
| --- | --- | --- |
| `TC-STO-02-01` | Exact held lot becomes expired/blocked before scan or pack closure | Stop pick/pack completion and dispatch for that lot; record discrepancy, preserve money facts, and route Inventory/Pharmacy/Operations to eligible supply or approved compensation. |
