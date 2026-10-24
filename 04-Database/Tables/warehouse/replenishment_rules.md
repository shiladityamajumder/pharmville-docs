# `warehouse.replenishment_rules`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds replenishment rules records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 22 columns, 23 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_replenishment_rules_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_replenishment_rules_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `maximum_qty` | `numeric(16,3)` | No | — | Maximum qty value | Track resource or item amounts accurately | See exact constraints |
| `minimum_qty` | `numeric(16,3)` | No | — | Minimum qty value | Track resource or item amounts accurately | See exact constraints |
| `preferred_supplier_id` | `uuid` | Yes | — | Reference linking this record to suppliers | Ensures related business data can be joined and validated | FK → `procurement.suppliers` (fk_warehouse_replenishment_rules_preferred_supplier_id__5314) |
| `preferred_supplier_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.suppliers` (fk_warehouse_replenishment_rules_preferred_supplier_id__4425); Numeric/public-key pair verification required |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_warehouse_replenishment_rules_product_id_products) |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_warehouse_replenishment_rules_product_id_products_numeric); Numeric/public-key pair verification required |
| `reorder_qty` | `numeric(16,3)` | No | — | Reorder qty value | Track resource or item amounts accurately | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_replenishment_rules_updated_by_users) |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` (fk_warehouse_replenishment_rules_variant_id_product_variants) |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` (fk_warehouse_replenishment_rules_variant_id_product_var_2345); Numeric/public-key pair verification required |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_warehouse_replenishment_rules_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_warehouse_replenishment_rules_warehouse_id_warehouse_f9b5); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the replenishment rules business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.replenishment_rules` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_warehouse_replenishment_rules_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_warehouse_replenishment_rules_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_warehouse_replenishment_rules_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_warehouse_replenishment_rules_warehouse_id_warehouses`; `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE CASCADE`
- `preferred_supplier_id` → `procurement.suppliers(id)` via `fk_warehouse_replenishment_rules_preferred_supplier_id__5314`; `FOREIGN KEY (preferred_supplier_id) REFERENCES procurement.suppliers(id) ON DELETE SET NULL`
- `variant_id` → `catalog.product_variants(id)` via `fk_warehouse_replenishment_rules_variant_id_product_variants`; `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE CASCADE`
- `product_id` → `catalog.products(id)` via `fk_warehouse_replenishment_rules_product_id_products`; `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE`
- `preferred_supplier_id_internal_id` → `procurement.suppliers(internal_id)` via `fk_warehouse_replenishment_rules_preferred_supplier_id__4425`; `FOREIGN KEY (preferred_supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE SET NULL`
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_warehouse_replenishment_rules_product_id_products_numeric`; `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE`
- `variant_id_internal_id` → `catalog.product_variants(internal_id)` via `fk_warehouse_replenishment_rules_variant_id_product_var_2345`; `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE CASCADE`
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_warehouse_replenishment_rules_warehouse_id_warehouse_f9b5`; `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE CASCADE`

## `warehouse.replenishment_rules` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 22 columns, 23 constraints, 3 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_warehouse_replenishment_rules_created_by_users` |
| `deleted_by` | `identity.users` | `fk_warehouse_replenishment_rules_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_warehouse_replenishment_rules_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_replenishment_rules_warehouse_id_warehouses` |
| `preferred_supplier_id` | `procurement.suppliers` | `fk_warehouse_replenishment_rules_preferred_supplier_id__5314` |
| `variant_id` | `catalog.product_variants` | `fk_warehouse_replenishment_rules_variant_id_product_variants` |
| `product_id` | `catalog.products` | `fk_warehouse_replenishment_rules_product_id_products` |
| `preferred_supplier_id_internal_id` | `procurement.suppliers` | `fk_warehouse_replenishment_rules_preferred_supplier_id__4425` |
| `product_id_internal_id` | `catalog.products` | `fk_warehouse_replenishment_rules_product_id_products_numeric` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_warehouse_replenishment_rules_variant_id_product_var_2345` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_replenishment_rules_warehouse_id_warehouse_f9b5` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_replenishment_rules_finite_numeric_values` | CHECK | `CHECK ((minimum_qty IS NULL OR (minimum_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (maximum_qty IS NULL OR (maximum_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (reorder_qty IS NULL OR (reorder_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_warehouse_replenishment_rules_maximum_not_below_minimum` | CHECK | `CHECK (maximum_qty >= minimum_qty)` |
| `ck_warehouse_replenishment_rules_minimum_qty_nonnegative` | CHECK | `CHECK (minimum_qty >= 0::numeric)` |
| `ck_warehouse_replenishment_rules_numeric_pair_preferred_3ab7` | CHECK | `CHECK ((preferred_supplier_id IS NULL) = (preferred_supplier_id_internal_id IS NULL))` |
| `ck_warehouse_replenishment_rules_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_warehouse_replenishment_rules_numeric_pair_variant_id` | CHECK | `CHECK ((variant_id IS NULL) = (variant_id_internal_id IS NULL))` |
| `ck_warehouse_replenishment_rules_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_replenishment_rules_reorder_qty_positive` | CHECK | `CHECK (reorder_qty > 0::numeric)` |
| `ck_warehouse_replenishment_rules_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_warehouse_replenishment_rules_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_replenishment_rules_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_replenishment_rules_preferred_supplier_id__4425` | FOREIGN KEY | `FOREIGN KEY (preferred_supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE SET NULL` |
| `fk_warehouse_replenishment_rules_preferred_supplier_id__5314` | FOREIGN KEY | `FOREIGN KEY (preferred_supplier_id) REFERENCES procurement.suppliers(id) ON DELETE SET NULL` |
| `fk_warehouse_replenishment_rules_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| `fk_warehouse_replenishment_rules_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| `fk_warehouse_replenishment_rules_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_replenishment_rules_variant_id_product_var_2345` | FOREIGN KEY | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE CASCADE` |
| `fk_warehouse_replenishment_rules_variant_id_product_variants` | FOREIGN KEY | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE CASCADE` |
| `fk_warehouse_replenishment_rules_warehouse_id_warehouse_f9b5` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE CASCADE` |
| `fk_warehouse_replenishment_rules_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE CASCADE` |
| `pk_warehouse_replenishment_rules` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_warehouse_replenishment_rules_id` | UNIQUE | `UNIQUE (id)` |
| `warehouse_product_replenishment` | UNIQUE | `UNIQUE NULLS NOT DISTINCT (warehouse_id, product_id, variant_id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_warehouse_replenishment_rules` | `CREATE UNIQUE INDEX pk_warehouse_replenishment_rules ON warehouse.replenishment_rules USING btree (internal_id)` |
| `uq_warehouse_replenishment_rules_id` | `CREATE UNIQUE INDEX uq_warehouse_replenishment_rules_id ON warehouse.replenishment_rules USING btree (id)` |
| `warehouse_product_replenishment` | `CREATE UNIQUE INDEX warehouse_product_replenishment ON warehouse.replenishment_rules USING btree (warehouse_id, product_id, variant_id) NULLS NOT DISTINCT` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.replenishment_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["preferred_supplier_id","preferred_supplier_id_internal_id","procurement","suppliers"],["product_id","product_id_internal_id","catalog","products"],["variant_id","variant_id_internal_id","catalog","product_variants"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.replenishment_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.replenishment_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["preferred_supplier_id","preferred_supplier_id_internal_id","procurement","suppliers"],["product_id","product_id_internal_id","catalog","products"],["variant_id","variant_id_internal_id","catalog","product_variants"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
