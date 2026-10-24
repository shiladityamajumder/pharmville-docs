# Inventory API contracts

**Shared contract standards:** [conventions](API-Conventions.md) · [authentication/authorization](Authentication-and-Authorization.md) · [response envelope](Standard-Responses.md) · [errors](Error-Catalog.md) · [pagination](Pagination-and-Filtering.md) · [idempotency/concurrency](Idempotency-and-Concurrency.md) · [database-to-DTO mapping](Database-DTO-Mapping.md) · [coverage/readiness](API-Contract-Coverage.md).

> [!NOTE]
> **Implementation evidence:** these Pharmville routes are proposed documentation contracts; no executable Pharmville HTTP routes or contract tests were found. A verified response envelope from the separate authentication service does not confirm these operation DTOs. Resolve the operation-specific gaps listed in the coverage ledger before implementation.

[Operation-specific refinements](Critical-Operation-Contracts.md) · [ownership and recovery](../07-Engineering/State-and-Recovery-Contracts.md)

**Contract readiness:** Proposed for architectural review. Each route remains blocked from implementation until its operation-specific DTO, permissions, persistence mapping, state transition and tests are approved under D-024. See the [coverage ledger](API-Contract-Coverage.md) and [audit H-03](../09-References/Engineering-Audit.md#rechecked-earlier-findings).

## API-050 — GET `/v1/staff/inventory`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Inventory.
- **Purpose:** View scoped batch stock.

**Requirement links:** `INV-01`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Inventory`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `warehouse.inventory_adjustment_items`, `warehouse.inventory_adjustments`, `warehouse.inventory_lots`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`. Read/write behavior follows the operation: **view scoped batch stock**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

```http
GET /v1/staff/inventory HTTP/1.1
Authorization: Bearer <scoped-access-token>

```

### Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for View scoped batch stock; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-051 — POST `/v1/staff/inventory/observations`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Inventory.
- **Purpose:** Ingest authoritative POS observation.

**Requirement links:** `INV-07`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Inventory`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `warehouse.inventory_adjustment_items`, `warehouse.inventory_adjustments`, `warehouse.inventory_lots`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`. Read/write behavior follows the operation: **ingest authoritative pos observation**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Request DTO — Blocked by D-024:** the available sources establish this operation's purpose (Ingest authoritative POS observation) and candidate data owner, but do not establish an approved public request schema. The Tech lead, module owner and QA lead must approve field names, types/nullability/bounds, conditional rules, actor/resource scope, and aggregate version, then align the OpenAPI request schema.

No database column is assumed to be a public field; implementation remains blocked until this decision is recorded.

### Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Ingest authoritative POS observation; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-052 — POST `/v1/internal/inventory/reservations`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Inventory.
- **Purpose:** Make concurrency-safe hold.

**Requirement links:** `CHK-08`, `INV-02`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Trusted internal caller only, capability-based DB access; never browser-callable. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Inventory`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `warehouse.inventory_adjustment_items`, `warehouse.inventory_adjustments`, `warehouse.inventory_lots`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`. Read/write behavior follows the operation: **make concurrency-safe hold**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Request DTO — Blocked by D-024:** the available sources establish this operation's purpose (Make concurrency-safe hold) and candidate data owner, but do not establish an approved public request schema. The Tech lead, module owner and QA lead must approve field names, types/nullability/bounds, conditional rules, actor/resource scope, and aggregate version, then align the OpenAPI request schema.

No database column is assumed to be a public field; implementation remains blocked until this decision is recorded.

### Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Make concurrency-safe hold; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-053 — POST `/v1/internal/inventory/reservations/{reservation_id}/release`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Inventory.
- **Purpose:** Release expired hold.

**Requirement links:** `CHK-08`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Trusted internal caller only, capability-based DB access; never browser-callable. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Inventory`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `warehouse.inventory_adjustment_items`, `warehouse.inventory_adjustments`, `warehouse.inventory_lots`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`. Read/write behavior follows the operation: **release expired hold**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Request DTO — Blocked by D-024:** the available sources establish this operation's purpose (Release expired hold) and candidate data owner, but do not establish an approved public request schema. The Tech lead, module owner and QA lead must approve field names, types/nullability/bounds, conditional rules, actor/resource scope, and aggregate version, then align the OpenAPI request schema.

No database column is assumed to be a public field; implementation remains blocked until this decision is recorded.

### Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Release expired hold; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-054 — POST `/v1/staff/inventory/adjustments`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Inventory.
- **Purpose:** Adjust with reason and approval.

**Requirement links:** `INV-04`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Inventory`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `warehouse.inventory_adjustment_items`, `warehouse.inventory_adjustments`, `warehouse.inventory_lots`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`. Read/write behavior follows the operation: **adjust with reason and approval**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Request DTO — Blocked by D-024:** the available sources establish this operation's purpose (Adjust with reason and approval) and candidate data owner, but do not establish an approved public request schema. The Tech lead, module owner and QA lead must approve field names, types/nullability/bounds, conditional rules, actor/resource scope, and aggregate version, then align the OpenAPI request schema.

No database column is assumed to be a public field; implementation remains blocked until this decision is recorded.

### Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Adjust with reason and approval; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-055 — GET `/v1/staff/inventory/alerts`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Inventory.
- **Purpose:** View expiry/low-stock alerts.

**Requirement links:** `INV-05`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Inventory`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `warehouse.inventory_adjustment_items`, `warehouse.inventory_adjustments`, `warehouse.inventory_lots`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`. Read/write behavior follows the operation: **view expiry/low-stock alerts**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

```http
GET /v1/staff/inventory/alerts HTTP/1.1
Authorization: Bearer <scoped-access-token>

```

### Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for View expiry/low-stock alerts; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

The operation-specific success code remains an owner decision under D-024. On completion, return the committed result and correlation metadata; if downstream work remains, use an explicit pending state rather than claiming completion. Do not expose prescription content, credentials, payment secrets, or hidden-resource details.

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.
