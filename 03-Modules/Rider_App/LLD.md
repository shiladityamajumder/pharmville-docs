# Rider App LLD

<!-- ERD-NAV-START -->

## Database relationships

[`identity` ERD](../../04-Database/ER-Diagrams/10-identity.md) · [`logistics` ERD](../../04-Database/ER-Diagrams/12-logistics.md) · [`notification` ERD](../../04-Database/ER-Diagrams/15-notification.md) · [FK catalog](../../04-Database/ER-Diagrams/Relationship-Catalog.md)

These diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](../../04-Database/Migrations.md) for the supplied source and deployment verification limits.

<!-- ERD-NAV-END -->

[Business flow](../../00-Business-Guide/Delivery-and-Rider-App.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## Rider shifts and delivery actions — implementation acceptance

**Proposed conditions for engineering handoff; never imply QA passed.**

## Draft features
- **RID-01 / REQ-079:** OTP login; on duty, off duty and break (Must (draft)).
- **RID-02 / REQ-080:** Task list; accept; open Google Maps to navigate; mark picked up (Must (draft)).
- **RID-03 / REQ-081:** Background location: every 5–10 s on delivery, 15–30 s idle (Must (draft)).
- **RID-04 / REQ-082:** Complete delivery with customer OTP and photo; record COD collected (Must (draft)).
- **RID-05 / REQ-083:** Door checks for prescription medicines (Should (draft)).
- **RID-06 / REQ-084:** Failed attempt with a reason from a fixed list (Must (draft)).
- **RID-07 / REQ-085:** Daily deliveries and incentive earned (Should (draft)).

## Required release checks
- Authorised happy path persists exactly the intended state.
- Invalid, cross-account and cross-location requests leave authoritative rows unchanged.
- Concurrent duplicate requests do not create duplicate money, stock or order effects.
- File, prescription and patient data are not exposed to unauthorised roles.
- Recoverable provider failure exposes a pending/retryable state; never claims success.
- Audit/trace data contains public references, not credentials or sensitive document contents.

Module test scenarios

## Rider Android App — HTTP API responsibilities

All routes below are **Proposed REST v1 contracts**. The database repository does not implement them. Public UUIDs identify resources; staff scope and patient/order ownership are checked at each handler, not inferred from URL paths.

- API-069 POST /v1/rider/shifts — Start/stop shift
- API-070 GET /v1/rider/tasks — Assigned tasks only
- API-071 POST /v1/rider/tasks/{task_id}/pickup — Confirm handover
- API-072 POST /v1/rider/tasks/{task_id}/location — Submit scoped location sample
- API-073 POST /v1/rider/tasks/{task_id}/complete — Verify recipient/OTP/COD evidence
- API-074 POST /v1/rider/tasks/{task_id}/fail — Record approved failure reason

## Cross-cutting request contract

Writes require validated body, stable intent key, expected current version when appropriate, auditable actor identity and an explicit outcome. Reads use safe pagination and permission-filtered fields. `401` indicates no valid session; `403/404` denied scope; `409` conflict; `422` business validation; `503` unknown upstream outcome. Read [api conventions](../../05-APIs/README.md) before implementing the endpoint.

**Business gate:** Treat background GPS as sensitive: consent, scoped task identity, retention approval and access enforcement. OTP validation must be server-side with attempt limits, and failed delivery requires reason. For actual response fields, see the linked illustrative contract and approve a typed OpenAPI schema before implementation.

## Rider Android App — business logic and invariants

**Rule origin:** the documented draft requirements and database migration guards. Distinguish a **confirmed database guard** from a **proposed API orchestration** and **open numeric policy**.

## Core procedure

1. Authenticate the actor and resolve server-owned tenant/location/patient permission.
2. Re-read the relevant product, order, document, stock or ledger state from the owning tables.
3. Reject incomplete or stale input; validate the latest accepted revision and current classification where relevant.
4. Apply the module invariant: **Treat background GPS as sensitive: consent, scoped task identity, retention approval and access enforcement. OTP validation must be server-side with attempt limits, and failed delivery requires reason.**
5. In a transaction, persist the minimal authoritative rows, version and audit outcome; publish notifications after commit.
6. Return a scoped read model; expose only approved information to the caller.

## Features implemented by this rule set

`RID-01`, `RID-02`, `RID-03`, `RID-04`, `RID-05`, `RID-06`, `RID-07` (see full requirement descriptions).

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

## Rider Android App — internal components

**Status:** Proposed NestJS modular-monolith design informed by the decided stack in the master decisions checklist. This is not code already implemented in the SQLAlchemy repository.

| Component | Responsibility | Failure boundary |
| --- | --- | --- |
| HTTP controller / DTO validator | Accept typed requests for rider android app, reject malformed payloads | `400/422`, no database change |
| Use-case service | Execute: Accept task; track; verify OTP; record outcome | Explicit domain errors, no invented outcomes |
| Policy/authorization service | Enforce user role, object ownership, business eligibility | `403/404` and audit denied attempt |
| Domain repository | Execute scoped PostgreSQL reads/writes within a transaction | Retry only on safe concurrency errors |
| Outbox / integration adapter | Publish committed changes toward other modules or third parties | Durable retry and dead-letter review if adopted |

### Boundaries

Treat background GPS as sensitive: consent, scoped task identity, retention approval and access enforcement. OTP validation must be server-side with attempt limits, and failed delivery requires reason. Public controllers must not call database workflow functions with arbitrary SQL and must not accept a caller-supplied `actor_user_id`. Network IO belongs outside long-lived locks. Modules should depend on domain interfaces, not on each other's ORM entities. Consult Dependencies and [architecture overview](../../02-Architecture/System-HLD.md).

## Rider Android App — existing database usage

**Confirmed database:** 24 PostgreSQL schemas; SQL migration authority the checked-in SQL migration history. The tables below exist, but **a schema-domain association does not automatically mean this module owns every row or has write rights**. The database repository is not an HTTP service.

- `logistics.delivery_assignments` — columns · contracts
- `logistics.delivery_attempts` — columns · contracts
- `logistics.delivery_failure_reasons` — columns · contracts
- `logistics.delivery_location_updates` — columns · contracts
- `logistics.delivery_otp_challenges` — columns · contracts
- `logistics.delivery_routes` — columns · contracts
- `logistics.delivery_slots` — columns · contracts
- `logistics.rider_shifts` — columns · contracts

## Ownership, transactions and change control

Proposed owning service: `Rider_App`. Main read concerns: shift, pickup, location, otp, proof of delivery and cod capture. Writes must be restricted by the actual foreign keys, CHECKs, unique contracts, crosswalks, policy and trigger guards. Use one transaction per domain state transition, use an outbox for reliable cross-module publication, and make any external retry idempotent.

**Safety:** Treat background GPS as sensitive: consent, scoped task identity, retention approval and access enforcement. OTP validation must be server-side with attempt limits, and failed delivery requires reason.

Internal ID strategy: `identity.users.id` is UUID; most other tables have BIGINT internal PK with original immutable UUID alias. Never cast UUID to BIGINT or expose DB internal IDs as authorization tokens. All schema changes require new forward-only SQL migration under the source repo and a fresh PG15/PG18 parity test. Related [migration strategy](../../04-Database/Migrations.md).

## Rider Android App — dependencies and ownership

**Underlying schemas:** `logistics`, `identity`, `notification`. These schemas are shared data domains; shared reads are not automatic write rights. Candidate collaborator modules are inferred from overlapping schema use:

- Admin_CMS
- Authentication_Access
- Customer_Accounts
- Customer_Orders
- Delivery_Operations
- Notifications

## Communication rules

Use the owning service interface for business changes rather than making uncontrolled cross-module writes. In the chosen modular-monolith style, synchronous application calls can remain in-process. BullMQ/Redis jobs serve slow notifications and integrations after commit; they should not become the source of order, payment, stock or clinical truth. Build independent adapters for Cashfree, POS/Techsmith, MSG91 and driver APIs; failures must remain visible.

**Data-access contract:** Treat background GPS as sensitive: consent, scoped task identity, retention approval and access enforcement. OTP validation must be server-side with attempt limits, and failed delivery requires reason.. Related: [module dependencies](../../02-Architecture/Module-Dependencies.md) and [database usage](../../04-Database/Module-Mapping.md).

## Rider Android App — domain objects and DTO boundaries

**Proposed objects, not new database tables.** A domain object is a service-level business concept; a DTO is a validated data transfer object (API input/output). Do not confuse them with the Python SQLAlchemy models used for schema verification.

| Proposed object | Source of truth / evidence | Rules |
| --- | --- | --- |
| `Rider_AppCommand` | Authenticated HTTP request and expected version | Includes actor context, idempotency key and validated business input |
| `Rider_AppAggregate` | Domain rows listed in Database Usage | Represents the current authoritative business facts |
| `Rider_AppPolicy` | Approved master/role records and product rules | Treat background GPS as sensitive: consent, scoped task identity, retention approval and access enforcement. OTP validation must be server-side with attempt limits, and failed delivery requires reason. |
| `Rider_AppReadModel` | Role-filtered current state | Removes protected fields and translates internal statuses |
| `Rider_AppEvent` | Committed state transition and audit ID | Events carry references and versions, not clinical documents |

**Existing representative tables:** `logistics.delivery_assignments`, `logistics.delivery_attempts`, `logistics.delivery_failure_reasons`, `logistics.delivery_location_updates`, `logistics.delivery_otp_challenges`, `logistics.delivery_routes`, `logistics.delivery_slots`, `logistics.rider_shifts`. Internal BIGINT primary keys are never used as authorization credentials, and original UUID public references must remain stable. Any DTO field not directly supported by a confirmed column must be labelled proposed until the API team approves the mapping. See [database usage](../../04-Database/Module-Mapping.md).

## Rider Android App — failure handling

**Primary rule:** Treat background GPS as sensitive: consent, scoped task identity, retention approval and access enforcement. OTP validation must be server-side with attempt limits, and failed delivery requires reason.

- **Missing or invalid input:** respond with a field-specific problem code; do not leak sensitive data and do not write partial state.
- **Unauthorized object or location:** return `403` or privacy-safe `404`; record the attempted privileged action.
- **Duplicate submission:** return the persisted result when key + payload match; reject key reuse with different payload.
- **Stale/concurrent change:** database version/FK/CHECK guard must resolve a single winner; caller reloads latest projection.
- **Partial external failure:** leave the aggregate pending, never mark payment/stock/delivery success by assumption. Retry verified idempotent adapter calls; otherwise reconcile manually.
- **Safety or compliance policy unknown:** fail closed. Route staff to an exception queue and customer to a non-misleading status.

Use structured problem codes, request ID, retryability category and operator runbook reference. Sensitive Rx, financial tokens, OTPs and location traces must not be placed into logs. See [error responses](../../05-APIs/README.md#standard-problem-response-behavior) and [incident triage](../../07-Engineering/Release-and-Incident-Handling.md).

## Rider shifts and delivery actions — proposed interfaces and DTOs

**Business context:** Rider sees only assigned delivery and masked necessary information; OTP outcome stays server-validated.

**Controller contract:** validate identity and scope before accepting a command; never expose internal BIGINT IDs. Typed inputs should carry allowed public identifiers, operation-specific fields, expected record version and a unique idempotency key on mutations.

**Use-case interface:** `execute(trustedContext, validatedRequest) -> acceptedResult | domainError`. This is pseudocode for a boundary, **not generated application code**.

**Repository interface:** require a database transaction handle, parameterised SQL/ORM queries, and a stored accepted transition. Return public UUIDs or approved opaque references only.

**Error DTO proposal:** `{"error":{"code":"STATE_CONFLICT","message":"Refresh the record and try again","request_id":"..."}}`. Do not expose SQL errors, provider secrets or prescription contents.

**Existing table candidates:** `logistics.rider_shifts`, `logistics.delivery_assignments`, `logistics.delivery_otp_challenges`, `logistics.delivery_location_updates`, `payment.cod_collections`.

**Per-operation request and response examples:** API contract index. No generic DTO in this document overrides module-specific validation.

## Rider shifts and delivery actions — internal architecture

**Status: Proposed application design.** The database repo does not contain a NestJS HTTP implementation.

## Business behavior
Rider sees only assigned delivery and masked necessary information; OTP outcome stays server-validated.

## Components
| Component | Responsibility | Data affected | Failure outcome |
| --- | --- | --- | --- |
| `Rider_AppController` (proposed) | Validate DTO and request context | Public API request only | 400/401/403 without partial mutation |
| `Rider_AppUseCase` (proposed) | Enforce module business invariant | logistics.rider_shifts, logistics.delivery_assignments, logistics.delivery_otp_challenges | Domain status, do not guess provider truth |
| `Rider_AppRepository` (proposed) | Scoped SQL transaction and concurrency guard | Exact migrated tables | Roll back on conflict or constraint error |
| `Rider_AppIntegrationAdapter` (only when needed) | Map external IO and reconcile delivery | Outbox/inbox or verified provider record | Retries outside DB lock |

## Transaction and retry sequence

1. authenticate assigned rider and shift.
2. load only permitted assigned shipment.
3. accept/reject task under version check.
4. record GPS/OTP/proof only with approved policy.
5. finish delivery and reconcile COD independently.

## Existing tables (candidate responsibilities)
- logistics.rider_shifts — candidate entity; verify the exact operation and field set in the implementation review.
- logistics.delivery_assignments — candidate entity; verify the exact operation and field set in the implementation review.
- logistics.delivery_otp_challenges — candidate entity; verify the exact operation and field set in the implementation review.
- logistics.delivery_location_updates — candidate entity; verify the exact operation and field set in the implementation review.
- payment.cod_collections — candidate entity; verify the exact operation and field set in the implementation review.

## Related
HLD · States · Permissions

## Rider shifts and delivery actions — observability

**Proposed runtime design:** Structured logs record correlation ID, module, operation, outcome code and elapsed time. Replace identifiers with approved pseudonymous references. No raw OTP, prescription text, secrets, payment credentials, addresses or GPS coordinates in logs.

**Candidate counters:** `rider_app_command_total{outcome}`, `rider_app_denied_total{reason}`, and `rider_app_provider_pending_total` when an external provider is involved. Names are proposed and require monitoring owner review.

**Actionable alerts:** persistent command rejection spikes, outbox backlog, stale integrations or reconciliation mismatches; thresholds are open questions, not fabricated service-level objectives.

Monitoring design

## Rider Android App — permission model

**Actors:** Delivery Rider. **Proposed service scope:** `rider`. Roles are application concepts; existing PostgreSQL NOLOGIN capability roles form a separate lower-level authorization layer.

| Operation class | Required entitlement | Enforcement |
| --- | --- | --- |
| Read own/scoped data | Authenticated identity + object or location ownership | Controller + service + database guard where provided |
| Create / edit | Explicit module action grant, approved master and domain status | Policy decision before transaction |
| Override / refund / pharmacist action | Specialized staff permission and documented approval reason | Distinct privilege, immutable audit evidence |
| Export / sensitive view | Purpose-limited role, retention and access logging | Recheck at download/stream time |

**Core constraint:** Treat background GPS as sensitive: consent, scoped task identity, retention approval and access enforcement. OTP validation must be server-side with attempt limits, and failed delivery requires reason. A customer cannot infer another customer's resource existence. Do not connect app runtime through migration-owner credentials. Consult [roles and permissions](../../07-Engineering/Security.md).

## Rider Android App — functional requirements

**Source:** the documented draft requirements. **Status:** Draft requirements, not proof of final business acceptance. 🔴/🟡/🟢 priorities have been normalized as Must/Should/Could without changing their meaning.

| Feature | Priority in v0.1 | Statement | Dependency |
| --- | --- | --- | --- |
| `RID-01` | Must (draft) | OTP login; on duty, off duty and break | Not stated |
| `RID-02` | Must (draft) | Task list; accept; open Google Maps to navigate; mark picked up | Not stated |
| `RID-03` | Must (draft) | Background location: every 5–10 s on delivery, 15–30 s idle | Rider phone models |
| `RID-04` | Must (draft) | Complete delivery with customer OTP and photo; record COD collected | Not stated |
| `RID-05` | Should (draft) | Door checks for prescription medicines | Q26 |
| `RID-06` | Must (draft) | Failed attempt with a reason from a fixed list | Not stated |
| `RID-07` | Should (draft) | Daily deliveries and incentive earned | Incentive formula |

## Interactions and acceptance basis

The user performs: Accept task; track; verify OTP; record outcome. Server-side enforcement must preserve this invariant: **Treat background GPS as sensitive: consent, scoped task identity, retention approval and access enforcement. OTP validation must be server-side with attempt limits, and failed delivery requires reason.**

A feature becomes implementation-ready only after its inputs (especially any dependency listed above), permissions, workflow outcome, API body and database transaction are resolved. Confirm business thresholds before coding: a field existing in SQL is not proof that its value was approved.

See requirement coverage and test IDs.

## Rider shifts and delivery actions — request sequence

**Proposed design**, not a diagram of deployed services. Business-specific steps appear in Internal Architecture.

```mermaid
sequenceDiagram
  participant A as Assigned rider
  participant O as Delivery command service
  participant D as PostgreSQL
  A->>O: Submit delivery OTP proof and actual COD
  O->>D: Check current assignment proof validity and command identity
  alt Gate fails or current version conflicts
    O-->>A: Remain incomplete, retry or contact dispatch
  else Gate satisfied
    O->>D: Commit completion and coordinate one cash fact
    D-->>O: Committed evidence
    O-->>A: Evidenced delivery and separate cash state
  end
```

## Rider Android App — service design

**Proposed NestJS module:** `Rider_AppModule` with a controller, application service, authorization policy, repository and adapters. The supplied database code is a schema/validation library; no running HTTP controller was found in Archive 2.

## Candidate service methods

- `API-069: start/stop_shift(actor_context, validated_command, expected_version) -> Result`
- `API-070: assigned_tasks_only(actor_context, validated_command, expected_version) -> Result`
- `API-071: confirm_handover(actor_context, validated_command, expected_version) -> Result`
- `API-072: submit_scoped_location_sample(actor_context, validated_command, expected_version) -> Result`
- `API-073: verify_recipient/otp/cod_evidence(actor_context, validated_command, expected_version) -> Result`
- `API-074: record_approved_failure_reason(actor_context, validated_command, expected_version) -> Result`

## Transaction and integration contract

For each mutation: authenticate actor, validate inputs, read affected rows with a lock/version check, verify policy, update the minimum relevant rows and immutable audit/outbox in one transaction. A remote gateway, storage or GPS call should be performed outside the locked transaction and reconciled on callback/timeout. Use PostgreSQL to reject invalid writes even if application validation is bypassed.

**Module invariant:** Treat background GPS as sensitive: consent, scoped task identity, retention approval and access enforcement. OTP validation must be server-side with attempt limits, and failed delivery requires reason.

**Timeouts/retries:** configure per provider, use exponential backoff with caps for safe reads and idempotent messages; never blindly repeat charge/refund/cash state changes. A dead-letter queue is an optional BullMQ operating pattern because BullMQ/Redis are selected in the checklist, but exact job topology needs signoff. **Telemetry:** actor pseudonym, request ID, action, state transition latency, retries and failure category; redact protected clinical and payment contents. See [database usage](../../04-Database/Module-Mapping.md) and Monitoring.

## Rider Android App — state and transition policy

**Status:** State boundaries are derived from the unified order journey and existing SQL CHECK/trigger contracts; the following is a service design, not a claim that a single enum exists.

```mermaid
flowchart TD
  A["Submit delivery OTP proof and actual COD"] --> B{"Valid current proof and assignment?"}
  B -->|No| C["Remain incomplete, retry or contact dispatch"]
  B -->|Yes| D["Commit completion and coordinate one cash fact"]
  D --> E["Evidenced delivery and separate cash state"]
```

**Module-specific invariant:** Treat background GPS as sensitive: consent, scoped task identity, retention approval and access enforcement. OTP validation must be server-side with attempt limits, and failed delivery requires reason.

Each transition must record the prior state, target state, reason where required, actor, accepted version and timestamp. A second command on the same state must either replay the prior idempotent result or fail with `409`. A failed external callback cannot roll an accepted state backward; reconcile with authoritative provider evidence. When an order changes, keep clinical, payment, inventory, fulfillment and delivery statuses separate, then derive one safe user-visible projection.

This flow shows command gates, not an entity enum. Legal entity transitions and recovery are specified in [state contracts](../../07-Engineering/State-and-Recovery-Contracts.md); the table catalog supplies actual stored values.

## Rider Android App — verification and acceptance

**Candidate test IDs** derived one-to-one from the v0.1 feature IDs. They are test-design work items, not claims that the tests have been implemented. Database-level tests reported in the source do not replace HTTP and browser tests.

| Stable test ID | Behavior | Expected result |
| --- | --- | --- |
| `TC-RID-01-OK` | OTP login; on duty, off duty and break | OTP login and shift transitions use rider-specific authorization |
| `TC-RID-01-DENY` | Old session tries to start a revoked rider’s shift | Protected shift denied; no availability activation; Security/Dispatch resolves status |
| `TC-RID-02-OK` | Task list; accept; open Google Maps to navigate; mark picked up | Assigned rider accepts and picks up current parcel once |
| `TC-RID-02-DENY` | Other rider posts pickup | No custody change or task disclosure; Dispatch corrects assignment; authorized rider retries |
| `TC-RID-03-OK` | Background location: every 5–10 s on delivery, 15–30 s idle | Permitted locations carry captured time and active assignment |
| `TC-RID-03-DENY` | Offline device uploads delayed coordinates | Stale samples do not masquerade as live; access/retention policy applies; Dispatch uses last-known state; Privacy approves cadence/retention |
| `TC-RID-04-OK` | Complete delivery with customer OTP and photo; record COD collected | Current rider completes using valid OTP/proof and actual COD once |
| `TC-RID-04-DENY` | Wrong OTP or repeated offline completion | No completion on invalid proof; replay cannot duplicate collection; Rider retries approved proof or contacts Dispatch |
| `TC-RID-05-OK` | Door checks for prescription medicines | Approved door-check scope is enforced without replacing pharmacy review |
| `TC-RID-05-DENY` | Rider is asked to approve a prescription at doorstep | No pharmacist decision fabricated by rider; Pharmacy/Operations approves door-check SOP before enabling |
| `TC-RID-06-OK` | Failed attempt with a reason from a fixed list | Failed attempt records approved reason and current custody |
| `TC-RID-06-DENY` | Free-text unsupported failure reason is submitted | No false completed delivery or invented reason code; Rider selects approved reason; Dispatch decides next step |
| `TC-RID-07-OK` | Daily deliveries and incentive earned | Daily delivery/incentive view uses approved calculation version |
| `TC-RID-07-DENY` | Incentive configuration is missing or disputed | No invented earnings total or payout; Product/Finance approves incentive contract; rider sees pending availability |

## Cross-module contract tests

- Verify authenticated customer/staff/location ownership using actual restricted runtime roles.
- Verify concurrency and duplicate idempotency behavior against an isolated PostgreSQL database with authoritative migrations.
- Verify safe retry when callbacks or files arrive late or malformed.
- Verify audit and notification records are based on committed state and contain no confidential payloads.
- Verify this invariant: **Treat background GPS as sensitive: consent, scoped task identity, retention approval and access enforcement. OTP validation must be server-side with attempt limits, and failed delivery requires reason.**

Coverage state: **Designed, not executed for the proposed application**. Link individual results to the associated test ID and requirement before go-live. Read [test strategy](../../07-Engineering/Testing.md).

## Rider Android App — validation checkpoints

| Boundary | Required validation | Rejection outcome |
| --- | --- | --- |
| Input | Required fields, type, size, allowed format and business master codes | `400/422`; no write |
| Actor | Session validity, role, location, customer/patient/parcel ownership | `401/403/404`; audit |
| Version | Accepted order revision or row version matches, if state-changing | `409`; fetch current state |
| Domain | Treat background GPS as sensitive: consent, scoped task identity, retention approval and access enforcement. OTP validation must be server-side with attempt limits, and failed delivery requires reason. | Explicit blocked/pending/error status |
| Database | FK, PK, UNIQUE, CHECK, trigger and RLS outcome | Safe conflict/business error; rollback |
| Integration | Authenticated provider/callback, idempotency key and settled evidence | Keep pending; reconciliation task |

**Requirements:** `RID-01`, `RID-02`, `RID-03`, `RID-04`, `RID-05`, `RID-06`, `RID-07`. Never trust browser-supplied patient, clinical decision, backend actor context, price or available quantity. Refer to Testing for negative tests.

## Rider Android App — operational workflows

**Entry points:** Accept task; track; verify OTP; record outcome. **User group:** Delivery Rider. The following source-defined order journey stages identify primary ownership; supporting modules also participate without necessarily owning the stage.

- S24 — Travel to the delivery address
- S25 — Verify the recipient and hand over the order

## Shared processing rules

The requested action is first validated against user scope, current state and approved business master data. Read required evidence from real migrated tables; change only data this module owns; publish a safe event or notify the next module after commit.

**Alternative paths:** missing required input keeps the process actionable; a stale or duplicate request is deduplicated; another actor's update returns a version conflict; external unavailability produces a pending/blocked state. Prescriptions, inventory, payments and logistics never independently set the whole order to delivered.

**Module-specific rule:** Treat background GPS as sensitive: consent, scoped task identity, retention approval and access enforcement. OTP validation must be server-side with attempt limits, and failed delivery requires reason.

See [state transitions](../../07-Engineering/State-and-Recovery-Contracts.md) and [unified order](../../00-Business-Guide/Pharmville-Complete-Business-Flow.md).

## Critical recovery scenarios

**Designed; NOT RUN.** Run against approved policy fixtures and actual restricted database roles. Inspect customer/staff result, state/history, stock and money effects together.

| Test | Input / interruption | Expected result and record assertions |
| --- | --- | --- |
| `TC-RID-04-01` | Offline completion arrives after reassignment or OTP expiry | Reject stale assignment/expired proof without delivery completion or extra COD effect. Rider sees conflict and dispatch resolves custody; captured device time cannot override current server authorization. |
| `TC-RID-04-02` | Current rider submits incorrect delivery OTP with a valid-looking photo | Photo does not bypass OTP. Shipment remains incomplete, challenge attempts follow approved policy, and no cash or delivered event is fabricated. |
