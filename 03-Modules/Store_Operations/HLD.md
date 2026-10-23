# Store Operations HLD

<!-- ERD-NAV-START -->

## Database relationships

[`fulfillment` ERD](../../04-Database/ER-Diagrams/09-fulfillment.md) · [`warehouse` ERD](../../04-Database/ER-Diagrams/24-warehouse.md) · [`procurement` ERD](../../04-Database/ER-Diagrams/20-procurement.md) · [FK catalog](../../04-Database/ER-Diagrams/Relationship-Catalog.md)

These diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](../../04-Database/Migrations.md) for the unresolved target-baseline limit.

<!-- ERD-NAV-END -->

[Business flow](../../00-Business-Guide/Store-and-Warehouse.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## MOD-008: Picking, packing and store replenishment — HLD

**Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Picking, packing and store replenishment. Store actors can mutate only scoped tasks and must report actual shortages, never silently substitute.

**System responsibility:** The `Store_Operations` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

## Major operations

- Incoming order queue for my store, with sound alert (`STO-01`)
- Accept order, pick list, mark packed, hand over to rider (`STO-02`)
- Raise replenishment request (normal or urgent) (`STO-03`)
- Confirm receipt of a transfer; record shortages (`STO-04`)
- My store's stock, with low-stock and near-expiry alerts (`STO-05`)

## Dependencies and trust boundaries
- Database candidates: `fulfillment.pick_tasks`, `fulfillment.pack_tasks`, `fulfillment.packages`, `warehouse.stock_balances`, `procurement.purchase_requisitions`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** Module LLD · API index · Tests

## Risk
Store actors can mutate only scoped tasks and must report actual shortages, never silently substitute. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## MOD-008 — Picking, packing and store replenishment

**Source classification:** 5 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** Store actors can mutate only scoped tasks and must report actual shortages, never silently substitute.

**Feature coverage**
- **STO-01 / REQ-052:** Incoming order queue for my store, with sound alert (Must (draft)).
- **STO-02 / REQ-053:** Accept order, pick list, mark packed, hand over to rider (Must (draft)).
- **STO-03 / REQ-054:** Raise replenishment request (normal or urgent) (Must (draft)).
- **STO-04 / REQ-055:** Confirm receipt of a transfer; record shortages (Must (draft)).
- **STO-05 / REQ-056:** My store's stock, with low-stock and near-expiry alerts (Must (draft)).

## Developer navigation
- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](../../05-APIs/Store_Operations.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.
