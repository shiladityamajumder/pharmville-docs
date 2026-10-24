# `logistics.delivery_assignments`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds delivery assignments records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 19 columns, 16 constraints, 8 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `accepted_at` | `timestamp with time zone` | Yes | — | Time of accepted | Support chronology, deadlines or audit evidence | See exact constraints |
| `assigned_at` | `timestamp with time zone` | No | `now()` | Time of assigned | Support chronology, deadlines or audit evidence | See exact constraints |
| `completed_at` | `timestamp with time zone` | Yes | — | Time of completed | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_delivery_assignments_created_by_users) |
| `delivery_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_delivery_assignments_delivery_user_id_users) |
| `ended_at` | `timestamp with time zone` | Yes | — | Time of ended | Support chronology, deadlines or audit evidence | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_current` | `boolean` | No | `true` | Yes/no flag for is current | Control conditional business behavior | See exact constraints |
| `route_id` | `uuid` | Yes | — | Reference linking this record to delivery routes | Ensures related business data can be joined and validated | FK → `logistics.delivery_routes` (fk_logistics_delivery_assignments_route_id_delivery_routes) |
| `route_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.delivery_routes` (fk_logistics_delivery_assignments_route_id_delivery_rou_bb4c); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `sequence_no` | `integer` | Yes | — | Inferred: stores sequence no for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `shipment_id` | `uuid` | No | — | Reference linking this record to shipments | Ensures related business data can be joined and validated | FK → `logistics.shipments` (fk_logistics_delivery_assignments_shipment_id_shipments) |
| `shipment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.shipments` (fk_logistics_delivery_assignments_shipment_id_shipments_numeric); Numeric/public-key pair verification required |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_delivery_assignments_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the delivery assignments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.delivery_assignments` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `delivery_user_id` → `identity.users(id)` via `fk_logistics_delivery_assignments_delivery_user_id_users`; `FOREIGN KEY (delivery_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `created_by` → `identity.users(id)` via `fk_logistics_delivery_assignments_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_logistics_delivery_assignments_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `shipment_id` → `logistics.shipments(id)` via `fk_logistics_delivery_assignments_shipment_id_shipments`; `FOREIGN KEY (shipment_id) REFERENCES logistics.shipments(id) ON DELETE CASCADE`
- `route_id` → `logistics.delivery_routes(id)` via `fk_logistics_delivery_assignments_route_id_delivery_routes`; `FOREIGN KEY (route_id) REFERENCES logistics.delivery_routes(id) ON DELETE SET NULL`
- `route_id_internal_id` → `logistics.delivery_routes(internal_id)` via `fk_logistics_delivery_assignments_route_id_delivery_rou_bb4c`; `FOREIGN KEY (route_id_internal_id) REFERENCES logistics.delivery_routes(internal_id) ON DELETE SET NULL`
- `shipment_id_internal_id` → `logistics.shipments(internal_id)` via `fk_logistics_delivery_assignments_shipment_id_shipments_numeric`; `FOREIGN KEY (shipment_id_internal_id) REFERENCES logistics.shipments(internal_id) ON DELETE CASCADE`

**Referenced by 4 FK constraints** (sample): `logistics.delivery_location_updates`, `logistics.delivery_otp_challenges`, `logistics.delivery_location_updates`, `logistics.delivery_otp_challenges`.

## `logistics.delivery_assignments` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 19 columns, 16 constraints, 8 indexes, 4 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `delivery_user_id` | `identity.users` | `fk_logistics_delivery_assignments_delivery_user_id_users` |
| `created_by` | `identity.users` | `fk_logistics_delivery_assignments_created_by_users` |
| `updated_by` | `identity.users` | `fk_logistics_delivery_assignments_updated_by_users` |
| `shipment_id` | `logistics.shipments` | `fk_logistics_delivery_assignments_shipment_id_shipments` |
| `route_id` | `logistics.delivery_routes` | `fk_logistics_delivery_assignments_route_id_delivery_routes` |
| `route_id_internal_id` | `logistics.delivery_routes` | `fk_logistics_delivery_assignments_route_id_delivery_rou_bb4c` |
| `shipment_id_internal_id` | `logistics.shipments` | `fk_logistics_delivery_assignments_shipment_id_shipments_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_delivery_assignments_current_period` | CHECK | `CHECK (is_current = (ended_at IS NULL))` |
| `ck_logistics_delivery_assignments_numeric_pair_route_id` | CHECK | `CHECK ((route_id IS NULL) = (route_id_internal_id IS NULL))` |
| `ck_logistics_delivery_assignments_numeric_pair_shipment_id` | CHECK | `CHECK ((shipment_id IS NULL) = (shipment_id_internal_id IS NULL))` |
| `ck_logistics_delivery_assignments_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_logistics_delivery_assignments_valid_period` | CHECK | `CHECK (ended_at IS NULL OR ended_at >= assigned_at)` |
| `fk_logistics_delivery_assignments_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_assignments_delivery_user_id_users` | FOREIGN KEY | `FOREIGN KEY (delivery_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_assignments_route_id_delivery_rou_bb4c` | FOREIGN KEY | `FOREIGN KEY (route_id_internal_id) REFERENCES logistics.delivery_routes(internal_id) ON DELETE SET NULL` |
| `fk_logistics_delivery_assignments_route_id_delivery_routes` | FOREIGN KEY | `FOREIGN KEY (route_id) REFERENCES logistics.delivery_routes(id) ON DELETE SET NULL` |
| `fk_logistics_delivery_assignments_shipment_id_shipments` | FOREIGN KEY | `FOREIGN KEY (shipment_id) REFERENCES logistics.shipments(id) ON DELETE CASCADE` |
| `fk_logistics_delivery_assignments_shipment_id_shipments_numeric` | FOREIGN KEY | `FOREIGN KEY (shipment_id_internal_id) REFERENCES logistics.shipments(internal_id) ON DELETE CASCADE` |
| `fk_logistics_delivery_assignments_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_logistics_delivery_assignments` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_logistics_delivery_assignments_id` | UNIQUE | `UNIQUE (id)` |
| `uq_logistics_delivery_assignments_id_shipment` | UNIQUE | `UNIQUE (id, shipment_id)` |
| `uq_numeric_logistics_delivery_assignments_internal_id_s_7b2c` | UNIQUE | `UNIQUE (internal_id, shipment_id_internal_id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_logistics_delivery_assignments_route` | `CREATE INDEX ix_logistics_delivery_assignments_route ON logistics.delivery_assignments USING btree (route_id)` |
| `ix_logistics_delivery_assignments_shipment_time` | `CREATE INDEX ix_logistics_delivery_assignments_shipment_time ON logistics.delivery_assignments USING btree (shipment_id, assigned_at DESC)` |
| `ix_logistics_delivery_assignments_user_status` | `CREATE INDEX ix_logistics_delivery_assignments_user_status ON logistics.delivery_assignments USING btree (delivery_user_id, status)` |
| `pk_logistics_delivery_assignments` | `CREATE UNIQUE INDEX pk_logistics_delivery_assignments ON logistics.delivery_assignments USING btree (internal_id)` |
| `uq_logistics_delivery_assignments_current` | `CREATE UNIQUE INDEX uq_logistics_delivery_assignments_current ON logistics.delivery_assignments USING btree (shipment_id) WHERE is_current = true` |
| `uq_logistics_delivery_assignments_id` | `CREATE UNIQUE INDEX uq_logistics_delivery_assignments_id ON logistics.delivery_assignments USING btree (id)` |
| `uq_logistics_delivery_assignments_id_shipment` | `CREATE UNIQUE INDEX uq_logistics_delivery_assignments_id_shipment ON logistics.delivery_assignments USING btree (id, shipment_id)` |
| `uq_numeric_logistics_delivery_assignments_internal_id_s_7b2c` | `CREATE UNIQUE INDEX uq_numeric_logistics_delivery_assignments_internal_id_s_7b2c ON logistics.delivery_assignments USING btree (internal_id, shipment_id_internal_id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_assignments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["route_id","route_id_internal_id","logistics","delivery_routes"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` |
| `assignment_history_guard` | `CREATE TRIGGER assignment_history_guard BEFORE INSERT OR DELETE OR UPDATE ON logistics.delivery_assignments FOR EACH ROW EXECUTE FUNCTION logistics.guard_assignment_history()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.delivery_assignments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_assignments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["route_id","route_id_internal_id","logistics","delivery_routes"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
