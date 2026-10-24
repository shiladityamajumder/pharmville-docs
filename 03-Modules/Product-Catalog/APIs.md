# Product Catalog API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](../../05-APIs/API-Contract-Coverage.md) · [OpenAPI 3.1](../../05-APIs/openapi.yaml) · [decisions](../../05-APIs/Planning-Decisions.md) · [DTO conventions](../../05-APIs/API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="product-catalog-api-contracts"></a>
<a id="api-010--get-v1catalogcategories"></a>
<a id="caller-permissions-and-dependencies"></a>
<a id="http-request-contract"></a>
<a id="success-response-illustrative"></a>
<a id="errors-concurrency-and-failure-recovery"></a>
<a id="required-verification"></a>
<a id="api-011--get-v1catalogproducts"></a>
<a id="caller-permissions-and-dependencies-1"></a>
<a id="http-request-contract-1"></a>
<a id="success-response-illustrative-1"></a>
<a id="errors-concurrency-and-failure-recovery-1"></a>
<a id="required-verification-1"></a>
<a id="api-012--get-v1catalogproductsproduct_id"></a>
<a id="caller-permissions-and-dependencies-2"></a>
<a id="http-request-contract-2"></a>
<a id="success-response-illustrative-2"></a>
<a id="errors-concurrency-and-failure-recovery-2"></a>
<a id="required-verification-2"></a>
<a id="api-013--get-v1catalogsearch"></a>
<a id="caller-permissions-and-dependencies-3"></a>
<a id="http-request-contract-3"></a>
<a id="success-response-illustrative-3"></a>
<a id="errors-concurrency-and-failure-recovery-3"></a>
<a id="required-verification-3"></a>
<a id="api-014--get-v1catalogavailability"></a>
<a id="caller-permissions-and-dependencies-4"></a>
<a id="http-request-contract-4"></a>
<a id="success-response-illustrative-4"></a>
<a id="errors-concurrency-and-failure-recovery-4"></a>
<a id="required-verification-4"></a>
<a id="api-015--post-v1admincatalogimports"></a>
<a id="caller-permissions-and-dependencies-5"></a>
<a id="http-request-contract-5"></a>
<a id="success-response-illustrative-5"></a>
<a id="errors-concurrency-and-failure-recovery-5"></a>
<a id="required-verification-5"></a>
<a id="api-016--post-v1admincatalogproductsproduct_idclassification"></a>
<a id="caller-permissions-and-dependencies-6"></a>
<a id="http-request-contract-6"></a>
<a id="success-response-illustrative-6"></a>
<a id="errors-concurrency-and-failure-recovery-6"></a>
<a id="required-verification-6"></a>
<a id="api-017--post-v1admincatalogproductsproduct_idpublish"></a>
<a id="caller-permissions-and-dependencies-7"></a>
<a id="http-request-contract-7"></a>
<a id="success-response-illustrative-7"></a>
<a id="errors-concurrency-and-failure-recovery-7"></a>
<a id="required-verification-7"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-010 | `GET /v1/catalog/categories` | Browse the active category hierarchy. | Complete proposed |
| API-011 | `GET /v1/catalog/products` | Browse published products in an optional category. | Complete proposed |
| API-012 | `GET /v1/catalog/products/{product_id}` | Read a published product with safe composition and price projections. | Complete proposed |
| API-013 | `GET /v1/catalog/search` | Search published product names and approved salt aliases. | Complete proposed |
| API-014 | `GET /v1/catalog/availability` | Show advisory availability for one product and delivery postal code. | Complete proposed |
| API-015 | `POST /v1/admin/catalog/imports` | Accept a clean catalog import file for row validation. | Incomplete — D-019/D-024: spreadsheet columns, row atomicity and durable import result/status model are not documented. |
| API-016 | `POST /v1/admin/catalog/products/{product_id}/classification` | Approve a product commerce classification with immutable evidence. | Complete proposed |
| API-017 | `POST /v1/admin/catalog/products/{product_id}/publish` | Publish an approved complete product into customer discovery. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| CAT-01 | Browse by category and sub-category | API-010, API-011 |
| CAT-02 | Product page: brand, manufacturer, composition, pack size, MRP, price, images, "Prescription required" label | API-012 |
| CAT-03 | Search by name, brand and composition, with typo tolerance and autosuggest | API-013 |
| CAT-04 | Availability for the customer's pin code (in stock / out of stock) | API-014 |
| CAT-05 | Alternative medicines: same composition, strength and dosage form, ranked by a configurable rule | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| CAT-06 | Placeholder image when a product has none | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |

## API-010 — GET `/v1/catalog/categories`

**Browse the active category hierarchy.**

| Property | Proposed contract |
| --- | --- |
| API name | Browse the active category hierarchy |
| Version / owner | v1 / Product_Catalog |
| Consumer | Public |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `CAT-01`; [WF-002](../../06-Workflows/WF-002-Search-and-Availability.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/catalog/categories` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| NO | None (purpose-bound pre-login proof where supplied) | Public | Published catalog read (Proposed grant code) |


Public catalog access: no bearer, existing session, login challenge or role is required. Expose only the published approved safe projection; availability is advisory and never grants stock, customer or clinical access.

Only is_active and nondeleted categories; parent IDs are public UUIDs; pagination does not imply a full subtree.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Not Applicable | Omit | Pre-login/provider trust path; no bearer. |
| Content-Type | media type | Not Applicable | Omit | No request body. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Not Applicable | Omit | Read or single-use credential semantics; no generic secret-response cache. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

Not Applicable. No parameters in this location.


### Query parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| limit | integer | Optional | No | 20 | minimum=1; maximum=100 | Optional allowlisted filter; does not widen authenticated scope. |
| offset | integer | Optional | No | 0 | minimum=0; maximum=100000 | Optional allowlisted filter; does not widen authenticated scope. |
| parentCategoryId | string (uuid) | Optional | No | None | format="uuid" | Optional allowlisted filter; does not widen authenticated scope. |


Only declared query fields are accepted. Sorting is fixed: `display_order ASC, id ASC`. Pagination: offset.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `CatalogCategoryListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `categories` | array<object> | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `categories[].categoryId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public projection of catalog.categories.id. |
| `categories[].name` | string | Required | No | None (not silently populated) | maxLength=255 | catalog.categories.name. |
| `categories[].slug` | string | Required | No | None (not silently populated) | maxLength=255 | Stable category code; does not expose internal_id. |
| `categories[].parentCategoryId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | catalog.categories.parent_id; null for a root. |
| `categories[].level` | integer | Required | No | None (not silently populated) | minimum=0 | catalog.categories.level. |
| `categories[].displayOrder` | integer | Required | No | None (not silently populated) | minimum=0 | catalog.categories.display_order. |


Pagination metadata: `totalCount: integer ≥0`, `limit: integer 1–100`, `offset: integer 0–100000`, `hasNext: boolean`. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "categoryId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "name": "Example personal care item",
        "slug": "example-personal-care-item",
        "parentCategoryId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "level": 0,
        "displayOrder": 0
      }
    ]
  },
  "error": null,
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
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

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 422 | `REQUEST_VALIDATION_ERROR` | A declared path/query/header field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-010 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


Representative structured error (other codes use the same envelope):

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "REQUEST_VALIDATION_ERROR",
    "message": "A declared path/query/header field violates its typed contract.",
    "details": null
  },
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Database mapping and ownership

| Table | Access | Exact relevant columns | Owner / effect |
| --- | --- | --- | --- |
| [`catalog.categories`](../../04-Database/Tables/catalog/categories.md) | Read | `display_order`, `id`, `is_active`, `is_deleted`, `level`, `name`, `parent_id`, `row_version`, `slug` | Product_Catalog projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.categories[].categoryId | catalog.categories.id |
| data.categories[].name | catalog.categories.name |
| data.categories[].slug | catalog.categories.slug |
| data.categories[].parentCategoryId | catalog.categories.parent_id |
| data.categories[].level | catalog.categories.level |
| data.categories[].displayOrder | catalog.categories.display_order |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`catalog.categories`](../../04-Database/Tables/catalog/categories.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Only is_active and nondeleted categories; parent IDs are public UUIDs; pagination does not imply a full subtree. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | offset; display_order ASC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Inactive parent/filter is not disclosed; an empty page is successful. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-010-HAPPY` | Valid Public context and documented fixture for browse the active category hierarchy. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-010-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-010-AUTH` | Call without bearer, then supply invalid purpose-bound proof if this operation accepts one. | Public operation must not require bearer; invalid proof never establishes a session. |
| `CT-API-010-SCOPE` | Use another customer/site/patient/task reference or remove Published catalog read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-010-RULE` | Only is_active and nondeleted categories; parent IDs are public UUIDs; pagination does not imply a full subtree. | Inactive parent/filter is not disclosed; an empty page is successful. |
| `CT-API-010-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-010-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-010-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-010-RECOVERY` | Dependency timeout during browse the active category hierarchy. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-CAT-01-OK`, `TC-CAT-01-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-011 — GET `/v1/catalog/products`

**Browse published products in an optional category.**

| Property | Proposed contract |
| --- | --- |
| API name | Browse published products in an optional category |
| Version / owner | v1 / Product_Catalog |
| Consumer | Public |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `CAT-01`; [WF-002](../../06-Workflows/WF-002-Search-and-Availability.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/catalog/products` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| NO | None (purpose-bound pre-login proof where supplied) | Public | Published catalog read (Proposed grant code) |


Public catalog access: no bearer, existing session, login challenge or role is required. Expose only the published approved safe projection; availability is advisory and never grants stock, customer or clinical access.

Only active, published products with approved P/M/O classification. Category filter narrows results; no unapproved clinical attributes.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Not Applicable | Omit | Pre-login/provider trust path; no bearer. |
| Content-Type | media type | Not Applicable | Omit | No request body. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Not Applicable | Omit | Read or single-use credential semantics; no generic secret-response cache. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

Not Applicable. No parameters in this location.


### Query parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| limit | integer | Optional | No | 20 | minimum=1; maximum=100 | Optional allowlisted filter; does not widen authenticated scope. |
| offset | integer | Optional | No | 0 | minimum=0; maximum=100000 | Optional allowlisted filter; does not widen authenticated scope. |
| categoryId | string (uuid) | Optional | No | None | format="uuid" | Optional allowlisted filter; does not widen authenticated scope. |


Only declared query fields are accepted. Sorting is fixed: `name ASC, id ASC`. Pagination: offset.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `CatalogProductListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `products` | array<object> | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `products[].productId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public projection of catalog.products.id. |
| `products[].name` | string | Required | No | None (not silently populated) | maxLength=255 | catalog.products.name. |
| `products[].displayName` | string/null | Required | Yes | None (not silently populated) | maxLength=255 | catalog.products.display_name. |
| `products[].brandName` | string/null | Required | Yes | None (not silently populated) | maxLength=255 | Derived from catalog.brands.name; exact join/filter requires module approval. |
| `products[].categoryId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | catalog.products.category_id. |
| `products[].commerceClass` | string | Required | No | None (not silently populated) | enum=["P", "M", "O"] | Approved catalog.products.commerce_class; public projection filters unknown/unapproved classes even though persistence permits null. |
| `products[].prescriptionRequired` | boolean | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | catalog.products.prescription_required. |
| `products[].packSizeDisplay` | string/null | Required | Yes | None (not silently populated) | maxLength=128 | catalog.products.pack_size_display. |
| `products[].strengthDisplay` | string/null | Required | Yes | None (not silently populated) | maxLength=128 | catalog.products.strength_display. |


Pagination metadata: `totalCount: integer ≥0`, `limit: integer 1–100`, `offset: integer 0–100000`, `hasNext: boolean`. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "name": "Example personal care item",
        "displayName": "Example personal care item",
        "brandName": "Synthetic demonstration brand",
        "categoryId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "commerceClass": "O",
        "prescriptionRequired": false,
        "packSizeDisplay": "1 unit",
        "strengthDisplay": null
      }
    ]
  },
  "error": null,
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
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

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 422 | `REQUEST_VALIDATION_ERROR` | A declared path/query/header field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-011 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


Representative structured error (other codes use the same envelope):

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "REQUEST_VALIDATION_ERROR",
    "message": "A declared path/query/header field violates its typed contract.",
    "details": null
  },
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Database mapping and ownership

| Table | Access | Exact relevant columns | Owner / effect |
| --- | --- | --- | --- |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Read | `brand_id`, `category_id`, `commerce_class`, `display_name`, `id`, `is_deleted`, `name`, `pack_size_display`, `prescription_required`, `row_version`, `status`, `strength_display` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md) | Read | `id`, `is_active`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.categories`](../../04-Database/Tables/catalog/categories.md) | Read | `id`, `is_active`, `is_deleted`, `parent_id`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.brands`](../../04-Database/Tables/catalog/brands.md) | Read | `id`, `is_active`, `is_deleted`, `name`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.products[].productId | catalog.products.id |
| data.products[].name | catalog.products.name |
| data.products[].displayName | catalog.products.display_name |
| data.products[].brandName | catalog.brands.name |
| data.products[].categoryId | catalog.products.category_id |
| data.products[].commerceClass | catalog.products.commerce_class |
| data.products[].prescriptionRequired | catalog.products.prescription_required |
| data.products[].packSizeDisplay | catalog.products.pack_size_display |
| data.products[].strengthDisplay | catalog.products.strength_display |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`catalog.brands`](../../04-Database/Tables/catalog/brands.md), [`catalog.categories`](../../04-Database/Tables/catalog/categories.md), [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md), [`catalog.dosage_forms`](../../04-Database/Tables/catalog/dosage_forms.md), [`catalog.manufacturers`](../../04-Database/Tables/catalog/manufacturers.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Only active, published products with approved P/M/O classification. Category filter narrows results; no unapproved clinical attributes. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | offset; name ASC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Invalid category UUID is 422; inactive products never leak through filters. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-011-HAPPY` | Valid Public context and documented fixture for browse published products in an optional category. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-011-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-011-AUTH` | Call without bearer, then supply invalid purpose-bound proof if this operation accepts one. | Public operation must not require bearer; invalid proof never establishes a session. |
| `CT-API-011-SCOPE` | Use another customer/site/patient/task reference or remove Published catalog read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-011-RULE` | Only active, published products with approved P/M/O classification. Category filter narrows results; no unapproved clinical attributes. | Invalid category UUID is 422; inactive products never leak through filters. |
| `CT-API-011-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-011-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-011-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-011-RECOVERY` | Dependency timeout during browse published products in an optional category. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-CAT-01-OK`, `TC-CAT-01-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-012 — GET `/v1/catalog/products/{product_id}`

**Read a published product with safe composition and price projections.**

| Property | Proposed contract |
| --- | --- |
| API name | Read a published product with safe composition and price projections |
| Version / owner | v1 / Product_Catalog |
| Consumer | Public |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `CAT-02`; [WF-002](../../06-Workflows/WF-002-Search-and-Availability.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/catalog/products/{product_id}` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| NO | None (purpose-bound pre-login proof where supplied) | Public | Published catalog read (Proposed grant code) |


Public catalog access: no bearer, existing session, login challenge or role is required. Expose only the published approved safe projection; availability is advisory and never grants stock, customer or clinical access.

Read approved content locale and current effective price book; null price means unavailable, not free. Descriptive product_type does not decide clinical review.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Not Applicable | Omit | Pre-login/provider trust path; no bearer. |
| Content-Type | media type | Not Applicable | Omit | No request body. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Not Applicable | Omit | Read or single-use credential semantics; no generic secret-response cache. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| product_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is fixed: `not applicable for this singleton`. Pagination: none.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `CatalogProductDetailData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `product` | object | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `product.productId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public projection of catalog.products.id. |
| `product.name` | string | Required | No | None (not silently populated) | maxLength=255 | catalog.products.name. |
| `product.displayName` | string/null | Required | Yes | None (not silently populated) | maxLength=255 | catalog.products.display_name. |
| `product.brandName` | string/null | Required | Yes | None (not silently populated) | maxLength=255 | Derived from catalog.brands.name; exact join/filter requires module approval. |
| `product.categoryId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | catalog.products.category_id. |
| `product.commerceClass` | string | Required | No | None (not silently populated) | enum=["P", "M", "O"] | Approved catalog.products.commerce_class; public projection filters unknown/unapproved classes even though persistence permits null. |
| `product.prescriptionRequired` | boolean | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | catalog.products.prescription_required. |
| `product.packSizeDisplay` | string/null | Required | Yes | None (not silently populated) | maxLength=128 | catalog.products.pack_size_display. |
| `product.strengthDisplay` | string/null | Required | Yes | None (not silently populated) | maxLength=128 | catalog.products.strength_display. |
| `manufacturerName` | string/null | Optional | Yes | None (not silently populated) | maxLength=255 | Derived from catalog.manufacturers.name; hides license and internal organization fields. |
| `description` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Filtered localized projection of catalog.product_content.title/body; HTML/structured-content policy requires D-024 approval. |
| `contentLocale` | string/null | Optional | Yes | None (not silently populated) | maxLength=16 | catalog.product_content.locale. |
| `salts` | array<object> | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `salts[].saltId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public catalog.salts.id reference. |
| `salts[].name` | string | Optional | No | None (not silently populated) | Typed schema; reject unknown object properties. | Derived from the referenced salt master; confirm exact public label mapping under D-024. |
| `salts[].strength` | string/null | Required | Yes | None (not silently populated) | maxLength=128 | catalog.product_salts.strength. |
| `price` | object or null | Required | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Current approved price or null when unavailable. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "product": {
      "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "name": "Example personal care item",
      "displayName": "Example personal care item",
      "brandName": "Synthetic demonstration brand",
      "categoryId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "commerceClass": "O",
      "prescriptionRequired": false,
      "packSizeDisplay": "1 unit",
      "strengthDisplay": null
    },
    "manufacturerName": null,
    "description": "Synthetic planning example; not an approved clinical claim.",
    "contentLocale": "en-IN",
    "salts": [],
    "price": {
      "amount": "26.25",
      "currency": "INR"
    }
  },
  "error": null,
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 422 | `REQUEST_VALIDATION_ERROR` | A declared path/query/header field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for read a published product with safe composition and price projections. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-012 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


Representative structured error (other codes use the same envelope):

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "REQUEST_VALIDATION_ERROR",
    "message": "A declared path/query/header field violates its typed contract.",
    "details": null
  },
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Database mapping and ownership

| Table | Access | Exact relevant columns | Owner / effect |
| --- | --- | --- | --- |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Read | `brand_id`, `category_id`, `commerce_class`, `display_name`, `id`, `is_deleted`, `manufacturer_id`, `name`, `pack_size_display`, `prescription_required`, `row_version`, `status`, `strength_display` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md) | Read | `id`, `is_active`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.categories`](../../04-Database/Tables/catalog/categories.md) | Read | `id`, `is_active`, `is_deleted`, `parent_id`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.brands`](../../04-Database/Tables/catalog/brands.md) | Read | `id`, `is_active`, `is_deleted`, `name`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.manufacturers`](../../04-Database/Tables/catalog/manufacturers.md) | Read | `id`, `is_active`, `is_deleted`, `name`, `organization_id`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.product_salts`](../../04-Database/Tables/catalog/product_salts.md) | Read | `id`, `product_id`, `row_version`, `salt_id`, `strength` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.salts`](../../04-Database/Tables/catalog/salts.md) | Read | `id`, `is_deleted`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.product_content`](../../04-Database/Tables/catalog/product_content.md) | Read | `id`, `is_deleted`, `locale`, `product_id`, `row_version`, `title` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`pricing.product_prices`](../../04-Database/Tables/pricing/product_prices.md) | Read | `id`, `price_book_id`, `product_id`, `row_version`, `valid_from`, `valid_until` | pricing domain owner (Proposed) projection / scoped joins; reading does not grant writes. |
| [`pricing.price_books`](../../04-Database/Tables/pricing/price_books.md) | Read | `id`, `is_deleted`, `row_version`, `status`, `valid_from`, `valid_until`, `warehouse_id` | pricing domain owner (Proposed) projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.product.productId | catalog.products.id |
| data.product.name | catalog.products.name |
| data.product.displayName | catalog.products.display_name |
| data.product.brandName | catalog.brands.name |
| data.product.categoryId | catalog.products.category_id |
| data.product.commerceClass | catalog.products.commerce_class |
| data.product.prescriptionRequired | catalog.products.prescription_required |
| data.product.packSizeDisplay | catalog.products.pack_size_display |
| data.product.strengthDisplay | catalog.products.strength_display |
| data.manufacturerName | catalog.manufacturers.name |
| data.description | catalog.product_content.title |
| data.contentLocale | catalog.product_content.locale |
| data.salts[].saltId | catalog.salts.id |
| data.salts[].name | catalog.products.name |
| data.salts[].strength | catalog.product_salts.strength |
| data.price | API-only typed projection. |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`catalog.brands`](../../04-Database/Tables/catalog/brands.md), [`catalog.categories`](../../04-Database/Tables/catalog/categories.md), [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md), [`catalog.dosage_forms`](../../04-Database/Tables/catalog/dosage_forms.md), [`catalog.manufacturers`](../../04-Database/Tables/catalog/manufacturers.md), [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`catalog.salts`](../../04-Database/Tables/catalog/salts.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../../04-Database/Tables/marketplace/sellers.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Read approved content locale and current effective price book; null price means unavailable, not free. Descriptive product_type does not decide clinical review. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Unpublished, deleted or unapproved product is privacy-safe 404; never expose cost price. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-012-HAPPY` | Valid Public context and documented fixture for read a published product with safe composition and price projections. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-012-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-012-AUTH` | Call without bearer, then supply invalid purpose-bound proof if this operation accepts one. | Public operation must not require bearer; invalid proof never establishes a session. |
| `CT-API-012-SCOPE` | Use another customer/site/patient/task reference or remove Published catalog read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-012-RULE` | Read approved content locale and current effective price book; null price means unavailable, not free. Descriptive product_type does not decide clinical review. | Unpublished, deleted or unapproved product is privacy-safe 404; never expose cost price. |
| `CT-API-012-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-012-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-012-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-012-RECOVERY` | Dependency timeout during read a published product with safe composition and price projections. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-CAT-02-OK`, `TC-CAT-02-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-013 — GET `/v1/catalog/search`

**Search published product names and approved salt aliases.**

| Property | Proposed contract |
| --- | --- |
| API name | Search published product names and approved salt aliases |
| Version / owner | v1 / Product_Catalog |
| Consumer | Public |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `CAT-03`; [WF-002](../../06-Workflows/WF-002-Search-and-Availability.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/catalog/search` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| NO | None (purpose-bound pre-login proof where supplied) | Public | Published catalog search (Proposed grant code) |


Public catalog access: no bearer, existing session, login challenge or role is required. Expose only the published approved safe projection; availability is advisory and never grants stock, customer or clinical access.

Trim q; search only safe approved documents, then recheck authoritative publication/classification to exclude stale indexed results.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Not Applicable | Omit | Pre-login/provider trust path; no bearer. |
| Content-Type | media type | Not Applicable | Omit | No request body. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Not Applicable | Omit | Read or single-use credential semantics; no generic secret-response cache. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

Not Applicable. No parameters in this location.


### Query parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| limit | integer | Optional | No | 20 | minimum=1; maximum=100 | Optional allowlisted filter; does not widen authenticated scope. |
| offset | integer | Optional | No | 0 | minimum=0; maximum=100000 | Optional allowlisted filter; does not widen authenticated scope. |
| q | string | Required | No | None | minLength=2; maxLength=120 | Trimmed product/salt query; minimum two characters. |


Only declared query fields are accepted. Sorting is fixed: `relevance DESC, product id ASC`. Pagination: offset.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `CatalogSearchData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `items` | array<object> | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `items[].productId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public projection of catalog.products.id. |
| `items[].name` | string | Required | No | None (not silently populated) | maxLength=255 | catalog.products.name. |
| `items[].displayName` | string/null | Required | Yes | None (not silently populated) | maxLength=255 | catalog.products.display_name. |
| `items[].brandName` | string/null | Required | Yes | None (not silently populated) | maxLength=255 | Derived from catalog.brands.name; exact join/filter requires module approval. |
| `items[].categoryId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | catalog.products.category_id. |
| `items[].commerceClass` | string | Required | No | None (not silently populated) | enum=["P", "M", "O"] | Approved catalog.products.commerce_class; public projection filters unknown/unapproved classes even though persistence permits null. |
| `items[].prescriptionRequired` | boolean | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | catalog.products.prescription_required. |
| `items[].packSizeDisplay` | string/null | Required | Yes | None (not silently populated) | maxLength=128 | catalog.products.pack_size_display. |
| `items[].strengthDisplay` | string/null | Required | Yes | None (not silently populated) | maxLength=128 | catalog.products.strength_display. |


Pagination metadata: `totalCount: integer ≥0`, `limit: integer 1–100`, `offset: integer 0–100000`, `hasNext: boolean`. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "name": "Example personal care item",
        "displayName": "Example personal care item",
        "brandName": "Synthetic demonstration brand",
        "categoryId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "commerceClass": "O",
        "prescriptionRequired": false,
        "packSizeDisplay": "1 unit",
        "strengthDisplay": null
      }
    ]
  },
  "error": null,
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
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

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 422 | `REQUEST_VALIDATION_ERROR` | A declared path/query/header field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-013 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


Representative structured error (other codes use the same envelope):

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "REQUEST_VALIDATION_ERROR",
    "message": "A declared path/query/header field violates its typed contract.",
    "details": null
  },
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Database mapping and ownership

| Table | Access | Exact relevant columns | Owner / effect |
| --- | --- | --- | --- |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Read | `brand_id`, `category_id`, `commerce_class`, `display_name`, `id`, `is_deleted`, `name`, `pack_size_display`, `prescription_required`, `row_version`, `status`, `strength_display` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md) | Read | `id`, `is_active`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.categories`](../../04-Database/Tables/catalog/categories.md) | Read | `id`, `is_active`, `is_deleted`, `parent_id`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.brands`](../../04-Database/Tables/catalog/brands.md) | Read | `id`, `is_active`, `is_deleted`, `name`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.product_salts`](../../04-Database/Tables/catalog/product_salts.md) | Read | `id`, `product_id`, `row_version`, `salt_id` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.salts`](../../04-Database/Tables/catalog/salts.md) | Read | `id`, `is_deleted`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`search.documents`](../../04-Database/Tables/search/documents.md) | Read | `id`, `row_version` | search domain owner (Proposed) projection / scoped joins; reading does not grant writes. |
| [`search.synonyms`](../../04-Database/Tables/search/synonyms.md) | Read | `id`, `is_active`, `is_deleted`, `row_version` | search domain owner (Proposed) projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.items[].productId | catalog.products.id |
| data.items[].name | catalog.products.name |
| data.items[].displayName | catalog.products.display_name |
| data.items[].brandName | catalog.brands.name |
| data.items[].categoryId | catalog.products.category_id |
| data.items[].commerceClass | catalog.products.commerce_class |
| data.items[].prescriptionRequired | catalog.products.prescription_required |
| data.items[].packSizeDisplay | catalog.products.pack_size_display |
| data.items[].strengthDisplay | catalog.products.strength_display |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`catalog.brands`](../../04-Database/Tables/catalog/brands.md), [`catalog.categories`](../../04-Database/Tables/catalog/categories.md), [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md), [`catalog.dosage_forms`](../../04-Database/Tables/catalog/dosage_forms.md), [`catalog.manufacturers`](../../04-Database/Tables/catalog/manufacturers.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`catalog.salts`](../../04-Database/Tables/catalog/salts.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Trim q; search only safe approved documents, then recheck authoritative publication/classification to exclude stale indexed results. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | offset; relevance DESC, product id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Search failure returns 503 with no fabricated match; retry GET. Empty matches return items []. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-013-HAPPY` | Valid Public context and documented fixture for search published product names and approved salt aliases. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-013-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-013-AUTH` | Call without bearer, then supply invalid purpose-bound proof if this operation accepts one. | Public operation must not require bearer; invalid proof never establishes a session. |
| `CT-API-013-SCOPE` | Use another customer/site/patient/task reference or remove Published catalog search. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-013-RULE` | Trim q; search only safe approved documents, then recheck authoritative publication/classification to exclude stale indexed results. | Search failure returns 503 with no fabricated match; retry GET. Empty matches return items []. |
| `CT-API-013-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-013-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-013-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-013-RECOVERY` | Dependency timeout during search published product names and approved salt aliases. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-CAT-03-OK`, `TC-CAT-03-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-014 — GET `/v1/catalog/availability`

**Show advisory availability for one product and delivery postal code.**

| Property | Proposed contract |
| --- | --- |
| API name | Show advisory availability for one product and delivery postal code |
| Version / owner | v1 / Product_Catalog |
| Consumer | Public |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `CAT-04`; [WF-002](../../06-Workflows/WF-002-Search-and-Availability.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/catalog/availability` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| NO | None (purpose-bound pre-login proof where supplied) | Public | Advisory catalog availability (Proposed grant code) |


Public catalog access: no bearer, existing session, login challenge or role is required. Expose only the published approved safe projection; availability is advisory and never grants stock, customer or clinical access.

Evaluate serviceability and freshness. Missing source/freshness evidence returns availability unconfirmed; do not disclose batch counts, exact locations or promise a reservation.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Not Applicable | Omit | Pre-login/provider trust path; no bearer. |
| Content-Type | media type | Not Applicable | Omit | No request body. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Not Applicable | Omit | Read or single-use credential semantics; no generic secret-response cache. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

Not Applicable. No parameters in this location.


### Query parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| productId | string (uuid) | Required | No | None | format="uuid" | Optional allowlisted filter; does not widen authenticated scope. |
| postalCode | string | Required | No | None | minLength=1; maxLength=6; pattern="^[1-9][0-9]{5}$" | Optional allowlisted filter; does not widen authenticated scope. |


Only declared query fields are accepted. Sorting is fixed: `not applicable for this singleton`. Pagination: none.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `CatalogAvailabilityData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `productId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from catalog.products.id. Ownership and current-state checks apply before use. |
| `postalCode` | string | Required | No | None (not silently populated) | pattern="^[1-9][0-9]{5}$" | Public DTO value from organization.locations.postal_code. Ownership and current-state checks apply before use. |
| `availability` | string | Required | No | None (not silently populated) | enum=["in_stock", "out_of_stock", "unconfirmed"] | Derived advisory projection of authorized Inventory evidence; never reserves or guarantees stock. |
| `observedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | Derived from inventory observation evidence; null if not available. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "postalCode": "201301",
    "availability": "in_stock",
    "observedAt": "2026-10-24T10:30:00Z"
  },
  "error": null,
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 422 | `REQUEST_VALIDATION_ERROR` | A declared path/query/header field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-014 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


Representative structured error (other codes use the same envelope):

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "REQUEST_VALIDATION_ERROR",
    "message": "A declared path/query/header field violates its typed contract.",
    "details": null
  },
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Database mapping and ownership

| Table | Access | Exact relevant columns | Owner / effect |
| --- | --- | --- | --- |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Read | `brand_id`, `category_id`, `commerce_class`, `id`, `is_deleted`, `row_version`, `status` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md) | Read | `id`, `is_active`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.categories`](../../04-Database/Tables/catalog/categories.md) | Read | `id`, `is_active`, `is_deleted`, `parent_id`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.brands`](../../04-Database/Tables/catalog/brands.md) | Read | `id`, `is_active`, `is_deleted`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | Read | `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `lot_id`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.inventory_lots`](../../04-Database/Tables/warehouse/inventory_lots.md) | Read | `batch_number`, `expires_at`, `id`, `product_id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`logistics.serviceability_rules`](../../04-Database/Tables/logistics/serviceability_rules.md) | Read | `id`, `is_deleted`, `row_version` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | Read | `id`, `is_active`, `is_deleted`, `organization_id`, `postal_code`, `row_version` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`organization.licenses`](../../04-Database/Tables/organization/licenses.md) | Read | `expires_at`, `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `verification_status` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.productId | catalog.products.id |
| data.postalCode | organization.locations.postal_code |
| data.availability | Advisory projection of publication, serviceability, eligibility and fresh stock; no stock guarantee. |
| data.observedAt | Derived from inventory observation evidence; null if not available. |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`catalog.brands`](../../04-Database/Tables/catalog/brands.md), [`catalog.categories`](../../04-Database/Tables/catalog/categories.md), [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md), [`catalog.dosage_forms`](../../04-Database/Tables/catalog/dosage_forms.md), [`catalog.manufacturers`](../../04-Database/Tables/catalog/manufacturers.md), [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`logistics.carriers`](../../04-Database/Tables/logistics/carriers.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md), [`procurement.suppliers`](../../04-Database/Tables/procurement/suppliers.md), [`warehouse.bins`](../../04-Database/Tables/warehouse/bins.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Evaluate serviceability and freshness. Missing source/freshness evidence returns availability unconfirmed; do not disclose batch counts, exact locations or promise a reservation. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. No coverage yields out_of_stock or unconfirmed according to known evidence; reservation rechecks every gate. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-014-HAPPY` | Valid Public context and documented fixture for show advisory availability for one product and delivery postal code. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-014-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-014-AUTH` | Call without bearer, then supply invalid purpose-bound proof if this operation accepts one. | Public operation must not require bearer; invalid proof never establishes a session. |
| `CT-API-014-SCOPE` | Use another customer/site/patient/task reference or remove Advisory catalog availability. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-014-RULE` | Evaluate serviceability and freshness. Missing source/freshness evidence returns availability unconfirmed; do not disclose batch counts, exact locations or promise a reservation. | No coverage yields out_of_stock or unconfirmed according to known evidence; reservation rechecks every gate. |
| `CT-API-014-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-014-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-014-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-014-RECOVERY` | Dependency timeout during show advisory availability for one product and delivery postal code. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-CAT-04-OK`, `TC-CAT-04-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-015 — POST `/v1/admin/catalog/imports`

**Accept a clean catalog import file for row validation.**

| Property | Proposed contract |
| --- | --- |
| API name | Accept a clean catalog import file for row validation |
| Version / owner | v1 / Product_Catalog |
| Consumer | Catalog Manager |
| Status | Documentation Incomplete; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ADM-07`; [WF-002](../../06-Workflows/WF-002-Search-and-Availability.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/catalog/imports` (placeholder host from existing OpenAPI; no deployment asserted) |


**Remaining contract gap:** D-019/D-024: spreadsheet columns, row atomicity and durable import result/status model are not documented.

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Catalog Manager | catalog.import (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

File must be privately owned, safe and a supported Excel format. Validate SKU uniqueness and approved classification/tax sources per row before publication.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-015_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

Not Applicable. No parameters in this location.


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `CatalogImportRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `fileId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public platform.file_objects.id from a completed, privately uploaded and clean-scanned file. |


```json
{
  "fileId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
}
```

File upload: Not Applicable to this JSON operation. Referenced file UUIDs must resolve to owned/authorized private objects; validate size/type, complete storage metadata and clean scan before use. Never accept a caller-controlled storage path/public URL.

### Success response

HTTP **202**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `CatalogImportAcceptedData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `importId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Proposed API-only job reference; no catalog import-job table is documented. |
| `status` | string | Required | No | None (not silently populated) | enum=["queued"] | Accepted for processing; does not claim import completion. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "importId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "status": "queued"
  },
  "error": null,
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 422 | `REQUEST_VALIDATION_ERROR` | A declared body/path/query field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-015. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks catalog.import or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for accept a clean catalog import file for row validation. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | File must be privately owned, safe and a supported Excel format. Validate SKU uniqueness and approved classification/tax sources per row before publication. | No unauthorized/partial domain effect; redact sensitive context. | Keep invalid rows out of published catalog; retain a downloadable safe error report and retry identity. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Keep invalid rows out of published catalog; retain a downloadable safe error report and retry identity. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-015 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


Representative structured error (other codes use the same envelope):

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "REQUEST_VALIDATION_ERROR",
    "message": "A declared body/path/query field violates its typed contract.",
    "details": null
  },
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Database mapping and ownership

| Table | Access | Exact relevant columns | Owner / effect |
| --- | --- | --- | --- |
| [`platform.file_objects`](../../04-Database/Tables/platform/file_objects.md) | Read | `access_type`, `classification`, `id`, `is_deleted`, `malware_scan_status`, `owner_id`, `owner_type`, `row_version`, `sha256`, `size_bytes`, `status` | Platform file service projection / scoped joins; reading does not grant writes. |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Read | `id`, `is_deleted`, `row_version`, `status` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`pricing.product_prices`](../../04-Database/Tables/pricing/product_prices.md) | Read | `id`, `product_id`, `row_version`, `valid_from`, `valid_until` | pricing domain owner (Proposed) projection / scoped joins; reading does not grant writes. |
| [`platform.scheduled_jobs`](../../04-Database/Tables/platform/scheduled_jobs.md) | Create/update evidence | `job_key`, `job_type`, `payload`, `status`, `next_run_at` | Admin_CMS / platform configuration owner owns these writes; Product_Catalog must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.fileId | platform.file_objects.id |
| data.importId | Proposed API-only job reference; no catalog import-job table is documented. |
| data.status | platform.scheduled_jobs.status |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.brands`](../../04-Database/Tables/catalog/brands.md), [`catalog.categories`](../../04-Database/Tables/catalog/categories.md), [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md), [`catalog.dosage_forms`](../../04-Database/Tables/catalog/dosage_forms.md), [`catalog.manufacturers`](../../04-Database/Tables/catalog/manufacturers.md), [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | File must be privately owned, safe and a supported Excel format. Validate SKU uniqueness and approved classification/tax sources per row before publication. |
| Idempotency | Required key: scope actor + API-015 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Keep invalid rows out of published catalog; retain a downloadable safe error report and retry identity. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-015-HAPPY` | Valid Catalog Manager context and documented fixture for accept a clean catalog import file for row validation. | HTTP 202; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-015-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-015-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-015-SCOPE` | Use another customer/site/patient/task reference or remove catalog.import. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-015-RULE` | File must be privately owned, safe and a supported Excel format. Validate SKU uniqueness and approved classification/tax sources per row before publication. | Keep invalid rows out of published catalog; retain a downloadable safe error report and retry identity. |
| `CT-API-015-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-015-CONCURRENCY` | Race two accept a clean catalog import file for row validation. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-015-STATE` | Apply command after Keep invalid rows out of published catalog; retain a downloadable safe error report and retry identity. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-015-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Keep invalid rows out of published catalog; retain a downloadable safe error report and retry identity. |

Existing feature assertions: `TC-ADM-07-OK`, `TC-ADM-07-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-016 — POST `/v1/admin/catalog/products/{product_id}/classification`

**Approve a product commerce classification with immutable evidence.**

| Property | Proposed contract |
| --- | --- |
| API name | Approve a product commerce classification with immutable evidence |
| Version / owner | v1 / Product_Catalog |
| Consumer | Catalog Manager with Pharmacy classification approval |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ADM-06`; [WF-002](../../06-Workflows/WF-002-Search-and-Availability.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/catalog/products/{product_id}/classification` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Catalog Manager with Pharmacy classification approval | catalog.classification.approve (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Only P requires prescription and pharmacist review; M/O do not. Increment class version and retain old/new classification evidence. ReasonCode is required by the history schema and must be supplied by an approved source-change reason.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-016_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| product_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `CatalogClassificationRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `commerceClass` | string | Required | No | None (not silently populated) | enum=["P", "M", "O"] | catalog.products.commerce_class allowed values. |
| `expectedRowVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected catalog.products.row_version. |
| `reasonCode` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | Required catalog.product_classification_history.reason_code; approved reason vocabulary. |


```json
{
  "commerceClass": "P",
  "expectedRowVersion": 1,
  "reasonCode": "SOURCE_CORRECTION"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `CatalogClassificationData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `productId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from catalog.products.id. Ownership and current-state checks apply before use. |
| `commerceClass` | string | Required | No | None (not silently populated) | enum=["P", "M", "O"] | Public DTO value from catalog.products.commerce_class. Ownership and current-state checks apply before use. |
| `prescriptionRequired` | boolean | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Derived by the database invariant: true exactly when commerceClass is P. |
| `classificationVersion` | integer | Required | No | None (not silently populated) | minimum=1 | catalog.products.commerce_class_version. |
| `rowVersion` | integer | Required | No | None (not silently populated) | minimum=1 | catalog.products.row_version. |
| `approvedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | catalog.products.commerce_class_approved_at. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "commerceClass": "P",
    "prescriptionRequired": true,
    "classificationVersion": 1,
    "rowVersion": 1,
    "approvedAt": "2026-10-24T10:30:00Z"
  },
  "error": null,
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 422 | `REQUEST_VALIDATION_ERROR` | A declared body/path/query field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-016. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks catalog.classification.approve or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for approve a product commerce classification with immutable evidence. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Only P requires prescription and pharmacist review; M/O do not. Increment class version and retain old/new classification evidence. ReasonCode is required by the history schema and must be supplied by an approved source-change reason. | No unauthorized/partial domain effect; redact sensitive context. | Unknown class, missing reason or stale version leaves product unchanged; invalidate dependent future quotes/clinical assumptions. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current approve a product commerce classification with immutable evidence. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Unknown class, missing reason or stale version leaves product unchanged; invalidate dependent future quotes/clinical assumptions. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-016 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


Representative structured error (other codes use the same envelope):

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "STALE_VERSION",
    "message": "An expected aggregate/row version no longer matches current committed state.",
    "details": null
  },
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Database mapping and ownership

| Table | Access | Exact relevant columns | Owner / effect |
| --- | --- | --- | --- |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Read | `brand_id`, `category_id`, `commerce_class`, `commerce_class_approved_at`, `commerce_class_version`, `id`, `is_deleted`, `prescription_required`, `row_version`, `status` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md) | Read | `id`, `is_active`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.categories`](../../04-Database/Tables/catalog/categories.md) | Read | `id`, `is_active`, `is_deleted`, `parent_id`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.brands`](../../04-Database/Tables/catalog/brands.md) | Read | `id`, `is_active`, `is_deleted`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.product_classification_history`](../../04-Database/Tables/catalog/product_classification_history.md) | Read | `id`, `new_class`, `old_class`, `product_id`, `reason_code` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Create/update evidence | `commerce_class`, `prescription_required`, `commerce_class_version`, `commerce_class_approved_at`, `commerce_class_approved_by_user_id` | Product_Catalog owns these writes; Product_Catalog must invoke that narrow owner command. |
| [`catalog.product_classification_history`](../../04-Database/Tables/catalog/product_classification_history.md) | Create/update evidence | `product_id`, `old_class`, `new_class`, `version`, `approved_by_user_id`, `approved_at`, `reason_code`, `decision_note` | Product_Catalog owns these writes; Product_Catalog must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.commerceClass | catalog.products.commerce_class |
| request.expectedRowVersion | catalog.products.row_version |
| request.reasonCode | catalog.product_classification_history.reason_code |
| data.productId | catalog.products.id |
| data.commerceClass | catalog.products.commerce_class |
| data.prescriptionRequired | catalog.products.prescription_required |
| data.classificationVersion | catalog.products.commerce_class_version |
| data.rowVersion | catalog.products.row_version |
| data.approvedAt | catalog.products.commerce_class_approved_at |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.brands`](../../04-Database/Tables/catalog/brands.md), [`catalog.categories`](../../04-Database/Tables/catalog/categories.md), [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md), [`catalog.dosage_forms`](../../04-Database/Tables/catalog/dosage_forms.md), [`catalog.manufacturers`](../../04-Database/Tables/catalog/manufacturers.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Only P requires prescription and pharmacist review; M/O do not. Increment class version and retain old/new classification evidence. ReasonCode is required by the history schema and must be supplied by an approved source-change reason. |
| Idempotency | Required key: scope actor + API-016 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Unknown class, missing reason or stale version leaves product unchanged; invalidate dependent future quotes/clinical assumptions. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-016-HAPPY` | Valid Catalog Manager with Pharmacy classification approval context and documented fixture for approve a product commerce classification with immutable evidence. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-016-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-016-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-016-SCOPE` | Use another customer/site/patient/task reference or remove catalog.classification.approve. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-016-RULE` | Only P requires prescription and pharmacist review; M/O do not. Increment class version and retain old/new classification evidence. ReasonCode is required by the history schema and must be supplied by an approved source-change reason. | Unknown class, missing reason or stale version leaves product unchanged; invalidate dependent future quotes/clinical assumptions. |
| `CT-API-016-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-016-CONCURRENCY` | Race two approve a product commerce classification with immutable evidence. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-016-STATE` | Apply command after Unknown class, missing reason or stale version leaves product unchanged; invalidate dependent future quotes/clinical assumptions. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-016-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Unknown class, missing reason or stale version leaves product unchanged; invalidate dependent future quotes/clinical assumptions. |

Existing feature assertions: `TC-ADM-06-OK`, `TC-ADM-06-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-017 — POST `/v1/admin/catalog/products/{product_id}/publish`

**Publish an approved complete product into customer discovery.**

| Property | Proposed contract |
| --- | --- |
| API name | Publish an approved complete product into customer discovery |
| Version / owner | v1 / Product_Catalog |
| Consumer | Catalog Manager |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ADM-06`; [WF-002](../../06-Workflows/WF-002-Search-and-Availability.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/catalog/products/{product_id}/publish` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Catalog Manager | catalog.publish (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Draft/review to active only after approved class, valid product sources and applicable price/tax validation. Do not publish unknown classification or silently invent HSN/rates.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-017_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| product_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `CatalogPublishRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedRowVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected catalog.products.row_version. |


```json
{
  "expectedRowVersion": 1
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `CatalogPublishData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `productId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from catalog.products.id. Ownership and current-state checks apply before use. |
| `status` | string | Required | No | None (not silently populated) | enum=["active"] | Published projection of catalog.products.status. |
| `publishedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | Public DTO value from catalog.products.published_at. Ownership and current-state checks apply before use. |
| `rowVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Public DTO value from catalog.products.row_version. Ownership and current-state checks apply before use. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "status": "active",
    "publishedAt": "2026-10-24T10:30:00Z",
    "rowVersion": 1
  },
  "error": null,
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 422 | `REQUEST_VALIDATION_ERROR` | A declared body/path/query field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-017. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks catalog.publish or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for publish an approved complete product into customer discovery. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Draft/review to active only after approved class, valid product sources and applicable price/tax validation. Do not publish unknown classification or silently invent HSN/rates. | No unauthorized/partial domain effect; redact sensitive context. | Missing approvals return 422; no product becomes visible. Correct source records and republish current version. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current publish an approved complete product into customer discovery. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Missing approvals return 422; no product becomes visible. Correct source records and republish current version. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-017 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


Representative structured error (other codes use the same envelope):

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "STALE_VERSION",
    "message": "An expected aggregate/row version no longer matches current committed state.",
    "details": null
  },
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Database mapping and ownership

| Table | Access | Exact relevant columns | Owner / effect |
| --- | --- | --- | --- |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Read | `brand_id`, `category_id`, `commerce_class`, `dosage_form_id`, `id`, `is_deleted`, `manufacturer_id`, `published_at`, `row_version`, `status` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md) | Read | `id`, `is_active`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.categories`](../../04-Database/Tables/catalog/categories.md) | Read | `id`, `is_active`, `is_deleted`, `parent_id`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.brands`](../../04-Database/Tables/catalog/brands.md) | Read | `id`, `is_active`, `is_deleted`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.manufacturers`](../../04-Database/Tables/catalog/manufacturers.md) | Read | `id`, `is_active`, `is_deleted`, `organization_id`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.dosage_forms`](../../04-Database/Tables/catalog/dosage_forms.md) | Read | `id`, `is_active`, `is_deleted`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`pricing.product_prices`](../../04-Database/Tables/pricing/product_prices.md) | Read | `id`, `product_id`, `row_version`, `valid_from`, `valid_until` | pricing domain owner (Proposed) projection / scoped joins; reading does not grant writes. |
| [`pricing.tax_rules`](../../04-Database/Tables/pricing/tax_rules.md) | Read | `id`, `is_deleted`, `row_version`, `valid_from`, `valid_until` | pricing domain owner (Proposed) projection / scoped joins; reading does not grant writes. |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Create/update evidence | `status`, `published_at` | Product_Catalog owns these writes; Product_Catalog must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedRowVersion | catalog.products.row_version |
| data.productId | catalog.products.id |
| data.status | catalog.products.status |
| data.publishedAt | catalog.products.published_at |
| data.rowVersion | catalog.products.row_version |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.brands`](../../04-Database/Tables/catalog/brands.md), [`catalog.categories`](../../04-Database/Tables/catalog/categories.md), [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md), [`catalog.dosage_forms`](../../04-Database/Tables/catalog/dosage_forms.md), [`catalog.manufacturers`](../../04-Database/Tables/catalog/manufacturers.md), [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Draft/review to active only after approved class, valid product sources and applicable price/tax validation. Do not publish unknown classification or silently invent HSN/rates. |
| Idempotency | Required key: scope actor + API-017 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Missing approvals return 422; no product becomes visible. Correct source records and republish current version. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-017-HAPPY` | Valid Catalog Manager context and documented fixture for publish an approved complete product into customer discovery. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-017-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-017-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-017-SCOPE` | Use another customer/site/patient/task reference or remove catalog.publish. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-017-RULE` | Draft/review to active only after approved class, valid product sources and applicable price/tax validation. Do not publish unknown classification or silently invent HSN/rates. | Missing approvals return 422; no product becomes visible. Correct source records and republish current version. |
| `CT-API-017-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-017-CONCURRENCY` | Race two publish an approved complete product into customer discovery. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-017-STATE` | Apply command after Missing approvals return 422; no product becomes visible. Correct source records and republish current version. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-017-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Missing approvals return 422; no product becomes visible. Correct source records and republish current version. |

Existing feature assertions: `TC-ADM-06-OK`, `TC-ADM-06-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
