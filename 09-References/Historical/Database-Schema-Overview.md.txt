# Schema overview

See the [ER diagram index](ER-Diagrams/README.md) for domain views and the complete foreign-key catalog.

<!-- ERD-INDEX-LINK -->


The checked-in database report describes 24 PostgreSQL schemas. Its local PostgreSQL 18 validation is dated 2026-10-22. The report records 266 tables, 4,438 columns, 1,461 foreign keys, 438 unique constraints, 1,033 checks, 1,204 indexes, 56 functions, and 879 triggers.

These figures describe the user-supplied database folder and its recorded catalog. The documentation source is selected and checksum-verified; the live target deployment ledger was not inspected. See [Migrations](Migrations.md). PostgreSQL 15 and hosted CI were not verified in the cited report.

## Schemas

| Schema | Tables | Main data area |
| --- | ---: | --- |
| `appointment` | 9 | Appointments and scheduling |
| `catalog` | 19 | Products, medicines, and classification |
| `clinical` | 17 | Prescriptions and pharmacist decisions |
| `commerce` | 17 | Carts, checkout, orders, and returns |
| `compliance` | 8 | Regulatory records and retention actions |
| `customer` | 8 | Customer profiles and addresses |
| `diagnostics` | 13 | Tests and laboratory services |
| `finance` | 8 | Invoices, ledgers, and settlements |
| `fulfillment` | 10 | Picking, packing, and shipment preparation |
| `identity` | 14 | Accounts, sessions, and permissions |
| `insurance` | 8 | Policies and claims |
| `logistics` | 15 | Riders, shipments, and delivery |
| `marketplace` | 7 | Sellers and listings |
| `membership` | 6 | Benefits and loyalty |
| `notification` | 10 | Templates, messages, and delivery attempts |
| `organization` | 6 | Operating companies, sites, and licenses |
| `payment` | 13 | Payment attempts, confirmation, and refunds |
| `platform` | 21 | Configuration, files, audit, events, and reports |
| `pricing` | 8 | Prices, taxes, and promotions |
| `procurement` | 13 | Suppliers, purchase orders, and receiving |
| `risk` | 5 | Risk rules, cases, and signals |
| `search` | 5 | Search indexes and query signals |
| `support` | 8 | Customer support cases |
| `warehouse` | 18 | Stock balances, lots, and transfers |

The descriptions summarize the recorded schema names. They do not define approved product scope or grant a service write access. Use the [table contracts](Tables/README.md) for every column, key, constraint, index, relationship, and table trigger. See [Database objects](Database-Objects.md) for function and RLS source locations.
