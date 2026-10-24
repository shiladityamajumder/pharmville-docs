# Proposed API error catalog

**Status: Proposed names; D-024 approval required.** HTTP status and stable code must match the actual failure. Do not mechanically attach every error to every operation.

| HTTP | Code | Meaning | Retry guidance |
|---:|---|---|---|
| 400 | `MALFORMED_REQUEST` | Invalid JSON, parameter encoding, or unsupported shape | Correct request |
| 401 | `AUTHENTICATION_REQUIRED` | Missing, invalid, expired, or revoked credential | Reauthenticate |
| 401 | `INVALID_CREDENTIALS` | Generic failed login/OTP proof | Bounded retry subject to throttling; do not reveal account existence |
| 403 | `ACCESS_DENIED` | Authenticated actor lacks permission or scope | Do not retry without authorized change |
| 404 | `RESOURCE_NOT_FOUND` | Missing resource or resource hidden by access policy | Refresh authorized view |
| 409 | `STALE_VERSION` | Aggregate or accepted revision changed | Reload and re-evaluate |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same idempotency key used for a different request fingerprint | Use a new key only for a genuinely new command |
| 409 | `INVALID_STATE_TRANSITION` | Current state does not permit command | Reload; no blind retry |
| 409 | `INSUFFICIENT_STOCK` | No eligible stock remains at commit time | Requote/reallocate |
| 412 | `PRECONDITION_FAILED` | `If-Match` validator no longer matches | Fetch current representation |
| 422 | `VALIDATION_ERROR` | Field or cross-field semantic failure | Correct submitted values |
| 422 | `PRESCRIPTION_REVIEW_REQUIRED` | Current accepted revision cannot proceed without authorized review | Complete review flow |
| 422 | `REFUND_NOT_ELIGIBLE` | Requested refund violates approved eligibility/balance policy | Refer to current order/payment state |
| 429 | `RATE_LIMITED` | Caller exceeded endpoint-specific limit | Honor `Retry-After` if present |
| 502/503 | `PROVIDER_UNAVAILABLE` | Required upstream provider unavailable or response invalid | Keep pending; bounded retry/reconciliation |
| 504 | `UPSTREAM_TIMEOUT` | Dependency timed out; commit outcome may be unknown | Query/replay with same idempotency key |
| 500 | `INTERNAL_ERROR` | Unexpected server failure | Retry only if operation is idempotent; otherwise reconcile |

Error `message` is safe for the caller. Never expose OTPs, passwords, tokens, private prescription contents, internal SQL, provider secrets, hidden resource existence, or authorization rule details. `details` may contain field paths and safe current versions only.
