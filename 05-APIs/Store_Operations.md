# Store Operations API contracts

**Contract readiness:** incomplete operation schemas remain below. These sections preserve intent and constraints but do not authorize implementation from generic payloads. See [audit H-03](../09-References/Engineering-Audit.md#rechecked-earlier-findings).


## API-044 — GET `/v1/staff/store/orders`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Store_Operations. **Purpose:** Load store work queue.

**Requirement links:** `STO-01`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Store_Operations`. Primary data: `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`, `fulfillment.fulfillment_orders`, `fulfillment.pack_tasks`, `fulfillment.package_items`, `fulfillment.packages`. Read/write behavior follows the operation: **load store work queue**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Successful request fields and input names below are **illustrative**, not confirmed DTOs.

```http
GET /v1/staff/store/orders?limit=25 HTTP/1.1
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

Related: [api conventions](README.md); real table mappings.

## API-045 — POST `/v1/staff/store/orders/{order_id}/accept`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Store_Operations. **Purpose:** Accept authorized work.

**Requirement links:** `STO-02`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Store_Operations`. Primary data: `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`, `fulfillment.fulfillment_orders`, `fulfillment.pack_tasks`, `fulfillment.package_items`, `fulfillment.packages`. Read/write behavior follows the operation: **accept authorized work**.

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

Related: [api conventions](README.md); real table mappings.

## API-046 — POST `/v1/staff/store/picks/{pick_id}/scan`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Store_Operations. **Purpose:** Verify exact SKU/lot.

**Requirement links:** `STO-02`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Store_Operations`. Primary data: `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`, `fulfillment.fulfillment_orders`, `fulfillment.pack_tasks`, `fulfillment.package_items`, `fulfillment.packages`. Read/write behavior follows the operation: **verify exact sku/lot**.

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

Related: [api conventions](README.md); real table mappings.

## API-047 — POST `/v1/staff/store/packs/{pack_id}/close`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Store_Operations. **Purpose:** Close validated pack.

**Requirement links:** `STO-02`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Store_Operations`. Primary data: `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`, `fulfillment.fulfillment_orders`, `fulfillment.pack_tasks`, `fulfillment.package_items`, `fulfillment.packages`. Read/write behavior follows the operation: **close validated pack**.

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

Related: [api conventions](README.md); real table mappings.

## API-048 — POST `/v1/staff/store/replenishments`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Store_Operations. **Purpose:** Request stock.

**Requirement links:** `STO-03`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Store_Operations`. Primary data: `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`, `fulfillment.fulfillment_orders`, `fulfillment.pack_tasks`, `fulfillment.package_items`, `fulfillment.packages`. Read/write behavior follows the operation: **request stock**.

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

Related: [api conventions](README.md); real table mappings.

## API-049 — POST `/v1/staff/store/transfers/{transfer_id}/receipt`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Store_Operations. **Purpose:** Confirm shortages and receipt.

**Requirement links:** `STO-04`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Store_Operations`. Primary data: `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`, `fulfillment.fulfillment_orders`, `fulfillment.pack_tasks`, `fulfillment.package_items`, `fulfillment.packages`. Read/write behavior follows the operation: **confirm shortages and receipt**.

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

Related: [api conventions](README.md); real table mappings.
