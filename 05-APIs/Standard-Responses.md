# Standard API responses

**Status: Confirmed for the existing healthcare authentication service; Proposed for Pharmville APIs pending D-024 review.** The checked-in authentication service defines its wire envelope in `app/common/response.py` and verifies the serialized shape in `tests/unit/test_core_and_common.py`. No Pharmville HTTP route implementation exists in this workspace, so compatibility for Pharmville must be approved before implementation.

## Success and error envelopes

All new JSON APIs use camelCase at the public JSON boundary. The authentication service recursively camelizes keys and emits this structure:

```json
{
  "success": true,
  "data": {"orderId": "018f47b2-7ed0-7a12-8ab2-48df9d439e61", "status": "pending_review"},
  "error": null,
  "meta": {
    "requestId": "req_7a3c8b17",
    "correlationId": "corr_018f47b2-7ed0-7a12-8ab2-48df9d439e61",
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
  "error": {"code": "STALE_VERSION", "message": "The resource changed. Reload it and try again.", "details": {"currentVersion": 8}},
  "meta": {
    "requestId": "req_7a3c8b17",
    "correlationId": "corr_018f47b2-7ed0-7a12-8ab2-48df9d439e61",
    "apiVersion": "v1",
    "timestamp": "2026-10-24T10:30:00Z",
    "pagination": null
  }
}
```

`requestId` and `correlationId` may be null when the transport cannot establish them; `apiVersion` is non-empty; `timestamp` is UTC RFC 3339; and `pagination` is null except for paged collection responses. Error `details` is nullable and must contain only safe validation or conflict context. Codes and examples are proposed for Pharmville until D-024 approval.

## Response variants

| Variant | HTTP status | `data` contract |
|---|---:|---|
| Single resource | 200 | One operation-specific resource DTO |
| Created resource | 201 | Created DTO; include `Location` when a stable resource URI exists |
| Accepted asynchronous command | 202 | Operation reference, current processing state, and status resource link; does not imply business completion |
| Paged list | 200 | Array of operation-specific DTOs; pagination metadata in `meta.pagination` |
| Idempotent replay | Original operation's success status | Stored original result and resource references; response may include `Idempotent-Replay: true` if approved |
| No content | 204 | No body and no JSON content type |
| Not modified | 304 | No body; only with a previously issued validator |

Webhook acknowledgements use the provider-approved acknowledgment body/status and are an explicit exception; no provider wire format is specified here. File downloads and streams use their media type and content disposition rather than this JSON envelope. Never return a JSON body for 204 or 304.

## Compatibility note

Several legacy Pharmville drafts use snake_case and `{error: ..., request_id: ...}` without the four-field envelope. They are proposed documentation examples, not verified deployed contracts. Converting a deployed consumer from those shapes to camelCase would be a breaking change: retain its versioned DTO or publish a new version and migration plan. D-024 must identify any existing consumer before standardizing those routes.
