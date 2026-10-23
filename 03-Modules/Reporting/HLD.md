# Reporting HLD

<!-- ERD-NAV-START -->

## Database relationships

[`platform` ERD](../../04-Database/ER-Diagrams/18-platform.md) · [`finance` ERD](../../04-Database/ER-Diagrams/08-finance.md) · [FK catalog](../../04-Database/ER-Diagrams/Relationship-Catalog.md)

These diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](../../04-Database/Migrations.md) for the supplied source and deployment verification limits.

<!-- ERD-NAV-END -->

[Business flow](../../00-Business-Guide/Reporting-and-Audit.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## MOD-015: Scoped operations and financial reports — HLD

**Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Scoped operations and financial reports. Reports must be authorised by entity scope and must not export unapproved patient data.

**System responsibility:** The `Reporting` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

## Major operations

- Sales and orders, by date, store and product (`REP-01`)
- GST report for filing (`REP-02`)
- Stock, low stock and near-expiry (`REP-03`)
- COD, rider collections and deliveries per rider (`REP-04`)
- Refunds, cancellations and failed deliveries (`REP-05`)
- Replenishment transfers (`REP-06`)
- Excel export for every report (`REP-07`)

## Dependencies and trust boundaries
- Database candidates: `platform.report_definitions`, `platform.report_runs`, `finance.settlement_runs`, `commerce.orders`, `platform.file_access_grants`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** Module LLD · API index · Tests

## Risk
Reports must be authorised by entity scope and must not export unapproved patient data. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## MOD-015 — Scoped operations and financial reports

**Source classification:** 7 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** Reports must be authorised by entity scope and must not export unapproved patient data.

**Feature coverage**
- **REP-01 / REQ-093:** Sales and orders, by date, store and product (Must (draft)).
- **REP-02 / REQ-094:** GST report for filing (Must (draft)).
- **REP-03 / REQ-095:** Stock, low stock and near-expiry (Must (draft)).
- **REP-04 / REQ-096:** COD, rider collections and deliveries per rider (Must (draft)).
- **REP-05 / REQ-097:** Refunds, cancellations and failed deliveries (Should (draft)).
- **REP-06 / REQ-098:** Replenishment transfers (Should (draft)).
- **REP-07 / REQ-099:** Excel export for every report (Must (draft)).

## Developer navigation
- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](../../05-APIs/Reporting.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.
