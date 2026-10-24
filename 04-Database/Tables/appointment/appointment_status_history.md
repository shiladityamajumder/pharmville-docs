# `appointment.appointment_status_history`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds appointment status history records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | appointment.appointment_status_history |
| Classification | Audit / History |
| Proposed business write owner | Future appointment owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 10 columns; 6 PK/FK/UQ/CHECK/exclusion constraints; 6 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `actor_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_appointment_appointment_status_history_actor_user_id_users` |
| `appointment_id` | `uuid` | No | — | Reference linking this record to appointments | Ensures related business data can be joined and validated | FK → `appointment.appointments` via `fk_appointment_appointment_status_history_appointment_i_dc2f` |
| `appointment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.appointments` via `fk_appointment_appointment_status_history_appointment_i_ea3b` |
| `comment` | `text` | Yes | — | Inferred: stores comment for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `from_status` | `character varying(32)` | Yes | — | Inferred: stores from status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `reason_code` | `character varying(64)` | Yes | — | Code for reason | Link to controlled business classification or an external reference | Collation: default |
| `to_status` | `character varying(32)` | No | — | Inferred: stores to status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the appointment status history business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `appointment.appointment_status_history` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_appointment_appointment_status_history_actor_user_id_users | `actor_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_appointment_appointment_status_history_appointment_i_dc2f | `appointment_id` | [`appointment.appointments`](../../Tables/appointment/appointments.md) | `FOREIGN KEY (appointment_id) REFERENCES appointment.appointments(id) ON DELETE CASCADE` |
| fk_appointment_appointment_status_history_appointment_i_ea3b | `appointment_id_internal_id` | [`appointment.appointments`](../../Tables/appointment/appointments.md) | `FOREIGN KEY (appointment_id_internal_id) REFERENCES appointment.appointments(internal_id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `appointment.appointment_status_history` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `actor_user_id` | `identity.users` | `fk_appointment_appointment_status_history_actor_user_id_users` |
| `appointment_id` | `appointment.appointments` | `fk_appointment_appointment_status_history_appointment_i_dc2f` |
| `appointment_id_internal_id` | `appointment.appointments` | `fk_appointment_appointment_status_history_appointment_i_ea3b` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_appointment_appointment_status_history_numeric_pair__71d8` | CHECK | `CHECK ((appointment_id IS NULL) = (appointment_id_internal_id IS NULL))` |
| `fk_appointment_appointment_status_history_actor_user_id_users` | FOREIGN KEY | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_appointment_appointment_status_history_appointment_i_dc2f` | FOREIGN KEY | `FOREIGN KEY (appointment_id) REFERENCES appointment.appointments(id) ON DELETE CASCADE` |
| `fk_appointment_appointment_status_history_appointment_i_ea3b` | FOREIGN KEY | `FOREIGN KEY (appointment_id_internal_id) REFERENCES appointment.appointments(internal_id) ON DELETE CASCADE` |
| `pk_appointment_appointment_status_history` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_appointment_appointment_status_history_id` | UNIQUE | `UNIQUE (id)` |
| `appointment_status_history_appointment_id_internal_id_not_null` | NOT NULL | `NOT NULL appointment_id_internal_id` |
| `appointment_status_history_appointment_id_not_null` | NOT NULL | `NOT NULL appointment_id` |
| `appointment_status_history_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `appointment_status_history_id_not_null` | NOT NULL | `NOT NULL id` |
| `appointment_status_history_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `appointment_status_history_to_status_not_null` | NOT NULL | `NOT NULL to_status` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_appointment_status_history_appointment_time` | btree | `(appointment_id, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_appointment_status_history_appointment_time ON appointment.appointment_status_history USING btree (appointment_id, created_at)` |
| `pk_appointment_appointment_status_history` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_appointment_appointment_status_history ON appointment.appointment_status_history USING btree (internal_id)` |
| `uq_appointment_appointment_status_history_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_appointment_appointment_status_history_id ON appointment.appointment_status_history USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON appointment.appointment_status_history FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["appointment_id","appointment_id_internal_id","appointment","appointments"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON appointment.appointment_status_history FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON appointment.appointment_status_history FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["appointment_id","appointment_id_internal_id","appointment","appointments"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
