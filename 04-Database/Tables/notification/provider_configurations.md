# `notification.provider_configurations`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds provider configurations records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | notification.provider_configurations |
| Classification | Configuration |
| Proposed business write owner | Notifications |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 18 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 14 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `account_code` | `character varying(64)` | No | — | Code for account | Link to controlled business classification or an external reference | Collation: default |
| `channel` | `character varying(32)` | No | — | Inferred: stores channel for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `configuration` | `jsonb` | No | `'{}'::jsonb` | Structured configuration information | Retain a versioned payload or relevant details | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_provider_configurations_created_by_users` |
| `credentials_secret_ref` | `character varying(255)` | No | — | Inferred: stores credentials secret ref for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_provider_configurations_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_default` | `boolean` | No | `false` | Yes/no flag for is default | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `priority` | `integer` | No | `100` | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_provider_configurations_updated_by_users` |

## Record lifecycle and users

- **Created:** when the provider configurations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Rider_App, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `notification.provider_configurations` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_notification_provider_configurations_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_notification_provider_configurations_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_notification_provider_configurations_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`notification.messages`](../../Tables/notification/messages.md) | fk_notification_messages_provider_configuration_id_prov_3242 | `provider_configuration_id` | `id` |
| [`notification.messages`](../../Tables/notification/messages.md) | fk_notification_messages_provider_configuration_id_prov_3f94 | `provider_configuration_id_internal_id` | `internal_id` |

## `notification.provider_configurations` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_notification_provider_configurations_created_by_users` |
| `deleted_by` | `identity.users` | `fk_notification_provider_configurations_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_notification_provider_configurations_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_notification_provider_configurations_priority_nonnegative` | CHECK | `CHECK (priority >= 0)` |
| `ck_notification_provider_configurations_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_notification_provider_configurations_stable_code_non_767d` | CHECK | `CHECK (length(btrim(account_code::text)) > 0 AND account_code::text = btrim(account_code::text))` |
| `fk_notification_provider_configurations_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_provider_configurations_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_provider_configurations_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_notification_provider_configurations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `provider_channel_account` | UNIQUE | `UNIQUE (provider, channel, account_code)` |
| `uq_notification_provider_configurations_id` | UNIQUE | `UNIQUE (id)` |
| `provider_configurations_account_code_not_null` | NOT NULL | `NOT NULL account_code` |
| `provider_configurations_channel_not_null` | NOT NULL | `NOT NULL channel` |
| `provider_configurations_configuration_not_null` | NOT NULL | `NOT NULL configuration` |
| `provider_configurations_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `provider_configurations_credentials_secret_ref_not_null` | NOT NULL | `NOT NULL credentials_secret_ref` |
| `provider_configurations_id_not_null` | NOT NULL | `NOT NULL id` |
| `provider_configurations_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `provider_configurations_is_default_not_null` | NOT NULL | `NOT NULL is_default` |
| `provider_configurations_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `provider_configurations_priority_not_null` | NOT NULL | `NOT NULL priority` |
| `provider_configurations_provider_not_null` | NOT NULL | `NOT NULL provider` |
| `provider_configurations_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `provider_configurations_status_not_null` | NOT NULL | `NOT NULL status` |
| `provider_configurations_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_notification_provider_configs_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_notification_provider_configs_status ON notification.provider_configurations USING btree (status)` |
| `pk_notification_provider_configurations` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_notification_provider_configurations ON notification.provider_configurations USING btree (internal_id)` |
| `provider_channel_account` | btree | `(provider, channel, account_code)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX provider_channel_account ON notification.provider_configurations USING btree (provider, channel, account_code)` |
| `uq_notification_provider_configs_default_active` | btree | `(channel)` | is_default = true AND status::text = 'active'::text AND is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_notification_provider_configs_default_active ON notification.provider_configurations USING btree (channel) WHERE is_default = true AND status::text = 'active'::text AND is_deleted = false` |
| `uq_notification_provider_configurations_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_notification_provider_configurations_id ON notification.provider_configurations USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON notification.provider_configurations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON notification.provider_configurations FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('account_code', '["provider", "channel"]')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON notification.provider_configurations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON notification.provider_configurations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
