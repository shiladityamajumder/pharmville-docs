# Prescription Upload API contracts

**Shared contract standards:** [conventions](API-Conventions.md) · [authentication/authorization](Authentication-and-Authorization.md) · [response envelope](Standard-Responses.md) · [errors](Error-Catalog.md) · [pagination](Pagination-and-Filtering.md) · [idempotency/concurrency](Idempotency-and-Concurrency.md) · [database-to-DTO mapping](Database-DTO-Mapping.md) · [coverage/readiness](API-Contract-Coverage.md).

> [!NOTE]
> **Implementation evidence:** these Pharmville routes are proposed documentation contracts; no executable Pharmville HTTP routes or contract tests were found. A verified response envelope from the separate authentication service does not confirm these operation DTOs. Resolve the operation-specific gaps listed in the coverage ledger before implementation.

**Contract readiness:** Proposed for architectural review. Each route remains blocked from implementation until its operation-specific DTO, permissions, persistence mapping, state transition and tests are approved under D-024. See the [coverage ledger](API-Contract-Coverage.md) and [audit H-03](../09-References/Engineering-Audit.md#rechecked-earlier-findings).

## API-022 — POST `/v1/prescriptions/upload-intents`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Prescription_Upload.
- **Purpose:** Prepare private upload.

**Requirement links:** `RX-01`, `RX-04`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve the requesting user from the trusted session. Client: customer web or mobile; server owner: `Prescription_Upload`.

Persist upload-session state in `platform.file_upload_sessions` and file metadata in `platform.file_objects`; see field-level evidence and public projection rationale in [Database-DTO-Mapping.md](Database-DTO-Mapping.md). The documented `scope` + `idempotency_key` unique constraint requires the service to define a stable idempotency scope.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Proposed request DTO** (OpenAPI `PrescriptionUploadIntentRequest`):

```json
{
  "fileName": "prescription.pdf",
  "contentType": "application/pdf",
  "expectedSizeBytes": 245760
}
```

`fileName` maps to `platform.file_objects.original_filename` (varchar(255)); `contentType` maps to `content_type` (varchar(128)); `expectedSizeBytes` maps to positive `expected_size_bytes` (bigint). The server supplies owner identity and type from authenticated context, chooses a private storage key, creates the public file/session UUIDs, and applies configured size/type policy.

Do not accept a caller-supplied storage bucket, object key, user ID, status, scan verdict, expiry, or row version. The upload-size ceiling, supported MIME policy, idempotency header contract, and signed-upload protocol remain D-024 decisions.

### Success response (illustrative)

**Proposed success response:** `201 Created`, with a short-lived private upload capability. The `uploadSessionId` and `fileId` project the tables' public UUIDs; `expiresAt` projects session expiry; `status` is the documented initial file-object state.

```json
{
  "success": true,
  "data": {
    "uploadSessionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "fileId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "uploadUrl": "https://upload.example.invalid/capability",
    "expiresAt": "2026-10-24T11:00:00Z",
    "status": "pending_upload"
  },
  "error": null,
  "meta": {
    "requestId": "req_7a3c8b17",
    "correlationId": "corr_018f47b2-7ed0-7a12-8ab2-48df9d439e61",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

`uploadUrl` is an API-level capability, not a database column, and must be omitted from logs. The placeholder host is illustrative; storage provider, HTTP method, required headers and TTL need D-024 approval. Never expose bucket, object key, encryption-key reference, multipart provider ID, or public URL.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-023 — POST `/v1/prescriptions/documents/confirm`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Prescription_Upload.
- **Purpose:** Confirm scanned object metadata.

**Requirement links:** `RX-01`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

The authenticated owner must own the upload session and associated file object; do not allow the client to choose a different file or owner. Update `platform.file_upload_sessions` and file object state through the approved upload-completion/scan workflow. `platform.file_scan_events` are audit evidence, not a client-writable DTO. This endpoint confirms transfer completion; it cannot declare a scan clean.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Proposed request DTO** (OpenAPI `PrescriptionUploadConfirmRequest`):

```json
{
  "uploadSessionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
}
```

The identifier resolves the public `platform.file_upload_sessions.id`; ownership, expiry, file association and actual storage metadata are server-validated. The client must not submit final size, checksum, malware verdict, or file status as authoritative values.

### Success response (illustrative)

**Proposed success response:** `202 Accepted` while asynchronous malware scanning remains pending. The response projects `platform.file_objects.id`, `status`, and `malware_scan_status`.

```json
{
  "success": true,
  "data": {
    "fileId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "status": "scanning",
    "malwareScanStatus": "scanning"
  },
  "error": null,
  "meta": {
    "requestId": "req_7a3c8b17",
    "correlationId": "corr_018f47b2-7ed0-7a12-8ab2-48df9d439e61",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

The documented file status enum is `pending_upload`, `uploaded`, `scanning`, `available`, `quarantined`, `rejected`, `deleted`; malware scan status is `pending`, `scanning`, `clean`, `infected`, `failed`. The schema requires positive final size, SHA-256, and `clean` scan before `available`; neither transfer confirmation nor 202 means the file is safe to attach. A status-read route is not documented here and must be decided under D-024.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-024 — POST `/v1/orders/{order_id}/prescriptions`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Prescription_Upload.
- **Purpose:** Attach prescription to order patient.

**Requirement links:** `RX-04`, `RX-05`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Resolve `order_id` as the public `commerce.orders.id`, then verify the order belongs to the authenticated customer. Verify `patientId` is an owned/dependent `clinical.patient_profiles.id`; the prescription table requires a patient profile and an authenticated `uploaded_by_user_id`.

Each selected item must be an `commerce.order_items.id` belonging to this order and eligible for prescription linkage. Every file must be an owned private `platform.file_objects.id` with status `available` and malware scan `clean`. Persist a `clinical.prescriptions` row, one `clinical.prescription_documents` association per file, and link eligible order items through their nullable `prescription_id`.

Candidate tables and fields are listed in [Database-DTO-Mapping.md](Database-DTO-Mapping.md). The DB docs do not define the eligibility predicate for prescription-required items or whether one prescription may cover all selected items; confirm those workflow rules under D-024.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Proposed request DTO** (OpenAPI `PrescriptionAttachRequest`):

```json
{
  "patientId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "fileIds": [
    "0192a1b2-c3d4-7e8f-9012-3456789abcdf"
  ],
  "orderItemIds": [
    "0192a1b2-c3d4-7e8f-9012-3456789abce0"
  ],
  "expectedOrderVersion": 7
}
```

These UUIDs project documented public keys. `expectedOrderVersion` is a proposed concurrency token mapped to `commerce.orders.row_version`; the schema itself does not prescribe a request version header. Recheck ownership, item-to-order membership, item eligibility, clean file state, and current order version inside the write transaction.

Reject duplicate IDs, empty arrays, foreign-order items, non-clean files and stale versions.

### Success response (illustrative)

**Proposed success response:** `201 Created`, confirming document-to-prescription and item-to-prescription associations. `uploaded` is the documented initial prescription status; it does not mean pharmacist approval.

```json
{
  "success": true,
  "data": {
    "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "prescriptionId": "0192a1b2-c3d4-7e8f-9012-3456789abce0",
    "patientId": "0192a1b2-c3d4-7e8f-9012-3456789abce1",
    "linkedOrderItemIds": [
      "0192a1b2-c3d4-7e8f-9012-3456789abce2"
    ],
    "prescriptionStatus": "uploaded",
    "orderVersion": 8
  },
  "error": null,
  "meta": {
    "requestId": "req_7a3c8b17",
    "correlationId": "corr_018f47b2-7ed0-7a12-8ab2-48df9d439e61",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

`orderVersion` returns the committed order row version. The response intentionally omits patient details, document contents, storage identifiers, prescriber/reviewer fields, and internal numeric keys. Multi-document association is represented by the created prescription and linked item IDs; a response file list can be added only if the owning module approves the public projection.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.
