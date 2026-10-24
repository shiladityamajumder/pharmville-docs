# Customer Orders API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](API-Contract-Coverage.md) · [OpenAPI 3.1](openapi.yaml) · [decisions](Planning-Decisions.md) · [DTO conventions](API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="customer-orders-api-contracts"></a>
<a id="api-025--get-v1meorders"></a>
<a id="caller-permissions-and-dependencies"></a>
<a id="http-request-contract"></a>
<a id="success-response-illustrative"></a>
<a id="errors-concurrency-and-failure-recovery"></a>
<a id="required-verification"></a>
<a id="api-026--get-v1meordersorder_id"></a>
<a id="caller-permissions-and-dependencies-1"></a>
<a id="http-request-contract-1"></a>
<a id="success-response-illustrative-1"></a>
<a id="errors-concurrency-and-failure-recovery-1"></a>
<a id="required-verification-1"></a>
<a id="api-027--post-v1meordersorder_idcancel"></a>
<a id="caller-permissions-and-dependencies-2"></a>
<a id="http-request-contract-2"></a>
<a id="success-response-illustrative-2"></a>
<a id="errors-concurrency-and-failure-recovery-2"></a>
<a id="required-verification-2"></a>
<a id="api-028--post-v1meordersorder_idreturns"></a>
<a id="caller-permissions-and-dependencies-3"></a>
<a id="http-request-contract-3"></a>
<a id="success-response-illustrative-3"></a>
<a id="errors-concurrency-and-failure-recovery-3"></a>
<a id="required-verification-3"></a>
<a id="api-029--get-v1meordersorder_idinvoice"></a>
<a id="caller-permissions-and-dependencies-4"></a>
<a id="http-request-contract-4"></a>
<a id="success-response-illustrative-4"></a>
<a id="errors-concurrency-and-failure-recovery-4"></a>
<a id="required-verification-4"></a>
<a id="api-030--get-v1meordersorder_idrefunds"></a>
<a id="caller-permissions-and-dependencies-5"></a>
<a id="http-request-contract-5"></a>
<a id="success-response-illustrative-5"></a>
<a id="errors-concurrency-and-failure-recovery-5"></a>
<a id="required-verification-5"></a>
<a id="api-031--get-v1meordersorder_iddelivery"></a>
<a id="caller-permissions-and-dependencies-6"></a>
<a id="http-request-contract-6"></a>
<a id="success-response-illustrative-6"></a>
<a id="errors-concurrency-and-failure-recovery-6"></a>
<a id="required-verification-6"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-025 | `GET /v1/me/orders` | List the customer order history with distinct business statuses. | Complete proposed |
| API-026 | `GET /v1/me/orders/{order_id}` | Read one owned order and its accepted line projection. | Complete proposed |
| API-027 | `POST /v1/me/orders/{order_id}/cancel` | Request cancellation before packing under the documented draft policy. | Complete proposed |
| API-028 | `POST /v1/me/orders/{order_id}/returns` | Create an evidenced return request for eligible delivered quantities. | Complete proposed |
| API-029 | `GET /v1/me/orders/{order_id}/invoice` | Read or download the owned issued invoice. | Complete proposed |
| API-030 | `GET /v1/me/orders/{order_id}/refunds` | List refunds for one owned order. | Complete proposed |
| API-031 | `GET /v1/me/orders/{order_id}/delivery` | Read shipment progress for one owned order. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| ORD-01 | Order confirmation on screen, WhatsApp and email | No direct operation; see [journey/API gaps](Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| ORD-02 | Status timeline (placed → packed → out for delivery → delivered) | API-025, API-026 |
| ORD-03 | Order history with GST invoice download | API-029 |
| ORD-04 | Cancel before the order is packed | API-027 |
| ORD-05 | Return request within the return window | API-028 |
| ORD-06 | Refund status for cancelled and returned orders | API-030 |
| ORD-07 | Live rider location on a map, estimated arrival, masked call button | API-031 |
| ORD-08 | Delivery OTP shown to the customer | No direct operation; see [journey/API gaps](Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| ORD-09 | Change items or address after placing an order | No direct operation; see [journey/API gaps](Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |

## API-025 — GET `/v1/me/orders`

**List the customer order history with distinct business statuses.**

| Property | Proposed contract |
| --- | --- |
| API name | List the customer order history with distinct business statuses |
| Version / owner | v1 / Customer_Orders |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ORD-02`; [WF-005](../06-Workflows/WF-005-Payment-and-Confirmation.md) |
| Design sources | [Module HLD](../03-Modules/Customer_Orders/HLD.md), [LLD](../03-Modules/Customer_Orders/LLD.md), [edge cases](../03-Modules/Customer_Orders/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/orders` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-orders.read.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Filter user_id to JWT subject before sorting and pagination; no other customer count.

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

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| limit | integer | Optional | No | 20 | minimum=1; maximum=100 | Optional allowlisted filter; does not widen authenticated scope. |
| cursor | string | Optional | No | None | minLength=1; maxLength=2048 | Opaque integrity-protected continuation bound to actor, filters and fixed ordering. |
| status | string | Optional | No | None | enum=["created", "pending_payment", "payment_confirmed", "prescription_review", "confirmed", "allocated", "processing", "partially_fulfilled", "fulfilled", "cancelled", "closed"]; minLength=1; maxLength=19 | commerce.orders.status; character varying(19). |


Only declared query fields are accepted. Sorting is fixed: `placed_at DESC, id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `OrderListData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `orders` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `orders[].orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | commerce.orders.id; uuid. |
| `orders[].orderNumber` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | commerce.orders.order_number; character varying(64). |
| `orders[].status` | string | Required | No | None (not silently populated) | enum=["created", "pending_payment", "payment_confirmed", "prescription_review", "confirmed", "allocated", "processing", "partially_fulfilled", "fulfilled", "cancelled", "closed"]; minLength=1; maxLength=19 | commerce.orders.status; character varying(19). |
| `orders[].paymentStatus` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | commerce.orders.payment_status; character varying(32). |
| `orders[].prescriptionStatus` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | commerce.orders.prescription_status; character varying(32). |
| `orders[].fulfillmentStatus` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | commerce.orders.fulfillment_status; character varying(32). |
| `orders[].grandTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | commerce.orders.grand_total; numeric(16,2). |
| `orders[].currency` | string | Required | No | None (not silently populated) | minLength=1; maxLength=3 | commerce.orders.currency; character varying(3). |
| `orders[].placedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | commerce.orders.placed_at; timestamp with time zone. |
| `orders[].orderVersion` | integer | Required | No | None (not silently populated) | minimum=0 | commerce.orders.row_version; bigint. |
| `orders[].currentRevisionId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | commerce.orders.current_revision_id; uuid. |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "orderNumber": "PV-20261024-0001",
        "status": "created",
        "paymentStatus": "payment status",
        "prescriptionStatus": "prescription status",
        "fulfillmentStatus": "fulfillment status",
        "grandTotal": "26.25",
        "currency": "INR",
        "placedAt": "2026-10-24T10:30:00Z",
        "orderVersion": 1,
        "currentRevisionId": null
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
      "nextCursor": null,
      "hasNext": false
    }
  }
}
```

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 422 | `REQUEST_VALIDATION_ERROR` | A declared path/query/header field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-025. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-orders.read.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-025 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`commerce.orders`](../04-Database/Tables/commerce/orders.md) | Read | `currency`, `current_revision_id`, `fulfillment_status`, `grand_total`, `id`, `order_number`, `patient_profile_id`, `payment_status`, `placed_at`, `prescription_status`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.orders[].orderId | commerce.orders.id |
| data.orders[].orderNumber | commerce.orders.order_number |
| data.orders[].status | commerce.orders.status |
| data.orders[].paymentStatus | commerce.orders.payment_status |
| data.orders[].prescriptionStatus | commerce.orders.prescription_status |
| data.orders[].fulfillmentStatus | commerce.orders.fulfillment_status |
| data.orders[].grandTotal | commerce.orders.grand_total |
| data.orders[].currency | commerce.orders.currency |
| data.orders[].placedAt | commerce.orders.placed_at |
| data.orders[].orderVersion | commerce.orders.row_version |
| data.orders[].currentRevisionId | commerce.orders.current_revision_id |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Filter user_id to JWT subject before sorting and pagination; no other customer count. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; placed_at DESC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. An empty history is 200; an invalid cursor is 422 and can be restarted. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-025-HAPPY` | Valid Customer context and documented fixture for list the customer order history with distinct business statuses. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-025-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-025-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-025-SCOPE` | Use another customer/site/patient/task reference or remove customer-orders.read.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-025-RULE` | Filter user_id to JWT subject before sorting and pagination; no other customer count. | An empty history is 200; an invalid cursor is 422 and can be restarted. |
| `CT-API-025-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-025-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-025-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-025-RECOVERY` | Dependency timeout during list the customer order history with distinct business statuses. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-ORD-02-OK`, `TC-ORD-02-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-026 — GET `/v1/me/orders/{order_id}`

**Read one owned order and its accepted line projection.**

| Property | Proposed contract |
| --- | --- |
| API name | Read one owned order and its accepted line projection |
| Version / owner | v1 / Customer_Orders |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ORD-02`; [WF-005](../06-Workflows/WF-005-Payment-and-Confirmation.md) |
| Design sources | [Module HLD](../03-Modules/Customer_Orders/HLD.md), [LLD](../03-Modules/Customer_Orders/LLD.md), [edge cases](../03-Modules/Customer_Orders/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/orders/{order_id}` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-orders.read.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Resolve current_revision_id; preserve distinct payment, fulfillment and Rx statuses. Do not return Rx bytes or staff clinical notes.

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

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| order_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is fixed: `not applicable for this singleton`. Pagination: none.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `OrderDetailData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `order` | object | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `order.orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | commerce.orders.id; uuid. |
| `order.orderNumber` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | commerce.orders.order_number; character varying(64). |
| `order.status` | string | Required | No | None (not silently populated) | enum=["created", "pending_payment", "payment_confirmed", "prescription_review", "confirmed", "allocated", "processing", "partially_fulfilled", "fulfilled", "cancelled", "closed"]; minLength=1; maxLength=19 | commerce.orders.status; character varying(19). |
| `order.paymentStatus` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | commerce.orders.payment_status; character varying(32). |
| `order.prescriptionStatus` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | commerce.orders.prescription_status; character varying(32). |
| `order.fulfillmentStatus` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | commerce.orders.fulfillment_status; character varying(32). |
| `order.grandTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | commerce.orders.grand_total; numeric(16,2). |
| `order.currency` | string | Required | No | None (not silently populated) | minLength=1; maxLength=3 | commerce.orders.currency; character varying(3). |
| `order.placedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | commerce.orders.placed_at; timestamp with time zone. |
| `order.orderVersion` | integer | Required | No | None (not silently populated) | minimum=0 | commerce.orders.row_version; bigint. |
| `order.currentRevisionId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | commerce.orders.current_revision_id; uuid. |
| `items` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `items[].orderItemId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | commerce.order_items.id; uuid. |
| `items[].productId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | commerce.order_items.product_id; uuid. |
| `items[].quantity` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,9}(\\.[0-9]{1,3})?$" | commerce.order_items.quantity; numeric(12,3). |
| `items[].unitPrice` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,12}(\\.[0-9]{1,2})?$" | commerce.order_items.unit_price; numeric(14,2). |
| `items[].taxAmount` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,12}(\\.[0-9]{1,2})?$" | commerce.order_items.tax_amount; numeric(14,2). |
| `items[].lineTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | commerce.order_items.line_total; numeric(16,2). |
| `items[].commerceClass` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=1 | commerce.order_items.commerce_class_snapshot; character varying(1). |
| `items[].status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | commerce.order_items.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |
| `patientId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | commerce.orders.patient_profile_id; uuid. |
| `shippingAddress` | object | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `shippingAddress.recipientName` | string | Required | No | None (not silently populated) | minLength=1; maxLength=150 | Accepted immutable commerce.orders.shipping_address_snapshot.recipientName JSON key; do not read a subsequently edited address. |
| `shippingAddress.city` | string | Required | No | None (not silently populated) | minLength=1; maxLength=100 | Accepted immutable commerce.orders.shipping_address_snapshot.city JSON key; do not read a subsequently edited address. |
| `shippingAddress.postalCode` | string | Required | No | None (not silently populated) | minLength=1; maxLength=16 | Accepted immutable commerce.orders.shipping_address_snapshot.postalCode JSON key; do not read a subsequently edited address. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "order": {
      "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "orderNumber": "PV-20261024-0001",
      "status": "created",
      "paymentStatus": "payment status",
      "prescriptionStatus": "prescription status",
      "fulfillmentStatus": "fulfillment status",
      "grandTotal": "25.00",
      "currency": "INR",
      "placedAt": "2026-10-24T10:30:00Z",
      "orderVersion": 1,
      "currentRevisionId": null
    },
    "items": [
      {
        "orderItemId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "quantity": "2.000",
        "unitPrice": "12.50",
        "taxAmount": "0.00",
        "lineTotal": "25.00",
        "commerceClass": "O",
        "status": "requested"
      }
    ],
    "patientId": null,
    "shippingAddress": {
      "recipientName": "Asha Example",
      "city": "Noida",
      "postalCode": "201301"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-026. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-orders.read.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for read one owned order and its accepted line projection. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-026 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`commerce.orders`](../04-Database/Tables/commerce/orders.md) | Read | `currency`, `current_revision_id`, `fulfillment_status`, `grand_total`, `id`, `internal_id`, `order_number`, `patient_profile_id`, `payment_status`, `placed_at`, `prescription_status`, `row_version`, `shipping_address_snapshot`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_items`](../04-Database/Tables/commerce/order_items.md) | Read | `commerce_class_snapshot`, `id`, `line_total`, `order_id`, `prescription_id`, `product_id`, `quantity`, `row_version`, `status`, `tax_amount`, `unit_price` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_revisions`](../04-Database/Tables/commerce/order_revisions.md) | Read | `id`, `order_id`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.order.orderId | commerce.orders.id |
| data.order.orderNumber | commerce.orders.order_number |
| data.order.status | commerce.orders.status |
| data.order.paymentStatus | commerce.orders.payment_status |
| data.order.prescriptionStatus | commerce.orders.prescription_status |
| data.order.fulfillmentStatus | commerce.orders.fulfillment_status |
| data.order.grandTotal | commerce.orders.grand_total |
| data.order.currency | commerce.orders.currency |
| data.order.placedAt | commerce.orders.placed_at |
| data.order.orderVersion | commerce.orders.row_version |
| data.order.currentRevisionId | commerce.orders.current_revision_id |
| data.items[].orderItemId | commerce.order_items.id |
| data.items[].productId | commerce.order_items.product_id |
| data.items[].quantity | commerce.order_items.quantity |
| data.items[].unitPrice | commerce.order_items.unit_price |
| data.items[].taxAmount | commerce.order_items.tax_amount |
| data.items[].lineTotal | commerce.order_items.line_total |
| data.items[].commerceClass | commerce.order_items.commerce_class_snapshot |
| data.items[].status | commerce.order_items.status |
| data.patientId | commerce.orders.patient_profile_id |
| data.shippingAddress.recipientName | commerce.orders.shipping_address_snapshot |
| data.shippingAddress.city | commerce.orders.shipping_address_snapshot |
| data.shippingAddress.postalCode | commerce.orders.shipping_address_snapshot |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`catalog.commerce_classes`](../04-Database/Tables/catalog/commerce_classes.md), [`catalog.product_variants`](../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../04-Database/Tables/catalog/products.md), [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../04-Database/Tables/marketplace/sellers.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Resolve current_revision_id; preserve distinct payment, fulfillment and Rx statuses. Do not return Rx bytes or staff clinical notes. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Foreign or absent order is 404; refresh to see a concurrent revision. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-026-HAPPY` | Valid Customer context and documented fixture for read one owned order and its accepted line projection. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-026-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-026-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-026-SCOPE` | Use another customer/site/patient/task reference or remove customer-orders.read.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-026-RULE` | Resolve current_revision_id; preserve distinct payment, fulfillment and Rx statuses. Do not return Rx bytes or staff clinical notes. | Foreign or absent order is 404; refresh to see a concurrent revision. |
| `CT-API-026-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-026-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-026-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-026-RECOVERY` | Dependency timeout during read one owned order and its accepted line projection. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-ORD-02-OK`, `TC-ORD-02-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-027 — POST `/v1/me/orders/{order_id}/cancel`

**Request cancellation before packing under the documented draft policy.**

| Property | Proposed contract |
| --- | --- |
| API name | Request cancellation before packing under the documented draft policy |
| Version / owner | v1 / Order_Operations |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ORD-04`; [WF-010](../06-Workflows/WF-010-Cancellation-Return-and-Refund.md) |
| Design sources | [Module HLD](../03-Modules/Customer_Orders/HLD.md), [LLD](../03-Modules/Customer_Orders/LLD.md), [edge cases](../03-Modules/Customer_Orders/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/orders/{order_id}/cancel` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-orders.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Serialize order cancellation against pack completion. Only before-packed states can enter the cancellation orchestration; packed/handed_over is an exception, not a forced cancel. No direct payment or stock writes.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-027_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| order_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `CancellationRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedOrderVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `reasonCode` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | commerce.cancellations.reason_code; character varying(64). |
| `reasonText` | string/null | Optional | Yes | None (not silently populated) | minLength=1; maxLength=1000 | Optional safe customer explanation. |


```json
{
  "expectedOrderVersion": 4,
  "reasonCode": "CUSTOMER_REQUEST",
  "reasonText": "Ordered in error"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **202**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `CancellationData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `cancellationId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | commerce.cancellations.id; uuid. |
| `orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | commerce.cancellations.order_id; uuid. |
| `status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | commerce.cancellations.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |
| `resolvedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | commerce.cancellations.resolved_at; timestamp with time zone. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "cancellationId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "status": "requested",
    "resolvedAt": null
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-027. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-orders.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for request cancellation before packing under the documented draft policy. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Serialize order cancellation against pack completion. Only before-packed states can enter the cancellation orchestration; packed/handed_over is an exception, not a forced cancel. No direct payment or stock writes. | No unauthorized/partial domain effect; redact sensitive context. | If packing wins, return INVALID_STATE_TRANSITION and route to approved support path. Accepted cancellation separately requests Inventory release and Finance compensation; refund is not completed here. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current request cancellation before packing under the documented draft policy. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | If packing wins, return INVALID_STATE_TRANSITION and route to approved support path. Accepted cancellation separately requests Inventory release and Finance compensation; refund is not completed here. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-027 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`commerce.orders`](../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_items`](../04-Database/Tables/commerce/order_items.md) | Read | `id`, `order_id`, `prescription_id`, `row_version`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`fulfillment.fulfillment_orders`](../04-Database/Tables/fulfillment/fulfillment_orders.md) | Read | `id`, `order_id`, `order_revision_id`, `row_version`, `status`, `warehouse_id` | Store_Operations / Fulfillment owner projection / scoped joins; reading does not grant writes. |
| [`commerce.cancellation_reason_codes`](../04-Database/Tables/commerce/cancellation_reason_codes.md) | Read | `id`, `is_active`, `row_version` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.cancellations`](../04-Database/Tables/commerce/cancellations.md) | Create/update evidence | `order_id`, `reason_code`, `reason_text`, `requested_by_user_id`, `status` | Order_Operations owns these writes; Order_Operations must invoke that narrow owner command. |
| [`commerce.cancellation_items`](../04-Database/Tables/commerce/cancellation_items.md) | Create/update evidence | `cancellation_id`, `order_item_id`, `quantity` | Order_Operations owns these writes; Order_Operations must invoke that narrow owner command. |
| [`commerce.orders`](../04-Database/Tables/commerce/orders.md) | Create/update evidence | `status`, `cancelled_at` | Order_Operations owns these writes; Order_Operations must invoke that narrow owner command. |
| [`commerce.order_status_history`](../04-Database/Tables/commerce/order_status_history.md) | Create/update evidence | `order_id`, `from_status`, `to_status`, `changed_at`, `changed_by_user_id`, `reason_code` | Order_Operations owns these writes; Order_Operations must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedOrderVersion | commerce.orders.row_version |
| request.reasonCode | commerce.cancellations.reason_code |
| request.reasonText | commerce.cancellations.reason_text |
| data.cancellationId | commerce.cancellations.id |
| data.orderId | commerce.cancellations.order_id |
| data.status | commerce.cancellations.status |
| data.resolvedAt | commerce.cancellations.resolved_at |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.commerce_classes`](../04-Database/Tables/catalog/commerce_classes.md), [`catalog.product_variants`](../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../04-Database/Tables/catalog/products.md), [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md), [`commerce.cancellation_reason_codes`](../04-Database/Tables/commerce/cancellation_reason_codes.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../04-Database/Tables/marketplace/sellers.md), [`warehouse.warehouses`](../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Serialize order cancellation against pack completion. Only before-packed states can enter the cancellation orchestration; packed/handed_over is an exception, not a forced cancel. No direct payment or stock writes. |
| Idempotency | Required key: scope actor + API-027 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. If packing wins, return INVALID_STATE_TRANSITION and route to approved support path. Accepted cancellation separately requests Inventory release and Finance compensation; refund is not completed here. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-027-HAPPY` | Valid Customer context and documented fixture for request cancellation before packing under the documented draft policy. | HTTP 202; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-027-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-027-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-027-SCOPE` | Use another customer/site/patient/task reference or remove customer-orders.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-027-RULE` | Serialize order cancellation against pack completion. Only before-packed states can enter the cancellation orchestration; packed/handed_over is an exception, not a forced cancel. No direct payment or stock writes. | If packing wins, return INVALID_STATE_TRANSITION and route to approved support path. Accepted cancellation separately requests Inventory release and Finance compensation; refund is not completed here. |
| `CT-API-027-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-027-CONCURRENCY` | Race two request cancellation before packing under the documented draft policy. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-027-STATE` | Apply command after If packing wins, return INVALID_STATE_TRANSITION and route to approved support path. Accepted cancellation separately requests Inventory release and Finance compensation; refund is not completed here. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-027-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. If packing wins, return INVALID_STATE_TRANSITION and route to approved support path. Accepted cancellation separately requests Inventory release and Finance compensation; refund is not completed here. |

Existing feature assertions: `TC-ORD-04-OK`, `TC-ORD-04-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-028 — POST `/v1/me/orders/{order_id}/returns`

**Create an evidenced return request for eligible delivered quantities.**

| Property | Proposed contract |
| --- | --- |
| API name | Create an evidenced return request for eligible delivered quantities |
| Version / owner | v1 / Order_Operations |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ORD-05`; [WF-010](../06-Workflows/WF-010-Cancellation-Return-and-Refund.md) |
| Design sources | [Module HLD](../03-Modules/Customer_Orders/HLD.md), [LLD](../03-Modules/Customer_Orders/LLD.md), [edge cases](../03-Modules/Customer_Orders/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/orders/{order_id}/returns` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-orders.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Require delivered item quantities, configured returnable_until and applicable approved product return policy; subtract quantities already in accepted requests. A quality complaint does not make returned medicine saleable.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-028_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| order_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `ReturnRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedOrderVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `reasonCode` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | commerce.returns.reason_code; character varying(64). |
| `items` | array<object> | Required | No | None (not silently populated) | minItems=1; maxItems=50 | Nested typed projection. |
| `items[].orderItemId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.order_items.id. Ownership and current-state checks apply before use. |
| `items[].quantity` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(?=.*[1-9])[0-9]{1,13}(\\.[0-9]{1,3})?$" | Positive decimal quantity, up to three fractional digits. |


```json
{
  "expectedOrderVersion": 4,
  "reasonCode": "CUSTOMER_REQUEST",
  "items": [
    {
      "orderItemId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "quantity": "2.000"
    }
  ]
}
```

File upload: **Not Applicable**.

### Success response

HTTP **201**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `ReturnData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `returnId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | commerce.returns.id; uuid. |
| `returnNumber` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | commerce.returns.return_number; character varying(64). |
| `orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | commerce.returns.order_id; uuid. |
| `status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | commerce.returns.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |
| `requestedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | commerce.returns.requested_at; timestamp with time zone. |
| `pickupRequired` | boolean | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | commerce.returns.pickup_required; boolean. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "returnId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "returnNumber": "return number",
    "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "status": "requested",
    "requestedAt": "2026-10-24T10:30:00Z",
    "pickupRequired": true
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-028. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-orders.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for create an evidenced return request for eligible delivered quantities. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Require delivered item quantities, configured returnable_until and applicable approved product return policy; subtract quantities already in accepted requests. A quality complaint does not make returned medicine saleable. | No unauthorized/partial domain effect; redact sensitive context. | Excess/expired/ineligible returns have no stock or refund effect. Receipt inspection and refund approval are later owner commands. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current create an evidenced return request for eligible delivered quantities. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Excess/expired/ineligible returns have no stock or refund effect. Receipt inspection and refund approval are later owner commands. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-028 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`commerce.orders`](../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_items`](../04-Database/Tables/commerce/order_items.md) | Read | `id`, `order_id`, `prescription_id`, `row_version`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.returns`](../04-Database/Tables/commerce/returns.md) | Read | `id`, `order_id`, `pickup_required`, `reason_code`, `reason_code_id`, `requested_at`, `return_number`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.return_items`](../04-Database/Tables/commerce/return_items.md) | Read | `id`, `order_item_id`, `quantity`, `return_id`, `row_version` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.return_reason_codes`](../04-Database/Tables/commerce/return_reason_codes.md) | Read | `id`, `is_active`, `row_version` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.returns`](../04-Database/Tables/commerce/returns.md) | Create/update evidence | `order_id`, `user_id`, `reason_code`, `return_number`, `status`, `requested_at`, `pickup_required` | Order_Operations owns these writes; Order_Operations must invoke that narrow owner command. |
| [`commerce.return_items`](../04-Database/Tables/commerce/return_items.md) | Create/update evidence | `return_id`, `order_item_id`, `quantity`, `resolution` | Order_Operations owns these writes; Order_Operations must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedOrderVersion | commerce.orders.row_version |
| request.reasonCode | commerce.returns.reason_code |
| request.items[].orderItemId | commerce.order_items.id |
| request.items[].quantity | commerce.return_items.quantity |
| data.returnId | commerce.returns.id |
| data.returnNumber | commerce.returns.return_number |
| data.orderId | commerce.returns.order_id |
| data.status | commerce.returns.status |
| data.requestedAt | commerce.returns.requested_at |
| data.pickupRequired | commerce.returns.pickup_required |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.commerce_classes`](../04-Database/Tables/catalog/commerce_classes.md), [`catalog.product_variants`](../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../04-Database/Tables/catalog/products.md), [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md), [`commerce.return_reason_codes`](../04-Database/Tables/commerce/return_reason_codes.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../04-Database/Tables/marketplace/sellers.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Require delivered item quantities, configured returnable_until and applicable approved product return policy; subtract quantities already in accepted requests. A quality complaint does not make returned medicine saleable. |
| Idempotency | Required key: scope actor + API-028 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Excess/expired/ineligible returns have no stock or refund effect. Receipt inspection and refund approval are later owner commands. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-028-HAPPY` | Valid Customer context and documented fixture for create an evidenced return request for eligible delivered quantities. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-028-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-028-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-028-SCOPE` | Use another customer/site/patient/task reference or remove customer-orders.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-028-RULE` | Require delivered item quantities, configured returnable_until and applicable approved product return policy; subtract quantities already in accepted requests. A quality complaint does not make returned medicine saleable. | Excess/expired/ineligible returns have no stock or refund effect. Receipt inspection and refund approval are later owner commands. |
| `CT-API-028-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-028-CONCURRENCY` | Race two create an evidenced return request for eligible delivered quantities. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-028-STATE` | Apply command after Excess/expired/ineligible returns have no stock or refund effect. Receipt inspection and refund approval are later owner commands. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-028-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Excess/expired/ineligible returns have no stock or refund effect. Receipt inspection and refund approval are later owner commands. |

Existing feature assertions: `TC-ORD-05-OK`, `TC-ORD-05-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-029 — GET `/v1/me/orders/{order_id}/invoice`

**Read or download the owned issued invoice.**

| Property | Proposed contract |
| --- | --- |
| API name | Read or download the owned issued invoice |
| Version / owner | v1 / Finance_Payments |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ORD-03`; [WF-005](../06-Workflows/WF-005-Payment-and-Confirmation.md) |
| Design sources | [Module HLD](../03-Modules/Customer_Orders/HLD.md), [LLD](../03-Modules/Customer_Orders/LLD.md), [edge cases](../03-Modules/Customer_Orders/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/orders/{order_id}/invoice` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-orders.read.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Invoice is immutable issued evidence; an unissued document returns 404. This JSON route exposes amounts and safe line detail, no public download URL. Accept application/json (default) for the structured DTO or application/pdf for attachment download of finance.invoices.document_file_id. Reauthorize customer/staff scope, available clean private file and invoice-purpose grant; stream the immutable stored PDF through the authenticated file service, never a caller URL or a public link.

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

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| order_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is fixed: `not applicable for this singleton`. Pagination: none.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

PDF download variant: send `Accept: application/pdf`. HTTP 200 streams the immutable issued PDF bytes with `Content-Type: application/pdf` and `Content-Disposition: attachment; filename="invoice-DEMO-INV-0001.pdf"` (sanitized server-generated filename). No JSON envelope or pagination applies to this variant. Authenticate before streaming and recheck invoice-purpose file grant; no public URL, redirects or range/partial-download support is proposed. Missing issued document is 404; unavailable storage is 503. The default JSON representation follows below.

Data DTO: `InvoiceData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `invoiceId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | finance.invoices.id; uuid. |
| `invoiceNumber` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | finance.invoices.invoice_number; character varying(64). |
| `orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | finance.invoices.order_id; uuid. |
| `issuedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | finance.invoices.issued_at; timestamp with time zone. |
| `status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | finance.invoices.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |
| `subtotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | finance.invoices.subtotal; numeric(16,2). |
| `taxTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | finance.invoices.tax_total; numeric(16,2). |
| `grandTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | finance.invoices.grand_total; numeric(16,2). |
| `currency` | string | Required | No | None (not silently populated) | minLength=1; maxLength=3 | finance.invoices.currency; character varying(3). |
| `items` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `items[].description` | string | Required | No | None (not silently populated) | minLength=1; maxLength=255 | finance.invoice_items.description; character varying(255). |
| `items[].quantity` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,9}(\\.[0-9]{1,3})?$" | finance.invoice_items.quantity; numeric(12,3). |
| `items[].unitPrice` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,12}(\\.[0-9]{1,2})?$" | finance.invoice_items.unit_price; numeric(14,2). |
| `items[].hsnCode` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=32 | finance.invoice_items.hsn_code; character varying(32). |
| `items[].taxAmount` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,12}(\\.[0-9]{1,2})?$" | finance.invoice_items.tax_amount; numeric(14,2). |
| `items[].lineTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | finance.invoice_items.line_total; numeric(16,2). |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "invoiceId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "invoiceNumber": "DEMO-INV-0001",
    "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "issuedAt": "2026-10-24T10:30:00Z",
    "status": "issued",
    "subtotal": "25.00",
    "taxTotal": "0.00",
    "grandTotal": "25.00",
    "currency": "INR",
    "items": [
      {
        "description": "Synthetic planning example; not an approved clinical claim.",
        "quantity": "2.000",
        "unitPrice": "12.50",
        "hsnCode": null,
        "taxAmount": "0.00",
        "lineTotal": "25.00"
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
| 422 | `REQUEST_VALIDATION_ERROR` | A declared path/query/header field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-029. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-orders.read.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for read or download the owned issued invoice. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-029 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`commerce.orders`](../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`finance.invoices`](../04-Database/Tables/finance/invoices.md) | Read | `currency`, `document_file_id`, `grand_total`, `id`, `invoice_number`, `issued_at`, `order_id`, `row_version`, `status`, `subtotal`, `tax_total` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`finance.invoice_items`](../04-Database/Tables/finance/invoice_items.md) | Read | `description`, `hsn_code`, `id`, `invoice_id`, `line_total`, `order_item_id`, `quantity`, `row_version`, `tax_amount`, `unit_price` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`platform.file_objects`](../04-Database/Tables/platform/file_objects.md) | Read | `access_type`, `classification`, `id`, `is_deleted`, `malware_scan_status`, `owner_id`, `owner_type`, `row_version`, `sha256`, `size_bytes`, `status` | Platform file service projection / scoped joins; reading does not grant writes. |
| [`platform.file_access_grants`](../04-Database/Tables/platform/file_access_grants.md) | Read | `expires_at`, `file_object_id`, `id`, `row_version` | Platform file service projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.invoiceId | finance.invoices.id |
| data.invoiceNumber | finance.invoices.invoice_number |
| data.orderId | finance.invoices.order_id |
| data.issuedAt | finance.invoices.issued_at |
| data.status | finance.invoices.status |
| data.subtotal | finance.invoices.subtotal |
| data.taxTotal | finance.invoices.tax_total |
| data.grandTotal | finance.invoices.grand_total |
| data.currency | finance.invoices.currency |
| data.items[].description | finance.invoice_items.description |
| data.items[].quantity | finance.invoice_items.quantity |
| data.items[].unitPrice | finance.invoice_items.unit_price |
| data.items[].hsnCode | finance.invoice_items.hsn_code |
| data.items[].taxAmount | finance.invoice_items.tax_amount |
| data.items[].lineTotal | finance.invoice_items.line_total |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../04-Database/Tables/marketplace/sellers.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Invoice is immutable issued evidence; an unissued document returns 404. This JSON route exposes amounts and safe line detail, no public download URL. Accept application/json (default) for the structured DTO or application/pdf for attachment download of finance.invoices.document_file_id. Reauthorize customer/staff scope, available clean private file and invoice-purpose grant; stream the immutable stored PDF through the authenticated file service, never a caller URL or a public link. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. An order without an issued invoice is not given a fabricated invoice; retry after issuance. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-029-HAPPY` | Valid Customer context and documented fixture for read or download the owned issued invoice. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-029-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-029-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-029-SCOPE` | Use another customer/site/patient/task reference or remove customer-orders.read.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-029-RULE` | Invoice is immutable issued evidence; an unissued document returns 404. This JSON route exposes amounts and safe line detail, no public download URL. Accept application/json (default) for the structured DTO or application/pdf for attachment download of finance.invoices.document_file_id. Reauthorize customer/staff scope, available clean private file and invoice-purpose grant; stream the immutable stored PDF through the authenticated file service, never a caller URL or a public link. | An order without an issued invoice is not given a fabricated invoice; retry after issuance. |
| `CT-API-029-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-029-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-029-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-029-RECOVERY` | Dependency timeout during read or download the owned issued invoice. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-ORD-03-OK`, `TC-ORD-03-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-030 — GET `/v1/me/orders/{order_id}/refunds`

**List refunds for one owned order.**

| Property | Proposed contract |
| --- | --- |
| API name | List refunds for one owned order |
| Version / owner | v1 / Finance_Payments |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ORD-06`; [WF-010](../06-Workflows/WF-010-Cancellation-Return-and-Refund.md) |
| Design sources | [Module HLD](../03-Modules/Customer_Orders/HLD.md), [LLD](../03-Modules/Customer_Orders/LLD.md), [edge cases](../03-Modules/Customer_Orders/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/orders/{order_id}/refunds` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-orders.read.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Show persisted refund status and amount independently of cancellation/return status; derive currency from order.

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

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| order_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| limit | integer | Optional | No | 20 | minimum=1; maximum=100 | Optional allowlisted filter; does not widen authenticated scope. |
| offset | integer | Optional | No | 0 | minimum=0; maximum=100000 | Optional allowlisted filter; does not widen authenticated scope. |


Only declared query fields are accepted. Sorting is fixed: `created_at DESC, id ASC`. Pagination: offset.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `RefundListData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `refunds` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `refunds[].refundId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | payment.refunds.id; uuid. |
| `refunds[].orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | payment.refunds.order_id; uuid. |
| `refunds[].amount` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | payment.refunds.amount; numeric(16,2). |
| `refunds[].status` | string | Required | No | None (not silently populated) | enum=["requested", "approved", "processing", "succeeded", "failed", "cancelled"]; minLength=1; maxLength=16 | payment.refunds.status; character varying(16). |
| `refunds[].createdAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | payment.refunds.created_at; timestamp with time zone. |
| `currency` | string | Required | No | None (not silently populated) | minLength=1; maxLength=3 | commerce.orders.currency; character varying(3). |


Pagination metadata: `totalCount: integer ≥0`, `limit: integer 1–100`, `offset: integer 0–100000`, `hasNext: boolean`. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "refunds": [
      {
        "refundId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "amount": "26.25",
        "status": "requested",
        "createdAt": "2026-10-24T10:30:00Z"
      }
    ],
    "currency": "INR"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-030. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-orders.read.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for list refunds for one owned order. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-030 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`commerce.orders`](../04-Database/Tables/commerce/orders.md) | Read | `currency`, `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`payment.refunds`](../04-Database/Tables/payment/refunds.md) | Read | `amount`, `created_at`, `id`, `order_id`, `order_revision_id`, `row_version`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.refunds[].refundId | payment.refunds.id |
| data.refunds[].orderId | payment.refunds.order_id |
| data.refunds[].amount | payment.refunds.amount |
| data.refunds[].status | payment.refunds.status |
| data.refunds[].createdAt | payment.refunds.created_at |
| data.currency | commerce.orders.currency |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`payment.refund_reason_codes`](../04-Database/Tables/payment/refund_reason_codes.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Show persisted refund status and amount independently of cancellation/return status; derive currency from order. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | offset; created_at DESC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Pending refund remains pending after provider timeout; never turn absence of callback into success. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-030-HAPPY` | Valid Customer context and documented fixture for list refunds for one owned order. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-030-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-030-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-030-SCOPE` | Use another customer/site/patient/task reference or remove customer-orders.read.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-030-RULE` | Show persisted refund status and amount independently of cancellation/return status; derive currency from order. | Pending refund remains pending after provider timeout; never turn absence of callback into success. |
| `CT-API-030-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-030-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-030-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-030-RECOVERY` | Dependency timeout during list refunds for one owned order. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-ORD-06-OK`, `TC-ORD-06-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-031 — GET `/v1/me/orders/{order_id}/delivery`

**Read shipment progress for one owned order.**

| Property | Proposed contract |
| --- | --- |
| API name | Read shipment progress for one owned order |
| Version / owner | v1 / Delivery_Operations |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ORD-07`; [WF-008](../06-Workflows/WF-008-Rider-Assignment-and-POD.md) |
| Design sources | [Module HLD](../03-Modules/Customer_Orders/HLD.md), [LLD](../03-Modules/Customer_Orders/LLD.md), [edge cases](../03-Modules/Customer_Orders/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/orders/{order_id}/delivery` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-orders.read.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Show safe promised/actual timestamps; omit rider live GPS, personal contact and internal route details.

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

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| order_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is fixed: `not applicable for this singleton`. Pagination: none.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `OrderDeliveryData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `shipments` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `shipments[].shipmentId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | logistics.shipments.id; uuid. |
| `shipments[].orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | logistics.shipments.order_id; uuid. |
| `shipments[].status` | string | Required | No | None (not silently populated) | enum=["created", "label_created", "pickup_scheduled", "picked_up", "in_transit", "out_for_delivery", "delivered", "delivery_failed", "rto_initiated", "rto_delivered", "cancelled"]; minLength=1; maxLength=16 | logistics.shipments.status; character varying(16). |
| `shipments[].estimatedDeliveryAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | logistics.shipments.estimated_delivery_at; timestamp with time zone. |
| `shipments[].dispatchedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | logistics.shipments.dispatched_at; timestamp with time zone. |
| `shipments[].deliveredAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | logistics.shipments.delivered_at; timestamp with time zone. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "shipments": [
      {
        "shipmentId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "status": "created",
        "estimatedDeliveryAt": null,
        "dispatchedAt": null,
        "deliveredAt": null
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
| 422 | `REQUEST_VALIDATION_ERROR` | A declared path/query/header field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-031. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-orders.read.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for read shipment progress for one owned order. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-031 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`commerce.orders`](../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.shipments`](../04-Database/Tables/logistics/shipments.md) | Read | `delivered_at`, `dispatched_at`, `estimated_delivery_at`, `id`, `order_id`, `order_revision_id`, `row_version`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.shipments[].shipmentId | logistics.shipments.id |
| data.shipments[].orderId | logistics.shipments.order_id |
| data.shipments[].status | logistics.shipments.status |
| data.shipments[].estimatedDeliveryAt | logistics.shipments.estimated_delivery_at |
| data.shipments[].dispatchedAt | logistics.shipments.dispatched_at |
| data.shipments[].deliveredAt | logistics.shipments.delivered_at |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`logistics.carriers`](../04-Database/Tables/logistics/carriers.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Show safe promised/actual timestamps; omit rider live GPS, personal contact and internal route details. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. No assigned shipment returns shipments []; it is not a delivered state. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-031-HAPPY` | Valid Customer context and documented fixture for read shipment progress for one owned order. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-031-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-031-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-031-SCOPE` | Use another customer/site/patient/task reference or remove customer-orders.read.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-031-RULE` | Show safe promised/actual timestamps; omit rider live GPS, personal contact and internal route details. | No assigned shipment returns shipments []; it is not a delivered state. |
| `CT-API-031-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-031-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-031-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-031-RECOVERY` | Dependency timeout during read shipment progress for one owned order. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-ORD-07-OK`, `TC-ORD-07-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
