# Prescription Upload LLD

[Business flow](../../00-Business-Guide/Prescription-and-Pharmacy.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## Private prescription intake — implementation acceptance

**Proposed conditions for engineering handoff; never imply QA passed.**

## Draft features
- **RX-01 / REQ-022:** Upload one or more prescriptions (JPG, PNG, PDF) at checkout (Must (draft)).
- **RX-02 / REQ-023:** Upload within 24 hours after ordering; auto-cancel after that (Should (draft)).
- **RX-03 / REQ-024:** Reuse a saved, still-valid prescription (Should (draft)).
- **RX-04 / REQ-025:** Link each prescription to the patient (self or family member) (Must (draft)).
- **RX-05 / REQ-026:** See the pharmacist's decision and reason; re-upload after rejection (Must (draft)).

## Required release checks
- Authorised happy path persists exactly the intended state.
- Invalid, cross-account and cross-location requests leave authoritative rows unchanged.
- Concurrent duplicate requests do not create duplicate money, stock or order effects.
- File, prescription and patient data are not exposed to unauthorised roles.
- Recoverable provider failure exposes a pending/retryable state; never claims success.
- Audit/trace data contains public references, not credentials or sensitive document contents.

Module test scenarios

## Prescription Upload & Private Files — HTTP API responsibilities

All routes below are **Proposed REST v1 contracts**. The database repository does not implement them. Public UUIDs identify resources; staff scope and patient/order ownership are checked at each handler, not inferred from URL paths.

- API-022 POST /v1/prescriptions/upload-intents — Prepare private upload
- API-023 POST /v1/prescriptions/documents/confirm — Confirm scanned object metadata
- API-024 POST /v1/orders/{order_id}/prescriptions — Attach prescription to order patient

## Cross-cutting request contract

Writes require validated body, stable intent key, expected current version when appropriate, auditable actor identity and an explicit outcome. Reads use safe pagination and permission-filtered fields. `401` indicates no valid session; `403/404` denied scope; `409` conflict; `422` business validation; `503` unknown upstream outcome. Read [api conventions](../../05-APIs/README.md) before implementing the endpoint.

**Business gate:** Issue short-lived private upload permissions, virus-scan and validate file metadata, then authorize Rx-to-patient and Rx-to-order association. The presence of a PDF does not establish medical validity. For actual response fields, see the linked illustrative contract and approve a typed OpenAPI schema before implementation.

## Prescription Upload & Private Files — business logic and invariants

**Rule origin:** the documented draft requirements and database migration guards. Distinguish a **confirmed database guard** from a **proposed API orchestration** and **open numeric policy**.

## Core procedure

1. Authenticate the actor and resolve server-owned tenant/location/patient permission.
2. Re-read the relevant product, order, document, stock or ledger state from the owning tables.
3. Reject incomplete or stale input; validate the latest accepted revision and current classification where relevant.
4. Apply the module invariant: **Issue short-lived private upload permissions, virus-scan and validate file metadata, then authorize Rx-to-patient and Rx-to-order association. The presence of a PDF does not establish medical validity.**
5. In a transaction, persist the minimal authoritative rows, version and audit outcome; publish notifications after commit.
6. Return a scoped read model; expose only approved information to the caller.

## Features implemented by this rule set

`RX-01`, `RX-02`, `RX-03`, `RX-04`, `RX-05` (see full requirement descriptions).

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

## Prescription Upload & Private Files — internal components

**Status:** Proposed NestJS modular-monolith design informed by the decided stack in the master decisions checklist. This is not code already implemented in the SQLAlchemy repository.

| Component | Responsibility | Failure boundary |
| --- | --- | --- |
| HTTP controller / DTO validator | Accept typed requests for prescription upload & private files, reject malformed payloads | `400/422`, no database change |
| Use-case service | Execute: Upload Rx; associate with correct patient/version; request corrected file | Explicit domain errors, no invented outcomes |
| Policy/authorization service | Enforce user role, object ownership, business eligibility | `403/404` and audit denied attempt |
| Domain repository | Execute scoped PostgreSQL reads/writes within a transaction | Retry only on safe concurrency errors |
| Outbox / integration adapter | Publish committed changes toward other modules or third parties | Durable retry and dead-letter review if adopted |

### Boundaries

Issue short-lived private upload permissions, virus-scan and validate file metadata, then authorize Rx-to-patient and Rx-to-order association. The presence of a PDF does not establish medical validity. Public controllers must not call database workflow functions with arbitrary SQL and must not accept a caller-supplied `actor_user_id`. Network IO belongs outside long-lived locks. Modules should depend on domain interfaces, not on each other's ORM entities. Consult Dependencies and [architecture overview](../../02-Architecture/System-HLD.md).

## Prescription Upload & Private Files — existing database usage

**Confirmed database:** 24 PostgreSQL schemas; SQL migration authority the checked-in SQL migration history. The tables below exist, but **a schema-domain association does not automatically mean this module owns every row or has write rights**. The database repository is not an HTTP service.

- `clinical.prescription_documents` — columns · contracts
- `clinical.prescriptions` — columns · contracts
- `platform.file_access_events` — columns · contracts
- `platform.file_access_grants` — columns · contracts
- `platform.file_objects` — columns · contracts
- `platform.file_scan_events` — columns · contracts
- `platform.file_upload_sessions` — columns · contracts
- `platform.file_variants` — columns · contracts

## Ownership, transactions and change control

Proposed owning service: `Prescription_Upload`. Main read concerns: private upload, document association and correction requests. Writes must be restricted by the actual foreign keys, CHECKs, unique contracts, crosswalks, policy and trigger guards. Use one transaction per domain state transition, use an outbox for reliable cross-module publication, and make any external retry idempotent.

**Safety:** Issue short-lived private upload permissions, virus-scan and validate file metadata, then authorize Rx-to-patient and Rx-to-order association. The presence of a PDF does not establish medical validity.

Internal ID strategy: `identity.users.id` is UUID; most other tables have BIGINT internal PK with original immutable UUID alias. Never cast UUID to BIGINT or expose DB internal IDs as authorization tokens. All schema changes require new forward-only SQL migration under the source repo and a fresh PG15/PG18 parity test. Related [migration strategy](../../04-Database/Migrations.md).

## Prescription Upload & Private Files — dependencies and ownership

**Underlying schemas:** `clinical`, `platform`, `customer`. These schemas are shared data domains; shared reads are not automatic write rights. Candidate collaborator modules are inferred from overlapping schema use:

- Admin_CMS
- Audit
- Authentication_Access
- Cart_Checkout
- Customer_Accounts
- Notifications
- Pharmacist_Review
- Reporting

## Communication rules

Use the owning service interface for business changes rather than making uncontrolled cross-module writes. In the chosen modular-monolith style, synchronous application calls can remain in-process. BullMQ/Redis jobs serve slow notifications and integrations after commit; they should not become the source of order, payment, stock or clinical truth. Build independent adapters for Cashfree, POS/Techsmith, MSG91 and driver APIs; failures must remain visible.

**Data-access contract:** Issue short-lived private upload permissions, virus-scan and validate file metadata, then authorize Rx-to-patient and Rx-to-order association. The presence of a PDF does not establish medical validity.. Related: [module dependencies](../../02-Architecture/Module-Dependencies.md) and [database usage](../../04-Database/Module-Mapping.md).

## Prescription Upload & Private Files — domain objects and DTO boundaries

**Proposed objects, not new database tables.** A domain object is a service-level business concept; a DTO is a validated data transfer object (API input/output). Do not confuse them with the Python SQLAlchemy models used for schema verification.

| Proposed object | Source of truth / evidence | Rules |
| --- | --- | --- |
| `Prescription_UploadCommand` | Authenticated HTTP request and expected version | Includes actor context, idempotency key and validated business input |
| `Prescription_UploadAggregate` | Domain rows listed in Database Usage | Represents the current authoritative business facts |
| `Prescription_UploadPolicy` | Approved master/role records and product rules | Issue short-lived private upload permissions, virus-scan and validate file metadata, then authorize Rx-to-patient and Rx-to-order association. The presence of a PDF does not establish medical validity. |
| `Prescription_UploadReadModel` | Role-filtered current state | Removes protected fields and translates internal statuses |
| `Prescription_UploadEvent` | Committed state transition and audit ID | Events carry references and versions, not clinical documents |

**Existing representative tables:** `clinical.prescription_documents`, `clinical.prescriptions`, `platform.file_access_events`, `platform.file_access_grants`, `platform.file_objects`, `platform.file_scan_events`, `platform.file_upload_sessions`, `platform.file_variants`. Internal BIGINT primary keys are never used as authorization credentials, and original UUID public references must remain stable. Any DTO field not directly supported by a confirmed column must be labelled proposed until the API team approves the mapping. See [database usage](../../04-Database/Module-Mapping.md).

## Prescription Upload & Private Files — failure handling

**Primary rule:** Issue short-lived private upload permissions, virus-scan and validate file metadata, then authorize Rx-to-patient and Rx-to-order association. The presence of a PDF does not establish medical validity.

- **Missing or invalid input:** respond with a field-specific problem code; do not leak sensitive data and do not write partial state.
- **Unauthorized object or location:** return `403` or privacy-safe `404`; record the attempted privileged action.
- **Duplicate submission:** return the persisted result when key + payload match; reject key reuse with different payload.
- **Stale/concurrent change:** database version/FK/CHECK guard must resolve a single winner; caller reloads latest projection.
- **Partial external failure:** leave the aggregate pending, never mark payment/stock/delivery success by assumption. Retry verified idempotent adapter calls; otherwise reconcile manually.
- **Safety or compliance policy unknown:** fail closed. Route staff to an exception queue and customer to a non-misleading status.

Use structured problem codes, request ID, retryability category and operator runbook reference. Sensitive Rx, financial tokens, OTPs and location traces must not be placed into logs. See [error responses](../../05-APIs/README.md#standard-problem-response-behavior) and [incident triage](../../07-Engineering/Release-and-Incident-Handling.md).

## Private prescription intake — proposed interfaces and DTOs

**Business context:** An uploaded file is quarantined until inspected and can only be accessed by permitted patients and reviewers.

**Controller contract:** validate identity and scope before accepting a command; never expose internal BIGINT IDs. Typed inputs should carry allowed public identifiers, operation-specific fields, expected record version and a unique idempotency key on mutations.

**Use-case interface:** `execute(trustedContext, validatedRequest) -> acceptedResult | domainError`. This is pseudocode for a boundary, **not generated application code**.

**Repository interface:** require a database transaction handle, parameterised SQL/ORM queries, and a stored accepted transition. Return public UUIDs or approved opaque references only.

**Error DTO proposal:** `{"error":{"code":"STATE_CONFLICT","message":"Refresh the record and try again","request_id":"..."}}`. Do not expose SQL errors, provider secrets or prescription contents.

**Existing table candidates:** `clinical.prescriptions`, `clinical.prescription_documents`, `platform.file_objects`, `platform.file_access_events`, `platform.file_upload_sessions`.

**Per-operation request and response examples:** API contract index. No generic DTO in this document overrides module-specific validation.

## Private prescription intake — internal architecture

**Status: Proposed application design.** The database repo does not contain a NestJS HTTP implementation.

## Business behavior
An uploaded file is quarantined until inspected and can only be accessed by permitted patients and reviewers.

## Components
| Component | Responsibility | Data affected | Failure outcome |
| --- | --- | --- | --- |
| `Prescription_UploadController` (proposed) | Validate DTO and request context | Public API request only | 400/401/403 without partial mutation |
| `Prescription_UploadUseCase` (proposed) | Enforce module business invariant | clinical.prescriptions, clinical.prescription_documents, platform.file_objects | Domain status, do not guess provider truth |
| `Prescription_UploadRepository` (proposed) | Scoped SQL transaction and concurrency guard | Exact migrated tables | Roll back on conflict or constraint error |
| `Prescription_UploadIntegrationAdapter` (only when needed) | Map external IO and reconcile delivery | Outbox/inbox or verified provider record | Retries outside DB lock |

## Transaction and retry sequence

1. authorise patient/document upload scope.
2. create private short-lived upload session.
3. receive storage scan/metadata evidence.
4. link document to prescription version.
5. release file for permitted pharmacist review.

## Existing tables (candidate responsibilities)
- clinical.prescriptions — candidate entity; verify the exact operation and field set in the implementation review.
- clinical.prescription_documents — candidate entity; verify the exact operation and field set in the implementation review.
- platform.file_objects — candidate entity; verify the exact operation and field set in the implementation review.
- platform.file_access_events — candidate entity; verify the exact operation and field set in the implementation review.
- platform.file_upload_sessions — candidate entity; verify the exact operation and field set in the implementation review.

## Related
HLD · States · Permissions

## Private prescription intake — observability

**Proposed runtime design:** Structured logs record correlation ID, module, operation, outcome code and elapsed time. Replace identifiers with approved pseudonymous references. No raw OTP, prescription text, secrets, payment credentials, addresses or GPS coordinates in logs.

**Candidate counters:** `prescription_upload_command_total{outcome}`, `prescription_upload_denied_total{reason}`, and `prescription_upload_provider_pending_total` when an external provider is involved. Names are proposed and require monitoring owner review.

**Actionable alerts:** persistent command rejection spikes, outbox backlog, stale integrations or reconciliation mismatches; thresholds are open questions, not fabricated service-level objectives.

Monitoring design

## Prescription Upload & Private Files — permission model

**Actors:** Customer. **Proposed service scope:** `customer`. Roles are application concepts; existing PostgreSQL NOLOGIN capability roles form a separate lower-level authorization layer.

| Operation class | Required entitlement | Enforcement |
| --- | --- | --- |
| Read own/scoped data | Authenticated identity + object or location ownership | Controller + service + database guard where provided |
| Create / edit | Explicit module action grant, approved master and domain status | Policy decision before transaction |
| Override / refund / pharmacist action | Specialized staff permission and documented approval reason | Distinct privilege, immutable audit evidence |
| Export / sensitive view | Purpose-limited role, retention and access logging | Recheck at download/stream time |

**Core constraint:** Issue short-lived private upload permissions, virus-scan and validate file metadata, then authorize Rx-to-patient and Rx-to-order association. The presence of a PDF does not establish medical validity. A customer cannot infer another customer's resource existence. Do not connect app runtime through migration-owner credentials. Consult [roles and permissions](../../07-Engineering/Security.md).

## Prescription Upload & Private Files — functional requirements

**Source:** the documented draft requirements. **Status:** Draft requirements, not proof of final business acceptance. 🔴/🟡/🟢 priorities have been normalized as Must/Should/Could without changing their meaning.

| Feature | Priority in v0.1 | Statement | Dependency |
| --- | --- | --- | --- |
| `RX-01` | Must (draft) | Upload one or more prescriptions (JPG, PNG, PDF) at checkout | Not stated |
| `RX-02` | Should (draft) | Upload within 24 hours after ordering; auto-cancel after that | Q3 |
| `RX-03` | Should (draft) | Reuse a saved, still-valid prescription | Validity rules (pharmacist) |
| `RX-04` | Must (draft) | Link each prescription to the patient (self or family member) | Not stated |
| `RX-05` | Must (draft) | See the pharmacist's decision and reason; re-upload after rejection | Not stated |

## Interactions and acceptance basis

The user performs: Upload Rx; associate with correct patient/version; request corrected file. Server-side enforcement must preserve this invariant: **Issue short-lived private upload permissions, virus-scan and validate file metadata, then authorize Rx-to-patient and Rx-to-order association. The presence of a PDF does not establish medical validity.**

A feature becomes implementation-ready only after its inputs (especially any dependency listed above), permissions, workflow outcome, API body and database transaction are resolved. Confirm business thresholds before coding: a field existing in SQL is not proof that its value was approved.

See requirement coverage and test IDs.

## Private prescription intake — request sequence

**Proposed design**, not a diagram of deployed services. Business-specific steps appear in Internal Architecture.

```mermaid
sequenceDiagram
  participant A as Customer
  participant O as Prescription intake
  participant D as PostgreSQL
  A->>O: Confirm private patient prescription file
  O->>D: Check upload complete scan outcome and patient order scope
  alt Gate fails or current version conflicts
    O-->>A: Keep file unusable and request correction
  else Gate satisfied
    O->>D: Link usable evidence and enqueue review
    D-->>O: Committed evidence
    O-->>A: Private evidence ready for pharmacist
  end
```

## Prescription Upload & Private Files — service design

**Proposed NestJS module:** `Prescription_UploadModule` with a controller, application service, authorization policy, repository and adapters. The supplied database code is a schema/validation library; no running HTTP controller was found in Archive 2.

## Candidate service methods

- `API-022: prepare_private_upload(actor_context, validated_command, expected_version) -> Result`
- `API-023: confirm_scanned_object_metadata(actor_context, validated_command, expected_version) -> Result`
- `API-024: attach_prescription_to_order_patient(actor_context, validated_command, expected_version) -> Result`

## Transaction and integration contract

For each mutation: authenticate actor, validate inputs, read affected rows with a lock/version check, verify policy, update the minimum relevant rows and immutable audit/outbox in one transaction. A remote gateway, storage or GPS call should be performed outside the locked transaction and reconciled on callback/timeout. Use PostgreSQL to reject invalid writes even if application validation is bypassed.

**Module invariant:** Issue short-lived private upload permissions, virus-scan and validate file metadata, then authorize Rx-to-patient and Rx-to-order association. The presence of a PDF does not establish medical validity.

**Timeouts/retries:** configure per provider, use exponential backoff with caps for safe reads and idempotent messages; never blindly repeat charge/refund/cash state changes. A dead-letter queue is an optional BullMQ operating pattern because BullMQ/Redis are selected in the checklist, but exact job topology needs signoff. **Telemetry:** actor pseudonym, request ID, action, state transition latency, retries and failure category; redact protected clinical and payment contents. See [database usage](../../04-Database/Module-Mapping.md) and Monitoring.

## Prescription Upload & Private Files — state and transition policy

**Status:** State boundaries are derived from the unified order journey and existing SQL CHECK/trigger contracts; the following is a service design, not a claim that a single enum exists.

```mermaid
flowchart TD
  A["Confirm private patient prescription file"] --> B{"Safe file and authorized patient?"}
  B -->|No| C["Keep file unusable and request correction"]
  B -->|Yes| D["Link usable evidence and enqueue review"]
  D --> E["Private evidence ready for pharmacist"]
```

**Module-specific invariant:** Issue short-lived private upload permissions, virus-scan and validate file metadata, then authorize Rx-to-patient and Rx-to-order association. The presence of a PDF does not establish medical validity.

Each transition must record the prior state, target state, reason where required, actor, accepted version and timestamp. A second command on the same state must either replay the prior idempotent result or fail with `409`. A failed external callback cannot roll an accepted state backward; reconcile with authoritative provider evidence. When an order changes, keep clinical, payment, inventory, fulfillment and delivery statuses separate, then derive one safe user-visible projection.

This flow shows command gates, not an entity enum. Legal entity transitions and recovery are specified in [state contracts](../../07-Engineering/State-and-Recovery-Contracts.md); the table catalog supplies actual stored values.

## Prescription Upload & Private Files — verification and acceptance

**Candidate test IDs** derived one-to-one from the v0.1 feature IDs. They are test-design work items, not claims that the tests have been implemented. Database-level tests reported in the source do not replace HTTP and browser tests.

| Stable test ID | Behavior | Expected result |
| --- | --- | --- |
| `TC-RX-01-OK` | Upload one or more prescriptions (JPG, PNG, PDF) at checkout | Completed safe JPG/PNG/PDF is private and available to permitted review |
| `TC-RX-01-DENY` | Upload is interrupted or malware check fails | File cannot become usable prescription evidence; Customer retries/replaces upload; file owner investigates |
| `TC-RX-02-OK` | Upload within 24 hours after ordering; auto-cancel after that | Deferred-upload route stays disabled until deadline/payment rules are approved |
| `TC-RX-02-DENY` | Deadline job runs with no approved policy | No invented 24-hour cancellation or refund behavior; Product, Pharmacy and Finance settle conflicting journey before enabling |
| `TC-RX-03-OK` | Reuse a saved, still-valid prescription | Saved evidence is rechecked for patient, validity and current items |
| `TC-RX-03-DENY` | Previously saved prescription is no longer valid | Reuse denied; no inherited approval for changed evidence; Customer uploads valid evidence; Pharmacy reviews |
| `TC-RX-04-OK` | Link each prescription to the patient (self or family member) | Prescription link matches the authorized patient/order |
| `TC-RX-04-DENY` | Wrong patient prescription ID is submitted | No wrong-patient linkage; safe denial; Customer corrects evidence; Pharmacy checks match |
| `TC-RX-05-OK` | See the pharmacist's decision and reason; re-upload after rejection | Decision reason is shown and a corrected file returns to review |
| `TC-RX-05-DENY` | Rejected file is resubmitted as if still approved | Earlier decision retained; new evidence requires current decision; Customer corrects file; authorized pharmacist reviews again |

## Cross-module contract tests

- Verify authenticated customer/staff/location ownership using actual restricted runtime roles.
- Verify concurrency and duplicate idempotency behavior against an isolated PostgreSQL database with authoritative migrations.
- Verify safe retry when callbacks or files arrive late or malformed.
- Verify audit and notification records are based on committed state and contain no confidential payloads.
- Verify this invariant: **Issue short-lived private upload permissions, virus-scan and validate file metadata, then authorize Rx-to-patient and Rx-to-order association. The presence of a PDF does not establish medical validity.**

Coverage state: **Designed, not executed for the proposed application**. Link individual results to the associated test ID and requirement before go-live. Read [test strategy](../../07-Engineering/Testing.md).

## Prescription Upload & Private Files — validation checkpoints

| Boundary | Required validation | Rejection outcome |
| --- | --- | --- |
| Input | Required fields, type, size, allowed format and business master codes | `400/422`; no write |
| Actor | Session validity, role, location, customer/patient/parcel ownership | `401/403/404`; audit |
| Version | Accepted order revision or row version matches, if state-changing | `409`; fetch current state |
| Domain | Issue short-lived private upload permissions, virus-scan and validate file metadata, then authorize Rx-to-patient and Rx-to-order association. The presence of a PDF does not establish medical validity. | Explicit blocked/pending/error status |
| Database | FK, PK, UNIQUE, CHECK, trigger and RLS outcome | Safe conflict/business error; rollback |
| Integration | Authenticated provider/callback, idempotency key and settled evidence | Keep pending; reconciliation task |

**Requirements:** `RX-01`, `RX-02`, `RX-03`, `RX-04`, `RX-05`. Never trust browser-supplied patient, clinical decision, backend actor context, price or available quantity. Refer to Testing for negative tests.

## Prescription Upload & Private Files — operational workflows

**Entry points:** Upload Rx; associate with correct patient/version; request corrected file. **User group:** Customer. The following source-defined order journey stages identify primary ownership; supporting modules also participate without necessarily owning the stage.

- S07 — Upload prescription only for P
- S10 — Fix a prescription problem

## Shared processing rules

The requested action is first validated against user scope, current state and approved business master data. Read required evidence from real migrated tables; change only data this module owns; publish a safe event or notify the next module after commit.

**Alternative paths:** missing required input keeps the process actionable; a stale or duplicate request is deduplicated; another actor's update returns a version conflict; external unavailability produces a pending/blocked state. Prescriptions, inventory, payments and logistics never independently set the whole order to delivered.

**Module-specific rule:** Issue short-lived private upload permissions, virus-scan and validate file metadata, then authorize Rx-to-patient and Rx-to-order association. The presence of a PDF does not establish medical validity.

See [state transitions](../../07-Engineering/State-and-Recovery-Contracts.md) and [unified order](../../00-Business-Guide/Pharmville-Complete-Business-Flow.md).
