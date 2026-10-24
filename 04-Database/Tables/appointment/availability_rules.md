# `appointment.availability_rules`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds availability rules records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 19 columns, 11 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_appointment_availability_rules_created_by_users) |
| `day_of_week` | `integer` | No | — | Inferred: stores day of week for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_appointment_availability_rules_deleted_by_users) |
| `end_local_time` | `character varying(8)` | No | — | Inferred: stores end local time for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `practitioner_service_id` | `uuid` | No | — | Reference linking this record to practitioner services | Ensures related business data can be joined and validated | FK → `appointment.practitioner_services` (fk_appointment_availability_rules_practitioner_service__4974) |
| `practitioner_service_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.practitioner_services` (fk_appointment_availability_rules_practitioner_service__3b93); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `slot_capacity` | `integer` | No | `1` | Inferred: stores slot capacity for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `start_local_time` | `character varying(8)` | No | — | Inferred: stores start local time for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `timezone` | `character varying(64)` | No | `'Asia/Kolkata'::character varying` | Inferred: stores timezone for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_appointment_availability_rules_updated_by_users) |
| `valid_from` | `timestamp with time zone` | Yes | — | Inferred: stores valid from for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `valid_until` | `timestamp with time zone` | Yes | — | Inferred: stores valid until for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the availability rules business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `appointment.availability_rules` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_appointment_availability_rules_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_appointment_availability_rules_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_appointment_availability_rules_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `practitioner_service_id` → `appointment.practitioner_services(id)` via `fk_appointment_availability_rules_practitioner_service__4974`; `FOREIGN KEY (practitioner_service_id) REFERENCES appointment.practitioner_services(id) ON DELETE CASCADE`
- `practitioner_service_id_internal_id` → `appointment.practitioner_services(internal_id)` via `fk_appointment_availability_rules_practitioner_service__3b93`; `FOREIGN KEY (practitioner_service_id_internal_id) REFERENCES appointment.practitioner_services(internal_id) ON DELETE CASCADE`

## `appointment.availability_rules` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 19 columns, 11 constraints, 3 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_appointment_availability_rules_created_by_users` |
| `deleted_by` | `identity.users` | `fk_appointment_availability_rules_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_appointment_availability_rules_updated_by_users` |
| `practitioner_service_id` | `appointment.practitioner_services` | `fk_appointment_availability_rules_practitioner_service__4974` |
| `practitioner_service_id_internal_id` | `appointment.practitioner_services` | `fk_appointment_availability_rules_practitioner_service__3b93` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_appointment_availability_rules_numeric_pair_practiti_dbf5` | CHECK | `CHECK ((practitioner_service_id IS NULL) = (practitioner_service_id_internal_id IS NULL))` |
| `ck_appointment_availability_rules_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_appointment_availability_rules_slot_capacity_positive` | CHECK | `CHECK (slot_capacity > 0)` |
| `ck_appointment_availability_rules_weekday_range` | CHECK | `CHECK (day_of_week >= 0 AND day_of_week <= 6)` |
| `fk_appointment_availability_rules_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_appointment_availability_rules_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_appointment_availability_rules_practitioner_service__3b93` | FOREIGN KEY | `FOREIGN KEY (practitioner_service_id_internal_id) REFERENCES appointment.practitioner_services(internal_id) ON DELETE CASCADE` |
| `fk_appointment_availability_rules_practitioner_service__4974` | FOREIGN KEY | `FOREIGN KEY (practitioner_service_id) REFERENCES appointment.practitioner_services(id) ON DELETE CASCADE` |
| `fk_appointment_availability_rules_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_appointment_availability_rules` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_appointment_availability_rules_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_appointment_availability_practitioner` | `CREATE INDEX ix_appointment_availability_practitioner ON appointment.availability_rules USING btree (practitioner_service_id)` |
| `pk_appointment_availability_rules` | `CREATE UNIQUE INDEX pk_appointment_availability_rules ON appointment.availability_rules USING btree (internal_id)` |
| `uq_appointment_availability_rules_id` | `CREATE UNIQUE INDEX uq_appointment_availability_rules_id ON appointment.availability_rules USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON appointment.availability_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["practitioner_service_id","practitioner_service_id_internal_id","appointment","practitioner_services"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON appointment.availability_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON appointment.availability_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["practitioner_service_id","practitioner_service_id_internal_id","appointment","practitioner_services"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
