# Customer Orders HLD

[Business flow](../../00-Business-Guide/Orders-and-Fulfillment.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## MOD-005: Order tracking and aftercare — HLD

**Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Order tracking and aftercare. Customer cancellation or return requests must respect current order/fulfillment/payment states.

**System responsibility:** The `Customer_Orders` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

## Major operations

- Order confirmation on screen, WhatsApp and email (`ORD-01`)
- Status timeline (placed → packed → out for delivery → delivered) (`ORD-02`)
- Order history with GST invoice download (`ORD-03`)
- Cancel before the order is packed (`ORD-04`)
- Return request within the return window (`ORD-05`)
- Refund status for cancelled and returned orders (`ORD-06`)
- Live rider location on a map, estimated arrival, masked call button (`ORD-07`)
- Delivery OTP shown to the customer (`ORD-08`)
- Change items or address after placing an order (`ORD-09`)

## Dependencies and trust boundaries
- Database candidates: `commerce.orders`, `commerce.order_items`, `commerce.cancellations`, `commerce.returns`, `commerce.order_status_history`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** Module LLD · API index · Tests

## Risk
Customer cancellation or return requests must respect current order/fulfillment/payment states. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## MOD-005 — Order tracking and aftercare

**Source classification:** 9 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** Customer cancellation or return requests must respect current order/fulfillment/payment states.

**Feature coverage**
- **ORD-01 / REQ-027:** Order confirmation on screen, WhatsApp and email (Must (draft)).
- **ORD-02 / REQ-028:** Status timeline (placed → packed → out for delivery → delivered) (Must (draft)).
- **ORD-03 / REQ-029:** Order history with GST invoice download (Must (draft)).
- **ORD-04 / REQ-030:** Cancel before the order is packed (Must (draft)).
- **ORD-05 / REQ-031:** Return request within the return window (Should (draft)).
- **ORD-06 / REQ-032:** Refund status for cancelled and returned orders (Must (draft)).
- **ORD-07 / REQ-033:** Live rider location on a map, estimated arrival, masked call button (Must (draft)).
- **ORD-08 / REQ-034:** Delivery OTP shown to the customer (Must (draft)).
- **ORD-09 / REQ-035:** Change items or address after placing an order (Could (draft)).

## Developer navigation
- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](../../05-APIs/Customer_Orders.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.
