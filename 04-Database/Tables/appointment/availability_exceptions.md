# `appointment.availability_exceptions`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds availability exceptions records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | appointment.availability_exceptions |
| Classification | Configuration |
| Proposed business write owner | Future appointment owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `capacity_override` | `integer` | Yes | — | Inferred: stores capacity override for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_appointment_availability_exceptions_created_by_users` |
| `ends_at` | `timestamp with time zone` | No | — | Time of ends | Support chronology, deadlines or audit evidence | Exact constraints below |
| `exception_type` | `character varying(32)` | No | — | Inferred: stores exception type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `practitioner_service_id` | `uuid` | No | — | Reference linking this record to practitioner services | Ensures related business data can be joined and validated | FK → `appointment.practitioner_services` via `fk_appointment_availability_exceptions_practitioner_ser_5867` |
| `practitioner_service_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.practitioner_services` via `fk_appointment_availability_exceptions_practitioner_ser_be1d` |
| `reason` | `character varying(255)` | Yes | — | Inferred: stores reason for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `starts_at` | `timestamp with time zone` | No | — | Time of starts | Support chronology, deadlines or audit evidence | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_appointment_availability_exceptions_updated_by_users` |

## Record lifecycle and users

- **Created:** when the availability exceptions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `appointment.availability_exceptions` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_appointment_availability_exceptions_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_appointment_availability_exceptions_practitioner_ser_5867 | `practitioner_service_id` | [`appointment.practitioner_services`](../../Tables/appointment/practitioner_services.md) | `FOREIGN KEY (practitioner_service_id) REFERENCES appointment.practitioner_services(id) ON DELETE CASCADE` |
| fk_appointment_availability_exceptions_practitioner_ser_be1d | `practitioner_service_id_internal_id` | [`appointment.practitioner_services`](../../Tables/appointment/practitioner_services.md) | `FOREIGN KEY (practitioner_service_id_internal_id) REFERENCES appointment.practitioner_services(internal_id) ON DELETE CASCADE` |
| fk_appointment_availability_exceptions_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `appointment.availability_exceptions` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_appointment_availability_exceptions_created_by_users` |
| `practitioner_service_id` | `appointment.practitioner_services` | `fk_appointment_availability_exceptions_practitioner_ser_5867` |
| `practitioner_service_id_internal_id` | `appointment.practitioner_services` | `fk_appointment_availability_exceptions_practitioner_ser_be1d` |
| `updated_by` | `identity.users` | `fk_appointment_availability_exceptions_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_appointment_availability_exceptions_numeric_pair_pra_bd51` | CHECK | `CHECK ((practitioner_service_id IS NULL) = (practitioner_service_id_internal_id IS NULL))` |
| `ck_appointment_availability_exceptions_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_appointment_availability_exceptions_valid_window` | CHECK | `CHECK (ends_at > starts_at)` |
| `fk_appointment_availability_exceptions_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_appointment_availability_exceptions_practitioner_ser_5867` | FOREIGN KEY | `FOREIGN KEY (practitioner_service_id) REFERENCES appointment.practitioner_services(id) ON DELETE CASCADE` |
| `fk_appointment_availability_exceptions_practitioner_ser_be1d` | FOREIGN KEY | `FOREIGN KEY (practitioner_service_id_internal_id) REFERENCES appointment.practitioner_services(internal_id) ON DELETE CASCADE` |
| `fk_appointment_availability_exceptions_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_appointment_availability_exceptions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_appointment_availability_exceptions_id` | UNIQUE | `UNIQUE (id)` |
| `availability_exceptions_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `availability_exceptions_ends_at_not_null` | NOT NULL | `NOT NULL ends_at` |
| `availability_exceptions_exception_type_not_null` | NOT NULL | `NOT NULL exception_type` |
| `availability_exceptions_id_not_null` | NOT NULL | `NOT NULL id` |
| `availability_exceptions_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `availability_exceptions_practitioner_service_id_intern_not_null` | NOT NULL | `NOT NULL practitioner_service_id_internal_id` |
| `availability_exceptions_practitioner_service_id_not_null` | NOT NULL | `NOT NULL practitioner_service_id` |
| `availability_exceptions_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `availability_exceptions_starts_at_not_null` | NOT NULL | `NOT NULL starts_at` |
| `availability_exceptions_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_appointment_availability_exceptions_service` | btree | `(practitioner_service_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_appointment_availability_exceptions_service ON appointment.availability_exceptions USING btree (practitioner_service_id)` |
| `pk_appointment_availability_exceptions` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_appointment_availability_exceptions ON appointment.availability_exceptions USING btree (internal_id)` |
| `uq_appointment_availability_exceptions_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_appointment_availability_exceptions_id ON appointment.availability_exceptions USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON appointment.availability_exceptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["practitioner_service_id","practitioner_service_id_internal_id","appointment","practitioner_services"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON appointment.availability_exceptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON appointment.availability_exceptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["practitioner_service_id","practitioner_service_id_internal_id","appointment","practitioner_services"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
