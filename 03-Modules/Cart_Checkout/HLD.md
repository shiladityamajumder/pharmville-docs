# Cart Checkout HLD

## High-level design

## MOD-003: Cart, quote and placement intent — HLD

**Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Cart, quote and placement intent. A changed fee, classification or inventory observation invalidates a quote until reaccepted; replay cannot create two orders.

**System responsibility:** The `Cart_Checkout` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

## Major operations

- Cart saved across devices for logged-in customers (`CHK-01`)
- Checkout: address, patient (self or family), payment method, delivery fee and estimated time shown before paying (`CHK-02`)
- Online payment via Cashfree: UPI, cards, net banking (`CHK-03`)
- Cash on delivery, with a maximum order value and a block after repeated refusals (`CHK-04`)
- Minimum order value and delivery fee applied from settings (`CHK-05`)
- Price or stock change detected before payment; customer confirms (`CHK-06`)
- No duplicate orders or charges (double tap, refresh, closed browser after payment) (`CHK-07`)
- Stock reserved during checkout, released automatically if payment does not finish (`CHK-08`)

## Dependencies and trust boundaries
- Database candidates: `commerce.carts`, `commerce.cart_items`, `commerce.checkouts`, `commerce.orders`, `platform.idempotency_keys`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** Module LLD · API index · Tests

## Risk
A changed fee, classification or inventory observation invalidates a quote until reaccepted; replay cannot create two orders. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## Feature context

## MOD-003 — Cart, quote and placement intent

**Source classification:** 8 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** A changed fee, classification or inventory observation invalidates a quote until reaccepted; replay cannot create two orders.

**Feature coverage**
- **CHK-01 / REQ-014:** Cart saved across devices for logged-in customers (Must (draft)).
- **CHK-02 / REQ-015:** Checkout: address, patient (self or family), payment method, delivery fee and estimated time shown before paying (Must (draft)).
- **CHK-03 / REQ-016:** Online payment via Cashfree: UPI, cards, net banking (Must (draft)).
- **CHK-04 / REQ-017:** Cash on delivery, with a maximum order value and a block after repeated refusals (Must (draft)).
- **CHK-05 / REQ-018:** Minimum order value and delivery fee applied from settings (Must (draft)).
- **CHK-06 / REQ-019:** Price or stock change detected before payment; customer confirms (Must (draft)).
- **CHK-07 / REQ-020:** No duplicate orders or charges (double tap, refresh, closed browser after payment) (Must (draft)).
- **CHK-08 / REQ-021:** Stock reserved during checkout, released automatically if payment does not finish (Must (draft)).

## Developer navigation
- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](../../05-APIs/Cart_Checkout.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.
