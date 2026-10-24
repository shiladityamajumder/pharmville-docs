# Audit API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](API-Contract-Coverage.md) · [OpenAPI 3.1](openapi.yaml) · [decisions](Planning-Decisions.md) · [DTO conventions](API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="audit-api-contracts"></a>
<a id="api-087--get-v1adminauditevents"></a>
<a id="caller-permissions-and-dependencies"></a>
<a id="http-request-contract"></a>
<a id="success-response-illustrative"></a>
<a id="errors-concurrency-and-failure-recovery"></a>
<a id="required-verification"></a>
<a id="api-088--post-v1adminauditexports"></a>
<a id="caller-permissions-and-dependencies-1"></a>
<a id="http-request-contract-1"></a>
<a id="success-response-illustrative-1"></a>
<a id="errors-concurrency-and-failure-recovery-1"></a>
<a id="required-verification-1"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-087 | `GET /v1/admin/audit/events` | Search redacted append-only audit events in approved scope. | Complete proposed |
| API-088 | `POST /v1/admin/audit/exports` | Queue a purpose-bound private audit export. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| AUD-01 | Log logins, changes, stock movements and prescription views | API-087 |
| AUD-02 | Search and export the audit log; read-only for everyone | API-088 |

## API-087 — GET `/v1/admin/audit/events`

**Search redacted append-only audit events in approved scope.**

| Property | Proposed contract |
| --- | --- |
| API name | Search redacted append-only audit events in approved scope |
| Version / owner | v1 / Audit |
| Consumer | Auditor / Security Reviewer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `AUD-01`; [WF-012](../06-Workflows/WF-012-Report-Export-and-Audit.md) |
| Design sources | [Module HLD](../03-Modules/Audit/HLD.md), [LLD](../03-Modules/Audit/LLD.md), [edge cases](../03-Modules/Audit/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/audit/events` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Auditor / Security Reviewer | audit.events.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Read-only auditor access; filter action/resource/time, redact before/after payloads and secrets. Scope evidence through trusted resource ownership; missing scope mapping denies the event rather than revealing all rows.

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
| action | string | Optional | No | None | minLength=1; maxLength=128 | Optional allowlisted filter; does not widen authenticated scope. |
| resourceType | string | Optional | No | None | minLength=1; maxLength=128 | Optional allowlisted filter; does not widen authenticated scope. |
| from | string (date-time) | Required | No | None | format="date-time" | Optional allowlisted filter; does not widen authenticated scope. |
| to | string (date-time) | Required | No | None | format="date-time" | Optional allowlisted filter; does not widen authenticated scope. |


Only declared query fields are accepted. Sorting is fixed: `occurred_at DESC, id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `AuditListData`. The four required envelope fields and meta nullability follow [Standard Responses](Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `events` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `events[].eventId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | platform.audit_logs.id; uuid. |
| `events[].occurredAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | platform.audit_logs.occurred_at; timestamp with time zone. |
| `events[].action` | string | Required | No | None (not silently populated) | minLength=1; maxLength=128 | platform.audit_logs.action; character varying(128). |
| `events[].actorType` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | platform.audit_logs.actor_type; character varying(32). |
| `events[].resourceType` | string | Required | No | None (not silently populated) | minLength=1; maxLength=128 | platform.audit_logs.resource_type; character varying(128). |
| `events[].resourceId` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=128 | platform.audit_logs.resource_id; character varying(128). |
| `events[].requestId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | platform.audit_logs.request_id; uuid. |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "events": [
      {
        "eventId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "occurredAt": "2026-10-24T10:30:00Z",
        "action": "action",
        "actorType": "actor type",
        "resourceType": "resource type",
        "resourceId": null,
        "requestId": null
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-087. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks audit.events.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-087 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`platform.audit_logs`](../04-Database/Tables/platform/audit_logs.md) | Read | `action`, `actor_type`, `id`, `occurred_at`, `request_id`, `resource_id`, `resource_type` | Trusted platform writer scoped to domain transaction projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.events[].eventId | platform.audit_logs.id |
| data.events[].occurredAt | platform.audit_logs.occurred_at |
| data.events[].action | platform.audit_logs.action |
| data.events[].actorType | platform.audit_logs.actor_type |
| data.events[].resourceType | platform.audit_logs.resource_type |
| data.events[].resourceId | platform.audit_logs.resource_id |
| data.events[].requestId | platform.audit_logs.request_id |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Read-only auditor access; filter action/resource/time, redact before/after payloads and secrets. Scope evidence through trusted resource ownership; missing scope mapping denies the event rather than revealing all rows. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; occurred_at DESC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Arbitrary customer/resource IDs do not grant access; broad unsupported filters are 422. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-087-HAPPY` | Valid Auditor / Security Reviewer context and documented fixture for search redacted append-only audit events in approved scope. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-087-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-087-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-087-SCOPE` | Use another customer/site/patient/task reference or remove audit.events.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-087-RULE` | Read-only auditor access; filter action/resource/time, redact before/after payloads and secrets. Scope evidence through trusted resource ownership; missing scope mapping denies the event rather than revealing all rows. | Arbitrary customer/resource IDs do not grant access; broad unsupported filters are 422. |
| `CT-API-087-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-087-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-087-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-087-RECOVERY` | Dependency timeout during search redacted append-only audit events in approved scope. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-AUD-01-OK`, `TC-AUD-01-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-088 — POST `/v1/admin/audit/exports`

**Queue a purpose-bound private audit export.**

| Property | Proposed contract |
| --- | --- |
| API name | Queue a purpose-bound private audit export |
| Version / owner | v1 / Audit |
| Consumer | Authorized Audit Exporter |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `AUD-02`; [WF-012](../06-Workflows/WF-012-Report-Export-and-Audit.md) |
| Design sources | [Module HLD](../03-Modules/Audit/HLD.md), [LLD](../03-Modules/Audit/LLD.md), [edge cases](../03-Modules/Audit/Edge-Cases.md), [ownership](../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/audit/exports` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Authorized Audit Exporter | audit.export (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Auditor export permission is distinct from event read. Use active audit definition and store authorized resource scope, purpose and redaction version. Export does not modify historical audit events; trusted writer logs request separately. Generate an Excel .xlsx private artifact with MIME application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; neutralize spreadsheet formula injection in text cells. Do not substitute CSV for REP-07.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-088_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `AuditExportRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `from` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | Inclusive UTC range bound stored in report_runs.parameters for export jobs. |
| `to` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | Exclusive UTC range bound stored in report_runs.parameters for export jobs. |
| `action` | string | Optional | No | None (not silently populated) | minLength=1; maxLength=128 | Optional exact action filter. |
| `resourceType` | string | Optional | No | None (not silently populated) | minLength=1; maxLength=128 | Public DTO value from platform.audit_logs.resource_type. Ownership and current-state checks apply before use. |
| `purpose` | string | Required | No | None (not silently populated) | minLength=1; maxLength=128 | Required investigation/export purpose; retained in run parameters. |
| `format` | string | Required | No | None (not silently populated) | enum=["xlsx"] | Excel export through the Reporting private-output pipeline. |


```json
{
  "from": "2026-10-01T00:00:00Z",
  "to": "2026-10-24T10:30:00Z",
  "action": "orders.cancel",
  "resourceType": "order",
  "purpose": "Quarterly control review",
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-088. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks audit.export or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for queue a purpose-bound private audit export. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Auditor export permission is distinct from event read. Use active audit definition and store authorized resource scope, purpose and redaction version. Export does not modify historical audit events; trusted writer logs request separately. Generate an Excel .xlsx private artifact with MIME application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; neutralize spreadsheet formula injection in text cells. Do not substitute CSV for REP-07. | No unauthorized/partial domain effect; redact sensitive context. | Permission loss before download denies file access; rejected export does not expose partial data. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Permission loss before download denies file access; rejected export does not expose partial data. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-088 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`platform.audit_logs`](../04-Database/Tables/platform/audit_logs.md) | Read | `action`, `id`, `resource_type` | Trusted platform writer scoped to domain transaction projection / scoped joins; reading does not grant writes. |
| [`platform.report_definitions`](../04-Database/Tables/platform/report_definitions.md) | Read | `code`, `id`, `is_active` | Reporting (Audit exports delegate run creation) projection / scoped joins; reading does not grant writes. |
| [`platform.report_runs`](../04-Database/Tables/platform/report_runs.md) | Create/update evidence | `definition_id`, `parameters`, `requested_by_user_id`, `status`, `requested_at` | Reporting (Audit exports delegate run creation) owns these writes; Audit must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.from | Inclusive UTC range bound stored in report_runs.parameters for export jobs. |
| request.to | Exclusive UTC range bound stored in report_runs.parameters for export jobs. |
| request.action | platform.audit_logs.action |
| request.resourceType | platform.audit_logs.resource_type |
| request.purpose | Approved access/business purpose; retained in audit/run metadata where applicable. |
| request.format | API-only export media allowlist persisted in report_runs.parameters. |
| data.runId | platform.report_runs.id |
| data.status | platform.report_runs.status |
| data.requestedAt | platform.report_runs.requested_at |
| data.resultExpiresAt | platform.report_runs.result_expires_at |
| data.definitionCode | platform.report_definitions.code |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../04-Database/Tables/identity/permissions.md), [`identity.roles`](../04-Database/Tables/identity/roles.md), [`identity.users`](../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Auditor export permission is distinct from event read. Use active audit definition and store authorized resource scope, purpose and redaction version. Export does not modify historical audit events; trusted writer logs request separately. Generate an Excel .xlsx private artifact with MIME application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; neutralize spreadsheet formula injection in text cells. Do not substitute CSV for REP-07. |
| Idempotency | Required key: scope actor + API-088 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Permission loss before download denies file access; rejected export does not expose partial data. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-088-HAPPY` | Valid Authorized Audit Exporter context and documented fixture for queue a purpose-bound private audit export. | HTTP 202; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-088-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-088-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-088-SCOPE` | Use another customer/site/patient/task reference or remove audit.export. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-088-RULE` | Auditor export permission is distinct from event read. Use active audit definition and store authorized resource scope, purpose and redaction version. Export does not modify historical audit events; trusted writer logs request separately. Generate an Excel .xlsx private artifact with MIME application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; neutralize spreadsheet formula injection in text cells. Do not substitute CSV for REP-07. | Permission loss before download denies file access; rejected export does not expose partial data. |
| `CT-API-088-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-088-CONCURRENCY` | Race two queue a purpose-bound private audit export. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-088-STATE` | Apply command after Permission loss before download denies file access; rejected export does not expose partial data. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-088-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Permission loss before download denies file access; rejected export does not expose partial data. |

Existing feature assertions: `TC-AUD-02-OK`, `TC-AUD-02-DENY`. [Feature register](../09-References/Coverage-and-Traceability.md) and [test strategy](../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
