# `catalog.product_media`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds product media records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | catalog.product_media |
| Classification | Mapping / Junction |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 20 columns; 16 PK/FK/UQ/CHECK/exclusion constraints; 13 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `alt_text` | `character varying(255)` | Yes | — | Inferred: stores alt text for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_product_media_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_product_media_deleted_by_users` |
| `display_order` | `integer` | No | `0` | Inferred: stores display order for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `file_object_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_catalog_product_media_file_object_id_file_objects` |
| `file_object_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_catalog_product_media_file_object_id_file_objects_numeric` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `is_primary` | `boolean` | No | `false` | Yes/no flag for is primary | Control conditional business behavior | Exact constraints below |
| `media_type` | `character varying(32)` | No | — | Inferred: stores media type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_catalog_product_media_product_id_products` |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_catalog_product_media_product_id_products_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_product_media_updated_by_users` |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` via `fk_catalog_product_media_variant_id_product_variants` |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` via `fk_catalog_product_media_variant_id_product_variants_numeric` |

## Record lifecycle and users

- **Created:** when the product media business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.product_media` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_catalog_product_media_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_product_media_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_product_media_file_object_id_file_objects | `file_object_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT` |
| fk_catalog_product_media_file_object_id_file_objects_numeric | `file_object_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT` |
| fk_catalog_product_media_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| fk_catalog_product_media_product_id_products_numeric | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| fk_catalog_product_media_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_product_media_variant_id_product_variants | `variant_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE CASCADE` |
| fk_catalog_product_media_variant_id_product_variants_numeric | `variant_id_internal_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `catalog.product_media` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_product_media_created_by_users` |
| `deleted_by` | `identity.users` | `fk_catalog_product_media_deleted_by_users` |
| `file_object_id` | `platform.file_objects` | `fk_catalog_product_media_file_object_id_file_objects` |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_catalog_product_media_file_object_id_file_objects_numeric` |
| `product_id` | `catalog.products` | `fk_catalog_product_media_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_catalog_product_media_product_id_products_numeric` |
| `updated_by` | `identity.users` | `fk_catalog_product_media_updated_by_users` |
| `variant_id` | `catalog.product_variants` | `fk_catalog_product_media_variant_id_product_variants` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_catalog_product_media_variant_id_product_variants_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_product_media_display_order_nonnegative` | CHECK | `CHECK (display_order >= 0)` |
| `ck_catalog_product_media_numeric_pair_file_object_id` | CHECK | `CHECK ((file_object_id IS NULL) = (file_object_id_internal_id IS NULL))` |
| `ck_catalog_product_media_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_catalog_product_media_numeric_pair_variant_id` | CHECK | `CHECK ((variant_id IS NULL) = (variant_id_internal_id IS NULL))` |
| `ck_catalog_product_media_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_catalog_product_media_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_product_media_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_product_media_file_object_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT` |
| `fk_catalog_product_media_file_object_id_file_objects_numeric` | FOREIGN KEY | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT` |
| `fk_catalog_product_media_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| `fk_catalog_product_media_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| `fk_catalog_product_media_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_product_media_variant_id_product_variants` | FOREIGN KEY | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE CASCADE` |
| `fk_catalog_product_media_variant_id_product_variants_numeric` | FOREIGN KEY | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE CASCADE` |
| `pk_catalog_product_media` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_catalog_product_media_id` | UNIQUE | `UNIQUE (id)` |
| `product_media_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `product_media_display_order_not_null` | NOT NULL | `NOT NULL display_order` |
| `product_media_file_object_id_internal_id_not_null` | NOT NULL | `NOT NULL file_object_id_internal_id` |
| `product_media_file_object_id_not_null` | NOT NULL | `NOT NULL file_object_id` |
| `product_media_id_not_null` | NOT NULL | `NOT NULL id` |
| `product_media_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `product_media_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `product_media_is_primary_not_null` | NOT NULL | `NOT NULL is_primary` |
| `product_media_media_type_not_null` | NOT NULL | `NOT NULL media_type` |
| `product_media_product_id_internal_id_not_null` | NOT NULL | `NOT NULL product_id_internal_id` |
| `product_media_product_id_not_null` | NOT NULL | `NOT NULL product_id` |
| `product_media_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `product_media_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_catalog_product_media_file_object_id` | btree | `(file_object_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_product_media_file_object_id ON catalog.product_media USING btree (file_object_id)` |
| `ix_catalog_product_media_product_id` | btree | `(product_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_product_media_product_id ON catalog.product_media USING btree (product_id)` |
| `ix_catalog_product_media_variant_id` | btree | `(variant_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_product_media_variant_id ON catalog.product_media USING btree (variant_id)` |
| `pk_catalog_product_media` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_catalog_product_media ON catalog.product_media USING btree (internal_id)` |
| `uq_catalog_primary_product_media_active` | btree | `(product_id)` | variant_id IS NULL AND is_primary = true AND is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_primary_product_media_active ON catalog.product_media USING btree (product_id) WHERE variant_id IS NULL AND is_primary = true AND is_deleted = false` |
| `uq_catalog_product_media_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_product_media_id ON catalog.product_media USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_media FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"],["product_id","product_id_internal_id","catalog","products"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.product_media FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_media FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"],["product_id","product_id_internal_id","catalog","products"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
