# 🗄️ Database reference

<!-- ERD-INDEX-LINK -->
- [Entity relationship diagrams](ER-Diagrams/README.md) — verified domain diagrams, FK catalog, and evidence limits.


## Source of truth

The [standalone SQL schema](../pharmville-database/pharmville_schema.sql) is the authoritative effective database definition, reconstructed from V0001–V0030 with the explicitly proposed D-028 unified-identity extension, originally recovered by executing V0001–V0030 in a private disposable PostgreSQL 18.6 cluster. A second empty database installed only that file: **zero unexplained structural differences across 23 catalog dimensions**. No existing user database was accessed.

| Structure | Validated count |
| --- | --- |
| Application schemas / tables / columns | 24 / 268 / 4,485 |
| Foreign keys / indexes | 1,476 / 1,222 |
| Functions / user triggers | 58 / 883 |
| Identity sequences / RLS policies | 267 / 3 |
| PK + UNIQUE + CHECK + FK constraints | 3,241 |
| PostgreSQL 18 NOT NULL constraints | 2,951 |

## Table reference

Every table page below records exact fields/defaults/nullability, keys, all constraints, index definitions/methods/predicates, trigger definitions, incoming and outgoing relationships, classification and proposed module ownership. SQL access does not confer business write ownership. Shared platform and future domains have explicit decision owners.

| Schema | Tables | Reference |
| --- | --- | --- |
| appointment | 9 | [Domain map](ER-Diagrams/01-appointment.md) |
| catalog | 19 | [Domain map](ER-Diagrams/02-catalog.md) |
| clinical | 17 | [Domain map](ER-Diagrams/03-clinical.md) |
| commerce | 17 | [Domain map](ER-Diagrams/04-commerce.md) |
| compliance | 8 | [Domain map](ER-Diagrams/05-compliance.md) |
| customer | 8 | [Domain map](ER-Diagrams/06-customer.md) |
| diagnostics | 13 | [Domain map](ER-Diagrams/07-diagnostics.md) |
| finance | 8 | [Domain map](ER-Diagrams/08-finance.md) |
| fulfillment | 10 | [Domain map](ER-Diagrams/09-fulfillment.md) |
| identity | 16 | [Domain map](ER-Diagrams/10-identity.md) |
| insurance | 8 | [Domain map](ER-Diagrams/11-insurance.md) |
| logistics | 15 | [Domain map](ER-Diagrams/12-logistics.md) |
| marketplace | 7 | [Domain map](ER-Diagrams/13-marketplace.md) |
| membership | 6 | [Domain map](ER-Diagrams/14-membership.md) |
| notification | 10 | [Domain map](ER-Diagrams/15-notification.md) |
| organization | 6 | [Domain map](ER-Diagrams/16-organization.md) |
| payment | 13 | [Domain map](ER-Diagrams/17-payment.md) |
| platform | 21 | [Domain map](ER-Diagrams/18-platform.md) |
| pricing | 8 | [Domain map](ER-Diagrams/19-pricing.md) |
| procurement | 13 | [Domain map](ER-Diagrams/20-procurement.md) |
| risk | 5 | [Domain map](ER-Diagrams/21-risk.md) |
| search | 5 | [Domain map](ER-Diagrams/22-search.md) |
| support | 8 | [Domain map](ER-Diagrams/23-support.md) |
| warehouse | 18 | [Domain map](ER-Diagrams/24-warehouse.md) |

## Planning and validation

- [Installation and security prerequisites](Installation.md)
- [All supporting objects, sequences, functions, grants and policies](Database-Objects.md)
- [Schema overview](Schema-Overview.md) · [relationships](Relationships.md) · [database rules](Database-Rules.md)
- [Master-data classification and initial records](Master-Data-Inventory.md)
- [Module mapping](Module-Mapping.md) · [ownership register](Ownership-and-Scope.json)
- [Documentation reconciliation](Reconciliation.md) · [parity](Models-and-Parity.md)
- [ER diagrams](ER-Diagrams/README.md) · [full FK catalog](ER-Diagrams/Relationship-Catalog.md)
- [Catalog](Schema-Catalog.json) · [table register](Table-Register.json) · [evidence](../09-References/Database-Evidence.json)

Historical source provenance remains discoverable at [Migrations.md](Migrations.md). SQL-only delivery excludes transactional data and seed records. The 44 identified master tables retain explicit confirmed/proposed/open datasets; a schema install grants no business approval.

## Unified identity extension

[Identity assessment](Identity-Authentication-Assessment.md) separates inherited schema from proposed D-028 additions. [Current isolated verification](../09-References/Unified-Authentication-Database-Validation.json) compares the unchanged baseline catalog and two independent installations of current SQL across all 23 dimensions. This structural verification is not approval or application implementation. Historical source-chain parity remains preserved separately.
