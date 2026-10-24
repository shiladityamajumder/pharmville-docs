# Rider App API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](../../05-APIs/API-Contract-Coverage.md) · [OpenAPI 3.1](../../05-APIs/openapi.yaml) · [decisions](../../05-APIs/Planning-Decisions.md) · [DTO conventions](../../05-APIs/API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="rider-app-api-contracts"></a>
<a id="api-069--post-v1ridershifts"></a>
<a id="caller-permissions-and-dependencies"></a>
<a id="http-request-contract"></a>
<a id="success-response-illustrative"></a>
<a id="errors-concurrency-and-failure-recovery"></a>
<a id="required-verification"></a>
<a id="api-070--get-v1ridertasks"></a>
<a id="caller-permissions-and-dependencies-1"></a>
<a id="http-request-contract-1"></a>
<a id="success-response-illustrative-1"></a>
<a id="errors-concurrency-and-failure-recovery-1"></a>
<a id="required-verification-1"></a>
<a id="api-071--post-v1ridertaskstask_idpickup"></a>
<a id="caller-permissions-and-dependencies-2"></a>
<a id="http-request-contract-2"></a>
<a id="success-response-illustrative-2"></a>
<a id="errors-concurrency-and-failure-recovery-2"></a>
<a id="required-verification-2"></a>
<a id="api-072--post-v1ridertaskstask_idlocation"></a>
<a id="caller-permissions-and-dependencies-3"></a>
<a id="http-request-contract-3"></a>
<a id="success-response-illustrative-3"></a>
<a id="errors-concurrency-and-failure-recovery-3"></a>
<a id="required-verification-3"></a>
<a id="api-073--post-v1ridertaskstask_idcomplete"></a>
<a id="caller-permissions-and-dependencies-4"></a>
<a id="http-request-contract-4"></a>
<a id="success-response-illustrative-4"></a>
<a id="errors-concurrency-and-failure-recovery-4"></a>
<a id="required-verification-4"></a>
<a id="api-074--post-v1ridertaskstask_idfail"></a>
<a id="caller-permissions-and-dependencies-5"></a>
<a id="http-request-contract-5"></a>
<a id="success-response-illustrative-5"></a>
<a id="errors-concurrency-and-failure-recovery-5"></a>
<a id="required-verification-5"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-069 | `POST /v1/rider/shifts` | Start or end the authenticated rider’s accountable shift. | Complete proposed |
| API-070 | `GET /v1/rider/tasks` | Read only the rider’s current assigned delivery tasks. | Complete proposed |
| API-071 | `POST /v1/rider/tasks/{task_id}/pickup` | Accept parcel custody for the current rider assignment. | Complete proposed |
| API-072 | `POST /v1/rider/tasks/{task_id}/location` | Record a bounded location sample for an active assigned delivery. | Complete proposed |
| API-073 | `POST /v1/rider/tasks/{task_id}/complete` | Verify recipient proof and accept one actual delivery outcome. | Complete proposed |
| API-074 | `POST /v1/rider/tasks/{task_id}/fail` | Record an unsuccessful delivery attempt without losing custody facts. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| RID-01 | OTP login; on duty, off duty and break | API-069 |
| RID-02 | Task list; accept; open Google Maps to navigate; mark picked up | API-070, API-071 |
| RID-03 | Background location: every 5–10 s on delivery, 15–30 s idle | API-072 |
| RID-04 | Complete delivery with customer OTP and photo; record COD collected | API-073 |
| RID-05 | Door checks for prescription medicines | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| RID-06 | Failed attempt with a reason from a fixed list | API-074 |
| RID-07 | Daily deliveries and incentive earned | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |

## API-069 — POST `/v1/rider/shifts`

**Start or end the authenticated rider’s accountable shift.**

| Property | Proposed contract |
| --- | --- |
| API name | Start or end the authenticated rider’s accountable shift |
| Version / owner | v1 / Delivery_Operations |
| Consumer | Rider |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `RID-01`; [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/rider/shifts` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Rider | delivery.shift.manage.own (Proposed grant code) |


Authenticate the rider identity and own-shift action. Starting a shift requires no pre-existing active shift; serialize to prevent two active shifts. Ending resolves only the actor-bound shiftToken and checks current shift/custody, never a client-selected numeric ID.

rider_shifts has BIGINT id and no row_version. Use a signed API-only shiftToken and lock the resolved row/ended_at. One active shift per rider under rider-scoped lock. Ending requires current owned shiftToken and no unresolved active parcel custody; no shift for another actor can be closed.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-069_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `RiderShiftRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `action` | string | Required | No | None (not silently populated) | enum=["start", "end"] | API-only command selector; see per-operation legal state/field effects. |
| `shiftToken` | string | Optional | No | None (not silently populated) | minLength=1; maxLength=2048 | Required for end; signed opaque capability binding internal shift ID, actor and started_at. Never expose BIGINT ID. |


```json
{
  "action": "start"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `RiderShiftData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `startedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | logistics.rider_shifts.started_at; timestamp with time zone. |
| `endedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | logistics.rider_shifts.ended_at; timestamp with time zone. |
| `shiftToken` | string | Required | No | None (not silently populated) | minLength=1; maxLength=2048 | Required for end; signed opaque capability binding internal shift ID, actor and started_at. Never expose BIGINT ID. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "startedAt": "2026-10-24T10:30:00Z",
    "endedAt": null,
    "shiftToken": "pv_shift_c8N4p2R6m9K3v7X1"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-069. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks delivery.shift.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for start or end the authenticated rider’s accountable shift. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | rider_shifts has BIGINT id and no row_version. Use a signed API-only shiftToken and lock the resolved row/ended_at. One active shift per rider under rider-scoped lock. Ending requires current owned shiftToken and no unresolved active parcel custody; no shift for another actor can be closed. | No unauthorized/partial domain effect; redact sensitive context. | Duplicate start replays same shift; conflicting active shift/custody returns INVALID_STATE_TRANSITION for dispatch resolution. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Duplicate start replays same shift; conflicting active shift/custody returns INVALID_STATE_TRANSITION for dispatch resolution. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-069 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`logistics.rider_shifts`](../../04-Database/Tables/logistics/rider_shifts.md) | Read | `ended_at`, `id`, `rider_user_id`, `started_at` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.delivery_assignments`](../../04-Database/Tables/logistics/delivery_assignments.md) | Read | `accepted_at`, `delivery_user_id`, `ended_at`, `id`, `is_current`, `row_version`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.rider_shifts`](../../04-Database/Tables/logistics/rider_shifts.md) | Create/update evidence | `rider_user_id`, `started_at`, `ended_at` | Delivery_Operations owns these writes; Delivery_Operations must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.action | API-only command selector; see per-operation legal state/field effects. |
| request.shiftToken | API-only signed capability resolves BIGINT shift key after actor binding; no public ID column. |
| data.startedAt | logistics.rider_shifts.started_at |
| data.endedAt | logistics.rider_shifts.ended_at |
| data.shiftToken | API-only signed capability resolves BIGINT shift key after actor binding; no public ID column. |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | rider_shifts has BIGINT id and no row_version. Use a signed API-only shiftToken and lock the resolved row/ended_at. One active shift per rider under rider-scoped lock. Ending requires current owned shiftToken and no unresolved active parcel custody; no shift for another actor can be closed. |
| Idempotency | Required key: scope actor + API-069 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Duplicate start replays same shift; conflicting active shift/custody returns INVALID_STATE_TRANSITION for dispatch resolution. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-069-HAPPY` | Valid Rider context and documented fixture for start or end the authenticated rider’s accountable shift. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-069-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-069-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-069-SCOPE` | Use another customer/site/patient/task reference or remove delivery.shift.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-069-RULE` | rider_shifts has BIGINT id and no row_version. Use a signed API-only shiftToken and lock the resolved row/ended_at. One active shift per rider under rider-scoped lock. Ending requires current owned shiftToken and no unresolved active parcel custody; no shift for another actor can be closed. | Duplicate start replays same shift; conflicting active shift/custody returns INVALID_STATE_TRANSITION for dispatch resolution. |
| `CT-API-069-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-069-CONCURRENCY` | Race two start or end the authenticated rider’s accountable shift. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-069-STATE` | Apply command after Duplicate start replays same shift; conflicting active shift/custody returns INVALID_STATE_TRANSITION for dispatch resolution. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-069-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Duplicate start replays same shift; conflicting active shift/custody returns INVALID_STATE_TRANSITION for dispatch resolution. |

Existing feature assertions: `TC-RID-01-OK`, `TC-RID-01-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-070 — GET `/v1/rider/tasks`

**Read only the rider’s current assigned delivery tasks.**

| Property | Proposed contract |
| --- | --- |
| API name | Read only the rider’s current assigned delivery tasks |
| Version / owner | v1 / Delivery_Operations |
| Consumer | Rider |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `RID-02`; [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/rider/tasks` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Rider | delivery.tasks.read.own (Proposed grant code) |


Authenticate the rider and filter delivery_assignments.delivery_user_id to the subject and is_current=true. No caller must already know a task ID to list the own queue; an empty queue is valid. Parcel/customer fields require the separate current-assignment purpose check.

delivery_user_id equals JWT subject and is_current true; customer address access is a separately scoped projection, not raw account access.

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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-070. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks delivery.tasks.read.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-070 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | Read | `id`, `order_id`, `order_revision_id`, `row_version`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.rider_shifts`](../../04-Database/Tables/logistics/rider_shifts.md) | Read | `id`, `rider_user_id` | Delivery_Operations projection / scoped joins; reading does not grant writes. |

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

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`logistics.carriers`](../../04-Database/Tables/logistics/carriers.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | delivery_user_id equals JWT subject and is_current true; customer address access is a separately scoped projection, not raw account access. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; assigned_at ASC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Reassigned tasks disappear from this queue; cached old IDs cannot authorize writes. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-070-HAPPY` | Valid Rider context and documented fixture for read only the rider’s current assigned delivery tasks. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-070-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-070-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-070-SCOPE` | Use another customer/site/patient/task reference or remove delivery.tasks.read.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-070-RULE` | delivery_user_id equals JWT subject and is_current true; customer address access is a separately scoped projection, not raw account access. | Reassigned tasks disappear from this queue; cached old IDs cannot authorize writes. |
| `CT-API-070-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-070-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-070-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-070-RECOVERY` | Dependency timeout during read only the rider’s current assigned delivery tasks. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-RID-02-OK`, `TC-RID-02-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-071 — POST `/v1/rider/tasks/{task_id}/pickup`

**Accept parcel custody for the current rider assignment.**

| Property | Proposed contract |
| --- | --- |
| API name | Accept parcel custody for the current rider assignment |
| Version / owner | v1 / Delivery_Operations with Fulfillment handoff command |
| Consumer | Rider |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `RID-02`; [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/rider/tasks/{task_id}/pickup` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Rider | delivery.pickup.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require active rider identity/shift and the current assigned task before exposing parcel/customer data.

Current assigned rider/shift only; package matches task shipment and current accepted revision. Dispatch guard requires exact committed stock, completed package, active clinical/license gates and full trusted capture or approved shipment COD. Fulfillment packed becomes handed_over through its owner command.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-071_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `PickupRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `assignmentVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `packageId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Exact shipment package with sealed completed evidence. |


```json
{
  "assignmentVersion": 4,
  "packageId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-071. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks delivery.pickup.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for accept parcel custody for the current rider assignment. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Current assigned rider/shift only; package matches task shipment and current accepted revision. Dispatch guard requires exact committed stock, completed package, active clinical/license gates and full trusted capture or approved shipment COD. Fulfillment packed becomes handed_over through its owner command. | No unauthorized/partial domain effect; redact sensitive context. | Payment redirect or uncommitted hold cannot authorize pickup. Old assignment or unsealed package blocks custody change. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current accept parcel custody for the current rider assignment. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Payment redirect or uncommitted hold cannot authorize pickup. Old assignment or unsealed package blocks custody change. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-071 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | Read | `id`, `order_id`, `order_revision_id`, `package_id`, `row_version`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`fulfillment.packages`](../../04-Database/Tables/fulfillment/packages.md) | Read | `fulfillment_order_id`, `id`, `row_version`, `status` | Store_Operations / Fulfillment owner projection / scoped joins; reading does not grant writes. |
| [`fulfillment.fulfillment_orders`](../../04-Database/Tables/fulfillment/fulfillment_orders.md) | Read | `id`, `order_id`, `order_revision_id`, `row_version`, `status`, `warehouse_id` | Store_Operations / Fulfillment owner projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_reservations`](../../04-Database/Tables/warehouse/stock_reservations.md) | Read | `expires_at`, `id`, `order_id`, `order_item_id`, `order_revision_id`, `row_version`, `status`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `internal_id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | Read | `id`, `order_id`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`payment.payment_intents`](../../04-Database/Tables/payment/payment_intents.md) | Read | `expires_at`, `id`, `order_id`, `order_revision_id`, `row_version`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`payment.cod_collections`](../../04-Database/Tables/payment/cod_collections.md) | Read | `id`, `order_id`, `order_revision_id`, `row_version`, `shipment_id`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | Read | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | Read | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `review_id`, `row_version` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`organization.licenses`](../../04-Database/Tables/organization/licenses.md) | Read | `expires_at`, `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `verification_status` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`logistics.delivery_assignments`](../../04-Database/Tables/logistics/delivery_assignments.md) | Create/update evidence | `accepted_at`, `status` | Delivery_Operations owns these writes; Delivery_Operations with Fulfillment handoff command must invoke that narrow owner command. |
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | Create/update evidence | `status`, `dispatched_at` | Delivery_Operations owns these writes; Delivery_Operations with Fulfillment handoff command must invoke that narrow owner command. |
| [`logistics.shipment_events`](../../04-Database/Tables/logistics/shipment_events.md) | Create/update evidence | `shipment_id`, `event_code`, `event_time`, `status`, `raw_payload` | Delivery_Operations owns these writes; Delivery_Operations with Fulfillment handoff command must invoke that narrow owner command. |
| [`fulfillment.fulfillment_orders`](../../04-Database/Tables/fulfillment/fulfillment_orders.md) | Create/update evidence | `status` | Store_Operations / Fulfillment owner owns these writes; Delivery_Operations with Fulfillment handoff command must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.assignmentVersion | logistics.delivery_assignments.row_version |
| request.packageId | logistics.shipments.package_id |
| data.taskId | logistics.delivery_assignments.id |
| data.shipmentId | logistics.delivery_assignments.shipment_id |
| data.riderId | logistics.delivery_assignments.delivery_user_id |
| data.status | logistics.delivery_assignments.status |
| data.isCurrent | logistics.delivery_assignments.is_current |
| data.assignedAt | logistics.delivery_assignments.assigned_at |
| data.assignmentVersion | logistics.delivery_assignments.row_version |

**Transaction:** Proposed local transaction: Delivery writes custody/dispatch evidence and invokes the guarded Fulfillment handed_over command on same transaction handle. Inventory and Finance evidence is read-only; if interface cannot share a transaction, handoff stays pending until owner acknowledgment. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`clinical.review_reason_codes`](../../04-Database/Tables/clinical/review_reason_codes.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`logistics.carriers`](../../04-Database/Tables/logistics/carriers.md), [`marketplace.sellers`](../../04-Database/Tables/marketplace/sellers.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md), [`warehouse.bins`](../../04-Database/Tables/warehouse/bins.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Current assigned rider/shift only; package matches task shipment and current accepted revision. Dispatch guard requires exact committed stock, completed package, active clinical/license gates and full trusted capture or approved shipment COD. Fulfillment packed becomes handed_over through its owner command. |
| Idempotency | Required key: scope actor + API-071 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Payment redirect or uncommitted hold cannot authorize pickup. Old assignment or unsealed package blocks custody change. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-071-HAPPY` | Valid Rider context and documented fixture for accept parcel custody for the current rider assignment. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-071-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-071-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-071-SCOPE` | Use another customer/site/patient/task reference or remove delivery.pickup.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-071-RULE` | Current assigned rider/shift only; package matches task shipment and current accepted revision. Dispatch guard requires exact committed stock, completed package, active clinical/license gates and full trusted capture or approved shipment COD. Fulfillment packed becomes handed_over through its owner command. | Payment redirect or uncommitted hold cannot authorize pickup. Old assignment or unsealed package blocks custody change. |
| `CT-API-071-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-071-CONCURRENCY` | Race two accept parcel custody for the current rider assignment. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-071-STATE` | Apply command after Payment redirect or uncommitted hold cannot authorize pickup. Old assignment or unsealed package blocks custody change. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-071-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Payment redirect or uncommitted hold cannot authorize pickup. Old assignment or unsealed package blocks custody change. |

Existing feature assertions: `TC-RID-02-OK`, `TC-RID-02-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-072 — POST `/v1/rider/tasks/{task_id}/location`

**Record a bounded location sample for an active assigned delivery.**

| Property | Proposed contract |
| --- | --- |
| API name | Record a bounded location sample for an active assigned delivery |
| Version / owner | v1 / Delivery_Operations |
| Consumer | Rider |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `RID-03`; [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/rider/tasks/{task_id}/location` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Rider | delivery.location.write.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require active rider identity/shift and the current assigned task before exposing parcel/customer data.

Only during active shift/current assignment. source derives from authenticated app; received_at is server time, captured recordedAt is untrusted chronology and cannot prove delivery. Do not expose tracking outside authorized delivery purpose.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-072_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `LocationUpdateRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `assignmentVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `latitude` | number | Required | No | None (not silently populated) | minimum=-90; maximum=90 | Public DTO value from logistics.delivery_location_updates.latitude. Ownership and current-state checks apply before use. |
| `longitude` | number | Required | No | None (not silently populated) | minimum=-180; maximum=180 | Public DTO value from logistics.delivery_location_updates.longitude. Ownership and current-state checks apply before use. |
| `accuracyM` | number | Optional | No | None (not silently populated) | minimum=0; maximum=100000 | Public DTO value from logistics.delivery_location_updates.accuracy_m. Ownership and current-state checks apply before use. |
| `recordedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | Public DTO value from logistics.delivery_location_updates.recorded_at. Ownership and current-state checks apply before use. |


```json
{
  "assignmentVersion": 4,
  "latitude": 28.5701,
  "longitude": 77.321,
  "accuracyM": 15.5,
  "recordedAt": "2026-10-24T10:30:00Z"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **201**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `LocationUpdateData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `assignmentId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | logistics.delivery_location_updates.assignment_id; uuid. |
| `recordedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | logistics.delivery_location_updates.recorded_at; timestamp with time zone. |
| `receivedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | logistics.delivery_location_updates.received_at; timestamp with time zone. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "assignmentId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "recordedAt": "2026-10-24T10:30:00Z",
    "receivedAt": "2026-10-24T10:30:00Z"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-072. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks delivery.location.write.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for record a bounded location sample for an active assigned delivery. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Only during active shift/current assignment. source derives from authenticated app; received_at is server time, captured recordedAt is untrusted chronology and cannot prove delivery. Do not expose tracking outside authorized delivery purpose. | No unauthorized/partial domain effect; redact sensitive context. | Old assignment or forbidden capture window rejects update; offline samples remain unconfirmed until scope and approved retention policy pass. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current record a bounded location sample for an active assigned delivery. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Old assignment or forbidden capture window rejects update; offline samples remain unconfirmed until scope and approved retention policy pass. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-072 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`logistics.delivery_assignments`](../../04-Database/Tables/logistics/delivery_assignments.md) | Read | `accepted_at`, `delivery_user_id`, `ended_at`, `id`, `is_current`, `row_version`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.rider_shifts`](../../04-Database/Tables/logistics/rider_shifts.md) | Read | `id`, `rider_user_id` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.delivery_location_updates`](../../04-Database/Tables/logistics/delivery_location_updates.md) | Create/update evidence | `assignment_id`, `delivery_user_id`, `shift_id`, `latitude`, `longitude`, `accuracy_m`, `recorded_at`, `received_at`, `source` | Delivery_Operations owns these writes; Delivery_Operations must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.assignmentVersion | logistics.delivery_assignments.row_version |
| request.latitude | logistics.delivery_location_updates.latitude |
| request.longitude | logistics.delivery_location_updates.longitude |
| request.accuracyM | logistics.delivery_location_updates.accuracy_m |
| request.recordedAt | logistics.delivery_location_updates.recorded_at |
| data.assignmentId | logistics.delivery_location_updates.assignment_id |
| data.recordedAt | logistics.delivery_location_updates.recorded_at |
| data.receivedAt | logistics.delivery_location_updates.received_at |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Only during active shift/current assignment. source derives from authenticated app; received_at is server time, captured recordedAt is untrusted chronology and cannot prove delivery. Do not expose tracking outside authorized delivery purpose. |
| Idempotency | Required key: scope actor + API-072 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 60 samples/minute per rider + assignment; privacy/cadence D-011 approval required. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Old assignment or forbidden capture window rejects update; offline samples remain unconfirmed until scope and approved retention policy pass. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-072-HAPPY` | Valid Rider context and documented fixture for record a bounded location sample for an active assigned delivery. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-072-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-072-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-072-SCOPE` | Use another customer/site/patient/task reference or remove delivery.location.write.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-072-RULE` | Only during active shift/current assignment. source derives from authenticated app; received_at is server time, captured recordedAt is untrusted chronology and cannot prove delivery. Do not expose tracking outside authorized delivery purpose. | Old assignment or forbidden capture window rejects update; offline samples remain unconfirmed until scope and approved retention policy pass. |
| `CT-API-072-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-072-CONCURRENCY` | Race two record a bounded location sample for an active assigned delivery. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-072-STATE` | Apply command after Old assignment or forbidden capture window rejects update; offline samples remain unconfirmed until scope and approved retention policy pass. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-072-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Old assignment or forbidden capture window rejects update; offline samples remain unconfirmed until scope and approved retention policy pass. |

Existing feature assertions: `TC-RID-03-OK`, `TC-RID-03-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-073 — POST `/v1/rider/tasks/{task_id}/complete`

**Verify recipient proof and accept one actual delivery outcome.**

| Property | Proposed contract |
| --- | --- |
| API name | Verify recipient proof and accept one actual delivery outcome |
| Version / owner | v1 / Delivery_Operations with Finance COD command |
| Consumer | Rider |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `RID-04`; [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/rider/tasks/{task_id}/complete` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Rider | delivery.complete.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require active rider identity/shift and the current assigned task before exposing parcel/customer data.

task_id aliases delivery_assignments.id. Check current rider/version, shipment state, server OTP digest/expiry/attempts and mandatory clean private photo proof (RID-04). Consume OTP and record evidence once; optional COD must equal Finance-approved due and currency from order. proofFileId is singular per schema.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-073_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `DeliveryCompletionRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `assignmentVersion` | integer | Required | No | None (not silently populated) | minimum=1 | logistics.delivery_assignments.row_version. |
| `otpChallengeId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public logistics.delivery_otp_challenges.id. |
| `otp` | string | Required | No | None (not silently populated) | minLength=1 | Secret proof checked against otp_digest; never persisted or logged in cleartext. |
| `proofFileId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Mandatory RID-04 photo: one available clean private JPEG/PNG file bound to this task/actor/purpose; a PDF or another customer file is invalid. |
| `codCollected` | object | Optional | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `codCollected.amount` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^(0\|[1-9][0-9]{0,13})(\\.[0-9]{1,2})?$" | Actual cash tendered; exact Finance-approved due must match. |
| `codCollected.currency` | string | Required | No | None (not silently populated) | minLength=1; maxLength=3; pattern="^[A-Z]{3}$" | Compared to order currency; not a cod_collections column. |


```json
{
  "assignmentVersion": 1,
  "otpChallengeId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "otp": "583914",
  "proofFileId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
}
```

File upload: Not Applicable to this JSON operation. Referenced file UUIDs must resolve to owned/authorized private objects; validate size/type, complete storage metadata and clean scan before use. Never accept a caller-controlled storage path/public URL.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `DeliveryCompletionData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `assignmentId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from logistics.delivery_assignments.id. Ownership and current-state checks apply before use. |
| `shipmentId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from logistics.shipments.id. Ownership and current-state checks apply before use. |
| `shipmentStatus` | string | Required | No | None (not silently populated) | enum=["delivered"] | logistics.shipments.status. |
| `completedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | Public DTO value from logistics.delivery_assignments.completed_at. Ownership and current-state checks apply before use. |
| `codCollectionId` | string/null (uuid) | Optional | Yes | None (not silently populated) | format="uuid" | Public DTO value from payment.cod_collections.id. Ownership and current-state checks apply before use. |
| `codCollectionStatus` | string/null | Optional | Yes | None (not silently populated) | enum=["collected", null] | Finance-confirmed collection status from payment.cod_collections.status; absent/null for non-COD. Collection is distinct from deposited/remitted/settled. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "assignmentId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "shipmentId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "shipmentStatus": "delivered",
    "completedAt": "2026-10-24T10:30:00Z"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-073. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks delivery.complete.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for verify recipient proof and accept one actual delivery outcome. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | task_id aliases delivery_assignments.id. Check current rider/version, shipment state, server OTP digest/expiry/attempts and mandatory clean private photo proof (RID-04). Consume OTP and record evidence once; optional COD must equal Finance-approved due and currency from order. proofFileId is singular per schema. | No unauthorized/partial domain effect; redact sensitive context. | Wrong OTP increments attempts without accepting delivery; expired/offline stale assignment cannot complete. Lost successful response replays prior result; deposited/settled cash is not claimed. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current verify recipient proof and accept one actual delivery outcome. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Wrong OTP increments attempts without accepting delivery; expired/offline stale assignment cannot complete. Lost successful response replays prior result; deposited/settled cash is not claimed. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-073 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`logistics.delivery_assignments`](../../04-Database/Tables/logistics/delivery_assignments.md) | Read | `accepted_at`, `completed_at`, `delivery_user_id`, `ended_at`, `id`, `is_current`, `row_version`, `shipment_id`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | Read | `id`, `order_id`, `order_revision_id`, `row_version`, `shipping_label_file_id`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.delivery_otp_challenges`](../../04-Database/Tables/logistics/delivery_otp_challenges.md) | Read | `assignment_id`, `attempt_count`, `expires_at`, `id`, `max_attempts`, `otp_digest`, `shipment_id`, `status`, `verified_at` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.delivery_attempts`](../../04-Database/Tables/logistics/delivery_attempts.md) | Read | `delivery_user_id`, `id`, `proof_file_id`, `row_version`, `shipment_id`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`platform.file_objects`](../../04-Database/Tables/platform/file_objects.md) | Read | `access_type`, `classification`, `id`, `is_deleted`, `malware_scan_status`, `owner_id`, `owner_type`, `row_version`, `sha256`, `size_bytes`, `status` | Platform file service projection / scoped joins; reading does not grant writes. |
| [`platform.file_access_grants`](../../04-Database/Tables/platform/file_access_grants.md) | Read | `expires_at`, `file_object_id`, `id`, `row_version` | Platform file service projection / scoped joins; reading does not grant writes. |
| [`payment.cod_collections`](../../04-Database/Tables/payment/cod_collections.md) | Read | `amount`, `id`, `order_id`, `order_revision_id`, `row_version`, `shipment_id`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `currency`, `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.delivery_otp_challenges`](../../04-Database/Tables/logistics/delivery_otp_challenges.md) | Create/update evidence | `attempt_count`, `status`, `verified_at` | Delivery_Operations owns these writes; Delivery_Operations with Finance COD command must invoke that narrow owner command. |
| [`logistics.delivery_attempts`](../../04-Database/Tables/logistics/delivery_attempts.md) | Create/update evidence | `shipment_id`, `delivery_user_id`, `attempt_number`, `attempted_at`, `otp_verified`, `proof_file_id`, `proof_metadata`, `status` | Delivery_Operations owns these writes; Delivery_Operations with Finance COD command must invoke that narrow owner command. |
| [`logistics.delivery_assignments`](../../04-Database/Tables/logistics/delivery_assignments.md) | Create/update evidence | `status`, `completed_at` | Delivery_Operations owns these writes; Delivery_Operations with Finance COD command must invoke that narrow owner command. |
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | Create/update evidence | `status`, `delivered_at` | Delivery_Operations owns these writes; Delivery_Operations with Finance COD command must invoke that narrow owner command. |
| [`payment.cod_collections`](../../04-Database/Tables/payment/cod_collections.md) | Create/update evidence | `amount`, `collected_at`, `collected_by_user_id`, `status` | Finance_Payments owns these writes; Delivery_Operations with Finance COD command must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.assignmentVersion | logistics.delivery_assignments.row_version |
| request.otpChallengeId | logistics.delivery_otp_challenges.id |
| request.otp | Write-only proof checked against logistics.delivery_otp_challenges.otp_digest; no cleartext storage. |
| request.proofFileId | platform.file_objects.id |
| request.codCollected.amount | payment.cod_collections.amount |
| request.codCollected.currency | commerce.orders.currency |
| data.assignmentId | logistics.delivery_assignments.id |
| data.shipmentId | logistics.shipments.id |
| data.shipmentStatus | logistics.shipments.status |
| data.completedAt | logistics.delivery_assignments.completed_at |
| data.codCollectionId | payment.cod_collections.id |
| data.codCollectionStatus | payment.cod_collections.status |

**Transaction:** Proposed same-database transaction invokes narrowly authorized Finance collection command plus Delivery OTP/attempt/assignment/shipment changes and audit/outbox. All accepted effects commit or roll back. Finance owns cod_collections; if this interface is not adopted, response must remain pending until Finance acknowledgement and contract approval must be revisited. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`logistics.carriers`](../../04-Database/Tables/logistics/carriers.md), [`logistics.delivery_failure_reasons`](../../04-Database/Tables/logistics/delivery_failure_reasons.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | task_id aliases delivery_assignments.id. Check current rider/version, shipment state, server OTP digest/expiry/attempts and mandatory clean private photo proof (RID-04). Consume OTP and record evidence once; optional COD must equal Finance-approved due and currency from order. proofFileId is singular per schema. |
| Idempotency | Required key: scope actor + API-073 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Wrong OTP increments attempts without accepting delivery; expired/offline stale assignment cannot complete. Lost successful response replays prior result; deposited/settled cash is not claimed. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-073-HAPPY` | Valid Rider context and documented fixture for verify recipient proof and accept one actual delivery outcome. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-073-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-073-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-073-SCOPE` | Use another customer/site/patient/task reference or remove delivery.complete.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-073-RULE` | task_id aliases delivery_assignments.id. Check current rider/version, shipment state, server OTP digest/expiry/attempts and mandatory clean private photo proof (RID-04). Consume OTP and record evidence once; optional COD must equal Finance-approved due and currency from order. proofFileId is singular per schema. | Wrong OTP increments attempts without accepting delivery; expired/offline stale assignment cannot complete. Lost successful response replays prior result; deposited/settled cash is not claimed. |
| `CT-API-073-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-073-CONCURRENCY` | Race two verify recipient proof and accept one actual delivery outcome. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-073-STATE` | Apply command after Wrong OTP increments attempts without accepting delivery; expired/offline stale assignment cannot complete. Lost successful response replays prior result; deposited/settled cash is not claimed. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-073-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Wrong OTP increments attempts without accepting delivery; expired/offline stale assignment cannot complete. Lost successful response replays prior result; deposited/settled cash is not claimed. |

Existing feature assertions: `TC-RID-04-OK`, `TC-RID-04-DENY`, `TC-RID-04-01`, `TC-RID-04-02`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-074 — POST `/v1/rider/tasks/{task_id}/fail`

**Record an unsuccessful delivery attempt without losing custody facts.**

| Property | Proposed contract |
| --- | --- |
| API name | Record an unsuccessful delivery attempt without losing custody facts |
| Version / owner | v1 / Delivery_Operations |
| Consumer | Rider |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `RID-06`; [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/rider/tasks/{task_id}/fail` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Rider | delivery.failure.record.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require active rider identity/shift and the current assigned task before exposing parcel/customer data.

Current assigned rider only; approved active reason, actual attempt time and evidence. Eligible out_for_delivery/in_transit becomes delivery_failed; no false delivered timestamp or cash collection. Keep assignment current for accountable custody until dispatch resolution.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-074_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `DeliveryFailureRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `assignmentVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `reasonCode` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=64 | logistics.delivery_attempts.reason_code; character varying(64). |
| `proofFileId` | string (uuid) | Optional | No | None (not silently populated) | format="uuid" | Optional clean private evidence. |
| `note` | string | Optional | No | None (not silently populated) | minLength=1; maxLength=1000 | Safe operational note stored as logistics.delivery_attempts.proof_metadata.note; never store clinical content. |


```json
{
  "assignmentVersion": 4,
  "reasonCode": "CUSTOMER_REQUEST",
  "proofFileId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "note": "Recipient could not be contacted."
}
```

File upload: Not Applicable to this JSON operation. Referenced file UUIDs must resolve to owned/authorized private objects; validate size/type, complete storage metadata and clean scan before use. Never accept a caller-controlled storage path/public URL.

### Success response

HTTP **201**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `DeliveryFailureData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `attemptId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | logistics.delivery_attempts.id; uuid. |
| `shipmentId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | logistics.delivery_attempts.shipment_id; uuid. |
| `attemptNumber` | integer | Required | No | None (not silently populated) | minimum=0 | logistics.delivery_attempts.attempt_number; integer. |
| `status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | logistics.delivery_attempts.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |
| `reasonCode` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=64 | logistics.delivery_attempts.reason_code; character varying(64). |
| `attemptedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | logistics.delivery_attempts.attempted_at; timestamp with time zone. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "attemptId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "shipmentId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "attemptNumber": 1,
    "status": "delivery_failed",
    "reasonCode": "CUSTOMER_REQUEST",
    "attemptedAt": "2026-10-24T10:30:00Z"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-074. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks delivery.failure.record.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for record an unsuccessful delivery attempt without losing custody facts. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Current assigned rider only; approved active reason, actual attempt time and evidence. Eligible out_for_delivery/in_transit becomes delivery_failed; no false delivered timestamp or cash collection. Keep assignment current for accountable custody until dispatch resolution. | No unauthorized/partial domain effect; redact sensitive context. | Duplicate attempt key creates one attempt/case; subsequent legitimate attempt needs new approved scheduling, not an arbitrary counter reset. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current record an unsuccessful delivery attempt without losing custody facts. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Duplicate attempt key creates one attempt/case; subsequent legitimate attempt needs new approved scheduling, not an arbitrary counter reset. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-074 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | Read | `id`, `order_id`, `order_revision_id`, `row_version`, `shipping_label_file_id`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.delivery_attempts`](../../04-Database/Tables/logistics/delivery_attempts.md) | Read | `attempt_number`, `attempted_at`, `delivery_user_id`, `id`, `proof_file_id`, `proof_metadata`, `reason_code`, `reason_code_id`, `row_version`, `shipment_id`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`logistics.delivery_failure_reasons`](../../04-Database/Tables/logistics/delivery_failure_reasons.md) | Read | `id`, `is_active`, `row_version` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`platform.file_objects`](../../04-Database/Tables/platform/file_objects.md) | Read | `access_type`, `classification`, `id`, `is_deleted`, `malware_scan_status`, `owner_id`, `owner_type`, `row_version`, `sha256`, `size_bytes`, `status` | Platform file service projection / scoped joins; reading does not grant writes. |
| [`logistics.delivery_attempts`](../../04-Database/Tables/logistics/delivery_attempts.md) | Create/update evidence | `shipment_id`, `delivery_user_id`, `attempt_number`, `attempted_at`, `reason_code`, `proof_file_id`, `proof_metadata`, `otp_verified`, `status` | Delivery_Operations owns these writes; Delivery_Operations must invoke that narrow owner command. |
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | Create/update evidence | `status` | Delivery_Operations owns these writes; Delivery_Operations must invoke that narrow owner command. |
| [`logistics.ndr_cases`](../../04-Database/Tables/logistics/ndr_cases.md) | Create/update evidence | `shipment_id`, `reason_code`, `status` | Delivery_Operations owns these writes; Delivery_Operations must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.assignmentVersion | logistics.delivery_assignments.row_version |
| request.reasonCode | logistics.delivery_attempts.reason_code |
| request.proofFileId | platform.file_objects.id |
| request.note | logistics.delivery_attempts.proof_metadata |
| data.attemptId | logistics.delivery_attempts.id |
| data.shipmentId | logistics.delivery_attempts.shipment_id |
| data.attemptNumber | logistics.delivery_attempts.attempt_number |
| data.status | logistics.delivery_attempts.status |
| data.reasonCode | logistics.delivery_attempts.reason_code |
| data.attemptedAt | logistics.delivery_attempts.attempted_at |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`logistics.carriers`](../../04-Database/Tables/logistics/carriers.md), [`logistics.delivery_failure_reasons`](../../04-Database/Tables/logistics/delivery_failure_reasons.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Current assigned rider only; approved active reason, actual attempt time and evidence. Eligible out_for_delivery/in_transit becomes delivery_failed; no false delivered timestamp or cash collection. Keep assignment current for accountable custody until dispatch resolution. |
| Idempotency | Required key: scope actor + API-074 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Duplicate attempt key creates one attempt/case; subsequent legitimate attempt needs new approved scheduling, not an arbitrary counter reset. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-074-HAPPY` | Valid Rider context and documented fixture for record an unsuccessful delivery attempt without losing custody facts. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-074-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-074-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-074-SCOPE` | Use another customer/site/patient/task reference or remove delivery.failure.record.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-074-RULE` | Current assigned rider only; approved active reason, actual attempt time and evidence. Eligible out_for_delivery/in_transit becomes delivery_failed; no false delivered timestamp or cash collection. Keep assignment current for accountable custody until dispatch resolution. | Duplicate attempt key creates one attempt/case; subsequent legitimate attempt needs new approved scheduling, not an arbitrary counter reset. |
| `CT-API-074-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-074-CONCURRENCY` | Race two record an unsuccessful delivery attempt without losing custody facts. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-074-STATE` | Apply command after Duplicate attempt key creates one attempt/case; subsequent legitimate attempt needs new approved scheduling, not an arbitrary counter reset. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-074-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Duplicate attempt key creates one attempt/case; subsequent legitimate attempt needs new approved scheduling, not an arbitrary counter reset. |

Existing feature assertions: `TC-RID-06-OK`, `TC-RID-06-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
