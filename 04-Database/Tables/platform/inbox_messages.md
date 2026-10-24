# `platform.inbox_messages`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds inbox messages records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | platform.inbox_messages |
| Classification | Derived / Operational |
| Proposed business write owner | Shared platform runtime — engineering owner |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 6 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `consumer_name` | `character varying(128)` | No | — | Inferred: stores consumer name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_inbox_messages_created_by_users` |
| `error_message` | `text` | Yes | — | Inferred: stores error message for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `event_type` | `character varying(128)` | No | — | Inferred: stores event type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `message_id` | `uuid` | No | — | Identifier associated with message | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `payload_hash` | `character varying(64)` | Yes | — | Inferred: stores payload hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `processed_at` | `timestamp with time zone` | Yes | — | Time of processed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `received_at` | `timestamp with time zone` | No | `now()` | Time of received | Support chronology, deadlines or audit evidence | Exact constraints below |
| `result` | `character varying(32)` | No | `'received'::character varying` | Inferred: stores result for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_inbox_messages_updated_by_users` |

## Record lifecycle and users

- **Created:** when the inbox messages business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.inbox_messages` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_platform_inbox_messages_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_inbox_messages_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `platform.inbox_messages` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_platform_inbox_messages_created_by_users` |
| `updated_by` | `identity.users` | `fk_platform_inbox_messages_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_inbox_messages_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `consumer_message` | UNIQUE | `UNIQUE (consumer_name, message_id)` |
| `fk_platform_inbox_messages_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_inbox_messages_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_platform_inbox_messages` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_inbox_messages_id` | UNIQUE | `UNIQUE (id)` |
| `inbox_messages_consumer_name_not_null` | NOT NULL | `NOT NULL consumer_name` |
| `inbox_messages_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `inbox_messages_event_type_not_null` | NOT NULL | `NOT NULL event_type` |
| `inbox_messages_id_not_null` | NOT NULL | `NOT NULL id` |
| `inbox_messages_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `inbox_messages_message_id_not_null` | NOT NULL | `NOT NULL message_id` |
| `inbox_messages_received_at_not_null` | NOT NULL | `NOT NULL received_at` |
| `inbox_messages_result_not_null` | NOT NULL | `NOT NULL result` |
| `inbox_messages_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `inbox_messages_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `consumer_message` | btree | `(consumer_name, message_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX consumer_message ON platform.inbox_messages USING btree (consumer_name, message_id)` |
| `ix_platform_inbox_messages_message` | btree | `(message_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_inbox_messages_message ON platform.inbox_messages USING btree (message_id)` |
| `ix_platform_inbox_messages_processed` | btree | `(processed_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_inbox_messages_processed ON platform.inbox_messages USING btree (processed_at)` |
| `pk_platform_inbox_messages` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_platform_inbox_messages ON platform.inbox_messages USING btree (internal_id)` |
| `uq_platform_inbox_messages_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_inbox_messages_id ON platform.inbox_messages USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.inbox_messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.inbox_messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.inbox_messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
