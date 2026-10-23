# Inventory HLD

<!-- ERD-NAV-START -->

## Database relationships

[`warehouse` ERD](../../04-Database/ER-Diagrams/24-warehouse.md) · [`catalog` ERD](../../04-Database/ER-Diagrams/02-catalog.md) · [`procurement` ERD](../../04-Database/ER-Diagrams/20-procurement.md) · [FK catalog](../../04-Database/ER-Diagrams/Relationship-Catalog.md)

These diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](../../04-Database/Migrations.md) for the supplied source and deployment verification limits.

<!-- ERD-NAV-END -->

[Business flow](../../00-Business-Guide/Inventory-and-Stock.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## MOD-009: Lot-aware inventory and reservation — HLD

**Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Lot-aware inventory and reservation. A reservation must not create negative eligible stock and must not use expired/blocked lots.

**System responsibility:** The `Inventory` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

## Major operations

- Stock per location and batch, with manufacturing and expiry dates (`INV-01`)
- Stock ledger: every movement recorded; stock is the sum of the ledger (`INV-02`)
- Allocate nearest-expiry batch first; block batches below minimum shelf life (`INV-03`)
- Stock adjustments with reason; manager approval above a threshold (`INV-04`)
- Low-stock and near-expiry alerts (`INV-05`)
- Opening stock import per location (`INV-06`)
- Stock sync with Techsmith (`INV-07`)

## Dependencies and trust boundaries
- Database candidates: `warehouse.stock_balances`, `warehouse.stock_reservations`, `warehouse.inventory_lots`, `warehouse.stock_ledger`, `warehouse.stock_holds`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** Module LLD · API index · Tests

## Risk
A reservation must not create negative eligible stock and must not use expired/blocked lots. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## MOD-009 — Lot-aware inventory and reservation

**Source classification:** 7 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** A reservation must not create negative eligible stock and must not use expired/blocked lots.

**Feature coverage**
- **INV-01 / REQ-057:** Stock per location and batch, with manufacturing and expiry dates (Must (draft)).
- **INV-02 / REQ-058:** Stock ledger: every movement recorded; stock is the sum of the ledger (Must (draft)).
- **INV-03 / REQ-059:** Allocate nearest-expiry batch first; block batches below minimum shelf life (Must (draft)).
- **INV-04 / REQ-060:** Stock adjustments with reason; manager approval above a threshold (Must (draft)).
- **INV-05 / REQ-061:** Low-stock and near-expiry alerts (Must (draft)).
- **INV-06 / REQ-062:** Opening stock import per location (Must (draft)).
- **INV-07 / REQ-063:** Stock sync with Techsmith (Must (draft)).

## Developer navigation
- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](../../05-APIs/Inventory.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.
