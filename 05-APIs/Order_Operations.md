# Order Operations API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](API-Contract-Coverage.md) · [OpenAPI 3.1](openapi.yaml) · [decisions](Planning-Decisions.md) · [DTO conventions](API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="order-operations-api-contracts"></a>
<a id="api-039--get-v1adminorders"></a>
<a id="caller-permissions-and-dependencies"></a>
<a id="http-request-contract"></a>
<a id="success-response-illustrative"></a>
<a id="errors-concurrency-and-failure-recovery"></a>
<a id="required-verification"></a>
<a id="api-040--get-v1adminordersorder_id"></a>
<a id="caller-permissions-and-dependencies-1"></a>
<a id="http-request-contract-1"></a>
<a id="success-response-illustrative-1"></a>
<a id="errors-concurrency-and-failure-recovery-1"></a>
<a id="required-verification-1"></a>
<a id="api-041--post-v1adminordersorder_idallocate"></a>
<a id="caller-permissions-and-dependencies-2"></a>
<a id="http-request-contract-2"></a>
<a id="success-response-illustrative-2"></a>
<a id="errors-concurrency-and-failure-recovery-2"></a>
<a id="required-verification-2"></a>
<a id="api-042--post-v1adminordersorder_idreassign"></a>
<a id="caller-permissions-and-dependencies-3"></a>
<a id="http-request-contract-3"></a>
<a id="success-response-illustrative-3"></a>
<a id="errors-concurrency-and-failure-recovery-3"></a>
<a id="required-verification-3"></a>
<a id="api-043--post-v1adminordersorder_idrevisions"></a>
<a id="caller-permissions-and-dependencies-4"></a>
<a id="http-request-contract-4"></a>
<a id="success-response-illustrative-4"></a>
<a id="errors-concurrency-and-failure-recovery-4"></a>
<a id="required-verification-4"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-039 | `GET /v1/admin/orders` | List orders visible to the Operations queue. | Complete proposed |
| API-040 | `GET /v1/admin/orders/{order_id}` | Read the Operations view of one in-scope order. | Complete proposed |
| API-041 | `POST /v1/admin/orders/{order_id}/allocate` | Coordinate one licensed eligible fulfillment site and its exact holds. | Complete proposed |
| API-042 | `POST /v1/admin/orders/{order_id}/reassign` | Move uncompleted work to a newly eligible site through compensation. | Complete proposed |
| API-043 | `POST /v1/admin/orders/{order_id}/revisions` | Propose a customer-visible revision of existing order lines. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| OMS-01 | Order list with filters (status, location, date, payment, Rx) and search by order number or phone | API-039 |
| OMS-02 | Order detail: items, batches, prescription, payment, delivery, full history | API-040 |
| OMS-03 | Automatic routing to the nearest open store with every item; warehouse as fallback | API-041 |
| OMS-04 | Reassign an order to another location, with a reason | API-042 |
| OMS-05 | Cancel, partly fulfil, raise return, add internal note | API-043 |
| OMS-06 | Attention queue: payment pending, stuck orders, failed deliveries | No direct operation; see [journey/API gaps](Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| OMS-07 | Assisted order entry for phone orders | No direct operation; see [journey/API gaps](Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |

## API-039 — GET `/v1/admin/orders`

**List orders visible to the Operations queue.**

| Property | Proposed contract |
| --- | --- |
| API name | List orders visible to the Operations queue |
| Version / owner | v1 / Order_Operations |
| Consumer | Order Operator |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `OMS-01`; [WF-006](../06-Workflows/WF-006-Licensed-Site-Allocation.md) |
| Design sources | [Module HLD](../03-Modules/Order_Operations/HLD.md), [LLD](../03-Modules/Order_Operations/LLD.md), [edge cases](../03-Modules/Order_Operations/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/orders` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Order Operator | orders.queue.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Server derives organization/location scope; broad customer search and Rx bodies are excluded. Filter status and optional authorized warehouse.

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
| warehouseId | string (uuid) | Optional | No | None | format="uuid" | Optional allowlisted filter; does not widen authenticated scope. |


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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-039. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks orders.queue.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-039 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`commerce.order_allocations`](../04-Database/Tables/commerce/order_allocations.md) | Read | `id`, `order_item_id`, `row_version`, `status`, `warehouse_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`warehouse.warehouses`](../04-Database/Tables/warehouse/warehouses.md) | Read | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | Warehouse projection / scoped joins; reading does not grant writes. |
| [`organization.memberships`](../04-Database/Tables/organization/memberships.md) | Read | `id`, `location_id`, `organization_id`, `row_version`, `status`, `user_id` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |

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

**Master dependencies:** [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../04-Database/Tables/marketplace/sellers.md), [`organization.departments`](../04-Database/Tables/organization/departments.md), [`organization.locations`](../04-Database/Tables/organization/locations.md), [`organization.organizations`](../04-Database/Tables/organization/organizations.md), [`warehouse.warehouses`](../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Server derives organization/location scope; broad customer search and Rx bodies are excluded. Filter status and optional authorized warehouse. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; placed_at DESC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Foreign warehouse filter is denied before query; cursor is bound to queue scope. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-039-HAPPY` | Valid Order Operator context and documented fixture for list orders visible to the operations queue. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-039-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-039-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-039-SCOPE` | Use another customer/site/patient/task reference or remove orders.queue.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-039-RULE` | Server derives organization/location scope; broad customer search and Rx bodies are excluded. Filter status and optional authorized warehouse. | Foreign warehouse filter is denied before query; cursor is bound to queue scope. |
| `CT-API-039-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-039-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-039-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-039-RECOVERY` | Dependency timeout during list orders visible to the operations queue. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-OMS-01-OK`, `TC-OMS-01-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-040 — GET `/v1/admin/orders/{order_id}`

**Read the Operations view of one in-scope order.**

| Property | Proposed contract |
| --- | --- |
| API name | Read the Operations view of one in-scope order |
| Version / owner | v1 / Order_Operations |
| Consumer | Order Operator |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `OMS-02`; [WF-006](../06-Workflows/WF-006-Licensed-Site-Allocation.md) |
| Design sources | [Module HLD](../03-Modules/Order_Operations/HLD.md), [LLD](../03-Modules/Order_Operations/LLD.md), [edge cases](../03-Modules/Order_Operations/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/orders/{order_id}` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Order Operator | orders.detail.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Only authorized routed order or explicitly authorized unallocated queue. Finance/clinical statuses are consumed as facts; no raw evidence or secrets.

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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-040. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks orders.detail.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for read the operations view of one in-scope order. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-040 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`commerce.order_allocations`](../04-Database/Tables/commerce/order_allocations.md) | Read | `id`, `order_item_id`, `row_version`, `status`, `warehouse_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`warehouse.warehouses`](../04-Database/Tables/warehouse/warehouses.md) | Read | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | Warehouse projection / scoped joins; reading does not grant writes. |

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

**Master dependencies:** [`catalog.commerce_classes`](../04-Database/Tables/catalog/commerce_classes.md), [`catalog.product_variants`](../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../04-Database/Tables/catalog/products.md), [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../04-Database/Tables/marketplace/sellers.md), [`organization.locations`](../04-Database/Tables/organization/locations.md), [`organization.organizations`](../04-Database/Tables/organization/organizations.md), [`warehouse.warehouses`](../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Only authorized routed order or explicitly authorized unallocated queue. Finance/clinical statuses are consumed as facts; no raw evidence or secrets. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Out-of-scope order is 404; an unallocated order does not confer global access. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-040-HAPPY` | Valid Order Operator context and documented fixture for read the operations view of one in-scope order. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-040-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-040-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-040-SCOPE` | Use another customer/site/patient/task reference or remove orders.detail.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-040-RULE` | Only authorized routed order or explicitly authorized unallocated queue. Finance/clinical statuses are consumed as facts; no raw evidence or secrets. | Out-of-scope order is 404; an unallocated order does not confer global access. |
| `CT-API-040-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-040-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-040-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-040-RECOVERY` | Dependency timeout during read the operations view of one in-scope order. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-OMS-02-OK`, `TC-OMS-02-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-041 — POST `/v1/admin/orders/{order_id}/allocate`

**Coordinate one licensed eligible fulfillment site and its exact holds.**

| Property | Proposed contract |
| --- | --- |
| API name | Coordinate one licensed eligible fulfillment site and its exact holds |
| Version / owner | v1 / Order_Operations |
| Consumer | Order Allocator |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `OMS-03`; [WF-006](../06-Workflows/WF-006-Licensed-Site-Allocation.md) |
| Design sources | [Module HLD](../03-Modules/Order_Operations/HLD.md), [LLD](../03-Modules/Order_Operations/LLD.md), [edge cases](../03-Modules/Order_Operations/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/orders/{order_id}/allocate` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Order Allocator | orders.allocate (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

One site for the whole accepted revision; require current P approval, fresh eligible lots, active site/license and serviceability. Inventory command API-052 owns reservation effects; Fulfillment owner creates immutable site-bound work only after valid hold.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-041_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `OrderAllocationRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedOrderVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `orderRevisionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.order_revisions.id. Ownership and current-state checks apply before use. |
| `warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.warehouses.id. Ownership and current-state checks apply before use. |


```json
{
  "expectedOrderVersion": 4,
  "orderRevisionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **202**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `AllocationData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.orders.id. Ownership and current-state checks apply before use. |
| `orderRevisionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.order_revisions.id. Ownership and current-state checks apply before use. |
| `warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.warehouses.id. Ownership and current-state checks apply before use. |
| `allocationStatus` | string | Required | No | None (not silently populated) | enum=["pending", "allocated"] | Coordination projection; not a commerce.order_allocations enum assertion. |
| `orderVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "orderRevisionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "allocationStatus": "pending",
    "orderVersion": 4
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-041. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks orders.allocate or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for coordinate one licensed eligible fulfillment site and its exact holds. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | One site for the whole accepted revision; require current P approval, fresh eligible lots, active site/license and serviceability. Inventory command API-052 owns reservation effects; Fulfillment owner creates immutable site-bound work only after valid hold. | No unauthorized/partial domain effect; redact sensitive context. | Competing allocators have one winner. Failed hold leaves allocation pending/exception and no successful fulfillment; release any abandoned new holds idempotently. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current coordinate one licensed eligible fulfillment site and its exact holds. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Competing allocators have one winner. Failed hold leaves allocation pending/exception and no successful fulfillment; release any abandoned new holds idempotently. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-041 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`commerce.orders`](../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `internal_id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_items`](../04-Database/Tables/commerce/order_items.md) | Read | `id`, `order_id`, `prescription_id`, `row_version`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_revisions`](../04-Database/Tables/commerce/order_revisions.md) | Read | `id`, `order_id`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`organization.locations`](../04-Database/Tables/organization/locations.md) | Read | `id`, `is_active`, `is_deleted`, `organization_id`, `row_version` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`organization.licenses`](../04-Database/Tables/organization/licenses.md) | Read | `expires_at`, `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `verification_status` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`warehouse.warehouses`](../04-Database/Tables/warehouse/warehouses.md) | Read | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | Warehouse projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_balances`](../04-Database/Tables/warehouse/stock_balances.md) | Read | `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `lot_id`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.inventory_lots`](../04-Database/Tables/warehouse/inventory_lots.md) | Read | `batch_number`, `expires_at`, `id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`clinical.order_reviews`](../04-Database/Tables/clinical/order_reviews.md) | Read | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`clinical.order_review_items`](../04-Database/Tables/clinical/order_review_items.md) | Read | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `review_id`, `row_version` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`logistics.serviceability_rules`](../04-Database/Tables/logistics/serviceability_rules.md) | Read | `id`, `is_deleted`, `row_version` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_allocations`](../04-Database/Tables/commerce/order_allocations.md) | Create/update evidence | `order_item_id`, `warehouse_id`, `reservation_id`, `allocated_qty`, `status` | Order_Operations owns these writes; Order_Operations must invoke that narrow owner command. |
| [`commerce.orders`](../04-Database/Tables/commerce/orders.md) | Create/update evidence | `status`, `fulfillment_status` | Order_Operations owns these writes; Order_Operations must invoke that narrow owner command. |
| [`fulfillment.fulfillment_orders`](../04-Database/Tables/fulfillment/fulfillment_orders.md) | Create/update evidence | `order_id`, `order_revision_id`, `warehouse_id`, `fulfillment_number`, `status` | Store_Operations / Fulfillment owner owns these writes; Order_Operations must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedOrderVersion | commerce.orders.row_version |
| request.orderRevisionId | commerce.order_revisions.id |
| request.warehouseId | warehouse.warehouses.id |
| data.orderId | commerce.orders.id |
| data.orderRevisionId | commerce.order_revisions.id |
| data.warehouseId | warehouse.warehouses.id |
| data.allocationStatus | API-only coordination projection; not a stored single enum. |
| data.orderVersion | commerce.orders.row_version |

**Transaction:** Operations locks order/version and records pending intent/outbox. Inventory atomically holds exact items in its own transaction. Operations records allocations and requests Fulfillment creation after committed hold evidence; failed coordination releases holds through API-053. No cross-owner direct stock writes. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.commerce_classes`](../04-Database/Tables/catalog/commerce_classes.md), [`catalog.product_variants`](../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../04-Database/Tables/catalog/products.md), [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md), [`clinical.review_reason_codes`](../04-Database/Tables/clinical/review_reason_codes.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`logistics.carriers`](../04-Database/Tables/logistics/carriers.md), [`marketplace.sellers`](../04-Database/Tables/marketplace/sellers.md), [`organization.locations`](../04-Database/Tables/organization/locations.md), [`organization.organizations`](../04-Database/Tables/organization/organizations.md), [`procurement.suppliers`](../04-Database/Tables/procurement/suppliers.md), [`warehouse.bins`](../04-Database/Tables/warehouse/bins.md), [`warehouse.warehouses`](../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | One site for the whole accepted revision; require current P approval, fresh eligible lots, active site/license and serviceability. Inventory command API-052 owns reservation effects; Fulfillment owner creates immutable site-bound work only after valid hold. |
| Idempotency | Required key: scope actor + API-041 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Competing allocators have one winner. Failed hold leaves allocation pending/exception and no successful fulfillment; release any abandoned new holds idempotently. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-041-HAPPY` | Valid Order Allocator context and documented fixture for coordinate one licensed eligible fulfillment site and its exact holds. | HTTP 202; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-041-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-041-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-041-SCOPE` | Use another customer/site/patient/task reference or remove orders.allocate. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-041-RULE` | One site for the whole accepted revision; require current P approval, fresh eligible lots, active site/license and serviceability. Inventory command API-052 owns reservation effects; Fulfillment owner creates immutable site-bound work only after valid hold. | Competing allocators have one winner. Failed hold leaves allocation pending/exception and no successful fulfillment; release any abandoned new holds idempotently. |
| `CT-API-041-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-041-CONCURRENCY` | Race two coordinate one licensed eligible fulfillment site and its exact holds. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-041-STATE` | Apply command after Competing allocators have one winner. Failed hold leaves allocation pending/exception and no successful fulfillment; release any abandoned new holds idempotently. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-041-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Competing allocators have one winner. Failed hold leaves allocation pending/exception and no successful fulfillment; release any abandoned new holds idempotently. |

Existing feature assertions: `TC-OMS-03-OK`, `TC-OMS-03-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-042 — POST `/v1/admin/orders/{order_id}/reassign`

**Move uncompleted work to a newly eligible site through compensation.**

| Property | Proposed contract |
| --- | --- |
| API name | Move uncompleted work to a newly eligible site through compensation |
| Version / owner | v1 / Order_Operations |
| Consumer | Order Allocator |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `OMS-04`; [WF-006](../06-Workflows/WF-006-Licensed-Site-Allocation.md) |
| Design sources | [Module HLD](../03-Modules/Order_Operations/HLD.md), [LLD](../03-Modules/Order_Operations/LLD.md), [edge cases](../03-Modules/Order_Operations/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/orders/{order_id}/reassign` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Order Allocator | orders.reassign (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Never mutate warehouse/order/revision identity on existing fulfillment row. Validate cancellable task states, stop old work, release old hold then obtain new site holds and create new work. Packed/handed_over cannot be reassigned via this command.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-042_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `OrderReassignmentRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedOrderVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `orderRevisionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.order_revisions.id. Ownership and current-state checks apply before use. |
| `warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.warehouses.id. Ownership and current-state checks apply before use. |
| `reasonCode` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | Controlled Operations reason retained in order_status_history.reason_code. |


```json
{
  "expectedOrderVersion": 4,
  "orderRevisionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "reasonCode": "CUSTOMER_REQUEST"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **202**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `AllocationData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.orders.id. Ownership and current-state checks apply before use. |
| `orderRevisionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.order_revisions.id. Ownership and current-state checks apply before use. |
| `warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.warehouses.id. Ownership and current-state checks apply before use. |
| `allocationStatus` | string | Required | No | None (not silently populated) | enum=["pending", "allocated"] | Coordination projection; not a commerce.order_allocations enum assertion. |
| `orderVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "orderRevisionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "allocationStatus": "pending",
    "orderVersion": 4
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-042. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks orders.reassign or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for move uncompleted work to a newly eligible site through compensation. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Never mutate warehouse/order/revision identity on existing fulfillment row. Validate cancellable task states, stop old work, release old hold then obtain new site holds and create new work. Packed/handed_over cannot be reassigned via this command. | No unauthorized/partial domain effect; redact sensitive context. | New site failure remains a visible unallocated exception; do not retain two active site allocations or pretend old custody moved. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current move uncompleted work to a newly eligible site through compensation. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | New site failure remains a visible unallocated exception; do not retain two active site allocations or pretend old custody moved. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-042 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`commerce.orders`](../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `internal_id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_items`](../04-Database/Tables/commerce/order_items.md) | Read | `id`, `order_id`, `prescription_id`, `row_version`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_revisions`](../04-Database/Tables/commerce/order_revisions.md) | Read | `id`, `order_id`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`organization.locations`](../04-Database/Tables/organization/locations.md) | Read | `id`, `is_active`, `is_deleted`, `organization_id`, `row_version` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`organization.licenses`](../04-Database/Tables/organization/licenses.md) | Read | `expires_at`, `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `verification_status` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`warehouse.warehouses`](../04-Database/Tables/warehouse/warehouses.md) | Read | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | Warehouse projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_balances`](../04-Database/Tables/warehouse/stock_balances.md) | Read | `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `lot_id`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.inventory_lots`](../04-Database/Tables/warehouse/inventory_lots.md) | Read | `batch_number`, `expires_at`, `id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`clinical.order_reviews`](../04-Database/Tables/clinical/order_reviews.md) | Read | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`clinical.order_review_items`](../04-Database/Tables/clinical/order_review_items.md) | Read | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `review_id`, `row_version` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`logistics.serviceability_rules`](../04-Database/Tables/logistics/serviceability_rules.md) | Read | `id`, `is_deleted`, `row_version` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_allocations`](../04-Database/Tables/commerce/order_allocations.md) | Create/update evidence | `order_item_id`, `warehouse_id`, `reservation_id`, `allocated_qty`, `status` | Order_Operations owns these writes; Order_Operations must invoke that narrow owner command. |
| [`commerce.orders`](../04-Database/Tables/commerce/orders.md) | Create/update evidence | `status`, `fulfillment_status` | Order_Operations owns these writes; Order_Operations must invoke that narrow owner command. |
| [`fulfillment.fulfillment_orders`](../04-Database/Tables/fulfillment/fulfillment_orders.md) | Create/update evidence | `order_id`, `order_revision_id`, `warehouse_id`, `fulfillment_number`, `status` | Store_Operations / Fulfillment owner owns these writes; Order_Operations must invoke that narrow owner command. |
| [`commerce.order_status_history`](../04-Database/Tables/commerce/order_status_history.md) | Create/update evidence | `order_id`, `from_status`, `to_status`, `reason_code`, `changed_by_user_id`, `changed_at` | Order_Operations owns these writes; Order_Operations must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedOrderVersion | commerce.orders.row_version |
| request.orderRevisionId | commerce.order_revisions.id |
| request.warehouseId | warehouse.warehouses.id |
| request.reasonCode | commerce.order_status_history.reason_code |
| data.orderId | commerce.orders.id |
| data.orderRevisionId | commerce.order_revisions.id |
| data.warehouseId | warehouse.warehouses.id |
| data.allocationStatus | API-only coordination projection; not a stored single enum. |
| data.orderVersion | commerce.orders.row_version |

**Transaction:** Saga: Operations records intent; Fulfillment closes cancellable old work; Inventory releases old holds and separately acquires new holds; Operations records new allocations and Fulfillment creates replacement work. Each owner commits audit/outbox; retries resume persisted step, no distributed atomicity. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.commerce_classes`](../04-Database/Tables/catalog/commerce_classes.md), [`catalog.product_variants`](../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../04-Database/Tables/catalog/products.md), [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md), [`clinical.review_reason_codes`](../04-Database/Tables/clinical/review_reason_codes.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`logistics.carriers`](../04-Database/Tables/logistics/carriers.md), [`marketplace.sellers`](../04-Database/Tables/marketplace/sellers.md), [`organization.locations`](../04-Database/Tables/organization/locations.md), [`organization.organizations`](../04-Database/Tables/organization/organizations.md), [`procurement.suppliers`](../04-Database/Tables/procurement/suppliers.md), [`warehouse.bins`](../04-Database/Tables/warehouse/bins.md), [`warehouse.warehouses`](../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Never mutate warehouse/order/revision identity on existing fulfillment row. Validate cancellable task states, stop old work, release old hold then obtain new site holds and create new work. Packed/handed_over cannot be reassigned via this command. |
| Idempotency | Required key: scope actor + API-042 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. New site failure remains a visible unallocated exception; do not retain two active site allocations or pretend old custody moved. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-042-HAPPY` | Valid Order Allocator context and documented fixture for move uncompleted work to a newly eligible site through compensation. | HTTP 202; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-042-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-042-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-042-SCOPE` | Use another customer/site/patient/task reference or remove orders.reassign. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-042-RULE` | Never mutate warehouse/order/revision identity on existing fulfillment row. Validate cancellable task states, stop old work, release old hold then obtain new site holds and create new work. Packed/handed_over cannot be reassigned via this command. | New site failure remains a visible unallocated exception; do not retain two active site allocations or pretend old custody moved. |
| `CT-API-042-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-042-CONCURRENCY` | Race two move uncompleted work to a newly eligible site through compensation. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-042-STATE` | Apply command after New site failure remains a visible unallocated exception; do not retain two active site allocations or pretend old custody moved. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-042-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. New site failure remains a visible unallocated exception; do not retain two active site allocations or pretend old custody moved. |

Existing feature assertions: `TC-OMS-04-OK`, `TC-OMS-04-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-043 — POST `/v1/admin/orders/{order_id}/revisions`

**Propose a customer-visible revision of existing order lines.**

| Property | Proposed contract |
| --- | --- |
| API name | Propose a customer-visible revision of existing order lines |
| Version / owner | v1 / Order_Operations |
| Consumer | Order Operator |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `OMS-05`; [WF-004](../06-Workflows/WF-004-Prescription-Intake-and-Review.md) |
| Design sources | [Module HLD](../03-Modules/Order_Operations/HLD.md), [LLD](../03-Modules/Order_Operations/LLD.md), [edge cases](../03-Modules/Order_Operations/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/orders/{order_id}/revisions` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Order Operator | orders.revision.propose (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Existing item IDs only in this initial proposal; no silent substitution/new SKU. Reprice server-side; create proposed snapshot without changing accepted totals. Changed P quantity/evidence requires fresh review and explicit customer acceptance through API-063.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-043_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `OrderRevisionRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedOrderVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `reasonCode` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | Revision reason retained in platform.audit_logs.metadata_json.reasonCode and safe outbox evidence; order_revisions has no reason_code column. |
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

Data DTO: `OrderRevisionData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `revisionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | commerce.order_revisions.id; uuid. |
| `orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | commerce.order_revisions.order_id; uuid. |
| `revisionNumber` | integer | Required | No | None (not silently populated) | minimum=0 | commerce.order_revisions.revision_number; integer. |
| `status` | string | Required | No | None (not silently populated) | enum=["proposed", "accepted", "superseded", "cancelled"]; minLength=1; maxLength=16 | commerce.order_revisions.status; character varying(16). |
| `currency` | string | Required | No | None (not silently populated) | minLength=1; maxLength=3 | commerce.order_revisions.currency; character varying(3). |
| `grandTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | commerce.order_revisions.grand_total; numeric(16,2). |
| `acceptedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | commerce.order_revisions.accepted_at; timestamp with time zone. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "revisionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "revisionNumber": 1,
    "status": "proposed",
    "currency": "INR",
    "grandTotal": "26.25",
    "acceptedAt": null
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-043. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks orders.revision.propose or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for propose a customer-visible revision of existing order lines. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Existing item IDs only in this initial proposal; no silent substitution/new SKU. Reprice server-side; create proposed snapshot without changing accepted totals. Changed P quantity/evidence requires fresh review and explicit customer acceptance through API-063. | No unauthorized/partial domain effect; redact sensitive context. | Unapproved proposal cannot drive payment/picking. Competing revision numbers serialize under order lock. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current propose a customer-visible revision of existing order lines. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Unapproved proposal cannot drive payment/picking. Competing revision numbers serialize under order lock. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-043 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`commerce.orders`](../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `internal_id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_items`](../04-Database/Tables/commerce/order_items.md) | Read | `id`, `order_id`, `prescription_id`, `product_id`, `quantity`, `row_version`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_revisions`](../04-Database/Tables/commerce/order_revisions.md) | Read | `accepted_at`, `currency`, `grand_total`, `id`, `order_id`, `revision_number`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`catalog.products`](../04-Database/Tables/catalog/products.md) | Read | `id`, `is_deleted`, `row_version`, `status` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`pricing.product_prices`](../04-Database/Tables/pricing/product_prices.md) | Read | `id`, `product_id`, `row_version`, `valid_from`, `valid_until` | pricing domain owner (Proposed) projection / scoped joins; reading does not grant writes. |
| [`pricing.tax_rules`](../04-Database/Tables/pricing/tax_rules.md) | Read | `id`, `is_deleted`, `row_version`, `valid_from`, `valid_until` | pricing domain owner (Proposed) projection / scoped joins; reading does not grant writes. |
| [`commerce.order_revisions`](../04-Database/Tables/commerce/order_revisions.md) | Create/update evidence | `order_id`, `revision_number`, `status`, `currency`, `quote_hash`, `line_items_snapshot`, `price_snapshot`, `shipping_snapshot`, `subtotal`, `discount_total`, `tax_total`, `shipping_total`, `other_charges_total`, `grand_total` | Order_Operations owns these writes; Order_Operations must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedOrderVersion | commerce.orders.row_version |
| request.reasonCode | Revision reason retained in platform.audit_logs.metadata_json.reasonCode and safe outbox evidence; order_revisions has no reason_code column. |
| request.items[].orderItemId | commerce.order_items.id |
| request.items[].quantity | commerce.order_items.quantity |
| data.revisionId | commerce.order_revisions.id |
| data.orderId | commerce.order_revisions.order_id |
| data.revisionNumber | commerce.order_revisions.revision_number |
| data.status | commerce.order_revisions.status |
| data.currency | commerce.order_revisions.currency |
| data.grandTotal | commerce.order_revisions.grand_total |
| data.acceptedAt | commerce.order_revisions.accepted_at |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.brands`](../04-Database/Tables/catalog/brands.md), [`catalog.categories`](../04-Database/Tables/catalog/categories.md), [`catalog.commerce_classes`](../04-Database/Tables/catalog/commerce_classes.md), [`catalog.dosage_forms`](../04-Database/Tables/catalog/dosage_forms.md), [`catalog.manufacturers`](../04-Database/Tables/catalog/manufacturers.md), [`catalog.product_variants`](../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../04-Database/Tables/catalog/products.md), [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../04-Database/Tables/marketplace/sellers.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Existing item IDs only in this initial proposal; no silent substitution/new SKU. Reprice server-side; create proposed snapshot without changing accepted totals. Changed P quantity/evidence requires fresh review and explicit customer acceptance through API-063. |
| Idempotency | Required key: scope actor + API-043 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Unapproved proposal cannot drive payment/picking. Competing revision numbers serialize under order lock. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-043-HAPPY` | Valid Order Operator context and documented fixture for propose a customer-visible revision of existing order lines. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-043-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-043-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-043-SCOPE` | Use another customer/site/patient/task reference or remove orders.revision.propose. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-043-RULE` | Existing item IDs only in this initial proposal; no silent substitution/new SKU. Reprice server-side; create proposed snapshot without changing accepted totals. Changed P quantity/evidence requires fresh review and explicit customer acceptance through API-063. | Unapproved proposal cannot drive payment/picking. Competing revision numbers serialize under order lock. |
| `CT-API-043-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-043-CONCURRENCY` | Race two propose a customer-visible revision of existing order lines. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-043-STATE` | Apply command after Unapproved proposal cannot drive payment/picking. Competing revision numbers serialize under order lock. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-043-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Unapproved proposal cannot drive payment/picking. Competing revision numbers serialize under order lock. |

Existing feature assertions: `TC-OMS-05-OK`, `TC-OMS-05-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
