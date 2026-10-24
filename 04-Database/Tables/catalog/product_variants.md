# `catalog.product_variants`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds product variants records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 20 columns, 15 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_product_variants_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_product_variants_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_default` | `boolean` | No | `false` | Yes/no flag for is default | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `pack_quantity` | `numeric(12,3)` | No | — | Pack quantity value | Track resource or item amounts accurately | See exact constraints |
| `pack_uom_id` | `uuid` | Yes | — | Reference linking this record to units of measure | Ensures related business data can be joined and validated | FK → `catalog.units_of_measure` (fk_catalog_product_variants_pack_uom_id_units_of_measure) |
| `pack_uom_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.units_of_measure` (fk_catalog_product_variants_pack_uom_id_units_of_measur_5b35); Numeric/public-key pair verification required |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_catalog_product_variants_product_id_products) |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_catalog_product_variants_product_id_products_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(16)` | No | `'draft'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `strength_display` | `character varying(128)` | Yes | — | Inferred: stores strength display for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_product_variants_updated_by_users) |
| `variant_sku` | `character varying(64)` | No | — | Inferred: stores variant sku for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the product variants business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.product_variants` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_catalog_product_variants_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_catalog_product_variants_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_catalog_product_variants_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `pack_uom_id` → `catalog.units_of_measure(id)` via `fk_catalog_product_variants_pack_uom_id_units_of_measure`; `FOREIGN KEY (pack_uom_id) REFERENCES catalog.units_of_measure(id) ON DELETE SET NULL`
- `product_id` → `catalog.products(id)` via `fk_catalog_product_variants_product_id_products`; `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE`
- `pack_uom_id_internal_id` → `catalog.units_of_measure(internal_id)` via `fk_catalog_product_variants_pack_uom_id_units_of_measur_5b35`; `FOREIGN KEY (pack_uom_id_internal_id) REFERENCES catalog.units_of_measure(internal_id) ON DELETE SET NULL`
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_catalog_product_variants_product_id_products_numeric`; `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE`

**Referenced by 22 FK constraints** (sample): `catalog.product_identifiers`, `catalog.product_media`, `commerce.cart_items`, `commerce.order_items`, `marketplace.seller_product_listings`, `pricing.product_prices`, `procurement.supplier_products`, `procurement.purchase_requisition_items`, `procurement.purchase_order_items`, `warehouse.inventory_lots`, `warehouse.replenishment_rules`, `catalog.product_identifiers`.

## `catalog.product_variants` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 20 columns, 15 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_product_variants_created_by_users` |
| `deleted_by` | `identity.users` | `fk_catalog_product_variants_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_catalog_product_variants_updated_by_users` |
| `pack_uom_id` | `catalog.units_of_measure` | `fk_catalog_product_variants_pack_uom_id_units_of_measure` |
| `product_id` | `catalog.products` | `fk_catalog_product_variants_product_id_products` |
| `pack_uom_id_internal_id` | `catalog.units_of_measure` | `fk_catalog_product_variants_pack_uom_id_units_of_measur_5b35` |
| `product_id_internal_id` | `catalog.products` | `fk_catalog_product_variants_product_id_products_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_product_variants_finite_numeric_values` | CHECK | `CHECK (pack_quantity IS NULL OR (pack_quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_catalog_product_variants_numeric_pair_pack_uom_id` | CHECK | `CHECK ((pack_uom_id IS NULL) = (pack_uom_id_internal_id IS NULL))` |
| `ck_catalog_product_variants_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_catalog_product_variants_pack_quantity_positive` | CHECK | `CHECK (pack_quantity > 0::numeric)` |
| `ck_catalog_product_variants_productstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['draft'::text, 'review'::text, 'active'::text, 'inactive'::text, 'discontinued'::text, 'recalled'::text]))` |
| `ck_catalog_product_variants_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_catalog_product_variants_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_product_variants_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_product_variants_pack_uom_id_units_of_measur_5b35` | FOREIGN KEY | `FOREIGN KEY (pack_uom_id_internal_id) REFERENCES catalog.units_of_measure(internal_id) ON DELETE SET NULL` |
| `fk_catalog_product_variants_pack_uom_id_units_of_measure` | FOREIGN KEY | `FOREIGN KEY (pack_uom_id) REFERENCES catalog.units_of_measure(id) ON DELETE SET NULL` |
| `fk_catalog_product_variants_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| `fk_catalog_product_variants_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| `fk_catalog_product_variants_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_catalog_product_variants` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_catalog_product_variants_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_catalog_product_variants_product_id` | `CREATE INDEX ix_catalog_product_variants_product_id ON catalog.product_variants USING btree (product_id)` |
| `pk_catalog_product_variants` | `CREATE UNIQUE INDEX pk_catalog_product_variants ON catalog.product_variants USING btree (internal_id)` |
| `uq_catalog_product_variants_id` | `CREATE UNIQUE INDEX uq_catalog_product_variants_id ON catalog.product_variants USING btree (id)` |
| `uq_catalog_variant_sku_active` | `CREATE UNIQUE INDEX uq_catalog_variant_sku_active ON catalog.product_variants USING btree (variant_sku) WHERE is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_variants FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["pack_uom_id","pack_uom_id_internal_id","catalog","units_of_measure"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.product_variants FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_variants FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["pack_uom_id","pack_uom_id_internal_id","catalog","units_of_measure"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
