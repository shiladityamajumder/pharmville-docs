# Search ER diagrams

## What this part of the database stores

The `search` schema stores search indexes and query signals. The names and structural relationships below come from the checked-out database catalog snapshot; business-purpose summaries marked inferred are not product-owner approval.

## Main tables

| Table | Recorded purpose | Table definition |
|---|---|---|
| [`documents`](../Tables/search/documents.md) | Holds documents records within the search domain (search indexing and query signals). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/search/documents.md) |
| [`indexing_jobs`](../Tables/search/indexing_jobs.md) | Holds indexing jobs records within the search domain (search indexing and query signals). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/search/indexing_jobs.md) |
| [`query_events`](../Tables/search/query_events.md) | Holds query events records within the search domain (search indexing and query signals). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/search/query_events.md) |
| [`redirects`](../Tables/search/redirects.md) | Holds redirects records within the search domain (search indexing and query signals). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/search/redirects.md) |
| [`synonyms`](../Tables/search/synonyms.md) | Holds synonyms records within the search domain (search indexing and query signals). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/search/synonyms.md) |

## ER diagrams

These diagrams show declared PostgreSQL foreign keys from focused source tables. Entity fields include primary keys, unique keys, and FK columns; exact data types remain in the linked table contracts. `PK`, `FK`, and `UK` mark key roles. Relationship cardinality comes from FK nullability and unique constraints/indexes in the recorded catalog.

<a id="diagram-01"></a>

### Diagram 01 — redirects, synonyms, documents, indexing_jobs, query_events

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/search.md) for exact columns and actions.

```mermaid
erDiagram
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
        uuid updated_by FK
    }
    search__documents {
        uuid created_by FK
        uuid entity_id UK
        varchar entity_type UK
        uuid id UK
        bigint internal_id PK, UK
        varchar locale UK
        uuid updated_by FK
    }
    search__indexing_jobs {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid updated_by FK
    }
    search__query_events {
        uuid id UK
        bigint internal_id PK, UK
        uuid user_id FK
    }
    search__redirects {
        uuid created_by FK
        uuid deleted_by FK
        uuid id UK
        bigint internal_id PK, UK
        varchar locale UK
        varchar query_normalized UK
        uuid updated_by FK
    }
    search__synonyms {
        uuid created_by FK
        uuid deleted_by FK
        uuid id UK
        bigint internal_id PK, UK
        varchar locale UK
        varchar synonym UK
        varchar term UK
        uuid updated_by FK
    }
    identity__users o|--o{ search__redirects : "FK-1268 FK-1269 FK-1270"
    identity__users o|--o{ search__synonyms : "FK-1271 FK-1272 FK-1273"
    identity__users o|--o{ search__documents : "FK-1263 FK-1264"
    identity__users o|--o{ search__indexing_jobs : "FK-1265 FK-1266"
    identity__users o|--o{ search__query_events : "FK-1267"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `search__documents` | [`search.documents`](../Tables/search/documents.md) |
| `search__indexing_jobs` | [`search.indexing_jobs`](../Tables/search/indexing_jobs.md) |
| `search__query_events` | [`search.query_events`](../Tables/search/query_events.md) |
| `search__redirects` | [`search.redirects`](../Tables/search/redirects.md) |
| `search__synonyms` | [`search.synonyms`](../Tables/search/synonyms.md) |

Coverage: 5 focus tables, 6 entities, 11 FK constraints (11 unique IDs).

## How the tables connect

- **search.documents → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **search.documents → identity.users:** `updated_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **search.indexing_jobs → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **search.indexing_jobs → identity.users:** `updated_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **search.query_events → identity.users:** `user_id` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **search.redirects → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.

Paired public UUID and internal BIGINT foreign keys are real separate constraints. Diagrams use relationship IDs to keep those links readable; each underlying constraint is listed separately in the catalog. The application must keep paired identifiers consistent under the database's numeric-key guards. A relationship does not itself grant read or write permission.

## Important database rules

- The database primary key strategy uses an internal numeric key for most domain rows while retaining public UUID aliases; `identity.users` retains a UUID primary key. The table diagram labels expose the exact keys for each entity.
- A nullable FK permits a child row without that association; it does not make the referenced parent optional when a value is present.
- Composite FKs remain composite in the relationship catalog. Their scope columns must not be dropped when reading the diagram.
- A many-to-many association uses its actual junction table where one exists; no direct association is inferred.
- Authorization, tenant/site scoping, and service write ownership are separate contracts. See the linked database rules and module designs.

## What happens during normal operations

See [WF-002](../../06-Workflows/WF-002-Search-and-Availability.md) for the reviewed workflows that touch this schema. The workflows describe business sequencing; these ERDs describe enforced database references.

## Related documents

[Schema overview](../Schema-Overview.md) · [Database rules](../Database-Rules.md) · [Model and parity notes](../Models-and-Parity.md) · [Migration evidence](../Migrations.md) · [Full relationship catalog](Relationship-Catalog.md) · [Non-FK reference review](Logical-References.md) · [Table index](../Tables/search/README.md) · [Product_Catalog HLD](../../03-Modules/Product_Catalog/HLD.md) · [Product_Catalog LLD](../../03-Modules/Product_Catalog/LLD.md) · [WF-002](../../06-Workflows/WF-002-Search-and-Availability.md)
