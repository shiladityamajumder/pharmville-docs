# Pharmville ER diagram documentation

## Start here

- [System data map](00-System-Data-Map.md) for the major stored-data areas and representative links.
- [ERD coverage report](ERD-Coverage-Report.md) for measured scope, evidence status, gaps, and validation limits.
- [Cross-domain relationships](15-Cross-Domain-Relationships.md) for all 92 observed schema-to-schema FK pairs.
- [Relationship catalog](Relationship-Catalog.md) for all 1461 physical FK constraints, split by child schema.
- [Logical references](Logical-References.md) for UUID/polymorphic references that are not declared foreign keys.
- [Machine-readable ERD inventory](ERD-Inventory.json) for reproducible table keys and relationship data.

## Browse all database schemas

- [appointment — Appointments and scheduling](01-appointment.md) (9 tables, 49 FK constraints)
- [catalog — Products, medicines, and classification](02-catalog.md) (19 tables, 105 FK constraints)
- [clinical — Prescriptions and pharmacist decisions](03-clinical.md) (17 tables, 111 FK constraints)
- [commerce — Carts, checkout, orders, and returns](04-commerce.md) (17 tables, 117 FK constraints)
- [compliance — Regulatory records and retention actions](05-compliance.md) (8 tables, 43 FK constraints)
- [customer — Customer profiles and addresses](06-customer.md) (8 tables, 38 FK constraints)
- [diagnostics — Tests and laboratory services](07-diagnostics.md) (13 tables, 79 FK constraints)
- [finance — Invoices, ledgers, and settlements](08-finance.md) (8 tables, 45 FK constraints)
- [fulfillment — Picking, packing, and shipment preparation](09-fulfillment.md) (10 tables, 70 FK constraints)
- [identity — Accounts, sessions, and permissions](10-identity.md) (14 tables, 45 FK constraints)
- [insurance — Policies and claims](11-insurance.md) (8 tables, 42 FK constraints)
- [logistics — Riders, shipments, and delivery](12-logistics.md) (15 tables, 84 FK constraints)
- [marketplace — Sellers and listings](13-marketplace.md) (7 tables, 45 FK constraints)
- [membership — Benefits and loyalty](14-membership.md) (6 tables, 24 FK constraints)
- [notification — Templates, messages, and delivery attempts](15-notification.md) (10 tables, 40 FK constraints)
- [organization — Operating companies, sites, and licenses](16-organization.md) (6 tables, 39 FK constraints)
- [payment — Payment attempts, confirmation, and refunds](17-payment.md) (13 tables, 70 FK constraints)
- [platform — Configuration, files, audit, events, and reports](18-platform.md) (21 tables, 66 FK constraints)
- [pricing — Prices, taxes, and promotions](19-pricing.md) (8 tables, 41 FK constraints)
- [procurement — Suppliers, purchase orders, and receiving](20-procurement.md) (13 tables, 93 FK constraints)
- [risk — Risk rules, cases, and signals](21-risk.md) (5 tables, 16 FK constraints)
- [search — Search indexes and query signals](22-search.md) (5 tables, 11 FK constraints)
- [support — Customer support cases](23-support.md) (8 tables, 44 FK constraints)
- [warehouse — Stock balances, lots, and transfers](24-warehouse.md) (18 tables, 144 FK constraints)

## Evidence boundary

These diagrams use the [validated standalone schema](../../pharmville-database/pharmville_schema.sql), with the derived register and all source checksums recorded in [evidence](../../09-References/Database-Evidence.json). No production database or shared endpoint was queried.

## Regenerate and validate

From the repository root, run `npm run generate:erd`, then `npm run validate:erd` and `npm run validate`. Sources are the canonical SQL and derived catalog/table register; missing or changed checksums fail verification. No legacy checkout, application models or migration runner is needed. Mermaid parsing is handled by the documentation validator.
