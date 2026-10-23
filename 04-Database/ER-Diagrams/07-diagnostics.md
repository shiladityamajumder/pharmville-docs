# Diagnostics ER diagrams

## What this part of the database stores

The `diagnostics` schema stores tests and laboratory services. The names and structural relationships below come from the checked-out database catalog snapshot; business-purpose summaries marked inferred are not product-owner approval.

## Main tables

| Table | Recorded purpose | Table definition |
|---|---|---|
| [`diagnostic_order_items`](../Tables/diagnostics/diagnostic_order_items.md) | Holds diagnostic order items records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/diagnostics/diagnostic_order_items.md) |
| [`diagnostic_orders`](../Tables/diagnostics/diagnostic_orders.md) | Holds diagnostic orders records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/diagnostics/diagnostic_orders.md) |
| [`diagnostic_reports`](../Tables/diagnostics/diagnostic_reports.md) | Holds diagnostic reports records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/diagnostics/diagnostic_reports.md) |
| [`diagnostic_result_values`](../Tables/diagnostics/diagnostic_result_values.md) | Holds diagnostic result values records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/diagnostics/diagnostic_result_values.md) |
| [`lab_locations`](../Tables/diagnostics/lab_locations.md) | Holds lab locations records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/diagnostics/lab_locations.md) |
| [`lab_offerings`](../Tables/diagnostics/lab_offerings.md) | Holds lab offerings records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/diagnostics/lab_offerings.md) |
| [`lab_providers`](../Tables/diagnostics/lab_providers.md) | Holds lab providers records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/diagnostics/lab_providers.md) |
| [`sample_collections`](../Tables/diagnostics/sample_collections.md) | Holds sample collections records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/diagnostics/sample_collections.md) |
| [`sample_events`](../Tables/diagnostics/sample_events.md) | Holds sample events records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/diagnostics/sample_events.md) |
| [`samples`](../Tables/diagnostics/samples.md) | Holds samples records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/diagnostics/samples.md) |
| [`test_definitions`](../Tables/diagnostics/test_definitions.md) | Holds test definitions records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/diagnostics/test_definitions.md) |
| [`test_package_items`](../Tables/diagnostics/test_package_items.md) | Holds test package items records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/diagnostics/test_package_items.md) |
| [`test_packages`](../Tables/diagnostics/test_packages.md) | Holds test packages records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/diagnostics/test_packages.md) |

## ER diagrams

These diagrams show declared PostgreSQL foreign keys from focused source tables. Entity fields include primary keys, unique keys, and FK columns; exact data types remain in the linked table contracts. `PK`, `FK`, and `UK` mark key roles. Relationship cardinality comes from FK nullability and unique constraints/indexes in the recorded catalog.

<a id="diagram-01"></a>

### Diagram 01 — diagnostic_order_items, lab_offerings, test_package_items, test_definitions, test_packages, diagnostic_orders, sample_collections, samples

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/diagnostics.md) for exact columns and actions.

```mermaid
erDiagram
    clinical__patient_profiles {
        uuid created_by FK
        uuid deleted_by FK
        uuid family_member_id FK
        bigint family_member_id_internal_id FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
        uuid user_id FK
    }
    customer__addresses {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
        uuid user_id FK, UK
    }
    diagnostics__diagnostic_order_items {
        uuid created_by FK
        uuid diagnostic_order_id FK
        bigint diagnostic_order_id_internal_id FK
        uuid id UK
        bigint internal_id PK, UK
        uuid offering_id FK
        bigint offering_id_internal_id FK
        uuid test_definition_id FK
        bigint test_definition_id_internal_id FK
        uuid test_package_id FK
        bigint test_package_id_internal_id FK
        uuid updated_by FK
    }
    diagnostics__diagnostic_orders {
        uuid address_id FK
        bigint address_id_internal_id FK
        uuid created_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid lab_location_id FK
        bigint lab_location_id_internal_id FK
        varchar order_number UK
        uuid patient_profile_id FK
        bigint patient_profile_id_internal_id FK
        uuid updated_by FK
        uuid user_id FK
    }
    diagnostics__lab_locations {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid lab_provider_id FK, UK
        bigint lab_provider_id_internal_id FK
        uuid location_id FK, UK
        bigint location_id_internal_id FK
        uuid updated_by FK
    }
    diagnostics__lab_offerings {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid lab_location_id FK, UK
        bigint lab_location_id_internal_id FK
        uuid test_definition_id FK, UK
        bigint test_definition_id_internal_id FK
        uuid test_package_id FK, UK
        bigint test_package_id_internal_id FK
        uuid updated_by FK
    }
    diagnostics__sample_collections {
        uuid collector_user_id FK
        uuid created_by FK
        uuid diagnostic_order_id FK
        bigint diagnostic_order_id_internal_id FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    diagnostics__samples {
        varchar barcode UK
        uuid collection_id FK
        bigint collection_id_internal_id FK
        uuid created_by FK
        uuid diagnostic_order_id FK
        bigint diagnostic_order_id_internal_id FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    diagnostics__test_definitions {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    diagnostics__test_package_items {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid package_id FK, UK
        bigint package_id_internal_id FK
        uuid test_definition_id FK, UK
        bigint test_definition_id_internal_id FK
        uuid updated_by FK
    }
    diagnostics__test_packages {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
        uuid updated_by FK
    }
    identity__users o|--o{ diagnostics__diagnostic_order_items : "FK-0464 FK-0473"
    diagnostics__test_definitions o|--o{ diagnostics__diagnostic_order_items : "FK-0469 FK-0470"
    diagnostics__test_packages o|--o{ diagnostics__diagnostic_order_items : "FK-0472 FK-0471"
    diagnostics__lab_offerings o|--o{ diagnostics__diagnostic_order_items : "FK-0468 FK-0467"
    diagnostics__diagnostic_orders ||--o{ diagnostics__diagnostic_order_items : "FK-0465 FK-0466"
    identity__users o|--o{ diagnostics__lab_offerings : "FK-0503 FK-0504 FK-0511"
    diagnostics__lab_locations ||--o{ diagnostics__lab_offerings : "FK-0506 FK-0505"
    diagnostics__test_packages o|--o{ diagnostics__lab_offerings : "FK-0510 FK-0509"
    diagnostics__test_definitions o|--o{ diagnostics__lab_offerings : "FK-0507 FK-0508"
    identity__users o|--o{ diagnostics__test_package_items : "FK-0534 FK-0539"
    diagnostics__test_packages ||--o{ diagnostics__test_package_items : "FK-0536 FK-0535"
    diagnostics__test_definitions ||--o{ diagnostics__test_package_items : "FK-0537 FK-0538"
    identity__users o|--o{ diagnostics__test_definitions : "FK-0531 FK-0532 FK-0533"
    identity__users o|--o{ diagnostics__test_packages : "FK-0540 FK-0541 FK-0542"
    identity__users ||--o{ diagnostics__diagnostic_orders : "FK-0482"
    identity__users o|--o{ diagnostics__diagnostic_orders : "FK-0476 FK-0481"
    diagnostics__lab_locations ||--o{ diagnostics__diagnostic_orders : "FK-0478 FK-0477"
    customer__addresses o|--o{ diagnostics__diagnostic_orders : "FK-0474 FK-0475"
    clinical__patient_profiles ||--o{ diagnostics__diagnostic_orders : "FK-0480 FK-0479"
    identity__users o|--o{ diagnostics__sample_collections : "FK-0517 FK-0518 FK-0521"
    diagnostics__diagnostic_orders ||--o{ diagnostics__sample_collections : "FK-0519 FK-0520"
    identity__users o|--o{ diagnostics__samples : "FK-0527 FK-0530"
    diagnostics__sample_collections o|--o{ diagnostics__samples : "FK-0525 FK-0526"
    diagnostics__diagnostic_orders ||--o{ diagnostics__samples : "FK-0529 FK-0528"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `clinical__patient_profiles` | [`clinical.patient_profiles`](../Tables/clinical/patient_profiles.md) |
| `customer__addresses` | [`customer.addresses`](../Tables/customer/addresses.md) |
| `diagnostics__diagnostic_order_items` | [`diagnostics.diagnostic_order_items`](../Tables/diagnostics/diagnostic_order_items.md) |
| `diagnostics__diagnostic_orders` | [`diagnostics.diagnostic_orders`](../Tables/diagnostics/diagnostic_orders.md) |
| `diagnostics__lab_locations` | [`diagnostics.lab_locations`](../Tables/diagnostics/lab_locations.md) |
| `diagnostics__lab_offerings` | [`diagnostics.lab_offerings`](../Tables/diagnostics/lab_offerings.md) |
| `diagnostics__sample_collections` | [`diagnostics.sample_collections`](../Tables/diagnostics/sample_collections.md) |
| `diagnostics__samples` | [`diagnostics.samples`](../Tables/diagnostics/samples.md) |
| `diagnostics__test_definitions` | [`diagnostics.test_definitions`](../Tables/diagnostics/test_definitions.md) |
| `diagnostics__test_package_items` | [`diagnostics.test_package_items`](../Tables/diagnostics/test_package_items.md) |
| `diagnostics__test_packages` | [`diagnostics.test_packages`](../Tables/diagnostics/test_packages.md) |
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |

Coverage: 8 focus tables, 12 entities, 51 FK constraints (51 unique IDs).

<a id="diagram-02"></a>

### Diagram 02 — diagnostic_reports, diagnostic_result_values, lab_providers, lab_locations, sample_events

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/diagnostics.md) for exact columns and actions.

```mermaid
erDiagram
    diagnostics__diagnostic_orders {
        uuid address_id FK
        bigint address_id_internal_id FK
        uuid created_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid lab_location_id FK
        bigint lab_location_id_internal_id FK
        varchar order_number UK
        uuid patient_profile_id FK
        bigint patient_profile_id_internal_id FK
        uuid updated_by FK
        uuid user_id FK
    }
    diagnostics__diagnostic_reports {
        uuid created_by FK
        uuid diagnostic_order_id FK, UK
        bigint diagnostic_order_id_internal_id FK
        uuid file_object_id FK
        bigint file_object_id_internal_id FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
        uuid verified_by_user_id FK
        integer version_no UK
    }
    diagnostics__diagnostic_result_values {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid report_id FK
        bigint report_id_internal_id FK
        uuid test_definition_id FK
        bigint test_definition_id_internal_id FK
        uuid updated_by FK
    }
    diagnostics__lab_locations {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid lab_provider_id FK, UK
        bigint lab_provider_id_internal_id FK
        uuid location_id FK, UK
        bigint location_id_internal_id FK
        uuid updated_by FK
    }
    diagnostics__lab_providers {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid organization_id FK
        bigint organization_id_internal_id FK
        uuid updated_by FK
    }
    diagnostics__sample_events {
        uuid actor_user_id FK
        uuid id UK
        bigint internal_id PK, UK
        uuid sample_id FK
        bigint sample_id_internal_id FK
    }
    diagnostics__samples {
        varchar barcode UK
        uuid collection_id FK
        bigint collection_id_internal_id FK
        uuid created_by FK
        uuid diagnostic_order_id FK
        bigint diagnostic_order_id_internal_id FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    diagnostics__test_definitions {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
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
    identity__users o|--o{ diagnostics__diagnostic_reports : "FK-0489 FK-0483 FK-0488"
    diagnostics__diagnostic_orders ||--o{ diagnostics__diagnostic_reports : "FK-0484 FK-0485"
    platform__file_objects o|--o{ diagnostics__diagnostic_reports : "FK-0487 FK-0486"
    identity__users o|--o{ diagnostics__diagnostic_result_values : "FK-0490 FK-0495"
    diagnostics__diagnostic_reports ||--o{ diagnostics__diagnostic_result_values : "FK-0491 FK-0492"
    diagnostics__test_definitions o|--o{ diagnostics__diagnostic_result_values : "FK-0494 FK-0493"
    identity__users o|--o{ diagnostics__lab_providers : "FK-0512 FK-0513 FK-0516"
    organization__organizations ||--o{ diagnostics__lab_providers : "FK-0515 FK-0514"
    identity__users o|--o{ diagnostics__lab_locations : "FK-0496 FK-0497 FK-0502"
    organization__locations ||--o{ diagnostics__lab_locations : "FK-0500 FK-0501"
    diagnostics__lab_providers ||--o{ diagnostics__lab_locations : "FK-0499 FK-0498"
    identity__users o|--o{ diagnostics__sample_events : "FK-0522"
    diagnostics__samples ||--o{ diagnostics__sample_events : "FK-0523 FK-0524"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `diagnostics__diagnostic_orders` | [`diagnostics.diagnostic_orders`](../Tables/diagnostics/diagnostic_orders.md) |
| `diagnostics__diagnostic_reports` | [`diagnostics.diagnostic_reports`](../Tables/diagnostics/diagnostic_reports.md) |
| `diagnostics__diagnostic_result_values` | [`diagnostics.diagnostic_result_values`](../Tables/diagnostics/diagnostic_result_values.md) |
| `diagnostics__lab_locations` | [`diagnostics.lab_locations`](../Tables/diagnostics/lab_locations.md) |
| `diagnostics__lab_providers` | [`diagnostics.lab_providers`](../Tables/diagnostics/lab_providers.md) |
| `diagnostics__sample_events` | [`diagnostics.sample_events`](../Tables/diagnostics/sample_events.md) |
| `diagnostics__samples` | [`diagnostics.samples`](../Tables/diagnostics/samples.md) |
| `diagnostics__test_definitions` | [`diagnostics.test_definitions`](../Tables/diagnostics/test_definitions.md) |
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `organization__locations` | [`organization.locations`](../Tables/organization/locations.md) |
| `organization__organizations` | [`organization.organizations`](../Tables/organization/organizations.md) |
| `platform__file_objects` | [`platform.file_objects`](../Tables/platform/file_objects.md) |

Coverage: 5 focus tables, 12 entities, 28 FK constraints (28 unique IDs).

## How the tables connect

- **diagnostics.diagnostic_order_items → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **diagnostics.diagnostic_order_items → diagnostics.diagnostic_orders:** `diagnostic_order_id` references `id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE CASCADE`. This keeps the child record tied to an existing parent key.
- **diagnostics.diagnostic_order_items → diagnostics.diagnostic_orders:** `diagnostic_order_id_internal_id` references `internal_id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE CASCADE`. This keeps the child record tied to an existing parent key.
- **diagnostics.diagnostic_order_items → diagnostics.lab_offerings:** `offering_id_internal_id` references `internal_id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE SET NULL`. This keeps the child record tied to an existing parent key.
- **diagnostics.diagnostic_order_items → diagnostics.lab_offerings:** `offering_id` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE SET NULL`. This keeps the child record tied to an existing parent key.
- **diagnostics.diagnostic_order_items → diagnostics.test_definitions:** `test_definition_id` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.

Paired public UUID and internal BIGINT foreign keys are real separate constraints. Diagrams use relationship IDs to keep those links readable; each underlying constraint is listed separately in the catalog. The application must keep paired identifiers consistent under the database's numeric-key guards. A relationship does not itself grant read or write permission.

## Important database rules

- The database primary key strategy uses an internal numeric key for most domain rows while retaining public UUID aliases; `identity.users` retains a UUID primary key. The table diagram labels expose the exact keys for each entity.
- A nullable FK permits a child row without that association; it does not make the referenced parent optional when a value is present.
- Composite FKs remain composite in the relationship catalog. Their scope columns must not be dropped when reading the diagram.
- A many-to-many association uses its actual junction table where one exists; no direct association is inferred.
- Authorization, tenant/site scoping, and service write ownership are separate contracts. See the linked database rules and module designs.

## What happens during normal operations

See [WF-013](../../06-Workflows/WF-013-Customer-Support-Triage.md) for the reviewed workflows that touch this schema. The workflows describe business sequencing; these ERDs describe enforced database references.

## Related documents

[Schema overview](../Schema-Overview.md) · [Database rules](../Database-Rules.md) · [Model and parity notes](../Models-and-Parity.md) · [Migration evidence](../Migrations.md) · [Full relationship catalog](Relationship-Catalog.md) · [Non-FK reference review](Logical-References.md) · [Table index](../Tables/diagnostics/README.md) · [WF-013](../../06-Workflows/WF-013-Customer-Support-Triage.md)
