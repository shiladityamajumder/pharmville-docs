# appointment.appointment_status_history

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds appointment status history records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 10 columns, 6 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `actor_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_appointment_appointment_status_history_actor_user_id_users) |
| `appointment_id` | `uuid` | No | — | Reference linking this record to appointments | Ensures related business data can be joined and validated | FK → `appointment.appointments` (fk_appointment_appointment_status_history_appointment_i_dc2f) |
| `appointment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.appointments` (fk_appointment_appointment_status_history_appointment_i_ea3b); Numeric/public-key pair verification required |
| `comment` | `text` | Yes | — | Inferred: stores comment for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `from_status` | `character varying(32)` | Yes | — | Inferred: stores from status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `reason_code` | `character varying(64)` | Yes | — | Code for reason | Link to controlled business classification or an external reference | See exact constraints |
| `to_status` | `character varying(32)` | No | — | Inferred: stores to status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the appointment status history business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `appointment.appointment_status_history` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `actor_user_id` → `identity.users(id)` via `fk_appointment_appointment_status_history_actor_user_id_users`; FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `appointment_id` → `appointment.appointments(id)` via `fk_appointment_appointment_status_history_appointment_i_dc2f`; FOREIGN KEY (appointment_id) REFERENCES appointment.appointments(id) ON DELETE CASCADE
- `appointment_id_internal_id` → `appointment.appointments(internal_id)` via `fk_appointment_appointment_status_history_appointment_i_ea3b`; FOREIGN KEY (appointment_id_internal_id) REFERENCES appointment.appointments(internal_id) ON DELETE CASCADE

## appointment.appointment_status_history — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 10 columns, 6 constraints, 3 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `actor_user_id` | `identity.users` | `fk_appointment_appointment_status_history_actor_user_id_users` |
| `appointment_id` | `appointment.appointments` | `fk_appointment_appointment_status_history_appointment_i_dc2f` |
| `appointment_id_internal_id` | `appointment.appointments` | `fk_appointment_appointment_status_history_appointment_i_ea3b` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_appointment_appointment_status_history_numeric_pair__71d8` | CHECK | `CHECK ((appointment_id IS NULL) = (appointment_id_internal_id IS NULL))` |
| `fk_appointment_appointment_status_history_actor_user_id_users` | FOREIGN KEY | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_appointment_appointment_status_history_appointment_i_dc2f` | FOREIGN KEY | `FOREIGN KEY (appointment_id) REFERENCES appointment.appointments(id) ON DELETE CASCADE` |
| `fk_appointment_appointment_status_history_appointment_i_ea3b` | FOREIGN KEY | `FOREIGN KEY (appointment_id_internal_id) REFERENCES appointment.appointments(internal_id) ON DELETE CASCADE` |
| `pk_appointment_appointment_status_history` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_appointment_appointment_status_history_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_appointment_status_history_appointment_time` | `CREATE INDEX ix_appointment_status_history_appointment_time ON appointment.appointment_status_history USING btree (appointment_id, created_at)` |
| `pk_appointment_appointment_status_history` | `CREATE UNIQUE INDEX pk_appointment_appointment_status_history ON appointment.appointment_status_history USING btree (internal_id)` |
| `uq_appointment_appointment_status_history_id` | `CREATE UNIQUE INDEX uq_appointment_appointment_status_history_id ON appointment.appointment_status_history USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON appointment.appointment_status_history FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["appointment_id","appointment_id_internal_id","appointment","appointments"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON appointment.appointment_status_history FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON appointment.appointment_status_history FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["appointment_id","appointment_id_internal_id","appointment","appointments"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
