# Inventory API contracts

**Contract readiness:** incomplete operation schemas remain below. These sections preserve intent and constraints but do not authorize implementation from generic payloads. See [audit H-03](../09-References/Engineering-Audit.md#high).


## API-050

## API-050 — GET `/v1/staff/inventory`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Inventory. **Purpose:** View scoped batch stock.

**Requirement links:** `INV-01`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Inventory`. Primary data: `warehouse.inventory_adjustment_items`, `warehouse.inventory_adjustments`, `warehouse.inventory_lots`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`. Read/write behavior follows the operation: **view scoped batch stock**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Successful request fields and input names below are **illustrative**, not confirmed DTOs.

```http
GET /v1/staff/inventory?limit=25 HTTP/1.1
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

## API-051

## API-051 — POST `/v1/staff/inventory/observations`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Inventory. **Purpose:** Ingest authoritative POS observation.

**Requirement links:** `INV-07`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Inventory`. Primary data: `warehouse.inventory_adjustment_items`, `warehouse.inventory_adjustments`, `warehouse.inventory_lots`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`. Read/write behavior follows the operation: **ingest authoritative pos observation**.

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

## API-052

## API-052 — POST `/v1/internal/inventory/reservations`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Inventory. **Purpose:** Make concurrency-safe hold.

**Requirement links:** `CHK-08`, `INV-02`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Trusted internal caller only, capability-based DB access; never browser-callable. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Inventory`. Primary data: `warehouse.inventory_adjustment_items`, `warehouse.inventory_adjustments`, `warehouse.inventory_lots`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`. Read/write behavior follows the operation: **make concurrency-safe hold**.

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

## API-053

## API-053 — POST `/v1/internal/inventory/reservations/{reservation_id}/release`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Inventory. **Purpose:** Release expired hold.

**Requirement links:** `CHK-08`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Trusted internal caller only, capability-based DB access; never browser-callable. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Inventory`. Primary data: `warehouse.inventory_adjustment_items`, `warehouse.inventory_adjustments`, `warehouse.inventory_lots`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`. Read/write behavior follows the operation: **release expired hold**.

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

## API-054

## API-054 — POST `/v1/staff/inventory/adjustments`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Inventory. **Purpose:** Adjust with reason and approval.

**Requirement links:** `INV-04`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Inventory`. Primary data: `warehouse.inventory_adjustment_items`, `warehouse.inventory_adjustments`, `warehouse.inventory_lots`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`. Read/write behavior follows the operation: **adjust with reason and approval**.

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

## API-055

## API-055 — GET `/v1/staff/inventory/alerts`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Inventory. **Purpose:** View expiry/low-stock alerts.

**Requirement links:** `INV-05`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](README.md#caller-trust-and-contract-readiness), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Inventory`. Primary data: `warehouse.inventory_adjustment_items`, `warehouse.inventory_adjustments`, `warehouse.inventory_lots`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`. Read/write behavior follows the operation: **view expiry/low-stock alerts**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Successful request fields and input names below are **illustrative**, not confirmed DTOs.

```http
GET /v1/staff/inventory/alerts?limit=25 HTTP/1.1
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
