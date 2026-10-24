# `notification.provider_webhooks`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds provider webhooks records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | notification.provider_webhooks |
| Classification | Audit / History |
| Proposed business write owner | Notifications |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 6 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_provider_webhooks_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `payload` | `jsonb` | No | — | Structured payload information | Retain a versioned payload or relevant details | Exact constraints below |
| `processed_at` | `timestamp with time zone` | Yes | — | Time of processed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `processing_status` | `character varying(32)` | No | `'pending'::character varying` | Inferred: stores processing status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider_event_id` | `character varying(255)` | No | — | Identifier associated with provider event | Link the event or entity to its subject; verify constraints | Collation: default |
| `provider_message_id` | `character varying(255)` | Yes | — | Identifier associated with provider message | Link the event or entity to its subject; verify constraints | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `signature_valid` | `boolean` | No | — | Inferred: stores signature valid for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_notification_provider_webhooks_updated_by_users` |

## Record lifecycle and users

- **Created:** when the provider webhooks business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Rider_App, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `notification.provider_webhooks` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_notification_provider_webhooks_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_notification_provider_webhooks_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `notification.provider_webhooks` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_notification_provider_webhooks_created_by_users` |
| `updated_by` | `identity.users` | `fk_notification_provider_webhooks_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_notification_provider_webhooks_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_notification_provider_webhooks_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_provider_webhooks_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `notification_provider_event` | UNIQUE | `UNIQUE (provider, provider_event_id)` |
| `pk_notification_provider_webhooks` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_notification_provider_webhooks_id` | UNIQUE | `UNIQUE (id)` |
| `provider_webhooks_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `provider_webhooks_id_not_null` | NOT NULL | `NOT NULL id` |
| `provider_webhooks_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `provider_webhooks_payload_not_null` | NOT NULL | `NOT NULL payload` |
| `provider_webhooks_processing_status_not_null` | NOT NULL | `NOT NULL processing_status` |
| `provider_webhooks_provider_event_id_not_null` | NOT NULL | `NOT NULL provider_event_id` |
| `provider_webhooks_provider_not_null` | NOT NULL | `NOT NULL provider` |
| `provider_webhooks_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `provider_webhooks_signature_valid_not_null` | NOT NULL | `NOT NULL signature_valid` |
| `provider_webhooks_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_notification_provider_webhooks_status` | btree | `(processing_status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_notification_provider_webhooks_status ON notification.provider_webhooks USING btree (processing_status)` |
| `notification_provider_event` | btree | `(provider, provider_event_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX notification_provider_event ON notification.provider_webhooks USING btree (provider, provider_event_id)` |
| `pk_notification_provider_webhooks` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_notification_provider_webhooks ON notification.provider_webhooks USING btree (internal_id)` |
| `uq_notification_provider_webhooks_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_notification_provider_webhooks_id ON notification.provider_webhooks USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON notification.provider_webhooks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON notification.provider_webhooks FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON notification.provider_webhooks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
