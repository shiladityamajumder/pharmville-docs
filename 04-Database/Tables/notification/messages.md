# notification.messages

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds messages records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 38 columns, 20 constraints, 9 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `attempt_count` | `integer` | No | `0` | Inferred: stores attempt count for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `available_at` | `timestamp with time zone` | No | `now()` | Time of available | Support chronology, deadlines or audit evidence | See exact constraints |
| `channel` | `character varying(16)` | No | — | Inferred: stores channel for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `correlation_id` | `uuid` | Yes | — | Identifier associated with correlation | Link the event or entity to its subject; verify constraints | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_messages_created_by_users) |
| `delivered_at` | `timestamp with time zone` | Yes | — | Time of delivered | Support chronology, deadlines or audit evidence | See exact constraints |
| `destination_encrypted` | `bytea` | Yes | — | Inferred: stores destination encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `destination_hash` | `character varying(128)` | Yes | — | Inferred: stores destination hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `expires_at` | `timestamp with time zone` | Yes | — | Expiration time | Determine validity windows | See exact constraints |
| `failed_at` | `timestamp with time zone` | Yes | — | Time of failed | Support chronology, deadlines or audit evidence | See exact constraints |
| `failure_reason` | `text` | Yes | — | Inferred: stores failure reason for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `idempotency_scope` | `character varying(128)` | No | `'global'::character varying` | Inferred: stores idempotency scope for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `locked_at` | `timestamp with time zone` | Yes | — | Time of locked | Support chronology, deadlines or audit evidence | See exact constraints |
| `locked_by` | `character varying(128)` | Yes | — | Actor associated with locked | Record responsibility for the change | See exact constraints |
| `max_attempts` | `integer` | No | `5` | Inferred: stores max attempts for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `next_attempt_at` | `timestamp with time zone` | Yes | — | Time of next attempt | Support chronology, deadlines or audit evidence | See exact constraints |
| `notification_type` | `character varying(64)` | No | `'general'::character varying` | Inferred: stores notification type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `payload` | `jsonb` | No | — | Structured payload information | Retain a versioned payload or relevant details | See exact constraints |
| `priority` | `integer` | No | `0` | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider` | `character varying(64)` | Yes | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider_configuration_id` | `uuid` | Yes | — | Reference linking this record to provider configurations | Ensures related business data can be joined and validated | FK → `notification.provider_configurations` (fk_notification_messages_provider_configuration_id_prov_3242) |
| `provider_configuration_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `notification.provider_configurations` (fk_notification_messages_provider_configuration_id_prov_3f94); Numeric/public-key pair verification required |
| `provider_message_id` | `character varying(255)` | Yes | — | Identifier associated with provider message | Link the event or entity to its subject; verify constraints | See exact constraints |
| `rendered_body_encrypted` | `bytea` | Yes | — | Inferred: stores rendered body encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `rendered_subject` | `text` | Yes | — | Inferred: stores rendered subject for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `scheduled_at` | `timestamp with time zone` | Yes | — | Time of scheduled | Support chronology, deadlines or audit evidence | See exact constraints |
| `sent_at` | `timestamp with time zone` | Yes | — | Time of sent | Support chronology, deadlines or audit evidence | See exact constraints |
| `status` | `character varying(16)` | No | `'queued'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `template_id` | `uuid` | Yes | — | Reference linking this record to templates | Ensures related business data can be joined and validated | FK → `notification.templates` (fk_notification_messages_template_id_templates) |
| `template_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `notification.templates` (fk_notification_messages_template_id_templates_numeric); Numeric/public-key pair verification required |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_messages_updated_by_users) |
| `user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_messages_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the messages business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Rider_App, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `notification.messages` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_notification_messages_user_id_users`; FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE SET NULL
- `created_by` → `identity.users(id)` via `fk_notification_messages_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_notification_messages_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `provider_configuration_id` → `notification.provider_configurations(id)` via `fk_notification_messages_provider_configuration_id_prov_3242`; FOREIGN KEY (provider_configuration_id) REFERENCES notification.provider_configurations(id) ON DELETE SET NULL
- `template_id` → `notification.templates(id)` via `fk_notification_messages_template_id_templates`; FOREIGN KEY (template_id) REFERENCES notification.templates(id) ON DELETE SET NULL
- `provider_configuration_id_internal_id` → `notification.provider_configurations(internal_id)` via `fk_notification_messages_provider_configuration_id_prov_3f94`; FOREIGN KEY (provider_configuration_id_internal_id) REFERENCES notification.provider_configurations(internal_id) ON DELETE SET NULL
- `template_id_internal_id` → `notification.templates(internal_id)` via `fk_notification_messages_template_id_templates_numeric`; FOREIGN KEY (template_id_internal_id) REFERENCES notification.templates(internal_id) ON DELETE SET NULL

**Referenced by 4 FK constraints** (sample): `notification.message_attachments`, `notification.message_attempts`, `notification.message_attachments`, `notification.message_attempts`.

## notification.messages — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 38 columns, 20 constraints, 9 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_notification_messages_user_id_users` |
| `created_by` | `identity.users` | `fk_notification_messages_created_by_users` |
| `updated_by` | `identity.users` | `fk_notification_messages_updated_by_users` |
| `provider_configuration_id` | `notification.provider_configurations` | `fk_notification_messages_provider_configuration_id_prov_3242` |
| `template_id` | `notification.templates` | `fk_notification_messages_template_id_templates` |
| `provider_configuration_id_internal_id` | `notification.provider_configurations` | `fk_notification_messages_provider_configuration_id_prov_3f94` |
| `template_id_internal_id` | `notification.templates` | `fk_notification_messages_template_id_templates_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_notification_messages_claim` | `CREATE INDEX ix_notification_messages_claim ON notification.messages USING btree (status, available_at, next_attempt_at)` |
| `ix_notification_messages_correlation` | `CREATE INDEX ix_notification_messages_correlation ON notification.messages USING btree (correlation_id)` |
| `ix_notification_messages_provider_id` | `CREATE INDEX ix_notification_messages_provider_id ON notification.messages USING btree (provider_message_id)` |
| `ix_notification_messages_status_schedule` | `CREATE INDEX ix_notification_messages_status_schedule ON notification.messages USING btree (status, scheduled_at)` |
| `ix_notification_messages_template` | `CREATE INDEX ix_notification_messages_template ON notification.messages USING btree (template_id)` |
| `ix_notification_messages_user` | `CREATE INDEX ix_notification_messages_user ON notification.messages USING btree (user_id)` |
| `message_idempotency` | `CREATE UNIQUE INDEX message_idempotency ON notification.messages USING btree (idempotency_scope, idempotency_key)` |
| `pk_notification_messages` | `CREATE UNIQUE INDEX pk_notification_messages ON notification.messages USING btree (internal_id)` |
| `uq_notification_messages_id` | `CREATE UNIQUE INDEX uq_notification_messages_id ON notification.messages USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON notification.messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["provider_configuration_id","provider_configuration_id_internal_id","notification","provider_configurations"],["template_id","template_id_internal_id","notification","templates"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON notification.messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON notification.messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["provider_configuration_id","provider_configuration_id_internal_id","notification","provider_configurations"],["template_id","template_id_internal_id","notification","templates"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
