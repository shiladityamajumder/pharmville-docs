# `notification.device_endpoints`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds device endpoints records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | notification.device_endpoints |
| Classification | Configuration |
| Proposed business write owner | Notifications |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 7 PK/FK/UQ/CHECK/exclusion constraints; 13 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_device_endpoints_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_device_endpoints_deleted_by_users` |
| `device_id` | `character varying(255)` | No | — | Identifier associated with device | Link the event or entity to its subject; verify constraints | Collation: default |
| `enabled` | `boolean` | No | `true` | Inferred: stores enabled for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `invalidated_at` | `timestamp with time zone` | Yes | — | Time of invalidated | Support chronology, deadlines or audit evidence | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `last_seen_at` | `timestamp with time zone` | Yes | — | Time of last seen | Support chronology, deadlines or audit evidence | Exact constraints below |
| `locale` | `character varying(16)` | Yes | — | Inferred: stores locale for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `platform` | `character varying(32)` | No | — | Inferred: stores platform for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `timezone` | `character varying(64)` | Yes | — | Inferred: stores timezone for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `token_encrypted` | `bytea` | No | — | Inferred: stores token encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `token_hash` | `character varying(128)` | No | — | Inferred: stores token hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_device_endpoints_updated_by_users` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_device_endpoints_user_id_users` |

## Record lifecycle and users

- **Created:** when the device endpoints business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Rider_App, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `notification.device_endpoints` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_notification_device_endpoints_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_notification_device_endpoints_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_notification_device_endpoints_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_notification_device_endpoints_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `notification.device_endpoints` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_notification_device_endpoints_created_by_users` |
| `deleted_by` | `identity.users` | `fk_notification_device_endpoints_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_notification_device_endpoints_updated_by_users` |
| `user_id` | `identity.users` | `fk_notification_device_endpoints_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_notification_device_endpoints_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_notification_device_endpoints_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_device_endpoints_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_device_endpoints_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_device_endpoints_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_notification_device_endpoints` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_notification_device_endpoints_id` | UNIQUE | `UNIQUE (id)` |
| `device_endpoints_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `device_endpoints_device_id_not_null` | NOT NULL | `NOT NULL device_id` |
| `device_endpoints_enabled_not_null` | NOT NULL | `NOT NULL enabled` |
| `device_endpoints_id_not_null` | NOT NULL | `NOT NULL id` |
| `device_endpoints_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `device_endpoints_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `device_endpoints_platform_not_null` | NOT NULL | `NOT NULL platform` |
| `device_endpoints_provider_not_null` | NOT NULL | `NOT NULL provider` |
| `device_endpoints_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `device_endpoints_token_encrypted_not_null` | NOT NULL | `NOT NULL token_encrypted` |
| `device_endpoints_token_hash_not_null` | NOT NULL | `NOT NULL token_hash` |
| `device_endpoints_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `device_endpoints_user_id_not_null` | NOT NULL | `NOT NULL user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_notification_device_endpoints_user` | btree | `(user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_notification_device_endpoints_user ON notification.device_endpoints USING btree (user_id)` |
| `pk_notification_device_endpoints` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_notification_device_endpoints ON notification.device_endpoints USING btree (internal_id)` |
| `uq_notification_device_endpoints_device_active` | btree | `(user_id, device_id, provider)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_notification_device_endpoints_device_active ON notification.device_endpoints USING btree (user_id, device_id, provider) WHERE is_deleted = false` |
| `uq_notification_device_endpoints_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_notification_device_endpoints_id ON notification.device_endpoints USING btree (id)` |
| `uq_notification_device_endpoints_token_active` | btree | `(token_hash)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_notification_device_endpoints_token_active ON notification.device_endpoints USING btree (token_hash) WHERE is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON notification.device_endpoints FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON notification.device_endpoints FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON notification.device_endpoints FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
