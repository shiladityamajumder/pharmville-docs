# warehouse.zones

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds zones records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 19 columns, 12 constraints, 4 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_zones_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_zones_deleted_by_users) |
| `humidity_max` | `numeric(6,2)` | Yes | — | Inferred: stores humidity max for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `humidity_min` | `numeric(6,2)` | Yes | — | Inferred: stores humidity min for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `name` | `character varying(128)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `temperature_max_c` | `numeric(6,2)` | Yes | — | Inferred: stores temperature max c for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `temperature_min_c` | `numeric(6,2)` | Yes | — | Inferred: stores temperature min c for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_zones_updated_by_users) |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_warehouse_zones_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_warehouse_zones_warehouse_id_warehouses_numeric); Numeric/public-key pair verification required |
| `zone_type` | `character varying(32)` | No | — | Inferred: stores zone type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the zones business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.zones` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_warehouse_zones_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_warehouse_zones_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_warehouse_zones_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_warehouse_zones_warehouse_id_warehouses`; FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE CASCADE
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_warehouse_zones_warehouse_id_warehouses_numeric`; FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE CASCADE

**Referenced by 4 FK constraints** (sample): `warehouse.aisles`, `warehouse.bins`, `warehouse.aisles`, `warehouse.bins`.

## warehouse.zones — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 19 columns, 12 constraints, 4 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_warehouse_zones_created_by_users` |
| `deleted_by` | `identity.users` | `fk_warehouse_zones_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_warehouse_zones_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_zones_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_zones_warehouse_id_warehouses_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_zones_finite_numeric_values` | CHECK | `CHECK ((temperature_min_c IS NULL OR (temperature_min_c <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (temperature_max_c IS NULL OR (temperature_max_c <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (humidity_min IS NULL OR (humidity_min <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (humidity_max IS NULL OR (humidity_max <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_warehouse_zones_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_zones_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_warehouse_zones_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(code::text)) > 0 AND code::text = btrim(code::text))` |
| `fk_warehouse_zones_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_zones_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_zones_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_zones_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE CASCADE` |
| `fk_warehouse_zones_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE CASCADE` |
| `pk_warehouse_zones` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_warehouse_zones_id` | UNIQUE | `UNIQUE (id)` |
| `warehouse_zone` | UNIQUE | `UNIQUE (warehouse_id, code)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_warehouse_zones_warehouse` | `CREATE INDEX ix_warehouse_zones_warehouse ON warehouse.zones USING btree (warehouse_id)` |
| `pk_warehouse_zones` | `CREATE UNIQUE INDEX pk_warehouse_zones ON warehouse.zones USING btree (internal_id)` |
| `uq_warehouse_zones_id` | `CREATE UNIQUE INDEX uq_warehouse_zones_id ON warehouse.zones USING btree (id)` |
| `warehouse_zone` | `CREATE UNIQUE INDEX warehouse_zone ON warehouse.zones USING btree (warehouse_id, code)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.zones FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON warehouse.zones FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '["warehouse_id"]')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.zones FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.zones FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
