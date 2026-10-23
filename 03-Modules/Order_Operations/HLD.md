# Order Operations HLD

## High-level design

## MOD-007: Order orchestration and routing — HLD

**Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Order orchestration and routing. One order must have one accepted revision and an auditable licensed location/fulfillment decision.

**System responsibility:** The `Order_Operations` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

## Major operations

- Order list with filters (status, location, date, payment, Rx) and search by order number or phone (`OMS-01`)
- Order detail: items, batches, prescription, payment, delivery, full history (`OMS-02`)
- Automatic routing to the nearest open store with every item; warehouse as fallback (`OMS-03`)
- Reassign an order to another location, with a reason (`OMS-04`)
- Cancel, partly fulfil, raise return, add internal note (`OMS-05`)
- Attention queue: payment pending, stuck orders, failed deliveries (`OMS-06`)
- Assisted order entry for phone orders (`OMS-07`)

## Dependencies and trust boundaries
- Database candidates: `commerce.orders`, `commerce.order_revisions`, `commerce.order_allocations`, `fulfillment.fulfillment_orders`, `organization.licenses`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** Module LLD · API index · Tests

## Risk
One order must have one accepted revision and an auditable licensed location/fulfillment decision. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## Feature context

## MOD-007 — Order orchestration and routing

**Source classification:** 7 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** One order must have one accepted revision and an auditable licensed location/fulfillment decision.

**Feature coverage**
- **OMS-01 / REQ-045:** Order list with filters (status, location, date, payment, Rx) and search by order number or phone (Must (draft)).
- **OMS-02 / REQ-046:** Order detail: items, batches, prescription, payment, delivery, full history (Must (draft)).
- **OMS-03 / REQ-047:** Automatic routing to the nearest open store with every item; warehouse as fallback (Must (draft)).
- **OMS-04 / REQ-048:** Reassign an order to another location, with a reason (Must (draft)).
- **OMS-05 / REQ-049:** Cancel, partly fulfil, raise return, add internal note (Must (draft)).
- **OMS-06 / REQ-050:** Attention queue: payment pending, stuck orders, failed deliveries (Must (draft)).
- **OMS-07 / REQ-051:** Assisted order entry for phone orders (Could (draft)).

## Developer navigation
- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](../../05-APIs/Order_Operations.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.
