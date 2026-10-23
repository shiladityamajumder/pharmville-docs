# logistics.rider_shifts

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds rider shifts records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 6 columns, 4 constraints, 4 indexes, 4 triggers; PK: `id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `ended_at` | `timestamp with time zone` | Yes | — | Time of ended | Support chronology, deadlines or audit evidence | See exact constraints |
| `id` | `bigint` | No | — | Internal numeric primary key | Uniquely identifies a master or newer table row | key: review PK and unique rules below |
| `rider_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_rider_shifts_rider_user_id_users) |
| `started_at` | `timestamp with time zone` | No | `now()` | Time of started | Support chronology, deadlines or audit evidence | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |

**Primary key columns (Confirmed):** `id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the rider shifts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.rider_shifts` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `rider_user_id` → `identity.users(id)` via `fk_logistics_rider_shifts_rider_user_id_users`; FOREIGN KEY (rider_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT

**Referenced by 1 FK constraints** (sample): `logistics.delivery_location_updates`.

## logistics.rider_shifts — exact structural contracts

**Identity:** `id` BIGINT. **Counts:** 6 columns, 4 constraints, 4 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `rider_user_id` | `identity.users` | `fk_logistics_rider_shifts_rider_user_id_users` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_rider_shifts_valid_period` | CHECK | `CHECK (ended_at IS NULL OR ended_at > started_at)` |
| `fk_logistics_rider_shifts_rider_user_id_users` | FOREIGN KEY | `FOREIGN KEY (rider_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_logistics_rider_shifts` | PRIMARY KEY | `PRIMARY KEY (id)` |
| `uq_logistics_rider_shifts_id_user` | UNIQUE | `UNIQUE (id, rider_user_id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_logistics_rider_shifts_user_time` | `CREATE INDEX ix_logistics_rider_shifts_user_time ON logistics.rider_shifts USING btree (rider_user_id, started_at DESC)` |
| `pk_logistics_rider_shifts` | `CREATE UNIQUE INDEX pk_logistics_rider_shifts ON logistics.rider_shifts USING btree (id)` |
| `uq_logistics_rider_shifts_id_user` | `CREATE UNIQUE INDEX uq_logistics_rider_shifts_id_user ON logistics.rider_shifts USING btree (id, rider_user_id)` |
| `uq_logistics_rider_shifts_one_open` | `CREATE UNIQUE INDEX uq_logistics_rider_shifts_one_open ON logistics.rider_shifts USING btree (rider_user_id) WHERE ended_at IS NULL` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.rider_shifts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'id', '')` |
| `rider_shift_guard` | `CREATE TRIGGER rider_shift_guard BEFORE INSERT OR DELETE OR UPDATE ON logistics.rider_shifts FOR EACH ROW EXECUTE FUNCTION logistics.guard_shift()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.rider_shifts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('timestamp')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.rider_shifts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'id', '')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
