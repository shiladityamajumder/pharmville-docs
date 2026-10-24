# Store Operations API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](../../05-APIs/API-Contract-Coverage.md) · [OpenAPI 3.1](../../05-APIs/openapi.yaml) · [decisions](../../05-APIs/Planning-Decisions.md) · [DTO conventions](../../05-APIs/API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="store-operations-api-contracts"></a>
<a id="api-044--get-v1staffstoreorders"></a>
<a id="caller-permissions-and-dependencies"></a>
<a id="http-request-contract"></a>
<a id="success-response-illustrative"></a>
<a id="errors-concurrency-and-failure-recovery"></a>
<a id="required-verification"></a>
<a id="api-045--post-v1staffstoreordersorder_idaccept"></a>
<a id="caller-permissions-and-dependencies-1"></a>
<a id="http-request-contract-1"></a>
<a id="success-response-illustrative-1"></a>
<a id="errors-concurrency-and-failure-recovery-1"></a>
<a id="required-verification-1"></a>
<a id="api-046--post-v1staffstorepickspick_idscan"></a>
<a id="caller-permissions-and-dependencies-2"></a>
<a id="http-request-contract-2"></a>
<a id="success-response-illustrative-2"></a>
<a id="errors-concurrency-and-failure-recovery-2"></a>
<a id="required-verification-2"></a>
<a id="api-047--post-v1staffstorepackspack_idclose"></a>
<a id="caller-permissions-and-dependencies-3"></a>
<a id="http-request-contract-3"></a>
<a id="success-response-illustrative-3"></a>
<a id="errors-concurrency-and-failure-recovery-3"></a>
<a id="required-verification-3"></a>
<a id="api-048--post-v1staffstorereplenishments"></a>
<a id="caller-permissions-and-dependencies-4"></a>
<a id="http-request-contract-4"></a>
<a id="success-response-illustrative-4"></a>
<a id="errors-concurrency-and-failure-recovery-4"></a>
<a id="required-verification-4"></a>
<a id="api-049--post-v1staffstoretransferstransfer_idreceipt"></a>
<a id="caller-permissions-and-dependencies-5"></a>
<a id="http-request-contract-5"></a>
<a id="success-response-illustrative-5"></a>
<a id="errors-concurrency-and-failure-recovery-5"></a>
<a id="required-verification-5"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-044 | `GET /v1/staff/store/orders` | List fulfillment work for the staff member’s assigned store. | Complete proposed |
| API-045 | `POST /v1/staff/store/orders/{order_id}/accept` | Accept eligible allocated work and create assigned pick/pack tasks. | Complete proposed |
| API-046 | `POST /v1/staff/store/picks/{pick_id}/scan` | Record an exact reserved lot/product scan against a pick item. | Complete proposed |
| API-047 | `POST /v1/staff/store/packs/{pack_id}/close` | Seal nonempty packages for completed exact picks. | Complete proposed |
| API-048 | `POST /v1/staff/store/replenishments` | Request replenishment for an authorized destination store. | Complete proposed |
| API-049 | `POST /v1/staff/store/transfers/{transfer_id}/receipt` | Receive physically arrived transfer quantities at the destination site. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| STO-01 | Incoming order queue for my store, with sound alert | API-044 |
| STO-02 | Accept order, pick list, mark packed, hand over to rider | API-045, API-046, API-047 |
| STO-03 | Raise replenishment request (normal or urgent) | API-048 |
| STO-04 | Confirm receipt of a transfer; record shortages | API-049 |
| STO-05 | My store's stock, with low-stock and near-expiry alerts | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |

## API-044 — GET `/v1/staff/store/orders`

**List fulfillment work for the staff member’s assigned store.**

| Property | Proposed contract |
| --- | --- |
| API name | List fulfillment work for the staff member’s assigned store |
| Version / owner | v1 / Store_Operations |
| Consumer | Store Staff |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `STO-01`; [WF-007](../../06-Workflows/WF-007-Picking-Packing-and-Handoff.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/store/orders` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Store Staff | fulfillment.queue.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Queue is constrained by active location membership and warehouse.location_id; no unrelated store work.

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
| status | string | Optional | No | None | enum=["created", "allocated", "picking", "picked", "packing", "packed", "handed_over", "cancelled"]; minLength=1; maxLength=16 | fulfillment.fulfillment_orders.status; character varying(16). |


Only declared query fields are accepted. Sorting is fixed: `priority DESC, created_at ASC, id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `FulfillmentListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `orders` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `orders[].fulfillmentId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | fulfillment.fulfillment_orders.id; uuid. |
| `orders[].orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | fulfillment.fulfillment_orders.order_id; uuid. |
| `orders[].warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | fulfillment.fulfillment_orders.warehouse_id; uuid. |
| `orders[].orderRevisionId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | fulfillment.fulfillment_orders.order_revision_id; uuid. |
| `orders[].status` | string | Required | No | None (not silently populated) | enum=["created", "allocated", "picking", "picked", "packing", "packed", "handed_over", "cancelled"]; minLength=1; maxLength=16 | fulfillment.fulfillment_orders.status; character varying(16). |
| `orders[].priority` | integer | Required | No | None (not silently populated) | minimum=0 | fulfillment.fulfillment_orders.priority; integer. |
| `orders[].rowVersion` | integer | Required | No | None (not silently populated) | minimum=0 | fulfillment.fulfillment_orders.row_version; bigint. |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "fulfillmentId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "orderRevisionId": null,
        "status": "created",
        "priority": 1,
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-044. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks fulfillment.queue.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-044 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`fulfillment.fulfillment_orders`](../../04-Database/Tables/fulfillment/fulfillment_orders.md) | Read | `id`, `order_id`, `order_revision_id`, `priority`, `row_version`, `status`, `warehouse_id` | Store_Operations / Fulfillment owner projection / scoped joins; reading does not grant writes. |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | Read | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | Warehouse projection / scoped joins; reading does not grant writes. |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | Read | `id`, `location_id`, `organization_id`, `row_version`, `status`, `user_id` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.orders[].fulfillmentId | fulfillment.fulfillment_orders.id |
| data.orders[].orderId | fulfillment.fulfillment_orders.order_id |
| data.orders[].warehouseId | fulfillment.fulfillment_orders.warehouse_id |
| data.orders[].orderRevisionId | fulfillment.fulfillment_orders.order_revision_id |
| data.orders[].status | fulfillment.fulfillment_orders.status |
| data.orders[].priority | fulfillment.fulfillment_orders.priority |
| data.orders[].rowVersion | fulfillment.fulfillment_orders.row_version |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../../04-Database/Tables/marketplace/sellers.md), [`organization.departments`](../../04-Database/Tables/organization/departments.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Queue is constrained by active location membership and warehouse.location_id; no unrelated store work. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; priority DESC, created_at ASC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. An empty own-site queue is 200; changing warehouse filter cannot widen grants. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-044-HAPPY` | Valid Store Staff context and documented fixture for list fulfillment work for the staff member’s assigned store. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-044-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-044-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-044-SCOPE` | Use another customer/site/patient/task reference or remove fulfillment.queue.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-044-RULE` | Queue is constrained by active location membership and warehouse.location_id; no unrelated store work. | An empty own-site queue is 200; changing warehouse filter cannot widen grants. |
| `CT-API-044-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-044-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-044-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-044-RECOVERY` | Dependency timeout during list fulfillment work for the staff member’s assigned store. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-STO-01-OK`, `TC-STO-01-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-045 — POST `/v1/staff/store/orders/{order_id}/accept`

**Accept eligible allocated work and create assigned pick/pack tasks.**

| Property | Proposed contract |
| --- | --- |
| API name | Accept eligible allocated work and create assigned pick/pack tasks |
| Version / owner | v1 / Store_Operations |
| Consumer | Store Supervisor / assigned Store Staff |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `STO-02`; [WF-007](../../06-Workflows/WF-007-Picking-Packing-and-Handoff.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/store/orders/{order_id}/accept` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Store Supervisor / assigned Store Staff | fulfillment.accept (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Require current revision, current P review, exact active holds and eligible license; allocated to picking only. Tasks start created then assigned/in_progress as documented guard allows; no direct allocated-to-packed jump.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-045_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `StoreAcceptRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedFulfillmentVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `expectedOrderVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |


```json
{
  "expectedFulfillmentVersion": 4,
  "expectedOrderVersion": 4
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `FulfillmentData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `fulfillmentId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | fulfillment.fulfillment_orders.id; uuid. |
| `orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | fulfillment.fulfillment_orders.order_id; uuid. |
| `warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | fulfillment.fulfillment_orders.warehouse_id; uuid. |
| `orderRevisionId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | fulfillment.fulfillment_orders.order_revision_id; uuid. |
| `status` | string | Required | No | None (not silently populated) | enum=["created", "allocated", "picking", "picked", "packing", "packed", "handed_over", "cancelled"]; minLength=1; maxLength=16 | fulfillment.fulfillment_orders.status; character varying(16). |
| `priority` | integer | Required | No | None (not silently populated) | minimum=0 | fulfillment.fulfillment_orders.priority; integer. |
| `rowVersion` | integer | Required | No | None (not silently populated) | minimum=0 | fulfillment.fulfillment_orders.row_version; bigint. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "fulfillmentId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "orderRevisionId": null,
    "status": "created",
    "priority": 1,
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-045. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks fulfillment.accept or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for accept eligible allocated work and create assigned pick/pack tasks. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Require current revision, current P review, exact active holds and eligible license; allocated to picking only. Tasks start created then assigned/in_progress as documented guard allows; no direct allocated-to-packed jump. | No unauthorized/partial domain effect; redact sensitive context. | Changed clinical/stock evidence blocks work acceptance; route to Operations without changing payment truth. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current accept eligible allocated work and create assigned pick/pack tasks. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Changed clinical/stock evidence blocks work acceptance; route to Operations without changing payment truth. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-045 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`fulfillment.fulfillment_orders`](../../04-Database/Tables/fulfillment/fulfillment_orders.md) | Read | `id`, `order_id`, `order_revision_id`, `priority`, `row_version`, `status`, `warehouse_id` | Store_Operations / Fulfillment owner projection / scoped joins; reading does not grant writes. |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `internal_id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | Read | `id`, `order_id`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | Read | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | Read | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `review_id`, `row_version` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`organization.licenses`](../../04-Database/Tables/organization/licenses.md) | Read | `expires_at`, `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `verification_status` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_reservations`](../../04-Database/Tables/warehouse/stock_reservations.md) | Read | `expires_at`, `id`, `order_id`, `order_item_id`, `order_revision_id`, `row_version`, `status`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`fulfillment.fulfillment_orders`](../../04-Database/Tables/fulfillment/fulfillment_orders.md) | Create/update evidence | `status` | Store_Operations / Fulfillment owner owns these writes; Store_Operations must invoke that narrow owner command. |
| [`fulfillment.pick_tasks`](../../04-Database/Tables/fulfillment/pick_tasks.md) | Create/update evidence | `fulfillment_order_id`, `assigned_to_user_id`, `status` | Store_Operations / Fulfillment owner owns these writes; Store_Operations must invoke that narrow owner command. |
| [`fulfillment.pick_task_items`](../../04-Database/Tables/fulfillment/pick_task_items.md) | Create/update evidence | `pick_task_id`, `order_item_id`, `lot_id`, `bin_id`, `required_qty`, `picked_qty` | Store_Operations / Fulfillment owner owns these writes; Store_Operations must invoke that narrow owner command. |
| [`fulfillment.pack_tasks`](../../04-Database/Tables/fulfillment/pack_tasks.md) | Create/update evidence | `fulfillment_order_id`, `status` | Store_Operations / Fulfillment owner owns these writes; Store_Operations must invoke that narrow owner command. |
| [`fulfillment.fulfillment_events`](../../04-Database/Tables/fulfillment/fulfillment_events.md) | Create/update evidence | `fulfillment_order_id`, `actor_user_id`, `event_type`, `payload` | Store_Operations / Fulfillment owner owns these writes; Store_Operations must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedFulfillmentVersion | fulfillment.fulfillment_orders.row_version |
| request.expectedOrderVersion | commerce.orders.row_version |
| data.fulfillmentId | fulfillment.fulfillment_orders.id |
| data.orderId | fulfillment.fulfillment_orders.order_id |
| data.warehouseId | fulfillment.fulfillment_orders.warehouse_id |
| data.orderRevisionId | fulfillment.fulfillment_orders.order_revision_id |
| data.status | fulfillment.fulfillment_orders.status |
| data.priority | fulfillment.fulfillment_orders.priority |
| data.rowVersion | fulfillment.fulfillment_orders.row_version |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`clinical.review_reason_codes`](../../04-Database/Tables/clinical/review_reason_codes.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../../04-Database/Tables/marketplace/sellers.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md), [`warehouse.bins`](../../04-Database/Tables/warehouse/bins.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Require current revision, current P review, exact active holds and eligible license; allocated to picking only. Tasks start created then assigned/in_progress as documented guard allows; no direct allocated-to-packed jump. |
| Idempotency | Required key: scope actor + API-045 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Changed clinical/stock evidence blocks work acceptance; route to Operations without changing payment truth. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-045-HAPPY` | Valid Store Supervisor / assigned Store Staff context and documented fixture for accept eligible allocated work and create assigned pick/pack tasks. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-045-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-045-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-045-SCOPE` | Use another customer/site/patient/task reference or remove fulfillment.accept. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-045-RULE` | Require current revision, current P review, exact active holds and eligible license; allocated to picking only. Tasks start created then assigned/in_progress as documented guard allows; no direct allocated-to-packed jump. | Changed clinical/stock evidence blocks work acceptance; route to Operations without changing payment truth. |
| `CT-API-045-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-045-CONCURRENCY` | Race two accept eligible allocated work and create assigned pick/pack tasks. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-045-STATE` | Apply command after Changed clinical/stock evidence blocks work acceptance; route to Operations without changing payment truth. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-045-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Changed clinical/stock evidence blocks work acceptance; route to Operations without changing payment truth. |

Existing feature assertions: `TC-STO-02-OK`, `TC-STO-02-DENY`, `TC-STO-02-01`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-046 — POST `/v1/staff/store/picks/{pick_id}/scan`

**Record an exact reserved lot/product scan against a pick item.**

| Property | Proposed contract |
| --- | --- |
| API name | Record an exact reserved lot/product scan against a pick item |
| Version / owner | v1 / Store_Operations |
| Consumer | Assigned Store Picker |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `STO-02`; [WF-007](../../06-Workflows/WF-007-Picking-Packing-and-Handoff.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/store/picks/{pick_id}/scan` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Assigned Store Picker | fulfillment.pick.scan (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Assigned picker/site only; item/lot/bin must match exact committed clinical SKU and reservation. Increment must not exceed required quantity. When all required items complete, transition in_progress to completed and fulfillment picking to picked under guards.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-046_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| pick_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `PickScanRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedPickVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `pickItemId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from fulfillment.pick_task_items.id. Ownership and current-state checks apply before use. |
| `lotId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from fulfillment.pick_task_items.lot_id. Ownership and current-state checks apply before use. |
| `binId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from fulfillment.pick_task_items.bin_id. Ownership and current-state checks apply before use. |
| `scannedIdentifier` | string | Required | No | None (not silently populated) | minLength=1; maxLength=128 | Must resolve to exact product/variant from catalog.product_identifiers. |
| `quantity` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(?=.*[1-9])[0-9]{1,13}(\\.[0-9]{1,3})?$" | Increment picked quantity, not a replacement total. |


```json
{
  "expectedPickVersion": 4,
  "pickItemId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "lotId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "binId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "scannedIdentifier": "SYNTHETIC-SKU-001",
  "quantity": "2.000"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `PickScanData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `pickItemId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | fulfillment.pick_task_items.id; uuid. |
| `orderItemId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | fulfillment.pick_task_items.order_item_id; uuid. |
| `lotId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | fulfillment.pick_task_items.lot_id; uuid. |
| `binId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | fulfillment.pick_task_items.bin_id; uuid. |
| `requiredQty` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,9}(\\.[0-9]{1,3})?$" | fulfillment.pick_task_items.required_qty; numeric(12,3). |
| `pickedQty` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,9}(\\.[0-9]{1,3})?$" | fulfillment.pick_task_items.picked_qty; numeric(12,3). |
| `rowVersion` | integer | Required | No | None (not silently populated) | minimum=0 | fulfillment.pick_task_items.row_version; bigint. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "pickItemId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "orderItemId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "lotId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "binId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "requiredQty": "2.000",
    "pickedQty": "2.000",
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-046. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks fulfillment.pick.scan or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for record an exact reserved lot/product scan against a pick item. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Assigned picker/site only; item/lot/bin must match exact committed clinical SKU and reservation. Increment must not exceed required quantity. When all required items complete, transition in_progress to completed and fulfillment picking to picked under guards. | No unauthorized/partial domain effect; redact sensitive context. | Wrong batch/quantity changes nothing. Same intent is one increment; a duplicate scan with a new key is separately validated against remaining quantity. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current record an exact reserved lot/product scan against a pick item. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Wrong batch/quantity changes nothing. Same intent is one increment; a duplicate scan with a new key is separately validated against remaining quantity. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-046 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`fulfillment.fulfillment_orders`](../../04-Database/Tables/fulfillment/fulfillment_orders.md) | Read | `id`, `order_id`, `order_revision_id`, `row_version`, `status`, `warehouse_id` | Store_Operations / Fulfillment owner projection / scoped joins; reading does not grant writes. |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `internal_id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | Read | `id`, `order_id`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | Read | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | Read | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `review_id`, `row_version` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`organization.licenses`](../../04-Database/Tables/organization/licenses.md) | Read | `expires_at`, `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `verification_status` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_reservations`](../../04-Database/Tables/warehouse/stock_reservations.md) | Read | `expires_at`, `id`, `lot_id`, `order_id`, `order_item_id`, `order_revision_id`, `quantity`, `row_version`, `status`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`fulfillment.pick_tasks`](../../04-Database/Tables/fulfillment/pick_tasks.md) | Read | `assigned_to_user_id`, `fulfillment_order_id`, `id`, `row_version`, `status` | Store_Operations / Fulfillment owner projection / scoped joins; reading does not grant writes. |
| [`fulfillment.pick_task_items`](../../04-Database/Tables/fulfillment/pick_task_items.md) | Read | `bin_id`, `id`, `lot_id`, `order_item_id`, `pick_task_id`, `picked_qty`, `required_qty`, `row_version` | Store_Operations / Fulfillment owner projection / scoped joins; reading does not grant writes. |
| [`catalog.product_identifiers`](../../04-Database/Tables/catalog/product_identifiers.md) | Read | `id`, `row_version` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`warehouse.inventory_lots`](../../04-Database/Tables/warehouse/inventory_lots.md) | Read | `batch_number`, `expires_at`, `id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`fulfillment.pick_task_items`](../../04-Database/Tables/fulfillment/pick_task_items.md) | Create/update evidence | `picked_qty` | Store_Operations / Fulfillment owner owns these writes; Store_Operations must invoke that narrow owner command. |
| [`fulfillment.pick_tasks`](../../04-Database/Tables/fulfillment/pick_tasks.md) | Create/update evidence | `status`, `started_at`, `completed_at` | Store_Operations / Fulfillment owner owns these writes; Store_Operations must invoke that narrow owner command. |
| [`fulfillment.fulfillment_orders`](../../04-Database/Tables/fulfillment/fulfillment_orders.md) | Create/update evidence | `status` | Store_Operations / Fulfillment owner owns these writes; Store_Operations must invoke that narrow owner command. |
| [`fulfillment.fulfillment_events`](../../04-Database/Tables/fulfillment/fulfillment_events.md) | Create/update evidence | `fulfillment_order_id`, `actor_user_id`, `event_type`, `payload` | Store_Operations / Fulfillment owner owns these writes; Store_Operations must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedPickVersion | fulfillment.pick_tasks.row_version |
| request.pickItemId | fulfillment.pick_task_items.id |
| request.lotId | fulfillment.pick_task_items.lot_id |
| request.binId | fulfillment.pick_task_items.bin_id |
| request.scannedIdentifier | Input compared to catalog.product_identifiers.identifier_value and assigned product/variant. |
| request.quantity | warehouse.stock_reservations.quantity |
| data.pickItemId | fulfillment.pick_task_items.id |
| data.orderItemId | fulfillment.pick_task_items.order_item_id |
| data.lotId | fulfillment.pick_task_items.lot_id |
| data.binId | fulfillment.pick_task_items.bin_id |
| data.requiredQty | fulfillment.pick_task_items.required_qty |
| data.pickedQty | fulfillment.pick_task_items.picked_qty |
| data.rowVersion | fulfillment.pick_task_items.row_version |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`clinical.review_reason_codes`](../../04-Database/Tables/clinical/review_reason_codes.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../../04-Database/Tables/marketplace/sellers.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md), [`procurement.suppliers`](../../04-Database/Tables/procurement/suppliers.md), [`warehouse.bins`](../../04-Database/Tables/warehouse/bins.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Assigned picker/site only; item/lot/bin must match exact committed clinical SKU and reservation. Increment must not exceed required quantity. When all required items complete, transition in_progress to completed and fulfillment picking to picked under guards. |
| Idempotency | Required key: scope actor + API-046 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Wrong batch/quantity changes nothing. Same intent is one increment; a duplicate scan with a new key is separately validated against remaining quantity. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-046-HAPPY` | Valid Assigned Store Picker context and documented fixture for record an exact reserved lot/product scan against a pick item. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-046-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-046-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-046-SCOPE` | Use another customer/site/patient/task reference or remove fulfillment.pick.scan. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-046-RULE` | Assigned picker/site only; item/lot/bin must match exact committed clinical SKU and reservation. Increment must not exceed required quantity. When all required items complete, transition in_progress to completed and fulfillment picking to picked under guards. | Wrong batch/quantity changes nothing. Same intent is one increment; a duplicate scan with a new key is separately validated against remaining quantity. |
| `CT-API-046-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-046-CONCURRENCY` | Race two record an exact reserved lot/product scan against a pick item. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-046-STATE` | Apply command after Wrong batch/quantity changes nothing. Same intent is one increment; a duplicate scan with a new key is separately validated against remaining quantity. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-046-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Wrong batch/quantity changes nothing. Same intent is one increment; a duplicate scan with a new key is separately validated against remaining quantity. |

Existing feature assertions: `TC-STO-02-OK`, `TC-STO-02-DENY`, `TC-STO-02-01`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-047 — POST `/v1/staff/store/packs/{pack_id}/close`

**Seal nonempty packages for completed exact picks.**

| Property | Proposed contract |
| --- | --- |
| API name | Seal nonempty packages for completed exact picks |
| Version / owner | v1 / Store_Operations |
| Consumer | Assigned Store Packer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `STO-02`; [WF-007](../../06-Workflows/WF-007-Picking-Packing-and-Handoff.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/store/packs/{pack_id}/close` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Assigned Store Packer | fulfillment.pack.close (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Only picked/picking-completed work, exact current revision and picked lot quantities. Aggregate package quantities equal completed picks. Transition picked to packing to packed; packed package evidence is immutable. Inventory separately commits reserved stock before dispatch.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-047_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| pack_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `PackCloseRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedPackVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `packages` | array<object> | Required | No | None (not silently populated) | minItems=1; maxItems=10 | Nested typed projection. |
| `packages[].packageNumber` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | fulfillment.packages.package_number; character varying(64). |
| `packages[].tamperSealNumber` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=128 | fulfillment.packages.tamper_seal_number; character varying(128). |
| `packages[].weightGrams` | integer | Required | No | None (not silently populated) | minimum=1 | Positive measured package weight. |
| `packages[].items` | array<object> | Required | No | None (not silently populated) | minItems=1; maxItems=50 | Nested typed projection. |
| `packages[].items[].orderItemId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.order_items.id. Ownership and current-state checks apply before use. |
| `packages[].items[].lotId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from fulfillment.package_items.lot_id. Ownership and current-state checks apply before use. |
| `packages[].items[].quantity` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(?=.*[1-9])[0-9]{1,13}(\\.[0-9]{1,3})?$" | Positive decimal quantity, up to three fractional digits. |


```json
{
  "expectedPackVersion": 4,
  "packages": [
    {
      "packageNumber": "package number",
      "tamperSealNumber": null,
      "weightGrams": 250,
      "items": [
        {
          "orderItemId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
          "lotId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
          "quantity": "2.000"
        }
      ]
    }
  ]
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `PackCloseData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `fulfillment` | object | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `fulfillment.fulfillmentId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | fulfillment.fulfillment_orders.id; uuid. |
| `fulfillment.orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | fulfillment.fulfillment_orders.order_id; uuid. |
| `fulfillment.warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | fulfillment.fulfillment_orders.warehouse_id; uuid. |
| `fulfillment.orderRevisionId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | fulfillment.fulfillment_orders.order_revision_id; uuid. |
| `fulfillment.status` | string | Required | No | None (not silently populated) | enum=["created", "allocated", "picking", "picked", "packing", "packed", "handed_over", "cancelled"]; minLength=1; maxLength=16 | fulfillment.fulfillment_orders.status; character varying(16). |
| `fulfillment.priority` | integer | Required | No | None (not silently populated) | minimum=0 | fulfillment.fulfillment_orders.priority; integer. |
| `fulfillment.rowVersion` | integer | Required | No | None (not silently populated) | minimum=0 | fulfillment.fulfillment_orders.row_version; bigint. |
| `packageIds` | array<string (uuid)> | Required | No | None (not silently populated) | minItems=1; maxItems=10 | Nested typed projection. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "fulfillment": {
      "fulfillmentId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "orderRevisionId": null,
      "status": "created",
      "priority": 1,
      "rowVersion": 1
    },
    "packageIds": [
      "0192a1b2-c3d4-7e8f-9012-3456789abcde"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-047. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks fulfillment.pack.close or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for seal nonempty packages for completed exact picks. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Only picked/picking-completed work, exact current revision and picked lot quantities. Aggregate package quantities equal completed picks. Transition picked to packing to packed; packed package evidence is immutable. Inventory separately commits reserved stock before dispatch. | No unauthorized/partial domain effect; redact sensitive context. | Cancellation-versus-packing locks the same aggregate; one outcome wins. Empty packages or incomplete picks cannot complete pack task. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current seal nonempty packages for completed exact picks. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Cancellation-versus-packing locks the same aggregate; one outcome wins. Empty packages or incomplete picks cannot complete pack task. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-047 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`fulfillment.fulfillment_orders`](../../04-Database/Tables/fulfillment/fulfillment_orders.md) | Read | `id`, `order_id`, `order_revision_id`, `priority`, `row_version`, `status`, `warehouse_id` | Store_Operations / Fulfillment owner projection / scoped joins; reading does not grant writes. |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `internal_id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | Read | `id`, `order_id`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | Read | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | Read | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `review_id`, `row_version` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`organization.licenses`](../../04-Database/Tables/organization/licenses.md) | Read | `expires_at`, `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `verification_status` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_reservations`](../../04-Database/Tables/warehouse/stock_reservations.md) | Read | `expires_at`, `id`, `order_id`, `order_item_id`, `order_revision_id`, `row_version`, `status`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`fulfillment.pick_tasks`](../../04-Database/Tables/fulfillment/pick_tasks.md) | Read | `assigned_to_user_id`, `fulfillment_order_id`, `id`, `row_version`, `status` | Store_Operations / Fulfillment owner projection / scoped joins; reading does not grant writes. |
| [`fulfillment.pick_task_items`](../../04-Database/Tables/fulfillment/pick_task_items.md) | Read | `id`, `order_item_id`, `pick_task_id`, `row_version` | Store_Operations / Fulfillment owner projection / scoped joins; reading does not grant writes. |
| [`fulfillment.pack_tasks`](../../04-Database/Tables/fulfillment/pack_tasks.md) | Read | `assigned_to_user_id`, `fulfillment_order_id`, `id`, `row_version`, `status` | Store_Operations / Fulfillment owner projection / scoped joins; reading does not grant writes. |
| [`fulfillment.packages`](../../04-Database/Tables/fulfillment/packages.md) | Read | `fulfillment_order_id`, `id`, `pack_task_id`, `package_number`, `row_version`, `status`, `tamper_seal_number`, `weight_grams` | Store_Operations / Fulfillment owner projection / scoped joins; reading does not grant writes. |
| [`fulfillment.package_items`](../../04-Database/Tables/fulfillment/package_items.md) | Read | `id`, `lot_id`, `order_item_id`, `package_id`, `quantity`, `row_version` | Store_Operations / Fulfillment owner projection / scoped joins; reading does not grant writes. |
| [`commerce.order_items`](../../04-Database/Tables/commerce/order_items.md) | Read | `id`, `order_id`, `prescription_id`, `row_version`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`fulfillment.pack_tasks`](../../04-Database/Tables/fulfillment/pack_tasks.md) | Create/update evidence | `status`, `started_at`, `completed_at` | Store_Operations / Fulfillment owner owns these writes; Store_Operations must invoke that narrow owner command. |
| [`fulfillment.packages`](../../04-Database/Tables/fulfillment/packages.md) | Create/update evidence | `fulfillment_order_id`, `pack_task_id`, `package_number`, `tamper_seal_number`, `weight_grams`, `packed_at`, `packed_by_user_id`, `status`, `dimensions_json`, `temperature_controlled` | Store_Operations / Fulfillment owner owns these writes; Store_Operations must invoke that narrow owner command. |
| [`fulfillment.package_items`](../../04-Database/Tables/fulfillment/package_items.md) | Create/update evidence | `package_id`, `order_item_id`, `lot_id`, `quantity` | Store_Operations / Fulfillment owner owns these writes; Store_Operations must invoke that narrow owner command. |
| [`fulfillment.fulfillment_orders`](../../04-Database/Tables/fulfillment/fulfillment_orders.md) | Create/update evidence | `status` | Store_Operations / Fulfillment owner owns these writes; Store_Operations must invoke that narrow owner command. |
| [`fulfillment.fulfillment_events`](../../04-Database/Tables/fulfillment/fulfillment_events.md) | Create/update evidence | `fulfillment_order_id`, `actor_user_id`, `event_type`, `payload` | Store_Operations / Fulfillment owner owns these writes; Store_Operations must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedPackVersion | fulfillment.pack_tasks.row_version |
| request.packages[].packageNumber | fulfillment.packages.package_number |
| request.packages[].tamperSealNumber | fulfillment.packages.tamper_seal_number |
| request.packages[].weightGrams | fulfillment.packages.weight_grams |
| request.packages[].items[].orderItemId | commerce.order_items.id |
| request.packages[].items[].lotId | fulfillment.package_items.lot_id |
| request.packages[].items[].quantity | fulfillment.package_items.quantity |
| data.fulfillment.fulfillmentId | fulfillment.fulfillment_orders.id |
| data.fulfillment.orderId | fulfillment.fulfillment_orders.order_id |
| data.fulfillment.warehouseId | fulfillment.fulfillment_orders.warehouse_id |
| data.fulfillment.orderRevisionId | fulfillment.fulfillment_orders.order_revision_id |
| data.fulfillment.status | fulfillment.fulfillment_orders.status |
| data.fulfillment.priority | fulfillment.fulfillment_orders.priority |
| data.fulfillment.rowVersion | fulfillment.fulfillment_orders.row_version |
| data.packageIds[] | fulfillment.packages.id |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md), [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`clinical.review_reason_codes`](../../04-Database/Tables/clinical/review_reason_codes.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../../04-Database/Tables/marketplace/sellers.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md), [`warehouse.bins`](../../04-Database/Tables/warehouse/bins.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Only picked/picking-completed work, exact current revision and picked lot quantities. Aggregate package quantities equal completed picks. Transition picked to packing to packed; packed package evidence is immutable. Inventory separately commits reserved stock before dispatch. |
| Idempotency | Required key: scope actor + API-047 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Cancellation-versus-packing locks the same aggregate; one outcome wins. Empty packages or incomplete picks cannot complete pack task. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-047-HAPPY` | Valid Assigned Store Packer context and documented fixture for seal nonempty packages for completed exact picks. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-047-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-047-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-047-SCOPE` | Use another customer/site/patient/task reference or remove fulfillment.pack.close. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-047-RULE` | Only picked/picking-completed work, exact current revision and picked lot quantities. Aggregate package quantities equal completed picks. Transition picked to packing to packed; packed package evidence is immutable. Inventory separately commits reserved stock before dispatch. | Cancellation-versus-packing locks the same aggregate; one outcome wins. Empty packages or incomplete picks cannot complete pack task. |
| `CT-API-047-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-047-CONCURRENCY` | Race two seal nonempty packages for completed exact picks. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-047-STATE` | Apply command after Cancellation-versus-packing locks the same aggregate; one outcome wins. Empty packages or incomplete picks cannot complete pack task. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-047-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Cancellation-versus-packing locks the same aggregate; one outcome wins. Empty packages or incomplete picks cannot complete pack task. |

Existing feature assertions: `TC-STO-02-OK`, `TC-STO-02-DENY`, `TC-STO-02-01`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-048 — POST `/v1/staff/store/replenishments`

**Request replenishment for an authorized destination store.**

| Property | Proposed contract |
| --- | --- |
| API name | Request replenishment for an authorized destination store |
| Version / owner | v1 / Warehouse via Procurement requisition command |
| Consumer | Store Supervisor |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `STO-03`; [WF-014](../../06-Workflows/WF-014-Supplier-Receiving.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/store/replenishments` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Store Supervisor | warehouse.replenishment.request (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Store surface delegates requisition creation to Warehouse/Procurement; this is a request, not a stock increase or approved purchase order. Destination warehouse must match staff site.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-048_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `ReplenishmentRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.warehouses.id. Ownership and current-state checks apply before use. |
| `items` | array<object> | Required | No | None (not silently populated) | minItems=1; maxItems=50 | Nested typed projection. |
| `items[].productId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from catalog.products.id. Ownership and current-state checks apply before use. |
| `items[].requestedQuantity` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(?=.*[1-9])[0-9]{1,13}(\\.[0-9]{1,3})?$" | Positive decimal quantity, up to three fractional digits. |
| `requiredBy` | string (date) | Optional | No | None (not silently populated) | format="date" | Public DTO value from procurement.purchase_requisitions.required_by. Ownership and current-state checks apply before use. |


```json
{
  "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "items": [
    {
      "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "requestedQuantity": "2.000"
    }
  ],
  "requiredBy": "2026-10-26"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **201**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `ReplenishmentData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `requisitionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | procurement.purchase_requisitions.id; uuid. |
| `requisitionNumber` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | procurement.purchase_requisitions.requisition_number; character varying(64). |
| `warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | procurement.purchase_requisitions.warehouse_id; uuid. |
| `status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | procurement.purchase_requisitions.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "requisitionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "requisitionNumber": "REQ-DEMO-0001",
    "warehouseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "status": "draft"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-048. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks warehouse.replenishment.request or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for request replenishment for an authorized destination store. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Store surface delegates requisition creation to Warehouse/Procurement; this is a request, not a stock increase or approved purchase order. Destination warehouse must match staff site. | No unauthorized/partial domain effect; redact sensitive context. | Unsupported product/site creates nothing; acceptance does not guarantee supplier stock or warehouse dispatch. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Unsupported product/site creates nothing; acceptance does not guarantee supplier stock or warehouse dispatch. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-048 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | Read | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | Warehouse projection / scoped joins; reading does not grant writes. |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Read | `id`, `is_deleted`, `row_version`, `status` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`warehouse.replenishment_rules`](../../04-Database/Tables/warehouse/replenishment_rules.md) | Read | `id`, `is_active`, `is_deleted`, `product_id`, `row_version`, `warehouse_id` | Warehouse projection / scoped joins; reading does not grant writes. |
| [`procurement.purchase_requisitions`](../../04-Database/Tables/procurement/purchase_requisitions.md) | Create/update evidence | `requisition_number`, `warehouse_id`, `requested_by_user_id`, `required_by`, `priority`, `status` | Warehouse via Procurement owner owns these writes; Warehouse via Procurement requisition command must invoke that narrow owner command. |
| [`procurement.purchase_requisition_items`](../../04-Database/Tables/procurement/purchase_requisition_items.md) | Create/update evidence | `requisition_id`, `product_id`, `requested_qty` | Warehouse via Procurement owner owns these writes; Warehouse via Procurement requisition command must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.warehouseId | warehouse.warehouses.id |
| request.items[].productId | catalog.products.id |
| request.items[].requestedQuantity | procurement.purchase_requisition_items.requested_qty |
| request.requiredBy | procurement.purchase_requisitions.required_by |
| data.requisitionId | procurement.purchase_requisitions.id |
| data.requisitionNumber | procurement.purchase_requisitions.requisition_number |
| data.warehouseId | procurement.purchase_requisitions.warehouse_id |
| data.status | procurement.purchase_requisitions.status |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.brands`](../../04-Database/Tables/catalog/brands.md), [`catalog.categories`](../../04-Database/Tables/catalog/categories.md), [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md), [`catalog.dosage_forms`](../../04-Database/Tables/catalog/dosage_forms.md), [`catalog.manufacturers`](../../04-Database/Tables/catalog/manufacturers.md), [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md), [`procurement.suppliers`](../../04-Database/Tables/procurement/suppliers.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Store surface delegates requisition creation to Warehouse/Procurement; this is a request, not a stock increase or approved purchase order. Destination warehouse must match staff site. |
| Idempotency | Required key: scope actor + API-048 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Unsupported product/site creates nothing; acceptance does not guarantee supplier stock or warehouse dispatch. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-048-HAPPY` | Valid Store Supervisor context and documented fixture for request replenishment for an authorized destination store. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-048-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-048-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-048-SCOPE` | Use another customer/site/patient/task reference or remove warehouse.replenishment.request. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-048-RULE` | Store surface delegates requisition creation to Warehouse/Procurement; this is a request, not a stock increase or approved purchase order. Destination warehouse must match staff site. | Unsupported product/site creates nothing; acceptance does not guarantee supplier stock or warehouse dispatch. |
| `CT-API-048-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-048-CONCURRENCY` | Race two request replenishment for an authorized destination store. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-048-STATE` | Apply command after Unsupported product/site creates nothing; acceptance does not guarantee supplier stock or warehouse dispatch. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-048-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Unsupported product/site creates nothing; acceptance does not guarantee supplier stock or warehouse dispatch. |

Existing feature assertions: `TC-STO-03-OK`, `TC-STO-03-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-049 — POST `/v1/staff/store/transfers/{transfer_id}/receipt`

**Receive physically arrived transfer quantities at the destination site.**

| Property | Proposed contract |
| --- | --- |
| API name | Receive physically arrived transfer quantities at the destination site |
| Version / owner | v1 / Warehouse |
| Consumer | Destination Store Receiver |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `STO-04`; [WF-014](../../06-Workflows/WF-014-Supplier-Receiving.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/store/transfers/{transfer_id}/receipt` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Destination Store Receiver | warehouse.transfer.receive (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Destination staff only; require dispatched evidence. Keep shortages/discrepancies visible, never silently credit missing/damaged units. Inventory posts each accepted movement idempotently through its command.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-049_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `TransferReceiptRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedTransferVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `items` | array<object> | Required | No | None (not silently populated) | minItems=1; maxItems=100 | Nested typed projection. |
| `items[].transferItemId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from warehouse.stock_transfer_items.id. Ownership and current-state checks apply before use. |
| `items[].receivedQuantity` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(?=.*[1-9])[0-9]{1,13}(\\.[0-9]{1,3})?$" | Actual accepted quantity; cannot exceed dispatched minus previously received. |


```json
{
  "expectedTransferVersion": 4,
  "items": [
    {
      "transferItemId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "receivedQuantity": "2.000"
    }
  ]
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-049. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks warehouse.transfer.receive or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for receive physically arrived transfer quantities at the destination site. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Destination staff only; require dispatched evidence. Keep shortages/discrepancies visible, never silently credit missing/damaged units. Inventory posts each accepted movement idempotently through its command. | No unauthorized/partial domain effect; redact sensitive context. | Overreceipt or wrong destination changes nothing; lost response replays received evidence without double stock. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current receive physically arrived transfer quantities at the destination site. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Overreceipt or wrong destination changes nothing; lost response replays received evidence without double stock. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-049 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`warehouse.stock_transfer_items`](../../04-Database/Tables/warehouse/stock_transfer_items.md) | Read | `id`, `lot_id`, `received_qty`, `row_version`, `transfer_id` | Warehouse projection / scoped joins; reading does not grant writes. |
| [`warehouse.inventory_lots`](../../04-Database/Tables/warehouse/inventory_lots.md) | Read | `batch_number`, `expires_at`, `id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_transfer_items`](../../04-Database/Tables/warehouse/stock_transfer_items.md) | Create/update evidence | `received_qty` | Warehouse owns these writes; Warehouse must invoke that narrow owner command. |
| [`warehouse.stock_transfers`](../../04-Database/Tables/warehouse/stock_transfers.md) | Create/update evidence | `status`, `received_at` | Warehouse owns these writes; Warehouse must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedTransferVersion | warehouse.stock_transfers.row_version |
| request.items[].transferItemId | warehouse.stock_transfer_items.id |
| request.items[].receivedQuantity | warehouse.stock_transfer_items.received_qty |
| data.transferId | warehouse.stock_transfers.id |
| data.transferNumber | warehouse.stock_transfers.transfer_number |
| data.sourceWarehouseId | warehouse.stock_transfers.source_warehouse_id |
| data.destinationWarehouseId | warehouse.stock_transfers.destination_warehouse_id |
| data.status | warehouse.stock_transfers.status |
| data.dispatchedAt | warehouse.stock_transfers.dispatched_at |
| data.receivedAt | warehouse.stock_transfers.received_at |
| data.rowVersion | warehouse.stock_transfers.row_version |

**Transaction:** Warehouse commits receipt evidence/outbox; Inventory applies destination lot/balance/ledger movement under its own transaction and deduplication reference. Stock remains unavailable until Inventory records accepted movement; no direct Store balance write. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`procurement.suppliers`](../../04-Database/Tables/procurement/suppliers.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Destination staff only; require dispatched evidence. Keep shortages/discrepancies visible, never silently credit missing/damaged units. Inventory posts each accepted movement idempotently through its command. |
| Idempotency | Required key: scope actor + API-049 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Overreceipt or wrong destination changes nothing; lost response replays received evidence without double stock. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-049-HAPPY` | Valid Destination Store Receiver context and documented fixture for receive physically arrived transfer quantities at the destination site. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-049-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-049-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-049-SCOPE` | Use another customer/site/patient/task reference or remove warehouse.transfer.receive. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-049-RULE` | Destination staff only; require dispatched evidence. Keep shortages/discrepancies visible, never silently credit missing/damaged units. Inventory posts each accepted movement idempotently through its command. | Overreceipt or wrong destination changes nothing; lost response replays received evidence without double stock. |
| `CT-API-049-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-049-CONCURRENCY` | Race two receive physically arrived transfer quantities at the destination site. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-049-STATE` | Apply command after Overreceipt or wrong destination changes nothing; lost response replays received evidence without double stock. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-049-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Overreceipt or wrong destination changes nothing; lost response replays received evidence without double stock. |

Existing feature assertions: `TC-STO-04-OK`, `TC-STO-04-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
