# `identity.session_refresh_tokens`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Hashed refresh credential lineage retained to detect spent-token replay and revoke the owning session family.

| Attribute | Contract |
| --- | --- |
| Identity | identity.session_refresh_tokens |
| Classification | Transactional |
| Proposed business write owner | Authentication_Access |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 13 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 8 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 1 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `consumed_at` | `timestamp with time zone` | Yes | — | Consumed at | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Created at | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Created by | Supports the documented owner workflow or referential invariant. | FK → `identity.users` via `session_refresh_tokens_created_by_fkey` |
| `expires_at` | `timestamp with time zone` | No | — | Expires at | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Id | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `internal_id` | `bigint` | No | — | Internal id | Supports the documented owner workflow or referential invariant. | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `parent_token_id` | `uuid` | Yes | — | Parent token id | Supports the documented owner workflow or referential invariant. | FK → `identity.session_refresh_tokens` via `fk_refresh_parent_same_session`; FK → `identity.session_refresh_tokens` via `session_refresh_tokens_parent_token_id_fkey` |
| `revoked_at` | `timestamp with time zone` | Yes | — | Revoked at | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Row version | Supports the documented owner workflow or referential invariant. | Checked positive; optimistic precondition and maintenance trigger |
| `session_id` | `uuid` | No | — | Session id | Supports the documented owner workflow or referential invariant. | FK → `identity.session_refresh_tokens` via `fk_refresh_parent_same_session`; FK → `identity.sessions` via `session_refresh_tokens_session_id_fkey` |
| `token_hash` | `character varying(255)` | No | — | Token hash | Supports the documented owner workflow or referential invariant. | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Updated at | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Updated by | Supports the documented owner workflow or referential invariant. | FK → `identity.users` via `session_refresh_tokens_updated_by_fkey` |

## Record lifecycle and users

Identity creates transient transactional security state after abuse checks; consumes/blocks/expires or revokes it through a locked owner command. Retain replay evidence through the full credential acceptance horizon; D-003 approves purge limits. No deployment seeds; no raw credentials. All application behaviors remain unimplemented.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_refresh_parent_same_session | `parent_token_id, session_id` | [`identity.session_refresh_tokens`](../../Tables/identity/session_refresh_tokens.md) | `FOREIGN KEY (parent_token_id, session_id) REFERENCES identity.session_refresh_tokens(id, session_id) DEFERRABLE INITIALLY DEFERRED` |
| session_refresh_tokens_created_by_fkey | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id)` |
| session_refresh_tokens_parent_token_id_fkey | `parent_token_id` | [`identity.session_refresh_tokens`](../../Tables/identity/session_refresh_tokens.md) | `FOREIGN KEY (parent_token_id) REFERENCES identity.session_refresh_tokens(id)` |
| session_refresh_tokens_session_id_fkey | `session_id` | [`identity.sessions`](../../Tables/identity/sessions.md) | `FOREIGN KEY (session_id) REFERENCES identity.sessions(id) ON DELETE CASCADE` |
| session_refresh_tokens_updated_by_fkey | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id)` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`identity.session_refresh_tokens`](../../Tables/identity/session_refresh_tokens.md) | fk_refresh_parent_same_session | `parent_token_id, session_id` | `id, session_id` |
| [`identity.session_refresh_tokens`](../../Tables/identity/session_refresh_tokens.md) | session_refresh_tokens_parent_token_id_fkey | `parent_token_id` | `id` |

## `identity.session_refresh_tokens` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `parent_token_id, session_id` | `identity.session_refresh_tokens` | `fk_refresh_parent_same_session` |
| `created_by` | `identity.users` | `session_refresh_tokens_created_by_fkey` |
| `parent_token_id` | `identity.session_refresh_tokens` | `session_refresh_tokens_parent_token_id_fkey` |
| `session_id` | `identity.sessions` | `session_refresh_tokens_session_id_fkey` |
| `updated_by` | `identity.users` | `session_refresh_tokens_updated_by_fkey` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_refresh_expiry` | CHECK | `CHECK (expires_at > created_at)` |
| `ck_identity_refresh_not_self_parent` | CHECK | `CHECK (parent_token_id IS NULL OR parent_token_id <> id)` |
| `fk_refresh_parent_same_session` | FOREIGN KEY | `FOREIGN KEY (parent_token_id, session_id) REFERENCES identity.session_refresh_tokens(id, session_id) DEFERRABLE INITIALLY DEFERRED` |
| `session_refresh_tokens_created_by_fkey` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id)` |
| `session_refresh_tokens_id_key` | UNIQUE | `UNIQUE (id)` |
| `session_refresh_tokens_parent_token_id_fkey` | FOREIGN KEY | `FOREIGN KEY (parent_token_id) REFERENCES identity.session_refresh_tokens(id)` |
| `session_refresh_tokens_pkey` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `session_refresh_tokens_row_version_check` | CHECK | `CHECK (row_version > 0)` |
| `session_refresh_tokens_session_id_fkey` | FOREIGN KEY | `FOREIGN KEY (session_id) REFERENCES identity.sessions(id) ON DELETE CASCADE` |
| `session_refresh_tokens_token_hash_key` | UNIQUE | `UNIQUE (token_hash)` |
| `session_refresh_tokens_updated_by_fkey` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id)` |
| `uq_refresh_token_id_session` | UNIQUE | `UNIQUE (id, session_id)` |
| `session_refresh_tokens_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `session_refresh_tokens_expires_at_not_null` | NOT NULL | `NOT NULL expires_at` |
| `session_refresh_tokens_id_not_null` | NOT NULL | `NOT NULL id` |
| `session_refresh_tokens_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `session_refresh_tokens_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `session_refresh_tokens_session_id_not_null` | NOT NULL | `NOT NULL session_id` |
| `session_refresh_tokens_token_hash_not_null` | NOT NULL | `NOT NULL token_hash` |
| `session_refresh_tokens_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_identity_refresh_session` | btree | `(session_id, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_refresh_session ON identity.session_refresh_tokens USING btree (session_id, created_at)` |
| `session_refresh_tokens_id_key` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX session_refresh_tokens_id_key ON identity.session_refresh_tokens USING btree (id)` |
| `session_refresh_tokens_pkey` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX session_refresh_tokens_pkey ON identity.session_refresh_tokens USING btree (internal_id)` |
| `session_refresh_tokens_token_hash_key` | btree | `(token_hash)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX session_refresh_tokens_token_hash_key ON identity.session_refresh_tokens USING btree (token_hash)` |
| `uq_identity_refresh_child` | btree | `(parent_token_id)` | parent_token_id IS NOT NULL | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_identity_refresh_child ON identity.session_refresh_tokens USING btree (parent_token_id) WHERE parent_token_id IS NOT NULL` |
| `uq_refresh_token_id_session` | btree | `(id, session_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_refresh_token_id_session ON identity.session_refresh_tokens USING btree (id, session_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.session_refresh_tokens FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
