# Customer ER diagrams

## What this part of the database stores

The `customer` schema stores customer profiles and addresses. The names and structural relationships below come from the checked-out database catalog snapshot; business-purpose summaries marked inferred are not product-owner approval.

## Main tables

| Table | Recorded purpose | Table definition |
|---|---|---|
| [`addresses`](../Tables/customer/addresses.md) | Holds addresses records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/customer/addresses.md) |
| [`consent_events`](../Tables/customer/consent_events.md) | Holds consent events records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/customer/consent_events.md) |
| [`consents`](../Tables/customer/consents.md) | Holds consents records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/customer/consents.md) |
| [`family_members`](../Tables/customer/family_members.md) | Holds family members records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/customer/family_members.md) |
| [`preferences`](../Tables/customer/preferences.md) | Holds preferences records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/customer/preferences.md) |
| [`profiles`](../Tables/customer/profiles.md) | Holds profiles records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/customer/profiles.md) |
| [`wishlist_items`](../Tables/customer/wishlist_items.md) | Holds wishlist items records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/customer/wishlist_items.md) |
| [`wishlists`](../Tables/customer/wishlists.md) | Holds wishlists records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/customer/wishlists.md) |

## ER diagrams

These diagrams show declared PostgreSQL foreign keys from focused source tables. Entity fields include primary keys, unique keys, and FK columns; exact data types remain in the linked table contracts. `PK`, `FK`, and `UK` mark key roles. Relationship cardinality comes from FK nullability and unique constraints/indexes in the recorded catalog.

<a id="diagram-01"></a>

### Diagram 01 — profiles, addresses, family_members, preferences, wishlists, wishlist_items, consents, consent_events

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/customer.md) for exact columns and actions.

```mermaid
erDiagram
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
    customer__addresses {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
        uuid user_id FK, UK
    }
    customer__consent_events {
        uuid actor_user_id FK
        uuid consent_id FK
        bigint consent_id_internal_id FK
        uuid id UK
        bigint internal_id PK, UK
    }
    customer__consents {
        varchar consent_type UK
        uuid created_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        varchar purpose UK
        uuid updated_by FK
        uuid user_id FK, UK
        varchar version UK
    }
    customer__family_members {
        uuid created_by FK
        uuid customer_user_id FK
        uuid deleted_by FK
        uuid guardian_user_id FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid linked_user_id FK
        uuid updated_by FK
    }
    customer__preferences {
        uuid created_by FK
        uuid deleted_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid updated_by FK
        uuid user_id FK
    }
    customer__profiles {
        uuid avatar_file_id FK
        bigint avatar_file_id_internal_id FK
        uuid created_by FK
        uuid default_address_id FK
        bigint default_address_id_internal_id FK
        uuid deleted_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid updated_by FK
        uuid user_id FK
    }
    customer__wishlist_items {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid product_id FK, UK
        bigint product_id_internal_id FK
        uuid updated_by FK
        uuid wishlist_id FK, UK
        bigint wishlist_id_internal_id FK
    }
    customer__wishlists {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
        uuid user_id FK
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
    identity__users ||--o{ customer__profiles : "FK-0451"
    identity__users o|--o{ customer__profiles : "FK-0448 FK-0449 FK-0450"
    customer__addresses o|--o{ customer__profiles : "FK-0452 FK-0453"
    platform__file_objects o|--o{ customer__profiles : "FK-0446 FK-0447"
    identity__users ||--o{ customer__addresses : "FK-0429"
    identity__users o|--o{ customer__addresses : "FK-0426 FK-0427 FK-0428"
    identity__users ||--o{ customer__family_members : "FK-0437"
    identity__users o|--o{ customer__family_members : "FK-0440 FK-0439 FK-0436 FK-0438 FK-0441"
    identity__users ||--o{ customer__preferences : "FK-0445"
    identity__users o|--o{ customer__preferences : "FK-0442 FK-0443 FK-0444"
    identity__users ||--o{ customer__wishlists : "FK-0463"
    identity__users o|--o{ customer__wishlists : "FK-0460 FK-0461 FK-0462"
    identity__users o|--o{ customer__wishlist_items : "FK-0454 FK-0457"
    customer__wishlists ||--o{ customer__wishlist_items : "FK-0458 FK-0459"
    catalog__products ||--o{ customer__wishlist_items : "FK-0455 FK-0456"
    identity__users ||--o{ customer__consents : "FK-0435"
    identity__users o|--o{ customer__consents : "FK-0433 FK-0434"
    identity__users o|--o{ customer__consent_events : "FK-0430"
    customer__consents ||--o{ customer__consent_events : "FK-0431 FK-0432"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `catalog__products` | [`catalog.products`](../Tables/catalog/products.md) |
| `customer__addresses` | [`customer.addresses`](../Tables/customer/addresses.md) |
| `customer__consent_events` | [`customer.consent_events`](../Tables/customer/consent_events.md) |
| `customer__consents` | [`customer.consents`](../Tables/customer/consents.md) |
| `customer__family_members` | [`customer.family_members`](../Tables/customer/family_members.md) |
| `customer__preferences` | [`customer.preferences`](../Tables/customer/preferences.md) |
| `customer__profiles` | [`customer.profiles`](../Tables/customer/profiles.md) |
| `customer__wishlist_items` | [`customer.wishlist_items`](../Tables/customer/wishlist_items.md) |
| `customer__wishlists` | [`customer.wishlists`](../Tables/customer/wishlists.md) |
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `platform__file_objects` | [`platform.file_objects`](../Tables/platform/file_objects.md) |

Coverage: 8 focus tables, 11 entities, 38 FK constraints (38 unique IDs).

## How the tables connect

- **customer.addresses → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **customer.addresses → identity.users:** `deleted_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **customer.addresses → identity.users:** `updated_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **customer.addresses → identity.users:** `user_id` references `id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE CASCADE`. This keeps the child record tied to an existing parent key.
- **customer.consent_events → identity.users:** `actor_user_id` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **customer.consent_events → customer.consents:** `consent_id` references `id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE CASCADE`. This keeps the child record tied to an existing parent key.

Paired public UUID and internal BIGINT foreign keys are real separate constraints. Diagrams use relationship IDs to keep those links readable; each underlying constraint is listed separately in the catalog. The application must keep paired identifiers consistent under the database's numeric-key guards. A relationship does not itself grant read or write permission.

## Important database rules

- The database primary key strategy uses an internal numeric key for most domain rows while retaining public UUID aliases; `identity.users` retains a UUID primary key. The table diagram labels expose the exact keys for each entity.
- A nullable FK permits a child row without that association; it does not make the referenced parent optional when a value is present.
- Composite FKs remain composite in the relationship catalog. Their scope columns must not be dropped when reading the diagram.
- A many-to-many association uses its actual junction table where one exists; no direct association is inferred.
- Authorization, tenant/site scoping, and service write ownership are separate contracts. See the linked database rules and module designs.

## What happens during normal operations

See [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md), [WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md) for the reviewed workflows that touch this schema. The workflows describe business sequencing; these ERDs describe enforced database references.

## Related documents

[Schema overview](../Schema-Overview.md) · [Database rules](../Database-Rules.md) · [Model and parity notes](../Models-and-Parity.md) · [Migration evidence](../Migrations.md) · [Full relationship catalog](Relationship-Catalog.md) · [Non-FK reference review](Logical-References.md) · [Table index](../Tables/customer/README.md) · [Customer_Accounts HLD](../../03-Modules/Customer_Accounts/HLD.md) · [Customer_Accounts LLD](../../03-Modules/Customer_Accounts/LLD.md) · [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) · [WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md)
