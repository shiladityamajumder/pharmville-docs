# Authentication Access API contracts

**Proposed technical blueprint · Unapproved · Not Implemented.** Contract completeness is independent of approval and runtime evidence. [Coverage](../../05-APIs/API-Contract-Coverage.md) · [OpenAPI 3.1](../../05-APIs/openapi.yaml) · [decisions](../../05-APIs/Planning-Decisions.md) · [DTO conventions](../../05-APIs/API-Conventions.md). Every CT scenario is Designed / NOT RUN.

<a id="authentication-and-access-api-contracts"></a>
<a id="api-089--post-v1authstafflogin"></a>
<a id="api-090--post-v1authstaffmfaverify"></a>
<a id="api-091--post-v1authsessionsrefresh"></a>
<a id="api-092--post-v1authsessionsrevoke"></a>
<a id="api-093--get-v1authpermissions"></a>
<a id="persistence-transactions-and-failures"></a>
<a id="required-verification"></a>

## Operation index

| API ID | Method/path | Purpose | Documentation status |
| --- | --- | --- | --- |
| API-089 | `POST /v1/auth/staff/login` | Validate staff credentials and issue a purpose-bound MFA challenge. | Incomplete — D-003: challenge replay prevention and exact MFA enrollment/recovery/session-limits policy require reviewed persistence/credential design. |
| API-090 | `POST /v1/auth/staff/mfa/verify` | Complete staff MFA and rotate the permitted active session. | Incomplete — D-003: exact single-use authenticator/challenge persistence is absent in schema documentation. |
| API-091 | `POST /v1/auth/sessions/refresh` | Rotate a valid unrevoked refresh credential and access session. | Complete proposed |
| API-092 | `POST /v1/auth/sessions/revoke` | Revoke one session owned by the authenticated actor. | Complete proposed |
| API-093 | `GET /v1/auth/permissions` | Read the actor’s currently effective scoped permissions. | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| AUTH-01 | Password + authenticator 2FA for Super Admin, Central Admin, Finance Manager | API-089, API-090 |
| AUTH-02 | Lockout rules, session limits, one session per staff account | API-089, API-090, API-091, API-092 |
| AUTH-03 | OTP rate limits per number and IP | No direct operation; see [journey/API gaps](../../05-APIs/Journey-API-Gaps.md). Existing requirement retained; no invented CRUD completion. |
| AUTH-04 | Permissions checked on the server for every request | API-093 |

## API-089 — POST `/v1/auth/staff/login`

**Validate staff credentials and issue a purpose-bound MFA challenge.**

| Property | Proposed contract |
| --- | --- |
| API name | Validate staff credentials and issue a purpose-bound MFA challenge |
| Version / owner | v1 / Authentication_Access |
| Consumer | Public pre-login Staff |
| Status | Documentation Incomplete; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `AUTH-01`, `AUTH-02`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/auth/staff/login` (placeholder host from existing OpenAPI; no deployment asserted) |


**Remaining contract gap:** D-003: challenge replay prevention and exact MFA enrollment/recovery/session-limits policy require reviewed persistence/credential design.

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| NO | None (purpose-bound pre-login proof where supplied) | Public pre-login Staff | Credential proof; no existing role claim (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. No existing bearer required; validate supplied proof purpose/expiry and throttle without account enumeration.

No existing bearer required. Verify password hash and active account; privileged Super Admin/Central Admin/Finance Manager require authenticator MFA. Challenge is signed API-only state, bound to existing factor/user version/expiry, not a completed session.

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

DTO: `StaffLoginRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `email` | string (email) | Required | No | None (not silently populated) | format="email"; minLength=1; maxLength=320 | Normalized staff identifier. |
| `password` | string | Required | No | None (not silently populated) | minLength=1; maxLength=1024 | Write-only secret; never logged or echoed. |


```json
{
  "email": "asha@example.invalid",
  "password": "SyntheticPasswordForExampleOnly"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `StaffChallengeData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `challengeToken` | string | Required | No | None (not silently populated) | minLength=1; maxLength=4096 | Signed purpose-bound token referencing user/factor/version; no standalone MFA challenge table is assumed. |
| `nextAction` | string | Required | No | None (not silently populated) | enum=["verify_authenticator"] | API-only workflow projection from current domain states; no universal database enum. |
| `expiresAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | Typed expiresAt projection; resolved by Validate staff credentials and issue a purpose-bound MFA challenge. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "challengeToken": "pv_mfa_7m3K9r2P6x4V8q1L",
    "nextAction": "verify_authenticator",
    "expiresAt": "2026-10-24T10:30:00Z"
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
| 422 | `VALIDATION_ERROR` | No existing bearer required. Verify password hash and active account; privileged Super Admin/Central Admin/Finance Manager require authenticator MFA. Challenge is signed API-only state, bound to existing factor/user version/expiry, not a completed session. | No unauthorized/partial domain effect; redact sensitive context. | Unknown email/wrong password uses neutral 401; rate/lockout policy D-003 applies without account enumeration. No session before successful MFA. |
| 409 | `INVALID_STATE_TRANSITION` | Unknown email/wrong password uses neutral 401; rate/lockout policy D-003 applies without account enumeration. No session before successful MFA. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-089 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |
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
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Read | `created_by`, `email`, `id`, `row_version`, `status`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.mfa_factors`](../../04-Database/Tables/identity/mfa_factors.md) | Read | `created_by`, `id`, `row_version`, `updated_by`, `user_id` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | Read | `created_by`, `id`, `is_active`, `role_id`, `row_version`, `updated_by`, `user_id`, `valid_from`, `valid_until` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | Read | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Create/update evidence | `failed_login_count`, `locked_until` | Authentication_Access owns these writes; Authentication_Access must invoke that narrow owner command. |
| [`identity.login_attempts`](../../04-Database/Tables/identity/login_attempts.md) | Create/update evidence | `user_id`, `login_identifier_hash`, `success`, `failure_code`, `request_id`, `ip_address`, `user_agent` | Authentication_Access owns these writes; Authentication_Access must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.email | identity.users.email |
| request.password | Write-only proof against identity.users.password_hash; no direct client write. |
| data.challengeToken | API-only signed MFA capability; durable replay design is an explicit blocker. |
| data.nextAction | API-only workflow projection from current domain states; no universal database enum. |
| data.expiresAt | Typed expiresAt projection; resolved by Validate staff credentials and issue a purpose-bound MFA challenge. |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | No existing bearer required. Verify password hash and active account; privileged Super Admin/Central Admin/Finance Manager require authenticator MFA. Challenge is signed API-only state, bound to existing factor/user version/expiry, not a completed session. |
| Idempotency | No generic key: single-use proof/rotating credential replay is validated by the identity owner. Never cache bearer/refresh secrets in idempotency_keys. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 5 proof/refresh attempts per minute per challenge/session and origin, plus approved lockout/attempt policy D-003. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Unknown email/wrong password uses neutral 401; rate/lockout policy D-003 applies without account enumeration. No session before successful MFA. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-089-HAPPY` | Valid Public pre-login Staff context and documented fixture for validate staff credentials and issue a purpose-bound mfa challenge. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-089-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-089-AUTH` | Call without bearer, then supply invalid purpose-bound proof if this operation accepts one. | Public operation must not require bearer; invalid proof never establishes a session. |
| `CT-API-089-SCOPE` | Use another customer/site/patient/task reference or remove Credential proof; no existing role claim. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-089-RULE` | No existing bearer required. Verify password hash and active account; privileged Super Admin/Central Admin/Finance Manager require authenticator MFA. Challenge is signed API-only state, bound to existing factor/user version/expiry, not a completed session. | Unknown email/wrong password uses neutral 401; rate/lockout policy D-003 applies without account enumeration. No session before successful MFA. |
| `CT-API-089-DUPLICATE` | Replay consumed/rotated proof. | No second session/effect; honor identity/provider replay policy. |
| `CT-API-089-CONCURRENCY` | Race two validate staff credentials and issue a purpose-bound mfa challenge. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-089-STATE` | Apply command after Unknown email/wrong password uses neutral 401; rate/lockout policy D-003 applies without account enumeration. No session before successful MFA. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-089-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Unknown email/wrong password uses neutral 401; rate/lockout policy D-003 applies without account enumeration. No session before successful MFA. |

Existing feature assertions: `TC-AUTH-01-OK`, `TC-AUTH-01-DENY`, `TC-AUTH-02-OK`, `TC-AUTH-02-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-090 — POST `/v1/auth/staff/mfa/verify`

**Complete staff MFA and rotate the permitted active session.**

| Property | Proposed contract |
| --- | --- |
| API name | Complete staff MFA and rotate the permitted active session |
| Version / owner | v1 / Authentication_Access |
| Consumer | Public Staff with pending MFA proof |
| Status | Documentation Incomplete; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `AUTH-01`, `AUTH-02`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/auth/staff/mfa/verify` (placeholder host from existing OpenAPI; no deployment asserted) |


**Remaining contract gap:** D-003: exact single-use authenticator/challenge persistence is absent in schema documentation.

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| NO | None (purpose-bound pre-login proof where supplied) | Public Staff with pending MFA proof | Valid MFA challenge + authenticator proof (Proposed grant code) |


Resolve the subject and effective action grant on the server; all supplied UUIDs are references, never authorization proof. No existing bearer required; validate supplied proof purpose/expiry and throttle without account enumeration.

Validate challenge signature/purpose/user/factor/version and configured authenticator window. Enforce documented single staff session and revoke replaced sessions. Authenticator code/challenge replay needs durable reviewed evidence.

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

DTO: `StaffMfaRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `challengeToken` | string | Required | No | None (not silently populated) | minLength=1; maxLength=4096 | Purpose-bound challenge from API-089. |
| `authenticatorCode` | string | Required | No | None (not silently populated) | minLength=1; maxLength=8; pattern="^[0-9]{6,8}$" | Write-only code; format and clock skew are Security policy. |


```json
{
  "challengeToken": "pv_mfa_7m3K9r2P6x4V8q1L",
  "authenticatorCode": "583914"
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
| 422 | `VALIDATION_ERROR` | Validate challenge signature/purpose/user/factor/version and configured authenticator window. Enforce documented single staff session and revoke replaced sessions. Authenticator code/challenge replay needs durable reviewed evidence. | No unauthorized/partial domain effect; redact sensitive context. | Invalid MFA never creates session; concurrent accepted proof must not establish two active staff sessions. |
| 409 | `INVALID_STATE_TRANSITION` | Invalid MFA never creates session; concurrent accepted proof must not establish two active staff sessions. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-090 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |
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
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Read | `created_by`, `id`, `row_version`, `status`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.mfa_factors`](../../04-Database/Tables/identity/mfa_factors.md) | Read | `created_by`, `id`, `row_version`, `updated_by`, `user_id` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | Read | `created_by`, `expires_at`, `id`, `refresh_token_hash`, `revoked_at`, `row_version`, `token_family_id`, `updated_by`, `user_id` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | Read | `created_by`, `id`, `is_active`, `row_version`, `updated_by`, `user_id`, `valid_from`, `valid_until` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | Create/update evidence | `user_id`, `refresh_token_hash`, `token_family_id`, `expires_at`, `revoked_at`, `revoke_reason` | Authentication_Access owns these writes; Authentication_Access must invoke that narrow owner command. |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Create/update evidence | `last_login_at`, `failed_login_count`, `locked_until` | Authentication_Access owns these writes; Authentication_Access must invoke that narrow owner command. |
| [`identity.login_attempts`](../../04-Database/Tables/identity/login_attempts.md) | Create/update evidence | `user_id`, `login_identifier_hash`, `success`, `failure_code`, `request_id` | Authentication_Access owns these writes; Authentication_Access must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.challengeToken | API-only signed MFA capability; durable replay design is an explicit blocker. |
| request.authenticatorCode | Write-only proof checked using encrypted MFA factor; no cleartext log/storage. |
| data.accessToken | API-only signed access JWT; never a persisted cleartext database field. |
| data.tokenType | API transport constant Bearer. |
| data.expiresIn | API-only configured JWT lifetime, checked against session expiry. |
| data.refreshToken | Secret compared to identity.sessions.refresh_token_hash; rotate, never store cleartext. |
| data.sessionId | identity.sessions.id |
| data.userId | identity.users.id |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Validate challenge signature/purpose/user/factor/version and configured authenticator window. Enforce documented single staff session and revoke replaced sessions. Authenticator code/challenge replay needs durable reviewed evidence. |
| Idempotency | No generic key: single-use proof/rotating credential replay is validated by the identity owner. Never cache bearer/refresh secrets in idempotency_keys. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 5 proof/refresh attempts per minute per challenge/session and origin, plus approved lockout/attempt policy D-003. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Invalid MFA never creates session; concurrent accepted proof must not establish two active staff sessions. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-090-HAPPY` | Valid Public Staff with pending MFA proof context and documented fixture for complete staff mfa and rotate the permitted active session. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-090-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-090-AUTH` | Call without bearer, then supply invalid purpose-bound proof if this operation accepts one. | Public operation must not require bearer; invalid proof never establishes a session. |
| `CT-API-090-SCOPE` | Use another customer/site/patient/task reference or remove Valid MFA challenge + authenticator proof. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-090-RULE` | Validate challenge signature/purpose/user/factor/version and configured authenticator window. Enforce documented single staff session and revoke replaced sessions. Authenticator code/challenge replay needs durable reviewed evidence. | Invalid MFA never creates session; concurrent accepted proof must not establish two active staff sessions. |
| `CT-API-090-DUPLICATE` | Replay consumed/rotated proof. | No second session/effect; honor identity/provider replay policy. |
| `CT-API-090-CONCURRENCY` | Race two complete staff mfa and rotate the permitted active session. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-090-STATE` | Apply command after Invalid MFA never creates session; concurrent accepted proof must not establish two active staff sessions. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-090-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Invalid MFA never creates session; concurrent accepted proof must not establish two active staff sessions. |

Existing feature assertions: `TC-AUTH-01-OK`, `TC-AUTH-01-DENY`, `TC-AUTH-02-OK`, `TC-AUTH-02-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-091 — POST `/v1/auth/sessions/refresh`

**Rotate a valid unrevoked refresh credential and access session.**

| Property | Proposed contract |
| --- | --- |
| API name | Rotate a valid unrevoked refresh credential and access session |
| Version / owner | v1 / Authentication_Access |
| Consumer | Customer / Staff / Rider holding a valid refresh session |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `AUTH-02`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/auth/sessions/refresh` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | Session (refresh credential in body) | Customer / Staff / Rider holding a valid refresh session | Own refresh session (Proposed grant code) |


Authenticate the refresh capability in the request body, without an access bearer, staff membership or rider shift. Resolve and lock only its authenticated session/family; require valid hash/expiry and eligible linked user. Own refresh proof is the authority, not a caller user/session ID or a separate RBAC grant.

Refresh credential is an authenticated opaque capability carrying a tamper-protected session/family reference plus random nonce; only its hash is persisted. Lock resolved session/family, check hash/expiry/user state and rotate. An authentic previously rotated capability is detectable by its valid reference/signature and noncurrent hash; revoke family under D-003. No access bearer is required and no raw refresh secret is cached.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Not Applicable | Omit | Refresh proof is in body. |
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

DTO: `SessionRefreshRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `refreshToken` | string | Required | No | None (not silently populated) | minLength=1; maxLength=4096 | Opaque rotating credential; compare hash, never an access JWT requirement. |


```json
{
  "refreshToken": "pv_refresh_Kd9hQ7x4m2V6t8r3"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked Session (refresh credential in body) credential for API-091. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 422 | `VALIDATION_ERROR` | Refresh credential is an authenticated opaque capability carrying a tamper-protected session/family reference plus random nonce; only its hash is persisted. Lock resolved session/family, check hash/expiry/user state and rotate. An authentic previously rotated capability is detectable by its valid reference/signature and noncurrent hash; revoke family under D-003. No access bearer is required and no raw refresh secret is cached. | No unauthorized/partial domain effect; redact sensitive context. | Old/revoked credential is 401. Lost refresh response is handled by reauthentication unless reviewed encrypted replay storage is adopted; never retain a raw refresh secret in generic idempotency response_body. |
| 409 | `INVALID_STATE_TRANSITION` | Old/revoked credential is 401. Lost refresh response is handled by reauthentication unless reviewed encrypted replay storage is adopted; never retain a raw refresh secret in generic idempotency response_body. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-091 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | Read | `created_by`, `expires_at`, `id`, `refresh_token_hash`, `revoked_at`, `row_version`, `token_family_id`, `updated_by`, `user_id` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Read | `created_by`, `id`, `row_version`, `status`, `updated_by` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | Create/update evidence | `refresh_token_hash`, `last_seen_at`, `revoked_at`, `revoke_reason` | Authentication_Access owns these writes; Authentication_Access must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.refreshToken | Secret compared to identity.sessions.refresh_token_hash; rotate, never store cleartext. |
| data.accessToken | API-only signed access JWT; never a persisted cleartext database field. |
| data.tokenType | API transport constant Bearer. |
| data.expiresIn | API-only configured JWT lifetime, checked against session expiry. |
| data.refreshToken | Secret compared to identity.sessions.refresh_token_hash; rotate, never store cleartext. |
| data.sessionId | identity.sessions.id |
| data.userId | identity.users.id |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Refresh credential is an authenticated opaque capability carrying a tamper-protected session/family reference plus random nonce; only its hash is persisted. Lock resolved session/family, check hash/expiry/user state and rotate. An authentic previously rotated capability is detectable by its valid reference/signature and noncurrent hash; revoke family under D-003. No access bearer is required and no raw refresh secret is cached. |
| Idempotency | No generic key: single-use proof/rotating credential replay is validated by the identity owner. Never cache bearer/refresh secrets in idempotency_keys. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 5 proof/refresh attempts per minute per challenge/session and origin, plus approved lockout/attempt policy D-003. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Old/revoked credential is 401. Lost refresh response is handled by reauthentication unless reviewed encrypted replay storage is adopted; never retain a raw refresh secret in generic idempotency response_body. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-091-HAPPY` | Valid Customer / Staff / Rider holding a valid refresh session context and documented fixture for rotate a valid unrevoked refresh credential and access session. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-091-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-091-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-091-SCOPE` | Use another customer/site/patient/task reference or remove Own refresh session. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-091-RULE` | Refresh credential is an authenticated opaque capability carrying a tamper-protected session/family reference plus random nonce; only its hash is persisted. Lock resolved session/family, check hash/expiry/user state and rotate. An authentic previously rotated capability is detectable by its valid reference/signature and noncurrent hash; revoke family under D-003. No access bearer is required and no raw refresh secret is cached. | Old/revoked credential is 401. Lost refresh response is handled by reauthentication unless reviewed encrypted replay storage is adopted; never retain a raw refresh secret in generic idempotency response_body. |
| `CT-API-091-DUPLICATE` | Replay consumed/rotated proof. | No second session/effect; honor identity/provider replay policy. |
| `CT-API-091-CONCURRENCY` | Race two rotate a valid unrevoked refresh credential and access session. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-091-STATE` | Apply command after Old/revoked credential is 401. Lost refresh response is handled by reauthentication unless reviewed encrypted replay storage is adopted; never retain a raw refresh secret in generic idempotency response_body. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-091-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Old/revoked credential is 401. Lost refresh response is handled by reauthentication unless reviewed encrypted replay storage is adopted; never retain a raw refresh secret in generic idempotency response_body. |

Existing feature assertions: `TC-AUTH-02-OK`, `TC-AUTH-02-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-092 — POST `/v1/auth/sessions/revoke`

**Revoke one session owned by the authenticated actor.**

| Property | Proposed contract |
| --- | --- |
| API name | Revoke one session owned by the authenticated actor |
| Version / owner | v1 / Authentication_Access |
| Consumer | Customer / Staff / Rider |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `AUTH-02`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/auth/sessions/revoke` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer / Staff / Rider | identity.sessions.revoke.own (Proposed grant code) |


Authenticate the caller’s access credential and require identity.sessions.user_id to equal that subject. Any customer/staff/rider can revoke their own session without an active rider shift or delivery assignment. This route cannot revoke another user’s sessions.

Session.user_id must equal JWT subject. Already-revoked session is idempotently successful; no arbitrary staff/global revocation through this self route.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer eyJ... (synthetic) | JWT/workload authentication |
| Content-Type | media type | Required | application/json | Declared request JSON media. |
| Accept | media type | Optional | application/json | Defaults to application/json; unsupported media returns 406. |
| Idempotency-Key | string ≤128 | Required | pv_api-092_7m3K9r2P6x4V8q1L | One duplicate-sensitive intent. |
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

DTO: `SessionRevocationRequest`. Reject unknown properties. Required is structural; conditional requirements follow the business rules below. Omission preserves existing values on PATCH; explicit null is accepted only for nullable fields.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `sessionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from identity.sessions.id. Ownership and current-state checks apply before use. |


```json
{
  "sessionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
}
```

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `SessionRevocationData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `sessionId` | string (uuid) | Required | No | None (not silently populated) | format="uuid" | Public DTO value from identity.sessions.id. Ownership and current-state checks apply before use. |
| `revoked` | boolean | Required | No | None (not silently populated) | Typed schema; reject unknown object properties. | API-only acknowledgment of sessions.revoked_at, no boolean column. |
| `revokedAt` | string (date-time) | Required | No | None (not silently populated) | format="date-time" | Public DTO value from identity.sessions.revoked_at. Ownership and current-state checks apply before use. |


`meta.pagination` is null.

```json
{
  "success": true,
  "data": {
    "sessionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
    "revoked": true,
    "revokedAt": "2026-10-24T10:30:00Z"
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-092. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks identity.sessions.revoke.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 404 | `RESOURCE_NOT_FOUND` | Target/reference for revoke one session owned by the authenticated actor. is absent or hidden by ownership. | No unauthorized/partial domain effect; redact sensitive context. | Reload the authorized parent/queue; do not infer another actor’s record. |
| 422 | `VALIDATION_ERROR` | Session.user_id must equal JWT subject. Already-revoked session is idempotently successful; no arbitrary staff/global revocation through this self route. | No unauthorized/partial domain effect; redact sensitive context. | Unknown/foreign session is 404; revocation does not delete session evidence. |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same actor/action/target key has a different canonical request fingerprint. | No unauthorized/partial domain effect; redact sensitive context. | Use a new key only for a deliberately different intent; reconcile previous intent first. |
| 409 | `INVALID_STATE_TRANSITION` | Unknown/foreign session is 404; revocation does not delete session evidence. | No unauthorized/partial domain effect; redact sensitive context. | Refresh authoritative state and follow the owner recovery path. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-092 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Replay the same key to resolve committed outcome; never blindly repeat money/stock. |


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
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | Read | `expires_at`, `id`, `refresh_token_hash`, `revoked_at`, `row_version`, `token_family_id`, `user_id` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | Create/update evidence | `revoked_at`, `revoke_reason` | Authentication_Access owns these writes; Authentication_Access must invoke that narrow owner command. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| request.sessionId | identity.sessions.id |
| data.sessionId | identity.sessions.id |
| data.revoked | API-only acknowledgment of sessions.revoked_at, no boolean column. |
| data.revokedAt | identity.sessions.revoked_at |

**Transaction:** One owner transaction validates current state and persists the stated domain write set plus redacted audit/outbox and permitted replay metadata; commit before network IO. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Replay evidence:** `platform.idempotency_keys(scope, idempotency_key, request_hash, request_metadata, response_code, response_body, expires_at, locked_until)`; purpose-scoped trusted writer. Sensitive credentials/capabilities are excluded from response_body; retain stable references and regenerate permitted short-lived capabilities only within the original session/expiry.

**Audit/outbox:** trusted event writer appends `platform.audit_logs(actor_type, actor_user_id, action, resource_type, resource_id, occurred_at, request_id, metadata_json)` and `platform.outbox_events(aggregate_type, aggregate_id, event_type, event_version, payload, headers, occurred_at, available_at)` in the relevant owner transaction. Payload contains safe references/version/outcome, never secrets or clinical file content. Sending/retrying an event does not repeat the domain command.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Session.user_id must equal JWT subject. Already-revoked session is idempotently successful; no arbitrary staff/global revocation through this self route. |
| Idempotency | Required key: scope actor + API-092 + target, SHA-256 canonical request fingerprint; same key/body returns original status/stable references; changed body returns 409. Expiry is configured to cover the full retry window; keys remain locked while pending. Store no cleartext tokens, OTP, private URL or clinical body in response cache. |
| Optimistic locking / concurrency | Check named expected versions atomically with the owner write; lock aggregate and dependent rows in deterministic table/ID order. No version column is invented; absent row_version uses explicit row lock/current-state predicate. |
| Pagination / filters / sorting | none; Not Applicable for singleton/command; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 30 commands/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed admission deadline 5 seconds; provider/network IO outside DB locks. Deadline after commit may be uncertain: resolve same intent/proof through owner recovery. Separate owner transactions use persisted outbox/saga steps; no distributed atomicity is implied. Unknown/foreign session is 404; revocation does not delete session evidence. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-092-HAPPY` | Valid Customer / Staff / Rider context and documented fixture for revoke one session owned by the authenticated actor. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-092-VALIDATION` | Corrupt a concrete declared request field/enum/version or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-092-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-092-SCOPE` | Use another customer/site/patient/task reference or remove identity.sessions.revoke.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-092-RULE` | Session.user_id must equal JWT subject. Already-revoked session is idempotently successful; no arbitrary staff/global revocation through this self route. | Unknown/foreign session is 404; revocation does not delete session evidence. |
| `CT-API-092-DUPLICATE` | Repeat identical key/body after losing the committed response, then reuse key with changed body. | One domain effect and stable result; changed fingerprint 409 IDEMPOTENCY_KEY_CONFLICT. |
| `CT-API-092-CONCURRENCY` | Race two revoke one session owned by the authenticated actor. intents against the same current row/state. | At most one incompatible effect; stale named version is 409 or stale If-Match 412. No invented row_version where absent. |
| `CT-API-092-STATE` | Apply command after Unknown/foreign session is 404; revocation does not delete session evidence. | Reject invalid progression; preserve existing money/clinical/stock/custody evidence. |
| `CT-API-092-RECOVERY` | Interrupt before commit and after commit/before response; stop downstream owner processing. | Rollback before commit; after commit resolve saved reference and resume only the pending owner/outbox step. Unknown/foreign session is 404; revocation does not delete session evidence. |

Existing feature assertions: `TC-AUTH-02-OK`, `TC-AUTH-02-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.


## API-093 — GET `/v1/auth/permissions`

**Read the actor’s currently effective scoped permissions.**

| Property | Proposed contract |
| --- | --- |
| API name | Read the actor’s currently effective scoped permissions |
| Version / owner | v1 / Authentication_Access |
| Consumer | Customer / Staff / Rider |
| Status | Documentation Complete proposed; approval Unapproved; implementation Not Implemented |
| Requirement / workflow | `AUTH-04`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Design sources | [Module HLD](HLD.md), [LLD](LLD.md), [edge cases](Edge-Cases.md), [ownership](../../07-Engineering/State-and-Recovery-Contracts.md) |
| Environment URL | `https://{environment}.api.pharmville.example/v1/auth/permissions` (placeholder host from existing OpenAPI; no deployment asserted) |


### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Required permission |
| --- | --- | --- | --- |
| YES | JWT | Customer / Staff / Rider | identity.permissions.read.own (Proposed grant code) |


Authenticate the caller and resolve only their effective active role/permission assignments and scope validity. Viewing own permissions does not require a rider shift or task. Returned grants are informational and never authorize future requests by client assertion.

Evaluate active role assignment and validity window; exclude deleted roles/grants. This UI result is informational; every subsequent command independently reauthorizes.

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


Only declared query fields are accepted. Sorting is fixed: `permission code ASC, scope_type ASC, scope_id ASC`. Pagination: offset.

### Request body and uploads

**No request body.** JSON example: Not Applicable.

File upload: **Not Applicable**.

### Success response

HTTP **200**. Headers: `X-Request-ID` UUID, `X-Correlation-ID` UUID, `X-API-Version: v1`, `Cache-Control: no-store`. `Content-Type: application/json`.

Data DTO: `EffectivePermissionListData`. The four required envelope fields and meta nullability follow [Standard Responses](../../05-APIs/Standard-Responses.md). The following table covers every nested data field; pagination is in `meta.pagination`, never mixed into data.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `permissions` | array<object> | Required | No | None (not silently populated) | minItems=0; maxItems=100 | Nested typed projection. |
| `permissions[].permissionCode` | string | Required | No | None (not silently populated) | minLength=1; maxLength=128 | identity.permissions.code; character varying(128). |
| `permissions[].resource` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | identity.permissions.resource; character varying(64). |
| `permissions[].action` | string | Required | No | None (not silently populated) | minLength=1; maxLength=64 | identity.permissions.action; character varying(64). |
| `permissions[].scopeType` | string/null | Required | Yes | None (not silently populated) | minLength=1; maxLength=32 | identity.user_roles.scope_type; character varying(32). |
| `permissions[].scopeId` | string/null (uuid) | Required | Yes | None (not silently populated) | format="uuid" | identity.user_roles.scope_id; uuid. |


Pagination metadata: `totalCount: integer ≥0`, `limit: integer 1–100`, `offset: integer 0–100000`, `hasNext: boolean`. Empty list returns `[]` with hasNext false. No snapshot isolation is promised.

```json
{
  "success": true,
  "data": {
    "permissions": [
      {
        "permissionCode": "code",
        "resource": "resource",
        "action": "action",
        "scopeType": null,
        "scopeId": null
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
| 401 | `AUTHENTICATION_REQUIRED` | Missing/expired/revoked JWT credential for API-093. | No unauthorized/partial domain effect; redact sensitive context. | Renew the appropriate credential; provider signatures use provider recovery, not customer login. |
| 403 | `PERMISSION_DENIED` | Caller lacks identity.permissions.read.own or active permitted organization/site role. | No unauthorized/partial domain effect; redact sensitive context. | Obtain authorized scope through owner; never change IDs to bypass access. |
| 429 | `RATE_LIMIT_EXCEEDED` | The proposed operation/actor/IP budget is exceeded. | No unauthorized/partial domain effect; redact sensitive context. | Honor Retry-After, then bounded backoff with jitter. |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE` | Required database/owner/provider dependency for API-093 is unavailable or deadline exceeded. | No unauthorized/partial domain effect; retain pending committed intent when outcome is uncertain. | Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. |


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
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | Read | `id`, `is_active`, `role_id`, `row_version`, `scope_id`, `scope_type`, `user_id`, `valid_from`, `valid_until` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | Read | `id`, `is_deleted`, `row_version` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.role_permissions`](../../04-Database/Tables/identity/role_permissions.md) | Read | `id`, `permission_id`, `role_id`, `row_version` | Authentication_Access projection / scoped joins; reading does not grant writes. |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | Read | `action`, `code`, `id`, `is_deleted`, `resource`, `row_version` | Authentication_Access projection / scoped joins; reading does not grant writes. |

| DTO field | Persistence mapping or explicit API-only derivation |
| --- | --- |
| data.permissions[].permissionCode | identity.permissions.code |
| data.permissions[].resource | identity.permissions.resource |
| data.permissions[].action | identity.permissions.action |
| data.permissions[].scopeType | identity.user_roles.scope_type |
| data.permissions[].scopeId | identity.user_roles.scope_id |

**Transaction:** Read-only operation: no domain mutation. Security/clinical/file access logging is a separate trusted append-only transaction; GET does not create cart/order/master records. Server fills actual required defaults, public UUIDs, actor/time and row_version only where the table defines them; numeric crosswalk columns remain trigger/DB-owned. Refer to linked structural CHECK/UNIQUE/FK/trigger contracts; no migration or grant is changed.

**Master dependencies:** [`identity.permissions`](../../04-Database/Tables/identity/permissions.md), [`identity.roles`](../../04-Database/Tables/identity/roles.md), [`identity.users`](../../04-Database/Tables/identity/users.md); see [master lifecycle and initial records](../../04-Database/Master-Data-Inventory.md).

### Operational rules

| Concern | Proposed rule |
| --- | --- |
| Business validation / transitions | Evaluate active role assignment and validity window; exclude deleted roles/grants. This UI result is informational; every subsequent command independently reauthorizes. |
| Idempotency | GET retry is safe; no mutation/key. |
| Optimistic locking / concurrency | Not Applicable to this read-only evaluation; read committed owner projections and expose freshness. |
| Pagination / filters / sorting | offset; permission code ASC, scope_type ASC, scope_id ASC; only declared filter fields. Inclusive from/exclusive to, UTC, from<to, proposed maximum report interval 31 days where range filters apply. |
| Rate limit (Proposed, Unapproved) | 120 reads/minute per principal (public reads per origin); scoped internal workloads get a reviewed capability budget. 429 includes Retry-After. |
| Timeout / retry / partial failure | Proposed request deadline 3 seconds; safe GET retries up to 2 with jitter; no hidden partial response. Changing a displayed scope ID cannot widen permission; revoked grant must disappear under approved propagation policy. |
| Security / data minimization | TLS; no internal BIGINT IDs, credential digests, raw provider payloads, private prescription bytes or unscoped file URLs in projections. Session issuance/refresh returns only explicitly declared credentials over TLS; never log/cache these in generic replay rows. Validate active grants again at command/file access time. Input secrets are write-only and redacted from audit/logs. |


### Designed contract tests — NOT RUN

| Scenario ID | Trigger / fixture | Expected assertion |
| --- | --- | --- |
| `CT-API-093-HAPPY` | Valid Customer / Staff / Rider context and documented fixture for read the actor’s currently effective scoped permissions. | HTTP 200; match the named DTO/example, committed owner fields and scope; no unrelated table writes. |
| `CT-API-093-VALIDATION` | Corrupt a concrete declared path/query/header or submit an unknown property. | 422/400; safe field errors and no domain mutation. |
| `CT-API-093-AUTH` | Remove or expire the documented credential. | 401 with no access/effect. |
| `CT-API-093-SCOPE` | Use another customer/site/patient/task reference or remove identity.permissions.read.own. | 403/404 without existence leakage; public read exposes only published safe data. |
| `CT-API-093-RULE` | Evaluate active role assignment and validity window; exclude deleted roles/grants. This UI result is informational; every subsequent command independently reauthorizes. | Changing a displayed scope ID cannot widen permission; revoked grant must disappear under approved propagation policy. |
| `CT-API-093-DUPLICATE` | Repeat safe GET. | No business writes on read. |
| `CT-API-093-CONCURRENCY` | Change underlying authorized rows while paging/reading. | No cross-scope results; deterministic tie-breakers, documented freshness, no promised snapshot isolation. |
| `CT-API-093-STATE` | Read absent, expired or hidden resource according to this operation rule. | Apply documented empty-list/404/blocked projection; no fabricated successful business state. |
| `CT-API-093-RECOVERY` | Dependency timeout during read the actor’s currently effective scoped permissions. | 503 and bounded safe retry; no domain mutation or hidden partial report. |

Existing feature assertions: `TC-AUTH-04-OK`, `TC-AUTH-04-DENY`. [Feature register](../../09-References/Coverage-and-Traceability.md) and [test strategy](../../07-Engineering/Testing.md). All CT scenarios are newly **Designed / NOT RUN**; documentation/schema validation is not application test evidence.
