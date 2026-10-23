# Risk ER diagrams

## What this part of the database stores

The `risk` schema stores risk rules, cases, and signals. The names and structural relationships below come from the checked-out database catalog snapshot; business-purpose summaries marked inferred are not product-owner approval.

## Main tables

| Table | Recorded purpose | Table definition |
|---|---|---|
| [`assessments`](../Tables/risk/assessments.md) | Holds assessments records within the risk domain (risk rules, cases and signals). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/risk/assessments.md) |
| [`blocklists`](../Tables/risk/blocklists.md) | Holds blocklists records within the risk domain (risk rules, cases and signals). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/risk/blocklists.md) |
| [`cases`](../Tables/risk/cases.md) | Holds cases records within the risk domain (risk rules, cases and signals). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/risk/cases.md) |
| [`rules`](../Tables/risk/rules.md) | Holds rules records within the risk domain (risk rules, cases and signals). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/risk/rules.md) |
| [`signals`](../Tables/risk/signals.md) | Holds signals records within the risk domain (risk rules, cases and signals). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/risk/signals.md) |

## ER diagrams

These diagrams show declared PostgreSQL foreign keys from focused source tables. Entity fields include primary keys, unique keys, and FK columns; exact data types remain in the linked table contracts. `PK`, `FK`, and `UK` mark key roles. Relationship cardinality comes from FK nullability and unique constraints/indexes in the recorded catalog.

<a id="diagram-01"></a>

### Diagram 01 — blocklists, cases, assessments, rules, signals

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/risk.md) for exact columns and actions.

```mermaid
erDiagram
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
        uuid updated_by FK
    }
    risk__assessments {
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid user_id FK
    }
    risk__blocklists {
        uuid created_by FK
        uuid deleted_by FK
        varchar entity_hash UK
        varchar entity_type UK
        uuid id UK
        bigint internal_id PK, UK
        varchar reason_code UK
        uuid source_case_id FK
        bigint source_case_id_internal_id FK
        uuid updated_by FK
    }
    risk__cases {
        uuid assessment_id FK
        bigint assessment_id_internal_id FK
        uuid assigned_to_user_id FK
        varchar case_number UK
        uuid created_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    risk__rules {
        uuid created_by FK
        uuid deleted_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid updated_by FK
    }
    risk__signals {
        uuid assessment_id FK
        bigint assessment_id_internal_id FK
        uuid id UK
        bigint internal_id PK, UK
    }
    identity__users o|--o{ risk__blocklists : "FK-1248 FK-1249 FK-1252"
    risk__cases o|--o{ risk__blocklists : "FK-1250 FK-1251"
    identity__users o|--o{ risk__cases : "FK-1256 FK-1257 FK-1255"
    risk__assessments o|--o{ risk__cases : "FK-1253 FK-1254"
    identity__users o|--o{ risk__assessments : "FK-1247"
    identity__users o|--o{ risk__rules : "FK-1258 FK-1259 FK-1260"
    risk__assessments o|--o{ risk__signals : "FK-1261 FK-1262"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `risk__assessments` | [`risk.assessments`](../Tables/risk/assessments.md) |
| `risk__blocklists` | [`risk.blocklists`](../Tables/risk/blocklists.md) |
| `risk__cases` | [`risk.cases`](../Tables/risk/cases.md) |
| `risk__rules` | [`risk.rules`](../Tables/risk/rules.md) |
| `risk__signals` | [`risk.signals`](../Tables/risk/signals.md) |

Coverage: 5 focus tables, 6 entities, 16 FK constraints (16 unique IDs).

## How the tables connect

- **risk.assessments → identity.users:** `user_id` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE SET NULL`. This keeps the child record tied to an existing parent key.
- **risk.blocklists → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **risk.blocklists → identity.users:** `deleted_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **risk.blocklists → risk.cases:** `source_case_id` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE SET NULL`. This keeps the child record tied to an existing parent key.
- **risk.blocklists → risk.cases:** `source_case_id_internal_id` references `internal_id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE SET NULL`. This keeps the child record tied to an existing parent key.
- **risk.blocklists → identity.users:** `updated_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.

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

[Schema overview](../Schema-Overview.md) · [Database rules](../Database-Rules.md) · [Model and parity notes](../Models-and-Parity.md) · [Migration evidence](../Migrations.md) · [Full relationship catalog](Relationship-Catalog.md) · [Non-FK reference review](Logical-References.md) · [Table index](../Tables/risk/README.md) · [Audit HLD](../../03-Modules/Audit/HLD.md) · [Audit LLD](../../03-Modules/Audit/LLD.md)
