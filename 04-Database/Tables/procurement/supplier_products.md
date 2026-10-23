# procurement.supplier_products

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds supplier products records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 22 columns, 19 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_supplier_products_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_supplier_products_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `is_preferred` | `boolean` | No | `false` | Yes/no flag for is preferred | Control conditional business behavior | See exact constraints |
| `last_purchase_cost` | `numeric(14,2)` | Yes | — | Inferred: stores last purchase cost for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `lead_time_days` | `integer` | No | `0` | Inferred: stores lead time days for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `minimum_order_qty` | `numeric(16,3)` | No | `1` | Minimum order qty value | Track resource or item amounts accurately | See exact constraints |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_procurement_supplier_products_product_id_products) |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_procurement_supplier_products_product_id_products_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `supplier_id` | `uuid` | No | — | Reference linking this record to suppliers | Ensures related business data can be joined and validated | FK → `procurement.suppliers` (fk_procurement_supplier_products_supplier_id_suppliers) |
| `supplier_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.suppliers` (fk_procurement_supplier_products_supplier_id_suppliers_numeric); Numeric/public-key pair verification required |
| `supplier_sku` | `character varying(128)` | No | — | Inferred: stores supplier sku for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_supplier_products_updated_by_users) |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` (fk_procurement_supplier_products_variant_id_product_variants) |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` (fk_procurement_supplier_products_variant_id_product_var_def8); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the supplier products business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.supplier_products` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_procurement_supplier_products_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_procurement_supplier_products_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_procurement_supplier_products_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `variant_id` → `catalog.product_variants(id)` via `fk_procurement_supplier_products_variant_id_product_variants`; FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT
- `product_id` → `catalog.products(id)` via `fk_procurement_supplier_products_product_id_products`; FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT
- `supplier_id` → `procurement.suppliers(id)` via `fk_procurement_supplier_products_supplier_id_suppliers`; FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE CASCADE
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_procurement_supplier_products_product_id_products_numeric`; FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT
- `supplier_id_internal_id` → `procurement.suppliers(internal_id)` via `fk_procurement_supplier_products_supplier_id_suppliers_numeric`; FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE CASCADE
- `variant_id_internal_id` → `catalog.product_variants(internal_id)` via `fk_procurement_supplier_products_variant_id_product_var_def8`; FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT

**Referenced by 2 FK constraints** (sample): `procurement.purchase_order_items`, `procurement.purchase_order_items`.

## procurement.supplier_products — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 22 columns, 19 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_supplier_products_created_by_users` |
| `deleted_by` | `identity.users` | `fk_procurement_supplier_products_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_procurement_supplier_products_updated_by_users` |
| `variant_id` | `catalog.product_variants` | `fk_procurement_supplier_products_variant_id_product_variants` |
| `product_id` | `catalog.products` | `fk_procurement_supplier_products_product_id_products` |
| `supplier_id` | `procurement.suppliers` | `fk_procurement_supplier_products_supplier_id_suppliers` |
| `product_id_internal_id` | `catalog.products` | `fk_procurement_supplier_products_product_id_products_numeric` |
| `supplier_id_internal_id` | `procurement.suppliers` | `fk_procurement_supplier_products_supplier_id_suppliers_numeric` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_procurement_supplier_products_variant_id_product_var_def8` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_procurement_supplier_products_finite_numeric_values` | CHECK | `CHECK ((minimum_order_qty IS NULL OR (minimum_order_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (last_purchase_cost IS NULL OR (last_purchase_cost <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_procurement_supplier_products_lead_time_nonnegative` | CHECK | `CHECK (lead_time_days >= 0)` |
| `ck_procurement_supplier_products_minimum_order_qty_positive` | CHECK | `CHECK (minimum_order_qty > 0::numeric)` |
| `ck_procurement_supplier_products_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_procurement_supplier_products_numeric_pair_supplier_id` | CHECK | `CHECK ((supplier_id IS NULL) = (supplier_id_internal_id IS NULL))` |
| `ck_procurement_supplier_products_numeric_pair_variant_id` | CHECK | `CHECK ((variant_id IS NULL) = (variant_id_internal_id IS NULL))` |
| `ck_procurement_supplier_products_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_procurement_supplier_products_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_supplier_products_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_supplier_products_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| `fk_procurement_supplier_products_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| `fk_procurement_supplier_products_supplier_id_suppliers` | FOREIGN KEY | `FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE CASCADE` |
| `fk_procurement_supplier_products_supplier_id_suppliers_numeric` | FOREIGN KEY | `FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE CASCADE` |
| `fk_procurement_supplier_products_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_supplier_products_variant_id_product_var_def8` | FOREIGN KEY | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT` |
| `fk_procurement_supplier_products_variant_id_product_variants` | FOREIGN KEY | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT` |
| `pk_procurement_supplier_products` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `supplier_product_sku` | UNIQUE | `UNIQUE (supplier_id, product_id, supplier_sku)` |
| `uq_procurement_supplier_products_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_procurement_supplier_products_product` | `CREATE INDEX ix_procurement_supplier_products_product ON procurement.supplier_products USING btree (product_id)` |
| `pk_procurement_supplier_products` | `CREATE UNIQUE INDEX pk_procurement_supplier_products ON procurement.supplier_products USING btree (internal_id)` |
| `supplier_product_sku` | `CREATE UNIQUE INDEX supplier_product_sku ON procurement.supplier_products USING btree (supplier_id, product_id, supplier_sku)` |
| `uq_procurement_supplier_products_id` | `CREATE UNIQUE INDEX uq_procurement_supplier_products_id ON procurement.supplier_products USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.supplier_products FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["supplier_id","supplier_id_internal_id","procurement","suppliers"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.supplier_products FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.supplier_products FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["supplier_id","supplier_id_internal_id","procurement","suppliers"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
