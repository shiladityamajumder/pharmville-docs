# Reporting API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](API-Contract-Coverage.md) · [OpenAPI 3.1](openapi.yaml) · [decisions](Planning-Decisions.md) · [DTO conventions](API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="reporting-api-contracts"></a>
<a id="api-082--get-v1adminreportssales"></a>
<a id="caller-permissions-and-dependencies"></a>
<a id="http-request-contract"></a>
<a id="success-response-illustrative"></a>
<a id="errors-concurrency-and-failure-recovery"></a>
<a id="required-verification"></a>
<a id="api-083--get-v1adminreportstax"></a>
<a id="caller-permissions-and-dependencies-1"></a>
<a id="http-request-contract-1"></a>
<a id="success-response-illustrative-1"></a>
<a id="errors-concurrency-and-failure-recovery-1"></a>
<a id="required-verification-1"></a>
<a id="api-084--get-v1adminreportsstock"></a>
<a id="caller-permissions-and-dependencies-2"></a>
<a id="http-request-contract-2"></a>
<a id="success-response-illustrative-2"></a>
<a id="errors-concurrency-and-failure-recovery-2"></a>
<a id="required-verification-2"></a>
<a id="api-085--get-v1adminreportsdeliveries"></a>
<a id="caller-permissions-and-dependencies-3"></a>
<a id="http-request-contract-3"></a>
<a id="success-response-illustrative-3"></a>
<a id="errors-concurrency-and-failure-recovery-3"></a>
<a id="required-verification-3"></a>
<a id="api-086--post-v1adminreportsexports"></a>
<a id="caller-permissions-and-dependencies-4"></a>
<a id="http-request-contract-4"></a>
<a id="success-response-illustrative-4"></a>
<a id="errors-concurrency-and-failure-recovery-4"></a>
<a id="required-verification-4"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-082 | `GET /v1/admin/reports/sales` | Read the scoped sales report as typed source rows. | Complete proposed |
| API-083 | `GET /v1/admin/reports/tax` | Read the scoped tax report as typed source rows. | Complete proposed |
| API-084 | `GET /v1/admin/reports/stock` | Read the scoped stock report as typed source rows. | Complete proposed |
| API-085 | `GET /v1/admin/reports/deliveries` | Read the scoped deliveries report as typed source rows. | Complete proposed |
| API-086 | `POST /v1/admin/reports/exports` | Queue a scoped report export with private expiring output. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| REP-01 | Sales and orders, by date, store and product | API-082 |
| REP-02 | GST report for filing | API-083 |
| REP-03 | Stock, low stock and near-expiry | API-084 |
| REP-04 | COD, rider collections and deliveries per rider | API-085 |
| REP-05 | Refunds, cancellations and failed deliveries | No direct operation; see [journey/API gaps](Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| REP-06 | Replenishment transfers | No direct operation; see [journey/API gaps](Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| REP-07 | Excel export for every report | API-086 |

## API-082 — GET `/v1/admin/reports/sales`

**Read the scoped sales report as typed source rows.**

| Property | Proposed contract |
| --- | --- |
| API name | Read the scoped sales report as typed source rows |
| Version / owner | v1 / Reporting |
| Consumer | Authorized Finance Report Viewer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `REP-01`; [WF-012](../06-Workflows/WF-012-Report-Export-and-Audit.md) |
| Design sources | [Module HLD](../03-Modules/Reporting/HLD.md), [LLD](../03-Modules/Reporting/LLD.md), [edge cases](../03-Modules/Reporting/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/reports/sales` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Authorized Finance Report Viewer | reports.sales.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Sales means issued invoice lines/totals in the selected period, not gross payment attempts. Exclude voided invoices only according to approved Finance policy; expose status for interpretation.

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
| from | string (date-time) | Required | No | None | format="date-time" | Optional allowlisted filter; does not widen authenticated scope. |
| to | string (date-time) | Required | No | None | format="date-time" | Optional allowlisted filter; does not widen authenticated scope. |
| locationId | string (uuid) | Optional | No | None | format="uuid" | Optional allowlisted filter; does not widen authenticated scope. |


Only declared query fields are accepted. Sorting is fixed: `issued_at DESC, id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `SalesReportData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `asOf` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | API-only server evaluation timestamp; not a historical snapshot guarantee. |
| `rows` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `rows[].invoiceId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | finance.invoices.id; uuid. |
| `rows[].orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | finance.invoices.order_id; uuid. |
| `rows[].issuedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | finance.invoices.issued_at; timestamp with time zone. |
| `rows[].currency` | string | Required | No | None (not silently populated) | minLength=1; maxLength=3 | finance.invoices.currency; character varying(3). |
| `rows[].subtotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | finance.invoices.subtotal; numeric(16,2). |
| `rows[].taxTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | finance.invoices.tax_total; numeric(16,2). |
| `rows[].grandTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | finance.invoices.grand_total; numeric(16,2). |
| `rows[].status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | finance.invoices.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "asOf": "2026-10-24T10:30:00Z",
    "rows": [
      {
        "invoiceId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "issuedAt": "2026-10-24T10:30:00Z",
        "currency": "INR",
        "subtotal": "25.00",
        "taxTotal": "0.00",
        "grandTotal": "25.00",
        "status": "issued"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-082. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks reports.sales.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-082 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`platform.report_definitions`](../04-Database/Tables/platform/report_definitions.md) | Read | `id`, `is_active` | Reporting (Audit exports delegate run creation) projection / scoped joins; reading does not grant writes. |
| [`finance.invoices`](../04-Database/Tables/finance/invoices.md) | Read | `currency`, `grand_total`, `id`, `issued_at`, `order_id`, `row_version`, `status`, `subtotal`, `tax_total` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`commerce.orders`](../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.asOf | API-only server evaluation timestamp; not a historical snapshot guarantee. |
| data.rows[].invoiceId | finance.invoices.id |
| data.rows[].orderId | finance.invoices.order_id |
| data.rows[].issuedAt | finance.invoices.issued_at |
| data.rows[].currency | finance.invoices.currency |
| data.rows[].subtotal | finance.invoices.subtotal |
| data.rows[].taxTotal | finance.invoices.tax_total |
| data.rows[].grandTotal | finance.invoices.grand_total |
| data.rows[].status | finance.invoices.status |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../04-Database/Tables/marketplace/sellers.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Sales means issued invoice lines/totals in the selected period, not gross payment attempts. Exclude voided invoices only according to approved Finance policy; expose status for interpretation. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; issued_at DESC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Unauthorized location/date scope is denied; incomplete source read returns 503 instead of a complete-looking report. Exports use API-086. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-082-HAPPY` | Valid Authorized Finance Report Viewer context and documented fixture for read the scoped sales report as typed source rows. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-082-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-082-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-082-SCOPE` | Use another customer/site/patient/task reference or remove reports.sales.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-082-RULE` | Sales means issued invoice lines/totals in the selected period, not gross payment attempts. Exclude voided invoices only according to approved Finance policy; expose status for interpretation. | Unauthorized location/date scope is denied; incomplete source read returns 503 instead of a complete-looking report. Exports use API-086. |
| `CT-API-082-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-082-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-082-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-082-RECOVERY` | Dependency timeout during read the scoped sales report as typed source rows. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-REP-01-OK`, `TC-REP-01-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-083 — GET `/v1/admin/reports/tax`

**Read the scoped tax report as typed source rows.**

| Property | Proposed contract |
| --- | --- |
| API name | Read the scoped tax report as typed source rows |
| Version / owner | v1 / Reporting |
| Consumer | Authorized Finance Report Viewer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `REP-02`; [WF-012](../06-Workflows/WF-012-Report-Export-and-Audit.md) |
| Design sources | [Module HLD](../03-Modules/Reporting/HLD.md), [LLD](../03-Modules/Reporting/LLD.md), [edge cases](../03-Modules/Reporting/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/reports/tax` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Authorized Finance Report Viewer | reports.tax.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Report recorded invoice tax/HSN values; never manufacture tax rates, exemptions or filing obligations. Null HSN is visible for Finance investigation, not an inferred code.

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
| from | string (date-time) | Required | No | None | format="date-time" | Optional allowlisted filter; does not widen authenticated scope. |
| to | string (date-time) | Required | No | None | format="date-time" | Optional allowlisted filter; does not widen authenticated scope. |
| locationId | string (uuid) | Optional | No | None | format="uuid" | Optional allowlisted filter; does not widen authenticated scope. |


Only declared query fields are accepted. Sorting is fixed: `invoice issued_at DESC, invoice_item id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `TaxReportData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `asOf` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | API-only server evaluation timestamp; not a historical snapshot guarantee. |
| `rows` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `rows[].invoiceItemId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | finance.invoice_items.id; uuid. |
| `rows[].invoiceId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | finance.invoice_items.invoice_id; uuid. |
| `rows[].hsnCode` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=32 | finance.invoice_items.hsn_code; character varying(32). |
| `rows[].taxRate` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,3}(\\.[0-9]{1,4})?$" | finance.invoice_items.tax_rate; numeric(7,4). |
| `rows[].taxAmount` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,12}(\\.[0-9]{1,2})?$" | finance.invoice_items.tax_amount; numeric(14,2). |
| `rows[].lineTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | finance.invoice_items.line_total; numeric(16,2). |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "asOf": "2026-10-24T10:30:00Z",
    "rows": []
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-083. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks reports.tax.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-083 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`platform.report_definitions`](../04-Database/Tables/platform/report_definitions.md) | Read | `id`, `is_active` | Reporting (Audit exports delegate run creation) projection / scoped joins; reading does not grant writes. |
| [`finance.invoices`](../04-Database/Tables/finance/invoices.md) | Read | `id`, `order_id`, `row_version`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`finance.invoice_items`](../04-Database/Tables/finance/invoice_items.md) | Read | `hsn_code`, `id`, `invoice_id`, `line_total`, `order_item_id`, `row_version`, `tax_amount`, `tax_rate` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`commerce.orders`](../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.asOf | API-only server evaluation timestamp; not a historical snapshot guarantee. |
| data.rows[].invoiceItemId | finance.invoice_items.id |
| data.rows[].invoiceId | finance.invoice_items.invoice_id |
| data.rows[].hsnCode | finance.invoice_items.hsn_code |
| data.rows[].taxRate | finance.invoice_items.tax_rate |
| data.rows[].taxAmount | finance.invoice_items.tax_amount |
| data.rows[].lineTotal | finance.invoice_items.line_total |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`clinical.patient_profiles`](../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../04-Database/Tables/marketplace/sellers.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Report recorded invoice tax/HSN values; never manufacture tax rates, exemptions or filing obligations. Null HSN is visible for Finance investigation, not an inferred code. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; invoice issued_at DESC, invoice_item id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Unauthorized location/date scope is denied; incomplete source read returns 503 instead of a complete-looking report. Exports use API-086. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-083-HAPPY` | Valid Authorized Finance Report Viewer context and documented fixture for read the scoped tax report as typed source rows. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-083-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-083-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-083-SCOPE` | Use another customer/site/patient/task reference or remove reports.tax.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-083-RULE` | Report recorded invoice tax/HSN values; never manufacture tax rates, exemptions or filing obligations. Null HSN is visible for Finance investigation, not an inferred code. | Unauthorized location/date scope is denied; incomplete source read returns 503 instead of a complete-looking report. Exports use API-086. |
| `CT-API-083-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-083-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-083-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-083-RECOVERY` | Dependency timeout during read the scoped tax report as typed source rows. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-REP-02-OK`, `TC-REP-02-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-084 — GET `/v1/admin/reports/stock`

**Read the scoped stock report as typed source rows.**

| Property | Proposed contract |
| --- | --- |
| API name | Read the scoped stock report as typed source rows |
| Version / owner | v1 / Reporting |
| Consumer | Authorized Operational Report Viewer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `REP-03`; [WF-012](../06-Workflows/WF-012-Report-Export-and-Audit.md) |
| Design sources | [Module HLD](../03-Modules/Reporting/HLD.md), [LLD](../03-Modules/Reporting/LLD.md), [edge cases](../03-Modules/Reporting/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/reports/stock` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Authorized Operational Report Viewer | reports.stock.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Report current stock asOf, not historical stock reconstructed from arbitrary dates. recorded observation is shown and stock remains subject to eligibility/freshness.

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
| locationId | string (uuid) | Optional | No | None | format="uuid" | Optional allowlisted filter; does not widen authenticated scope. |


Only declared query fields are accepted. Sorting is fixed: `warehouse_id ASC, lot_id ASC, bin_id ASC, id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `StockReportData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `asOf` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | API-only server evaluation timestamp; not a historical snapshot guarantee. |
| `rows` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `rows[].balanceId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | warehouse.stock_balances.id; uuid. |
| `rows[].warehouseId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | warehouse.stock_balances.warehouse_id; uuid. |
| `rows[].lotId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | warehouse.stock_balances.lot_id; uuid. |
| `rows[].binId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | warehouse.stock_balances.bin_id; uuid. |
| `rows[].onHandQty` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,13}(\\.[0-9]{1,3})?$" | warehouse.stock_balances.on_hand_qty; numeric(16,3). |
| `rows[].reservedQty` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,13}(\\.[0-9]{1,3})?$" | warehouse.stock_balances.reserved_qty; numeric(16,3). |
| `rows[].damagedQty` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,13}(\\.[0-9]{1,3})?$" | warehouse.stock_balances.damaged_qty; numeric(16,3). |
| `rows[].quarantinedQty` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,13}(\\.[0-9]{1,3})?$" | warehouse.stock_balances.quarantined_qty; numeric(16,3). |
| `rows[].observedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | warehouse.stock_balances.inventory_observed_at; timestamp with time zone. |
| `rows[].rowVersion` | integer | Required | No | None (not silently populated) | minimum=0 | warehouse.stock_balances.row_version; bigint. |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "asOf": "2026-10-24T10:30:00Z",
    "rows": [
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-084. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks reports.stock.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-084 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`platform.report_definitions`](../04-Database/Tables/platform/report_definitions.md) | Read | `id`, `is_active` | Reporting (Audit exports delegate run creation) projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_balances`](../04-Database/Tables/warehouse/stock_balances.md) | Read | `bin_id`, `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `lot_id`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.inventory_lots`](../04-Database/Tables/warehouse/inventory_lots.md) | Read | `batch_number`, `expires_at`, `id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`warehouse.warehouses`](../04-Database/Tables/warehouse/warehouses.md) | Read | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | Warehouse projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.asOf | API-only server evaluation timestamp; not a historical snapshot guarantee. |
| data.rows[].balanceId | warehouse.stock_balances.id |
| data.rows[].warehouseId | warehouse.stock_balances.warehouse_id |
| data.rows[].lotId | warehouse.stock_balances.lot_id |
| data.rows[].binId | warehouse.stock_balances.bin_id |
| data.rows[].onHandQty | warehouse.stock_balances.on_hand_qty |
| data.rows[].reservedQty | warehouse.stock_balances.reserved_qty |
| data.rows[].damagedQty | warehouse.stock_balances.damaged_qty |
| data.rows[].quarantinedQty | warehouse.stock_balances.quarantined_qty |
| data.rows[].observedAt | warehouse.stock_balances.inventory_observed_at |
| data.rows[].rowVersion | warehouse.stock_balances.row_version |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`catalog.product_variants`](../04-Database/Tables/catalog/product_variants.md), [`catalog.products`](../04-Database/Tables/catalog/products.md), [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`organization.locations`](../04-Database/Tables/organization/locations.md), [`organization.organizations`](../04-Database/Tables/organization/organizations.md), [`procurement.suppliers`](../04-Database/Tables/procurement/suppliers.md), [`warehouse.bins`](../04-Database/Tables/warehouse/bins.md), [`warehouse.warehouses`](../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Report current stock asOf, not historical stock reconstructed from arbitrary dates. recorded observation is shown and stock remains subject to eligibility/freshness. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; warehouse_id ASC, lot_id ASC, bin_id ASC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Unauthorized location/date scope is denied; incomplete source read returns 503 instead of a complete-looking report. Exports use API-086. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-084-HAPPY` | Valid Authorized Operational Report Viewer context and documented fixture for read the scoped stock report as typed source rows. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-084-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-084-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-084-SCOPE` | Use another customer/site/patient/task reference or remove reports.stock.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-084-RULE` | Report current stock asOf, not historical stock reconstructed from arbitrary dates. recorded observation is shown and stock remains subject to eligibility/freshness. | Unauthorized location/date scope is denied; incomplete source read returns 503 instead of a complete-looking report. Exports use API-086. |
| `CT-API-084-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-084-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-084-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-084-RECOVERY` | Dependency timeout during read the scoped stock report as typed source rows. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-REP-03-OK`, `TC-REP-03-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-085 — GET `/v1/admin/reports/deliveries`

**Read the scoped deliveries report as typed source rows.**

| Property | Proposed contract |
| --- | --- |
| API name | Read the scoped deliveries report as typed source rows |
| Version / owner | v1 / Reporting |
| Consumer | Authorized Operational Report Viewer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `REP-04`; [WF-012](../06-Workflows/WF-012-Report-Export-and-Audit.md) |
| Design sources | [Module HLD](../03-Modules/Reporting/HLD.md), [LLD](../03-Modules/Reporting/LLD.md), [edge cases](../03-Modules/Reporting/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/reports/deliveries` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Authorized Operational Report Viewer | reports.deliveries.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Report actual dispatched/delivered outcomes separately from estimates. No precise rider location or recipient contact is returned.

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
| from | string (date-time) | Required | No | None | format="date-time" | Optional allowlisted filter; does not widen authenticated scope. |
| to | string (date-time) | Required | No | None | format="date-time" | Optional allowlisted filter; does not widen authenticated scope. |
| locationId | string (uuid) | Optional | No | None | format="uuid" | Optional allowlisted filter; does not widen authenticated scope. |


Only declared query fields are accepted. Sorting is fixed: `dispatched_at DESC, id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `DeliveriesReportData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `asOf` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | API-only server evaluation timestamp; not a historical snapshot guarantee. |
| `rows` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `rows[].shipmentId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | logistics.shipments.id; uuid. |
| `rows[].orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | logistics.shipments.order_id; uuid. |
| `rows[].status` | string | Required | No | None (not silently populated) | enum=["created", "label_created", "pickup_scheduled", "picked_up", "in_transit", "out_for_delivery", "delivered", "delivery_failed", "rto_initiated", "rto_delivered", "cancelled"]; minLength=1; maxLength=16 | logistics.shipments.status; character varying(16). |
| `rows[].dispatchedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | logistics.shipments.dispatched_at; timestamp with time zone. |
| `rows[].deliveredAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | logistics.shipments.delivered_at; timestamp with time zone. |
| `rows[].estimatedDeliveryAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | logistics.shipments.estimated_delivery_at; timestamp with time zone. |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "asOf": "2026-10-24T10:30:00Z",
    "rows": [
      {
        "shipmentId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "status": "created",
        "dispatchedAt": null,
        "deliveredAt": null,
        "estimatedDeliveryAt": null
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-085. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks reports.deliveries.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-085 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`platform.report_definitions`](../04-Database/Tables/platform/report_definitions.md) | Read | `id`, `is_active` | Reporting (Audit exports delegate run creation) projection / scoped joins; reading does not grant writes. |
| [`logistics.shipments`](../04-Database/Tables/logistics/shipments.md) | Read | `delivered_at`, `dispatched_at`, `estimated_delivery_at`, `id`, `order_id`, `order_revision_id`, `package_id`, `row_version`, `status` | Delivery_Operations projection / scoped joins; reading does not grant writes. |
| [`fulfillment.packages`](../04-Database/Tables/fulfillment/packages.md) | Read | `fulfillment_order_id`, `id`, `row_version`, `status` | Store_Operations / Fulfillment owner projection / scoped joins; reading does not grant writes. |
| [`fulfillment.fulfillment_orders`](../04-Database/Tables/fulfillment/fulfillment_orders.md) | Read | `id`, `order_id`, `order_revision_id`, `row_version`, `status`, `warehouse_id` | Store_Operations / Fulfillment owner projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.asOf | API-only server evaluation timestamp; not a historical snapshot guarantee. |
| data.rows[].shipmentId | logistics.shipments.id |
| data.rows[].orderId | logistics.shipments.order_id |
| data.rows[].status | logistics.shipments.status |
| data.rows[].dispatchedAt | logistics.shipments.dispatched_at |
| data.rows[].deliveredAt | logistics.shipments.delivered_at |
| data.rows[].estimatedDeliveryAt | logistics.shipments.estimated_delivery_at |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`logistics.carriers`](../04-Database/Tables/logistics/carriers.md), [`marketplace.sellers`](../04-Database/Tables/marketplace/sellers.md), [`warehouse.warehouses`](../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Report actual dispatched/delivered outcomes separately from estimates. No precise rider location or recipient contact is returned. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; dispatched_at DESC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Unauthorized location/date scope is denied; incomplete source read returns 503 instead of a complete-looking report. Exports use API-086. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-085-HAPPY` | Valid Authorized Operational Report Viewer context and documented fixture for read the scoped deliveries report as typed source rows. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-085-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-085-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-085-SCOPE` | Use another customer/site/patient/task reference or remove reports.deliveries.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-085-RULE` | Report actual dispatched/delivered outcomes separately from estimates. No precise rider location or recipient contact is returned. | Unauthorized location/date scope is denied; incomplete source read returns 503 instead of a complete-looking report. Exports use API-086. |
| `CT-API-085-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-085-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-085-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-085-RECOVERY` | Dependency timeout during read the scoped deliveries report as typed source rows. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-REP-04-OK`, `TC-REP-04-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-086 — POST `/v1/admin/reports/exports`

**Queue a scoped report export with private expiring output.**

| Property | Proposed contract |
| --- | --- |
| API name | Queue a scoped report export with private expiring output |
| Version / owner | v1 / Reporting |
| Consumer | Authorized Report Exporter |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `REP-07`; [WF-012](../06-Workflows/WF-012-Report-Export-and-Audit.md) |
| Design sources | [Module HLD](../03-Modules/Reporting/HLD.md), [LLD](../03-Modules/Reporting/LLD.md), [edge cases](../03-Modules/Reporting/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/reports/exports` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Authorized Report Exporter | reports.export (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Definition must be active, caller has its owner_role/action and parameters validate against approved parameters_schema. Persist caller scope and export parameters; recheck current permissions before file grant/download. Worker uses owner read projections and cannot edit sources. Generate an Excel .xlsx private artifact with MIME application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; neutralize spreadsheet formula injection in text cells. Do not substitute CSV for REP-07.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-086_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `ReportExportRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `definitionCode` | string | Required | No | None (not silently populated) | minLength=1; maxLength=100 | Active platform.report_definitions.code; not arbitrary SQL. |
| `from` | string (date) | Required | No | None (not silently populated) | format="date" | Inclusive UTC range bound stored in report_runs.parameters for export jobs. |
| `to` | string (date) | Required | No | None (not silently populated) | format="date" | Exclusive UTC range bound stored in report_runs.parameters for export jobs. |
| `locationId` | string (uuid) | Optional | No | None (not silently populated) | format="uuid" | Optional narrowing to an already authorized location. |
| `format` | string | Required | No | None (not silently populated) | enum=["xlsx"] | REP-07 requires Excel export; CSV is not a substitute for the documented requirement. |


```json
{
  "definitionCode": "sales",
  "from": "2026-10-01",
  "to": "2026-10-24",
  "locationId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "format": "xlsx"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **202**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `ReportRunData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `runId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | platform.report_runs.id; uuid. |
| `status` | string | Required | No | None (not silently populated) | enum=["queued", "running", "succeeded", "failed", "expired"]; minLength=1; maxLength=16 | platform.report_runs.status; character varying(16). |
| `requestedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | platform.report_runs.requested_at; timestamp with time zone. |
| `resultExpiresAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | platform.report_runs.result_expires_at; timestamp with time zone. |
| `definitionCode` | string | Required | No | None (not silently populated) | minLength=1; maxLength=100 | platform.report_definitions.code; character varying(100). |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "runId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "status": "queued",
    "requestedAt": "2026-10-24T10:30:00Z",
    "resultExpiresAt": null,
    "definitionCode": "sales"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-086. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks reports.export or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for queue a scoped report export with private expiring output. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Definition must be active, caller has its owner_role/action and parameters validate against approved parameters_schema. Persist caller scope and export parameters; recheck current permissions before file grant/download. Worker uses owner read projections and cannot edit sources. Generate an Excel .xlsx private artifact with MIME application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; neutralize spreadsheet formula injection in text cells. Do not substitute CSV for REP-07. | No unauthorized/partial domain effect; redact sensitive context. | Expired/revoked grants prevent download even if job once succeeded; failed run is visible and rerun does not mutate orders/money. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Expired/revoked grants prevent download even if job once succeeded; failed run is visible and rerun does not mutate orders/money. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-086 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`platform.report_definitions`](../04-Database/Tables/platform/report_definitions.md) | Read | `code`, `id`, `is_active` | Reporting (Audit exports delegate run creation) projection / scoped joins; reading does not grant writes. |
| [`organization.memberships`](../04-Database/Tables/organization/memberships.md) | Read | `id`, `location_id`, `organization_id`, `row_version`, `status`, `user_id` | Admin_CMS via Organization owner projection / scoped joins; reading does not grant writes. |
| [`platform.report_runs`](../04-Database/Tables/platform/report_runs.md) | Create/update evidence | `definition_id`, `parameters`, `requested_by_user_id`, `status`, `requested_at` | Reporting (Audit exports delegate run creation) owns these writes; Reporting must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.definitionCode | platform.report_definitions.code |
| request.from | Inclusive UTC range bound stored in report_runs.parameters for export jobs. |
| request.to | Exclusive UTC range bound stored in report_runs.parameters for export jobs. |
| request.locationId | organization.memberships.location_id |
| request.format | API-only export media allowlist persisted in report_runs.parameters. |
| data.runId | platform.report_runs.id |
| data.status | platform.report_runs.status |
| data.requestedAt | platform.report_runs.requested_at |
| data.resultExpiresAt | platform.report_runs.result_expires_at |
| data.definitionCode | platform.report_definitions.code |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md), [`organization.departments`](../04-Database/Tables/organization/departments.md), [`organization.locations`](../04-Database/Tables/organization/locations.md), [`organization.organizations`](../04-Database/Tables/organization/organizations.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Definition must be active, caller has its owner_role/action and parameters validate against approved parameters_schema. Persist caller scope and export parameters; recheck current permissions before file grant/download. Worker uses owner read projections and cannot edit sources. Generate an Excel .xlsx private artifact with MIME application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; neutralize spreadsheet formula injection in text cells. Do not substitute CSV for REP-07. |
| Idempotency | Required key: scope actor + API-086 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Expired/revoked grants prevent download even if job once succeeded; failed run is visible and rerun does not mutate orders/money. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-086-HAPPY` | Valid Authorized Report Exporter context and documented fixture for queue a scoped report export with private expiring output. | HTTP 202; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-086-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-086-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-086-SCOPE` | Use another customer/site/patient/task reference or remove reports.export. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-086-RULE` | Definition must be active, caller has its owner_role/action and parameters validate against approved parameters_schema. Persist caller scope and export parameters; recheck current permissions before file grant/download. Worker uses owner read projections and cannot edit sources. Generate an Excel .xlsx private artifact with MIME application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; neutralize spreadsheet formula injection in text cells. Do not substitute CSV for REP-07. | Expired/revoked grants prevent download even if job once succeeded; failed run is visible and rerun does not mutate orders/money. |
| `CT-API-086-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-086-CONCURRENCY` | Race two queue a scoped report export with private expiring output. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-086-STATE` | Apply command after Expired/revoked grants prevent download even if job once succeeded; failed run is visible and rerun does not mutate orders/money. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-086-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Expired/revoked grants prevent download even if job once succeeded; failed run is visible and rerun does not mutate orders/money. |

Existing feature assertions: `TC-REP-07-OK`, `TC-REP-07-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
