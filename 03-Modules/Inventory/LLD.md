# Inventory LLD

<!-- ERD-NAV-START -->

## Database relationships

[`warehouse` ERD](../../04-Database/ER-Diagrams/24-warehouse.md) · [`catalog` ERD](../../04-Database/ER-Diagrams/02-catalog.md) · [`procurement` ERD](../../04-Database/ER-Diagrams/20-procurement.md) · [FK catalog](../../04-Database/ER-Diagrams/Relationship-Catalog.md)

These diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](../../04-Database/Migrations.md) for the supplied source and deployment verification limits.

<!-- ERD-NAV-END -->

[Business flow](../../00-Business-Guide/Inventory-and-Stock.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## Lot-aware inventory and reservation — implementation acceptance

> [!NOTE]
> **Proposed conditions for engineering handoff; never imply QA passed.**

### Draft features

- **INV-01 / REQ-057:** Stock per location and batch, with manufacturing and expiry dates (Must (draft)).
- **INV-02 / REQ-058:** Stock ledger: every movement recorded; stock is the sum of the ledger (Must (draft)).
- **INV-03 / REQ-059:** Allocate nearest-expiry batch first; block batches below minimum shelf life (Must (draft)).
- **INV-04 / REQ-060:** Stock adjustments with reason; manager approval above a threshold (Must (draft)).
- **INV-05 / REQ-061:** Low-stock and near-expiry alerts (Must (draft)).
- **INV-06 / REQ-062:** Opening stock import per location (Must (draft)).
- **INV-07 / REQ-063:** Stock sync with Techsmith (Must (draft)).

### Required release checks

- Authorised happy path persists exactly the intended state.
- Invalid, cross-account and cross-location requests leave authoritative rows unchanged.
- Concurrent duplicate requests do not create duplicate money, stock or order effects.
- File, prescription and patient data are not exposed to unauthorised roles.
- Recoverable provider failure exposes a pending/retryable state; never claims success.
- Audit/trace data contains public references, not credentials or sensitive document contents.

**Module test scenarios**

## Inventory & Stock Reservations — HTTP API responsibilities

All routes below are **Proposed REST v1 contracts**. The database repository does not implement them. Public UUIDs identify resources; staff scope and patient/order ownership are checked at each handler, not inferred from URL paths.

- `API-050` `GET /v1/staff/inventory` — View scoped batch stock
- `API-051` `POST /v1/staff/inventory/observations` — Ingest authoritative POS observation
- `API-052` `POST /v1/internal/inventory/reservations` — Make concurrency-safe hold
- `API-053` `POST /v1/internal/inventory/reservations/{reservation_id}/release` — Release expired hold
- `API-054` `POST /v1/staff/inventory/adjustments` — Adjust with reason and approval
- `API-055` `GET /v1/staff/inventory/alerts` — View expiry/low-stock alerts

### Cross-cutting request contract

Writes require validated body, stable intent key, expected current version when appropriate, auditable actor identity and an explicit outcome. Reads use safe pagination and permission-filtered fields. `401` indicates no valid session; `403/404` denied scope; `409` conflict; `422` business validation; `503` unknown upstream outcome. Read [api conventions](../../05-APIs/README.md) before implementing the endpoint.

**Business gate:** Authoritative location-specific POS observation and an owner-approved freshness policy are prerequisites to reservation. Lock exactly the stock rows/hold state; reconcile ledger and physical stock. For actual response fields, see the linked illustrative contract and approve a typed OpenAPI schema before implementation.

## Inventory & Stock Reservations — business logic and invariants

**Rule origin:** the documented draft requirements and database migration guards. Distinguish a **confirmed database guard** from a **proposed API orchestration** and **open numeric policy**.

### Core procedure

1. Authenticate the actor and resolve server-owned tenant/location/patient permission.
2. Re-read the relevant product, order, document, stock or ledger state from the owning tables.
3. Reject incomplete or stale input; validate the latest accepted revision and current classification where relevant.
4. Apply the module invariant: **Authoritative location-specific POS observation and an owner-approved freshness policy are prerequisites to reservation. Lock exactly the stock rows/hold state; reconcile ledger and physical stock.**
5. In a transaction, persist the minimal authoritative rows, version and audit outcome; publish notifications after commit.
6. Return a scoped read model; expose only approved information to the caller.

### Features implemented by this rule set

`INV-01`, `INV-02`, `INV-03`, `INV-04`, `INV-05`, `INV-06`, `INV-07` (see full requirement descriptions).

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

## Inventory & Stock Reservations — internal components

**Status:** Proposed NestJS modular-monolith design informed by the decided stack in the master decisions checklist. This is proposed application design; the validated standalone SQL is structure, not an implemented API.

| Component | Responsibility | Failure boundary |
| --- | --- | --- |
| HTTP controller / DTO validator | Accept typed requests for inventory & stock reservations, reject malformed payloads | `400/422`, no database change |
| Use-case service | Execute: Observe authoritative POS; reserve; release; adjust with reason | Explicit domain errors, no invented outcomes |
| Policy/authorization service | Enforce user role, object ownership, business eligibility | `403/404` and audit denied attempt |
| Domain repository | Execute scoped PostgreSQL reads/writes within a transaction | Retry only on safe concurrency errors |
| Outbox / integration adapter | Publish committed changes toward other modules or third parties | Durable retry and dead-letter review if adopted |

### Boundaries

Authoritative location-specific POS observation and an owner-approved freshness policy are prerequisites to reservation. Lock exactly the stock rows/hold state; reconcile ledger and physical stock. Public controllers must not call database workflow functions with arbitrary SQL and must not accept a caller-supplied `actor_user_id`.

Network IO belongs outside long-lived locks. Modules should depend on domain interfaces, not on each other's ORM entities. Consult Dependencies and [architecture overview](../../02-Architecture/System-HLD.md).

## Inventory & Stock Reservations — existing database usage

**Confirmed database:** 24 PostgreSQL schemas; schema authority the canonical standalone SQL. The tables below exist, but **a schema-domain association does not automatically mean this module owns every row or has write rights**. The database repository is not an HTTP service.

- `warehouse.inventory_adjustment_items` — columns · contracts
- `warehouse.inventory_adjustments` — columns · contracts
- `warehouse.inventory_lots` — columns · contracts
- `warehouse.stock_balances` — columns · contracts
- `warehouse.stock_holds` — columns · contracts
- `warehouse.stock_ledger` — columns · contracts
- `warehouse.stock_movement_reason_codes` — columns · contracts
- `warehouse.stock_reservations` — columns · contracts
- `warehouse.stock_transfer_items` — columns · contracts
- `warehouse.stock_transfers` — columns · contracts

### Ownership, transactions and change control

Proposed owning service: `Inventory`. Main read concerns: stock by site/batch/expiry, ledger, holds, adjustments and alerts. Writes must be restricted by the actual foreign keys, CHECKs, unique contracts, crosswalks, policy and trigger guards. Use one transaction per domain state transition, use an outbox for reliable cross-module publication, and make any external retry idempotent.

**Safety:** Authoritative location-specific POS observation and an owner-approved freshness policy are prerequisites to reservation. Lock exactly the stock rows/hold state; reconcile ledger and physical stock.

Internal ID strategy: `identity.users.id` is UUID; most other tables have BIGINT internal PK with original immutable UUID alias. Never cast UUID to BIGINT or expose DB internal IDs as authorization tokens. All schema changes require new forward-only SQL migration under the source repo and a fresh PG15/PG18 parity test. Related [migration strategy](../../04-Database/Migrations.md).

## Inventory & Stock Reservations — dependencies and ownership

**Underlying schemas:** `warehouse`, `catalog`. These schemas are shared data domains; shared reads are not automatic write rights. Candidate collaborator modules are inferred from overlapping schema use:

- Cart_Checkout
- Order_Operations
- Product_Catalog
- Store_Operations
- Warehouse

### Communication rules

Use the owning service interface for business changes rather than making uncontrolled cross-module writes. In the chosen modular-monolith style, synchronous application calls can remain in-process. BullMQ/Redis jobs serve slow notifications and integrations after commit; they should not become the source of order, payment, stock or clinical truth.

Build independent adapters for Cashfree, POS/Techsmith, MSG91 and driver APIs; failures must remain visible.

**Data-access contract:** Authoritative location-specific POS observation and an owner-approved freshness policy are prerequisites to reservation. Lock exactly the stock rows/hold state; reconcile ledger and physical stock.. Related: [module dependencies](../../02-Architecture/Module-Dependencies.md) and [database usage](../../04-Database/Module-Mapping.md).

## Inventory & Stock Reservations — domain objects and DTO boundaries

**Proposed objects, not new database tables.** A domain object is a service-level business concept; a DTO is a validated data transfer object (API input/output). Do not confuse them with the archived historical ORM models.

| Proposed object | Source of truth / evidence | Rules |
| --- | --- | --- |
| `InventoryCommand` | Authenticated HTTP request and expected version | Includes actor context, idempotency key and validated business input |
| `InventoryAggregate` | Domain rows listed in Database Usage | Represents the current authoritative business facts |
| `InventoryPolicy` | Approved master/role records and product rules | Authoritative location-specific POS observation and an owner-approved freshness policy are prerequisites to reservation. Lock exactly the stock rows/hold state; reconcile ledger and physical stock. |
| `InventoryReadModel` | Role-filtered current state | Removes protected fields and translates internal statuses |
| `InventoryEvent` | Committed state transition and audit ID | Events carry references and versions, not clinical documents |

**Existing representative tables:** `warehouse.inventory_adjustment_items`, `warehouse.inventory_adjustments`, `warehouse.inventory_lots`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`, `warehouse.stock_movement_reason_codes`, `warehouse.stock_reservations`.

Internal BIGINT primary keys are never used as authorization credentials, and original UUID public references must remain stable. Any DTO field not directly supported by a confirmed column must be labelled proposed until the API team approves the mapping. See [database usage](../../04-Database/Module-Mapping.md).

## Inventory & Stock Reservations — failure handling

**Primary rule:** Authoritative location-specific POS observation and an owner-approved freshness policy are prerequisites to reservation. Lock exactly the stock rows/hold state; reconcile ledger and physical stock.

- **Missing or invalid input:** respond with a field-specific problem code; do not leak sensitive data and do not write partial state.
- **Unauthorized object or location:** return `403` or privacy-safe `404`; record the attempted privileged action.
- **Duplicate submission:** return the persisted result when key + payload match; reject key reuse with different payload.
- **Stale/concurrent change:** database version/FK/CHECK guard must resolve a single winner; caller reloads latest projection.
- **Partial external failure:** leave the aggregate pending, never mark payment/stock/delivery success by assumption. Retry verified idempotent adapter calls; otherwise reconcile manually.
- **Safety or compliance policy unknown:** fail closed. Route staff to an exception queue and customer to a non-misleading status.

Use structured problem codes, request ID, retryability category and operator runbook reference. Sensitive Rx, financial tokens, OTPs and location traces must not be placed into logs. See [error responses](../../05-APIs/README.md#standard-problem-response-behavior) and [incident triage](../../07-Engineering/Release-and-Incident-Handling.md).

## Lot-aware inventory and reservation — proposed interfaces and DTOs

**Business context:** A reservation must not create negative eligible stock and must not use expired/blocked lots.

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

**Existing table candidates:** `warehouse.stock_balances`, `warehouse.stock_reservations`, `warehouse.inventory_lots`, `warehouse.stock_ledger`, `warehouse.stock_holds`.

**Per-operation request and response examples:** API contract index. No generic DTO in this document overrides module-specific validation.

## Lot-aware inventory and reservation — internal architecture

**Status: Proposed application design.** The database repo does not contain a NestJS HTTP implementation.

### Business behavior

A reservation must not create negative eligible stock and must not use expired/blocked lots.

### Components

| Component | Responsibility | Data affected | Failure outcome |
| --- | --- | --- | --- |
| `InventoryController` (proposed) | Validate DTO and request context | Public API request only | 400/401/403 without partial mutation |
| `InventoryUseCase` (proposed) | Enforce module business invariant | `warehouse.stock_balances`, `warehouse.stock_reservations`, `warehouse.inventory_lots` | Domain status, do not guess provider truth |
| `InventoryRepository` (proposed) | Scoped SQL transaction and concurrency guard | Exact migrated tables | Roll back on conflict or constraint error |
| `InventoryIntegrationAdapter` (only when needed) | Map external IO and reconcile delivery | Outbox/inbox or verified provider record | Retries outside DB lock |

### Transaction and retry sequence

1. load eligible lots and site stock with lock.
2. validate POS freshness, lot expiry and licensed location.
3. reserve an available quantity atomically.
4. write stock reservation/ledger evidence.
5. return conflict/shortage without overselling.

### Existing tables (candidate responsibilities)

- `warehouse.stock_balances` — candidate entity; verify the exact operation and field set in the implementation review.
- `warehouse.stock_reservations` — candidate entity; verify the exact operation and field set in the implementation review.
- `warehouse.inventory_lots` — candidate entity; verify the exact operation and field set in the implementation review.
- `warehouse.stock_ledger` — candidate entity; verify the exact operation and field set in the implementation review.
- `warehouse.stock_holds` — candidate entity; verify the exact operation and field set in the implementation review.

### Related

HLD · States · Permissions

## Lot-aware inventory and reservation — observability

**Proposed runtime design:** Structured logs record correlation ID, module, operation, outcome code and elapsed time. Replace identifiers with approved pseudonymous references. No raw OTP, prescription text, secrets, payment credentials, addresses or GPS coordinates in logs.

**Candidate counters:** `inventory_command_total{outcome}`, `inventory_denied_total{reason}`, and `inventory_provider_pending_total` when an external provider is involved. Names are proposed and require monitoring owner review.

**Actionable alerts:** persistent command rejection spikes, outbox backlog, stale integrations or reconciliation mismatches; thresholds are open questions, not fabricated service-level objectives.

**Monitoring design**

## Inventory & Stock Reservations — permission model

**Actors:** Inventory Controller, Store Manager.

**Proposed service scope:** `staff_inventory`. Roles are application concepts; existing PostgreSQL NOLOGIN capability roles form a separate lower-level authorization layer.

| Operation class | Required entitlement | Enforcement |
| --- | --- | --- |
| Read own/scoped data | Authenticated identity + object or location ownership | Controller + service + database guard where provided |
| Create / edit | Explicit module action grant, approved master and domain status | Policy decision before transaction |
| Override / refund / pharmacist action | Specialized staff permission and documented approval reason | Distinct privilege, immutable audit evidence |
| Export / sensitive view | Purpose-limited role, retention and access logging | Recheck at download/stream time |

**Core constraint:** Authoritative location-specific POS observation and an owner-approved freshness policy are prerequisites to reservation. Lock exactly the stock rows/hold state; reconcile ledger and physical stock. A customer cannot infer another customer's resource existence.

Do not connect app runtime through migration-owner credentials. Consult [roles and permissions](../../07-Engineering/Security.md).

## Inventory & Stock Reservations — functional requirements

**Source:** the documented draft requirements.

**Status:** Draft requirements, not proof of final business acceptance. 🔴/🟡/🟢 priorities have been normalized as Must/Should/Could without changing their meaning.

| Feature | Priority in v0.1 | Statement | Dependency |
| --- | --- | --- | --- |
| `INV-01` | Must (draft) | Stock per location and batch, with manufacturing and expiry dates | Not stated |
| `INV-02` | Must (draft) | Stock ledger: every movement recorded; stock is the sum of the ledger | Not stated |
| `INV-03` | Must (draft) | Allocate nearest-expiry batch first; block batches below minimum shelf life | Shelf-life rule (pharmacist) |
| `INV-04` | Must (draft) | Stock adjustments with reason; manager approval above a threshold | Not stated |
| `INV-05` | Must (draft) | Low-stock and near-expiry alerts | Thresholds |
| `INV-06` | Must (draft) | Opening stock import per location | Q23 |
| `INV-07` | Must (draft) | Stock sync with Techsmith | Q17 — approach decided once Techsmith access is known |

### Interactions and acceptance basis

The user performs: Observe authoritative POS; reserve; release; adjust with reason. Server-side enforcement must preserve this invariant: **Authoritative location-specific POS observation and an owner-approved freshness policy are prerequisites to reservation. Lock exactly the stock rows/hold state; reconcile ledger and physical stock.**

A feature becomes implementation-ready only after its inputs (especially any dependency listed above), permissions, workflow outcome, API body and database transaction are resolved. Confirm business thresholds before coding: a field existing in SQL is not proof that its value was approved.

See requirement coverage and test IDs.

## Lot-aware inventory and reservation — request sequence

**Proposed design**, not a diagram of deployed services. Business-specific steps appear in Internal Architecture.

```mermaid
sequenceDiagram
  participant A as Authorized order service
  participant O as Inventory
  participant D as PostgreSQL
  A->>O: Hold exact stock for accepted revision
  O->>D: Lock lots and check source freshness expiry and license
  alt Gate fails or current version conflicts
    O-->>A: No hold, return stock exception
  else Gate satisfied
    O->>D: Create one eligible reservation set
    D-->>O: Committed evidence
    O-->>A: Active hold or committed stock after owner command
  end
```

**Concurrency rule:** Hold locks for minimal local SQL work only; repeated calls use the same idempotency key or expected-version check. Provider timeouts leave state pending and require authoritative reconciliation.

## Inventory & Stock Reservations — service design

**Proposed NestJS module:** `InventoryModule` with a controller, application service, authorization policy, repository and adapters. The supplied database code is a schema/validation library; no running HTTP controller was found in Archive 2.

### Candidate service methods

- `API-050: view_scoped_batch_stock(actor_context, validated_command, expected_version) -> Result`
- `API-051: ingest_authoritative_pos_observation(actor_context, validated_command, expected_version) -> Result`
- `API-052: make_concurrency-safe_hold(actor_context, validated_command, expected_version) -> Result`
- `API-053: release_expired_hold(actor_context, validated_command, expected_version) -> Result`
- `API-054: adjust_with_reason_and_approval(actor_context, validated_command, expected_version) -> Result`
- `API-055: view_expiry/low-stock_alerts(actor_context, validated_command, expected_version) -> Result`

### Transaction and integration contract

For each mutation: authenticate actor, validate inputs, read affected rows with a lock/version check, verify policy, update the minimum relevant rows and immutable audit/outbox in one transaction. A remote gateway, storage or GPS call should be performed outside the locked transaction and reconciled on callback/timeout. Use PostgreSQL to reject invalid writes even if application validation is bypassed.

**Module invariant:** Authoritative location-specific POS observation and an owner-approved freshness policy are prerequisites to reservation. Lock exactly the stock rows/hold state; reconcile ledger and physical stock.

**Timeouts/retries:** configure per provider, use exponential backoff with caps for safe reads and idempotent messages; never blindly repeat charge/refund/cash state changes. A dead-letter queue is an optional BullMQ operating pattern because BullMQ/Redis are selected in the checklist, but exact job topology needs signoff.

**Telemetry:** actor pseudonym, request ID, action, state transition latency, retries and failure category; redact protected clinical and payment contents. See [database usage](../../04-Database/Module-Mapping.md) and Monitoring.

## Inventory & Stock Reservations — state and transition policy

**Status:** State boundaries are derived from the unified order journey and existing SQL CHECK/trigger contracts; the following is a service design, not a claim that a single enum exists.

```mermaid
flowchart TD
  A["Hold exact stock for accepted revision"] --> B{"Safe available lots cover quantity?"}
  B -->|No| C["No hold, return stock exception"]
  B -->|Yes| D["Create one eligible reservation set"]
  D --> E["Active hold or committed stock after owner command"]
```

**Module-specific invariant:** Authoritative location-specific POS observation and an owner-approved freshness policy are prerequisites to reservation. Lock exactly the stock rows/hold state; reconcile ledger and physical stock.

Each transition must record the prior state, target state, reason where required, actor, accepted version and timestamp. A second command on the same state must either replay the prior idempotent result or fail with `409`. A failed external callback cannot roll an accepted state backward; reconcile with authoritative provider evidence.

When an order changes, keep clinical, payment, inventory, fulfillment and delivery statuses separate, then derive one safe user-visible projection.

This flow shows command gates, not an entity enum. Legal entity transitions and recovery are specified in [state contracts](../../07-Engineering/State-and-Recovery-Contracts.md); the table catalog supplies actual stored values.

## Inventory & Stock Reservations — verification and acceptance

**Candidate test IDs** derived one-to-one from the v0.1 feature IDs. They are test-design work items, not claims that the tests have been implemented. Database-level tests reported in the source do not replace HTTP and browser tests.

| Stable test ID | Behavior | Expected result |
| --- | --- | --- |
| `TC-INV-01-OK` | Stock per location and batch, with manufacturing and expiry dates | Stock view separates batch/location and manufacturing/expiry dates |
| `TC-INV-01-DENY` | Same product has one expired and one eligible batch | Only eligible batch contributes to orderable quantity; Inventory/Pharmacy assesses blocked stock |
| `TC-INV-02-OK` | Stock ledger: every movement recorded; stock is the sum of the ledger | Each accepted movement explains quantity and resulting balance |
| `TC-INV-02-DENY` | Movement reference is replayed | No second ledger effect or unexplained balance overwrite; Inventory reuses result and reconciles differences |
| `TC-INV-03-OK` | Allocate nearest-expiry batch first; block batches below minimum shelf life | Nearest eligible expiry is chosen under approved shelf-life policy |
| `TC-INV-03-DENY` | Earliest-expiry lot falls below approved shelf life | Lot skipped/blocked; never selected merely because oldest; Inventory chooses eligible lot; Pharmacy approves policy |
| `TC-INV-04-OK` | Stock adjustments with reason; manager approval above a threshold | Reasoned adjustment follows configured approval boundary |
| `TC-INV-04-DENY` | Large adjustment lacks required approval | No unauthorized ledger/balance mutation; Manager reviews evidence and approves/rejects |
| `TC-INV-05-OK` | Low-stock and near-expiry alerts | Low-stock/expiry alerts identify location, batch and data time |
| `TC-INV-05-DENY` | Observation is stale when alert job runs | Staleness shown; alerts cannot authorize stock holds; Inventory restores feed and reevaluates thresholds |
| `TC-INV-06-OK` | Opening stock import per location | Reviewed opening import records location/batch and traceable movement |
| `TC-INV-06-DENY` | Opening import is replayed after partial/lost acknowledgment | No double opening balance; explicit accepted/rejected rows; Inventory reconciles import identity and policy before retry |
| `TC-INV-07-OK` | Stock sync with Techsmith | Techsmith observations retain approved source/location/time identity |
| `TC-INV-07-DENY` | Older or duplicate stock observation arrives | No stale observation replacing newer authority or duplicate movement; Integration owner replays ordered evidence and reconciles |

### Cross-module contract tests

- Verify authenticated customer/staff/location ownership using actual restricted runtime roles.
- Verify concurrency and duplicate idempotency behavior against an isolated PostgreSQL database installed from the canonical SQL.
- Verify safe retry when callbacks or files arrive late or malformed.
- Verify audit and notification records are based on committed state and contain no confidential payloads.
- Verify this invariant: **Authoritative location-specific POS observation and an owner-approved freshness policy are prerequisites to reservation. Lock exactly the stock rows/hold state; reconcile ledger and physical stock.**

Coverage state: **Designed, not executed for the proposed application**. Link individual results to the associated test ID and requirement before go-live. Read [test strategy](../../07-Engineering/Testing.md).

## Inventory & Stock Reservations — validation checkpoints

| Boundary | Required validation | Rejection outcome |
| --- | --- | --- |
| Input | Required fields, type, size, allowed format and business master codes | `400/422`; no write |
| Actor | Session validity, role, location, customer/patient/parcel ownership | `401/403/404`; audit |
| Version | Accepted order revision or row version matches, if state-changing | `409`; fetch current state |
| Domain | Authoritative location-specific POS observation and an owner-approved freshness policy are prerequisites to reservation. Lock exactly the stock rows/hold state; reconcile ledger and physical stock. | Explicit blocked/pending/error status |
| Database | FK, PK, UNIQUE, CHECK, trigger and RLS outcome | Safe conflict/business error; rollback |
| Integration | Authenticated provider/callback, idempotency key and settled evidence | Keep pending; reconciliation task |

**Requirements:** `INV-01`, `INV-02`, `INV-03`, `INV-04`, `INV-05`, `INV-06`, `INV-07`. Never trust browser-supplied patient, clinical decision, backend actor context, price or available quantity. Refer to Testing for negative tests.

## Inventory & Stock Reservations — operational workflows

**Entry points:** Observe authoritative POS; reserve; release; adjust with reason.

**User group:** Inventory Controller, Store Manager. The following source-defined order journey stages identify primary ownership; supporting modules also participate without necessarily owning the stage.

This module supports shared controls across multiple stages; no single stage is exclusively owned.

### Shared processing rules

The requested action is first validated against user scope, current state and approved business master data. Read required evidence from real migrated tables; change only data this module owns; publish a safe event or notify the next module after commit.

**Alternative paths:** missing required input keeps the process actionable; a stale or duplicate request is deduplicated; another actor's update returns a version conflict; external unavailability produces a pending/blocked state. Prescriptions, inventory, payments and logistics never independently set the whole order to delivered.

**Module-specific rule:** Authoritative location-specific POS observation and an owner-approved freshness policy are prerequisites to reservation. Lock exactly the stock rows/hold state; reconcile ledger and physical stock.

See [state transitions](../../07-Engineering/State-and-Recovery-Contracts.md) and [unified order](../../00-Business-Guide/Pharmville-Complete-Business-Flow.md).

## Critical recovery scenarios

**Designed; NOT RUN.** Run against approved policy fixtures and actual restricted database roles. Inspect customer/staff result, state/history, stock and money effects together.

| Test | Input / interruption | Expected result and record assertions |
| --- | --- | --- |
| `TC-INV-01-01` | Two accepted orders concurrently request the last eligible pack at one site | At most one active hold succeeds for the pack; the other gets shortage/current availability. No negative orderable balance and both outcomes retain their own order identity. |
