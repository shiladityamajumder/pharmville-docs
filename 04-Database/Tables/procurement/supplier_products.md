# `procurement.supplier_products`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds supplier products records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | procurement.supplier_products |
| Classification | Mapping / Junction |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 22 columns; 19 PK/FK/UQ/CHECK/exclusion constraints; 15 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_supplier_products_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_supplier_products_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `is_preferred` | `boolean` | No | `false` | Yes/no flag for is preferred | Control conditional business behavior | Exact constraints below |
| `last_purchase_cost` | `numeric(14,2)` | Yes | — | Inferred: stores last purchase cost for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `lead_time_days` | `integer` | No | `0` | Inferred: stores lead time days for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `minimum_order_qty` | `numeric(16,3)` | No | `1` | Minimum order qty value | Track resource or item amounts accurately | Exact constraints below |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_procurement_supplier_products_product_id_products` |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_procurement_supplier_products_product_id_products_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `supplier_id` | `uuid` | No | — | Reference linking this record to suppliers | Ensures related business data can be joined and validated | FK → `procurement.suppliers` via `fk_procurement_supplier_products_supplier_id_suppliers` |
| `supplier_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.suppliers` via `fk_procurement_supplier_products_supplier_id_suppliers_numeric` |
| `supplier_sku` | `character varying(128)` | No | — | Inferred: stores supplier sku for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_supplier_products_updated_by_users` |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` via `fk_procurement_supplier_products_variant_id_product_variants` |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` via `fk_procurement_supplier_products_variant_id_product_var_def8` |

## Record lifecycle and users

- **Created:** when the supplier products business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.supplier_products` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_procurement_supplier_products_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_supplier_products_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_supplier_products_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| fk_procurement_supplier_products_product_id_products_numeric | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| fk_procurement_supplier_products_supplier_id_suppliers | `supplier_id` | [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | `FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE CASCADE` |
| fk_procurement_supplier_products_supplier_id_suppliers_numeric | `supplier_id_internal_id` | [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | `FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE CASCADE` |
| fk_procurement_supplier_products_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_supplier_products_variant_id_product_var_def8 | `variant_id_internal_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT` |
| fk_procurement_supplier_products_variant_id_product_variants | `variant_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`procurement.purchase_order_items`](../../Tables/procurement/purchase_order_items.md) | fk_procurement_purchase_order_items_supplier_product_id_b5cc | `supplier_product_id_internal_id` | `internal_id` |
| [`procurement.purchase_order_items`](../../Tables/procurement/purchase_order_items.md) | fk_procurement_purchase_order_items_supplier_product_id_c908 | `supplier_product_id` | `id` |

## `procurement.supplier_products` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_supplier_products_created_by_users` |
| `deleted_by` | `identity.users` | `fk_procurement_supplier_products_deleted_by_users` |
| `product_id` | `catalog.products` | `fk_procurement_supplier_products_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_procurement_supplier_products_product_id_products_numeric` |
| `supplier_id` | `procurement.suppliers` | `fk_procurement_supplier_products_supplier_id_suppliers` |
| `supplier_id_internal_id` | `procurement.suppliers` | `fk_procurement_supplier_products_supplier_id_suppliers_numeric` |
| `updated_by` | `identity.users` | `fk_procurement_supplier_products_updated_by_users` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_procurement_supplier_products_variant_id_product_var_def8` |
| `variant_id` | `catalog.product_variants` | `fk_procurement_supplier_products_variant_id_product_variants` |

### Existing constraints

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
| `supplier_products_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `supplier_products_id_not_null` | NOT NULL | `NOT NULL id` |
| `supplier_products_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `supplier_products_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `supplier_products_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `supplier_products_is_preferred_not_null` | NOT NULL | `NOT NULL is_preferred` |
| `supplier_products_lead_time_days_not_null` | NOT NULL | `NOT NULL lead_time_days` |
| `supplier_products_minimum_order_qty_not_null` | NOT NULL | `NOT NULL minimum_order_qty` |
| `supplier_products_product_id_internal_id_not_null` | NOT NULL | `NOT NULL product_id_internal_id` |
| `supplier_products_product_id_not_null` | NOT NULL | `NOT NULL product_id` |
| `supplier_products_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `supplier_products_supplier_id_internal_id_not_null` | NOT NULL | `NOT NULL supplier_id_internal_id` |
| `supplier_products_supplier_id_not_null` | NOT NULL | `NOT NULL supplier_id` |
| `supplier_products_supplier_sku_not_null` | NOT NULL | `NOT NULL supplier_sku` |
| `supplier_products_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_procurement_supplier_products_product` | btree | `(product_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_supplier_products_product ON procurement.supplier_products USING btree (product_id)` |
| `pk_procurement_supplier_products` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_procurement_supplier_products ON procurement.supplier_products USING btree (internal_id)` |
| `supplier_product_sku` | btree | `(supplier_id, product_id, supplier_sku)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX supplier_product_sku ON procurement.supplier_products USING btree (supplier_id, product_id, supplier_sku)` |
| `uq_procurement_supplier_products_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_procurement_supplier_products_id ON procurement.supplier_products USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.supplier_products FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["supplier_id","supplier_id_internal_id","procurement","suppliers"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.supplier_products FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.supplier_products FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["supplier_id","supplier_id_internal_id","procurement","suppliers"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
