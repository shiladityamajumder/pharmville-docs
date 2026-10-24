# `catalog.product_media`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds product media records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 20 columns, 16 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `alt_text` | `character varying(255)` | Yes | — | Inferred: stores alt text for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_product_media_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_product_media_deleted_by_users) |
| `display_order` | `integer` | No | `0` | Inferred: stores display order for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `file_object_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_catalog_product_media_file_object_id_file_objects) |
| `file_object_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_catalog_product_media_file_object_id_file_objects_numeric); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `is_primary` | `boolean` | No | `false` | Yes/no flag for is primary | Control conditional business behavior | See exact constraints |
| `media_type` | `character varying(32)` | No | — | Inferred: stores media type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_catalog_product_media_product_id_products) |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_catalog_product_media_product_id_products_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_product_media_updated_by_users) |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` (fk_catalog_product_media_variant_id_product_variants) |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` (fk_catalog_product_media_variant_id_product_variants_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the product media business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.product_media` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_catalog_product_media_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_catalog_product_media_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_catalog_product_media_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `file_object_id` → `platform.file_objects(id)` via `fk_catalog_product_media_file_object_id_file_objects`; `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT`
- `variant_id` → `catalog.product_variants(id)` via `fk_catalog_product_media_variant_id_product_variants`; `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE CASCADE`
- `product_id` → `catalog.products(id)` via `fk_catalog_product_media_product_id_products`; `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE`
- `file_object_id_internal_id` → `platform.file_objects(internal_id)` via `fk_catalog_product_media_file_object_id_file_objects_numeric`; `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT`
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_catalog_product_media_product_id_products_numeric`; `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE`
- `variant_id_internal_id` → `catalog.product_variants(internal_id)` via `fk_catalog_product_media_variant_id_product_variants_numeric`; `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE CASCADE`

## `catalog.product_media` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 20 columns, 16 constraints, 6 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_product_media_created_by_users` |
| `deleted_by` | `identity.users` | `fk_catalog_product_media_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_catalog_product_media_updated_by_users` |
| `file_object_id` | `platform.file_objects` | `fk_catalog_product_media_file_object_id_file_objects` |
| `variant_id` | `catalog.product_variants` | `fk_catalog_product_media_variant_id_product_variants` |
| `product_id` | `catalog.products` | `fk_catalog_product_media_product_id_products` |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_catalog_product_media_file_object_id_file_objects_numeric` |
| `product_id_internal_id` | `catalog.products` | `fk_catalog_product_media_product_id_products_numeric` |
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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_catalog_product_media_file_object_id` | `CREATE INDEX ix_catalog_product_media_file_object_id ON catalog.product_media USING btree (file_object_id)` |
| `ix_catalog_product_media_product_id` | `CREATE INDEX ix_catalog_product_media_product_id ON catalog.product_media USING btree (product_id)` |
| `ix_catalog_product_media_variant_id` | `CREATE INDEX ix_catalog_product_media_variant_id ON catalog.product_media USING btree (variant_id)` |
| `pk_catalog_product_media` | `CREATE UNIQUE INDEX pk_catalog_product_media ON catalog.product_media USING btree (internal_id)` |
| `uq_catalog_primary_product_media_active` | `CREATE UNIQUE INDEX uq_catalog_primary_product_media_active ON catalog.product_media USING btree (product_id) WHERE variant_id IS NULL AND is_primary = true AND is_deleted = false` |
| `uq_catalog_product_media_id` | `CREATE UNIQUE INDEX uq_catalog_product_media_id ON catalog.product_media USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_media FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"],["product_id","product_id_internal_id","catalog","products"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.product_media FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_media FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"],["product_id","product_id_internal_id","catalog","products"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
