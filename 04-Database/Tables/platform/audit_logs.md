# `platform.audit_logs`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds audit logs records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | platform.audit_logs |
| Classification | Audit / History |
| Proposed business write owner | Audit |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 3 PK/FK/UQ/CHECK/exclusion constraints; 8 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `action` | `character varying(128)` | No | — | Inferred: stores action for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `actor_type` | `character varying(32)` | No | — | Inferred: stores actor type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `actor_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_audit_logs_actor_user_id_users` |
| `after_data` | `jsonb` | Yes | — | Structured after data information | Retain a versioned payload or relevant details | Exact constraints below |
| `before_data` | `jsonb` | Yes | — | Structured before data information | Retain a versioned payload or relevant details | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `ip_address` | `inet` | Yes | — | Inferred: stores ip address for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | Exact constraints below |
| `occurred_at` | `timestamp with time zone` | No | `now()` | Time of occurred | Support chronology, deadlines or audit evidence | Exact constraints below |
| `request_id` | `uuid` | Yes | — | Identifier associated with request | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `resource_id` | `character varying(128)` | Yes | — | Identifier associated with resource | Link the event or entity to its subject; verify constraints | Collation: default |
| `resource_type` | `character varying(128)` | No | — | Inferred: stores resource type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `trace_id` | `character varying(64)` | Yes | — | Identifier associated with trace | Link the event or entity to its subject; verify constraints | Collation: default |

## Record lifecycle and users

- **Created:** when the audit logs business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.audit_logs` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_platform_audit_logs_actor_user_id_users | `actor_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `platform.audit_logs` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `actor_user_id` | `identity.users` | `fk_platform_audit_logs_actor_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `fk_platform_audit_logs_actor_user_id_users` | FOREIGN KEY | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `pk_platform_audit_logs` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_audit_logs_id` | UNIQUE | `UNIQUE (id)` |
| `audit_logs_action_not_null` | NOT NULL | `NOT NULL action` |
| `audit_logs_actor_type_not_null` | NOT NULL | `NOT NULL actor_type` |
| `audit_logs_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `audit_logs_id_not_null` | NOT NULL | `NOT NULL id` |
| `audit_logs_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `audit_logs_metadata_json_not_null` | NOT NULL | `NOT NULL metadata_json` |
| `audit_logs_occurred_at_not_null` | NOT NULL | `NOT NULL occurred_at` |
| `audit_logs_resource_type_not_null` | NOT NULL | `NOT NULL resource_type` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_platform_audit_logs_actor_time` | btree | `(actor_user_id, occurred_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_audit_logs_actor_time ON platform.audit_logs USING btree (actor_user_id, occurred_at)` |
| `ix_platform_audit_logs_occurred_at` | btree | `(occurred_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_audit_logs_occurred_at ON platform.audit_logs USING btree (occurred_at)` |
| `ix_platform_audit_logs_request` | btree | `(request_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_audit_logs_request ON platform.audit_logs USING btree (request_id)` |
| `ix_platform_audit_logs_resource` | btree | `(resource_type, resource_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_audit_logs_resource ON platform.audit_logs USING btree (resource_type, resource_id)` |
| `pk_platform_audit_logs` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_platform_audit_logs ON platform.audit_logs USING btree (internal_id)` |
| `uq_platform_audit_logs_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_audit_logs_id ON platform.audit_logs USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.audit_logs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON platform.audit_logs FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.audit_logs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
