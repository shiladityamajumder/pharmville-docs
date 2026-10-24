# `procurement.goods_receipts`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds goods receipts records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 19 columns, 16 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_goods_receipts_created_by_users) |
| `delivery_challan_number` | `character varying(128)` | Yes | — | Inferred: stores delivery challan number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `grn_number` | `character varying(64)` | No | — | Inferred: stores grn number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `purchase_order_id` | `uuid` | No | — | Reference linking this record to purchase orders | Ensures related business data can be joined and validated | FK → `procurement.purchase_orders` (fk_procurement_goods_receipts_purchase_order_id_purchase_orders) |
| `purchase_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.purchase_orders` (fk_procurement_goods_receipts_purchase_order_id_purchas_6757); Numeric/public-key pair verification required |
| `received_at` | `timestamp with time zone` | Yes | — | Time of received | Support chronology, deadlines or audit evidence | See exact constraints |
| `received_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_goods_receipts_received_by_user_id_users) |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `supplier_invoice_id` | `uuid` | Yes | — | Reference linking this record to supplier invoices | Ensures related business data can be joined and validated | FK → `procurement.supplier_invoices` (fk_procurement_goods_receipts_supplier_invoice_id_suppl_d9fd) |
| `supplier_invoice_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.supplier_invoices` (fk_procurement_goods_receipts_supplier_invoice_id_suppl_76a5); Numeric/public-key pair verification required |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_goods_receipts_updated_by_users) |
| `vehicle_number` | `character varying(64)` | Yes | — | Inferred: stores vehicle number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_procurement_goods_receipts_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_procurement_goods_receipts_warehouse_id_warehouses_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the goods receipts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.goods_receipts` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `received_by_user_id` → `identity.users(id)` via `fk_procurement_goods_receipts_received_by_user_id_users`; `FOREIGN KEY (received_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `created_by` → `identity.users(id)` via `fk_procurement_goods_receipts_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_procurement_goods_receipts_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `purchase_order_id` → `procurement.purchase_orders(id)` via `fk_procurement_goods_receipts_purchase_order_id_purchase_orders`; `FOREIGN KEY (purchase_order_id) REFERENCES procurement.purchase_orders(id) ON DELETE RESTRICT`
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_procurement_goods_receipts_warehouse_id_warehouses`; `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT`
- `supplier_invoice_id` → `procurement.supplier_invoices(id)` via `fk_procurement_goods_receipts_supplier_invoice_id_suppl_d9fd`; `FOREIGN KEY (supplier_invoice_id) REFERENCES procurement.supplier_invoices(id) ON DELETE SET NULL`
- `purchase_order_id_internal_id` → `procurement.purchase_orders(internal_id)` via `fk_procurement_goods_receipts_purchase_order_id_purchas_6757`; `FOREIGN KEY (purchase_order_id_internal_id) REFERENCES procurement.purchase_orders(internal_id) ON DELETE RESTRICT`
- `supplier_invoice_id_internal_id` → `procurement.supplier_invoices(internal_id)` via `fk_procurement_goods_receipts_supplier_invoice_id_suppl_76a5`; `FOREIGN KEY (supplier_invoice_id_internal_id) REFERENCES procurement.supplier_invoices(internal_id) ON DELETE SET NULL`
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_procurement_goods_receipts_warehouse_id_warehouses_numeric`; `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT`

**Referenced by 2 FK constraints** (sample): `procurement.goods_receipt_items`, `procurement.goods_receipt_items`.

## `procurement.goods_receipts` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 19 columns, 16 constraints, 6 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `received_by_user_id` | `identity.users` | `fk_procurement_goods_receipts_received_by_user_id_users` |
| `created_by` | `identity.users` | `fk_procurement_goods_receipts_created_by_users` |
| `updated_by` | `identity.users` | `fk_procurement_goods_receipts_updated_by_users` |
| `purchase_order_id` | `procurement.purchase_orders` | `fk_procurement_goods_receipts_purchase_order_id_purchase_orders` |
| `warehouse_id` | `warehouse.warehouses` | `fk_procurement_goods_receipts_warehouse_id_warehouses` |
| `supplier_invoice_id` | `procurement.supplier_invoices` | `fk_procurement_goods_receipts_supplier_invoice_id_suppl_d9fd` |
| `purchase_order_id_internal_id` | `procurement.purchase_orders` | `fk_procurement_goods_receipts_purchase_order_id_purchas_6757` |
| `supplier_invoice_id_internal_id` | `procurement.supplier_invoices` | `fk_procurement_goods_receipts_supplier_invoice_id_suppl_76a5` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_procurement_goods_receipts_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_procurement_goods_receipts_numeric_pair_purchase_order_id` | CHECK | `CHECK ((purchase_order_id IS NULL) = (purchase_order_id_internal_id IS NULL))` |
| `ck_procurement_goods_receipts_numeric_pair_supplier_invoice_id` | CHECK | `CHECK ((supplier_invoice_id IS NULL) = (supplier_invoice_id_internal_id IS NULL))` |
| `ck_procurement_goods_receipts_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_procurement_goods_receipts_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_procurement_goods_receipts_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_goods_receipts_purchase_order_id_purchas_6757` | FOREIGN KEY | `FOREIGN KEY (purchase_order_id_internal_id) REFERENCES procurement.purchase_orders(internal_id) ON DELETE RESTRICT` |
| `fk_procurement_goods_receipts_purchase_order_id_purchase_orders` | FOREIGN KEY | `FOREIGN KEY (purchase_order_id) REFERENCES procurement.purchase_orders(id) ON DELETE RESTRICT` |
| `fk_procurement_goods_receipts_received_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (received_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_goods_receipts_supplier_invoice_id_suppl_76a5` | FOREIGN KEY | `FOREIGN KEY (supplier_invoice_id_internal_id) REFERENCES procurement.supplier_invoices(internal_id) ON DELETE SET NULL` |
| `fk_procurement_goods_receipts_supplier_invoice_id_suppl_d9fd` | FOREIGN KEY | `FOREIGN KEY (supplier_invoice_id) REFERENCES procurement.supplier_invoices(id) ON DELETE SET NULL` |
| `fk_procurement_goods_receipts_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_goods_receipts_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_procurement_goods_receipts_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `grn_number` | UNIQUE | `UNIQUE (grn_number)` |
| `pk_procurement_goods_receipts` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_procurement_goods_receipts_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `grn_number` | `CREATE UNIQUE INDEX grn_number ON procurement.goods_receipts USING btree (grn_number)` |
| `ix_procurement_goods_receipts_po` | `CREATE INDEX ix_procurement_goods_receipts_po ON procurement.goods_receipts USING btree (purchase_order_id)` |
| `ix_procurement_goods_receipts_status` | `CREATE INDEX ix_procurement_goods_receipts_status ON procurement.goods_receipts USING btree (status)` |
| `ix_procurement_goods_receipts_warehouse` | `CREATE INDEX ix_procurement_goods_receipts_warehouse ON procurement.goods_receipts USING btree (warehouse_id)` |
| `pk_procurement_goods_receipts` | `CREATE UNIQUE INDEX pk_procurement_goods_receipts ON procurement.goods_receipts USING btree (internal_id)` |
| `uq_procurement_goods_receipts_id` | `CREATE UNIQUE INDEX uq_procurement_goods_receipts_id ON procurement.goods_receipts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.goods_receipts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["purchase_order_id","purchase_order_id_internal_id","procurement","purchase_orders"],["supplier_invoice_id","supplier_invoice_id_internal_id","procurement","supplier_invoices"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.goods_receipts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.goods_receipts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["purchase_order_id","purchase_order_id_internal_id","procurement","purchase_orders"],["supplier_invoice_id","supplier_invoice_id_internal_id","procurement","supplier_invoices"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
