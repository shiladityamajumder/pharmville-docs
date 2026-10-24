# Delivery Operations API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](../../05-APIs/API-Contract-Coverage.md) · [OpenAPI 3.1](../../05-APIs/openapi.yaml) · [decisions](../../05-APIs/Planning-Decisions.md) · [DTO conventions](../../05-APIs/API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="delivery-operations-api-contracts"></a>
<a id="api-064--get-v1staffdeliverytasks"></a>
<a id="caller-permissions-and-dependencies"></a>
<a id="http-request-contract"></a>
<a id="success-response-illustrative"></a>
<a id="errors-concurrency-and-failure-recovery"></a>
<a id="required-verification"></a>
<a id="api-065--post-v1staffdeliverytaskstask_idassign"></a>
<a id="caller-permissions-and-dependencies-1"></a>
<a id="http-request-contract-1"></a>
<a id="success-response-illustrative-1"></a>
<a id="errors-concurrency-and-failure-recovery-1"></a>
<a id="required-verification-1"></a>
<a id="api-066--post-v1staffdeliverytaskstask_idresolution"></a>
<a id="caller-permissions-and-dependencies-2"></a>
<a id="http-request-contract-2"></a>
<a id="success-response-illustrative-2"></a>
<a id="errors-concurrency-and-failure-recovery-2"></a>
<a id="required-verification-2"></a>
<a id="api-067--get-v1staffdeliverycod-handover"></a>
<a id="caller-permissions-and-dependencies-3"></a>
<a id="http-request-contract-3"></a>
<a id="success-response-illustrative-3"></a>
<a id="errors-concurrency-and-failure-recovery-3"></a>
<a id="required-verification-3"></a>
<a id="api-068--post-v1staffdeliveryriders"></a>
<a id="caller-permissions-and-dependencies-4"></a>
<a id="http-request-contract-4"></a>
<a id="success-response-illustrative-4"></a>
<a id="errors-concurrency-and-failure-recovery-4"></a>
<a id="required-verification-4"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-064 | `GET /v1/staff/delivery/tasks` | Read the dispatch queue of current delivery assignments. | Complete proposed |
| API-065 | `POST /v1/staff/delivery/tasks/{task_id}/assign` | Assign or reassign an existing dispatch task to an eligible rider. | Complete proposed |
| API-066 | `POST /v1/staff/delivery/tasks/{task_id}/resolution` | Resolve a failed delivery through an approved next action. | Incomplete — D-010/D-011: reattempt limits, custody and precise action-to-status progression need approved policy. |
| API-067 | `GET /v1/staff/delivery/cod-handover` | Read collected-versus-deposited COD evidence for dispatch handover. | Complete proposed |
| API-068 | `POST /v1/staff/delivery/riders` | Attach an already verified rider identity to a delivery site. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| DLV-01 | Live map of riders (available, on delivery, offline) and orders ready for pickup | API-064 |
| DLV-02 | Suggest the nearest available rider; staff confirm or choose another | API-065 |
| DLV-03 | Failed-delivery queue: reattempt, reschedule or return to store | API-066 |
| DLV-04 | COD handover: cash collected vs deposited per rider per day | API-067 |
| DLV-05 | Rider management: onboard, assign location, shifts | API-068 |

## API-064 — GET `/v1/staff/delivery/tasks`

**Read the dispatch queue of current delivery assignments.**

| Property | Proposed contract |
| --- | --- |
| API name | Read the dispatch queue of current delivery assignments |
| Version / owner | v1 / Delivery_Operations |
| Consumer | Delivery Dispatcher |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `DLV-01`; [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/delivery/tasks` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Delivery Dispatcher | delivery.tasks.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

task_id is public delivery_assignments.id, not shipment ID. Apply dispatch site scope through shipment/package/fulfillment chain before pagination.

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
| status | string | Optional | No | None | minLength=1; maxLength=32 | logistics.delivery_assignments.status; character varying(32). |


Only declared query fields are accepted. Sorting is fixed: `assigned_at ASC, id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `TaskListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `tasks` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `tasks[].taskId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | logistics.delivery_assignments.id; uuid. |
| `tasks[].shipmentId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | logistics.delivery_assignments.shipment_id; uuid. |
| `tasks[].riderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | logistics.delivery_assignments.delivery_user_id; uuid. |
| `tasks[].status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | logistics.delivery_assignments.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |
| `tasks[].isCurrent` | boolean | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | logistics.delivery_assignments.is_current; boolean. |
| `tasks[].assignedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | logistics.delivery_assignments.assigned_at; timestamp with time zone. |
| `tasks[].assignmentVersion` | integer | Required | No | None (not silently populated) | minimum=0 | logistics.delivery_assignments.row_version; bigint. |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "taskId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "shipmentId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "riderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "status": "assigned",
        "isCurrent": true,
        "assignedAt": "2026-10-24T10:30:00Z",
        "assignmentVersion": 1
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-064. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks delivery.tasks.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-064 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`logistics.delivery_assignments`](../../04-Database/Tables/logistics/delivery_assignments.md) | Read | `accepted_at`, `assigned_at`, `delivery_user_id`, `ended_at`, `id`, `is_current`, `row_version`, `shipment_id`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | Read | `id`, `order_id`, `order_revision_id`, `package_id`, `row_version`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`fulfillment.packages`](../../04-Database/Tables/fulfillment/packages.md) | Read | `id`, `row_version`, `status` | Store_Operations / Fulfillment owner projection / scoped joins; reading does not grant writes. |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | Read | `id`, `location_id`, `organization_id`, `row_version`, `status`, `user_id` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.tasks[].taskId | logistics.delivery_assignments.id |
| data.tasks[].shipmentId | logistics.delivery_assignments.shipment_id |
| data.tasks[].riderId | logistics.delivery_assignments.delivery_user_id |
| data.tasks[].status | logistics.delivery_assignments.status |
| data.tasks[].isCurrent | logistics.delivery_assignments.is_current |
| data.tasks[].assignedAt | logistics.delivery_assignments.assigned_at |
| data.tasks[].assignmentVersion | logistics.delivery_assignments.row_version |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`logistics.carriers`](../../04-Database/Tables/logistics/carriers.md), [`organization.departments`](../../04-Database/Tables/organization/departments.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | task_id is public delivery_assignments.id, not shipment ID. Apply dispatch site scope through shipment/package/fulfillment chain before pagination. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; assigned_at ASC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Unassigned shipments are a queue-design gap tracked separately; do not fabricate an assignment ID. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-064-HAPPY` | Valid Delivery Dispatcher context and documented fixture for read the dispatch queue of current delivery assignments. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-064-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-064-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-064-SCOPE` | Use another customer/site/patient/task reference or remove delivery.tasks.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-064-RULE` | task_id is public delivery_assignments.id, not shipment ID. Apply dispatch site scope through shipment/package/fulfillment chain before pagination. | Unassigned shipments are a queue-design gap tracked separately; do not fabricate an assignment ID. |
| `CT-API-064-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-064-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-064-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-064-RECOVERY` | Dependency timeout during read the dispatch queue of current delivery assignments. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-DLV-01-OK`, `TC-DLV-01-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-065 — POST `/v1/staff/delivery/tasks/{task_id}/assign`

**Assign or reassign an existing dispatch task to an eligible rider.**

| Property | Proposed contract |
| --- | --- |
| API name | Assign or reassign an existing dispatch task to an eligible rider |
| Version / owner | v1 / Delivery_Operations |
| Consumer | Delivery Dispatcher |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `DLV-02`; [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/delivery/tasks/{task_id}/assign` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Delivery Dispatcher | delivery.assign (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Require available authorized rider with active shift/site scope. Reassignment retires prior assignment and inserts one new current row; unique current shipment assignment prevents two winners. Initial assignment for a shipment without a task is a separate missing operation.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-065_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| task_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `AssignmentRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedAssignmentVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `riderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Active authorized identity.users.id; not proof of rider permission. |


```json
{
  "expectedAssignmentVersion": 4,
  "riderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `AssignmentData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `taskId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | logistics.delivery_assignments.id; uuid. |
| `shipmentId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | logistics.delivery_assignments.shipment_id; uuid. |
| `riderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | logistics.delivery_assignments.delivery_user_id; uuid. |
| `status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | logistics.delivery_assignments.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |
| `isCurrent` | boolean | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | logistics.delivery_assignments.is_current; boolean. |
| `assignedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | logistics.delivery_assignments.assigned_at; timestamp with time zone. |
| `assignmentVersion` | integer | Required | No | None (not silently populated) | minimum=0 | logistics.delivery_assignments.row_version; bigint. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "taskId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "shipmentId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "riderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "status": "assigned",
    "isCurrent": true,
    "assignedAt": "2026-10-24T10:30:00Z",
    "assignmentVersion": 1
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-065. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks delivery.assign or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for assign or reassign an existing dispatch task to an eligible rider. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Require available authorized rider with active shift/site scope. Reassignment retires prior assignment and inserts one new current row; unique current shipment assignment prevents two winners. Initial assignment for a shipment without a task is a separate missing operation. | No unauthorized/partial domain effect; redact sensitive context. | Old rider requests fail after reassignment; picked-up parcel requires approved custody-resolution path rather than blind reassignment. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current assign or reassign an existing dispatch task to an eligible rider. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Old rider requests fail after reassignment; picked-up parcel requires approved custody-resolution path rather than blind reassignment. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-065 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`logistics.delivery_assignments`](../../04-Database/Tables/logistics/delivery_assignments.md) | Read | `accepted_at`, `assigned_at`, `delivery_user_id`, `ended_at`, `id`, `is_current`, `row_version`, `shipment_id`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | Read | `id`, `order_id`, `order_revision_id`, `row_version`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.rider_shifts`](../../04-Database/Tables/logistics/rider_shifts.md) | Read | `id`, `rider_user_id` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | Read | `id`, `is_active`, `row_version`, `user_id`, `valid_from`, `valid_until` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | Read | `id`, `location_id`, `organization_id`, `row_version`, `status`, `user_id` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`logistics.delivery_assignments`](../../04-Database/Tables/logistics/delivery_assignments.md) | Create/update evidence | `shipment_id`, `delivery_user_id`, `assigned_at`, `status`, `is_current`, `ended_at` | Delivery_Operations owns these writes; Delivery_Operations must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedAssignmentVersion | logistics.delivery_assignments.row_version |
| request.riderId | Active authorized identity.users.id; not proof of rider permission. |
| data.taskId | logistics.delivery_assignments.id |
| data.shipmentId | logistics.delivery_assignments.shipment_id |
| data.riderId | logistics.delivery_assignments.delivery_user_id |
| data.status | logistics.delivery_assignments.status |
| data.isCurrent | logistics.delivery_assignments.is_current |
| data.assignedAt | logistics.delivery_assignments.assigned_at |
| data.assignmentVersion | logistics.delivery_assignments.row_version |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`logistics.carriers`](../../04-Database/Tables/logistics/carriers.md), [`organization.departments`](../../04-Database/Tables/organization/departments.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Require available authorized rider with active shift/site scope. Reassignment retires prior assignment and inserts one new current row; unique current shipment assignment prevents two winners. Initial assignment for a shipment without a task is a separate missing operation. |
| Idempotency | Required key: scope actor + API-065 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Old rider requests fail after reassignment; picked-up parcel requires approved custody-resolution path rather than blind reassignment. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-065-HAPPY` | Valid Delivery Dispatcher context and documented fixture for assign or reassign an existing dispatch task to an eligible rider. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-065-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-065-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-065-SCOPE` | Use another customer/site/patient/task reference or remove delivery.assign. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-065-RULE` | Require available authorized rider with active shift/site scope. Reassignment retires prior assignment and inserts one new current row; unique current shipment assignment prevents two winners. Initial assignment for a shipment without a task is a separate missing operation. | Old rider requests fail after reassignment; picked-up parcel requires approved custody-resolution path rather than blind reassignment. |
| `CT-API-065-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-065-CONCURRENCY` | Race two assign or reassign an existing dispatch task to an eligible rider. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-065-STATE` | Apply command after Old rider requests fail after reassignment; picked-up parcel requires approved custody-resolution path rather than blind reassignment. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-065-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Old rider requests fail after reassignment; picked-up parcel requires approved custody-resolution path rather than blind reassignment. |

Existing feature assertions: `TC-DLV-02-OK`, `TC-DLV-02-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-066 — POST `/v1/staff/delivery/tasks/{task_id}/resolution`

**Resolve a failed delivery through an approved next action.**

| Property | Proposed contract |
| --- | --- |
| API name | Resolve a failed delivery through an approved next action |
| Version / owner | v1 / Delivery_Operations |
| Consumer | Delivery Dispatcher |
| Status | Documentation Incomplete; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `DLV-03`; [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/delivery/tasks/{task_id}/resolution` (placeholder host from existing OpenAPI; no deployment asserted) |


**Remaining contract gap:** D-010/D-011: reattempt limits, custody and precise action-to-status progression need approved policy.

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Delivery Dispatcher | delivery.exceptions.resolve (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Failed-delivery evidence is required; reschedule needs nextAttemptAt. Keep parcel custody, cash and order outcome separate; no implicit return receipt or refund.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-066_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| task_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `DeliveryResolutionRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedAssignmentVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `action` | string | Required | No | None (not silently populated) | enum=["reattempt", "reschedule", "return_to_origin"] | API-only command selector; see per-operation legal state/field effects. |
| `reasonCode` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | logistics.ndr_cases.reason_code; character varying(64). |
| `nextAttemptAt` | string (date-time) | Optional | No | None (not silently populated) | format="date-time" | Public DTO value from logistics.ndr_cases.next_attempt_at. Ownership and current-state checks apply before use. |


```json
{
  "expectedAssignmentVersion": 4,
  "action": "reattempt",
  "reasonCode": "CUSTOMER_REQUEST",
  "nextAttemptAt": "2026-10-24T10:30:00Z"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `DeliveryResolutionData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `caseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | logistics.ndr_cases.id; uuid. |
| `shipmentId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | logistics.ndr_cases.shipment_id; uuid. |
| `status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | logistics.ndr_cases.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |
| `nextAction` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=64 | logistics.ndr_cases.next_action; character varying(64). |
| `nextAttemptAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | logistics.ndr_cases.next_attempt_at; timestamp with time zone. |
| `resolvedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | logistics.ndr_cases.resolved_at; timestamp with time zone. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "caseId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "shipmentId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "status": "open",
    "nextAction": null,
    "nextAttemptAt": null,
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-066. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks delivery.exceptions.resolve or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for resolve a failed delivery through an approved next action. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Failed-delivery evidence is required; reschedule needs nextAttemptAt. Keep parcel custody, cash and order outcome separate; no implicit return receipt or refund. | No unauthorized/partial domain effect; redact sensitive context. | Unsupported custody transition leaves case open; dispatch investigates rather than marking delivered. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current resolve a failed delivery through an approved next action. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Unsupported custody transition leaves case open; dispatch investigates rather than marking delivered. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-066 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`logistics.delivery_assignments`](../../04-Database/Tables/logistics/delivery_assignments.md) | Read | `accepted_at`, `delivery_user_id`, `ended_at`, `id`, `is_current`, `row_version`, `shipment_id`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | Read | `id`, `order_id`, `order_revision_id`, `row_version`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.delivery_attempts`](../../04-Database/Tables/logistics/delivery_attempts.md) | Read | `delivery_user_id`, `id`, `reason_code`, `reason_code_id`, `row_version`, `shipment_id`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.ndr_cases`](../../04-Database/Tables/logistics/ndr_cases.md) | Read | `id`, `next_action`, `next_attempt_at`, `reason_code`, `reason_code_id`, `resolved_at`, `row_version`, `shipment_id`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.delivery_failure_reasons`](../../04-Database/Tables/logistics/delivery_failure_reasons.md) | Read | `id`, `is_active`, `row_version` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.ndr_cases`](../../04-Database/Tables/logistics/ndr_cases.md) | Create/update evidence | `shipment_id`, `reason_code`, `status`, `next_action`, `next_attempt_at`, `resolved_at` | Delivery_Operations owns these writes; Delivery_Operations must invoke that narrow owner command. |
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | Create/update evidence | `status` | Delivery_Operations owns these writes; Delivery_Operations must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedAssignmentVersion | logistics.delivery_assignments.row_version |
| request.action | API-only command selector; see per-operation legal state/field effects. |
| request.reasonCode | logistics.ndr_cases.reason_code |
| request.nextAttemptAt | logistics.ndr_cases.next_attempt_at |
| data.caseId | logistics.ndr_cases.id |
| data.shipmentId | logistics.ndr_cases.shipment_id |
| data.status | logistics.ndr_cases.status |
| data.nextAction | logistics.ndr_cases.next_action |
| data.nextAttemptAt | logistics.ndr_cases.next_attempt_at |
| data.resolvedAt | logistics.ndr_cases.resolved_at |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`logistics.carriers`](../../04-Database/Tables/logistics/carriers.md), [`logistics.delivery_failure_reasons`](../../04-Database/Tables/logistics/delivery_failure_reasons.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Failed-delivery evidence is required; reschedule needs nextAttemptAt. Keep parcel custody, cash and order outcome separate; no implicit return receipt or refund. |
| Idempotency | Required key: scope actor + API-066 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Unsupported custody transition leaves case open; dispatch investigates rather than marking delivered. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-066-HAPPY` | Valid Delivery Dispatcher context and documented fixture for resolve a failed delivery through an approved next action. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-066-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-066-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-066-SCOPE` | Use another customer/site/patient/task reference or remove delivery.exceptions.resolve. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-066-RULE` | Failed-delivery evidence is required; reschedule needs nextAttemptAt. Keep parcel custody, cash and order outcome separate; no implicit return receipt or refund. | Unsupported custody transition leaves case open; dispatch investigates rather than marking delivered. |
| `CT-API-066-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-066-CONCURRENCY` | Race two resolve a failed delivery through an approved next action. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-066-STATE` | Apply command after Unsupported custody transition leaves case open; dispatch investigates rather than marking delivered. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-066-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Unsupported custody transition leaves case open; dispatch investigates rather than marking delivered. |

Existing feature assertions: `TC-DLV-03-OK`, `TC-DLV-03-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-067 — GET `/v1/staff/delivery/cod-handover`

**Read collected-versus-deposited COD evidence for dispatch handover.**

| Property | Proposed contract |
| --- | --- |
| API name | Read collected-versus-deposited COD evidence for dispatch handover |
| Version / owner | v1 / Finance_Payments projection for Delivery_Operations |
| Consumer | Cash Receiver / Delivery Supervisor |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `DLV-04`; [WF-009](../../06-Workflows/WF-009-COD-Collection.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/delivery/cod-handover` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Cash Receiver / Delivery Supervisor | finance.cod.handover.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Only authorized rider/site/date scope; amount is Finance fact. No row is updated and collected cash is not bank settlement.

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
| riderId | string (uuid) | Optional | No | None | format="uuid" | Optional allowlisted filter; does not widen authenticated scope. |
| status | string | Optional | No | None | minLength=1; maxLength=32 | payment.cod_collections.status; character varying(32). |


Only declared query fields are accepted. Sorting is fixed: `collected_at ASC, id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `CodListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `collections` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `collections[].collectionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | payment.cod_collections.id; uuid. |
| `collections[].orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | payment.cod_collections.order_id; uuid. |
| `collections[].shipmentId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | payment.cod_collections.shipment_id; uuid. |
| `collections[].riderId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | payment.cod_collections.collected_by_user_id; uuid. |
| `collections[].amount` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | payment.cod_collections.amount; numeric(16,2). |
| `collections[].status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | payment.cod_collections.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |
| `collections[].collectedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | payment.cod_collections.collected_at; timestamp with time zone. |
| `collections[].depositedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | payment.cod_collections.deposited_at; timestamp with time zone. |
| `collections[].rowVersion` | integer | Required | No | None (not silently populated) | minimum=0 | payment.cod_collections.row_version; bigint. |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "collections": [
      {
        "collectionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "shipmentId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "riderId": null,
        "amount": "26.25",
        "status": "pending",
        "collectedAt": null,
        "depositedAt": null,
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-067. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks finance.cod.handover.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-067 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`payment.cod_collections`](../../04-Database/Tables/payment/cod_collections.md) | Read | `amount`, `collected_at`, `collected_by_user_id`, `deposited_at`, `id`, `order_id`, `order_revision_id`, `row_version`, `shipment_id`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | Read | `id`, `order_id`, `order_revision_id`, `row_version`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.delivery_assignments`](../../04-Database/Tables/logistics/delivery_assignments.md) | Read | `accepted_at`, `delivery_user_id`, `ended_at`, `id`, `is_current`, `row_version`, `shipment_id`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | Read | `id`, `location_id`, `organization_id`, `row_version`, `status`, `user_id` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.collections[].collectionId | payment.cod_collections.id |
| data.collections[].orderId | payment.cod_collections.order_id |
| data.collections[].shipmentId | payment.cod_collections.shipment_id |
| data.collections[].riderId | payment.cod_collections.collected_by_user_id |
| data.collections[].amount | payment.cod_collections.amount |
| data.collections[].status | payment.cod_collections.status |
| data.collections[].collectedAt | payment.cod_collections.collected_at |
| data.collections[].depositedAt | payment.cod_collections.deposited_at |
| data.collections[].rowVersion | payment.cod_collections.row_version |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`logistics.carriers`](../../04-Database/Tables/logistics/carriers.md), [`organization.departments`](../../04-Database/Tables/organization/departments.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Only authorized rider/site/date scope; amount is Finance fact. No row is updated and collected cash is not bank settlement. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; collected_at ASC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Outstanding differences remain visible; a list query cannot approve or clear a shortage. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-067-HAPPY` | Valid Cash Receiver / Delivery Supervisor context and documented fixture for read collected-versus-deposited cod evidence for dispatch handover. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-067-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-067-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-067-SCOPE` | Use another customer/site/patient/task reference or remove finance.cod.handover.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-067-RULE` | Only authorized rider/site/date scope; amount is Finance fact. No row is updated and collected cash is not bank settlement. | Outstanding differences remain visible; a list query cannot approve or clear a shortage. |
| `CT-API-067-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-067-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-067-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-067-RECOVERY` | Dependency timeout during read collected-versus-deposited cod evidence for dispatch handover. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-DLV-04-OK`, `TC-DLV-04-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-068 — POST `/v1/staff/delivery/riders`

**Attach an already verified rider identity to a delivery site.**

| Property | Proposed contract |
| --- | --- |
| API name | Attach an already verified rider identity to a delivery site |
| Version / owner | v1 / Authentication_Access with Delivery_Operations membership command |
| Consumer | Delivery Administrator |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `DLV-05`; [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/staff/delivery/riders` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Delivery Administrator | delivery.riders.onboard (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Only delegated rider role grants for verified identity; no driver documents, license policy or mobile app activation is invented.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-068_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `RiderOnboardingRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `userId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Already verified staff identity; this does not replace authentication onboarding. |
| `organizationId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from organization.memberships.organization_id. Ownership and current-state checks apply before use. |
| `locationId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from organization.memberships.location_id. Ownership and current-state checks apply before use. |
| `riderRoleId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from identity.roles.id. Ownership and current-state checks apply before use. |


```json
{
  "userId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "organizationId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "locationId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "riderRoleId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **201**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `StaffData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `membershipId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | organization.memberships.id; uuid. |
| `staffId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | organization.memberships.user_id; uuid. |
| `organizationId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | organization.memberships.organization_id; uuid. |
| `locationId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | organization.memberships.location_id; uuid. |
| `status` | string | Required | No | None (not silently populated) | enum=["active", "inactive", "suspended", "archived"]; minLength=1; maxLength=16 | organization.memberships.status; character varying(16). |
| `rowVersion` | integer | Required | No | None (not silently populated) | minimum=0 | organization.memberships.row_version; bigint. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "membershipId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "staffId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "organizationId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "locationId": null,
    "status": "active",
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-068. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks delivery.riders.onboard or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for attach an already verified rider identity to a delivery site. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Only delegated rider role grants for verified identity; no driver documents, license policy or mobile app activation is invented. | No unauthorized/partial domain effect; redact sensitive context. | Duplicate membership is conflict/replay; qualification and release gating remain owner decisions. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Duplicate membership is conflict/replay; qualification and release gating remain owner decisions. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-068 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Read | `created_by`, `id`, `row_version`, `status`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | Read | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | Read | `created_by`, `id`, `location_id`, `manager_user_id`, `organization_id`, `row_version`, `status`, `updated_by`, `user_id` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | Read | `created_by`, `deleted_by`, `id`, `is_active`, `is_deleted`, `organization_id`, `row_version`, `updated_by` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | Create/update evidence | `user_id`, `organization_id`, `location_id`, `status` | Admin_CMS via Organization owner owns these writes; Authentication_Access with Delivery_Operations membership command must invoke that narrow owner command. |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | Create/update evidence | `user_id`, `role_id`, `scope_type`, `scope_id`, `is_active` | Authentication_Access owns these writes; Authentication_Access with Delivery_Operations membership command must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.userId | organization.memberships.user_id |
| request.organizationId | organization.memberships.organization_id |
| request.locationId | organization.memberships.location_id |
| request.riderRoleId | identity.roles.id |
| data.membershipId | organization.memberships.id |
| data.staffId | organization.memberships.user_id |
| data.organizationId | organization.memberships.organization_id |
| data.locationId | organization.memberships.location_id |
| data.status | organization.memberships.status |
| data.rowVersion | organization.memberships.row_version |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`organization.departments`](../../04-Database/Tables/organization/departments.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Only delegated rider role grants for verified identity; no driver documents, license policy or mobile app activation is invented. |
| Idempotency | Required key: scope actor + API-068 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Duplicate membership is conflict/replay; qualification and release gating remain owner decisions. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-068-HAPPY` | Valid Delivery Administrator context and documented fixture for attach an already verified rider identity to a delivery site. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-068-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-068-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-068-SCOPE` | Use another customer/site/patient/task reference or remove delivery.riders.onboard. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-068-RULE` | Only delegated rider role grants for verified identity; no driver documents, license policy or mobile app activation is invented. | Duplicate membership is conflict/replay; qualification and release gating remain owner decisions. |
| `CT-API-068-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-068-CONCURRENCY` | Race two attach an already verified rider identity to a delivery site. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-068-STATE` | Apply command after Duplicate membership is conflict/replay; qualification and release gating remain owner decisions. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-068-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Duplicate membership is conflict/replay; qualification and release gating remain owner decisions. |

Existing feature assertions: `TC-DLV-05-OK`, `TC-DLV-05-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
