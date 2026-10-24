# Cart Checkout API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](API-Contract-Coverage.md) · [OpenAPI 3.1](openapi.yaml) · [decisions](Planning-Decisions.md) · [DTO conventions](API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="cart-checkout-api-contracts"></a>
<a id="api-018--get-v1mecart"></a>
<a id="caller-permissions-and-dependencies"></a>
<a id="http-request-contract"></a>
<a id="success-response-illustrative"></a>
<a id="errors-concurrency-and-failure-recovery"></a>
<a id="required-verification"></a>
<a id="api-019--put-v1mecartitems"></a>
<a id="caller-permissions-and-dependencies-1"></a>
<a id="http-request-contract-1"></a>
<a id="success-response-illustrative-1"></a>
<a id="errors-concurrency-and-failure-recovery-1"></a>
<a id="required-verification-1"></a>
<a id="api-020--post-v1checkoutsquotes"></a>
<a id="caller-permissions-and-dependencies-2"></a>
<a id="http-request-contract-2"></a>
<a id="success-response-illustrative-2"></a>
<a id="errors-concurrency-and-failure-recovery-2"></a>
<a id="required-verification-2"></a>
<a id="api-021--post-v1checkouts"></a>
<a id="caller-permissions-and-dependencies-3"></a>
<a id="http-request-contract-3"></a>
<a id="success-response-illustrative-3"></a>
<a id="errors-concurrency-and-failure-recovery-3"></a>
<a id="required-verification-3"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-018 | `GET /v1/me/cart` | Read the current owned cart including price snapshots. | Complete proposed |
| API-019 | `PUT /v1/me/cart/items` | Replace the desired product lines in the owned active cart. | Complete proposed |
| API-020 | `POST /v1/checkouts/quotes` | Reprice an owned cart and issue a bound expiring quote capability. | Complete proposed |
| API-021 | `POST /v1/checkouts` | Create one checkout/order request for an explicitly accepted quote. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| CHK-01 | Cart saved across devices for logged-in customers | API-018, API-019 |
| CHK-02 | Checkout: address, patient (self or family), payment method, delivery fee and estimated time shown before paying | API-020 |
| CHK-03 | Online payment via Cashfree: UPI, cards, net banking | No direct operation; see [journey/API gaps](Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| CHK-04 | Cash on delivery, with a maximum order value and a block after repeated refusals | No direct operation; see [journey/API gaps](Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| CHK-05 | Minimum order value and delivery fee applied from settings | API-020 |
| CHK-06 | Price or stock change detected before payment; customer confirms | API-020 |
| CHK-07 | No duplicate orders or charges (double tap, refresh, closed browser after payment) | API-021 |
| CHK-08 | Stock reserved during checkout, released automatically if payment does not finish | API-021 |

## API-018 — GET `/v1/me/cart`

**Read the current owned cart including price snapshots.**

| Property | Proposed contract |
| --- | --- |
| API name | Read the current owned cart including price snapshots |
| Version / owner | v1 / Cart_Checkout |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `CHK-01`; [WF-003](../06-Workflows/WF-003-Cart-Quote-and-Reservation.md) |
| Design sources | [Module HLD](../03-Modules/Cart_Checkout/HLD.md), [LLD](../03-Modules/Cart_Checkout/LLD.md), [edge cases](../03-Modules/Cart_Checkout/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/cart` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | cart-checkout.read.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Only the active cart for JWT subject. Empty active cart returns items []; no cart is created as a side effect of this GET. No cart returns 404.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
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

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is fixed: `not applicable for this singleton`. Pagination: none.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `CartItemsData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `cartId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.carts.id. Ownership and current-state checks apply before use. |
| `cartVersion` | integer | Required | No | None (not silently populated) | minimum=1 | commerce.carts.row_version. |
| `currency` | string | Required | No | None (not silently populated) | pattern="^[A-Z]{3}$" | commerce.carts.currency. |
| `items` | array<object> | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `items[].cartItemId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.cart_items.id. Ownership and current-state checks apply before use. |
| `items[].productId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from catalog.products.id. Ownership and current-state checks apply before use. |
| `items[].quantity` | string | Required | No | None (not silently populated) | pattern="^[0-9]+(\\.[0-9]{1,3})?$" | Public DTO value from commerce.cart_items.quantity. Ownership and current-state checks apply before use. |
| `items[].unitPrice` | string/null | Required | Yes | None (not silently populated) | pattern="^[0-9]+(\\.[0-9]{1,2})?$" | Last documented commerce.cart_items.unit_price_snapshot; checkout revalidates. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "cartId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "cartVersion": 1,
    "currency": "INR",
    "items": [
      {
        "cartItemId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "quantity": "2.000",
        "unitPrice": "12.50"
      }
    ]
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
| 404 | `RESOURCE_NOT_FOUND` | The customer has no active cart; create-if-absent uses API-019 with cartVersion 0. | No foreign profile/cart is substituted. | Complete the approved onboarding branch or create cart through API-019. |
| 422 | `REQUEST_VALIDATION_ERROR` | A declared path/query/header field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-018. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks cart-checkout.read.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-018 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`commerce.carts`](../04-Database/Tables/commerce/carts.md) | Read | `currency`, `expires_at`, `id`, `merged_into_cart_id`, `row_version`, `status`, `user_id` | Cart_Checkout projection / scoped joins; reading does not grant writes. |
| [`commerce.cart_items`](../04-Database/Tables/commerce/cart_items.md) | Read | `cart_id`, `id`, `prescription_id`, `product_id`, `quantity`, `row_version`, `unit_price_snapshot` | Cart_Checkout projection / scoped joins; reading does not grant writes. |
| [`catalog.products`](../04-Database/Tables/catalog/products.md) | Read | `id`, `is_deleted`, `row_version`, `status` | Product_Catalog projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.cartId | commerce.carts.id |
| data.cartVersion | commerce.carts.row_version |
| data.currency | commerce.carts.currency |
| data.items[].cartItemId | commerce.cart_items.id |
| data.items[].productId | catalog.products.id |
| data.items[].quantity | commerce.cart_items.quantity |
| data.items[].unitPrice | commerce.cart_items.unit_price_snapshot |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`catalog.brands`](../04-Database/Tables/catalog/brands.md), [`catalog.categories`](../04-Database/Tables/catalog/categories.md), [`catalog.commerce_classes`](../04-Database/Tables/catalog/commerce_classes.md), [`catalog.dosage_forms`](../04-Database/Tables/catalog/dosage_forms.md), [`catalog.manufacturers`](../04-Database/Tables/catalog/manufacturers.md), [`catalog.product_variants`](../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../04-Database/Tables/catalog/products.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../04-Database/Tables/marketplace/sellers.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Only the active cart for JWT subject. Empty active cart returns items []; no cart is created as a side effect of this GET. No cart returns 404. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. A converted/expired cart cannot masquerade as active; client starts a replacement through API-019. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-018-HAPPY` | Valid Customer context and documented fixture for read the current owned cart including price snapshots. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-018-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-018-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-018-SCOPE` | Use another customer/site/patient/task reference or remove cart-checkout.read.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-018-RULE` | Only the active cart for JWT subject. Empty active cart returns items []; no cart is created as a side effect of this GET. No cart returns 404. | A converted/expired cart cannot masquerade as active; client starts a replacement through API-019. |
| `CT-API-018-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-018-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-018-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-018-RECOVERY` | Dependency timeout during read the current owned cart including price snapshots. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-CHK-01-OK`, `TC-CHK-01-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-019 — PUT `/v1/me/cart/items`

**Replace the desired product lines in the owned active cart.**

| Property | Proposed contract |
| --- | --- |
| API name | Replace the desired product lines in the owned active cart |
| Version / owner | v1 / Cart_Checkout |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `CHK-01`; [WF-003](../06-Workflows/WF-003-Cart-Quote-and-Reservation.md) |
| Design sources | [Module HLD](../03-Modules/Cart_Checkout/HLD.md), [LLD](../03-Modules/Cart_Checkout/LLD.md), [edge cases](../03-Modules/Cart_Checkout/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/cart/items` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | cart-checkout.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

At most 50 unique products; positive quantities, empty array clears cart. Server calculates snapshots; totals, clinical approvals and actor IDs are forbidden. For first cart only cartVersion=0 means create-if-absent under a per-user lock; existing carts require the current positive row_version.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-019_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `CartItemsReplaceRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `cartVersion` | integer | Required | No | None (not silently populated) | minimum=0 | 0 only for create-if-no-active-cart; otherwise expected positive commerce.carts.row_version. |
| `items` | array<object> | Required | No | None (not silently populated) | minItems=1; maxItems=50 | Proposed full desired item set; maximum 50 needs D-024 approval. |
| `items[].productId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public catalog.products.id. |
| `items[].quantity` | string | Required | No | None (not silently populated) | pattern="^[0-9]+(\\.[0-9]{1,3})?$" | Positive commerce.cart_items.quantity numeric(12,3). |


```json
{
  "cartVersion": 0,
  "items": [
    {
      "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "quantity": "2.000"
    }
  ]
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `CartItemsData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `cartId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.carts.id. Ownership and current-state checks apply before use. |
| `cartVersion` | integer | Required | No | None (not silently populated) | minimum=1 | commerce.carts.row_version. |
| `currency` | string | Required | No | None (not silently populated) | pattern="^[A-Z]{3}$" | commerce.carts.currency. |
| `items` | array<object> | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `items[].cartItemId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.cart_items.id. Ownership and current-state checks apply before use. |
| `items[].productId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from catalog.products.id. Ownership and current-state checks apply before use. |
| `items[].quantity` | string | Required | No | None (not silently populated) | pattern="^[0-9]+(\\.[0-9]{1,3})?$" | Public DTO value from commerce.cart_items.quantity. Ownership and current-state checks apply before use. |
| `items[].unitPrice` | string/null | Required | Yes | None (not silently populated) | pattern="^[0-9]+(\\.[0-9]{1,2})?$" | Last documented commerce.cart_items.unit_price_snapshot; checkout revalidates. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "cartId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "cartVersion": 1,
    "currency": "INR",
    "items": [
      {
        "cartItemId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "quantity": "2.000",
        "unitPrice": "12.50"
      }
    ]
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-019. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks cart-checkout.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for replace the desired product lines in the owned active cart. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | At most 50 unique products; positive quantities, empty array clears cart. Server calculates snapshots; totals, clinical approvals and actor IDs are forbidden. For first cart only cartVersion=0 means create-if-absent under a per-user lock; existing carts require the current positive row_version. | No unauthorized/partial domain effect; redact sensitive context. | Concurrent update returns STALE_VERSION without partial replacement. Unknown classification blocks checkout; P lines may remain in a draft cart pending evidence. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current replace the desired product lines in the owned active cart. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Concurrent update returns STALE_VERSION without partial replacement. Unknown classification blocks checkout; P lines may remain in a draft cart pending evidence. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-019 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`commerce.carts`](../04-Database/Tables/commerce/carts.md) | Read | `currency`, `expires_at`, `id`, `merged_into_cart_id`, `row_version`, `status`, `user_id` | Cart_Checkout projection / scoped joins; reading does not grant writes. |
| [`commerce.cart_items`](../04-Database/Tables/commerce/cart_items.md) | Read | `cart_id`, `id`, `prescription_id`, `product_id`, `quantity`, `row_version`, `unit_price_snapshot` | Cart_Checkout projection / scoped joins; reading does not grant writes. |
| [`catalog.products`](../04-Database/Tables/catalog/products.md) | Read | `id`, `is_deleted`, `row_version`, `status` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`commerce.carts`](../04-Database/Tables/commerce/carts.md) | Create/update evidence | `user_id`, `currency`, `status` | Cart_Checkout owns these writes; Cart_Checkout must invoke that narrow owner command. |
| [`commerce.cart_items`](../04-Database/Tables/commerce/cart_items.md) | Create/update evidence | `cart_id`, `product_id`, `quantity`, `unit_price_snapshot` | Cart_Checkout owns these writes; Cart_Checkout must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.cartVersion | commerce.carts.row_version |
| request.items[].productId | catalog.products.id |
| request.items[].quantity | commerce.cart_items.quantity |
| data.cartId | commerce.carts.id |
| data.cartVersion | commerce.carts.row_version |
| data.currency | commerce.carts.currency |
| data.items[].cartItemId | commerce.cart_items.id |
| data.items[].productId | catalog.products.id |
| data.items[].quantity | commerce.cart_items.quantity |
| data.items[].unitPrice | commerce.cart_items.unit_price_snapshot |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.brands`](../04-Database/Tables/catalog/brands.md), [`catalog.categories`](../04-Database/Tables/catalog/categories.md), [`catalog.commerce_classes`](../04-Database/Tables/catalog/commerce_classes.md), [`catalog.dosage_forms`](../04-Database/Tables/catalog/dosage_forms.md), [`catalog.manufacturers`](../04-Database/Tables/catalog/manufacturers.md), [`catalog.product_variants`](../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../04-Database/Tables/catalog/products.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../04-Database/Tables/marketplace/sellers.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | At most 50 unique products; positive quantities, empty array clears cart. Server calculates snapshots; totals, clinical approvals and actor IDs are forbidden. For first cart only cartVersion=0 means create-if-absent under a per-user lock; existing carts require the current positive row_version. |
| Idempotency | Required key: scope actor + API-019 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Concurrent update returns STALE_VERSION without partial replacement. Unknown classification blocks checkout; P lines may remain in a draft cart pending evidence. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-019-HAPPY` | Valid Customer context and documented fixture for replace the desired product lines in the owned active cart. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-019-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-019-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-019-SCOPE` | Use another customer/site/patient/task reference or remove cart-checkout.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-019-RULE` | At most 50 unique products; positive quantities, empty array clears cart. Server calculates snapshots; totals, clinical approvals and actor IDs are forbidden. For first cart only cartVersion=0 means create-if-absent under a per-user lock; existing carts require the current positive row_version. | Concurrent update returns STALE_VERSION without partial replacement. Unknown classification blocks checkout; P lines may remain in a draft cart pending evidence. |
| `CT-API-019-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-019-CONCURRENCY` | Race two replace the desired product lines in the owned active cart. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-019-STATE` | Apply command after Concurrent update returns STALE_VERSION without partial replacement. Unknown classification blocks checkout; P lines may remain in a draft cart pending evidence. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-019-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Concurrent update returns STALE_VERSION without partial replacement. Unknown classification blocks checkout; P lines may remain in a draft cart pending evidence. |

Existing feature assertions: `TC-CHK-01-OK`, `TC-CHK-01-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-020 — POST `/v1/checkouts/quotes`

**Reprice an owned cart and issue a bound expiring quote capability.**

| Property | Proposed contract |
| --- | --- |
| API name | Reprice an owned cart and issue a bound expiring quote capability |
| Version / owner | v1 / Cart_Checkout |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `CHK-02`, `CHK-05`, `CHK-06`; [WF-003](../06-Workflows/WF-003-Cart-Quote-and-Reservation.md) |
| Design sources | [Module HLD](../03-Modules/Cart_Checkout/HLD.md), [LLD](../03-Modules/Cart_Checkout/LLD.md), [edge cases](../03-Modules/Cart_Checkout/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/checkouts/quotes` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | cart-checkout.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Validate customer address/cart ownership and current version; derive every charge and clinical nextAction. A P line requires the selected owned patient, M/O-only does not require review. Quote is advisory and creates no hold; signed token binds exact totals/version/address/patient and configured expiry.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-020_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `CheckoutQuoteRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `cartId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.carts.id. Ownership and current-state checks apply before use. |
| `cartVersion` | integer | Required | No | None (not silently populated) | minimum=1 | commerce.carts.row_version |
| `addressId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from customer.addresses.id. Ownership and current-state checks apply before use. |
| `patientId` | string (uuid) | Optional | No | None (not silently populated) | format="uuid" | Required for P-class lines when a verified patient association is needed; exact conditional and profile mapping remain D-024 review. |


```json
{
  "cartId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "cartVersion": 1,
  "addressId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "patientId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `CheckoutQuoteData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `quoteToken` | string | Required | No | None (not silently populated) | minLength=1; maxLength=2048 | Opaque signed, expiring capability bound to customer/cart/address/version; API-only. |
| `cartVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Public DTO value from commerce.carts.row_version. Ownership and current-state checks apply before use. |
| `lines` | array<object> | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `lines[].productId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from catalog.products.id. Ownership and current-state checks apply before use. |
| `lines[].quantity` | string | Required | No | None (not silently populated) | pattern="^[0-9]+(\\.[0-9]{1,3})?$" | commerce.cart_items.quantity numeric(12,3), positive. |
| `lines[].commerceClass` | string | Required | No | None (not silently populated) | enum=["P", "M", "O"] | Public projection of catalog.products.commerce_class; classification policy requires product source approval. |
| `lines[].unitPrice` | object | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `lines[].unitPrice.amount` | string | Required | No | None (not silently populated) | pattern="^[0-9]+(\\.[0-9]{1,2})?$" | Current approved selling_price for this product/effective price book; not caller input. |
| `lines[].unitPrice.currency` | string | Required | No | None (not silently populated) | pattern="^[A-Z]{3}$" | Public DTO value from commerce.carts.currency. Ownership and current-state checks apply before use. |
| `totals` | object | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `totals.subtotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(0\|[1-9][0-9]{0,13})(\\.[0-9]{1,2})?$" | Decimal string, nonnegative numeric(16,2); no binary floating point. |
| `totals.discountTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(0\|[1-9][0-9]{0,13})(\\.[0-9]{1,2})?$" | Decimal string, nonnegative numeric(16,2); no binary floating point. |
| `totals.taxTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(0\|[1-9][0-9]{0,13})(\\.[0-9]{1,2})?$" | Decimal string, nonnegative numeric(16,2); no binary floating point. |
| `totals.shippingTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(0\|[1-9][0-9]{0,13})(\\.[0-9]{1,2})?$" | Decimal string, nonnegative numeric(16,2); no binary floating point. |
| `totals.otherChargesTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(0\|[1-9][0-9]{0,13})(\\.[0-9]{1,2})?$" | Decimal string, nonnegative numeric(16,2); no binary floating point. |
| `totals.grandTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(0\|[1-9][0-9]{0,13})(\\.[0-9]{1,2})?$" | Decimal string, nonnegative numeric(16,2); no binary floating point. |
| `totals.currency` | string | Required | No | None (not silently populated) | minLength=1; maxLength=3; pattern="^[A-Z]{3}$" | Public DTO value from commerce.carts.currency. Ownership and current-state checks apply before use. |
| `nextAction` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Derived action, not a persisted database status. |
| `deliveryEstimate` | string/null (date-time) | Optional | Yes | None (not silently populated) | format="date-time" | Advisory delivery calculation from serviceability and eligible site; nullable. |
| `changedLines` | array<object> | Optional | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `changedLines[].productId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from catalog.products.id. Ownership and current-state checks apply before use. |
| `changedLines[].previousUnitPrice` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(0\|[1-9][0-9]{0,13})(\\.[0-9]{1,2})?$" | Decimal string, nonnegative numeric(16,2); no binary floating point. |
| `changedLines[].currentUnitPrice` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(0\|[1-9][0-9]{0,13})(\\.[0-9]{1,2})?$" | Decimal string, nonnegative numeric(16,2); no binary floating point. |
| `changedLines[].reason` | string | Required | No | None (not silently populated) | enum=["price_changed", "quantity_unavailable", "classification_changed"] | API-only repricing comparison: old/current price, stock availability or classification-version difference produces this named enum. |
| `expiresAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | Token expiry chosen by configured quote policy; sample is illustrative, not an approved TTL. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "quoteToken": "pv_quote_u9Qm3K7r2X6v8L4n",
    "cartVersion": 1,
    "lines": [
      {
        "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "quantity": "2.000",
        "commerceClass": "O",
        "unitPrice": {
          "amount": "12.50",
          "currency": "INR"
        }
      }
    ],
    "totals": {
      "subtotal": "25.00",
      "discountTotal": "0.00",
      "taxTotal": "0.00",
      "shippingTotal": "0.00",
      "otherChargesTotal": "0.00",
      "grandTotal": "25.00",
      "currency": "INR"
    },
    "nextAction": "confirm_checkout",
    "deliveryEstimate": null,
    "changedLines": [],
    "expiresAt": "2026-10-24T10:40:00Z"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-020. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks cart-checkout.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for reprice an owned cart and issue a bound expiring quote capability. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Validate customer address/cart ownership and current version; derive every charge and clinical nextAction. A P line requires the selected owned patient, M/O-only does not require review. Quote is advisory and creates no hold; signed token binds exact totals/version/address/patient and configured expiry. | No unauthorized/partial domain effect; redact sensitive context. | Price changes are presented explicitly, missing classification/serviceability fails closed, and no stock or payment is claimed. Customer must accept changed totals. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current reprice an owned cart and issue a bound expiring quote capability. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Price changes are presented explicitly, missing classification/serviceability fails closed, and no stock or payment is claimed. Customer must accept changed totals. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-020 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`commerce.carts`](../04-Database/Tables/commerce/carts.md) | Read | `currency`, `expires_at`, `id`, `merged_into_cart_id`, `row_version`, `status`, `user_id` | Cart_Checkout projection / scoped joins; reading does not grant writes. |
| [`commerce.cart_items`](../04-Database/Tables/commerce/cart_items.md) | Read | `cart_id`, `id`, `prescription_id`, `product_id`, `quantity`, `row_version` | Cart_Checkout projection / scoped joins; reading does not grant writes. |
| [`customer.addresses`](../04-Database/Tables/customer/addresses.md) | Read | `id`, `is_deleted`, `row_version`, `user_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md) | Read | `family_member_id`, `id`, `is_deleted`, `row_version`, `user_id` | Prescription_Upload / Intake projection / scoped joins; reading does not grant writes. |
| [`customer.family_members`](../04-Database/Tables/customer/family_members.md) | Read | `customer_user_id`, `id`, `is_deleted`, `row_version` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`catalog.products`](../04-Database/Tables/catalog/products.md) | Read | `commerce_class`, `id`, `is_deleted`, `row_version`, `status` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`catalog.commerce_classes`](../04-Database/Tables/catalog/commerce_classes.md) | Read | `id`, `is_active`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`pricing.product_prices`](../04-Database/Tables/pricing/product_prices.md) | Read | `id`, `price_book_id`, `product_id`, `row_version`, `selling_price`, `valid_from`, `valid_until` | pricing domain owner (Proposed) projection / scoped joins; reading does not grant writes. |
| [`pricing.price_books`](../04-Database/Tables/pricing/price_books.md) | Read | `id`, `is_deleted`, `row_version`, `status`, `valid_from`, `valid_until`, `warehouse_id` | pricing domain owner (Proposed) projection / scoped joins; reading does not grant writes. |
| [`pricing.tax_rules`](../04-Database/Tables/pricing/tax_rules.md) | Read | `id`, `is_deleted`, `row_version`, `valid_from`, `valid_until` | pricing domain owner (Proposed) projection / scoped joins; reading does not grant writes. |
| [`logistics.serviceability_rules`](../04-Database/Tables/logistics/serviceability_rules.md) | Read | `id`, `is_deleted`, `row_version` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`platform.application_settings`](../04-Database/Tables/platform/application_settings.md) | Read | `id`, `is_deleted`, `row_version` | Admin_CMS / platform configuration owner projection / scoped joins; reading does not grant writes. |
| [`pricing.promotions`](../04-Database/Tables/pricing/promotions.md) | Read | `id`, `is_deleted`, `row_version`, `status` | pricing domain owner (Proposed) projection / scoped joins; reading does not grant writes. |
| [`pricing.promotion_versions`](../04-Database/Tables/pricing/promotion_versions.md) | Read | `id`, `promotion_id`, `row_version` | pricing domain owner (Proposed) projection / scoped joins; reading does not grant writes. |
| [`pricing.promotion_redemptions`](../04-Database/Tables/pricing/promotion_redemptions.md) | Read | `coupon_code_id`, `id`, `order_id`, `promotion_id`, `promotion_version_id`, `user_id` | pricing domain owner (Proposed) projection / scoped joins; reading does not grant writes. |
| [`pricing.coupon_codes`](../04-Database/Tables/pricing/coupon_codes.md) | Read | `id`, `is_active`, `is_deleted`, `promotion_id`, `row_version`, `valid_from`, `valid_until` | pricing domain owner (Proposed) projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.cartId | commerce.carts.id |
| request.cartVersion | commerce.carts.row_version |
| request.addressId | customer.addresses.id |
| request.patientId | clinical.patient_profiles.id |
| data.quoteToken | API-only signed capability derived from authoritative cart/address/patient/price snapshots and expiry. |
| data.cartVersion | commerce.carts.row_version |
| data.lines[].productId | catalog.products.id |
| data.lines[].quantity | commerce.cart_items.quantity |
| data.lines[].commerceClass | catalog.products.commerce_class |
| data.lines[].unitPrice.amount | pricing.product_prices.selling_price |
| data.lines[].unitPrice.currency | commerce.carts.currency |
| data.totals.subtotal | Quote-only sum of evaluated quantity × current approved unit price before discounts/tax/charges; not persisted by quote. |
| data.totals.discountTotal | Quote-only eligible discount from approved dated pricing rules; zero when no approved rule applies; not a client amount. |
| data.totals.taxTotal | Quote-only sum from Finance-approved tax source/jurisdiction; absent configuration blocks acceptance, never infer rates. |
| data.totals.shippingTotal | Quote-only charge from approved delivery-fee/serviceability policy; applied to this address/cart version. |
| data.totals.otherChargesTotal | Quote-only sum of explicit approved additional charge rules; zero when none apply. |
| data.totals.grandTotal | Quote-only subtotal − discountTotal + taxTotal + shippingTotal + otherChargesTotal; fixed-point rounding under approved Finance policy. |
| data.totals.currency | commerce.carts.currency |
| data.nextAction | API-only workflow projection from current domain states; no universal database enum. |
| data.deliveryEstimate | Advisory delivery calculation from serviceability and eligible site; nullable. |
| data.changedLines[].productId | catalog.products.id |
| data.changedLines[].previousUnitPrice | Previous safe quote/cart price projection, not a new persistence column. |
| data.changedLines[].currentUnitPrice | Current approved price-book projection. |
| data.changedLines[].reason | API-only repricing comparison: old/current price, stock availability or classification-version difference produces this named enum. |
| data.expiresAt | commerce.carts.expires_at |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Master dependencies:** [`catalog.brands`](../04-Database/Tables/catalog/brands.md), [`catalog.categories`](../04-Database/Tables/catalog/categories.md), [`catalog.commerce_classes`](../04-Database/Tables/catalog/commerce_classes.md), [`catalog.dosage_forms`](../04-Database/Tables/catalog/dosage_forms.md), [`catalog.manufacturers`](../04-Database/Tables/catalog/manufacturers.md), [`catalog.product_variants`](../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../04-Database/Tables/catalog/products.md), [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`logistics.carriers`](../04-Database/Tables/logistics/carriers.md), [`marketplace.sellers`](../04-Database/Tables/marketplace/sellers.md), [`warehouse.warehouses`](../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Validate customer address/cart ownership and current version; derive every charge and clinical nextAction. A P line requires the selected owned patient, M/O-only does not require review. Quote is advisory and creates no hold; signed token binds exact totals/version/address/patient and configured expiry. |
| Idempotency | Required key: scope actor + API-020 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Price changes are presented explicitly, missing classification/serviceability fails closed, and no stock or payment is claimed. Customer must accept changed totals. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-020-HAPPY` | Valid Customer context and documented fixture for reprice an owned cart and issue a bound expiring quote capability. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-020-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-020-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-020-SCOPE` | Use another customer/site/patient/task reference or remove cart-checkout.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-020-RULE` | Validate customer address/cart ownership and current version; derive every charge and clinical nextAction. A P line requires the selected owned patient, M/O-only does not require review. Quote is advisory and creates no hold; signed token binds exact totals/version/address/patient and configured expiry. | Price changes are presented explicitly, missing classification/serviceability fails closed, and no stock or payment is claimed. Customer must accept changed totals. |
| `CT-API-020-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-020-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-020-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-020-RECOVERY` | Dependency timeout during reprice an owned cart and issue a bound expiring quote capability. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-CHK-02-OK`, `TC-CHK-02-DENY`, `TC-CHK-05-OK`, `TC-CHK-05-DENY`, `TC-CHK-06-OK`, `TC-CHK-06-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-021 — POST `/v1/checkouts`

**Create one checkout/order request for an explicitly accepted quote.**

| Property | Proposed contract |
| --- | --- |
| API name | Create one checkout/order request for an explicitly accepted quote |
| Version / owner | v1 / Cart_Checkout |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `CHK-07`, `CHK-08`; [WF-003](../06-Workflows/WF-003-Cart-Quote-and-Reservation.md) |
| Design sources | [Module HLD](../03-Modules/Cart_Checkout/HLD.md), [LLD](../03-Modules/Cart_Checkout/LLD.md), [edge cases](../03-Modules/Cart_Checkout/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/checkouts` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | cart-checkout.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Revalidate quote expiry, ownership/version and approved price/policy before commit. P requests enter prescription_review; M/O skips that branch and enters created/pending_payment only after valid stock orchestration. Accepted revision does not imply clinical approval or payment.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-021_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `CheckoutIntentRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `quoteToken` | string | Required | No | None (not silently populated) | minLength=1; maxLength=2048 | Opaque signed, expiring capability bound to customer/cart/address/version; API-only. |
| `cartVersion` | integer | Required | No | None (not silently populated) | minimum=1 | commerce.carts.row_version |
| `accepted` | boolean | Required | No | None (not silently populated) | const=true | Explicit acceptance of this exact quote. |


```json
{
  "quoteToken": "pv_quote_u9Qm3K7r2X6v8L4n",
  "cartVersion": 1,
  "accepted": true
}
```

File upload: **Not Applicable**.

### Success response

HTTP **201**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `CheckoutIntentData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `checkoutId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.orders.checkout_id. Ownership and current-state checks apply before use. |
| `checkoutStatus` | string | Required | No | None (not silently populated) | enum=["open", "validating", "ready", "completed", "failed", "expired"] | commerce.checkouts.status values. |
| `orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.orders.id. Ownership and current-state checks apply before use. |
| `orderStatus` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Separate commerce.orders.status fact; not equivalent to checkout status. |
| `acceptedRevisionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.order_revisions.id. Ownership and current-state checks apply before use. |
| `revisionNumber` | integer | Required | No | None (not silently populated) | minimum=1 | commerce.order_revisions.revision_number. |
| `nextAction` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Derived action, not persisted state. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "checkoutId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "checkoutStatus": "open",
    "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "orderStatus": "prescription_review",
    "acceptedRevisionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "revisionNumber": 1,
    "nextAction": "prescription_review"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-021. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks cart-checkout.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for create one checkout/order request for an explicitly accepted quote. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Revalidate quote expiry, ownership/version and approved price/policy before commit. P requests enter prescription_review; M/O skips that branch and enters created/pending_payment only after valid stock orchestration. Accepted revision does not imply clinical approval or payment. | No unauthorized/partial domain effect; redact sensitive context. | Lost response replays the same checkout/order/revision; stale quote creates nothing. Failed later reservation is an order exception, not a fabricated paid order. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current create one checkout/order request for an explicitly accepted quote. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Lost response replays the same checkout/order/revision; stale quote creates nothing. Failed later reservation is an order exception, not a fabricated paid order. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-021 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`commerce.carts`](../04-Database/Tables/commerce/carts.md) | Read | `expires_at`, `id`, `merged_into_cart_id`, `row_version`, `status`, `user_id` | Cart_Checkout projection / scoped joins; reading does not grant writes. |
| [`commerce.cart_items`](../04-Database/Tables/commerce/cart_items.md) | Read | `cart_id`, `id`, `prescription_id`, `product_id`, `row_version` | Cart_Checkout projection / scoped joins; reading does not grant writes. |
| [`customer.addresses`](../04-Database/Tables/customer/addresses.md) | Read | `id`, `is_deleted`, `row_version`, `user_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`catalog.products`](../04-Database/Tables/catalog/products.md) | Read | `id`, `is_deleted`, `row_version`, `status` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md) | Read | `id`, `is_deleted`, `row_version`, `user_id` | Prescription_Upload / Intake projection / scoped joins; reading does not grant writes. |
| [`commerce.checkouts`](../04-Database/Tables/commerce/checkouts.md) | Create/update evidence | `cart_id`, `address_id`, `user_id`, `checkout_number`, `expires_at`, `idempotency_key`, `pricing_snapshot`, `prescription_snapshot`, `serviceability_snapshot`, `inventory_snapshot`, `status` | Cart_Checkout owns these writes; Cart_Checkout must invoke that narrow owner command. |
| [`commerce.orders`](../04-Database/Tables/commerce/orders.md) | Create/update evidence | `checkout_id`, `user_id`, `patient_profile_id`, `order_number`, `current_revision_id`, `currency`, `subtotal`, `discount_total`, `tax_total`, `shipping_total`, `other_charges_total`, `grand_total`, `shipping_address_snapshot`, `status`, `source_channel` | Order_Operations owns these writes; Cart_Checkout must invoke that narrow owner command. |
| [`commerce.order_revisions`](../04-Database/Tables/commerce/order_revisions.md) | Create/update evidence | `order_id`, `revision_number`, `status`, `currency`, `quote_hash`, `line_items_snapshot`, `price_snapshot`, `shipping_snapshot`, `accepted_at`, `accepted_by_user_id`, `subtotal`, `discount_total`, `tax_total`, `shipping_total`, `other_charges_total`, `grand_total` | Order_Operations owns these writes; Cart_Checkout must invoke that narrow owner command. |
| [`commerce.order_items`](../04-Database/Tables/commerce/order_items.md) | Create/update evidence | `order_id`, `product_id`, `quantity`, `product_snapshot`, `commerce_class_snapshot`, `commerce_class_version_snapshot`, `unit_mrp`, `unit_price`, `discount_amount`, `tax_amount`, `line_total`, `status` | Order_Operations owns these writes; Cart_Checkout must invoke that narrow owner command. |
| [`commerce.carts`](../04-Database/Tables/commerce/carts.md) | Create/update evidence | `status` | Cart_Checkout owns these writes; Cart_Checkout must invoke that narrow owner command. |
| [`commerce.order_status_history`](../04-Database/Tables/commerce/order_status_history.md) | Create/update evidence | `order_id`, `from_status`, `to_status`, `changed_by_user_id`, `changed_at`, `reason_code` | Order_Operations owns these writes; Cart_Checkout must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.quoteToken | API-only signed capability derived from authoritative cart/address/patient/price snapshots and expiry. |
| request.cartVersion | commerce.carts.row_version |
| request.accepted | API-only explicit acceptance guard; server derives acceptance actor/time. |
| data.checkoutId | commerce.orders.checkout_id |
| data.checkoutStatus | commerce.checkouts.status |
| data.orderId | commerce.orders.id |
| data.orderStatus | commerce.orders.status |
| data.acceptedRevisionId | commerce.order_revisions.id |
| data.revisionNumber | commerce.order_revisions.revision_number |
| data.nextAction | API-only workflow projection from current domain states; no universal database enum. |

**Transaction:** Proposed single PostgreSQL transaction with Checkout owning checkout/cart and a narrow Order Operations command owning order/revision/items/history on the same transaction handle. No direct Checkout write grant to commerce.orders. Audit/outbox/idempotency commit together; no provider IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.brands`](../04-Database/Tables/catalog/brands.md), [`catalog.categories`](../04-Database/Tables/catalog/categories.md), [`catalog.commerce_classes`](../04-Database/Tables/catalog/commerce_classes.md), [`catalog.dosage_forms`](../04-Database/Tables/catalog/dosage_forms.md), [`catalog.manufacturers`](../04-Database/Tables/catalog/manufacturers.md), [`catalog.product_variants`](../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../04-Database/Tables/catalog/products.md), [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../04-Database/Tables/marketplace/sellers.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Revalidate quote expiry, ownership/version and approved price/policy before commit. P requests enter prescription_review; M/O skips that branch and enters created/pending_payment only after valid stock orchestration. Accepted revision does not imply clinical approval or payment. |
| Idempotency | Required key: scope actor + API-021 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Lost response replays the same checkout/order/revision; stale quote creates nothing. Failed later reservation is an order exception, not a fabricated paid order. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-021-HAPPY` | Valid Customer context and documented fixture for create one checkout/order request for an explicitly accepted quote. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-021-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-021-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-021-SCOPE` | Use another customer/site/patient/task reference or remove cart-checkout.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-021-RULE` | Revalidate quote expiry, ownership/version and approved price/policy before commit. P requests enter prescription_review; M/O skips that branch and enters created/pending_payment only after valid stock orchestration. Accepted revision does not imply clinical approval or payment. | Lost response replays the same checkout/order/revision; stale quote creates nothing. Failed later reservation is an order exception, not a fabricated paid order. |
| `CT-API-021-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-021-CONCURRENCY` | Race two create one checkout/order request for an explicitly accepted quote. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-021-STATE` | Apply command after Lost response replays the same checkout/order/revision; stale quote creates nothing. Failed later reservation is an order exception, not a fabricated paid order. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-021-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Lost response replays the same checkout/order/revision; stale quote creates nothing. Failed later reservation is an order exception, not a fabricated paid order. |

Existing feature assertions: `TC-CHK-07-OK`, `TC-CHK-07-DENY`, `TC-CHK-08-OK`, `TC-CHK-08-DENY`, `TC-CHK-08-01`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
