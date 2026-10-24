# Prescription Upload API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](../../05-APIs/API-Contract-Coverage.md) · [OpenAPI 3.1](../../05-APIs/openapi.yaml) · [decisions](../../05-APIs/Planning-Decisions.md) · [DTO conventions](../../05-APIs/API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="prescription-upload-api-contracts"></a>
<a id="api-022--post-v1prescriptionsupload-intents"></a>
<a id="caller-permissions-and-dependencies"></a>
<a id="http-request-contract"></a>
<a id="success-response-illustrative"></a>
<a id="errors-concurrency-and-failure-recovery"></a>
<a id="required-verification"></a>
<a id="api-023--post-v1prescriptionsdocumentsconfirm"></a>
<a id="caller-permissions-and-dependencies-1"></a>
<a id="http-request-contract-1"></a>
<a id="success-response-illustrative-1"></a>
<a id="errors-concurrency-and-failure-recovery-1"></a>
<a id="required-verification-1"></a>
<a id="api-024--post-v1ordersorder_idprescriptions"></a>
<a id="caller-permissions-and-dependencies-2"></a>
<a id="http-request-contract-2"></a>
<a id="success-response-illustrative-2"></a>
<a id="errors-concurrency-and-failure-recovery-2"></a>
<a id="required-verification-2"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-022 | `POST /v1/prescriptions/upload-intents` | Create a private prescription file upload capability. | Complete proposed |
| API-023 | `POST /v1/prescriptions/documents/confirm` | Confirm uploaded prescription bytes and schedule malware scanning. | Complete proposed |
| API-024 | `POST /v1/orders/{order_id}/prescriptions` | Attach safe private prescription documents to exact owned P order lines. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| RX-01 | Upload one or more prescriptions (JPG, PNG, PDF) at checkout | API-022, API-023 |
| RX-02 | Upload within 24 hours after ordering; auto-cancel after that | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| RX-03 | Reuse a saved, still-valid prescription | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| RX-04 | Link each prescription to the patient (self or family member) | API-024 |
| RX-05 | See the pharmacist's decision and reason; re-upload after rejection | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |

## API-022 — POST `/v1/prescriptions/upload-intents`

**Create a private prescription file upload capability.**

| Property | Proposed contract |
| --- | --- |
| API name | Create a private prescription file upload capability |
| Version / owner | v1 / Prescription_Upload via platform file service |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `RX-01`; [WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/prescriptions/upload-intents` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | prescription-upload.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

JPEG/PNG/PDF, proposed 10 MiB ceiling. File owner is current customer; access private and public_url null. Issue one scoped PUT capability with content type/length/expiry; upload bytes go to object storage, not this JSON API.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-022_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `PrescriptionUploadIntentRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `fileName` | string | Required | No | None (not silently populated) | minLength=1; maxLength=255 | Proposed client filename; server normalizes and never uses it as a storage path. |
| `contentType` | string | Required | No | None (not silently populated) | enum=["image/jpeg", "image/png", "application/pdf"] | Public DTO value from platform.file_objects.content_type. Ownership and current-state checks apply before use. |
| `expectedSizeBytes` | integer | Required | No | None (not silently populated) | minimum=1; maximum=10485760 | Proposed 10 MiB application ceiling; storage object and bytes must match; D-024 approval. |


```json
{
  "fileName": "prescription-example.pdf",
  "contentType": "application/pdf",
  "expectedSizeBytes": 348220
}
```

File bytes: one private object-store PUT using uploadUrl, exact Content-Type and expected byte count; then API-023 confirms actual metadata. This operation accepts metadata only. Allowed file types and ceiling are listed above. Signed URL grants upload only and expires under file-service policy.

### Success response

HTTP **201**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `PrescriptionUploadIntentData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `uploadSessionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | platform.file_upload_sessions.id. |
| `fileId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | platform.file_objects.id. |
| `uploadUrl` | string (uri) | Required | No | None (not silently populated) | format="uri" | Proposed short-lived private upload capability; storage protocol/headers require D-024 approval. |
| `expiresAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | platform.file_upload_sessions.expires_at. |
| `status` | string | Required | No | None (not silently populated) | enum=["pending_upload"] | platform.file_objects.status at creation. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "uploadSessionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "fileId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "uploadUrl": "https://private-objects.example.invalid/upload/one-use-capability",
    "expiresAt": "2026-10-24T10:40:00Z",
    "status": "pending_upload"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-022. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks prescription-upload.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for create a private prescription file upload capability. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | JPEG/PNG/PDF, proposed 10 MiB ceiling. File owner is current customer; access private and public_url null. Issue one scoped PUT capability with content type/length/expiry; upload bytes go to object storage, not this JSON API. | No unauthorized/partial domain effect; redact sensitive context. | Never mint a public Rx URL. A failed signing call leaves a pending session that can be safely replayed or expired. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Never mint a public Rx URL. A failed signing call leaves a pending session that can be safely replayed or expired. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-022 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`platform.file_objects`](../../04-Database/Tables/platform/file_objects.md) | Read | `access_type`, `classification`, `content_type`, `expected_size_bytes`, `id`, `is_deleted`, `malware_scan_status`, `original_filename`, `owner_id`, `owner_type`, `row_version`, `sha256`, `size_bytes`, `status` | Platform file service projection / scoped joins; reading does not grant writes. |
| [`platform.file_upload_sessions`](../../04-Database/Tables/platform/file_upload_sessions.md) | Read | `expires_at`, `file_object_id`, `id`, `row_version`, `status` | Platform file service projection / scoped joins; reading does not grant writes. |
| [`platform.file_objects`](../../04-Database/Tables/platform/file_objects.md) | Create/update evidence | `owner_type`, `owner_id`, `access_type`, `classification`, `storage_provider`, `bucket`, `object_key`, `original_filename`, `content_type`, `expected_size_bytes`, `status`, `malware_scan_status`, `uploaded_by_user_id` | Platform file service owns these writes; Prescription_Upload via platform file service must invoke that narrow owner command. |
| [`platform.file_upload_sessions`](../../04-Database/Tables/platform/file_upload_sessions.md) | Create/update evidence | `file_object_id`, `requested_by_user_id`, `scope`, `idempotency_key`, `expires_at`, `status`, `upload_method` | Platform file service owns these writes; Prescription_Upload via platform file service must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.fileName | platform.file_objects.original_filename |
| request.contentType | platform.file_objects.content_type |
| request.expectedSizeBytes | platform.file_objects.expected_size_bytes |
| data.uploadSessionId | platform.file_upload_sessions.id |
| data.fileId | platform.file_objects.id |
| data.uploadUrl | API-only private expiring object-store PUT capability; do not persist or log cleartext capability. |
| data.expiresAt | platform.file_upload_sessions.expires_at |
| data.status | platform.file_objects.status |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | JPEG/PNG/PDF, proposed 10 MiB ceiling. File owner is current customer; access private and public_url null. Issue one scoped PUT capability with content type/length/expiry; upload bytes go to object storage, not this JSON API. |
| Idempotency | Required key: scope actor + API-022 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Never mint a public Rx URL. A failed signing call leaves a pending session that can be safely replayed or expired. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-022-HAPPY` | Valid Customer context and documented fixture for create a private prescription file upload capability. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-022-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-022-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-022-SCOPE` | Use another customer/site/patient/task reference or remove prescription-upload.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-022-RULE` | JPEG/PNG/PDF, proposed 10 MiB ceiling. File owner is current customer; access private and public_url null. Issue one scoped PUT capability with content type/length/expiry; upload bytes go to object storage, not this JSON API. | Never mint a public Rx URL. A failed signing call leaves a pending session that can be safely replayed or expired. |
| `CT-API-022-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-022-CONCURRENCY` | Race two create a private prescription file upload capability. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-022-STATE` | Apply command after Never mint a public Rx URL. A failed signing call leaves a pending session that can be safely replayed or expired. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-022-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Never mint a public Rx URL. A failed signing call leaves a pending session that can be safely replayed or expired. |

Existing feature assertions: `TC-RX-01-OK`, `TC-RX-01-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-023 — POST `/v1/prescriptions/documents/confirm`

**Confirm uploaded prescription bytes and schedule malware scanning.**

| Property | Proposed contract |
| --- | --- |
| API name | Confirm uploaded prescription bytes and schedule malware scanning |
| Version / owner | v1 / Prescription_Upload |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `RX-01`; [WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/prescriptions/documents/confirm` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | prescription-upload.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Server verifies object key/version, declared bytes, sniffed MIME and digest outside DB locks, then checks current owned session before recording uploaded/scanning. available requires a clean scan and final size/hash.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-023_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `PrescriptionUploadConfirmRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `uploadSessionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public upload session UUID owned by the authenticated customer. |


```json
{
  "uploadSessionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
}
```

File upload: Not Applicable to this JSON operation. Referenced file UUIDs must resolve to owned/authorized private objects; validate size/type, complete storage metadata and clean scan before use. Never accept a caller-controlled storage path/public URL.

### Success response

HTTP **202**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `PrescriptionUploadConfirmData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `fileId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from platform.file_objects.id. Ownership and current-state checks apply before use. |
| `status` | string | Required | No | None (not silently populated) | enum=["uploaded", "scanning", "available", "quarantined", "rejected"] | Current platform.file_objects.status; no clean scan is implied by HTTP acceptance. |
| `malwareScanStatus` | string | Required | No | None (not silently populated) | enum=["pending", "scanning", "clean", "infected", "failed"] | Current platform.file_objects.malware_scan_status. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "fileId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "status": "uploaded",
    "malwareScanStatus": "pending"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-023. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks prescription-upload.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for confirm uploaded prescription bytes and schedule malware scanning. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Server verifies object key/version, declared bytes, sniffed MIME and digest outside DB locks, then checks current owned session before recording uploaded/scanning. available requires a clean scan and final size/hash. | No unauthorized/partial domain effect; redact sensitive context. | Incomplete object remains unavailable; infected/quarantined file cannot be attached. Retry confirmation for the same upload session. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Incomplete object remains unavailable; infected/quarantined file cannot be attached. Retry confirmation for the same upload session. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-023 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`platform.file_upload_sessions`](../../04-Database/Tables/platform/file_upload_sessions.md) | Read | `expires_at`, `file_object_id`, `id`, `row_version`, `status` | Platform file service projection / scoped joins; reading does not grant writes. |
| [`platform.file_objects`](../../04-Database/Tables/platform/file_objects.md) | Create/update evidence | `size_bytes`, `sha256`, `etag`, `storage_version_id`, `status`, `malware_scan_status` | Platform file service owns these writes; Prescription_Upload must invoke that narrow owner command. |
| [`platform.file_upload_sessions`](../../04-Database/Tables/platform/file_upload_sessions.md) | Create/update evidence | `status`, `completed_at` | Platform file service owns these writes; Prescription_Upload must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.uploadSessionId | platform.file_upload_sessions.id |
| data.fileId | platform.file_objects.id |
| data.status | platform.file_objects.status |
| data.malwareScanStatus | platform.file_objects.malware_scan_status |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Server verifies object key/version, declared bytes, sniffed MIME and digest outside DB locks, then checks current owned session before recording uploaded/scanning. available requires a clean scan and final size/hash. |
| Idempotency | Required key: scope actor + API-023 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Incomplete object remains unavailable; infected/quarantined file cannot be attached. Retry confirmation for the same upload session. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-023-HAPPY` | Valid Customer context and documented fixture for confirm uploaded prescription bytes and schedule malware scanning. | HTTP 202; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-023-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-023-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-023-SCOPE` | Use another customer/site/patient/task reference or remove prescription-upload.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-023-RULE` | Server verifies object key/version, declared bytes, sniffed MIME and digest outside DB locks, then checks current owned session before recording uploaded/scanning. available requires a clean scan and final size/hash. | Incomplete object remains unavailable; infected/quarantined file cannot be attached. Retry confirmation for the same upload session. |
| `CT-API-023-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-023-CONCURRENCY` | Race two confirm uploaded prescription bytes and schedule malware scanning. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-023-STATE` | Apply command after Incomplete object remains unavailable; infected/quarantined file cannot be attached. Retry confirmation for the same upload session. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-023-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Incomplete object remains unavailable; infected/quarantined file cannot be attached. Retry confirmation for the same upload session. |

Existing feature assertions: `TC-RX-01-OK`, `TC-RX-01-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-024 — POST `/v1/orders/{order_id}/prescriptions`

**Attach safe private prescription documents to exact owned P order lines.**

| Property | Proposed contract |
| --- | --- |
| API name | Attach safe private prescription documents to exact owned P order lines |
| Version / owner | v1 / Prescription_Upload |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `RX-04`; [WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/orders/{order_id}/prescriptions` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | prescription-upload.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Patient must match order and owned association; every selected item belongs to order and is P. Every file available/clean/private with valid access. Retain document version; supersede stale review evidence, never approve automatically.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-024_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `PrescriptionAttachRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `patientId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public clinical.patient_profiles.id; ownership and dependent link are checked server-side. |
| `fileIds` | array<string (uuid)> | Required | No | None (not silently populated) | minItems=1 | Nested typed projection. |
| `orderItemIds` | array<string (uuid)> | Required | No | None (not silently populated) | minItems=1 | Nested typed projection. |
| `expectedOrderVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected commerce.orders.row_version. |


```json
{
  "patientId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "fileIds": [
    "0192a1b2-c3d4-7e8f-9012-3456789abcde"
  ],
  "orderItemIds": [
    "0192a1b2-c3d4-7e8f-9012-3456789abcde"
  ],
  "expectedOrderVersion": 1
}
```

File upload: Not Applicable to this JSON operation. Referenced file UUIDs must resolve to owned/authorized private objects; validate size/type, complete storage metadata and clean scan before use. Never accept a caller-controlled storage path/public URL.

### Success response

HTTP **201**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `PrescriptionAttachData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.orders.id. Ownership and current-state checks apply before use. |
| `prescriptionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public clinical.prescriptions.id. |
| `patientId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from clinical.patient_profiles.id. Ownership and current-state checks apply before use. |
| `linkedOrderItemIds` | array<string (uuid)> | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `prescriptionStatus` | string | Required | No | None (not silently populated) | enum=["uploaded"] | clinical.prescriptions.status; upload does not imply pharmacist approval. |
| `orderVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Public DTO value from commerce.orders.row_version. Ownership and current-state checks apply before use. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "prescriptionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "patientId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "linkedOrderItemIds": [
      "0192a1b2-c3d4-7e8f-9012-3456789abcde"
    ],
    "prescriptionStatus": "uploaded",
    "orderVersion": 1
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-024. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks prescription-upload.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for attach safe private prescription documents to exact owned p order lines. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Patient must match order and owned association; every selected item belongs to order and is P. Every file available/clean/private with valid access. Retain document version; supersede stale review evidence, never approve automatically. | No unauthorized/partial domain effect; redact sensitive context. | Wrong patient or dirty file leaves no attachment/review. Changed accepted revision invalidates prior line decisions. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current attach safe private prescription documents to exact owned p order lines. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Wrong patient or dirty file leaves no attachment/review. Changed accepted revision invalidates prior line decisions. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-024 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_items`](../../04-Database/Tables/commerce/order_items.md) | Read | `id`, `order_id`, `prescription_id`, `row_version`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md) | Read | `family_member_id`, `id`, `is_deleted`, `row_version`, `user_id` | Prescription_Upload / Intake projection / scoped joins; reading does not grant writes. |
| [`customer.family_members`](../../04-Database/Tables/customer/family_members.md) | Read | `customer_user_id`, `id`, `is_deleted`, `row_version` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`platform.file_objects`](../../04-Database/Tables/platform/file_objects.md) | Read | `access_type`, `classification`, `id`, `is_deleted`, `malware_scan_status`, `owner_id`, `owner_type`, `row_version`, `sha256`, `size_bytes`, `status` | Platform file service projection / scoped joins; reading does not grant writes. |
| [`clinical.prescriptions`](../../04-Database/Tables/clinical/prescriptions.md) | Create/update evidence | `patient_profile_id`, `uploaded_by_user_id`, `source`, `status` | Prescription_Upload / Intake owns these writes; Prescription_Upload must invoke that narrow owner command. |
| [`clinical.prescription_documents`](../../04-Database/Tables/clinical/prescription_documents.md) | Create/update evidence | `prescription_id`, `file_object_id`, `version_number`, `redaction_status` | Prescription_Upload / Intake owns these writes; Prescription_Upload must invoke that narrow owner command. |
| [`commerce.order_items`](../../04-Database/Tables/commerce/order_items.md) | Create/update evidence | `prescription_id` | Order_Operations owns these writes; Prescription_Upload must invoke that narrow owner command. |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | Create/update evidence | `order_id`, `patient_profile_id`, `prescription_id`, `prescription_document_id`, `requested_at`, `status`, `review_version` | Pharmacist_Review owns these writes; Prescription_Upload must invoke that narrow owner command. |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | Create/update evidence | `review_id`, `order_id`, `order_item_id`, `prescription_id`, `decision` | Pharmacist_Review owns these writes; Prescription_Upload must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.patientId | clinical.patient_profiles.id |
| request.fileIds[] | platform.file_objects.id |
| request.orderItemIds[] | commerce.order_items.id |
| request.expectedOrderVersion | commerce.orders.row_version |
| data.orderId | commerce.orders.id |
| data.prescriptionId | clinical.prescriptions.id |
| data.patientId | clinical.patient_profiles.id |
| data.linkedOrderItemIds[] | commerce.order_items.id |
| data.prescriptionStatus | clinical.prescriptions.status |
| data.orderVersion | commerce.orders.row_version |

**Transaction:** Intake owns prescription/documents; Order Operations and Pharmacy expose narrow linking/review-creation commands on one proposed local transaction. Only Order Operations increments order version; otherwise return unchanged orderVersion. Re-upload supersedes review via Pharmacy, retaining history. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md), [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../../04-Database/Tables/marketplace/sellers.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Patient must match order and owned association; every selected item belongs to order and is P. Every file available/clean/private with valid access. Retain document version; supersede stale review evidence, never approve automatically. |
| Idempotency | Required key: scope actor + API-024 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Wrong patient or dirty file leaves no attachment/review. Changed accepted revision invalidates prior line decisions. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-024-HAPPY` | Valid Customer context and documented fixture for attach safe private prescription documents to exact owned p order lines. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-024-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-024-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-024-SCOPE` | Use another customer/site/patient/task reference or remove prescription-upload.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-024-RULE` | Patient must match order and owned association; every selected item belongs to order and is P. Every file available/clean/private with valid access. Retain document version; supersede stale review evidence, never approve automatically. | Wrong patient or dirty file leaves no attachment/review. Changed accepted revision invalidates prior line decisions. |
| `CT-API-024-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-024-CONCURRENCY` | Race two attach safe private prescription documents to exact owned p order lines. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-024-STATE` | Apply command after Wrong patient or dirty file leaves no attachment/review. Changed accepted revision invalidates prior line decisions. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-024-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Wrong patient or dirty file leaves no attachment/review. Changed accepted revision invalidates prior line decisions. |

Existing feature assertions: `TC-RX-04-OK`, `TC-RX-04-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
