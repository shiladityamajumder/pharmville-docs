# Pharmacist Review LLD

<!-- ERD-NAV-START -->

## Database relationships

[`clinical` ERD](../../04-Database/ER-Diagrams/03-clinical.md) · [`commerce` ERD](../../04-Database/ER-Diagrams/04-commerce.md) · [FK catalog](../../04-Database/ER-Diagrams/Relationship-Catalog.md)

These diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](../../04-Database/Migrations.md) for the supplied source and deployment verification limits.

<!-- ERD-NAV-END -->

[Business flow](../../00-Business-Guide/Prescription-and-Pharmacy.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## Clinical review for prescription items — implementation acceptance

> [!NOTE]
> **Proposed conditions for engineering handoff; never imply QA passed.**

### Draft features

- **PHM-01 / REQ-069:** Review queue, oldest first, with waiting time (Must (draft)).
- **PHM-02 / REQ-070:** Side-by-side view: zoomable prescription and order items (Must (draft)).
- **PHM-03 / REQ-071:** Approve all, approve some, or reject with a reason (Must (draft)).
- **PHM-04 / REQ-072:** Confirm a chosen alternative matches the prescription (Should (draft)).
- **PHM-05 / REQ-073:** Pharmacist name, registration number and time on every decision (Must (draft)).

### Required release checks

- Authorised happy path persists exactly the intended state.
- Invalid, cross-account and cross-location requests leave authoritative rows unchanged.
- Concurrent duplicate requests do not create duplicate money, stock or order effects.
- File, prescription and patient data are not exposed to unauthorised roles.
- Recoverable provider failure exposes a pending/retryable state; never claims success.
- Audit/trace data contains public references, not credentials or sensitive document contents.

**Module test scenarios**

## Pharmacist Verification — HTTP API responsibilities

All routes below are **Proposed REST v1 contracts**. The database repository does not implement them. Public UUIDs identify resources; staff scope and patient/order ownership are checked at each handler, not inferred from URL paths.

- `API-060` `GET /v1/pharmacy/reviews` — Scoped review queue
- `API-061` `GET /v1/pharmacy/reviews/{review_id}` — Open private review evidence
- `API-062` `POST /v1/pharmacy/reviews/{review_id}/lines/{line_id}/decision` — Record exact P-line outcome
- `API-063` `POST /v1/me/orders/{order_id}/revisions/{revision_id}/accept` — Accept changed eligible basket

### Cross-cutting request contract

Writes require validated body, stable intent key, expected current version when appropriate, auditable actor identity and an explicit outcome. Reads use safe pagination and permission-filtered fields. `401` indicates no valid session; `403/404` denied scope; `409` conflict; `422` business validation; `503` unknown upstream outcome. Read [api conventions](../../05-APIs/README.md) before implementing the endpoint.

**Business gate:** Only P lines get individual clinical decisions; M/O lines are not sent to review. Decisions are bound to patient, Rx version, exact SKU/quantity and accepted order revision. Customer explicitly accepts a changed basket. For actual response fields, see the linked illustrative contract and approve a typed OpenAPI schema before implementation.

## Pharmacist Verification — business logic and invariants

**Rule origin:** the documented draft requirements and database migration guards. Distinguish a **confirmed database guard** from a **proposed API orchestration** and **open numeric policy**.

### Core procedure

1. Authenticate the actor and resolve server-owned tenant/location/patient permission.
2. Re-read the relevant product, order, document, stock or ledger state from the owning tables.
3. Reject incomplete or stale input; validate the latest accepted revision and current classification where relevant.
4. Apply the module invariant: **Only P lines get individual clinical decisions; M/O lines are not sent to review. Decisions are bound to patient, Rx version, exact SKU/quantity and accepted order revision. Customer explicitly accepts a changed basket.**
5. In a transaction, persist the minimal authoritative rows, version and audit outcome; publish notifications after commit.
6. Return a scoped read model; expose only approved information to the caller.

### Features implemented by this rule set

`PHM-01`, `PHM-02`, `PHM-03`, `PHM-04`, `PHM-05` (see full requirement descriptions).

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

## Pharmacist Verification — internal components

**Status:** Proposed NestJS modular-monolith design informed by the decided stack in the master decisions checklist. This is proposed application design; the validated standalone SQL is structure, not an implemented API.

| Component | Responsibility | Failure boundary |
| --- | --- | --- |
| HTTP controller / DTO validator | Accept typed requests for pharmacist verification, reject malformed payloads | `400/422`, no database change |
| Use-case service | Execute: Review exact P item against Rx; approve/reject/request correction | Explicit domain errors, no invented outcomes |
| Policy/authorization service | Enforce user role, object ownership, business eligibility | `403/404` and audit denied attempt |
| Domain repository | Execute scoped PostgreSQL reads/writes within a transaction | Retry only on safe concurrency errors |
| Outbox / integration adapter | Publish committed changes toward other modules or third parties | Durable retry and dead-letter review if adopted |

### Boundaries

Only P lines get individual clinical decisions; M/O lines are not sent to review. Decisions are bound to patient, Rx version, exact SKU/quantity and accepted order revision. Customer explicitly accepts a changed basket. Public controllers must not call database workflow functions with arbitrary SQL and must not accept a caller-supplied `actor_user_id`.

Network IO belongs outside long-lived locks. Modules should depend on domain interfaces, not on each other's ORM entities. Consult Dependencies and [architecture overview](../../02-Architecture/System-HLD.md).

## Pharmacist Verification — existing database usage

**Confirmed database:** 24 PostgreSQL schemas; schema authority the canonical standalone SQL. The tables below exist, but **a schema-domain association does not automatically mean this module owns every row or has write rights**. The database repository is not an HTTP service.

- `clinical.order_review_items` — columns · contracts
- `clinical.order_reviews` — columns · contracts
- `clinical.prescriptions` — columns · contracts

### Ownership, transactions and change control

Proposed owning service: `Pharmacist_Review`. Main read concerns: line-level p reviews, outcome reasons and revised basket workflow. Writes must be restricted by the actual foreign keys, CHECKs, unique contracts, crosswalks, policy and trigger guards. Use one transaction per domain state transition, use an outbox for reliable cross-module publication, and make any external retry idempotent.

**Safety:** Only P lines get individual clinical decisions; M/O lines are not sent to review. Decisions are bound to patient, Rx version, exact SKU/quantity and accepted order revision. Customer explicitly accepts a changed basket.

Internal ID strategy: `identity.users.id` is UUID; most other tables have BIGINT internal PK with original immutable UUID alias. Never cast UUID to BIGINT or expose DB internal IDs as authorization tokens. All schema changes require new forward-only SQL migration under the source repo and a fresh PG15/PG18 parity test. Related [migration strategy](../../04-Database/Migrations.md).

## Pharmacist Verification — dependencies and ownership

**Underlying schemas:** `clinical`, `commerce`, `compliance`. These schemas are shared data domains; shared reads are not automatic write rights. Candidate collaborator modules are inferred from overlapping schema use:

- Audit
- Cart_Checkout
- Customer_Accounts
- Customer_Orders
- Finance_Payments
- Order_Operations
- Prescription_Upload
- Reporting

### Communication rules

Use the owning service interface for business changes rather than making uncontrolled cross-module writes. In the chosen modular-monolith style, synchronous application calls can remain in-process. BullMQ/Redis jobs serve slow notifications and integrations after commit; they should not become the source of order, payment, stock or clinical truth.

Build independent adapters for Cashfree, POS/Techsmith, MSG91 and driver APIs; failures must remain visible.

**Data-access contract:** Only P lines get individual clinical decisions; M/O lines are not sent to review. Decisions are bound to patient, Rx version, exact SKU/quantity and accepted order revision. Customer explicitly accepts a changed basket.. Related: [module dependencies](../../02-Architecture/Module-Dependencies.md) and [database usage](../../04-Database/Module-Mapping.md).

## Pharmacist Verification — domain objects and DTO boundaries

**Proposed objects, not new database tables.** A domain object is a service-level business concept; a DTO is a validated data transfer object (API input/output). Do not confuse them with the archived historical ORM models.

| Proposed object | Source of truth / evidence | Rules |
| --- | --- | --- |
| `Pharmacist_ReviewCommand` | Authenticated HTTP request and expected version | Includes actor context, idempotency key and validated business input |
| `Pharmacist_ReviewAggregate` | Domain rows listed in Database Usage | Represents the current authoritative business facts |
| `Pharmacist_ReviewPolicy` | Approved master/role records and product rules | Only P lines get individual clinical decisions; M/O lines are not sent to review. Decisions are bound to patient, Rx version, exact SKU/quantity and accepted order revision. Customer explicitly accepts a changed basket. |
| `Pharmacist_ReviewReadModel` | Role-filtered current state | Removes protected fields and translates internal statuses |
| `Pharmacist_ReviewEvent` | Committed state transition and audit ID | Events carry references and versions, not clinical documents |

**Existing representative tables:** `clinical.order_review_items`, `clinical.order_reviews`, `clinical.prescriptions`. Internal BIGINT primary keys are never used as authorization credentials, and original UUID public references must remain stable. Any DTO field not directly supported by a confirmed column must be labelled proposed until the API team approves the mapping. See [database usage](../../04-Database/Module-Mapping.md).

## Pharmacist Verification — failure handling

**Primary rule:** Only P lines get individual clinical decisions; M/O lines are not sent to review. Decisions are bound to patient, Rx version, exact SKU/quantity and accepted order revision. Customer explicitly accepts a changed basket.

- **Missing or invalid input:** respond with a field-specific problem code; do not leak sensitive data and do not write partial state.
- **Unauthorized object or location:** return `403` or privacy-safe `404`; record the attempted privileged action.
- **Duplicate submission:** return the persisted result when key + payload match; reject key reuse with different payload.
- **Stale/concurrent change:** database version/FK/CHECK guard must resolve a single winner; caller reloads latest projection.
- **Partial external failure:** leave the aggregate pending, never mark payment/stock/delivery success by assumption. Retry verified idempotent adapter calls; otherwise reconcile manually.
- **Safety or compliance policy unknown:** fail closed. Route staff to an exception queue and customer to a non-misleading status.

Use structured problem codes, request ID, retryability category and operator runbook reference. Sensitive Rx, financial tokens, OTPs and location traces must not be placed into logs. See [error responses](../../05-APIs/README.md#standard-problem-response-behavior) and [incident triage](../../07-Engineering/Release-and-Incident-Handling.md).

## Clinical review for prescription items — proposed interfaces and DTOs

**Business context:** Only P-classified products trigger mandatory pharmacist review; M and O do not on classification alone.

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

**Existing table candidates:** `clinical.order_reviews`, `clinical.order_review_items`, `clinical.prescriptions`, `clinical.review_reason_codes`, `commerce.order_items`.

**Per-operation request and response examples:** API contract index. No generic DTO in this document overrides module-specific validation.

## Clinical review for prescription items — internal architecture

**Status: Proposed application design.** The database repo does not contain a NestJS HTTP implementation.

### Business behavior

Only P-classified products trigger mandatory pharmacist review; M and O do not on classification alone.

### Components

| Component | Responsibility | Data affected | Failure outcome |
| --- | --- | --- | --- |
| `Pharmacist_ReviewController` (proposed) | Validate DTO and request context | Public API request only | 400/401/403 without partial mutation |
| `Pharmacist_ReviewUseCase` (proposed) | Enforce module business invariant | `clinical.order_reviews`, `clinical.order_review_items`, `clinical.prescriptions` | Domain status, do not guess provider truth |
| `Pharmacist_ReviewRepository` (proposed) | Scoped SQL transaction and concurrency guard | Exact migrated tables | Roll back on conflict or constraint error |
| `Pharmacist_ReviewIntegrationAdapter` (only when needed) | Map external IO and reconcile delivery | Outbox/inbox or verified provider record | Retries outside DB lock |

### Transaction and retry sequence

1. inspect order line classification snapshot.
2. if no P items, bypass pharmacist gate only.
3. for P items verify patient, prescription, review permissions and licensed site.
4. record line-level decision and reason.
5. resume or block order based on accepted review.

### Existing tables (candidate responsibilities)

- `clinical.order_reviews` — candidate entity; verify the exact operation and field set in the implementation review.
- `clinical.order_review_items` — candidate entity; verify the exact operation and field set in the implementation review.
- `clinical.prescriptions` — candidate entity; verify the exact operation and field set in the implementation review.
- `clinical.review_reason_codes` — candidate entity; verify the exact operation and field set in the implementation review.
- `commerce.order_items` — candidate entity; verify the exact operation and field set in the implementation review.

### Related

HLD · States · Permissions

## Clinical review for prescription items — observability

**Proposed runtime design:** Structured logs record correlation ID, module, operation, outcome code and elapsed time. Replace identifiers with approved pseudonymous references. No raw OTP, prescription text, secrets, payment credentials, addresses or GPS coordinates in logs.

**Candidate counters:** `pharmacist_review_command_total{outcome}`, `pharmacist_review_denied_total{reason}`, and `pharmacist_review_provider_pending_total` when an external provider is involved. Names are proposed and require monitoring owner review.

**Actionable alerts:** persistent command rejection spikes, outbox backlog, stale integrations or reconciliation mismatches; thresholds are open questions, not fabricated service-level objectives.

**Monitoring design**

## Pharmacist Verification — permission model

**Actors:** Licensed Pharmacist.

**Proposed service scope:** `staff_pharmacist`. Roles are application concepts; existing PostgreSQL NOLOGIN capability roles form a separate lower-level authorization layer.

| Operation class | Required entitlement | Enforcement |
| --- | --- | --- |
| Read own/scoped data | Authenticated identity + object or location ownership | Controller + service + database guard where provided |
| Create / edit | Explicit module action grant, approved master and domain status | Policy decision before transaction |
| Override / refund / pharmacist action | Specialized staff permission and documented approval reason | Distinct privilege, immutable audit evidence |
| Export / sensitive view | Purpose-limited role, retention and access logging | Recheck at download/stream time |

**Core constraint:** Only P lines get individual clinical decisions; M/O lines are not sent to review. Decisions are bound to patient, Rx version, exact SKU/quantity and accepted order revision. Customer explicitly accepts a changed basket. A customer cannot infer another customer's resource existence.

Do not connect app runtime through migration-owner credentials. Consult [roles and permissions](../../07-Engineering/Security.md).

## Pharmacist Verification — functional requirements

**Source:** the documented draft requirements.

**Status:** Draft requirements, not proof of final business acceptance. 🔴/🟡/🟢 priorities have been normalized as Must/Should/Could without changing their meaning.

| Feature | Priority in v0.1 | Statement | Dependency |
| --- | --- | --- | --- |
| `PHM-01` | Must (draft) | Review queue, oldest first, with waiting time | Not stated |
| `PHM-02` | Must (draft) | Side-by-side view: zoomable prescription and order items | Not stated |
| `PHM-03` | Must (draft) | Approve all, approve some, or reject with a reason | Rejection reasons (pharmacist) |
| `PHM-04` | Should (draft) | Confirm a chosen alternative matches the prescription | Q21 |
| `PHM-05` | Must (draft) | Pharmacist name, registration number and time on every decision | Not stated |

### Interactions and acceptance basis

The user performs: Review exact P item against Rx; approve/reject/request correction. Server-side enforcement must preserve this invariant: **Only P lines get individual clinical decisions; M/O lines are not sent to review. Decisions are bound to patient, Rx version, exact SKU/quantity and accepted order revision. Customer explicitly accepts a changed basket.**

A feature becomes implementation-ready only after its inputs (especially any dependency listed above), permissions, workflow outcome, API body and database transaction are resolved. Confirm business thresholds before coding: a field existing in SQL is not proof that its value was approved.

See requirement coverage and test IDs.

## Clinical review for prescription items — request sequence

**Proposed design**, not a diagram of deployed services. Business-specific steps appear in Internal Architecture.

```mermaid
sequenceDiagram
  participant A as Authorized pharmacist
  participant O as Pharmacy review
  participant D as PostgreSQL
  A->>O: Decide current P line
  O->>D: Lock review and compare patient evidence SKU quantity revision
  alt Gate fails or current version conflicts
    O-->>A: Reject stale or unauthorized decision
  else Gate satisfied
    O->>D: Append decision actor reason registration time
    D-->>O: Committed evidence
    O-->>A: Approved or reasoned correction for exact line
  end
```

**Concurrency rule:** Hold locks for minimal local SQL work only; repeated calls use the same idempotency key or expected-version check. Provider timeouts leave state pending and require authoritative reconciliation.

## Pharmacist Verification — service design

**Proposed NestJS module:** `Pharmacist_ReviewModule` with a controller, application service, authorization policy, repository and adapters. The supplied database code is a schema/validation library; no running HTTP controller was found in Archive 2.

### Candidate service methods

- `API-060: scoped_review_queue(actor_context, validated_command, expected_version) -> Result`
- `API-061: open_private_review_evidence(actor_context, validated_command, expected_version) -> Result`
- `API-062: record_exact_p-line_outcome(actor_context, validated_command, expected_version) -> Result`
- `API-063: accept_changed_eligible_basket(actor_context, validated_command, expected_version) -> Result`

### Transaction and integration contract

For each mutation: authenticate actor, validate inputs, read affected rows with a lock/version check, verify policy, update the minimum relevant rows and immutable audit/outbox in one transaction. A remote gateway, storage or GPS call should be performed outside the locked transaction and reconciled on callback/timeout. Use PostgreSQL to reject invalid writes even if application validation is bypassed.

**Module invariant:** Only P lines get individual clinical decisions; M/O lines are not sent to review. Decisions are bound to patient, Rx version, exact SKU/quantity and accepted order revision. Customer explicitly accepts a changed basket.

**Timeouts/retries:** configure per provider, use exponential backoff with caps for safe reads and idempotent messages; never blindly repeat charge/refund/cash state changes. A dead-letter queue is an optional BullMQ operating pattern because BullMQ/Redis are selected in the checklist, but exact job topology needs signoff.

**Telemetry:** actor pseudonym, request ID, action, state transition latency, retries and failure category; redact protected clinical and payment contents. See [database usage](../../04-Database/Module-Mapping.md) and Monitoring.

## Pharmacist Verification — state and transition policy

**Status:** State boundaries are derived from the unified order journey and existing SQL CHECK/trigger contracts; the following is a service design, not a claim that a single enum exists.

```mermaid
flowchart TD
  A["Decide current P line"] --> B{"Current matching evidence and reviewer?"}
  B -->|No| C["Reject stale or unauthorized decision"]
  B -->|Yes| D["Append decision actor reason registration time"]
  D --> E["Approved or reasoned correction for exact line"]
```

**Module-specific invariant:** Only P lines get individual clinical decisions; M/O lines are not sent to review. Decisions are bound to patient, Rx version, exact SKU/quantity and accepted order revision. Customer explicitly accepts a changed basket.

Each transition must record the prior state, target state, reason where required, actor, accepted version and timestamp. A second command on the same state must either replay the prior idempotent result or fail with `409`. A failed external callback cannot roll an accepted state backward; reconcile with authoritative provider evidence.

When an order changes, keep clinical, payment, inventory, fulfillment and delivery statuses separate, then derive one safe user-visible projection.

This flow shows command gates, not an entity enum. Legal entity transitions and recovery are specified in [state contracts](../../07-Engineering/State-and-Recovery-Contracts.md); the table catalog supplies actual stored values.

## Pharmacist Verification — verification and acceptance

**Candidate test IDs** derived one-to-one from the v0.1 feature IDs. They are test-design work items, not claims that the tests have been implemented. Database-level tests reported in the source do not replace HTTP and browser tests.

| Stable test ID | Behavior | Expected result |
| --- | --- | --- |
| `TC-PHM-01-OK` | Review queue, oldest first, with waiting time | Waiting queue uses oldest-first with recorded waiting time |
| `TC-PHM-01-DENY` | No authorized pharmacist is available | P remains waiting; no timeout auto-approval; Pharmacy Operations assigns a licensed authorized reviewer |
| `TC-PHM-02-OK` | Side-by-side view: zoomable prescription and order items | Reviewer sees permitted current prescription beside exact order lines |
| `TC-PHM-02-DENY` | Prescription link belongs to another patient | View/decision blocked and protected access audited; Customer corrects evidence; Pharmacy reviews scope |
| `TC-PHM-03-OK` | Approve all, approve some, or reject with a reason | Per-P-line decision has reason, reviewer and current evidence version |
| `TC-PHM-03-DENY` | Two pharmacists decide the same old line | One current decision; stale command conflicts without overwriting history; Pharmacist reloads current review |
| `TC-PHM-04-OK` | Confirm a chosen alternative matches the prescription | Chosen alternative is reviewed for exact composition/strength/form |
| `TC-PHM-04-DENY` | Alternative changes after original approval | Old approval cannot authorize new SKU/quantity; Pharmacy reviews new evidence; customer accepts revision |
| `TC-PHM-05-OK` | Pharmacist name, registration number and time on every decision | Every clinical decision retains authorized reviewer/registration/time |
| `TC-PHM-05-DENY` | Unprivileged staff posts an approval | No decision or approval bypass; denial is auditable; Security/Pharmacy corrects entitlement and preserves original history |

### Cross-module contract tests

- Verify authenticated customer/staff/location ownership using actual restricted runtime roles.
- Verify concurrency and duplicate idempotency behavior against an isolated PostgreSQL database installed from the canonical SQL.
- Verify safe retry when callbacks or files arrive late or malformed.
- Verify audit and notification records are based on committed state and contain no confidential payloads.
- Verify this invariant: **Only P lines get individual clinical decisions; M/O lines are not sent to review. Decisions are bound to patient, Rx version, exact SKU/quantity and accepted order revision. Customer explicitly accepts a changed basket.**

Coverage state: **Designed, not executed for the proposed application**. Link individual results to the associated test ID and requirement before go-live. Read [test strategy](../../07-Engineering/Testing.md).

## Pharmacist Verification — validation checkpoints

| Boundary | Required validation | Rejection outcome |
| --- | --- | --- |
| Input | Required fields, type, size, allowed format and business master codes | `400/422`; no write |
| Actor | Session validity, role, location, customer/patient/parcel ownership | `401/403/404`; audit |
| Version | Accepted order revision or row version matches, if state-changing | `409`; fetch current state |
| Domain | Only P lines get individual clinical decisions; M/O lines are not sent to review. Decisions are bound to patient, Rx version, exact SKU/quantity and accepted order revision. Customer explicitly accepts a changed basket. | Explicit blocked/pending/error status |
| Database | FK, PK, UNIQUE, CHECK, trigger and RLS outcome | Safe conflict/business error; rollback |
| Integration | Authenticated provider/callback, idempotency key and settled evidence | Keep pending; reconciliation task |

**Requirements:** `PHM-01`, `PHM-02`, `PHM-03`, `PHM-04`, `PHM-05`. Never trust browser-supplied patient, clinical decision, backend actor context, price or available quantity. Refer to Testing for negative tests.

## Pharmacist Verification — operational workflows

**Entry points:** Review exact P item against Rx; approve/reject/request correction.

**User group:** Licensed Pharmacist. The following source-defined order journey stages identify primary ownership; supporting modules also participate without necessarily owning the stage.

- S09 — Review only the P medicines
- S12 — Confirm the prescription step is complete

### Shared processing rules

The requested action is first validated against user scope, current state and approved business master data. Read required evidence from real migrated tables; change only data this module owns; publish a safe event or notify the next module after commit.

**Alternative paths:** missing required input keeps the process actionable; a stale or duplicate request is deduplicated; another actor's update returns a version conflict; external unavailability produces a pending/blocked state. Prescriptions, inventory, payments and logistics never independently set the whole order to delivered.

**Module-specific rule:** Only P lines get individual clinical decisions; M/O lines are not sent to review. Decisions are bound to patient, Rx version, exact SKU/quantity and accepted order revision. Customer explicitly accepts a changed basket.

See [state transitions](../../07-Engineering/State-and-Recovery-Contracts.md) and [unified order](../../00-Business-Guide/Pharmville-Complete-Business-Flow.md).

## Critical recovery scenarios

**Designed; NOT RUN.** Run against approved policy fixtures and actual restricted database roles. Inspect customer/staff result, state/history, stock and money effects together.

| Test | Input / interruption | Expected result and record assertions |
| --- | --- | --- |
| `TC-PHM-03-01` | Customer accepts a changed SKU/quantity revision while pharmacist submits old decision | Old decision cannot authorize the changed line; version check conflicts or retains historical-only evidence. New current evidence needs authorized review; no payment/picking gate is unlocked by stale approval. |
