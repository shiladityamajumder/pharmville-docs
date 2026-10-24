# `procurement.goods_receipt_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds goods receipt items records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | procurement.goods_receipt_items |
| Classification | Transactional |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 20 columns; 16 PK/FK/UQ/CHECK/exclusion constraints; 17 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `accepted_qty` | `numeric(16,3)` | No | — | Accepted qty value | Track resource or item amounts accurately | Exact constraints below |
| `batch_number` | `character varying(128)` | No | — | Inferred: stores batch number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_goods_receipt_items_created_by_users` |
| `expiry_date` | `date` | No | — | Inferred: stores expiry date for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `goods_receipt_id` | `uuid` | No | — | Reference linking this record to goods receipts | Ensures related business data can be joined and validated | FK → `procurement.goods_receipts` via `fk_procurement_goods_receipt_items_goods_receipt_id_goo_9f1b` |
| `goods_receipt_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.goods_receipts` via `fk_procurement_goods_receipt_items_goods_receipt_id_goo_f01c` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `manufactured_at` | `date` | Yes | — | Time of manufactured | Support chronology, deadlines or audit evidence | Exact constraints below |
| `mrp` | `numeric(14,2)` | No | — | Inferred: stores mrp for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `purchase_order_item_id` | `uuid` | No | — | Reference linking this record to purchase order items | Ensures related business data can be joined and validated | FK → `procurement.purchase_order_items` via `fk_procurement_goods_receipt_items_purchase_order_item__eead` |
| `purchase_order_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.purchase_order_items` via `fk_procurement_goods_receipt_items_purchase_order_item__9047` |
| `quality_status` | `character varying(32)` | No | `'pending'::character varying` | Inferred: stores quality status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `received_qty` | `numeric(16,3)` | No | — | Received qty value | Track resource or item amounts accurately | Exact constraints below |
| `rejected_qty` | `numeric(16,3)` | No | `0` | Rejected qty value | Track resource or item amounts accurately | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `unit_cost` | `numeric(14,2)` | No | — | Inferred: stores unit cost for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_goods_receipt_items_updated_by_users` |

## Record lifecycle and users

- **Created:** when the goods receipt items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.goods_receipt_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_procurement_goods_receipt_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_goods_receipt_items_goods_receipt_id_goo_9f1b | `goods_receipt_id` | [`procurement.goods_receipts`](../../Tables/procurement/goods_receipts.md) | `FOREIGN KEY (goods_receipt_id) REFERENCES procurement.goods_receipts(id) ON DELETE CASCADE` |
| fk_procurement_goods_receipt_items_goods_receipt_id_goo_f01c | `goods_receipt_id_internal_id` | [`procurement.goods_receipts`](../../Tables/procurement/goods_receipts.md) | `FOREIGN KEY (goods_receipt_id_internal_id) REFERENCES procurement.goods_receipts(internal_id) ON DELETE CASCADE` |
| fk_procurement_goods_receipt_items_purchase_order_item__9047 | `purchase_order_item_id_internal_id` | [`procurement.purchase_order_items`](../../Tables/procurement/purchase_order_items.md) | `FOREIGN KEY (purchase_order_item_id_internal_id) REFERENCES procurement.purchase_order_items(internal_id) ON DELETE RESTRICT` |
| fk_procurement_goods_receipt_items_purchase_order_item__eead | `purchase_order_item_id` | [`procurement.purchase_order_items`](../../Tables/procurement/purchase_order_items.md) | `FOREIGN KEY (purchase_order_item_id) REFERENCES procurement.purchase_order_items(id) ON DELETE RESTRICT` |
| fk_procurement_goods_receipt_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`procurement.goods_receipt_quality_checks`](../../Tables/procurement/goods_receipt_quality_checks.md) | fk_procurement_goods_receipt_quality_checks_goods_recei_6c95 | `goods_receipt_item_id_internal_id` | `internal_id` |
| [`procurement.goods_receipt_quality_checks`](../../Tables/procurement/goods_receipt_quality_checks.md) | fk_procurement_goods_receipt_quality_checks_goods_recei_ac2c | `goods_receipt_item_id` | `id` |
| [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | fk_warehouse_inventory_lots_goods_receipt_item_id_goods_b158 | `goods_receipt_item_id` | `id` |
| [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | fk_warehouse_inventory_lots_goods_receipt_item_id_goods_b952 | `goods_receipt_item_id_internal_id` | `internal_id` |

## `procurement.goods_receipt_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_goods_receipt_items_created_by_users` |
| `goods_receipt_id` | `procurement.goods_receipts` | `fk_procurement_goods_receipt_items_goods_receipt_id_goo_9f1b` |
| `goods_receipt_id_internal_id` | `procurement.goods_receipts` | `fk_procurement_goods_receipt_items_goods_receipt_id_goo_f01c` |
| `purchase_order_item_id_internal_id` | `procurement.purchase_order_items` | `fk_procurement_goods_receipt_items_purchase_order_item__9047` |
| `purchase_order_item_id` | `procurement.purchase_order_items` | `fk_procurement_goods_receipt_items_purchase_order_item__eead` |
| `updated_by` | `identity.users` | `fk_procurement_goods_receipt_items_updated_by_users` |

### Existing constraints

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
| `goods_receipt_items_accepted_qty_not_null` | NOT NULL | `NOT NULL accepted_qty` |
| `goods_receipt_items_batch_number_not_null` | NOT NULL | `NOT NULL batch_number` |
| `goods_receipt_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `goods_receipt_items_expiry_date_not_null` | NOT NULL | `NOT NULL expiry_date` |
| `goods_receipt_items_goods_receipt_id_internal_id_not_null` | NOT NULL | `NOT NULL goods_receipt_id_internal_id` |
| `goods_receipt_items_goods_receipt_id_not_null` | NOT NULL | `NOT NULL goods_receipt_id` |
| `goods_receipt_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `goods_receipt_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `goods_receipt_items_mrp_not_null` | NOT NULL | `NOT NULL mrp` |
| `goods_receipt_items_purchase_order_item_id_internal_id_not_null` | NOT NULL | `NOT NULL purchase_order_item_id_internal_id` |
| `goods_receipt_items_purchase_order_item_id_not_null` | NOT NULL | `NOT NULL purchase_order_item_id` |
| `goods_receipt_items_quality_status_not_null` | NOT NULL | `NOT NULL quality_status` |
| `goods_receipt_items_received_qty_not_null` | NOT NULL | `NOT NULL received_qty` |
| `goods_receipt_items_rejected_qty_not_null` | NOT NULL | `NOT NULL rejected_qty` |
| `goods_receipt_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `goods_receipt_items_unit_cost_not_null` | NOT NULL | `NOT NULL unit_cost` |
| `goods_receipt_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_procurement_goods_receipt_items_grn` | btree | `(goods_receipt_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_goods_receipt_items_grn ON procurement.goods_receipt_items USING btree (goods_receipt_id)` |
| `ix_procurement_goods_receipt_items_po_item` | btree | `(purchase_order_item_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_goods_receipt_items_po_item ON procurement.goods_receipt_items USING btree (purchase_order_item_id)` |
| `pk_procurement_goods_receipt_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_procurement_goods_receipt_items ON procurement.goods_receipt_items USING btree (internal_id)` |
| `uq_procurement_goods_receipt_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_procurement_goods_receipt_items_id ON procurement.goods_receipt_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.goods_receipt_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["goods_receipt_id","goods_receipt_id_internal_id","procurement","goods_receipts"],["purchase_order_item_id","purchase_order_item_id_internal_id","procurement","purchase_order_items"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.goods_receipt_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.goods_receipt_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["goods_receipt_id","goods_receipt_id_internal_id","procurement","goods_receipts"],["purchase_order_item_id","purchase_order_item_id_internal_id","procurement","purchase_order_items"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
