# warehouse.stock_transfer_items

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds stock transfer items records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 15 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_stock_transfer_items_created_by_users) |
| `dispatched_qty` | `numeric(16,3)` | No | `0` | Dispatched qty value | Track resource or item amounts accurately | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `lot_id` | `uuid` | No | — | Reference linking this record to inventory lots | Ensures related business data can be joined and validated | FK → `warehouse.inventory_lots` (fk_warehouse_stock_transfer_items_lot_id_inventory_lots) |
| `lot_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_lots` (fk_warehouse_stock_transfer_items_lot_id_inventory_lots_numeric); Numeric/public-key pair verification required |
| `received_qty` | `numeric(16,3)` | No | `0` | Received qty value | Track resource or item amounts accurately | See exact constraints |
| `requested_qty` | `numeric(16,3)` | No | — | Requested qty value | Track resource or item amounts accurately | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `transfer_id` | `uuid` | No | — | Reference linking this record to stock transfers | Ensures related business data can be joined and validated | FK → `warehouse.stock_transfers` (fk_warehouse_stock_transfer_items_transfer_id_stock_transfers) |
| `transfer_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.stock_transfers` (fk_warehouse_stock_transfer_items_transfer_id_stock_tra_9270); Numeric/public-key pair verification required |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_stock_transfer_items_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the stock transfer items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.stock_transfer_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_warehouse_stock_transfer_items_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_warehouse_stock_transfer_items_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `lot_id` → `warehouse.inventory_lots(id)` via `fk_warehouse_stock_transfer_items_lot_id_inventory_lots`; FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT
- `transfer_id` → `warehouse.stock_transfers(id)` via `fk_warehouse_stock_transfer_items_transfer_id_stock_transfers`; FOREIGN KEY (transfer_id) REFERENCES warehouse.stock_transfers(id) ON DELETE CASCADE
- `lot_id_internal_id` → `warehouse.inventory_lots(internal_id)` via `fk_warehouse_stock_transfer_items_lot_id_inventory_lots_numeric`; FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT
- `transfer_id_internal_id` → `warehouse.stock_transfers(internal_id)` via `fk_warehouse_stock_transfer_items_transfer_id_stock_tra_9270`; FOREIGN KEY (transfer_id_internal_id) REFERENCES warehouse.stock_transfers(internal_id) ON DELETE CASCADE

## warehouse.stock_transfer_items — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 14 columns, 15 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_warehouse_stock_transfer_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_warehouse_stock_transfer_items_updated_by_users` |
| `lot_id` | `warehouse.inventory_lots` | `fk_warehouse_stock_transfer_items_lot_id_inventory_lots` |
| `transfer_id` | `warehouse.stock_transfers` | `fk_warehouse_stock_transfer_items_transfer_id_stock_transfers` |
| `lot_id_internal_id` | `warehouse.inventory_lots` | `fk_warehouse_stock_transfer_items_lot_id_inventory_lots_numeric` |
| `transfer_id_internal_id` | `warehouse.stock_transfers` | `fk_warehouse_stock_transfer_items_transfer_id_stock_tra_9270` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_warehouse_stock_transfer_items_lot` | `CREATE INDEX ix_warehouse_stock_transfer_items_lot ON warehouse.stock_transfer_items USING btree (lot_id)` |
| `ix_warehouse_stock_transfer_items_transfer` | `CREATE INDEX ix_warehouse_stock_transfer_items_transfer ON warehouse.stock_transfer_items USING btree (transfer_id)` |
| `pk_warehouse_stock_transfer_items` | `CREATE UNIQUE INDEX pk_warehouse_stock_transfer_items ON warehouse.stock_transfer_items USING btree (internal_id)` |
| `uq_warehouse_stock_transfer_items_id` | `CREATE UNIQUE INDEX uq_warehouse_stock_transfer_items_id ON warehouse.stock_transfer_items USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_transfer_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["transfer_id","transfer_id_internal_id","warehouse","stock_transfers"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.stock_transfer_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_transfer_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["transfer_id","transfer_id_internal_id","warehouse","stock_transfers"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
