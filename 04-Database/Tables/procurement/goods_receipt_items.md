# procurement.goods_receipt_items

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds goods receipt items records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 20 columns, 16 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `accepted_qty` | `numeric(16,3)` | No | — | Accepted qty value | Track resource or item amounts accurately | See exact constraints |
| `batch_number` | `character varying(128)` | No | — | Inferred: stores batch number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_goods_receipt_items_created_by_users) |
| `expiry_date` | `date` | No | — | Inferred: stores expiry date for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `goods_receipt_id` | `uuid` | No | — | Reference linking this record to goods receipts | Ensures related business data can be joined and validated | FK → `procurement.goods_receipts` (fk_procurement_goods_receipt_items_goods_receipt_id_goo_9f1b) |
| `goods_receipt_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.goods_receipts` (fk_procurement_goods_receipt_items_goods_receipt_id_goo_f01c); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `manufactured_at` | `date` | Yes | — | Time of manufactured | Support chronology, deadlines or audit evidence | See exact constraints |
| `mrp` | `numeric(14,2)` | No | — | Inferred: stores mrp for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `purchase_order_item_id` | `uuid` | No | — | Reference linking this record to purchase order items | Ensures related business data can be joined and validated | FK → `procurement.purchase_order_items` (fk_procurement_goods_receipt_items_purchase_order_item__eead) |
| `purchase_order_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.purchase_order_items` (fk_procurement_goods_receipt_items_purchase_order_item__9047); Numeric/public-key pair verification required |
| `quality_status` | `character varying(32)` | No | `'pending'::character varying` | Inferred: stores quality status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `received_qty` | `numeric(16,3)` | No | — | Received qty value | Track resource or item amounts accurately | See exact constraints |
| `rejected_qty` | `numeric(16,3)` | No | `0` | Rejected qty value | Track resource or item amounts accurately | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `unit_cost` | `numeric(14,2)` | No | — | Inferred: stores unit cost for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_goods_receipt_items_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the goods receipt items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.goods_receipt_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_procurement_goods_receipt_items_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_procurement_goods_receipt_items_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `purchase_order_item_id` → `procurement.purchase_order_items(id)` via `fk_procurement_goods_receipt_items_purchase_order_item__eead`; FOREIGN KEY (purchase_order_item_id) REFERENCES procurement.purchase_order_items(id) ON DELETE RESTRICT
- `goods_receipt_id` → `procurement.goods_receipts(id)` via `fk_procurement_goods_receipt_items_goods_receipt_id_goo_9f1b`; FOREIGN KEY (goods_receipt_id) REFERENCES procurement.goods_receipts(id) ON DELETE CASCADE
- `goods_receipt_id_internal_id` → `procurement.goods_receipts(internal_id)` via `fk_procurement_goods_receipt_items_goods_receipt_id_goo_f01c`; FOREIGN KEY (goods_receipt_id_internal_id) REFERENCES procurement.goods_receipts(internal_id) ON DELETE CASCADE
- `purchase_order_item_id_internal_id` → `procurement.purchase_order_items(internal_id)` via `fk_procurement_goods_receipt_items_purchase_order_item__9047`; FOREIGN KEY (purchase_order_item_id_internal_id) REFERENCES procurement.purchase_order_items(internal_id) ON DELETE RESTRICT

**Referenced by 4 FK constraints** (sample): `procurement.goods_receipt_quality_checks`, `warehouse.inventory_lots`, `procurement.goods_receipt_quality_checks`, `warehouse.inventory_lots`.

## procurement.goods_receipt_items — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 20 columns, 16 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_goods_receipt_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_procurement_goods_receipt_items_updated_by_users` |
| `purchase_order_item_id` | `procurement.purchase_order_items` | `fk_procurement_goods_receipt_items_purchase_order_item__eead` |
| `goods_receipt_id` | `procurement.goods_receipts` | `fk_procurement_goods_receipt_items_goods_receipt_id_goo_9f1b` |
| `goods_receipt_id_internal_id` | `procurement.goods_receipts` | `fk_procurement_goods_receipt_items_goods_receipt_id_goo_f01c` |
| `purchase_order_item_id_internal_id` | `procurement.purchase_order_items` | `fk_procurement_goods_receipt_items_purchase_order_item__9047` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_procurement_goods_receipt_items_accept_reject_nonnegative` | CHECK | `CHECK (accepted_qty >= 0::numeric AND rejected_qty >= 0::numeric)` |
| `ck_procurement_goods_receipt_items_finite_numeric_values` | CHECK | `CHECK ((received_qty IS NULL OR (received_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (accepted_qty IS NULL OR (accepted_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (rejected_qty IS NULL OR (rejected_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (mrp IS NULL OR (mrp <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (unit_cost IS NULL OR (unit_cost <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_procurement_goods_receipt_items_numeric_pair_goods_r_3f60` | CHECK | `CHECK ((goods_receipt_id IS NULL) = (goods_receipt_id_internal_id IS NULL))` |
| `ck_procurement_goods_receipt_items_numeric_pair_purchas_b64a` | CHECK | `CHECK ((purchase_order_item_id IS NULL) = (purchase_order_item_id_internal_id IS NULL))` |
| `ck_procurement_goods_receipt_items_prices_nonnegative` | CHECK | `CHECK (mrp >= 0::numeric AND unit_cost >= 0::numeric)` |
| `ck_procurement_goods_receipt_items_quantity_reconciliation` | CHECK | `CHECK ((accepted_qty + rejected_qty) = received_qty)` |
| `ck_procurement_goods_receipt_items_received_qty_positive` | CHECK | `CHECK (received_qty > 0::numeric)` |
| `ck_procurement_goods_receipt_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_procurement_goods_receipt_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_goods_receipt_items_goods_receipt_id_goo_9f1b` | FOREIGN KEY | `FOREIGN KEY (goods_receipt_id) REFERENCES procurement.goods_receipts(id) ON DELETE CASCADE` |
| `fk_procurement_goods_receipt_items_goods_receipt_id_goo_f01c` | FOREIGN KEY | `FOREIGN KEY (goods_receipt_id_internal_id) REFERENCES procurement.goods_receipts(internal_id) ON DELETE CASCADE` |
| `fk_procurement_goods_receipt_items_purchase_order_item__9047` | FOREIGN KEY | `FOREIGN KEY (purchase_order_item_id_internal_id) REFERENCES procurement.purchase_order_items(internal_id) ON DELETE RESTRICT` |
| `fk_procurement_goods_receipt_items_purchase_order_item__eead` | FOREIGN KEY | `FOREIGN KEY (purchase_order_item_id) REFERENCES procurement.purchase_order_items(id) ON DELETE RESTRICT` |
| `fk_procurement_goods_receipt_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_procurement_goods_receipt_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_procurement_goods_receipt_items_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_procurement_goods_receipt_items_grn` | `CREATE INDEX ix_procurement_goods_receipt_items_grn ON procurement.goods_receipt_items USING btree (goods_receipt_id)` |
| `ix_procurement_goods_receipt_items_po_item` | `CREATE INDEX ix_procurement_goods_receipt_items_po_item ON procurement.goods_receipt_items USING btree (purchase_order_item_id)` |
| `pk_procurement_goods_receipt_items` | `CREATE UNIQUE INDEX pk_procurement_goods_receipt_items ON procurement.goods_receipt_items USING btree (internal_id)` |
| `uq_procurement_goods_receipt_items_id` | `CREATE UNIQUE INDEX uq_procurement_goods_receipt_items_id ON procurement.goods_receipt_items USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.goods_receipt_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["goods_receipt_id","goods_receipt_id_internal_id","procurement","goods_receipts"],["purchase_order_item_id","purchase_order_item_id_internal_id","procurement","purchase_order_items"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.goods_receipt_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.goods_receipt_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["goods_receipt_id","goods_receipt_id_internal_id","procurement","goods_receipts"],["purchase_order_item_id","purchase_order_item_id_internal_id","procurement","purchase_order_items"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
