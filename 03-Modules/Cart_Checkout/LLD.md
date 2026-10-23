# Cart Checkout LLD

[Business flow](../../00-Business-Guide/Cart-and-Checkout.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## Cart, quote and placement intent — implementation acceptance

**Proposed conditions for engineering handoff; never imply QA passed.**

## Draft features
- **CHK-01 / REQ-014:** Cart saved across devices for logged-in customers (Must (draft)).
- **CHK-02 / REQ-015:** Checkout: address, patient (self or family), payment method, delivery fee and estimated time shown before paying (Must (draft)).
- **CHK-03 / REQ-016:** Online payment via Cashfree: UPI, cards, net banking (Must (draft)).
- **CHK-04 / REQ-017:** Cash on delivery, with a maximum order value and a block after repeated refusals (Must (draft)).
- **CHK-05 / REQ-018:** Minimum order value and delivery fee applied from settings (Must (draft)).
- **CHK-06 / REQ-019:** Price or stock change detected before payment; customer confirms (Must (draft)).
- **CHK-07 / REQ-020:** No duplicate orders or charges (double tap, refresh, closed browser after payment) (Must (draft)).
- **CHK-08 / REQ-021:** Stock reserved during checkout, released automatically if payment does not finish (Must (draft)).

## Required release checks
- Authorised happy path persists exactly the intended state.
- Invalid, cross-account and cross-location requests leave authoritative rows unchanged.
- Concurrent duplicate requests do not create duplicate money, stock or order effects.
- File, prescription and patient data are not exposed to unauthorised roles.
- Recoverable provider failure exposes a pending/retryable state; never claims success.
- Audit/trace data contains public references, not credentials or sensitive document contents.

Module test scenarios

## Cart & Checkout — HTTP API responsibilities

All routes below are **Proposed REST v1 contracts**. The database repository does not implement them. Public UUIDs identify resources; staff scope and patient/order ownership are checked at each handler, not inferred from URL paths.

- API-018 GET /v1/me/cart — Load active cart
- API-019 PUT /v1/me/cart/items — Add/update cart line
- API-020 POST /v1/checkouts/quotes — Reprice and validate quote
- API-021 POST /v1/checkouts — Create one order intent

## Cross-cutting request contract

Writes require validated body, stable intent key, expected current version when appropriate, auditable actor identity and an explicit outcome. Reads use safe pagination and permission-filtered fields. `401` indicates no valid session; `403/404` denied scope; `409` conflict; `422` business validation; `503` unknown upstream outcome. Read [api conventions](../../05-APIs/README.md) before implementing the endpoint.

**Business gate:** Recalculate and snapshot accepted line prices, fees, scope and commerce classification within a checkout version. An accepted revision is a customer decision, not a background mutation. For actual response fields, see the linked illustrative contract and approve a typed OpenAPI schema before implementation.

## Cart & Checkout — business logic and invariants

**Rule origin:** the documented draft requirements and database migration guards. Distinguish a **confirmed database guard** from a **proposed API orchestration** and **open numeric policy**.

## Core procedure

1. Authenticate the actor and resolve server-owned tenant/location/patient permission.
2. Re-read the relevant product, order, document, stock or ledger state from the owning tables.
3. Reject incomplete or stale input; validate the latest accepted revision and current classification where relevant.
4. Apply the module invariant: **Recalculate and snapshot accepted line prices, fees, scope and commerce classification within a checkout version. An accepted revision is a customer decision, not a background mutation.**
5. In a transaction, persist the minimal authoritative rows, version and audit outcome; publish notifications after commit.
6. Return a scoped read model; expose only approved information to the caller.

## Features implemented by this rule set

`CHK-01`, `CHK-02`, `CHK-03`, `CHK-04`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08` (see full requirement descriptions).

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

## Cart & Checkout — internal components

**Status:** Proposed NestJS modular-monolith design informed by the decided stack in the master decisions checklist. This is not code already implemented in the SQLAlchemy repository.

| Component | Responsibility | Failure boundary |
| --- | --- | --- |
| HTTP controller / DTO validator | Accept typed requests for cart & checkout, reject malformed payloads | `400/422`, no database change |
| Use-case service | Execute: Persist cart; price quote; validate availability; create request | Explicit domain errors, no invented outcomes |
| Policy/authorization service | Enforce user role, object ownership, business eligibility | `403/404` and audit denied attempt |
| Domain repository | Execute scoped PostgreSQL reads/writes within a transaction | Retry only on safe concurrency errors |
| Outbox / integration adapter | Publish committed changes toward other modules or third parties | Durable retry and dead-letter review if adopted |

### Boundaries

Recalculate and snapshot accepted line prices, fees, scope and commerce classification within a checkout version. An accepted revision is a customer decision, not a background mutation. Public controllers must not call database workflow functions with arbitrary SQL and must not accept a caller-supplied `actor_user_id`. Network IO belongs outside long-lived locks. Modules should depend on domain interfaces, not on each other's ORM entities. Consult Dependencies and [architecture overview](../../02-Architecture/System-HLD.md).

## Cart & Checkout — existing database usage

**Confirmed database:** 24 PostgreSQL schemas; SQL migration authority the checked-in SQL migration history. The tables below exist, but **a schema-domain association does not automatically mean this module owns every row or has write rights**. The database repository is not an HTTP service.

- `commerce.cart_items` — columns · contracts
- `commerce.carts` — columns · contracts
- `commerce.checkouts` — columns · contracts
- `commerce.order_revisions` — columns · contracts
- `commerce.orders` — columns · contracts

## Ownership, transactions and change control

Proposed owning service: `Cart_Checkout`. Main read concerns: cart creation, quote validation, patient and address selection, checkout idempotency. Writes must be restricted by the actual foreign keys, CHECKs, unique contracts, crosswalks, policy and trigger guards. Use one transaction per domain state transition, use an outbox for reliable cross-module publication, and make any external retry idempotent.

**Safety:** Recalculate and snapshot accepted line prices, fees, scope and commerce classification within a checkout version. An accepted revision is a customer decision, not a background mutation.

Internal ID strategy: `identity.users.id` is UUID; most other tables have BIGINT internal PK with original immutable UUID alias. Never cast UUID to BIGINT or expose DB internal IDs as authorization tokens. All schema changes require new forward-only SQL migration under the source repo and a fresh PG15/PG18 parity test. Related [migration strategy](../../04-Database/Migrations.md).

## Cart & Checkout — dependencies and ownership

**Underlying schemas:** `commerce`, `pricing`, `customer`, `warehouse`. These schemas are shared data domains; shared reads are not automatic write rights. Candidate collaborator modules are inferred from overlapping schema use:

- Customer_Accounts
- Customer_Orders
- Finance_Payments
- Inventory
- Order_Operations
- Pharmacist_Review
- Prescription_Upload
- Product_Catalog

## Communication rules

Use the owning service interface for business changes rather than making uncontrolled cross-module writes. In the chosen modular-monolith style, synchronous application calls can remain in-process. BullMQ/Redis jobs serve slow notifications and integrations after commit; they should not become the source of order, payment, stock or clinical truth. Build independent adapters for Cashfree, POS/Techsmith, MSG91 and driver APIs; failures must remain visible.

**Data-access contract:** Recalculate and snapshot accepted line prices, fees, scope and commerce classification within a checkout version. An accepted revision is a customer decision, not a background mutation.. Related: [module dependencies](../../02-Architecture/Module-Dependencies.md) and [database usage](../../04-Database/Module-Mapping.md).

## Cart & Checkout — domain objects and DTO boundaries

**Proposed objects, not new database tables.** A domain object is a service-level business concept; a DTO is a validated data transfer object (API input/output). Do not confuse them with the Python SQLAlchemy models used for schema verification.

| Proposed object | Source of truth / evidence | Rules |
| --- | --- | --- |
| `Cart_CheckoutCommand` | Authenticated HTTP request and expected version | Includes actor context, idempotency key and validated business input |
| `Cart_CheckoutAggregate` | Domain rows listed in Database Usage | Represents the current authoritative business facts |
| `Cart_CheckoutPolicy` | Approved master/role records and product rules | Recalculate and snapshot accepted line prices, fees, scope and commerce classification within a checkout version. An accepted revision is a customer decision, not a background mutation. |
| `Cart_CheckoutReadModel` | Role-filtered current state | Removes protected fields and translates internal statuses |
| `Cart_CheckoutEvent` | Committed state transition and audit ID | Events carry references and versions, not clinical documents |

**Existing representative tables:** `commerce.cart_items`, `commerce.carts`, `commerce.checkouts`, `commerce.order_revisions`, `commerce.orders`. Internal BIGINT primary keys are never used as authorization credentials, and original UUID public references must remain stable. Any DTO field not directly supported by a confirmed column must be labelled proposed until the API team approves the mapping. See [database usage](../../04-Database/Module-Mapping.md).

## Cart & Checkout — failure handling

**Primary rule:** Recalculate and snapshot accepted line prices, fees, scope and commerce classification within a checkout version. An accepted revision is a customer decision, not a background mutation.

- **Missing or invalid input:** respond with a field-specific problem code; do not leak sensitive data and do not write partial state.
- **Unauthorized object or location:** return `403` or privacy-safe `404`; record the attempted privileged action.
- **Duplicate submission:** return the persisted result when key + payload match; reject key reuse with different payload.
- **Stale/concurrent change:** database version/FK/CHECK guard must resolve a single winner; caller reloads latest projection.
- **Partial external failure:** leave the aggregate pending, never mark payment/stock/delivery success by assumption. Retry verified idempotent adapter calls; otherwise reconcile manually.
- **Safety or compliance policy unknown:** fail closed. Route staff to an exception queue and customer to a non-misleading status.

Use structured problem codes, request ID, retryability category and operator runbook reference. Sensitive Rx, financial tokens, OTPs and location traces must not be placed into logs. See [error responses](../../05-APIs/README.md#standard-problem-response-behavior) and [incident triage](../../07-Engineering/Release-and-Incident-Handling.md).

## Cart, quote and placement intent — proposed interfaces and DTOs

**Business context:** A changed fee, classification or inventory observation invalidates a quote until reaccepted; replay cannot create two orders.

**Controller contract:** validate identity and scope before accepting a command; never expose internal BIGINT IDs. Typed inputs should carry allowed public identifiers, operation-specific fields, expected record version and a unique idempotency key on mutations.

**Use-case interface:** `execute(trustedContext, validatedRequest) -> acceptedResult | domainError`. This is pseudocode for a boundary, **not generated application code**.

**Repository interface:** require a database transaction handle, parameterised SQL/ORM queries, and a stored accepted transition. Return public UUIDs or approved opaque references only.

**Error DTO proposal:** `{"error":{"code":"STATE_CONFLICT","message":"Refresh the record and try again","request_id":"..."}}`. Do not expose SQL errors, provider secrets or prescription contents.

**Existing table candidates:** `commerce.carts`, `commerce.cart_items`, `commerce.checkouts`, `commerce.orders`, `platform.idempotency_keys`.

**Per-operation request and response examples:** API contract index. No generic DTO in this document overrides module-specific validation.

## Cart, quote and placement intent — internal architecture

**Status: Proposed application design.** The database repo does not contain a NestJS HTTP implementation.

## Business behavior
A changed fee, classification or inventory observation invalidates a quote until reaccepted; replay cannot create two orders.

## Components
| Component | Responsibility | Data affected | Failure outcome |
| --- | --- | --- | --- |
| `Cart_CheckoutController` (proposed) | Validate DTO and request context | Public API request only | 400/401/403 without partial mutation |
| `Cart_CheckoutUseCase` (proposed) | Enforce module business invariant | commerce.carts, commerce.cart_items, commerce.checkouts | Domain status, do not guess provider truth |
| `Cart_CheckoutRepository` (proposed) | Scoped SQL transaction and concurrency guard | Exact migrated tables | Roll back on conflict or constraint error |
| `Cart_CheckoutIntegrationAdapter` (only when needed) | Map external IO and reconcile delivery | Outbox/inbox or verified provider record | Retries outside DB lock |

## Transaction and retry sequence

1. read cart under user scope.
2. recalculate prices, lot availability, license and serviceability.
3. compare current quote version.
4. reserve stock and persist checkout intent using idempotency.
5. start external payment only after authoritative intent exists.

## Existing tables (candidate responsibilities)
- commerce.carts — candidate entity; verify the exact operation and field set in the implementation review.
- commerce.cart_items — candidate entity; verify the exact operation and field set in the implementation review.
- commerce.checkouts — candidate entity; verify the exact operation and field set in the implementation review.
- commerce.orders — candidate entity; verify the exact operation and field set in the implementation review.
- platform.idempotency_keys — candidate entity; verify the exact operation and field set in the implementation review.

## Related
HLD · States · Permissions

## Cart, quote and placement intent — observability

**Proposed runtime design:** Structured logs record correlation ID, module, operation, outcome code and elapsed time. Replace identifiers with approved pseudonymous references. No raw OTP, prescription text, secrets, payment credentials, addresses or GPS coordinates in logs.

**Candidate counters:** `cart_checkout_command_total{outcome}`, `cart_checkout_denied_total{reason}`, and `cart_checkout_provider_pending_total` when an external provider is involved. Names are proposed and require monitoring owner review.

**Actionable alerts:** persistent command rejection spikes, outbox backlog, stale integrations or reconciliation mismatches; thresholds are open questions, not fabricated service-level objectives.

Monitoring design

## Cart & Checkout — permission model

**Actors:** Customer. **Proposed service scope:** `customer`. Roles are application concepts; existing PostgreSQL NOLOGIN capability roles form a separate lower-level authorization layer.

| Operation class | Required entitlement | Enforcement |
| --- | --- | --- |
| Read own/scoped data | Authenticated identity + object or location ownership | Controller + service + database guard where provided |
| Create / edit | Explicit module action grant, approved master and domain status | Policy decision before transaction |
| Override / refund / pharmacist action | Specialized staff permission and documented approval reason | Distinct privilege, immutable audit evidence |
| Export / sensitive view | Purpose-limited role, retention and access logging | Recheck at download/stream time |

**Core constraint:** Recalculate and snapshot accepted line prices, fees, scope and commerce classification within a checkout version. An accepted revision is a customer decision, not a background mutation. A customer cannot infer another customer's resource existence. Do not connect app runtime through migration-owner credentials. Consult [roles and permissions](../../07-Engineering/Security.md).

## Cart & Checkout — functional requirements

**Source:** the documented draft requirements. **Status:** Draft requirements, not proof of final business acceptance. 🔴/🟡/🟢 priorities have been normalized as Must/Should/Could without changing their meaning.

| Feature | Priority in v0.1 | Statement | Dependency |
| --- | --- | --- | --- |
| `CHK-01` | Must (draft) | Cart saved across devices for logged-in customers | Not stated |
| `CHK-02` | Must (draft) | Checkout: address, patient (self or family), payment method, delivery fee and estimated time shown before paying | Delivery fee slabs |
| `CHK-03` | Must (draft) | Online payment via Cashfree: UPI, cards, net banking | Q2 (when to charge), sandbox credentials |
| `CHK-04` | Must (draft) | Cash on delivery, with a maximum order value and a block after repeated refusals | COD cap |
| `CHK-05` | Must (draft) | Minimum order value and delivery fee applied from settings | Client values |
| `CHK-06` | Must (draft) | Price or stock change detected before payment; customer confirms | Not stated |
| `CHK-07` | Must (draft) | No duplicate orders or charges (double tap, refresh, closed browser after payment) | Not stated |
| `CHK-08` | Must (draft) | Stock reserved during checkout, released automatically if payment does not finish | Not stated |

## Interactions and acceptance basis

The user performs: Persist cart; price quote; validate availability; create request. Server-side enforcement must preserve this invariant: **Recalculate and snapshot accepted line prices, fees, scope and commerce classification within a checkout version. An accepted revision is a customer decision, not a background mutation.**

A feature becomes implementation-ready only after its inputs (especially any dependency listed above), permissions, workflow outcome, API body and database transaction are resolved. Confirm business thresholds before coding: a field existing in SQL is not proof that its value was approved.

See requirement coverage and test IDs.

## Cart, quote and placement intent — request sequence

**Proposed design**, not a diagram of deployed services. Business-specific steps appear in Internal Architecture.

```mermaid
sequenceDiagram
  participant A as Customer
  participant O as Checkout
  participant D as PostgreSQL
  A->>O: Accept quote and submit one intent
  O->>D: Check owned cart and accepted price revision
  alt Gate fails or current version conflicts
    O-->>A: Refresh quote and ask for acceptance
  else Gate satisfied
    O->>D: Record or replay one request
    D-->>O: Committed evidence
    O-->>A: Conditional review then eligible hold and payment
  end
```

**Concurrency rule:** Hold locks for minimal local SQL work only; repeated calls use the same idempotency key or expected-version check. Provider timeouts leave state pending and require authoritative reconciliation.

## Cart & Checkout — service design

**Proposed NestJS module:** `Cart_CheckoutModule` with a controller, application service, authorization policy, repository and adapters. The supplied database code is a schema/validation library; no running HTTP controller was found in Archive 2.

## Candidate service methods

- `API-018: load_active_cart(actor_context, validated_command, expected_version) -> Result`
- `API-019: add/update_cart_line(actor_context, validated_command, expected_version) -> Result`
- `API-020: reprice_and_validate_quote(actor_context, validated_command, expected_version) -> Result`
- `API-021: create_one_order_intent(actor_context, validated_command, expected_version) -> Result`

## Transaction and integration contract

For each mutation: authenticate actor, validate inputs, read affected rows with a lock/version check, verify policy, update the minimum relevant rows and immutable audit/outbox in one transaction. A remote gateway, storage or GPS call should be performed outside the locked transaction and reconciled on callback/timeout. Use PostgreSQL to reject invalid writes even if application validation is bypassed.

**Module invariant:** Recalculate and snapshot accepted line prices, fees, scope and commerce classification within a checkout version. An accepted revision is a customer decision, not a background mutation.

**Timeouts/retries:** configure per provider, use exponential backoff with caps for safe reads and idempotent messages; never blindly repeat charge/refund/cash state changes. A dead-letter queue is an optional BullMQ operating pattern because BullMQ/Redis are selected in the checklist, but exact job topology needs signoff. **Telemetry:** actor pseudonym, request ID, action, state transition latency, retries and failure category; redact protected clinical and payment contents. See [database usage](../../04-Database/Module-Mapping.md) and Monitoring.

## Cart & Checkout — state and transition policy

**Status:** State boundaries are derived from the unified order journey and existing SQL CHECK/trigger contracts; the following is a service design, not a claim that a single enum exists.

```mermaid
flowchart TD
  A["Accept quote and submit one intent"] --> B{"Current accepted basket?"}
  B -->|No| C["Refresh quote and ask for acceptance"]
  B -->|Yes| D["Record or replay one request"]
  D --> E["Conditional review then eligible hold and payment"]
```

**Module-specific invariant:** Recalculate and snapshot accepted line prices, fees, scope and commerce classification within a checkout version. An accepted revision is a customer decision, not a background mutation.

Each transition must record the prior state, target state, reason where required, actor, accepted version and timestamp. A second command on the same state must either replay the prior idempotent result or fail with `409`. A failed external callback cannot roll an accepted state backward; reconcile with authoritative provider evidence. When an order changes, keep clinical, payment, inventory, fulfillment and delivery statuses separate, then derive one safe user-visible projection.

This flow shows command gates, not an entity enum. Legal entity transitions and recovery are specified in [state contracts](../../07-Engineering/State-and-Recovery-Contracts.md); the table catalog supplies actual stored values.

## Cart & Checkout — verification and acceptance

**Candidate test IDs** derived one-to-one from the v0.1 feature IDs. They are test-design work items, not claims that the tests have been implemented. Database-level tests reported in the source do not replace HTTP and browser tests.

| Stable test ID | Behavior | Expected result |
| --- | --- | --- |
| `TC-CHK-01-OK` | Cart saved across devices for logged-in customers | Cart reopens for the signed-in owner across devices |
| `TC-CHK-01-DENY` | Two devices edit the same old cart version | One edit wins; stale device reloads without overwriting accepted changes; Customer reconciles desired quantities |
| `TC-CHK-02-OK` | Checkout: address, patient (self or family), payment method, delivery fee and estimated time shown before paying | Accepted summary includes serviceable address, required patient, fee and estimate |
| `TC-CHK-02-DENY` | P basket selects an unauthorized patient | No accepted checkout/patient association; Customer selects permitted patient/address |
| `TC-CHK-03-OK` | Online payment via Cashfree: UPI, cards, net banking | Only trusted provider success confirms the accepted amount |
| `TC-CHK-03-DENY` | Browser redirects to success without provider evidence | Payment remains unconfirmed; no dispatch authorization; Finance checks provider status under D-004/D-016 |
| `TC-CHK-04-OK` | Cash on delivery, with a maximum order value and a block after repeated refusals | COD is offered only under approved eligibility and cap |
| `TC-CHK-04-DENY` | COD policy is absent or order exceeds configured cap | COD is not approved; no collected-cash record; Customer chooses eligible payment; Finance approves policy |
| `TC-CHK-05-OK` | Minimum order value and delivery fee applied from settings | Configured minimum and delivery fee are included in accepted total |
| `TC-CHK-05-DENY` | Basket falls below approved minimum after item removal | Summary requires correction/reacceptance; no stale total charged; Customer changes basket; Product approves configuration |
| `TC-CHK-06-OK` | Price or stock change detected before payment; customer confirms | Customer accepts the refreshed price/stock summary before payment |
| `TC-CHK-06-DENY` | Price changes after quote | Old version cannot authorize new amount or silent item removal; Customer accepts current revision or cancels |
| `TC-CHK-07-OK` | No duplicate orders or charges (double tap, refresh, closed browser after payment) | One intent returns the same order/payment-attempt reference on safe replay |
| `TC-CHK-07-DENY` | Double tap or timeout after checkout commit | One order per intent; different body with same key is a conflict; Customer reopens existing status; Finance checks unknown money |
| `TC-CHK-08-OK` | Stock reserved during checkout, released automatically if payment does not finish | Eligible exact stock is held once for the accepted revision |
| `TC-CHK-08-DENY` | Expiry worker races with payment completion | One legal hold outcome; no duplicate release or restored committed stock; Inventory and Finance reconcile late success; duration awaits D-009 |

## Cross-module contract tests

- Verify authenticated customer/staff/location ownership using actual restricted runtime roles.
- Verify concurrency and duplicate idempotency behavior against an isolated PostgreSQL database with authoritative migrations.
- Verify safe retry when callbacks or files arrive late or malformed.
- Verify audit and notification records are based on committed state and contain no confidential payloads.
- Verify this invariant: **Recalculate and snapshot accepted line prices, fees, scope and commerce classification within a checkout version. An accepted revision is a customer decision, not a background mutation.**

Coverage state: **Designed, not executed for the proposed application**. Link individual results to the associated test ID and requirement before go-live. Read [test strategy](../../07-Engineering/Testing.md).

## Cart & Checkout — validation checkpoints

| Boundary | Required validation | Rejection outcome |
| --- | --- | --- |
| Input | Required fields, type, size, allowed format and business master codes | `400/422`; no write |
| Actor | Session validity, role, location, customer/patient/parcel ownership | `401/403/404`; audit |
| Version | Accepted order revision or row version matches, if state-changing | `409`; fetch current state |
| Domain | Recalculate and snapshot accepted line prices, fees, scope and commerce classification within a checkout version. An accepted revision is a customer decision, not a background mutation. | Explicit blocked/pending/error status |
| Database | FK, PK, UNIQUE, CHECK, trigger and RLS outcome | Safe conflict/business error; rollback |
| Integration | Authenticated provider/callback, idempotency key and settled evidence | Keep pending; reconciliation task |

**Requirements:** `CHK-01`, `CHK-02`, `CHK-03`, `CHK-04`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08`. Never trust browser-supplied patient, clinical decision, backend actor context, price or available quantity. Refer to Testing for negative tests.

## Cart & Checkout — operational workflows

**Entry points:** Persist cart; price quote; validate availability; create request. **User group:** Customer. The following source-defined order journey stages identify primary ownership; supporting modules also participate without necessarily owning the stage.

- S03 — Build one shopping cart
- S06 — Confirm what will actually be ordered
- S08 — Record the order request once
- S11 — Approve a changed basket
- S13 — Choose payment with stock briefly held

## Shared processing rules

The requested action is first validated against user scope, current state and approved business master data. Read required evidence from real migrated tables; change only data this module owns; publish a safe event or notify the next module after commit.

**Alternative paths:** missing required input keeps the process actionable; a stale or duplicate request is deduplicated; another actor's update returns a version conflict; external unavailability produces a pending/blocked state. Prescriptions, inventory, payments and logistics never independently set the whole order to delivered.

**Module-specific rule:** Recalculate and snapshot accepted line prices, fees, scope and commerce classification within a checkout version. An accepted revision is a customer decision, not a background mutation.

See [state transitions](../../07-Engineering/State-and-Recovery-Contracts.md) and [unified order](../../00-Business-Guide/Pharmville-Complete-Business-Flow.md).

## Critical recovery scenarios

**Designed; NOT RUN.** Run against approved policy fixtures and actual restricted database roles. Inspect customer/staff result, state/history, stock and money effects together.

| Test | Input / interruption | Expected result and record assertions |
| --- | --- | --- |
| `TC-CHK-03-01` | Provider captured payment; browser confirmation is lost | Client shows checking payment and reuses existing reference; trusted provider reconciliation records success once. No immediate second charge. If hold expired, Operations/Finance resolve valid supply or approved compensation. |
| `TC-CHK-08-01` | Unused active reservation reaches its approved expires_at; expiry job runs twice | Unused eligible quantity is released once. No duplicate balance restoration, no release of already committed stock, and current reservation outcome is returned on replay. |
