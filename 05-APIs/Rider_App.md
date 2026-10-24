# Rider App API contracts

**Shared contract standards:** [conventions](API-Conventions.md) · [authentication/authorization](Authentication-and-Authorization.md) · [response envelope](Standard-Responses.md) · [errors](Error-Catalog.md) · [pagination](Pagination-and-Filtering.md) · [idempotency/concurrency](Idempotency-and-Concurrency.md) · [database-to-DTO mapping](Database-DTO-Mapping.md) · [coverage/readiness](API-Contract-Coverage.md).

> [!NOTE]
> **Implementation evidence:** these Pharmville routes are proposed documentation contracts; no executable Pharmville HTTP routes or contract tests were found. A verified response envelope from the separate authentication service does not confirm these operation DTOs. Resolve the operation-specific gaps listed in the coverage ledger before implementation.

[Operation-specific refinements](Critical-Operation-Contracts.md) · [ownership and recovery](../07-Engineering/State-and-Recovery-Contracts.md)

**Contract readiness:** Proposed for architectural review. Each route remains blocked from implementation until its operation-specific DTO, permissions, persistence mapping, state transition and tests are approved under D-024. See the [coverage ledger](API-Contract-Coverage.md) and [audit H-03](../09-References/Engineering-Audit.md#rechecked-earlier-findings).

## API-069 — POST `/v1/rider/shifts`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Rider_App.
- **Purpose:** Start/stop shift.

**Requirement links:** `RID-01`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Rider_App`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `logistics.delivery_assignments`, `logistics.delivery_attempts`, `logistics.delivery_failure_reasons`, `logistics.delivery_location_updates`, `logistics.delivery_otp_challenges`, `logistics.delivery_routes`. Read/write behavior follows the operation: **start/stop shift**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Request DTO — Blocked by D-024:** the available sources establish this operation's purpose (Start/stop shift) and candidate data owner, but do not establish an approved public request schema. The Tech lead, module owner and QA lead must approve field names, types/nullability/bounds, conditional rules, actor/resource scope, and aggregate version, then align the OpenAPI request schema.

No database column is assumed to be a public field; implementation remains blocked until this decision is recorded.

### Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Start/stop shift; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

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

## API-070 — GET `/v1/rider/tasks`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Rider_App.
- **Purpose:** Assigned tasks only.

**Requirement links:** `RID-02`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Rider_App`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `logistics.delivery_assignments`, `logistics.delivery_attempts`, `logistics.delivery_failure_reasons`, `logistics.delivery_location_updates`, `logistics.delivery_otp_challenges`, `logistics.delivery_routes`. Read/write behavior follows the operation: **assigned tasks only**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

```http
GET /v1/rider/tasks HTTP/1.1
Authorization: Bearer <scoped-access-token>

```

### Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Assigned tasks only; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

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

## API-071 — POST `/v1/rider/tasks/{task_id}/pickup`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Rider_App.
- **Purpose:** Confirm handover.

**Requirement links:** `RID-02`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Rider_App`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `logistics.delivery_assignments`, `logistics.delivery_attempts`, `logistics.delivery_failure_reasons`, `logistics.delivery_location_updates`, `logistics.delivery_otp_challenges`, `logistics.delivery_routes`. Read/write behavior follows the operation: **confirm handover**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Request DTO — Blocked by D-024:** the available sources establish this operation's purpose (Confirm handover) and candidate data owner, but do not establish an approved public request schema. The Tech lead, module owner and QA lead must approve field names, types/nullability/bounds, conditional rules, actor/resource scope, and aggregate version, then align the OpenAPI request schema.

No database column is assumed to be a public field; implementation remains blocked until this decision is recorded.

### Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Confirm handover; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

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

## API-072 — POST `/v1/rider/tasks/{task_id}/location`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Rider_App.
- **Purpose:** Submit scoped location sample.

**Requirement links:** `RID-03`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Rider_App`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `logistics.delivery_assignments`, `logistics.delivery_attempts`, `logistics.delivery_failure_reasons`, `logistics.delivery_location_updates`, `logistics.delivery_otp_challenges`, `logistics.delivery_routes`. Read/write behavior follows the operation: **submit scoped location sample**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Request DTO — Blocked by D-024:** the available sources establish this operation's purpose (Submit scoped location sample) and candidate data owner, but do not establish an approved public request schema. The Tech lead, module owner and QA lead must approve field names, types/nullability/bounds, conditional rules, actor/resource scope, and aggregate version, then align the OpenAPI request schema.

No database column is assumed to be a public field; implementation remains blocked until this decision is recorded.

### Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Submit scoped location sample; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

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

## API-073 — POST `/v1/rider/tasks/{task_id}/complete`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Rider_App.
- **Purpose:** Verify recipient/OTP/COD evidence.

**Requirement links:** `RID-04`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Rider_App`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `logistics.delivery_assignments`, `logistics.delivery_attempts`, `logistics.delivery_failure_reasons`, `logistics.delivery_location_updates`, `logistics.delivery_otp_challenges`, `logistics.delivery_routes`. Read/write behavior follows the operation: **verify recipient/otp/cod evidence**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Request DTO — Blocked by D-024:** the available sources establish this operation's purpose (Verify recipient/OTP/COD evidence) and candidate data owner, but do not establish an approved public request schema. The Tech lead, module owner and QA lead must approve field names, types/nullability/bounds, conditional rules, actor/resource scope, and aggregate version, then align the OpenAPI request schema.

No database column is assumed to be a public field; implementation remains blocked until this decision is recorded.

### Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Verify recipient/OTP/COD evidence; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

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

## API-074 — POST `/v1/rider/tasks/{task_id}/fail`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Rider_App.
- **Purpose:** Record approved failure reason.

**Requirement links:** `RID-06`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Rider_App`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `logistics.delivery_assignments`, `logistics.delivery_attempts`, `logistics.delivery_failure_reasons`, `logistics.delivery_location_updates`, `logistics.delivery_otp_challenges`, `logistics.delivery_routes`. Read/write behavior follows the operation: **record approved failure reason**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Request DTO — Blocked by D-024:** the available sources establish this operation's purpose (Record approved failure reason) and candidate data owner, but do not establish an approved public request schema. The Tech lead, module owner and QA lead must approve field names, types/nullability/bounds, conditional rules, actor/resource scope, and aggregate version, then align the OpenAPI request schema.

No database column is assumed to be a public field; implementation remains blocked until this decision is recorded.

### Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Record approved failure reason; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

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
