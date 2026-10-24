# `notification.in_app_notifications`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds in app notifications records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | notification.in_app_notifications |
| Classification | Transactional |
| Proposed business write owner | Notifications |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 22 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `action_url` | `character varying(2048)` | Yes | — | Inferred: stores action url for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `archived_at` | `timestamp with time zone` | Yes | — | Time of archived | Support chronology, deadlines or audit evidence | Exact constraints below |
| `body` | `text` | No | — | Inferred: stores body for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_in_app_notifications_created_by_users` |
| `data` | `jsonb` | No | `'{}'::jsonb` | Structured data information | Retain a versioned payload or relevant details | Exact constraints below |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_in_app_notifications_deleted_by_users` |
| `expires_at` | `timestamp with time zone` | Yes | — | Expiration time | Determine validity windows | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `image_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_notification_in_app_notifications_image_file_id_file_objects` |
| `image_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_notification_in_app_notifications_image_file_id_file_ce63` |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `notification_type` | `character varying(64)` | No | — | Inferred: stores notification type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `read_at` | `timestamp with time zone` | Yes | — | Time of read | Support chronology, deadlines or audit evidence | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `title` | `character varying(255)` | No | — | Inferred: stores title for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_in_app_notifications_updated_by_users` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_in_app_notifications_user_id_users` |

## Record lifecycle and users

- **Created:** when the in app notifications business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Rider_App, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `notification.in_app_notifications` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_notification_in_app_notifications_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_notification_in_app_notifications_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_notification_in_app_notifications_image_file_id_file_ce63 | `image_file_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (image_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| fk_notification_in_app_notifications_image_file_id_file_objects | `image_file_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (image_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| fk_notification_in_app_notifications_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_notification_in_app_notifications_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `notification.in_app_notifications` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_notification_in_app_notifications_created_by_users` |
| `deleted_by` | `identity.users` | `fk_notification_in_app_notifications_deleted_by_users` |
| `image_file_id_internal_id` | `platform.file_objects` | `fk_notification_in_app_notifications_image_file_id_file_ce63` |
| `image_file_id` | `platform.file_objects` | `fk_notification_in_app_notifications_image_file_id_file_objects` |
| `updated_by` | `identity.users` | `fk_notification_in_app_notifications_updated_by_users` |
| `user_id` | `identity.users` | `fk_notification_in_app_notifications_user_id_users` |

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
| `in_app_notifications_body_not_null` | NOT NULL | `NOT NULL body` |
| `in_app_notifications_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `in_app_notifications_data_not_null` | NOT NULL | `NOT NULL data` |
| `in_app_notifications_id_not_null` | NOT NULL | `NOT NULL id` |
| `in_app_notifications_idempotency_key_not_null` | NOT NULL | `NOT NULL idempotency_key` |
| `in_app_notifications_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `in_app_notifications_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `in_app_notifications_notification_type_not_null` | NOT NULL | `NOT NULL notification_type` |
| `in_app_notifications_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `in_app_notifications_title_not_null` | NOT NULL | `NOT NULL title` |
| `in_app_notifications_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `in_app_notifications_user_id_not_null` | NOT NULL | `NOT NULL user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `in_app_user_idempotency` | btree | `(user_id, idempotency_key)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX in_app_user_idempotency ON notification.in_app_notifications USING btree (user_id, idempotency_key)` |
| `ix_notification_in_app_expiry` | btree | `(expires_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_notification_in_app_expiry ON notification.in_app_notifications USING btree (expires_at)` |
| `ix_notification_in_app_user_unread` | btree | `(user_id, created_at)` | read_at IS NULL AND archived_at IS NULL AND is_deleted = false | Read/join/filter access path; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE INDEX ix_notification_in_app_user_unread ON notification.in_app_notifications USING btree (user_id, created_at) WHERE read_at IS NULL AND archived_at IS NULL AND is_deleted = false` |
| `pk_notification_in_app_notifications` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_notification_in_app_notifications ON notification.in_app_notifications USING btree (internal_id)` |
| `uq_notification_in_app_notifications_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_notification_in_app_notifications_id ON notification.in_app_notifications USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON notification.in_app_notifications FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["image_file_id","image_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON notification.in_app_notifications FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON notification.in_app_notifications FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["image_file_id","image_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
