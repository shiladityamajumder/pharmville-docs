# `warehouse.replenishment_rules`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds replenishment rules records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | warehouse.replenishment_rules |
| Classification | Configuration |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 22 columns; 23 PK/FK/UQ/CHECK/exclusion constraints; 14 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_replenishment_rules_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_replenishment_rules_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `maximum_qty` | `numeric(16,3)` | No | — | Maximum qty value | Track resource or item amounts accurately | Exact constraints below |
| `minimum_qty` | `numeric(16,3)` | No | — | Minimum qty value | Track resource or item amounts accurately | Exact constraints below |
| `preferred_supplier_id` | `uuid` | Yes | — | Reference linking this record to suppliers | Ensures related business data can be joined and validated | FK → `procurement.suppliers` via `fk_warehouse_replenishment_rules_preferred_supplier_id__5314` |
| `preferred_supplier_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.suppliers` via `fk_warehouse_replenishment_rules_preferred_supplier_id__4425` |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_warehouse_replenishment_rules_product_id_products` |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_warehouse_replenishment_rules_product_id_products_numeric` |
| `reorder_qty` | `numeric(16,3)` | No | — | Reorder qty value | Track resource or item amounts accurately | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_replenishment_rules_updated_by_users` |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` via `fk_warehouse_replenishment_rules_variant_id_product_variants` |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` via `fk_warehouse_replenishment_rules_variant_id_product_var_2345` |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_warehouse_replenishment_rules_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_warehouse_replenishment_rules_warehouse_id_warehouse_f9b5` |

## Record lifecycle and users

- **Created:** when the replenishment rules business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.replenishment_rules` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_warehouse_replenishment_rules_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_replenishment_rules_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_replenishment_rules_preferred_supplier_id__4425 | `preferred_supplier_id_internal_id` | [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | `FOREIGN KEY (preferred_supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE SET NULL` |
| fk_warehouse_replenishment_rules_preferred_supplier_id__5314 | `preferred_supplier_id` | [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | `FOREIGN KEY (preferred_supplier_id) REFERENCES procurement.suppliers(id) ON DELETE SET NULL` |
| fk_warehouse_replenishment_rules_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| fk_warehouse_replenishment_rules_product_id_products_numeric | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| fk_warehouse_replenishment_rules_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_replenishment_rules_variant_id_product_var_2345 | `variant_id_internal_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE CASCADE` |
| fk_warehouse_replenishment_rules_variant_id_product_variants | `variant_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE CASCADE` |
| fk_warehouse_replenishment_rules_warehouse_id_warehouse_f9b5 | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE CASCADE` |
| fk_warehouse_replenishment_rules_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `warehouse.replenishment_rules` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_warehouse_replenishment_rules_created_by_users` |
| `deleted_by` | `identity.users` | `fk_warehouse_replenishment_rules_deleted_by_users` |
| `preferred_supplier_id_internal_id` | `procurement.suppliers` | `fk_warehouse_replenishment_rules_preferred_supplier_id__4425` |
| `preferred_supplier_id` | `procurement.suppliers` | `fk_warehouse_replenishment_rules_preferred_supplier_id__5314` |
| `product_id` | `catalog.products` | `fk_warehouse_replenishment_rules_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_warehouse_replenishment_rules_product_id_products_numeric` |
| `updated_by` | `identity.users` | `fk_warehouse_replenishment_rules_updated_by_users` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_warehouse_replenishment_rules_variant_id_product_var_2345` |
| `variant_id` | `catalog.product_variants` | `fk_warehouse_replenishment_rules_variant_id_product_variants` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_replenishment_rules_warehouse_id_warehouse_f9b5` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_replenishment_rules_warehouse_id_warehouses` |

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
| `replenishment_rules_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `replenishment_rules_id_not_null` | NOT NULL | `NOT NULL id` |
| `replenishment_rules_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `replenishment_rules_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `replenishment_rules_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `replenishment_rules_maximum_qty_not_null` | NOT NULL | `NOT NULL maximum_qty` |
| `replenishment_rules_minimum_qty_not_null` | NOT NULL | `NOT NULL minimum_qty` |
| `replenishment_rules_product_id_internal_id_not_null` | NOT NULL | `NOT NULL product_id_internal_id` |
| `replenishment_rules_product_id_not_null` | NOT NULL | `NOT NULL product_id` |
| `replenishment_rules_reorder_qty_not_null` | NOT NULL | `NOT NULL reorder_qty` |
| `replenishment_rules_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `replenishment_rules_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `replenishment_rules_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL warehouse_id_internal_id` |
| `replenishment_rules_warehouse_id_not_null` | NOT NULL | `NOT NULL warehouse_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_warehouse_replenishment_rules` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_warehouse_replenishment_rules ON warehouse.replenishment_rules USING btree (internal_id)` |
| `uq_warehouse_replenishment_rules_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_replenishment_rules_id ON warehouse.replenishment_rules USING btree (id)` |
| `warehouse_product_replenishment` | btree | `(warehouse_id, product_id, variant_id) NULLS NOT DISTINCT` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX warehouse_product_replenishment ON warehouse.replenishment_rules USING btree (warehouse_id, product_id, variant_id) NULLS NOT DISTINCT` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.replenishment_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["preferred_supplier_id","preferred_supplier_id_internal_id","procurement","suppliers"],["product_id","product_id_internal_id","catalog","products"],["variant_id","variant_id_internal_id","catalog","product_variants"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.replenishment_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.replenishment_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["preferred_supplier_id","preferred_supplier_id_internal_id","procurement","suppliers"],["product_id","product_id_internal_id","catalog","products"],["variant_id","variant_id_internal_id","catalog","product_variants"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
