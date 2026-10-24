# `platform.webhook_endpoints`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds webhook endpoints records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | platform.webhook_endpoints |
| Classification | Configuration |
| Proposed business write owner | Shared platform runtime — engineering owner |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 16 columns; 6 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_webhook_endpoints_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_webhook_endpoints_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `owner_id` | `uuid` | No | — | Identifier associated with owner | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `owner_type` | `character varying(64)` | No | — | Inferred: stores owner type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `secret_hash` | `character varying(255)` | No | — | Inferred: stores secret hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `subscribed_events` | `jsonb` | No | — | Structured subscribed events information | Retain a versioned payload or relevant details | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_webhook_endpoints_updated_by_users` |
| `url_encrypted` | `bytea` | No | — | Inferred: stores url encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the webhook endpoints business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.webhook_endpoints` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_platform_webhook_endpoints_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_webhook_endpoints_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_webhook_endpoints_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`platform.webhook_deliveries`](../../Tables/platform/webhook_deliveries.md) | fk_platform_webhook_deliveries_endpoint_id_webhook_endp_fc9c | `endpoint_id_internal_id` | `internal_id` |
| [`platform.webhook_deliveries`](../../Tables/platform/webhook_deliveries.md) | fk_platform_webhook_deliveries_endpoint_id_webhook_endpoints | `endpoint_id` | `id` |

## `platform.webhook_endpoints` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_platform_webhook_endpoints_created_by_users` |
| `deleted_by` | `identity.users` | `fk_platform_webhook_endpoints_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_platform_webhook_endpoints_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_webhook_endpoints_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_platform_webhook_endpoints_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_webhook_endpoints_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_webhook_endpoints_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_platform_webhook_endpoints` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_webhook_endpoints_id` | UNIQUE | `UNIQUE (id)` |
| `webhook_endpoints_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `webhook_endpoints_id_not_null` | NOT NULL | `NOT NULL id` |
| `webhook_endpoints_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `webhook_endpoints_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `webhook_endpoints_owner_id_not_null` | NOT NULL | `NOT NULL owner_id` |
| `webhook_endpoints_owner_type_not_null` | NOT NULL | `NOT NULL owner_type` |
| `webhook_endpoints_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `webhook_endpoints_secret_hash_not_null` | NOT NULL | `NOT NULL secret_hash` |
| `webhook_endpoints_status_not_null` | NOT NULL | `NOT NULL status` |
| `webhook_endpoints_subscribed_events_not_null` | NOT NULL | `NOT NULL subscribed_events` |
| `webhook_endpoints_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `webhook_endpoints_url_encrypted_not_null` | NOT NULL | `NOT NULL url_encrypted` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_platform_webhook_endpoints_owner` | btree | `(owner_type, owner_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_webhook_endpoints_owner ON platform.webhook_endpoints USING btree (owner_type, owner_id)` |
| `pk_platform_webhook_endpoints` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_platform_webhook_endpoints ON platform.webhook_endpoints USING btree (internal_id)` |
| `uq_platform_webhook_endpoints_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_webhook_endpoints_id ON platform.webhook_endpoints USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.webhook_endpoints FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.webhook_endpoints FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.webhook_endpoints FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
