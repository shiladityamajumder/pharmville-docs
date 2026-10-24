# `fulfillment.picking_waves`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds picking waves records within the fulfillment domain (picking, packing, and shipment preparation). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 11 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `completed_at` | `timestamp with time zone` | Yes | — | Time of completed | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_fulfillment_picking_waves_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `released_at` | `timestamp with time zone` | Yes | — | Time of released | Support chronology, deadlines or audit evidence | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'created'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `strategy` | `character varying(32)` | No | `'order'::character varying` | Inferred: stores strategy for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_fulfillment_picking_waves_updated_by_users) |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_fulfillment_picking_waves_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_fulfillment_picking_waves_warehouse_id_warehouses_numeric); Numeric/public-key pair verification required |
| `wave_number` | `character varying(64)` | No | — | Inferred: stores wave number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the picking waves business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Order_Operations, Store_Operations, Warehouse, Delivery_Operations. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `fulfillment.picking_waves` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_fulfillment_picking_waves_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_fulfillment_picking_waves_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_fulfillment_picking_waves_warehouse_id_warehouses`; `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT`
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_fulfillment_picking_waves_warehouse_id_warehouses_numeric`; `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT`

**Referenced by 6 FK constraints** (sample): `fulfillment.picking_wave_orders`, `fulfillment.pick_tasks`, `fulfillment.fulfillment_orders`, `fulfillment.fulfillment_orders`, `fulfillment.pick_tasks`, `fulfillment.picking_wave_orders`.

## `fulfillment.picking_waves` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 14 columns, 11 constraints, 6 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_fulfillment_picking_waves_created_by_users` |
| `updated_by` | `identity.users` | `fk_fulfillment_picking_waves_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_fulfillment_picking_waves_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_fulfillment_picking_waves_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_fulfillment_picking_waves_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_fulfillment_picking_waves_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_fulfillment_picking_waves_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_fulfillment_picking_waves_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_fulfillment_picking_waves_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_fulfillment_picking_waves_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `picking_wave_number` | UNIQUE | `UNIQUE (wave_number)` |
| `pk_fulfillment_picking_waves` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_fulfillment_picking_waves_id` | UNIQUE | `UNIQUE (id)` |
| `uq_numeric_fulfillment_picking_waves_internal_id_wareho_a2bf` | UNIQUE | `UNIQUE (internal_id, warehouse_id_internal_id)` |
| `uq_scope_fulfillment_picking_waves_warehouse_id` | UNIQUE | `UNIQUE (id, warehouse_id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_fulfillment_picking_waves_warehouse_status` | `CREATE INDEX ix_fulfillment_picking_waves_warehouse_status ON fulfillment.picking_waves USING btree (warehouse_id, status)` |
| `picking_wave_number` | `CREATE UNIQUE INDEX picking_wave_number ON fulfillment.picking_waves USING btree (wave_number)` |
| `pk_fulfillment_picking_waves` | `CREATE UNIQUE INDEX pk_fulfillment_picking_waves ON fulfillment.picking_waves USING btree (internal_id)` |
| `uq_fulfillment_picking_waves_id` | `CREATE UNIQUE INDEX uq_fulfillment_picking_waves_id ON fulfillment.picking_waves USING btree (id)` |
| `uq_numeric_fulfillment_picking_waves_internal_id_wareho_a2bf` | `CREATE UNIQUE INDEX uq_numeric_fulfillment_picking_waves_internal_id_wareho_a2bf ON fulfillment.picking_waves USING btree (internal_id, warehouse_id_internal_id)` |
| `uq_scope_fulfillment_picking_waves_warehouse_id` | `CREATE UNIQUE INDEX uq_scope_fulfillment_picking_waves_warehouse_id ON fulfillment.picking_waves USING btree (id, warehouse_id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.picking_waves FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON fulfillment.picking_waves FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.picking_waves FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
