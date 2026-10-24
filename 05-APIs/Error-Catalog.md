# API error catalog

The existing `healthcare-auth-service` codes are verified only for that service. For new Pharmville contracts, this catalog proposes those verified shared names where they fit the same HTTP/error semantics. D-024 must approve adoption before Pharmville implementation. Do not rename or translate a code already exposed by a deployed consumer without a versioned compatibility plan. Pharmville-specific codes below are proposals, not implemented behavior.

## Shared transport and infrastructure errors

| HTTP | Canonical/reference code | Category and trigger | `details` shape | Retry and client action |
|---:|---|---|---|---|
| 400 | `BAD_REQUEST` | Malformed transport input or HTTP request rejected by framework | null or safe object | Correct the request; unchanged retry is not useful |
| 400 | `INVALID_REQUEST_ID`, `INVALID_CORRELATION_ID` | Reference middleware received a malformed UUID header | null | Send valid UUID or omit and let the service generate it |
| 401 | `AUTHENTICATION_REQUIRED` | Credential missing, invalid, expired, or revoked | null | Reauthenticate; clear unusable credential |
| 401 | `AUTH_INVALID_CREDENTIALS` | Reference auth exception for invalid login proof | null | Retry only within documented throttles; do not reveal account existence |
| 401 | `AUTH_ACCOUNT_LOCKED`, `AUTH_ACCOUNT_DISABLED`, `AUTH_OTP_EXPIRED`, `AUTH_OTP_INVALID`, `AUTH_OTP_ATTEMPTS_EXCEEDED`, `AUTH_OTP_ALREADY_USED`, `AUTH_SESSION_REVOKED`, `AUTH_REFRESH_TOKEN_REUSE` | Specific authentication-service conditions | null or safe retry state | Follow the named recovery flow; no secret is returned |
| 403 | `PERMISSION_DENIED` | Authenticated principal lacks action permission | null | Do not retry without an authorized permission change |
| 404 | `RESOURCE_NOT_FOUND` | Missing resource or object hidden by ownership policy | null | Refresh authorized view; do not infer hidden-resource existence |
| 404 | `ROUTE_NOT_FOUND` | Unknown/disabled route in reference service | null | Correct path or version |
| 409 | `RESOURCE_CONFLICT` | Unique/business-state conflict, including reference `IntegrityError` mapping | null or safe conflicting field | Reload/reconcile before retry |
| 409 | `CONCURRENT_UPDATE_CONFLICT` | Reference ORM stale-data conflict | safe current version only | Fetch current representation and re-evaluate |
| 422 | `REQUEST_VALIDATION_ERROR` | FastAPI request schema validation | array of `{field, message, type}` strings | Correct fields and submit again |
| 422 | `VALIDATION_ERROR` | Application-level semantic validation | operation-specific safe object/array | Correct values; do not retry unchanged |
| 429 | `RATE_LIMIT_EXCEEDED` | Reference application rate-limit exception | safe `retryAfterSeconds` value | Honor `Retry-After`; bounded backoff with jitter |
| 500 | `INTERNAL_SERVER_ERROR` | Unhandled reference exception | null | Use request ID for support; retry only after idempotency/reconciliation check |
| 500 | `DATABASE_ERROR` | Non-operational SQLAlchemy failure mapped by reference handler | null | Treat outcome as potentially uncertain for writes; reconcile first |
| 503 | `DATABASE_UNAVAILABLE` | Reference operational database failure | null | Bounded backoff; reconcile uncertain writes |
| 503 | `EXTERNAL_SERVICE_ERROR`, `EXTERNAL_SERVICE_TIMEOUT` | Reference application errors for upstream failure/timeout | safe dependency-independent state only | Preserve pending state and reconcile; retry only with provider-safe idempotency |
| 503 | `INFRASTRUCTURE_UNAVAILABLE`, `RATE_LIMIT_BACKEND_ERROR` | Required infrastructure unavailable | null | Bounded backoff |
| 504 | `OPERATION_TIMEOUT` | Reference bounded-operation timeout | safe operation reference if known | Outcome may be uncertain; query/replay using same idempotency key |

The reference handler also maps common HTTP exceptions to `BAD_REQUEST`, `AUTHENTICATION_REQUIRED`, `PERMISSION_DENIED`, `ROUTE_NOT_FOUND`, `METHOD_NOT_ALLOWED`, `PAYLOAD_TOO_LARGE`, and `UNSUPPORTED_MEDIA_TYPE`. Validation details are generated from location, message and type and must not echo rejected secret input. Database logs may contain stack traces internally; they are never response details.

## Pharmville domain proposals

These codes describe distinct business failures and remain proposed pending each owning module’s approval. Prefer the canonical shared code when the semantics match; add a domain code only when clients need a distinct recovery action.

| HTTP | Proposed code | Category / triggering condition | `details` | Retry and client recovery |
|---:|---|---|---|---|
| 404 | `RESOURCE_NOT_FOUND` | Resource absent or hidden by object-level authorization | null | Refresh authorized list |
| 409 | `STALE_VERSION` | Aggregate or row version precondition is stale | `{currentVersion}` only if safe and approved | Reload, reconcile changes, resubmit as a new intent |
| 409 | `IDEMPOTENCY_KEY_CONFLICT` | Same key reused with a different canonical request fingerprint | null | Do not reuse key for different command |
| 409 | `INVALID_STATE_TRANSITION` | Command is invalid for current documented state | safe current state enum if disclosure is allowed | Reload; choose an allowed action |
| 409 | `INSUFFICIENT_STOCK` | Commit-time allocation cannot fulfill requested quantity | safe item/availability data only | Requote or revise cart; never assume earlier availability guarantees stock |
| 412 | `PRECONDITION_FAILED` | Declared `If-Match` validator no longer matches | null | Fetch latest representation and retry after review |
| 422 | `PRESCRIPTION_REVIEW_REQUIRED` | Clinical review is a prerequisite to next transition | safe review reference/state only | Complete review; never disclose clinical notes |
| 422 | `REFUND_NOT_ELIGIBLE` | Approved policy does not permit requested refund amount/state | safe remaining refundable amount if approved | Refresh payment/order state; escalate if needed |
| 429 | `RATE_LIMIT_EXCEEDED` | Per-operation quota exceeded | retry delay only | Honor `Retry-After` |
| 503 | `PROVIDER_UNAVAILABLE` | Provider could not produce a reliable outcome | operation reference and `outcomeUnknown` only if approved | Keep pending; reconcile before retry |
| 504 | `UPSTREAM_TIMEOUT` | Provider timed out after command may have been accepted | operation reference; no raw payload | Query/replay with same key and reconcile |

## Compatibility mappings to the authentication service

| Earlier Pharmville draft name | Verified shared name / policy | Compatibility note |
|---|---|---|
| `ACCESS_DENIED` | `PERMISSION_DENIED` | Proposed alias removal for new Pharmville v1 contract only; retain/map old code if any client consumed it |
| `MALFORMED_REQUEST` | `BAD_REQUEST` | Use `REQUEST_VALIDATION_ERROR` for schema-validation details |
| `INVALID_CREDENTIALS` | `AUTH_INVALID_CREDENTIALS` where the auth module uses that verified auth exception | Do not reveal which identifier or proof failed |
| `VALIDATION_ERROR` | Keep for application semantic validation; `REQUEST_VALIDATION_ERROR` for framework/schema errors | Both are 422 in reference behavior but carry distinct sources |
| `INTERNAL_ERROR` | `INTERNAL_SERVER_ERROR` for an unhandled server exception | Preserve the actual database-specific `DATABASE_ERROR` code where the reference handler emits it |
| `RATE_LIMITED` | `RATE_LIMIT_EXCEEDED` | Include `Retry-After` when known |
| `UPSTREAM_TIMEOUT` | `EXTERNAL_SERVICE_TIMEOUT` for new shared service errors; domain-specific alias only when a consumer needs separate action | Do not claim a provider request was rejected when the outcome is unknown |

`details` is always nullable and operation-specific. Do not expose tokens, OTPs, patient or prescription content, SQL/stack traces, authorization internals, or raw provider secrets. All errors use the canonical envelope except documented protocol exceptions. See [standard responses](Standard-Responses.md).
