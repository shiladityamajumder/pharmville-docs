# `warehouse.cycle_counts`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds cycle counts records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 12 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `assigned_to_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_cycle_counts_assigned_to_user_id_users) |
| `bin_id` | `uuid` | Yes | — | Reference linking this record to bins | Ensures related business data can be joined and validated | FK → `warehouse.bins` (fk_warehouse_cycle_counts_bin_id_bins) |
| `bin_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.bins` (fk_warehouse_cycle_counts_bin_id_bins_numeric); Numeric/public-key pair verification required |
| `completed_at` | `timestamp with time zone` | Yes | — | Time of completed | Support chronology, deadlines or audit evidence | See exact constraints |
| `count_mode` | `character varying(32)` | No | `'blind'::character varying` | Inferred: stores count mode for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_cycle_counts_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `scheduled_at` | `timestamp with time zone` | No | — | Time of scheduled | Support chronology, deadlines or audit evidence | See exact constraints |
| `started_at` | `timestamp with time zone` | Yes | — | Time of started | Support chronology, deadlines or audit evidence | See exact constraints |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_cycle_counts_updated_by_users) |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_warehouse_cycle_counts_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_warehouse_cycle_counts_warehouse_id_warehouses_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the cycle counts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.cycle_counts` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_warehouse_cycle_counts_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_warehouse_cycle_counts_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `assigned_to_user_id` → `identity.users(id)` via `fk_warehouse_cycle_counts_assigned_to_user_id_users`; `FOREIGN KEY (assigned_to_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `bin_id` → `warehouse.bins(id)` via `fk_warehouse_cycle_counts_bin_id_bins`; `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT`
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_warehouse_cycle_counts_warehouse_id_warehouses`; `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT`
- `bin_id_internal_id` → `warehouse.bins(internal_id)` via `fk_warehouse_cycle_counts_bin_id_bins_numeric`; `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT`
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_warehouse_cycle_counts_warehouse_id_warehouses_numeric`; `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT`

**Referenced by 2 FK constraints** (sample): `warehouse.cycle_count_items`, `warehouse.cycle_count_items`.

## `warehouse.cycle_counts` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 17 columns, 12 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_warehouse_cycle_counts_created_by_users` |
| `updated_by` | `identity.users` | `fk_warehouse_cycle_counts_updated_by_users` |
| `assigned_to_user_id` | `identity.users` | `fk_warehouse_cycle_counts_assigned_to_user_id_users` |
| `bin_id` | `warehouse.bins` | `fk_warehouse_cycle_counts_bin_id_bins` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_cycle_counts_warehouse_id_warehouses` |
| `bin_id_internal_id` | `warehouse.bins` | `fk_warehouse_cycle_counts_bin_id_bins_numeric` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_cycle_counts_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_cycle_counts_numeric_pair_bin_id` | CHECK | `CHECK ((bin_id IS NULL) = (bin_id_internal_id IS NULL))` |
| `ck_warehouse_cycle_counts_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_cycle_counts_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_warehouse_cycle_counts_assigned_to_user_id_users` | FOREIGN KEY | `FOREIGN KEY (assigned_to_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_counts_bin_id_bins` | FOREIGN KEY | `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_counts_bin_id_bins_numeric` | FOREIGN KEY | `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_counts_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_counts_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_counts_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_counts_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `pk_warehouse_cycle_counts` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_warehouse_cycle_counts_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_warehouse_cycle_counts_bin` | `CREATE INDEX ix_warehouse_cycle_counts_bin ON warehouse.cycle_counts USING btree (bin_id)` |
| `ix_warehouse_cycle_counts_status` | `CREATE INDEX ix_warehouse_cycle_counts_status ON warehouse.cycle_counts USING btree (status)` |
| `ix_warehouse_cycle_counts_warehouse` | `CREATE INDEX ix_warehouse_cycle_counts_warehouse ON warehouse.cycle_counts USING btree (warehouse_id)` |
| `pk_warehouse_cycle_counts` | `CREATE UNIQUE INDEX pk_warehouse_cycle_counts ON warehouse.cycle_counts USING btree (internal_id)` |
| `uq_warehouse_cycle_counts_id` | `CREATE UNIQUE INDEX uq_warehouse_cycle_counts_id ON warehouse.cycle_counts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.cycle_counts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.cycle_counts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.cycle_counts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
