# `procurement.purchase_orders`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds purchase orders records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | procurement.purchase_orders |
| Classification | Transactional |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 23 columns; 19 PK/FK/UQ/CHECK/exclusion constraints; 16 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approved_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_purchase_orders_approved_by_user_id_users` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_purchase_orders_created_by_users` |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | Collation: default |
| `discount_total` | `numeric(16,2)` | No | `0` | Value of discount total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `expected_at` | `timestamp with time zone` | Yes | — | Time of expected | Support chronology, deadlines or audit evidence | Exact constraints below |
| `grand_total` | `numeric(16,2)` | No | `0` | Value of grand total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `ordered_at` | `timestamp with time zone` | Yes | — | Time of ordered | Support chronology, deadlines or audit evidence | Exact constraints below |
| `po_number` | `character varying(64)` | No | — | Inferred: stores po number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `requisition_id` | `uuid` | Yes | — | Reference linking this record to purchase requisitions | Ensures related business data can be joined and validated | FK → `procurement.purchase_requisitions` via `fk_procurement_purchase_orders_requisition_id_purchase__59c2` |
| `requisition_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.purchase_requisitions` via `fk_procurement_purchase_orders_requisition_id_purchase__ce28` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `subtotal` | `numeric(16,2)` | No | `0` | Inferred: stores subtotal for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `supplier_id` | `uuid` | No | — | Reference linking this record to suppliers | Ensures related business data can be joined and validated | FK → `procurement.suppliers` via `fk_procurement_purchase_orders_supplier_id_suppliers` |
| `supplier_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.suppliers` via `fk_procurement_purchase_orders_supplier_id_suppliers_numeric` |
| `tax_total` | `numeric(16,2)` | No | `0` | Value of tax total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_purchase_orders_updated_by_users` |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_procurement_purchase_orders_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_procurement_purchase_orders_warehouse_id_warehouses_numeric` |

## Record lifecycle and users

- **Created:** when the purchase orders business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.purchase_orders` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_procurement_purchase_orders_approved_by_user_id_users | `approved_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_procurement_purchase_orders_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_orders_requisition_id_purchase__59c2 | `requisition_id` | [`procurement.purchase_requisitions`](../../Tables/procurement/purchase_requisitions.md) | `FOREIGN KEY (requisition_id) REFERENCES procurement.purchase_requisitions(id) ON DELETE SET NULL` |
| fk_procurement_purchase_orders_requisition_id_purchase__ce28 | `requisition_id_internal_id` | [`procurement.purchase_requisitions`](../../Tables/procurement/purchase_requisitions.md) | `FOREIGN KEY (requisition_id_internal_id) REFERENCES procurement.purchase_requisitions(internal_id) ON DELETE SET NULL` |
| fk_procurement_purchase_orders_supplier_id_suppliers | `supplier_id` | [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | `FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_orders_supplier_id_suppliers_numeric | `supplier_id_internal_id` | [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | `FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE RESTRICT` |
| fk_procurement_purchase_orders_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_orders_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_orders_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`procurement.goods_receipts`](../../Tables/procurement/goods_receipts.md) | fk_procurement_goods_receipts_purchase_order_id_purchas_6757 | `purchase_order_id_internal_id` | `internal_id` |
| [`procurement.goods_receipts`](../../Tables/procurement/goods_receipts.md) | fk_procurement_goods_receipts_purchase_order_id_purchase_orders | `purchase_order_id` | `id` |
| [`procurement.purchase_order_items`](../../Tables/procurement/purchase_order_items.md) | fk_procurement_purchase_order_items_purchase_order_id_p_bb14 | `purchase_order_id` | `id` |
| [`procurement.purchase_order_items`](../../Tables/procurement/purchase_order_items.md) | fk_procurement_purchase_order_items_purchase_order_id_p_c99d | `purchase_order_id_internal_id` | `internal_id` |
| [`procurement.supplier_invoices`](../../Tables/procurement/supplier_invoices.md) | fk_procurement_supplier_invoices_purchase_order_id_purc_1999 | `purchase_order_id_internal_id` | `internal_id` |
| [`procurement.supplier_invoices`](../../Tables/procurement/supplier_invoices.md) | fk_procurement_supplier_invoices_purchase_order_id_purc_9c6d | `purchase_order_id` | `id` |

## `procurement.purchase_orders` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `approved_by_user_id` | `identity.users` | `fk_procurement_purchase_orders_approved_by_user_id_users` |
| `created_by` | `identity.users` | `fk_procurement_purchase_orders_created_by_users` |
| `requisition_id` | `procurement.purchase_requisitions` | `fk_procurement_purchase_orders_requisition_id_purchase__59c2` |
| `requisition_id_internal_id` | `procurement.purchase_requisitions` | `fk_procurement_purchase_orders_requisition_id_purchase__ce28` |
| `supplier_id` | `procurement.suppliers` | `fk_procurement_purchase_orders_supplier_id_suppliers` |
| `supplier_id_internal_id` | `procurement.suppliers` | `fk_procurement_purchase_orders_supplier_id_suppliers_numeric` |
| `updated_by` | `identity.users` | `fk_procurement_purchase_orders_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_procurement_purchase_orders_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_procurement_purchase_orders_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_procurement_purchase_orders_expected_after_ordered` | CHECK | `CHECK (expected_at IS NULL OR ordered_at IS NULL OR expected_at >= ordered_at)` |
| `ck_procurement_purchase_orders_finite_numeric_values` | CHECK | `CHECK ((subtotal IS NULL OR (subtotal <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (discount_total IS NULL OR (discount_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (tax_total IS NULL OR (tax_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (grand_total IS NULL OR (grand_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_procurement_purchase_orders_numeric_pair_requisition_id` | CHECK | `CHECK ((requisition_id IS NULL) = (requisition_id_internal_id IS NULL))` |
| `ck_procurement_purchase_orders_numeric_pair_supplier_id` | CHECK | `CHECK ((supplier_id IS NULL) = (supplier_id_internal_id IS NULL))` |
| `ck_procurement_purchase_orders_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_procurement_purchase_orders_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_procurement_purchase_orders_totals_nonnegative` | CHECK | `CHECK (subtotal >= 0::numeric AND tax_total >= 0::numeric AND grand_total >= 0::numeric)` |
| `fk_procurement_purchase_orders_approved_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_procurement_purchase_orders_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_orders_requisition_id_purchase__59c2` | FOREIGN KEY | `FOREIGN KEY (requisition_id) REFERENCES procurement.purchase_requisitions(id) ON DELETE SET NULL` |
| `fk_procurement_purchase_orders_requisition_id_purchase__ce28` | FOREIGN KEY | `FOREIGN KEY (requisition_id_internal_id) REFERENCES procurement.purchase_requisitions(internal_id) ON DELETE SET NULL` |
| `fk_procurement_purchase_orders_supplier_id_suppliers` | FOREIGN KEY | `FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_orders_supplier_id_suppliers_numeric` | FOREIGN KEY | `FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_orders_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_orders_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_orders_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `pk_procurement_purchase_orders` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `po_number` | UNIQUE | `UNIQUE (po_number)` |
| `uq_procurement_purchase_orders_id` | UNIQUE | `UNIQUE (id)` |
| `purchase_orders_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `purchase_orders_currency_not_null` | NOT NULL | `NOT NULL currency` |
| `purchase_orders_discount_total_not_null` | NOT NULL | `NOT NULL discount_total` |
| `purchase_orders_grand_total_not_null` | NOT NULL | `NOT NULL grand_total` |
| `purchase_orders_id_not_null` | NOT NULL | `NOT NULL id` |
| `purchase_orders_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `purchase_orders_po_number_not_null` | NOT NULL | `NOT NULL po_number` |
| `purchase_orders_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `purchase_orders_status_not_null` | NOT NULL | `NOT NULL status` |
| `purchase_orders_subtotal_not_null` | NOT NULL | `NOT NULL subtotal` |
| `purchase_orders_supplier_id_internal_id_not_null` | NOT NULL | `NOT NULL supplier_id_internal_id` |
| `purchase_orders_supplier_id_not_null` | NOT NULL | `NOT NULL supplier_id` |
| `purchase_orders_tax_total_not_null` | NOT NULL | `NOT NULL tax_total` |
| `purchase_orders_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `purchase_orders_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL warehouse_id_internal_id` |
| `purchase_orders_warehouse_id_not_null` | NOT NULL | `NOT NULL warehouse_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_procurement_purchase_orders_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_purchase_orders_status ON procurement.purchase_orders USING btree (status)` |
| `ix_procurement_purchase_orders_supplier` | btree | `(supplier_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_purchase_orders_supplier ON procurement.purchase_orders USING btree (supplier_id)` |
| `ix_procurement_purchase_orders_warehouse` | btree | `(warehouse_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_purchase_orders_warehouse ON procurement.purchase_orders USING btree (warehouse_id)` |
| `pk_procurement_purchase_orders` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_procurement_purchase_orders ON procurement.purchase_orders USING btree (internal_id)` |
| `po_number` | btree | `(po_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX po_number ON procurement.purchase_orders USING btree (po_number)` |
| `uq_procurement_purchase_orders_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_procurement_purchase_orders_id ON procurement.purchase_orders USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["requisition_id","requisition_id_internal_id","procurement","purchase_requisitions"],["supplier_id","supplier_id_internal_id","procurement","suppliers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.purchase_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["requisition_id","requisition_id_internal_id","procurement","purchase_requisitions"],["supplier_id","supplier_id_internal_id","procurement","suppliers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
