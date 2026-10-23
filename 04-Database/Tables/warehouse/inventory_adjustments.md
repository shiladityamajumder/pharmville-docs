# warehouse.inventory_adjustments

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds inventory adjustments records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 16 columns, 13 constraints, 4 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `adjustment_number` | `character varying(64)` | No | — | Inferred: stores adjustment number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `approved_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_inventory_adjustments_approved_by_user_id_users) |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_inventory_adjustments_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `posted_at` | `timestamp with time zone` | Yes | — | Time of posted | Support chronology, deadlines or audit evidence | See exact constraints |
| `reason_code` | `character varying(64)` | No | — | Reference linking this record to stock movement reason codes | Ensures related business data can be joined and validated | FK → `warehouse.stock_movement_reason_codes` (fk_warehouse_inventory_adjustments_controlled_reason) |
| `reason_code_id` | `bigint` | Yes | — | Reference linking this record to stock movement reason codes | Ensures related business data can be joined and validated | FK → `warehouse.stock_movement_reason_codes` (fk_warehouse_inventory_adjustments_controlled_reason) |
| `requested_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_inventory_adjustments_requested_by_user_id_users) |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'draft'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_inventory_adjustments_updated_by_users) |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_warehouse_inventory_adjustments_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_warehouse_inventory_adjustments_warehouse_id_warehou_bdcd); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the inventory adjustments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.inventory_adjustments` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `reason_code_id, reason_code` → `warehouse.stock_movement_reason_codes(id, code)` via `fk_warehouse_inventory_adjustments_controlled_reason`; FOREIGN KEY (reason_code_id, reason_code) REFERENCES warehouse.stock_movement_reason_codes(id, code) ON DELETE RESTRICT
- `created_by` → `identity.users(id)` via `fk_warehouse_inventory_adjustments_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_warehouse_inventory_adjustments_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `approved_by_user_id` → `identity.users(id)` via `fk_warehouse_inventory_adjustments_approved_by_user_id_users`; FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `requested_by_user_id` → `identity.users(id)` via `fk_warehouse_inventory_adjustments_requested_by_user_id_users`; FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_warehouse_inventory_adjustments_warehouse_id_warehouses`; FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_warehouse_inventory_adjustments_warehouse_id_warehou_bdcd`; FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT

**Referenced by 2 FK constraints** (sample): `warehouse.inventory_adjustment_items`, `warehouse.inventory_adjustment_items`.

## warehouse.inventory_adjustments — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 16 columns, 13 constraints, 4 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `reason_code_id`, `reason_code` | `warehouse.stock_movement_reason_codes` | `fk_warehouse_inventory_adjustments_controlled_reason` |
| `created_by` | `identity.users` | `fk_warehouse_inventory_adjustments_created_by_users` |
| `updated_by` | `identity.users` | `fk_warehouse_inventory_adjustments_updated_by_users` |
| `approved_by_user_id` | `identity.users` | `fk_warehouse_inventory_adjustments_approved_by_user_id_users` |
| `requested_by_user_id` | `identity.users` | `fk_warehouse_inventory_adjustments_requested_by_user_id_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_inventory_adjustments_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_inventory_adjustments_warehouse_id_warehou_bdcd` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `adjustment_number` | UNIQUE | `UNIQUE (adjustment_number)` |
| `ck_warehouse_inventory_adjustments_controlled_reason_pair` | CHECK | `CHECK (reason_code_id IS NULL OR reason_code IS NOT NULL)` |
| `ck_warehouse_inventory_adjustments_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_inventory_adjustments_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_warehouse_inventory_adjustments_approved_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_adjustments_controlled_reason` | FOREIGN KEY | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES warehouse.stock_movement_reason_codes(id, code) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_adjustments_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_adjustments_requested_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_adjustments_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_adjustments_warehouse_id_warehou_bdcd` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_adjustments_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `pk_warehouse_inventory_adjustments` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_warehouse_inventory_adjustments_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `adjustment_number` | `CREATE UNIQUE INDEX adjustment_number ON warehouse.inventory_adjustments USING btree (adjustment_number)` |
| `ix_warehouse_adjustments_warehouse_status` | `CREATE INDEX ix_warehouse_adjustments_warehouse_status ON warehouse.inventory_adjustments USING btree (warehouse_id, status)` |
| `pk_warehouse_inventory_adjustments` | `CREATE UNIQUE INDEX pk_warehouse_inventory_adjustments ON warehouse.inventory_adjustments USING btree (internal_id)` |
| `uq_warehouse_inventory_adjustments_id` | `CREATE UNIQUE INDEX uq_warehouse_inventory_adjustments_id ON warehouse.inventory_adjustments USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.inventory_adjustments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `controlled_reason` | `CREATE TRIGGER controlled_reason BEFORE INSERT OR UPDATE ON warehouse.inventory_adjustments FOR EACH ROW EXECUTE FUNCTION platform.normalize_reason('warehouse.stock_movement_reason_codes')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.inventory_adjustments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.inventory_adjustments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
