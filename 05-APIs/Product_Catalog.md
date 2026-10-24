# Product Catalog API contracts


**Shared contract standards:** [conventions](API-Conventions.md) · [authentication/authorization](Authentication-and-Authorization.md) · [response envelope](Standard-Responses.md) · [errors](Error-Catalog.md) · [pagination](Pagination-and-Filtering.md) · [idempotency/concurrency](Idempotency-and-Concurrency.md) · [database-to-DTO mapping](Database-DTO-Mapping.md) · [coverage/readiness](API-Contract-Coverage.md).

**Implementation evidence:** these Pharmville routes are proposed documentation contracts; no executable Pharmville HTTP routes or contract tests were found. A verified response envelope from the separate authentication service does not confirm these operation DTOs. Resolve the operation-specific gaps listed in the coverage ledger before implementation.

**Contract readiness:** Proposed for architectural review. Each route remains blocked from implementation until its operation-specific DTO, permissions, persistence mapping, state transition and tests are approved under D-024. See the [coverage ledger](API-Contract-Coverage.md) and [audit H-03](../09-References/Engineering-Audit.md#rechecked-earlier-findings).


## API-010 — GET `/v1/catalog/categories`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Product_Catalog. **Purpose:** Browse published categories.

**Requirement links:** `CAT-01`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Valid access token AND server-side role/location/patient/order ownership check. Public catalogue reads may be anonymous, subject to throttling. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Product_Catalog`. Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`, `search.documents`, `search.indexing_jobs`. Read/write behavior follows the operation: **browse published categories**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

```http
GET /v1/catalog/categories HTTP/1.1

```

## Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Browse published categories; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

## Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

## Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-011 — GET `/v1/catalog/products`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Product_Catalog. **Purpose:** Browse and filter products.

**Requirement links:** `CAT-01`, `CAT-04`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Valid access token AND server-side role/location/patient/order ownership check. Public catalogue reads may be anonymous, subject to throttling. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Product_Catalog`. Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`, `search.documents`, `search.indexing_jobs`. Read/write behavior follows the operation: **browse and filter products**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

```http
GET /v1/catalog/products HTTP/1.1

```

## Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Browse and filter products; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

## Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

## Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-012 — GET `/v1/catalog/products/{product_id}`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Product_Catalog. **Purpose:** Get product detail.

**Requirement links:** `CAT-02`, `CAT-06`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Valid access token AND server-side role/location/patient/order ownership check. Public catalogue reads may be anonymous, subject to throttling. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Product_Catalog`. Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`, `search.documents`, `search.indexing_jobs`. Read/write behavior follows the operation: **get product detail**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

```http
GET /v1/catalog/products/<product-uuid> HTTP/1.1

```

## Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Get product detail; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

## Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

## Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-013 — GET `/v1/catalog/search`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Product_Catalog. **Purpose:** Search by name, brand or salt.

**Requirement links:** `CAT-03`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Valid access token AND server-side role/location/patient/order ownership check. Public catalogue reads may be anonymous, subject to throttling. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Product_Catalog`. Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`, `search.documents`, `search.indexing_jobs`. Read/write behavior follows the operation: **search by name, brand or salt**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

```http
GET /v1/catalog/search HTTP/1.1

```

## Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Search by name, brand or salt; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

## Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

## Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-014 — GET `/v1/catalog/availability`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Product_Catalog. **Purpose:** Check location stock.

**Requirement links:** `CAT-04`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Valid access token AND server-side role/location/patient/order ownership check. Public catalogue reads may be anonymous, subject to throttling. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Product_Catalog`. Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`, `search.documents`, `search.indexing_jobs`. Read/write behavior follows the operation: **check location stock**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

```http
GET /v1/catalog/availability HTTP/1.1

```

## Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Check location stock; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

## Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

## Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-015 — POST `/v1/admin/catalog/imports`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Product_Catalog. **Purpose:** Import catalogue draft.

**Requirement links:** `ADM-07`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Product_Catalog`. Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`, `search.documents`, `search.indexing_jobs`. Read/write behavior follows the operation: **import catalogue draft**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Request DTO — Blocked by D-024:** the available sources establish this operation's purpose (Import catalogue draft) and candidate data owner, but do not establish an approved public request schema. The Tech lead, module owner and QA lead must approve field names, types/nullability/bounds, conditional rules, actor/resource scope, and aggregate version, then align the OpenAPI request schema. No database column is assumed to be a public field; implementation remains blocked until this decision is recorded.

## Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Import catalogue draft; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

## Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

## Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-016 — POST `/v1/admin/catalog/products/{product_id}/classification`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Product_Catalog. **Purpose:** Approve P/M/O classification.

**Requirement links:** `ADM-06`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Product_Catalog`. Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`, `search.documents`, `search.indexing_jobs`. Read/write behavior follows the operation: **approve p/m/o classification**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Request DTO — Blocked by D-024:** the available sources establish this operation's purpose (Approve P/M/O classification) and candidate data owner, but do not establish an approved public request schema. The Tech lead, module owner and QA lead must approve field names, types/nullability/bounds, conditional rules, actor/resource scope, and aggregate version, then align the OpenAPI request schema. No database column is assumed to be a public field; implementation remains blocked until this decision is recorded.

## Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Approve P/M/O classification; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

## Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

## Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-017 — POST `/v1/admin/catalog/products/{product_id}/publish`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Product_Catalog. **Purpose:** Publish approved SKU.

**Requirement links:** `ADM-06`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Product_Catalog`. Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`, `search.documents`, `search.indexing_jobs`. Read/write behavior follows the operation: **publish approved sku**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Request DTO — Blocked by D-024:** the available sources establish this operation's purpose (Publish approved SKU) and candidate data owner, but do not establish an approved public request schema. The Tech lead, module owner and QA lead must approve field names, types/nullability/bounds, conditional rules, actor/resource scope, and aggregate version, then align the OpenAPI request schema. No database column is assumed to be a public field; implementation remains blocked until this decision is recorded.

## Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Publish approved SKU; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

## Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

## Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.
