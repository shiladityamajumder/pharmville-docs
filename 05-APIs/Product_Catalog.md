# Product Catalog API contracts

**Shared contract standards:** [conventions](API-Conventions.md) · [authentication/authorization](Authentication-and-Authorization.md) · [response envelope](Standard-Responses.md) · [errors](Error-Catalog.md) · [pagination](Pagination-and-Filtering.md) · [idempotency/concurrency](Idempotency-and-Concurrency.md) · [database-to-DTO mapping](Database-DTO-Mapping.md) · [coverage/readiness](API-Contract-Coverage.md).

> [!NOTE]
> **Implementation evidence:** these Pharmville routes are proposed documentation contracts; no executable Pharmville HTTP routes or contract tests were found. A verified response envelope from the separate authentication service does not confirm these operation DTOs. Resolve the operation-specific gaps listed in the coverage ledger before implementation.

**Contract readiness:** Proposed for architectural review. Each route remains blocked from implementation until its operation-specific DTO, permissions, persistence mapping, state transition and tests are approved under D-024. See the [coverage ledger](API-Contract-Coverage.md) and [audit H-03](../09-References/Engineering-Audit.md#rechecked-earlier-findings).

## API-010 — GET `/v1/catalog/categories`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Product_Catalog.
- **Purpose:** Browse published categories.

**Requirement links:** `CAT-01`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Valid access token AND server-side role/location/patient/order ownership check. Public catalogue reads may be anonymous, subject to throttling. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Product_Catalog`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`, `search.documents`, `search.indexing_jobs`. Read/write behavior follows the operation: **browse published categories**.

### HTTP request contract

Query parameters: optional `limit` (proposed default 20, max 100) and `offset` (proposed default 0, max 100000), using the offset metadata shape. No category filter applies to the root category listing. These numeric values are based on the auth-service pagination defaults but require Pharmville approval under D-024.

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

```http
GET /v1/catalog/categories HTTP/1.1

```

### Success response (illustrative)

**Proposed response DTO (`data.categories`, D-024 approval pending):** each entry projects `catalog.categories.id/name/slug/parent_id/level/display_order`. `parentCategoryId` is nullable; `level` and `displayOrder` are nonnegative. Internal `internal_id`, metadata JSON, and actor fields are excluded. The route is public per WF-002; response status is proposed `200`.

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "categoryId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "name": "Medicines",
        "slug": "medicines",
        "parentCategoryId": null,
        "level": 0,
        "displayOrder": 10
      }
    ]
  },
  "error": null,
  "meta": {
    "requestId": "0c50f15a-373f-42d3-b1ae-3d90a415cd91",
    "correlationId": "9182b204-cb82-4ddc-a49d-b07743388ed6",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": {
      "totalCount": 1,
      "limit": 20,
      "offset": 0,
      "hasNext": false
    }
  }
}
```

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-011 — GET `/v1/catalog/products`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Product_Catalog.
- **Purpose:** Browse and filter products.

**Requirement links:** `CAT-01`, `CAT-04`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Valid access token AND server-side role/location/patient/order ownership check. Public catalogue reads may be anonymous, subject to throttling. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Product_Catalog`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`, `search.documents`, `search.indexing_jobs`. Read/write behavior follows the operation: **browse and filter products**.

### HTTP request contract

Query parameters: optional `categoryId` (UUID), `limit` and `offset`. `categoryId` narrows the published product set. Sort keys are not exposed until the owner approves an allowlist and confirms a stable query/index. Limit defaults/bounds are proposed in [pagination](Pagination-and-Filtering.md).

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

```http
GET /v1/catalog/products HTTP/1.1

```

### Success response (illustrative)

**Query proposal (D-024):** `categoryId` is an optional public UUID filter; `limit`/`offset` use the proposed offset defaults and bounds in [pagination](Pagination-and-Filtering.md). Only published, active products are visible. No arbitrary sort field is accepted.

**Proposed response DTO (`data.products`, D-024 approval pending):** each card projects public product ID, name/display name, optional brand/category, approved P/M/O class, prescription-required flag, pack-size display and strength display. Mappings are `catalog.products` plus the approved `catalog.brands` join.

Product status, SKU, actor fields, search keywords, internal IDs and raw JSON are not exposed. Response status is proposed `200`.

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcd0",
        "name": "Paracetamol 500 mg",
        "displayName": null,
        "brandName": "Example Pharma",
        "categoryId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "commerceClass": "P",
        "prescriptionRequired": true,
        "packSizeDisplay": "10 tablets",
        "strengthDisplay": "500 mg"
      }
    ]
  },
  "error": null,
  "meta": {
    "requestId": "0c50f15a-373f-42d3-b1ae-3d90a415cd91",
    "correlationId": "9182b204-cb82-4ddc-a49d-b07743388ed6",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": {
      "totalCount": 1,
      "limit": 20,
      "offset": 0,
      "hasNext": false
    }
  }
}
```

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-012 — GET `/v1/catalog/products/{product_id}`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Product_Catalog.
- **Purpose:** Get product detail.

**Requirement links:** `CAT-02`, `CAT-06`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Valid access token AND server-side role/location/patient/order ownership check. Public catalogue reads may be anonymous, subject to throttling. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Product_Catalog`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`, `search.documents`, `search.indexing_jobs`. Read/write behavior follows the operation: **get product detail**.

### HTTP request contract

Path parameter `product_id`: required UUID matching public `catalog.products.id`; reject malformed identifiers as `400 BAD_REQUEST`. No query parameters.

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

```http
GET /v1/catalog/products/<product-uuid> HTTP/1.1

```

### Success response (illustrative)

**Path parameter:** `product_id` is the public `catalog.products.id` UUID, not `internal_id`. Return `404 RESOURCE_NOT_FOUND` for unpublished, inactive, deleted or unknown products.

**Proposed response DTO (`data`, D-024 approval pending):** `product` uses the API-011 card projection; `manufacturerName` is a safe projection of `catalog.manufacturers.name`; localized `description`/`contentLocale` are derived from `catalog.product_content`; `salts` maps `catalog.product_salts` to public salt IDs/name and nullable strength; `price.mrp`/`sellingPrice` are decimal strings backed by current `pricing.product_prices` numeric(14,2), with selling price constrained at or below MRP. `currency` comes from the selected price-book context and is not a product price column.

No cost, file object ID, license number or internal key is returned. Locale fallback, media URL/signing, price-book selection and currency policy remain D-024 decisions. Response status is proposed `200`.

```json
{
  "success": true,
  "data": {
    "product": {
      "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcd0",
      "name": "Paracetamol 500 mg",
      "displayName": null,
      "brandName": "Example Pharma",
      "categoryId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "commerceClass": "P",
      "prescriptionRequired": true,
      "packSizeDisplay": "10 tablets",
      "strengthDisplay": "500 mg"
    },
    "manufacturerName": "Example Manufacturer",
    "description": "Example product description.",
    "contentLocale": "en-IN",
    "salts": [
      {
        "saltId": "0192a1b2-c3d4-7e8f-9012-3456789abcd1",
        "name": "Paracetamol",
        "strength": "500 mg"
      }
    ],
    "price": {
      "mrp": "25.00",
      "sellingPrice": "22.50",
      "currency": "INR"
    }
  },
  "error": null,
  "meta": {
    "requestId": "0c50f15a-373f-42d3-b1ae-3d90a415cd91",
    "correlationId": "9182b204-cb82-4ddc-a49d-b07743388ed6",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-013 — GET `/v1/catalog/search`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Product_Catalog.
- **Purpose:** Search by name, brand or salt.

**Requirement links:** `CAT-03`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Valid access token AND server-side role/location/patient/order ownership check. Public catalogue reads may be anonymous, subject to throttling. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Product_Catalog`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`, `search.documents`, `search.indexing_jobs`. Read/write behavior follows the operation: **search by name, brand or salt**.

### HTTP request contract

Query parameter `q`: required string, proposed 2–128 characters; optional `limit` and `offset`. CAT-03 requires name/brand/composition search and typo-tolerant autosuggest, but ranking, normalization and typo thresholds are open D-024 decisions.

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

```http
GET /v1/catalog/search HTTP/1.1

```

### Success response (illustrative)

**Query proposal (D-024):** required `q`, 2–128 characters, searches published product name, brand and composition as described by CAT-03; typo tolerance/autosuggest behavior and matching thresholds require owner approval. Use proposed offset pagination. Do not expose stored raw search telemetry.

**Proposed response DTO (`data.items`):** filtered product cards as in API-011. Empty search returns an empty array and offset metadata with `hasNext:false`. Response status is proposed `200`.

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcd0",
        "name": "Paracetamol 500 mg",
        "displayName": null,
        "brandName": "Example Pharma",
        "categoryId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "commerceClass": "P",
        "prescriptionRequired": true,
        "packSizeDisplay": "10 tablets",
        "strengthDisplay": "500 mg"
      }
    ]
  },
  "error": null,
  "meta": {
    "requestId": "0c50f15a-373f-42d3-b1ae-3d90a415cd91",
    "correlationId": "9182b204-cb82-4ddc-a49d-b07743388ed6",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": {
      "totalCount": 1,
      "limit": 20,
      "offset": 0,
      "hasNext": false
    }
  }
}
```

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-014 — GET `/v1/catalog/availability`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Product_Catalog.
- **Purpose:** Check location stock.

**Requirement links:** `CAT-04`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Valid access token AND server-side role/location/patient/order ownership check. Public catalogue reads may be anonymous, subject to throttling. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Product_Catalog`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`, `search.documents`, `search.indexing_jobs`. Read/write behavior follows the operation: **check location stock**.

### HTTP request contract

Query parameters `productId` (required UUID) and `postalCode` (required six-digit string for the current India-first requirement). CAT-04 defines pin-code stock availability. Batch lookup remains an explicit contract decision.

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

```http
GET /v1/catalog/availability HTTP/1.1

```

### Success response (illustrative)

**Query proposal (D-024):** required `productId` UUID and `postalCode` (six digits for the current India-first feature scope). The product requirement is CAT-04. Changing to a batch input requires an approved contract change. No warehouse/location ID supplied by a customer is trusted as an authorization scope.

**Proposed response DTO (`data`, D-024 approval pending):** `productId`, normalized `postalCode`, derived `availability` (`in_stock`, `out_of_stock`, or `unconfirmed`) and nullable `observedAt`. Inventory evidence is read through authorized stock-balance/lot and serviceability logic; no quantity, lot, warehouse ID or reservation is exposed.

A stale/unavailable observation returns `unconfirmed`, not out-of-stock. This read never guarantees later checkout stock. Response status is proposed `200`.

```json
{
  "success": true,
  "data": {
    "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcd0",
    "postalCode": "560001",
    "availability": "unconfirmed",
    "observedAt": null
  },
  "error": null,
  "meta": {
    "requestId": "0c50f15a-373f-42d3-b1ae-3d90a415cd91",
    "correlationId": "9182b204-cb82-4ddc-a49d-b07743388ed6",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-015 — POST `/v1/admin/catalog/imports`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Product_Catalog.
- **Purpose:** Import catalogue draft.

**Requirement links:** `ADM-07`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Product_Catalog`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`, `search.documents`, `search.indexing_jobs`. Read/write behavior follows the operation: **import catalogue draft**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Proposed request DTO (D-024):** JSON `{ "fileId": "<public UUID>" }`. `fileId` maps only to `platform.file_objects.id`; the server verifies file ownership, private classification/access, completion, clean malware scan, extension/content-type allowlist and size before processing.

The allowed workbook formats and byte limit require owner approval. The authenticated actor is taken from the session. No import-job table or status route exists in the documented schema/API inventory, so an accepted async command needs a persistence and polling design before implementation.

```json
{
  "fileId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
}
```

### Success response (illustrative)

**Proposed `202 Accepted` response DTO:** `{importId, status}` where `importId` is an API-only UUID and `status` is `queued`. This response means accepted for processing, not that products were imported. No documented import job table or polling route backs the identifier.

D-024 must choose a documented owner persistence/read model or replace this with an explicitly synchronous error-report contract; until then this endpoint is blocked.

```json
{
  "success": true,
  "data": {
    "importId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "status": "queued"
  },
  "error": null,
  "meta": {
    "requestId": "0c50f15a-373f-42d3-b1ae-3d90a415cd91",
    "correlationId": "9182b204-cb82-4ddc-a49d-b07743388ed6",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-016 — POST `/v1/admin/catalog/products/{product_id}/classification`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Product_Catalog.
- **Purpose:** Approve P/M/O classification.

**Requirement links:** `ADM-06`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Product_Catalog`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`, `search.documents`, `search.indexing_jobs`. Read/write behavior follows the operation: **approve p/m/o classification**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Proposed request DTO (D-024):** `commerceClass` (`P`, `M`, or `O`) and positive `expectedRowVersion`. The class maps to `catalog.products.commerce_class`; the precondition maps to `row_version`. The server derives `prescription_required` (`true` exactly for `P`) to satisfy the documented check constraint.

The approving actor and timestamp are server-generated; do not accept user IDs or an `approvedAt` value from the client.

```json
{
  "commerceClass": "P",
  "expectedRowVersion": 3
}
```

### Success response (illustrative)

**Proposed response DTO:** `productId`, `commerceClass`, derived `prescriptionRequired`, `classificationVersion`, `rowVersion`, and server-set `approvedAt`. These map to the documented product fields; the reviewer identity is retained only server-side. Success `200` reports the committed classification but does not imply the product is published.

```json
{
  "success": true,
  "data": {
    "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "commerceClass": "P",
    "prescriptionRequired": true,
    "classificationVersion": 2,
    "rowVersion": 4,
    "approvedAt": "2026-10-24T10:30:00Z"
  },
  "error": null,
  "meta": {
    "requestId": "0c50f15a-373f-42d3-b1ae-3d90a415cd91",
    "correlationId": "9182b204-cb82-4ddc-a49d-b07743388ed6",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-017 — POST `/v1/admin/catalog/products/{product_id}/publish`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Product_Catalog.
- **Purpose:** Publish approved SKU.

**Requirement links:** `ADM-06`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Product_Catalog`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`, `search.documents`, `search.indexing_jobs`. Read/write behavior follows the operation: **publish approved sku**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Proposed request DTO (D-024):** positive `expectedRowVersion`, mapped to `catalog.products.row_version`. The server verifies the product is eligible and its classification is approved, then performs the documented publication transition. The client cannot set `status`, `publishedAt`, or actor fields.

```json
{
  "expectedRowVersion": 4
}
```

### Success response (illustrative)

**Proposed response DTO:** `productId`, active `status`, server-set `publishedAt`, and new `rowVersion` after commit. Success `200` reports publication only after its owning transaction commits.

```json
{
  "success": true,
  "data": {
    "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "status": "active",
    "publishedAt": "2026-10-24T10:30:00Z",
    "rowVersion": 5
  },
  "error": null,
  "meta": {
    "requestId": "0c50f15a-373f-42d3-b1ae-3d90a415cd91",
    "correlationId": "9182b204-cb82-4ddc-a49d-b07743388ed6",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.
