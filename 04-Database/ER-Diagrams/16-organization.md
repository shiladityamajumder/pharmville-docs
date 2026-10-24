# Organization ER diagrams

## What this part of the database stores

The `organization` schema stores operating companies, sites, and licenses. The names and structural relationships below come from the checked-out database catalog snapshot; business-purpose summaries marked inferred are not product-owner approval.

## Main tables

| Table | Recorded purpose | Table definition |
|---|---|---|
| [`bank_accounts`](../Tables/organization/bank_accounts.md) | Holds bank accounts records within the organization domain (operating companies, sites and licenses). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/organization/bank_accounts.md) |
| [`departments`](../Tables/organization/departments.md) | Holds departments records within the organization domain (operating companies, sites and licenses). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/organization/departments.md) |
| [`licenses`](../Tables/organization/licenses.md) | Holds licenses records within the organization domain (operating companies, sites and licenses). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/organization/licenses.md) |
| [`locations`](../Tables/organization/locations.md) | Holds locations records within the organization domain (operating companies, sites and licenses). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/organization/locations.md) |
| [`memberships`](../Tables/organization/memberships.md) | Holds memberships records within the organization domain (operating companies, sites and licenses). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/organization/memberships.md) |
| [`organizations`](../Tables/organization/organizations.md) | Holds organizations records within the organization domain (operating companies, sites and licenses). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/organization/organizations.md) |

## ER diagrams

These diagrams show declared PostgreSQL foreign keys from focused source tables. Entity fields include primary keys, unique keys, and FK columns; exact data types remain in the linked table contracts. `PK`, `FK`, and `UK` mark key roles. Relationship cardinality comes from FK nullability and unique constraints/indexes in the recorded catalog.

<a id="diagram-01"></a>

### Diagram 01 — memberships, departments, locations, organizations, licenses, bank_accounts

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/organization.md) for exact columns and actions.

```mermaid
erDiagram
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
        uuid updated_by FK
    }
    organization__bank_accounts {
        uuid created_by FK
        uuid deleted_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid organization_id FK
        bigint organization_id_internal_id FK
        uuid updated_by FK
    }
    organization__departments {
        varchar code UK
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid organization_id FK, UK
        bigint organization_id_internal_id FK
        uuid parent_id FK
        bigint parent_id_internal_id FK
        uuid updated_by FK
    }
    organization__licenses {
        uuid created_by FK
        uuid deleted_by FK
        uuid document_file_id FK
        bigint document_file_id_internal_id FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        varchar license_number UK
        varchar license_type UK
        uuid location_id FK
        bigint location_id_internal_id FK
        uuid organization_id FK
        bigint organization_id_internal_id FK
        uuid updated_by FK
    }
    organization__locations {
        varchar code UK
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid organization_id FK, UK
        bigint organization_id_internal_id FK
        uuid updated_by FK
    }
    organization__memberships {
        uuid created_by FK
        uuid department_id FK
        bigint department_id_internal_id FK
        uuid id UK
        bigint internal_id PK, UK
        uuid location_id FK
        bigint location_id_internal_id FK
        uuid manager_user_id FK
        uuid organization_id FK, UK
        bigint organization_id_internal_id FK
        uuid updated_by FK
        uuid user_id FK, UK
    }
    organization__organizations {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    platform__file_objects {
        varchar bucket UK
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        varchar object_key UK
        uuid updated_by FK
        uuid uploaded_by_user_id FK
    }
    identity__users o|--o{ organization__memberships : "FK-0964 FK-0969 FK-0972"
    organization__departments o|--o{ organization__memberships : "FK-0965 FK-0966"
    organization__locations o|--o{ organization__memberships : "FK-0967 FK-0968"
    organization__organizations ||--o{ organization__memberships : "FK-0970 FK-0971"
    identity__users ||--o{ organization__memberships : "FK-0973"
    identity__users o|--o{ organization__departments : "FK-0943 FK-0944 FK-0949"
    organization__organizations ||--o{ organization__departments : "FK-0945 FK-0946"
    organization__departments o|--o{ organization__departments : "FK-0947 FK-0948"
    identity__users o|--o{ organization__locations : "FK-0959 FK-0960 FK-0963"
    organization__organizations ||--o{ organization__locations : "FK-0961 FK-0962"
    identity__users o|--o{ organization__organizations : "FK-0974 FK-0975 FK-0976"
    identity__users o|--o{ organization__licenses : "FK-0950 FK-0951 FK-0958"
    platform__file_objects o|--o{ organization__licenses : "FK-0952 FK-0953"
    organization__locations o|--o{ organization__licenses : "FK-0954 FK-0955"
    organization__organizations ||--o{ organization__licenses : "FK-0956 FK-0957"
    identity__users o|--o{ organization__bank_accounts : "FK-0938 FK-0939 FK-0942"
    organization__organizations ||--o{ organization__bank_accounts : "FK-0940 FK-0941"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `organization__bank_accounts` | [`organization.bank_accounts`](../Tables/organization/bank_accounts.md) |
| `organization__departments` | [`organization.departments`](../Tables/organization/departments.md) |
| `organization__licenses` | [`organization.licenses`](../Tables/organization/licenses.md) |
| `organization__locations` | [`organization.locations`](../Tables/organization/locations.md) |
| `organization__memberships` | [`organization.memberships`](../Tables/organization/memberships.md) |
| `organization__organizations` | [`organization.organizations`](../Tables/organization/organizations.md) |
| `platform__file_objects` | [`platform.file_objects`](../Tables/platform/file_objects.md) |

Coverage: 6 focus tables, 8 entities, 39 FK constraints (39 unique IDs).

## How the tables connect

- **organization.bank_accounts → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **organization.bank_accounts → identity.users:** `deleted_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **organization.bank_accounts → organization.organizations:** `organization_id_internal_id` references `internal_id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE CASCADE`. This keeps the child record tied to an existing parent key.
- **organization.bank_accounts → organization.organizations:** `organization_id` references `id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE CASCADE`. This keeps the child record tied to an existing parent key.
- **organization.bank_accounts → identity.users:** `updated_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **organization.departments → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.

Paired public UUID and internal BIGINT foreign keys are real separate constraints. Diagrams use relationship IDs to keep those links readable; each underlying constraint is listed separately in the catalog. The application must keep paired identifiers consistent under the database's numeric-key guards. A relationship does not itself grant read or write permission.

## Important database rules

- The database primary key strategy uses an internal numeric key for most domain rows while retaining public UUID aliases; `identity.users` retains a UUID primary key. The table diagram labels expose the exact keys for each entity.
- A nullable FK permits a child row without that association; it does not make the referenced parent optional when a value is present.
- Composite FKs remain composite in the relationship catalog. Their scope columns must not be dropped when reading the diagram.
- A many-to-many association uses its actual junction table where one exists; no direct association is inferred.
- Authorization, tenant/site scoping, and service write ownership are separate contracts. See the linked database rules and module designs.

## What happens during normal operations

See [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md), [WF-006](../../06-Workflows/WF-006-Licensed-Site-Allocation.md) for the reviewed workflows that touch this schema. The workflows describe business sequencing; these ERDs describe enforced database references.

## Related documents

[Schema overview](../Schema-Overview.md) · [Database rules](../Database-Rules.md) · [Model and parity notes](../Models-and-Parity.md) · [Migration evidence](../Migrations.md) · [Full relationship catalog](Relationship-Catalog.md) · [Non-FK reference review](Logical-References.md) · [Table index](../Tables/organization/README.md) · [Admin_CMS HLD](../../03-Modules/Admin/HLD.md) · [Admin_CMS LLD](../../03-Modules/Admin/LLD.md) · [Authentication_Access HLD](../../03-Modules/Authentication/HLD.md) · [Authentication_Access LLD](../../03-Modules/Authentication/LLD.md) · [Delivery_Operations HLD](../../03-Modules/Delivery/HLD.md) · [Delivery_Operations LLD](../../03-Modules/Delivery/LLD.md) · [Order_Operations HLD](../../03-Modules/Order-Management/HLD.md) · [Order_Operations LLD](../../03-Modules/Order-Management/LLD.md) · [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) · [WF-006](../../06-Workflows/WF-006-Licensed-Site-Allocation.md)
