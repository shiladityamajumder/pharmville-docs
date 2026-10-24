# Notifications API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](../../05-APIs/API-Contract-Coverage.md) · [OpenAPI 3.1](../../05-APIs/openapi.yaml) · [decisions](../../05-APIs/Planning-Decisions.md) · [DTO conventions](../../05-APIs/API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="notifications-api-contracts"></a>
<a id="api-094--post-v1internalnotificationsjobs"></a>
<a id="caller-permissions-and-dependencies"></a>
<a id="http-request-contract"></a>
<a id="success-response-illustrative"></a>
<a id="errors-concurrency-and-failure-recovery"></a>
<a id="required-verification"></a>
<a id="api-095--get-v1adminnotificationsdeliveries"></a>
<a id="caller-permissions-and-dependencies-1"></a>
<a id="http-request-contract-1"></a>
<a id="success-response-illustrative-1"></a>
<a id="errors-concurrency-and-failure-recovery-1"></a>
<a id="required-verification-1"></a>
<a id="api-096--post-v1riderpush-tokens"></a>
<a id="caller-permissions-and-dependencies-2"></a>
<a id="http-request-contract-2"></a>
<a id="success-response-illustrative-2"></a>
<a id="errors-concurrency-and-failure-recovery-2"></a>
<a id="required-verification-2"></a>
<a id="api-097--get-v1adminnotificationsalerts"></a>
<a id="caller-permissions-and-dependencies-3"></a>
<a id="http-request-contract-3"></a>
<a id="success-response-illustrative-3"></a>
<a id="errors-concurrency-and-failure-recovery-3"></a>
<a id="required-verification-3"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-094 | `POST /v1/internal/notifications/jobs` | Queue a committed domain notification without replaying its source action. | Complete proposed |
| API-095 | `GET /v1/admin/notifications/deliveries` | Read redacted message delivery outcomes for authorized operations. | Complete proposed |
| API-096 | `POST /v1/rider/push-tokens` | Register or rotate the rider’s own push delivery endpoint. | Complete proposed |
| API-097 | `GET /v1/admin/notifications/alerts` | Read derived notification failures and backlog alerts. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| NOT-01 | One notification service: templates, WhatsApp first, SMS fallback, email | API-094 |
| NOT-02 | Delivery log with retries | API-095 |
| NOT-03 | Rider push notifications (FCM) | API-096 |
| NOT-04 | Staff alerts in the admin panel | API-097 |
| NOT-05 | Customer browser push notifications | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |

## API-094 — POST `/v1/internal/notifications/jobs`

**Queue a committed domain notification without replaying its source action.**

| Property | Proposed contract |
| --- | --- |
| API name | Queue a committed domain notification without replaying its source action |
| Version / owner | v1 / Notifications |
| Consumer | Internal committed-event consumer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `NOT-01`; [WF-005](../../06-Workflows/WF-005-Payment-and-Confirmation.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/internal/notifications/jobs` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | Service Identity | Internal committed-event consumer | notifications.jobs.create (Proposed grant code) |


Authenticate a private-ingress workload identity with the exact notifications.jobs.create capability. Constrain its allowed organization/location/aggregate context on the server and validate every referenced resource; a caller-provided actor or service name grants no authority. Workload identity does not require a human staff session/membership.

Internal capability and committed source-event reference required; bind key to source event/template/user/channel. Resolve approved variables and verified destination server-side; enforce consent/suppression. This first proposal supports order-status references only.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-094_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `NotificationJobRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `userId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from notification.messages.user_id. Ownership and current-state checks apply before use. |
| `templateCode` | string | Required | No | None (not silently populated) | minLength=1; maxLength=128 | Published notification.templates.code; exact approved version resolved server-side. |
| `channel` | string | Required | No | None (not silently populated) | enum=["sms", "email", "push"] | Public DTO value from notification.messages.channel. Ownership and current-state checks apply before use. |
| `orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Reference only; template variables are resolved through authorized domain projection. |
| `notificationType` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | Must match template/consent purpose. |
| `sourceEventId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Committed platform.outbox_events.id; enforce event-to-order authorization. |


```json
{
  "userId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "templateCode": "ORDER_STATUS",
  "channel": "sms",
  "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "notificationType": "order_status",
  "sourceEventId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **202**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `NotificationData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `messageId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | notification.messages.id; uuid. |
| `channel` | string | Required | No | None (not silently populated) | enum=["email", "sms", "whatsapp", "push", "in_app"]; minLength=1; maxLength=16 | notification.messages.channel; character varying(16). |
| `notificationType` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | notification.messages.notification_type; character varying(64). |
| `status` | string | Required | No | None (not silently populated) | enum=["queued", "scheduled", "processing", "sent", "delivered", "failed", "cancelled"]; minLength=1; maxLength=16 | notification.messages.status; character varying(16). |
| `attemptCount` | integer | Required | No | None (not silently populated) | minimum=0 | notification.messages.attempt_count; integer. |
| `sentAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | notification.messages.sent_at; timestamp with time zone. |
| `deliveredAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | notification.messages.delivered_at; timestamp with time zone. |
| `failedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | notification.messages.failed_at; timestamp with time zone. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "messageId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "channel": "sms",
    "notificationType": "order_status",
    "status": "queued",
    "attemptCount": 1,
    "sentAt": null,
    "deliveredAt": null,
    "failedAt": null
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked Service Identity credential for API-094. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Workload lacks the required capability or the target is outside its authorized organization/location/aggregate scope. | No trusted effect or hidden-resource disclosure. | Correct the reviewed provider/workload scope. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for queue a committed domain notification without replaying its source action. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Internal capability and committed source-event reference required; bind key to source event/template/user/channel. Resolve approved variables and verified destination server-side; enforce consent/suppression. This first proposal supports order-status references only. | No unauthorized/partial domain effect; redact sensitive context. | Suppressed/forbidden recipient does not trigger a message; delivery retry never repeats order/charge. Provider timeout updates attempts separately. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Suppressed/forbidden recipient does not trigger a message; delivery retry never repeats order/charge. Provider timeout updates attempts separately. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-094 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`notification.templates`](../../04-Database/Tables/notification/templates.md) | Read | `code`, `id`, `is_deleted`, `row_version`, `status` | Notifications projection / scoped joins; reading does not grant writes. |
| [`notification.user_channel_preferences`](../../04-Database/Tables/notification/user_channel_preferences.md) | Read | `id`, `is_deleted`, `row_version`, `user_id` | Notifications projection / scoped joins; reading does not grant writes. |
| [`notification.suppressions`](../../04-Database/Tables/notification/suppressions.md) | Read | `expires_at`, `id`, `is_active`, `is_deleted`, `row_version` | Notifications projection / scoped joins; reading does not grant writes. |
| [`notification.provider_configurations`](../../04-Database/Tables/notification/provider_configurations.md) | Read | `id`, `is_deleted`, `row_version`, `status` | Notifications projection / scoped joins; reading does not grant writes. |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`platform.outbox_events`](../../04-Database/Tables/platform/outbox_events.md) | Read | `id`, `row_version` | Trusted platform writer scoped to domain transaction projection / scoped joins; reading does not grant writes. |
| [`notification.messages`](../../04-Database/Tables/notification/messages.md) | Create/update evidence | `user_id`, `template_id`, `channel`, `notification_type`, `payload`, `idempotency_key`, `idempotency_scope`, `status`, `available_at` | Notifications owns these writes; Notifications must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.userId | notification.messages.user_id |
| request.templateCode | notification.templates.code |
| request.channel | notification.messages.channel |
| request.orderId | commerce.orders.id |
| request.notificationType | notification.messages.notification_type |
| request.sourceEventId | platform.outbox_events.id |
| data.messageId | notification.messages.id |
| data.channel | notification.messages.channel |
| data.notificationType | notification.messages.notification_type |
| data.status | notification.messages.status |
| data.attemptCount | notification.messages.attempt_count |
| data.sentAt | notification.messages.sent_at |
| data.deliveredAt | notification.messages.delivered_at |
| data.failedAt | notification.messages.failed_at |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Internal capability and committed source-event reference required; bind key to source event/template/user/channel. Resolve approved variables and verified destination server-side; enforce consent/suppression. This first proposal supports order-status references only. |
| Idempotency | Required key: scope actor + API-094 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Suppressed/forbidden recipient does not trigger a message; delivery retry never repeats order/charge. Provider timeout updates attempts separately. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-094-HAPPY` | Valid Internal committed-event consumer context and documented fixture for queue a committed domain notification without replaying its source action. | HTTP 202; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-094-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-094-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-094-SCOPE` | Use another customer/site/patient/task reference or remove notifications.jobs.create. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-094-RULE` | Internal capability and committed source-event reference required; bind key to source event/template/user/channel. Resolve approved variables and verified destination server-side; enforce consent/suppression. This first proposal supports order-status references only. | Suppressed/forbidden recipient does not trigger a message; delivery retry never repeats order/charge. Provider timeout updates attempts separately. |
| `CT-API-094-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-094-CONCURRENCY` | Race two queue a committed domain notification without replaying its source action. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-094-STATE` | Apply command after Suppressed/forbidden recipient does not trigger a message; delivery retry never repeats order/charge. Provider timeout updates attempts separately. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-094-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Suppressed/forbidden recipient does not trigger a message; delivery retry never repeats order/charge. Provider timeout updates attempts separately. |

Existing feature assertions: `TC-NOT-01-OK`, `TC-NOT-01-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-095 — GET `/v1/admin/notifications/deliveries`

**Read redacted message delivery outcomes for authorized operations.**

| Property | Proposed contract |
| --- | --- |
| API name | Read redacted message delivery outcomes for authorized operations |
| Version / owner | v1 / Notifications |
| Consumer | Notification Operator |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `NOT-02`; [WF-012](../../06-Workflows/WF-012-Report-Export-and-Audit.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/notifications/deliveries` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Notification Operator | notifications.deliveries.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Only domain-authorized source references; no encrypted destination, rendered body, device tokens or provider secret. queued/sent/delivered are distinct states.

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
| channel | string | Optional | No | None | enum=["sms", "email", "push"] | Optional allowlisted filter; does not widen authenticated scope. |
| status | string | Optional | No | None | enum=["queued", "scheduled", "processing", "sent", "delivered", "failed", "cancelled"]; minLength=1; maxLength=16 | notification.messages.status; character varying(16). |


Only declared query fields are accepted. Sorting is fixed: `created_at DESC, id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `NotificationListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `messages` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `messages[].messageId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | notification.messages.id; uuid. |
| `messages[].channel` | string | Required | No | None (not silently populated) | enum=["email", "sms", "whatsapp", "push", "in_app"]; minLength=1; maxLength=16 | notification.messages.channel; character varying(16). |
| `messages[].notificationType` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | notification.messages.notification_type; character varying(64). |
| `messages[].status` | string | Required | No | None (not silently populated) | enum=["queued", "scheduled", "processing", "sent", "delivered", "failed", "cancelled"]; minLength=1; maxLength=16 | notification.messages.status; character varying(16). |
| `messages[].attemptCount` | integer | Required | No | None (not silently populated) | minimum=0 | notification.messages.attempt_count; integer. |
| `messages[].sentAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | notification.messages.sent_at; timestamp with time zone. |
| `messages[].deliveredAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | notification.messages.delivered_at; timestamp with time zone. |
| `messages[].failedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | notification.messages.failed_at; timestamp with time zone. |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "messageId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "channel": "sms",
        "notificationType": "order_status",
        "status": "queued",
        "attemptCount": 1,
        "sentAt": null,
        "deliveredAt": null,
        "failedAt": null
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-095. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks notifications.deliveries.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-095 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`notification.messages`](../../04-Database/Tables/notification/messages.md) | Read | `attempt_count`, `channel`, `delivered_at`, `expires_at`, `failed_at`, `id`, `notification_type`, `row_version`, `sent_at`, `status`, `user_id` | Notifications projection / scoped joins; reading does not grant writes. |
| [`notification.message_attempts`](../../04-Database/Tables/notification/message_attempts.md) | Read | `id`, `message_id`, `status` | Notifications projection / scoped joins; reading does not grant writes. |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.messages[].messageId | notification.messages.id |
| data.messages[].channel | notification.messages.channel |
| data.messages[].notificationType | notification.messages.notification_type |
| data.messages[].status | notification.messages.status |
| data.messages[].attemptCount | notification.messages.attempt_count |
| data.messages[].sentAt | notification.messages.sent_at |
| data.messages[].deliveredAt | notification.messages.delivered_at |
| data.messages[].failedAt | notification.messages.failed_at |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Only domain-authorized source references; no encrypted destination, rendered body, device tokens or provider secret. queued/sent/delivered are distinct states. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; created_at DESC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Provider delay is not message delivery; unknown foreign source is hidden. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-095-HAPPY` | Valid Notification Operator context and documented fixture for read redacted message delivery outcomes for authorized operations. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-095-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-095-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-095-SCOPE` | Use another customer/site/patient/task reference or remove notifications.deliveries.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-095-RULE` | Only domain-authorized source references; no encrypted destination, rendered body, device tokens or provider secret. queued/sent/delivered are distinct states. | Provider delay is not message delivery; unknown foreign source is hidden. |
| `CT-API-095-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-095-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-095-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-095-RECOVERY` | Dependency timeout during read redacted message delivery outcomes for authorized operations. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-NOT-02-OK`, `TC-NOT-02-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-096 — POST `/v1/rider/push-tokens`

**Register or rotate the rider’s own push delivery endpoint.**

| Property | Proposed contract |
| --- | --- |
| API name | Register or rotate the rider’s own push delivery endpoint |
| Version / owner | v1 / Notifications |
| Consumer | Rider |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `NOT-03`; [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/rider/push-tokens` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Rider | notifications.devices.manage.own (Proposed grant code) |


Authenticate the rider identity and bind device/token registration to that subject’s own device endpoint. An active shift or delivery assignment is not required to register push delivery before work starts. Do not transfer another user’s endpoint without approved rebind proof.

User derives from rider JWT; upsert own device/provider identity, encrypt token and never echo it. A token associated with another user must not silently transfer without reviewed device rebind proof.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-096_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `PushTokenRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `deviceId` | string | Required | No | None (not silently populated) | minLength=1; maxLength=255 | notification.device_endpoints.device_id; character varying(255). |
| `token` | string | Required | No | None (not silently populated) | minLength=1; maxLength=4096 | Write-only provider token; encrypt at rest and retain keyed hash for deduplication. |
| `platform` | string | Required | No | None (not silently populated) | enum=["android"] | Public DTO value from notification.device_endpoints.platform. Ownership and current-state checks apply before use. |
| `provider` | string | Required | No | None (not silently populated) | enum=["fcm"] | Proposed provider requires D-014/D-016 validation. |
| `locale` | string | Optional | No | None (not silently populated) | minLength=1; maxLength=16 | Public DTO value from notification.device_endpoints.locale. Ownership and current-state checks apply before use. |
| `timezone` | string | Optional | No | None (not silently populated) | minLength=1; maxLength=64 | Public DTO value from notification.device_endpoints.timezone. Ownership and current-state checks apply before use. |


```json
{
  "deviceId": "device id",
  "token": "synthetic-fcm-token-7m3K9r2P6x4V8q1L",
  "platform": "android",
  "provider": "fcm",
  "locale": "en-IN",
  "timezone": "Asia/Kolkata"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `PushEndpointData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `endpointId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | notification.device_endpoints.id; uuid. |
| `deviceId` | string | Required | No | None (not silently populated) | minLength=1; maxLength=255 | notification.device_endpoints.device_id; character varying(255). |
| `platform` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | notification.device_endpoints.platform; character varying(32). |
| `provider` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | notification.device_endpoints.provider; character varying(64). |
| `enabled` | boolean | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | notification.device_endpoints.enabled; boolean. |
| `lastSeenAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | notification.device_endpoints.last_seen_at; timestamp with time zone. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "endpointId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "deviceId": "device id",
    "platform": "platform",
    "provider": "cashfree",
    "enabled": true,
    "lastSeenAt": null
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-096. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks notifications.devices.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for register or rotate the rider’s own push delivery endpoint. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | User derives from rider JWT; upsert own device/provider identity, encrypt token and never echo it. A token associated with another user must not silently transfer without reviewed device rebind proof. | No unauthorized/partial domain effect; redact sensitive context. | Token-provider mismatch is 422; invalid tokens disable delivery endpoint after trusted provider feedback, not the rider identity. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Token-provider mismatch is 422; invalid tokens disable delivery endpoint after trusted provider feedback, not the rider identity. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-096 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`notification.device_endpoints`](../../04-Database/Tables/notification/device_endpoints.md) | Read | `device_id`, `enabled`, `id`, `is_deleted`, `last_seen_at`, `locale`, `platform`, `provider`, `row_version`, `timezone`, `user_id` | Notifications projection / scoped joins; reading does not grant writes. |
| [`notification.device_endpoints`](../../04-Database/Tables/notification/device_endpoints.md) | Create/update evidence | `user_id`, `device_id`, `platform`, `provider`, `token_encrypted`, `token_hash`, `enabled`, `invalidated_at`, `last_seen_at`, `locale`, `timezone` | Notifications owns these writes; Notifications must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.deviceId | notification.device_endpoints.device_id |
| request.token | Write-only device token encrypted/hashed into notification.device_endpoints token_encrypted/token_hash. |
| request.platform | notification.device_endpoints.platform |
| request.provider | notification.device_endpoints.provider |
| request.locale | notification.device_endpoints.locale |
| request.timezone | notification.device_endpoints.timezone |
| data.endpointId | notification.device_endpoints.id |
| data.deviceId | notification.device_endpoints.device_id |
| data.platform | notification.device_endpoints.platform |
| data.provider | notification.device_endpoints.provider |
| data.enabled | notification.device_endpoints.enabled |
| data.lastSeenAt | notification.device_endpoints.last_seen_at |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | User derives from rider JWT; upsert own device/provider identity, encrypt token and never echo it. A token associated with another user must not silently transfer without reviewed device rebind proof. |
| Idempotency | Required key: scope actor + API-096 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Token-provider mismatch is 422; invalid tokens disable delivery endpoint after trusted provider feedback, not the rider identity. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-096-HAPPY` | Valid Rider context and documented fixture for register or rotate the rider’s own push delivery endpoint. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-096-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-096-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-096-SCOPE` | Use another customer/site/patient/task reference or remove notifications.devices.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-096-RULE` | User derives from rider JWT; upsert own device/provider identity, encrypt token and never echo it. A token associated with another user must not silently transfer without reviewed device rebind proof. | Token-provider mismatch is 422; invalid tokens disable delivery endpoint after trusted provider feedback, not the rider identity. |
| `CT-API-096-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-096-CONCURRENCY` | Race two register or rotate the rider’s own push delivery endpoint. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-096-STATE` | Apply command after Token-provider mismatch is 422; invalid tokens disable delivery endpoint after trusted provider feedback, not the rider identity. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-096-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Token-provider mismatch is 422; invalid tokens disable delivery endpoint after trusted provider feedback, not the rider identity. |

Existing feature assertions: `TC-NOT-03-OK`, `TC-NOT-03-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-097 — GET `/v1/admin/notifications/alerts`

**Read derived notification failures and backlog alerts.**

| Property | Proposed contract |
| --- | --- |
| API name | Read derived notification failures and backlog alerts |
| Version / owner | v1 / Notifications |
| Consumer | Notification Operator |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `NOT-04`; [WF-012](../../06-Workflows/WF-012-Report-Export-and-Audit.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/notifications/alerts` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Notification Operator | notifications.alerts.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Derived from status, retry budget and approved backlog age threshold; no alert table implied. Redact destination/content and scope by authorized source event.

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
| channel | string | Optional | No | None | enum=["sms", "email", "push"] | Optional allowlisted filter; does not widen authenticated scope. |


Only declared query fields are accepted. Sorting is fixed: `available_at ASC, id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `NotificationAlertListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `alerts` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `alerts[].messageId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from notification.message_attempts.message_id. Ownership and current-state checks apply before use. |
| `alerts[].alertType` | string | Required | No | None (not silently populated) | enum=["permanently_failed", "retry_exhausted", "backlog"] | Derived operational signal; no persisted alert entity. |
| `alerts[].channel` | string | Required | No | None (not silently populated) | enum=["email", "sms", "whatsapp", "push", "in_app"]; minLength=1; maxLength=16 | notification.messages.channel; character varying(16). |
| `alerts[].attemptCount` | integer | Required | No | None (not silently populated) | minimum=0 | notification.messages.attempt_count; integer. |
| `alerts[].status` | string | Required | No | None (not silently populated) | enum=["queued", "scheduled", "processing", "sent", "delivered", "failed", "cancelled"]; minLength=1; maxLength=16 | notification.messages.status; character varying(16). |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "messageId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "alertType": "permanently_failed",
        "channel": "sms",
        "attemptCount": 1,
        "status": "queued"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-097. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks notifications.alerts.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-097 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`notification.messages`](../../04-Database/Tables/notification/messages.md) | Read | `attempt_count`, `channel`, `expires_at`, `id`, `row_version`, `status`, `user_id` | Notifications projection / scoped joins; reading does not grant writes. |
| [`notification.message_attempts`](../../04-Database/Tables/notification/message_attempts.md) | Read | `id`, `message_id`, `status` | Notifications projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.alerts[].messageId | notification.message_attempts.message_id |
| data.alerts[].alertType | Derived operational signal; no persisted alert entity. |
| data.alerts[].channel | notification.messages.channel |
| data.alerts[].attemptCount | notification.messages.attempt_count |
| data.alerts[].status | notification.messages.status |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Derived from status, retry budget and approved backlog age threshold; no alert table implied. Redact destination/content and scope by authorized source event. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; available_at ASC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Missing alert configuration is explicit unavailability, not zero alerts; repairs requeue messages only. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-097-HAPPY` | Valid Notification Operator context and documented fixture for read derived notification failures and backlog alerts. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-097-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-097-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-097-SCOPE` | Use another customer/site/patient/task reference or remove notifications.alerts.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-097-RULE` | Derived from status, retry budget and approved backlog age threshold; no alert table implied. Redact destination/content and scope by authorized source event. | Missing alert configuration is explicit unavailability, not zero alerts; repairs requeue messages only. |
| `CT-API-097-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-097-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-097-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-097-RECOVERY` | Dependency timeout during read derived notification failures and backlog alerts. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-NOT-04-OK`, `TC-NOT-04-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
