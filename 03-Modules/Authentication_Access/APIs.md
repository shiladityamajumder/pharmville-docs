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
| API-089 | `POST /v1/auth/staff/login` | Validate staff credentials and issue a purpose-bound MFA challenge | Complete proposed |
| API-090 | `POST /v1/auth/staff/mfa/verify` | Complete staff MFA and rotate the permitted active session | Complete proposed |
| API-091 | `POST /v1/auth/sessions/refresh` | Rotate a valid unrevoked refresh credential and access session | Complete proposed |
| API-092 | `POST /v1/auth/sessions/revoke` | Revoke one session owned by the authenticated actor | Complete proposed |
| API-093 | `GET /v1/auth/permissions` | Read the actor’s currently effective scoped permissions | Complete proposed |
| API-098 | `POST /v1/auth/login/initiate` | Begin the common identifier-first login challenge | Complete proposed |
| API-099 | `POST /v1/auth/login/verify` | Verify the required login proof and complete its MFA chain | Complete proposed |
| API-100 | `GET /v1/auth/identity` | Read the current shared subject, session assurance and context | Complete proposed |
| API-101 | `GET /v1/auth/workspaces` | Discover only live permission-authorized workspace choices | Complete proposed |
| API-102 | `POST /v1/auth/context` | Activate an already authorized workspace and scope | Complete proposed |
| API-103 | `POST /v1/auth/step-up` | Prove missing methods for a granted workspace without switching it | Complete proposed |
| API-104 | `POST /v1/auth/mfa/enrollment` | Enroll and confirm an owned authenticator under the reviewed bootstrap policy | Complete proposed |
| API-105 | `POST /v1/auth/credentials/password` | Change an existing password and invalidate all sessions | Complete proposed |
| API-106 | `POST /v1/auth/recovery/request` | Begin neutral password recovery or assisted authenticator recovery | Complete proposed |
| API-107 | `POST /v1/auth/recovery/complete` | Reset a password only after existing OTP and authenticator proof | Complete proposed |

## Feature-to-operation coverage

| Feature | Requirement | Operation coverage |
| --- | --- | --- |
| AUTH-01 | Password + authenticator 2FA for Super Admin, Central Admin, Finance Manager | API-089, API-090, API-099, API-103, API-104, API-105, API-107 |
| AUTH-02 | Lockout rules, session limits, one session per staff account | API-089, API-090, API-091, API-092, API-099, API-100, API-102, API-103, API-104, API-105, API-106, API-107, API-110 |
| AUTH-03 | OTP rate limits per number and IP | API-001, API-002, API-098, API-099, API-106, API-107 |
| AUTH-04 | Permissions checked on the server for every request | API-093, API-100, API-101, API-102, API-103, API-108, API-111, API-109, API-112, API-110 |

## API-089 — POST `/v1/auth/staff/login`

**Validate staff credentials and issue a purpose-bound MFA challenge. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Shared identity service; no app-specific account. |
| Consumer | Public pre-login Staff |
| Features / workflow | `AUTH-01`, `AUTH-02`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/auth/staff/login |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| NO | None (purpose-bound pre-login proof where supplied) | Public pre-login Staff | Credential proof; no existing role claim |

Staff password adapter uses the common identity by normalized verified identifier. Return the existing challengeToken/nextAction/expiresAt shape; token is an opaque durable authentication_challenges capability, not signed-only MFA state. Require the documented privileged password/authenticator policy. Unknown/wrong/disabled accounts use generic denial; no session until required authenticator succeeds. First enrollment/recovery follows D-003; do not create a second account.

No bearer authentication is required. Supplied proof is purpose-bound and validated by the backend; unknown identifiers never expose account/role/factor state.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Not Applicable | Omit | Existing human session only where specified; never client role. |
| Content-Type | media type | Required | application/json | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
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

DTO: `StaffLoginRequest`. Unknown properties are rejected. Conditional proof/action fields must match the stored challenge and declared oneOf/allOf rules; a client cannot choose a weaker factor.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `email` | string | Required | No | None | minLength=1; maxLength=320; format="email" | Normalized staff identifier. |
| `password` | string | Required | No | None | minLength=1; maxLength=1024; writeOnly=true | Write-only secret; never logged or echoed. |

```json
{
  "email": "asha@example.invalid",
  "password": "SyntheticPasswordForExampleOnly"
}
```

File uploads: **Not Applicable**.

### Success response

HTTP **200**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `StaffChallengeData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `challengeToken` | string | Required | No | None | minLength=1; maxLength=4096 | Opaque durable authentication_challenges capability bound to user/factor/policy/expiry; no signed-only challenge. |
| `nextAction` | string | Required | No | None | enum=["verify_authenticator"] | Typed nextAction; source and conditional use below. |
| `expiresAt` | string | Required | No | None | format="date-time" | Typed expiresAt; source and conditional use below. |

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

`meta.pagination` is null.

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 400 | BAD_REQUEST | Malformed JSON or invalid UUID tracing header. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 401 | AUTH_INVALID_CREDENTIALS | Invalid or expired purpose-bound proof; no session created. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 406 | NOT_ACCEPTABLE | Requested Accept media type is unsupported. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 409 | INVALID_STATE_TRANSITION | INVALID_STATE_TRANSITION: Unknown email/wrong password uses neutral 401; rate/lockout policy D-003 applies without account enumeration. No session before successful MFA. Recovery: Refresh authoritative state and follow the owner recovery path. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 415 | UNSUPPORTED_MEDIA_TYPE | Request body media type is unsupported. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 422 | REQUEST_VALIDATION_ERROR | REQUEST_VALIDATION_ERROR: A declared body/path/query field violates its typed contract. Recovery: Correct the named fields; do not retry unchanged.; VALIDATION_ERROR: No existing bearer required. Verify password hash and active account; privileged Super Admin/Central Admin/Finance Manager require authenticator MFA. Challenge is signed API-only state, bound to existing factor/user version/expiry, not a completed session. Recovery: Unknown email/wrong password uses neutral 401; rate/lockout policy D-003 applies without account enumeration. No session before successful MFA. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 429 | RATE_LIMIT_EXCEEDED | RATE_LIMIT_EXCEEDED: The proposed operation/actor/IP budget is exceeded. Recovery: Honor Retry-After, then bounded backoff with jitter. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 503 | EXTERNAL_SERVICE_UNAVAILABLE | EXTERNAL_SERVICE_UNAVAILABLE: Required database/owner/provider dependency for API-089 is unavailable or deadline exceeded. Recovery: Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |

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
| [`identity.authentication_challenges`](../../04-Database/Tables/identity/authentication_challenges.md) | `attempts`, `binding_json`, `blocked_at`, `consumed_at`, `created_at`, `created_by`, `expires_at`, `factor_type`, `id`, `identifier_encrypted`, `identity_version`, `max_attempts`, `mfa_factor_id`, `otp_challenge_id`, `parent_challenge_id`, `policy_version`, `purpose`, `requested_context_hash`, `row_version`, `session_id`, `token_hash`, `updated_at`, `updated_by`, `user_id` | `attempts`, `binding_json`, `blocked_at`, `consumed_at`, `expires_at`, `factor_type`, `identifier_encrypted`, `identity_version`, `max_attempts`, `mfa_factor_id`, `otp_challenge_id`, `parent_challenge_id`, `policy_version`, `purpose`, `requested_context_hash`, `session_id`, `token_hash`, `user_id` | Authentication_Access |
| [`identity.login_attempts`](../../04-Database/Tables/identity/login_attempts.md) | None | `user_id`, `login_identifier_hash`, `success`, `failure_code`, `request_id`, `ip_address`, `user_agent` | Authentication_Access |
| [`identity.mfa_factors`](../../04-Database/Tables/identity/mfa_factors.md) | `created_by`, `id`, `row_version`, `updated_by`, `user_id` | None | Authentication_Access |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `updated_by` | None | Authentication_Access |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `created_by`, `id`, `is_active`, `role_id`, `row_version`, `updated_by`, `user_id`, `valid_from`, `valid_until` | None | Authentication_Access |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `created_by`, `email`, `id`, `row_version`, `status`, `updated_by`, `locked_until`, `account_closed_at`, `failed_login_count` | `failed_login_count`, `locked_until` | Authentication_Access |

Master dependencies: `identity.roles`, `identity.users`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.challengeToken | API-generated random capability; keyed hash in authentication_challenges.token_hash, never return the database hash. |
| data.nextAction | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.expiresAt | authentication_challenges.expires_at for proof operations or identity.sessions.expires_at for session projection. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Staff password adapter uses the common identity by normalized verified identifier. Return the existing challengeToken/nextAction/expiresAt shape; token is an opaque durable authentication_challenges capability, not signed-only MFA state.
2. Require the documented privileged password/authenticator policy. Unknown/wrong/disabled accounts use generic denial; no session until required authenticator succeeds. First enrollment/recovery follows D-003; do not create a second account.

Perform success mutations, proof/counter/refresh/assignment state and audit in one owner transaction. Commit failed-proof counters/lockout and replay revocation even when returning an authentication error; do not roll those evidence updates back. Recheck grants under ordered locks before commit; retain non-secret audit/outbox atomically. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-089-01` | Preserve the adapter DTO and identity subject; the shared authorizer still checks current scope. | Designed / NOT RUN |
| `CT-API-089-02` | Reject cross-subject, wrong-purpose or replayed proof/session input with no unauthorized state. | Designed / NOT RUN |
| `CT-API-089-03` | Race completion/revocation/version change; recover through the documented common lifecycle. | Designed / NOT RUN |
| `CT-API-089-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-089-AUTHORIZATION` | No bearer needed; forged, expired, wrong-purpose or replayed proof never grants a session/workspace. | Designed / NOT RUN |
| `CT-API-089-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-090 — POST `/v1/auth/staff/mfa/verify`

**Complete staff MFA and rotate the permitted active session. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Shared identity service; no app-specific account. |
| Consumer | Public Staff with pending MFA proof |
| Features / workflow | `AUTH-01`, `AUTH-02`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/auth/staff/mfa/verify |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| NO | None (purpose-bound pre-login proof where supplied) | Public Staff with pending MFA proof | Valid MFA challenge + authenticator proof |

Staff authenticator adapter accepts only the expected durable public-login MFA successor challenge. Lock the owned enabled factor, advance its monotonic counter and consume the challenge atomically. Issue common SessionData/root refresh lineage only after current account/role policy checks. If exactly one eligible staff context exists it may be selected by backend; multiple choices require unified discovery/selection. Preserve identity-wide staff session limits.

No bearer authentication is required. Supplied proof is purpose-bound and validated by the backend; unknown identifiers never expose account/role/factor state.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Not Applicable | Omit | Existing human session only where specified; never client role. |
| Content-Type | media type | Required | application/json | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
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

DTO: `StaffMfaRequest`. Unknown properties are rejected. Conditional proof/action fields must match the stored challenge and declared oneOf/allOf rules; a client cannot choose a weaker factor.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `challengeToken` | string | Required | No | None | minLength=1; maxLength=4096 | Purpose-bound challenge from API-089. |
| `authenticatorCode` | string | Required | No | None | minLength=1; maxLength=8; pattern="^[0-9]{6,8}$"; writeOnly=true | Write-only code; format and clock skew are Security policy. |

```json
{
  "challengeToken": "pv_mfa_7m3K9r2P6x4V8q1L",
  "authenticatorCode": "583914"
}
```

File uploads: **Not Applicable**.

### Success response

HTTP **200**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `SessionData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `accessToken` | string | Required | No | None | minLength=1; maxLength=4096 | Write-only bearer credential in transit; never persist cleartext. |
| `tokenType` | string | Required | No | None | enum=["Bearer"] | Typed tokenType; source and conditional use below. |
| `expiresIn` | integer | Required | No | None | minimum=1 | Configured token lifetime in seconds; sample is not an approved lifetime. |
| `refreshToken` | string | Required | No | None | minLength=1; maxLength=4096 | Rotating opaque credential; only a hash is stored in identity.sessions. |
| `sessionId` | string | Required | No | None | format="uuid" | identity.sessions.id |
| `userId` | string | Required | No | None | format="uuid" | identity.users.id |

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

`meta.pagination` is null.

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 400 | BAD_REQUEST | Malformed JSON or invalid UUID tracing header. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 401 | AUTH_INVALID_CREDENTIALS | Invalid or expired purpose-bound proof; no session created. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 406 | NOT_ACCEPTABLE | Requested Accept media type is unsupported. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 409 | INVALID_STATE_TRANSITION | INVALID_STATE_TRANSITION: Invalid MFA never creates session; concurrent accepted proof must not establish two active staff sessions. Recovery: Refresh authoritative state and follow the owner recovery path. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 415 | UNSUPPORTED_MEDIA_TYPE | Request body media type is unsupported. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 422 | REQUEST_VALIDATION_ERROR | REQUEST_VALIDATION_ERROR: A declared body/path/query field violates its typed contract. Recovery: Correct the named fields; do not retry unchanged.; VALIDATION_ERROR: Validate challenge signature/purpose/user/factor/version and configured authenticator window. Enforce documented single staff session and revoke replaced sessions. Authenticator code/challenge replay needs durable reviewed evidence. Recovery: Invalid MFA never creates session; concurrent accepted proof must not establish two active staff sessions. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 429 | RATE_LIMIT_EXCEEDED | RATE_LIMIT_EXCEEDED: The proposed operation/actor/IP budget is exceeded. Recovery: Honor Retry-After, then bounded backoff with jitter. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 503 | EXTERNAL_SERVICE_UNAVAILABLE | EXTERNAL_SERVICE_UNAVAILABLE: Required database/owner/provider dependency for API-090 is unavailable or deadline exceeded. Recovery: Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |

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
| [`identity.authentication_challenges`](../../04-Database/Tables/identity/authentication_challenges.md) | `attempts`, `binding_json`, `blocked_at`, `consumed_at`, `created_at`, `created_by`, `expires_at`, `factor_type`, `id`, `identifier_encrypted`, `identity_version`, `max_attempts`, `mfa_factor_id`, `otp_challenge_id`, `parent_challenge_id`, `policy_version`, `purpose`, `requested_context_hash`, `row_version`, `session_id`, `token_hash`, `updated_at`, `updated_by`, `user_id` | `attempts`, `binding_json`, `blocked_at`, `consumed_at`, `expires_at`, `factor_type`, `identifier_encrypted`, `identity_version`, `max_attempts`, `mfa_factor_id`, `otp_challenge_id`, `parent_challenge_id`, `policy_version`, `purpose`, `requested_context_hash`, `session_id`, `token_hash`, `user_id` | Authentication_Access |
| [`identity.login_attempts`](../../04-Database/Tables/identity/login_attempts.md) | None | `user_id`, `login_identifier_hash`, `success`, `failure_code`, `request_id` | Authentication_Access |
| [`identity.mfa_factors`](../../04-Database/Tables/identity/mfa_factors.md) | `created_by`, `id`, `row_version`, `updated_by`, `user_id` | `last_accepted_totp_counter` | Authentication_Access |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | `id`, `code`, `resource`, `action`, `is_deleted` | None | Authentication_Access |
| [`identity.role_permissions`](../../04-Database/Tables/identity/role_permissions.md) | `role_id`, `permission_id`, `row_version` | None | Authentication_Access |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `id`, `code`, `is_deleted`, `row_version` | None | Authentication_Access |
| [`identity.session_refresh_tokens`](../../04-Database/Tables/identity/session_refresh_tokens.md) | `consumed_at`, `created_at`, `created_by`, `expires_at`, `id`, `parent_token_id`, `revoked_at`, `row_version`, `session_id`, `token_hash`, `updated_at`, `updated_by` | `session_id`, `token_hash`, `parent_token_id`, `expires_at`, `consumed_at`, `revoked_at` | Authentication_Access |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | `id`, `user_id`, `revoked_at`, `expires_at`, `context_version`, `active_assignment_id`, `active_workspace_code`, `password_verified_at`, `otp_verified_at`, `mfa_verified_at`, `authentication_policy_version`, `token_family_id`, `refresh_token_hash`, `row_version` | `authenticated_at`, `password_verified_at`, `otp_verified_at`, `mfa_verified_at`, `authentication_policy_version`, `context_version`, `active_assignment_id`, `active_workspace_code` | Authentication_Access |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `id`, `user_id`, `role_id`, `is_active`, `scope_type`, `scope_id`, `valid_from`, `valid_until`, `row_version` | None | Authentication_Access |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `id`, `status`, `row_version`, `locked_until`, `account_closed_at`, `phone_verified_at`, `email_verified_at`, `failed_login_count` | `last_login_at`, `failed_login_count`, `locked_until` | Authentication_Access |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `organization_id`, `location_type`, `is_active`, `is_deleted` | None | Admin_CMS |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `user_id`, `organization_id`, `location_id`, `status`, `row_version` | None | Admin_CMS |
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | `id`, `status`, `is_deleted` | None | Admin_CMS |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `location_id`, `organization_id`, `status`, `is_deleted` | None | Warehouse |

Master dependencies: `identity.roles`, `identity.users`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.accessToken | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.tokenType | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.expiresIn | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.refreshToken | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.sessionId | identity.sessions.id; ownership checked against user_id. |
| data.userId | identity.users.id; shared subject, not a role-specific account. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Staff authenticator adapter accepts only the expected durable public-login MFA successor challenge. Lock the owned enabled factor, advance its monotonic counter and consume the challenge atomically.
2. Issue common SessionData/root refresh lineage only after current account/role policy checks. If exactly one eligible staff context exists it may be selected by backend; multiple choices require unified discovery/selection. Preserve identity-wide staff session limits.

Perform success mutations, proof/counter/refresh/assignment state and audit in one owner transaction. Commit failed-proof counters/lockout and replay revocation even when returning an authentication error; do not roll those evidence updates back. Recheck grants under ordered locks before commit; retain non-secret audit/outbox atomically. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-090-01` | Preserve the adapter DTO and identity subject; the shared authorizer still checks current scope. | Designed / NOT RUN |
| `CT-API-090-02` | Reject cross-subject, wrong-purpose or replayed proof/session input with no unauthorized state. | Designed / NOT RUN |
| `CT-API-090-03` | Race completion/revocation/version change; recover through the documented common lifecycle. | Designed / NOT RUN |
| `CT-API-090-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-090-AUTHORIZATION` | No bearer needed; forged, expired, wrong-purpose or replayed proof never grants a session/workspace. | Designed / NOT RUN |
| `CT-API-090-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-091 — POST `/v1/auth/sessions/refresh`

**Rotate a valid unrevoked refresh credential and access session. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Shared identity service; no app-specific account. |
| Consumer | Customer / Staff / Rider holding a valid refresh session |
| Features / workflow | `AUTH-02`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/auth/sessions/refresh |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| YES | Session (refresh credential in body) | Customer / Staff / Rider holding a valid refresh session | Own refresh session |

Same refreshToken request and SessionData response. Lookup its keyed hash in retained session_refresh_tokens; lock session and token, consume once and insert one child, and update the existing sessions.refresh_token_hash atomically. Recognized spent-token replay revokes its family. Serialize clients and reauthenticate after a lost success response. Recheck live user/assignment and method/policy state; refresh never restores a revoked context or re-dates MFA/password proof.

Resolve the owned active session on the backend. Auth.self operations do not require a business assignment; business/admin actions still require their exact context, methods, permission and target scope.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Not Applicable | Omit | Existing human session only where specified; never client role. |
| Content-Type | media type | Required | application/json | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
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

DTO: `SessionRefreshRequest`. Unknown properties are rejected. Conditional proof/action fields must match the stored challenge and declared oneOf/allOf rules; a client cannot choose a weaker factor.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `refreshToken` | string | Required | No | None | minLength=1; maxLength=4096; writeOnly=true | Opaque rotating credential; compare hash, never an access JWT requirement. |

```json
{
  "refreshToken": "pv_refresh_Kd9hQ7x4m2V6t8r3"
}
```

File uploads: **Not Applicable**.

### Success response

HTTP **200**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `SessionData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `accessToken` | string | Required | No | None | minLength=1; maxLength=4096 | Write-only bearer credential in transit; never persist cleartext. |
| `tokenType` | string | Required | No | None | enum=["Bearer"] | Typed tokenType; source and conditional use below. |
| `expiresIn` | integer | Required | No | None | minimum=1 | Configured token lifetime in seconds; sample is not an approved lifetime. |
| `refreshToken` | string | Required | No | None | minLength=1; maxLength=4096 | Rotating opaque credential; only a hash is stored in identity.sessions. |
| `sessionId` | string | Required | No | None | format="uuid" | identity.sessions.id |
| `userId` | string | Required | No | None | format="uuid" | identity.users.id |

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

`meta.pagination` is null.

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 400 | BAD_REQUEST | Malformed JSON or invalid UUID tracing header. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 401 | AUTHENTICATION_REQUIRED | AUTHENTICATION_REQUIRED: Missing/expired/revoked Session (refresh credential in body) credential for API-091. Recovery: Renew the appropriate credential; provider signatures use provider recovery, not customer login. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 406 | NOT_ACCEPTABLE | Requested Accept media type is unsupported. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 409 | INVALID_STATE_TRANSITION | INVALID_STATE_TRANSITION: Old/revoked credential is 401. Lost refresh response is handled by reauthentication unless reviewed encrypted replay storage is adopted; never retain a raw refresh secret in generic idempotency response_body. Recovery: Refresh authoritative state and follow the owner recovery path. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 415 | UNSUPPORTED_MEDIA_TYPE | Request body media type is unsupported. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 422 | REQUEST_VALIDATION_ERROR | REQUEST_VALIDATION_ERROR: A declared body/path/query field violates its typed contract. Recovery: Correct the named fields; do not retry unchanged.; VALIDATION_ERROR: Refresh credential is an authenticated opaque capability carrying a tamper-protected session/family reference plus random nonce; only its hash is persisted. Lock resolved session/family, check hash/expiry/user state and rotate. An authentic previously rotated capability is detectable by its valid reference/signature and noncurrent hash; revoke family under D-003. No access bearer is required and no raw refresh secret is cached. Recovery: Old/revoked credential is 401. Lost refresh response is handled by reauthentication unless reviewed encrypted replay storage is adopted; never retain a raw refresh secret in generic idempotency response_body. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 429 | RATE_LIMIT_EXCEEDED | RATE_LIMIT_EXCEEDED: The proposed operation/actor/IP budget is exceeded. Recovery: Honor Retry-After, then bounded backoff with jitter. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 503 | EXTERNAL_SERVICE_UNAVAILABLE | EXTERNAL_SERVICE_UNAVAILABLE: Required database/owner/provider dependency for API-091 is unavailable or deadline exceeded. Recovery: Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |

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
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | `id`, `code`, `resource`, `action`, `is_deleted` | None | Authentication_Access |
| [`identity.role_permissions`](../../04-Database/Tables/identity/role_permissions.md) | `role_id`, `permission_id`, `row_version` | None | Authentication_Access |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `id`, `code`, `is_deleted`, `row_version` | None | Authentication_Access |
| [`identity.session_refresh_tokens`](../../04-Database/Tables/identity/session_refresh_tokens.md) | `consumed_at`, `created_at`, `created_by`, `expires_at`, `id`, `parent_token_id`, `revoked_at`, `row_version`, `session_id`, `token_hash`, `updated_at`, `updated_by` | `session_id`, `token_hash`, `parent_token_id`, `expires_at`, `consumed_at`, `revoked_at` | Authentication_Access |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | `id`, `user_id`, `revoked_at`, `expires_at`, `context_version`, `active_assignment_id`, `active_workspace_code`, `password_verified_at`, `otp_verified_at`, `mfa_verified_at`, `authentication_policy_version`, `token_family_id`, `refresh_token_hash`, `row_version` | `authenticated_at`, `password_verified_at`, `otp_verified_at`, `mfa_verified_at`, `authentication_policy_version`, `context_version`, `active_assignment_id`, `active_workspace_code` | Authentication_Access |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `id`, `user_id`, `role_id`, `is_active`, `scope_type`, `scope_id`, `valid_from`, `valid_until`, `row_version` | None | Authentication_Access |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `id`, `status`, `row_version`, `locked_until`, `account_closed_at`, `phone_verified_at`, `email_verified_at`, `failed_login_count` | None | Authentication_Access |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `organization_id`, `location_type`, `is_active`, `is_deleted` | None | Admin_CMS |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `user_id`, `organization_id`, `location_id`, `status`, `row_version` | None | Admin_CMS |
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | `id`, `status`, `is_deleted` | None | Admin_CMS |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `location_id`, `organization_id`, `status`, `is_deleted` | None | Warehouse |

Master dependencies: `identity.permissions`, `identity.roles`, `identity.users`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.accessToken | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.tokenType | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.expiresIn | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.refreshToken | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.sessionId | identity.sessions.id; ownership checked against user_id. |
| data.userId | identity.users.id; shared subject, not a role-specific account. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Same refreshToken request and SessionData response. Lookup its keyed hash in retained session_refresh_tokens; lock session and token, consume once and insert one child, and update the existing sessions.refresh_token_hash atomically.
2. Recognized spent-token replay revokes its family. Serialize clients and reauthenticate after a lost success response. Recheck live user/assignment and method/policy state; refresh never restores a revoked context or re-dates MFA/password proof.

Perform success mutations, proof/counter/refresh/assignment state and audit in one owner transaction. Commit failed-proof counters/lockout and replay revocation even when returning an authentication error; do not roll those evidence updates back. Recheck grants under ordered locks before commit; retain non-secret audit/outbox atomically. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-091-01` | Preserve the adapter DTO and identity subject; the shared authorizer still checks current scope. | Designed / NOT RUN |
| `CT-API-091-02` | Reject cross-subject, wrong-purpose or replayed proof/session input with no unauthorized state. | Designed / NOT RUN |
| `CT-API-091-03` | Race completion/revocation/version change; recover through the documented common lifecycle. | Designed / NOT RUN |
| `CT-API-091-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-091-AUTHORIZATION` | Expired/revoked session or cross-subject/scope target is denied; hiding menus is irrelevant. | Designed / NOT RUN |
| `CT-API-091-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-092 — POST `/v1/auth/sessions/revoke`

**Revoke one session owned by the authenticated actor. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Shared identity service; no app-specific account. |
| Consumer | Customer / Staff / Rider |
| Features / workflow | `AUTH-02`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/auth/sessions/revoke |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| YES | JWT | Customer / Staff / Rider | identity.sessions.revoke.own |

Owned logout invalidates the target session and all refresh/proof descendants without deleting history. Repeated revocation returns the existing committed revokedAt rather than creating new effects. Authorization is auth.self for an active requester and owned session; another user target returns privacy-safe 404. It works without a business workspace.

Resolve the owned active session on the backend. Auth.self operations do not require a business assignment; business/admin actions still require their exact context, methods, permission and target scope.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer <access JWT> | Existing human session only where specified; never client role. |
| Content-Type | media type | Required | application/json | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Required | pv_api-092_7m3K9r2P6x4V8q1L | Required for this duplicate-sensitive effect. |
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

DTO: `SessionRevocationRequest`. Unknown properties are rejected. Conditional proof/action fields must match the stored challenge and declared oneOf/allOf rules; a client cannot choose a weaker factor.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `sessionId` | string | Required | No | None | format="uuid" | Typed sessionId; source and conditional use below. |

```json
{
  "sessionId": "0192a1b2-c3d4-7e8f-9012-3456789abcde"
}
```

File uploads: **Not Applicable**.

### Success response

HTTP **200**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `SessionRevocationData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `sessionId` | string | Required | No | None | format="uuid" | Typed sessionId; source and conditional use below. |
| `revoked` | boolean | Required | No | None | See purpose/conditional rules | Typed revoked; source and conditional use below. |
| `revokedAt` | string | Required | No | None | format="date-time" | Typed revokedAt; source and conditional use below. |

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

`meta.pagination` is null.

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 400 | BAD_REQUEST | Malformed JSON or invalid UUID tracing header. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 401 | AUTHENTICATION_REQUIRED | AUTHENTICATION_REQUIRED: Missing/expired/revoked JWT credential for API-092. Recovery: Renew the appropriate credential; provider signatures use provider recovery, not customer login. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 403 | PERMISSION_DENIED | PERMISSION_DENIED: Caller lacks identity.sessions.revoke.own or active permitted organization/site role. Recovery: Obtain authorized scope through owner; never change IDs to bypass access. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 404 | RESOURCE_NOT_FOUND | RESOURCE_NOT_FOUND: Target/reference for revoke one session owned by the authenticated actor. is absent or hidden by ownership. Recovery: Reload the authorized parent/queue; do not infer another actor’s record. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 406 | NOT_ACCEPTABLE | Requested Accept media type is unsupported. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 409 | IDEMPOTENCY_KEY_CONFLICT | IDEMPOTENCY_KEY_CONFLICT: Same actor/action/target key has a different canonical request fingerprint. Recovery: Use a new key only for a deliberately different intent; reconcile previous intent first.; INVALID_STATE_TRANSITION: Unknown/foreign session is 404; revocation does not delete session evidence. Recovery: Refresh authoritative state and follow the owner recovery path. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 415 | UNSUPPORTED_MEDIA_TYPE | Request body media type is unsupported. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 422 | REQUEST_VALIDATION_ERROR | REQUEST_VALIDATION_ERROR: A declared body/path/query field violates its typed contract. Recovery: Correct the named fields; do not retry unchanged.; VALIDATION_ERROR: Session.user_id must equal JWT subject. Already-revoked session is idempotently successful; no arbitrary staff/global revocation through this self route. Recovery: Unknown/foreign session is 404; revocation does not delete session evidence. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 429 | RATE_LIMIT_EXCEEDED | RATE_LIMIT_EXCEEDED: The proposed operation/actor/IP budget is exceeded. Recovery: Honor Retry-After, then bounded backoff with jitter. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 503 | EXTERNAL_SERVICE_UNAVAILABLE | EXTERNAL_SERVICE_UNAVAILABLE: Required database/owner/provider dependency for API-092 is unavailable or deadline exceeded. Recovery: Retry revocation of the same owned session; a repeated revocation returns the original revokedAt. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |

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
| [`identity.session_refresh_tokens`](../../04-Database/Tables/identity/session_refresh_tokens.md) | None | `revoked_at` | Authentication_Access |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | `expires_at`, `id`, `refresh_token_hash`, `revoked_at`, `row_version`, `token_family_id`, `user_id` | `active_assignment_id`, `active_workspace_code`, `context_version`, `revoked_at`, `revoke_reason` | Authentication_Access |

Master dependencies: `identity.permissions`, `identity.roles`, `identity.users`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.sessionId | identity.sessions.id; ownership checked against user_id. |
| data.revoked | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.revokedAt | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Owned logout invalidates the target session and all refresh/proof descendants without deleting history. Repeated revocation returns the existing committed revokedAt rather than creating new effects.
2. Authorization is auth.self for an active requester and owned session; another user target returns privacy-safe 404. It works without a business workspace.

Perform success mutations, proof/counter/refresh/assignment state and audit in one owner transaction. Commit failed-proof counters/lockout and replay revocation even when returning an authentication error; do not roll those evidence updates back. Recheck grants under ordered locks before commit; retain non-secret audit/outbox atomically. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-092-01` | Preserve the adapter DTO and identity subject; the shared authorizer still checks current scope. | Designed / NOT RUN |
| `CT-API-092-02` | Reject cross-subject, wrong-purpose or replayed proof/session input with no unauthorized state. | Designed / NOT RUN |
| `CT-API-092-03` | Race completion/revocation/version change; recover through the documented common lifecycle. | Designed / NOT RUN |
| `CT-API-092-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-092-AUTHORIZATION` | Expired/revoked session or cross-subject/scope target is denied; hiding menus is irrelevant. | Designed / NOT RUN |
| `CT-API-092-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-093 — GET `/v1/auth/permissions`

**Read the actor’s currently effective scoped permissions. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Shared identity service; no app-specific account. |
| Consumer | Any owned active identity session, including Customer and Rider; no business role needed for empty-context introspection |
| Features / workflow | `AUTH-04`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/auth/permissions |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| YES | JWT | Any owned active identity session, including Customer and Rider; no business role needed for empty-context introspection | auth.self — own active-context permissions only |

Owned session introspection, available to Customer/Rider/Staff and no-workspace subjects without a privileged permission-reader role. Return only current active-context permissions after live role/scope/method checks; no active context yields an empty list. Preserve permission DTO and limit/offset/meta pagination. Never return the union of unrelated assignments or expose another subject’s grants.

Resolve the owned active session on the backend. Auth.self operations do not require a business assignment; business/admin actions still require their exact context, methods, permission and target scope.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer <access JWT> | Existing human session only where specified; never client role. |
| Content-Type | media type | Not Applicable | Omit | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| If-Match | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| X-Request-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Optional UUID; validate or generate server value. |
| X-Correlation-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-3456789abcde | Optional UUID; validate and propagate across committed events. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Human identity operation, not a provider callback. |

Authorization headers are represented by OpenAPI security, not duplicated header parameters. No role/panel/organization header grants authority. JSON/Accept/trace validation is independent of credential verification.

### Path parameters

Not Applicable. No path parameters.

### Query parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| limit | integer | Optional | No | 20 | {"type":"integer","minimum":1,"maximum":100,"default":20,"example":20} | Optional allowlisted filter; does not widen authenticated scope. |
| offset | integer | Optional | No | 0 | {"type":"integer","minimum":0,"maximum":100000,"default":0,"example":0} | Optional allowlisted filter; does not widen authenticated scope. |

### Request body and uploads

**No request body.**

File uploads: **Not Applicable**.

### Success response

HTTP **200**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `EffectivePermissionListData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `permissions` | array | Required | No | None | minItems=0; maxItems=100 | Typed permissions; source and conditional use below. |
| `permissions[].permissionCode` | string | Required | No | None | minLength=1; maxLength=128 | identity.permissions.code; character varying(128). |
| `permissions[].resource` | string | Required | No | None | minLength=1; maxLength=64 | identity.permissions.resource; character varying(64). |
| `permissions[].action` | string | Required | No | None | minLength=1; maxLength=64 | identity.permissions.action; character varying(64). |
| `permissions[].scopeType` | string,null | Required | No | None | minLength=1; maxLength=32 | identity.user_roles.scope_type; character varying(32). |
| `permissions[].scopeId` | string,null | Required | No | None | format="uuid" | identity.user_roles.scope_id; uuid. |

```json
{
  "success": true,
  "data": {
    "permissions": [
      {
        "permissionCode": "customer.orders.read",
        "resource": "customer.orders",
        "action": "read",
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

Collection metadata is in `meta.pagination`: totalCount, limit, offset, hasNext. Count/sort/filter are computed only after authorization.

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 400 | BAD_REQUEST | Malformed JSON or invalid UUID tracing header. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 401 | AUTHENTICATION_REQUIRED | AUTHENTICATION_REQUIRED: Missing/expired/revoked JWT credential for API-093. Recovery: Renew the appropriate credential; provider signatures use provider recovery, not customer login. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 403 | PERMISSION_DENIED | PERMISSION_DENIED: Caller lacks identity.permissions.read.own or active permitted organization/site role. Recovery: Obtain authorized scope through owner; never change IDs to bypass access. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 406 | NOT_ACCEPTABLE | Requested Accept media type is unsupported. Correct transport before retry; no domain mutation. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 422 | REQUEST_VALIDATION_ERROR | REQUEST_VALIDATION_ERROR: A declared path/query/header field violates its typed contract. Recovery: Correct the named fields; do not retry unchanged. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 429 | RATE_LIMIT_EXCEEDED | RATE_LIMIT_EXCEEDED: The proposed operation/actor/IP budget is exceeded. Recovery: Honor Retry-After, then bounded backoff with jitter. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |
| 503 | EXTERNAL_SERVICE_UNAVAILABLE | EXTERNAL_SERVICE_UNAVAILABLE: Required database/owner/provider dependency for API-093 is unavailable or deadline exceeded. Recovery: Retry safe reads with bounded backoff; proof/token flows may require fresh authentication. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use the common lifecycle recovery; no authority from caller role/panel. |

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
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | `id`, `code`, `resource`, `action`, `is_deleted` | None | Authentication_Access |
| [`identity.role_permissions`](../../04-Database/Tables/identity/role_permissions.md) | `role_id`, `permission_id`, `row_version` | None | Authentication_Access |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `id`, `code`, `is_deleted`, `row_version` | None | Authentication_Access |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | `id`, `user_id`, `revoked_at`, `expires_at`, `context_version`, `active_assignment_id`, `active_workspace_code`, `password_verified_at`, `otp_verified_at`, `mfa_verified_at`, `authentication_policy_version`, `token_family_id`, `refresh_token_hash`, `row_version` | None | Authentication_Access |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `id`, `user_id`, `role_id`, `is_active`, `scope_type`, `scope_id`, `valid_from`, `valid_until`, `row_version` | None | Authentication_Access |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `id`, `status`, `row_version`, `locked_until`, `account_closed_at`, `phone_verified_at`, `email_verified_at`, `failed_login_count` | None | Authentication_Access |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `organization_id`, `location_type`, `is_active`, `is_deleted` | None | Admin_CMS |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `user_id`, `organization_id`, `location_id`, `status`, `row_version` | None | Admin_CMS |
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | `id`, `status`, `is_deleted` | None | Admin_CMS |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `location_id`, `organization_id`, `status`, `is_deleted` | None | Warehouse |

Master dependencies: `identity.permissions`, `identity.roles`, `identity.users`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.permissions | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Owned session introspection, available to Customer/Rider/Staff and no-workspace subjects without a privileged permission-reader role. Return only current active-context permissions after live role/scope/method checks; no active context yields an empty list.
2. Preserve permission DTO and limit/offset/meta pagination. Never return the union of unrelated assignments or expose another subject’s grants.

Read-only scoped projection. No state transition, idempotency or external effect is applicable. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-093-01` | Preserve the adapter DTO and identity subject; the shared authorizer still checks current scope. | Designed / NOT RUN |
| `CT-API-093-02` | Reject cross-subject, wrong-purpose or replayed proof/session input with no unauthorized state. | Designed / NOT RUN |
| `CT-API-093-03` | Race completion/revocation/version change; recover through the documented common lifecycle. | Designed / NOT RUN |
| `CT-API-093-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-093-AUTHORIZATION` | Expired/revoked session or cross-subject/scope target is denied; hiding menus is irrelevant. | Designed / NOT RUN |
| `CT-API-093-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-098 — POST `/v1/auth/login/initiate`

**Begin the common identifier-first login challenge. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Shared identity service; no app-specific account. |
| Consumer | Public |
| Features / workflow | `ACC-01`, `AUTH-03`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/auth/login/initiate |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| NO | None (purpose-bound pre-session proof where supplied) | Public | Public challenge/proof only; no role or panel input |

Normalize identifier; expose proof kind only from phone/email syntax, with uniform 202 for unknown/locked/suspended accounts. Dispatch only through committed outbox using existing WhatsApp-primary/SMS-fallback rules. Persist opaque-token hash and encrypted identifier; unknown-user challenges have null user_id. No role, stored-contact hint or provider receipt is exposed before proof.

No bearer authentication is required. Supplied proof is purpose-bound and validated by the backend; unknown identifiers never expose account/role/factor state.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Not Applicable | Omit | Existing human session only where specified; never client role. |
| Content-Type | media type | Required | application/json | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| If-Match | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| X-Request-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| X-Correlation-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Human identity operation, not a provider callback. |

Authorization headers are represented by OpenAPI security, not duplicated header parameters. No role/panel/organization header grants authority. JSON/Accept/trace validation is independent of credential verification.

### Path parameters

Not Applicable. No path parameters.

### Query parameters

Not Applicable. No query parameters.

### Request body and uploads

DTO: `UnifiedLoginInitiateRequest`. Unknown properties are rejected. Conditional proof/action fields must match the stored challenge and declared oneOf/allOf rules; a client cannot choose a weaker factor.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `identifier` | object | Required | No | None | See purpose/conditional rules | Typed identifier; source and conditional use below. |
| `identifier.kind` | string | Required | No | None | enum=["phone","email"] | Phone E.164 uses OTP; email uses password. Public shape does not vary by account existence. |
| `identifier.value` | string | Required | No | None | minLength=1; maxLength=320 | Normalized identifier; E.164 for phone, email format for email. |

```json
{
  "identifier": {
    "kind": "phone",
    "value": "+919000000000"
  }
}
```

File uploads: **Not Applicable**.

### Success response

HTTP **202**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `UnifiedChallengeData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `challengeToken` | string | Required | No | None | minLength=1; maxLength=4096 | Opaque random challenge capability; only a keyed hash is stored. |
| `proofKind` | string | Required | No | None | enum=["otp","password","totp"] | Server-required next proof, not a caller role. |
| `expiresAt` | string | Required | No | None | format="date-time" | Challenge deadline from approved policy. |

```json
{
  "success": true,
  "data": {
    "challengeToken": "pv_challenge_SyntheticExampleOnly_7m3K9r2P6x4V8q1L",
    "proofKind": "otp",
    "expiresAt": "2026-10-24T10:40:00Z"
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
| 429 | RATE_LIMIT_EXCEEDED | Identifier/network abuse budget exhausted. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Honor Retry-After; do not probe other identifiers. |

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
| [`identity.authentication_challenges`](../../04-Database/Tables/identity/authentication_challenges.md) | None | `attempts`, `binding_json`, `blocked_at`, `consumed_at`, `expires_at`, `factor_type`, `identifier_encrypted`, `identity_version`, `max_attempts`, `mfa_factor_id`, `otp_challenge_id`, `parent_challenge_id`, `policy_version`, `purpose`, `requested_context_hash`, `session_id`, `token_hash`, `user_id` | Authentication_Access |
| [`identity.otp_challenges`](../../04-Database/Tables/identity/otp_challenges.md) | None | `purpose`, `channel`, `destination_hash`, `otp_hash`, `expires_at`, `max_attempts` | Authentication_Access |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `id`, `phone_country_code`, `phone_number`, `email_normalized`, `status`, `row_version`, `locked_until`, `account_closed_at`, `failed_login_count` | None | Authentication_Access |
| [`platform.audit_logs`](../../04-Database/Tables/platform/audit_logs.md) | None | `action`, `actor_user_id`, `after_data`, `before_data`, `request_id`, `resource_id`, `resource_type` | Shared audit/outbox infrastructure |

Master dependencies: `identity.users`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.challengeToken | API-generated random capability; keyed hash in authentication_challenges.token_hash, never return the database hash. |
| data.proofKind | authentication_challenges.factor_type filtered by pre-login enumeration policy. |
| data.expiresAt | authentication_challenges.expires_at for proof operations or identity.sessions.expires_at for session projection. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Normalize identifier; expose proof kind only from phone/email syntax, with uniform 202 for unknown/locked/suspended accounts. Dispatch only through committed outbox using existing WhatsApp-primary/SMS-fallback rules.
2. Persist opaque-token hash and encrypted identifier; unknown-user challenges have null user_id. No role, stored-contact hint or provider receipt is exposed before proof.

Perform success mutations, proof/counter/refresh/assignment state and audit in one owner transaction. Commit failed-proof counters/lockout and replay revocation even when returning an authentication error; do not roll those evidence updates back. Recheck grants under ordered locks before commit; retain non-secret audit/outbox atomically. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-098-01` | Known, unknown, locked and suspended phone identifiers return the same challenge DTO and approved timing class. | Designed / NOT RUN |
| `CT-API-098-02` | Email syntax always returns password proof kind; no role/factor enumeration. | Designed / NOT RUN |
| `CT-API-098-03` | Delivery retry cannot issue duplicate login proof or bypass expiry. | Designed / NOT RUN |
| `CT-API-098-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-098-AUTHORIZATION` | No bearer needed; forged, expired, wrong-purpose or replayed proof never grants a session/workspace. | Designed / NOT RUN |
| `CT-API-098-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-099 — POST `/v1/auth/login/verify`

**Verify the required login proof and complete its MFA chain. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Shared identity service; no app-specific account. |
| Consumer | Public |
| Features / workflow | `ACC-01`, `AUTH-01`, `AUTH-02`, `AUTH-03`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/auth/login/verify |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| NO | None (purpose-bound pre-session proof where supplied) | Public | Public challenge/proof only; no role or panel input |

Proof object has exactly one OTP/password/authenticatorCode and must match the stored next factor. Reject all session-bound step-up/enrollment challenges on this public route. Consume login challenge, record factor counter, enforce identity-wide staff session limit, create session/root refresh lineage and audit atomically. Password-only privileged login returns only mfa_required and a successor challenge; no credentials, identity or workspace details. Verified phone signup reuses the common identifier identity, serializes uniqueness and never creates staff grants. Customer profile/consent and permitted self-registration role activation remain Customer Accounts onboarding commands; mere login does not fabricate a role. Authenticated response includes the first workspace page in data and its pagination only in meta. Context is initially unselected; defaultContextToken is a hint. Unknown/wrong/expired/used proof has one generic 401.

No bearer authentication is required. Supplied proof is purpose-bound and validated by the backend; unknown identifiers never expose account/role/factor state.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Not Applicable | Omit | Existing human session only where specified; never client role. |
| Content-Type | media type | Required | application/json | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| If-Match | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| X-Request-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| X-Correlation-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Human identity operation, not a provider callback. |

Authorization headers are represented by OpenAPI security, not duplicated header parameters. No role/panel/organization header grants authority. JSON/Accept/trace validation is independent of credential verification.

### Path parameters

Not Applicable. No path parameters.

### Query parameters

Not Applicable. No query parameters.

### Request body and uploads

DTO: `UnifiedLoginVerifyRequest`. Unknown properties are rejected. Conditional proof/action fields must match the stored challenge and declared oneOf/allOf rules; a client cannot choose a weaker factor.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `challengeToken` | string | Required | No | None | minLength=1; maxLength=4096; writeOnly=true | Purpose-bound public login challenge; no role input. |
| `proof` | object | Required | No | None | See purpose/conditional rules | Typed proof; source and conditional use below. |
| `proof.otp` | string | Conditional | No | None | pattern="^[0-9]{6}$"; writeOnly=true | Write-only phone OTP; exact proof kind must match challenge. |
| `proof.password` | string | Conditional | No | None | minLength=1; maxLength=4096; writeOnly=true | Write-only password; no trimming, logging or response echo. |
| `proof.authenticatorCode` | string | Conditional | No | None | pattern="^[0-9]{6}$"; writeOnly=true | Write-only authenticator code; validate configured TOTP profile and monotonic counter. |

```json
{
  "challengeToken": "pv_challenge_SyntheticExampleOnly_7m3K9r2P6x4V8q1L",
  "proof": {
    "otp": "583914"
  }
}
```

File uploads: **Not Applicable**.

### Success response

HTTP **200**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `UnifiedAuthOutcome`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `state` | string | Required | No | None | enum=["authenticated","mfa_required"] | MFA-required state never includes credentials or workspace disclosures. |
| `credentials` | object | Required | Yes | None | See purpose/conditional rules | Typed credentials; source and conditional use below. |
| `credentials.accessToken` | string | Required | No | None | minLength=1; maxLength=4096 | Write-only bearer credential in transit; never persist cleartext. |
| `credentials.tokenType` | string | Required | No | None | enum=["Bearer"] | Typed tokenType; source and conditional use below. |
| `credentials.expiresIn` | integer | Required | No | None | minimum=1 | Configured token lifetime in seconds; sample is not an approved lifetime. |
| `credentials.refreshToken` | string | Required | No | None | minLength=1; maxLength=4096 | Rotating opaque credential; only a hash is stored in identity.sessions. |
| `credentials.sessionId` | string | Required | No | None | format="uuid" | identity.sessions.id |
| `credentials.userId` | string | Required | No | None | format="uuid" | identity.users.id |
| `challenge` | object | Required | Yes | None | See purpose/conditional rules | Typed challenge; source and conditional use below. |
| `challenge.challengeToken` | string | Required | No | None | minLength=1; maxLength=4096 | Opaque random challenge capability; only a keyed hash is stored. |
| `challenge.proofKind` | string | Required | No | None | enum=["otp","password","totp"] | Server-required next proof, not a caller role. |
| `challenge.expiresAt` | string | Required | No | None | format="date-time" | Challenge deadline from approved policy. |
| `identity` | object | Required | Yes | None | See purpose/conditional rules | Typed identity; source and conditional use below. |
| `identity.userId` | string | Required | No | None | format="uuid" | Common identity.users.id; never a panel-specific subject. |
| `identity.status` | string | Required | No | None | enum=["pending","active","locked","suspended","closed"] | Current identity state; business access requires active. |
| `workspaces` | array | Required | No | None | maxItems=100 | First page of live authorized contexts; continuation is GET /v1/auth/workspaces. |
| `workspaces[].contextToken` | string | Required | No | None | minLength=1; maxLength=4096 | Signed opaque session/assignment/policy selector; not an authorization grant. |
| `workspaces[].workspaceCode` | string | Required | No | None | minLength=1; maxLength=64 | Workspace from the versioned backend permission policy. |
| `workspaces[].assignmentId` | string | Required | No | None | format="uuid" | Public identity.user_roles.id; rechecked on every use. |
| `workspaces[].scopeType` | string | Required | No | None | enum=["global","organization","location","warehouse"] | Global maps to existing null/null database scope. |
| `workspaces[].scopeId` | string | Required | Yes | None | format="uuid" | Scoped target UUID; global only is null. |
| `workspaces[].organizationId` | string | Required | Yes | None | format="uuid" | Resolved authorized organization; not an input override. |
| `workspaces[].locationId` | string | Required | Yes | None | format="uuid" | Resolved authorized store/warehouse location. |
| `workspaces[].warehouseId` | string | Required | Yes | None | format="uuid" | Warehouse resource UUID when applicable. |
| `workspaces[].entryStatus` | string | Required | No | None | enum=["ready","step_up_required"] | Ready only when current verified methods satisfy target policy. |
| `defaultContextToken` | string | Required | Yes | None | minLength=1; maxLength=4096 | Hint only, non-null only for exactly one ready context globally. |

```json
{
  "success": true,
  "data": {
    "state": "authenticated",
    "credentials": {
      "accessToken": "eyJhbGciOiJFZERTQSJ9.pharmville-example.signature",
      "tokenType": "Bearer",
      "expiresIn": 900,
      "refreshToken": "pv_refresh_Kd9hQ7x4m2V6t8r3",
      "sessionId": "0192a1b2-c3d4-7e8f-9012-000000000002",
      "userId": "0192a1b2-c3d4-7e8f-9012-000000000001"
    },
    "challenge": null,
    "identity": {
      "userId": "0192a1b2-c3d4-7e8f-9012-000000000001",
      "status": "active"
    },
    "workspaces": [
      {
        "contextToken": "pv_context_SyntheticExampleOnly_7m3K9r2P6x4V8q1L",
        "workspaceCode": "customer",
        "assignmentId": "0192a1b2-c3d4-7e8f-9012-000000000003",
        "scopeType": "global",
        "scopeId": null,
        "organizationId": null,
        "locationId": null,
        "warehouseId": null,
        "entryStatus": "ready"
      },
      {
        "contextToken": "pv_context_SyntheticExampleOnly_7m3K9r2P6x4V8q1L_pharmacy",
        "workspaceCode": "pharmacist",
        "assignmentId": "0192a1b2-c3d4-7e8f-9012-000000000004",
        "scopeType": "location",
        "scopeId": "0192a1b2-c3d4-7e8f-9012-000000000006",
        "organizationId": "0192a1b2-c3d4-7e8f-9012-000000000005",
        "locationId": "0192a1b2-c3d4-7e8f-9012-000000000006",
        "warehouseId": null,
        "entryStatus": "step_up_required"
      }
    ],
    "defaultContextToken": null
  },
  "error": null,
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-000000000020",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-000000000021",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": {
      "totalCount": 2,
      "limit": 20,
      "offset": 0,
      "hasNext": false
    }
  }
}
```

Collection metadata is in `meta.pagination`: totalCount, limit, offset, hasNext. Count/sort/filter are computed only after authorization.

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 415 | UNSUPPORTED_MEDIA_TYPE | A JSON body uses an unsupported Content-Type. | No state/proof change. | Send Content-Type application/json and a valid JSON body. |
| 406 | NOT_ACCEPTABLE | The Accept header excludes application/json. | No state/proof change. | Request application/json. |
| 400 | BAD_REQUEST | Malformed JSON or tracing header. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Correct the transport input. |
| 422 | REQUEST_VALIDATION_ERROR | Declared field/type/conditional validation fails. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Correct named fields without changing caller authority. |
| 429 | RATE_LIMIT_EXCEEDED | Configured endpoint/subject/network abuse budget exceeded. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Honor Retry-After; bounded retry only. |
| 503 | AUTH_SERVICE_UNAVAILABLE | Identity/policy/database dependency unavailable. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Fail closed; retry safe reads; start new proof if outcome is uncertain. |
| 401 | AUTH_INVALID_CREDENTIALS | Wrong, expired, consumed or wrong-kind proof; inactive account. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Start fresh proof without an account-existence signal. |
| 403 | AUTH_ENROLLMENT_REQUIRED | Verified password cannot satisfy mandatory MFA because no approved verified factor exists. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use reviewed phone-plus-password enrollment/assisted onboarding; no privileged session. |

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
| [`identity.login_attempts`](../../04-Database/Tables/identity/login_attempts.md) | None | `user_id`, `login_identifier_hash`, `success`, `failure_code`, `ip_address`, `user_agent`, `request_id` | Authentication_Access |
| [`identity.authentication_challenges`](../../04-Database/Tables/identity/authentication_challenges.md) | `attempts`, `binding_json`, `blocked_at`, `consumed_at`, `created_at`, `created_by`, `expires_at`, `factor_type`, `id`, `identifier_encrypted`, `identity_version`, `max_attempts`, `mfa_factor_id`, `otp_challenge_id`, `parent_challenge_id`, `policy_version`, `purpose`, `requested_context_hash`, `row_version`, `session_id`, `token_hash`, `updated_at`, `updated_by`, `user_id` | `attempts`, `binding_json`, `blocked_at`, `consumed_at`, `expires_at`, `factor_type`, `identifier_encrypted`, `identity_version`, `max_attempts`, `mfa_factor_id`, `otp_challenge_id`, `parent_challenge_id`, `policy_version`, `purpose`, `requested_context_hash`, `session_id`, `token_hash`, `user_id` | Authentication_Access |
| [`identity.mfa_factors`](../../04-Database/Tables/identity/mfa_factors.md) | `id`, `user_id`, `factor_type`, `secret_encrypted`, `verified_at`, `disabled_at`, `last_accepted_totp_counter`, `row_version` | `last_accepted_totp_counter` | Authentication_Access |
| [`identity.otp_challenges`](../../04-Database/Tables/identity/otp_challenges.md) | `id`, `otp_hash`, `expires_at`, `attempts`, `max_attempts`, `blocked_at`, `consumed_at` | `attempts`, `consumed_at`, `blocked_at` | Authentication_Access |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | `id`, `code`, `resource`, `action`, `is_deleted` | None | Authentication_Access |
| [`identity.role_permissions`](../../04-Database/Tables/identity/role_permissions.md) | `role_id`, `permission_id`, `row_version` | None | Authentication_Access |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `id`, `code`, `is_deleted`, `row_version` | None | Authentication_Access |
| [`identity.session_refresh_tokens`](../../04-Database/Tables/identity/session_refresh_tokens.md) | None | `session_id`, `token_hash`, `expires_at` | Authentication_Access |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | `id`, `user_id`, `revoked_at`, `expires_at`, `context_version`, `active_assignment_id`, `active_workspace_code`, `password_verified_at`, `otp_verified_at`, `mfa_verified_at`, `authentication_policy_version`, `token_family_id`, `refresh_token_hash`, `row_version` | `user_id`, `refresh_token_hash`, `token_family_id`, `expires_at`, `authenticated_at`, `password_verified_at`, `otp_verified_at`, `mfa_verified_at`, `authentication_policy_version` | Authentication_Access |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `id`, `user_id`, `role_id`, `is_active`, `scope_type`, `scope_id`, `valid_from`, `valid_until`, `row_version` | None | Authentication_Access |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `id`, `status`, `row_version`, `password_hash`, `phone_country_code`, `phone_number`, `phone_verified_at`, `email_normalized`, `locked_until`, `account_closed_at`, `failed_login_count` | `failed_login_count`, `last_login_at`, `locked_until`, `phone_country_code`, `phone_number`, `phone_verified_at`, `status` | Authentication_Access |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `organization_id`, `location_type`, `is_active`, `is_deleted` | None | Admin_CMS |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `user_id`, `organization_id`, `location_id`, `status`, `row_version` | None | Admin_CMS |
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | `id`, `status`, `is_deleted` | None | Admin_CMS |
| [`platform.audit_logs`](../../04-Database/Tables/platform/audit_logs.md) | None | `action`, `actor_user_id`, `after_data`, `before_data`, `request_id`, `resource_id`, `resource_type` | Shared audit/outbox infrastructure |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `location_id`, `organization_id`, `status`, `is_deleted` | None | Warehouse |

Master dependencies: `identity.users`, `identity.roles`, `identity.permissions`, `organization.locations`, `organization.organizations`, `warehouse.warehouses`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.state | Derived outcome from this operation’s declared proof/enrollment state; not a fabricated database enum. |
| data.credentials | SessionData: session id/user id/expiry from sessions; raw freshly generated tokens are transient, only hashes persist. |
| data.challenge | Owned durable authentication_challenges projection; never contains factor secret or user roles before proof. |
| data.identity | identity.users.id/status; safe own-subject projection. |
| data.workspaces | Live user_roles/roles/role_permissions/permissions plus membership/scope joins and versioned workspace policy; signed selector is derived. |
| data.defaultContextToken | Derived hint from the complete currently ready context set; not an automatic grant. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Proof object has exactly one OTP/password/authenticatorCode and must match the stored next factor. Reject all session-bound step-up/enrollment challenges on this public route.
2. Consume login challenge, record factor counter, enforce identity-wide staff session limit, create session/root refresh lineage and audit atomically. Password-only privileged login returns only mfa_required and a successor challenge; no credentials, identity or workspace details.
3. Verified phone signup reuses the common identifier identity, serializes uniqueness and never creates staff grants. Customer profile/consent and permitted self-registration role activation remain Customer Accounts onboarding commands; mere login does not fabricate a role.
4. Authenticated response includes the first workspace page in data and its pagination only in meta. Context is initially unselected; defaultContextToken is a hint. Unknown/wrong/expired/used proof has one generic 401.

Perform success mutations, proof/counter/refresh/assignment state and audit in one owner transaction. Commit failed-proof counters/lockout and replay revocation even when returning an authentication error; do not roll those evidence updates back. Recheck grants under ordered locks before commit; retain non-secret audit/outbox atomically. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-099-01` | Customer OTP creates one shared subject/session and returns only permission-derived contexts. | Designed / NOT RUN |
| `CT-API-099-02` | Super Admin/Central Admin/Finance Manager password alone yields mfa_required with no credentials. | Designed / NOT RUN |
| `CT-API-099-03` | Two concurrent OTP/TOTP completions create at most one session; replayed counter is rejected. | Designed / NOT RUN |
| `CT-API-099-04` | A role revoked between proof and session commit cannot appear as a usable workspace. | Designed / NOT RUN |
| `CT-API-099-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-099-AUTHORIZATION` | No bearer needed; forged, expired, wrong-purpose or replayed proof never grants a session/workspace. | Designed / NOT RUN |
| `CT-API-099-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-100 — GET `/v1/auth/identity`

**Read the current shared subject, session assurance and context. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Shared identity service; no app-specific account. |
| Consumer | Any owned active identity session; business roles do not grant additional scope |
| Features / workflow | `AUTH-02`, `AUTH-04`, `ACC-02`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/auth/identity |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| YES | JWT | Any owned active identity session; business roles do not grant additional scope | auth.self — owned valid-session control; no business grant |

Owned auth.self read, available without a business assignment. Accept a valid session token with stale context solely to recover the current context; business endpoints still reject the old generation. Return no hashes, factors, other identities or unioned role grants. Inactive/revoked/expired session returns 401.

Resolve the owned active session on the backend. Auth.self operations do not require a business assignment; business/admin actions still require their exact context, methods, permission and target scope.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer <access JWT> | Existing human session only where specified; never client role. |
| Content-Type | media type | Not Applicable | Omit | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| If-Match | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| X-Request-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| X-Correlation-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Human identity operation, not a provider callback. |

Authorization headers are represented by OpenAPI security, not duplicated header parameters. No role/panel/organization header grants authority. JSON/Accept/trace validation is independent of credential verification.

### Path parameters

Not Applicable. No path parameters.

### Query parameters

Not Applicable. No query parameters.

### Request body and uploads

**No request body.**

File uploads: **Not Applicable**.

### Success response

HTTP **200**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control, ETag response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `UnifiedIdentityData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `identity` | object | Required | No | None | See purpose/conditional rules | Typed identity; source and conditional use below. |
| `identity.userId` | string | Required | No | None | format="uuid" | Common identity.users.id; never a panel-specific subject. |
| `identity.status` | string | Required | No | None | enum=["pending","active","locked","suspended","closed"] | Current identity state; business access requires active. |
| `sessionId` | string | Required | No | None | format="uuid" | Owned identity.sessions.id. |
| `contextVersion` | integer | Required | No | None | minimum=1 | Current monotonic session context generation. |
| `activeContext` | object | Required | Yes | None | See purpose/conditional rules | Typed activeContext; source and conditional use below. |
| `activeContext.workspaceCode` | string | Required | No | None | minLength=1; maxLength=64 | Backend-selected workspace code. |
| `activeContext.assignmentId` | string | Required | No | None | format="uuid" | Owned current assignment. |
| `activeContext.scopeType` | string | Required | No | None | enum=["global","organization","location","warehouse"] | Canonical scope type. |
| `activeContext.scopeId` | string | Required | Yes | None | format="uuid" | Current assignment scope. |
| `activeContext.organizationId` | string | Required | Yes | None | format="uuid" | Resolved organization. |
| `activeContext.locationId` | string | Required | Yes | None | format="uuid" | Resolved location. |
| `activeContext.warehouseId` | string | Required | Yes | None | format="uuid" | Resolved warehouse. |
| `passwordVerifiedAt` | string | Required | Yes | None | format="date-time" | Actual last verified password timestamp; not refreshed by OTP. |
| `otpVerifiedAt` | string | Required | Yes | None | format="date-time" | Actual last verified phone OTP timestamp. |
| `mfaVerifiedAt` | string | Required | Yes | None | format="date-time" | Actual last successful authenticator timestamp. |
| `expiresAt` | string | Required | No | None | format="date-time" | Absolute session expiry; never extended by workspace choice. |

```json
{
  "success": true,
  "data": {
    "identity": {
      "userId": "0192a1b2-c3d4-7e8f-9012-000000000001",
      "status": "active"
    },
    "sessionId": "0192a1b2-c3d4-7e8f-9012-000000000002",
    "contextVersion": 1,
    "activeContext": null,
    "passwordVerifiedAt": null,
    "otpVerifiedAt": "2026-10-24T10:30:00Z",
    "mfaVerifiedAt": null,
    "expiresAt": "2026-10-25T10:30:00Z"
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
| 406 | NOT_ACCEPTABLE | The Accept header excludes application/json. | No state/proof change. | Request application/json. |
| 400 | BAD_REQUEST | Malformed JSON or tracing header. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Correct the transport input. |
| 422 | REQUEST_VALIDATION_ERROR | Declared field/type/conditional validation fails. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Correct named fields without changing caller authority. |
| 429 | RATE_LIMIT_EXCEEDED | Configured endpoint/subject/network abuse budget exceeded. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Honor Retry-After; bounded retry only. |
| 503 | AUTH_SERVICE_UNAVAILABLE | Identity/policy/database dependency unavailable. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Fail closed; retry safe reads; start new proof if outcome is uncertain. |
| 401 | AUTH_SESSION_INVALID | Subject session expired, revoked or inactive. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Reauthenticate; no protected data. |

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
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `id`, `user_id`, `role_id`, `is_active`, `scope_type`, `scope_id`, `valid_from`, `valid_until`, `row_version` | None | Authentication_Access |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `id`, `status`, `row_version`, `locked_until`, `account_closed_at`, `phone_verified_at`, `email_verified_at`, `failed_login_count` | None | Authentication_Access |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `organization_id`, `location_type`, `is_active`, `is_deleted` | None | Admin_CMS |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `user_id`, `organization_id`, `location_id`, `status`, `row_version` | None | Admin_CMS |
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | `id`, `status`, `is_deleted` | None | Admin_CMS |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `location_id`, `organization_id`, `status`, `is_deleted` | None | Warehouse |

Master dependencies: `identity.users`, `identity.roles`, `identity.permissions`, `organization.locations`, `organization.organizations`, `warehouse.warehouses`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.identity | identity.users.id/status; safe own-subject projection. |
| data.sessionId | identity.sessions.id; ownership checked against user_id. |
| data.contextVersion | identity.sessions.context_version; ETag/generation. |
| data.activeContext | identity.sessions.active_assignment_id/active_workspace_code joined to live user_roles, scope and versioned workspace policy. |
| data.passwordVerifiedAt | identity.sessions.password_verified_at; actual proof time only. |
| data.otpVerifiedAt | identity.sessions.otp_verified_at; actual proof time only. |
| data.mfaVerifiedAt | identity.sessions.mfa_verified_at; actual proof time only. |
| data.expiresAt | authentication_challenges.expires_at for proof operations or identity.sessions.expires_at for session projection. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Owned auth.self read, available without a business assignment. Accept a valid session token with stale context solely to recover the current context; business endpoints still reject the old generation.
2. Return no hashes, factors, other identities or unioned role grants. Inactive/revoked/expired session returns 401.

Read-only scoped projection. No state transition, idempotency or external effect is applicable. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-100-01` | Multi-role person gets the same userId in Customer and Staff views. | Designed / NOT RUN |
| `CT-API-100-02` | No assignment returns activeContext:null without a manufactured default role. | Designed / NOT RUN |
| `CT-API-100-03` | Other subject/session selectors are rejected; no user_id query parameter exists. | Designed / NOT RUN |
| `CT-API-100-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-100-AUTHORIZATION` | Expired/revoked session or cross-subject/scope target is denied; hiding menus is irrelevant. | Designed / NOT RUN |
| `CT-API-100-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-101 — GET `/v1/auth/workspaces`

**Discover only live permission-authorized workspace choices. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Shared identity service; no app-specific account. |
| Consumer | Any owned active identity session; business roles do not grant additional scope |
| Features / workflow | `AUTH-04`, `ADM-03`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/auth/workspaces |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| YES | JWT | Any owned active identity session; business roles do not grant additional scope | auth.self — owned valid-session control; no business grant |

Use one live assignment per offered context. Entry permission AND business capability, scope/membership and account state must pass; required proof freshness determines ready versus step_up_required. Sort by workspaceCode, scopeType, scopeId then assignmentId; use shared limit/offset metadata. A default hint requires exactly one ready context across the full result, never just the page. contextToken is short-lived, session/assignment/version/policy-bound and a selector only. Do not expose inaccessible organizations or the full role master.

Resolve the owned active session on the backend. Auth.self operations do not require a business assignment; business/admin actions still require their exact context, methods, permission and target scope.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer <access JWT> | Existing human session only where specified; never client role. |
| Content-Type | media type | Not Applicable | Omit | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| If-Match | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| X-Request-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| X-Correlation-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Human identity operation, not a provider callback. |

Authorization headers are represented by OpenAPI security, not duplicated header parameters. No role/panel/organization header grants authority. JSON/Accept/trace validation is independent of credential verification.

### Path parameters

Not Applicable. No path parameters.

### Query parameters

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| limit | integer | Optional | No | 20 | {"type":"integer","minimum":1,"maximum":100,"default":20,"example":20} | Declared scoped parameter; does not grant access. |
| offset | integer | Optional | No | 0 | {"type":"integer","minimum":0,"maximum":100000,"default":0,"example":0} | Declared scoped parameter; does not grant access. |

### Request body and uploads

**No request body.**

File uploads: **Not Applicable**.

### Success response

HTTP **200**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `UnifiedWorkspaceList`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `workspaces` | array | Required | No | None | maxItems=100 | Authorized contexts sorted by workspaceCode, scopeType, scopeId, assignmentId. |
| `workspaces[].contextToken` | string | Required | No | None | minLength=1; maxLength=4096 | Signed opaque session/assignment/policy selector; not an authorization grant. |
| `workspaces[].workspaceCode` | string | Required | No | None | minLength=1; maxLength=64 | Workspace from the versioned backend permission policy. |
| `workspaces[].assignmentId` | string | Required | No | None | format="uuid" | Public identity.user_roles.id; rechecked on every use. |
| `workspaces[].scopeType` | string | Required | No | None | enum=["global","organization","location","warehouse"] | Global maps to existing null/null database scope. |
| `workspaces[].scopeId` | string | Required | Yes | None | format="uuid" | Scoped target UUID; global only is null. |
| `workspaces[].organizationId` | string | Required | Yes | None | format="uuid" | Resolved authorized organization; not an input override. |
| `workspaces[].locationId` | string | Required | Yes | None | format="uuid" | Resolved authorized store/warehouse location. |
| `workspaces[].warehouseId` | string | Required | Yes | None | format="uuid" | Warehouse resource UUID when applicable. |
| `workspaces[].entryStatus` | string | Required | No | None | enum=["ready","step_up_required"] | Ready only when current verified methods satisfy target policy. |
| `defaultContextToken` | string | Required | Yes | None | minLength=1; maxLength=4096 | Hint only; not inferred from the number of rows on this page. |

```json
{
  "success": true,
  "data": {
    "workspaces": [
      {
        "contextToken": "pv_context_SyntheticExampleOnly_7m3K9r2P6x4V8q1L",
        "workspaceCode": "customer",
        "assignmentId": "0192a1b2-c3d4-7e8f-9012-000000000003",
        "scopeType": "global",
        "scopeId": null,
        "organizationId": null,
        "locationId": null,
        "warehouseId": null,
        "entryStatus": "ready"
      },
      {
        "contextToken": "pv_context_SyntheticExampleOnly_7m3K9r2P6x4V8q1L_pharmacy",
        "workspaceCode": "pharmacist",
        "assignmentId": "0192a1b2-c3d4-7e8f-9012-000000000004",
        "scopeType": "location",
        "scopeId": "0192a1b2-c3d4-7e8f-9012-000000000006",
        "organizationId": "0192a1b2-c3d4-7e8f-9012-000000000005",
        "locationId": "0192a1b2-c3d4-7e8f-9012-000000000006",
        "warehouseId": null,
        "entryStatus": "step_up_required"
      }
    ],
    "defaultContextToken": null
  },
  "error": null,
  "meta": {
    "requestId": "0192a1b2-c3d4-7e8f-9012-000000000020",
    "correlationId": "0192a1b2-c3d4-7e8f-9012-000000000021",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": {
      "totalCount": 2,
      "limit": 20,
      "offset": 0,
      "hasNext": false
    }
  }
}
```

Collection metadata is in `meta.pagination`: totalCount, limit, offset, hasNext. Count/sort/filter are computed only after authorization.

### Endpoint errors and recovery

| HTTP Status | Error Code | Trigger | Expected Behaviour | Recovery |
| --- | --- | --- | --- | --- |
| 406 | NOT_ACCEPTABLE | The Accept header excludes application/json. | No state/proof change. | Request application/json. |
| 400 | BAD_REQUEST | Malformed JSON or tracing header. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Correct the transport input. |
| 422 | REQUEST_VALIDATION_ERROR | Declared field/type/conditional validation fails. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Correct named fields without changing caller authority. |
| 429 | RATE_LIMIT_EXCEEDED | Configured endpoint/subject/network abuse budget exceeded. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Honor Retry-After; bounded retry only. |
| 503 | AUTH_SERVICE_UNAVAILABLE | Identity/policy/database dependency unavailable. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Fail closed; retry safe reads; start new proof if outcome is uncertain. |
| 401 | AUTH_SESSION_INVALID | Subject session expired, revoked or inactive. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Reauthenticate; no protected data. |

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
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `id`, `user_id`, `role_id`, `is_active`, `scope_type`, `scope_id`, `valid_from`, `valid_until`, `row_version` | None | Authentication_Access |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `id`, `status`, `row_version`, `locked_until`, `account_closed_at`, `phone_verified_at`, `email_verified_at`, `failed_login_count` | None | Authentication_Access |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `organization_id`, `location_type`, `is_active`, `is_deleted` | None | Admin_CMS |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `user_id`, `organization_id`, `location_id`, `status`, `row_version` | None | Admin_CMS |
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | `id`, `status`, `is_deleted` | None | Admin_CMS |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `location_id`, `organization_id`, `status`, `is_deleted` | None | Warehouse |

Master dependencies: `identity.users`, `identity.roles`, `identity.permissions`, `organization.locations`, `organization.organizations`, `warehouse.warehouses`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.workspaces | Live user_roles/roles/role_permissions/permissions plus membership/scope joins and versioned workspace policy; signed selector is derived. |
| data.defaultContextToken | Derived hint from the complete currently ready context set; not an automatic grant. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Use one live assignment per offered context. Entry permission AND business capability, scope/membership and account state must pass; required proof freshness determines ready versus step_up_required.
2. Sort by workspaceCode, scopeType, scopeId then assignmentId; use shared limit/offset metadata. A default hint requires exactly one ready context across the full result, never just the page.
3. contextToken is short-lived, session/assignment/version/policy-bound and a selector only. Do not expose inaccessible organizations or the full role master.

Read-only scoped projection. No state transition, idempotency or external effect is applicable. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-101-01` | One person with Customer and Pharmacist grants sees both contexts without duplicate accounts. | Designed / NOT RUN |
| `CT-API-101-02` | Revoked, expired, deleted-role and out-of-membership assignments disappear. | Designed / NOT RUN |
| `CT-API-101-03` | Pagination cannot widen scope or turn a single visible page row into a false default. | Designed / NOT RUN |
| `CT-API-101-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-101-AUTHORIZATION` | Expired/revoked session or cross-subject/scope target is denied; hiding menus is irrelevant. | Designed / NOT RUN |
| `CT-API-101-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-102 — POST `/v1/auth/context`

**Activate an already authorized workspace and scope. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Shared identity service; no app-specific account. |
| Consumer | Any owned active identity session; business roles do not grant additional scope |
| Features / workflow | `AUTH-04`, `AUTH-02`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/auth/context |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| YES | JWT | Any owned active identity session; business roles do not grant additional scope | auth.self — owned valid-session control; no business grant |

Verify signed selector, same session/subject, current assignment and hierarchy, navigation/business permissions, policy version and required method timestamps under transaction locks. Never accept role/panel/organization overrides. If-Match uses "ctx-N" for sessions.context_version. Advance once and return a new-generation access JWT; do not rotate refresh here. Cross-tab old-generation business requests fail AUTH_CONTEXT_STALE. Missing stronger proof returns 403 AUTH_STEP_UP_REQUIRED; forbidden/revoked target returns 403 without activation. Lost response is recovered via current identity, then a new ETag, not blind replay.

Resolve the owned active session on the backend. Auth.self operations do not require a business assignment; business/admin actions still require their exact context, methods, permission and target scope.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer <access JWT> | Existing human session only where specified; never client role. |
| Content-Type | media type | Required | application/json | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| If-Match | string | Required | "ctx-4" | Strong context version precondition. |
| X-Request-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| X-Correlation-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Human identity operation, not a provider callback. |

Authorization headers are represented by OpenAPI security, not duplicated header parameters. No role/panel/organization header grants authority. JSON/Accept/trace validation is independent of credential verification.

### Path parameters

Not Applicable. No path parameters.

### Query parameters

Not Applicable. No query parameters.

### Request body and uploads

DTO: `UnifiedContextRequest`. Unknown properties are rejected. Conditional proof/action fields must match the stored challenge and declared oneOf/allOf rules; a client cannot choose a weaker factor.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `contextToken` | string | Required | No | None | minLength=1; maxLength=4096; writeOnly=true | Server-issued workspace selector; no role or panel fields. |

```json
{
  "contextToken": "pv_context_SyntheticExampleOnly_7m3K9r2P6x4V8q1L"
}
```

File uploads: **Not Applicable**.

### Success response

HTTP **200**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control, ETag response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `UnifiedContextData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `sessionId` | string | Required | No | None | format="uuid" | Current owned session. |
| `contextVersion` | integer | Required | No | None | minimum=1 | New session generation; old-context JWTs cannot authorize business requests. |
| `activeContext` | object | Required | No | None | See purpose/conditional rules | Typed activeContext; source and conditional use below. |
| `activeContext.workspaceCode` | string | Required | No | None | minLength=1; maxLength=64 | Backend-selected workspace code. |
| `activeContext.assignmentId` | string | Required | No | None | format="uuid" | Owned current assignment. |
| `activeContext.scopeType` | string | Required | No | None | enum=["global","organization","location","warehouse"] | Canonical scope type. |
| `activeContext.scopeId` | string | Required | Yes | None | format="uuid" | Current assignment scope. |
| `activeContext.organizationId` | string | Required | Yes | None | format="uuid" | Resolved organization. |
| `activeContext.locationId` | string | Required | Yes | None | format="uuid" | Resolved location. |
| `activeContext.warehouseId` | string | Required | Yes | None | format="uuid" | Resolved warehouse. |
| `accessToken` | string | Required | No | None | minLength=1; maxLength=4096 | Sensitive newly signed JWT for this context generation. |
| `tokenType` | string | Required | No | None | enum=["Bearer"] | Proposed transport; cookie variant needs explicit review. |
| `expiresIn` | integer | Required | No | None | minimum=1 | Access lifetime seconds from approved policy; example is not an approved duration. |

```json
{
  "success": true,
  "data": {
    "sessionId": "0192a1b2-c3d4-7e8f-9012-000000000002",
    "contextVersion": 2,
    "activeContext": {
      "workspaceCode": "customer",
      "assignmentId": "0192a1b2-c3d4-7e8f-9012-000000000003",
      "scopeType": "global",
      "scopeId": null,
      "organizationId": null,
      "locationId": null,
      "warehouseId": null
    },
    "accessToken": "eyJhbGciOiJFZERTQSJ9.pharmville-example.signature",
    "tokenType": "Bearer",
    "expiresIn": 900
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
| 403 | AUTH_STEP_UP_REQUIRED | Target is granted but current password/TOTP freshness is insufficient. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Complete target-bound step-up then retry with current ETag. |
| 403 | AUTH_WORKSPACE_FORBIDDEN | Selector belongs to another session, revoked assignment, wrong scope or ungranted workspace. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Reload authorized choices; never grant the requested panel. |
| 412 | PRECONDITION_FAILED | Context generation differs from If-Match. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Reload identity and current ETag. |
| 428 | PRECONDITION_REQUIRED | Required If-Match is missing. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Load the current resource ETag before mutating. |

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
| data.sessionId | identity.sessions.id; ownership checked against user_id. |
| data.contextVersion | identity.sessions.context_version; ETag/generation. |
| data.activeContext | identity.sessions.active_assignment_id/active_workspace_code joined to live user_roles, scope and versioned workspace policy. |
| data.accessToken | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.tokenType | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |
| data.expiresIn | Operation-specific safe projection from the exact read/write columns above; no raw row serialization. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Verify signed selector, same session/subject, current assignment and hierarchy, navigation/business permissions, policy version and required method timestamps under transaction locks. Never accept role/panel/organization overrides.
2. If-Match uses "ctx-N" for sessions.context_version. Advance once and return a new-generation access JWT; do not rotate refresh here. Cross-tab old-generation business requests fail AUTH_CONTEXT_STALE.
3. Missing stronger proof returns 403 AUTH_STEP_UP_REQUIRED; forbidden/revoked target returns 403 without activation. Lost response is recovered via current identity, then a new ETag, not blind replay.

Perform success mutations, proof/counter/refresh/assignment state and audit in one owner transaction. Commit failed-proof counters/lockout and replay revocation even when returning an authentication error; do not roll those evidence updates back. Recheck grants under ordered locks before commit; retain non-secret audit/outbox atomically. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-102-01` | Authorized Customer→Pharmacist switch requires password and authenticator and preserves the subject. | Designed / NOT RUN |
| `CT-API-102-02` | Forged role/panel selector and cross-store/organization selection leave session context unchanged. | Designed / NOT RUN |
| `CT-API-102-03` | Concurrent switches with one ETag yield one winner; the other reloads. | Designed / NOT RUN |
| `CT-API-102-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-102-AUTHORIZATION` | Expired/revoked session or cross-subject/scope target is denied; hiding menus is irrelevant. | Designed / NOT RUN |
| `CT-API-102-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-103 — POST `/v1/auth/step-up`

**Prove missing methods for a granted workspace without switching it. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Shared identity service; no app-specific account. |
| Consumer | Any owned active identity session; business roles do not grant additional scope |
| Features / workflow | `AUTH-01`, `AUTH-02`, `AUTH-04`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/auth/step-up |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| YES | JWT | Any owned active identity session; business roles do not grant additional scope | auth.self — owned valid-session control; no business grant |

begin checks the granted target before issuing a session/assignment/policy-bound challenge for the next missing method. verify accepts only this session chain, not a public login token. After valid password, persist its truthful timestamp without granting target access. If no verified factor exists, return enrollment_required only after valid first proof; enrollment requires the additional verified-phone bootstrap. Valid TOTP advances the locked counter and consumes its challenge. Recheck target role and policy at every successor and final verification. verified only means required methods passed; POST /auth/context still authorizes and activates.

Resolve the owned active session on the backend. Auth.self operations do not require a business assignment; business/admin actions still require their exact context, methods, permission and target scope.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer <access JWT> | Existing human session only where specified; never client role. |
| Content-Type | media type | Required | application/json | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| If-Match | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| X-Request-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| X-Correlation-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Human identity operation, not a provider callback. |

Authorization headers are represented by OpenAPI security, not duplicated header parameters. No role/panel/organization header grants authority. JSON/Accept/trace validation is independent of credential verification.

### Path parameters

Not Applicable. No path parameters.

### Query parameters

Not Applicable. No query parameters.

### Request body and uploads

DTO: `UnifiedStepUpRequest`. Unknown properties are rejected. Conditional proof/action fields must match the stored challenge and declared oneOf/allOf rules; a client cannot choose a weaker factor.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `action` | string | Required | No | None | enum=["begin","verify"] | Both actions require the existing owned session. |
| `contextToken` | string | Conditional | No | None | minLength=1; maxLength=4096; writeOnly=true | Required for begin; selector issued by workspace discovery. |
| `challengeToken` | string | Conditional | No | None | minLength=1; maxLength=4096; writeOnly=true | Required for verify; bound to session and original target. |
| `proof` | object | Conditional | No | None | See purpose/conditional rules | Typed proof; source and conditional use below. |
| `proof.otp` | string | Conditional | No | None | pattern="^[0-9]{6}$"; writeOnly=true | Write-only phone OTP; exact proof kind must match challenge. |
| `proof.password` | string | Conditional | No | None | minLength=1; maxLength=4096; writeOnly=true | Write-only password; no trimming, logging or response echo. |
| `proof.authenticatorCode` | string | Conditional | No | None | pattern="^[0-9]{6}$"; writeOnly=true | Write-only authenticator code; validate configured TOTP profile and monotonic counter. |

```json
{
  "action": "begin",
  "contextToken": "pv_context_SyntheticExampleOnly_7m3K9r2P6x4V8q1L_pharmacy"
}
```

File uploads: **Not Applicable**.

### Success response

HTTP **200**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `UnifiedStepUpData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `state` | string | Required | No | None | enum=["challenge_required","verified","enrollment_required"] | No state automatically activates a workspace. |
| `challenge` | object | Required | Yes | None | See purpose/conditional rules | Typed challenge; source and conditional use below. |
| `challenge.challengeToken` | string | Required | No | None | minLength=1; maxLength=4096 | Opaque random challenge capability; only a keyed hash is stored. |
| `challenge.proofKind` | string | Required | No | None | enum=["otp","password","totp"] | Server-required next proof, not a caller role. |
| `challenge.expiresAt` | string | Required | No | None | format="date-time" | Challenge deadline from approved policy. |
| `sessionId` | string | Required | No | None | format="uuid" | The existing session; step-up cannot create another identity. |
| `contextVersion` | integer | Required | No | None | minimum=1 | Unchanged until explicit context activation. |
| `verifiedMethods` | array | Required | No | None | maxItems=3 | Methods with truthful independent timestamps. |

```json
{
  "success": true,
  "data": {
    "state": "challenge_required",
    "challenge": {
      "challengeToken": "pv_challenge_SyntheticExampleOnly_7m3K9r2P6x4V8q1L",
      "proofKind": "password",
      "expiresAt": "2026-10-24T10:40:00Z"
    },
    "sessionId": "0192a1b2-c3d4-7e8f-9012-000000000002",
    "contextVersion": 1,
    "verifiedMethods": [
      "otp"
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
| 401 | AUTH_INVALID_CREDENTIALS | Wrong, expired, replayed or another session’s step-up proof. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Restart step-up; never complete context activation. |
| 403 | AUTH_WORKSPACE_FORBIDDEN | Target assignment is not currently granted or valid. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Reload workspaces rather than probing a role. |

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
| [`identity.login_attempts`](../../04-Database/Tables/identity/login_attempts.md) | None | `user_id`, `login_identifier_hash`, `success`, `failure_code`, `ip_address`, `user_agent`, `request_id` | Authentication_Access |
| [`identity.authentication_challenges`](../../04-Database/Tables/identity/authentication_challenges.md) | `attempts`, `binding_json`, `blocked_at`, `consumed_at`, `created_at`, `created_by`, `expires_at`, `factor_type`, `id`, `identifier_encrypted`, `identity_version`, `max_attempts`, `mfa_factor_id`, `otp_challenge_id`, `parent_challenge_id`, `policy_version`, `purpose`, `requested_context_hash`, `row_version`, `session_id`, `token_hash`, `updated_at`, `updated_by`, `user_id` | `attempts`, `binding_json`, `blocked_at`, `consumed_at`, `expires_at`, `factor_type`, `identifier_encrypted`, `identity_version`, `max_attempts`, `mfa_factor_id`, `otp_challenge_id`, `parent_challenge_id`, `policy_version`, `purpose`, `requested_context_hash`, `session_id`, `token_hash`, `user_id` | Authentication_Access |
| [`identity.mfa_factors`](../../04-Database/Tables/identity/mfa_factors.md) | `id`, `user_id`, `factor_type`, `secret_encrypted`, `verified_at`, `disabled_at`, `last_accepted_totp_counter`, `row_version` | `last_accepted_totp_counter` | Authentication_Access |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | `id`, `code`, `resource`, `action`, `is_deleted` | None | Authentication_Access |
| [`identity.role_permissions`](../../04-Database/Tables/identity/role_permissions.md) | `role_id`, `permission_id`, `row_version` | None | Authentication_Access |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `id`, `code`, `is_deleted`, `row_version` | None | Authentication_Access |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | `id`, `user_id`, `revoked_at`, `expires_at`, `context_version`, `active_assignment_id`, `active_workspace_code`, `password_verified_at`, `otp_verified_at`, `mfa_verified_at`, `authentication_policy_version`, `token_family_id`, `refresh_token_hash`, `row_version` | `password_verified_at`, `mfa_verified_at`, `authentication_policy_version` | Authentication_Access |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `id`, `user_id`, `role_id`, `is_active`, `scope_type`, `scope_id`, `valid_from`, `valid_until`, `row_version` | None | Authentication_Access |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `id`, `password_hash`, `status`, `row_version`, `locked_until`, `account_closed_at`, `failed_login_count` | `failed_login_count`, `locked_until` | Authentication_Access |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `organization_id`, `location_type`, `is_active`, `is_deleted` | None | Admin_CMS |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `user_id`, `organization_id`, `location_id`, `status`, `row_version` | None | Admin_CMS |
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | `id`, `status`, `is_deleted` | None | Admin_CMS |
| [`platform.audit_logs`](../../04-Database/Tables/platform/audit_logs.md) | None | `action`, `actor_user_id`, `after_data`, `before_data`, `request_id`, `resource_id`, `resource_type` | Shared audit/outbox infrastructure |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `location_id`, `organization_id`, `status`, `is_deleted` | None | Warehouse |

Master dependencies: `identity.users`, `identity.roles`, `identity.permissions`, `organization.locations`, `organization.organizations`, `warehouse.warehouses`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.state | Derived outcome from this operation’s declared proof/enrollment state; not a fabricated database enum. |
| data.challenge | Owned durable authentication_challenges projection; never contains factor secret or user roles before proof. |
| data.sessionId | identity.sessions.id; ownership checked against user_id. |
| data.contextVersion | identity.sessions.context_version; ETag/generation. |
| data.verifiedMethods | Derived from independently verified session method timestamps and current target policy. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. begin checks the granted target before issuing a session/assignment/policy-bound challenge for the next missing method. verify accepts only this session chain, not a public login token.
2. After valid password, persist its truthful timestamp without granting target access. If no verified factor exists, return enrollment_required only after valid first proof; enrollment requires the additional verified-phone bootstrap.
3. Valid TOTP advances the locked counter and consumes its challenge. Recheck target role and policy at every successor and final verification. verified only means required methods passed; POST /auth/context still authorizes and activates.

Perform success mutations, proof/counter/refresh/assignment state and audit in one owner transaction. Commit failed-proof counters/lockout and replay revocation even when returning an authentication error; do not roll those evidence updates back. Recheck grants under ordered locks before commit; retain non-secret audit/outbox atomically. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-103-01` | OTP-only Customer with a privileged assignment must prove password then TOTP. | Designed / NOT RUN |
| `CT-API-103-02` | Code replay, session swap and target change fail without refreshing another method timestamp. | Designed / NOT RUN |
| `CT-API-103-03` | Role removal during step-up makes the final target unusable. | Designed / NOT RUN |
| `CT-API-103-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-103-AUTHORIZATION` | Expired/revoked session or cross-subject/scope target is denied; hiding menus is irrelevant. | Designed / NOT RUN |
| `CT-API-103-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-104 — POST `/v1/auth/mfa/enrollment`

**Enroll and confirm an owned authenticator under the reviewed bootstrap policy. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Shared identity service; no app-specific account. |
| Consumer | Any owned active identity session; business roles do not grant additional scope |
| Features / workflow | `AUTH-01`, `AUTH-02`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/auth/mfa/enrollment |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| YES | JWT | Any owned active identity session; business roles do not grant additional scope | auth.self — owned valid-session control; no business grant |

First enrollment requires a valid owned base session, fresh verified-phone OTP AND password, and an eligible current staff assignment; replacement also requires current authenticator proof. Unknown bootstrap/recovery policy fails closed pending D-003. begin creates a pending encrypted factor and bound challenge; return provisioning URI once over TLS/no-store. The URI shown is synthetic, never a deployment secret. Do not expose the existing factor secret or accept an arbitrary userId/factorId. confirm consumes the exact session/factor challenge and advances counter atomically; set verified_at only on valid proof. Pending/expired enrollment grants no workspace; existing factors are not silently disabled.

Resolve the owned active session on the backend. Auth.self operations do not require a business assignment; business/admin actions still require their exact context, methods, permission and target scope.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer <access JWT> | Existing human session only where specified; never client role. |
| Content-Type | media type | Required | application/json | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| If-Match | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| X-Request-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| X-Correlation-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Human identity operation, not a provider callback. |

Authorization headers are represented by OpenAPI security, not duplicated header parameters. No role/panel/organization header grants authority. JSON/Accept/trace validation is independent of credential verification.

### Path parameters

Not Applicable. No path parameters.

### Query parameters

Not Applicable. No query parameters.

### Request body and uploads

DTO: `UnifiedEnrollmentRequest`. Unknown properties are rejected. Conditional proof/action fields must match the stored challenge and declared oneOf/allOf rules; a client cannot choose a weaker factor.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `action` | string | Required | No | None | enum=["begin","confirm"] | Begin creates pending factor; confirm verifies ownership of its secret. |
| `label` | string | Conditional | No | None | minLength=1; maxLength=64 | User-readable device label, never a shared secret. |
| `challengeToken` | string | Conditional | No | None | minLength=1; maxLength=4096; writeOnly=true | Required for confirm; session/factor bound. |
| `authenticatorCode` | string | Conditional | No | None | pattern="^[0-9]{6}$"; writeOnly=true | Required for confirm; never logged. |

```json
{
  "action": "begin",
  "label": "Work authenticator"
}
```

File uploads: **Not Applicable**.

### Success response

HTTP **200**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `UnifiedEnrollmentData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `state` | string | Required | No | None | enum=["pending_confirmation","enabled"] | Pending factors grant no access. |
| `factorId` | string | Required | No | None | format="uuid" | Owned identity.mfa_factors.id. |
| `challengeToken` | string | Required | Yes | None | minLength=1; maxLength=4096 | Present only when beginning enrollment. |
| `provisioningUri` | string | Required | Yes | None | format="uri" | Sensitive one-time enrollment URI; synthetic example only, never log/cache. |
| `expiresAt` | string | Required | Yes | None | format="date-time" | Present for pending enrollment. |
| `verifiedAt` | string | Required | Yes | None | format="date-time" | Present only after successful confirmation. |

```json
{
  "success": true,
  "data": {
    "state": "pending_confirmation",
    "factorId": "0192a1b2-c3d4-7e8f-9012-000000000008",
    "challengeToken": "pv_challenge_SyntheticExampleOnly_7m3K9r2P6x4V8q1L",
    "provisioningUri": "otpauth://totp/Pharmville:synthetic?secret=AAAAAAAAAAAAAAAA&issuer=Pharmville",
    "expiresAt": "2026-10-24T10:40:00Z",
    "verifiedAt": null
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
| 403 | AUTH_STEP_UP_REQUIRED | Required fresh password/phone or replacement-factor proof is missing. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Prove missing methods or use approved assisted onboarding. |
| 409 | AUTH_FACTOR_CONFLICT | The same label already exists or factor state changed. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Reload own factor state; do not overwrite or disclose a secret. |
| 401 | AUTH_INVALID_CREDENTIALS | Wrong, expired or replayed enrollment proof. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Restart eligible enrollment; pending factor is not enabled. |

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
| [`identity.login_attempts`](../../04-Database/Tables/identity/login_attempts.md) | None | `user_id`, `login_identifier_hash`, `success`, `failure_code`, `ip_address`, `user_agent`, `request_id` | Authentication_Access |
| [`platform.outbox_events`](../../04-Database/Tables/platform/outbox_events.md) | None | `aggregate_type`, `aggregate_id`, `event_type`, `event_version`, `payload`, `headers`, `available_at` | Shared platform runtime via Identity transaction |
| [`identity.authentication_challenges`](../../04-Database/Tables/identity/authentication_challenges.md) | `attempts`, `binding_json`, `blocked_at`, `consumed_at`, `created_at`, `created_by`, `expires_at`, `factor_type`, `id`, `identifier_encrypted`, `identity_version`, `max_attempts`, `mfa_factor_id`, `otp_challenge_id`, `parent_challenge_id`, `policy_version`, `purpose`, `requested_context_hash`, `row_version`, `session_id`, `token_hash`, `updated_at`, `updated_by`, `user_id` | `attempts`, `binding_json`, `blocked_at`, `consumed_at`, `expires_at`, `factor_type`, `identifier_encrypted`, `identity_version`, `max_attempts`, `mfa_factor_id`, `otp_challenge_id`, `parent_challenge_id`, `policy_version`, `purpose`, `requested_context_hash`, `session_id`, `token_hash`, `user_id` | Authentication_Access |
| [`identity.mfa_factors`](../../04-Database/Tables/identity/mfa_factors.md) | `id`, `user_id`, `factor_type`, `label`, `verified_at`, `disabled_at`, `last_accepted_totp_counter` | `user_id`, `factor_type`, `label`, `secret_encrypted`, `verified_at`, `last_accepted_totp_counter` | Authentication_Access |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | `id`, `code`, `resource`, `action`, `is_deleted` | None | Authentication_Access |
| [`identity.role_permissions`](../../04-Database/Tables/identity/role_permissions.md) | `role_id`, `permission_id`, `row_version` | None | Authentication_Access |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `id`, `code`, `is_deleted`, `row_version` | None | Authentication_Access |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | `id`, `user_id`, `revoked_at`, `expires_at`, `context_version`, `active_assignment_id`, `active_workspace_code`, `password_verified_at`, `otp_verified_at`, `mfa_verified_at`, `authentication_policy_version`, `token_family_id`, `refresh_token_hash`, `row_version` | `mfa_verified_at` | Authentication_Access |
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
| data.state | Derived outcome from this operation’s declared proof/enrollment state; not a fabricated database enum. |
| data.factorId | identity.mfa_factors.id, owned by the current user. |
| data.challengeToken | API-generated random capability; keyed hash in authentication_challenges.token_hash, never return the database hash. |
| data.provisioningUri | One-time API construction from newly generated secret encrypted into mfa_factors.secret_encrypted; never a stored public URL. |
| data.expiresAt | authentication_challenges.expires_at for proof operations or identity.sessions.expires_at for session projection. |
| data.verifiedAt | identity.mfa_factors.verified_at only after successful confirmation. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. First enrollment requires a valid owned base session, fresh verified-phone OTP AND password, and an eligible current staff assignment; replacement also requires current authenticator proof. Unknown bootstrap/recovery policy fails closed pending D-003.
2. begin creates a pending encrypted factor and bound challenge; return provisioning URI once over TLS/no-store. The URI shown is synthetic, never a deployment secret. Do not expose the existing factor secret or accept an arbitrary userId/factorId.
3. confirm consumes the exact session/factor challenge and advances counter atomically; set verified_at only on valid proof. Pending/expired enrollment grants no workspace; existing factors are not silently disabled.

Perform success mutations, proof/counter/refresh/assignment state and audit in one owner transaction. Commit failed-proof counters/lockout and replay revocation even when returning an authentication error; do not roll those evidence updates back. Recheck grants under ordered locks before commit; retain non-secret audit/outbox atomically. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-104-01` | Pending factor cannot authenticate until its exact code/challenge is confirmed. | Designed / NOT RUN |
| `CT-API-104-02` | Wrong owner, expired enrollment, replayed counter and password-only bootstrap fail. | Designed / NOT RUN |
| `CT-API-104-03` | Concurrent begins respect user/factor-type/label uniqueness; secrets are never logged. | Designed / NOT RUN |
| `CT-API-104-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-104-AUTHORIZATION` | Expired/revoked session or cross-subject/scope target is denied; hiding menus is irrelevant. | Designed / NOT RUN |
| `CT-API-104-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-105 — POST `/v1/auth/credentials/password`

**Change an existing password and invalidate all sessions. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Shared identity service; no app-specific account. |
| Consumer | Any owned active identity session; business roles do not grant additional scope |
| Features / workflow | `AUTH-01`, `AUTH-02`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/auth/credentials/password |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| YES | JWT | Any owned active identity session; business roles do not grant additional scope | auth.self — owned valid-session control; no business grant |

Require existing password proof and current MFA appropriate to the role; never create staff credentials on an OTP-only account through this endpoint. Evaluate approved password/history policy without logging either field. Lock the subject; commit new password hash/history, session/family/proof invalidation and audit together. Revoke current session too; return no access/refresh token and require reauthentication.

Resolve the owned active session on the backend. Auth.self operations do not require a business assignment; business/admin actions still require their exact context, methods, permission and target scope.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Required | Bearer <access JWT> | Existing human session only where specified; never client role. |
| Content-Type | media type | Required | application/json | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| If-Match | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| X-Request-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| X-Correlation-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Human identity operation, not a provider callback. |

Authorization headers are represented by OpenAPI security, not duplicated header parameters. No role/panel/organization header grants authority. JSON/Accept/trace validation is independent of credential verification.

### Path parameters

Not Applicable. No path parameters.

### Query parameters

Not Applicable. No query parameters.

### Request body and uploads

DTO: `UnifiedPasswordRequest`. Unknown properties are rejected. Conditional proof/action fields must match the stored challenge and declared oneOf/allOf rules; a client cannot choose a weaker factor.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `currentPassword` | string | Required | No | None | minLength=1; maxLength=4096; writeOnly=true | Existing password proof; no password creation for OTP-only accounts. |
| `newPassword` | string | Required | No | None | minLength=1; maxLength=4096; writeOnly=true | New password satisfying approved length/history/breach policy. |

```json
{
  "currentPassword": "SyntheticCurrentPasswordOnly",
  "newPassword": "SyntheticReplacementPasswordOnly"
}
```

File uploads: **Not Applicable**.

### Success response

HTTP **200**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `UnifiedCredentialChangedData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `changedAt` | string | Required | No | None | format="date-time" | Committed credential-change time. |
| `reauthenticationRequired` | boolean | Required | No | None | const=true | All existing sessions/proofs are revoked. |

```json
{
  "success": true,
  "data": {
    "changedAt": "2026-10-24T10:30:00Z",
    "reauthenticationRequired": true
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
| 401 | AUTH_INVALID_CREDENTIALS | Current password proof is wrong. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Do not change credential; recover through the separate proof flow. |
| 403 | AUTH_STEP_UP_REQUIRED | Required recent MFA is absent. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Perform reviewed step-up before changing the credential. |
| 422 | PASSWORD_POLICY_REJECTED | Password/history policy fails or account has no configured password. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Use an approved value or controlled onboarding; no silent password bootstrap. |

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
| [`identity.login_attempts`](../../04-Database/Tables/identity/login_attempts.md) | None | `user_id`, `login_identifier_hash`, `success`, `failure_code`, `ip_address`, `user_agent`, `request_id` | Authentication_Access |
| [`platform.outbox_events`](../../04-Database/Tables/platform/outbox_events.md) | None | `aggregate_type`, `aggregate_id`, `event_type`, `event_version`, `payload`, `headers`, `available_at` | Shared platform runtime via Identity transaction |
| [`identity.authentication_challenges`](../../04-Database/Tables/identity/authentication_challenges.md) | None | `blocked_at` | Authentication_Access |
| [`identity.password_history`](../../04-Database/Tables/identity/password_history.md) | `user_id`, `password_hash`, `created_at` | `user_id`, `password_hash` | Authentication_Access |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | `id`, `code`, `resource`, `action`, `is_deleted` | None | Authentication_Access |
| [`identity.role_permissions`](../../04-Database/Tables/identity/role_permissions.md) | `role_id`, `permission_id`, `row_version` | None | Authentication_Access |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `id`, `code`, `is_deleted`, `row_version` | None | Authentication_Access |
| [`identity.session_refresh_tokens`](../../04-Database/Tables/identity/session_refresh_tokens.md) | None | `revoked_at` | Authentication_Access |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | `id`, `user_id`, `revoked_at`, `expires_at`, `context_version`, `active_assignment_id`, `active_workspace_code`, `password_verified_at`, `otp_verified_at`, `mfa_verified_at`, `authentication_policy_version`, `token_family_id`, `refresh_token_hash`, `row_version` | `revoked_at`, `revoke_reason` | Authentication_Access |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `id`, `user_id`, `role_id`, `is_active`, `scope_type`, `scope_id`, `valid_from`, `valid_until`, `row_version` | None | Authentication_Access |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `id`, `password_hash`, `row_version`, `status`, `locked_until`, `account_closed_at`, `failed_login_count` | `password_hash`, `failed_login_count`, `locked_until` | Authentication_Access |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `organization_id`, `location_type`, `is_active`, `is_deleted` | None | Admin_CMS |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `user_id`, `organization_id`, `location_id`, `status`, `row_version` | None | Admin_CMS |
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | `id`, `status`, `is_deleted` | None | Admin_CMS |
| [`platform.audit_logs`](../../04-Database/Tables/platform/audit_logs.md) | None | `action`, `actor_user_id`, `after_data`, `before_data`, `request_id`, `resource_id`, `resource_type` | Shared audit/outbox infrastructure |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `location_id`, `organization_id`, `status`, `is_deleted` | None | Warehouse |

Master dependencies: `identity.users`, `identity.roles`, `identity.permissions`, `organization.locations`, `organization.organizations`, `warehouse.warehouses`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.changedAt | Committed users/password_history credential change and session revocation time. |
| data.reauthenticationRequired | Derived true because all old sessions were revoked. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Require existing password proof and current MFA appropriate to the role; never create staff credentials on an OTP-only account through this endpoint. Evaluate approved password/history policy without logging either field.
2. Lock the subject; commit new password hash/history, session/family/proof invalidation and audit together. Revoke current session too; return no access/refresh token and require reauthentication.

Perform success mutations, proof/counter/refresh/assignment state and audit in one owner transaction. Commit failed-proof counters/lockout and replay revocation even when returning an authentication error; do not roll those evidence updates back. Recheck grants under ordered locks before commit; retain non-secret audit/outbox atomically. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-105-01` | Successful change revokes every session and pending proof for the common subject. | Designed / NOT RUN |
| `CT-API-105-02` | Concurrent refresh cannot survive the serialized password change. | Designed / NOT RUN |
| `CT-API-105-03` | Wrong password/MFA or history rejection leaves current credential intact. | Designed / NOT RUN |
| `CT-API-105-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-105-AUTHORIZATION` | Expired/revoked session or cross-subject/scope target is denied; hiding menus is irrelevant. | Designed / NOT RUN |
| `CT-API-105-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-106 — POST `/v1/auth/recovery/request`

**Begin neutral password recovery or assisted authenticator recovery. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Shared identity service; no app-specific account. |
| Consumer | Public |
| Features / workflow | `AUTH-02`, `AUTH-03`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/auth/recovery/request |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| NO | None (purpose-bound pre-session proof where supplied) | Public | Public challenge/proof only; no role or panel input |

Return the same neutral 202 case token/expiry/message for known, unknown, unsupported, suspended or locked accounts. Emit no stored contact/factor hint. Delivery is asynchronous under existing phone rules. Password recovery is auto-completable only with existing verified-phone OTP plus existing verified authenticator. Authenticator loss and unsupported recovery use an assisted review; this route never disables factors, unlocks accounts or grants a workspace.

No bearer authentication is required. Supplied proof is purpose-bound and validated by the backend; unknown identifiers never expose account/role/factor state.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Not Applicable | Omit | Existing human session only where specified; never client role. |
| Content-Type | media type | Required | application/json | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| If-Match | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| X-Request-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| X-Correlation-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Human identity operation, not a provider callback. |

Authorization headers are represented by OpenAPI security, not duplicated header parameters. No role/panel/organization header grants authority. JSON/Accept/trace validation is independent of credential verification.

### Path parameters

Not Applicable. No path parameters.

### Query parameters

Not Applicable. No query parameters.

### Request body and uploads

DTO: `UnifiedRecoveryRequest`. Unknown properties are rejected. Conditional proof/action fields must match the stored challenge and declared oneOf/allOf rules; a client cannot choose a weaker factor.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `identifier` | object | Required | No | None | See purpose/conditional rules | Typed identifier; source and conditional use below. |
| `identifier.kind` | string | Required | No | None | enum=["phone","email"] | Phone E.164 uses OTP; email uses password. Public shape does not vary by account existence. |
| `identifier.value` | string | Required | No | None | minLength=1; maxLength=320 | Normalized identifier; E.164 for phone, email format for email. |
| `credential` | string | Required | No | None | enum=["password","authenticator"] | Authenticator loss is assisted only; no automatic MFA removal. |

```json
{
  "identifier": {
    "kind": "phone",
    "value": "+919000000000"
  },
  "credential": "password"
}
```

File uploads: **Not Applicable**.

### Success response

HTTP **202**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `UnifiedRecoveryData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `recoveryToken` | string | Required | No | None | minLength=1; maxLength=4096 | Opaque neutral case/proof reference for known and unknown identifiers. |
| `expiresAt` | string | Required | No | None | format="date-time" | Uniform configured recovery deadline. |
| `message` | string | Required | No | None | const="If eligible, recovery instructions will be delivered." | Identical regardless of account, factor or delivery state. |

```json
{
  "success": true,
  "data": {
    "recoveryToken": "pv_challenge_SyntheticExampleOnly_7m3K9r2P6x4V8q1L",
    "expiresAt": "2026-10-24T10:40:00Z",
    "message": "If eligible, recovery instructions will be delivered."
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
| [`identity.authentication_challenges`](../../04-Database/Tables/identity/authentication_challenges.md) | None | `attempts`, `binding_json`, `blocked_at`, `consumed_at`, `expires_at`, `factor_type`, `identifier_encrypted`, `identity_version`, `max_attempts`, `mfa_factor_id`, `otp_challenge_id`, `parent_challenge_id`, `policy_version`, `purpose`, `requested_context_hash`, `session_id`, `token_hash`, `user_id` | Authentication_Access |
| [`identity.otp_challenges`](../../04-Database/Tables/identity/otp_challenges.md) | None | `purpose`, `channel`, `destination_hash`, `otp_hash`, `expires_at`, `max_attempts` | Authentication_Access |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `id`, `status`, `row_version`, `phone_country_code`, `phone_number`, `phone_verified_at`, `email_normalized`, `locked_until`, `account_closed_at`, `failed_login_count` | None | Authentication_Access |
| [`platform.audit_logs`](../../04-Database/Tables/platform/audit_logs.md) | None | `action`, `actor_user_id`, `after_data`, `before_data`, `request_id`, `resource_id`, `resource_type` | Shared audit/outbox infrastructure |

Master dependencies: `identity.users`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.recoveryToken | API-generated random recovery capability; keyed hash in authentication_challenges.token_hash. |
| data.expiresAt | authentication_challenges.expires_at for proof operations or identity.sessions.expires_at for session projection. |
| data.message | Fixed neutral text; never derived from account existence. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Return the same neutral 202 case token/expiry/message for known, unknown, unsupported, suspended or locked accounts. Emit no stored contact/factor hint. Delivery is asynchronous under existing phone rules.
2. Password recovery is auto-completable only with existing verified-phone OTP plus existing verified authenticator. Authenticator loss and unsupported recovery use an assisted review; this route never disables factors, unlocks accounts or grants a workspace.

Perform success mutations, proof/counter/refresh/assignment state and audit in one owner transaction. Commit failed-proof counters/lockout and replay revocation even when returning an authentication error; do not roll those evidence updates back. Recheck grants under ordered locks before commit; retain non-secret audit/outbox atomically. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-106-01` | Known/unknown/email-only/MFA-less cases have indistinguishable public DTOs. | Designed / NOT RUN |
| `CT-API-106-02` | A new recovery intent does not invalidate legitimate credentials or consume a login challenge. | Designed / NOT RUN |
| `CT-API-106-03` | Rate-limit and delivery failures cannot reveal eligibility or bypass proof. | Designed / NOT RUN |
| `CT-API-106-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-106-AUTHORIZATION` | No bearer needed; forged, expired, wrong-purpose or replayed proof never grants a session/workspace. | Designed / NOT RUN |
| `CT-API-106-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |

## API-107 — POST `/v1/auth/recovery/complete`

**Reset a password only after existing OTP and authenticator proof. Proposed / Unapproved / Not Implemented.**

| Identification | Contract |
| --- | --- |
| Owner / version | Authentication_Access / v1; Shared identity service; no app-specific account. |
| Consumer | Public |
| Features / workflow | `AUTH-01`, `AUTH-02`, `AUTH-03`; [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) |
| Full environment URL | https://{environment}.api.pharmville.example/v1/auth/recovery/complete |
| Approval dependencies | D-003 security/bootstrap/recovery; D-024 contract review; D-028 unified architecture. D-023 contact change remains separate. |

### Authentication and authorization

| Authentication required | Mechanism | Allowed roles | Permission / scope |
| --- | --- | --- | --- |
| NO | None (purpose-bound pre-session proof where supplied) | Public | Public challenge/proof only; no role or panel input |

Accept only a password-recovery challenge tied to the unchanged existing subject, verified phone, approved recovery policy and existing enabled factor. Both OTP and TOTP are mandatory; authenticator recovery cases are never auto-completed here. Consume both proofs, advance factor counter, replace password/history, invalidate all sessions and outstanding proofs and audit in one locked transaction. Do not clear suspension/lock, change contacts, remove MFA, create roles or return tokens. Unknown/invalid/replayed evidence uses the same generic 401. Unsupported assisted recovery has no public shortcut; D-003 defines human verification and independent approval before any separate reset procedure.

No bearer authentication is required. Supplied proof is purpose-bound and validated by the backend; unknown identifiers never expose account/role/factor state.

### Request headers

| Header | Type | Required | Example | Purpose |
| --- | --- | --- | --- | --- |
| Authorization | string | Not Applicable | Omit | Existing human session only where specified; never client role. |
| Content-Type | media type | Required | application/json | Exact declared JSON body media. |
| Accept | media type | Optional | application/json | JSON default; unsupported media 406. |
| Idempotency-Key | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| If-Match | string | Not Applicable | Omit | No secret-response cache or alternate role/context channel. |
| X-Request-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| X-Correlation-ID | string | Optional | 0192a1b2-c3d4-7e8f-9012-000000000020 | Optional validated tracing ID; never authority. |
| Provider signature headers | provider-defined | Not Applicable | Omit | Human identity operation, not a provider callback. |

Authorization headers are represented by OpenAPI security, not duplicated header parameters. No role/panel/organization header grants authority. JSON/Accept/trace validation is independent of credential verification.

### Path parameters

Not Applicable. No path parameters.

### Query parameters

Not Applicable. No query parameters.

### Request body and uploads

DTO: `UnifiedRecoveryCompleteRequest`. Unknown properties are rejected. Conditional proof/action fields must match the stored challenge and declared oneOf/allOf rules; a client cannot choose a weaker factor.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `recoveryToken` | string | Required | No | None | minLength=1; maxLength=4096; writeOnly=true | Owned purpose-bound password recovery reference. |
| `otp` | string | Required | No | None | pattern="^[0-9]{6}$"; writeOnly=true | Proof of the existing verified phone under approved delivery rules. |
| `authenticatorCode` | string | Required | No | None | pattern="^[0-9]{6}$"; writeOnly=true | Existing verified authenticator; monotonic replay guard required. |
| `newPassword` | string | Required | No | None | minLength=1; maxLength=4096; writeOnly=true | New password; never echoed or logged. |

```json
{
  "recoveryToken": "pv_challenge_SyntheticExampleOnly_7m3K9r2P6x4V8q1L",
  "otp": "583914",
  "authenticatorCode": "104285",
  "newPassword": "SyntheticRecoveredPasswordOnly"
}
```

File uploads: **Not Applicable**.

### Success response

HTTP **200**. JSON envelope `success/data/error/meta`; X-Request-ID, X-Correlation-ID, X-API-Version, Cache-Control response headers. Cache-Control is no-store. Numeric durations/examples are synthetic, not approved security settings.

Data DTO: `UnifiedCredentialChangedData`.

| Field | Type | Required | Nullable | Default | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| `changedAt` | string | Required | No | None | format="date-time" | Committed credential-change time. |
| `reauthenticationRequired` | boolean | Required | No | None | const=true | All existing sessions/proofs are revoked. |

```json
{
  "success": true,
  "data": {
    "changedAt": "2026-10-24T10:30:00Z",
    "reauthenticationRequired": true
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
| 401 | AUTH_INVALID_CREDENTIALS | Unknown, wrong, expired, consumed or mismatched recovery proof. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Request fresh recovery or approved assistance without account disclosure. |
| 422 | PASSWORD_POLICY_REJECTED | New credential fails reviewed password/history policy. | No unauthorized state or credential; retain audited failed-attempt/replay evidence where specified. | Correct policy violation; no partial credential change. |

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
| [`identity.login_attempts`](../../04-Database/Tables/identity/login_attempts.md) | None | `user_id`, `login_identifier_hash`, `success`, `failure_code`, `ip_address`, `user_agent`, `request_id` | Authentication_Access |
| [`platform.outbox_events`](../../04-Database/Tables/platform/outbox_events.md) | None | `aggregate_type`, `aggregate_id`, `event_type`, `event_version`, `payload`, `headers`, `available_at` | Shared platform runtime via Identity transaction |
| [`identity.authentication_challenges`](../../04-Database/Tables/identity/authentication_challenges.md) | `attempts`, `binding_json`, `blocked_at`, `consumed_at`, `created_at`, `created_by`, `expires_at`, `factor_type`, `id`, `identifier_encrypted`, `identity_version`, `max_attempts`, `mfa_factor_id`, `otp_challenge_id`, `parent_challenge_id`, `policy_version`, `purpose`, `requested_context_hash`, `row_version`, `session_id`, `token_hash`, `updated_at`, `updated_by`, `user_id` | `attempts`, `consumed_at`, `blocked_at` | Authentication_Access |
| [`identity.mfa_factors`](../../04-Database/Tables/identity/mfa_factors.md) | `id`, `user_id`, `secret_encrypted`, `verified_at`, `disabled_at`, `last_accepted_totp_counter` | `last_accepted_totp_counter` | Authentication_Access |
| [`identity.otp_challenges`](../../04-Database/Tables/identity/otp_challenges.md) | `id`, `purpose`, `otp_hash`, `expires_at`, `attempts`, `max_attempts`, `consumed_at`, `blocked_at` | `attempts`, `consumed_at`, `blocked_at` | Authentication_Access |
| [`identity.password_history`](../../04-Database/Tables/identity/password_history.md) | `user_id`, `password_hash` | `user_id`, `password_hash` | Authentication_Access |
| [`identity.session_refresh_tokens`](../../04-Database/Tables/identity/session_refresh_tokens.md) | None | `revoked_at` | Authentication_Access |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | None | `revoked_at`, `revoke_reason` | Authentication_Access |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `id`, `status`, `password_hash`, `row_version`, `phone_verified_at`, `locked_until`, `account_closed_at`, `failed_login_count` | `password_hash` | Authentication_Access |
| [`platform.audit_logs`](../../04-Database/Tables/platform/audit_logs.md) | None | `action`, `actor_user_id`, `after_data`, `before_data`, `request_id`, `resource_id`, `resource_type` | Shared audit/outbox infrastructure |

Master dependencies: `identity.users`. No seed records or blanket SQL grants are created. See [the persistence assessment](../../04-Database/Identity-Authentication-Assessment.md) and exact DTO/source map below.

| DTO projection | Database/source rule |
| --- | --- |
| data.changedAt | Committed users/password_history credential change and session revocation time. |
| data.reauthenticationRequired | Derived true because all old sessions were revoked. |

Request proof fields are transient verification inputs, never persisted raw. Identifiers are normalized/encrypted; only keyed token/OTP/refresh hashes and encrypted MFA secrets are stored in their exact columns. Role/scope target IDs are looked up, not accepted as authority. Actor/version/audit fields are server supplied.

### Operational rules

1. Accept only a password-recovery challenge tied to the unchanged existing subject, verified phone, approved recovery policy and existing enabled factor. Both OTP and TOTP are mandatory; authenticator recovery cases are never auto-completed here.
2. Consume both proofs, advance factor counter, replace password/history, invalidate all sessions and outstanding proofs and audit in one locked transaction. Do not clear suspension/lock, change contacts, remove MFA, create roles or return tokens.
3. Unknown/invalid/replayed evidence uses the same generic 401. Unsupported assisted recovery has no public shortcut; D-003 defines human verification and independent approval before any separate reset procedure.

Perform success mutations, proof/counter/refresh/assignment state and audit in one owner transaction. Commit failed-proof counters/lockout and replay revocation even when returning an authentication error; do not roll those evidence updates back. Recheck grants under ordered locks before commit; retain non-secret audit/outbox atomically. Pagination/sorting use only declared parameters; otherwise Not Applicable. Retry reads with bounded backoff. Never blindly retry a proof/refresh after an uncertain response; reauthenticate/reload. Rate/expiry/password/TOTP/timeout budgets are reviewed D-003 configuration; missing security policy fails closed. No partial success for credential/grant changes, no audit token/secret contents, no provider side effect before commit.

### Designed contract tests

| Scenario | Expected effect / recovery | Status |
| --- | --- | --- |
| `CT-API-107-01` | OTP alone, TOTP alone, login-purpose proof and a lost authenticator cannot reset password. | Designed / NOT RUN |
| `CT-API-107-02` | Recovery/refresh/password-change races produce one consistent credential/session outcome. | Designed / NOT RUN |
| `CT-API-107-03` | Rollback before commit exposes no success, credential or partial MFA reset. | Designed / NOT RUN |
| `CT-API-107-VALIDATION` | Reject undeclared role/panel/body fields and invalid DTO/conditional proof combinations. No privileged state. | Designed / NOT RUN |
| `CT-API-107-AUTHORIZATION` | No bearer needed; forged, expired, wrong-purpose or replayed proof never grants a session/workspace. | Designed / NOT RUN |
| `CT-API-107-RECOVERY` | Dependency/audit failure produces no unaudited successful credential/grant effect; preserve failed-attempt counters and use the exact recovery path. | Designed / NOT RUN |
