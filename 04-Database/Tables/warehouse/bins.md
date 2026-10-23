# warehouse.bins

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds bins records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 17 constraints, 7 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `bin_type` | `character varying(32)` | No | — | Inferred: stores bin type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `capacity_json` | `jsonb` | No | `'{}'::jsonb` | Structured capacity json information | Retain a versioned payload or relevant details | See exact constraints |
| `code` | `character varying(128)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_bins_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_bins_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `pick_sequence` | `integer` | Yes | — | Inferred: stores pick sequence for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `rack_id` | `uuid` | Yes | — | Reference linking this record to racks | Ensures related business data can be joined and validated | FK → `warehouse.racks` (fk_warehouse_bins_rack_id_racks) |
| `rack_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.racks` (fk_warehouse_bins_rack_id_racks_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_bins_updated_by_users) |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_warehouse_bins_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_warehouse_bins_warehouse_id_warehouses_numeric); Numeric/public-key pair verification required |
| `zone_id` | `uuid` | No | — | Reference linking this record to zones | Ensures related business data can be joined and validated | FK → `warehouse.zones` (fk_warehouse_bins_zone_id_zones) |
| `zone_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.zones` (fk_warehouse_bins_zone_id_zones_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the bins business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.bins` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_warehouse_bins_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_warehouse_bins_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_warehouse_bins_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `zone_id` → `warehouse.zones(id)` via `fk_warehouse_bins_zone_id_zones`; FOREIGN KEY (zone_id) REFERENCES warehouse.zones(id) ON DELETE CASCADE
- `rack_id` → `warehouse.racks(id)` via `fk_warehouse_bins_rack_id_racks`; FOREIGN KEY (rack_id) REFERENCES warehouse.racks(id) ON DELETE SET NULL
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_warehouse_bins_warehouse_id_warehouses`; FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE CASCADE
- `rack_id_internal_id` → `warehouse.racks(internal_id)` via `fk_warehouse_bins_rack_id_racks_numeric`; FOREIGN KEY (rack_id_internal_id) REFERENCES warehouse.racks(internal_id) ON DELETE SET NULL
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_warehouse_bins_warehouse_id_warehouses_numeric`; FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE CASCADE
- `zone_id_internal_id` → `warehouse.zones(internal_id)` via `fk_warehouse_bins_zone_id_zones_numeric`; FOREIGN KEY (zone_id_internal_id) REFERENCES warehouse.zones(internal_id) ON DELETE CASCADE

**Referenced by 16 FK constraints** (sample): `fulfillment.pick_task_items`, `warehouse.stock_balances`, `warehouse.stock_ledger`, `warehouse.stock_reservations`, `warehouse.stock_holds`, `warehouse.inventory_adjustment_items`, `warehouse.cycle_counts`, `warehouse.cycle_count_items`, `fulfillment.pick_task_items`, `warehouse.cycle_count_items`, `warehouse.cycle_counts`, `warehouse.inventory_adjustment_items`.

## warehouse.bins — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 21 columns, 17 constraints, 7 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_warehouse_bins_created_by_users` |
| `deleted_by` | `identity.users` | `fk_warehouse_bins_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_warehouse_bins_updated_by_users` |
| `zone_id` | `warehouse.zones` | `fk_warehouse_bins_zone_id_zones` |
| `rack_id` | `warehouse.racks` | `fk_warehouse_bins_rack_id_racks` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_bins_warehouse_id_warehouses` |
| `rack_id_internal_id` | `warehouse.racks` | `fk_warehouse_bins_rack_id_racks_numeric` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_bins_warehouse_id_warehouses_numeric` |
| `zone_id_internal_id` | `warehouse.zones` | `fk_warehouse_bins_zone_id_zones_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_bins_numeric_pair_rack_id` | CHECK | `CHECK ((rack_id IS NULL) = (rack_id_internal_id IS NULL))` |
| `ck_warehouse_bins_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_bins_numeric_pair_zone_id` | CHECK | `CHECK ((zone_id IS NULL) = (zone_id_internal_id IS NULL))` |
| `ck_warehouse_bins_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_warehouse_bins_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(code::text)) > 0 AND code::text = btrim(code::text))` |
| `fk_warehouse_bins_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_bins_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_bins_rack_id_racks` | FOREIGN KEY | `FOREIGN KEY (rack_id) REFERENCES warehouse.racks(id) ON DELETE SET NULL` |
| `fk_warehouse_bins_rack_id_racks_numeric` | FOREIGN KEY | `FOREIGN KEY (rack_id_internal_id) REFERENCES warehouse.racks(internal_id) ON DELETE SET NULL` |
| `fk_warehouse_bins_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_bins_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE CASCADE` |
| `fk_warehouse_bins_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE CASCADE` |
| `fk_warehouse_bins_zone_id_zones` | FOREIGN KEY | `FOREIGN KEY (zone_id) REFERENCES warehouse.zones(id) ON DELETE CASCADE` |
| `fk_warehouse_bins_zone_id_zones_numeric` | FOREIGN KEY | `FOREIGN KEY (zone_id_internal_id) REFERENCES warehouse.zones(internal_id) ON DELETE CASCADE` |
| `pk_warehouse_bins` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_warehouse_bins_id` | UNIQUE | `UNIQUE (id)` |
| `warehouse_bin` | UNIQUE | `UNIQUE (warehouse_id, code)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_warehouse_bins_rack` | `CREATE INDEX ix_warehouse_bins_rack ON warehouse.bins USING btree (rack_id)` |
| `ix_warehouse_bins_status` | `CREATE INDEX ix_warehouse_bins_status ON warehouse.bins USING btree (status)` |
| `ix_warehouse_bins_warehouse` | `CREATE INDEX ix_warehouse_bins_warehouse ON warehouse.bins USING btree (warehouse_id)` |
| `ix_warehouse_bins_zone` | `CREATE INDEX ix_warehouse_bins_zone ON warehouse.bins USING btree (zone_id)` |
| `pk_warehouse_bins` | `CREATE UNIQUE INDEX pk_warehouse_bins ON warehouse.bins USING btree (internal_id)` |
| `uq_warehouse_bins_id` | `CREATE UNIQUE INDEX uq_warehouse_bins_id ON warehouse.bins USING btree (id)` |
| `warehouse_bin` | `CREATE UNIQUE INDEX warehouse_bin ON warehouse.bins USING btree (warehouse_id, code)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.bins FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["rack_id","rack_id_internal_id","warehouse","racks"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"],["zone_id","zone_id_internal_id","warehouse","zones"]]', 'internal_id', 'id')` |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON warehouse.bins FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '["warehouse_id"]')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.bins FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.bins FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["rack_id","rack_id_internal_id","warehouse","racks"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"],["zone_id","zone_id_internal_id","warehouse","zones"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
