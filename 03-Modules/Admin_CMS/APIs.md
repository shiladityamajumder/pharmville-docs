# Admin CMS API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](../../05-APIs/API-Contract-Coverage.md) · [OpenAPI 3.1](../../05-APIs/openapi.yaml) · [decisions](../../05-APIs/Planning-Decisions.md) · [DTO conventions](../../05-APIs/API-Conventions.md). Every CT scenario is Designed / NOT RUN.

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
| API-032 | `GET /v1/admin/dashboard` | Read role/location-scoped operational dashboard counts | Complete proposed |
| API-033 | `POST /v1/admin/staff` | Invite a staff identity into approved organization/location roles | Complete proposed |
| API-034 | `PATCH /v1/admin/staff/{staff_id}` | Change staff scope or deactivate access through Identity commands | Complete proposed |
| API-035 | `GET /v1/admin/settings` | Read allowlisted nonsecret operational settings | Complete proposed |
| API-036 | `PATCH /v1/admin/settings` | Update allowlisted versioned operational settings | Complete proposed |
| API-037 | `POST /v1/admin/cms/pages/{page_id}/publish` | Publish one approved sanitized CMS content version | Complete proposed |
| API-038 | `POST /v1/admin/locations` | Register a location master without granting dispensing eligibility | Complete proposed |
| API-108 | `PUT /v1/admin/roles/{role_id}/permissions` | Replace an existing role permission set through central Identity | Complete proposed |
| API-109 | `POST /v1/admin/users/{user_id}/role-assignments` | Assign an existing role to the shared subject in an exact scope | Complete proposed |
| API-110 | `PATCH /v1/admin/role-assignments/{assignment_id}` | Change assignment activity or validity with immediate live-policy effect | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| ADM-01 | Dashboard per role: orders by status, pending prescriptions, alerts, deliveries in progress | API-032 |
| ADM-02 | Staff users: invite, assign role and location, deactivate, log out sessions | API-033, API-034, API-109, API-110 |
| ADM-03 | Roles and permissions for 16 roles, limited to own store or warehouse | API-108, API-111, API-109, API-112, API-110 |
| ADM-04 | CMS: home banners, FAQs, policy pages, with draft and publish | API-037 |
| ADM-05 | System settings (PRD section 8) | API-035, API-036 |
| ADM-06 | Catalogue admin: products, categories, brands, salt master, prices, GST and HSN | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| ADM-07 | Bulk product import from Excel, with error report | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| ADM-08 | Store and warehouse master: address, hours, GSTIN, service areas | API-038 |
| ADM-09 | Offer settings: start and end dates, maximum discount, first-order offer | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-111 | `GET /v1/admin/roles/{role_id}/permissions` | Read an existing role permission set and its current ETag | Complete proposed |
| API-112 | `GET /v1/admin/users/{user_id}/role-assignments` | List target identity role assignments within the administrator scope | Complete proposed |

## API-032 — GET `/v1/admin/dashboard`

**Read role/location-scoped operational dashboard counts.**

| Property | Proposed contract |
| --- | --- |
| API name | Read role/location-scoped operational dashboard counts |
| Version / owner | v1 / Admin_CMS |
| Consumer | Admin / scoped Operations Manager |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ADM-01`; [WF-012](../../06-Workflows/WF-012-Report-Export-and-Audit.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
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

Data DTO: `DashboardData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

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
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | Read | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`logistics.delivery_assignments`](../../04-Database/Tables/logistics/delivery_assignments.md) | Read | `accepted_at`, `delivery_user_id`, `ended_at`, `id`, `is_current`, `row_version`, `shipment_id`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | Read | `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | Read | `id`, `order_id`, `order_revision_id`, `row_version`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.asOf | API-only server evaluation timestamp; not a historical snapshot guarantee. |
| data.ordersByStatus[].status | commerce.orders.status |
| data.ordersByStatus[].count | COUNT of authorized commerce.orders grouped by its persisted status at asOf; not a global count. |
| data.pendingPrescriptionReviews | COUNT of authorized clinical.order_reviews with status pending/in_review; P-only review queue. |
| data.deliveryTasksInProgress | COUNT of current in-scope logistics.delivery_assignments whose shipment has not reached a terminal delivery outcome. |
| data.stockAlerts | COUNT of authorized warehouse.stock_balances whose inventory_observed_at is missing/stale under approved source policy; this dashboard count covers source-freshness alerts only. |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`clinical.review_reason_codes`](../../04-Database/Tables/clinical/review_reason_codes.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`logistics.carriers`](../../04-Database/Tables/logistics/carriers.md), [`warehouse.bins`](../../04-Database/Tables/warehouse/bins.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

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

Existing feature assertions: `TC-ADM-01-OK`, `TC-ADM-01-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-033 — POST `/v1/admin/staff`

**Invite a staff identity into approved organization/location roles. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Shared identity service; no app-specific account. |
| Consumer | Identity Administrator |
| Features / workflow | `ADM-02`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/admin/staff |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| YES | JWT | Identity Administrator | identity.staff.invite |

Admin invitation is a facade to central Identity: reuse an already verified subject only through reviewed identity resolution; do not auto-link unverified matching contacts or create app-specific login accounts. RoleIds are only requested targets. Identity validates delegable grants, exact membership/location and current actor permission; pending enrollment/invitation cannot grant a privileged session. Existing response fields are preserved.

Resolve the owned active session on the backend. Auth.self operations do not require a business assignment; business/admin actions still require their exact context, methods, permission and target scope.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer <access JWT> | Existing human session only where specified; never client role. |
| Content-Type | media type | Required | application/json | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Required | pv_api-033_7m3K9r2P6x4V8q1L | Required for this duplicate-sensitive effect. |
| If-Match | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| X-Request-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Optional UUID; validate or generate server value. |
| X-Correlation-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Optional UUID; validate and propagate across committed events. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Human identity operation, not a provider callback. |

Authorization headers are represented by OpenAPI security, not duplicated header parameters. No role/panel/organization header grants authority. JSON/Accept/trace validation is independent of credential verification.

### Path parameters

Not Applicable. No path parameters.

### Query parameters

Not Applicable. No query parameters.

### Request body and uploads

DTO: `StaffInviteRequest`. Unknown properties are rejected. Conditional proof/action fields must match the stored challenge and declared oneOf/allOf rules; a client cannot choose a weaker factor.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `email` | string | Required | No | None | minLength=1; maxLength=320; format="email" | Normalized invitation address; no password in this API. |
| `organizationId` | string | Required | No | None | format="uuid" | Typed organizationId; source and conditional use below. |
| `locationId` | string | Required | No | None | format="uuid" | Typed locationId; source and conditional use below. |
| `roleIds` | array | Required | No | None | minItems=1; maxItems=16 | Typed roleIds; source and conditional use below. |

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

File uploads: **Not Applicable**.

### Success response

HTTP **201**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `StaffData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `membershipId` | string | Required | No | None | format="uuid" | organization.memberships.id; uuid. |
| `staffId` | string | Required | No | None | format="uuid" | organization.memberships.user_id; uuid. |
| `organizationId` | string | Required | No | None | format="uuid" | organization.memberships.organization_id; uuid. |
| `locationId` | string,null | Required | No | None | format="uuid" | organization.memberships.location_id; uuid. |
| `status` | string | Required | No | None | minLength=1; maxLength=16; enum=["active","inactive","suspended","archived"] | organization.memberships.status; character varying(16). |
| `rowVersion` | integer | Required | No | None | minimum=0 | organization.memberships.row_version; bigint. |

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

`meta.pagination` is null.

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 400 | BAD_REQUEST | Malformed JSON or invalid UUID tracing header. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 401 | AUTHENTICATION_REQUIRED | AUTHENTICATION_REQUIRED: Missing/expired/revoked JWT credential for API-033. Recovery: Renew the appropriate credential; provider signatures use provider recovery, not customer login. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 403 | PERMISSION_DENIED | PERMISSION_DENIED: Caller lacks identity.staff.invite or active permitted organization/site role. Recovery: Obtain authorized scope through owner; never change IDs to bypass access. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 404 | RESOURCE_NOT_FOUND | RESOURCE_NOT_FOUND: Target/reference for invite a staff identity into approved organization/location roles. is absent or hidden by ownership. Recovery: Reload the authorized parent/queue; do not infer another actor’s record. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 406 | NOT_ACCEPTABLE | Requested Accept media type is unsupported. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 409 | IDEMPOTENCY_KEY_CONFLICT | IDEMPOTENCY_KEY_CONFLICT: Same actor/action/target key has a different canonical request fingerprint. Recovery: Use a new key only for a deliberately different intent; reconcile previous intent first.; INVALID_STATE_TRANSITION: Existing identity can receive a new allowed membership without duplicate user; duplicate membership returns existing replay or conflict. Recovery: Refresh authoritative state and follow the owner recovery path. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 415 | UNSUPPORTED_MEDIA_TYPE | Request body media type is unsupported. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 422 | REQUEST_VALIDATION_ERROR | REQUEST_VALIDATION_ERROR: A declared body/path/query field violates its typed contract. Recovery: Correct the named fields; do not retry unchanged.; VALIDATION_ERROR: Inviter must be allowed every requested role/scope; reject self-escalation and nondelegable grants. Identity owner creates pending user/role links; Operations membership is limited to verified organization/location. Invitation does not return credentials. Recovery: Existing identity can receive a new allowed membership without duplicate user; duplicate membership returns existing replay or conflict. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 429 | RATE_LIMIT_EXCEEDED | RATE_LIMIT_EXCEEDED: The proposed operation/actor/IP budget is exceeded. Recovery: Honor Retry-After, then bounded backoff with jitter. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 503 | EXTERNAL_SERVICE_UNAVAILABLE | EXTERNAL_SERVICE_UNAVAILABLE: Required database/owner/provider dependency for API-033 is unavailable or deadline exceeded. Recovery: Recover the invitation with the same Idempotency-Key and body; never issue another grant to resolve uncertainty. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Malformed JSON or invalid UUID tracing header.",
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

| Table | Exact columns read | Exact proposed columns written | Owner |
| --- | --- | --- | --- |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `updated_by` | None | Authentication_Access |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `updated_by` | None | Authentication_Access |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | None | `user_id`, `role_id`, `scope_type`, `scope_id`, `is_active` | Authentication_Access |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `created_by`, `email`, `id`, `row_version`, `status`, `updated_by`, `locked_until`, `account_closed_at`, `failed_login_count` | `email`, `email_normalized`, `status` | Authentication_Access |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `created_by`, `deleted_by`, `id`, `is_active`, `is_deleted`, `organization_id`, `row_version`, `updated_by` | None | Admin_CMS |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `created_by`, `id`, `location_id`, `manager_user_id`, `organization_id`, `row_version`, `status`, `updated_by`, `user_id` | `user_id`, `organization_id`, `location_id`, `status` | Admin_CMS |

Master dependencies: `identity.permissions`, `identity.roles`, `identity.users`, `organization.departments`, `organization.locations`, `organization.organizations`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.membershipId | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.staffId | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.organizationId | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.locationId | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.status | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.rowVersion | roles.row_version for permission policy; user_roles.row_version for assignment. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Admin invitation is a facade to central Identity: reuse an already verified subject only through reviewed identity resolution; do not auto-link unverified matching contacts or create app-specific login accounts.
2. RoleIds are only requested targets. Identity validates delegable grants, exact membership/location and current actor permission; pending enrollment/invitation cannot grant a privileged session. Existing response fields are preserved.

Perform success mutations, proof/counter/refresh/assignment state and audit in one owner transaction. Commit failed-proof counters/lockout and replay revocation even when returning an authentication error; do not roll those evidence updates back. Recheck grants under ordered locks before commit; retain non-secret audit/outbox atomically. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

<a id="designed-contract-tests--not-run-5"></a>

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-033-01` | Preserve the adapter DTO and identity subject; the shared authorizer still checks current scope. | Designed / NOT RUN |
| `CT-API-033-02` | Reject cross-subject, wrong-purpose or replayed proof/session input with no unauthorized state. | Designed / NOT RUN |
| `CT-API-033-03` | Race completion/revocation/version change; recover through the documented common lifecycle. | Designed / NOT RUN |
| `CT-API-033-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-033-AUTHORIZATION` | Expired/revoked session or cross-subject/scope target is denied; hiding menus is irrelevant. | Designed / NOT RUN |
| `CT-API-033-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-034 — PATCH `/v1/admin/staff/{staff_id}`

**Change staff scope or deactivate access through Identity commands. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Shared identity service; no app-specific account. |
| Consumer | Identity Administrator |
| Features / workflow | `ADM-02`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/admin/staff/{staff_id} |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| YES | JWT | Identity Administrator | identity.staff.manage |

Admin staff updates call central Identity for user status and role changes. Scope the legacy roleIds replacement to the exact active organization/location membership; preserve other assignments. Ambiguous global/multi-membership targets are rejected rather than guessed; use explicit assignment routes. Suspension revokes all sessions/proofs for the shared subject; role removal clears affected contexts atomically. Reject self-escalation and undelegable roles, reactivation/lock bypass and stale user/membership versions. Existing body/response fields are preserved.

Resolve the owned active session on the backend. Auth.self operations do not require a business assignment; business/admin actions still require their exact context, methods, permission and target scope.

**Conditional identity-wide authorization:** Changing identity-wide status additionally requires identity.accounts.manage in explicit global scope with fresh password/authenticator; organization/store staff-management permission alone cannot suspend or reactivate a shared person. Use API-110 for scoped assignment removal; it must preserve Customer and other organization access. Suspension and allowed reviewed reactivation remain separate from lock/recovery bypass.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer <access JWT> | Existing human session only where specified; never client role. |
| Content-Type | media type | Required | application/json | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Required | pv_api-034_7m3K9r2P6x4V8q1L | Required for this duplicate-sensitive effect. |
| If-Match | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| X-Request-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Optional UUID; validate or generate server value. |
| X-Correlation-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Optional UUID; validate and propagate across committed events. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Human identity operation, not a provider callback. |

Authorization headers are represented by OpenAPI security, not duplicated header parameters. No role/panel/organization header grants authority. JSON/Accept/trace validation is independent of credential verification.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| staff_id | string | Required | No | None | {"type":"string","format":"uuid","description":"Public UUID; ownership checked independently.","example":"0192a1b2-c3d4-7e8f-9012-3456789abcde"} | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |

### Query parameters

Not Applicable. No query parameters.

### Request body and uploads

DTO: `StaffUpdateRequest`. Unknown properties are rejected. Conditional proof/action fields must match the stored challenge and declared oneOf/allOf rules; a client cannot choose a weaker factor.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedMembershipVersion` | integer | Required | No | None | minimum=1 | Expected current row_version; compare atomically. |
| `expectedUserVersion` | integer | Required | No | None | minimum=1 | Expected current row_version; compare atomically. |
| `locationId` | string | Optional | No | None | format="uuid" | Typed locationId; source and conditional use below. |
| `roleIds` | array | Optional | No | None | minItems=1; maxItems=16 | Typed roleIds; source and conditional use below. |
| `status` | string | Optional | No | None | enum=["active","suspended"] | Identity account status; cannot close historical evidence here. |

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

File uploads: **Not Applicable**.

### Success response

HTTP **200**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `StaffData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `membershipId` | string | Required | No | None | format="uuid" | organization.memberships.id; uuid. |
| `staffId` | string | Required | No | None | format="uuid" | organization.memberships.user_id; uuid. |
| `organizationId` | string | Required | No | None | format="uuid" | organization.memberships.organization_id; uuid. |
| `locationId` | string,null | Required | No | None | format="uuid" | organization.memberships.location_id; uuid. |
| `status` | string | Required | No | None | minLength=1; maxLength=16; enum=["active","inactive","suspended","archived"] | organization.memberships.status; character varying(16). |
| `rowVersion` | integer | Required | No | None | minimum=0 | organization.memberships.row_version; bigint. |

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

`meta.pagination` is null.

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 400 | BAD_REQUEST | Malformed JSON or invalid UUID tracing header. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 401 | AUTHENTICATION_REQUIRED | AUTHENTICATION_REQUIRED: Missing/expired/revoked JWT credential for API-034. Recovery: Renew the appropriate credential; provider signatures use provider recovery, not customer login. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 403 | PERMISSION_DENIED | PERMISSION_DENIED: Caller lacks identity.staff.manage or active permitted organization/site role. Recovery: Obtain authorized scope through owner; never change IDs to bypass access. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 404 | RESOURCE_NOT_FOUND | RESOURCE_NOT_FOUND: Target/reference for change staff scope or deactivate access through identity commands. is absent or hidden by ownership. Recovery: Reload the authorized parent/queue; do not infer another actor’s record. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 406 | NOT_ACCEPTABLE | Requested Accept media type is unsupported. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 409 | IDEMPOTENCY_KEY_CONFLICT | IDEMPOTENCY_KEY_CONFLICT: Same actor/action/target key has a different canonical request fingerprint. Recovery: Use a new key only for a deliberately different intent; reconcile previous intent first.; STALE_VERSION: An expected aggregate/row version no longer matches current committed state. Recovery: Reload the current change staff scope or deactivate access through identity commands. context and re-evaluate; no partial mutation.; INVALID_STATE_TRANSITION: Stale version changes no grants; a deactivated user session is denied on subsequent protected commands. Recovery: Refresh authoritative state and follow the owner recovery path. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 415 | UNSUPPORTED_MEDIA_TYPE | Request body media type is unsupported. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 422 | REQUEST_VALIDATION_ERROR | REQUEST_VALIDATION_ERROR: A declared body/path/query field violates its typed contract. Recovery: Correct the named fields; do not retry unchanged.; VALIDATION_ERROR: At least one mutable field is required. Validate both user and membership versions. Suspension revokes active sessions and grants in the same proposed owner-coordinated transaction; cannot grant own privilege. Recovery: Stale version changes no grants; a deactivated user session is denied on subsequent protected commands. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 429 | RATE_LIMIT_EXCEEDED | RATE_LIMIT_EXCEEDED: The proposed operation/actor/IP budget is exceeded. Recovery: Honor Retry-After, then bounded backoff with jitter. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 503 | EXTERNAL_SERVICE_UNAVAILABLE | EXTERNAL_SERVICE_UNAVAILABLE: Required database/owner/provider dependency for API-034 is unavailable or deadline exceeded. Recovery: Reload scoped assignments and versions; retry only the same reviewed command/key. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Malformed JSON or invalid UUID tracing header.",
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

| Table | Exact columns read | Exact proposed columns written | Owner |
| --- | --- | --- | --- |
| [`identity.authentication_challenges`](../../04-Database/Tables/identity/authentication_challenges.md) | None | `blocked_at` | Authentication_Access |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `updated_by` | None | Authentication_Access |
| [`identity.session_refresh_tokens`](../../04-Database/Tables/identity/session_refresh_tokens.md) | None | `revoked_at` | Authentication_Access |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | `created_by`, `expires_at`, `id`, `refresh_token_hash`, `revoked_at`, `row_version`, `token_family_id`, `updated_by`, `user_id` | `active_assignment_id`, `active_workspace_code`, `context_version`, `revoked_at`, `revoke_reason` | Authentication_Access |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `created_by`, `id`, `is_active`, `role_id`, `row_version`, `updated_by`, `user_id`, `valid_from`, `valid_until` | `is_active`, `scope_type`, `scope_id`, `valid_until` | Authentication_Access |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `created_by`, `id`, `row_version`, `status`, `updated_by`, `locked_until`, `account_closed_at`, `failed_login_count` | `status` | Authentication_Access |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `created_by`, `deleted_by`, `id`, `is_active`, `is_deleted`, `organization_id`, `row_version`, `updated_by` | None | Admin_CMS |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `created_by`, `id`, `location_id`, `manager_user_id`, `organization_id`, `row_version`, `status`, `updated_by`, `user_id` | `location_id`, `status`, `left_at` | Admin_CMS |

Master dependencies: `identity.permissions`, `identity.roles`, `identity.users`, `organization.departments`, `organization.locations`, `organization.organizations`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.membershipId | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.staffId | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.organizationId | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.locationId | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.status | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.rowVersion | roles.row_version for permission policy; user_roles.row_version for assignment. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Admin staff updates call central Identity for user status and role changes. Scope the legacy roleIds replacement to the exact active organization/location membership; preserve other assignments. Ambiguous global/multi-membership targets are rejected rather than guessed; use explicit assignment routes.
2. Suspension revokes all sessions/proofs for the shared subject; role removal clears affected contexts atomically. Reject self-escalation and undelegable roles, reactivation/lock bypass and stale user/membership versions. Existing body/response fields are preserved.

Perform success mutations, proof/counter/refresh/assignment state and audit in one owner transaction. Commit failed-proof counters/lockout and replay revocation even when returning an authentication error; do not roll those evidence updates back. Recheck grants under ordered locks before commit; retain non-secret audit/outbox atomically. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

<a id="designed-contract-tests--not-run-6"></a>

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-034-01` | Preserve the adapter DTO and identity subject; the shared authorizer still checks current scope. | Designed / NOT RUN |
| `CT-API-034-02` | Reject cross-subject, wrong-purpose or replayed proof/session input with no unauthorized state. | Designed / NOT RUN |
| `CT-API-034-03` | Race completion/revocation/version change; recover through the documented common lifecycle. | Designed / NOT RUN |
| `CT-API-034-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-034-AUTHORIZATION` | Expired/revoked session or cross-subject/scope target is denied; hiding menus is irrelevant. | Designed / NOT RUN |
| `CT-API-034-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-035 — GET `/v1/admin/settings`

**Read allowlisted nonsecret operational settings.**

| Property | Proposed contract |
| --- | --- |
| API name | Read allowlisted nonsecret operational settings |
| Version / owner | v1 / Admin_CMS |
| Consumer | Admin / Configuration Manager |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ADM-05`; [WF-009](../../06-Workflows/WF-009-COD-Collection.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
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

Data DTO: `SettingsData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

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
| [`platform.application_settings`](../../04-Database/Tables/platform/application_settings.md) | Read | `id`, `is_deleted`, `key`, `namespace`, `row_version`, `value` | Admin_CMS / platform configuration owner projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.settings[].namespace | platform.application_settings.namespace |
| data.settings[].key | platform.application_settings.key |
| data.settings[].value | platform.application_settings.value |
| data.settings[].rowVersion | platform.application_settings.row_version |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

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

Existing feature assertions: `TC-ADM-05-OK`, `TC-ADM-05-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-036 — PATCH `/v1/admin/settings`

**Update allowlisted versioned operational settings.**

| Property | Proposed contract |
| --- | --- |
| API name | Update allowlisted versioned operational settings |
| Version / owner | v1 / Admin_CMS |
| Consumer | Configuration Manager with Finance approval |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ADM-05`; [WF-009](../../06-Workflows/WF-009-COD-Collection.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
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

Data DTO: `SettingsData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

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
| [`platform.application_settings`](../../04-Database/Tables/platform/application_settings.md) | Read | `id`, `is_deleted`, `key`, `namespace`, `row_version`, `value` | Admin_CMS / platform configuration owner projection / scoped joins; reading does not grant writes. |
| [`platform.application_settings`](../../04-Database/Tables/platform/application_settings.md) | Create/update evidence | `value` | Admin_CMS / platform configuration owner owns these writes; Admin_CMS must invoke that narrow owner command. |

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

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

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

Existing feature assertions: `TC-ADM-05-OK`, `TC-ADM-05-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-037 — POST `/v1/admin/cms/pages/{page_id}/publish`

**Publish one approved sanitized CMS content version.**

| Property | Proposed contract |
| --- | --- |
| API name | Publish one approved sanitized CMS content version |
| Version / owner | v1 / Admin_CMS |
| Consumer | Content Publisher |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ADM-04`; [WF-012](../../06-Workflows/WF-012-Report-Export-and-Audit.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
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

Data DTO: `CmsPublishData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

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
| [`platform.cms_pages`](../../04-Database/Tables/platform/cms_pages.md) | Read | `id`, `is_deleted`, `row_version`, `slug`, `status` | Admin_CMS / platform configuration owner projection / scoped joins; reading does not grant writes. |
| [`platform.cms_page_versions`](../../04-Database/Tables/platform/cms_page_versions.md) | Read | `id`, `page_id` | Admin_CMS / platform configuration owner projection / scoped joins; reading does not grant writes. |
| [`platform.cms_pages`](../../04-Database/Tables/platform/cms_pages.md) | Create/update evidence | `status`, `updated_by_user_id` | Admin_CMS / platform configuration owner owns these writes; Admin_CMS must invoke that narrow owner command. |
| [`platform.cms_page_versions`](../../04-Database/Tables/platform/cms_page_versions.md) | Create/update evidence | `published_at` | Admin_CMS / platform configuration owner owns these writes; Admin_CMS must invoke that narrow owner command. |

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

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

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

Existing feature assertions: `TC-ADM-04-OK`, `TC-ADM-04-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-038 — POST `/v1/admin/locations`

**Register a location master without granting dispensing eligibility.**

| Property | Proposed contract |
| --- | --- |
| API name | Register a location master without granting dispensing eligibility |
| Version / owner | v1 / Admin_CMS |
| Consumer | Organization Administrator |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ADM-08`; [WF-006](../../06-Workflows/WF-006-Licensed-Site-Allocation.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
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

Data DTO: `LocationData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

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
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | Read | `id`, `is_deleted`, `row_version`, `status` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | Read | `address_json`, `code`, `id`, `is_active`, `is_deleted`, `location_type`, `name`, `organization_id`, `postal_code`, `row_version`, `timezone` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | Create/update evidence | `organization_id`, `code`, `name`, `location_type`, `postal_code`, `address_json`, `timezone`, `is_active`, `geo_metadata` | Admin_CMS via Organization owner owns these writes; Admin_CMS must invoke that narrow owner command. |

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

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`organization.locations`](../../04-Database/Tables/organization/locations.md), [`organization.organizations`](../../04-Database/Tables/organization/organizations.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

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

Existing feature assertions: `TC-ADM-08-OK`, `TC-ADM-08-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.

## API-108 — PUT `/v1/admin/roles/{role_id}/permissions`

**Replace an existing role permission set through central Identity. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Admin is the caller surface. |
| Consumer | Independently authorized Identity administrator within delegation scope |
| Features / workflow | `ADM-03`, `AUTH-04`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/admin/roles/{role_id}/permissions |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| YES | JWT | Independently authorized Identity administrator within delegation scope | identity.roles.manage (global policy authority) |

Require global IAM policy permission with fresh password/authenticator. Role definitions are shared: organization-only administrators cannot edit them as if they were organization-local. Reject editing any role assigned to the actor and any permission outside the reviewed delegation allowlist. Never self-escalate through indirect group policy. Lock role before edge changes and serialize against request authorization. Replace the complete active permission set atomically, advance role version, and audit/outbox once. Current sessions re-evaluate the changed edges on their next authoritative check; no positive-cache lag.

Resolve the owned active session on the backend. Auth.self operations do not require a business assignment; business/admin actions still require their exact context, methods, permission and target scope.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer <access JWT> | Existing human session only where specified; never client role. |
| Content-Type | media type | Required | application/json | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Required | iam-intent-20261024-000001 | Same intent/hash replays the non-secret result only after current authorization. |
| If-Match | string | Required | "role-4" | Strong role version precondition. |
| X-Request-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| X-Correlation-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Human identity operation, not a provider callback. |

Authorization headers are represented by OpenAPI security, not duplicated header parameters. No role/panel/organization header grants authority. JSON/Accept/trace validation is independent of credential verification.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| role_id | string | Required | No | None | {"type":"string","format":"uuid","example":"0192a1b2-c3d4-7e8f-9012-000000000003"} | Target public UUID; not proof of authority. |

### Query parameters

Not Applicable. No query parameters.

### Request body and uploads

DTO: `UnifiedRolePermissionsRequest`. Unknown properties are rejected. Conditional proof/action fields must match the stored challenge and declared oneOf/allOf rules; a client cannot choose a weaker factor.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `permissionIds` | array | Required | No | None | maxItems=512; uniqueItems=true | Complete replacement set; empty removes all grants. |

```json
{
  "permissionIds": [
    "0192a1b2-c3d4-7e8f-9012-000000000007"
  ]
}
```

File uploads: **Not Applicable**.

### Success response

HTTP **200**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control, ETag response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `UnifiedRolePermissionsData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `roleId` | string | Required | No | None | format="uuid" | Changed role public UUID. |
| `rowVersion` | integer | Required | No | None | minimum=1 | New role policy version. |
| `permissionIds` | array | Required | No | None | maxItems=512; uniqueItems=true | Committed replacement set. |

```json
{
  "success": true,
  "data": {
    "roleId": "0192a1b2-c3d4-7e8f-9012-000000000009",
    "rowVersion": 5,
    "permissionIds": [
      "0192a1b2-c3d4-7e8f-9012-000000000007"
    ]
  },
  "error": null,
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-000000000020",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-000000000021",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

`meta.pagination` is null.

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 415 | UNSUPPORTED_MEDIA_TYPE | A JSON body uses an unsupported Content-Type. | No state/proof change. | Send Content-Type application/json and a valid JSON body. |
| 406 | NOT_ACCEPTABLE | The Accept header excludes application/json. | No state/proof change. | Request application/json. |
| 400 | BAD_REQUEST | Malformed JSON or tracing header. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Correct the transport input. |
| 422 | REQUEST_VALIDATION_ERROR | Declared field/type/conditional validation fails. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Correct named fields without changing caller authority. |
| 429 | RATE_LIMIT_EXCEEDED | Configured endpoint/subject/network abuse budget exceeded. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Honor Retry-After; bounded retry only. |
| 503 | AUTH_SERVICE_UNAVAILABLE | Identity/policy/database dependency unavailable. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Fail closed; retry safe reads; start new proof if outcome is uncertain. |
| 401 | AUTH_SESSION_INVALID | Subject session expired, revoked or inactive. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Reauthenticate; no protected data. |
| 403 | AUTH_GRANT_FORBIDDEN | Self-role edit, non-global policy scope or non-delegable permission. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use an independently authorized policy administrator. |
| 412 | PRECONDITION_FAILED | Role version differs from If-Match. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Reload role policy and review the entire replacement. |
| 428 | PRECONDITION_REQUIRED | Required If-Match is missing. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Load the current resource ETag before mutating. |
| 409 | IDEMPOTENCY_KEY_REUSED | Same key with another canonical payload. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use a new intent key only for a new reviewed action. |
| 404 | RESOURCE_NOT_FOUND | Target does not exist within authorized scope. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Reload the authorized target; do not enumerate UUIDs. |

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Malformed JSON or tracing header.",
    "details": null
  },
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-000000000020",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-000000000021",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Database mapping and ownership

| Table | Exact columns read | Exact proposed columns written | Owner |
| --- | --- | --- | --- |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | `id`, `code`, `resource`, `action`, `is_deleted` | None | Authentication_Access |
| [`identity.role_permissions`](../../04-Database/Tables/identity/role_permissions.md) | `role_id`, `permission_id`, `row_version` | `role_id`, `role_id_internal_id`, `permission_id`, `permission_id_internal_id` | Authentication_Access |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `id`, `code`, `is_deleted`, `row_version` | `row_version` | Authentication_Access |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | `id`, `user_id`, `revoked_at`, `expires_at`, `context_version`, `active_assignment_id`, `active_workspace_code`, `password_verified_at`, `otp_verified_at`, `mfa_verified_at`, `authentication_policy_version`, `token_family_id`, `refresh_token_hash`, `row_version` | None | Authentication_Access |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `id`, `user_id`, `role_id`, `is_active`, `scope_type`, `scope_id`, `valid_from`, `valid_until`, `row_version` | None | Authentication_Access |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `id`, `status`, `row_version`, `locked_until`, `account_closed_at`, `phone_verified_at`, `email_verified_at`, `failed_login_count` | None | Authentication_Access |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `organization_id`, `location_type`, `is_active`, `is_deleted` | None | Admin_CMS |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `user_id`, `organization_id`, `location_id`, `status`, `row_version` | None | Admin_CMS |
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | `id`, `status`, `is_deleted` | None | Admin_CMS |
| [`platform.audit_logs`](../../04-Database/Tables/platform/audit_logs.md) | None | `action`, `actor_user_id`, `after_data`, `before_data`, `request_id`, `resource_id`, `resource_type` | Shared audit/outbox infrastructure |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `location_id`, `organization_id`, `status`, `is_deleted` | None | Warehouse |

Master dependencies: `identity.users`, `identity.roles`, `identity.permissions`, `organization.locations`, `organization.organizations`, `warehouse.warehouses`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.roleId | identity.roles.id / identity.user_roles.role_id as applicable. |
| data.rowVersion | roles.row_version for permission policy; user_roles.row_version for assignment. |
| data.permissionIds | identity.role_permissions.permission_id after active permission validation. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Require global IAM policy permission with fresh password/authenticator. Role definitions are shared: organization-only administrators cannot edit them as if they were organization-local.
2. Reject editing any role assigned to the actor and any permission outside the reviewed delegation allowlist. Never self-escalate through indirect group policy. Lock role before edge changes and serialize against request authorization.
3. Replace the complete active permission set atomically, advance role version, and audit/outbox once. Current sessions re-evaluate the changed edges on their next authoritative check; no positive-cache lag.

Perform success mutations, proof/counter/refresh/assignment state and audit in one owner transaction. Commit failed-proof counters/lockout and replay revocation even when returning an authentication error; do not roll those evidence updates back. Recheck grants under ordered locks before commit; retain non-secret audit/outbox atomically. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-108-01` | Global authorized independent editor replaces only existing active permissions. | Designed / NOT RUN |
| `CT-API-108-02` | Self-role escalation, organization-only editor and unowned permission fail. | Designed / NOT RUN |
| `CT-API-108-03` | Concurrent role edits versus business authorization obey the documented lock/commit boundary. | Designed / NOT RUN |
| `CT-API-108-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-108-AUTHORIZATION` | Expired/revoked session or cross-subject/scope target is denied; hiding menus is irrelevant. | Designed / NOT RUN |
| `CT-API-108-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-109 — POST `/v1/admin/users/{user_id}/role-assignments`

**Assign an existing role to the shared subject in an exact scope. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Admin is the caller surface. |
| Consumer | Independently authorized Identity administrator within delegation scope |
| Features / workflow | `ADM-02`, `ADM-03`, `AUTH-04`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/admin/users/{user_id}/role-assignments |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| YES | JWT | Independently authorized Identity administrator within delegation scope | identity.user_roles.manage |

Target an existing identity; never create a second Customer/Staff/Rider user for this grant. Resolve and lock role, exact scope hierarchy and subject membership before insert. Grantor must own the delegation permission and contain the full target scope/permission set. No self-assignment, cross-organization grant, unauthorized global scope or implicit escalation from a role name. Map global to null/null and preserve warehouse UUID scope semantics. Duplicate role/user/scope is 409 even if inactive; reactivate explicitly with current version rather than creating another assignment.

Resolve the owned active session on the backend. Auth.self operations do not require a business assignment; business/admin actions still require their exact context, methods, permission and target scope.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer <access JWT> | Existing human session only where specified; never client role. |
| Content-Type | media type | Required | application/json | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Required | iam-intent-20261024-000001 | Same intent/hash replays the non-secret result only after current authorization. |
| If-Match | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| X-Request-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| X-Correlation-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Human identity operation, not a provider callback. |

Authorization headers are represented by OpenAPI security, not duplicated header parameters. No role/panel/organization header grants authority. JSON/Accept/trace validation is independent of credential verification.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| user_id | string | Required | No | None | {"type":"string","format":"uuid","example":"0192a1b2-c3d4-7e8f-9012-000000000003"} | Target public UUID; not proof of authority. |

### Query parameters

Not Applicable. No query parameters.

### Request body and uploads

DTO: `UnifiedRoleAssignmentRequest`. Unknown properties are rejected. Conditional proof/action fields must match the stored challenge and declared oneOf/allOf rules; a client cannot choose a weaker factor.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `roleId` | string | Required | No | None | format="uuid" | Existing non-deleted role; no new role code is seeded. |
| `scopeType` | string | Required | No | None | enum=["global","organization","location","warehouse"] | global maps to database null/null; others validate target hierarchy. |
| `scopeId` | string | Required | Yes | None | format="uuid" | Null only for global scope. |
| `validFrom` | string | Required | Yes | None | format="date-time" | Inclusive start; null means no lower bound. |
| `validUntil` | string | Required | Yes | None | format="date-time" | Exclusive end; must exceed non-null start. |

```json
{
  "roleId": "0192a1b2-c3d4-7e8f-9012-000000000009",
  "scopeType": "location",
  "scopeId": "0192a1b2-c3d4-7e8f-9012-000000000006",
  "validFrom": "2026-10-24T10:30:00Z",
  "validUntil": null
}
```

File uploads: **Not Applicable**.

### Success response

HTTP **201**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `UnifiedRoleAssignmentData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `assignmentId` | string | Required | No | None | format="uuid" | identity.user_roles.id. |
| `userId` | string | Required | No | None | format="uuid" | Common target identity.users.id. |
| `roleId` | string | Required | No | None | format="uuid" | Assigned role UUID. |
| `scopeType` | string | Required | No | None | enum=["global","organization","location","warehouse"] | Normalized external scope type. |
| `scopeId` | string | Required | Yes | None | format="uuid" | Existing target; null for global. |
| `isActive` | boolean | Required | No | None | See purpose/conditional rules | Committed assignment activity; role/user/membership checks remain additional. |
| `validFrom` | string | Required | Yes | None | format="date-time" | Inclusive start. |
| `validUntil` | string | Required | Yes | None | format="date-time" | Exclusive end. |
| `rowVersion` | integer | Required | No | None | minimum=1 | Assignment optimistic version. |

```json
{
  "success": true,
  "data": {
    "assignmentId": "0192a1b2-c3d4-7e8f-9012-000000000003",
    "userId": "0192a1b2-c3d4-7e8f-9012-000000000001",
    "roleId": "0192a1b2-c3d4-7e8f-9012-000000000009",
    "scopeType": "location",
    "scopeId": "0192a1b2-c3d4-7e8f-9012-000000000006",
    "isActive": true,
    "validFrom": "2026-10-24T10:30:00Z",
    "validUntil": null,
    "rowVersion": 1
  },
  "error": null,
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-000000000020",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-000000000021",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

`meta.pagination` is null.

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 415 | UNSUPPORTED_MEDIA_TYPE | A JSON body uses an unsupported Content-Type. | No state/proof change. | Send Content-Type application/json and a valid JSON body. |
| 406 | NOT_ACCEPTABLE | The Accept header excludes application/json. | No state/proof change. | Request application/json. |
| 400 | BAD_REQUEST | Malformed JSON or tracing header. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Correct the transport input. |
| 422 | REQUEST_VALIDATION_ERROR | Declared field/type/conditional validation fails. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Correct named fields without changing caller authority. |
| 429 | RATE_LIMIT_EXCEEDED | Configured endpoint/subject/network abuse budget exceeded. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Honor Retry-After; bounded retry only. |
| 503 | AUTH_SERVICE_UNAVAILABLE | Identity/policy/database dependency unavailable. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Fail closed; retry safe reads; start new proof if outcome is uncertain. |
| 401 | AUTH_SESSION_INVALID | Subject session expired, revoked or inactive. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Reauthenticate; no protected data. |
| 403 | AUTH_GRANT_FORBIDDEN | Self-grant, undelegable role or target beyond actor scope. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use an independently authorized grantor. |
| 409 | AUTH_ASSIGNMENT_EXISTS | The user/role/scope tuple already exists. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Read the assignment and use its versioned activity command. |
| 409 | IDEMPOTENCY_KEY_REUSED | Same key with another canonical payload. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use a new intent key only for a new reviewed action. |
| 404 | RESOURCE_NOT_FOUND | Target does not exist within authorized scope. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Reload the authorized target; do not enumerate UUIDs. |

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Malformed JSON or tracing header.",
    "details": null
  },
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-000000000020",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-000000000021",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Database mapping and ownership

| Table | Exact columns read | Exact proposed columns written | Owner |
| --- | --- | --- | --- |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | `id`, `code`, `resource`, `action`, `is_deleted` | None | Authentication_Access |
| [`identity.role_permissions`](../../04-Database/Tables/identity/role_permissions.md) | `role_id`, `permission_id`, `row_version` | None | Authentication_Access |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `id`, `code`, `is_deleted`, `row_version` | None | Authentication_Access |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | `id`, `user_id`, `revoked_at`, `expires_at`, `context_version`, `active_assignment_id`, `active_workspace_code`, `password_verified_at`, `otp_verified_at`, `mfa_verified_at`, `authentication_policy_version`, `token_family_id`, `refresh_token_hash`, `row_version` | None | Authentication_Access |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `id`, `user_id`, `role_id`, `is_active`, `scope_type`, `scope_id`, `valid_from`, `valid_until`, `row_version` | `user_id`, `role_id`, `role_id_internal_id`, `scope_type`, `scope_id`, `is_active`, `valid_from`, `valid_until` | Authentication_Access |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `id`, `status`, `row_version`, `locked_until`, `account_closed_at`, `phone_verified_at`, `email_verified_at`, `failed_login_count` | None | Authentication_Access |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `organization_id`, `location_type`, `is_active`, `is_deleted` | None | Admin_CMS |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `user_id`, `organization_id`, `location_id`, `status`, `row_version` | None | Admin_CMS |
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | `id`, `status`, `is_deleted` | None | Admin_CMS |
| [`platform.audit_logs`](../../04-Database/Tables/platform/audit_logs.md) | None | `action`, `actor_user_id`, `after_data`, `before_data`, `request_id`, `resource_id`, `resource_type` | Shared audit/outbox infrastructure |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `location_id`, `organization_id`, `status`, `is_deleted` | None | Warehouse |

Master dependencies: `identity.users`, `identity.roles`, `identity.permissions`, `organization.locations`, `organization.organizations`, `warehouse.warehouses`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.assignmentId | identity.user_roles.id. |
| data.userId | identity.users.id; shared subject, not a role-specific account. |
| data.roleId | identity.roles.id / identity.user_roles.role_id as applicable. |
| data.scopeType | user_roles.scope_type with null/null normalized to global. |
| data.scopeId | identity.user_roles.scope_id after target/hierarchy checks. |
| data.isActive | identity.user_roles.is_active. |
| data.validFrom | identity.user_roles.valid_from. |
| data.validUntil | identity.user_roles.valid_until. |
| data.rowVersion | roles.row_version for permission policy; user_roles.row_version for assignment. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Target an existing identity; never create a second Customer/Staff/Rider user for this grant. Resolve and lock role, exact scope hierarchy and subject membership before insert.
2. Grantor must own the delegation permission and contain the full target scope/permission set. No self-assignment, cross-organization grant, unauthorized global scope or implicit escalation from a role name.
3. Map global to null/null and preserve warehouse UUID scope semantics. Duplicate role/user/scope is 409 even if inactive; reactivate explicitly with current version rather than creating another assignment.

Perform success mutations, proof/counter/refresh/assignment state and audit in one owner transaction. Commit failed-proof counters/lockout and replay revocation even when returning an authentication error; do not roll those evidence updates back. Recheck grants under ordered locks before commit; retain non-secret audit/outbox atomically. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-109-01` | Same person gains Store and Customer contexts without another user record. | Designed / NOT RUN |
| `CT-API-109-02` | Cross-store/global overgrant and self-assignment fail without a new row. | Designed / NOT RUN |
| `CT-API-109-03` | Concurrent duplicate requests yield one assignment and one logical audit effect. | Designed / NOT RUN |
| `CT-API-109-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-109-AUTHORIZATION` | Expired/revoked session or cross-subject/scope target is denied; hiding menus is irrelevant. | Designed / NOT RUN |
| `CT-API-109-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-110 — PATCH `/v1/admin/role-assignments/{assignment_id}`

**Change assignment activity or validity with immediate live-policy effect. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Admin is the caller surface. |
| Consumer | Independently authorized Identity administrator within delegation scope |
| Features / workflow | `ADM-02`, `ADM-03`, `AUTH-02`, `AUTH-04`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/admin/role-assignments/{assignment_id} |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| YES | JWT | Independently authorized Identity administrator within delegation scope | identity.user_roles.manage |

Use If-Match for assignment.row_version; validate resulting exclusive end/inclusive start. Do not change subject, role or scope in this PATCH. Reactivation requires the same delegation/eligibility checks as a new grant. Serialize on the subject and assignment. Deactivation clears matching session active context and advances context generation in the same transaction; other valid assignments remain available. Do not delete historical assignments. Requests authorized before the revocation lock may finish first; every authorization after its commit denies the removed context. Suspension is an identity-wide command via API-034, not an assignment flag.

Resolve the owned active session on the backend. Auth.self operations do not require a business assignment; business/admin actions still require their exact context, methods, permission and target scope.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer <access JWT> | Existing human session only where specified; never client role. |
| Content-Type | media type | Required | application/json | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Required | iam-intent-20261024-000001 | Same intent/hash replays the non-secret result only after current authorization. |
| If-Match | string | Required | "assignment-4" | Strong assignment version precondition. |
| X-Request-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| X-Correlation-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Human identity operation, not a provider callback. |

Authorization headers are represented by OpenAPI security, not duplicated header parameters. No role/panel/organization header grants authority. JSON/Accept/trace validation is independent of credential verification.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| assignment_id | string | Required | No | None | {"type":"string","format":"uuid","example":"0192a1b2-c3d4-7e8f-9012-000000000003"} | Target public UUID; not proof of authority. |

### Query parameters

Not Applicable. No query parameters.

### Request body and uploads

DTO: `UnifiedRoleAssignmentUpdate`. Unknown properties are rejected. Conditional proof/action fields must match the stored challenge and declared oneOf/allOf rules; a client cannot choose a weaker factor.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `isActive` | boolean | Optional | No | None | See purpose/conditional rules | Deactivation removes future authorization under the consistency policy. |
| `validFrom` | string | Optional | Yes | None | format="date-time" | Omitted preserves current start; explicit null removes lower bound. |
| `validUntil` | string | Optional | Yes | None | format="date-time" | Omitted preserves current end; explicit null removes upper bound. |

```json
{
  "isActive": false
}
```

File uploads: **Not Applicable**.

### Success response

HTTP **200**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control, ETag response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `UnifiedRoleAssignmentData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `assignmentId` | string | Required | No | None | format="uuid" | identity.user_roles.id. |
| `userId` | string | Required | No | None | format="uuid" | Common target identity.users.id. |
| `roleId` | string | Required | No | None | format="uuid" | Assigned role UUID. |
| `scopeType` | string | Required | No | None | enum=["global","organization","location","warehouse"] | Normalized external scope type. |
| `scopeId` | string | Required | Yes | None | format="uuid" | Existing target; null for global. |
| `isActive` | boolean | Required | No | None | See purpose/conditional rules | Committed assignment activity; role/user/membership checks remain additional. |
| `validFrom` | string | Required | Yes | None | format="date-time" | Inclusive start. |
| `validUntil` | string | Required | Yes | None | format="date-time" | Exclusive end. |
| `rowVersion` | integer | Required | No | None | minimum=1 | Assignment optimistic version. |

```json
{
  "success": true,
  "data": {
    "assignmentId": "0192a1b2-c3d4-7e8f-9012-000000000003",
    "userId": "0192a1b2-c3d4-7e8f-9012-000000000001",
    "roleId": "0192a1b2-c3d4-7e8f-9012-000000000009",
    "scopeType": "location",
    "scopeId": "0192a1b2-c3d4-7e8f-9012-000000000006",
    "isActive": false,
    "validFrom": "2026-10-24T10:30:00Z",
    "validUntil": null,
    "rowVersion": 5
  },
  "error": null,
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-000000000020",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-000000000021",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

`meta.pagination` is null.

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 415 | UNSUPPORTED_MEDIA_TYPE | A JSON body uses an unsupported Content-Type. | No state/proof change. | Send Content-Type application/json and a valid JSON body. |
| 406 | NOT_ACCEPTABLE | The Accept header excludes application/json. | No state/proof change. | Request application/json. |
| 400 | BAD_REQUEST | Malformed JSON or tracing header. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Correct the transport input. |
| 422 | REQUEST_VALIDATION_ERROR | Declared field/type/conditional validation fails. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Correct named fields without changing caller authority. |
| 429 | RATE_LIMIT_EXCEEDED | Configured endpoint/subject/network abuse budget exceeded. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Honor Retry-After; bounded retry only. |
| 503 | AUTH_SERVICE_UNAVAILABLE | Identity/policy/database dependency unavailable. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Fail closed; retry safe reads; start new proof if outcome is uncertain. |
| 401 | AUTH_SESSION_INVALID | Subject session expired, revoked or inactive. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Reauthenticate; no protected data. |
| 403 | AUTH_GRANT_FORBIDDEN | Actor cannot manage the target scope/role or attempts unauthorized self-management. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use an independent authorized grantor. |
| 412 | PRECONDITION_FAILED | Assignment version changed. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Reload and review the proposed activity/window. |
| 428 | PRECONDITION_REQUIRED | Required If-Match is missing. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Load the current resource ETag before mutating. |
| 409 | IDEMPOTENCY_KEY_REUSED | Same key with another canonical payload. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use a new intent key only for a new reviewed action. |
| 404 | RESOURCE_NOT_FOUND | Target does not exist within authorized scope. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Reload the authorized target; do not enumerate UUIDs. |

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Malformed JSON or tracing header.",
    "details": null
  },
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-000000000020",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-000000000021",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Database mapping and ownership

| Table | Exact columns read | Exact proposed columns written | Owner |
| --- | --- | --- | --- |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | `id`, `code`, `resource`, `action`, `is_deleted` | None | Authentication_Access |
| [`identity.role_permissions`](../../04-Database/Tables/identity/role_permissions.md) | `role_id`, `permission_id`, `row_version` | None | Authentication_Access |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `id`, `code`, `is_deleted`, `row_version` | None | Authentication_Access |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | `id`, `user_id`, `revoked_at`, `expires_at`, `context_version`, `active_assignment_id`, `active_workspace_code`, `password_verified_at`, `otp_verified_at`, `mfa_verified_at`, `authentication_policy_version`, `token_family_id`, `refresh_token_hash`, `row_version` | `active_assignment_id`, `active_workspace_code`, `context_version` | Authentication_Access |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `id`, `user_id`, `role_id`, `is_active`, `scope_type`, `scope_id`, `valid_from`, `valid_until`, `row_version` | `is_active`, `valid_from`, `valid_until` | Authentication_Access |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `id`, `status`, `row_version`, `locked_until`, `account_closed_at`, `phone_verified_at`, `email_verified_at`, `failed_login_count` | None | Authentication_Access |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `organization_id`, `location_type`, `is_active`, `is_deleted` | None | Admin_CMS |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `user_id`, `organization_id`, `location_id`, `status`, `row_version` | None | Admin_CMS |
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | `id`, `status`, `is_deleted` | None | Admin_CMS |
| [`platform.audit_logs`](../../04-Database/Tables/platform/audit_logs.md) | None | `action`, `actor_user_id`, `after_data`, `before_data`, `request_id`, `resource_id`, `resource_type` | Shared audit/outbox infrastructure |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `location_id`, `organization_id`, `status`, `is_deleted` | None | Warehouse |

Master dependencies: `identity.users`, `identity.roles`, `identity.permissions`, `organization.locations`, `organization.organizations`, `warehouse.warehouses`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.assignmentId | identity.user_roles.id. |
| data.userId | identity.users.id; shared subject, not a role-specific account. |
| data.roleId | identity.roles.id / identity.user_roles.role_id as applicable. |
| data.scopeType | user_roles.scope_type with null/null normalized to global. |
| data.scopeId | identity.user_roles.scope_id after target/hierarchy checks. |
| data.isActive | identity.user_roles.is_active. |
| data.validFrom | identity.user_roles.valid_from. |
| data.validUntil | identity.user_roles.valid_until. |
| data.rowVersion | roles.row_version for permission policy; user_roles.row_version for assignment. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Use If-Match for assignment.row_version; validate resulting exclusive end/inclusive start. Do not change subject, role or scope in this PATCH. Reactivation requires the same delegation/eligibility checks as a new grant.
2. Serialize on the subject and assignment. Deactivation clears matching session active context and advances context generation in the same transaction; other valid assignments remain available. Do not delete historical assignments.
3. Requests authorized before the revocation lock may finish first; every authorization after its commit denies the removed context. Suspension is an identity-wide command via API-034, not an assignment flag.

Perform success mutations, proof/counter/refresh/assignment state and audit in one owner transaction. Commit failed-proof counters/lockout and replay revocation even when returning an authentication error; do not roll those evidence updates back. Recheck grants under ordered locks before commit; retain non-secret audit/outbox atomically. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-110-01` | Deactivated assignment disappears and old-context requests are denied after commit. | Designed / NOT RUN |
| `CT-API-110-02` | Other assignments remain switchable on the same identity/session. | Designed / NOT RUN |
| `CT-API-110-03` | Revocation/context-switch race and stale reactivation respect versions and ordered locks. | Designed / NOT RUN |
| `CT-API-110-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-110-AUTHORIZATION` | Expired/revoked session or cross-subject/scope target is denied; hiding menus is irrelevant. | Designed / NOT RUN |
| `CT-API-110-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |


## API-111 — GET `/v1/admin/roles/{role_id}/permissions`

**Read an existing role permission set and its current ETag.** API version v1; consumer Admin/authorized Identity administrator; owner Authentication_Access; workflow WF-001; features ADM-03, AUTH-04. **Complete proposed / Unapproved / Not Implemented.** [OpenAPI](../../05-APIs/openapi.yaml); D-003/D-024/D-028 approval remains open.

### Authentication and authorization

Authentication required: **YES**. Mechanism: JWT. Allowed roles: independently authorized Identity administrator; a role name alone grants nothing. Required permission: `identity.roles.read (global policy visibility)`. Require global IAM read permission and fresh password/authenticator. Organization-only operators cannot inspect a shared global role policy by supplying its UUID. Return only active, non-deleted permission IDs for this non-deleted role and its current roles.row_version. Emit ETag "role-N" for API-108; reads never grant any listed permission. Recheck policy and serialize role/edge reads so data and ETag share one snapshot.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer synthetic-access-token | Owned live session; current backend permission, scope and fresh MFA. |
| Content-Type | media type | Not Applicable | — | No request body. |
| Accept | media type | Optional | application/json | JSON; unsupported media returns 406. |
| Idempotency-Key | string | Not Applicable | — | Read has no mutation. |
| If-Match | string | Not Applicable | — | Read obtains the current version. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Safe tracing; server generates if absent. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-000000000021 | Safe workflow correlation. |
| Provider signature | — | Not Applicable | — | No provider callback. |

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| role_id | string | Required | No | None | UUID | Existing target public UUID; not authority. |

### Query parameters

Not Applicable.

### Request body and uploads

**No request body.** File uploads: Not Applicable.

### Success response

HTTP **200**. Response headers: X-Request-ID, X-Correlation-ID, X-API-Version: v1, Content-Type: application/json, Cache-Control: no-store, ETag: `"role-5"`. Shared envelope fields are defined by [Standard responses](../../05-APIs/Standard-Responses.md).

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| data | object | Required | No | None | "Declared schema" | Scoped Identity projection. |
| data.roleId | string | Required | No | None | "uuid" | Changed role public UUID. |
| data.rowVersion | integer | Required | No | None | "Declared schema" | New role policy version. |
| data.permissionIds | array | Required | No | None | 512 | Committed replacement set. |
| data.permissionIds[] | string | Required | No | None | "uuid" | Effective active permission UUID. |

```json
{
  "success": true,
  "data": {
    "roleId": "0192a1b2-c3d4-7e8f-9012-000000000009",
    "rowVersion": 5,
    "permissionIds": [
      "0192a1b2-c3d4-7e8f-9012-000000000007"
    ]
  },
  "error": null,
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-000000000020",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-000000000021",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 400 | BAD_REQUEST | BAD_REQUEST: Malformed JSON or tracing header. | No state change; no unauthorized target disclosure. | 401: authenticate; 403/404: select allowed target; 406: request JSON; 422: fix parameters; 429: wait Retry-After; 503: bounded retry. |
| 401 | AUTH_SESSION_INVALID | AUTH_SESSION_INVALID: Subject session expired, revoked or inactive. | No state change; no unauthorized target disclosure. | 401: authenticate; 403/404: select allowed target; 406: request JSON; 422: fix parameters; 429: wait Retry-After; 503: bounded retry. |
| 403 | AUTH_GRANT_FORBIDDEN | AUTH_GRANT_FORBIDDEN: Self-role edit, non-global policy scope or non-delegable permission. | No state change; no unauthorized target disclosure. | 401: authenticate; 403/404: select allowed target; 406: request JSON; 422: fix parameters; 429: wait Retry-After; 503: bounded retry. |
| 404 | RESOURCE_NOT_FOUND | RESOURCE_NOT_FOUND: Target missing or outside authorized visibility.  | No state change; no unauthorized target disclosure. | 401: authenticate; 403/404: select allowed target; 406: request JSON; 422: fix parameters; 429: wait Retry-After; 503: bounded retry. |
| 406 | NOT_ACCEPTABLE | NOT_ACCEPTABLE: The Accept header excludes application/json.  | No state change; no unauthorized target disclosure. | 401: authenticate; 403/404: select allowed target; 406: request JSON; 422: fix parameters; 429: wait Retry-After; 503: bounded retry. |
| 422 | REQUEST_VALIDATION_ERROR | REQUEST_VALIDATION_ERROR: Declared field/type/conditional validation fails. | No state change; no unauthorized target disclosure. | 401: authenticate; 403/404: select allowed target; 406: request JSON; 422: fix parameters; 429: wait Retry-After; 503: bounded retry. |
| 429 | RATE_LIMIT_EXCEEDED | RATE_LIMIT_EXCEEDED: Configured endpoint/subject/network abuse budget exceeded. | No state change; no unauthorized target disclosure. | 401: authenticate; 403/404: select allowed target; 406: request JSON; 422: fix parameters; 429: wait Retry-After; 503: bounded retry. |
| 503 | AUTH_SERVICE_UNAVAILABLE | AUTH_SERVICE_UNAVAILABLE: Identity/policy/database dependency unavailable. | No state change; no unauthorized target disclosure. | 401: authenticate; 403/404: select allowed target; 406: request JSON; 422: fix parameters; 429: wait Retry-After; 503: bounded retry. |

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "AUTH_SESSION_INVALID",
    "message": "Subject session expired, revoked or inactive.",
    "details": null
  },
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-000000000020",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-000000000021",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Database mapping and ownership

| Table | Exact columns read | Exact proposed columns written | Owner |
| --- | --- | --- | --- |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `id`, `status`, `row_version`, `locked_until`, `account_closed_at`, `phone_verified_at`, `email_verified_at`, `failed_login_count` | None | Authentication_Access |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | `id`, `user_id`, `revoked_at`, `expires_at`, `context_version`, `active_assignment_id`, `active_workspace_code`, `password_verified_at`, `otp_verified_at`, `mfa_verified_at`, `authentication_policy_version`, `token_family_id`, `refresh_token_hash`, `row_version` | None | Authentication_Access |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `id`, `user_id`, `role_id`, `is_active`, `scope_type`, `scope_id`, `valid_from`, `valid_until`, `row_version`, `created_at` | None | Authentication_Access |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `id`, `code`, `is_deleted`, `row_version` | None | Authentication_Access |
| [`identity.role_permissions`](../../04-Database/Tables/identity/role_permissions.md) | `role_id`, `permission_id`, `row_version` | None | Authentication_Access |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | `id`, `code`, `resource`, `action`, `is_deleted` | None | Authentication_Access |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `user_id`, `organization_id`, `location_id`, `status`, `row_version` | None | Consumed scope owner; no write |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `organization_id`, `location_type`, `is_active`, `is_deleted` | None | Consumed scope owner; no write |
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | `id`, `status`, `is_deleted` | None | Consumed scope owner; no write |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `location_id`, `organization_id`, `status`, `is_deleted` | None | Consumed scope owner; no write |

DTO/source: data.roleId → roles.id; rowVersion → roles.row_version; permissionIds → active role_permissions.permission_id joined to non-deleted permissions. Master dependencies: `identity.users`, `identity.roles`, `identity.permissions`, `organization.locations`, `organization.organizations`, `warehouse.warehouses`.

### Operational rules

Require global IAM read permission and fresh password/authenticator. Organization-only operators cannot inspect a shared global role policy by supplying its UUID. Return only active, non-deleted permission IDs for this non-deleted role and its current roles.row_version. Emit ETag "role-N" for API-108; reads never grant any listed permission. Recheck policy and serialize role/edge reads so data and ETag share one snapshot. Use one consistent read snapshot for items and versions/counts; live authorization and locks follow [revocation ordering](../Authentication_Access/Unified-Identity-Architecture.md#authorization-consistency-and-revocation). No creation/update, status transition, idempotency write, outbox or external side effect. Safe denial/access audit uses redacted actor/target metadata through shared logging policy. D-003 approves rate/timeout/freshness budgets; unavailable policy fails closed with 503. Retries of reads use bounded backoff; never reuse returned ETags as proof of authority.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| CT-API-111-01 | Authorized global policy reader obtains exact active permission IDs and current role ETag. | Designed / NOT RUN |
| CT-API-111-02 | Organization-only operator cannot inspect global role policy. | Designed / NOT RUN |
| CT-API-111-03 | Missing/expired/revoked session returns 401; MFA freshness or permission denial returns 403. | Designed / NOT RUN |
| CT-API-111-04 | Deleted role or invisible target returns privacy-safe 404. | Designed / NOT RUN |
| CT-API-111-05 | Concurrent permission replacement yields a consistent permissions/version snapshot; stale write subsequently returns 412. | Designed / NOT RUN |
| CT-API-111-06 | 406/429/503 recover with media correction or bounded backoff, with no grants. | Designed / NOT RUN |



## API-112 — GET `/v1/admin/users/{user_id}/role-assignments`

**List target identity role assignments within the administrator scope.** API version v1; consumer Admin/authorized Identity administrator; owner Authentication_Access; workflow WF-001; features ADM-03, AUTH-04. **Complete proposed / Unapproved / Not Implemented.** [OpenAPI](../../05-APIs/openapi.yaml); D-003/D-024/D-028 approval remains open.

### Authentication and authorization

Authentication required: **YES**. Mechanism: JWT. Allowed roles: independently authorized Identity administrator; a role name alone grants nothing. Required permission: `identity.user_roles.read`. Require explicit IAM assignment-read permission, fresh password/authenticator and target membership within the actor delegation scope. Filter each assignment by contained global/organization/location/warehouse scope before counting and pagination; never disclose assignments at another site. includeInactive=false returns currently active assignments with live validity windows; true includes inactive/expired records only within the same visible scope. Sort created_at then id ascending; use limit/offset and shared pagination metadata. Each rowVersion produces the strong "assignment-N" precondition for API-110. Other role grants remain independent; no permission union, state change or target impersonation.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer synthetic-access-token | Owned live session; current backend permission, scope and fresh MFA. |
| Content-Type | media type | Not Applicable | — | No request body. |
| Accept | media type | Optional | application/json | JSON; unsupported media returns 406. |
| Idempotency-Key | string | Not Applicable | — | Read has no mutation. |
| If-Match | string | Not Applicable | — | Read obtains the current version. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Safe tracing; server generates if absent. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-000000000021 | Safe workflow correlation. |
| Provider signature | — | Not Applicable | — | No provider callback. |

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| user_id | string | Required | No | None | UUID | Existing target public UUID; not authority. |

### Query parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| limit | integer | Optional | No | 20 | {"type":"integer","minimum":1,"maximum":100,"default":20,"example":20} | Declared pagination bound. |
| offset | integer | Optional | No | 0 | {"type":"integer","minimum":0,"maximum":100000,"default":0,"example":0} | Declared pagination bound. |
| includeInactive | boolean | Optional | No | false | {"type":"boolean","default":false} | Include inactive/expired assignments within authorized scope only. |

### Request body and uploads

**No request body.** File uploads: Not Applicable.

### Success response

HTTP **200**. Response headers: X-Request-ID, X-Correlation-ID, X-API-Version: v1, Content-Type: application/json, Cache-Control: no-store; collection rows carry rowVersion; derive `"assignment-N"` for mutations. Shared envelope fields are defined by [Standard responses](../../05-APIs/Standard-Responses.md).

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| data | object | Required | No | None | "Declared schema" | Scoped Identity projection. |
| data.assignments | array | Required | No | None | 100 | Scoped Identity projection. |
| data.assignments[] | object | Required | No | None | "Declared schema" | Scoped Identity projection. |
| data.assignments[].assignmentId | string | Required | No | None | "uuid" | identity.user_roles.id. |
| data.assignments[].userId | string | Required | No | None | "uuid" | Common target identity.users.id. |
| data.assignments[].roleId | string | Required | No | None | "uuid" | Assigned role UUID. |
| data.assignments[].scopeType | string | Required | No | None | ["global","organization","location","warehouse"] | Normalized external scope type. |
| data.assignments[].scopeId | string | Required | Yes | None | "uuid" | Existing target; null for global. |
| data.assignments[].isActive | boolean | Required | No | None | "Declared schema" | Committed assignment activity; role/user/membership checks remain additional. |
| data.assignments[].validFrom | string | Required | Yes | None | "date-time" | Inclusive start. |
| data.assignments[].validUntil | string | Required | Yes | None | "date-time" | Exclusive end. |
| data.assignments[].rowVersion | integer | Required | No | None | "Declared schema" | Assignment optimistic version. |

```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "assignmentId": "0192a1b2-c3d4-7e8f-9012-000000000003",
        "userId": "0192a1b2-c3d4-7e8f-9012-000000000001",
        "roleId": "0192a1b2-c3d4-7e8f-9012-000000000009",
        "scopeType": "location",
        "scopeId": "0192a1b2-c3d4-7e8f-9012-000000000006",
        "isActive": true,
        "validFrom": "2026-10-24T10:30:00Z",
        "validUntil": null,
        "rowVersion": 1
      }
    ]
  },
  "error": null,
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-000000000020",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-000000000021",
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
| 400 | BAD_REQUEST | BAD_REQUEST: Malformed JSON or tracing header. | No state change; no unauthorized target disclosure. | 401: authenticate; 403/404: select allowed target; 406: request JSON; 422: fix parameters; 429: wait Retry-After; 503: bounded retry. |
| 401 | AUTH_SESSION_INVALID | AUTH_SESSION_INVALID: Subject session expired, revoked or inactive. | No state change; no unauthorized target disclosure. | 401: authenticate; 403/404: select allowed target; 406: request JSON; 422: fix parameters; 429: wait Retry-After; 503: bounded retry. |
| 403 | AUTH_GRANT_FORBIDDEN | AUTH_GRANT_FORBIDDEN: Self-grant, undelegable role or target beyond actor scope. | No state change; no unauthorized target disclosure. | 401: authenticate; 403/404: select allowed target; 406: request JSON; 422: fix parameters; 429: wait Retry-After; 503: bounded retry. |
| 404 | RESOURCE_NOT_FOUND | RESOURCE_NOT_FOUND: Target missing or outside authorized visibility.  | No state change; no unauthorized target disclosure. | 401: authenticate; 403/404: select allowed target; 406: request JSON; 422: fix parameters; 429: wait Retry-After; 503: bounded retry. |
| 406 | NOT_ACCEPTABLE | NOT_ACCEPTABLE: The Accept header excludes application/json.  | No state change; no unauthorized target disclosure. | 401: authenticate; 403/404: select allowed target; 406: request JSON; 422: fix parameters; 429: wait Retry-After; 503: bounded retry. |
| 422 | REQUEST_VALIDATION_ERROR | REQUEST_VALIDATION_ERROR: Declared field/type/conditional validation fails. | No state change; no unauthorized target disclosure. | 401: authenticate; 403/404: select allowed target; 406: request JSON; 422: fix parameters; 429: wait Retry-After; 503: bounded retry. |
| 429 | RATE_LIMIT_EXCEEDED | RATE_LIMIT_EXCEEDED: Configured endpoint/subject/network abuse budget exceeded. | No state change; no unauthorized target disclosure. | 401: authenticate; 403/404: select allowed target; 406: request JSON; 422: fix parameters; 429: wait Retry-After; 503: bounded retry. |
| 503 | AUTH_SERVICE_UNAVAILABLE | AUTH_SERVICE_UNAVAILABLE: Identity/policy/database dependency unavailable. | No state change; no unauthorized target disclosure. | 401: authenticate; 403/404: select allowed target; 406: request JSON; 422: fix parameters; 429: wait Retry-After; 503: bounded retry. |

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "AUTH_SESSION_INVALID",
    "message": "Subject session expired, revoked or inactive.",
    "details": null
  },
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-000000000020",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-000000000021",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

### Database mapping and ownership

| Table | Exact columns read | Exact proposed columns written | Owner |
| --- | --- | --- | --- |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `id`, `status`, `row_version`, `locked_until`, `account_closed_at`, `phone_verified_at`, `email_verified_at`, `failed_login_count` | None | Authentication_Access |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | `id`, `user_id`, `revoked_at`, `expires_at`, `context_version`, `active_assignment_id`, `active_workspace_code`, `password_verified_at`, `otp_verified_at`, `mfa_verified_at`, `authentication_policy_version`, `token_family_id`, `refresh_token_hash`, `row_version` | None | Authentication_Access |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `id`, `user_id`, `role_id`, `is_active`, `scope_type`, `scope_id`, `valid_from`, `valid_until`, `row_version`, `created_at` | None | Authentication_Access |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `id`, `code`, `is_deleted`, `row_version` | None | Authentication_Access |
| [`identity.role_permissions`](../../04-Database/Tables/identity/role_permissions.md) | `role_id`, `permission_id`, `row_version` | None | Authentication_Access |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | `id`, `code`, `resource`, `action`, `is_deleted` | None | Authentication_Access |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `user_id`, `organization_id`, `location_id`, `status`, `row_version` | None | Consumed scope owner; no write |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `organization_id`, `location_type`, `is_active`, `is_deleted` | None | Consumed scope owner; no write |
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | `id`, `status`, `is_deleted` | None | Consumed scope owner; no write |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `location_id`, `organization_id`, `status`, `is_deleted` | None | Consumed scope owner; no write |

DTO/source: data.assignments[] → visible user_roles: assignmentId=id, userId=user_id, roleId=role_id, scopeType=scope_type with NULL→global, scopeId=scope_id, isActive=is_active, validFrom=valid_from, validUntil=valid_until, rowVersion=row_version. Pagination is derived after scope filtering. Master dependencies: `identity.users`, `identity.roles`, `identity.permissions`, `organization.locations`, `organization.organizations`, `warehouse.warehouses`.

### Operational rules

Require explicit IAM assignment-read permission, fresh password/authenticator and target membership within the actor delegation scope. Filter each assignment by contained global/organization/location/warehouse scope before counting and pagination; never disclose assignments at another site. includeInactive=false returns currently active assignments with live validity windows; true includes inactive/expired records only within the same visible scope. Sort created_at then id ascending; use limit/offset and shared pagination metadata. Each rowVersion produces the strong "assignment-N" precondition for API-110. Other role grants remain independent; no permission union, state change or target impersonation. Use one consistent read snapshot for items and versions/counts; live authorization and locks follow [revocation ordering](../Authentication_Access/Unified-Identity-Architecture.md#authorization-consistency-and-revocation). No creation/update, status transition, idempotency write, outbox or external side effect. Safe denial/access audit uses redacted actor/target metadata through shared logging policy. D-003 approves rate/timeout/freshness budgets; unavailable policy fails closed with 503. Retries of reads use bounded backoff; never reuse returned ETags as proof of authority.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| CT-API-112-01 | Scoped administrator lists only target assignments in contained organizations/sites, with per-row versions. | Designed / NOT RUN |
| CT-API-112-02 | Cross-store assignments never appear in rows, total or pagination links. | Designed / NOT RUN |
| CT-API-112-03 | includeInactive=false excludes expired/inactive; true exposes only authorized historical assignments. | Designed / NOT RUN |
| CT-API-112-04 | Missing bearer/expired session returns 401; absent permission or stale MFA returns 403. | Designed / NOT RUN |
| CT-API-112-05 | Concurrent revocation cannot yield mixed assignment state/version; subsequent PATCH rechecks If-Match. | Designed / NOT RUN |
| CT-API-112-06 | Invalid limit/offset/boolean returns validation error; no list request creates a role grant. | Designed / NOT RUN |
| CT-API-112-07 | Unavailable primary DB fails closed; bounded read retry is safe. | Designed / NOT RUN |
