# `warehouse.stock_reservations`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds stock reservations records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 25 columns, 28 constraints, 9 indexes, 5 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `bin_id` | `uuid` | Yes | — | Reference linking this record to bins | Ensures related business data can be joined and validated | FK → `warehouse.bins` (fk_warehouse_stock_reservations_bin_id_bins) |
| `bin_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.bins` (fk_warehouse_stock_reservations_bin_id_bins_numeric); Numeric/public-key pair verification required |
| `committed_at` | `timestamp with time zone` | Yes | — | Time of committed | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_stock_reservations_created_by_users) |
| `expires_at` | `timestamp with time zone` | No | — | Expiration time | Determine validity windows | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `lot_id` | `uuid` | No | — | Reference linking this record to inventory lots | Ensures related business data can be joined and validated | FK → `warehouse.inventory_lots` (fk_warehouse_stock_reservations_lot_id_inventory_lots) |
| `lot_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_lots` (fk_warehouse_stock_reservations_lot_id_inventory_lots_numeric); Numeric/public-key pair verification required |
| `order_id` | `uuid` | No | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` (fk_warehouse_stock_reservations_item_order); FK → `commerce.order_revisions` (fk_warehouse_stock_reservations_revision_scope) |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` (fk_warehouse_stock_reservations_item_order_numeric); FK → `commerce.order_revisions` (fk_warehouse_stock_reservations_revision_scope_numeric); Numeric/public-key pair verification required |
| `order_item_id` | `uuid` | No | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` (fk_warehouse_stock_reservations_item_order) |
| `order_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` (fk_warehouse_stock_reservations_item_order_numeric); Numeric/public-key pair verification required |
| `order_revision_id` | `uuid` | Yes | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` (fk_warehouse_stock_reservations_revision_scope) |
| `order_revision_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_revisions` (fk_warehouse_stock_reservations_revision_scope_numeric); Numeric/public-key pair verification required |
| `quantity` | `numeric(16,3)` | No | — | Quantity value | Track resource or item amounts accurately | See exact constraints |
| `released_at` | `timestamp with time zone` | Yes | — | Time of released | Support chronology, deadlines or audit evidence | See exact constraints |
| `reservation_number` | `character varying(64)` | No | — | Inferred: stores reservation number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(16)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_stock_reservations_updated_by_users) |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_warehouse_stock_reservations_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_warehouse_stock_reservations_warehouse_id_warehouses_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the stock reservations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.stock_reservations` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_warehouse_stock_reservations_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_warehouse_stock_reservations_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `bin_id` → `warehouse.bins(id)` via `fk_warehouse_stock_reservations_bin_id_bins`; `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT`
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_warehouse_stock_reservations_warehouse_id_warehouses`; `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT`
- `order_item_id, order_id` → `commerce.order_items(id, order_id)` via `fk_warehouse_stock_reservations_item_order`; `FOREIGN KEY (order_item_id, order_id) REFERENCES commerce.order_items(id, order_id) ON DELETE RESTRICT`
- `order_revision_id, order_id` → `commerce.order_revisions(id, order_id)` via `fk_warehouse_stock_reservations_revision_scope`; `FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT`
- `lot_id` → `warehouse.inventory_lots(id)` via `fk_warehouse_stock_reservations_lot_id_inventory_lots`; `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT`
- `bin_id_internal_id` → `warehouse.bins(internal_id)` via `fk_warehouse_stock_reservations_bin_id_bins_numeric`; `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT`
- `order_item_id_internal_id, order_id_internal_id` → `commerce.order_items(internal_id, order_id_internal_id)` via `fk_warehouse_stock_reservations_item_order_numeric`; `FOREIGN KEY (order_item_id_internal_id, order_id_internal_id) REFERENCES commerce.order_items(internal_id, order_id_internal_id) ON DELETE RESTRICT`
- `lot_id_internal_id` → `warehouse.inventory_lots(internal_id)` via `fk_warehouse_stock_reservations_lot_id_inventory_lots_numeric`; `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT`
- `order_revision_id_internal_id, order_id_internal_id` → `commerce.order_revisions(internal_id, order_id_internal_id)` via `fk_warehouse_stock_reservations_revision_scope_numeric`; `FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT`
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_warehouse_stock_reservations_warehouse_id_warehouses_numeric`; `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT`

**Referenced by 4 FK constraints** (sample): `commerce.order_allocations`, `commerce.order_allocations`, `commerce.order_allocations`, `commerce.order_allocations`.

## `warehouse.stock_reservations` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 25 columns, 28 constraints, 9 indexes, 5 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_warehouse_stock_reservations_created_by_users` |
| `updated_by` | `identity.users` | `fk_warehouse_stock_reservations_updated_by_users` |
| `bin_id` | `warehouse.bins` | `fk_warehouse_stock_reservations_bin_id_bins` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_stock_reservations_warehouse_id_warehouses` |
| `order_item_id`, `order_id` | `commerce.order_items` | `fk_warehouse_stock_reservations_item_order` |
| `order_revision_id`, `order_id` | `commerce.order_revisions` | `fk_warehouse_stock_reservations_revision_scope` |
| `lot_id` | `warehouse.inventory_lots` | `fk_warehouse_stock_reservations_lot_id_inventory_lots` |
| `bin_id_internal_id` | `warehouse.bins` | `fk_warehouse_stock_reservations_bin_id_bins_numeric` |
| `order_item_id_internal_id`, `order_id_internal_id` | `commerce.order_items` | `fk_warehouse_stock_reservations_item_order_numeric` |
| `lot_id_internal_id` | `warehouse.inventory_lots` | `fk_warehouse_stock_reservations_lot_id_inventory_lots_numeric` |
| `order_revision_id_internal_id`, `order_id_internal_id` | `commerce.order_revisions` | `fk_warehouse_stock_reservations_revision_scope_numeric` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_stock_reservations_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_stock_reservations_expires_after_created` | CHECK | `CHECK (expires_at > created_at)` |
| `ck_warehouse_stock_reservations_finite_numeric_values` | CHECK | `CHECK (quantity IS NULL OR (quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_warehouse_stock_reservations_numeric_pair_bin_id` | CHECK | `CHECK ((bin_id IS NULL) = (bin_id_internal_id IS NULL))` |
| `ck_warehouse_stock_reservations_numeric_pair_lot_id` | CHECK | `CHECK ((lot_id IS NULL) = (lot_id_internal_id IS NULL))` |
| `ck_warehouse_stock_reservations_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_warehouse_stock_reservations_numeric_pair_order_item_id` | CHECK | `CHECK ((order_item_id IS NULL) = (order_item_id_internal_id IS NULL))` |
| `ck_warehouse_stock_reservations_numeric_pair_order_revision_id` | CHECK | `CHECK ((order_revision_id IS NULL) = (order_revision_id_internal_id IS NULL))` |
| `ck_warehouse_stock_reservations_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_stock_reservations_quantity_positive` | CHECK | `CHECK (quantity > 0::numeric)` |
| `ck_warehouse_stock_reservations_reservationstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['active'::text, 'committed'::text, 'released'::text, 'expired'::text, 'cancelled'::text]))` |
| `ck_warehouse_stock_reservations_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_warehouse_stock_reservations_bin_id_bins` | FOREIGN KEY | `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_bin_id_bins_numeric` | FOREIGN KEY | `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_item_order` | FOREIGN KEY | `FOREIGN KEY (order_item_id, order_id) REFERENCES commerce.order_items(id, order_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_item_order_numeric` | FOREIGN KEY | `FOREIGN KEY (order_item_id_internal_id, order_id_internal_id) REFERENCES commerce.order_items(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_lot_id_inventory_lots` | FOREIGN KEY | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_lot_id_inventory_lots_numeric` | FOREIGN KEY | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_revision_scope` | FOREIGN KEY | `FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_revision_scope_numeric` | FOREIGN KEY | `FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `pk_warehouse_stock_reservations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `reservation_number` | UNIQUE | `UNIQUE (reservation_number)` |
| `uq_numeric_warehouse_stock_reservations_internal_id_ord_362d` | UNIQUE | `UNIQUE (internal_id, order_item_id_internal_id)` |
| `uq_warehouse_stock_reservations_id` | UNIQUE | `UNIQUE (id)` |
| `uq_warehouse_stock_reservations_id_item` | UNIQUE | `UNIQUE (id, order_item_id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_warehouse_stock_reservations_lot` | `CREATE INDEX ix_warehouse_stock_reservations_lot ON warehouse.stock_reservations USING btree (lot_id)` |
| `ix_warehouse_stock_reservations_order` | `CREATE INDEX ix_warehouse_stock_reservations_order ON warehouse.stock_reservations USING btree (order_id, order_item_id)` |
| `ix_warehouse_stock_reservations_status_expiry` | `CREATE INDEX ix_warehouse_stock_reservations_status_expiry ON warehouse.stock_reservations USING btree (status, expires_at)` |
| `ix_warehouse_stock_reservations_warehouse` | `CREATE INDEX ix_warehouse_stock_reservations_warehouse ON warehouse.stock_reservations USING btree (warehouse_id)` |
| `pk_warehouse_stock_reservations` | `CREATE UNIQUE INDEX pk_warehouse_stock_reservations ON warehouse.stock_reservations USING btree (internal_id)` |
| `reservation_number` | `CREATE UNIQUE INDEX reservation_number ON warehouse.stock_reservations USING btree (reservation_number)` |
| `uq_numeric_warehouse_stock_reservations_internal_id_ord_362d` | `CREATE UNIQUE INDEX uq_numeric_warehouse_stock_reservations_internal_id_ord_362d ON warehouse.stock_reservations USING btree (internal_id, order_item_id_internal_id)` |
| `uq_warehouse_stock_reservations_id` | `CREATE UNIQUE INDEX uq_warehouse_stock_reservations_id ON warehouse.stock_reservations USING btree (id)` |
| `uq_warehouse_stock_reservations_id_item` | `CREATE UNIQUE INDEX uq_warehouse_stock_reservations_id_item ON warehouse.stock_reservations USING btree (id, order_item_id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_reservations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["order_id","order_id_internal_id","commerce","orders"],["order_item_id","order_item_id_internal_id","commerce","order_items"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `ab_fulfillment_reservation` | `CREATE TRIGGER ab_fulfillment_reservation BEFORE INSERT OR UPDATE ON warehouse.stock_reservations FOR EACH ROW EXECUTE FUNCTION warehouse.guard_fulfillment_reservation()` |
| `reservation_guard` | `CREATE TRIGGER reservation_guard BEFORE INSERT OR DELETE OR UPDATE ON warehouse.stock_reservations FOR EACH ROW EXECUTE FUNCTION warehouse.guard_reservation()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.stock_reservations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_reservations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["order_id","order_id_internal_id","commerce","orders"],["order_item_id","order_item_id_internal_id","commerce","order_items"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
