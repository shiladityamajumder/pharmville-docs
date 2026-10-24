# Cart Checkout API contracts

**Shared contract standards:** [conventions](API-Conventions.md) · [authentication/authorization](Authentication-and-Authorization.md) · [response envelope](Standard-Responses.md) · [errors](Error-Catalog.md) · [pagination](Pagination-and-Filtering.md) · [idempotency/concurrency](Idempotency-and-Concurrency.md) · [database-to-DTO mapping](Database-DTO-Mapping.md) · [coverage/readiness](API-Contract-Coverage.md).

> [!NOTE]
> **Implementation evidence:** these Pharmville routes are proposed documentation contracts; no executable Pharmville HTTP routes or contract tests were found. A verified response envelope from the separate authentication service does not confirm these operation DTOs. Resolve the operation-specific gaps listed in the coverage ledger before implementation.

[Operation-specific refinements](Critical-Operation-Contracts.md) · [ownership and recovery](../07-Engineering/State-and-Recovery-Contracts.md)

**Contract readiness:** Proposed for architectural review. Each route remains blocked from implementation until its operation-specific DTO, permissions, persistence mapping, state transition and tests are approved under D-024. See the [coverage ledger](API-Contract-Coverage.md) and [audit H-03](../09-References/Engineering-Audit.md#rechecked-earlier-findings).

## API-018 — GET `/v1/me/cart`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Cart_Checkout.
- **Purpose:** Load active cart.

**Requirement links:** `CHK-01`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Cart_Checkout`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `commerce.cart_items`, `commerce.carts`, `commerce.checkouts`, `commerce.order_revisions`, `commerce.orders`. Read/write behavior follows the operation: **load active cart**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

```http
GET /v1/me/cart HTTP/1.1
Authorization: Bearer <scoped-access-token>

```

### Success response (illustrative)

**Response DTO — Blocked by D-024:** propose a filtered, operation-specific result for Load active cart; the exact data fields, nullable fields, success status, response headers and state meaning are not verified in available sources. The Tech lead, module owner and QA lead must approve that DTO and align its OpenAPI schema before implementation.

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

## API-019 — PUT `/v1/me/cart/items`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Cart_Checkout.
- **Purpose:** Add/update cart line.

**Requirement links:** `CHK-01`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Cart_Checkout`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `commerce.cart_items`, `commerce.carts`, `commerce.checkouts`, `commerce.order_revisions`, `commerce.orders`. Read/write behavior follows the operation: **add/update cart line**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Proposed request DTO:** `cartVersion` is the expected `commerce.carts.row_version`; `items` is the desired set of product lines. Each item has public `productId` and positive decimal-string `quantity` (maximum three fractional digits, from `commerce.cart_items.quantity numeric(12,3)`).

Proposed max 50 items requires D-024 approval. The server derives the current cart from the authenticated customer; it does not accept `cartId`, price, currency, seller, prescription status or actor ID from the client. `unit_price_snapshot` is server-owned and revalidated at quote time.

```json
{
  "cartVersion": 5,
  "items": [
    {
      "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
      "quantity": "2.000"
    }
  ]
}
```

### Success response (illustrative)

**Proposed success DTO:** `cartId`, incremented `cartVersion`, currency and current item projections. `unitPrice` is the persisted snapshot for display only, nullable if no current safe price is available; checkout must reprice. Response `200`; a stale cart version returns `409 STALE_VERSION` with no partial mutation.

```json
{
  "success": true,
  "data": {
    "cartId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
    "cartVersion": 6,
    "currency": "INR",
    "items": [
      {
        "cartItemId": "0192a1b2-c3d4-7e8f-9012-3456789abce0",
        "productId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
        "quantity": "2.000",
        "unitPrice": "22.50"
      }
    ]
  },
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

### Errors, concurrency and failure recovery

- `400/422` invalid required field, unsupported policy/code, malformed or expired request.
- `401` missing/expired session; `403` denied scope; `404` inaccessible resource (do not leak another customer's existence).
- `409` duplicate incompatible intent or stale version; `429` rate-limited; `503` upstream service unavailable, with no fabricated successful result.
- Non-GET state transitions need a stable idempotency key scoped to actor + action + target. Persist the command result and return the same result on safe replay.
- External provider outcomes need signature validation, durable event IDs, bounded retries and a reconciliation worker. Do not retry money-moving calls without a provider-supported idempotency contract.

### Required verification

Test successful authorized request, schema validation, cross-customer or cross-location denial, duplicate replay, concurrent conflict, stale state, provider delay and audit/correlation consistency. This contract must pass a database-backed test referencing the actual migrated schema before being labeled ready.

Related: [api conventions](README.md); real table mappings.

## API-020 — POST `/v1/checkouts/quotes`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Cart_Checkout.
- **Purpose:** Reprice and validate quote.

**Requirement links:** `CHK-02`, `CHK-05`, `CHK-06`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Cart_Checkout`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `commerce.cart_items`, `commerce.carts`, `commerce.checkouts`, `commerce.order_revisions`, `commerce.orders`. Read/write behavior follows the operation: **reprice and validate quote**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Proposed request DTO** (`CheckoutQuoteRequest`): `cartId` and `addressId` are public UUID references; `cartVersion` is the expected `commerce.carts.row_version`; optional `patientId` is the public patient-profile UUID needed only where a P-class product requires an eligible patient.

Authenticated ownership and conditional patient rules remain D-024 approval items. The server recalculates prices, discounts, taxes and delivery charges; client totals are not accepted.

```json
{
  "cartId": "0192a1b2-c3d4-7e8f-9012-3456789abcde",
  "cartVersion": 4,
  "addressId": "0192a1b2-c3d4-7e8f-9012-3456789abcdf",
  "patientId": "0192a1b2-c3d4-7e8f-9012-3456789abce0"
}
```

### Success response (illustrative)

**Proposed success response:** `200 OK` returns a short-lived API-only `quoteToken`, evaluated cart version, repriced lines, currency-coded totals, and a derived `nextAction`. Money uses decimal strings to avoid binary floating point. The token is not a database field and must be bound to its customer, cart/version, address and expiry; token format/TTL and quote invalidation are D-009/D-024 decisions. A quote does not reserve stock or guarantee later availability.

```json
{
  "success": true,
  "data": {
    "quoteToken": "<opaque-signed-quote-token>",
    "cartVersion": 4,
    "lines": [
      {
        "productId": "018f47b2-7ed0-7a12-8ab2-48df9d439e61",
        "quantity": "2.000",
        "commerceClass": "O",
        "unitPrice": {
          "amount": "12.50",
          "currency": "INR"
        }
      }
    ],
    "totals": {
      "subtotal": "25.00",
      "discountTotal": "0.00",
      "taxTotal": "1.25",
      "shippingTotal": "0.00",
      "otherChargesTotal": "0.00",
      "grandTotal": "26.25",
      "currency": "INR"
    },
    "nextAction": "confirm_checkout",
    "deliveryEstimate": "2026-10-25T14:00:00Z",
    "changedLines": []
  },
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

## API-021 — POST `/v1/checkouts`

- **Status:** Proposed API, not an implemented HTTP route.
- **Owning service/module:** Cart_Checkout.
- **Purpose:** Create one order intent.

**Requirement links:** `CHK-07`, `CHK-08`. The product rule is sourced from the [feature inventory](../01-Project/Features-and-Modules.md); path design requires API review.

### Caller, permissions and dependencies

Use the caller trust category defined in [API conventions](Authentication-and-Authorization.md), then enforce operation-specific permission and resource ownership. The server must resolve scope using a trusted session, not from a caller-controlled actor ID. Client: role-specific customer web, staff admin or rider app; server owner: `Cart_Checkout`.

Domain table candidates (operation-level mapping and exact field evidence: [Database-DTO-Mapping.md](Database-DTO-Mapping.md)): `commerce.cart_items`, `commerce.carts`, `commerce.checkouts`, `commerce.order_revisions`, `commerce.orders`. Read/write behavior follows the operation: **create one order intent**.

### HTTP request contract

Path parameters (`{...}`) identify public UUID or approved opaque IDs only; internal BIGINT row IDs must never become client authorization claims. Body for changes is JSON unless a specialized signed-object workflow is used. Validate each field's type, status, ownership, input length, allowed enum/master value and accepted record version.

Any sample fields below are **proposed**, not confirmed DTOs; approve them under D-024 before implementation.

**Proposed request DTO** (`CheckoutIntentRequest`): `quoteToken` is the opaque server-issued quote capability; `cartVersion` repeats the evaluated `commerce.carts.row_version`; `accepted` must be `true`. Require `Idempotency-Key` and bind it to the authenticated customer and checkout action.

The server revalidates token expiry, cart version, address, price and policy before creating the checkout/order/revision. A stale or invalid quote must not create an order.

```json
{
  "quoteToken": "<opaque-signed-quote-token>",
  "cartVersion": 4,
  "accepted": true
}
```

### Success response (illustrative)

**Proposed success response:** `201 Created` returns `checkoutId`, `orderId`, `acceptedRevisionId`, `revisionNumber`, and distinct checkout and order statuses plus `nextAction`. `checkoutStatus: open` represents an accepted intent, not paid or finalized completion; an `orderStatus` such as `prescription_review` remains a separate domain fact.

```json
{
  "success": true,
  "data": {
    "checkoutId": "018f47b2-7ed0-7a12-8ab2-48df9d439e61",
    "checkoutStatus": "open",
    "orderId": "019047b2-7ed0-7a12-8ab2-48df9d439e62",
    "orderStatus": "prescription_review",
    "acceptedRevisionId": "019147b2-7ed0-7a12-8ab2-48df9d439e63",
    "revisionNumber": 1,
    "nextAction": "prescription_review"
  },
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
