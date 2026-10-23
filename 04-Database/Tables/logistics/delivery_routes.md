# logistics.delivery_routes

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds delivery routes records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 10 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_delivery_routes_created_by_users) |
| `delivery_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_delivery_routes_delivery_user_id_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `route_date` | `date` | No | — | Inferred: stores route date for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `route_geometry` | `jsonb` | No | `'{}'::jsonb` | Structured route geometry information | Retain a versioned payload or relevant details | See exact constraints |
| `route_number` | `character varying(64)` | No | — | Inferred: stores route number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'planned'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_delivery_routes_updated_by_users) |
| `vehicle_identifier` | `character varying(128)` | Yes | — | Inferred: stores vehicle identifier for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_logistics_delivery_routes_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_logistics_delivery_routes_warehouse_id_warehouses_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the delivery routes business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.delivery_routes` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `delivery_user_id` → `identity.users(id)` via `fk_logistics_delivery_routes_delivery_user_id_users`; FOREIGN KEY (delivery_user_id) REFERENCES identity.users(id) ON DELETE SET NULL
- `created_by` → `identity.users(id)` via `fk_logistics_delivery_routes_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_logistics_delivery_routes_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_logistics_delivery_routes_warehouse_id_warehouses`; FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_logistics_delivery_routes_warehouse_id_warehouses_numeric`; FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT

**Referenced by 2 FK constraints** (sample): `logistics.delivery_assignments`, `logistics.delivery_assignments`.

## logistics.delivery_routes — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 15 columns, 10 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `delivery_user_id` | `identity.users` | `fk_logistics_delivery_routes_delivery_user_id_users` |
| `created_by` | `identity.users` | `fk_logistics_delivery_routes_created_by_users` |
| `updated_by` | `identity.users` | `fk_logistics_delivery_routes_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_logistics_delivery_routes_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_logistics_delivery_routes_warehouse_id_warehouses_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_delivery_routes_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_logistics_delivery_routes_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `delivery_route_number` | UNIQUE | `UNIQUE (route_number)` |
| `fk_logistics_delivery_routes_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_routes_delivery_user_id_users` | FOREIGN KEY | `FOREIGN KEY (delivery_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_logistics_delivery_routes_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_routes_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_routes_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `pk_logistics_delivery_routes` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_logistics_delivery_routes_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `delivery_route_number` | `CREATE UNIQUE INDEX delivery_route_number ON logistics.delivery_routes USING btree (route_number)` |
| `ix_logistics_delivery_routes_date_status` | `CREATE INDEX ix_logistics_delivery_routes_date_status ON logistics.delivery_routes USING btree (route_date, status)` |
| `ix_logistics_delivery_routes_warehouse` | `CREATE INDEX ix_logistics_delivery_routes_warehouse ON logistics.delivery_routes USING btree (warehouse_id)` |
| `pk_logistics_delivery_routes` | `CREATE UNIQUE INDEX pk_logistics_delivery_routes ON logistics.delivery_routes USING btree (internal_id)` |
| `uq_logistics_delivery_routes_id` | `CREATE UNIQUE INDEX uq_logistics_delivery_routes_id ON logistics.delivery_routes USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_routes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.delivery_routes FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_routes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
