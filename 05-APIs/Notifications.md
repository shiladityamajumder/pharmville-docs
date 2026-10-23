# Notifications API contracts

**Contract readiness:** incomplete operation schemas remain below. These sections preserve intent and constraints but do not authorize implementation from generic payloads. See [audit H-03](../09-References/Engineering-Audit.md#high).


## API-094

## API-094 — POST `/v1/internal/notifications/jobs`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Notifications. **Purpose:** Enqueue approved template.

**Requirement links:** `NOT-01`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Trusted internal caller only, capability-based DB access; never browser-callable. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Notifications`. Primary data: `notification.device_endpoints`, `notification.in_app_notifications`, `notification.message_attachments`, `notification.message_attempts`, `notification.messages`, `notification.provider_configurations`. Read/write behavior follows the operation: **enqueue approved template**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Successful request fields and input names below are **illustrative**, not confirmed DTOs.

Request schema is incomplete: the former generic body did not define this operation. Specify the business fields, types, required values, permitted scope and concurrency token before implementation.

## Success response (illustrative)

Response schema is incomplete. Define operation-specific fields and status codes before implementation; the shared accepted-object/list envelope is not a business response contract.

Exact success code and response fields remain a contract-review task for this operation. Use the correlation ID to connect request, audit event, and downstream external callback. Never expose prescription content or payment secrets in the response.

## Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

## Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: API_Conventions; real table mappings.

## API-095

## API-095 — GET `/v1/admin/notifications/deliveries`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Notifications. **Purpose:** Review delivery failures.

**Requirement links:** `NOT-02`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Notifications`. Primary data: `notification.device_endpoints`, `notification.in_app_notifications`, `notification.message_attachments`, `notification.message_attempts`, `notification.messages`, `notification.provider_configurations`. Read/write behavior follows the operation: **review delivery failures**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Successful request fields and input names below are **illustrative**, not confirmed DTOs.

```http
GET /v1/admin/notifications/deliveries?limit=25 HTTP/1.1
Authorization: Bearer <scoped-access-token>

```

## Success response (illustrative)

Response schema is incomplete. Define operation-specific fields and status codes before implementation; the shared accepted-object/list envelope is not a business response contract.

Exact success code and response fields remain a contract-review task for this operation. Use the correlation ID to connect request, audit event, and downstream external callback. Never expose prescription content or payment secrets in the response.

## Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

## Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: API_Conventions; real table mappings.

## API-096

## API-096 — POST `/v1/rider/push-tokens`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Notifications. **Purpose:** Register current rider push token.

**Requirement links:** `NOT-03`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Notifications`. Primary data: `notification.device_endpoints`, `notification.in_app_notifications`, `notification.message_attachments`, `notification.message_attempts`, `notification.messages`, `notification.provider_configurations`. Read/write behavior follows the operation: **register current rider push token**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Successful request fields and input names below are **illustrative**, not confirmed DTOs.

Request schema is incomplete: the former generic body did not define this operation. Specify the business fields, types, required values, permitted scope and concurrency token before implementation.

## Success response (illustrative)

Response schema is incomplete. Define operation-specific fields and status codes before implementation; the shared accepted-object/list envelope is not a business response contract.

Exact success code and response fields remain a contract-review task for this operation. Use the correlation ID to connect request, audit event, and downstream external callback. Never expose prescription content or payment secrets in the response.

## Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

## Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: API_Conventions; real table mappings.

## API-097

## API-097 — GET `/v1/admin/notifications/alerts`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Notifications. **Purpose:** View role-scoped staff alerts.

**Requirement links:** `NOT-04`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Notifications`. Primary data: `notification.device_endpoints`, `notification.in_app_notifications`, `notification.message_attachments`, `notification.message_attempts`, `notification.messages`, `notification.provider_configurations`. Read/write behavior follows the operation: **view role-scoped staff alerts**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Successful request fields and input names below are **illustrative**, not confirmed DTOs.

```http
GET /v1/admin/notifications/alerts?limit=25 HTTP/1.1
Authorization: Bearer <scoped-access-token>

```

## Success response (illustrative)

Response schema is incomplete. Define operation-specific fields and status codes before implementation; the shared accepted-object/list envelope is not a business response contract.

Exact success code and response fields remain a contract-review task for this operation. Use the correlation ID to connect request, audit event, and downstream external callback. Never expose prescription content or payment secrets in the response.

## Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

## Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: API_Conventions; real table mappings.
