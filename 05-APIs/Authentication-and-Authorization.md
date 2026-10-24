# API authentication and authorization

**Status: Proposed Pharmville contract; policy decisions D-003 and D-023 remain open.** No Pharmville HTTP implementation was found. The authentication service response envelope is separately verified in [Standard responses](Standard-Responses.md); its routes are not evidence that Pharmville routes are implemented.

## Trust types

| Caller | Credential | Server checks |
|---|---|---|
| Public customer OTP or login | No existing access token; purpose-bound OTP/MFA challenge where applicable | Challenge purpose, expiry, attempt limit, replay state, rate limits, and account state |
| Customer `/v1/me/*` | Bearer access JWT or approved secure session cookie | Authenticated subject owns resource; dependent patient association and consent where applicable |
| Staff, admin, pharmacist, finance | Bearer access JWT or approved secure session cookie | Explicit permission, active role, organization and location scope; clinical/finance-specific qualifications |
| Rider | Staff/rider credential | Active shift and current task assignment; location and proof access limited to assigned work |
| Internal service | Service identity with narrowly scoped capability | Trusted workload identity, capability allowlist and private network boundary; never a caller-supplied actor ID |
| Payment provider webhook | Provider signature over the exact raw request bytes, event identity and provider-approved replay controls | Signature/timestamp policy from D-016; correlate and validate payment, order, amount and currency before effect |

Authentication and authorization are separate. Apply object-level policy before reading protected fields and again before issuing file/report download links. Return privacy-safe 404 where resource existence must be hidden. Never trust a user, patient, staff actor, location, warehouse, reviewer, rider, or role ID supplied as proof of authority.

## Session and proof rules

D-003 must approve credential paths, MFA policy, token/session lifetimes, effective OTP limits, lockout, refresh rotation, revocation and recovery. Existing database defaults do not approve runtime security policy. Public proof endpoints must not require an active bearer token. Refresh must require the approved refresh credential, not an access token or user ID. Cookie transport requires Secure, HttpOnly, SameSite policy and CSRF protection for state-changing requests. D-023 requires purpose-bound proof before replacing a verified contact and preservation of the prior verified destination until the replacement is proven.

## Header policy

| Header | Use |
|---|---|
| `Authorization: Bearer <token>` | Protected JWT endpoints unless cookie or service identity is explicitly selected |
| `Content-Type: application/json` | JSON request bodies; uploads use the declared upload protocol |
| `Accept: application/json` | JSON API callers; file endpoints request the file media type |
| `Idempotency-Key` | State-changing commands with retry ambiguity; required for money, inventory, checkout and other duplicate-sensitive effects |
| `If-Match` | Only where the operation specifies an ETag precondition; mismatch returns 412 |
| `X-Request-ID`, `X-Correlation-ID` | Optional caller tracing values; validate length/format and generate safe values when absent |
| Provider signature headers | Exact names and canonicalization are blocked on provider evidence D-016; do not infer them |

The reference authentication service returns `X-Request-ID` and `X-Correlation-ID` when values exist in request context. For proposed Pharmville JSON responses, return the same headers when available and also include their values in the standard envelope. `Location`, `ETag`, `Retry-After`, and cache headers are operation-specific. Sensitive, private, financial, and clinical responses use `Cache-Control: no-store` unless a reviewed policy says otherwise.
