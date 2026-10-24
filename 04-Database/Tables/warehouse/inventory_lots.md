# `warehouse.inventory_lots`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds inventory lots records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | warehouse.inventory_lots |
| Classification | Transactional |
| Proposed business write owner | Inventory |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 25 columns; 26 PK/FK/UQ/CHECK/exclusion constraints; 14 named PostgreSQL 18 NOT NULL constraints; 7 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `batch_number` | `character varying(128)` | No | — | Inferred: stores batch number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_inventory_lots_created_by_users` |
| `expires_at` | `date` | No | — | Expiration time | Determine validity windows | Exact constraints below |
| `goods_receipt_item_id` | `uuid` | Yes | — | Reference linking this record to goods receipt items | Ensures related business data can be joined and validated | FK → `procurement.goods_receipt_items` via `fk_warehouse_inventory_lots_goods_receipt_item_id_goods_b158` |
| `goods_receipt_item_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.goods_receipt_items` via `fk_warehouse_inventory_lots_goods_receipt_item_id_goods_b952` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `manufactured_at` | `date` | Yes | — | Time of manufactured | Support chronology, deadlines or audit evidence | Exact constraints below |
| `mrp` | `numeric(14,2)` | No | — | Inferred: stores mrp for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_warehouse_inventory_lots_product_id_products` |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_warehouse_inventory_lots_product_id_products_numeric` |
| `purchase_cost` | `numeric(14,2)` | Yes | — | Inferred: stores purchase cost for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `quality_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores quality status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `recall_status` | `character varying(32)` | No | `'clear'::character varying` | Inferred: stores recall status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `received_at` | `timestamp with time zone` | Yes | — | Time of received | Support chronology, deadlines or audit evidence | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `supplier_id` | `uuid` | Yes | — | Reference linking this record to suppliers | Ensures related business data can be joined and validated | FK → `procurement.suppliers` via `fk_warehouse_inventory_lots_supplier_id_suppliers` |
| `supplier_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.suppliers` via `fk_warehouse_inventory_lots_supplier_id_suppliers_numeric` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_inventory_lots_updated_by_users` |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` via `fk_warehouse_inventory_lots_variant_id_product_variants` |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` via `fk_warehouse_inventory_lots_variant_id_product_variants_numeric` |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_warehouse_inventory_lots_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_warehouse_inventory_lots_warehouse_id_warehouses_numeric` |

## Record lifecycle and users

- **Created:** when the inventory lots business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.inventory_lots` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_warehouse_inventory_lots_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_inventory_lots_goods_receipt_item_id_goods_b158 | `goods_receipt_item_id` | [`procurement.goods_receipt_items`](../../Tables/procurement/goods_receipt_items.md) | `FOREIGN KEY (goods_receipt_item_id) REFERENCES procurement.goods_receipt_items(id) ON DELETE SET NULL` |
| fk_warehouse_inventory_lots_goods_receipt_item_id_goods_b952 | `goods_receipt_item_id_internal_id` | [`procurement.goods_receipt_items`](../../Tables/procurement/goods_receipt_items.md) | `FOREIGN KEY (goods_receipt_item_id_internal_id) REFERENCES procurement.goods_receipt_items(internal_id) ON DELETE SET NULL` |
| fk_warehouse_inventory_lots_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| fk_warehouse_inventory_lots_product_id_products_numeric | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_inventory_lots_supplier_id_suppliers | `supplier_id` | [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | `FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE SET NULL` |
| fk_warehouse_inventory_lots_supplier_id_suppliers_numeric | `supplier_id_internal_id` | [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | `FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE SET NULL` |
| fk_warehouse_inventory_lots_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_inventory_lots_variant_id_product_variants | `variant_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT` |
| fk_warehouse_inventory_lots_variant_id_product_variants_numeric | `variant_id_internal_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_inventory_lots_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| fk_warehouse_inventory_lots_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`compliance.recall_lots`](../../Tables/compliance/recall_lots.md) | fk_compliance_recall_lots_lot_id_inventory_lots | `lot_id` | `id` |
| [`compliance.recall_lots`](../../Tables/compliance/recall_lots.md) | fk_compliance_recall_lots_lot_id_inventory_lots_numeric | `lot_id_internal_id` | `internal_id` |
| [`fulfillment.package_items`](../../Tables/fulfillment/package_items.md) | fk_fulfillment_package_items_lot_id_inventory_lots | `lot_id` | `id` |
| [`fulfillment.package_items`](../../Tables/fulfillment/package_items.md) | fk_fulfillment_package_items_lot_id_inventory_lots_numeric | `lot_id_internal_id` | `internal_id` |
| [`fulfillment.pick_task_items`](../../Tables/fulfillment/pick_task_items.md) | fk_fulfillment_pick_task_items_lot_id_inventory_lots | `lot_id` | `id` |
| [`fulfillment.pick_task_items`](../../Tables/fulfillment/pick_task_items.md) | fk_fulfillment_pick_task_items_lot_id_inventory_lots_numeric | `lot_id_internal_id` | `internal_id` |
| [`procurement.purchase_return_items`](../../Tables/procurement/purchase_return_items.md) | fk_procurement_purchase_return_items_lot_id_inventory_l_349a | `lot_id_internal_id` | `internal_id` |
| [`procurement.purchase_return_items`](../../Tables/procurement/purchase_return_items.md) | fk_procurement_purchase_return_items_lot_id_inventory_lots | `lot_id` | `id` |
| [`warehouse.cycle_count_items`](../../Tables/warehouse/cycle_count_items.md) | fk_warehouse_cycle_count_items_lot_id_inventory_lots | `lot_id` | `id` |
| [`warehouse.cycle_count_items`](../../Tables/warehouse/cycle_count_items.md) | fk_warehouse_cycle_count_items_lot_id_inventory_lots_numeric | `lot_id_internal_id` | `internal_id` |
| [`warehouse.inventory_adjustment_items`](../../Tables/warehouse/inventory_adjustment_items.md) | fk_warehouse_inventory_adjustment_items_lot_id_inventor_a018 | `lot_id_internal_id` | `internal_id` |
| [`warehouse.inventory_adjustment_items`](../../Tables/warehouse/inventory_adjustment_items.md) | fk_warehouse_inventory_adjustment_items_lot_id_inventory_lots | `lot_id` | `id` |
| [`warehouse.stock_balances`](../../Tables/warehouse/stock_balances.md) | fk_warehouse_stock_balances_lot_id_inventory_lots | `lot_id` | `id` |
| [`warehouse.stock_balances`](../../Tables/warehouse/stock_balances.md) | fk_warehouse_stock_balances_lot_id_inventory_lots_numeric | `lot_id_internal_id` | `internal_id` |
| [`warehouse.stock_holds`](../../Tables/warehouse/stock_holds.md) | fk_warehouse_stock_holds_lot_id_inventory_lots | `lot_id` | `id` |
| [`warehouse.stock_holds`](../../Tables/warehouse/stock_holds.md) | fk_warehouse_stock_holds_lot_id_inventory_lots_numeric | `lot_id_internal_id` | `internal_id` |
| [`warehouse.stock_ledger`](../../Tables/warehouse/stock_ledger.md) | fk_warehouse_stock_ledger_lot_id_inventory_lots | `lot_id` | `id` |
| [`warehouse.stock_ledger`](../../Tables/warehouse/stock_ledger.md) | fk_warehouse_stock_ledger_lot_id_inventory_lots_numeric | `lot_id_internal_id` | `internal_id` |
| [`warehouse.stock_reservations`](../../Tables/warehouse/stock_reservations.md) | fk_warehouse_stock_reservations_lot_id_inventory_lots | `lot_id` | `id` |
| [`warehouse.stock_reservations`](../../Tables/warehouse/stock_reservations.md) | fk_warehouse_stock_reservations_lot_id_inventory_lots_numeric | `lot_id_internal_id` | `internal_id` |
| [`warehouse.stock_transfer_items`](../../Tables/warehouse/stock_transfer_items.md) | fk_warehouse_stock_transfer_items_lot_id_inventory_lots | `lot_id` | `id` |
| [`warehouse.stock_transfer_items`](../../Tables/warehouse/stock_transfer_items.md) | fk_warehouse_stock_transfer_items_lot_id_inventory_lots_numeric | `lot_id_internal_id` | `internal_id` |

## `warehouse.inventory_lots` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_warehouse_inventory_lots_created_by_users` |
| `goods_receipt_item_id` | `procurement.goods_receipt_items` | `fk_warehouse_inventory_lots_goods_receipt_item_id_goods_b158` |
| `goods_receipt_item_id_internal_id` | `procurement.goods_receipt_items` | `fk_warehouse_inventory_lots_goods_receipt_item_id_goods_b952` |
| `product_id` | `catalog.products` | `fk_warehouse_inventory_lots_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_warehouse_inventory_lots_product_id_products_numeric` |
| `supplier_id` | `procurement.suppliers` | `fk_warehouse_inventory_lots_supplier_id_suppliers` |
| `supplier_id_internal_id` | `procurement.suppliers` | `fk_warehouse_inventory_lots_supplier_id_suppliers_numeric` |
| `updated_by` | `identity.users` | `fk_warehouse_inventory_lots_updated_by_users` |
| `variant_id` | `catalog.product_variants` | `fk_warehouse_inventory_lots_variant_id_product_variants` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_warehouse_inventory_lots_variant_id_product_variants_numeric` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_inventory_lots_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_inventory_lots_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_inventory_lots_expiry_after_manufacture` | CHECK | `CHECK (manufactured_at IS NULL OR expires_at > manufactured_at)` |
| `ck_warehouse_inventory_lots_finite_numeric_values` | CHECK | `CHECK ((purchase_cost IS NULL OR (purchase_cost <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (mrp IS NULL OR (mrp <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_warehouse_inventory_lots_inventoryqualitystatus` | CHECK | `CHECK (quality_status::text = ANY (ARRAY['pending'::text, 'approved'::text, 'quarantined'::text, 'rejected'::text]))` |
| `ck_warehouse_inventory_lots_mrp_nonnegative` | CHECK | `CHECK (mrp >= 0::numeric)` |
| `ck_warehouse_inventory_lots_numeric_pair_goods_receipt_item_id` | CHECK | `CHECK ((goods_receipt_item_id IS NULL) = (goods_receipt_item_id_internal_id IS NULL))` |
| `ck_warehouse_inventory_lots_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_warehouse_inventory_lots_numeric_pair_supplier_id` | CHECK | `CHECK ((supplier_id IS NULL) = (supplier_id_internal_id IS NULL))` |
| `ck_warehouse_inventory_lots_numeric_pair_variant_id` | CHECK | `CHECK ((variant_id IS NULL) = (variant_id_internal_id IS NULL))` |
| `ck_warehouse_inventory_lots_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_inventory_lots_purchase_cost_nonnegative` | CHECK | `CHECK (purchase_cost IS NULL OR purchase_cost >= 0::numeric)` |
| `ck_warehouse_inventory_lots_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_warehouse_inventory_lots_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_lots_goods_receipt_item_id_goods_b158` | FOREIGN KEY | `FOREIGN KEY (goods_receipt_item_id) REFERENCES procurement.goods_receipt_items(id) ON DELETE SET NULL` |
| `fk_warehouse_inventory_lots_goods_receipt_item_id_goods_b952` | FOREIGN KEY | `FOREIGN KEY (goods_receipt_item_id_internal_id) REFERENCES procurement.goods_receipt_items(internal_id) ON DELETE SET NULL` |
| `fk_warehouse_inventory_lots_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_lots_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_lots_supplier_id_suppliers` | FOREIGN KEY | `FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE SET NULL` |
| `fk_warehouse_inventory_lots_supplier_id_suppliers_numeric` | FOREIGN KEY | `FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE SET NULL` |
| `fk_warehouse_inventory_lots_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_lots_variant_id_product_variants` | FOREIGN KEY | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_lots_variant_id_product_variants_numeric` | FOREIGN KEY | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_lots_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_lots_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `inventory_lot` | UNIQUE | `UNIQUE NULLS NOT DISTINCT (warehouse_id, product_id, variant_id, batch_number, expires_at)` |
| `pk_warehouse_inventory_lots` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_warehouse_inventory_lots_id` | UNIQUE | `UNIQUE (id)` |
| `inventory_lots_batch_number_not_null` | NOT NULL | `NOT NULL batch_number` |
| `inventory_lots_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `inventory_lots_expires_at_not_null` | NOT NULL | `NOT NULL expires_at` |
| `inventory_lots_id_not_null` | NOT NULL | `NOT NULL id` |
| `inventory_lots_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `inventory_lots_mrp_not_null` | NOT NULL | `NOT NULL mrp` |
| `inventory_lots_product_id_internal_id_not_null` | NOT NULL | `NOT NULL product_id_internal_id` |
| `inventory_lots_product_id_not_null` | NOT NULL | `NOT NULL product_id` |
| `inventory_lots_quality_status_not_null` | NOT NULL | `NOT NULL quality_status` |
| `inventory_lots_recall_status_not_null` | NOT NULL | `NOT NULL recall_status` |
| `inventory_lots_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `inventory_lots_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `inventory_lots_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL warehouse_id_internal_id` |
| `inventory_lots_warehouse_id_not_null` | NOT NULL | `NOT NULL warehouse_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `inventory_lot` | btree | `(warehouse_id, product_id, variant_id, batch_number, expires_at) NULLS NOT DISTINCT` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX inventory_lot ON warehouse.inventory_lots USING btree (warehouse_id, product_id, variant_id, batch_number, expires_at) NULLS NOT DISTINCT` |
| `ix_warehouse_inventory_lots_expiry` | btree | `(expires_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_inventory_lots_expiry ON warehouse.inventory_lots USING btree (expires_at)` |
| `ix_warehouse_inventory_lots_quality` | btree | `(quality_status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_inventory_lots_quality ON warehouse.inventory_lots USING btree (quality_status)` |
| `ix_warehouse_inventory_lots_supplier` | btree | `(supplier_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_inventory_lots_supplier ON warehouse.inventory_lots USING btree (supplier_id)` |
| `ix_warehouse_inventory_lots_warehouse_product` | btree | `(warehouse_id, product_id, variant_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_inventory_lots_warehouse_product ON warehouse.inventory_lots USING btree (warehouse_id, product_id, variant_id)` |
| `pk_warehouse_inventory_lots` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_warehouse_inventory_lots ON warehouse.inventory_lots USING btree (internal_id)` |
| `uq_warehouse_inventory_lots_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_inventory_lots_id ON warehouse.inventory_lots USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.inventory_lots FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["goods_receipt_item_id","goods_receipt_item_id_internal_id","procurement","goods_receipt_items"],["product_id","product_id_internal_id","catalog","products"],["supplier_id","supplier_id_internal_id","procurement","suppliers"],["variant_id","variant_id_internal_id","catalog","product_variants"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.inventory_lots FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.inventory_lots FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["goods_receipt_item_id","goods_receipt_item_id_internal_id","procurement","goods_receipt_items"],["product_id","product_id_internal_id","catalog","products"],["supplier_id","supplier_id_internal_id","procurement","suppliers"],["variant_id","variant_id_internal_id","catalog","product_variants"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
