# Admin CMS API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](API-Contract-Coverage.md) · [OpenAPI 3.1](openapi.yaml) · [decisions](Planning-Decisions.md) · [DTO conventions](API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="admin-cms-api-contracts"></a>
<a id="api-032--get-v1admindashboard"></a>
<a id="caller-permissions-and-dependencies"></a>
<a id="http-request-contract"></a>
<a id="success-response-illustrative"></a>
<a id="errors-concurrency-and-failure-recovery"></a>
<a id="required-verification"></a>
<a id="api-033--post-v1adminstaff"></a>
<a id="caller-permissions-and-dependencies-1"></a>
<a id="http-request-contract-1"></a>
<a id="success-response-illustrative-1"></a>
<a id="errors-concurrency-and-failure-recovery-1"></a>
<a id="required-verification-1"></a>
<a id="api-034--patch-v1adminstaffstaff_id"></a>
<a id="caller-permissions-and-dependencies-2"></a>
<a id="http-request-contract-2"></a>
<a id="success-response-illustrative-2"></a>
<a id="errors-concurrency-and-failure-recovery-2"></a>
<a id="required-verification-2"></a>
<a id="api-035--get-v1adminsettings"></a>
<a id="caller-permissions-and-dependencies-3"></a>
<a id="http-request-contract-3"></a>
<a id="success-response-illustrative-3"></a>
<a id="errors-concurrency-and-failure-recovery-3"></a>
<a id="required-verification-3"></a>
<a id="api-036--patch-v1adminsettings"></a>
<a id="caller-permissions-and-dependencies-4"></a>
<a id="http-request-contract-4"></a>
<a id="success-response-illustrative-4"></a>
<a id="errors-concurrency-and-failure-recovery-4"></a>
<a id="required-verification-4"></a>
<a id="api-037--post-v1admincmspagespage_idpublish"></a>
<a id="caller-permissions-and-dependencies-5"></a>
<a id="http-request-contract-5"></a>
<a id="success-response-illustrative-5"></a>
<a id="errors-concurrency-and-failure-recovery-5"></a>
<a id="required-verification-5"></a>
<a id="api-038--post-v1adminlocations"></a>
<a id="caller-permissions-and-dependencies-6"></a>
<a id="http-request-contract-6"></a>
<a id="success-response-illustrative-6"></a>
<a id="errors-concurrency-and-failure-recovery-6"></a>
<a id="required-verification-6"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-032 | `GET /v1/admin/dashboard` | Read role/location-scoped operational dashboard counts. | Complete proposed |
| API-033 | `POST /v1/admin/staff` | Invite a staff identity into approved organization/location roles. | Complete proposed |
| API-034 | `PATCH /v1/admin/staff/{staff_id}` | Change staff scope or deactivate access through Identity commands. | Complete proposed |
| API-035 | `GET /v1/admin/settings` | Read allowlisted nonsecret operational settings. | Complete proposed |
| API-036 | `PATCH /v1/admin/settings` | Update allowlisted versioned operational settings. | Complete proposed |
| API-037 | `POST /v1/admin/cms/pages/{page_id}/publish` | Publish one approved sanitized CMS content version. | Complete proposed |
| API-038 | `POST /v1/admin/locations` | Register a location master without granting dispensing eligibility. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| ADM-01 | Dashboard per role: orders by status, pending prescriptions, alerts, deliveries in progress | API-032 |
| ADM-02 | Staff users: invite, assign role and location, deactivate, log out sessions | API-033, API-034 |
| ADM-03 | Roles and permissions for 16 roles, limited to own store or warehouse | No direct operation; see [journey/API gaps](Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| ADM-04 | CMS: home banners, FAQs, policy pages, with draft and publish | API-037 |
| ADM-05 | System settings (PRD section 8) | API-035, API-036 |
| ADM-06 | Catalogue admin: products, categories, brands, salt master, prices, GST and HSN | No direct operation; see [journey/API gaps](Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| ADM-07 | Bulk product import from Excel, with error report | No direct operation; see [journey/API gaps](Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| ADM-08 | Store and warehouse master: address, hours, GSTIN, service areas | API-038 |
| ADM-09 | Offer settings: start and end dates, maximum discount, first-order offer | No direct operation; see [journey/API gaps](Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |

## API-032 — GET `/v1/admin/dashboard`

**Read role/location-scoped operational dashboard counts.**

| Property | Proposed contract |
| --- | --- |
| API name | Read role/location-scoped operational dashboard counts |
| Version / owner | v1 / Admin_CMS |
| Consumer | Admin / scoped Operations Manager |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ADM-01`; [WF-012](../06-Workflows/WF-012-Report-Export-and-Audit.md) |
| Design sources | [Module HLD](../03-Modules/Admin_CMS/HLD.md), [LLD](../03-Modules/Admin_CMS/LLD.md), [edge cases](../03-Modules/Admin_CMS/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/dashboard` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Admin / scoped Operations Manager | admin.dashboard.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Aggregate only authorized queues; narrow every domain read to allowed sites and role. Counts are asOf projections, not an accounting ledger.

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

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is fixed: `not applicable for this singleton`. Pagination: none.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `DashboardData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `asOf` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | Snapshot evaluation time. |
| `ordersByStatus` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=20 | Nested typed projection. |
| `ordersByStatus[].status` | string | Required | No | None (not silently populated) | enum=["created", "pending_payment", "payment_confirmed", "prescription_review", "confirmed", "allocated", "processing", "partially_fulfilled", "fulfilled", "cancelled", "closed"]; minLength=1; maxLength=19 | commerce.orders.status; character varying(19). |
| `ordersByStatus[].count` | integer | Required | No | None (not silently populated) | minimum=0 | COUNT of authorized commerce.orders grouped by its persisted status at asOf; not a global count. |
| `pendingPrescriptionReviews` | integer | Required | No | None (not silently populated) | minimum=0 | COUNT of authorized clinical.order_reviews with status pending/in_review; P-only review queue. |
| `deliveryTasksInProgress` | integer | Required | No | None (not silently populated) | minimum=0 | COUNT of current in-scope logistics.delivery_assignments whose shipment has not reached a terminal delivery outcome. |
| `stockAlerts` | integer | Required | No | None (not silently populated) | minimum=0 | COUNT of authorized warehouse.stock_balances whose inventory_observed_at is missing/stale under approved source policy; this dashboard count covers source-freshness alerts only. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "asOf": "2026-10-24T10:30:00Z",
    "ordersByStatus": [
      {
        "status": "created",
        "count": 1
      }
    ],
    "pendingPrescriptionReviews": 1,
    "deliveryTasksInProgress": 1,
    "stockAlerts": 1
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-032. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks admin.dashboard.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-032 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`clinical.order_reviews`](../04-Database/Tables/clinical/order_reviews.md) | Read | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`logistics.delivery_assignments`](../04-Database/Tables/logistics/delivery_assignments.md) | Read | `accepted_at`, `delivery_user_id`, `ended_at`, `id`, `is_current`, `row_version`, `shipment_id`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_balances`](../04-Database/Tables/warehouse/stock_balances.md) | Read | `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`logistics.shipments`](../04-Database/Tables/logistics/shipments.md) | Read | `id`, `order_id`, `order_revision_id`, `row_version`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.asOf | API-only server evaluation timestamp; not a historical snapshot guarantee. |
| data.ordersByStatus[].status | commerce.orders.status |
| data.ordersByStatus[].count | COUNT of authorized commerce.orders grouped by its persisted status at asOf; not a global count. |
| data.pendingPrescriptionReviews | COUNT of authorized clinical.order_reviews with status pending/in_review; P-only review queue. |
| data.deliveryTasksInProgress | COUNT of current in-scope logistics.delivery_assignments whose shipment has not reached a terminal delivery outcome. |
| data.stockAlerts | COUNT of authorized warehouse.stock_balances whose inventory_observed_at is missing/stale under approved source policy; this dashboard count covers source-freshness alerts only. |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md), [`clinical.review_reason_codes`](../04-Database/Tables/clinical/review_reason_codes.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`logistics.carriers`](../04-Database/Tables/logistics/carriers.md), [`warehouse.bins`](../04-Database/Tables/warehouse/bins.md), [`warehouse.warehouses`](../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Aggregate only authorized queues; narrow every domain read to allowed sites and role. Counts are asOf projections, not an accounting ledger. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Forbidden location filter returns 403; a failed domain projection returns 503, never zero-filled healthy-looking counts. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-032-HAPPY` | Valid Admin / scoped Operations Manager context and documented fixture for read role/location-scoped operational dashboard counts. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-032-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-032-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-032-SCOPE` | Use another customer/site/patient/task reference or remove admin.dashboard.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-032-RULE` | Aggregate only authorized queues; narrow every domain read to allowed sites and role. Counts are asOf projections, not an accounting ledger. | Forbidden location filter returns 403; a failed domain projection returns 503, never zero-filled healthy-looking counts. |
| `CT-API-032-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-032-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-032-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-032-RECOVERY` | Dependency timeout during read role/location-scoped operational dashboard counts. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-ADM-01-OK`, `TC-ADM-01-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-033 — POST `/v1/admin/staff`

**Invite a staff identity into approved organization/location roles.**

| Property | Proposed contract |
| --- | --- |
| API name | Invite a staff identity into approved organization/location roles |
| Version / owner | v1 / Authentication_Access with organization membership owner |
| Consumer | Identity Administrator |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ADM-02`; [WF-001](../06-Workflows/WF-001-Identity-and-Session.md) |
| Design sources | [Module HLD](../03-Modules/Admin_CMS/HLD.md), [LLD](../03-Modules/Admin_CMS/LLD.md), [edge cases](../03-Modules/Admin_CMS/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/staff` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Identity Administrator | identity.staff.invite (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Inviter must be allowed every requested role/scope; reject self-escalation and nondelegable grants. Identity owner creates pending user/role links; Operations membership is limited to verified organization/location. Invitation does not return credentials.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-033_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `StaffInviteRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `email` | string (email) | Required | No | None (not silently populated) | format="email"; minLength=1; maxLength=320 | Normalized invitation address; no password in this API. |
| `organizationId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from organization.memberships.organization_id. Ownership and current-state checks apply before use. |
| `locationId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from organization.memberships.location_id. Ownership and current-state checks apply before use. |
| `roleIds` | array<string (uuid)> | Required | No | None (not silently populated) | minItems=1; maxItems=16 | Nested typed projection. |


```json
{
  "email": "asha@example.invalid",
  "organizationId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "locationId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "roleIds": [
    "0192a1b2-c3d4-7e8f-9012-3456789abcde"
  ]
}
```

File upload: **Not Applicable**.

### Success response

HTTP **201**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `StaffData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-033. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks identity.staff.invite or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for invite a staff identity into approved organization/location roles. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Inviter must be allowed every requested role/scope; reject self-escalation and nondelegable grants. Identity owner creates pending user/role links; Operations membership is limited to verified organization/location. Invitation does not return credentials. | No unauthorized/partial domain effect; redact sensitive context. | Existing identity can receive a new allowed membership without duplicate user; duplicate membership returns existing replay or conflict. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Existing identity can receive a new allowed membership without duplicate user; duplicate membership returns existing replay or conflict. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-033 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`identity.users`](../04-Database/Tables/identity/users.md) | Read | `created_by`, `email`, `id`, `row_version`, `status`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.roles`](../04-Database/Tables/identity/roles.md) | Read | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.permissions`](../04-Database/Tables/identity/permissions.md) | Read | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`organization.locations`](../04-Database/Tables/organization/locations.md) | Read | `created_by`, `deleted_by`, `id`, `is_active`, `is_deleted`, `organization_id`, `row_version`, `updated_by` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`organization.memberships`](../04-Database/Tables/organization/memberships.md) | Read | `created_by`, `id`, `location_id`, `manager_user_id`, `organization_id`, `row_version`, `status`, `updated_by`, `user_id` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`identity.users`](../04-Database/Tables/identity/users.md) | Create/update evidence | `email`, `email_normalized`, `status` | Authentication_Access owns these writes; Authentication_Access with organization membership owner must invoke that narrow owner command. |
| [`identity.user_roles`](../04-Database/Tables/identity/user_roles.md) | Create/update evidence | `user_id`, `role_id`, `scope_type`, `scope_id`, `is_active` | Authentication_Access owns these writes; Authentication_Access with organization membership owner must invoke that narrow owner command. |
| [`organization.memberships`](../04-Database/Tables/organization/memberships.md) | Create/update evidence | `user_id`, `organization_id`, `location_id`, `status` | Admin_CMS via Organization owner owns these writes; Authentication_Access with organization membership owner must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.email | identity.users.email |
| request.organizationId | organization.memberships.organization_id |
| request.locationId | organization.memberships.location_id |
| request.roleIds[] | identity.roles.id |
| data.membershipId | organization.memberships.id |
| data.staffId | organization.memberships.user_id |
| data.organizationId | organization.memberships.organization_id |
| data.locationId | organization.memberships.location_id |
| data.status | organization.memberships.status |
| data.rowVersion | organization.memberships.row_version |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`organization.departments`](../04-Database/Tables/organization/departments.md), [`organization.locations`](../04-Database/Tables/organization/locations.md), [`organization.organizations`](../04-Database/Tables/organization/organizations.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Inviter must be allowed every requested role/scope; reject self-escalation and nondelegable grants. Identity owner creates pending user/role links; Operations membership is limited to verified organization/location. Invitation does not return credentials. |
| Idempotency | Required key: scope actor + API-033 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Existing identity can receive a new allowed membership without duplicate user; duplicate membership returns existing replay or conflict. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-033-HAPPY` | Valid Identity Administrator context and documented fixture for invite a staff identity into approved organization/location roles. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-033-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-033-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-033-SCOPE` | Use another customer/site/patient/task reference or remove identity.staff.invite. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-033-RULE` | Inviter must be allowed every requested role/scope; reject self-escalation and nondelegable grants. Identity owner creates pending user/role links; Operations membership is limited to verified organization/location. Invitation does not return credentials. | Existing identity can receive a new allowed membership without duplicate user; duplicate membership returns existing replay or conflict. |
| `CT-API-033-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-033-CONCURRENCY` | Race two invite a staff identity into approved organization/location roles. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-033-STATE` | Apply command after Existing identity can receive a new allowed membership without duplicate user; duplicate membership returns existing replay or conflict. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-033-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Existing identity can receive a new allowed membership without duplicate user; duplicate membership returns existing replay or conflict. |

Existing feature assertions: `TC-ADM-02-OK`, `TC-ADM-02-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-034 — PATCH `/v1/admin/staff/{staff_id}`

**Change staff scope or deactivate access through Identity commands.**

| Property | Proposed contract |
| --- | --- |
| API name | Change staff scope or deactivate access through Identity commands |
| Version / owner | v1 / Authentication_Access with organization membership owner |
| Consumer | Identity Administrator |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ADM-02`; [WF-001](../06-Workflows/WF-001-Identity-and-Session.md) |
| Design sources | [Module HLD](../03-Modules/Admin_CMS/HLD.md), [LLD](../03-Modules/Admin_CMS/LLD.md), [edge cases](../03-Modules/Admin_CMS/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/staff/{staff_id}` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Identity Administrator | identity.staff.manage (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

At least one mutable field is required. Validate both user and membership versions. Suspension revokes active sessions and grants in the same proposed owner-coordinated transaction; cannot grant own privilege.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-034_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| staff_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `StaffUpdateRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedMembershipVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `expectedUserVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `locationId` | string (uuid) | Optional | No | None (not silently populated) | format="uuid" | Public DTO value from organization.memberships.location_id. Ownership and current-state checks apply before use. |
| `roleIds` | array<string (uuid)> | Optional | No | None (not silently populated) | minItems=1; maxItems=16 | Nested typed projection. |
| `status` | string | Optional | No | None (not silently populated) | enum=["active", "suspended"] | Identity account status; cannot close historical evidence here. |


```json
{
  "expectedMembershipVersion": 4,
  "expectedUserVersion": 4,
  "locationId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "roleIds": [
    "0192a1b2-c3d4-7e8f-9012-3456789abcde"
  ],
  "status": "active"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `StaffData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-034. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks identity.staff.manage or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for change staff scope or deactivate access through identity commands. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | At least one mutable field is required. Validate both user and membership versions. Suspension revokes active sessions and grants in the same proposed owner-coordinated transaction; cannot grant own privilege. | No unauthorized/partial domain effect; redact sensitive context. | Stale version changes no grants; a deactivated user session is denied on subsequent protected commands. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current change staff scope or deactivate access through identity commands. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Stale version changes no grants; a deactivated user session is denied on subsequent protected commands. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-034 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`identity.users`](../04-Database/Tables/identity/users.md) | Read | `created_by`, `id`, `row_version`, `status`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.roles`](../04-Database/Tables/identity/roles.md) | Read | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.user_roles`](../04-Database/Tables/identity/user_roles.md) | Read | `created_by`, `id`, `is_active`, `role_id`, `row_version`, `updated_by`, `user_id`, `valid_from`, `valid_until` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`organization.memberships`](../04-Database/Tables/organization/memberships.md) | Read | `created_by`, `id`, `location_id`, `manager_user_id`, `organization_id`, `row_version`, `status`, `updated_by`, `user_id` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`organization.locations`](../04-Database/Tables/organization/locations.md) | Read | `created_by`, `deleted_by`, `id`, `is_active`, `is_deleted`, `organization_id`, `row_version`, `updated_by` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`identity.sessions`](../04-Database/Tables/identity/sessions.md) | Read | `created_by`, `expires_at`, `id`, `refresh_token_hash`, `revoked_at`, `row_version`, `token_family_id`, `updated_by`, `user_id` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.users`](../04-Database/Tables/identity/users.md) | Create/update evidence | `status` | Authentication_Access owns these writes; Authentication_Access with organization membership owner must invoke that narrow owner command. |
| [`identity.user_roles`](../04-Database/Tables/identity/user_roles.md) | Create/update evidence | `is_active`, `scope_type`, `scope_id`, `valid_until` | Authentication_Access owns these writes; Authentication_Access with organization membership owner must invoke that narrow owner command. |
| [`organization.memberships`](../04-Database/Tables/organization/memberships.md) | Create/update evidence | `location_id`, `status`, `left_at` | Admin_CMS via Organization owner owns these writes; Authentication_Access with organization membership owner must invoke that narrow owner command. |
| [`identity.sessions`](../04-Database/Tables/identity/sessions.md) | Create/update evidence | `revoked_at`, `revoke_reason` | Authentication_Access owns these writes; Authentication_Access with organization membership owner must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedMembershipVersion | organization.memberships.row_version |
| request.expectedUserVersion | identity.users.row_version |
| request.locationId | organization.memberships.location_id |
| request.roleIds[] | identity.roles.id |
| request.status | identity.users.status |
| data.membershipId | organization.memberships.id |
| data.staffId | organization.memberships.user_id |
| data.organizationId | organization.memberships.organization_id |
| data.locationId | organization.memberships.location_id |
| data.status | organization.memberships.status |
| data.rowVersion | organization.memberships.row_version |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`organization.departments`](../04-Database/Tables/organization/departments.md), [`organization.locations`](../04-Database/Tables/organization/locations.md), [`organization.organizations`](../04-Database/Tables/organization/organizations.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | At least one mutable field is required. Validate both user and membership versions. Suspension revokes active sessions and grants in the same proposed owner-coordinated transaction; cannot grant own privilege. |
| Idempotency | Required key: scope actor + API-034 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Stale version changes no grants; a deactivated user session is denied on subsequent protected commands. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-034-HAPPY` | Valid Identity Administrator context and documented fixture for change staff scope or deactivate access through identity commands. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-034-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-034-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-034-SCOPE` | Use another customer/site/patient/task reference or remove identity.staff.manage. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-034-RULE` | At least one mutable field is required. Validate both user and membership versions. Suspension revokes active sessions and grants in the same proposed owner-coordinated transaction; cannot grant own privilege. | Stale version changes no grants; a deactivated user session is denied on subsequent protected commands. |
| `CT-API-034-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-034-CONCURRENCY` | Race two change staff scope or deactivate access through identity commands. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-034-STATE` | Apply command after Stale version changes no grants; a deactivated user session is denied on subsequent protected commands. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-034-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Stale version changes no grants; a deactivated user session is denied on subsequent protected commands. |

Existing feature assertions: `TC-ADM-02-OK`, `TC-ADM-02-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-035 — GET `/v1/admin/settings`

**Read allowlisted nonsecret operational settings.**

| Property | Proposed contract |
| --- | --- |
| API name | Read allowlisted nonsecret operational settings |
| Version / owner | v1 / Admin_CMS |
| Consumer | Admin / Configuration Manager |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ADM-05`; [WF-009](../06-Workflows/WF-009-COD-Collection.md) |
| Design sources | [Module HLD](../03-Modules/Admin_CMS/HLD.md), [LLD](../03-Modules/Admin_CMS/LLD.md), [edge cases](../03-Modules/Admin_CMS/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/settings` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Admin / Configuration Manager | admin.settings.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Only configuration keys explicitly registered for this caller; omit all secret references. Proposed initial projection is checkout.codEnabled boolean, contingent on D-007.

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

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is fixed: `not applicable for this singleton`. Pagination: none.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `SettingsData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `settings` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `settings[].namespace` | string | Required | No | None (not silently populated) | minLength=1; maxLength=128 | platform.application_settings.namespace; character varying(128). |
| `settings[].key` | string | Required | No | None (not silently populated) | minLength=1; maxLength=128 | platform.application_settings.key; character varying(128). |
| `settings[].value` | boolean | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Whitelisted boolean JSONB scalar; secrets and unrestricted JSONB are excluded. |
| `settings[].rowVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "settings": [
      {
        "namespace": "namespace",
        "key": "key",
        "value": true,
        "rowVersion": 4
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-035. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks admin.settings.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-035 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`platform.application_settings`](../04-Database/Tables/platform/application_settings.md) | Read | `id`, `is_deleted`, `key`, `namespace`, `row_version`, `value` | Admin_CMS / platform configuration owner projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.settings[].namespace | platform.application_settings.namespace |
| data.settings[].key | platform.application_settings.key |
| data.settings[].value | platform.application_settings.value |
| data.settings[].rowVersion | platform.application_settings.row_version |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Only configuration keys explicitly registered for this caller; omit all secret references. Proposed initial projection is checkout.codEnabled boolean, contingent on D-007. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Missing approved configuration is absent, never an invented default enabling COD. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-035-HAPPY` | Valid Admin / Configuration Manager context and documented fixture for read allowlisted nonsecret operational settings. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-035-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-035-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-035-SCOPE` | Use another customer/site/patient/task reference or remove admin.settings.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-035-RULE` | Only configuration keys explicitly registered for this caller; omit all secret references. Proposed initial projection is checkout.codEnabled boolean, contingent on D-007. | Missing approved configuration is absent, never an invented default enabling COD. |
| `CT-API-035-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-035-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-035-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-035-RECOVERY` | Dependency timeout during read allowlisted nonsecret operational settings. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-ADM-05-OK`, `TC-ADM-05-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-036 — PATCH `/v1/admin/settings`

**Update allowlisted versioned operational settings.**

| Property | Proposed contract |
| --- | --- |
| API name | Update allowlisted versioned operational settings |
| Version / owner | v1 / Admin_CMS |
| Consumer | Configuration Manager with Finance approval |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ADM-05`; [WF-009](../06-Workflows/WF-009-COD-Collection.md) |
| Design sources | [Module HLD](../03-Modules/Admin_CMS/HLD.md), [LLD](../03-Modules/Admin_CMS/LLD.md), [edge cases](../03-Modules/Admin_CMS/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/settings` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Configuration Manager with Finance approval | admin.settings.manage (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Only checkout.codEnabled is in the initial proposed allowlist; enabling requires D-007 policy approval. At most 50 unique namespace/key pairs; each version must match, all succeed or none. Accepted orders retain original terms.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-036_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `SettingsUpdateRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `settings` | array<object> | Required | No | None (not silently populated) | minItems=1; maxItems=50 | Nested typed projection. |
| `settings[].namespace` | string | Required | No | None (not silently populated) | minLength=1; maxLength=128 | Public DTO value from platform.application_settings.namespace. Ownership and current-state checks apply before use. |
| `settings[].key` | string | Required | No | None (not silently populated) | minLength=1; maxLength=128 | Public DTO value from platform.application_settings.key. Ownership and current-state checks apply before use. |
| `settings[].value` | boolean | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from platform.application_settings.value. Ownership and current-state checks apply before use. |
| `settings[].expectedVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |


```json
{
  "settings": [
    {
      "namespace": "checkout",
      "key": "codEnabled",
      "value": true,
      "expectedVersion": 4
    }
  ]
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `SettingsData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `settings` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `settings[].namespace` | string | Required | No | None (not silently populated) | minLength=1; maxLength=128 | platform.application_settings.namespace; character varying(128). |
| `settings[].key` | string | Required | No | None (not silently populated) | minLength=1; maxLength=128 | platform.application_settings.key; character varying(128). |
| `settings[].value` | boolean | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Whitelisted boolean JSONB scalar; secrets and unrestricted JSONB are excluded. |
| `settings[].rowVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "settings": [
      {
        "namespace": "namespace",
        "key": "key",
        "value": true,
        "rowVersion": 4
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-036. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks admin.settings.manage or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for update allowlisted versioned operational settings. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Only checkout.codEnabled is in the initial proposed allowlist; enabling requires D-007 policy approval. At most 50 unique namespace/key pairs; each version must match, all succeed or none. Accepted orders retain original terms. | No unauthorized/partial domain effect; redact sensitive context. | Unsupported keys, secrets and retroactive repricing are rejected; stale setting reloads before retry. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current update allowlisted versioned operational settings. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Unsupported keys, secrets and retroactive repricing are rejected; stale setting reloads before retry. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-036 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`platform.application_settings`](../04-Database/Tables/platform/application_settings.md) | Read | `id`, `is_deleted`, `key`, `namespace`, `row_version`, `value` | Admin_CMS / platform configuration owner projection / scoped joins; reading does not grant writes. |
| [`platform.application_settings`](../04-Database/Tables/platform/application_settings.md) | Create/update evidence | `value` | Admin_CMS / platform configuration owner owns these writes; Admin_CMS must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.settings[].namespace | platform.application_settings.namespace |
| request.settings[].key | platform.application_settings.key |
| request.settings[].value | platform.application_settings.value |
| request.settings[].expectedVersion | Expected current row_version; compare atomically. |
| data.settings[].namespace | platform.application_settings.namespace |
| data.settings[].key | platform.application_settings.key |
| data.settings[].value | platform.application_settings.value |
| data.settings[].rowVersion | platform.application_settings.row_version |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Only checkout.codEnabled is in the initial proposed allowlist; enabling requires D-007 policy approval. At most 50 unique namespace/key pairs; each version must match, all succeed or none. Accepted orders retain original terms. |
| Idempotency | Required key: scope actor + API-036 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Unsupported keys, secrets and retroactive repricing are rejected; stale setting reloads before retry. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-036-HAPPY` | Valid Configuration Manager with Finance approval context and documented fixture for update allowlisted versioned operational settings. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-036-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-036-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-036-SCOPE` | Use another customer/site/patient/task reference or remove admin.settings.manage. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-036-RULE` | Only checkout.codEnabled is in the initial proposed allowlist; enabling requires D-007 policy approval. At most 50 unique namespace/key pairs; each version must match, all succeed or none. Accepted orders retain original terms. | Unsupported keys, secrets and retroactive repricing are rejected; stale setting reloads before retry. |
| `CT-API-036-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-036-CONCURRENCY` | Race two update allowlisted versioned operational settings. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-036-STATE` | Apply command after Unsupported keys, secrets and retroactive repricing are rejected; stale setting reloads before retry. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-036-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Unsupported keys, secrets and retroactive repricing are rejected; stale setting reloads before retry. |

Existing feature assertions: `TC-ADM-05-OK`, `TC-ADM-05-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-037 — POST `/v1/admin/cms/pages/{page_id}/publish`

**Publish one approved sanitized CMS content version.**

| Property | Proposed contract |
| --- | --- |
| API name | Publish one approved sanitized CMS content version |
| Version / owner | v1 / Admin_CMS |
| Consumer | Content Publisher |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ADM-04`; [WF-012](../06-Workflows/WF-012-Report-Export-and-Audit.md) |
| Design sources | [Module HLD](../03-Modules/Admin_CMS/HLD.md), [LLD](../03-Modules/Admin_CMS/LLD.md), [edge cases](../03-Modules/Admin_CMS/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/cms/pages/{page_id}/publish` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Content Publisher | cms.publish (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Version must belong to the page and have approved_by_user_id. Sanitize allowed content/links; draft/in_review becomes published; do not overwrite body of an issued version.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-037_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| page_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `CmsPublishRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedPageVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `contentVersionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | platform.cms_page_versions.id; approved immutable content. |


```json
{
  "expectedPageVersion": 4,
  "contentVersionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `CmsPublishData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `pageId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | platform.cms_pages.id; uuid. |
| `slug` | string | Required | No | None (not silently populated) | minLength=1; maxLength=255 | platform.cms_pages.slug; character varying(255). |
| `status` | string | Required | No | None (not silently populated) | enum=["draft", "in_review", "published", "archived"]; minLength=1; maxLength=16 | platform.cms_pages.status; character varying(16). |
| `rowVersion` | integer | Required | No | None (not silently populated) | minimum=0 | platform.cms_pages.row_version; bigint. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "pageId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "slug": "example-personal-care-item",
    "status": "draft",
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-037. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks cms.publish or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for publish one approved sanitized cms content version. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Version must belong to the page and have approved_by_user_id. Sanitize allowed content/links; draft/in_review becomes published; do not overwrite body of an issued version. | No unauthorized/partial domain effect; redact sensitive context. | Concurrent publish from stale page version returns STALE_VERSION and leaves one accepted publication. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current publish one approved sanitized cms content version. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Concurrent publish from stale page version returns STALE_VERSION and leaves one accepted publication. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-037 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`platform.cms_pages`](../04-Database/Tables/platform/cms_pages.md) | Read | `id`, `is_deleted`, `row_version`, `slug`, `status` | Admin_CMS / platform configuration owner projection / scoped joins; reading does not grant writes. |
| [`platform.cms_page_versions`](../04-Database/Tables/platform/cms_page_versions.md) | Read | `id`, `page_id` | Admin_CMS / platform configuration owner projection / scoped joins; reading does not grant writes. |
| [`platform.cms_pages`](../04-Database/Tables/platform/cms_pages.md) | Create/update evidence | `status`, `updated_by_user_id` | Admin_CMS / platform configuration owner owns these writes; Admin_CMS must invoke that narrow owner command. |
| [`platform.cms_page_versions`](../04-Database/Tables/platform/cms_page_versions.md) | Create/update evidence | `published_at` | Admin_CMS / platform configuration owner owns these writes; Admin_CMS must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedPageVersion | platform.cms_pages.row_version |
| request.contentVersionId | platform.cms_page_versions.id |
| data.pageId | platform.cms_pages.id |
| data.slug | platform.cms_pages.slug |
| data.status | platform.cms_pages.status |
| data.rowVersion | platform.cms_pages.row_version |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Version must belong to the page and have approved_by_user_id. Sanitize allowed content/links; draft/in_review becomes published; do not overwrite body of an issued version. |
| Idempotency | Required key: scope actor + API-037 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Concurrent publish from stale page version returns STALE_VERSION and leaves one accepted publication. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-037-HAPPY` | Valid Content Publisher context and documented fixture for publish one approved sanitized cms content version. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-037-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-037-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-037-SCOPE` | Use another customer/site/patient/task reference or remove cms.publish. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-037-RULE` | Version must belong to the page and have approved_by_user_id. Sanitize allowed content/links; draft/in_review becomes published; do not overwrite body of an issued version. | Concurrent publish from stale page version returns STALE_VERSION and leaves one accepted publication. |
| `CT-API-037-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-037-CONCURRENCY` | Race two publish one approved sanitized cms content version. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-037-STATE` | Apply command after Concurrent publish from stale page version returns STALE_VERSION and leaves one accepted publication. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-037-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Concurrent publish from stale page version returns STALE_VERSION and leaves one accepted publication. |

Existing feature assertions: `TC-ADM-04-OK`, `TC-ADM-04-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-038 — POST `/v1/admin/locations`

**Register a location master without granting dispensing eligibility.**

| Property | Proposed contract |
| --- | --- |
| API name | Register a location master without granting dispensing eligibility |
| Version / owner | v1 / Admin_CMS |
| Consumer | Organization Administrator |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ADM-08`; [WF-006](../06-Workflows/WF-006-Licensed-Site-Allocation.md) |
| Design sources | [Module HLD](../03-Modules/Admin_CMS/HLD.md), [LLD](../03-Modules/Admin_CMS/LLD.md), [edge cases](../03-Modules/Admin_CMS/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/locations` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Organization Administrator | organization.locations.create (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Code is unique within organization and stable. Create inactive until verified operating/license data is supplied; no invented GSTIN, HFR or licenses. Address JSON is the stated projection, geo_metadata defaults empty as persisted configuration.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-038_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `LocationCreateRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `organizationId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from organization.locations.organization_id. Ownership and current-state checks apply before use. |
| `code` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | organization.locations.code; character varying(64). |
| `name` | string | Required | No | None (not silently populated) | minLength=1; maxLength=150 | organization.locations.name; character varying(150). |
| `locationType` | string | Required | No | None (not silently populated) | enum=["store", "warehouse"] | Proposed application allowlist; existing varchar has no location-type master. |
| `postalCode` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=16 | organization.locations.postal_code; character varying(16). |
| `address` | object | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `address.line1` | string | Required | No | None (not silently populated) | minLength=1; maxLength=255 | organization.locations.address_json.line1 JSON key, validated by the proposed address projection. |
| `address.city` | string | Required | No | None (not silently populated) | minLength=1; maxLength=100 | organization.locations.address_json.city JSON key, validated by the proposed address projection. |
| `address.state` | string | Required | No | None (not silently populated) | minLength=1; maxLength=100 | organization.locations.address_json.state JSON key, validated by the proposed address projection. |
| `address.countryCode` | string | Required | No | None (not silently populated) | minLength=1; maxLength=2 | organization.locations.address_json.countryCode JSON key, validated by the proposed address projection. |
| `timezone` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | Public DTO value from organization.locations.timezone. Ownership and current-state checks apply before use. |


```json
{
  "organizationId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "code": "EXAMPLE_STORE",
  "name": "Example personal care item",
  "locationType": "store",
  "postalCode": "201301",
  "address": {
    "line1": "12 Example Avenue",
    "city": "Noida",
    "state": "Uttar Pradesh",
    "countryCode": "IN"
  },
  "timezone": "Asia/Kolkata"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **201**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `LocationData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `locationId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | organization.locations.id; uuid. |
| `organizationId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | organization.locations.organization_id; uuid. |
| `code` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | organization.locations.code; character varying(64). |
| `name` | string | Required | No | None (not silently populated) | minLength=1; maxLength=150 | organization.locations.name; character varying(150). |
| `locationType` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | organization.locations.location_type; character varying(32). |
| `isActive` | boolean | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | organization.locations.is_active; boolean. |
| `postalCode` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=16 | organization.locations.postal_code; character varying(16). |
| `timezone` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | organization.locations.timezone; character varying(64). |
| `rowVersion` | integer | Required | No | None (not silently populated) | minimum=0 | organization.locations.row_version; bigint. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "locationId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "organizationId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "code": "EXAMPLE_STORE",
    "name": "Example personal care item",
    "locationType": "location type",
    "isActive": true,
    "postalCode": "201301",
    "timezone": "timezone",
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-038. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks organization.locations.create or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for register a location master without granting dispensing eligibility. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Code is unique within organization and stable. Create inactive until verified operating/license data is supplied; no invented GSTIN, HFR or licenses. Address JSON is the stated projection, geo_metadata defaults empty as persisted configuration. | No unauthorized/partial domain effect; redact sensitive context. | Duplicate organization/code returns RESOURCE_CONFLICT; active flag alone never passes license gates. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Duplicate organization/code returns RESOURCE_CONFLICT; active flag alone never passes license gates. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-038 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`organization.organizations`](../04-Database/Tables/organization/organizations.md) | Read | `id`, `is_deleted`, `row_version`, `status` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`organization.locations`](../04-Database/Tables/organization/locations.md) | Read | `address_json`, `code`, `id`, `is_active`, `is_deleted`, `location_type`, `name`, `organization_id`, `postal_code`, `row_version`, `timezone` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`organization.locations`](../04-Database/Tables/organization/locations.md) | Create/update evidence | `organization_id`, `code`, `name`, `location_type`, `postal_code`, `address_json`, `timezone`, `is_active`, `geo_metadata` | Admin_CMS via Organization owner owns these writes; Admin_CMS must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.organizationId | organization.locations.organization_id |
| request.code | organization.locations.code |
| request.name | organization.locations.name |
| request.locationType | organization.locations.location_type |
| request.postalCode | organization.locations.postal_code |
| request.address.line1 | organization.locations.address_json |
| request.address.city | organization.locations.address_json |
| request.address.state | organization.locations.address_json |
| request.address.countryCode | organization.locations.address_json |
| request.timezone | organization.locations.timezone |
| data.locationId | organization.locations.id |
| data.organizationId | organization.locations.organization_id |
| data.code | organization.locations.code |
| data.name | organization.locations.name |
| data.locationType | organization.locations.location_type |
| data.isActive | organization.locations.is_active |
| data.postalCode | organization.locations.postal_code |
| data.timezone | organization.locations.timezone |
| data.rowVersion | organization.locations.row_version |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`organization.locations`](../04-Database/Tables/organization/locations.md), [`organization.organizations`](../04-Database/Tables/organization/organizations.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Code is unique within organization and stable. Create inactive until verified operating/license data is supplied; no invented GSTIN, HFR or licenses. Address JSON is the stated projection, geo_metadata defaults empty as persisted configuration. |
| Idempotency | Required key: scope actor + API-038 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Duplicate organization/code returns RESOURCE_CONFLICT; active flag alone never passes license gates. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-038-HAPPY` | Valid Organization Administrator context and documented fixture for register a location master without granting dispensing eligibility. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-038-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-038-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-038-SCOPE` | Use another customer/site/patient/task reference or remove organization.locations.create. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-038-RULE` | Code is unique within organization and stable. Create inactive until verified operating/license data is supplied; no invented GSTIN, HFR or licenses. Address JSON is the stated projection, geo_metadata defaults empty as persisted configuration. | Duplicate organization/code returns RESOURCE_CONFLICT; active flag alone never passes license gates. |
| `CT-API-038-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-038-CONCURRENCY` | Race two register a location master without granting dispensing eligibility. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-038-STATE` | Apply command after Duplicate organization/code returns RESOURCE_CONFLICT; active flag alone never passes license gates. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-038-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Duplicate organization/code returns RESOURCE_CONFLICT; active flag alone never passes license gates. |

Existing feature assertions: `TC-ADM-08-OK`, `TC-ADM-08-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
