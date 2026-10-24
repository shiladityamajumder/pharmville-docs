# `notification.message_attachments`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds message attachments records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 13 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `content_id` | `character varying(255)` | Yes | — | Identifier associated with content | Link the event or entity to its subject; verify constraints | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_message_attachments_created_by_users) |
| `display_order` | `integer` | No | `0` | Inferred: stores display order for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `disposition` | `character varying(16)` | No | `'attachment'::character varying` | Inferred: stores disposition for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `file_object_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_notification_message_attachments_file_object_id_file_objects) |
| `file_object_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_notification_message_attachments_file_object_id_file_0d0a); Numeric/public-key pair verification required |
| `filename` | `character varying(255)` | Yes | — | Inferred: stores filename for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `message_id` | `uuid` | No | — | Reference linking this record to messages | Ensures related business data can be joined and validated | FK → `notification.messages` (fk_notification_message_attachments_message_id_messages) |
| `message_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `notification.messages` (fk_notification_message_attachments_message_id_messages_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_message_attachments_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the message attachments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Rider_App, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `notification.message_attachments` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_notification_message_attachments_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_notification_message_attachments_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `message_id` → `notification.messages(id)` via `fk_notification_message_attachments_message_id_messages`; `FOREIGN KEY (message_id) REFERENCES notification.messages(id) ON DELETE CASCADE`
- `file_object_id` → `platform.file_objects(id)` via `fk_notification_message_attachments_file_object_id_file_objects`; `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT`
- `file_object_id_internal_id` → `platform.file_objects(internal_id)` via `fk_notification_message_attachments_file_object_id_file_0d0a`; `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT`
- `message_id_internal_id` → `notification.messages(internal_id)` via `fk_notification_message_attachments_message_id_messages_numeric`; `FOREIGN KEY (message_id_internal_id) REFERENCES notification.messages(internal_id) ON DELETE CASCADE`

## `notification.message_attachments` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 15 columns, 13 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_notification_message_attachments_created_by_users` |
| `updated_by` | `identity.users` | `fk_notification_message_attachments_updated_by_users` |
| `message_id` | `notification.messages` | `fk_notification_message_attachments_message_id_messages` |
| `file_object_id` | `platform.file_objects` | `fk_notification_message_attachments_file_object_id_file_objects` |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_notification_message_attachments_file_object_id_file_0d0a` |
| `message_id_internal_id` | `notification.messages` | `fk_notification_message_attachments_message_id_messages_numeric` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_notification_message_attachments_message` | `CREATE INDEX ix_notification_message_attachments_message ON notification.message_attachments USING btree (message_id)` |
| `message_file_attachment` | `CREATE UNIQUE INDEX message_file_attachment ON notification.message_attachments USING btree (message_id, file_object_id)` |
| `pk_notification_message_attachments` | `CREATE UNIQUE INDEX pk_notification_message_attachments ON notification.message_attachments USING btree (internal_id)` |
| `uq_notification_message_attachments_id` | `CREATE UNIQUE INDEX uq_notification_message_attachments_id ON notification.message_attachments USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON notification.message_attachments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"],["message_id","message_id_internal_id","notification","messages"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON notification.message_attachments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON notification.message_attachments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"],["message_id","message_id_internal_id","notification","messages"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
