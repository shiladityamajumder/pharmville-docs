# warehouse.stock_balances

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds stock balances records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 20 columns, 23 constraints, 6 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `bin_id` | `uuid` | No | — | Reference linking this record to bins | Ensures related business data can be joined and validated | FK → `warehouse.bins` (fk_warehouse_stock_balances_bin_id_bins) |
| `bin_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.bins` (fk_warehouse_stock_balances_bin_id_bins_numeric); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_stock_balances_created_by_users) |
| `damaged_qty` | `numeric(16,3)` | No | `0` | Damaged qty value | Track resource or item amounts accurately | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `inventory_observed_at` | `timestamp with time zone` | Yes | — | Time of inventory observed | Support chronology, deadlines or audit evidence | See exact constraints |
| `inventory_observed_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_stock_balances_inventory_observed_by_user_id_users) |
| `inventory_source` | `character varying(64)` | Yes | — | Inferred: stores inventory source for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `lot_id` | `uuid` | No | — | Reference linking this record to inventory lots | Ensures related business data can be joined and validated | FK → `warehouse.inventory_lots` (fk_warehouse_stock_balances_lot_id_inventory_lots) |
| `lot_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_lots` (fk_warehouse_stock_balances_lot_id_inventory_lots_numeric); Numeric/public-key pair verification required |
| `on_hand_qty` | `numeric(16,3)` | No | `0` | On hand qty value | Track resource or item amounts accurately | See exact constraints |
| `quarantined_qty` | `numeric(16,3)` | No | `0` | Quarantined qty value | Track resource or item amounts accurately | See exact constraints |
| `reserved_qty` | `numeric(16,3)` | No | `0` | Reserved qty value | Track resource or item amounts accurately | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_stock_balances_updated_by_users) |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_warehouse_stock_balances_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_warehouse_stock_balances_warehouse_id_warehouses_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the stock balances business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.stock_balances` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_warehouse_stock_balances_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_warehouse_stock_balances_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_warehouse_stock_balances_warehouse_id_warehouses`; FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT
- `lot_id` → `warehouse.inventory_lots(id)` via `fk_warehouse_stock_balances_lot_id_inventory_lots`; FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT
- `bin_id` → `warehouse.bins(id)` via `fk_warehouse_stock_balances_bin_id_bins`; FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT
- `bin_id_internal_id` → `warehouse.bins(internal_id)` via `fk_warehouse_stock_balances_bin_id_bins_numeric`; FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT
- `inventory_observed_by_user_id` → `identity.users(id)` via `fk_warehouse_stock_balances_inventory_observed_by_user_id_users`; FOREIGN KEY (inventory_observed_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `lot_id_internal_id` → `warehouse.inventory_lots(internal_id)` via `fk_warehouse_stock_balances_lot_id_inventory_lots_numeric`; FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_warehouse_stock_balances_warehouse_id_warehouses_numeric`; FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT

## warehouse.stock_balances — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 20 columns, 23 constraints, 6 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_warehouse_stock_balances_created_by_users` |
| `updated_by` | `identity.users` | `fk_warehouse_stock_balances_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_stock_balances_warehouse_id_warehouses` |
| `lot_id` | `warehouse.inventory_lots` | `fk_warehouse_stock_balances_lot_id_inventory_lots` |
| `bin_id` | `warehouse.bins` | `fk_warehouse_stock_balances_bin_id_bins` |
| `bin_id_internal_id` | `warehouse.bins` | `fk_warehouse_stock_balances_bin_id_bins_numeric` |
| `inventory_observed_by_user_id` | `identity.users` | `fk_warehouse_stock_balances_inventory_observed_by_user_id_users` |
| `lot_id_internal_id` | `warehouse.inventory_lots` | `fk_warehouse_stock_balances_lot_id_inventory_lots_numeric` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_stock_balances_warehouse_id_warehouses_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_stock_balances_allocated_within_on_hand` | CHECK | `CHECK ((reserved_qty + damaged_qty + quarantined_qty) <= on_hand_qty)` |
| `ck_warehouse_stock_balances_damaged_nonnegative` | CHECK | `CHECK (damaged_qty >= 0::numeric)` |
| `ck_warehouse_stock_balances_finite_numeric_values` | CHECK | `CHECK ((on_hand_qty IS NULL OR (on_hand_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (reserved_qty IS NULL OR (reserved_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (damaged_qty IS NULL OR (damaged_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (quarantined_qty IS NULL OR (quarantined_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_warehouse_stock_balances_numeric_pair_bin_id` | CHECK | `CHECK ((bin_id IS NULL) = (bin_id_internal_id IS NULL))` |
| `ck_warehouse_stock_balances_numeric_pair_lot_id` | CHECK | `CHECK ((lot_id IS NULL) = (lot_id_internal_id IS NULL))` |
| `ck_warehouse_stock_balances_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_stock_balances_observation_evidence` | CHECK | `CHECK (inventory_observed_at IS NULL OR inventory_source IS NOT NULL AND length(btrim(inventory_source::text)) > 0 AND inventory_observed_by_user_id IS NOT NULL)` |
| `ck_warehouse_stock_balances_on_hand_nonnegative` | CHECK | `CHECK (on_hand_qty >= 0::numeric)` |
| `ck_warehouse_stock_balances_quarantined_nonnegative` | CHECK | `CHECK (quarantined_qty >= 0::numeric)` |
| `ck_warehouse_stock_balances_reserved_nonnegative` | CHECK | `CHECK (reserved_qty >= 0::numeric)` |
| `ck_warehouse_stock_balances_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_warehouse_stock_balances_bin_id_bins` | FOREIGN KEY | `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_balances_bin_id_bins_numeric` | FOREIGN KEY | `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_balances_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_balances_inventory_observed_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (inventory_observed_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_balances_lot_id_inventory_lots` | FOREIGN KEY | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_balances_lot_id_inventory_lots_numeric` | FOREIGN KEY | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_balances_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_balances_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_balances_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `pk_warehouse_stock_balances` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `stock_balance` | UNIQUE | `UNIQUE (warehouse_id, bin_id, lot_id)` |
| `uq_warehouse_stock_balances_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_warehouse_stock_balances_bin` | `CREATE INDEX ix_warehouse_stock_balances_bin ON warehouse.stock_balances USING btree (bin_id)` |
| `ix_warehouse_stock_balances_lot` | `CREATE INDEX ix_warehouse_stock_balances_lot ON warehouse.stock_balances USING btree (lot_id)` |
| `ix_warehouse_stock_balances_warehouse` | `CREATE INDEX ix_warehouse_stock_balances_warehouse ON warehouse.stock_balances USING btree (warehouse_id)` |
| `pk_warehouse_stock_balances` | `CREATE UNIQUE INDEX pk_warehouse_stock_balances ON warehouse.stock_balances USING btree (internal_id)` |
| `stock_balance` | `CREATE UNIQUE INDEX stock_balance ON warehouse.stock_balances USING btree (warehouse_id, bin_id, lot_id)` |
| `uq_warehouse_stock_balances_id` | `CREATE UNIQUE INDEX uq_warehouse_stock_balances_id ON warehouse.stock_balances USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_balances FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `inventory_observation_guard` | `CREATE TRIGGER inventory_observation_guard BEFORE INSERT OR UPDATE ON warehouse.stock_balances FOR EACH ROW EXECUTE FUNCTION warehouse.guard_inventory_observation()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.stock_balances FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_balances FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
