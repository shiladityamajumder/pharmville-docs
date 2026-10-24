# `notification.message_attachments`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds message attachments records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | notification.message_attachments |
| Classification | Mapping / Junction |
| Proposed business write owner | Notifications |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 13 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `content_id` | `character varying(255)` | Yes | — | Identifier associated with content | Link the event or entity to its subject; verify constraints | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_message_attachments_created_by_users` |
| `display_order` | `integer` | No | `0` | Inferred: stores display order for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `disposition` | `character varying(16)` | No | `'attachment'::character varying` | Inferred: stores disposition for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `file_object_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_notification_message_attachments_file_object_id_file_objects` |
| `file_object_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_notification_message_attachments_file_object_id_file_0d0a` |
| `filename` | `character varying(255)` | Yes | — | Inferred: stores filename for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `message_id` | `uuid` | No | — | Reference linking this record to messages | Ensures related business data can be joined and validated | FK → `notification.messages` via `fk_notification_message_attachments_message_id_messages` |
| `message_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `notification.messages` via `fk_notification_message_attachments_message_id_messages_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_message_attachments_updated_by_users` |

## Record lifecycle and users

- **Created:** when the message attachments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Rider_App, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `notification.message_attachments` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_notification_message_attachments_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_notification_message_attachments_file_object_id_file_0d0a | `file_object_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT` |
| fk_notification_message_attachments_file_object_id_file_objects | `file_object_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT` |
| fk_notification_message_attachments_message_id_messages | `message_id` | [`notification.messages`](../../Tables/notification/messages.md) | `FOREIGN KEY (message_id) REFERENCES notification.messages(id) ON DELETE CASCADE` |
| fk_notification_message_attachments_message_id_messages_numeric | `message_id_internal_id` | [`notification.messages`](../../Tables/notification/messages.md) | `FOREIGN KEY (message_id_internal_id) REFERENCES notification.messages(internal_id) ON DELETE CASCADE` |
| fk_notification_message_attachments_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `notification.message_attachments` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_notification_message_attachments_created_by_users` |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_notification_message_attachments_file_object_id_file_0d0a` |
| `file_object_id` | `platform.file_objects` | `fk_notification_message_attachments_file_object_id_file_objects` |
| `message_id` | `notification.messages` | `fk_notification_message_attachments_message_id_messages` |
| `message_id_internal_id` | `notification.messages` | `fk_notification_message_attachments_message_id_messages_numeric` |
| `updated_by` | `identity.users` | `fk_notification_message_attachments_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_notification_message_attachments_display_order_nonnegative` | CHECK | `CHECK (display_order >= 0)` |
| `ck_notification_message_attachments_numeric_pair_file_object_id` | CHECK | `CHECK ((file_object_id IS NULL) = (file_object_id_internal_id IS NULL))` |
| `ck_notification_message_attachments_numeric_pair_message_id` | CHECK | `CHECK ((message_id IS NULL) = (message_id_internal_id IS NULL))` |
| `ck_notification_message_attachments_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_notification_message_attachments_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_message_attachments_file_object_id_file_0d0a` | FOREIGN KEY | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT` |
| `fk_notification_message_attachments_file_object_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT` |
| `fk_notification_message_attachments_message_id_messages` | FOREIGN KEY | `FOREIGN KEY (message_id) REFERENCES notification.messages(id) ON DELETE CASCADE` |
| `fk_notification_message_attachments_message_id_messages_numeric` | FOREIGN KEY | `FOREIGN KEY (message_id_internal_id) REFERENCES notification.messages(internal_id) ON DELETE CASCADE` |
| `fk_notification_message_attachments_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `message_file_attachment` | UNIQUE | `UNIQUE (message_id, file_object_id)` |
| `pk_notification_message_attachments` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_notification_message_attachments_id` | UNIQUE | `UNIQUE (id)` |
| `message_attachments_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `message_attachments_display_order_not_null` | NOT NULL | `NOT NULL display_order` |
| `message_attachments_disposition_not_null` | NOT NULL | `NOT NULL disposition` |
| `message_attachments_file_object_id_internal_id_not_null` | NOT NULL | `NOT NULL file_object_id_internal_id` |
| `message_attachments_file_object_id_not_null` | NOT NULL | `NOT NULL file_object_id` |
| `message_attachments_id_not_null` | NOT NULL | `NOT NULL id` |
| `message_attachments_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `message_attachments_message_id_internal_id_not_null` | NOT NULL | `NOT NULL message_id_internal_id` |
| `message_attachments_message_id_not_null` | NOT NULL | `NOT NULL message_id` |
| `message_attachments_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `message_attachments_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_notification_message_attachments_message` | btree | `(message_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_notification_message_attachments_message ON notification.message_attachments USING btree (message_id)` |
| `message_file_attachment` | btree | `(message_id, file_object_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX message_file_attachment ON notification.message_attachments USING btree (message_id, file_object_id)` |
| `pk_notification_message_attachments` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_notification_message_attachments ON notification.message_attachments USING btree (internal_id)` |
| `uq_notification_message_attachments_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_notification_message_attachments_id ON notification.message_attachments USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON notification.message_attachments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"],["message_id","message_id_internal_id","notification","messages"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON notification.message_attachments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON notification.message_attachments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"],["message_id","message_id_internal_id","notification","messages"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
