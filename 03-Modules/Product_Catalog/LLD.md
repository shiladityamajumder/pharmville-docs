# Product Catalog LLD

## Acceptance Criteria

## Product discovery and classification — implementation acceptance

**Proposed conditions for engineering handoff; never imply QA passed.**

## Draft features
- **CAT-01 / REQ-008:** Browse by category and sub-category (Must (draft)).
- **CAT-02 / REQ-009:** Product page: brand, manufacturer, composition, pack size, MRP, price, images, "Prescription required" label (Must (draft)).
- **CAT-03 / REQ-010:** Search by name, brand and composition, with typo tolerance and autosuggest (Must (draft)).
- **CAT-04 / REQ-011:** Availability for the customer's pin code (in stock / out of stock) (Must (draft)).
- **CAT-05 / REQ-012:** Alternative medicines: same composition, strength and dosage form, ranked by a configurable rule (Should (draft)).
- **CAT-06 / REQ-013:** Placeholder image when a product has none (Must (draft)).

## Required release checks
- Authorised happy path persists exactly the intended state.
- Invalid, cross-account and cross-location requests leave authoritative rows unchanged.
- Concurrent duplicate requests do not create duplicate money, stock or order effects.
- File, prescription and patient data are not exposed to unauthorised roles.
- Recoverable provider failure exposes a pending/retryable state; never claims success.
- Audit/trace data contains public references, not credentials or sensitive document contents.

Module test scenarios

## API Design

## Product Catalog & Search — HTTP API responsibilities

All routes below are **Proposed REST v1 contracts**. The database repository does not implement them. Public UUIDs identify resources; staff scope and patient/order ownership are checked at each handler, not inferred from URL paths.

- API-010 GET /v1/catalog/categories — Browse published categories
- API-011 GET /v1/catalog/products — Browse and filter products
- API-012 GET /v1/catalog/products/{product_id} — Get product detail
- API-013 GET /v1/catalog/search — Search by name, brand or salt
- API-014 GET /v1/catalog/availability — Check location stock
- API-015 POST /v1/admin/catalog/imports — Import catalogue draft
- API-016 POST /v1/admin/catalog/products/{product_id}/classification — Approve P/M/O classification
- API-017 POST /v1/admin/catalog/products/{product_id}/publish — Publish approved SKU

## Cross-cutting request contract

Writes require validated body, stable intent key, expected current version when appropriate, auditable actor identity and an explicit outcome. Reads use safe pagination and permission-filtered fields. `401` indicates no valid session; `403/404` denied scope; `409` conflict; `422` business validation; `503` unknown upstream outcome. Read API_Conventions before implementing the endpoint.

**Business gate:** The product_type descriptive taxonomy is not the approved commerce_class gate. A controlled versioned P/M/O classification is required; never infer pharmacy eligibility from keywords or substitute another strength. For actual response fields, see the linked illustrative contract and approve a typed OpenAPI schema before implementation.

## Business Logic

## Product Catalog & Search — business logic and invariants

**Rule origin:** the documented draft requirements, the documented draft requirements and database migration guards. Distinguish a **confirmed database guard** from a **proposed API orchestration** and **open numeric policy**.

## Core procedure

1. Authenticate the actor and resolve server-owned tenant/location/patient permission.
2. Re-read the relevant product, order, document, stock or ledger state from the owning tables.
3. Reject incomplete or stale input; validate the latest accepted revision and current classification where relevant.
4. Apply the module invariant: **The product_type descriptive taxonomy is not the approved commerce_class gate. A controlled versioned P/M/O classification is required; never infer pharmacy eligibility from keywords or substitute another strength.**
5. In a transaction, persist the minimal authoritative rows, version and audit outcome; publish notifications after commit.
6. Return a scoped read model; expose only approved information to the caller.

## Features implemented by this rule set

`CAT-01`, `CAT-02`, `CAT-03`, `CAT-04`, `CAT-05`, `CAT-06` (see full requirement descriptions).

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

## Product Catalog & Search — internal components

**Status:** Proposed NestJS modular-monolith design informed by the decided stack in the master decisions checklist. This is not code already implemented in the SQLAlchemy repository.

| Component | Responsibility | Failure boundary |
| --- | --- | --- |
| HTTP controller / DTO validator | Accept typed requests for product catalog & search, reject malformed payloads | `400/422`, no database change |
| Use-case service | Execute: Browse published products; import/approve product; search and filter | Explicit domain errors, no invented outcomes |
| Policy/authorization service | Enforce user role, object ownership, business eligibility | `403/404` and audit denied attempt |
| Domain repository | Execute scoped PostgreSQL reads/writes within a transaction | Retry only on safe concurrency errors |
| Outbox / integration adapter | Publish committed changes toward other modules or third parties | Durable retry and dead-letter review if adopted |

### Boundaries

The product_type descriptive taxonomy is not the approved commerce_class gate. A controlled versioned P/M/O classification is required; never infer pharmacy eligibility from keywords or substitute another strength. Public controllers must not call database workflow functions with arbitrary SQL and must not accept a caller-supplied `actor_user_id`. Network IO belongs outside long-lived locks. Modules should depend on domain interfaces, not on each other's ORM entities. Consult Dependencies and Architecture_Overview.

## Database Usage

## Product Catalog & Search — existing database usage

**Confirmed database:** 24 PostgreSQL schemas; SQL migration authority the checked-in SQL migration history. The tables below exist, but **a schema-domain association does not automatically mean this module owns every row or has write rights**. The database repository is not an HTTP service.

- `catalog.brands` — columns · contracts
- `catalog.categories` — columns · contracts
- `catalog.product_classification_history` — columns · contracts
- `catalog.products` — columns · contracts
- `search.documents` — columns · contracts
- `search.indexing_jobs` — columns · contracts
- `search.query_events` — columns · contracts
- `search.redirects` — columns · contracts
- `search.synonyms` — columns · contracts

## Ownership, transactions and change control

Proposed owning service: `Product_Catalog`. Main read concerns: product identity, p/m/o approval, browsing, search and public product details. Writes must be restricted by the actual foreign keys, CHECKs, unique contracts, crosswalks, policy and trigger guards. Use one transaction per domain state transition, use an outbox for reliable cross-module publication, and make any external retry idempotent.

**Safety:** The product_type descriptive taxonomy is not the approved commerce_class gate. A controlled versioned P/M/O classification is required; never infer pharmacy eligibility from keywords or substitute another strength.

Internal ID strategy: `identity.users.id` is UUID; most other tables have BIGINT internal PK with original immutable UUID alias. Never cast UUID to BIGINT or expose DB internal IDs as authorization tokens. All schema changes require new forward-only SQL migration under the source repo and a fresh PG15/PG18 parity test. Related Migration_Strategy.

## Dependencies

## Product Catalog & Search — dependencies and ownership

**Underlying schemas:** `catalog`, `search`, `pricing`, `marketplace`. These schemas are shared data domains; shared reads are not automatic write rights. Candidate collaborator modules are inferred from overlapping schema use:

- Cart_Checkout
- Inventory

## Communication rules

Use the owning service interface for business changes rather than making uncontrolled cross-module writes. In the chosen modular-monolith style, synchronous application calls can remain in-process. BullMQ/Redis jobs serve slow notifications and integrations after commit; they should not become the source of order, payment, stock or clinical truth. Build independent adapters for Cashfree, POS/Techsmith, MSG91 and driver APIs; failures must remain visible.

**Data-access contract:** The product_type descriptive taxonomy is not the approved commerce_class gate. A controlled versioned P/M/O classification is required; never infer pharmacy eligibility from keywords or substitute another strength.. Related: Module_Dependencies and Database_Usage.

## Domain Models

## Product Catalog & Search — domain objects and DTO boundaries

**Proposed objects, not new database tables.** A domain object is a service-level business concept; a DTO is a validated data transfer object (API input/output). Do not confuse them with the Python SQLAlchemy models used for schema verification.

| Proposed object | Source of truth / evidence | Rules |
| --- | --- | --- |
| `Product_CatalogCommand` | Authenticated HTTP request and expected version | Includes actor context, idempotency key and validated business input |
| `Product_CatalogAggregate` | Domain rows listed in Database Usage | Represents the current authoritative business facts |
| `Product_CatalogPolicy` | Approved master/role records and product rules | The product_type descriptive taxonomy is not the approved commerce_class gate. A controlled versioned P/M/O classification is required; never infer pharmacy eligibility from keywords or substitute another strength. |
| `Product_CatalogReadModel` | Role-filtered current state | Removes protected fields and translates internal statuses |
| `Product_CatalogEvent` | Committed state transition and audit ID | Events carry references and versions, not clinical documents |

**Existing representative tables:** `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`, `search.documents`, `search.indexing_jobs`, `search.query_events`, `search.redirects`. Internal BIGINT primary keys are never used as authorization credentials, and original UUID public references must remain stable. Any DTO field not directly supported by a confirmed column must be labelled proposed until the API team approves the mapping. See Database_Usage.

## Error Handling

## Product Catalog & Search — failure handling

**Primary rule:** The product_type descriptive taxonomy is not the approved commerce_class gate. A controlled versioned P/M/O classification is required; never infer pharmacy eligibility from keywords or substitute another strength.

- **Missing or invalid input:** respond with a field-specific problem code; do not leak sensitive data and do not write partial state.
- **Unauthorized object or location:** return `403` or privacy-safe `404`; record the attempted privileged action.
- **Duplicate submission:** return the persisted result when key + payload match; reject key reuse with different payload.
- **Stale/concurrent change:** database version/FK/CHECK guard must resolve a single winner; caller reloads latest projection.
- **Partial external failure:** leave the aggregate pending, never mark payment/stock/delivery success by assumption. Retry verified idempotent adapter calls; otherwise reconcile manually.
- **Safety or compliance policy unknown:** fail closed. Route staff to an exception queue and customer to a non-misleading status.

Use structured problem codes, request ID, retryability category and operator runbook reference. Sensitive Rx, financial tokens, OTPs and location traces must not be placed into logs. See Error_Responses and Incident_Triage.

## Interfaces And DTOs

## Product discovery and classification — proposed interfaces and DTOs

**Business context:** Only approved and classified items can enter a legally permitted checkout path.

**Controller contract:** validate identity and scope before accepting a command; never expose internal BIGINT IDs. Typed inputs should carry allowed public identifiers, operation-specific fields, expected record version and a unique idempotency key on mutations.

**Use-case interface:** `execute(trustedContext, validatedRequest) -> acceptedResult | domainError`. This is pseudocode for a boundary, **not generated application code**.

**Repository interface:** require a database transaction handle, parameterised SQL/ORM queries, and a stored accepted transition. Return public UUIDs or approved opaque references only.

**Error DTO proposal:** `{"error":{"code":"STATE_CONFLICT","message":"Refresh the record and try again","request_id":"..."}}`. Do not expose SQL errors, provider secrets or prescription contents.

**Existing table candidates:** `catalog.products`, `catalog.product_variants`, `catalog.product_classification_history`, `catalog.categories`, `search.documents`.

**Per-operation request and response examples:** API contract index. No generic DTO in this document overrides module-specific validation.

## Internal Architecture

## Product discovery and classification — internal architecture

**Status: Proposed application design.** The database repo does not contain a NestJS HTTP implementation.

## Business behavior
Only approved and classified items can enter a legally permitted checkout path.

## Components
| Component | Responsibility | Data affected | Failure outcome |
| --- | --- | --- | --- |
| `Product_CatalogController` (proposed) | Validate DTO and request context | Public API request only | 400/401/403 without partial mutation |
| `Product_CatalogUseCase` (proposed) | Enforce module business invariant | catalog.products, catalog.product_variants, catalog.product_classification_history | Domain status, do not guess provider truth |
| `Product_CatalogRepository` (proposed) | Scoped SQL transaction and concurrency guard | Exact migrated tables | Roll back on conflict or constraint error |
| `Product_CatalogIntegrationAdapter` (only when needed) | Map external IO and reconcile delivery | Outbox/inbox or verified provider record | Retries outside DB lock |

## Transaction and retry sequence

1. resolve visible category/search query.
2. filter published and approved products.
3. resolve classification and price version.
4. apply serviceability/available-stock projection.
5. return safe catalog DTO.

## Existing tables (candidate responsibilities)
- catalog.products — candidate entity; verify the exact operation and field set in the implementation review.
- catalog.product_variants — candidate entity; verify the exact operation and field set in the implementation review.
- catalog.product_classification_history — candidate entity; verify the exact operation and field set in the implementation review.
- catalog.categories — candidate entity; verify the exact operation and field set in the implementation review.
- search.documents — candidate entity; verify the exact operation and field set in the implementation review.

## Related
HLD · States · Permissions

## Observability

## Product discovery and classification — observability

**Proposed runtime design:** Structured logs record correlation ID, module, operation, outcome code and elapsed time. Replace identifiers with approved pseudonymous references. No raw OTP, prescription text, secrets, payment credentials, addresses or GPS coordinates in logs.

**Candidate counters:** `product_catalog_command_total{outcome}`, `product_catalog_denied_total{reason}`, and `product_catalog_provider_pending_total` when an external provider is involved. Names are proposed and require monitoring owner review.

**Actionable alerts:** persistent command rejection spikes, outbox backlog, stale integrations or reconciliation mismatches; thresholds are open questions, not fabricated service-level objectives.

Monitoring design

## Permissions

## Product Catalog & Search — permission model

**Actors:** Customer, Catalog Manager. **Proposed service scope:** `customer,staff_catalog`. Roles are application concepts; existing PostgreSQL NOLOGIN capability roles form a separate lower-level authorization layer.

| Operation class | Required entitlement | Enforcement |
| --- | --- | --- |
| Read own/scoped data | Authenticated identity + object or location ownership | Controller + service + database guard where provided |
| Create / edit | Explicit module action grant, approved master and domain status | Policy decision before transaction |
| Override / refund / pharmacist action | Specialized staff permission and documented approval reason | Distinct privilege, immutable audit evidence |
| Export / sensitive view | Purpose-limited role, retention and access logging | Recheck at download/stream time |

**Core constraint:** The product_type descriptive taxonomy is not the approved commerce_class gate. A controlled versioned P/M/O classification is required; never infer pharmacy eligibility from keywords or substitute another strength. A customer cannot infer another customer's resource existence. Do not connect app runtime through migration-owner credentials. Consult Roles_and_Permissions.

## Requirements

## Product Catalog & Search — functional requirements

**Source:** the documented draft requirements. **Status:** Draft requirements, not proof of final business acceptance. 🔴/🟡/🟢 priorities have been normalized as Must/Should/Could without changing their meaning.

| Feature | Priority in v0.1 | Statement | Dependency |
| --- | --- | --- | --- |
| `CAT-01` | Must (draft) | Browse by category and sub-category | Category tree |
| `CAT-02` | Must (draft) | Product page: brand, manufacturer, composition, pack size, MRP, price, images, "Prescription required" label | Product list |
| `CAT-03` | Must (draft) | Search by name, brand and composition, with typo tolerance and autosuggest | Salt and brand masters |
| `CAT-04` | Must (draft) | Availability for the customer's pin code (in stock / out of stock) | Store stock |
| `CAT-05` | Should (draft) | Alternative medicines: same composition, strength and dosage form, ranked by a configurable rule | Q21, cost prices |
| `CAT-06` | Must (draft) | Placeholder image when a product has none | Not stated |

## Interactions and acceptance basis

The user performs: Browse published products; import/approve product; search and filter. Server-side enforcement must preserve this invariant: **The product_type descriptive taxonomy is not the approved commerce_class gate. A controlled versioned P/M/O classification is required; never infer pharmacy eligibility from keywords or substitute another strength.**

A feature becomes implementation-ready only after its inputs (especially any dependency listed above), permissions, workflow outcome, API body and database transaction are resolved. Confirm business thresholds before coding: a field existing in SQL is not proof that its value was approved.

See requirement coverage and test IDs.

## Sequence Diagrams

## Product discovery and classification — request sequence

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

## Product Catalog & Search — service design

**Proposed NestJS module:** `Product_CatalogModule` with a controller, application service, authorization policy, repository and adapters. The supplied database code is a schema/validation library; no running HTTP controller was found in Archive 2.

## Candidate service methods

- `API-010: browse_published_categories(actor_context, validated_command, expected_version) -> Result`
- `API-011: browse_and_filter_products(actor_context, validated_command, expected_version) -> Result`
- `API-012: get_product_detail(actor_context, validated_command, expected_version) -> Result`
- `API-013: search_by_name,_brand_or_salt(actor_context, validated_command, expected_version) -> Result`
- `API-014: check_location_stock(actor_context, validated_command, expected_version) -> Result`
- `API-015: import_catalogue_draft(actor_context, validated_command, expected_version) -> Result`
- `API-016: approve_p/m/o_classification(actor_context, validated_command, expected_version) -> Result`
- `API-017: publish_approved_sku(actor_context, validated_command, expected_version) -> Result`

## Transaction and integration contract

For each mutation: authenticate actor, validate inputs, read affected rows with a lock/version check, verify policy, update the minimum relevant rows and immutable audit/outbox in one transaction. A remote gateway, storage or GPS call should be performed outside the locked transaction and reconciled on callback/timeout. Use PostgreSQL to reject invalid writes even if application validation is bypassed.

**Module invariant:** The product_type descriptive taxonomy is not the approved commerce_class gate. A controlled versioned P/M/O classification is required; never infer pharmacy eligibility from keywords or substitute another strength.

**Timeouts/retries:** configure per provider, use exponential backoff with caps for safe reads and idempotent messages; never blindly repeat charge/refund/cash state changes. A dead-letter queue is an optional BullMQ operating pattern because BullMQ/Redis are selected in the checklist, but exact job topology needs signoff. **Telemetry:** actor pseudonym, request ID, action, state transition latency, retries and failure category; redact protected clinical and payment contents. See Database_Usage and Monitoring.

## State Transitions

## Product Catalog & Search — state and transition policy

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

**Module-specific invariant:** The product_type descriptive taxonomy is not the approved commerce_class gate. A controlled versioned P/M/O classification is required; never infer pharmacy eligibility from keywords or substitute another strength.

Each transition must record the prior state, target state, reason where required, actor, accepted version and timestamp. A second command on the same state must either replay the prior idempotent result or fail with `409`. A failed external callback cannot roll an accepted state backward; reconcile with authoritative provider evidence. When an order changes, keep clinical, payment, inventory, fulfillment and delivery statuses separate, then derive one safe user-visible projection.

Read actual state constraints in Database_Usage and stage documents in Workflows.

## Testing

## Product Catalog & Search — verification and acceptance

**Candidate test IDs** derived one-to-one from the v0.1 feature IDs. They are test-design work items, not claims that the tests have been implemented. Database-level tests reported in the source do not replace HTTP and browser tests.

| Stable test ID | Behavior | Expected result |
| --- | --- | --- |
| `TC-CAT-01-OK` | Browse by category and sub-category | Authorized valid input yields committed business effect and correct customer/staff projection |
| `TC-CAT-01-DENY` | Invalid actor, stale state, duplicate or unavailable dependency | No unauthorized/duplicate effect; safe error or pending state |
| `TC-CAT-02-OK` | Product page: brand, manufacturer, composition, pack size, MRP, price, images, "Prescription required" label | Authorized valid input yields committed business effect and correct customer/staff projection |
| `TC-CAT-02-DENY` | Invalid actor, stale state, duplicate or unavailable dependency | No unauthorized/duplicate effect; safe error or pending state |
| `TC-CAT-03-OK` | Search by name, brand and composition, with typo tolerance and autosuggest | Authorized valid input yields committed business effect and correct customer/staff projection |
| `TC-CAT-03-DENY` | Invalid actor, stale state, duplicate or unavailable dependency | No unauthorized/duplicate effect; safe error or pending state |
| `TC-CAT-04-OK` | Availability for the customer's pin code (in stock / out of stock) | Authorized valid input yields committed business effect and correct customer/staff projection |
| `TC-CAT-04-DENY` | Invalid actor, stale state, duplicate or unavailable dependency | No unauthorized/duplicate effect; safe error or pending state |
| `TC-CAT-05-OK` | Alternative medicines: same composition, strength and dosage form, ranked by a configurable rule | Authorized valid input yields committed business effect and correct customer/staff projection |
| `TC-CAT-05-DENY` | Invalid actor, stale state, duplicate or unavailable dependency | No unauthorized/duplicate effect; safe error or pending state |
| `TC-CAT-06-OK` | Placeholder image when a product has none | Authorized valid input yields committed business effect and correct customer/staff projection |
| `TC-CAT-06-DENY` | Invalid actor, stale state, duplicate or unavailable dependency | No unauthorized/duplicate effect; safe error or pending state |

## Cross-module contract tests

- Verify authenticated customer/staff/location ownership using actual restricted runtime roles.
- Verify concurrency and duplicate idempotency behavior against an isolated PostgreSQL database with authoritative migrations.
- Verify safe retry when callbacks or files arrive late or malformed.
- Verify audit and notification records are based on committed state and contain no confidential payloads.
- Verify this invariant: **The product_type descriptive taxonomy is not the approved commerce_class gate. A controlled versioned P/M/O classification is required; never infer pharmacy eligibility from keywords or substitute another strength.**

Coverage state: **Designed, not executed for the proposed application**. Link individual results to the associated test ID and requirement before go-live. Read Test_Strategy.

## Validations

## Product Catalog & Search — validation checkpoints

| Boundary | Required validation | Rejection outcome |
| --- | --- | --- |
| Input | Required fields, type, size, allowed format and business master codes | `400/422`; no write |
| Actor | Session validity, role, location, customer/patient/parcel ownership | `401/403/404`; audit |
| Version | Accepted order revision or row version matches, if state-changing | `409`; fetch current state |
| Domain | The product_type descriptive taxonomy is not the approved commerce_class gate. A controlled versioned P/M/O classification is required; never infer pharmacy eligibility from keywords or substitute another strength. | Explicit blocked/pending/error status |
| Database | FK, PK, UNIQUE, CHECK, trigger and RLS outcome | Safe conflict/business error; rollback |
| Integration | Authenticated provider/callback, idempotency key and settled evidence | Keep pending; reconciliation task |

**Requirements:** `CAT-01`, `CAT-02`, `CAT-03`, `CAT-04`, `CAT-05`, `CAT-06`. Never trust browser-supplied patient, clinical decision, backend actor context, price or available quantity. Refer to Testing for negative tests.

## Workflows

## Product Catalog & Search — operational workflows

**Entry points:** Browse published products; import/approve product; search and filter. **User group:** Customer, Catalog Manager. The following source-defined order journey stages identify primary ownership; supporting modules also participate without necessarily owning the stage.

- S01 — Find the right product
- S02 — Understand the item
- S34 — Stop unsafe products immediately

## Shared processing rules

The requested action is first validated against user scope, current state and approved business master data. Read required evidence from real migrated tables; change only data this module owns; publish a safe event or notify the next module after commit.

**Alternative paths:** missing required input keeps the process actionable; a stale or duplicate request is deduplicated; another actor's update returns a version conflict; external unavailability produces a pending/blocked state. Prescriptions, inventory, payments and logistics never independently set the whole order to delivered.

**Module-specific rule:** The product_type descriptive taxonomy is not the approved commerce_class gate. A controlled versioned P/M/O classification is required; never infer pharmacy eligibility from keywords or substitute another strength.

See State_Transitions and Unified_Order.
