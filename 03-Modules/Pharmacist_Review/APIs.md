# Pharmacist Review API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](../../05-APIs/API-Contract-Coverage.md) · [OpenAPI 3.1](../../05-APIs/openapi.yaml) · [decisions](../../05-APIs/Planning-Decisions.md) · [DTO conventions](../../05-APIs/API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="pharmacist-review-api-contracts"></a>
<a id="api-060--get-v1pharmacyreviews"></a>
<a id="caller-permissions-and-dependencies"></a>
<a id="http-request-contract"></a>
<a id="success-response-illustrative"></a>
<a id="errors-concurrency-and-failure-recovery"></a>
<a id="required-verification"></a>
<a id="api-061--get-v1pharmacyreviewsreview_id"></a>
<a id="caller-permissions-and-dependencies-1"></a>
<a id="http-request-contract-1"></a>
<a id="success-response-illustrative-1"></a>
<a id="errors-concurrency-and-failure-recovery-1"></a>
<a id="required-verification-1"></a>
<a id="api-062--post-v1pharmacyreviewsreview_idlinesline_iddecision"></a>
<a id="caller-permissions-and-dependencies-2"></a>
<a id="http-request-contract-2"></a>
<a id="success-response-illustrative-2"></a>
<a id="errors-concurrency-and-failure-recovery-2"></a>
<a id="required-verification-2"></a>
<a id="api-063--post-v1meordersorder_idrevisionsrevision_idaccept"></a>
<a id="caller-permissions-and-dependencies-3"></a>
<a id="http-request-contract-3"></a>
<a id="success-response-illustrative-3"></a>
<a id="errors-concurrency-and-failure-recovery-3"></a>
<a id="required-verification-3"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-060 | `GET /v1/pharmacy/reviews` | List current P-line review work for the authorized pharmacist. | Complete proposed |
| API-061 | `GET /v1/pharmacy/reviews/{review_id}` | Read exact line/patient/prescription review bindings. | Complete proposed |
| API-062 | `POST /v1/pharmacy/reviews/{review_id}/lines/{line_id}/decision` | Record one exact P-line clinical decision with immutable reviewer evidence. | Complete proposed |
| API-063 | `POST /v1/me/orders/{order_id}/revisions/{revision_id}/accept` | Accept the exact proposed revision and its recalculated total. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| PHM-01 | Review queue, oldest first, with waiting time | API-060 |
| PHM-02 | Side-by-side view: zoomable prescription and order items | API-061 |
| PHM-03 | Approve all, approve some, or reject with a reason | API-062, API-063 |
| PHM-04 | Confirm a chosen alternative matches the prescription | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| PHM-05 | Pharmacist name, registration number and time on every decision | API-062 |

## API-060 — GET `/v1/pharmacy/reviews`

**List current P-line review work for the authorized pharmacist.**

| Property | Proposed contract |
| --- | --- |
| API name | List current P-line review work for the authorized pharmacist |
| Version / owner | v1 / Pharmacist_Review |
| Consumer | Qualified Pharmacist |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `PHM-01`; [WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/pharmacy/reviews` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Qualified Pharmacist | clinical.reviews.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Qualification and site role required; only P lines enter the review queue. M/O-only orders skip it.

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
| status | string | Optional | No | None | enum=["pending", "in_review", "action_required", "approved", "partially_approved", "rejected", "superseded", "cancelled"]; minLength=1; maxLength=24 | clinical.order_reviews.status; character varying(24). |


Only declared query fields are accepted. Sorting is fixed: `requested_at ASC, id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `ReviewListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `reviews` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `reviews[].reviewId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | clinical.order_reviews.id; uuid. |
| `reviews[].orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | clinical.order_reviews.order_id; uuid. |
| `reviews[].patientId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | clinical.order_reviews.patient_profile_id; uuid. |
| `reviews[].prescriptionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | clinical.order_reviews.prescription_id; uuid. |
| `reviews[].status` | string | Required | No | None (not silently populated) | enum=["pending", "in_review", "action_required", "approved", "partially_approved", "rejected", "superseded", "cancelled"]; minLength=1; maxLength=24 | clinical.order_reviews.status; character varying(24). |
| `reviews[].reviewVersion` | integer | Required | No | None (not silently populated) | minimum=0 | clinical.order_reviews.review_version; integer. |
| `reviews[].requestedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | clinical.order_reviews.requested_at; timestamp with time zone. |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "reviewId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "patientId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "prescriptionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "status": "pending",
        "reviewVersion": 1,
        "requestedAt": "2026-10-24T10:30:00Z"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-060. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks clinical.reviews.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-060 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | Read | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `requested_at`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | Read | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `review_id`, `row_version` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | Read | `id`, `location_id`, `organization_id`, `row_version`, `status`, `user_id` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`clinical.practitioner_profiles`](../../04-Database/Tables/clinical/practitioner_profiles.md) | Read | `id`, `is_deleted`, `row_version`, `user_id` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.reviews[].reviewId | clinical.order_reviews.id |
| data.reviews[].orderId | clinical.order_reviews.order_id |
| data.reviews[].patientId | clinical.order_reviews.patient_profile_id |
| data.reviews[].prescriptionId | clinical.order_reviews.prescription_id |
| data.reviews[].status | clinical.order_reviews.status |
| data.reviews[].reviewVersion | clinical.order_reviews.review_version |
| data.reviews[].requestedAt | clinical.order_reviews.requested_at |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`clinical.practitioner_profiles`](../../04-Database/Tables/clinical/practitioner_profiles.md), [`clinical.review_reason_codes`](../../04-Database/Tables/clinical/review_reason_codes.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`organization.departments`](../../04-Database/Tables/organization/departments.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Qualification and site role required; only P lines enter the review queue. M/O-only orders skip it. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; requested_at ASC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Expired qualification/foreign patient/site cannot enter the queue; no general Admin override. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-060-HAPPY` | Valid Qualified Pharmacist context and documented fixture for list current p-line review work for the authorized pharmacist. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-060-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-060-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-060-SCOPE` | Use another customer/site/patient/task reference or remove clinical.reviews.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-060-RULE` | Qualification and site role required; only P lines enter the review queue. M/O-only orders skip it. | Expired qualification/foreign patient/site cannot enter the queue; no general Admin override. |
| `CT-API-060-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-060-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-060-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-060-RECOVERY` | Dependency timeout during list current p-line review work for the authorized pharmacist. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-PHM-01-OK`, `TC-PHM-01-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-061 — GET `/v1/pharmacy/reviews/{review_id}`

**Read exact line/patient/prescription review bindings.**

| Property | Proposed contract |
| --- | --- |
| API name | Read exact line/patient/prescription review bindings |
| Version / owner | v1 / Pharmacist_Review |
| Consumer | Qualified Pharmacist |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `PHM-02`; [WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/pharmacy/reviews/{review_id}` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Qualified Pharmacist | clinical.reviews.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Authorize clinical purpose and current reviewer scope before returning metadata. Record clinical access separately through trusted audit; this response contains no prescription bytes or unscoped signed URL.

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
| review_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is fixed: `not applicable for this singleton`. Pagination: none.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `ReviewDetailData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `review` | object | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `review.reviewId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | clinical.order_reviews.id; uuid. |
| `review.orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | clinical.order_reviews.order_id; uuid. |
| `review.patientId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | clinical.order_reviews.patient_profile_id; uuid. |
| `review.prescriptionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | clinical.order_reviews.prescription_id; uuid. |
| `review.status` | string | Required | No | None (not silently populated) | enum=["pending", "in_review", "action_required", "approved", "partially_approved", "rejected", "superseded", "cancelled"]; minLength=1; maxLength=24 | clinical.order_reviews.status; character varying(24). |
| `review.reviewVersion` | integer | Required | No | None (not silently populated) | minimum=0 | clinical.order_reviews.review_version; integer. |
| `review.requestedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | clinical.order_reviews.requested_at; timestamp with time zone. |
| `lines` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `lines[].lineId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | clinical.order_review_items.id; uuid. |
| `lines[].orderItemId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | clinical.order_review_items.order_item_id; uuid. |
| `lines[].prescriptionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | clinical.order_review_items.prescription_id; uuid. |
| `lines[].decision` | string | Required | No | None (not silently populated) | enum=["pending", "approved", "rejected", "needs_new_rx"]; minLength=1; maxLength=20 | clinical.order_review_items.decision; character varying(20). |
| `lines[].approvedQuantity` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,9}(\\.[0-9]{1,3})?$" | clinical.order_review_items.approved_quantity; numeric(12,3). |
| `lines[].reasonCode` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=64 | clinical.order_review_items.reason_code; character varying(64). |
| `lines[].rowVersion` | integer | Required | No | None (not silently populated) | minimum=0 | clinical.order_review_items.row_version; bigint. |
| `prescriptionDocumentId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | clinical.order_reviews.prescription_document_id; uuid. |
| `orderRevisionId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | commerce.orders.current_revision_id; uuid. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "review": {
      "reviewId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "patientId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "prescriptionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "status": "pending",
      "reviewVersion": 1,
      "requestedAt": "2026-10-24T10:30:00Z"
    },
    "lines": [
      {
        "lineId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "orderItemId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "prescriptionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "decision": "pending",
        "approvedQuantity": "2.000",
        "reasonCode": "CUSTOMER_REQUEST",
        "rowVersion": 1
      }
    ],
    "prescriptionDocumentId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "orderRevisionId": null
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-061. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks clinical.reviews.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for read exact line/patient/prescription review bindings. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-061 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | Read | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `requested_at`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | Read | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `reason_code`, `review_id`, `row_version` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`clinical.prescription_documents`](../../04-Database/Tables/clinical/prescription_documents.md) | Read | `id`, `prescription_id`, `row_version` | Prescription_Upload / Intake projection / scoped joins; reading does not grant writes. |
| [`clinical.prescriptions`](../../04-Database/Tables/clinical/prescriptions.md) | Read | `id`, `patient_profile_id`, `row_version`, `status`, `valid_until` | Prescription_Upload / Intake projection / scoped joins; reading does not grant writes. |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `internal_id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | Read | `id`, `order_id`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.review.reviewId | clinical.order_reviews.id |
| data.review.orderId | clinical.order_reviews.order_id |
| data.review.patientId | clinical.order_reviews.patient_profile_id |
| data.review.prescriptionId | clinical.order_reviews.prescription_id |
| data.review.status | clinical.order_reviews.status |
| data.review.reviewVersion | clinical.order_reviews.review_version |
| data.review.requestedAt | clinical.order_reviews.requested_at |
| data.lines[].lineId | clinical.order_review_items.id |
| data.lines[].orderItemId | clinical.order_review_items.order_item_id |
| data.lines[].prescriptionId | clinical.order_review_items.prescription_id |
| data.lines[].decision | clinical.order_review_items.decision |
| data.lines[].approvedQuantity | clinical.order_review_items.approved_quantity |
| data.lines[].reasonCode | clinical.order_review_items.reason_code |
| data.lines[].rowVersion | clinical.order_review_items.row_version |
| data.prescriptionDocumentId | clinical.order_reviews.prescription_document_id |
| data.orderRevisionId | commerce.orders.current_revision_id |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`clinical.review_reason_codes`](../../04-Database/Tables/clinical/review_reason_codes.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Authorize clinical purpose and current reviewer scope before returning metadata. Record clinical access separately through trusted audit; this response contains no prescription bytes or unscoped signed URL. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Wrong patient, superseded review or foreign site is hidden/blocked; reload the current review. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-061-HAPPY` | Valid Qualified Pharmacist context and documented fixture for read exact line/patient/prescription review bindings. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-061-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-061-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-061-SCOPE` | Use another customer/site/patient/task reference or remove clinical.reviews.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-061-RULE` | Authorize clinical purpose and current reviewer scope before returning metadata. Record clinical access separately through trusted audit; this response contains no prescription bytes or unscoped signed URL. | Wrong patient, superseded review or foreign site is hidden/blocked; reload the current review. |
| `CT-API-061-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-061-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-061-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-061-RECOVERY` | Dependency timeout during read exact line/patient/prescription review bindings. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-PHM-02-OK`, `TC-PHM-02-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-062 — POST `/v1/pharmacy/reviews/{review_id}/lines/{line_id}/decision`

**Record one exact P-line clinical decision with immutable reviewer evidence.**

| Property | Proposed contract |
| --- | --- |
| API name | Record one exact P-line clinical decision with immutable reviewer evidence |
| Version / owner | v1 / Pharmacist_Review |
| Consumer | Qualified assigned Pharmacist |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `PHM-03`, `PHM-05`, `RX-05`; [WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/pharmacy/reviews/{review_id}/lines/{line_id}/decision` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Qualified assigned Pharmacist | clinical.reviews.decide (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Bind patient, current order revision, exact SKU/form/strength/quantity and prescription version. Map approve/reject/request_new_prescription to approved/rejected/needs_new_rx. Positive approvedQuantity required on approval; approved reason required otherwise. Parent review status derives from all current line decisions.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-062_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| review_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |
| line_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `PharmacistDecisionRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedReviewVersion` | integer | Required | No | None (not silently populated) | minimum=1 | clinical.order_reviews.review_version. |
| `expectedLineVersion` | integer | Required | No | None (not silently populated) | minimum=1 | clinical.order_review_items.row_version. |
| `orderRevisionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.order_revisions.id. Ownership and current-state checks apply before use. |
| `prescriptionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from clinical.prescriptions.id. Ownership and current-state checks apply before use. |
| `decision` | string | Required | No | None (not silently populated) | enum=["approve", "reject", "request_new_prescription"] | Public DTO value from clinical.order_review_items.decision. Ownership and current-state checks apply before use. |
| `approvedQuantity` | string | Optional | No | None (not silently populated) | pattern="^[0-9]+(\\.[0-9]{1,3})?$" | Required and positive when decision=approve; maps to clinical.order_review_items.approved_quantity numeric(12,3). |
| `reasonCode` | string | Optional | No | None (not silently populated) | Typed schema; reject unknown object properties. | Required for reject/request_new_prescription; controlled reason mapping remains approval-bound. |


```json
{
  "expectedReviewVersion": 1,
  "expectedLineVersion": 1,
  "orderRevisionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "prescriptionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "decision": "approve",
  "approvedQuantity": "2.000"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `PharmacistDecisionData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `reviewId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from clinical.order_reviews.id. Ownership and current-state checks apply before use. |
| `lineId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from clinical.order_review_items.id. Ownership and current-state checks apply before use. |
| `decision` | string | Required | No | None (not silently populated) | enum=["approve", "reject", "request_new_prescription"] | Public DTO value from clinical.order_review_items.decision. Ownership and current-state checks apply before use. |
| `approvedQuantity` | string/null | Required | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from clinical.order_review_items.approved_quantity. Ownership and current-state checks apply before use. |
| `reasonCode` | string/null | Required | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from clinical.order_review_items.reason_code. Ownership and current-state checks apply before use. |
| `reviewVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Public DTO value from clinical.order_reviews.review_version. Ownership and current-state checks apply before use. |
| `lineVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Public DTO value from clinical.order_review_items.row_version. Ownership and current-state checks apply before use. |
| `orderRevisionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.order_revisions.id. Ownership and current-state checks apply before use. |
| `decidedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | Public DTO value from clinical.order_review_items.decided_at. Ownership and current-state checks apply before use. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "reviewId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "lineId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "decision": "approve",
    "approvedQuantity": "2.000",
    "reasonCode": null,
    "reviewVersion": 1,
    "lineVersion": 1,
    "orderRevisionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "decidedAt": "2026-10-24T10:30:00Z"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-062. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks clinical.reviews.decide or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for record one exact p-line clinical decision with immutable reviewer evidence. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Bind patient, current order revision, exact SKU/form/strength/quantity and prescription version. Map approve/reject/request_new_prescription to approved/rejected/needs_new_rx. Positive approvedQuantity required on approval; approved reason required otherwise. Parent review status derives from all current line decisions. | No unauthorized/partial domain effect; redact sensitive context. | Wrong patient/qualification is denied; stale review/line/revision returns STALE_VERSION. Changed evidence never inherits approval and M/O lines cannot be clinically rejected here. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current record one exact p-line clinical decision with immutable reviewer evidence. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Wrong patient/qualification is denied; stale review/line/revision returns STALE_VERSION. Changed evidence never inherits approval and M/O lines cannot be clinically rejected here. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-062 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | Read | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `reason_code`, `reason_code_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | Read | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `prescription_item_id`, `reason_code`, `reason_code_id`, `review_id`, `row_version` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`clinical.prescriptions`](../../04-Database/Tables/clinical/prescriptions.md) | Read | `id`, `patient_profile_id`, `row_version`, `status`, `valid_until` | Prescription_Upload / Intake projection / scoped joins; reading does not grant writes. |
| [`clinical.prescription_items`](../../04-Database/Tables/clinical/prescription_items.md) | Read | `id`, `prescription_id`, `row_version` | Prescription_Upload / Intake projection / scoped joins; reading does not grant writes. |
| [`clinical.prescription_documents`](../../04-Database/Tables/clinical/prescription_documents.md) | Read | `id`, `prescription_id`, `row_version` | Prescription_Upload / Intake projection / scoped joins; reading does not grant writes. |
| [`clinical.review_reason_codes`](../../04-Database/Tables/clinical/review_reason_codes.md) | Read | `id`, `is_active`, `row_version` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`clinical.practitioner_profiles`](../../04-Database/Tables/clinical/practitioner_profiles.md) | Read | `id`, `is_deleted`, `row_version`, `user_id` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `internal_id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_items`](../../04-Database/Tables/commerce/order_items.md) | Read | `id`, `order_id`, `prescription_id`, `row_version`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | Read | `id`, `order_id`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | Create/update evidence | `decision`, `approved_quantity`, `reason_code`, `decided_at` | Pharmacist_Review owns these writes; Pharmacist_Review must invoke that narrow owner command. |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | Create/update evidence | `status`, `review_version`, `reviewed_by_user_id`, `reviewed_at` | Pharmacist_Review owns these writes; Pharmacist_Review must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedReviewVersion | clinical.order_reviews.review_version |
| request.expectedLineVersion | clinical.order_review_items.row_version |
| request.orderRevisionId | commerce.order_revisions.id |
| request.prescriptionId | clinical.prescriptions.id |
| request.decision | clinical.order_review_items.decision |
| request.approvedQuantity | clinical.order_review_items.approved_quantity |
| request.reasonCode | clinical.order_review_items.reason_code |
| data.reviewId | clinical.order_reviews.id |
| data.lineId | clinical.order_review_items.id |
| data.decision | clinical.order_review_items.decision |
| data.approvedQuantity | clinical.order_review_items.approved_quantity |
| data.reasonCode | clinical.order_review_items.reason_code |
| data.reviewVersion | clinical.order_reviews.review_version |
| data.lineVersion | clinical.order_review_items.row_version |
| data.orderRevisionId | commerce.order_revisions.id |
| data.decidedAt | clinical.order_review_items.decided_at |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md), [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`clinical.practitioner_profiles`](../../04-Database/Tables/clinical/practitioner_profiles.md), [`clinical.review_reason_codes`](../../04-Database/Tables/clinical/review_reason_codes.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../../04-Database/Tables/marketplace/sellers.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Bind patient, current order revision, exact SKU/form/strength/quantity and prescription version. Map approve/reject/request_new_prescription to approved/rejected/needs_new_rx. Positive approvedQuantity required on approval; approved reason required otherwise. Parent review status derives from all current line decisions. |
| Idempotency | Required key: scope actor + API-062 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Wrong patient/qualification is denied; stale review/line/revision returns STALE_VERSION. Changed evidence never inherits approval and M/O lines cannot be clinically rejected here. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-062-HAPPY` | Valid Qualified assigned Pharmacist context and documented fixture for record one exact p-line clinical decision with immutable reviewer evidence. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-062-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-062-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-062-SCOPE` | Use another customer/site/patient/task reference or remove clinical.reviews.decide. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-062-RULE` | Bind patient, current order revision, exact SKU/form/strength/quantity and prescription version. Map approve/reject/request_new_prescription to approved/rejected/needs_new_rx. Positive approvedQuantity required on approval; approved reason required otherwise. Parent review status derives from all current line decisions. | Wrong patient/qualification is denied; stale review/line/revision returns STALE_VERSION. Changed evidence never inherits approval and M/O lines cannot be clinically rejected here. |
| `CT-API-062-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-062-CONCURRENCY` | Race two record one exact p-line clinical decision with immutable reviewer evidence. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-062-STATE` | Apply command after Wrong patient/qualification is denied; stale review/line/revision returns STALE_VERSION. Changed evidence never inherits approval and M/O lines cannot be clinically rejected here. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-062-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Wrong patient/qualification is denied; stale review/line/revision returns STALE_VERSION. Changed evidence never inherits approval and M/O lines cannot be clinically rejected here. |

Existing feature assertions: `TC-PHM-03-OK`, `TC-PHM-03-DENY`, `TC-PHM-03-01`, `TC-PHM-05-OK`, `TC-PHM-05-DENY`, `TC-RX-05-OK`, `TC-RX-05-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-063 — POST `/v1/me/orders/{order_id}/revisions/{revision_id}/accept`

**Accept the exact proposed revision and its recalculated total.**

| Property | Proposed contract |
| --- | --- |
| API name | Accept the exact proposed revision and its recalculated total |
| Version / owner | v1 / Order_Operations |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `PHM-03`; [WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/orders/{order_id}/revisions/{revision_id}/accept` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | orders.revision.accept.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Customer owns order and both path IDs match. Only current proposed unexpired revision can be accepted; supersede prior accepted revision and apply exact snapshot under owner transaction. New/changed P evidence requires current review and new holds before payment/picking.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-063_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| order_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |
| revision_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `RevisionAcceptanceRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedOrderVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `expectedRevisionNumber` | integer | Required | No | None (not silently populated) | minimum=1 | Expected immutable commerce.order_revisions.revision_number; that table has no row_version. |
| `accepted` | boolean | Required | No | None (not silently populated) | const=true | API-only explicit acceptance guard; server derives acceptance actor/time. |


```json
{
  "expectedOrderVersion": 4,
  "expectedRevisionNumber": 2,
  "accepted": true
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `OrderRevisionData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-063. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks orders.revision.accept.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for accept the exact proposed revision and its recalculated total. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Customer owns order and both path IDs match. Only current proposed unexpired revision can be accepted; supersede prior accepted revision and apply exact snapshot under owner transaction. New/changed P evidence requires current review and new holds before payment/picking. | No unauthorized/partial domain effect; redact sensitive context. | Concurrent revision replacement/old acceptance changes nothing; compare latest basket again. No silent substitution or charging. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current accept the exact proposed revision and its recalculated total. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Concurrent revision replacement/old acceptance changes nothing; compare latest basket again. No silent substitution or charging. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-063 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | Read | `accepted_at`, `currency`, `grand_total`, `id`, `order_id`, `revision_number`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_items`](../../04-Database/Tables/commerce/order_items.md) | Read | `id`, `order_id`, `prescription_id`, `row_version`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | Read | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | Read | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `review_id`, `row_version` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | Create/update evidence | `status`, `accepted_at`, `accepted_by_user_id` | Order_Operations owns these writes; Order_Operations must invoke that narrow owner command. |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Create/update evidence | `current_revision_id`, `subtotal`, `discount_total`, `tax_total`, `shipping_total`, `other_charges_total`, `grand_total`, `prescription_status` | Order_Operations owns these writes; Order_Operations must invoke that narrow owner command. |
| [`commerce.order_items`](../../04-Database/Tables/commerce/order_items.md) | Create/update evidence | `quantity`, `unit_price`, `discount_amount`, `tax_amount`, `line_total`, `commerce_class_snapshot`, `commerce_class_version_snapshot` | Order_Operations owns these writes; Order_Operations must invoke that narrow owner command. |
| [`commerce.order_status_history`](../../04-Database/Tables/commerce/order_status_history.md) | Create/update evidence | `order_id`, `from_status`, `to_status`, `changed_at`, `changed_by_user_id`, `reason_code` | Order_Operations owns these writes; Order_Operations must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedOrderVersion | commerce.orders.row_version |
| request.expectedRevisionNumber | commerce.order_revisions.revision_number |
| request.accepted | API-only explicit acceptance guard; server derives acceptance actor/time. |
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

**Master dependencies:** [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md), [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`clinical.review_reason_codes`](../../04-Database/Tables/clinical/review_reason_codes.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../../04-Database/Tables/marketplace/sellers.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Customer owns order and both path IDs match. Only current proposed unexpired revision can be accepted; supersede prior accepted revision and apply exact snapshot under owner transaction. New/changed P evidence requires current review and new holds before payment/picking. |
| Idempotency | Required key: scope actor + API-063 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Concurrent revision replacement/old acceptance changes nothing; compare latest basket again. No silent substitution or charging. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-063-HAPPY` | Valid Customer context and documented fixture for accept the exact proposed revision and its recalculated total. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-063-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-063-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-063-SCOPE` | Use another customer/site/patient/task reference or remove orders.revision.accept.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-063-RULE` | Customer owns order and both path IDs match. Only current proposed unexpired revision can be accepted; supersede prior accepted revision and apply exact snapshot under owner transaction. New/changed P evidence requires current review and new holds before payment/picking. | Concurrent revision replacement/old acceptance changes nothing; compare latest basket again. No silent substitution or charging. |
| `CT-API-063-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-063-CONCURRENCY` | Race two accept the exact proposed revision and its recalculated total. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-063-STATE` | Apply command after Concurrent revision replacement/old acceptance changes nothing; compare latest basket again. No silent substitution or charging. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-063-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Concurrent revision replacement/old acceptance changes nothing; compare latest basket again. No silent substitution or charging. |

Existing feature assertions: `TC-PHM-03-OK`, `TC-PHM-03-DENY`, `TC-PHM-03-01`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
