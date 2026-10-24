# Customer Accounts API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](../../05-APIs/API-Contract-Coverage.md) · [OpenAPI 3.1](../../05-APIs/openapi.yaml) · [decisions](../../05-APIs/Planning-Decisions.md) · [DTO conventions](../../05-APIs/API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="customer-accounts-api-contracts"></a>
<a id="acc-01--public-customer-otp-flow"></a>
<a id="api-001--request-otp"></a>
<a id="api-002--verify-otp"></a>
<a id="acc-02--profile"></a>
<a id="api-003--read-profile"></a>
<a id="api-004--update-profile"></a>
<a id="remaining-customer-account-contracts"></a>
<a id="shared-response-and-error-rules"></a>
<a id="data-and-implementation-references"></a>
<a id="preserved-api-identifiers"></a>
<a id="route-level-account-operation-register"></a>
<a id="customer-creation-examples"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-001 | `POST /v1/auth/customer/otp/request` | Issue a purpose-bound customer login challenge without revealing account existence. | Complete proposed |
| API-002 | `POST /v1/auth/customer/otp/verify` | Consume a valid login challenge and establish exactly one customer session. | Complete proposed |
| API-003 | `GET /v1/me` | Return the authenticated customer profile and separate identity/profile versions. | Complete proposed |
| API-004 | `PATCH /v1/me` | Patch own profile while protecting verified contact replacement. | Incomplete — D-023: exact replacement proof DTO/storage is absent. Profile-only subset proposed, full route incomplete. |
| API-005 | `GET /v1/me/addresses` | List only active addresses belonging to the session customer. | Complete proposed |
| API-006 | `POST /v1/me/addresses` | Create an owned delivery address without asserting serviceability. | Complete proposed |
| API-007 | `GET /v1/me/patients` | List owned dependent associations with no private clinical history. | Complete proposed |
| API-008 | `POST /v1/me/patients` | Create a family association and linked patient identity for the customer. | Complete proposed |
| API-009 | `POST /v1/me/consents` | Record an explicit consent choice against a published purpose/version. | Complete proposed |
| ACC-ROUTE-005 | `GET /v1/me/consents` | List own consent choices and their policy versions. | Complete proposed |
| ACC-ROUTE-001 | `PATCH /v1/me/addresses/{addressId}` | Edit an owned address with optimistic locking. | Complete proposed |
| ACC-ROUTE-002 | `DELETE /v1/me/addresses/{addressId}` | Soft-delete an owned address without erasing order evidence. | Complete proposed |
| ACC-ROUTE-007 | `POST /v1/me/deletion-requests` | Create a privacy deletion request without immediate data erasure. | Complete proposed |
| ACC-ROUTE-006 | `GET /v1/me/deletion-requests/{requestId}` | Read own privacy deletion request status. | Complete proposed |
| ACC-ROUTE-003 | `PATCH /v1/me/patients/{patientId}` | Edit demographic attributes of an owned family association. | Complete proposed |
| ACC-ROUTE-004 | `DELETE /v1/me/patients/{patientId}` | Soft-remove a family association while retaining patient evidence. | Complete proposed |
| ACC-ROUTE-008 | `GET /v1/me/wishlist/items` | List the owned default wishlist’s product references. | Complete proposed |
| ACC-ROUTE-009 | `POST /v1/me/wishlist/items` | Add one published product to the owned default wishlist. | Complete proposed |
| ACC-ROUTE-010 | `DELETE /v1/me/wishlist/items/{itemId}` | Remove one owned wishlist item idempotently. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| ACC-01 | Sign up and log in with mobile OTP (WhatsApp first, SMS fallback) | API-001, API-002 |
| ACC-02 | Profile: name, email, phone | API-003, API-004 |
| ACC-03 | Saved addresses with map pin; serviceability checked when the address is entered | API-005, API-006, ACC-ROUTE-001, ACC-ROUTE-002 |
| ACC-04 | Family profiles for dependents (name, age, relation) | API-007, API-008, ACC-ROUTE-003, ACC-ROUTE-004 |
| ACC-05 | Privacy notice and consent at signup | API-009, ACC-ROUTE-005 |
| ACC-06 | Account deletion request | ACC-ROUTE-007, ACC-ROUTE-006 |
| ACC-07 | Wishlist | ACC-ROUTE-008, ACC-ROUTE-009, ACC-ROUTE-010 |

## API-001 — POST `/v1/auth/customer/otp/request`

**Issue a purpose-bound customer login challenge without revealing account existence.**

| Property | Proposed contract |
| --- | --- |
| API name | Issue a purpose-bound customer login challenge without revealing account existence |
| Version / owner | v1 / Authentication_Access |
| Consumer | Public |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-01`, `AUTH-03`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/auth/customer/otp/request` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| NO | None (purpose-bound pre-login proof where supplied) | Public | Public challenge issuance; no role grant (Proposed grant code) |


Public pre-login issuance: no bearer, existing role or profile is required. Bind the login challenge to the normalized destination hash and purpose; throttle by destination/network origin and do not disclose account existence.

Normalize phone, hash destination, queue one login OTP; return neutral 202 for existing/new eligible destinations. Do not return the code or raw destination. Preserve the inherited delivery rule: WhatsApp is primary, SMS only under configured fallback; do not replace that with a new channel policy.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Not Applicable | Omit | Pre-login/provider trust path; no bearer. |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-001_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `CustomerOtpRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `phoneCountryCode` | string | Required | No | None (not silently populated) | pattern="^\\+[1-9][0-9]{0,2}$" | Public DTO value from identity.users.phone_country_code. Ownership and current-state checks apply before use. |
| `phoneNumber` | string | Required | No | None (not silently populated) | pattern="^[0-9]{4,14}$" | Synthetic example; limits and challenge delivery require D-003. |


```json
{
  "phoneCountryCode": "+91",
  "phoneNumber": "9000000000"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **202**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `OtpChallengeData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `challengeId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Opaque public challenge UUID; identity.otp_challenges.id. |
| `expiresAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | identity.otp_challenges.expires_at. |
| `deliveryStatus` | string | Required | No | None (not silently populated) | enum=["queued"] | Neutral response; does not reveal whether an account exists. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "challengeId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "expiresAt": "2026-10-24T10:40:00Z",
    "deliveryStatus": "queued"
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
| 422 | `VALIDATION_ERROR` | Normalize phone, hash destination, queue one login OTP; return neutral 202 for existing/new eligible destinations. Do not return the code or raw destination. Preserve the inherited delivery rule: WhatsApp is primary, SMS only under configured fallback; do not replace that with a new channel policy. | No unauthorized/partial domain effect; redact sensitive context. | Expired or rate-limited challenge must not create a session; wait for Retry-After or request a new challenge. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Expired or rate-limited challenge must not create a session; wait for Retry-After or request a new challenge. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-001 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`identity.otp_challenges`](../../04-Database/Tables/identity/otp_challenges.md) | Read | `attempts`, `blocked_at`, `consumed_at`, `created_by`, `destination_hash`, `expires_at`, `id`, `otp_hash`, `purpose`, `row_version`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Read | `created_by`, `id`, `phone_country_code`, `phone_number`, `row_version`, `status`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.otp_challenges`](../../04-Database/Tables/identity/otp_challenges.md) | Create/update evidence | `channel`, `destination_hash`, `purpose`, `otp_hash`, `expires_at`, `max_attempts` | Authentication_Access owns these writes; Authentication_Access must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.phoneCountryCode | identity.users.phone_country_code |
| request.phoneNumber | identity.users.phone_number |
| data.challengeId | identity.otp_challenges.id |
| data.expiresAt | identity.otp_challenges.expires_at |
| data.deliveryStatus | API-only neutral delivery-queue acknowledgment; not proof of recipient delivery. |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Normalize phone, hash destination, queue one login OTP; return neutral 202 for existing/new eligible destinations. Do not return the code or raw destination. Preserve the inherited delivery rule: WhatsApp is primary, SMS only under configured fallback; do not replace that with a new channel policy. |
| Idempotency | Required key: scope actor + API-001 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 3 challenges / 15 minutes per destination hash and 10/minute per network origin; Security must approve D-003. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Expired or rate-limited challenge must not create a session; wait for Retry-After or request a new challenge. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-001-HAPPY` | Valid Public context and documented fixture for issue a purpose-bound customer login challenge without revealing account existence. | HTTP 202; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-001-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-001-AUTH` | Call without bearer, then supply invalid purpose-bound proof if this operation accepts one. | Public operation must not require bearer; invalid proof never establishes a session. |
| `CT-API-001-SCOPE` | Use another customer/site/patient/task reference or remove Public challenge issuance; no role grant. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-001-RULE` | Normalize phone, hash destination, queue one login OTP; return neutral 202 for existing/new eligible destinations. Do not return the code or raw destination. Preserve the inherited delivery rule: WhatsApp is primary, SMS only under configured fallback; do not replace that with a new channel policy. | Expired or rate-limited challenge must not create a session; wait for Retry-After or request a new challenge. |
| `CT-API-001-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-001-CONCURRENCY` | Race two issue a purpose-bound customer login challenge without revealing account existence. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-001-STATE` | Apply command after Expired or rate-limited challenge must not create a session; wait for Retry-After or request a new challenge. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-001-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Expired or rate-limited challenge must not create a session; wait for Retry-After or request a new challenge. |

Existing feature assertions: `TC-ACC-01-01`, `TC-ACC-01-02`, `TC-AUTH-03-OK`, `TC-AUTH-03-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-002 — POST `/v1/auth/customer/otp/verify`

**Consume a valid login challenge and establish exactly one customer session.**

| Property | Proposed contract |
| --- | --- |
| API name | Consume a valid login challenge and establish exactly one customer session |
| Version / owner | v1 / Authentication_Access |
| Consumer | Public |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-01`, `AUTH-03`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/auth/customer/otp/verify` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| NO | None (purpose-bound pre-login proof where supplied) | Public | Valid customer-login proof; no existing access session (Proposed grant code) |


Public pre-login verification: no bearer or existing role required. Resolve the user only through the purpose-bound destination challenge after valid one-time proof; caller-supplied user IDs cannot select the identity. New identity sessions remain limited to approved onboarding until a real profile is complete.

Lock and validate login challenge purpose, digest, expiry, attempts and consumption; resolve or create eligible customer identity and one session. New users have restricted onboarding permission until profile completion supplies a real first_name; do not insert a blank/placeholder profile. Locked/suspended/closed identities get no session.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Not Applicable | Omit | Pre-login/provider trust path; no bearer. |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
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


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `CustomerOtpVerification`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `challengeId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | identity.otp_challenges.id; purpose-bound public challenge. |
| `code` | string | Required | No | None (not silently populated) | minLength=1; maxLength=6; pattern="^[0-9]{6}$" | Secret; configured challenge format, never logged. Proposed six digits. |


```json
{
  "challengeId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "code": "583914"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `SessionData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `accessToken` | string | Required | No | None (not silently populated) | minLength=1; maxLength=4096 | Write-only bearer credential in transit; never persist cleartext. |
| `tokenType` | string | Required | No | None (not silently populated) | enum=["Bearer"] | API transport constant Bearer. |
| `expiresIn` | integer | Required | No | None (not silently populated) | minimum=1 | Configured token lifetime in seconds; sample is not an approved lifetime. |
| `refreshToken` | string | Required | No | None (not silently populated) | minLength=1; maxLength=4096 | Rotating opaque credential; only a hash is stored in identity.sessions. |
| `sessionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | identity.sessions.id |
| `userId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | identity.users.id |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJFZERTQSJ9.pharmville-example.signature",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "refreshToken": "pv_refresh_Kd9hQ7x4m2V6t8r3",
    "sessionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "userId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
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
| 422 | `VALIDATION_ERROR` | Check purpose, digest, expiry, attempts and consumption under a row lock. Only a valid proof can upsert a customer and consume the challenge; concurrent verification has one winner. Customer provisioning may use an empty first_name only if Product accepts that pending-profile convention; otherwise no new account is provisioned and onboarding remains blocked. | No unauthorized/partial domain effect; redact sensitive context. | A consumed, expired or wrong-purpose OTP cannot establish a second session; request fresh proof. Roll back all successful-consumption effects together. |
| 409 | `INVALID_STATE_TRANSITION` | A consumed, expired or wrong-purpose OTP cannot establish a second session; request fresh proof. Roll back all successful-consumption effects together. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-002 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |
| 401 | `AUTH_INVALID_CREDENTIALS` | Login/OTP/MFA proof is invalid, expired, consumed or belongs to a disabled account; no account-existence disclosure. | No unauthorized/partial domain effect; redact sensitive context. | Obtain fresh proof within configured limits; no session is created. |


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
| [`identity.otp_challenges`](../../04-Database/Tables/identity/otp_challenges.md) | Read | `attempts`, `blocked_at`, `consumed_at`, `created_by`, `destination_hash`, `expires_at`, `id`, `otp_hash`, `purpose`, `row_version`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Read | `created_by`, `id`, `row_version`, `status`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`customer.profiles`](../../04-Database/Tables/customer/profiles.md) | Read | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `updated_by`, `user_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`identity.otp_challenges`](../../04-Database/Tables/identity/otp_challenges.md) | Create/update evidence | `attempts`, `consumed_at`, `blocked_at` | Authentication_Access owns these writes; Authentication_Access must invoke that narrow owner command. |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Create/update evidence | `phone_country_code`, `phone_number`, `phone_verified_at`, `status`, `last_login_at` | Authentication_Access owns these writes; Authentication_Access must invoke that narrow owner command. |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | Create/update evidence | `user_id`, `refresh_token_hash`, `token_family_id`, `expires_at` | Authentication_Access owns these writes; Authentication_Access must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.challengeId | identity.otp_challenges.id |
| request.code | Write-only OTP proof checked against identity.otp_challenges.otp_hash; no cleartext storage. |
| data.accessToken | API-only signed access JWT; never a persisted cleartext database field. |
| data.tokenType | API transport constant Bearer. |
| data.expiresIn | API-only configured JWT lifetime, checked against session expiry. |
| data.refreshToken | Secret compared to identity.sessions.refresh_token_hash; rotate, never store cleartext. |
| data.sessionId | identity.sessions.id |
| data.userId | identity.users.id |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`customer.profiles`](../../04-Database/Tables/customer/profiles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Lock and validate login challenge purpose, digest, expiry, attempts and consumption; resolve or create eligible customer identity and one session. New users have restricted onboarding permission until profile completion supplies a real first_name; do not insert a blank/placeholder profile. Locked/suspended/closed identities get no session. |
| Idempotency | No generic key: single-use proof/rotating credential replay is validated by the identity owner. Never cache bearer/refresh secrets in idempotency_keys. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 5 proof/refresh attempts per minute per challenge/session and origin, plus approved lockout/attempt policy D-003. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. A consumed, expired or wrong-purpose OTP cannot establish a second session; request fresh proof. Roll back all successful-consumption effects together. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-002-HAPPY` | Valid Public context and documented fixture for consume a valid login challenge and establish exactly one customer session. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-002-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-002-AUTH` | Call without bearer, then supply invalid purpose-bound proof if this operation accepts one. | Public operation must not require bearer; invalid proof never establishes a session. |
| `CT-API-002-SCOPE` | Use another customer/site/patient/task reference or remove Valid customer-login proof; no existing access session. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-002-RULE` | Lock and validate login challenge purpose, digest, expiry, attempts and consumption; resolve or create eligible customer identity and one session. New users have restricted onboarding permission until profile completion supplies a real first_name; do not insert a blank/placeholder profile. Locked/suspended/closed identities get no session. | A consumed, expired or wrong-purpose OTP cannot establish a second session; request fresh proof. Roll back all successful-consumption effects together. |
| `CT-API-002-DUPLICATE` | Replay consumed/rotated proof. | No second session/effect; honor identity/provider replay policy. |
| `CT-API-002-CONCURRENCY` | Race two consume a valid login challenge and establish exactly one customer session. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-002-STATE` | Apply command after A consumed, expired or wrong-purpose OTP cannot establish a second session; request fresh proof. Roll back all successful-consumption effects together. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-002-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. A consumed, expired or wrong-purpose OTP cannot establish a second session; request fresh proof. Roll back all successful-consumption effects together. |

Existing feature assertions: `TC-ACC-01-01`, `TC-ACC-01-02`, `TC-AUTH-03-OK`, `TC-AUTH-03-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-003 — GET `/v1/me`

**Return the authenticated customer profile and separate identity/profile versions.**

| Property | Proposed contract |
| --- | --- |
| API name | Return the authenticated customer profile and separate identity/profile versions |
| Version / owner | v1 / Customer_Accounts |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-02`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-accounts.read.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Resolve profile.user_id from JWT subject; omit credentials, normalized contacts and internal IDs.

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

Data DTO: `ProfileData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `profileId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | customer.profiles.id; uuid. |
| `firstName` | string | Required | No | None (not silently populated) | minLength=1; maxLength=100 | customer.profiles.first_name; character varying(100). |
| `lastName` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=100 | customer.profiles.last_name; character varying(100). |
| `preferredName` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=100 | customer.profiles.preferred_name; character varying(100). |
| `dateOfBirth` | string/null (date) | Required | Yes | None (not silently populated) | format="date" | customer.profiles.date_of_birth; date. |
| `gender` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=32 | customer.profiles.gender; character varying(32). |
| `profileVersion` | integer | Required | No | None (not silently populated) | minimum=0 | customer.profiles.row_version; bigint. |
| `userId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | customer.profiles.user_id; uuid. |
| `email` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=320 | identity.users.email; character varying(320). |
| `userVersion` | integer | Required | No | None (not silently populated) | minimum=0 | identity.users.row_version; bigint. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "profileId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "firstName": "Asha",
    "lastName": "Example",
    "preferredName": "Asha",
    "dateOfBirth": "1985-04-12",
    "gender": null,
    "profileVersion": 1,
    "userId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "email": "asha@example.invalid",
    "userVersion": 1
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
| 404 | `RESOURCE_NOT_FOUND` | The authenticated identity has no completed customer profile. | No foreign profile/cart is substituted. | Complete the approved onboarding branch or create cart through API-019. |
| 422 | `REQUEST_VALIDATION_ERROR` | A declared path/query/header field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-003. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-accounts.read.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-003 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`customer.profiles`](../../04-Database/Tables/customer/profiles.md) | Read | `created_by`, `date_of_birth`, `deleted_by`, `first_name`, `gender`, `id`, `is_deleted`, `last_name`, `preferred_name`, `row_version`, `updated_by`, `user_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Read | `created_by`, `email`, `id`, `row_version`, `status`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.profileId | customer.profiles.id |
| data.firstName | customer.profiles.first_name |
| data.lastName | customer.profiles.last_name |
| data.preferredName | customer.profiles.preferred_name |
| data.dateOfBirth | customer.profiles.date_of_birth |
| data.gender | customer.profiles.gender |
| data.profileVersion | customer.profiles.row_version |
| data.userId | customer.profiles.user_id |
| data.email | identity.users.email |
| data.userVersion | identity.users.row_version |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`customer.profiles`](../../04-Database/Tables/customer/profiles.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Resolve profile.user_id from JWT subject; omit credentials, normalized contacts and internal IDs. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Missing own profile is 404; repair provisioning rather than return another user. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-003-HAPPY` | Valid Customer context and documented fixture for return the authenticated customer profile and separate identity/profile versions. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-003-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-003-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-003-SCOPE` | Use another customer/site/patient/task reference or remove customer-accounts.read.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-003-RULE` | Resolve profile.user_id from JWT subject; omit credentials, normalized contacts and internal IDs. | Missing own profile is 404; repair provisioning rather than return another user. |
| `CT-API-003-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-003-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-003-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-003-RECOVERY` | Dependency timeout during return the authenticated customer profile and separate identity/profile versions. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-ACC-02-01`, `TC-ACC-02-02`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-004 — PATCH `/v1/me`

**Patch own profile while protecting verified contact replacement.**

| Property | Proposed contract |
| --- | --- |
| API name | Patch own profile while protecting verified contact replacement |
| Version / owner | v1 / Customer_Accounts |
| Consumer | Customer |
| Status | Documentation Incomplete; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-02`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me` (placeholder host from existing OpenAPI; no deployment asserted) |


**Remaining contract gap:** D-023: exact replacement proof DTO/storage is absent. Profile-only subset proposed, full route incomplete.

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-accounts.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Compare profile version; identity version is additionally required for a contact change. A contact replacement needs purpose-bound proof and cannot clear a verified address before proof.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-004_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `CustomerProfileUpdate`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `firstName` | string | Optional | No | None (not silently populated) | minLength=1; maxLength=100 | Public DTO value from customer.profiles.first_name. Ownership and current-state checks apply before use. |
| `lastName` | string/null | Optional | Yes | None (not silently populated) | maxLength=100 | Public DTO value from customer.profiles.last_name. Ownership and current-state checks apply before use. |
| `preferredName` | string/null | Optional | Yes | None (not silently populated) | maxLength=100 | Public DTO value from customer.profiles.preferred_name. Ownership and current-state checks apply before use. |
| `email` | string/null (email) | Optional | Yes | None (not silently populated) | format="email" | Public DTO value from identity.users.email. Ownership and current-state checks apply before use. |
| `expectedProfileVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Public DTO value from customer.profiles.row_version. Ownership and current-state checks apply before use. |
| `expectedUserVersion` | integer | Optional | No | None (not silently populated) | minimum=1 | Required only when an approved update also changes identity fields. |


```json
{
  "firstName": "Asha",
  "lastName": "Example",
  "preferredName": "Asha",
  "email": "asha@example.invalid",
  "expectedProfileVersion": 1,
  "expectedUserVersion": 1
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `ProfileData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `profileId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | customer.profiles.id; uuid. |
| `firstName` | string | Required | No | None (not silently populated) | minLength=1; maxLength=100 | customer.profiles.first_name; character varying(100). |
| `lastName` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=100 | customer.profiles.last_name; character varying(100). |
| `preferredName` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=100 | customer.profiles.preferred_name; character varying(100). |
| `dateOfBirth` | string/null (date) | Required | Yes | None (not silently populated) | format="date" | customer.profiles.date_of_birth; date. |
| `gender` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=32 | customer.profiles.gender; character varying(32). |
| `profileVersion` | integer | Required | No | None (not silently populated) | minimum=0 | customer.profiles.row_version; bigint. |
| `userId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | customer.profiles.user_id; uuid. |
| `email` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=320 | identity.users.email; character varying(320). |
| `userVersion` | integer | Required | No | None (not silently populated) | minimum=0 | identity.users.row_version; bigint. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "profileId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "firstName": "Asha",
    "lastName": "Example",
    "preferredName": "Asha",
    "dateOfBirth": "1985-04-12",
    "gender": null,
    "profileVersion": 1,
    "userId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "email": "asha@example.invalid",
    "userVersion": 1
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-004. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-accounts.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for patch own profile while protecting verified contact replacement. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Compare profile version; identity version is additionally required for a contact change. A contact replacement needs purpose-bound proof and cannot clear a verified address before proof. | No unauthorized/partial domain effect; redact sensitive context. | Unproven replacement has no identity effect; preserve prior contact and ask for proof. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current patch own profile while protecting verified contact replacement. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Unproven replacement has no identity effect; preserve prior contact and ask for proof. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-004 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`customer.profiles`](../../04-Database/Tables/customer/profiles.md) | Read | `created_by`, `date_of_birth`, `deleted_by`, `first_name`, `gender`, `id`, `is_deleted`, `last_name`, `preferred_name`, `row_version`, `updated_by`, `user_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Read | `created_by`, `email`, `id`, `row_version`, `status`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`customer.profiles`](../../04-Database/Tables/customer/profiles.md) | Create/update evidence | `first_name`, `last_name`, `preferred_name` | Customer_Accounts owns these writes; Customer_Accounts must invoke that narrow owner command. |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Create/update evidence | `email`, `email_normalized`, `email_verified_at` | Authentication_Access owns these writes; Customer_Accounts must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.firstName | customer.profiles.first_name |
| request.lastName | customer.profiles.last_name |
| request.preferredName | customer.profiles.preferred_name |
| request.email | identity.users.email |
| request.expectedProfileVersion | customer.profiles.row_version |
| request.expectedUserVersion | identity.users.row_version |
| data.profileId | customer.profiles.id |
| data.firstName | customer.profiles.first_name |
| data.lastName | customer.profiles.last_name |
| data.preferredName | customer.profiles.preferred_name |
| data.dateOfBirth | customer.profiles.date_of_birth |
| data.gender | customer.profiles.gender |
| data.profileVersion | customer.profiles.row_version |
| data.userId | customer.profiles.user_id |
| data.email | identity.users.email |
| data.userVersion | identity.users.row_version |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`customer.profiles`](../../04-Database/Tables/customer/profiles.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Compare profile version; identity version is additionally required for a contact change. A contact replacement needs purpose-bound proof and cannot clear a verified address before proof. |
| Idempotency | Required key: scope actor + API-004 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Unproven replacement has no identity effect; preserve prior contact and ask for proof. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-004-HAPPY` | Valid Customer context and documented fixture for patch own profile while protecting verified contact replacement. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-004-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-004-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-004-SCOPE` | Use another customer/site/patient/task reference or remove customer-accounts.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-004-RULE` | Compare profile version; identity version is additionally required for a contact change. A contact replacement needs purpose-bound proof and cannot clear a verified address before proof. | Unproven replacement has no identity effect; preserve prior contact and ask for proof. |
| `CT-API-004-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-004-CONCURRENCY` | Race two patch own profile while protecting verified contact replacement. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-004-STATE` | Apply command after Unproven replacement has no identity effect; preserve prior contact and ask for proof. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-004-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Unproven replacement has no identity effect; preserve prior contact and ask for proof. |

Existing feature assertions: `TC-ACC-02-01`, `TC-ACC-02-02`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-005 — GET `/v1/me/addresses`

**List only active addresses belonging to the session customer.**

| Property | Proposed contract |
| --- | --- |
| API name | List only active addresses belonging to the session customer |
| Version / owner | v1 / Customer_Accounts |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-03`; [WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/addresses` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-accounts.read.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Exclude soft-deleted addresses; stable default-first ordering.

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
| offset | integer | Optional | No | 0 | minimum=0; maximum=100000 | Optional allowlisted filter; does not widen authenticated scope. |


Only declared query fields are accepted. Sorting is fixed: `is_default DESC, created_at DESC, id ASC`. Pagination: offset.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `AddressListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `addresses` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `addresses[].id` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from customer.addresses.id. Ownership and current-state checks apply before use. |
| `addresses[].label` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.label. Ownership and current-state checks apply before use. |
| `addresses[].recipientName` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.recipient_name. Ownership and current-state checks apply before use. |
| `addresses[].recipientPhone` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.recipient_phone. Ownership and current-state checks apply before use. |
| `addresses[].line1` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.line1. Ownership and current-state checks apply before use. |
| `addresses[].line2` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.line2. Ownership and current-state checks apply before use. |
| `addresses[].locality` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.locality. Ownership and current-state checks apply before use. |
| `addresses[].district` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.district. Ownership and current-state checks apply before use. |
| `addresses[].city` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.city. Ownership and current-state checks apply before use. |
| `addresses[].state` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.state. Ownership and current-state checks apply before use. |
| `addresses[].stateCode` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.state_code. Ownership and current-state checks apply before use. |
| `addresses[].postalCode` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.postal_code. Ownership and current-state checks apply before use. |
| `addresses[].countryCode` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.country_code. Ownership and current-state checks apply before use. |
| `addresses[].latitude` | number/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.latitude. Ownership and current-state checks apply before use. |
| `addresses[].longitude` | number/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.longitude. Ownership and current-state checks apply before use. |
| `addresses[].isDefault` | boolean | Optional | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.is_default. Ownership and current-state checks apply before use. |
| `addresses[].rowVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Public DTO value from customer.addresses.row_version. Ownership and current-state checks apply before use. |


Pagination metadata: `totalCount: integer ≥0`, `limit: integer 1–100`, `offset: integer 0–100000`, `hasNext: boolean`. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "id": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "label": "Home",
        "recipientName": "Asha Example",
        "recipientPhone": "9000000000",
        "line1": "12 Example Avenue",
        "line2": "Apartment 4",
        "locality": "Sector 18",
        "district": "Gautam Buddha Nagar",
        "city": "Noida",
        "state": "Uttar Pradesh",
        "stateCode": "UP",
        "postalCode": "201301",
        "countryCode": "IN",
        "latitude": 1,
        "longitude": 1,
        "isDefault": true,
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
| 422 | `REQUEST_VALIDATION_ERROR` | A declared path/query/header field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-005. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-accounts.read.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-005 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`customer.addresses`](../../04-Database/Tables/customer/addresses.md) | Read | `city`, `country_code`, `district`, `id`, `is_default`, `is_deleted`, `label`, `latitude`, `line1`, `line2`, `locality`, `longitude`, `postal_code`, `recipient_name`, `recipient_phone`, `row_version`, `state`, `state_code`, `user_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.addresses[].id | customer.addresses.id |
| data.addresses[].label | customer.addresses.label |
| data.addresses[].recipientName | customer.addresses.recipient_name |
| data.addresses[].recipientPhone | customer.addresses.recipient_phone |
| data.addresses[].line1 | customer.addresses.line1 |
| data.addresses[].line2 | customer.addresses.line2 |
| data.addresses[].locality | customer.addresses.locality |
| data.addresses[].district | customer.addresses.district |
| data.addresses[].city | customer.addresses.city |
| data.addresses[].state | customer.addresses.state |
| data.addresses[].stateCode | customer.addresses.state_code |
| data.addresses[].postalCode | customer.addresses.postal_code |
| data.addresses[].countryCode | customer.addresses.country_code |
| data.addresses[].latitude | customer.addresses.latitude |
| data.addresses[].longitude | customer.addresses.longitude |
| data.addresses[].isDefault | customer.addresses.is_default |
| data.addresses[].rowVersion | customer.addresses.row_version |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Exclude soft-deleted addresses; stable default-first ordering. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | offset; is_default DESC, created_at DESC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. An empty address book is 200 with addresses []; never use an arbitrary fallback address. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-005-HAPPY` | Valid Customer context and documented fixture for list only active addresses belonging to the session customer. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-005-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-005-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-005-SCOPE` | Use another customer/site/patient/task reference or remove customer-accounts.read.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-005-RULE` | Exclude soft-deleted addresses; stable default-first ordering. | An empty address book is 200 with addresses []; never use an arbitrary fallback address. |
| `CT-API-005-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-005-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-005-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-005-RECOVERY` | Dependency timeout during list only active addresses belonging to the session customer. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-ACC-03-OK`, `TC-ACC-03-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-006 — POST `/v1/me/addresses`

**Create an owned delivery address without asserting serviceability.**

| Property | Proposed contract |
| --- | --- |
| API name | Create an owned delivery address without asserting serviceability |
| Version / owner | v1 / Customer_Accounts |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-03`; [WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/addresses` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-accounts.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Server assigns user_id and validation_status. For a default address, serialize per customer and update prior default flags and profiles.default_address_id in the same Customer Accounts transaction. Address creation does not authorize delivery.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-006_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `CustomerAddressCreate`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `label` | string/null | Optional | Yes | None (not silently populated) | maxLength=64 | Public DTO value from customer.addresses.label. Ownership and current-state checks apply before use. |
| `recipientName` | string | Required | No | None (not silently populated) | maxLength=150 | Public DTO value from customer.addresses.recipient_name. Ownership and current-state checks apply before use. |
| `recipientPhone` | string | Required | No | None (not silently populated) | maxLength=32 | Public DTO value from customer.addresses.recipient_phone. Ownership and current-state checks apply before use. |
| `line1` | string | Required | No | None (not silently populated) | maxLength=255 | Public DTO value from customer.addresses.line1. Ownership and current-state checks apply before use. |
| `line2` | string/null | Optional | Yes | None (not silently populated) | maxLength=255 | Public DTO value from customer.addresses.line2. Ownership and current-state checks apply before use. |
| `locality` | string/null | Optional | Yes | None (not silently populated) | maxLength=150 | Public DTO value from customer.addresses.locality. Ownership and current-state checks apply before use. |
| `district` | string/null | Optional | Yes | None (not silently populated) | maxLength=100 | Public DTO value from customer.addresses.district. Ownership and current-state checks apply before use. |
| `city` | string | Required | No | None (not silently populated) | maxLength=100 | Public DTO value from customer.addresses.city. Ownership and current-state checks apply before use. |
| `state` | string | Required | No | None (not silently populated) | maxLength=100 | Public DTO value from customer.addresses.state. Ownership and current-state checks apply before use. |
| `stateCode` | string/null | Optional | Yes | None (not silently populated) | maxLength=8 | Public DTO value from customer.addresses.state_code. Ownership and current-state checks apply before use. |
| `postalCode` | string | Required | No | None (not silently populated) | maxLength=16 | Country-specific postal string; IN must match ^[1-9][0-9]{5}$; other supported jurisdictions need approved serviceability policy. |
| `countryCode` | string | Optional | No | "IN" | maxLength=2; pattern="^[A-Z]{2}$" | Public DTO value from customer.addresses.country_code. Ownership and current-state checks apply before use. |
| `latitude` | number/null | Optional | Yes | None (not silently populated) | minimum=-90; maximum=90 | Public DTO value from customer.addresses.latitude. Ownership and current-state checks apply before use. |
| `longitude` | number/null | Optional | Yes | None (not silently populated) | minimum=-180; maximum=180 | Public DTO value from customer.addresses.longitude. Ownership and current-state checks apply before use. |
| `isDefault` | boolean | Optional | No | false | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.is_default. Ownership and current-state checks apply before use. |


```json
{
  "label": "Home",
  "recipientName": "Asha Example",
  "recipientPhone": "9000000000",
  "line1": "12 Example Avenue",
  "line2": "Apartment 4",
  "locality": "Sector 18",
  "district": "Gautam Buddha Nagar",
  "city": "Noida",
  "state": "Uttar Pradesh",
  "stateCode": "UP",
  "postalCode": "201301",
  "countryCode": "IN",
  "latitude": -90,
  "longitude": -180,
  "isDefault": true
}
```

File upload: **Not Applicable**.

### Success response

HTTP **201**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `CustomerAddressData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `id` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from customer.addresses.id. Ownership and current-state checks apply before use. |
| `label` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.label. Ownership and current-state checks apply before use. |
| `recipientName` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.recipient_name. Ownership and current-state checks apply before use. |
| `recipientPhone` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.recipient_phone. Ownership and current-state checks apply before use. |
| `line1` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.line1. Ownership and current-state checks apply before use. |
| `line2` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.line2. Ownership and current-state checks apply before use. |
| `locality` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.locality. Ownership and current-state checks apply before use. |
| `district` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.district. Ownership and current-state checks apply before use. |
| `city` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.city. Ownership and current-state checks apply before use. |
| `state` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.state. Ownership and current-state checks apply before use. |
| `stateCode` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.state_code. Ownership and current-state checks apply before use. |
| `postalCode` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.postal_code. Ownership and current-state checks apply before use. |
| `countryCode` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.country_code. Ownership and current-state checks apply before use. |
| `latitude` | number/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.latitude. Ownership and current-state checks apply before use. |
| `longitude` | number/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.longitude. Ownership and current-state checks apply before use. |
| `isDefault` | boolean | Optional | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.is_default. Ownership and current-state checks apply before use. |
| `rowVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Public DTO value from customer.addresses.row_version. Ownership and current-state checks apply before use. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "id": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "label": "Home",
    "recipientName": "Asha Example",
    "recipientPhone": "9000000000",
    "line1": "12 Example Avenue",
    "line2": "Apartment 4",
    "locality": "Sector 18",
    "district": "Gautam Buddha Nagar",
    "city": "Noida",
    "state": "Uttar Pradesh",
    "stateCode": "UP",
    "postalCode": "201301",
    "countryCode": "IN",
    "latitude": 1,
    "longitude": 1,
    "isDefault": true,
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-006. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-accounts.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for create an owned delivery address without asserting serviceability. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Server assigns user_id and validation_status. For a default address, serialize per customer and update prior default flags and profiles.default_address_id in the same Customer Accounts transaction. Address creation does not authorize delivery. | No unauthorized/partial domain effect; redact sensitive context. | Duplicate intent replays one address; invalid coordinates roll back. Checkout independently checks serviceability. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Duplicate intent replays one address; invalid coordinates roll back. Checkout independently checks serviceability. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-006 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`customer.addresses`](../../04-Database/Tables/customer/addresses.md) | Read | `city`, `country_code`, `district`, `id`, `is_default`, `is_deleted`, `label`, `latitude`, `line1`, `line2`, `locality`, `longitude`, `postal_code`, `recipient_name`, `recipient_phone`, `row_version`, `state`, `state_code`, `user_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`customer.profiles`](../../04-Database/Tables/customer/profiles.md) | Read | `default_address_id`, `id`, `is_deleted`, `row_version`, `user_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`customer.addresses`](../../04-Database/Tables/customer/addresses.md) | Create/update evidence | `user_id`, `label`, `recipient_name`, `recipient_phone`, `line1`, `line2`, `locality`, `district`, `city`, `state`, `state_code`, `postal_code`, `country_code`, `latitude`, `longitude`, `is_default`, `validation_status` | Customer_Accounts owns these writes; Customer_Accounts must invoke that narrow owner command. |
| [`customer.profiles`](../../04-Database/Tables/customer/profiles.md) | Create/update evidence | `default_address_id` | Customer_Accounts owns these writes; Customer_Accounts must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.label | customer.addresses.label |
| request.recipientName | customer.addresses.recipient_name |
| request.recipientPhone | customer.addresses.recipient_phone |
| request.line1 | customer.addresses.line1 |
| request.line2 | customer.addresses.line2 |
| request.locality | customer.addresses.locality |
| request.district | customer.addresses.district |
| request.city | customer.addresses.city |
| request.state | customer.addresses.state |
| request.stateCode | customer.addresses.state_code |
| request.postalCode | customer.addresses.postal_code |
| request.countryCode | customer.addresses.country_code |
| request.latitude | customer.addresses.latitude |
| request.longitude | customer.addresses.longitude |
| request.isDefault | customer.addresses.is_default |
| data.id | customer.addresses.id |
| data.label | customer.addresses.label |
| data.recipientName | customer.addresses.recipient_name |
| data.recipientPhone | customer.addresses.recipient_phone |
| data.line1 | customer.addresses.line1 |
| data.line2 | customer.addresses.line2 |
| data.locality | customer.addresses.locality |
| data.district | customer.addresses.district |
| data.city | customer.addresses.city |
| data.state | customer.addresses.state |
| data.stateCode | customer.addresses.state_code |
| data.postalCode | customer.addresses.postal_code |
| data.countryCode | customer.addresses.country_code |
| data.latitude | customer.addresses.latitude |
| data.longitude | customer.addresses.longitude |
| data.isDefault | customer.addresses.is_default |
| data.rowVersion | customer.addresses.row_version |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`customer.profiles`](../../04-Database/Tables/customer/profiles.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Server assigns user_id and validation_status. For a default address, serialize per customer and update prior default flags and profiles.default_address_id in the same Customer Accounts transaction. Address creation does not authorize delivery. |
| Idempotency | Required key: scope actor + API-006 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Duplicate intent replays one address; invalid coordinates roll back. Checkout independently checks serviceability. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-006-HAPPY` | Valid Customer context and documented fixture for create an owned delivery address without asserting serviceability. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-006-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-006-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-006-SCOPE` | Use another customer/site/patient/task reference or remove customer-accounts.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-006-RULE` | Server assigns user_id and validation_status. For a default address, serialize per customer and update prior default flags and profiles.default_address_id in the same Customer Accounts transaction. Address creation does not authorize delivery. | Duplicate intent replays one address; invalid coordinates roll back. Checkout independently checks serviceability. |
| `CT-API-006-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-006-CONCURRENCY` | Race two create an owned delivery address without asserting serviceability. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-006-STATE` | Apply command after Duplicate intent replays one address; invalid coordinates roll back. Checkout independently checks serviceability. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-006-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Duplicate intent replays one address; invalid coordinates roll back. Checkout independently checks serviceability. |

Existing feature assertions: `TC-ACC-03-OK`, `TC-ACC-03-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-007 — GET `/v1/me/patients`

**List owned dependent associations with no private clinical history.**

| Property | Proposed contract |
| --- | --- |
| API name | List owned dependent associations with no private clinical history |
| Version / owner | v1 / Customer_Accounts |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-04`; [WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/patients` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-accounts.read.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Filter customer_user_id to subject; disclose only association demographic fields.

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
| offset | integer | Optional | No | 0 | minimum=0; maximum=100000 | Optional allowlisted filter; does not widen authenticated scope. |


Only declared query fields are accepted. Sorting is fixed: `created_at DESC, id ASC`. Pagination: offset.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `PatientListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `patients` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `patients[].id` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from customer.family_members.id. Ownership and current-state checks apply before use. |
| `patients[].name` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.family_members.name. Ownership and current-state checks apply before use. |
| `patients[].relationship` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.family_members.relationship. Ownership and current-state checks apply before use. |
| `patients[].dateOfBirth` | string/null (date) | Optional | Yes | None (not silently populated) | format="date" | Public DTO value from customer.family_members.date_of_birth. Ownership and current-state checks apply before use. |
| `patients[].gender` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.family_members.gender. Ownership and current-state checks apply before use. |
| `patients[].isDependent` | boolean | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.family_members.is_dependent. Ownership and current-state checks apply before use. |
| `patients[].rowVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Public DTO value from customer.family_members.row_version. Ownership and current-state checks apply before use. |
| `patients[].patientId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | clinical.patient_profiles.id after Intake linkage, otherwise null; API-008 may return pending linkage. |


Pagination metadata: `totalCount: integer ≥0`, `limit: integer 1–100`, `offset: integer 0–100000`, `hasNext: boolean`. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "name": "Example personal care item",
        "relationship": "parent",
        "dateOfBirth": "1985-04-12",
        "gender": null,
        "isDependent": true,
        "rowVersion": 1,
        "patientId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
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
| 422 | `REQUEST_VALIDATION_ERROR` | A declared path/query/header field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-007. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-accounts.read.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-007 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`customer.family_members`](../../04-Database/Tables/customer/family_members.md) | Read | `customer_user_id`, `date_of_birth`, `gender`, `id`, `is_deleted`, `is_dependent`, `name`, `relationship`, `row_version` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md) | Read | `family_member_id`, `id`, `is_deleted`, `row_version`, `user_id` | Prescription_Upload / Intake projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.patients[].id | customer.family_members.id |
| data.patients[].name | customer.family_members.name |
| data.patients[].relationship | customer.family_members.relationship |
| data.patients[].dateOfBirth | customer.family_members.date_of_birth |
| data.patients[].gender | customer.family_members.gender |
| data.patients[].isDependent | customer.family_members.is_dependent |
| data.patients[].rowVersion | customer.family_members.row_version |
| data.patients[].patientId | clinical.patient_profiles.id |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Filter customer_user_id to subject; disclose only association demographic fields. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | offset; created_at DESC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Another family association is never returned merely because its UUID is known. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-007-HAPPY` | Valid Customer context and documented fixture for list owned dependent associations with no private clinical history. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-007-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-007-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-007-SCOPE` | Use another customer/site/patient/task reference or remove customer-accounts.read.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-007-RULE` | Filter customer_user_id to subject; disclose only association demographic fields. | Another family association is never returned merely because its UUID is known. |
| `CT-API-007-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-007-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-007-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-007-RECOVERY` | Dependency timeout during list owned dependent associations with no private clinical history. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-ACC-04-OK`, `TC-ACC-04-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-008 — POST `/v1/me/patients`

**Create a family association and linked patient identity for the customer.**

| Property | Proposed contract |
| --- | --- |
| API name | Create a family association and linked patient identity for the customer |
| Version / owner | v1 / Customer_Accounts |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-04`; [WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/patients` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-accounts.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Validate date of birth is not in the future. Customer Accounts coordinates the association; Intake owns clinical.patient_profiles creation via a narrow internal command. No medical records or independent consent are fabricated.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-008_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `FamilyMemberCreate`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `name` | string | Required | No | None (not silently populated) | maxLength=150 | Public DTO value from customer.family_members.name. Ownership and current-state checks apply before use. |
| `relationship` | string | Required | No | None (not silently populated) | enum=["self", "spouse", "parent", "child", "other"]; maxLength=64 | Business association label, proposed allowlist self/spouse/parent/child/other; does not confer clinical or legal authority. |
| `dateOfBirth` | string/null (date) | Optional | Yes | None (not silently populated) | format="date" | Public DTO value from customer.family_members.date_of_birth. Ownership and current-state checks apply before use. |
| `gender` | string/null | Optional | Yes | None (not silently populated) | maxLength=32 | Public DTO value from customer.family_members.gender. Ownership and current-state checks apply before use. |


```json
{
  "name": "Example personal care item",
  "relationship": "parent",
  "dateOfBirth": "1985-04-12",
  "gender": null
}
```

File upload: **Not Applicable**.

### Success response

HTTP **201**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `FamilyMemberData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `id` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from customer.family_members.id. Ownership and current-state checks apply before use. |
| `name` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.family_members.name. Ownership and current-state checks apply before use. |
| `relationship` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.family_members.relationship. Ownership and current-state checks apply before use. |
| `dateOfBirth` | string/null (date) | Optional | Yes | None (not silently populated) | format="date" | Public DTO value from customer.family_members.date_of_birth. Ownership and current-state checks apply before use. |
| `gender` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.family_members.gender. Ownership and current-state checks apply before use. |
| `isDependent` | boolean | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.family_members.is_dependent. Ownership and current-state checks apply before use. |
| `rowVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Public DTO value from customer.family_members.row_version. Ownership and current-state checks apply before use. |
| `patientId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | clinical.patient_profiles.id after Intake linkage, otherwise null; API-008 may return pending linkage. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "id": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "name": "Example personal care item",
    "relationship": "parent",
    "dateOfBirth": "1985-04-12",
    "gender": null,
    "isDependent": true,
    "rowVersion": 1,
    "patientId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-008. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-accounts.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for create a family association and linked patient identity for the customer. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Validate date of birth is not in the future. Customer Accounts coordinates the association; Intake owns clinical.patient_profiles creation via a narrow internal command. No medical records or independent consent are fabricated. | No unauthorized/partial domain effect; redact sensitive context. | If the linked patient command fails, association remains unready and is not selectable for a P checkout; retry by association ID. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | If the linked patient command fails, association remains unready and is not selectable for a P checkout; retry by association ID. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-008 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`customer.family_members`](../../04-Database/Tables/customer/family_members.md) | Read | `customer_user_id`, `date_of_birth`, `gender`, `id`, `is_deleted`, `is_dependent`, `name`, `relationship`, `row_version` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md) | Read | `family_member_id`, `id`, `is_deleted`, `row_version`, `user_id` | Prescription_Upload / Intake projection / scoped joins; reading does not grant writes. |
| [`customer.family_members`](../../04-Database/Tables/customer/family_members.md) | Create/update evidence | `customer_user_id`, `name`, `relationship`, `date_of_birth`, `gender`, `is_dependent` | Customer_Accounts owns these writes; Customer_Accounts must invoke that narrow owner command. |
| [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md) | Create/update evidence | `family_member_id` | Prescription_Upload / Intake owns these writes; Customer_Accounts must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.name | customer.family_members.name |
| request.relationship | customer.family_members.relationship |
| request.dateOfBirth | customer.family_members.date_of_birth |
| request.gender | customer.family_members.gender |
| data.id | customer.family_members.id |
| data.name | customer.family_members.name |
| data.relationship | customer.family_members.relationship |
| data.dateOfBirth | customer.family_members.date_of_birth |
| data.gender | customer.family_members.gender |
| data.isDependent | customer.family_members.is_dependent |
| data.rowVersion | customer.family_members.row_version |
| data.patientId | clinical.patient_profiles.id |

**Transaction:** Customer Accounts commits association plus outbox. Intake idempotently creates the patient row in a separate transaction; expose the association immediately, patient eligibility only after linkage. No distributed atomicity is claimed. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Validate date of birth is not in the future. Customer Accounts coordinates the association; Intake owns clinical.patient_profiles creation via a narrow internal command. No medical records or independent consent are fabricated. |
| Idempotency | Required key: scope actor + API-008 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. If the linked patient command fails, association remains unready and is not selectable for a P checkout; retry by association ID. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-008-HAPPY` | Valid Customer context and documented fixture for create a family association and linked patient identity for the customer. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-008-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-008-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-008-SCOPE` | Use another customer/site/patient/task reference or remove customer-accounts.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-008-RULE` | Validate date of birth is not in the future. Customer Accounts coordinates the association; Intake owns clinical.patient_profiles creation via a narrow internal command. No medical records or independent consent are fabricated. | If the linked patient command fails, association remains unready and is not selectable for a P checkout; retry by association ID. |
| `CT-API-008-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-008-CONCURRENCY` | Race two create a family association and linked patient identity for the customer. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-008-STATE` | Apply command after If the linked patient command fails, association remains unready and is not selectable for a P checkout; retry by association ID. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-008-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. If the linked patient command fails, association remains unready and is not selectable for a P checkout; retry by association ID. |

Existing feature assertions: `TC-ACC-04-OK`, `TC-ACC-04-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-009 — POST `/v1/me/consents`

**Record an explicit consent choice against a published purpose/version.**

| Property | Proposed contract |
| --- | --- |
| API name | Record an explicit consent choice against a published purpose/version |
| Version / owner | v1 / Customer_Accounts |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-05`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/consents` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-accounts.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Only customer choices granted, denied or revoked are accepted; requested/expired are server lifecycle states. Grant/revoke timestamps derive from server time. Purpose/version must match an approved policy, never arbitrary caller text.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-009_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `ConsentCreate`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `consentType` | string | Required | No | None (not silently populated) | maxLength=64 | Public DTO value from customer.consents.consent_type. Ownership and current-state checks apply before use. |
| `purpose` | string | Required | No | None (not silently populated) | maxLength=128 | Public DTO value from customer.consents.purpose. Ownership and current-state checks apply before use. |
| `version` | string | Required | No | None (not silently populated) | maxLength=32 | Public DTO value from customer.consents.version. Ownership and current-state checks apply before use. |
| `status` | string | Required | No | None (not silently populated) | enum=["granted", "denied", "revoked"] | Public DTO value from customer.consents.status. Ownership and current-state checks apply before use. |
| `source` | string | Required | No | None (not silently populated) | maxLength=32 | Public DTO value from customer.consents.source. Ownership and current-state checks apply before use. |


```json
{
  "consentType": "privacy",
  "purpose": "account_service",
  "version": "privacy-2026-01",
  "status": "granted",
  "source": "customer_web"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **201**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `ConsentData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `id` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from customer.consents.id. Ownership and current-state checks apply before use. |
| `consentType` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.consents.consent_type. Ownership and current-state checks apply before use. |
| `purpose` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.consents.purpose. Ownership and current-state checks apply before use. |
| `version` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.consents.version. Ownership and current-state checks apply before use. |
| `status` | string | Required | No | None (not silently populated) | enum=["requested", "granted", "denied", "revoked", "expired"] | Public DTO value from customer.consents.status. Ownership and current-state checks apply before use. |
| `grantedAt` | string/null (date-time) | Optional | Yes | None (not silently populated) | format="date-time" | Public DTO value from customer.consents.granted_at. Ownership and current-state checks apply before use. |
| `withdrawnAt` | string/null (date-time) | Optional | Yes | None (not silently populated) | format="date-time" | Public DTO value from customer.consents.withdrawn_at. Ownership and current-state checks apply before use. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "id": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "consentType": "consentType",
    "purpose": "purpose",
    "version": "version",
    "status": "requested",
    "grantedAt": "2026-10-24T10:30:00Z",
    "withdrawnAt": "2026-10-24T10:30:00Z"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-009. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-accounts.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for record an explicit consent choice against a published purpose/version. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Only customer choices granted, denied or revoked are accepted; requested/expired are server lifecycle states. Grant/revoke timestamps derive from server time. Purpose/version must match an approved policy, never arbitrary caller text. | No unauthorized/partial domain effect; redact sensitive context. | An unknown policy version does not create consent; reload the published policy. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | An unknown policy version does not create consent; reload the published policy. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-009 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`customer.consents`](../../04-Database/Tables/customer/consents.md) | Read | `consent_type`, `expires_at`, `granted_at`, `id`, `purpose`, `row_version`, `source`, `status`, `user_id`, `version`, `withdrawn_at` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`customer.consents`](../../04-Database/Tables/customer/consents.md) | Create/update evidence | `user_id`, `consent_type`, `purpose`, `version`, `status`, `source`, `granted_at`, `withdrawn_at`, `evidence` | Customer_Accounts owns these writes; Customer_Accounts must invoke that narrow owner command. |
| [`customer.consent_events`](../../04-Database/Tables/customer/consent_events.md) | Create/update evidence | `consent_id`, `actor_user_id`, `event_type`, `request_id`, `metadata_json` | Customer_Accounts owns these writes; Customer_Accounts must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.consentType | customer.consents.consent_type |
| request.purpose | customer.consents.purpose |
| request.version | customer.consents.version |
| request.status | customer.consents.status |
| request.source | customer.consents.source |
| data.id | customer.consents.id |
| data.consentType | customer.consents.consent_type |
| data.purpose | customer.consents.purpose |
| data.version | customer.consents.version |
| data.status | customer.consents.status |
| data.grantedAt | customer.consents.granted_at |
| data.withdrawnAt | customer.consents.withdrawn_at |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Only customer choices granted, denied or revoked are accepted; requested/expired are server lifecycle states. Grant/revoke timestamps derive from server time. Purpose/version must match an approved policy, never arbitrary caller text. |
| Idempotency | Required key: scope actor + API-009 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. An unknown policy version does not create consent; reload the published policy. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-009-HAPPY` | Valid Customer context and documented fixture for record an explicit consent choice against a published purpose/version. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-009-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-009-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-009-SCOPE` | Use another customer/site/patient/task reference or remove customer-accounts.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-009-RULE` | Only customer choices granted, denied or revoked are accepted; requested/expired are server lifecycle states. Grant/revoke timestamps derive from server time. Purpose/version must match an approved policy, never arbitrary caller text. | An unknown policy version does not create consent; reload the published policy. |
| `CT-API-009-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-009-CONCURRENCY` | Race two record an explicit consent choice against a published purpose/version. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-009-STATE` | Apply command after An unknown policy version does not create consent; reload the published policy. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-009-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. An unknown policy version does not create consent; reload the published policy. |

Existing feature assertions: `TC-ACC-05-OK`, `TC-ACC-05-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## ACC-ROUTE-005 — GET `/v1/me/consents`

**List own consent choices and their policy versions.**

| Property | Proposed contract |
| --- | --- |
| API name | List own consent choices and their policy versions |
| Version / owner | v1 / Customer_Accounts |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-05`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/consents` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-accounts.read.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Return current/historical owned choices; do not expose raw evidence IP/device content.

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


Only declared query fields are accepted. Sorting is fixed: `created_at DESC, id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `ConsentListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `consents` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `consents[].id` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from customer.consents.id. Ownership and current-state checks apply before use. |
| `consents[].consentType` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.consents.consent_type. Ownership and current-state checks apply before use. |
| `consents[].purpose` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.consents.purpose. Ownership and current-state checks apply before use. |
| `consents[].version` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.consents.version. Ownership and current-state checks apply before use. |
| `consents[].status` | string | Required | No | None (not silently populated) | enum=["requested", "granted", "denied", "revoked", "expired"] | Public DTO value from customer.consents.status. Ownership and current-state checks apply before use. |
| `consents[].grantedAt` | string/null (date-time) | Optional | Yes | None (not silently populated) | format="date-time" | Public DTO value from customer.consents.granted_at. Ownership and current-state checks apply before use. |
| `consents[].withdrawnAt` | string/null (date-time) | Optional | Yes | None (not silently populated) | format="date-time" | Public DTO value from customer.consents.withdrawn_at. Ownership and current-state checks apply before use. |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "consents": [
      {
        "id": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "consentType": "consentType",
        "purpose": "purpose",
        "version": "version",
        "status": "requested",
        "grantedAt": "2026-10-24T10:30:00Z",
        "withdrawnAt": "2026-10-24T10:30:00Z"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for ACC-ROUTE-005. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-accounts.read.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for ACC-ROUTE-005 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`customer.consents`](../../04-Database/Tables/customer/consents.md) | Read | `consent_type`, `expires_at`, `granted_at`, `id`, `purpose`, `row_version`, `status`, `user_id`, `version`, `withdrawn_at` | Customer_Accounts projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.consents[].id | customer.consents.id |
| data.consents[].consentType | customer.consents.consent_type |
| data.consents[].purpose | customer.consents.purpose |
| data.consents[].version | customer.consents.version |
| data.consents[].status | customer.consents.status |
| data.consents[].grantedAt | customer.consents.granted_at |
| data.consents[].withdrawnAt | customer.consents.withdrawn_at |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Return current/historical owned choices; do not expose raw evidence IP/device content. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; created_at DESC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Tampered cursor is 422; restart pagination in the same customer scope. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-ACC-ROUTE-005-HAPPY` | Valid Customer context and documented fixture for list own consent choices and their policy versions. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-ACC-ROUTE-005-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-ACC-ROUTE-005-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-ACC-ROUTE-005-SCOPE` | Use another customer/site/patient/task reference or remove customer-accounts.read.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-ACC-ROUTE-005-RULE` | Return current/historical owned choices; do not expose raw evidence IP/device content. | Tampered cursor is 422; restart pagination in the same customer scope. |
| `CT-ACC-ROUTE-005-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-ACC-ROUTE-005-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-ACC-ROUTE-005-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-ACC-ROUTE-005-RECOVERY` | Dependency timeout during list own consent choices and their policy versions. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-ACC-05-OK`, `TC-ACC-05-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## ACC-ROUTE-001 — PATCH `/v1/me/addresses/{addressId}`

**Edit an owned address with optimistic locking.**

| Property | Proposed contract |
| --- | --- |
| API name | Edit an owned address with optimistic locking |
| Version / owner | v1 / Customer_Accounts |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-03`; [WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/addresses/{addressId}` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-accounts.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

At least one editable field; expectedVersion matches address row. Serialize default changes per customer; clear validation on material address changes. Accepted order shipping snapshots are immutable and unchanged.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_acc-route-001_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| addressId | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `CustomerAddressPatch`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedVersion` | integer | Required | No | None (not silently populated) | minimum=1 | customer.addresses.row_version |
| `label` | string/null | Optional | Yes | None (not silently populated) | maxLength=64 | Public DTO value from customer.addresses.label. Ownership and current-state checks apply before use. |
| `recipientName` | string | Optional | No | None (not silently populated) | maxLength=150 | Public DTO value from customer.addresses.recipient_name. Ownership and current-state checks apply before use. |
| `recipientPhone` | string | Optional | No | None (not silently populated) | maxLength=32 | Public DTO value from customer.addresses.recipient_phone. Ownership and current-state checks apply before use. |
| `line1` | string | Optional | No | None (not silently populated) | maxLength=255 | Public DTO value from customer.addresses.line1. Ownership and current-state checks apply before use. |
| `line2` | string/null | Optional | Yes | None (not silently populated) | maxLength=255 | Public DTO value from customer.addresses.line2. Ownership and current-state checks apply before use. |
| `locality` | string/null | Optional | Yes | None (not silently populated) | maxLength=150 | Public DTO value from customer.addresses.locality. Ownership and current-state checks apply before use. |
| `district` | string/null | Optional | Yes | None (not silently populated) | maxLength=100 | Public DTO value from customer.addresses.district. Ownership and current-state checks apply before use. |
| `city` | string | Optional | No | None (not silently populated) | maxLength=100 | Public DTO value from customer.addresses.city. Ownership and current-state checks apply before use. |
| `state` | string | Optional | No | None (not silently populated) | maxLength=100 | Public DTO value from customer.addresses.state. Ownership and current-state checks apply before use. |
| `stateCode` | string/null | Optional | Yes | None (not silently populated) | maxLength=8 | Public DTO value from customer.addresses.state_code. Ownership and current-state checks apply before use. |
| `postalCode` | string | Optional | No | None (not silently populated) | maxLength=16 | Country-specific postal string; IN must match ^[1-9][0-9]{5}$; other supported jurisdictions need approved serviceability policy. |
| `countryCode` | string | Optional | No | "IN" | maxLength=2; pattern="^[A-Z]{2}$" | Public DTO value from customer.addresses.country_code. Ownership and current-state checks apply before use. |
| `latitude` | number/null | Optional | Yes | None (not silently populated) | minimum=-90; maximum=90 | Public DTO value from customer.addresses.latitude. Ownership and current-state checks apply before use. |
| `longitude` | number/null | Optional | Yes | None (not silently populated) | minimum=-180; maximum=180 | Public DTO value from customer.addresses.longitude. Ownership and current-state checks apply before use. |
| `isDefault` | boolean | Optional | No | false | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.is_default. Ownership and current-state checks apply before use. |


```json
{
  "expectedVersion": 1,
  "label": "Home",
  "recipientName": "Asha Example",
  "recipientPhone": "9000000000",
  "line1": "12 Example Avenue",
  "line2": "Apartment 4",
  "locality": "Sector 18",
  "district": "Gautam Buddha Nagar",
  "city": "Noida",
  "state": "Uttar Pradesh",
  "stateCode": "UP",
  "postalCode": "201301",
  "countryCode": "IN",
  "latitude": -90,
  "longitude": -180,
  "isDefault": true
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `CustomerAddressData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `id` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from customer.addresses.id. Ownership and current-state checks apply before use. |
| `label` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.label. Ownership and current-state checks apply before use. |
| `recipientName` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.recipient_name. Ownership and current-state checks apply before use. |
| `recipientPhone` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.recipient_phone. Ownership and current-state checks apply before use. |
| `line1` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.line1. Ownership and current-state checks apply before use. |
| `line2` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.line2. Ownership and current-state checks apply before use. |
| `locality` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.locality. Ownership and current-state checks apply before use. |
| `district` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.district. Ownership and current-state checks apply before use. |
| `city` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.city. Ownership and current-state checks apply before use. |
| `state` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.state. Ownership and current-state checks apply before use. |
| `stateCode` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.state_code. Ownership and current-state checks apply before use. |
| `postalCode` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.postal_code. Ownership and current-state checks apply before use. |
| `countryCode` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.country_code. Ownership and current-state checks apply before use. |
| `latitude` | number/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.latitude. Ownership and current-state checks apply before use. |
| `longitude` | number/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.longitude. Ownership and current-state checks apply before use. |
| `isDefault` | boolean | Optional | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.addresses.is_default. Ownership and current-state checks apply before use. |
| `rowVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Public DTO value from customer.addresses.row_version. Ownership and current-state checks apply before use. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "id": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "label": "Home",
    "recipientName": "Asha Example",
    "recipientPhone": "9000000000",
    "line1": "12 Example Avenue",
    "line2": "Apartment 4",
    "locality": "Sector 18",
    "district": "Gautam Buddha Nagar",
    "city": "Noida",
    "state": "Uttar Pradesh",
    "stateCode": "UP",
    "postalCode": "201301",
    "countryCode": "IN",
    "latitude": 1,
    "longitude": 1,
    "isDefault": true,
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for ACC-ROUTE-001. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-accounts.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for edit an owned address with optimistic locking. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | At least one editable field; expectedVersion matches address row. Serialize default changes per customer; clear validation on material address changes. Accepted order shipping snapshots are immutable and unchanged. | No unauthorized/partial domain effect; redact sensitive context. | Stale edit is 409; requote any open checkout using the changed address. Do not silently reroute accepted orders. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current edit an owned address with optimistic locking. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Stale edit is 409; requote any open checkout using the changed address. Do not silently reroute accepted orders. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for ACC-ROUTE-001 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`customer.addresses`](../../04-Database/Tables/customer/addresses.md) | Read | `city`, `country_code`, `district`, `id`, `is_default`, `is_deleted`, `label`, `latitude`, `line1`, `line2`, `locality`, `longitude`, `postal_code`, `recipient_name`, `recipient_phone`, `row_version`, `state`, `state_code`, `user_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`customer.profiles`](../../04-Database/Tables/customer/profiles.md) | Read | `default_address_id`, `id`, `is_deleted`, `row_version`, `user_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`commerce.checkouts`](../../04-Database/Tables/commerce/checkouts.md) | Read | `address_id`, `expires_at`, `id`, `row_version`, `status`, `user_id` | Cart_Checkout projection / scoped joins; reading does not grant writes. |
| [`customer.addresses`](../../04-Database/Tables/customer/addresses.md) | Create/update evidence | `label`, `recipient_name`, `recipient_phone`, `line1`, `line2`, `locality`, `district`, `city`, `state`, `state_code`, `postal_code`, `country_code`, `latitude`, `longitude`, `is_default`, `validation_status` | Customer_Accounts owns these writes; Customer_Accounts must invoke that narrow owner command. |
| [`customer.profiles`](../../04-Database/Tables/customer/profiles.md) | Create/update evidence | `default_address_id` | Customer_Accounts owns these writes; Customer_Accounts must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedVersion | customer.addresses.row_version |
| request.label | customer.addresses.label |
| request.recipientName | customer.addresses.recipient_name |
| request.recipientPhone | customer.addresses.recipient_phone |
| request.line1 | customer.addresses.line1 |
| request.line2 | customer.addresses.line2 |
| request.locality | customer.addresses.locality |
| request.district | customer.addresses.district |
| request.city | customer.addresses.city |
| request.state | customer.addresses.state |
| request.stateCode | customer.addresses.state_code |
| request.postalCode | customer.addresses.postal_code |
| request.countryCode | customer.addresses.country_code |
| request.latitude | customer.addresses.latitude |
| request.longitude | customer.addresses.longitude |
| request.isDefault | customer.addresses.is_default |
| data.id | customer.addresses.id |
| data.label | customer.addresses.label |
| data.recipientName | customer.addresses.recipient_name |
| data.recipientPhone | customer.addresses.recipient_phone |
| data.line1 | customer.addresses.line1 |
| data.line2 | customer.addresses.line2 |
| data.locality | customer.addresses.locality |
| data.district | customer.addresses.district |
| data.city | customer.addresses.city |
| data.state | customer.addresses.state |
| data.stateCode | customer.addresses.state_code |
| data.postalCode | customer.addresses.postal_code |
| data.countryCode | customer.addresses.country_code |
| data.latitude | customer.addresses.latitude |
| data.longitude | customer.addresses.longitude |
| data.isDefault | customer.addresses.is_default |
| data.rowVersion | customer.addresses.row_version |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`customer.profiles`](../../04-Database/Tables/customer/profiles.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | At least one editable field; expectedVersion matches address row. Serialize default changes per customer; clear validation on material address changes. Accepted order shipping snapshots are immutable and unchanged. |
| Idempotency | Required key: scope actor + ACC-ROUTE-001 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Stale edit is 409; requote any open checkout using the changed address. Do not silently reroute accepted orders. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-ACC-ROUTE-001-HAPPY` | Valid Customer context and documented fixture for edit an owned address with optimistic locking. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-ACC-ROUTE-001-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-ACC-ROUTE-001-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-ACC-ROUTE-001-SCOPE` | Use another customer/site/patient/task reference or remove customer-accounts.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-ACC-ROUTE-001-RULE` | At least one editable field; expectedVersion matches address row. Serialize default changes per customer; clear validation on material address changes. Accepted order shipping snapshots are immutable and unchanged. | Stale edit is 409; requote any open checkout using the changed address. Do not silently reroute accepted orders. |
| `CT-ACC-ROUTE-001-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-ACC-ROUTE-001-CONCURRENCY` | Race two edit an owned address with optimistic locking. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-ACC-ROUTE-001-STATE` | Apply command after Stale edit is 409; requote any open checkout using the changed address. Do not silently reroute accepted orders. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-ACC-ROUTE-001-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Stale edit is 409; requote any open checkout using the changed address. Do not silently reroute accepted orders. |

Existing feature assertions: `TC-ACC-03-OK`, `TC-ACC-03-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## ACC-ROUTE-002 — DELETE `/v1/me/addresses/{addressId}`

**Soft-delete an owned address without erasing order evidence.**

| Property | Proposed contract |
| --- | --- |
| API name | Soft-delete an owned address without erasing order evidence |
| Version / owner | v1 / Customer_Accounts |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-03`; [WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/addresses/{addressId}` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-accounts.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Required If-Match contains address row_version. Clear default reference atomically; invalidate future selection/quote, retain accepted snapshots. No hard delete.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Not Applicable | Omit | No request body. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_acc-route-002_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Required | "4" | Current row_version for deletion. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| addressId | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **204**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. No Content-Type/body for 204.

No response DTO, JSON or pagination metadata: bodyless 204.

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 422 | `REQUEST_VALIDATION_ERROR` | A declared path/query/header field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for ACC-ROUTE-002. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-accounts.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for soft-delete an owned address without erasing order evidence. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Required If-Match contains address row_version. Clear default reference atomically; invalidate future selection/quote, retain accepted snapshots. No hard delete. | No unauthorized/partial domain effect; redact sensitive context. | Foreign address is 404, stale ETag is 412; completed replay returns original 204 without a body. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 428 | `PRECONDITION_REQUIRED` | If-Match was omitted for conditional removal. | No unauthorized/partial domain effect; redact sensitive context. | Fetch own resource version and supply strong If-Match. |
| 412 | `PRECONDITION_FAILED` | If-Match is stale for this exact resource. | No unauthorized/partial domain effect; redact sensitive context. | Reload; compare before issuing a new delete intent. |
| 409 | `INVALID_STATE_TRANSITION` | Foreign address is 404, stale ETag is 412; completed replay returns original 204 without a body. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for ACC-ROUTE-002 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`customer.addresses`](../../04-Database/Tables/customer/addresses.md) | Read | `id`, `is_deleted`, `row_version`, `user_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`customer.profiles`](../../04-Database/Tables/customer/profiles.md) | Read | `default_address_id`, `id`, `is_deleted`, `row_version`, `user_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`commerce.checkouts`](../../04-Database/Tables/commerce/checkouts.md) | Read | `address_id`, `expires_at`, `id`, `row_version`, `status`, `user_id` | Cart_Checkout projection / scoped joins; reading does not grant writes. |
| [`customer.addresses`](../../04-Database/Tables/customer/addresses.md) | Create/update evidence | `is_deleted`, `deleted_at`, `deleted_by`, `is_default` | Customer_Accounts owns these writes; Customer_Accounts must invoke that narrow owner command. |
| [`customer.profiles`](../../04-Database/Tables/customer/profiles.md) | Create/update evidence | `default_address_id` | Customer_Accounts owns these writes; Customer_Accounts must invoke that narrow owner command. |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`customer.profiles`](../../04-Database/Tables/customer/profiles.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Required If-Match contains address row_version. Clear default reference atomically; invalidate future selection/quote, retain accepted snapshots. No hard delete. |
| Idempotency | Required key: scope actor + ACC-ROUTE-002 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | If-Match strong quoted row_version; missing 428, stale 412; lock owner row. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Foreign address is 404, stale ETag is 412; completed replay returns original 204 without a body. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-ACC-ROUTE-002-HAPPY` | Valid Customer context and documented fixture for soft-delete an owned address without erasing order evidence. | HTTP 204; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-ACC-ROUTE-002-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-ACC-ROUTE-002-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-ACC-ROUTE-002-SCOPE` | Use another customer/site/patient/task reference or remove customer-accounts.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-ACC-ROUTE-002-RULE` | Required If-Match contains address row_version. Clear default reference atomically; invalidate future selection/quote, retain accepted snapshots. No hard delete. | Foreign address is 404, stale ETag is 412; completed replay returns original 204 without a body. |
| `CT-ACC-ROUTE-002-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-ACC-ROUTE-002-CONCURRENCY` | Race two soft-delete an owned address without erasing order evidence. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-ACC-ROUTE-002-STATE` | Apply command after Foreign address is 404, stale ETag is 412; completed replay returns original 204 without a body. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-ACC-ROUTE-002-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Foreign address is 404, stale ETag is 412; completed replay returns original 204 without a body. |

Existing feature assertions: `TC-ACC-03-OK`, `TC-ACC-03-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## ACC-ROUTE-007 — POST `/v1/me/deletion-requests`

**Create a privacy deletion request without immediate data erasure.**

| Property | Proposed contract |
| --- | --- |
| API name | Create a privacy deletion request without immediate data erasure |
| Version / owner | v1 / Customer_Accounts via Privacy owner command |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-06`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/deletion-requests` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-accounts.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Authenticated own account and explicit confirmation. request_type deletion is proposed application vocabulary; retain active legal/clinical/financial holds. Legal-approved due date is nullable, not an invented SLA.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_acc-route-007_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `PrivacyDeletionRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `confirmation` | boolean | Required | No | None (not silently populated) | const=true | API-only privacy-request confirmation guard, not a deletion instruction. |


```json
{
  "confirmation": true
}
```

File upload: **Not Applicable**.

### Success response

HTTP **202**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `PrivacyRequestData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `requestId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | compliance.privacy_requests.id; uuid. |
| `requestNumber` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | compliance.privacy_requests.request_number; character varying(64). |
| `requestType` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | compliance.privacy_requests.request_type; character varying(64). |
| `status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | compliance.privacy_requests.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |
| `requestedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | compliance.privacy_requests.requested_at; timestamp with time zone. |
| `dueAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | compliance.privacy_requests.due_at; timestamp with time zone. |
| `completedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | compliance.privacy_requests.completed_at; timestamp with time zone. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "requestNumber": "PRIV-DEMO-0001",
    "requestType": "request type",
    "status": "received",
    "requestedAt": "2026-10-24T10:30:00Z",
    "dueAt": null,
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for ACC-ROUTE-007. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-accounts.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for create a privacy deletion request without immediate data erasure. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Authenticated own account and explicit confirmation. request_type deletion is proposed application vocabulary; retain active legal/clinical/financial holds. Legal-approved due date is nullable, not an invented SLA. | No unauthorized/partial domain effect; redact sensitive context. | Already-open deletion request replays existing request; actual closure/erasure requires D-013 review and background owner actions. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Already-open deletion request replays existing request; actual closure/erasure requires D-013 review and background owner actions. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for ACC-ROUTE-007 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Read | `created_by`, `id`, `row_version`, `status`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`compliance.privacy_requests`](../../04-Database/Tables/compliance/privacy_requests.md) | Read | `completed_at`, `created_by`, `due_at`, `id`, `request_number`, `request_type`, `requested_at`, `row_version`, `status`, `updated_by`, `user_id` | Privacy / Compliance owner projection / scoped joins; reading does not grant writes. |
| [`compliance.legal_holds`](../../04-Database/Tables/compliance/legal_holds.md) | Read | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `status`, `updated_by` | Privacy / Compliance owner projection / scoped joins; reading does not grant writes. |
| [`compliance.privacy_requests`](../../04-Database/Tables/compliance/privacy_requests.md) | Create/update evidence | `user_id`, `request_number`, `request_type`, `requested_at`, `status`, `due_at` | Privacy / Compliance owner owns these writes; Customer_Accounts via Privacy owner command must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.confirmation | API-only privacy-request confirmation guard, not a deletion instruction. |
| data.requestId | compliance.privacy_requests.id |
| data.requestNumber | compliance.privacy_requests.request_number |
| data.requestType | compliance.privacy_requests.request_type |
| data.status | compliance.privacy_requests.status |
| data.requestedAt | compliance.privacy_requests.requested_at |
| data.dueAt | compliance.privacy_requests.due_at |
| data.completedAt | compliance.privacy_requests.completed_at |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Authenticated own account and explicit confirmation. request_type deletion is proposed application vocabulary; retain active legal/clinical/financial holds. Legal-approved due date is nullable, not an invented SLA. |
| Idempotency | Required key: scope actor + ACC-ROUTE-007 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Already-open deletion request replays existing request; actual closure/erasure requires D-013 review and background owner actions. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-ACC-ROUTE-007-HAPPY` | Valid Customer context and documented fixture for create a privacy deletion request without immediate data erasure. | HTTP 202; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-ACC-ROUTE-007-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-ACC-ROUTE-007-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-ACC-ROUTE-007-SCOPE` | Use another customer/site/patient/task reference or remove customer-accounts.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-ACC-ROUTE-007-RULE` | Authenticated own account and explicit confirmation. request_type deletion is proposed application vocabulary; retain active legal/clinical/financial holds. Legal-approved due date is nullable, not an invented SLA. | Already-open deletion request replays existing request; actual closure/erasure requires D-013 review and background owner actions. |
| `CT-ACC-ROUTE-007-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-ACC-ROUTE-007-CONCURRENCY` | Race two create a privacy deletion request without immediate data erasure. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-ACC-ROUTE-007-STATE` | Apply command after Already-open deletion request replays existing request; actual closure/erasure requires D-013 review and background owner actions. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-ACC-ROUTE-007-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Already-open deletion request replays existing request; actual closure/erasure requires D-013 review and background owner actions. |

Existing feature assertions: `TC-ACC-06-OK`, `TC-ACC-06-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## ACC-ROUTE-006 — GET `/v1/me/deletion-requests/{requestId}`

**Read own privacy deletion request status.**

| Property | Proposed contract |
| --- | --- |
| API name | Read own privacy deletion request status |
| Version / owner | v1 / Customer_Accounts via Privacy read projection |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-06`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/deletion-requests/{requestId}` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-accounts.read.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

privacy_requests.user_id equals subject; expose safe progress dates, not internal legal notes.

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
| requestId | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is fixed: `not applicable for this singleton`. Pagination: none.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `PrivacyRequestData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `requestId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | compliance.privacy_requests.id; uuid. |
| `requestNumber` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | compliance.privacy_requests.request_number; character varying(64). |
| `requestType` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | compliance.privacy_requests.request_type; character varying(64). |
| `status` | string | Required | No | None (not silently populated) | minLength=1; maxLength=32 | compliance.privacy_requests.status; character varying(32). No closed CHECK enum in table evidence; response uses persisted owner status, not permission for arbitrary transitions. |
| `requestedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | compliance.privacy_requests.requested_at; timestamp with time zone. |
| `dueAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | compliance.privacy_requests.due_at; timestamp with time zone. |
| `completedAt` | string/null (date-time) | Required | Yes | None (not silently populated) | format="date-time" | compliance.privacy_requests.completed_at; timestamp with time zone. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "requestNumber": "PRIV-DEMO-0001",
    "requestType": "request type",
    "status": "received",
    "requestedAt": "2026-10-24T10:30:00Z",
    "dueAt": null,
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
| 422 | `REQUEST_VALIDATION_ERROR` | A declared path/query/header field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for ACC-ROUTE-006. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-accounts.read.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for read own privacy deletion request status. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for ACC-ROUTE-006 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`compliance.privacy_requests`](../../04-Database/Tables/compliance/privacy_requests.md) | Read | `completed_at`, `due_at`, `id`, `request_number`, `request_type`, `requested_at`, `row_version`, `status`, `user_id` | Privacy / Compliance owner projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.requestId | compliance.privacy_requests.id |
| data.requestNumber | compliance.privacy_requests.request_number |
| data.requestType | compliance.privacy_requests.request_type |
| data.status | compliance.privacy_requests.status |
| data.requestedAt | compliance.privacy_requests.requested_at |
| data.dueAt | compliance.privacy_requests.due_at |
| data.completedAt | compliance.privacy_requests.completed_at |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | privacy_requests.user_id equals subject; expose safe progress dates, not internal legal notes. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Foreign request is 404; pending review never appears as completed erasure. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-ACC-ROUTE-006-HAPPY` | Valid Customer context and documented fixture for read own privacy deletion request status. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-ACC-ROUTE-006-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-ACC-ROUTE-006-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-ACC-ROUTE-006-SCOPE` | Use another customer/site/patient/task reference or remove customer-accounts.read.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-ACC-ROUTE-006-RULE` | privacy_requests.user_id equals subject; expose safe progress dates, not internal legal notes. | Foreign request is 404; pending review never appears as completed erasure. |
| `CT-ACC-ROUTE-006-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-ACC-ROUTE-006-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-ACC-ROUTE-006-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-ACC-ROUTE-006-RECOVERY` | Dependency timeout during read own privacy deletion request status. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-ACC-06-OK`, `TC-ACC-06-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## ACC-ROUTE-003 — PATCH `/v1/me/patients/{patientId}`

**Edit demographic attributes of an owned family association.**

| Property | Proposed contract |
| --- | --- |
| API name | Edit demographic attributes of an owned family association |
| Version / owner | v1 / Customer_Accounts |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-04`; [WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/patients/{patientId}` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-accounts.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Match association expectedVersion; no future date of birth, no linked_user_id or guardian escalation. Existing clinical/order evidence retains historical identity; material changes trigger revalidation before new P work.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_acc-route-003_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Not Applicable | Omit | Use the named body version fields where present; no competing header precondition. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| patientId | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

DTO: `FamilyMemberPatch`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `expectedVersion` | integer | Required | No | None (not silently populated) | minimum=1 | customer.family_members.row_version |
| `name` | string | Optional | No | None (not silently populated) | maxLength=150 | Public DTO value from customer.family_members.name. Ownership and current-state checks apply before use. |
| `relationship` | string | Optional | No | None (not silently populated) | enum=["self", "spouse", "parent", "child", "other"]; maxLength=64 | Business association label, proposed allowlist self/spouse/parent/child/other; does not confer clinical or legal authority. |
| `dateOfBirth` | string/null (date) | Optional | Yes | None (not silently populated) | format="date" | Public DTO value from customer.family_members.date_of_birth. Ownership and current-state checks apply before use. |
| `gender` | string/null | Optional | Yes | None (not silently populated) | maxLength=32 | Public DTO value from customer.family_members.gender. Ownership and current-state checks apply before use. |


```json
{
  "expectedVersion": 1,
  "name": "Example personal care item",
  "relationship": "parent",
  "dateOfBirth": "1985-04-12",
  "gender": null
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `FamilyMemberData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `id` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from customer.family_members.id. Ownership and current-state checks apply before use. |
| `name` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.family_members.name. Ownership and current-state checks apply before use. |
| `relationship` | string | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.family_members.relationship. Ownership and current-state checks apply before use. |
| `dateOfBirth` | string/null (date) | Optional | Yes | None (not silently populated) | format="date" | Public DTO value from customer.family_members.date_of_birth. Ownership and current-state checks apply before use. |
| `gender` | string/null | Optional | Yes | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.family_members.gender. Ownership and current-state checks apply before use. |
| `isDependent` | boolean | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | Public DTO value from customer.family_members.is_dependent. Ownership and current-state checks apply before use. |
| `rowVersion` | integer | Required | No | None (not silently populated) | minimum=1 | Public DTO value from customer.family_members.row_version. Ownership and current-state checks apply before use. |
| `patientId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | clinical.patient_profiles.id after Intake linkage, otherwise null; API-008 may return pending linkage. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "id": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "name": "Example personal care item",
    "relationship": "parent",
    "dateOfBirth": "1985-04-12",
    "gender": null,
    "isDependent": true,
    "rowVersion": 1,
    "patientId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for ACC-ROUTE-003. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-accounts.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for edit demographic attributes of an owned family association. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Match association expectedVersion; no future date of birth, no linked_user_id or guardian escalation. Existing clinical/order evidence retains historical identity; material changes trigger revalidation before new P work. | No unauthorized/partial domain effect; redact sensitive context. | Another customer patient is 404; a stale update does not rewrite clinical history. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `STALE_VERSION` | An expected aggregate/row version no longer matches current committed state. | No unauthorized/partial domain effect; redact sensitive context. | Reload the current edit demographic attributes of an owned family association. context and re-evaluate; no partial mutation. |
| 409 | `INVALID_STATE_TRANSITION` | Another customer patient is 404; a stale update does not rewrite clinical history. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for ACC-ROUTE-003 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`customer.family_members`](../../04-Database/Tables/customer/family_members.md) | Read | `customer_user_id`, `date_of_birth`, `gender`, `id`, `is_deleted`, `is_dependent`, `name`, `relationship`, `row_version` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md) | Read | `family_member_id`, `id`, `is_deleted`, `row_version`, `user_id` | Prescription_Upload / Intake projection / scoped joins; reading does not grant writes. |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`customer.family_members`](../../04-Database/Tables/customer/family_members.md) | Create/update evidence | `name`, `relationship`, `date_of_birth`, `gender` | Customer_Accounts owns these writes; Customer_Accounts must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.expectedVersion | customer.family_members.row_version |
| request.name | customer.family_members.name |
| request.relationship | customer.family_members.relationship |
| request.dateOfBirth | customer.family_members.date_of_birth |
| request.gender | customer.family_members.gender |
| data.id | customer.family_members.id |
| data.name | customer.family_members.name |
| data.relationship | customer.family_members.relationship |
| data.dateOfBirth | customer.family_members.date_of_birth |
| data.gender | customer.family_members.gender |
| data.isDependent | customer.family_members.is_dependent |
| data.rowVersion | customer.family_members.row_version |
| data.patientId | clinical.patient_profiles.id |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Match association expectedVersion; no future date of birth, no linked_user_id or guardian escalation. Existing clinical/order evidence retains historical identity; material changes trigger revalidation before new P work. |
| Idempotency | Required key: scope actor + ACC-ROUTE-003 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Another customer patient is 404; a stale update does not rewrite clinical history. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-ACC-ROUTE-003-HAPPY` | Valid Customer context and documented fixture for edit demographic attributes of an owned family association. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-ACC-ROUTE-003-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-ACC-ROUTE-003-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-ACC-ROUTE-003-SCOPE` | Use another customer/site/patient/task reference or remove customer-accounts.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-ACC-ROUTE-003-RULE` | Match association expectedVersion; no future date of birth, no linked_user_id or guardian escalation. Existing clinical/order evidence retains historical identity; material changes trigger revalidation before new P work. | Another customer patient is 404; a stale update does not rewrite clinical history. |
| `CT-ACC-ROUTE-003-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-ACC-ROUTE-003-CONCURRENCY` | Race two edit demographic attributes of an owned family association. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-ACC-ROUTE-003-STATE` | Apply command after Another customer patient is 404; a stale update does not rewrite clinical history. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-ACC-ROUTE-003-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Another customer patient is 404; a stale update does not rewrite clinical history. |

Existing feature assertions: `TC-ACC-04-OK`, `TC-ACC-04-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## ACC-ROUTE-004 — DELETE `/v1/me/patients/{patientId}`

**Soft-remove a family association while retaining patient evidence.**

| Property | Proposed contract |
| --- | --- |
| API name | Soft-remove a family association while retaining patient evidence |
| Version / owner | v1 / Customer_Accounts |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-04`; [WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/patients/{patientId}` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-accounts.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

If-Match matches association row_version; ownership from customer_user_id. Do not delete clinical.patient_profiles or historical prescriptions/orders; reject while active order linkage requires the association pending reviewed closure.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Not Applicable | Omit | No request body. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_acc-route-004_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Required | "4" | Current row_version for deletion. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| patientId | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **204**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. No Content-Type/body for 204.

No response DTO, JSON or pagination metadata: bodyless 204.

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 422 | `REQUEST_VALIDATION_ERROR` | A declared path/query/header field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for ACC-ROUTE-004. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-accounts.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for soft-remove a family association while retaining patient evidence. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | If-Match matches association row_version; ownership from customer_user_id. Do not delete clinical.patient_profiles or historical prescriptions/orders; reject while active order linkage requires the association pending reviewed closure. | No unauthorized/partial domain effect; redact sensitive context. | Active protected use is 409; stale ETag is 412. Replay is original bodyless 204. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 428 | `PRECONDITION_REQUIRED` | If-Match was omitted for conditional removal. | No unauthorized/partial domain effect; redact sensitive context. | Fetch own resource version and supply strong If-Match. |
| 412 | `PRECONDITION_FAILED` | If-Match is stale for this exact resource. | No unauthorized/partial domain effect; redact sensitive context. | Reload; compare before issuing a new delete intent. |
| 409 | `INVALID_STATE_TRANSITION` | Active protected use is 409; stale ETag is 412. Replay is original bodyless 204. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for ACC-ROUTE-004 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`customer.family_members`](../../04-Database/Tables/customer/family_members.md) | Read | `customer_user_id`, `id`, `is_deleted`, `row_version` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md) | Read | `family_member_id`, `id`, `is_deleted`, `row_version`, `user_id` | Prescription_Upload / Intake projection / scoped joins; reading does not grant writes. |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Read | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | Order_Operations projection / scoped joins; reading does not grant writes. |
| [`customer.family_members`](../../04-Database/Tables/customer/family_members.md) | Create/update evidence | `is_deleted`, `deleted_at`, `deleted_by` | Customer_Accounts owns these writes; Customer_Accounts must invoke that narrow owner command. |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | If-Match matches association row_version; ownership from customer_user_id. Do not delete clinical.patient_profiles or historical prescriptions/orders; reject while active order linkage requires the association pending reviewed closure. |
| Idempotency | Required key: scope actor + ACC-ROUTE-004 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | If-Match strong quoted row_version; missing 428, stale 412; lock owner row. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Active protected use is 409; stale ETag is 412. Replay is original bodyless 204. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-ACC-ROUTE-004-HAPPY` | Valid Customer context and documented fixture for soft-remove a family association while retaining patient evidence. | HTTP 204; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-ACC-ROUTE-004-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-ACC-ROUTE-004-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-ACC-ROUTE-004-SCOPE` | Use another customer/site/patient/task reference or remove customer-accounts.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-ACC-ROUTE-004-RULE` | If-Match matches association row_version; ownership from customer_user_id. Do not delete clinical.patient_profiles or historical prescriptions/orders; reject while active order linkage requires the association pending reviewed closure. | Active protected use is 409; stale ETag is 412. Replay is original bodyless 204. |
| `CT-ACC-ROUTE-004-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-ACC-ROUTE-004-CONCURRENCY` | Race two soft-remove a family association while retaining patient evidence. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-ACC-ROUTE-004-STATE` | Apply command after Active protected use is 409; stale ETag is 412. Replay is original bodyless 204. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-ACC-ROUTE-004-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Active protected use is 409; stale ETag is 412. Replay is original bodyless 204. |

Existing feature assertions: `TC-ACC-04-OK`, `TC-ACC-04-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## ACC-ROUTE-008 — GET `/v1/me/wishlist/items`

**List the owned default wishlist’s product references.**

| Property | Proposed contract |
| --- | --- |
| API name | List the owned default wishlist’s product references |
| Version / owner | v1 / Customer_Accounts |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-07`; [WF-002](../../06-Workflows/WF-002-Search-and-Availability.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/wishlist/items` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-accounts.read.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Resolve default wishlist by subject; no wishlist means empty items. Do not leak unpublished product details or private notes.

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


Only declared query fields are accepted. Sorting is fixed: `created_at DESC, id ASC`. Pagination: cursor.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `WishlistData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `items` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `items[].itemId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | customer.wishlist_items.id; uuid. |
| `items[].productId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | customer.wishlist_items.product_id; uuid. |
| `items[].createdAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | customer.wishlist_items.created_at; timestamp with time zone. |


Pagination metadata: `nextCursor: string/null`, `hasNext: boolean`; opaque cursor is bound to principal, filters and fixed ordering. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "itemId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "createdAt": "2026-10-24T10:30:00Z"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for ACC-ROUTE-008. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-accounts.read.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for ACC-ROUTE-008 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`customer.wishlists`](../../04-Database/Tables/customer/wishlists.md) | Read | `id`, `is_deleted`, `row_version`, `user_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`customer.wishlist_items`](../../04-Database/Tables/customer/wishlist_items.md) | Read | `created_at`, `id`, `product_id`, `row_version`, `wishlist_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Read | `id`, `is_deleted`, `row_version`, `status` | Product_Catalog projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.items[].itemId | customer.wishlist_items.id |
| data.items[].productId | customer.wishlist_items.product_id |
| data.items[].createdAt | customer.wishlist_items.created_at |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`catalog.brands`](../../04-Database/Tables/catalog/brands.md), [`catalog.categories`](../../04-Database/Tables/catalog/categories.md), [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md), [`catalog.dosage_forms`](../../04-Database/Tables/catalog/dosage_forms.md), [`catalog.manufacturers`](../../04-Database/Tables/catalog/manufacturers.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Resolve default wishlist by subject; no wishlist means empty items. Do not leak unpublished product details or private notes. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | cursor; created_at DESC, id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Foreign wishlist cannot be selected by cursor; unavailable products may retain opaque owned reference only. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-ACC-ROUTE-008-HAPPY` | Valid Customer context and documented fixture for list the owned default wishlist’s product references. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-ACC-ROUTE-008-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-ACC-ROUTE-008-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-ACC-ROUTE-008-SCOPE` | Use another customer/site/patient/task reference or remove customer-accounts.read.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-ACC-ROUTE-008-RULE` | Resolve default wishlist by subject; no wishlist means empty items. Do not leak unpublished product details or private notes. | Foreign wishlist cannot be selected by cursor; unavailable products may retain opaque owned reference only. |
| `CT-ACC-ROUTE-008-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-ACC-ROUTE-008-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-ACC-ROUTE-008-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-ACC-ROUTE-008-RECOVERY` | Dependency timeout during list the owned default wishlist’s product references. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-ACC-07-OK`, `TC-ACC-07-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## ACC-ROUTE-009 — POST `/v1/me/wishlist/items`

**Add one published product to the owned default wishlist.**

| Property | Proposed contract |
| --- | --- |
| API name | Add one published product to the owned default wishlist |
| Version / owner | v1 / Customer_Accounts |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-07`; [WF-002](../../06-Workflows/WF-002-Search-and-Availability.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/wishlist/items` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-accounts.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Create default wishlist under per-user lock when absent; product must be published. Existing product association returns same item, not duplicate.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_acc-route-009_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `WishlistItemCreate`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `productId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from catalog.products.id. Ownership and current-state checks apply before use. |


```json
{
  "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **201**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `WishlistItemData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `itemId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | customer.wishlist_items.id; uuid. |
| `productId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | customer.wishlist_items.product_id; uuid. |
| `createdAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | customer.wishlist_items.created_at; timestamp with time zone. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "itemId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "createdAt": "2026-10-24T10:30:00Z"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for ACC-ROUTE-009. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-accounts.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for add one published product to the owned default wishlist. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Create default wishlist under per-user lock when absent; product must be published. Existing product association returns same item, not duplicate. | No unauthorized/partial domain effect; redact sensitive context. | Same product/new key is deduplicated by wishlist/product invariant; unavailable product is 404. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Same product/new key is deduplicated by wishlist/product invariant; unavailable product is 404. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for ACC-ROUTE-009 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`customer.wishlists`](../../04-Database/Tables/customer/wishlists.md) | Read | `id`, `is_deleted`, `row_version`, `user_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`customer.wishlist_items`](../../04-Database/Tables/customer/wishlist_items.md) | Read | `created_at`, `id`, `product_id`, `row_version`, `wishlist_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Read | `id`, `is_deleted`, `row_version`, `status` | Product_Catalog projection / scoped joins; reading does not grant writes. |
| [`customer.wishlists`](../../04-Database/Tables/customer/wishlists.md) | Create/update evidence | `user_id`, `name`, `is_default` | Customer_Accounts owns these writes; Customer_Accounts must invoke that narrow owner command. |
| [`customer.wishlist_items`](../../04-Database/Tables/customer/wishlist_items.md) | Create/update evidence | `wishlist_id`, `product_id` | Customer_Accounts owns these writes; Customer_Accounts must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.productId | catalog.products.id |
| data.itemId | customer.wishlist_items.id |
| data.productId | customer.wishlist_items.product_id |
| data.createdAt | customer.wishlist_items.created_at |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.brands`](../../04-Database/Tables/catalog/brands.md), [`catalog.categories`](../../04-Database/Tables/catalog/categories.md), [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md), [`catalog.dosage_forms`](../../04-Database/Tables/catalog/dosage_forms.md), [`catalog.manufacturers`](../../04-Database/Tables/catalog/manufacturers.md), [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Create default wishlist under per-user lock when absent; product must be published. Existing product association returns same item, not duplicate. |
| Idempotency | Required key: scope actor + ACC-ROUTE-009 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Same product/new key is deduplicated by wishlist/product invariant; unavailable product is 404. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-ACC-ROUTE-009-HAPPY` | Valid Customer context and documented fixture for add one published product to the owned default wishlist. | HTTP 201; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-ACC-ROUTE-009-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-ACC-ROUTE-009-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-ACC-ROUTE-009-SCOPE` | Use another customer/site/patient/task reference or remove customer-accounts.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-ACC-ROUTE-009-RULE` | Create default wishlist under per-user lock when absent; product must be published. Existing product association returns same item, not duplicate. | Same product/new key is deduplicated by wishlist/product invariant; unavailable product is 404. |
| `CT-ACC-ROUTE-009-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-ACC-ROUTE-009-CONCURRENCY` | Race two add one published product to the owned default wishlist. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-ACC-ROUTE-009-STATE` | Apply command after Same product/new key is deduplicated by wishlist/product invariant; unavailable product is 404. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-ACC-ROUTE-009-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Same product/new key is deduplicated by wishlist/product invariant; unavailable product is 404. |

Existing feature assertions: `TC-ACC-07-OK`, `TC-ACC-07-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## ACC-ROUTE-010 — DELETE `/v1/me/wishlist/items/{itemId}`

**Remove one owned wishlist item idempotently.**

| Property | Proposed contract |
| --- | --- |
| API name | Remove one owned wishlist item idempotently |
| Version / owner | v1 / Customer_Accounts |
| Consumer | Customer |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `ACC-07`; [WF-002](../../06-Workflows/WF-002-Search-and-Availability.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/me/wishlist/items/{itemId}` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer | customer-accounts.manage.own (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. Require referenced customer resources to belong to the subject; patient access additionally requires the explicit owned dependent association. Foreign records return privacy-safe 404.

Join item.wishlist_id to subject-owned wishlist; require If-Match row_version. Delete only the association row under ID/version predicate; this table has no soft-delete columns. Keep redacted removal audit and never alter catalog product.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Not Applicable | Omit | No request body. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_acc-route-010_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
| If-Match | strong ETag | Required | "4" | Current row_version for deletion. |
| X-Request-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Validate or generate; safe tracing only. |
| X-Correlation-ID | UUID | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcdf | Propagate workflow correlation. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Not a provider callback. |


Transport failures: 400 BAD_REQUEST for malformed JSON/UUID trace headers, 406 NOT_ACCEPTABLE for unsupported Accept, 415 UNSUPPORTED_MEDIA_TYPE for an unsupported body media type. No business mutation occurs before validation. These transport outcomes are also declared in OpenAPI.

### Path parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| itemId | string (uuid) | Required | No | None | format="uuid" | Public UUID or approved opaque identifier; never an internal BIGINT authorization reference. |


### Query parameters

Not Applicable. No parameters in this location.


Only declared query fields are accepted. Sorting is Not Applicable for this command. Pagination: none.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **204**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. No Content-Type/body for 204.

No response DTO, JSON or pagination metadata: bodyless 204.

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 422 | `REQUEST_VALIDATION_ERROR` | A declared path/query/header field violates its typed contract. | No unauthorized/partial domain effect; redact sensitive context. | Correct the named fields; do not retry unchanged. |
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for ACC-ROUTE-010. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks customer-accounts.manage.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for remove one owned wishlist item idempotently. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Join item.wishlist_id to subject-owned wishlist; require If-Match row_version. Delete only the association row under ID/version predicate; this table has no soft-delete columns. Keep redacted removal audit and never alter catalog product. | No unauthorized/partial domain effect; redact sensitive context. | Foreign item is 404, changed item version is 412; same key replay is 204 without JSON. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 428 | `PRECONDITION_REQUIRED` | If-Match was omitted for conditional removal. | No unauthorized/partial domain effect; redact sensitive context. | Fetch own resource version and supply strong If-Match. |
| 412 | `PRECONDITION_FAILED` | If-Match is stale for this exact resource. | No unauthorized/partial domain effect; redact sensitive context. | Reload; compare before issuing a new delete intent. |
| 409 | `INVALID_STATE_TRANSITION` | Foreign item is 404, changed item version is 412; same key replay is 204 without JSON. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for ACC-ROUTE-010 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`customer.wishlists`](../../04-Database/Tables/customer/wishlists.md) | Read | `id`, `is_deleted`, `row_version`, `user_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`customer.wishlist_items`](../../04-Database/Tables/customer/wishlist_items.md) | Read | `id`, `row_version`, `wishlist_id` | Customer_Accounts projection / scoped joins; reading does not grant writes. |
| [`customer.wishlist_items`](../../04-Database/Tables/customer/wishlist_items.md) | Delete association | `id`, `row_version` | Customer_Accounts owns these writes; Customer_Accounts must invoke that narrow owner command. |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`catalog.products`](../../04-Database/Tables/catalog/products.md), [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Join item.wishlist_id to subject-owned wishlist; require If-Match row_version. Delete only the association row under ID/version predicate; this table has no soft-delete columns. Keep redacted removal audit and never alter catalog product. |
| Idempotency | Required key: scope actor + ACC-ROUTE-010 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | If-Match strong quoted row_version; missing 428, stale 412; lock owner row. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Foreign item is 404, changed item version is 412; same key replay is 204 without JSON. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-ACC-ROUTE-010-HAPPY` | Valid Customer context and documented fixture for remove one owned wishlist item idempotently. | HTTP 204; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-ACC-ROUTE-010-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-ACC-ROUTE-010-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-ACC-ROUTE-010-SCOPE` | Use another customer/site/patient/task reference or remove customer-accounts.manage.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-ACC-ROUTE-010-RULE` | Join item.wishlist_id to subject-owned wishlist; require If-Match row_version. Delete only the association row under ID/version predicate; this table has no soft-delete columns. Keep redacted removal audit and never alter catalog product. | Foreign item is 404, changed item version is 412; same key replay is 204 without JSON. |
| `CT-ACC-ROUTE-010-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-ACC-ROUTE-010-CONCURRENCY` | Race two remove one owned wishlist item idempotently. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-ACC-ROUTE-010-STATE` | Apply command after Foreign item is 404, changed item version is 412; same key replay is 204 without JSON. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-ACC-ROUTE-010-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Foreign item is 404, changed item version is 412; same key replay is 204 without JSON. |

Existing feature assertions: `TC-ACC-07-OK`, `TC-ACC-07-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
