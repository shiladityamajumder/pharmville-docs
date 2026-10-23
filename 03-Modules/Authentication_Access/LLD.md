# Authentication Access LLD

## Acceptance Criteria

## Login, sessions, roles and access control — implementation acceptance

**Proposed conditions for engineering handoff; never imply QA passed.**

## Draft features
- **AUTH-01 / REQ-102:** Password + authenticator 2FA for Super Admin, Central Admin, Finance Manager (Must (draft)).
- **AUTH-02 / REQ-103:** Lockout rules, session limits, one session per staff account (Must (draft)).
- **AUTH-03 / REQ-104:** OTP rate limits per number and IP (Must (draft)).
- **AUTH-04 / REQ-105:** Permissions checked on the server for every request (Must (draft)).

## Required release checks
- Authorised happy path persists exactly the intended state.
- Invalid, cross-account and cross-location requests leave authoritative rows unchanged.
- Concurrent duplicate requests do not create duplicate money, stock or order effects.
- File, prescription and patient data are not exposed to unauthorised roles.
- Recoverable provider failure exposes a pending/retryable state; never claims success.
- Audit/trace data contains public references, not credentials or sensitive document contents.

Module test scenarios

## API Design

## Authentication & Authorization — HTTP API responsibilities

All routes below are **Proposed REST v1 contracts**. The database repository does not implement them. Public UUIDs identify resources; staff scope and patient/order ownership are checked at each handler, not inferred from URL paths.

- API-089 POST /v1/auth/staff/login — Verify staff challenge
- API-090 POST /v1/auth/staff/mfa/verify — Require privileged MFA
- API-091 POST /v1/auth/sessions/refresh — Rotate refresh credential
- API-092 POST /v1/auth/sessions/revoke — Revoke active session
- API-093 GET /v1/auth/permissions — Resolve current allowed scopes

## Cross-cutting request contract

Writes require validated body, stable intent key, expected current version when appropriate, auditable actor identity and an explicit outcome. Reads use safe pagination and permission-filtered fields. `401` indicates no valid session; `403/404` denied scope; `409` conflict; `422` business validation; `503` unknown upstream outcome. Read API_Conventions before implementing the endpoint.

**Business gate:** OTP for routine identities, password plus TOTP for privileged staff where decided; session lock/revocation and location roles checked by every service. Do not use the migration owner in application runtime. For actual response fields, see the linked illustrative contract and approve a typed OpenAPI schema before implementation.

## Business Logic

## Authentication & Authorization — business logic and invariants

**Rule origin:** the documented draft requirements, the documented draft requirements and database migration guards. Distinguish a **confirmed database guard** from a **proposed API orchestration** and **open numeric policy**.

## Core procedure

1. Authenticate the actor and resolve server-owned tenant/location/patient permission.
2. Re-read the relevant product, order, document, stock or ledger state from the owning tables.
3. Reject incomplete or stale input; validate the latest accepted revision and current classification where relevant.
4. Apply the module invariant: **OTP for routine identities, password plus TOTP for privileged staff where decided; session lock/revocation and location roles checked by every service. Do not use the migration owner in application runtime.**
5. In a transaction, persist the minimal authoritative rows, version and audit outcome; publish notifications after commit.
6. Return a scoped read model; expose only approved information to the caller.

## Features implemented by this rule set

`AUTH-01`, `AUTH-02`, `AUTH-03`, `AUTH-04` (see full requirement descriptions).

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

## Authentication & Authorization — internal components

**Status:** Proposed NestJS modular-monolith design informed by the decided stack in the master decisions checklist. This is not code already implemented in the SQLAlchemy repository.

| Component | Responsibility | Failure boundary |
| --- | --- | --- |
| HTTP controller / DTO validator | Accept typed requests for authentication & authorization, reject malformed payloads | `400/422`, no database change |
| Use-case service | Execute: OTP login; validate session; require scope; revoke token | Explicit domain errors, no invented outcomes |
| Policy/authorization service | Enforce user role, object ownership, business eligibility | `403/404` and audit denied attempt |
| Domain repository | Execute scoped PostgreSQL reads/writes within a transaction | Retry only on safe concurrency errors |
| Outbox / integration adapter | Publish committed changes toward other modules or third parties | Durable retry and dead-letter review if adopted |

### Boundaries

OTP for routine identities, password plus TOTP for privileged staff where decided; session lock/revocation and location roles checked by every service. Do not use the migration owner in application runtime. Public controllers must not call database workflow functions with arbitrary SQL and must not accept a caller-supplied `actor_user_id`. Network IO belongs outside long-lived locks. Modules should depend on domain interfaces, not on each other's ORM entities. Consult Dependencies and Architecture_Overview.

## Database Usage

## Authentication & Authorization — existing database usage

**Confirmed database:** 24 PostgreSQL schemas; SQL migration authority the checked-in SQL migration history. The tables below exist, but **a schema-domain association does not automatically mean this module owns every row or has write rights**. The database repository is not an HTTP service.

- `identity.api_client_secrets` — columns · contracts
- `identity.api_clients` — columns · contracts
- `identity.login_attempts` — columns · contracts
- `identity.mfa_factors` — columns · contracts
- `identity.otp_challenges` — columns · contracts
- `identity.password_history` — columns · contracts
- `identity.permissions` — columns · contracts
- `identity.role_permissions` — columns · contracts
- `identity.roles` — columns · contracts
- `identity.sessions` — columns · contracts
- `identity.trusted_devices` — columns · contracts
- `identity.user_profiles` — columns · contracts

## Ownership, transactions and change control

Proposed owning service: `Authentication_Access`. Main read concerns: otp, privileged mfa, sessions, server permissions and trusted db contexts. Writes must be restricted by the actual foreign keys, CHECKs, unique contracts, crosswalks, policy and trigger guards. Use one transaction per domain state transition, use an outbox for reliable cross-module publication, and make any external retry idempotent.

**Safety:** OTP for routine identities, password plus TOTP for privileged staff where decided; session lock/revocation and location roles checked by every service. Do not use the migration owner in application runtime.

Internal ID strategy: `identity.users.id` is UUID; most other tables have BIGINT internal PK with original immutable UUID alias. Never cast UUID to BIGINT or expose DB internal IDs as authorization tokens. All schema changes require new forward-only SQL migration under the source repo and a fresh PG15/PG18 parity test. Related Migration_Strategy.

## Dependencies

## Authentication & Authorization — dependencies and ownership

**Underlying schemas:** `identity`, `organization`, `platform`. These schemas are shared data domains; shared reads are not automatic write rights. Candidate collaborator modules are inferred from overlapping schema use:

- Admin_CMS
- Audit
- Customer_Accounts
- Delivery_Operations
- Notifications
- Order_Operations
- Prescription_Upload
- Reporting

## Communication rules

Use the owning service interface for business changes rather than making uncontrolled cross-module writes. In the chosen modular-monolith style, synchronous application calls can remain in-process. BullMQ/Redis jobs serve slow notifications and integrations after commit; they should not become the source of order, payment, stock or clinical truth. Build independent adapters for Cashfree, POS/Techsmith, MSG91 and driver APIs; failures must remain visible.

**Data-access contract:** OTP for routine identities, password plus TOTP for privileged staff where decided; session lock/revocation and location roles checked by every service. Do not use the migration owner in application runtime.. Related: Module_Dependencies and Database_Usage.

## Domain Models

## Authentication & Authorization — domain objects and DTO boundaries

**Proposed objects, not new database tables.** A domain object is a service-level business concept; a DTO is a validated data transfer object (API input/output). Do not confuse them with the Python SQLAlchemy models used for schema verification.

| Proposed object | Source of truth / evidence | Rules |
| --- | --- | --- |
| `Authentication_AccessCommand` | Authenticated HTTP request and expected version | Includes actor context, idempotency key and validated business input |
| `Authentication_AccessAggregate` | Domain rows listed in Database Usage | Represents the current authoritative business facts |
| `Authentication_AccessPolicy` | Approved master/role records and product rules | OTP for routine identities, password plus TOTP for privileged staff where decided; session lock/revocation and location roles checked by every service. Do not use the migration owner in application runtime. |
| `Authentication_AccessReadModel` | Role-filtered current state | Removes protected fields and translates internal statuses |
| `Authentication_AccessEvent` | Committed state transition and audit ID | Events carry references and versions, not clinical documents |

**Existing representative tables:** `identity.api_client_secrets`, `identity.api_clients`, `identity.login_attempts`, `identity.mfa_factors`, `identity.otp_challenges`, `identity.password_history`, `identity.permissions`, `identity.role_permissions`. Internal BIGINT primary keys are never used as authorization credentials, and original UUID public references must remain stable. Any DTO field not directly supported by a confirmed column must be labelled proposed until the API team approves the mapping. See Database_Usage.

## Error Handling

## Authentication & Authorization — failure handling

**Primary rule:** OTP for routine identities, password plus TOTP for privileged staff where decided; session lock/revocation and location roles checked by every service. Do not use the migration owner in application runtime.

- **Missing or invalid input:** respond with a field-specific problem code; do not leak sensitive data and do not write partial state.
- **Unauthorized object or location:** return `403` or privacy-safe `404`; record the attempted privileged action.
- **Duplicate submission:** return the persisted result when key + payload match; reject key reuse with different payload.
- **Stale/concurrent change:** database version/FK/CHECK guard must resolve a single winner; caller reloads latest projection.
- **Partial external failure:** leave the aggregate pending, never mark payment/stock/delivery success by assumption. Retry verified idempotent adapter calls; otherwise reconcile manually.
- **Safety or compliance policy unknown:** fail closed. Route staff to an exception queue and customer to a non-misleading status.

Use structured problem codes, request ID, retryability category and operator runbook reference. Sensitive Rx, financial tokens, OTPs and location traces must not be placed into logs. See Error_Responses and Incident_Triage.

## Interfaces And DTOs

## Login, sessions, roles and access control — proposed interfaces and DTOs

**Business context:** Client-supplied actor, role and location are never trusted as authorisation context.

**Controller contract:** validate identity and scope before accepting a command; never expose internal BIGINT IDs. Typed inputs should carry allowed public identifiers, operation-specific fields, expected record version and a unique idempotency key on mutations.

**Use-case interface:** `execute(trustedContext, validatedRequest) -> acceptedResult | domainError`. This is pseudocode for a boundary, **not generated application code**.

**Repository interface:** require a database transaction handle, parameterised SQL/ORM queries, and a stored accepted transition. Return public UUIDs or approved opaque references only.

**Error DTO proposal:** `{"error":{"code":"STATE_CONFLICT","message":"Refresh the record and try again","request_id":"..."}}`. Do not expose SQL errors, provider secrets or prescription contents.

**Existing table candidates:** `identity.users`, `identity.sessions`, `identity.roles`, `identity.user_roles`, `identity.permissions`.

**Per-operation request and response examples:** API contract index. No generic DTO in this document overrides module-specific validation.

## Internal Architecture

## Login, sessions, roles and access control — internal architecture

**Status: Proposed application design.** The database repo does not contain a NestJS HTTP implementation.

## Business behavior
Client-supplied actor, role and location are never trusted as authorisation context.

## Components
| Component | Responsibility | Data affected | Failure outcome |
| --- | --- | --- | --- |
| `Authentication_AccessController` (proposed) | Validate DTO and request context | Public API request only | 400/401/403 without partial mutation |
| `Authentication_AccessUseCase` (proposed) | Enforce module business invariant | identity.users, identity.sessions, identity.roles | Domain status, do not guess provider truth |
| `Authentication_AccessRepository` (proposed) | Scoped SQL transaction and concurrency guard | Exact migrated tables | Roll back on conflict or constraint error |
| `Authentication_AccessIntegrationAdapter` (only when needed) | Map external IO and reconcile delivery | Outbox/inbox or verified provider record | Retries outside DB lock |

## Transaction and retry sequence

1. validate login method and anti-automation protections.
2. check identity, session and current role memberships.
3. apply server-owned patient/site tenant scope.
4. mint rotated short-lived session credentials.
5. log denied or suspicious outcomes safely.

## Existing tables (candidate responsibilities)
- identity.users — candidate entity; verify the exact operation and field set in the implementation review.
- identity.sessions — candidate entity; verify the exact operation and field set in the implementation review.
- identity.roles — candidate entity; verify the exact operation and field set in the implementation review.
- identity.user_roles — candidate entity; verify the exact operation and field set in the implementation review.
- identity.permissions — candidate entity; verify the exact operation and field set in the implementation review.

## Related
HLD · States · Permissions

## Observability

## Login, sessions, roles and access control — observability

**Proposed runtime design:** Structured logs record correlation ID, module, operation, outcome code and elapsed time. Replace identifiers with approved pseudonymous references. No raw OTP, prescription text, secrets, payment credentials, addresses or GPS coordinates in logs.

**Candidate counters:** `authentication_access_command_total{outcome}`, `authentication_access_denied_total{reason}`, and `authentication_access_provider_pending_total` when an external provider is involved. Names are proposed and require monitoring owner review.

**Actionable alerts:** persistent command rejection spikes, outbox backlog, stale integrations or reconciliation mismatches; thresholds are open questions, not fabricated service-level objectives.

Monitoring design

## Permissions

## Authentication & Authorization — permission model

**Actors:** All actors. **Proposed service scope:** `all`. Roles are application concepts; existing PostgreSQL NOLOGIN capability roles form a separate lower-level authorization layer.

| Operation class | Required entitlement | Enforcement |
| --- | --- | --- |
| Read own/scoped data | Authenticated identity + object or location ownership | Controller + service + database guard where provided |
| Create / edit | Explicit module action grant, approved master and domain status | Policy decision before transaction |
| Override / refund / pharmacist action | Specialized staff permission and documented approval reason | Distinct privilege, immutable audit evidence |
| Export / sensitive view | Purpose-limited role, retention and access logging | Recheck at download/stream time |

**Core constraint:** OTP for routine identities, password plus TOTP for privileged staff where decided; session lock/revocation and location roles checked by every service. Do not use the migration owner in application runtime. A customer cannot infer another customer's resource existence. Do not connect app runtime through migration-owner credentials. Consult Roles_and_Permissions.

## Requirements

## Authentication & Authorization — functional requirements

**Source:** the documented draft requirements. **Status:** Draft requirements, not proof of final business acceptance. 🔴/🟡/🟢 priorities have been normalized as Must/Should/Could without changing their meaning.

| Feature | Priority in v0.1 | Statement | Dependency |
| --- | --- | --- | --- |
| `AUTH-01` | Must (draft) | Password + authenticator 2FA for Super Admin, Central Admin, Finance Manager | Not stated |
| `AUTH-02` | Must (draft) | Lockout rules, session limits, one session per staff account | Not stated |
| `AUTH-03` | Must (draft) | OTP rate limits per number and IP | Not stated |
| `AUTH-04` | Must (draft) | Permissions checked on the server for every request | Not stated |

## Interactions and acceptance basis

The user performs: OTP login; validate session; require scope; revoke token. Server-side enforcement must preserve this invariant: **OTP for routine identities, password plus TOTP for privileged staff where decided; session lock/revocation and location roles checked by every service. Do not use the migration owner in application runtime.**

A feature becomes implementation-ready only after its inputs (especially any dependency listed above), permissions, workflow outcome, API body and database transaction are resolved. Confirm business thresholds before coding: a field existing in SQL is not proof that its value was approved.

See requirement coverage and test IDs.

## Sequence Diagrams

## Login, sessions, roles and access control — request sequence

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

## Authentication & Authorization — service design

**Proposed NestJS module:** `Authentication_AccessModule` with a controller, application service, authorization policy, repository and adapters. The supplied database code is a schema/validation library; no running HTTP controller was found in Archive 2.

## Candidate service methods

- `API-089: verify_staff_challenge(actor_context, validated_command, expected_version) -> Result`
- `API-090: require_privileged_mfa(actor_context, validated_command, expected_version) -> Result`
- `API-091: rotate_refresh_credential(actor_context, validated_command, expected_version) -> Result`
- `API-092: revoke_active_session(actor_context, validated_command, expected_version) -> Result`
- `API-093: resolve_current_allowed_scopes(actor_context, validated_command, expected_version) -> Result`

## Transaction and integration contract

For each mutation: authenticate actor, validate inputs, read affected rows with a lock/version check, verify policy, update the minimum relevant rows and immutable audit/outbox in one transaction. A remote gateway, storage or GPS call should be performed outside the locked transaction and reconciled on callback/timeout. Use PostgreSQL to reject invalid writes even if application validation is bypassed.

**Module invariant:** OTP for routine identities, password plus TOTP for privileged staff where decided; session lock/revocation and location roles checked by every service. Do not use the migration owner in application runtime.

**Timeouts/retries:** configure per provider, use exponential backoff with caps for safe reads and idempotent messages; never blindly repeat charge/refund/cash state changes. A dead-letter queue is an optional BullMQ operating pattern because BullMQ/Redis are selected in the checklist, but exact job topology needs signoff. **Telemetry:** actor pseudonym, request ID, action, state transition latency, retries and failure category; redact protected clinical and payment contents. See Database_Usage and Monitoring.

## State Transitions

## Authentication & Authorization — state and transition policy

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

**Module-specific invariant:** OTP for routine identities, password plus TOTP for privileged staff where decided; session lock/revocation and location roles checked by every service. Do not use the migration owner in application runtime.

Each transition must record the prior state, target state, reason where required, actor, accepted version and timestamp. A second command on the same state must either replay the prior idempotent result or fail with `409`. A failed external callback cannot roll an accepted state backward; reconcile with authoritative provider evidence. When an order changes, keep clinical, payment, inventory, fulfillment and delivery statuses separate, then derive one safe user-visible projection.

Read actual state constraints in Database_Usage and stage documents in Workflows.

## Testing

## Authentication & Authorization — verification and acceptance

**Candidate test IDs** derived one-to-one from the v0.1 feature IDs. They are test-design work items, not claims that the tests have been implemented. Database-level tests reported in the source do not replace HTTP and browser tests.

| Stable test ID | Behavior | Expected result |
| --- | --- | --- |
| `TC-AUTH-01-OK` | Password + authenticator 2FA for Super Admin, Central Admin, Finance Manager | Authorized valid input yields committed business effect and correct customer/staff projection |
| `TC-AUTH-01-DENY` | Invalid actor, stale state, duplicate or unavailable dependency | No unauthorized/duplicate effect; safe error or pending state |
| `TC-AUTH-02-OK` | Lockout rules, session limits, one session per staff account | Authorized valid input yields committed business effect and correct customer/staff projection |
| `TC-AUTH-02-DENY` | Invalid actor, stale state, duplicate or unavailable dependency | No unauthorized/duplicate effect; safe error or pending state |
| `TC-AUTH-03-OK` | OTP rate limits per number and IP | Authorized valid input yields committed business effect and correct customer/staff projection |
| `TC-AUTH-03-DENY` | Invalid actor, stale state, duplicate or unavailable dependency | No unauthorized/duplicate effect; safe error or pending state |
| `TC-AUTH-04-OK` | Permissions checked on the server for every request | Authorized valid input yields committed business effect and correct customer/staff projection |
| `TC-AUTH-04-DENY` | Invalid actor, stale state, duplicate or unavailable dependency | No unauthorized/duplicate effect; safe error or pending state |

## Cross-module contract tests

- Verify authenticated customer/staff/location ownership using actual restricted runtime roles.
- Verify concurrency and duplicate idempotency behavior against an isolated PostgreSQL database with authoritative migrations.
- Verify safe retry when callbacks or files arrive late or malformed.
- Verify audit and notification records are based on committed state and contain no confidential payloads.
- Verify this invariant: **OTP for routine identities, password plus TOTP for privileged staff where decided; session lock/revocation and location roles checked by every service. Do not use the migration owner in application runtime.**

Coverage state: **Designed, not executed for the proposed application**. Link individual results to the associated test ID and requirement before go-live. Read Test_Strategy.

## Validations

## Authentication & Authorization — validation checkpoints

| Boundary | Required validation | Rejection outcome |
| --- | --- | --- |
| Input | Required fields, type, size, allowed format and business master codes | `400/422`; no write |
| Actor | Session validity, role, location, customer/patient/parcel ownership | `401/403/404`; audit |
| Version | Accepted order revision or row version matches, if state-changing | `409`; fetch current state |
| Domain | OTP for routine identities, password plus TOTP for privileged staff where decided; session lock/revocation and location roles checked by every service. Do not use the migration owner in application runtime. | Explicit blocked/pending/error status |
| Database | FK, PK, UNIQUE, CHECK, trigger and RLS outcome | Safe conflict/business error; rollback |
| Integration | Authenticated provider/callback, idempotency key and settled evidence | Keep pending; reconciliation task |

**Requirements:** `AUTH-01`, `AUTH-02`, `AUTH-03`, `AUTH-04`. Never trust browser-supplied patient, clinical decision, backend actor context, price or available quantity. Refer to Testing for negative tests.

## Workflows

## Authentication & Authorization — operational workflows

**Entry points:** OTP login; validate session; require scope; revoke token. **User group:** All actors. The following source-defined order journey stages identify primary ownership; supporting modules also participate without necessarily owning the stage.

This module supports shared controls across multiple stages; no single stage is exclusively owned.

## Shared processing rules

The requested action is first validated against user scope, current state and approved business master data. Read required evidence from real migrated tables; change only data this module owns; publish a safe event or notify the next module after commit.

**Alternative paths:** missing required input keeps the process actionable; a stale or duplicate request is deduplicated; another actor's update returns a version conflict; external unavailability produces a pending/blocked state. Prescriptions, inventory, payments and logistics never independently set the whole order to delivered.

**Module-specific rule:** OTP for routine identities, password plus TOTP for privileged staff where decided; session lock/revocation and location roles checked by every service. Do not use the migration owner in application runtime.

See State_Transitions and Unified_Order.
