# `procurement.goods_receipts`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds goods receipts records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | procurement.goods_receipts |
| Classification | Transactional |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 19 columns; 16 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_goods_receipts_created_by_users` |
| `delivery_challan_number` | `character varying(128)` | Yes | — | Inferred: stores delivery challan number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `grn_number` | `character varying(64)` | No | — | Inferred: stores grn number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `purchase_order_id` | `uuid` | No | — | Reference linking this record to purchase orders | Ensures related business data can be joined and validated | FK → `procurement.purchase_orders` via `fk_procurement_goods_receipts_purchase_order_id_purchase_orders` |
| `purchase_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.purchase_orders` via `fk_procurement_goods_receipts_purchase_order_id_purchas_6757` |
| `received_at` | `timestamp with time zone` | Yes | — | Time of received | Support chronology, deadlines or audit evidence | Exact constraints below |
| `received_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_goods_receipts_received_by_user_id_users` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `supplier_invoice_id` | `uuid` | Yes | — | Reference linking this record to supplier invoices | Ensures related business data can be joined and validated | FK → `procurement.supplier_invoices` via `fk_procurement_goods_receipts_supplier_invoice_id_suppl_d9fd` |
| `supplier_invoice_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.supplier_invoices` via `fk_procurement_goods_receipts_supplier_invoice_id_suppl_76a5` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_goods_receipts_updated_by_users` |
| `vehicle_number` | `character varying(64)` | Yes | — | Inferred: stores vehicle number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_procurement_goods_receipts_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_procurement_goods_receipts_warehouse_id_warehouses_numeric` |

## Record lifecycle and users

- **Created:** when the goods receipts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.goods_receipts` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_procurement_goods_receipts_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_goods_receipts_purchase_order_id_purchas_6757 | `purchase_order_id_internal_id` | [`procurement.purchase_orders`](../../Tables/procurement/purchase_orders.md) | `FOREIGN KEY (purchase_order_id_internal_id) REFERENCES procurement.purchase_orders(internal_id) ON DELETE RESTRICT` |
| fk_procurement_goods_receipts_purchase_order_id_purchase_orders | `purchase_order_id` | [`procurement.purchase_orders`](../../Tables/procurement/purchase_orders.md) | `FOREIGN KEY (purchase_order_id) REFERENCES procurement.purchase_orders(id) ON DELETE RESTRICT` |
| fk_procurement_goods_receipts_received_by_user_id_users | `received_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (received_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_goods_receipts_supplier_invoice_id_suppl_76a5 | `supplier_invoice_id_internal_id` | [`procurement.supplier_invoices`](../../Tables/procurement/supplier_invoices.md) | `FOREIGN KEY (supplier_invoice_id_internal_id) REFERENCES procurement.supplier_invoices(internal_id) ON DELETE SET NULL` |
| fk_procurement_goods_receipts_supplier_invoice_id_suppl_d9fd | `supplier_invoice_id` | [`procurement.supplier_invoices`](../../Tables/procurement/supplier_invoices.md) | `FOREIGN KEY (supplier_invoice_id) REFERENCES procurement.supplier_invoices(id) ON DELETE SET NULL` |
| fk_procurement_goods_receipts_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_goods_receipts_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| fk_procurement_goods_receipts_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`procurement.goods_receipt_items`](../../Tables/procurement/goods_receipt_items.md) | fk_procurement_goods_receipt_items_goods_receipt_id_goo_9f1b | `goods_receipt_id` | `id` |
| [`procurement.goods_receipt_items`](../../Tables/procurement/goods_receipt_items.md) | fk_procurement_goods_receipt_items_goods_receipt_id_goo_f01c | `goods_receipt_id_internal_id` | `internal_id` |

## `procurement.goods_receipts` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_goods_receipts_created_by_users` |
| `purchase_order_id_internal_id` | `procurement.purchase_orders` | `fk_procurement_goods_receipts_purchase_order_id_purchas_6757` |
| `purchase_order_id` | `procurement.purchase_orders` | `fk_procurement_goods_receipts_purchase_order_id_purchase_orders` |
| `received_by_user_id` | `identity.users` | `fk_procurement_goods_receipts_received_by_user_id_users` |
| `supplier_invoice_id_internal_id` | `procurement.supplier_invoices` | `fk_procurement_goods_receipts_supplier_invoice_id_suppl_76a5` |
| `supplier_invoice_id` | `procurement.supplier_invoices` | `fk_procurement_goods_receipts_supplier_invoice_id_suppl_d9fd` |
| `updated_by` | `identity.users` | `fk_procurement_goods_receipts_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_procurement_goods_receipts_warehouse_id_warehouses` |
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
| `goods_receipts_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `goods_receipts_grn_number_not_null` | NOT NULL | `NOT NULL grn_number` |
| `goods_receipts_id_not_null` | NOT NULL | `NOT NULL id` |
| `goods_receipts_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `goods_receipts_purchase_order_id_internal_id_not_null` | NOT NULL | `NOT NULL purchase_order_id_internal_id` |
| `goods_receipts_purchase_order_id_not_null` | NOT NULL | `NOT NULL purchase_order_id` |
| `goods_receipts_received_by_user_id_not_null` | NOT NULL | `NOT NULL received_by_user_id` |
| `goods_receipts_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `goods_receipts_status_not_null` | NOT NULL | `NOT NULL status` |
| `goods_receipts_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `goods_receipts_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL warehouse_id_internal_id` |
| `goods_receipts_warehouse_id_not_null` | NOT NULL | `NOT NULL warehouse_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `grn_number` | btree | `(grn_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX grn_number ON procurement.goods_receipts USING btree (grn_number)` |
| `ix_procurement_goods_receipts_po` | btree | `(purchase_order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_goods_receipts_po ON procurement.goods_receipts USING btree (purchase_order_id)` |
| `ix_procurement_goods_receipts_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_goods_receipts_status ON procurement.goods_receipts USING btree (status)` |
| `ix_procurement_goods_receipts_warehouse` | btree | `(warehouse_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_goods_receipts_warehouse ON procurement.goods_receipts USING btree (warehouse_id)` |
| `pk_procurement_goods_receipts` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_procurement_goods_receipts ON procurement.goods_receipts USING btree (internal_id)` |
| `uq_procurement_goods_receipts_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_procurement_goods_receipts_id ON procurement.goods_receipts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.goods_receipts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["purchase_order_id","purchase_order_id_internal_id","procurement","purchase_orders"],["supplier_invoice_id","supplier_invoice_id_internal_id","procurement","supplier_invoices"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.goods_receipts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.goods_receipts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["purchase_order_id","purchase_order_id_internal_id","procurement","purchase_orders"],["supplier_invoice_id","supplier_invoice_id_internal_id","procurement","supplier_invoices"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
