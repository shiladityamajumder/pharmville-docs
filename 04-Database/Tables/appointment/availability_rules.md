# `appointment.availability_rules`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds availability rules records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | appointment.availability_rules |
| Classification | Configuration |
| Proposed business write owner | Future appointment owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 19 columns; 11 PK/FK/UQ/CHECK/exclusion constraints; 13 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_appointment_availability_rules_created_by_users` |
| `day_of_week` | `integer` | No | — | Inferred: stores day of week for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_appointment_availability_rules_deleted_by_users` |
| `end_local_time` | `character varying(8)` | No | — | Inferred: stores end local time for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `practitioner_service_id` | `uuid` | No | — | Reference linking this record to practitioner services | Ensures related business data can be joined and validated | FK → `appointment.practitioner_services` via `fk_appointment_availability_rules_practitioner_service__4974` |
| `practitioner_service_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.practitioner_services` via `fk_appointment_availability_rules_practitioner_service__3b93` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `slot_capacity` | `integer` | No | `1` | Inferred: stores slot capacity for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `start_local_time` | `character varying(8)` | No | — | Inferred: stores start local time for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `timezone` | `character varying(64)` | No | `'Asia/Kolkata'::character varying` | Inferred: stores timezone for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_appointment_availability_rules_updated_by_users` |
| `valid_from` | `timestamp with time zone` | Yes | — | Inferred: stores valid from for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `valid_until` | `timestamp with time zone` | Yes | — | Inferred: stores valid until for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the availability rules business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `appointment.availability_rules` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_appointment_availability_rules_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_appointment_availability_rules_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_appointment_availability_rules_practitioner_service__3b93 | `practitioner_service_id_internal_id` | [`appointment.practitioner_services`](../../Tables/appointment/practitioner_services.md) | `FOREIGN KEY (practitioner_service_id_internal_id) REFERENCES appointment.practitioner_services(internal_id) ON DELETE CASCADE` |
| fk_appointment_availability_rules_practitioner_service__4974 | `practitioner_service_id` | [`appointment.practitioner_services`](../../Tables/appointment/practitioner_services.md) | `FOREIGN KEY (practitioner_service_id) REFERENCES appointment.practitioner_services(id) ON DELETE CASCADE` |
| fk_appointment_availability_rules_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `appointment.availability_rules` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_appointment_availability_rules_created_by_users` |
| `deleted_by` | `identity.users` | `fk_appointment_availability_rules_deleted_by_users` |
| `practitioner_service_id_internal_id` | `appointment.practitioner_services` | `fk_appointment_availability_rules_practitioner_service__3b93` |
| `practitioner_service_id` | `appointment.practitioner_services` | `fk_appointment_availability_rules_practitioner_service__4974` |
| `updated_by` | `identity.users` | `fk_appointment_availability_rules_updated_by_users` |

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
| `availability_rules_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `availability_rules_day_of_week_not_null` | NOT NULL | `NOT NULL day_of_week` |
| `availability_rules_end_local_time_not_null` | NOT NULL | `NOT NULL end_local_time` |
| `availability_rules_id_not_null` | NOT NULL | `NOT NULL id` |
| `availability_rules_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `availability_rules_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `availability_rules_practitioner_service_id_internal_id_not_null` | NOT NULL | `NOT NULL practitioner_service_id_internal_id` |
| `availability_rules_practitioner_service_id_not_null` | NOT NULL | `NOT NULL practitioner_service_id` |
| `availability_rules_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `availability_rules_slot_capacity_not_null` | NOT NULL | `NOT NULL slot_capacity` |
| `availability_rules_start_local_time_not_null` | NOT NULL | `NOT NULL start_local_time` |
| `availability_rules_timezone_not_null` | NOT NULL | `NOT NULL timezone` |
| `availability_rules_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_appointment_availability_practitioner` | btree | `(practitioner_service_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_appointment_availability_practitioner ON appointment.availability_rules USING btree (practitioner_service_id)` |
| `pk_appointment_availability_rules` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_appointment_availability_rules ON appointment.availability_rules USING btree (internal_id)` |
| `uq_appointment_availability_rules_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_appointment_availability_rules_id ON appointment.availability_rules USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON appointment.availability_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["practitioner_service_id","practitioner_service_id_internal_id","appointment","practitioner_services"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON appointment.availability_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON appointment.availability_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["practitioner_service_id","practitioner_service_id_internal_id","appointment","practitioner_services"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
