# `appointment.appointment_slots`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds appointment slots records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 12 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `booked_count` | `integer` | No | `0` | Inferred: stores booked count for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `capacity` | `integer` | No | `1` | Inferred: stores capacity for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_appointment_appointment_slots_created_by_users) |
| `ends_at` | `timestamp with time zone` | No | — | Time of ends | Support chronology, deadlines or audit evidence | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `practitioner_service_id` | `uuid` | No | — | Reference linking this record to practitioner services | Ensures related business data can be joined and validated | FK → `appointment.practitioner_services` (fk_appointment_appointment_slots_practitioner_service_i_a41a) |
| `practitioner_service_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.practitioner_services` (fk_appointment_appointment_slots_practitioner_service_i_63f0); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `starts_at` | `timestamp with time zone` | No | — | Time of starts | Support chronology, deadlines or audit evidence | See exact constraints |
| `status` | `character varying(32)` | No | `'open'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_appointment_appointment_slots_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the appointment slots business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `appointment.appointment_slots` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_appointment_appointment_slots_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_appointment_appointment_slots_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `practitioner_service_id` → `appointment.practitioner_services(id)` via `fk_appointment_appointment_slots_practitioner_service_i_a41a`; `FOREIGN KEY (practitioner_service_id) REFERENCES appointment.practitioner_services(id) ON DELETE CASCADE`
- `practitioner_service_id_internal_id` → `appointment.practitioner_services(internal_id)` via `fk_appointment_appointment_slots_practitioner_service_i_63f0`; `FOREIGN KEY (practitioner_service_id_internal_id) REFERENCES appointment.practitioner_services(internal_id) ON DELETE CASCADE`

**Referenced by 2 FK constraints** (sample): `appointment.appointments`, `appointment.appointments`.

## `appointment.appointment_slots` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 14 columns, 12 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_appointment_appointment_slots_created_by_users` |
| `updated_by` | `identity.users` | `fk_appointment_appointment_slots_updated_by_users` |
| `practitioner_service_id` | `appointment.practitioner_services` | `fk_appointment_appointment_slots_practitioner_service_i_a41a` |
| `practitioner_service_id_internal_id` | `appointment.practitioner_services` | `fk_appointment_appointment_slots_practitioner_service_i_63f0` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_appointment_appointment_slots_booking_capacity` | CHECK | `CHECK (booked_count >= 0 AND booked_count <= capacity)` |
| `ck_appointment_appointment_slots_capacity_positive` | CHECK | `CHECK (capacity > 0)` |
| `ck_appointment_appointment_slots_numeric_pair_practitio_0abf` | CHECK | `CHECK ((practitioner_service_id IS NULL) = (practitioner_service_id_internal_id IS NULL))` |
| `ck_appointment_appointment_slots_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_appointment_appointment_slots_valid_window` | CHECK | `CHECK (ends_at > starts_at)` |
| `fk_appointment_appointment_slots_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_appointment_appointment_slots_practitioner_service_i_63f0` | FOREIGN KEY | `FOREIGN KEY (practitioner_service_id_internal_id) REFERENCES appointment.practitioner_services(internal_id) ON DELETE CASCADE` |
| `fk_appointment_appointment_slots_practitioner_service_i_a41a` | FOREIGN KEY | `FOREIGN KEY (practitioner_service_id) REFERENCES appointment.practitioner_services(id) ON DELETE CASCADE` |
| `fk_appointment_appointment_slots_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_appointment_appointment_slots` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `practitioner_slot_start` | UNIQUE | `UNIQUE (practitioner_service_id, starts_at)` |
| `uq_appointment_appointment_slots_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_appointment_slots_service_time` | `CREATE INDEX ix_appointment_slots_service_time ON appointment.appointment_slots USING btree (practitioner_service_id, starts_at)` |
| `ix_appointment_slots_status_time` | `CREATE INDEX ix_appointment_slots_status_time ON appointment.appointment_slots USING btree (status, starts_at)` |
| `pk_appointment_appointment_slots` | `CREATE UNIQUE INDEX pk_appointment_appointment_slots ON appointment.appointment_slots USING btree (internal_id)` |
| `practitioner_slot_start` | `CREATE UNIQUE INDEX practitioner_slot_start ON appointment.appointment_slots USING btree (practitioner_service_id, starts_at)` |
| `uq_appointment_appointment_slots_id` | `CREATE UNIQUE INDEX uq_appointment_appointment_slots_id ON appointment.appointment_slots USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON appointment.appointment_slots FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["practitioner_service_id","practitioner_service_id_internal_id","appointment","practitioner_services"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON appointment.appointment_slots FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON appointment.appointment_slots FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["practitioner_service_id","practitioner_service_id_internal_id","appointment","practitioner_services"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
