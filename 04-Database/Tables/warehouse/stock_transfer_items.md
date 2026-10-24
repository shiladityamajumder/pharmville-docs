# `warehouse.stock_transfer_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds stock transfer items records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | warehouse.stock_transfer_items |
| Classification | Transactional |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 15 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_stock_transfer_items_created_by_users` |
| `dispatched_qty` | `numeric(16,3)` | No | `0` | Dispatched qty value | Track resource or item amounts accurately | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `lot_id` | `uuid` | No | — | Reference linking this record to inventory lots | Ensures related business data can be joined and validated | FK → `warehouse.inventory_lots` via `fk_warehouse_stock_transfer_items_lot_id_inventory_lots` |
| `lot_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_lots` via `fk_warehouse_stock_transfer_items_lot_id_inventory_lots_numeric` |
| `received_qty` | `numeric(16,3)` | No | `0` | Received qty value | Track resource or item amounts accurately | Exact constraints below |
| `requested_qty` | `numeric(16,3)` | No | — | Requested qty value | Track resource or item amounts accurately | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `transfer_id` | `uuid` | No | — | Reference linking this record to stock transfers | Ensures related business data can be joined and validated | FK → `warehouse.stock_transfers` via `fk_warehouse_stock_transfer_items_transfer_id_stock_transfers` |
| `transfer_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.stock_transfers` via `fk_warehouse_stock_transfer_items_transfer_id_stock_tra_9270` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_stock_transfer_items_updated_by_users` |

## Record lifecycle and users

- **Created:** when the stock transfer items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.stock_transfer_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_warehouse_stock_transfer_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_transfer_items_lot_id_inventory_lots | `lot_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_transfer_items_lot_id_inventory_lots_numeric | `lot_id_internal_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_stock_transfer_items_transfer_id_stock_tra_9270 | `transfer_id_internal_id` | [`warehouse.stock_transfers`](../../Tables/warehouse/stock_transfers.md) | `FOREIGN KEY (transfer_id_internal_id) REFERENCES warehouse.stock_transfers(internal_id) ON DELETE CASCADE` |
| fk_warehouse_stock_transfer_items_transfer_id_stock_transfers | `transfer_id` | [`warehouse.stock_transfers`](../../Tables/warehouse/stock_transfers.md) | `FOREIGN KEY (transfer_id) REFERENCES warehouse.stock_transfers(id) ON DELETE CASCADE` |
| fk_warehouse_stock_transfer_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `warehouse.stock_transfer_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_warehouse_stock_transfer_items_created_by_users` |
| `lot_id` | `warehouse.inventory_lots` | `fk_warehouse_stock_transfer_items_lot_id_inventory_lots` |
| `lot_id_internal_id` | `warehouse.inventory_lots` | `fk_warehouse_stock_transfer_items_lot_id_inventory_lots_numeric` |
| `transfer_id_internal_id` | `warehouse.stock_transfers` | `fk_warehouse_stock_transfer_items_transfer_id_stock_tra_9270` |
| `transfer_id` | `warehouse.stock_transfers` | `fk_warehouse_stock_transfer_items_transfer_id_stock_transfers` |
| `updated_by` | `identity.users` | `fk_warehouse_stock_transfer_items_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_stock_transfer_items_dispatched_qty_range` | CHECK | `CHECK (dispatched_qty >= 0::numeric AND dispatched_qty <= requested_qty)` |
| `ck_warehouse_stock_transfer_items_finite_numeric_values` | CHECK | `CHECK ((requested_qty IS NULL OR (requested_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (dispatched_qty IS NULL OR (dispatched_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (received_qty IS NULL OR (received_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_warehouse_stock_transfer_items_numeric_pair_lot_id` | CHECK | `CHECK ((lot_id IS NULL) = (lot_id_internal_id IS NULL))` |
| `ck_warehouse_stock_transfer_items_numeric_pair_transfer_id` | CHECK | `CHECK ((transfer_id IS NULL) = (transfer_id_internal_id IS NULL))` |
| `ck_warehouse_stock_transfer_items_received_qty_range` | CHECK | `CHECK (received_qty >= 0::numeric AND received_qty <= dispatched_qty)` |
| `ck_warehouse_stock_transfer_items_requested_qty_positive` | CHECK | `CHECK (requested_qty > 0::numeric)` |
| `ck_warehouse_stock_transfer_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_warehouse_stock_transfer_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_transfer_items_lot_id_inventory_lots` | FOREIGN KEY | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_transfer_items_lot_id_inventory_lots_numeric` | FOREIGN KEY | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_transfer_items_transfer_id_stock_tra_9270` | FOREIGN KEY | `FOREIGN KEY (transfer_id_internal_id) REFERENCES warehouse.stock_transfers(internal_id) ON DELETE CASCADE` |
| `fk_warehouse_stock_transfer_items_transfer_id_stock_transfers` | FOREIGN KEY | `FOREIGN KEY (transfer_id) REFERENCES warehouse.stock_transfers(id) ON DELETE CASCADE` |
| `fk_warehouse_stock_transfer_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_warehouse_stock_transfer_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_warehouse_stock_transfer_items_id` | UNIQUE | `UNIQUE (id)` |
| `stock_transfer_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `stock_transfer_items_dispatched_qty_not_null` | NOT NULL | `NOT NULL dispatched_qty` |
| `stock_transfer_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `stock_transfer_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `stock_transfer_items_lot_id_internal_id_not_null` | NOT NULL | `NOT NULL lot_id_internal_id` |
| `stock_transfer_items_lot_id_not_null` | NOT NULL | `NOT NULL lot_id` |
| `stock_transfer_items_received_qty_not_null` | NOT NULL | `NOT NULL received_qty` |
| `stock_transfer_items_requested_qty_not_null` | NOT NULL | `NOT NULL requested_qty` |
| `stock_transfer_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `stock_transfer_items_transfer_id_internal_id_not_null` | NOT NULL | `NOT NULL transfer_id_internal_id` |
| `stock_transfer_items_transfer_id_not_null` | NOT NULL | `NOT NULL transfer_id` |
| `stock_transfer_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_warehouse_stock_transfer_items_lot` | btree | `(lot_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_stock_transfer_items_lot ON warehouse.stock_transfer_items USING btree (lot_id)` |
| `ix_warehouse_stock_transfer_items_transfer` | btree | `(transfer_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_stock_transfer_items_transfer ON warehouse.stock_transfer_items USING btree (transfer_id)` |
| `pk_warehouse_stock_transfer_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_warehouse_stock_transfer_items ON warehouse.stock_transfer_items USING btree (internal_id)` |
| `uq_warehouse_stock_transfer_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_stock_transfer_items_id ON warehouse.stock_transfer_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_transfer_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["transfer_id","transfer_id_internal_id","warehouse","stock_transfers"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.stock_transfer_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_transfer_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["transfer_id","transfer_id_internal_id","warehouse","stock_transfers"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
