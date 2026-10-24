# `platform.idempotency_keys`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds idempotency keys records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | platform.idempotency_keys |
| Classification | Derived / Operational |
| Proposed business write owner | Shared platform runtime — engineering owner |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 7 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_idempotency_keys_created_by_users` |
| `expires_at` | `timestamp with time zone` | No | — | Expiration time | Determine validity windows | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `locked_until` | `timestamp with time zone` | Yes | — | Inferred: stores locked until for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `request_hash` | `character varying(64)` | No | — | Inferred: stores request hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `request_metadata` | `jsonb` | No | `'{}'::jsonb` | Structured request metadata information | Retain a versioned payload or relevant details | Exact constraints below |
| `response_body` | `jsonb` | Yes | — | Structured response body information | Retain a versioned payload or relevant details | Exact constraints below |
| `response_code` | `integer` | Yes | — | Code for response | Link to controlled business classification or an external reference | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `scope` | `character varying(128)` | No | — | Inferred: stores scope for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_idempotency_keys_updated_by_users` |

## Record lifecycle and users

- **Created:** when the idempotency keys business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.idempotency_keys` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_platform_idempotency_keys_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_idempotency_keys_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `platform.idempotency_keys` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_platform_idempotency_keys_created_by_users` |
| `updated_by` | `identity.users` | `fk_platform_idempotency_keys_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_idempotency_keys_expires_after_created` | CHECK | `CHECK (expires_at > created_at)` |
| `ck_platform_idempotency_keys_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_platform_idempotency_keys_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_idempotency_keys_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `idempotency_scope_key` | UNIQUE | `UNIQUE (scope, idempotency_key)` |
| `pk_platform_idempotency_keys` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_idempotency_keys_id` | UNIQUE | `UNIQUE (id)` |
| `idempotency_keys_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `idempotency_keys_expires_at_not_null` | NOT NULL | `NOT NULL expires_at` |
| `idempotency_keys_id_not_null` | NOT NULL | `NOT NULL id` |
| `idempotency_keys_idempotency_key_not_null` | NOT NULL | `NOT NULL idempotency_key` |
| `idempotency_keys_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `idempotency_keys_request_hash_not_null` | NOT NULL | `NOT NULL request_hash` |
| `idempotency_keys_request_metadata_not_null` | NOT NULL | `NOT NULL request_metadata` |
| `idempotency_keys_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `idempotency_keys_scope_not_null` | NOT NULL | `NOT NULL scope` |
| `idempotency_keys_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `idempotency_scope_key` | btree | `(scope, idempotency_key)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX idempotency_scope_key ON platform.idempotency_keys USING btree (scope, idempotency_key)` |
| `ix_platform_idempotency_keys_expires_at` | btree | `(expires_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_idempotency_keys_expires_at ON platform.idempotency_keys USING btree (expires_at)` |
| `pk_platform_idempotency_keys` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_platform_idempotency_keys ON platform.idempotency_keys USING btree (internal_id)` |
| `uq_platform_idempotency_keys_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_idempotency_keys_id ON platform.idempotency_keys USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.idempotency_keys FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.idempotency_keys FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.idempotency_keys FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
