# Standard API responses

**Verified reference behavior:** the sibling `healthcare-auth-service` response implementation is defined by `app/common/response.py`, `app/common/schemas.py`, `app/api/exception_handlers.py`, `app/core/middleware.py`, and covered by `tests/unit/test_core_and_common.py`. Its `docs/API.md` is the consumer-facing reference. **Pharmville adoption remains proposed pending D-024; this evidence does not establish a Pharmville route implementation.**

## Canonical JSON envelope

The reference service serializes exactly four required top-level properties. Its transport model rejects unknown envelope properties and recursively converts snake_case keys to camelCase at the JSON boundary.

```json
{
  "success": true,
  "data": {"resourceId": "018f47b2-7ed0-7a12-8ab2-48df9d439e61"},
  "error": null,
  "meta": {
    "requestId": "0c50f15a-373f-42d3-b1ae-3d90a415cd91",
    "correlationId": "9182b204-cb82-4ddc-a49d-b07743388ed6",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RESOURCE_CONFLICT",
    "message": "The operation conflicts with existing data.",
    "details": null
  },
  "meta": {
    "requestId": "0c50f15a-7ed0-7a12-8ab2-48df9d439e61",
    "correlationId": "9182b204-cb82-4ddc-a49d-b07743388ed6",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

Envelope invariants and serialization facts:

- `success`, `data`, `error`, and `meta` are always present. Success sets `error` to null; failure sets `data` to null.
- `error` is an object with required nonblank `code` and `message`, and nullable `details`. In the reference Pydantic model, `details` accepts arbitrary JSON-compatible values; API contracts should constrain it to safe, documented shapes.
- `meta` has required `requestId`, `correlationId`, `apiVersion`, `timestamp`, and `pagination`. The two identifiers may be null in the response model; the reference middleware normally generates UUIDs and defaults correlation ID to request ID. `apiVersion` is a nonblank string, normally `v1`.
- `timestamp` is generated from timezone-aware UTC time. Public examples use UTC RFC 3339 with `Z`.
- The response helper preserves nulls and recursively camelizes object keys, including keys inside `details` and `data`.
- The reference middleware adds `X-Request-ID`, `X-Correlation-ID`, and `X-API-Version` response headers. The first two are also added by the response helper when values exist. `Cache-Control: no-store` is set by the error response helper; security middleware may add further headers. These reference behaviors are not proof of Pharmville middleware behavior.

For proposed Pharmville JSON operations, keep this envelope and define a concrete, operation-specific `data` schema. Do not use the envelope schema by itself as an endpoint's complete success response. D-024 must approve adoption and identify any existing clients before changing an already-consumed Pharmville contract. No Pharmville runtime route was found.

## Pagination variants

The reference authentication service implements only offset pagination. Its `meta.pagination` shape is:

```json
{"totalCount": 42, "limit": 20, "offset": 0, "hasNext": true}
```

Cursor pagination is a separate Pharmville proposal, not implemented behavior from the reference service:

```json
{"nextCursor": "opaque-cursor-value", "hasNext": true}
```

Use exactly one variant per operation. The OpenAPI `ResponseMeta.pagination` union represents offset metadata, cursor metadata, or null. See [pagination and filtering](Pagination-and-Filtering.md) for operation selection and proposed request limits.

## HTTP response variants

| Variant | Contract |
|---|---|
| JSON success | Canonical envelope with operation-specific `data`; choose the semantic status such as 200, 201, or 202. |
| Idempotent replay | Return the same status and stable result as the original accepted command; a replay header is only used if adopted by the implementation. |
| 204 No Content | No body and no JSON content type. The reference `APIResponse.success` rejects 204; a bodyless response must be returned directly by the route. |
| 304 Not Modified | No body; only for a conditional read with a valid cache validator. |
| File/stream response | Raw declared media type and documented disposition/range behavior; not the JSON envelope. |
| Provider webhook acknowledgement | Exact provider status/body is governed by the verified provider contract. Cashfree wire details remain blocked by D-016. |

Never document a JSON body for 204 or 304.

## Error validation details

The reference FastAPI request-validation handler returns `422 REQUEST_VALIDATION_ERROR`; `details` is an array of `{field, message, type}` strings. Example:

```json
{"field":"body.email","message":"value is not a valid email address","type":"value_error"}
```

Framework-independent application `ValidationError` instead uses `422 VALIDATION_ERROR`. Preserve this distinction in compatibility mappings. Do not return raw Pydantic input, rejected secret values, SQL/provider errors, patient data, or stack traces. See [error catalog](Error-Catalog.md) for the exact shared-code policy and Pharmville-specific proposals.
