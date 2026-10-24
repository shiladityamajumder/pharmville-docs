# `notification.message_attempts`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds message attempts records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | notification.message_attempts |
| Classification | Audit / History |
| Proposed business write owner | Notifications |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 11 columns; 7 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `attempt_number` | `integer` | No | — | Inferred: stores attempt number for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `attempted_at` | `timestamp with time zone` | No | `now()` | Time of attempted | Support chronology, deadlines or audit evidence | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `message_id` | `uuid` | No | — | Reference linking this record to messages | Ensures related business data can be joined and validated | FK → `notification.messages` via `fk_notification_message_attempts_message_id_messages` |
| `message_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `notification.messages` via `fk_notification_message_attempts_message_id_messages_numeric` |
| `next_retry_at` | `timestamp with time zone` | Yes | — | Time of next retry | Support chronology, deadlines or audit evidence | Exact constraints below |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider_response` | `jsonb` | No | `'{}'::jsonb` | Structured provider response information | Retain a versioned payload or relevant details | Exact constraints below |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |

## Record lifecycle and users

- **Created:** when the message attempts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Rider_App, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `notification.message_attempts` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_notification_message_attempts_message_id_messages | `message_id` | [`notification.messages`](../../Tables/notification/messages.md) | `FOREIGN KEY (message_id) REFERENCES notification.messages(id) ON DELETE CASCADE` |
| fk_notification_message_attempts_message_id_messages_numeric | `message_id_internal_id` | [`notification.messages`](../../Tables/notification/messages.md) | `FOREIGN KEY (message_id_internal_id) REFERENCES notification.messages(internal_id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `notification.message_attempts` — exact structural contracts

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
| `message_attempts_attempt_number_not_null` | NOT NULL | `NOT NULL attempt_number` |
| `message_attempts_attempted_at_not_null` | NOT NULL | `NOT NULL attempted_at` |
| `message_attempts_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `message_attempts_id_not_null` | NOT NULL | `NOT NULL id` |
| `message_attempts_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `message_attempts_message_id_internal_id_not_null` | NOT NULL | `NOT NULL message_id_internal_id` |
| `message_attempts_message_id_not_null` | NOT NULL | `NOT NULL message_id` |
| `message_attempts_provider_not_null` | NOT NULL | `NOT NULL provider` |
| `message_attempts_provider_response_not_null` | NOT NULL | `NOT NULL provider_response` |
| `message_attempts_status_not_null` | NOT NULL | `NOT NULL status` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_notification_message_attempts_message` | btree | `(message_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_notification_message_attempts_message ON notification.message_attempts USING btree (message_id)` |
| `message_attempt_number` | btree | `(message_id, attempt_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX message_attempt_number ON notification.message_attempts USING btree (message_id, attempt_number)` |
| `pk_notification_message_attempts` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_notification_message_attempts ON notification.message_attempts USING btree (internal_id)` |
| `uq_notification_message_attempts_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_notification_message_attempts_id ON notification.message_attempts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON notification.message_attempts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["message_id","message_id_internal_id","notification","messages"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON notification.message_attempts FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON notification.message_attempts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["message_id","message_id_internal_id","notification","messages"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
