# appointment.teleconsultation_sessions

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds teleconsultation sessions records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 12 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `appointment_id` | `uuid` | No | — | Reference linking this record to appointments | Ensures related business data can be joined and validated | FK → `appointment.appointments` (fk_appointment_teleconsultation_sessions_appointment_id_b6ed) |
| `appointment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.appointments` (fk_appointment_teleconsultation_sessions_appointment_id_32d4); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_appointment_teleconsultation_sessions_created_by_users) |
| `ended_at` | `timestamp with time zone` | Yes | — | Time of ended | Support chronology, deadlines or audit evidence | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `join_url_encrypted` | `bytea` | Yes | — | Inferred: stores join url encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider_session_id` | `character varying(255)` | No | — | Identifier associated with provider session | Link the event or entity to its subject; verify constraints | See exact constraints |
| `recording_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_appointment_teleconsultation_sessions_recording_file_7410) |
| `recording_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_appointment_teleconsultation_sessions_recording_file_885a); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `started_at` | `timestamp with time zone` | Yes | — | Time of started | Support chronology, deadlines or audit evidence | See exact constraints |
| `status` | `character varying(32)` | No | `'created'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_appointment_teleconsultation_sessions_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the teleconsultation sessions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `appointment.teleconsultation_sessions` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_appointment_teleconsultation_sessions_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_appointment_teleconsultation_sessions_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `appointment_id` → `appointment.appointments(id)` via `fk_appointment_teleconsultation_sessions_appointment_id_b6ed`; FOREIGN KEY (appointment_id) REFERENCES appointment.appointments(id) ON DELETE CASCADE
- `recording_file_id` → `platform.file_objects(id)` via `fk_appointment_teleconsultation_sessions_recording_file_7410`; FOREIGN KEY (recording_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL
- `appointment_id_internal_id` → `appointment.appointments(internal_id)` via `fk_appointment_teleconsultation_sessions_appointment_id_32d4`; FOREIGN KEY (appointment_id_internal_id) REFERENCES appointment.appointments(internal_id) ON DELETE CASCADE
- `recording_file_id_internal_id` → `platform.file_objects(internal_id)` via `fk_appointment_teleconsultation_sessions_recording_file_885a`; FOREIGN KEY (recording_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL

## appointment.teleconsultation_sessions — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 17 columns, 12 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_appointment_teleconsultation_sessions_created_by_users` |
| `updated_by` | `identity.users` | `fk_appointment_teleconsultation_sessions_updated_by_users` |
| `appointment_id` | `appointment.appointments` | `fk_appointment_teleconsultation_sessions_appointment_id_b6ed` |
| `recording_file_id` | `platform.file_objects` | `fk_appointment_teleconsultation_sessions_recording_file_7410` |
| `appointment_id_internal_id` | `appointment.appointments` | `fk_appointment_teleconsultation_sessions_appointment_id_32d4` |
| `recording_file_id_internal_id` | `platform.file_objects` | `fk_appointment_teleconsultation_sessions_recording_file_885a` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `appointment_teleconsultation_session` | UNIQUE | `UNIQUE (appointment_id)` |
| `ck_appointment_teleconsultation_sessions_numeric_pair_a_c138` | CHECK | `CHECK ((appointment_id IS NULL) = (appointment_id_internal_id IS NULL))` |
| `ck_appointment_teleconsultation_sessions_numeric_pair_r_3288` | CHECK | `CHECK ((recording_file_id IS NULL) = (recording_file_id_internal_id IS NULL))` |
| `ck_appointment_teleconsultation_sessions_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_appointment_teleconsultation_sessions_appointment_id_32d4` | FOREIGN KEY | `FOREIGN KEY (appointment_id_internal_id) REFERENCES appointment.appointments(internal_id) ON DELETE CASCADE` |
| `fk_appointment_teleconsultation_sessions_appointment_id_b6ed` | FOREIGN KEY | `FOREIGN KEY (appointment_id) REFERENCES appointment.appointments(id) ON DELETE CASCADE` |
| `fk_appointment_teleconsultation_sessions_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_appointment_teleconsultation_sessions_recording_file_7410` | FOREIGN KEY | `FOREIGN KEY (recording_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| `fk_appointment_teleconsultation_sessions_recording_file_885a` | FOREIGN KEY | `FOREIGN KEY (recording_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| `fk_appointment_teleconsultation_sessions_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_appointment_teleconsultation_sessions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_appointment_teleconsultation_sessions_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `appointment_teleconsultation_session` | `CREATE UNIQUE INDEX appointment_teleconsultation_session ON appointment.teleconsultation_sessions USING btree (appointment_id)` |
| `ix_appointment_teleconsultation_provider_session` | `CREATE INDEX ix_appointment_teleconsultation_provider_session ON appointment.teleconsultation_sessions USING btree (provider, provider_session_id)` |
| `pk_appointment_teleconsultation_sessions` | `CREATE UNIQUE INDEX pk_appointment_teleconsultation_sessions ON appointment.teleconsultation_sessions USING btree (internal_id)` |
| `uq_appointment_teleconsultation_sessions_id` | `CREATE UNIQUE INDEX uq_appointment_teleconsultation_sessions_id ON appointment.teleconsultation_sessions USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON appointment.teleconsultation_sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["appointment_id","appointment_id_internal_id","appointment","appointments"],["recording_file_id","recording_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON appointment.teleconsultation_sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON appointment.teleconsultation_sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["appointment_id","appointment_id_internal_id","appointment","appointments"],["recording_file_id","recording_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
