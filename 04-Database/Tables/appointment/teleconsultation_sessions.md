# `appointment.teleconsultation_sessions`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds teleconsultation sessions records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | appointment.teleconsultation_sessions |
| Classification | Transactional |
| Proposed business write owner | Future appointment owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `appointment_id` | `uuid` | No | — | Reference linking this record to appointments | Ensures related business data can be joined and validated | FK → `appointment.appointments` via `fk_appointment_teleconsultation_sessions_appointment_id_b6ed` |
| `appointment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.appointments` via `fk_appointment_teleconsultation_sessions_appointment_id_32d4` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_appointment_teleconsultation_sessions_created_by_users` |
| `ended_at` | `timestamp with time zone` | Yes | — | Time of ended | Support chronology, deadlines or audit evidence | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `join_url_encrypted` | `bytea` | Yes | — | Inferred: stores join url encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider_session_id` | `character varying(255)` | No | — | Identifier associated with provider session | Link the event or entity to its subject; verify constraints | Collation: default |
| `recording_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_appointment_teleconsultation_sessions_recording_file_7410` |
| `recording_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_appointment_teleconsultation_sessions_recording_file_885a` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `started_at` | `timestamp with time zone` | Yes | — | Time of started | Support chronology, deadlines or audit evidence | Exact constraints below |
| `status` | `character varying(32)` | No | `'created'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_appointment_teleconsultation_sessions_updated_by_users` |

## Record lifecycle and users

- **Created:** when the teleconsultation sessions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `appointment.teleconsultation_sessions` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_appointment_teleconsultation_sessions_appointment_id_32d4 | `appointment_id_internal_id` | [`appointment.appointments`](../../Tables/appointment/appointments.md) | `FOREIGN KEY (appointment_id_internal_id) REFERENCES appointment.appointments(internal_id) ON DELETE CASCADE` |
| fk_appointment_teleconsultation_sessions_appointment_id_b6ed | `appointment_id` | [`appointment.appointments`](../../Tables/appointment/appointments.md) | `FOREIGN KEY (appointment_id) REFERENCES appointment.appointments(id) ON DELETE CASCADE` |
| fk_appointment_teleconsultation_sessions_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_appointment_teleconsultation_sessions_recording_file_7410 | `recording_file_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (recording_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| fk_appointment_teleconsultation_sessions_recording_file_885a | `recording_file_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (recording_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| fk_appointment_teleconsultation_sessions_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `appointment.teleconsultation_sessions` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `appointment_id_internal_id` | `appointment.appointments` | `fk_appointment_teleconsultation_sessions_appointment_id_32d4` |
| `appointment_id` | `appointment.appointments` | `fk_appointment_teleconsultation_sessions_appointment_id_b6ed` |
| `created_by` | `identity.users` | `fk_appointment_teleconsultation_sessions_created_by_users` |
| `recording_file_id` | `platform.file_objects` | `fk_appointment_teleconsultation_sessions_recording_file_7410` |
| `recording_file_id_internal_id` | `platform.file_objects` | `fk_appointment_teleconsultation_sessions_recording_file_885a` |
| `updated_by` | `identity.users` | `fk_appointment_teleconsultation_sessions_updated_by_users` |

### Existing constraints

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
| `teleconsultation_sessions_appointment_id_internal_id_not_null` | NOT NULL | `NOT NULL appointment_id_internal_id` |
| `teleconsultation_sessions_appointment_id_not_null` | NOT NULL | `NOT NULL appointment_id` |
| `teleconsultation_sessions_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `teleconsultation_sessions_id_not_null` | NOT NULL | `NOT NULL id` |
| `teleconsultation_sessions_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `teleconsultation_sessions_provider_not_null` | NOT NULL | `NOT NULL provider` |
| `teleconsultation_sessions_provider_session_id_not_null` | NOT NULL | `NOT NULL provider_session_id` |
| `teleconsultation_sessions_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `teleconsultation_sessions_status_not_null` | NOT NULL | `NOT NULL status` |
| `teleconsultation_sessions_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `appointment_teleconsultation_session` | btree | `(appointment_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX appointment_teleconsultation_session ON appointment.teleconsultation_sessions USING btree (appointment_id)` |
| `ix_appointment_teleconsultation_provider_session` | btree | `(provider, provider_session_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_appointment_teleconsultation_provider_session ON appointment.teleconsultation_sessions USING btree (provider, provider_session_id)` |
| `pk_appointment_teleconsultation_sessions` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_appointment_teleconsultation_sessions ON appointment.teleconsultation_sessions USING btree (internal_id)` |
| `uq_appointment_teleconsultation_sessions_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_appointment_teleconsultation_sessions_id ON appointment.teleconsultation_sessions USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON appointment.teleconsultation_sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["appointment_id","appointment_id_internal_id","appointment","appointments"],["recording_file_id","recording_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON appointment.teleconsultation_sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON appointment.teleconsultation_sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["appointment_id","appointment_id_internal_id","appointment","appointments"],["recording_file_id","recording_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
