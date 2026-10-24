# Warehouse HLD

<!-- ERD-NAV-START -->

## Database relationships

[`warehouse` ERD](../../04-Database/ER-Diagrams/24-warehouse.md) · [`procurement` ERD](../../04-Database/ER-Diagrams/20-procurement.md) · [FK catalog](../../04-Database/ER-Diagrams/Relationship-Catalog.md)

These diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](../../04-Database/Migrations.md) for the supplied source and deployment verification limits.

<!-- ERD-NAV-END -->

[Business flow](../../00-Business-Guide/Store-and-Warehouse.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## MOD-010: Warehouse replenishment and transfers — HLD

> [!NOTE]
> **Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Warehouse replenishment and transfers. Receiving and transfers create a traceable stock ledger and require location/lot scope.

**System responsibility:** The `Warehouse` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

### Major operations

- Receive stock: batch, manufacturing and expiry dates, quantity, supplier invoice (`WH-01`)
- Replenishment queue: approve, dispatch with note, stock "in transit" (`WH-02`)
- Urgent runs, up to two extra a day (`WH-03`)
- Pick, pack and dispatch fallback online orders (`WH-04`)
- Basic stock audit (`WH-05`)

### Dependencies and trust boundaries

- Database candidates: `warehouse.warehouses`, `warehouse.stock_transfers`, `warehouse.stock_transfer_items`, `procurement.goods_receipts`, `warehouse.stock_ledger`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** [Module LLD](LLD.md) · [API index](../../05-APIs/README.md) · [Tests](../../07-Engineering/Testing.md)

### Risk

Receiving and transfers create a traceable stock ledger and require location/lot scope. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## MOD-010 — Warehouse replenishment and transfers

**Source classification:** 5 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** Receiving and transfers create a traceable stock ledger and require location/lot scope.

**Feature coverage**

- **WH-01 / REQ-064:** Receive stock: batch, manufacturing and expiry dates, quantity, supplier invoice (Must (draft)).
- **WH-02 / REQ-065:** Replenishment queue: approve, dispatch with note, stock "in transit" (Must (draft)).
- **WH-03 / REQ-066:** Urgent runs, up to two extra a day (Must (draft)).
- **WH-04 / REQ-067:** Pick, pack and dispatch fallback online orders (Must (draft)).
- **WH-05 / REQ-068:** Basic stock audit (Could (draft)).

### Developer navigation

- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](APIs.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.
