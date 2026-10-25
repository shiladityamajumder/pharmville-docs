# Finance Payments API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](../../05-APIs/API-Contract-Coverage.md) · [OpenAPI 3.1](../../05-APIs/openapi.yaml) · [decisions](../../05-APIs/Planning-Decisions.md) · [DTO conventions](../../05-APIs/API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="finance-payments-api-contracts"></a>
<a id="api-075--post-v1paymentsintents"></a>
<a id="caller-permissions-and-dependencies"></a>
<a id="http-request-contract"></a>
<a id="success-response-illustrative"></a>
<a id="errors-concurrency-and-failure-recovery"></a>
<a id="required-verification"></a>
<a id="api-076--post-v1webhookscashfree"></a>
<a id="provider-authentication-and-input"></a>
<a id="commit-acknowledgement-and-recovery"></a>
<a id="data-and-verification"></a>
<a id="api-077--get-v1adminfinancepayments"></a>
<a id="caller-permissions-and-dependencies-1"></a>
<a id="http-request-contract-1"></a>
<a id="success-response-illustrative-1"></a>
<a id="errors-concurrency-and-failure-recovery-1"></a>
<a id="required-verification-1"></a>
<a id="api-078--post-v1adminfinancerefunds"></a>
<a id="caller-permissions-and-dependencies-2"></a>
<a id="http-request-contract-2"></a>
<a id="success-response-illustrative-2"></a>
<a id="errors-concurrency-and-failure-recovery-2"></a>
<a id="required-verification-2"></a>
<a id="api-079--get-v1adminfinancesettlements"></a>
<a id="caller-permissions-and-dependencies-3"></a>
<a id="http-request-contract-3"></a>
<a id="success-response-illustrative-3"></a>
<a id="errors-concurrency-and-failure-recovery-3"></a>
<a id="required-verification-3"></a>
<a id="api-080--post-v1adminfinancecod-reconciliation"></a>
<a id="caller-permissions-and-dependencies-4"></a>
<a id="http-request-contract-4"></a>
<a id="success-response-illustrative-4"></a>
<a id="errors-concurrency-and-failure-recovery-4"></a>
<a id="required-verification-4"></a>
<a id="api-081--get-v1adminfinanceinvoicesorder_id"></a>
<a id="caller-permissions-and-dependencies-5"></a>
<a id="http-request-contract-5"></a>
<a id="success-response-illustrative-5"></a>
<a id="errors-concurrency-and-failure-recovery-5"></a>
<a id="required-verification-5"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-075 | `POST /v1/payments/intents` | Persist one online payment initiation for an accepted eligible order. | Incomplete — D-004/D-016: exact continuation DTO, capture sequence and provider-supported replay contract require evidence. |
| API-076 | `POST /v1/webhooks/cashfree` | Authenticate and durably deduplicate authoritative payment provider evidence. | Incomplete — D-016: signature header names, wire schema, canonicalization and acknowledgment status are unknown. Conceptual DTO is explicitly not a provider wire contract. |
| API-077 | `GET /v1/admin/finance/payments` | Read scoped payment intents with trusted current statuses. | Complete proposed |
| API-078 | `POST /v1/admin/finance/refunds` | Create a bounded approved refund instruction against an original payment transaction. | Complete proposed |
| API-079 | `GET /v1/admin/finance/settlements` | Read provider settlement and reconciliation evidence for Finance. | Incomplete — D-008/D-016: settle-vs-reconcile dataset definition and provider report layout need Finance approval. |
| API-080 | `POST /v1/admin/finance/cod-reconciliation` | Open COD reconciliation from actual collection and handover evidence. | Incomplete — D-007/D-008: exact handover/deposit evidence and independent approval model are missing. |
| API-081 | `GET /v1/admin/finance/invoices/{order_id}` | Read or download an issued invoice through scoped Finance authorization. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| FIN-01 | Payment records from Cashfree webhooks and COD collections | API-075, API-076, API-077 |
| FIN-02 | GST invoice per order, from the right GSTIN | API-081 |
| FIN-03 | Automatic refunds; manual refunds need approval above a set amount | API-078 |
| FIN-04 | COD refunds by bank transfer or UPI | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| FIN-05 | Daily reconciliation: Cashfree settlements vs orders | API-079 |
| FIN-06 | COD reconciliation: collected vs deposited | API-080 |
| FIN-07 | Credit notes for refunds and returns | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |

## API-075 — POST `/v1/payments/intents`

**Persist one online payment initiation for an accepted eligible order.**

| Property | Proposed contract |
| --- | --- |
| API name | Persist one online payment initiation for an accepted eligible order |
| Version / owner | v1 / Finance_Payments |
| Consumer | Customer |
| Status | Documentation Incomplete; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `CHK-03`, `FIN-01`; [WF-005](../../06-Workflows/WF-005-Payment-and-Confirmation.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/payments/intents` (placeholder host from existing OpenAPI; no deployment asserted) |


**Remaining contract gap:** D-004/D-016: exact continuation DTO, capture sequence and provider-supported replay contract require evidence.

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | payments.initiate.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Server derives exact accepted amount/currency; require current P approval where applicable and active stock holds. Provider IO occurs after durable intent/attempt commit. A timeout is pending/unknown, never a reason to charge again.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-075_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `PaymentIntentRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.orders.id. Ownership and current-state checks apply before use. |
| `orderRevisionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.order_revisions.id. Ownership and current-state checks apply before use. |
| `expectedOrderVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Expected current row_version; compare atomically. |
| `method` | string | Required | No | None (not silently populated) | enum=["online"] | Gateway method details selected only through reviewed provider continuation. |


```json
{
  "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "orderRevisionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "expectedOrderVersion": 4,
  "method": "online"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **202**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `PaymentIntentData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `paymentIntent` | object | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Nested typed projection. |
| `paymentIntent.paymentIntentId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | payment.payment_intents.id; uuid. |
| `paymentIntent.orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | payment.payment_intents.order_id; uuid. |
| `paymentIntent.orderRevisionId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | payment.payment_intents.order_revision_id; uuid. |
| `paymentIntent.amount` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | payment.payment_intents.amount; numeric(16,2). |
| `paymentIntent.currency` | string | Required | No | None (not silently populated) | minLength=1; maxLength=3 | payment.payment_intents.currency; character varying(3). |
| `paymentIntent.method` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | payment.payment_intents.method; character varying(32). |
| `paymentIntent.status` | string | Required | No | None (not silently populated) | enum=["created", "requires_action", "authorized", "captured", "partially_refunded", "refunded", "failed", "cancelled", "expired"]; minLength=1; maxLength=18 | payment.payment_intents.status; character varying(18). |
| `paymentIntent.rowVersion` | integer | Required | No | None (not silently populated) | minimum=0 | payment.payment_intents.row_version; bigint. |
| `nextAction` | string | Required | No | None (not silently populated) | enum=["await_provider_session"] | No invented provider token or redirect fields. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "paymentIntent": {
      "paymentIntentId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "orderRevisionId": null,
      "amount": "26.25",
      "currency": "INR",
      "method": "method",
      "status": "created",
      "rowVersion": 1
    },
    "nextAction": "await_provider_session"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-075. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks payments.initiate.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for persist one online payment initiation for an accepted eligible order. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Server derives exact accepted amount/currency; require current P approval where applicable and active stock holds. Provider IO occurs after durable intent/attempt commit. A timeout is pending/unknown, never a reason to charge again. | No unauthorized/partial domain effect; redact sensitive context. | Browser redirects/screenshots do not mark paid. Late success after hold expiry goes to Finance/Operations reconciliation. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current persist one online payment initiation for an accepted eligible order. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Browser redirects/screenshots do not mark paid. Late success after hold expiry goes to Finance/Operations reconciliation. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-075 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | Read | `id`, `order_id`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | Read | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | Read | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `review_id`, `row_version` | Pharmacist_Review projection / scoped joins; reading does not grant writes. |
| [`warehouse.stock_reservations`](../../04-Database/Tables/warehouse/stock_reservations.md) | Read | `expires_at`, `id`, `order_id`, `order_item_id`, `order_revision_id`, `row_version`, `status`, `warehouse_id` | Inventory projection / scoped joins; reading does not grant writes. |
| [`payment.provider_accounts`](../../04-Database/Tables/payment/provider_accounts.md) | Read | `id`, `is_deleted`, `row_version`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`payment.payment_intents`](../../04-Database/Tables/payment/payment_intents.md) | Read | `amount`, `currency`, `expires_at`, `id`, `method`, `order_id`, `order_revision_id`, `provider_account_id`, `row_version`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`payment.payment_intents`](../../04-Database/Tables/payment/payment_intents.md) | Create/update evidence | `order_id`, `order_revision_id`, `amount`, `currency`, `method`, `provider`, `provider_account_id`, `idempotency_key`, `status` | Finance_Payments owns these writes; Finance_Payments must invoke that narrow owner command. |
| [`payment.payment_attempts`](../../04-Database/Tables/payment/payment_attempts.md) | Create/update evidence | `payment_intent_id`, `attempt_number`, `amount`, `initiated_at`, `status` | Finance_Payments owns these writes; Finance_Payments must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.orderId | commerce.orders.id |
| request.orderRevisionId | commerce.order_revisions.id |
| request.expectedOrderVersion | commerce.orders.row_version |
| request.method | payment.payment_intents.method |
| data.paymentIntent.paymentIntentId | payment.payment_intents.id |
| data.paymentIntent.orderId | payment.payment_intents.order_id |
| data.paymentIntent.orderRevisionId | payment.payment_intents.order_revision_id |
| data.paymentIntent.amount | payment.payment_intents.amount |
| data.paymentIntent.currency | payment.payment_intents.currency |
| data.paymentIntent.method | payment.payment_intents.method |
| data.paymentIntent.status | payment.payment_intents.status |
| data.paymentIntent.rowVersion | payment.payment_intents.row_version |
| data.nextAction | API-only workflow projection from current domain states; no universal database enum. |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`clinical.review_reason_codes`](../../04-Database/Tables/clinical/review_reason_codes.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`warehouse.bins`](../../04-Database/Tables/warehouse/bins.md), [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Server derives exact accepted amount/currency; require current P approval where applicable and active stock holds. Provider IO occurs after durable intent/attempt commit. A timeout is pending/unknown, never a reason to charge again. |
| Idempotency | Required key: scope actor + API-075 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Browser redirects/screenshots do not mark paid. Late success after hold expiry goes to Finance/Operations reconciliation. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-075-HAPPY` | Valid Customer context and documented fixture for persist one online payment initiation for an accepted eligible order. | HTTP 202; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-075-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-075-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-075-SCOPE` | Use another customer/site/patient/task reference or remove payments.initiate.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-075-RULE` | Server derives exact accepted amount/currency; require current P approval where applicable and active stock holds. Provider IO occurs after durable intent/attempt commit. A timeout is pending/unknown, never a reason to charge again. | Browser redirects/screenshots do not mark paid. Late success after hold expiry goes to Finance/Operations reconciliation. |
| `CT-API-075-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-075-CONCURRENCY` | Race two persist one online payment initiation for an accepted eligible order. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-075-STATE` | Apply command after Browser redirects/screenshots do not mark paid. Late success after hold expiry goes to Finance/Operations reconciliation. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-075-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Browser redirects/screenshots do not mark paid. Late success after hold expiry goes to Finance/Operations reconciliation. |

Existing feature assertions: `TC-CHK-03-OK`, `TC-CHK-03-DENY`, `TC-CHK-03-01`, `TC-FIN-01-OK`, `TC-FIN-01-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-076 — POST `/v1/webhooks/cashfree`

**Authenticate and durably deduplicate authoritative payment provider evidence.**

| Property | Proposed contract |
| --- | --- |
| API name | Authenticate and durably deduplicate authoritative payment provider evidence |
| Version / owner | v1 / Finance_Payments |
| Consumer | Internal provider adapter |
| Status | Documentation Incomplete; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `FIN-01`, `CHK-03`; [WF-005](../../06-Workflows/WF-005-Payment-and-Confirmation.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/webhooks/cashfree` (placeholder host from existing OpenAPI; no deployment asserted) |


**Remaining contract gap:** D-016: signature header names, wire schema, canonicalization and acknowledgment status are unknown. Conceptual DTO is explicitly not a provider wire contract.

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | Provider Signature | Internal provider adapter | Valid provider signature + exact event/payment correlation (Proposed grant code) |


Authenticate only the reviewed provider raw-body signature/timestamp contract, with no customer bearer or staff membership. Authorize the signing provider account for the referenced payment/order/revision and exact amount/currency; signature validity alone cannot select another account’s payment. Exact wire evidence remains D-016.

Provider signature over exact raw bytes, timestamp/replay validation and approved credentials; no bearer. Correlate amount/currency/order/revision, commit trusted evidence before agreed acknowledgment; reconcile contradictory/out-of-order results.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Not Applicable | Omit | Pre-login/provider trust path; no bearer. |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Not Applicable | Omit | Provider event identity deduplicates. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Required — unresolved D-016 | Names/values not invented | Exact raw-body signature/timestamp contract must be validated. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

Not Applicable. No parameters in this location.


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `ProviderEventUnresolved`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `providerEventId` | string | Required | No | None (not silently populated) | minLength=1; maxLength=255 | Conceptual event identity only; exact provider key/raw payload is not specified. |


```json
{
  "providerEventId": "sandbox-event-001"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `ProviderAckUnresolved`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `received` | boolean | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Conceptual acknowledgment only; exact provider status/body blocked. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "received": true
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked Provider Signature credential for API-076. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Valid signing provider account is not authorized for the referenced payment/order/revision. | No trusted effect or hidden-resource disclosure. | Correct the reviewed provider/workload scope. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for authenticate and durably deduplicate authoritative payment provider evidence. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Provider signature over exact raw bytes, timestamp/replay validation and approved credentials; no bearer. Correlate amount/currency/order/revision, commit trusted evidence before agreed acknowledgment; reconcile contradictory/out-of-order results. | No unauthorized/partial domain effect; redact sensitive context. | Invalid signature creates no trusted financial effect. Durable duplicate provider event creates no second transaction. Unknown outcome is reconciled. |
| 409 | `INVALID_STATE_TRANSITION` | Invalid signature creates no trusted financial effect. Durable duplicate provider event creates no second transaction. Unknown outcome is reconciled. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-076 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`payment.payment_webhooks`](../../04-Database/Tables/payment/payment_webhooks.md) | Read | `id`, `provider_event_id`, `row_version` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`payment.payment_intents`](../../04-Database/Tables/payment/payment_intents.md) | Read | `expires_at`, `id`, `order_id`, `order_revision_id`, `row_version`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`payment.payment_transactions`](../../04-Database/Tables/payment/payment_transactions.md) | Read | `id`, `payment_attempt_id`, `payment_intent_id`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `internal_id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | Read | `id`, `order_id`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`payment.payment_webhooks`](../../04-Database/Tables/payment/payment_webhooks.md) | Create/update evidence | `provider`, `provider_event_id`, `signature_valid`, `payload`, `processing_status`, `processed_at` | Finance_Payments owns these writes; Finance_Payments must invoke that narrow owner command. |
| [`payment.payment_transactions`](../../04-Database/Tables/payment/payment_transactions.md) | Create/update evidence | `payment_intent_id`, `payment_attempt_id`, `provider`, `provider_transaction_id`, `transaction_type`, `amount`, `status`, `processed_at`, `provider_response` | Finance_Payments owns these writes; Finance_Payments must invoke that narrow owner command. |
| [`payment.payment_intents`](../../04-Database/Tables/payment/payment_intents.md) | Create/update evidence | `status` | Finance_Payments owns these writes; Finance_Payments must invoke that narrow owner command. |
| [`payment.payment_attempts`](../../04-Database/Tables/payment/payment_attempts.md) | Create/update evidence | `status`, `completed_at` | Finance_Payments owns these writes; Finance_Payments must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.providerEventId | payment.payment_webhooks.provider_event_id |
| data.received | Conceptual provider acknowledgment; D-016 wire contract unresolved. |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Provider signature over exact raw bytes, timestamp/replay validation and approved credentials; no bearer. Correlate amount/currency/order/revision, commit trusted evidence before agreed acknowledgment; reconcile contradictory/out-of-order results. |
| Idempotency | Deduplicate verified provider event identity; wire details incomplete under D-016. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | Provider-agreed ingress budget and retries unresolved D-016; never silently drop a verified payment event. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Invalid signature creates no trusted financial effect. Durable duplicate provider event creates no second transaction. Unknown outcome is reconciled. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-076-HAPPY` | Valid Internal provider adapter context and documented fixture for authenticate and durably deduplicate authoritative payment provider evidence. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-076-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-076-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-076-SCOPE` | Use another customer/site/patient/task reference or remove Valid provider signature + exact event/payment correlation. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-076-RULE` | Provider signature over exact raw bytes, timestamp/replay validation and approved credentials; no bearer. Correlate amount/currency/order/revision, commit trusted evidence before agreed acknowledgment; reconcile contradictory/out-of-order results. | Invalid signature creates no trusted financial effect. Durable duplicate provider event creates no second transaction. Unknown outcome is reconciled. |
| `CT-API-076-DUPLICATE` | Replay consumed/rotated proof. | No second session/effect; honor identity/provider replay policy. |
| `CT-API-076-CONCURRENCY` | Race two authenticate and durably deduplicate authoritative payment provider evidence. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-076-STATE` | Apply command after Invalid signature creates no trusted financial effect. Durable duplicate provider event creates no second transaction. Unknown outcome is reconciled. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-076-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Invalid signature creates no trusted financial effect. Durable duplicate provider event creates no second transaction. Unknown outcome is reconciled. |

Existing feature assertions: `TC-FIN-01-OK`, `TC-FIN-01-DENY`, `TC-CHK-03-OK`, `TC-CHK-03-DENY`, `TC-CHK-03-01`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-077 — GET `/v1/admin/finance/payments`

**Read scoped payment intents with trusted current statuses.**

| Property | Proposed contract |
| --- | --- |
| API name | Read scoped payment intents with trusted current statuses |
| Version / owner | v1 / Finance_Payments |
| Consumer | Finance Officer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `FIN-01`; [WF-005](../../06-Workflows/WF-005-Payment-and-Confirmation.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/finance/payments` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Finance Officer | finance.payments.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Finance scope through authorized order/site; no raw provider_response, card data or continuation tokens.

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
| orderId | string (uuid) | Optional | No | None | format="uuid" | Optional allowlisted filter; does not widen authenticated scope. |
| status | string | Optional | No | None | enum=["created", "requires_action", "authorized", "captured", "partially_refunded", "refunded", "failed", "cancelled", "expired"]; minLength=1; maxLength=18 | payment.payment_intents.status; character varying(18). |


Only declared query fields are accepted. Sorting is fixed: `created_at DESC, id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `PaymentListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `payments` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `payments[].paymentIntentId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | payment.payment_intents.id; uuid. |
| `payments[].orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | payment.payment_intents.order_id; uuid. |
| `payments[].orderRevisionId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | payment.payment_intents.order_revision_id; uuid. |
| `payments[].amount` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | payment.payment_intents.amount; numeric(16,2). |
| `payments[].currency` | string | Required | No | None (not silently populated) | minLength=1; maxLength=3 | payment.payment_intents.currency; character varying(3). |
| `payments[].method` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | payment.payment_intents.method; character varying(32). |
| `payments[].status` | string | Required | No | None (not silently populated) | enum=["created", "requires_action", "authorized", "captured", "partially_refunded", "refunded", "failed", "cancelled", "expired"]; minLength=1; maxLength=18 | payment.payment_intents.status; character varying(18). |
| `payments[].rowVersion` | integer | Required | No | None (not silently populated) | minimum=0 | payment.payment_intents.row_version; bigint. |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "paymentIntentId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "orderRevisionId": null,
        "amount": "26.25",
        "currency": "INR",
        "method": "method",
        "status": "created",
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-077. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks finance.payments.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-077 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`payment.payment_intents`](../../04-Database/Tables/payment/payment_intents.md) | Read | `amount`, `currency`, `expires_at`, `id`, `method`, `order_id`, `order_revision_id`, `row_version`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`payment.payment_transactions`](../../04-Database/Tables/payment/payment_transactions.md) | Read | `id`, `payment_intent_id`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.payments[].paymentIntentId | payment.payment_intents.id |
| data.payments[].orderId | payment.payment_intents.order_id |
| data.payments[].orderRevisionId | payment.payment_intents.order_revision_id |
| data.payments[].amount | payment.payment_intents.amount |
| data.payments[].currency | payment.payment_intents.currency |
| data.payments[].method | payment.payment_intents.method |
| data.payments[].status | payment.payment_intents.status |
| data.payments[].rowVersion | payment.payment_intents.row_version |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Finance scope through authorized order/site; no raw provider_response, card data or continuation tokens. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; created_at DESC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Pending/unknown remains visible; an absent transaction never means paid. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-077-HAPPY` | Valid Finance Officer context and documented fixture for read scoped payment intents with trusted current statuses. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-077-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-077-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-077-SCOPE` | Use another customer/site/patient/task reference or remove finance.payments.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-077-RULE` | Finance scope through authorized order/site; no raw provider_response, card data or continuation tokens. | Pending/unknown remains visible; an absent transaction never means paid. |
| `CT-API-077-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-077-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-077-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-077-RECOVERY` | Dependency timeout during read scoped payment intents with trusted current statuses. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-FIN-01-OK`, `TC-FIN-01-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-078 — POST `/v1/admin/finance/refunds`

**Create a bounded approved refund instruction against an original payment transaction.**

| Property | Proposed contract |
| --- | --- |
| API name | Create a bounded approved refund instruction against an original payment transaction |
| Version / owner | v1 / Finance_Payments |
| Consumer | Authorized Finance Refund Officer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `FIN-03`; [WF-010](../../06-Workflows/WF-010-Cancellation-Return-and-Refund.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/finance/refunds` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Authorized Finance Refund Officer | finance.refunds.instruct (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Specialized Finance approval, expected intent version and active reason required. Lock original payment and all pending/succeeded refunds; total reserved refundable amount cannot exceed trusted captured value. Currency derives from linked intent, not refund row. No invented approval column or COD destination.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-078_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `RefundInstructionRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `paymentTransactionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from payment.payment_transactions.id. Ownership and current-state checks apply before use. |
| `orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.orders.id. Ownership and current-state checks apply before use. |
| `orderRevisionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from commerce.order_revisions.id. Ownership and current-state checks apply before use. |
| `amount` | string | Required | No | None (not silently populated) | pattern="^[0-9]+(\\.[0-9]{1,2})?$" | Positive; payment.refunds.amount numeric(16,2). Currency is derived through the linked payment intent. |
| `reasonCode` | string | Required | No | None (not silently populated) | minLength=1 | Public DTO value from payment.refunds.reason_code. Ownership and current-state checks apply before use. |
| `expectedPaymentIntentVersion` | integer | Required | No | None (not silently populated) | minimum=1 | payment.payment_intents.row_version for the transaction-linked intent. |


```json
{
  "paymentTransactionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "orderRevisionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "amount": "12.50",
  "reasonCode": "CUSTOMER_REQUEST",
  "expectedPaymentIntentVersion": 1
}
```

File upload: **Not Applicable**.

### Success response

HTTP **202**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `RefundInstructionData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `refundId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from payment.refunds.id. Ownership and current-state checks apply before use. |
| `paymentTransactionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from payment.payment_transactions.id. Ownership and current-state checks apply before use. |
| `amount` | string | Required | No | None (not silently populated) | pattern="^[0-9]+(\\.[0-9]{1,2})?$" | Public DTO value from payment.refunds.amount. Ownership and current-state checks apply before use. |
| `currency` | string | Required | No | None (not silently populated) | pattern="^[A-Z]{3}$" | Derived from linked payment intent; not stored on payment.refunds. |
| `status` | string | Required | No | None (not silently populated) | enum=["requested", "approved", "processing", "succeeded", "failed", "cancelled"] | payment.refunds.status values. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "refundId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "paymentTransactionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "amount": "12.50",
    "currency": "INR",
    "status": "requested"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-078. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks finance.refunds.instruct or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for create a bounded approved refund instruction against an original payment transaction. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Specialized Finance approval, expected intent version and active reason required. Lock original payment and all pending/succeeded refunds; total reserved refundable amount cannot exceed trusted captured value. Currency derives from linked intent, not refund row. No invented approval column or COD destination. | No unauthorized/partial domain effect; redact sensitive context. | Concurrent/duplicate refund has one instruction; uncertain provider submission stays processing/reconciliation and continues to reserve refundable value. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current create a bounded approved refund instruction against an original payment transaction. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Concurrent/duplicate refund has one instruction; uncertain provider submission stays processing/reconciliation and continues to reserve refundable value. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-078 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`payment.payment_transactions`](../../04-Database/Tables/payment/payment_transactions.md) | Read | `id`, `payment_intent_id`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`payment.payment_intents`](../../04-Database/Tables/payment/payment_intents.md) | Read | `currency`, `expires_at`, `id`, `order_id`, `order_revision_id`, `row_version`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`payment.refunds`](../../04-Database/Tables/payment/refunds.md) | Read | `amount`, `id`, `order_id`, `order_revision_id`, `payment_transaction_id`, `reason_code`, `reason_code_id`, `row_version`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`payment.refund_allocations`](../../04-Database/Tables/payment/refund_allocations.md) | Read | `id`, `order_item_id`, `order_revision_id`, `reason_code`, `reason_code_id`, `refund_id` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`payment.refund_reason_codes`](../../04-Database/Tables/payment/refund_reason_codes.md) | Read | `id`, `is_active`, `row_version` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `internal_id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | Read | `id`, `order_id`, `status` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`payment.refunds`](../../04-Database/Tables/payment/refunds.md) | Create/update evidence | `payment_transaction_id`, `order_id`, `order_revision_id`, `refund_number`, `amount`, `reason_code`, `status`, `idempotency_key` | Finance_Payments owns these writes; Finance_Payments must invoke that narrow owner command. |
| [`payment.refund_allocations`](../../04-Database/Tables/payment/refund_allocations.md) | Create/update evidence | `refund_id`, `order_item_id`, `amount` | Finance_Payments owns these writes; Finance_Payments must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.paymentTransactionId | payment.payment_transactions.id |
| request.orderId | commerce.orders.id |
| request.orderRevisionId | commerce.order_revisions.id |
| request.amount | payment.refunds.amount |
| request.reasonCode | payment.refunds.reason_code |
| request.expectedPaymentIntentVersion | payment.payment_intents.row_version |
| data.refundId | payment.refunds.id |
| data.paymentTransactionId | payment.payment_transactions.id |
| data.amount | payment.refunds.amount |
| data.currency | payment.payment_intents.currency |
| data.status | payment.refunds.status |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`payment.refund_reason_codes`](../../04-Database/Tables/payment/refund_reason_codes.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Specialized Finance approval, expected intent version and active reason required. Lock original payment and all pending/succeeded refunds; total reserved refundable amount cannot exceed trusted captured value. Currency derives from linked intent, not refund row. No invented approval column or COD destination. |
| Idempotency | Required key: scope actor + API-078 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Concurrent/duplicate refund has one instruction; uncertain provider submission stays processing/reconciliation and continues to reserve refundable value. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-078-HAPPY` | Valid Authorized Finance Refund Officer context and documented fixture for create a bounded approved refund instruction against an original payment transaction. | HTTP 202; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-078-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-078-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-078-SCOPE` | Use another customer/site/patient/task reference or remove finance.refunds.instruct. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-078-RULE` | Specialized Finance approval, expected intent version and active reason required. Lock original payment and all pending/succeeded refunds; total reserved refundable amount cannot exceed trusted captured value. Currency derives from linked intent, not refund row. No invented approval column or COD destination. | Concurrent/duplicate refund has one instruction; uncertain provider submission stays processing/reconciliation and continues to reserve refundable value. |
| `CT-API-078-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-078-CONCURRENCY` | Race two create a bounded approved refund instruction against an original payment transaction. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-078-STATE` | Apply command after Concurrent/duplicate refund has one instruction; uncertain provider submission stays processing/reconciliation and continues to reserve refundable value. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-078-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Concurrent/duplicate refund has one instruction; uncertain provider submission stays processing/reconciliation and continues to reserve refundable value. |

Existing feature assertions: `TC-FIN-03-OK`, `TC-FIN-03-DENY`, `TC-FIN-03-01`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-079 — GET `/v1/admin/finance/settlements`

**Read provider settlement and reconciliation evidence for Finance.**

| Property | Proposed contract |
| --- | --- |
| API name | Read provider settlement and reconciliation evidence for Finance |
| Version / owner | v1 / Finance_Payments |
| Consumer | Finance Reconciliation Officer |
| Status | Documentation Incomplete; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `FIN-05`; [WF-005](../../06-Workflows/WF-005-Payment-and-Confirmation.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/finance/settlements` (placeholder host from existing OpenAPI; no deployment asserted) |


**Remaining contract gap:** D-008/D-016: settle-vs-reconcile dataset definition and provider report layout need Finance approval.

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Finance Reconciliation Officer | finance.settlements.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Provider settlement must not be confused with marketplace seller settlements in finance.settlement_runs. Expose no bank secrets or raw reports.

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
| provider | string | Optional | No | None | minLength=1; maxLength=64 | Configured provider code. |


Only declared query fields are accepted. Sorting is fixed: `run_date DESC, id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `SettlementListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `runs` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `runs[].runId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | payment.reconciliation_runs.id; uuid. |
| `runs[].provider` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | payment.reconciliation_runs.provider; character varying(64). |
| `runs[].runDate` | string (date) | Required | No | None (not silently populated) | format="date" | payment.reconciliation_runs.run_date; date. |
| `runs[].status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | payment.reconciliation_runs.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |
| `runs[].completedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | payment.reconciliation_runs.completed_at; timestamp with time zone. |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "runs": [
      {
        "runId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "provider": "cashfree",
        "runDate": "2026-10-24",
        "status": "running",
        "completedAt": null
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-079. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks finance.settlements.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-079 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`payment.reconciliation_runs`](../../04-Database/Tables/payment/reconciliation_runs.md) | Read | `account_id`, `completed_at`, `id`, `provider`, `row_version`, `run_date`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`payment.reconciliation_items`](../../04-Database/Tables/payment/reconciliation_items.md) | Read | `id`, `row_version`, `run_id`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`payment.provider_accounts`](../../04-Database/Tables/payment/provider_accounts.md) | Read | `id`, `is_deleted`, `row_version`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.runs[].runId | payment.reconciliation_runs.id |
| data.runs[].provider | payment.reconciliation_runs.provider |
| data.runs[].runDate | payment.reconciliation_runs.run_date |
| data.runs[].status | payment.reconciliation_runs.status |
| data.runs[].completedAt | payment.reconciliation_runs.completed_at |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Provider settlement must not be confused with marketplace seller settlements in finance.settlement_runs. Expose no bank secrets or raw reports. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; run_date DESC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Missing provider report leaves reconciliation incomplete; no invented settled balance. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-079-HAPPY` | Valid Finance Reconciliation Officer context and documented fixture for read provider settlement and reconciliation evidence for finance. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-079-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-079-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-079-SCOPE` | Use another customer/site/patient/task reference or remove finance.settlements.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-079-RULE` | Provider settlement must not be confused with marketplace seller settlements in finance.settlement_runs. Expose no bank secrets or raw reports. | Missing provider report leaves reconciliation incomplete; no invented settled balance. |
| `CT-API-079-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-079-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-079-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-079-RECOVERY` | Dependency timeout during read provider settlement and reconciliation evidence for finance. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-FIN-05-OK`, `TC-FIN-05-DENY`, `TC-FIN-05-01`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-080 — POST `/v1/admin/finance/cod-reconciliation`

**Open COD reconciliation from actual collection and handover evidence.**

| Property | Proposed contract |
| --- | --- |
| API name | Open COD reconciliation from actual collection and handover evidence |
| Version / owner | v1 / Finance_Payments |
| Consumer | Finance Cash Reconciler |
| Status | Documentation Incomplete; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `FIN-06`; [WF-009](../../06-Workflows/WF-009-COD-Collection.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/finance/cod-reconciliation` (placeholder host from existing OpenAPI; no deployment asserted) |


**Remaining contract gap:** D-007/D-008: exact handover/deposit evidence and independent approval model are missing.

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Finance Cash Reconciler | finance.cod.reconcile (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Keep collection, deposit, remittance and settlement distinct. Compare actual evidence; differences remain exceptions requiring authorized resolution, never force-close.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-080_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `CodReconciliationRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `sourceFileId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Private verified cash evidence file. |
| `runDate` | string (date) | Required | No | None (not silently populated) | format="date" | Public DTO value from payment.reconciliation_runs.run_date. Ownership and current-state checks apply before use. |
| `collectionIds` | array<string (uuid)> | Required | No | None (not silently populated) | minItems=1; maxItems=100 | Nested typed projection. |


```json
{
  "sourceFileId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "runDate": "2026-10-24",
  "collectionIds": [
    "0192a1b2-c3d4-7e8f-9012-3456789abcde"
  ]
}
```

File upload: Not Applicable to this JSON operation. Referenced file UUIDs must resolve to owned/authorized private objects; validate size/type, complete storage metadata and clean scan before use. Never accept a caller-controlled storage path/public URL.

### Success response

HTTP **202**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `ReconciliationRunData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `runId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | payment.reconciliation_runs.id; uuid. |
| `provider` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | payment.reconciliation_runs.provider; character varying(64). |
| `runDate` | string (date) | Required | No | None (not silently populated) | format="date" | payment.reconciliation_runs.run_date; date. |
| `status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | payment.reconciliation_runs.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |
| `completedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | payment.reconciliation_runs.completed_at; timestamp with time zone. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "runId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "provider": "cashfree",
    "runDate": "2026-10-24",
    "status": "running",
    "completedAt": null
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-080. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks finance.cod.reconcile or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for open cod reconciliation from actual collection and handover evidence. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Keep collection, deposit, remittance and settlement distinct. Compare actual evidence; differences remain exceptions requiring authorized resolution, never force-close. | No unauthorized/partial domain effect; redact sensitive context. | Missing cash evidence or mismatch leaves unresolved run; no speculative deposited_at/settled_at. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Missing cash evidence or mismatch leaves unresolved run; no speculative deposited_at/settled_at. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-080 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`payment.cod_collections`](../../04-Database/Tables/payment/cod_collections.md) | Read | `id`, `order_id`, `order_revision_id`, `row_version`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`payment.reconciliation_runs`](../../04-Database/Tables/payment/reconciliation_runs.md) | Read | `completed_at`, `id`, `provider`, `row_version`, `run_date`, `source_file_id`, `status` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`platform.file_objects`](../../04-Database/Tables/platform/file_objects.md) | Read | `access_type`, `classification`, `id`, `is_deleted`, `malware_scan_status`, `owner_id`, `owner_type`, `row_version`, `sha256`, `size_bytes`, `status` | Platform file service projection / scoped joins; reading does not grant writes. |
| [`payment.reconciliation_runs`](../../04-Database/Tables/payment/reconciliation_runs.md) | Create/update evidence | `provider`, `run_date`, `source_file_id`, `started_at`, `status`, `summary` | Finance_Payments owns these writes; Finance_Payments must invoke that narrow owner command. |
| [`payment.reconciliation_items`](../../04-Database/Tables/payment/reconciliation_items.md) | Create/update evidence | `run_id`, `provider_reference`, `internal_reference`, `expected_amount`, `actual_amount`, `status` | Finance_Payments owns these writes; Finance_Payments must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.sourceFileId | platform.file_objects.id |
| request.runDate | payment.reconciliation_runs.run_date |
| request.collectionIds[] | payment.cod_collections.id |
| data.runId | payment.reconciliation_runs.id |
| data.provider | payment.reconciliation_runs.provider |
| data.runDate | payment.reconciliation_runs.run_date |
| data.status | payment.reconciliation_runs.status |
| data.completedAt | payment.reconciliation_runs.completed_at |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Keep collection, deposit, remittance and settlement distinct. Compare actual evidence; differences remain exceptions requiring authorized resolution, never force-close. |
| Idempotency | Required key: scope actor + API-080 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Missing cash evidence or mismatch leaves unresolved run; no speculative deposited_at/settled_at. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-080-HAPPY` | Valid Finance Cash Reconciler context and documented fixture for open cod reconciliation from actual collection and handover evidence. | HTTP 202; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-080-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-080-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-080-SCOPE` | Use another customer/site/patient/task reference or remove finance.cod.reconcile. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-080-RULE` | Keep collection, deposit, remittance and settlement distinct. Compare actual evidence; differences remain exceptions requiring authorized resolution, never force-close. | Missing cash evidence or mismatch leaves unresolved run; no speculative deposited_at/settled_at. |
| `CT-API-080-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-080-CONCURRENCY` | Race two open cod reconciliation from actual collection and handover evidence. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-080-STATE` | Apply command after Missing cash evidence or mismatch leaves unresolved run; no speculative deposited_at/settled_at. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-080-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Missing cash evidence or mismatch leaves unresolved run; no speculative deposited_at/settled_at. |

Existing feature assertions: `TC-FIN-06-OK`, `TC-FIN-06-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-081 — GET `/v1/admin/finance/invoices/{order_id}`

**Read or download an issued invoice through scoped Finance authorization.**

| Property | Proposed contract |
| --- | --- |
| API name | Read or download an issued invoice through scoped Finance authorization |
| Version / owner | v1 / Finance_Payments |
| Consumer | Finance Officer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `FIN-02`; [WF-012](../../06-Workflows/WF-012-Report-Export-and-Audit.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/admin/finance/invoices/{order_id}` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Finance Officer | finance.invoices.read (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Restrict organization/location through active memberships and the resource FK chain; a request filter can only narrow that scope. Specialized clinical/Finance privileges cannot be obtained through general Admin access.

Finance invoice permission and order organization/site scope required; not customer ownership. No invoice edits or tax recalculation on GET. Accept application/json (default) for the structured DTO or application/pdf for attachment download of finance.invoices.document_file_id. Reauthorize customer/staff scope, available clean private file and invoice-purpose grant; stream the immutable stored PDF through the authenticated file service, never a caller URL or a public link.

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
| order_id | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is fixed: `not applicable for this singleton`. Pagination: none.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

PDF download variant: send `Accept: application/pdf`. HTTP 200 streams the immutable issued PDF bytes with `Content-Type: application/pdf` and `Content-Disposition: attachment; filename="invoice-DEMO-INV-0001.pdf"` (sanitized server-generated filename). No JSON envelope or pagination applies to this variant. Authenticate before streaming and recheck invoice-purpose file grant; no public URL, redirects or range/partial-download support is proposed. Missing issued document is 404; unavailable storage is 503. The default JSON representation follows below.

Data DTO: `InvoiceData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `invoiceId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | finance.invoices.id; uuid. |
| `invoiceNumber` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | finance.invoices.invoice_number; character varying(64). |
| `orderId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | finance.invoices.order_id; uuid. |
| `issuedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | finance.invoices.issued_at; timestamp with time zone. |
| `status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | finance.invoices.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |
| `subtotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | finance.invoices.subtotal; numeric(16,2). |
| `taxTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | finance.invoices.tax_total; numeric(16,2). |
| `grandTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | finance.invoices.grand_total; numeric(16,2). |
| `currency` | string | Required | No | None (not silently populated) | minLength=1; maxLength=3 | finance.invoices.currency; character varying(3). |
| `items` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `items[].description` | string | Required | No | None (not silently populated) | minLength=1; maxLength=255 | finance.invoice_items.description; character varying(255). |
| `items[].quantity` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,9}(\\.[0-9]{1,3})?$" | finance.invoice_items.quantity; numeric(12,3). |
| `items[].unitPrice` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,12}(\\.[0-9]{1,2})?$" | finance.invoice_items.unit_price; numeric(14,2). |
| `items[].hsnCode` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=32 | finance.invoice_items.hsn_code; character varying(32). |
| `items[].taxAmount` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,12}(\\.[0-9]{1,2})?$" | finance.invoice_items.tax_amount; numeric(14,2). |
| `items[].lineTotal` | string | Required | No | None (not silently populated) | minLength=1; maxLength=17; pattern="^-?[0-9]{1,14}(\\.[0-9]{1,2})?$" | finance.invoice_items.line_total; numeric(16,2). |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "invoiceId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "invoiceNumber": "DEMO-INV-0001",
    "orderId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "issuedAt": "2026-10-24T10:30:00Z",
    "status": "issued",
    "subtotal": "25.00",
    "taxTotal": "0.00",
    "grandTotal": "25.00",
    "currency": "INR",
    "items": [
      {
        "description": "Synthetic planning example; not an approved clinical claim.",
        "quantity": "2.000",
        "unitPrice": "12.50",
        "hsnCode": null,
        "taxAmount": "0.00",
        "lineTotal": "25.00"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-081. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks finance.invoices.read or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for read or download an issued invoice through scoped finance authorization. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-081 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`finance.invoices`](../../04-Database/Tables/finance/invoices.md) | Read | `currency`, `document_file_id`, `grand_total`, `id`, `invoice_number`, `issued_at`, `order_id`, `row_version`, `status`, `subtotal`, `tax_total` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`finance.invoice_items`](../../04-Database/Tables/finance/invoice_items.md) | Read | `description`, `hsn_code`, `id`, `invoice_id`, `line_total`, `order_item_id`, `quantity`, `row_version`, `tax_amount`, `unit_price` | Finance_Payments projection / scoped joins; reading does not grant writes. |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`platform.file_objects`](../../04-Database/Tables/platform/file_objects.md) | Read | `access_type`, `classification`, `id`, `is_deleted`, `malware_scan_status`, `owner_id`, `owner_type`, `row_version`, `sha256`, `size_bytes`, `status` | Platform file service projection / scoped joins; reading does not grant writes. |
| [`platform.file_access_grants`](../../04-Database/Tables/platform/file_access_grants.md) | Read | `expires_at`, `file_object_id`, `id`, `row_version` | Platform file service projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.invoiceId | finance.invoices.id |
| data.invoiceNumber | finance.invoices.invoice_number |
| data.orderId | finance.invoices.order_id |
| data.issuedAt | finance.invoices.issued_at |
| data.status | finance.invoices.status |
| data.subtotal | finance.invoices.subtotal |
| data.taxTotal | finance.invoices.tax_total |
| data.grandTotal | finance.invoices.grand_total |
| data.currency | finance.invoices.currency |
| data.items[].description | finance.invoice_items.description |
| data.items[].quantity | finance.invoice_items.quantity |
| data.items[].unitPrice | finance.invoice_items.unit_price |
| data.items[].hsnCode | finance.invoice_items.hsn_code |
| data.items[].taxAmount | finance.invoice_items.tax_amount |
| data.items[].lineTotal | finance.invoice_items.line_total |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md), [`marketplace.sellers`](../../04-Database/Tables/marketplace/sellers.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Finance invoice permission and order organization/site scope required; not customer ownership. No invoice edits or tax recalculation on GET. Accept application/json (default) for the structured DTO or application/pdf for attachment download of finance.invoices.document_file_id. Reauthorize customer/staff scope, available clean private file and invoice-purpose grant; stream the immutable stored PDF through the authenticated file service, never a caller URL or a public link. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Foreign/unissued invoice is 404; issued amounts remain immutable. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-081-HAPPY` | Valid Finance Officer context and documented fixture for read or download an issued invoice through scoped finance authorization. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-081-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-081-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-081-SCOPE` | Use another customer/site/patient/task reference or remove finance.invoices.read. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-081-RULE` | Finance invoice permission and order organization/site scope required; not customer ownership. No invoice edits or tax recalculation on GET. Accept application/json (default) for the structured DTO or application/pdf for attachment download of finance.invoices.document_file_id. Reauthorize customer/staff scope, available clean private file and invoice-purpose grant; stream the immutable stored PDF through the authenticated file service, never a caller URL or a public link. | Foreign/unissued invoice is 404; issued amounts remain immutable. |
| `CT-API-081-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-081-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-081-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-081-RECOVERY` | Dependency timeout during read or download an issued invoice through scoped finance authorization. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-FIN-02-OK`, `TC-FIN-02-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
