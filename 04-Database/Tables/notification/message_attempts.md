# `notification.message_attempts`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds message attempts records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 11 columns, 7 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `attempt_number` | `integer` | No | — | Inferred: stores attempt number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `attempted_at` | `timestamp with time zone` | No | `now()` | Time of attempted | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `message_id` | `uuid` | No | — | Reference linking this record to messages | Ensures related business data can be joined and validated | FK → `notification.messages` (fk_notification_message_attempts_message_id_messages) |
| `message_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `notification.messages` (fk_notification_message_attempts_message_id_messages_numeric); Numeric/public-key pair verification required |
| `next_retry_at` | `timestamp with time zone` | Yes | — | Time of next retry | Support chronology, deadlines or audit evidence | See exact constraints |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider_response` | `jsonb` | No | `'{}'::jsonb` | Structured provider response information | Retain a versioned payload or relevant details | See exact constraints |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the message attempts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Rider_App, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `notification.message_attempts` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `message_id` → `notification.messages(id)` via `fk_notification_message_attempts_message_id_messages`; `FOREIGN KEY (message_id) REFERENCES notification.messages(id) ON DELETE CASCADE`
- `message_id_internal_id` → `notification.messages(internal_id)` via `fk_notification_message_attempts_message_id_messages_numeric`; `FOREIGN KEY (message_id_internal_id) REFERENCES notification.messages(internal_id) ON DELETE CASCADE`

## `notification.message_attempts` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 11 columns, 7 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `message_id` | `notification.messages` | `fk_notification_message_attempts_message_id_messages` |
| `message_id_internal_id` | `notification.messages` | `fk_notification_message_attempts_message_id_messages_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_notification_message_attempts_attempt_number_positive` | CHECK | `CHECK (attempt_number > 0)` |
| `ck_notification_message_attempts_numeric_pair_message_id` | CHECK | `CHECK ((message_id IS NULL) = (message_id_internal_id IS NULL))` |
| `fk_notification_message_attempts_message_id_messages` | FOREIGN KEY | `FOREIGN KEY (message_id) REFERENCES notification.messages(id) ON DELETE CASCADE` |
| `fk_notification_message_attempts_message_id_messages_numeric` | FOREIGN KEY | `FOREIGN KEY (message_id_internal_id) REFERENCES notification.messages(internal_id) ON DELETE CASCADE` |
| `message_attempt_number` | UNIQUE | `UNIQUE (message_id, attempt_number)` |
| `pk_notification_message_attempts` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_notification_message_attempts_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_notification_message_attempts_message` | `CREATE INDEX ix_notification_message_attempts_message ON notification.message_attempts USING btree (message_id)` |
| `message_attempt_number` | `CREATE UNIQUE INDEX message_attempt_number ON notification.message_attempts USING btree (message_id, attempt_number)` |
| `pk_notification_message_attempts` | `CREATE UNIQUE INDEX pk_notification_message_attempts ON notification.message_attempts USING btree (internal_id)` |
| `uq_notification_message_attempts_id` | `CREATE UNIQUE INDEX uq_notification_message_attempts_id ON notification.message_attempts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON notification.message_attempts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["message_id","message_id_internal_id","notification","messages"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON notification.message_attempts FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON notification.message_attempts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["message_id","message_id_internal_id","notification","messages"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
