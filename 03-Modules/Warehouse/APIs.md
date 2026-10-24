# Warehouse API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](../../05-APIs/API-Contract-Coverage.md) · [OpenAPI 3.1](../../05-APIs/openapi.yaml) · [decisions](../../05-APIs/Planning-Decisions.md) · [DTO conventions](../../05-APIs/API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="warehouse-api-contracts"></a>
<a id="api-056--post-v1staffwarehousereceipts"></a>
<a id="caller-permissions-and-dependencies"></a>
<a id="http-request-contract"></a>
<a id="success-response-illustrative"></a>
<a id="errors-concurrency-and-failure-recovery"></a>
<a id="required-verification"></a>
<a id="api-057--get-v1staffwarehousereplenishments"></a>
<a id="caller-permissions-and-dependencies-1"></a>
<a id="http-request-contract-1"></a>
<a id="success-response-illustrative-1"></a>
<a id="errors-concurrency-and-failure-recovery-1"></a>
<a id="required-verification-1"></a>
<a id="api-058--post-v1staffwarehousetransferstransfer_iddispatch"></a>
<a id="caller-permissions-and-dependencies-2"></a>
<a id="http-request-contract-2"></a>
<a id="success-response-illustrative-2"></a>
<a id="errors-concurrency-and-failure-recovery-2"></a>
<a id="required-verification-2"></a>
<a id="api-059--get-v1staffwarehousefallback-orders"></a>
<a id="caller-permissions-and-dependencies-3"></a>
<a id="http-request-contract-3"></a>
<a id="success-response-illustrative-3"></a>
<a id="errors-concurrency-and-failure-recovery-3"></a>
<a id="required-verification-3"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-056 | `POST /v1/staff/warehouse/receipts` | Record supplier batch receipt and quality evidence before stock credit. | Complete proposed |
| API-057 | `GET /v1/staff/warehouse/replenishments` | List pending replenishment requests for warehouse review. | Complete proposed |
| API-058 | `POST /v1/staff/warehouse/transfers/{transfer_id}/dispatch` | Dispatch an approved physical inter-site transfer once. | Complete proposed |
| API-059 | `GET /v1/staff/warehouse/fallback-orders` | List eligible orders needing warehouse fallback consideration. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| WH-01 | Receive stock: batch, manufacturing and expiry dates, quantity, supplier invoice | API-056 |
| WH-02 | Replenishment queue: approve, dispatch with note, stock "in transit" | API-057, API-058 |
| WH-03 | Urgent runs, up to two extra a day | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| WH-04 | Pick, pack and dispatch fallback online orders | API-059 |
| WH-05 | Basic stock audit | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |

## API-056 — POST `/v1/staff/warehouse/receipts`

**Record supplier batch receipt and quality evidence before stock credit.**

| Property | Proposed contract |
| --- | --- |
| API name | Record supplier batch receipt and quality evidence before stock credit |
| Version / owner | v1 / Warehouse via Procurement receiving owner |
| Consumer | Warehouse Receiver |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `WH-01`; [WF-014](../../06-Workflows/WF-014-Supplier-Receiving.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/warehouse/receipts` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Warehouse Receiver | warehouse.receipts.create (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

accepted+rejected equals actual received; batch/date/PO/site must match and overreceipt is blocked unless approved separately. Damaged/quarantined stock is not automatically orderable. Preserve supplier-invoice discrepancies.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-056_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `GoodsReceiptRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `purchaseOrderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from procurement.goods_receipts.purchase_order_id. Ownership and current-state checks apply before use. |
| `warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.warehouses.id. Ownership and current-state checks apply before use. |
| `supplierInvoiceId` | string (uuid) | Optional | No | None (not silently populated) | format="uuid" | Public DTO value from procurement.goods_receipts.supplier_invoice_id. Ownership and current-state checks apply before use. |
| `items` | array<object> | Required | No | None (not silently populated) | minItems=1; maxItems=100 | Nested typed projection. |
| `items[].purchaseOrderItemId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from procurement.goods_receipt_items.purchase_order_item_id. Ownership and current-state checks apply before use. |
| `items[].batchNumber` | string | Required | No | None (not silently populated) | minLength=1; maxLength=128 | procurement.goods_receipt_items.batch_number; character varying(128). |
| `items[].expiryDate` | string (date) | Required | No | None (not silently populated) | format="date" | procurement.goods_receipt_items.expiry_date; date. |
| `items[].receivedQuantity` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(?=.*[1-9])[0-9]{1,13}(\\.[0-9]{1,3})?$" | Positive decimal quantity, up to three fractional digits. |
| `items[].acceptedQuantity` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^[0-9]{1,13}(\\.[0-9]{1,3})?$" | Nonnegative accepted physical quantity. |
| `items[].rejectedQuantity` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^[0-9]{1,13}(\\.[0-9]{1,3})?$" | Nonnegative rejected quantity. |
| `items[].unitCost` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(0\|[1-9][0-9]{0,13})(\\.[0-9]{1,2})?$" | Decimal string, nonnegative numeric(16,2); no binary floating point. |
| `items[].mrp` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(0\|[1-9][0-9]{0,13})(\\.[0-9]{1,2})?$" | Decimal string, nonnegative numeric(16,2); no binary floating point. |
| `items[].qualityResult` | string | Required | No | None (not silently populated) | enum=["pending", "approved", "quarantined", "rejected"] | Matches Inventory quality vocabulary; receiving approval policy still requires Pharmacy/Operations. |


```json
{
  "purchaseOrderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "supplierInvoiceId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "items": [
    {
      "purchaseOrderItemId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "batchNumber": "batch number",
      "expiryDate": "2026-10-24",
      "receivedQuantity": "2.000",
      "acceptedQuantity": "2.000",
      "rejectedQuantity": "0.000",
      "unitCost": "26.25",
      "mrp": "26.25",
      "qualityResult": "pending"
    }
  ]
}
```

File upload: **Not Applicable**.

### Success response

HTTP **201**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `GoodsReceiptData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `receiptId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | procurement.goods_receipts.id; uuid. |
| `grnNumber` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | procurement.goods_receipts.grn_number; character varying(64). |
| `purchaseOrderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | procurement.goods_receipts.purchase_order_id; uuid. |
| `warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | procurement.goods_receipts.warehouse_id; uuid. |
| `status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | procurement.goods_receipts.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |
| `receivedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | procurement.goods_receipts.received_at; timestamp with time zone. |
| `rowVersion` | integer | Required | No | None (not silently populated) | minimum=0 | procurement.goods_receipts.row_version; bigint. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "receiptId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "grnNumber": "GRN-DEMO-0001",
    "purchaseOrderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "status": "received",
    "receivedAt": null,
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-056. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks warehouse.receipts.create or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for record supplier batch receipt and quality evidence before stock credit. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | accepted+rejected equals actual received; batch/date/PO/site must match and overreceipt is blocked unless approved separately. Damaged/quarantined stock is not automatically orderable. Preserve supplier-invoice discrepancies. | No unauthorized/partial domain effect; redact sensitive context. | Invalid item rolls back the receipt batch. After commit Inventory processes only approved accepted stock, deduplicated by receipt item ID; provider invoice is never silently changed. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Invalid item rolls back the receipt batch. After commit Inventory processes only approved accepted stock, deduplicated by receipt item ID; provider invoice is never silently changed. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-056 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`procurement.purchase_orders`](../../04-Database/Tables/procurement/purchase_orders.md) | Read | `id`, `row_version`, `status`, `supplier_id`, `warehouse_id` | Warehouse via Procurement owner projection / scoped joins; reading does not grant writes. |
| [`procurement.purchase_order_items`](../../04-Database/Tables/procurement/purchase_order_items.md) | Read | `id`, `purchase_order_id`, `row_version` | Warehouse via Procurement owner projection / scoped joins; reading does not grant writes. |
| [`procurement.suppliers`](../../04-Database/Tables/procurement/suppliers.md) | Read | `id`, `is_deleted`, `organization_id`, `row_version`, `status` | Warehouse via Procurement owner projection / scoped joins; reading does not grant writes. |
| [`procurement.supplier_invoices`](../../04-Database/Tables/procurement/supplier_invoices.md) | Read | `id`, `purchase_order_id`, `row_version`, `status`, `supplier_id` | Warehouse via Procurement owner projection / scoped joins; reading does not grant writes. |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | Read | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | Warehouse projection / scoped joins; reading does not grant writes. |
| [`procurement.goods_receipts`](../../04-Database/Tables/procurement/goods_receipts.md) | Create/update evidence | `purchase_order_id`, `warehouse_id`, `supplier_invoice_id`, `grn_number`, `received_by_user_id`, `received_at`, `status` | Warehouse via Procurement owner owns these writes; Warehouse via Procurement receiving owner must invoke that narrow owner command. |
| [`procurement.goods_receipt_items`](../../04-Database/Tables/procurement/goods_receipt_items.md) | Create/update evidence | `goods_receipt_id`, `purchase_order_item_id`, `batch_number`, `expiry_date`, `received_qty`, `accepted_qty`, `rejected_qty`, `unit_cost`, `mrp`, `quality_status` | Warehouse via Procurement owner owns these writes; Warehouse via Procurement receiving owner must invoke that narrow owner command. |
| [`procurement.goods_receipt_quality_checks`](../../04-Database/Tables/procurement/goods_receipt_quality_checks.md) | Create/update evidence | `goods_receipt_item_id`, `check_type`, `checked_at`, `checked_by_user_id`, `result`, `observations` | Warehouse via Procurement owner owns these writes; Warehouse via Procurement receiving owner must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.purchaseOrderId | procurement.goods_receipts.purchase_order_id |
| request.warehouseId | warehouse.warehouses.id |
| request.supplierInvoiceId | procurement.goods_receipts.supplier_invoice_id |
| request.items[].purchaseOrderItemId | procurement.goods_receipt_items.purchase_order_item_id |
| request.items[].batchNumber | procurement.goods_receipt_items.batch_number |
| request.items[].expiryDate | procurement.goods_receipt_items.expiry_date |
| request.items[].receivedQuantity | procurement.goods_receipt_items.received_qty |
| request.items[].acceptedQuantity | procurement.goods_receipt_items.accepted_qty |
| request.items[].rejectedQuantity | procurement.goods_receipt_items.rejected_qty |
| request.items[].unitCost | procurement.goods_receipt_items.unit_cost |
| request.items[].mrp | procurement.goods_receipt_items.mrp |
| request.items[].qualityResult | procurement.goods_receipt_items.quality_status |
| data.receiptId | procurement.goods_receipts.id |
| data.grnNumber | procurement.goods_receipts.grn_number |
| data.purchaseOrderId | procurement.goods_receipts.purchase_order_id |
| data.warehouseId | procurement.goods_receipts.warehouse_id |
| data.status | procurement.goods_receipts.status |
| data.receivedAt | procurement.goods_receipts.received_at |
| data.rowVersion | procurement.goods_receipts.row_version |

**Transaction:** Receiving evidence/quality checks commit under Procurement owner command plus outbox. Inventory creates lots/balance/physical receipt ledger in a separate idempotent transaction; only that committed evidence permits availability. Failure leaves receipt awaiting stock processing. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md), [`procurement.suppliers`](../../04-Database/Tables/procurement/suppliers.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | accepted+rejected equals actual received; batch/date/PO/site must match and overreceipt is blocked unless approved separately. Damaged/quarantined stock is not automatically orderable. Preserve supplier-invoice discrepancies. |
| Idempotency | Required key: scope actor + API-056 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Invalid item rolls back the receipt batch. After commit Inventory processes only approved accepted stock, deduplicated by receipt item ID; provider invoice is never silently changed. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-056-HAPPY` | Valid Warehouse Receiver context and documented fixture for record supplier batch receipt and quality evidence before stock credit. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-056-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-056-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-056-SCOPE` | Use another customer/site/patient/task reference or remove warehouse.receipts.create. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-056-RULE` | accepted+rejected equals actual received; batch/date/PO/site must match and overreceipt is blocked unless approved separately. Damaged/quarantined stock is not automatically orderable. Preserve supplier-invoice discrepancies. | Invalid item rolls back the receipt batch. After commit Inventory processes only approved accepted stock, deduplicated by receipt item ID; provider invoice is never silently changed. |
| `CT-API-056-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-056-CONCURRENCY` | Race two record supplier batch receipt and quality evidence before stock credit. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-056-STATE` | Apply command after Invalid item rolls back the receipt batch. After commit Inventory processes only approved accepted stock, deduplicated by receipt item ID; provider invoice is never silently changed. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-056-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Invalid item rolls back the receipt batch. After commit Inventory processes only approved accepted stock, deduplicated by receipt item ID; provider invoice is never silently changed. |

Existing feature assertions: `TC-WH-01-OK`, `TC-WH-01-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-057 — GET `/v1/staff/warehouse/replenishments`

**List pending replenishment requests for warehouse review.**

| Property | Proposed contract |
| --- | --- |
| API name | List pending replenishment requests for warehouse review |
| Version / owner | v1 / Warehouse |
| Consumer | Warehouse Supervisor |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `WH-02`; [WF-014](../../06-Workflows/WF-014-Supplier-Receiving.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/warehouse/replenishments` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Warehouse Supervisor | warehouse.replenishment.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Warehouse staff sees only permitted destination requisitions; list does not approve purchase or issue stock.

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
| warehouseId | string (uuid) | Optional | No | None | format="uuid" | Optional allowlisted filter; does not widen authenticated scope. |


Only declared query fields are accepted. Sorting is fixed: `created_at ASC, id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `ReplenishmentListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `requisitions` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `requisitions[].requisitionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | procurement.purchase_requisitions.id; uuid. |
| `requisitions[].requisitionNumber` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | procurement.purchase_requisitions.requisition_number; character varying(64). |
| `requisitions[].warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | procurement.purchase_requisitions.warehouse_id; uuid. |
| `requisitions[].status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | procurement.purchase_requisitions.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "requisitions": [
      {
        "requisitionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "requisitionNumber": "REQ-DEMO-0001",
        "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "status": "draft"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-057. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks warehouse.replenishment.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-057 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`procurement.purchase_requisitions`](../../04-Database/Tables/procurement/purchase_requisitions.md) | Read | `id`, `requisition_number`, `row_version`, `status`, `warehouse_id` | Warehouse via Procurement owner projection / scoped joins; reading does not grant writes. |
| [`procurement.purchase_requisition_items`](../../04-Database/Tables/procurement/purchase_requisition_items.md) | Read | `id`, `requisition_id`, `row_version` | Warehouse via Procurement owner projection / scoped joins; reading does not grant writes. |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | Read | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | Warehouse projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.requisitions[].requisitionId | procurement.purchase_requisitions.id |
| data.requisitions[].requisitionNumber | procurement.purchase_requisitions.requisition_number |
| data.requisitions[].warehouseId | procurement.purchase_requisitions.warehouse_id |
| data.requisitions[].status | procurement.purchase_requisitions.status |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Warehouse staff sees only permitted destination requisitions; list does not approve purchase or issue stock. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; created_at ASC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. An empty queue is valid; missing site scope is denied. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-057-HAPPY` | Valid Warehouse Supervisor context and documented fixture for list pending replenishment requests for warehouse review. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-057-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-057-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-057-SCOPE` | Use another customer/site/patient/task reference or remove warehouse.replenishment.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-057-RULE` | Warehouse staff sees only permitted destination requisitions; list does not approve purchase or issue stock. | An empty queue is valid; missing site scope is denied. |
| `CT-API-057-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-057-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-057-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-057-RECOVERY` | Dependency timeout during list pending replenishment requests for warehouse review. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-WH-02-OK`, `TC-WH-02-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-058 — POST `/v1/staff/warehouse/transfers/{transfer_id}/dispatch`

**Dispatch an approved physical inter-site transfer once.**

| Property | Proposed contract |
| --- | --- |
| API name | Dispatch an approved physical inter-site transfer once |
| Version / owner | v1 / Warehouse |
| Consumer | Warehouse Dispatcher |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `WH-02`; [WF-014](../../06-Workflows/WF-014-Supplier-Receiving.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/warehouse/transfers/{transfer_id}/dispatch` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Warehouse Dispatcher | warehouse.transfer.dispatch (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Source staff only, approved transfer and eligible lots. Validate dispatched quantities against requested and actual available stock. Inventory owns source movement; Warehouse cannot directly replace balances.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-058_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| transfer_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `TransferDispatchRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedTransferVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `items` | array<object> | Required | No | None (not silently populated) | minItems=1; maxItems=100 | Nested typed projection. |
| `items[].transferItemId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.stock_transfer_items.id. Ownership and current-state checks apply before use. |
| `items[].quantity` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(?=.*[1-9])[0-9]{1,13}(\\.[0-9]{1,3})?$" | Increment requested dispatch quantity; cannot exceed requested and available source quantity. |
| `items[].expectedLotVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |


```json
{
  "expectedTransferVersion": 4,
  "items": [
    {
      "transferItemId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "quantity": "2.000",
      "expectedLotVersion": 4
    }
  ]
}
```

File upload: **Not Applicable**.

### Success response

HTTP **202**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `TransferData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `transferId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | warehouse.stock_transfers.id; uuid. |
| `transferNumber` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | warehouse.stock_transfers.transfer_number; character varying(64). |
| `sourceWarehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | warehouse.stock_transfers.source_warehouse_id; uuid. |
| `destinationWarehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | warehouse.stock_transfers.destination_warehouse_id; uuid. |
| `status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | warehouse.stock_transfers.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |
| `dispatchedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | warehouse.stock_transfers.dispatched_at; timestamp with time zone. |
| `receivedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | warehouse.stock_transfers.received_at; timestamp with time zone. |
| `rowVersion` | integer | Required | No | None (not silently populated) | minimum=0 | warehouse.stock_transfers.row_version; bigint. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "transferId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "transferNumber": "TRF-DEMO-0001",
    "sourceWarehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "destinationWarehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "status": "dispatched",
    "dispatchedAt": null,
    "receivedAt": null,
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-058. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks warehouse.transfer.dispatch or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for dispatch an approved physical inter-site transfer once. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Source staff only, approved transfer and eligible lots. Validate dispatched quantities against requested and actual available stock. Inventory owns source movement; Warehouse cannot directly replace balances. | No unauthorized/partial domain effect; redact sensitive context. | A source shortage leaves dispatch unaccepted. Replay resumes Inventory movement by transfer/item identity without issuing stock twice. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current dispatch an approved physical inter-site transfer once. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | A source shortage leaves dispatch unaccepted. Replay resumes Inventory movement by transfer/item identity without issuing stock twice. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-058 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`warehouse.stock_transfers`](../../04-Database/Tables/warehouse/stock_transfers.md) | Read | `destination_warehouse_id`, `dispatched_at`, `id`, `received_at`, `row_version`, `source_warehouse_id`, `status`, `transfer_number` | Warehouse projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_transfer_items`](../../04-Database/Tables/warehouse/stock_transfer_items.md) | Read | `dispatched_qty`, `id`, `lot_id`, `row_version`, `transfer_id` | Warehouse projection / scoped joins; reading does not grant writes. |
| [`warehouse.inventory_lots`](../../04-Database/Tables/warehouse/inventory_lots.md) | Read | `batch_number`, `expires_at`, `id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | Read | `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `lot_id`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`organization.licenses`](../../04-Database/Tables/organization/licenses.md) | Read | `expires_at`, `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `verification_status` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_transfers`](../../04-Database/Tables/warehouse/stock_transfers.md) | Create/update evidence | `status`, `dispatched_at` | Warehouse owns these writes; Warehouse must invoke that narrow owner command. |
| [`warehouse.stock_transfer_items`](../../04-Database/Tables/warehouse/stock_transfer_items.md) | Create/update evidence | `dispatched_qty` | Warehouse owns these writes; Warehouse must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedTransferVersion | warehouse.stock_transfers.row_version |
| request.items[].transferItemId | warehouse.stock_transfer_items.id |
| request.items[].quantity | warehouse.stock_transfer_items.dispatched_qty |
| request.items[].expectedLotVersion | warehouse.inventory_lots.row_version |
| data.transferId | warehouse.stock_transfers.id |
| data.transferNumber | warehouse.stock_transfers.transfer_number |
| data.sourceWarehouseId | warehouse.stock_transfers.source_warehouse_id |
| data.destinationWarehouseId | warehouse.stock_transfers.destination_warehouse_id |
| data.status | warehouse.stock_transfers.status |
| data.dispatchedAt | warehouse.stock_transfers.dispatched_at |
| data.receivedAt | warehouse.stock_transfers.received_at |
| data.rowVersion | warehouse.stock_transfers.row_version |

**Transaction:** Warehouse records dispatch intent/outbox; Inventory atomically applies source movement/ledger then Warehouse finalizes dispatched_at/status from committed movement. Return 202 while owner coordination is pending. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md), [`procurement.suppliers`](../../04-Database/Tables/procurement/suppliers.md), [`warehouse.bins`](../../04-Database/Tables/warehouse/bins.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Source staff only, approved transfer and eligible lots. Validate dispatched quantities against requested and actual available stock. Inventory owns source movement; Warehouse cannot directly replace balances. |
| Idempotency | Required key: scope actor + API-058 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. A source shortage leaves dispatch unaccepted. Replay resumes Inventory movement by transfer/item identity without issuing stock twice. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-058-HAPPY` | Valid Warehouse Dispatcher context and documented fixture for dispatch an approved physical inter-site transfer once. | HTTP 202; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-058-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-058-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-058-SCOPE` | Use another customer/site/patient/task reference or remove warehouse.transfer.dispatch. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-058-RULE` | Source staff only, approved transfer and eligible lots. Validate dispatched quantities against requested and actual available stock. Inventory owns source movement; Warehouse cannot directly replace balances. | A source shortage leaves dispatch unaccepted. Replay resumes Inventory movement by transfer/item identity without issuing stock twice. |
| `CT-API-058-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-058-CONCURRENCY` | Race two dispatch an approved physical inter-site transfer once. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-058-STATE` | Apply command after A source shortage leaves dispatch unaccepted. Replay resumes Inventory movement by transfer/item identity without issuing stock twice. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-058-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. A source shortage leaves dispatch unaccepted. Replay resumes Inventory movement by transfer/item identity without issuing stock twice. |

Existing feature assertions: `TC-WH-02-OK`, `TC-WH-02-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-059 — GET `/v1/staff/warehouse/fallback-orders`

**List eligible orders needing warehouse fallback consideration.**

| Property | Proposed contract |
| --- | --- |
| API name | List eligible orders needing warehouse fallback consideration |
| Version / owner | v1 / Warehouse |
| Consumer | Warehouse Supervisor / Order Operator |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `WH-04`; [WF-006](../../06-Workflows/WF-006-Licensed-Site-Allocation.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/warehouse/fallback-orders` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Warehouse Supervisor / Order Operator | warehouse.fallback.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Queue contains unallocated in-scope orders only; warehouse fallback is disabled until D-002/D-010 approve scope. Listing is not an allocation bypass.

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
| warehouseId | string (uuid) | Optional | No | None | format="uuid" | Optional allowlisted filter; does not widen authenticated scope. |


Only declared query fields are accepted. Sorting is fixed: `placed_at ASC, id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `OrderListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-059. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks warehouse.fallback.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-059 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `currency`, `current_revision_id`, `fulfillment_status`, `grand_total`, `id`, `internal_id`, `order_number`, `patient_profile_id`, `payment_status`, `placed_at`, `prescription_status`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | Read | `id`, `order_id`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_allocations`](../../04-Database/Tables/commerce/order_allocations.md) | Read | `id`, `order_item_id`, `row_version`, `status`, `warehouse_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | Read | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | Warehouse projection / scoped joins; reading does not grant writes. |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | Read | `id`, `is_active`, `is_deleted`, `organization_id`, `row_version` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |

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

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../../04-Database/Tables/marketplace/sellers.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Queue contains unallocated in-scope orders only; warehouse fallback is disabled until D-002/D-010 approve scope. Listing is not an allocation bypass. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; placed_at ASC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Disabled fallback returns a configured policy error, not silent split shipment. Allocation still uses API-041. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-059-HAPPY` | Valid Warehouse Supervisor / Order Operator context and documented fixture for list eligible orders needing warehouse fallback consideration. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-059-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-059-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-059-SCOPE` | Use another customer/site/patient/task reference or remove warehouse.fallback.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-059-RULE` | Queue contains unallocated in-scope orders only; warehouse fallback is disabled until D-002/D-010 approve scope. Listing is not an allocation bypass. | Disabled fallback returns a configured policy error, not silent split shipment. Allocation still uses API-041. |
| `CT-API-059-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-059-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-059-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-059-RECOVERY` | Dependency timeout during list eligible orders needing warehouse fallback consideration. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-WH-04-OK`, `TC-WH-04-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
