# `warehouse.stock_transfers`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds stock transfers records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 15 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approved_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_stock_transfers_approved_by_user_id_users) |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_stock_transfers_created_by_users) |
| `destination_warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_warehouse_stock_transfers_destination_warehouse_id_w_01ac) |
| `destination_warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_warehouse_stock_transfers_destination_warehouse_id_w_8b92); Numeric/public-key pair verification required |
| `dispatched_at` | `timestamp with time zone` | Yes | — | Time of dispatched | Support chronology, deadlines or audit evidence | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `received_at` | `timestamp with time zone` | Yes | — | Time of received | Support chronology, deadlines or audit evidence | See exact constraints |
| `requested_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_stock_transfers_requested_by_user_id_users) |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `source_warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_warehouse_stock_transfers_source_warehouse_id_warehouses) |
| `source_warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_warehouse_stock_transfers_source_warehouse_id_wareho_d0e1); Numeric/public-key pair verification required |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `transfer_number` | `character varying(64)` | No | — | Inferred: stores transfer number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_stock_transfers_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the stock transfers business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.stock_transfers` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_warehouse_stock_transfers_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_warehouse_stock_transfers_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `approved_by_user_id` → `identity.users(id)` via `fk_warehouse_stock_transfers_approved_by_user_id_users`; `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `requested_by_user_id` → `identity.users(id)` via `fk_warehouse_stock_transfers_requested_by_user_id_users`; `FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `destination_warehouse_id` → `warehouse.warehouses(id)` via `fk_warehouse_stock_transfers_destination_warehouse_id_w_01ac`; `FOREIGN KEY (destination_warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT`
- `source_warehouse_id` → `warehouse.warehouses(id)` via `fk_warehouse_stock_transfers_source_warehouse_id_warehouses`; `FOREIGN KEY (source_warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT`
- `destination_warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_warehouse_stock_transfers_destination_warehouse_id_w_8b92`; `FOREIGN KEY (destination_warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT`
- `source_warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_warehouse_stock_transfers_source_warehouse_id_wareho_d0e1`; `FOREIGN KEY (source_warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT`

**Referenced by 2 FK constraints** (sample): `warehouse.stock_transfer_items`, `warehouse.stock_transfer_items`.

## `warehouse.stock_transfers` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 17 columns, 15 constraints, 6 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_warehouse_stock_transfers_created_by_users` |
| `updated_by` | `identity.users` | `fk_warehouse_stock_transfers_updated_by_users` |
| `approved_by_user_id` | `identity.users` | `fk_warehouse_stock_transfers_approved_by_user_id_users` |
| `requested_by_user_id` | `identity.users` | `fk_warehouse_stock_transfers_requested_by_user_id_users` |
| `destination_warehouse_id` | `warehouse.warehouses` | `fk_warehouse_stock_transfers_destination_warehouse_id_w_01ac` |
| `source_warehouse_id` | `warehouse.warehouses` | `fk_warehouse_stock_transfers_source_warehouse_id_warehouses` |
| `destination_warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_stock_transfers_destination_warehouse_id_w_8b92` |
| `source_warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_stock_transfers_source_warehouse_id_wareho_d0e1` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_stock_transfers_different_warehouses` | CHECK | `CHECK (source_warehouse_id <> destination_warehouse_id)` |
| `ck_warehouse_stock_transfers_numeric_pair_destination_w_9cf7` | CHECK | `CHECK ((destination_warehouse_id IS NULL) = (destination_warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_stock_transfers_numeric_pair_source_warehouse_id` | CHECK | `CHECK ((source_warehouse_id IS NULL) = (source_warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_stock_transfers_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_warehouse_stock_transfers_approved_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_transfers_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_transfers_destination_warehouse_id_w_01ac` | FOREIGN KEY | `FOREIGN KEY (destination_warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_transfers_destination_warehouse_id_w_8b92` | FOREIGN KEY | `FOREIGN KEY (destination_warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_transfers_requested_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_transfers_source_warehouse_id_wareho_d0e1` | FOREIGN KEY | `FOREIGN KEY (source_warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_transfers_source_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (source_warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_transfers_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_warehouse_stock_transfers` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `transfer_number` | UNIQUE | `UNIQUE (transfer_number)` |
| `uq_warehouse_stock_transfers_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_warehouse_stock_transfers_destination` | `CREATE INDEX ix_warehouse_stock_transfers_destination ON warehouse.stock_transfers USING btree (destination_warehouse_id)` |
| `ix_warehouse_stock_transfers_source` | `CREATE INDEX ix_warehouse_stock_transfers_source ON warehouse.stock_transfers USING btree (source_warehouse_id)` |
| `ix_warehouse_stock_transfers_status` | `CREATE INDEX ix_warehouse_stock_transfers_status ON warehouse.stock_transfers USING btree (status)` |
| `pk_warehouse_stock_transfers` | `CREATE UNIQUE INDEX pk_warehouse_stock_transfers ON warehouse.stock_transfers USING btree (internal_id)` |
| `transfer_number` | `CREATE UNIQUE INDEX transfer_number ON warehouse.stock_transfers USING btree (transfer_number)` |
| `uq_warehouse_stock_transfers_id` | `CREATE UNIQUE INDEX uq_warehouse_stock_transfers_id ON warehouse.stock_transfers USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_transfers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["destination_warehouse_id","destination_warehouse_id_internal_id","warehouse","warehouses"],["source_warehouse_id","source_warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.stock_transfers FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_transfers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["destination_warehouse_id","destination_warehouse_id_internal_id","warehouse","warehouses"],["source_warehouse_id","source_warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
