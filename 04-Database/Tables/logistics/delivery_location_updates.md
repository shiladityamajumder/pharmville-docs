# logistics.delivery_location_updates

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds delivery location updates records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 13 columns, 12 constraints, 4 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `accuracy_m` | `numeric(9,2)` | Yes | — | Inferred: stores accuracy m for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `assignment_id` | `uuid` | No | — | Reference linking this record to delivery assignments | Ensures related business data can be joined and validated | FK → `logistics.delivery_assignments` (fk_logistics_delivery_location_updates_assignment_id_de_dfbd) |
| `assignment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.delivery_assignments` (fk_logistics_delivery_location_updates_assignment_id_de_1eb9); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `delivery_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_delivery_location_updates_delivery_user_id_users); FK → `logistics.rider_shifts` (fk_logistics_location_shift_rider) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `latitude` | `numeric(10,7)` | No | — | Inferred: stores latitude for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `longitude` | `numeric(10,7)` | No | — | Inferred: stores longitude for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `received_at` | `timestamp with time zone` | No | `now()` | Time of received | Support chronology, deadlines or audit evidence | See exact constraints |
| `recorded_at` | `timestamp with time zone` | No | — | Time of recorded | Support chronology, deadlines or audit evidence | See exact constraints |
| `shift_id` | `bigint` | Yes | — | Reference linking this record to rider shifts | Ensures related business data can be joined and validated | FK → `logistics.rider_shifts` (fk_logistics_location_shift_rider) |
| `source` | `character varying(16)` | No | `'rider'::character varying` | Inferred: stores source for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the delivery location updates business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.delivery_location_updates` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `delivery_user_id` → `identity.users(id)` via `fk_logistics_delivery_location_updates_delivery_user_id_users`; FOREIGN KEY (delivery_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `shift_id, delivery_user_id` → `logistics.rider_shifts(id, rider_user_id)` via `fk_logistics_location_shift_rider`; FOREIGN KEY (shift_id, delivery_user_id) REFERENCES logistics.rider_shifts(id, rider_user_id) ON DELETE RESTRICT
- `assignment_id` → `logistics.delivery_assignments(id)` via `fk_logistics_delivery_location_updates_assignment_id_de_dfbd`; FOREIGN KEY (assignment_id) REFERENCES logistics.delivery_assignments(id) ON DELETE RESTRICT
- `assignment_id_internal_id` → `logistics.delivery_assignments(internal_id)` via `fk_logistics_delivery_location_updates_assignment_id_de_1eb9`; FOREIGN KEY (assignment_id_internal_id) REFERENCES logistics.delivery_assignments(internal_id) ON DELETE RESTRICT

## logistics.delivery_location_updates — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 13 columns, 12 constraints, 4 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `delivery_user_id` | `identity.users` | `fk_logistics_delivery_location_updates_delivery_user_id_users` |
| `shift_id`, `delivery_user_id` | `logistics.rider_shifts` | `fk_logistics_location_shift_rider` |
| `assignment_id` | `logistics.delivery_assignments` | `fk_logistics_delivery_location_updates_assignment_id_de_dfbd` |
| `assignment_id_internal_id` | `logistics.delivery_assignments` | `fk_logistics_delivery_location_updates_assignment_id_de_1eb9` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_delivery_location_updates_accuracy_nonnegative` | CHECK | `CHECK (accuracy_m IS NULL OR accuracy_m >= 0::numeric)` |
| `ck_logistics_delivery_location_updates_finite_numeric_values` | CHECK | `CHECK ((latitude IS NULL OR (latitude <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (longitude IS NULL OR (longitude <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (accuracy_m IS NULL OR (accuracy_m <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_logistics_delivery_location_updates_latitude_range` | CHECK | `CHECK (latitude >= '-90'::integer::numeric AND latitude <= 90::numeric)` |
| `ck_logistics_delivery_location_updates_longitude_range` | CHECK | `CHECK (longitude >= '-180'::integer::numeric AND longitude <= 180::numeric)` |
| `ck_logistics_delivery_location_updates_numeric_pair_ass_f01e` | CHECK | `CHECK ((assignment_id IS NULL) = (assignment_id_internal_id IS NULL))` |
| `ck_logistics_delivery_location_updates_source` | CHECK | `CHECK (source::text = ANY (ARRAY['rider'::text, 'carrier'::text]))` |
| `fk_logistics_delivery_location_updates_assignment_id_de_1eb9` | FOREIGN KEY | `FOREIGN KEY (assignment_id_internal_id) REFERENCES logistics.delivery_assignments(internal_id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_location_updates_assignment_id_de_dfbd` | FOREIGN KEY | `FOREIGN KEY (assignment_id) REFERENCES logistics.delivery_assignments(id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_location_updates_delivery_user_id_users` | FOREIGN KEY | `FOREIGN KEY (delivery_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_location_shift_rider` | FOREIGN KEY | `FOREIGN KEY (shift_id, delivery_user_id) REFERENCES logistics.rider_shifts(id, rider_user_id) ON DELETE RESTRICT` |
| `pk_logistics_delivery_location_updates` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_logistics_delivery_location_updates_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_logistics_location_assignment_time` | `CREATE INDEX ix_logistics_location_assignment_time ON logistics.delivery_location_updates USING btree (assignment_id, recorded_at DESC)` |
| `ix_logistics_location_user_time` | `CREATE INDEX ix_logistics_location_user_time ON logistics.delivery_location_updates USING btree (delivery_user_id, recorded_at DESC)` |
| `pk_logistics_delivery_location_updates` | `CREATE UNIQUE INDEX pk_logistics_delivery_location_updates ON logistics.delivery_location_updates USING btree (internal_id)` |
| `uq_logistics_delivery_location_updates_id` | `CREATE UNIQUE INDEX uq_logistics_delivery_location_updates_id ON logistics.delivery_location_updates USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_location_updates FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["assignment_id","assignment_id_internal_id","logistics","delivery_assignments"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON logistics.delivery_location_updates FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `location_guard` | `CREATE TRIGGER location_guard BEFORE INSERT ON logistics.delivery_location_updates FOR EACH ROW EXECUTE FUNCTION logistics.guard_location()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_location_updates FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["assignment_id","assignment_id_internal_id","logistics","delivery_assignments"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
