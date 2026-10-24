# Catalog ER diagrams

## What this part of the database stores

The `catalog` schema stores products, medicines, and classification. The names and structural relationships below come from the checked-out database catalog snapshot; business-purpose summaries marked inferred are not product-owner approval.

## Main tables

| Table | Recorded purpose | Table definition |
|---|---|---|
| [`brands`](../Tables/catalog/brands.md) | Holds brands records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/brands.md) |
| [`categories`](../Tables/catalog/categories.md) | Holds categories records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/categories.md) |
| [`commerce_classes`](../Tables/catalog/commerce_classes.md) | Holds commerce classes records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/commerce_classes.md) |
| [`dosage_forms`](../Tables/catalog/dosage_forms.md) | Holds dosage forms records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/dosage_forms.md) |
| [`manufacturers`](../Tables/catalog/manufacturers.md) | Holds manufacturers records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/manufacturers.md) |
| [`product_attributes`](../Tables/catalog/product_attributes.md) | Holds product attributes records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/product_attributes.md) |
| [`product_classification_history`](../Tables/catalog/product_classification_history.md) | Holds product classification history records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/product_classification_history.md) |
| [`product_content`](../Tables/catalog/product_content.md) | Holds product content records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/product_content.md) |
| [`product_identifiers`](../Tables/catalog/product_identifiers.md) | Holds product identifiers records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/product_identifiers.md) |
| [`product_media`](../Tables/catalog/product_media.md) | Holds product media records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/product_media.md) |
| [`product_regulatory`](../Tables/catalog/product_regulatory.md) | Holds product regulatory records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/product_regulatory.md) |
| [`product_relationships`](../Tables/catalog/product_relationships.md) | Holds product relationships records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/product_relationships.md) |
| [`product_salts`](../Tables/catalog/product_salts.md) | Holds product salts records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/product_salts.md) |
| [`product_variants`](../Tables/catalog/product_variants.md) | Holds product variants records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/product_variants.md) |
| [`products`](../Tables/catalog/products.md) | Holds products records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/products.md) |
| [`salts`](../Tables/catalog/salts.md) | Holds salts records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/salts.md) |
| [`substitution_group_products`](../Tables/catalog/substitution_group_products.md) | Holds substitution group products records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/substitution_group_products.md) |
| [`substitution_groups`](../Tables/catalog/substitution_groups.md) | Holds substitution groups records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/substitution_groups.md) |
| [`units_of_measure`](../Tables/catalog/units_of_measure.md) | Holds units of measure records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/catalog/units_of_measure.md) |

## ER diagrams

These diagrams show declared PostgreSQL foreign keys from focused source tables. Entity fields include primary keys, unique keys, and FK columns; exact data types remain in the linked table contracts. `PK`, `FK`, and `UK` mark key roles. Relationship cardinality comes from FK nullability and unique constraints/indexes in the recorded catalog.

<a id="diagram-01"></a>

### Diagram 01 — products, product_classification_history, categories, dosage_forms, commerce_classes, product_relationships, manufacturers, brands

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/catalog.md) for exact columns and actions.

```mermaid
erDiagram
    catalog__brands {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid logo_file_id FK
        bigint logo_file_id_internal_id FK
        uuid owner_organization_id FK
        bigint owner_organization_id_internal_id FK
        uuid updated_by FK
    }
    catalog__categories {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid parent_id FK
        bigint parent_id_internal_id FK
        uuid updated_by FK
    }
    catalog__commerce_classes {
        varchar code FK, UK
        uuid created_by_user_id FK
        bigint id PK, UK
        uuid updated_by_user_id FK
    }
    catalog__dosage_forms {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    catalog__manufacturers {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid organization_id FK
        bigint organization_id_internal_id FK
        uuid updated_by FK
    }
    catalog__product_classification_history {
        uuid approved_by_user_id FK
        uuid id UK
        bigint internal_id PK, UK
        varchar new_class FK
        varchar old_class FK
        uuid product_id FK, UK
        bigint product_id_internal_id FK
        bigint version UK
    }
    catalog__product_relationships {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        varchar relationship_type UK
        uuid source_product_id FK, UK
        bigint source_product_id_internal_id FK
        uuid target_product_id FK, UK
        bigint target_product_id_internal_id FK
        uuid updated_by FK
    }
    catalog__products {
        uuid brand_id FK
        bigint brand_id_internal_id FK
        uuid category_id FK
        bigint category_id_internal_id FK
        varchar commerce_class FK
        uuid commerce_class_approved_by_user_id FK
        uuid created_by FK
        uuid deleted_by FK
        uuid dosage_form_id FK
        bigint dosage_form_id_internal_id FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid manufacturer_id FK
        bigint manufacturer_id_internal_id FK
        uuid updated_by FK
    }
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
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
    catalog__brands o|--o{ catalog__products : "FK-0125 FK-0126"
    catalog__categories o|--o{ catalog__products : "FK-0127 FK-0128"
    identity__users o|--o{ catalog__products : "FK-0129 FK-0131 FK-0132 FK-0137"
    catalog__commerce_classes o|--o{ catalog__products : "FK-0130"
    catalog__dosage_forms o|--o{ catalog__products : "FK-0133 FK-0134"
    catalog__manufacturers o|--o{ catalog__products : "FK-0135 FK-0136"
    identity__users ||--o{ catalog__product_classification_history : "FK-0076"
    catalog__commerce_classes ||--o{ catalog__product_classification_history : "FK-0077"
    catalog__commerce_classes o|--o{ catalog__product_classification_history : "FK-0078"
    catalog__products ||--o{ catalog__product_classification_history : "FK-0079 FK-0080"
    identity__users o|--o{ catalog__categories : "FK-0057 FK-0058 FK-0061"
    catalog__categories o|--o{ catalog__categories : "FK-0059 FK-0060"
    identity__users o|--o{ catalog__dosage_forms : "FK-0064 FK-0065 FK-0066"
    identity__users o|--o{ catalog__commerce_classes : "FK-0062 FK-0063"
    identity__users o|--o{ catalog__product_relationships : "FK-0106 FK-0111"
    catalog__products ||--o{ catalog__product_relationships : "FK-0107 FK-0108 FK-0109 FK-0110"
    identity__users o|--o{ catalog__manufacturers : "FK-0067 FK-0068 FK-0071"
    organization__organizations o|--o{ catalog__manufacturers : "FK-0069 FK-0070"
    identity__users o|--o{ catalog__brands : "FK-0050 FK-0051 FK-0056"
    platform__file_objects o|--o{ catalog__brands : "FK-0052 FK-0053"
    organization__organizations o|--o{ catalog__brands : "FK-0054 FK-0055"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `catalog__brands` | [`catalog.brands`](../Tables/catalog/brands.md) |
| `catalog__categories` | [`catalog.categories`](../Tables/catalog/categories.md) |
| `catalog__commerce_classes` | [`catalog.commerce_classes`](../Tables/catalog/commerce_classes.md) |
| `catalog__dosage_forms` | [`catalog.dosage_forms`](../Tables/catalog/dosage_forms.md) |
| `catalog__manufacturers` | [`catalog.manufacturers`](../Tables/catalog/manufacturers.md) |
| `catalog__product_classification_history` | [`catalog.product_classification_history`](../Tables/catalog/product_classification_history.md) |
| `catalog__product_relationships` | [`catalog.product_relationships`](../Tables/catalog/product_relationships.md) |
| `catalog__products` | [`catalog.products`](../Tables/catalog/products.md) |
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `organization__organizations` | [`organization.organizations`](../Tables/organization/organizations.md) |
| `platform__file_objects` | [`platform.file_objects`](../Tables/platform/file_objects.md) |

Coverage: 8 focus tables, 11 entities, 46 FK constraints (46 unique IDs).

<a id="diagram-02"></a>

### Diagram 02 — product_media, product_variants, product_identifiers, units_of_measure, product_content, product_regulatory, product_attributes, product_salts

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/catalog.md) for exact columns and actions.

```mermaid
erDiagram
    catalog__product_attributes {
        varchar attribute_key UK
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid product_id FK, UK
        bigint product_id_internal_id FK
        uuid updated_by FK
    }
    catalog__product_content {
        varchar content_type UK
        uuid created_by FK
        uuid deleted_by FK
        uuid id UK
        bigint internal_id PK, UK
        varchar locale UK
        uuid product_id FK, UK
        bigint product_id_internal_id FK
        uuid updated_by FK
    }
    catalog__product_identifiers {
        uuid created_by FK
        uuid id UK
        varchar identifier_type UK
        varchar identifier_value UK
        bigint internal_id PK, UK
        uuid product_id FK
        bigint product_id_internal_id FK
        uuid updated_by FK
        uuid variant_id FK
        bigint variant_id_internal_id FK
    }
    catalog__product_media {
        uuid created_by FK
        uuid deleted_by FK
        uuid file_object_id FK
        bigint file_object_id_internal_id FK
        uuid id UK
        bigint internal_id PK, UK
        uuid product_id FK
        bigint product_id_internal_id FK
        uuid updated_by FK
        uuid variant_id FK
        bigint variant_id_internal_id FK
    }
    catalog__product_regulatory {
        uuid created_by FK
        uuid deleted_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid product_id FK
        bigint product_id_internal_id FK
        uuid updated_by FK
    }
    catalog__product_salts {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid product_id FK, UK
        bigint product_id_internal_id FK
        uuid salt_id FK, UK
        bigint salt_id_internal_id FK
        smallint sequence UK
        uuid updated_by FK
    }
    catalog__product_variants {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid pack_uom_id FK
        bigint pack_uom_id_internal_id FK
        uuid product_id FK
        bigint product_id_internal_id FK
        uuid updated_by FK
    }
    catalog__products {
        uuid brand_id FK
        bigint brand_id_internal_id FK
        uuid category_id FK
        bigint category_id_internal_id FK
        varchar commerce_class FK
        uuid commerce_class_approved_by_user_id FK
        uuid created_by FK
        uuid deleted_by FK
        uuid dosage_form_id FK
        bigint dosage_form_id_internal_id FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid manufacturer_id FK
        bigint manufacturer_id_internal_id FK
        uuid updated_by FK
    }
    catalog__salts {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    catalog__units_of_measure {
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
    identity__users o|--o{ catalog__product_media : "FK-0092 FK-0093 FK-0098"
    platform__file_objects ||--o{ catalog__product_media : "FK-0094 FK-0095"
    catalog__products ||--o{ catalog__product_media : "FK-0096 FK-0097"
    catalog__product_variants o|--o{ catalog__product_media : "FK-0099 FK-0100"
    identity__users o|--o{ catalog__product_variants : "FK-0118 FK-0119 FK-0124"
    catalog__units_of_measure o|--o{ catalog__product_variants : "FK-0120 FK-0121"
    catalog__products ||--o{ catalog__product_variants : "FK-0122 FK-0123"
    identity__users o|--o{ catalog__product_identifiers : "FK-0086 FK-0089"
    catalog__products o|--o{ catalog__product_identifiers : "FK-0087 FK-0088"
    catalog__product_variants o|--o{ catalog__product_identifiers : "FK-0090 FK-0091"
    identity__users o|--o{ catalog__units_of_measure : "FK-0152 FK-0153 FK-0154"
    identity__users o|--o{ catalog__product_content : "FK-0081 FK-0082 FK-0085"
    catalog__products ||--o{ catalog__product_content : "FK-0083 FK-0084"
    identity__users o|--o{ catalog__product_regulatory : "FK-0101 FK-0102 FK-0105"
    catalog__products ||--o{ catalog__product_regulatory : "FK-0103 FK-0104"
    identity__users o|--o{ catalog__product_attributes : "FK-0072 FK-0075"
    catalog__products ||--o{ catalog__product_attributes : "FK-0073 FK-0074"
    identity__users o|--o{ catalog__product_salts : "FK-0112 FK-0117"
    catalog__products ||--o{ catalog__product_salts : "FK-0113 FK-0114"
    catalog__salts ||--o{ catalog__product_salts : "FK-0115 FK-0116"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `catalog__product_attributes` | [`catalog.product_attributes`](../Tables/catalog/product_attributes.md) |
| `catalog__product_content` | [`catalog.product_content`](../Tables/catalog/product_content.md) |
| `catalog__product_identifiers` | [`catalog.product_identifiers`](../Tables/catalog/product_identifiers.md) |
| `catalog__product_media` | [`catalog.product_media`](../Tables/catalog/product_media.md) |
| `catalog__product_regulatory` | [`catalog.product_regulatory`](../Tables/catalog/product_regulatory.md) |
| `catalog__product_salts` | [`catalog.product_salts`](../Tables/catalog/product_salts.md) |
| `catalog__product_variants` | [`catalog.product_variants`](../Tables/catalog/product_variants.md) |
| `catalog__products` | [`catalog.products`](../Tables/catalog/products.md) |
| `catalog__salts` | [`catalog.salts`](../Tables/catalog/salts.md) |
| `catalog__units_of_measure` | [`catalog.units_of_measure`](../Tables/catalog/units_of_measure.md) |
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `platform__file_objects` | [`platform.file_objects`](../Tables/platform/file_objects.md) |

Coverage: 8 focus tables, 12 entities, 45 FK constraints (45 unique IDs).

<a id="diagram-03"></a>

### Diagram 03 — substitution_group_products, substitution_groups, salts

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/catalog.md) for exact columns and actions.

```mermaid
erDiagram
    catalog__dosage_forms {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    catalog__products {
        uuid brand_id FK
        bigint brand_id_internal_id FK
        uuid category_id FK
        bigint category_id_internal_id FK
        varchar commerce_class FK
        uuid commerce_class_approved_by_user_id FK
        uuid created_by FK
        uuid deleted_by FK
        uuid dosage_form_id FK
        bigint dosage_form_id_internal_id FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid manufacturer_id FK
        bigint manufacturer_id_internal_id FK
        uuid updated_by FK
    }
    catalog__salts {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    catalog__substitution_group_products {
        uuid created_by FK
        uuid group_id FK, UK
        bigint group_id_internal_id FK
        uuid id UK
        bigint internal_id PK, UK
        uuid product_id FK, UK
        bigint product_id_internal_id FK
        uuid updated_by FK
    }
    catalog__substitution_groups {
        uuid created_by FK
        uuid deleted_by FK
        uuid dosage_form_id FK
        bigint dosage_form_id_internal_id FK
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
    identity__users o|--o{ catalog__substitution_group_products : "FK-0141 FK-0146"
    catalog__substitution_groups ||--o{ catalog__substitution_group_products : "FK-0142 FK-0143"
    catalog__products ||--o{ catalog__substitution_group_products : "FK-0144 FK-0145"
    identity__users o|--o{ catalog__substitution_groups : "FK-0147 FK-0148 FK-0151"
    catalog__dosage_forms o|--o{ catalog__substitution_groups : "FK-0149 FK-0150"
    identity__users o|--o{ catalog__salts : "FK-0138 FK-0139 FK-0140"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `catalog__dosage_forms` | [`catalog.dosage_forms`](../Tables/catalog/dosage_forms.md) |
| `catalog__products` | [`catalog.products`](../Tables/catalog/products.md) |
| `catalog__salts` | [`catalog.salts`](../Tables/catalog/salts.md) |
| `catalog__substitution_group_products` | [`catalog.substitution_group_products`](../Tables/catalog/substitution_group_products.md) |
| `catalog__substitution_groups` | [`catalog.substitution_groups`](../Tables/catalog/substitution_groups.md) |
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |

Coverage: 3 focus tables, 6 entities, 14 FK constraints (14 unique IDs).

## How the tables connect

- **catalog.brands → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **catalog.brands → identity.users:** `deleted_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **catalog.brands → platform.file_objects:** `logo_file_id` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE SET NULL`. This keeps the child record tied to an existing parent key.
- **catalog.brands → platform.file_objects:** `logo_file_id_internal_id` references `internal_id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE SET NULL`. This keeps the child record tied to an existing parent key.
- **catalog.brands → organization.organizations:** `owner_organization_id` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE SET NULL`. This keeps the child record tied to an existing parent key.
- **catalog.brands → organization.organizations:** `owner_organization_id_internal_id` references `internal_id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE SET NULL`. This keeps the child record tied to an existing parent key.

Paired public UUID and internal BIGINT foreign keys are real separate constraints. Diagrams use relationship IDs to keep those links readable; each underlying constraint is listed separately in the catalog. The application must keep paired identifiers consistent under the database's numeric-key guards. A relationship does not itself grant read or write permission.

## Important database rules

- The database primary key strategy uses an internal numeric key for most domain rows while retaining public UUID aliases; `identity.users` retains a UUID primary key. The table diagram labels expose the exact keys for each entity.
- A nullable FK permits a child row without that association; it does not make the referenced parent optional when a value is present.
- Composite FKs remain composite in the relationship catalog. Their scope columns must not be dropped when reading the diagram.
- A many-to-many association uses its actual junction table where one exists; no direct association is inferred.
- Authorization, tenant/site scoping, and service write ownership are separate contracts. See the linked database rules and module designs.

## What happens during normal operations

See [WF-002](../../06-Workflows/WF-002-Search-and-Availability.md), [WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md), [WF-011](../../06-Workflows/WF-011-Inventory-Reconciliation.md), [WF-014](../../06-Workflows/WF-014-Supplier-Receiving.md) for the reviewed workflows that touch this schema. The workflows describe business sequencing; these ERDs describe enforced database references.

## Related documents

[Schema overview](../Schema-Overview.md) · [Database rules](../Database-Rules.md) · [Model and parity notes](../Models-and-Parity.md) · [Migration evidence](../Migrations.md) · [Full relationship catalog](Relationship-Catalog.md) · [Non-FK reference review](Logical-References.md) · [Table index](../Tables/catalog/README.md) · [Inventory HLD](../../03-Modules/Inventory/HLD.md) · [Inventory LLD](../../03-Modules/Inventory/LLD.md) · [Product_Catalog HLD](../../03-Modules/Product-Catalog/HLD.md) · [Product_Catalog LLD](../../03-Modules/Product-Catalog/LLD.md) · [WF-002](../../06-Workflows/WF-002-Search-and-Availability.md) · [WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md) · [WF-011](../../06-Workflows/WF-011-Inventory-Reconciliation.md) · [WF-014](../../06-Workflows/WF-014-Supplier-Receiving.md)
