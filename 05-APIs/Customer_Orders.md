# Customer Orders API contracts

**Contract readiness:** incomplete operation schemas remain below. These sections preserve intent and constraints but do not authorize implementation from generic payloads. See [audit H-03](../09-References/Engineering-Audit.md#high).


## API-025

## API-025 — GET `/v1/me/orders`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Customer_Orders. **Purpose:** Own order history.

**Requirement links:** `ORD-02`, `ORD-03`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Customer_Orders`. Primary data: `commerce.cancellations`, `commerce.order_items`, `commerce.orders`, `commerce.returns`. Read/write behavior follows the operation: **own order history**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Successful request fields and input names below are **illustrative**, not confirmed DTOs.

```http
GET /v1/me/orders?limit=25 HTTP/1.1
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

## API-026

## API-026 — GET `/v1/me/orders/{order_id}`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Customer_Orders. **Purpose:** Own order details and states.

**Requirement links:** `ORD-02`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Customer_Orders`. Primary data: `commerce.cancellations`, `commerce.order_items`, `commerce.orders`, `commerce.returns`. Read/write behavior follows the operation: **own order details and states**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Successful request fields and input names below are **illustrative**, not confirmed DTOs.

```http
GET /v1/me/orders/<order-uuid>?limit=25 HTTP/1.1
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

## API-027

## API-027 — POST `/v1/me/orders/{order_id}/cancel`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Customer_Orders. **Purpose:** Request cancellation.

**Requirement links:** `ORD-04`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Customer_Orders`. Primary data: `commerce.cancellations`, `commerce.order_items`, `commerce.orders`, `commerce.returns`. Read/write behavior follows the operation: **request cancellation**.

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

## API-028

## API-028 — POST `/v1/me/orders/{order_id}/returns`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Customer_Orders. **Purpose:** Create return request.

**Requirement links:** `ORD-05`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Customer_Orders`. Primary data: `commerce.cancellations`, `commerce.order_items`, `commerce.orders`, `commerce.returns`. Read/write behavior follows the operation: **create return request**.

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

## API-029

## API-029 — GET `/v1/me/orders/{order_id}/invoice`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Customer_Orders. **Purpose:** Retrieve permitted invoice.

**Requirement links:** `ORD-03`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Customer_Orders`. Primary data: `commerce.cancellations`, `commerce.order_items`, `commerce.orders`, `commerce.returns`. Read/write behavior follows the operation: **retrieve permitted invoice**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Successful request fields and input names below are **illustrative**, not confirmed DTOs.

```http
GET /v1/me/orders/<order-uuid>/invoice?limit=25 HTTP/1.1
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

## API-030

## API-030 — GET `/v1/me/orders/{order_id}/refunds`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Customer_Orders. **Purpose:** Check refund outcomes.

**Requirement links:** `ORD-06`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Customer_Orders`. Primary data: `commerce.cancellations`, `commerce.order_items`, `commerce.orders`, `commerce.returns`. Read/write behavior follows the operation: **check refund outcomes**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Successful request fields and input names below are **illustrative**, not confirmed DTOs.

```http
GET /v1/me/orders/<order-uuid>/refunds?limit=25 HTTP/1.1
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

## API-031

## API-031 — GET `/v1/me/orders/{order_id}/delivery`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Customer_Orders. **Purpose:** Get privacy-limited tracking.

**Requirement links:** `ORD-07`, `ORD-08`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Customer_Orders`. Primary data: `commerce.cancellations`, `commerce.order_items`, `commerce.orders`, `commerce.returns`. Read/write behavior follows the operation: **get privacy-limited tracking**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Successful request fields and input names below are **illustrative**, not confirmed DTOs.

```http
GET /v1/me/orders/<order-uuid>/delivery?limit=25 HTTP/1.1
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
