# Cart Checkout API contracts


**Shared contract standards:** [conventions](API-Conventions.md) · [authentication/authorization](Authentication-and-Authorization.md) · [response envelope](Standard-Responses.md) · [errors](Error-Catalog.md) · [pagination](Pagination-and-Filtering.md) · [idempotency/concurrency](Idempotency-and-Concurrency.md) · [database-to-DTO mapping](Database-DTO-Mapping.md) · [coverage/readiness](API-Contract-Coverage.md).

**Implementation evidence:** these Pharmville routes are proposed documentation contracts; no executable Pharmville HTTP routes or contract tests were found. A verified response envelope from the separate authentication service does not confirm these operation DTOs. Resolve the operation-specific gaps listed in the coverage ledger before implementation.

[Operation-specific refinements](Critical-Operation-Contracts.md) · [ownership and recovery](../07-Engineering/State-and-Recovery-Contracts.md)

**Contract readiness:** Proposed for architectural review. Each route remains blocked from implementation until its operation-specific DTO, permissions, persistence mapping, state transition and tests are approved under D-024. See the [coverage ledger](API-Contract-Coverage.md) and [audit H-03](../09-References/Engineering-Audit.md#rechecked-earlier-findings).


## API-018 — GET `/v1/me/cart`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Cart_Checkout. **Purpose:** Load active cart.

**Requirement links:** `CHK-01`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Cart_Checkout`. Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `commerce.cart_items`, `commerce.carts`, `commerce.checkouts`, `commerce.order_revisions`, `commerce.orders`. Read/write behavior follows the operation: **load active cart**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

```http
GET /v1/me/cart HTTP/1.1
Authorization: Bearer <scoped-access-token>

```

## Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Load active cart; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

## Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

## Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-019 — PUT `/v1/me/cart/items`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Cart_Checkout. **Purpose:** Add/update cart line.

**Requirement links:** `CHK-01`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Cart_Checkout`. Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `commerce.cart_items`, `commerce.carts`, `commerce.checkouts`, `commerce.order_revisions`, `commerce.orders`. Read/write behavior follows the operation: **add/update cart line**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Request DTO — Blocked by D-024:** the available sources establish this operation's purpose (Add/update cart line) and candidate data owner, but do not establish an approved public request schema. The Tech lead, module owner and QA lead must approve field names, types/nullability/bounds, conditional rules, actor/resource scope, and aggregate version, then align the OpenAPI request schema. No database column is assumed to be a public field; implementation remains blocked until this decision is recorded.

## Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Add/update cart line; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

## Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

## Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-020 — POST `/v1/checkouts/quotes`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Cart_Checkout. **Purpose:** Reprice and validate quote.

**Requirement links:** `CHK-02`, `CHK-05`, `CHK-06`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Cart_Checkout`. Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `commerce.cart_items`, `commerce.carts`, `commerce.checkouts`, `commerce.order_revisions`, `commerce.orders`. Read/write behavior follows the operation: **reprice and validate quote**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Request DTO — Blocked by D-024:** the available sources establish this operation's purpose (Reprice and validate quote) and candidate data owner, but do not establish an approved public request schema. The Tech lead, module owner and QA lead must approve field names, types/nullability/bounds, conditional rules, actor/resource scope, and aggregate version, then align the OpenAPI request schema. No database column is assumed to be a public field; implementation remains blocked until this decision is recorded.

## Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Reprice and validate quote; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

## Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

## Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-021 — POST `/v1/checkouts`

**Status:** Proposed API, not an implemented HTTP route. **Owning service/module:** Cart_Checkout. **Purpose:** Create one order intent.

**Requirement links:** `CHK-07`, `CHK-08`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

## Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Cart_Checkout`. Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `commerce.cart_items`, `commerce.carts`, `commerce.checkouts`, `commerce.order_revisions`, `commerce.orders`. Read/write behavior follows the operation: **create one order intent**.

## HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version. Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Request DTO — Blocked by D-024:** the available sources establish this operation's purpose (Create one order intent) and candidate data owner, but do not establish an approved public request schema. The Tech lead, module owner and QA lead must approve field names, types/nullability/bounds, conditional rules, actor/resource scope, and aggregate version, then align the OpenAPI request schema. No database column is assumed to be a public field; implementation remains blocked until this decision is recorded.

## Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Create one order intent; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

## Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

## Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.
