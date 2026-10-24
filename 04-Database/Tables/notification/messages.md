# `notification.messages`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds messages records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | notification.messages |
| Classification | Transactional |
| Proposed business write owner | Notifications |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 38 columns; 20 PK/FK/UQ/CHECK/exclusion constraints; 15 named PostgreSQL 18 NOT NULL constraints; 9 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `attempt_count` | `integer` | No | `0` | Inferred: stores attempt count for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `available_at` | `timestamp with time zone` | No | `now()` | Time of available | Support chronology, deadlines or audit evidence | Exact constraints below |
| `channel` | `character varying(16)` | No | — | Inferred: stores channel for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `correlation_id` | `uuid` | Yes | — | Identifier associated with correlation | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_messages_created_by_users` |
| `delivered_at` | `timestamp with time zone` | Yes | — | Time of delivered | Support chronology, deadlines or audit evidence | Exact constraints below |
| `destination_encrypted` | `bytea` | Yes | — | Inferred: stores destination encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `destination_hash` | `character varying(128)` | Yes | — | Inferred: stores destination hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `expires_at` | `timestamp with time zone` | Yes | — | Expiration time | Determine validity windows | Exact constraints below |
| `failed_at` | `timestamp with time zone` | Yes | — | Time of failed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `failure_reason` | `text` | Yes | — | Inferred: stores failure reason for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `idempotency_scope` | `character varying(128)` | No | `'global'::character varying` | Inferred: stores idempotency scope for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `locked_at` | `timestamp with time zone` | Yes | — | Time of locked | Support chronology, deadlines or audit evidence | Exact constraints below |
| `locked_by` | `character varying(128)` | Yes | — | Actor associated with locked | Record responsibility for the change | Collation: default |
| `max_attempts` | `integer` | No | `5` | Inferred: stores max attempts for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `next_attempt_at` | `timestamp with time zone` | Yes | — | Time of next attempt | Support chronology, deadlines or audit evidence | Exact constraints below |
| `notification_type` | `character varying(64)` | No | `'general'::character varying` | Inferred: stores notification type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `payload` | `jsonb` | No | — | Structured payload information | Retain a versioned payload or relevant details | Exact constraints below |
| `priority` | `integer` | No | `0` | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `provider` | `character varying(64)` | Yes | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider_configuration_id` | `uuid` | Yes | — | Reference linking this record to provider configurations | Ensures related business data can be joined and validated | FK → `notification.provider_configurations` via `fk_notification_messages_provider_configuration_id_prov_3242` |
| `provider_configuration_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `notification.provider_configurations` via `fk_notification_messages_provider_configuration_id_prov_3f94` |
| `provider_message_id` | `character varying(255)` | Yes | — | Identifier associated with provider message | Link the event or entity to its subject; verify constraints | Collation: default |
| `rendered_body_encrypted` | `bytea` | Yes | — | Inferred: stores rendered body encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `rendered_subject` | `text` | Yes | — | Inferred: stores rendered subject for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `scheduled_at` | `timestamp with time zone` | Yes | — | Time of scheduled | Support chronology, deadlines or audit evidence | Exact constraints below |
| `sent_at` | `timestamp with time zone` | Yes | — | Time of sent | Support chronology, deadlines or audit evidence | Exact constraints below |
| `status` | `character varying(16)` | No | `'queued'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `template_id` | `uuid` | Yes | — | Reference linking this record to templates | Ensures related business data can be joined and validated | FK → `notification.templates` via `fk_notification_messages_template_id_templates` |
| `template_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `notification.templates` via `fk_notification_messages_template_id_templates_numeric` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_messages_updated_by_users` |
| `user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_messages_user_id_users` |

## Record lifecycle and users

- **Created:** when the messages business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Rider_App, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `notification.messages` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_notification_messages_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_notification_messages_provider_configuration_id_prov_3242 | `provider_configuration_id` | [`notification.provider_configurations`](../../Tables/notification/provider_configurations.md) | `FOREIGN KEY (provider_configuration_id) REFERENCES notification.provider_configurations(id) ON DELETE SET NULL` |
| fk_notification_messages_provider_configuration_id_prov_3f94 | `provider_configuration_id_internal_id` | [`notification.provider_configurations`](../../Tables/notification/provider_configurations.md) | `FOREIGN KEY (provider_configuration_id_internal_id) REFERENCES notification.provider_configurations(internal_id) ON DELETE SET NULL` |
| fk_notification_messages_template_id_templates | `template_id` | [`notification.templates`](../../Tables/notification/templates.md) | `FOREIGN KEY (template_id) REFERENCES notification.templates(id) ON DELETE SET NULL` |
| fk_notification_messages_template_id_templates_numeric | `template_id_internal_id` | [`notification.templates`](../../Tables/notification/templates.md) | `FOREIGN KEY (template_id_internal_id) REFERENCES notification.templates(internal_id) ON DELETE SET NULL` |
| fk_notification_messages_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_notification_messages_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`notification.message_attachments`](../../Tables/notification/message_attachments.md) | fk_notification_message_attachments_message_id_messages | `message_id` | `id` |
| [`notification.message_attachments`](../../Tables/notification/message_attachments.md) | fk_notification_message_attachments_message_id_messages_numeric | `message_id_internal_id` | `internal_id` |
| [`notification.message_attempts`](../../Tables/notification/message_attempts.md) | fk_notification_message_attempts_message_id_messages | `message_id` | `id` |
| [`notification.message_attempts`](../../Tables/notification/message_attempts.md) | fk_notification_message_attempts_message_id_messages_numeric | `message_id_internal_id` | `internal_id` |

## `notification.messages` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_notification_messages_created_by_users` |
| `provider_configuration_id` | `notification.provider_configurations` | `fk_notification_messages_provider_configuration_id_prov_3242` |
| `provider_configuration_id_internal_id` | `notification.provider_configurations` | `fk_notification_messages_provider_configuration_id_prov_3f94` |
| `template_id` | `notification.templates` | `fk_notification_messages_template_id_templates` |
| `template_id_internal_id` | `notification.templates` | `fk_notification_messages_template_id_templates_numeric` |
| `updated_by` | `identity.users` | `fk_notification_messages_updated_by_users` |
| `user_id` | `identity.users` | `fk_notification_messages_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_notification_messages_attempt_count_nonnegative` | CHECK | `CHECK (attempt_count >= 0)` |
| `ck_notification_messages_destination_or_resolvable_user` | CHECK | `CHECK (destination_encrypted IS NOT NULL AND destination_hash IS NOT NULL OR (channel::text = ANY (ARRAY['push'::text, 'in_app'::text])) AND user_id IS NOT NULL)` |
| `ck_notification_messages_expiry_after_created` | CHECK | `CHECK (expires_at IS NULL OR expires_at > created_at)` |
| `ck_notification_messages_max_attempts_positive` | CHECK | `CHECK (max_attempts > 0)` |
| `ck_notification_messages_notificationchannel` | CHECK | `CHECK (channel::text = ANY (ARRAY['email'::text, 'sms'::text, 'whatsapp'::text, 'push'::text, 'in_app'::text]))` |
| `ck_notification_messages_notificationstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['queued'::text, 'scheduled'::text, 'processing'::text, 'sent'::text, 'delivered'::text, 'failed'::text, 'cancelled'::text]))` |
| `ck_notification_messages_numeric_pair_provider_configuration_id` | CHECK | `CHECK ((provider_configuration_id IS NULL) = (provider_configuration_id_internal_id IS NULL))` |
| `ck_notification_messages_numeric_pair_template_id` | CHECK | `CHECK ((template_id IS NULL) = (template_id_internal_id IS NULL))` |
| `ck_notification_messages_priority_range` | CHECK | `CHECK (priority >= '-100'::integer AND priority <= 100)` |
| `ck_notification_messages_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_notification_messages_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_messages_provider_configuration_id_prov_3242` | FOREIGN KEY | `FOREIGN KEY (provider_configuration_id) REFERENCES notification.provider_configurations(id) ON DELETE SET NULL` |
| `fk_notification_messages_provider_configuration_id_prov_3f94` | FOREIGN KEY | `FOREIGN KEY (provider_configuration_id_internal_id) REFERENCES notification.provider_configurations(internal_id) ON DELETE SET NULL` |
| `fk_notification_messages_template_id_templates` | FOREIGN KEY | `FOREIGN KEY (template_id) REFERENCES notification.templates(id) ON DELETE SET NULL` |
| `fk_notification_messages_template_id_templates_numeric` | FOREIGN KEY | `FOREIGN KEY (template_id_internal_id) REFERENCES notification.templates(internal_id) ON DELETE SET NULL` |
| `fk_notification_messages_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_messages_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `message_idempotency` | UNIQUE | `UNIQUE (idempotency_scope, idempotency_key)` |
| `pk_notification_messages` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_notification_messages_id` | UNIQUE | `UNIQUE (id)` |
| `messages_attempt_count_not_null` | NOT NULL | `NOT NULL attempt_count` |
| `messages_available_at_not_null` | NOT NULL | `NOT NULL available_at` |
| `messages_channel_not_null` | NOT NULL | `NOT NULL channel` |
| `messages_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `messages_id_not_null` | NOT NULL | `NOT NULL id` |
| `messages_idempotency_key_not_null` | NOT NULL | `NOT NULL idempotency_key` |
| `messages_idempotency_scope_not_null` | NOT NULL | `NOT NULL idempotency_scope` |
| `messages_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `messages_max_attempts_not_null` | NOT NULL | `NOT NULL max_attempts` |
| `messages_notification_type_not_null` | NOT NULL | `NOT NULL notification_type` |
| `messages_payload_not_null` | NOT NULL | `NOT NULL payload` |
| `messages_priority_not_null` | NOT NULL | `NOT NULL priority` |
| `messages_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `messages_status_not_null` | NOT NULL | `NOT NULL status` |
| `messages_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_notification_messages_claim` | btree | `(status, available_at, next_attempt_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_notification_messages_claim ON notification.messages USING btree (status, available_at, next_attempt_at)` |
| `ix_notification_messages_correlation` | btree | `(correlation_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_notification_messages_correlation ON notification.messages USING btree (correlation_id)` |
| `ix_notification_messages_provider_id` | btree | `(provider_message_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_notification_messages_provider_id ON notification.messages USING btree (provider_message_id)` |
| `ix_notification_messages_status_schedule` | btree | `(status, scheduled_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_notification_messages_status_schedule ON notification.messages USING btree (status, scheduled_at)` |
| `ix_notification_messages_template` | btree | `(template_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_notification_messages_template ON notification.messages USING btree (template_id)` |
| `ix_notification_messages_user` | btree | `(user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_notification_messages_user ON notification.messages USING btree (user_id)` |
| `message_idempotency` | btree | `(idempotency_scope, idempotency_key)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX message_idempotency ON notification.messages USING btree (idempotency_scope, idempotency_key)` |
| `pk_notification_messages` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_notification_messages ON notification.messages USING btree (internal_id)` |
| `uq_notification_messages_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_notification_messages_id ON notification.messages USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON notification.messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["provider_configuration_id","provider_configuration_id_internal_id","notification","provider_configurations"],["template_id","template_id_internal_id","notification","templates"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON notification.messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON notification.messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["provider_configuration_id","provider_configuration_id_internal_id","notification","provider_configurations"],["template_id","template_id_internal_id","notification","templates"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
