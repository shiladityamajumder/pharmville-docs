# procurement.purchase_orders

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds purchase orders records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 23 columns, 19 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approved_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_purchase_orders_approved_by_user_id_users) |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_purchase_orders_created_by_users) |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | See exact constraints |
| `discount_total` | `numeric(16,2)` | No | `0` | Value of discount total | Enable pricing, reconciliation or reporting | See exact constraints |
| `expected_at` | `timestamp with time zone` | Yes | — | Time of expected | Support chronology, deadlines or audit evidence | See exact constraints |
| `grand_total` | `numeric(16,2)` | No | `0` | Value of grand total | Enable pricing, reconciliation or reporting | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `ordered_at` | `timestamp with time zone` | Yes | — | Time of ordered | Support chronology, deadlines or audit evidence | See exact constraints |
| `po_number` | `character varying(64)` | No | — | Inferred: stores po number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `requisition_id` | `uuid` | Yes | — | Reference linking this record to purchase requisitions | Ensures related business data can be joined and validated | FK → `procurement.purchase_requisitions` (fk_procurement_purchase_orders_requisition_id_purchase__59c2) |
| `requisition_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.purchase_requisitions` (fk_procurement_purchase_orders_requisition_id_purchase__ce28); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `subtotal` | `numeric(16,2)` | No | `0` | Inferred: stores subtotal for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `supplier_id` | `uuid` | No | — | Reference linking this record to suppliers | Ensures related business data can be joined and validated | FK → `procurement.suppliers` (fk_procurement_purchase_orders_supplier_id_suppliers) |
| `supplier_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.suppliers` (fk_procurement_purchase_orders_supplier_id_suppliers_numeric); Numeric/public-key pair verification required |
| `tax_total` | `numeric(16,2)` | No | `0` | Value of tax total | Enable pricing, reconciliation or reporting | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_purchase_orders_updated_by_users) |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_procurement_purchase_orders_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_procurement_purchase_orders_warehouse_id_warehouses_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the purchase orders business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.purchase_orders` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `approved_by_user_id` → `identity.users(id)` via `fk_procurement_purchase_orders_approved_by_user_id_users`; FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL
- `created_by` → `identity.users(id)` via `fk_procurement_purchase_orders_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_procurement_purchase_orders_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_procurement_purchase_orders_warehouse_id_warehouses`; FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT
- `supplier_id` → `procurement.suppliers(id)` via `fk_procurement_purchase_orders_supplier_id_suppliers`; FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE RESTRICT
- `requisition_id` → `procurement.purchase_requisitions(id)` via `fk_procurement_purchase_orders_requisition_id_purchase__59c2`; FOREIGN KEY (requisition_id) REFERENCES procurement.purchase_requisitions(id) ON DELETE SET NULL
- `requisition_id_internal_id` → `procurement.purchase_requisitions(internal_id)` via `fk_procurement_purchase_orders_requisition_id_purchase__ce28`; FOREIGN KEY (requisition_id_internal_id) REFERENCES procurement.purchase_requisitions(internal_id) ON DELETE SET NULL
- `supplier_id_internal_id` → `procurement.suppliers(internal_id)` via `fk_procurement_purchase_orders_supplier_id_suppliers_numeric`; FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE RESTRICT
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_procurement_purchase_orders_warehouse_id_warehouses_numeric`; FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT

**Referenced by 6 FK constraints** (sample): `procurement.purchase_order_items`, `procurement.supplier_invoices`, `procurement.goods_receipts`, `procurement.goods_receipts`, `procurement.purchase_order_items`, `procurement.supplier_invoices`.

## procurement.purchase_orders — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 23 columns, 19 constraints, 6 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `approved_by_user_id` | `identity.users` | `fk_procurement_purchase_orders_approved_by_user_id_users` |
| `created_by` | `identity.users` | `fk_procurement_purchase_orders_created_by_users` |
| `updated_by` | `identity.users` | `fk_procurement_purchase_orders_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_procurement_purchase_orders_warehouse_id_warehouses` |
| `supplier_id` | `procurement.suppliers` | `fk_procurement_purchase_orders_supplier_id_suppliers` |
| `requisition_id` | `procurement.purchase_requisitions` | `fk_procurement_purchase_orders_requisition_id_purchase__59c2` |
| `requisition_id_internal_id` | `procurement.purchase_requisitions` | `fk_procurement_purchase_orders_requisition_id_purchase__ce28` |
| `supplier_id_internal_id` | `procurement.suppliers` | `fk_procurement_purchase_orders_supplier_id_suppliers_numeric` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_procurement_purchase_orders_warehouse_id_warehouses_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_procurement_purchase_orders_status` | `CREATE INDEX ix_procurement_purchase_orders_status ON procurement.purchase_orders USING btree (status)` |
| `ix_procurement_purchase_orders_supplier` | `CREATE INDEX ix_procurement_purchase_orders_supplier ON procurement.purchase_orders USING btree (supplier_id)` |
| `ix_procurement_purchase_orders_warehouse` | `CREATE INDEX ix_procurement_purchase_orders_warehouse ON procurement.purchase_orders USING btree (warehouse_id)` |
| `pk_procurement_purchase_orders` | `CREATE UNIQUE INDEX pk_procurement_purchase_orders ON procurement.purchase_orders USING btree (internal_id)` |
| `po_number` | `CREATE UNIQUE INDEX po_number ON procurement.purchase_orders USING btree (po_number)` |
| `uq_procurement_purchase_orders_id` | `CREATE UNIQUE INDEX uq_procurement_purchase_orders_id ON procurement.purchase_orders USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["requisition_id","requisition_id_internal_id","procurement","purchase_requisitions"],["supplier_id","supplier_id_internal_id","procurement","suppliers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.purchase_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["requisition_id","requisition_id_internal_id","procurement","purchase_requisitions"],["supplier_id","supplier_id_internal_id","procurement","suppliers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
