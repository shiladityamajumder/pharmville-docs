# warehouse.inventory_lots

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds inventory lots records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 25 columns, 26 constraints, 7 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `batch_number` | `character varying(128)` | No | — | Inferred: stores batch number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_inventory_lots_created_by_users) |
| `expires_at` | `date` | No | — | Expiration time | Determine validity windows | See exact constraints |
| `goods_receipt_item_id` | `uuid` | Yes | — | Reference linking this record to goods receipt items | Ensures related business data can be joined and validated | FK → `procurement.goods_receipt_items` (fk_warehouse_inventory_lots_goods_receipt_item_id_goods_b158) |
| `goods_receipt_item_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.goods_receipt_items` (fk_warehouse_inventory_lots_goods_receipt_item_id_goods_b952); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `manufactured_at` | `date` | Yes | — | Time of manufactured | Support chronology, deadlines or audit evidence | See exact constraints |
| `mrp` | `numeric(14,2)` | No | — | Inferred: stores mrp for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_warehouse_inventory_lots_product_id_products) |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_warehouse_inventory_lots_product_id_products_numeric); Numeric/public-key pair verification required |
| `purchase_cost` | `numeric(14,2)` | Yes | — | Inferred: stores purchase cost for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `quality_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores quality status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `recall_status` | `character varying(32)` | No | `'clear'::character varying` | Inferred: stores recall status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `received_at` | `timestamp with time zone` | Yes | — | Time of received | Support chronology, deadlines or audit evidence | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `supplier_id` | `uuid` | Yes | — | Reference linking this record to suppliers | Ensures related business data can be joined and validated | FK → `procurement.suppliers` (fk_warehouse_inventory_lots_supplier_id_suppliers) |
| `supplier_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.suppliers` (fk_warehouse_inventory_lots_supplier_id_suppliers_numeric); Numeric/public-key pair verification required |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_inventory_lots_updated_by_users) |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` (fk_warehouse_inventory_lots_variant_id_product_variants) |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` (fk_warehouse_inventory_lots_variant_id_product_variants_numeric); Numeric/public-key pair verification required |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_warehouse_inventory_lots_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_warehouse_inventory_lots_warehouse_id_warehouses_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the inventory lots business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.inventory_lots` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_warehouse_inventory_lots_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_warehouse_inventory_lots_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `goods_receipt_item_id` → `procurement.goods_receipt_items(id)` via `fk_warehouse_inventory_lots_goods_receipt_item_id_goods_b158`; FOREIGN KEY (goods_receipt_item_id) REFERENCES procurement.goods_receipt_items(id) ON DELETE SET NULL
- `variant_id` → `catalog.product_variants(id)` via `fk_warehouse_inventory_lots_variant_id_product_variants`; FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT
- `product_id` → `catalog.products(id)` via `fk_warehouse_inventory_lots_product_id_products`; FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT
- `supplier_id` → `procurement.suppliers(id)` via `fk_warehouse_inventory_lots_supplier_id_suppliers`; FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE SET NULL
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_warehouse_inventory_lots_warehouse_id_warehouses`; FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT
- `goods_receipt_item_id_internal_id` → `procurement.goods_receipt_items(internal_id)` via `fk_warehouse_inventory_lots_goods_receipt_item_id_goods_b952`; FOREIGN KEY (goods_receipt_item_id_internal_id) REFERENCES procurement.goods_receipt_items(internal_id) ON DELETE SET NULL
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_warehouse_inventory_lots_product_id_products_numeric`; FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT
- `supplier_id_internal_id` → `procurement.suppliers(internal_id)` via `fk_warehouse_inventory_lots_supplier_id_suppliers_numeric`; FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE SET NULL
- `variant_id_internal_id` → `catalog.product_variants(internal_id)` via `fk_warehouse_inventory_lots_variant_id_product_variants_numeric`; FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_warehouse_inventory_lots_warehouse_id_warehouses_numeric`; FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT

**Referenced by 22 FK constraints** (sample): `compliance.recall_lots`, `fulfillment.pick_task_items`, `fulfillment.package_items`, `procurement.purchase_return_items`, `warehouse.stock_balances`, `warehouse.stock_ledger`, `warehouse.stock_reservations`, `warehouse.stock_holds`, `warehouse.inventory_adjustment_items`, `warehouse.stock_transfer_items`, `warehouse.cycle_count_items`, `compliance.recall_lots`.

## warehouse.inventory_lots — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 25 columns, 26 constraints, 7 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_warehouse_inventory_lots_created_by_users` |
| `updated_by` | `identity.users` | `fk_warehouse_inventory_lots_updated_by_users` |
| `goods_receipt_item_id` | `procurement.goods_receipt_items` | `fk_warehouse_inventory_lots_goods_receipt_item_id_goods_b158` |
| `variant_id` | `catalog.product_variants` | `fk_warehouse_inventory_lots_variant_id_product_variants` |
| `product_id` | `catalog.products` | `fk_warehouse_inventory_lots_product_id_products` |
| `supplier_id` | `procurement.suppliers` | `fk_warehouse_inventory_lots_supplier_id_suppliers` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_inventory_lots_warehouse_id_warehouses` |
| `goods_receipt_item_id_internal_id` | `procurement.goods_receipt_items` | `fk_warehouse_inventory_lots_goods_receipt_item_id_goods_b952` |
| `product_id_internal_id` | `catalog.products` | `fk_warehouse_inventory_lots_product_id_products_numeric` |
| `supplier_id_internal_id` | `procurement.suppliers` | `fk_warehouse_inventory_lots_supplier_id_suppliers_numeric` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_warehouse_inventory_lots_variant_id_product_variants_numeric` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_inventory_lots_warehouse_id_warehouses_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `inventory_lot` | `CREATE UNIQUE INDEX inventory_lot ON warehouse.inventory_lots USING btree (warehouse_id, product_id, variant_id, batch_number, expires_at) NULLS NOT DISTINCT` |
| `ix_warehouse_inventory_lots_expiry` | `CREATE INDEX ix_warehouse_inventory_lots_expiry ON warehouse.inventory_lots USING btree (expires_at)` |
| `ix_warehouse_inventory_lots_quality` | `CREATE INDEX ix_warehouse_inventory_lots_quality ON warehouse.inventory_lots USING btree (quality_status)` |
| `ix_warehouse_inventory_lots_supplier` | `CREATE INDEX ix_warehouse_inventory_lots_supplier ON warehouse.inventory_lots USING btree (supplier_id)` |
| `ix_warehouse_inventory_lots_warehouse_product` | `CREATE INDEX ix_warehouse_inventory_lots_warehouse_product ON warehouse.inventory_lots USING btree (warehouse_id, product_id, variant_id)` |
| `pk_warehouse_inventory_lots` | `CREATE UNIQUE INDEX pk_warehouse_inventory_lots ON warehouse.inventory_lots USING btree (internal_id)` |
| `uq_warehouse_inventory_lots_id` | `CREATE UNIQUE INDEX uq_warehouse_inventory_lots_id ON warehouse.inventory_lots USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.inventory_lots FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["goods_receipt_item_id","goods_receipt_item_id_internal_id","procurement","goods_receipt_items"],["product_id","product_id_internal_id","catalog","products"],["supplier_id","supplier_id_internal_id","procurement","suppliers"],["variant_id","variant_id_internal_id","catalog","product_variants"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.inventory_lots FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.inventory_lots FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["goods_receipt_item_id","goods_receipt_item_id_internal_id","procurement","goods_receipt_items"],["product_id","product_id_internal_id","catalog","products"],["supplier_id","supplier_id_internal_id","procurement","suppliers"],["variant_id","variant_id_internal_id","catalog","product_variants"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
