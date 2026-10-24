# `notification.templates`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds templates records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | notification.templates |
| Classification | Configuration |
| Proposed business write owner | Notifications |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 19 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 13 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `body_template` | `text` | No | — | Inferred: stores body template for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `channel` | `character varying(32)` | No | — | Inferred: stores channel for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `code` | `character varying(128)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_templates_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_templates_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `locale` | `character varying(16)` | No | — | Inferred: stores locale for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider_template_id` | `character varying(255)` | Yes | — | Identifier associated with provider template | Link the event or entity to its subject; verify constraints | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'draft'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `subject_template` | `text` | Yes | — | Inferred: stores subject template for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_templates_updated_by_users` |
| `variables_schema` | `jsonb` | No | `'{}'::jsonb` | Structured variables schema information | Retain a versioned payload or relevant details | Exact constraints below |
| `version` | `integer` | No | `1` | Inferred: stores version for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the templates business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Rider_App, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `notification.templates` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_notification_templates_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_notification_templates_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_notification_templates_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`notification.messages`](../../Tables/notification/messages.md) | fk_notification_messages_template_id_templates | `template_id` | `id` |
| [`notification.messages`](../../Tables/notification/messages.md) | fk_notification_messages_template_id_templates_numeric | `template_id_internal_id` | `internal_id` |

## `notification.templates` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_notification_templates_created_by_users` |
| `deleted_by` | `identity.users` | `fk_notification_templates_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_notification_templates_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_notification_templates_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_notification_templates_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(code::text)) > 0 AND code::text = btrim(code::text))` |
| `ck_notification_templates_version_positive` | CHECK | `CHECK (version > 0)` |
| `fk_notification_templates_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_templates_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_templates_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_notification_templates` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `template_version` | UNIQUE | `UNIQUE (code, channel, locale, version)` |
| `uq_notification_templates_id` | UNIQUE | `UNIQUE (id)` |
| `templates_body_template_not_null` | NOT NULL | `NOT NULL body_template` |
| `templates_channel_not_null` | NOT NULL | `NOT NULL channel` |
| `templates_code_not_null` | NOT NULL | `NOT NULL code` |
| `templates_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `templates_id_not_null` | NOT NULL | `NOT NULL id` |
| `templates_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `templates_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `templates_locale_not_null` | NOT NULL | `NOT NULL locale` |
| `templates_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `templates_status_not_null` | NOT NULL | `NOT NULL status` |
| `templates_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `templates_variables_schema_not_null` | NOT NULL | `NOT NULL variables_schema` |
| `templates_version_not_null` | NOT NULL | `NOT NULL version` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_notification_templates_code` | btree | `(code)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_notification_templates_code ON notification.templates USING btree (code)` |
| `ix_notification_templates_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_notification_templates_status ON notification.templates USING btree (status)` |
| `pk_notification_templates` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_notification_templates ON notification.templates USING btree (internal_id)` |
| `template_version` | btree | `(code, channel, locale, version)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX template_version ON notification.templates USING btree (code, channel, locale, version)` |
| `uq_notification_templates_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_notification_templates_id ON notification.templates USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON notification.templates FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON notification.templates FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '["channel", "locale", "version"]')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON notification.templates FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON notification.templates FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
