# Effective schema overview

<!-- ERD-INDEX-LINK -->
See the [ER diagram index](ER-Diagrams/README.md) for domain views and the complete foreign-key catalog.


The [canonical SQL](../pharmville-database/pharmville_schema.sql) and [derived catalog](Schema-Catalog.json) describe the same validated effective structure. Counts are reconciliation results, not targets used to invent objects.

| Schema | Tables | Purpose and relationships |
| --- | --- | --- |
| appointment | 9 | [ER reference](ER-Diagrams/01-appointment.md) |
| catalog | 19 | [ER reference](ER-Diagrams/02-catalog.md) |
| clinical | 17 | [ER reference](ER-Diagrams/03-clinical.md) |
| commerce | 17 | [ER reference](ER-Diagrams/04-commerce.md) |
| compliance | 8 | [ER reference](ER-Diagrams/05-compliance.md) |
| customer | 8 | [ER reference](ER-Diagrams/06-customer.md) |
| diagnostics | 13 | [ER reference](ER-Diagrams/07-diagnostics.md) |
| finance | 8 | [ER reference](ER-Diagrams/08-finance.md) |
| fulfillment | 10 | [ER reference](ER-Diagrams/09-fulfillment.md) |
| identity | 14 | [ER reference](ER-Diagrams/10-identity.md) |
| insurance | 8 | [ER reference](ER-Diagrams/11-insurance.md) |
| logistics | 15 | [ER reference](ER-Diagrams/12-logistics.md) |
| marketplace | 7 | [ER reference](ER-Diagrams/13-marketplace.md) |
| membership | 6 | [ER reference](ER-Diagrams/14-membership.md) |
| notification | 10 | [ER reference](ER-Diagrams/15-notification.md) |
| organization | 6 | [ER reference](ER-Diagrams/16-organization.md) |
| payment | 13 | [ER reference](ER-Diagrams/17-payment.md) |
| platform | 21 | [ER reference](ER-Diagrams/18-platform.md) |
| pricing | 8 | [ER reference](ER-Diagrams/19-pricing.md) |
| procurement | 13 | [ER reference](ER-Diagrams/20-procurement.md) |
| risk | 5 | [ER reference](ER-Diagrams/21-risk.md) |
| search | 5 | [ER reference](ER-Diagrams/22-search.md) |
| support | 8 | [ER reference](ER-Diagrams/23-support.md) |
| warehouse | 18 | [ER reference](ER-Diagrams/24-warehouse.md) |

## Identity and consistency

Public UUIDs remain external identifiers; V0022 internal numeric keys and their compatibility crosswalks are retained. Foreign-key pairs are distinct physical constraints, not duplicated diagram mistakes. Types, defaults, nullable fields, optimistic row versions, append-only guards, workflow functions, RLS and runtime capabilities retain their effective definitions. No speculative future field was added to SQL. See [rules](Database-Rules.md), [all objects](Database-Objects.md) and [reconciliation](Reconciliation.md).
