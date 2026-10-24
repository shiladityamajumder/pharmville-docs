# `warehouse.cycle_count_items`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds cycle count items records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 18 columns, 18 constraints, 4 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `bin_id` | `uuid` | No | — | Reference linking this record to bins | Ensures related business data can be joined and validated | FK → `warehouse.bins` (fk_warehouse_cycle_count_items_bin_id_bins) |
| `bin_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.bins` (fk_warehouse_cycle_count_items_bin_id_bins_numeric); Numeric/public-key pair verification required |
| `counted_qty` | `numeric(16,3)` | Yes | — | Counted qty value | Track resource or item amounts accurately | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_cycle_count_items_created_by_users) |
| `cycle_count_id` | `uuid` | No | — | Reference linking this record to cycle counts | Ensures related business data can be joined and validated | FK → `warehouse.cycle_counts` (fk_warehouse_cycle_count_items_cycle_count_id_cycle_counts) |
| `cycle_count_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.cycle_counts` (fk_warehouse_cycle_count_items_cycle_count_id_cycle_cou_69b6); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `lot_id` | `uuid` | No | — | Reference linking this record to inventory lots | Ensures related business data can be joined and validated | FK → `warehouse.inventory_lots` (fk_warehouse_cycle_count_items_lot_id_inventory_lots) |
| `lot_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_lots` (fk_warehouse_cycle_count_items_lot_id_inventory_lots_numeric); Numeric/public-key pair verification required |
| `reason_code` | `character varying(64)` | Yes | — | Reference linking this record to stock movement reason codes | Ensures related business data can be joined and validated | FK → `warehouse.stock_movement_reason_codes` (fk_warehouse_cycle_count_items_controlled_reason) |
| `reason_code_id` | `bigint` | Yes | — | Reference linking this record to stock movement reason codes | Ensures related business data can be joined and validated | FK → `warehouse.stock_movement_reason_codes` (fk_warehouse_cycle_count_items_controlled_reason) |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `system_qty` | `numeric(16,3)` | No | — | System qty value | Track resource or item amounts accurately | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_cycle_count_items_updated_by_users) |
| `variance_qty` | `numeric(16,3)` | Yes | — | Variance qty value | Track resource or item amounts accurately | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the cycle count items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.cycle_count_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `reason_code_id, reason_code` → `warehouse.stock_movement_reason_codes(id, code)` via `fk_warehouse_cycle_count_items_controlled_reason`; `FOREIGN KEY (reason_code_id, reason_code) REFERENCES warehouse.stock_movement_reason_codes(id, code) ON DELETE RESTRICT`
- `created_by` → `identity.users(id)` via `fk_warehouse_cycle_count_items_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_warehouse_cycle_count_items_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `lot_id` → `warehouse.inventory_lots(id)` via `fk_warehouse_cycle_count_items_lot_id_inventory_lots`; `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT`
- `bin_id` → `warehouse.bins(id)` via `fk_warehouse_cycle_count_items_bin_id_bins`; `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT`
- `cycle_count_id` → `warehouse.cycle_counts(id)` via `fk_warehouse_cycle_count_items_cycle_count_id_cycle_counts`; `FOREIGN KEY (cycle_count_id) REFERENCES warehouse.cycle_counts(id) ON DELETE CASCADE`
- `bin_id_internal_id` → `warehouse.bins(internal_id)` via `fk_warehouse_cycle_count_items_bin_id_bins_numeric`; `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT`
- `cycle_count_id_internal_id` → `warehouse.cycle_counts(internal_id)` via `fk_warehouse_cycle_count_items_cycle_count_id_cycle_cou_69b6`; `FOREIGN KEY (cycle_count_id_internal_id) REFERENCES warehouse.cycle_counts(internal_id) ON DELETE CASCADE`
- `lot_id_internal_id` → `warehouse.inventory_lots(internal_id)` via `fk_warehouse_cycle_count_items_lot_id_inventory_lots_numeric`; `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT`

## `warehouse.cycle_count_items` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 18 columns, 18 constraints, 4 indexes, 4 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `reason_code_id`, `reason_code` | `warehouse.stock_movement_reason_codes` | `fk_warehouse_cycle_count_items_controlled_reason` |
| `created_by` | `identity.users` | `fk_warehouse_cycle_count_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_warehouse_cycle_count_items_updated_by_users` |
| `lot_id` | `warehouse.inventory_lots` | `fk_warehouse_cycle_count_items_lot_id_inventory_lots` |
| `bin_id` | `warehouse.bins` | `fk_warehouse_cycle_count_items_bin_id_bins` |
| `cycle_count_id` | `warehouse.cycle_counts` | `fk_warehouse_cycle_count_items_cycle_count_id_cycle_counts` |
| `bin_id_internal_id` | `warehouse.bins` | `fk_warehouse_cycle_count_items_bin_id_bins_numeric` |
| `cycle_count_id_internal_id` | `warehouse.cycle_counts` | `fk_warehouse_cycle_count_items_cycle_count_id_cycle_cou_69b6` |
| `lot_id_internal_id` | `warehouse.inventory_lots` | `fk_warehouse_cycle_count_items_lot_id_inventory_lots_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_cycle_count_items_controlled_reason_pair` | CHECK | `CHECK (reason_code_id IS NULL OR reason_code IS NOT NULL)` |
| `ck_warehouse_cycle_count_items_finite_numeric_values` | CHECK | `CHECK ((system_qty IS NULL OR (system_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (counted_qty IS NULL OR (counted_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (variance_qty IS NULL OR (variance_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_warehouse_cycle_count_items_numeric_pair_bin_id` | CHECK | `CHECK ((bin_id IS NULL) = (bin_id_internal_id IS NULL))` |
| `ck_warehouse_cycle_count_items_numeric_pair_cycle_count_id` | CHECK | `CHECK ((cycle_count_id IS NULL) = (cycle_count_id_internal_id IS NULL))` |
| `ck_warehouse_cycle_count_items_numeric_pair_lot_id` | CHECK | `CHECK ((lot_id IS NULL) = (lot_id_internal_id IS NULL))` |
| `ck_warehouse_cycle_count_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_warehouse_cycle_count_items_system_qty_nonnegative` | CHECK | `CHECK (system_qty >= 0::numeric)` |
| `fk_warehouse_cycle_count_items_bin_id_bins` | FOREIGN KEY | `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_count_items_bin_id_bins_numeric` | FOREIGN KEY | `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_count_items_controlled_reason` | FOREIGN KEY | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES warehouse.stock_movement_reason_codes(id, code) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_count_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_count_items_cycle_count_id_cycle_cou_69b6` | FOREIGN KEY | `FOREIGN KEY (cycle_count_id_internal_id) REFERENCES warehouse.cycle_counts(internal_id) ON DELETE CASCADE` |
| `fk_warehouse_cycle_count_items_cycle_count_id_cycle_counts` | FOREIGN KEY | `FOREIGN KEY (cycle_count_id) REFERENCES warehouse.cycle_counts(id) ON DELETE CASCADE` |
| `fk_warehouse_cycle_count_items_lot_id_inventory_lots` | FOREIGN KEY | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_count_items_lot_id_inventory_lots_numeric` | FOREIGN KEY | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_count_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_warehouse_cycle_count_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_warehouse_cycle_count_items_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_warehouse_cycle_count_items_count` | `CREATE INDEX ix_warehouse_cycle_count_items_count ON warehouse.cycle_count_items USING btree (cycle_count_id)` |
| `ix_warehouse_cycle_count_items_lot` | `CREATE INDEX ix_warehouse_cycle_count_items_lot ON warehouse.cycle_count_items USING btree (lot_id)` |
| `pk_warehouse_cycle_count_items` | `CREATE UNIQUE INDEX pk_warehouse_cycle_count_items ON warehouse.cycle_count_items USING btree (internal_id)` |
| `uq_warehouse_cycle_count_items_id` | `CREATE UNIQUE INDEX uq_warehouse_cycle_count_items_id ON warehouse.cycle_count_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.cycle_count_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["cycle_count_id","cycle_count_id_internal_id","warehouse","cycle_counts"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"]]', 'internal_id', 'id')` |
| `controlled_reason` | `CREATE TRIGGER controlled_reason BEFORE INSERT OR UPDATE ON warehouse.cycle_count_items FOR EACH ROW EXECUTE FUNCTION platform.normalize_reason('warehouse.stock_movement_reason_codes')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.cycle_count_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.cycle_count_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["cycle_count_id","cycle_count_id_internal_id","warehouse","cycle_counts"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
