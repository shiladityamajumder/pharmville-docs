# `notification.in_app_notifications`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds in app notifications records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 22 columns, 12 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `action_url` | `character varying(2048)` | Yes | — | Inferred: stores action url for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `archived_at` | `timestamp with time zone` | Yes | — | Time of archived | Support chronology, deadlines or audit evidence | See exact constraints |
| `body` | `text` | No | — | Inferred: stores body for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_in_app_notifications_created_by_users) |
| `data` | `jsonb` | No | `'{}'::jsonb` | Structured data information | Retain a versioned payload or relevant details | See exact constraints |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_in_app_notifications_deleted_by_users) |
| `expires_at` | `timestamp with time zone` | Yes | — | Expiration time | Determine validity windows | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `image_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_notification_in_app_notifications_image_file_id_file_objects) |
| `image_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_notification_in_app_notifications_image_file_id_file_ce63); Numeric/public-key pair verification required |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `notification_type` | `character varying(64)` | No | — | Inferred: stores notification type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `read_at` | `timestamp with time zone` | Yes | — | Time of read | Support chronology, deadlines or audit evidence | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `title` | `character varying(255)` | No | — | Inferred: stores title for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_in_app_notifications_updated_by_users) |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_in_app_notifications_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the in app notifications business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Rider_App, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `notification.in_app_notifications` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_notification_in_app_notifications_user_id_users`; `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE`
- `created_by` → `identity.users(id)` via `fk_notification_in_app_notifications_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_notification_in_app_notifications_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_notification_in_app_notifications_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `image_file_id` → `platform.file_objects(id)` via `fk_notification_in_app_notifications_image_file_id_file_objects`; `FOREIGN KEY (image_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL`
- `image_file_id_internal_id` → `platform.file_objects(internal_id)` via `fk_notification_in_app_notifications_image_file_id_file_ce63`; `FOREIGN KEY (image_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL`

## `notification.in_app_notifications` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 22 columns, 12 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_notification_in_app_notifications_user_id_users` |
| `created_by` | `identity.users` | `fk_notification_in_app_notifications_created_by_users` |
| `deleted_by` | `identity.users` | `fk_notification_in_app_notifications_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_notification_in_app_notifications_updated_by_users` |
| `image_file_id` | `platform.file_objects` | `fk_notification_in_app_notifications_image_file_id_file_objects` |
| `image_file_id_internal_id` | `platform.file_objects` | `fk_notification_in_app_notifications_image_file_id_file_ce63` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_notification_in_app_notifications_expiry_after_created` | CHECK | `CHECK (expires_at IS NULL OR expires_at > created_at)` |
| `ck_notification_in_app_notifications_numeric_pair_image_file_id` | CHECK | `CHECK ((image_file_id IS NULL) = (image_file_id_internal_id IS NULL))` |
| `ck_notification_in_app_notifications_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_notification_in_app_notifications_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_in_app_notifications_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_in_app_notifications_image_file_id_file_ce63` | FOREIGN KEY | `FOREIGN KEY (image_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| `fk_notification_in_app_notifications_image_file_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (image_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| `fk_notification_in_app_notifications_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_in_app_notifications_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `in_app_user_idempotency` | UNIQUE | `UNIQUE (user_id, idempotency_key)` |
| `pk_notification_in_app_notifications` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_notification_in_app_notifications_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `in_app_user_idempotency` | `CREATE UNIQUE INDEX in_app_user_idempotency ON notification.in_app_notifications USING btree (user_id, idempotency_key)` |
| `ix_notification_in_app_expiry` | `CREATE INDEX ix_notification_in_app_expiry ON notification.in_app_notifications USING btree (expires_at)` |
| `ix_notification_in_app_user_unread` | `CREATE INDEX ix_notification_in_app_user_unread ON notification.in_app_notifications USING btree (user_id, created_at) WHERE read_at IS NULL AND archived_at IS NULL AND is_deleted = false` |
| `pk_notification_in_app_notifications` | `CREATE UNIQUE INDEX pk_notification_in_app_notifications ON notification.in_app_notifications USING btree (internal_id)` |
| `uq_notification_in_app_notifications_id` | `CREATE UNIQUE INDEX uq_notification_in_app_notifications_id ON notification.in_app_notifications USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON notification.in_app_notifications FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["image_file_id","image_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON notification.in_app_notifications FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON notification.in_app_notifications FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["image_file_id","image_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
