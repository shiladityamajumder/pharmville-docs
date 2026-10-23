# Membership ER diagrams

## What this part of the database stores

The `membership` schema stores benefits and loyalty. The names and structural relationships below come from the checked-out database catalog snapshot; business-purpose summaries marked inferred are not product-owner approval.

## Main tables

| Table | Recorded purpose | Table definition |
|---|---|---|
| [`benefit_usage`](../Tables/membership/benefit_usage.md) | Holds benefit usage records within the membership domain (benefits and loyalty). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/membership/benefit_usage.md) |
| [`loyalty_accounts`](../Tables/membership/loyalty_accounts.md) | Holds loyalty accounts records within the membership domain (benefits and loyalty). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/membership/loyalty_accounts.md) |
| [`loyalty_ledger`](../Tables/membership/loyalty_ledger.md) | Holds loyalty ledger records within the membership domain (benefits and loyalty). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/membership/loyalty_ledger.md) |
| [`plan_benefits`](../Tables/membership/plan_benefits.md) | Holds plan benefits records within the membership domain (benefits and loyalty). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/membership/plan_benefits.md) |
| [`plans`](../Tables/membership/plans.md) | Holds plans records within the membership domain (benefits and loyalty). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/membership/plans.md) |
| [`subscriptions`](../Tables/membership/subscriptions.md) | Holds subscriptions records within the membership domain (benefits and loyalty). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/membership/subscriptions.md) |

## ER diagrams

These diagrams show declared PostgreSQL foreign keys from focused source tables. Entity fields include primary keys, unique keys, and FK columns; exact data types remain in the linked table contracts. `PK`, `FK`, and `UK` mark key roles. Relationship cardinality comes from FK nullability and unique constraints/indexes in the recorded catalog.

<a id="diagram-01"></a>

### Diagram 01 — subscriptions, plans, plan_benefits, benefit_usage, loyalty_accounts, loyalty_ledger

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/membership.md) for exact columns and actions.

```mermaid
erDiagram
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
        uuid updated_by FK
    }
    membership__benefit_usage {
        uuid benefit_id FK
        bigint benefit_id_internal_id FK
        uuid id UK
        bigint internal_id PK, UK
        uuid subscription_id FK
        bigint subscription_id_internal_id FK
    }
    membership__loyalty_accounts {
        uuid created_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
        uuid user_id FK, UK
    }
    membership__loyalty_ledger {
        uuid id UK
        varchar idempotency_key UK
        bigint internal_id PK, UK
        uuid loyalty_account_id FK
        bigint loyalty_account_id_internal_id FK
    }
    membership__plan_benefits {
        varchar benefit_code UK
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid plan_id FK, UK
        bigint plan_id_internal_id FK
        uuid updated_by FK
    }
    membership__plans {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    membership__subscriptions {
        uuid created_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid payment_method_id FK
        bigint payment_method_id_internal_id FK
        uuid plan_id FK
        bigint plan_id_internal_id FK
        varchar subscription_number UK
        uuid updated_by FK
        uuid user_id FK
    }
    payment__customer_payment_methods {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        varchar provider UK
        varchar provider_token UK
        uuid updated_by FK
        uuid user_id FK, UK
    }
    identity__users ||--o{ membership__subscriptions : "FK-0897"
    identity__users o|--o{ membership__subscriptions : "FK-0891 FK-0896"
    payment__customer_payment_methods o|--o{ membership__subscriptions : "FK-0892 FK-0893"
    membership__plans ||--o{ membership__subscriptions : "FK-0894 FK-0895"
    identity__users o|--o{ membership__plans : "FK-0888 FK-0889 FK-0890"
    identity__users o|--o{ membership__plan_benefits : "FK-0883 FK-0884 FK-0887"
    membership__plans ||--o{ membership__plan_benefits : "FK-0885 FK-0886"
    membership__plan_benefits ||--o{ membership__benefit_usage : "FK-0874 FK-0875"
    membership__subscriptions ||--o{ membership__benefit_usage : "FK-0877 FK-0876"
    identity__users ||--o| membership__loyalty_accounts : "FK-0880"
    identity__users o|--o{ membership__loyalty_accounts : "FK-0878 FK-0879"
    membership__loyalty_accounts ||--o{ membership__loyalty_ledger : "FK-0882 FK-0881"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `membership__benefit_usage` | [`membership.benefit_usage`](../Tables/membership/benefit_usage.md) |
| `membership__loyalty_accounts` | [`membership.loyalty_accounts`](../Tables/membership/loyalty_accounts.md) |
| `membership__loyalty_ledger` | [`membership.loyalty_ledger`](../Tables/membership/loyalty_ledger.md) |
| `membership__plan_benefits` | [`membership.plan_benefits`](../Tables/membership/plan_benefits.md) |
| `membership__plans` | [`membership.plans`](../Tables/membership/plans.md) |
| `membership__subscriptions` | [`membership.subscriptions`](../Tables/membership/subscriptions.md) |
| `payment__customer_payment_methods` | [`payment.customer_payment_methods`](../Tables/payment/customer_payment_methods.md) |

Coverage: 6 focus tables, 8 entities, 24 FK constraints (24 unique IDs).

## How the tables connect

- **membership.benefit_usage → membership.plan_benefits:** `benefit_id` references `id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **membership.benefit_usage → membership.plan_benefits:** `benefit_id_internal_id` references `internal_id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **membership.benefit_usage → membership.subscriptions:** `subscription_id_internal_id` references `internal_id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **membership.benefit_usage → membership.subscriptions:** `subscription_id` references `id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **membership.loyalty_accounts → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **membership.loyalty_accounts → identity.users:** `updated_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.

Paired public UUID and internal BIGINT foreign keys are real separate constraints. Diagrams use relationship IDs to keep those links readable; each underlying constraint is listed separately in the catalog. The application must keep paired identifiers consistent under the database's numeric-key guards. A relationship does not itself grant read or write permission.

## Important database rules

- The database primary key strategy uses an internal numeric key for most domain rows while retaining public UUID aliases; `identity.users` retains a UUID primary key. The table diagram labels expose the exact keys for each entity.
- A nullable FK permits a child row without that association; it does not make the referenced parent optional when a value is present.
- Composite FKs remain composite in the relationship catalog. Their scope columns must not be dropped when reading the diagram.
- A many-to-many association uses its actual junction table where one exists; no direct association is inferred.
- Authorization, tenant/site scoping, and service write ownership are separate contracts. See the linked database rules and module designs.

## What happens during normal operations

No dedicated workflow from the 14 documented workflows is mapped to this schema. It is still represented because it exists in the checked-out database catalog.

## Related documents

[Schema overview](../Schema-Overview.md) · [Database rules](../Database-Rules.md) · [Model and parity notes](../Models-and-Parity.md) · [Migration evidence](../Migrations.md) · [Full relationship catalog](Relationship-Catalog.md) · [Non-FK reference review](Logical-References.md) · [Table index](../Tables/membership/README.md)
