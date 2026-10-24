# Inventory API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](../../05-APIs/API-Contract-Coverage.md) · [OpenAPI 3.1](../../05-APIs/openapi.yaml) · [decisions](../../05-APIs/Planning-Decisions.md) · [DTO conventions](../../05-APIs/API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="inventory-api-contracts"></a>
<a id="api-050--get-v1staffinventory"></a>
<a id="caller-permissions-and-dependencies"></a>
<a id="http-request-contract"></a>
<a id="success-response-illustrative"></a>
<a id="errors-concurrency-and-failure-recovery"></a>
<a id="required-verification"></a>
<a id="api-051--post-v1staffinventoryobservations"></a>
<a id="caller-permissions-and-dependencies-1"></a>
<a id="http-request-contract-1"></a>
<a id="success-response-illustrative-1"></a>
<a id="errors-concurrency-and-failure-recovery-1"></a>
<a id="required-verification-1"></a>
<a id="api-052--post-v1internalinventoryreservations"></a>
<a id="caller-permissions-and-dependencies-2"></a>
<a id="http-request-contract-2"></a>
<a id="success-response-illustrative-2"></a>
<a id="errors-concurrency-and-failure-recovery-2"></a>
<a id="required-verification-2"></a>
<a id="api-053--post-v1internalinventoryreservationsreservation_idrelease"></a>
<a id="caller-permissions-and-dependencies-3"></a>
<a id="http-request-contract-3"></a>
<a id="success-response-illustrative-3"></a>
<a id="errors-concurrency-and-failure-recovery-3"></a>
<a id="required-verification-3"></a>
<a id="api-054--post-v1staffinventoryadjustments"></a>
<a id="caller-permissions-and-dependencies-4"></a>
<a id="http-request-contract-4"></a>
<a id="success-response-illustrative-4"></a>
<a id="errors-concurrency-and-failure-recovery-4"></a>
<a id="required-verification-4"></a>
<a id="api-055--get-v1staffinventoryalerts"></a>
<a id="caller-permissions-and-dependencies-5"></a>
<a id="http-request-contract-5"></a>
<a id="success-response-illustrative-5"></a>
<a id="errors-concurrency-and-failure-recovery-5"></a>
<a id="required-verification-5"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-050 | `GET /v1/staff/inventory` | Inspect batch/bin stock within authorized warehouse scope. | Complete proposed |
| API-051 | `POST /v1/staff/inventory/observations` | Validate and ingest authoritative stock observation evidence. | Incomplete — D-005: source authentication, exact quantities-to-ledger reconciliation and atomic batch outcome are unspecified; timestamps alone are not sufficient evidence. |
| API-052 | `POST /v1/internal/inventory/reservations` | Atomically reserve every eligible accepted order item at one site. | Complete proposed |
| API-053 | `POST /v1/internal/inventory/reservations/{reservation_id}/release` | Release one unused active reservation exactly once. | Complete proposed |
| API-054 | `POST /v1/staff/inventory/adjustments` | Request a reasoned stock adjustment for investigated discrepancies. | Complete proposed |
| API-055 | `GET /v1/staff/inventory/alerts` | List derived stock alerts requiring operator attention. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| INV-01 | Stock per location and batch, with manufacturing and expiry dates | API-050, API-052 |
| INV-02 | Stock ledger: every movement recorded; stock is the sum of the ledger | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| INV-03 | Allocate nearest-expiry batch first; block batches below minimum shelf life | API-052 |
| INV-04 | Stock adjustments with reason; manager approval above a threshold | API-054 |
| INV-05 | Low-stock and near-expiry alerts | API-055 |
| INV-06 | Opening stock import per location | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| INV-07 | Stock sync with Techsmith | API-051 |

## API-050 — GET `/v1/staff/inventory`

**Inspect batch/bin stock within authorized warehouse scope.**

| Property | Proposed contract |
| --- | --- |
| API name | Inspect batch/bin stock within authorized warehouse scope |
| Version / owner | v1 / Inventory |
| Consumer | Inventory Operator |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `INV-01`; [WF-011](../../06-Workflows/WF-011-Inventory-Reconciliation.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/inventory` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Inventory Operator | inventory.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Do not equate on_hand with available: reserved, damaged, quarantined, expiry and source freshness restrict selling.

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
| offset | integer | Optional | No | 0 | minimum=0; maximum=100000 | Optional allowlisted filter; does not widen authenticated scope. |
| warehouseId | string (uuid) | Required | No | None | format="uuid" | Optional allowlisted filter; does not widen authenticated scope. |
| productId | string (uuid) | Optional | No | None | format="uuid" | Optional allowlisted filter; does not widen authenticated scope. |


Only declared query fields are accepted. Sorting is fixed: `warehouse_id ASC, lot_id ASC, bin_id ASC, id ASC`. Pagination: offset.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `StockListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `balances` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `balances[].balanceId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | warehouse.stock_balances.id; uuid. |
| `balances[].warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | warehouse.stock_balances.warehouse_id; uuid. |
| `balances[].lotId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | warehouse.stock_balances.lot_id; uuid. |
| `balances[].binId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | warehouse.stock_balances.bin_id; uuid. |
| `balances[].onHandQty` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,13}(\\.[0-9]{1,3})?$" | warehouse.stock_balances.on_hand_qty; numeric(16,3). |
| `balances[].reservedQty` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,13}(\\.[0-9]{1,3})?$" | warehouse.stock_balances.reserved_qty; numeric(16,3). |
| `balances[].damagedQty` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,13}(\\.[0-9]{1,3})?$" | warehouse.stock_balances.damaged_qty; numeric(16,3). |
| `balances[].quarantinedQty` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,13}(\\.[0-9]{1,3})?$" | warehouse.stock_balances.quarantined_qty; numeric(16,3). |
| `balances[].observedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | warehouse.stock_balances.inventory_observed_at; timestamp with time zone. |
| `balances[].rowVersion` | integer | Required | No | None (not silently populated) | minimum=0 | warehouse.stock_balances.row_version; bigint. |


Pagination metadata: `totalCount: integer ≥0`, `limit: integer 1–100`, `offset: integer 0–100000`, `hasNext: boolean`. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "balances": [
      {
        "balanceId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "lotId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "binId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "onHandQty": "2.000",
        "reservedQty": "2.000",
        "damagedQty": "2.000",
        "quarantinedQty": "2.000",
        "observedAt": null,
        "rowVersion": 1
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-050. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks inventory.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-050 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | Read | `bin_id`, `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `lot_id`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.inventory_lots`](../../04-Database/Tables/warehouse/inventory_lots.md) | Read | `batch_number`, `expires_at`, `id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | Read | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | Warehouse projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.balances[].balanceId | warehouse.stock_balances.id |
| data.balances[].warehouseId | warehouse.stock_balances.warehouse_id |
| data.balances[].lotId | warehouse.stock_balances.lot_id |
| data.balances[].binId | warehouse.stock_balances.bin_id |
| data.balances[].onHandQty | warehouse.stock_balances.on_hand_qty |
| data.balances[].reservedQty | warehouse.stock_balances.reserved_qty |
| data.balances[].damagedQty | warehouse.stock_balances.damaged_qty |
| data.balances[].quarantinedQty | warehouse.stock_balances.quarantined_qty |
| data.balances[].observedAt | warehouse.stock_balances.inventory_observed_at |
| data.balances[].rowVersion | warehouse.stock_balances.row_version |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md), [`procurement.suppliers`](../../04-Database/Tables/procurement/suppliers.md), [`warehouse.bins`](../../04-Database/Tables/warehouse/bins.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Do not equate on_hand with available: reserved, damaged, quarantined, expiry and source freshness restrict selling. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | offset; warehouse_id ASC, lot_id ASC, bin_id ASC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Unknown/stale observation remains visible as null/old observedAt and cannot authorize a new hold. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-050-HAPPY` | Valid Inventory Operator context and documented fixture for inspect batch/bin stock within authorized warehouse scope. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-050-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-050-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-050-SCOPE` | Use another customer/site/patient/task reference or remove inventory.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-050-RULE` | Do not equate on_hand with available: reserved, damaged, quarantined, expiry and source freshness restrict selling. | Unknown/stale observation remains visible as null/old observedAt and cannot authorize a new hold. |
| `CT-API-050-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-050-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-050-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-050-RECOVERY` | Dependency timeout during inspect batch/bin stock within authorized warehouse scope. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-INV-01-OK`, `TC-INV-01-DENY`, `TC-INV-01-01`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-051 — POST `/v1/staff/inventory/observations`

**Validate and ingest authoritative stock observation evidence.**

| Property | Proposed contract |
| --- | --- |
| API name | Validate and ingest authoritative stock observation evidence |
| Version / owner | v1 / Inventory |
| Consumer | Inventory Integration Operator / approved POS service |
| Status | Documentation Incomplete; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `INV-07`; [WF-011](../../06-Workflows/WF-011-Inventory-Reconciliation.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/inventory/observations` (placeholder host from existing OpenAPI; no deployment asserted) |


**Remaining contract gap:** D-005: source authentication, exact quantities-to-ledger reconciliation and atomic batch outcome are unspecified; timestamps alone are not sufficient evidence.

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Inventory Integration Operator / approved POS service | inventory.observation.ingest (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Never replace physical/ledger quantities from an unreviewed POS feed. Source must be allowlisted, observation newer than prior evidence and site identity verified.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-051_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `StockObservationRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.warehouses.id. Ownership and current-state checks apply before use. |
| `source` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | Approved authoritative feed identifier. |
| `observedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | Typed observedAt projection; resolved by Validate and ingest authoritative stock observation evidence. |
| `items` | array<object> | Required | No | None (not silently populated) | minItems=1; maxItems=100 | Nested typed projection. |
| `items[].balanceId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.stock_balances.id. Ownership and current-state checks apply before use. |
| `items[].expectedVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `items[].onHandQuantity` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(?=.*[1-9])[0-9]{1,13}(\\.[0-9]{1,3})?$" | Positive decimal quantity, up to three fractional digits. |


```json
{
  "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "source": "customer_web",
  "observedAt": "2026-10-24T10:30:00Z",
  "items": [
    {
      "balanceId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "expectedVersion": 4,
      "onHandQuantity": "2.000"
    }
  ]
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `StockObservationData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `acceptedCount` | integer | Required | No | None (not silently populated) | minimum=0 | Derived accepted observation count; atomicity remains blocked by D-005. |
| `rejectedCount` | integer | Required | No | None (not silently populated) | minimum=0 | Derived rejected observation count; atomicity remains blocked by D-005. |
| `observedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | Typed observedAt projection; resolved by Validate and ingest authoritative stock observation evidence. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "acceptedCount": 1,
    "rejectedCount": 1,
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
| 422 | `REQUEST_VALIDATION_ERROR` | A declared body/path/query field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-051. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks inventory.observation.ingest or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for validate and ingest authoritative stock observation evidence. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Never replace physical/ledger quantities from an unreviewed POS feed. Source must be allowlisted, observation newer than prior evidence and site identity verified. | No unauthorized/partial domain effect; redact sensitive context. | Old/unsigned feed is rejected without refreshing stock freshness. Discrepancies require explicit adjustment/reconciliation. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current validate and ingest authoritative stock observation evidence. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Old/unsigned feed is rejected without refreshing stock freshness. Discrepancies require explicit adjustment/reconciliation. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-051 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | Read | `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `lot_id`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.inventory_lots`](../../04-Database/Tables/warehouse/inventory_lots.md) | Read | `batch_number`, `expires_at`, `id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | Read | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | Warehouse projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | Create/update evidence | `inventory_source`, `inventory_observed_at`, `inventory_observed_by_user_id` | Inventory owns these writes; Inventory must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.warehouseId | warehouse.warehouses.id |
| request.source | Approved authoritative feed identifier. |
| request.observedAt | Typed observedAt projection; resolved by Validate and ingest authoritative stock observation evidence. |
| request.items[].balanceId | warehouse.stock_balances.id |
| request.items[].expectedVersion | Expected current row_version; compare atomically. |
| request.items[].onHandQuantity | Positive decimal quantity, up to three fractional digits. |
| data.acceptedCount | Derived accepted observation count; atomicity remains blocked by D-005. |
| data.rejectedCount | Derived rejected observation count; atomicity remains blocked by D-005. |
| data.observedAt | Typed observedAt projection; resolved by Validate and ingest authoritative stock observation evidence. |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md), [`procurement.suppliers`](../../04-Database/Tables/procurement/suppliers.md), [`warehouse.bins`](../../04-Database/Tables/warehouse/bins.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Never replace physical/ledger quantities from an unreviewed POS feed. Source must be allowlisted, observation newer than prior evidence and site identity verified. |
| Idempotency | Required key: scope actor + API-051 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Old/unsigned feed is rejected without refreshing stock freshness. Discrepancies require explicit adjustment/reconciliation. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-051-HAPPY` | Valid Inventory Integration Operator / approved POS service context and documented fixture for validate and ingest authoritative stock observation evidence. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-051-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-051-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-051-SCOPE` | Use another customer/site/patient/task reference or remove inventory.observation.ingest. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-051-RULE` | Never replace physical/ledger quantities from an unreviewed POS feed. Source must be allowlisted, observation newer than prior evidence and site identity verified. | Old/unsigned feed is rejected without refreshing stock freshness. Discrepancies require explicit adjustment/reconciliation. |
| `CT-API-051-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-051-CONCURRENCY` | Race two validate and ingest authoritative stock observation evidence. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-051-STATE` | Apply command after Old/unsigned feed is rejected without refreshing stock freshness. Discrepancies require explicit adjustment/reconciliation. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-051-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Old/unsigned feed is rejected without refreshing stock freshness. Discrepancies require explicit adjustment/reconciliation. |

Existing feature assertions: `TC-INV-07-OK`, `TC-INV-07-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-052 — POST `/v1/internal/inventory/reservations`

**Atomically reserve every eligible accepted order item at one site.**

| Property | Proposed contract |
| --- | --- |
| API name | Atomically reserve every eligible accepted order item at one site |
| Version / owner | v1 / Inventory |
| Consumer | Internal Checkout / Order Operations workload |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `CHK-08`, `INV-01`, `INV-03`; [WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/internal/inventory/reservations` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | Service Identity | Internal Checkout / Order Operations workload | inventory.reservations.create (Proposed grant code) |


Authenticate a private-ingress workload identity with the exact inventory.reservations.create capability. Constrain its allowed organization/location/aggregate context on the server and validate every referenced resource; a caller-provided actor or service name grants no authority. Workload identity does not require a human staff session/membership.

Trusted Inventory capability only. Derive exact accepted quantities and eligible FEFO lots; recheck current P decisions, source freshness, recall/expiry/license policy and stock holds. Lock balance IDs deterministically; reserve all lines or none. Holds and reservations remain distinct records.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-052_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `ReservationRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.orders.id. Ownership and current-state checks apply before use. |
| `orderRevisionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.order_revisions.id. Ownership and current-state checks apply before use. |
| `warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.warehouses.id. Ownership and current-state checks apply before use. |
| `expectedOrderVersion` | integer | Required | No | None (not silently populated) | minimum=1 | commerce.orders.row_version. |


```json
{
  "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "orderRevisionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "expectedOrderVersion": 1
}
```

File upload: **Not Applicable**.

### Success response

HTTP **201**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `ReservationData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.orders.id. Ownership and current-state checks apply before use. |
| `orderRevisionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.order_revisions.id. Ownership and current-state checks apply before use. |
| `warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.warehouses.id. Ownership and current-state checks apply before use. |
| `reservations` | array<object> | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `reservations[].reservationId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.stock_reservations.id. Ownership and current-state checks apply before use. |
| `reservations[].reservationNumber` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from warehouse.stock_reservations.reservation_number. Ownership and current-state checks apply before use. |
| `reservations[].orderItemId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.order_items.id. Ownership and current-state checks apply before use. |
| `reservations[].lotId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.stock_reservations.lot_id. Ownership and current-state checks apply before use. |
| `reservations[].warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.warehouses.id. Ownership and current-state checks apply before use. |
| `reservations[].quantity` | string | Required | No | None (not silently populated) | pattern="^[0-9]+(\\.[0-9]{1,3})?$" | Public DTO value from warehouse.stock_reservations.quantity. Ownership and current-state checks apply before use. |
| `reservations[].status` | string | Required | No | None (not silently populated) | enum=["active", "committed", "released", "expired", "cancelled"] | Public DTO value from warehouse.stock_reservations.status. Ownership and current-state checks apply before use. |
| `reservations[].expiresAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | Public DTO value from warehouse.stock_reservations.expires_at. Ownership and current-state checks apply before use. |
| `reservations[].rowVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Public DTO value from warehouse.stock_reservations.row_version. Ownership and current-state checks apply before use. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "orderRevisionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "reservations": [
      {
        "reservationId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "reservationNumber": "RSV-DEMO-0001",
        "orderItemId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "lotId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "quantity": "2.000",
        "status": "active",
        "expiresAt": "2026-10-24T10:40:00Z",
        "rowVersion": 1
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked Service Identity credential for API-052. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Workload lacks the required capability or the target is outside its authorized organization/location/aggregate scope. | No trusted effect or hidden-resource disclosure. | Correct the reviewed provider/workload scope. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for atomically reserve every eligible accepted order item at one site. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Trusted Inventory capability only. Derive exact accepted quantities and eligible FEFO lots; recheck current P decisions, source freshness, recall/expiry/license policy and stock holds. Lock balance IDs deterministically; reserve all lines or none. Holds and reservations remain distinct records. | No unauthorized/partial domain effect; redact sensitive context. | Last-unit contention permits at most one winner. Stale source or expired revision leaves no new reservation. Expiry/commit races use current versions and never restore stock twice. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current atomically reserve every eligible accepted order item at one site. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Last-unit contention permits at most one winner. Stale source or expired revision leaves no new reservation. Expiry/commit races use current versions and never restore stock twice. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-052 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `internal_id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_items`](../../04-Database/Tables/commerce/order_items.md) | Read | `id`, `order_id`, `prescription_id`, `product_id`, `row_version`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | Read | `id`, `order_id`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Read | `id`, `is_deleted`, `row_version`, `status` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | Read | `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `lot_id`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.inventory_lots`](../../04-Database/Tables/warehouse/inventory_lots.md) | Read | `batch_number`, `expires_at`, `id`, `product_id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_reservations`](../../04-Database/Tables/warehouse/stock_reservations.md) | Read | `expires_at`, `id`, `lot_id`, `order_id`, `order_item_id`, `order_revision_id`, `quantity`, `reservation_number`, `row_version`, `status`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_holds`](../../04-Database/Tables/warehouse/stock_holds.md) | Read | `id`, `lot_id`, `row_version`, `status`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | Read | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | Warehouse projection / scoped joins; reading does not grant writes. |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | Read | `id`, `is_active`, `is_deleted`, `organization_id`, `row_version` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`organization.licenses`](../../04-Database/Tables/organization/licenses.md) | Read | `expires_at`, `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `verification_status` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | Read | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | Read | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `review_id`, `row_version` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_reservations`](../../04-Database/Tables/warehouse/stock_reservations.md) | Create/update evidence | `reservation_number`, `order_id`, `order_item_id`, `order_revision_id`, `warehouse_id`, `lot_id`, `bin_id`, `quantity`, `status`, `expires_at` | Inventory owns these writes; Inventory must invoke that narrow owner command. |
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | Create/update evidence | `reserved_qty` | Inventory owns these writes; Inventory must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.orderId | commerce.orders.id |
| request.orderRevisionId | commerce.order_revisions.id |
| request.warehouseId | warehouse.warehouses.id |
| request.expectedOrderVersion | commerce.orders.row_version |
| data.orderId | commerce.orders.id |
| data.orderRevisionId | commerce.order_revisions.id |
| data.warehouseId | warehouse.warehouses.id |
| data.reservations[].reservationId | warehouse.stock_reservations.id |
| data.reservations[].reservationNumber | warehouse.stock_reservations.reservation_number |
| data.reservations[].orderItemId | commerce.order_items.id |
| data.reservations[].lotId | warehouse.stock_reservations.lot_id |
| data.reservations[].warehouseId | warehouse.warehouses.id |
| data.reservations[].quantity | warehouse.stock_reservations.quantity |
| data.reservations[].status | warehouse.stock_reservations.status |
| data.reservations[].expiresAt | warehouse.stock_reservations.expires_at |
| data.reservations[].rowVersion | warehouse.stock_reservations.row_version |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.brands`](../../04-Database/Tables/catalog/brands.md), [`catalog.categories`](../../04-Database/Tables/catalog/categories.md), [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md), [`catalog.dosage_forms`](../../04-Database/Tables/catalog/dosage_forms.md), [`catalog.manufacturers`](../../04-Database/Tables/catalog/manufacturers.md), [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`clinical.review_reason_codes`](../../04-Database/Tables/clinical/review_reason_codes.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../../04-Database/Tables/marketplace/sellers.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md), [`procurement.suppliers`](../../04-Database/Tables/procurement/suppliers.md), [`warehouse.bins`](../../04-Database/Tables/warehouse/bins.md), [`warehouse.stock_movement_reason_codes`](../../04-Database/Tables/warehouse/stock_movement_reason_codes.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Trusted Inventory capability only. Derive exact accepted quantities and eligible FEFO lots; recheck current P decisions, source freshness, recall/expiry/license policy and stock holds. Lock balance IDs deterministically; reserve all lines or none. Holds and reservations remain distinct records. |
| Idempotency | Required key: scope actor + API-052 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Last-unit contention permits at most one winner. Stale source or expired revision leaves no new reservation. Expiry/commit races use current versions and never restore stock twice. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-052-HAPPY` | Valid Internal Checkout / Order Operations workload context and documented fixture for atomically reserve every eligible accepted order item at one site. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-052-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-052-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-052-SCOPE` | Use another customer/site/patient/task reference or remove inventory.reservations.create. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-052-RULE` | Trusted Inventory capability only. Derive exact accepted quantities and eligible FEFO lots; recheck current P decisions, source freshness, recall/expiry/license policy and stock holds. Lock balance IDs deterministically; reserve all lines or none. Holds and reservations remain distinct records. | Last-unit contention permits at most one winner. Stale source or expired revision leaves no new reservation. Expiry/commit races use current versions and never restore stock twice. |
| `CT-API-052-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-052-CONCURRENCY` | Race two atomically reserve every eligible accepted order item at one site. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-052-STATE` | Apply command after Last-unit contention permits at most one winner. Stale source or expired revision leaves no new reservation. Expiry/commit races use current versions and never restore stock twice. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-052-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Last-unit contention permits at most one winner. Stale source or expired revision leaves no new reservation. Expiry/commit races use current versions and never restore stock twice. |

Existing feature assertions: `TC-CHK-08-OK`, `TC-CHK-08-DENY`, `TC-CHK-08-01`, `TC-INV-01-OK`, `TC-INV-01-DENY`, `TC-INV-01-01`, `TC-INV-03-OK`, `TC-INV-03-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-053 — POST `/v1/internal/inventory/reservations/{reservation_id}/release`

**Release one unused active reservation exactly once.**

| Property | Proposed contract |
| --- | --- |
| API name | Release one unused active reservation exactly once |
| Version / owner | v1 / Inventory |
| Consumer | Internal Order Operations / reservation-expiry workload |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `CHK-08`; [WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/internal/inventory/reservations/{reservation_id}/release` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | Service Identity | Internal Order Operations / reservation-expiry workload | inventory.reservations.release (Proposed grant code) |


Authenticate a private-ingress workload identity with the exact inventory.reservations.release capability. Constrain its allowed organization/location/aggregate context on the server and validate every referenced resource; a caller-provided actor or service name grants no authority. Workload identity does not require a human staff session/membership.

Compare reservationVersion and current active state. Decrement reserved_qty only, never increment physical on_hand. reasonCode belongs to audit release metadata; no invented reason_code column on reservations and no physical movement is posted merely for release.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-053_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| reservation_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `ReservationReleaseRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `reservationVersion` | integer | Required | No | None (not silently populated) | minimum=1 | warehouse.stock_reservations.row_version. |
| `reasonCode` | string | Required | No | None (not silently populated) | minLength=1 | Approved operational reason retained in platform.audit_logs.metadata_json.reasonCode; no reservation reason column or physical stock movement is invented. |


```json
{
  "reservationVersion": 1,
  "reasonCode": "CUSTOMER_REQUEST"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `ReservationReleaseData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `reservationId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.stock_reservations.id. Ownership and current-state checks apply before use. |
| `status` | string | Required | No | None (not silently populated) | enum=["released"] | Public DTO value from warehouse.stock_reservations.status. Ownership and current-state checks apply before use. |
| `rowVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Public DTO value from warehouse.stock_reservations.row_version. Ownership and current-state checks apply before use. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "reservationId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "status": "released",
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked Service Identity credential for API-053. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Workload lacks the required capability or the target is outside its authorized organization/location/aggregate scope. | No trusted effect or hidden-resource disclosure. | Correct the reviewed provider/workload scope. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for release one unused active reservation exactly once. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Compare reservationVersion and current active state. Decrement reserved_qty only, never increment physical on_hand. reasonCode belongs to audit release metadata; no invented reason_code column on reservations and no physical movement is posted merely for release. | No unauthorized/partial domain effect; redact sensitive context. | Replay releases once; committed/expired incompatible transition returns INVALID_STATE_TRANSITION. Expiry worker uses the same locking invariant. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current release one unused active reservation exactly once. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Replay releases once; committed/expired incompatible transition returns INVALID_STATE_TRANSITION. Expiry worker uses the same locking invariant. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-053 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`warehouse.stock_reservations`](../../04-Database/Tables/warehouse/stock_reservations.md) | Read | `expires_at`, `id`, `order_id`, `order_item_id`, `order_revision_id`, `row_version`, `status`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | Read | `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_movement_reason_codes`](../../04-Database/Tables/warehouse/stock_movement_reason_codes.md) | Read | `id`, `is_active`, `row_version` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_reservations`](../../04-Database/Tables/warehouse/stock_reservations.md) | Create/update evidence | `status`, `released_at` | Inventory owns these writes; Inventory must invoke that narrow owner command. |
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | Create/update evidence | `reserved_qty` | Inventory owns these writes; Inventory must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.reservationVersion | warehouse.stock_reservations.row_version |
| request.reasonCode | Approved operational reason retained in platform.audit_logs.metadata_json.reasonCode; no reservation reason column or physical stock movement is invented. |
| data.reservationId | warehouse.stock_reservations.id |
| data.status | warehouse.stock_reservations.status |
| data.rowVersion | warehouse.stock_reservations.row_version |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`warehouse.bins`](../../04-Database/Tables/warehouse/bins.md), [`warehouse.stock_movement_reason_codes`](../../04-Database/Tables/warehouse/stock_movement_reason_codes.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Compare reservationVersion and current active state. Decrement reserved_qty only, never increment physical on_hand. reasonCode belongs to audit release metadata; no invented reason_code column on reservations and no physical movement is posted merely for release. |
| Idempotency | Required key: scope actor + API-053 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Replay releases once; committed/expired incompatible transition returns INVALID_STATE_TRANSITION. Expiry worker uses the same locking invariant. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-053-HAPPY` | Valid Internal Order Operations / reservation-expiry workload context and documented fixture for release one unused active reservation exactly once. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-053-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-053-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-053-SCOPE` | Use another customer/site/patient/task reference or remove inventory.reservations.release. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-053-RULE` | Compare reservationVersion and current active state. Decrement reserved_qty only, never increment physical on_hand. reasonCode belongs to audit release metadata; no invented reason_code column on reservations and no physical movement is posted merely for release. | Replay releases once; committed/expired incompatible transition returns INVALID_STATE_TRANSITION. Expiry worker uses the same locking invariant. |
| `CT-API-053-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-053-CONCURRENCY` | Race two release one unused active reservation exactly once. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-053-STATE` | Apply command after Replay releases once; committed/expired incompatible transition returns INVALID_STATE_TRANSITION. Expiry worker uses the same locking invariant. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-053-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Replay releases once; committed/expired incompatible transition returns INVALID_STATE_TRANSITION. Expiry worker uses the same locking invariant. |

Existing feature assertions: `TC-CHK-08-OK`, `TC-CHK-08-DENY`, `TC-CHK-08-01`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-054 — POST `/v1/staff/inventory/adjustments`

**Request a reasoned stock adjustment for investigated discrepancies.**

| Property | Proposed contract |
| --- | --- |
| API name | Request a reasoned stock adjustment for investigated discrepancies |
| Version / owner | v1 / Inventory |
| Consumer | Inventory Controller |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `INV-04`; [WF-011](../../06-Workflows/WF-011-Inventory-Reconciliation.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/inventory/adjustments` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Inventory Controller | inventory.adjustments.request (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Record requested adjustment/evidence, not an arbitrary balance replacement. Check current balance versions and nonnegative resulting usable stock. Approval/posting thresholds remain D-009 and require a separate owner action; no automatic posting here.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-054_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `AdjustmentRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.inventory_adjustments.warehouse_id. Ownership and current-state checks apply before use. |
| `reasonCode` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | warehouse.inventory_adjustments.reason_code; character varying(64). |
| `items` | array<object> | Required | No | None (not silently populated) | minItems=1; maxItems=100 | Nested typed projection. |
| `items[].lotId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.inventory_adjustment_items.lot_id. Ownership and current-state checks apply before use. |
| `items[].binId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.inventory_adjustment_items.bin_id. Ownership and current-state checks apply before use. |
| `items[].expectedBalanceVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `items[].quantityDelta` | string | Required | No | None (not silently populated) | minLength=1; maxLength=18; pattern="^-?(?=.*[1-9])[0-9]{1,13}(\\.[0-9]{1,3})?$" | Signed nonzero numeric(16,3); no NaN or infinity. |


```json
{
  "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "reasonCode": "CUSTOMER_REQUEST",
  "items": [
    {
      "lotId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "binId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "expectedBalanceVersion": 4,
      "quantityDelta": "-1.000"
    }
  ]
}
```

File upload: **Not Applicable**.

### Success response

HTTP **201**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `AdjustmentData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `adjustmentId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | warehouse.inventory_adjustments.id; uuid. |
| `adjustmentNumber` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | warehouse.inventory_adjustments.adjustment_number; character varying(64). |
| `warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | warehouse.inventory_adjustments.warehouse_id; uuid. |
| `status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | warehouse.inventory_adjustments.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |
| `postedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | warehouse.inventory_adjustments.posted_at; timestamp with time zone. |
| `rowVersion` | integer | Required | No | None (not silently populated) | minimum=0 | warehouse.inventory_adjustments.row_version; bigint. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "adjustmentId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "adjustmentNumber": "ADJ-DEMO-0001",
    "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "status": "draft",
    "postedAt": null,
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-054. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks inventory.adjustments.request or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for request a reasoned stock adjustment for investigated discrepancies. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Record requested adjustment/evidence, not an arbitrary balance replacement. Check current balance versions and nonnegative resulting usable stock. Approval/posting thresholds remain D-009 and require a separate owner action; no automatic posting here. | No unauthorized/partial domain effect; redact sensitive context. | Concurrent balance change invalidates request. Requested adjustment alone has zero on_hand/ledger effect. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current request a reasoned stock adjustment for investigated discrepancies. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Concurrent balance change invalidates request. Requested adjustment alone has zero on_hand/ledger effect. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-054 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`warehouse.inventory_lots`](../../04-Database/Tables/warehouse/inventory_lots.md) | Read | `batch_number`, `expires_at`, `id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | Read | `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `lot_id`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_movement_reason_codes`](../../04-Database/Tables/warehouse/stock_movement_reason_codes.md) | Read | `id`, `is_active`, `row_version` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.inventory_adjustments`](../../04-Database/Tables/warehouse/inventory_adjustments.md) | Create/update evidence | `adjustment_number`, `warehouse_id`, `requested_by_user_id`, `reason_code`, `status` | Inventory owns these writes; Inventory must invoke that narrow owner command. |
| [`warehouse.inventory_adjustment_items`](../../04-Database/Tables/warehouse/inventory_adjustment_items.md) | Create/update evidence | `adjustment_id`, `lot_id`, `bin_id`, `quantity_delta`, `notes` | Inventory owns these writes; Inventory must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.warehouseId | warehouse.inventory_adjustments.warehouse_id |
| request.reasonCode | warehouse.inventory_adjustments.reason_code |
| request.items[].lotId | warehouse.inventory_adjustment_items.lot_id |
| request.items[].binId | warehouse.inventory_adjustment_items.bin_id |
| request.items[].expectedBalanceVersion | warehouse.stock_balances.row_version |
| request.items[].quantityDelta | warehouse.inventory_adjustment_items.quantity_delta |
| data.adjustmentId | warehouse.inventory_adjustments.id |
| data.adjustmentNumber | warehouse.inventory_adjustments.adjustment_number |
| data.warehouseId | warehouse.inventory_adjustments.warehouse_id |
| data.status | warehouse.inventory_adjustments.status |
| data.postedAt | warehouse.inventory_adjustments.posted_at |
| data.rowVersion | warehouse.inventory_adjustments.row_version |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`procurement.suppliers`](../../04-Database/Tables/procurement/suppliers.md), [`warehouse.bins`](../../04-Database/Tables/warehouse/bins.md), [`warehouse.stock_movement_reason_codes`](../../04-Database/Tables/warehouse/stock_movement_reason_codes.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Record requested adjustment/evidence, not an arbitrary balance replacement. Check current balance versions and nonnegative resulting usable stock. Approval/posting thresholds remain D-009 and require a separate owner action; no automatic posting here. |
| Idempotency | Required key: scope actor + API-054 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Concurrent balance change invalidates request. Requested adjustment alone has zero on_hand/ledger effect. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-054-HAPPY` | Valid Inventory Controller context and documented fixture for request a reasoned stock adjustment for investigated discrepancies. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-054-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-054-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-054-SCOPE` | Use another customer/site/patient/task reference or remove inventory.adjustments.request. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-054-RULE` | Record requested adjustment/evidence, not an arbitrary balance replacement. Check current balance versions and nonnegative resulting usable stock. Approval/posting thresholds remain D-009 and require a separate owner action; no automatic posting here. | Concurrent balance change invalidates request. Requested adjustment alone has zero on_hand/ledger effect. |
| `CT-API-054-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-054-CONCURRENCY` | Race two request a reasoned stock adjustment for investigated discrepancies. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-054-STATE` | Apply command after Concurrent balance change invalidates request. Requested adjustment alone has zero on_hand/ledger effect. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-054-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Concurrent balance change invalidates request. Requested adjustment alone has zero on_hand/ledger effect. |

Existing feature assertions: `TC-INV-04-OK`, `TC-INV-04-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-055 — GET `/v1/staff/inventory/alerts`

**List derived stock alerts requiring operator attention.**

| Property | Proposed contract |
| --- | --- |
| API name | List derived stock alerts requiring operator attention |
| Version / owner | v1 / Inventory |
| Consumer | Inventory Operator |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `INV-05`; [WF-011](../../06-Workflows/WF-011-Inventory-Reconciliation.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/inventory/alerts` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Inventory Operator | inventory.alerts.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Use approved freshness/expiry thresholds, active recalls and replenishment minimums; one row per balance and alert type, no persisted alert table is assumed.

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
| alertType | string | Optional | No | None | enum=["source_stale", "expiry", "recalled", "low_stock"] | Optional allowlisted filter; does not widen authenticated scope. |


Only declared query fields are accepted. Sorting is fixed: `warehouse_id ASC, lot_id ASC, id ASC, alert type ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `InventoryAlertListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `alerts` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `alerts[].balanceId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | warehouse.stock_balances.id |
| `alerts[].warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.stock_balances.warehouse_id. Ownership and current-state checks apply before use. |
| `alerts[].lotId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.stock_balances.lot_id. Ownership and current-state checks apply before use. |
| `alerts[].type` | string | Required | No | None (not silently populated) | enum=["source_stale", "expiry", "recalled", "low_stock"] | Derived inventory alert: source_stale from observation policy; expiry/recall from lot evidence; low_stock from active replenishment minimum. |
| `alerts[].observedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | Last authoritative stock observation time, null when not established. |
| `alerts[].availableQuantity` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17 | Derived max(0,on_hand-reserved-damaged-quarantined), never authoritative by itself. |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "balanceId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "lotId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "type": "source_stale",
        "observedAt": "2026-10-24T10:30:00Z",
        "availableQuantity": "0.000"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-055. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks inventory.alerts.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-055 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | Read | `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `lot_id`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.inventory_lots`](../../04-Database/Tables/warehouse/inventory_lots.md) | Read | `batch_number`, `expires_at`, `id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.replenishment_rules`](../../04-Database/Tables/warehouse/replenishment_rules.md) | Read | `id`, `is_active`, `is_deleted`, `row_version`, `warehouse_id` | Warehouse projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.alerts[].balanceId | warehouse.stock_balances.id |
| data.alerts[].warehouseId | warehouse.stock_balances.warehouse_id |
| data.alerts[].lotId | warehouse.stock_balances.lot_id |
| data.alerts[].type | Derived inventory alert: source_stale from observation policy; expiry/recall from lot evidence; low_stock from active replenishment minimum. |
| data.alerts[].observedAt | warehouse.stock_balances.inventory_observed_at |
| data.alerts[].availableQuantity | Computed nonnegative usable quantity; excludes eligibility/freshness failures. |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`procurement.suppliers`](../../04-Database/Tables/procurement/suppliers.md), [`warehouse.bins`](../../04-Database/Tables/warehouse/bins.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Use approved freshness/expiry thresholds, active recalls and replenishment minimums; one row per balance and alert type, no persisted alert table is assumed. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; warehouse_id ASC, lot_id ASC, id ASC, alert type ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Missing threshold configuration returns 503 rather than reporting no alerts. Acknowledgment does not repair stock. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-055-HAPPY` | Valid Inventory Operator context and documented fixture for list derived stock alerts requiring operator attention. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-055-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-055-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-055-SCOPE` | Use another customer/site/patient/task reference or remove inventory.alerts.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-055-RULE` | Use approved freshness/expiry thresholds, active recalls and replenishment minimums; one row per balance and alert type, no persisted alert table is assumed. | Missing threshold configuration returns 503 rather than reporting no alerts. Acknowledgment does not repair stock. |
| `CT-API-055-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-055-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-055-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-055-RECOVERY` | Dependency timeout during list derived stock alerts requiring operator attention. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-INV-05-OK`, `TC-INV-05-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
