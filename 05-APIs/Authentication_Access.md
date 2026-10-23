# Authentication and Access API contracts

These are proposed contracts for AUTH-01–AUTH-04, not running endpoints. Customer signup/login remains ACC-01 in [Customer Accounts](Customer_Accounts.md). Authentication_Access owns challenge and session mechanics; customer and staff modules own their user-facing flows. D-003 governs credential methods, lockout, session lifetimes and throttling. No guessed numeric default is approved by this document.

## API-089 — POST `/v1/auth/staff/login`

Requirements: `AUTH-01`, `AUTH-02`, `AUTH-03`. Public pre-login operation; no existing session or bearer token is required. Validate a staff identifier and the credential required by the approved role policy. For the password path, the proposed JSON input is `identifier` and `password`. Routine staff OTP entry needs the separately approved D-003 flow; do not route a privileged account through a weaker method.

Check account status, password hash, lockout and current role policy. Use a generic failure message for unknown identifier and invalid credentials. A successful password check for a role requiring an authenticator returns `200` with an opaque `challenge_id` and `mfa_required: true`; it does not create a fully privileged session. Invalid credentials return `401`; throttling returns `429`. Do not log passwords or authenticator secrets. Audit the attempt using privacy-safe identifiers.

## API-090 — POST `/v1/auth/staff/mfa/verify`

Requirement: `AUTH-01`. This is a pre-session operation authorized by a short-lived, purpose-bound challenge, not an existing application session. Proposed input: `challenge_id` and `code`. Verify the account's enrolled authenticator, challenge purpose, expiry, attempts and one-time state. Recheck account/role status before issuing credentials. Concurrent requests must consume the challenge once; an already consumed challenge never issues another session.

Return `200` only after session creation commits. Return `401` for invalid proof, `422` for unusable challenge state, and `429` for abuse limits, with generic messages. Enrollment/recovery is a separate privileged operation and cannot be inferred from this verification endpoint.

## API-091 — POST `/v1/auth/sessions/refresh`

Requirement: `AUTH-02`. Authorize with the refresh credential; an unexpired access token is not required. Select the approved cookie or request-body transport in D-003. Cookie transport requires secure, HttpOnly attributes and CSRF protection. Do not accept a user ID as proof.

Check the refresh-token hash, session expiry/revocation, token family and current account/role state in one transaction. Rotate the credential once. Replay/reuse revokes or denies the affected family under the approved security policy; do not mint independent sessions from concurrent replay. Return `200` with fresh credentials after commit, `401` for invalid/revoked/expired credentials, or `429` for throttling. A lost refresh response must lead to a defined reauthentication path; never blindly restore an already consumed refresh credential.

## API-092 — POST `/v1/auth/sessions/revoke`

Requirements: `AUTH-02`, `AUTH-04`. Requires an authenticated session or a separately approved staff session-revocation capability. Proposed body: `session_id`. The actor may revoke only their own session unless explicitly allowed to manage the target staff account. Mark `identity.sessions.revoked_at` and `revoke_reason`; repeated revocation returns `204` without creating a new effect. Reject cross-account scope with `403/404` and audit the outcome. Invalidate cached authorization promptly under the approved revocation policy.

## API-093 — GET `/v1/auth/permissions`

Requirement: `AUTH-04`. Requires a valid session. No request body. Return `200` with the caller's current permitted actions and location scope; never return another user's grants based on a query-supplied identifier. Server-side object authorization is still required on every business operation. Permissions shown in a UI are not a substitute for that check.

## Persistence, transactions and failures

Use [users](../04-Database/Tables/identity/users.md), [sessions](../04-Database/Tables/identity/sessions.md), [OTP challenges](../04-Database/Tables/identity/otp_challenges.md), [MFA factors](../04-Database/Tables/identity/mfa_factors.md), [login attempts](../04-Database/Tables/identity/login_attempts.md), and the role/permission tables. The OTP table has `destination_hash`, `otp_hash`, `purpose`, `expires_at`, `attempts`, `max_attempts`, `blocked_at` and `consumed_at`. Its schema default of five maximum attempts is an observed database default; approval of effective policy still belongs to D-003.

Challenge consumption, session changes and audit outcome must share a transaction where applicable. On rollback, issue no credential and publish no success event. A backend timeout is not proof a session was issued. Notifications occur after commit; provider failures must not weaken proof requirements. Request correlation IDs never replace credentials.

## Required verification

Test public login without bearer credentials; locked/suspended/closed users; password success without premature MFA session; wrong/expired/consumed challenges; concurrent challenge consumption; refresh replay, expiry, revocation and lost responses; cross-account revocation; role removal during login/refresh; rate limits by number and network origin; rollback before session commit; and secret redaction. These are planned cases, not executed test results. See [Security](../07-Engineering/Security.md) and [Testing](../07-Engineering/Testing.md).
