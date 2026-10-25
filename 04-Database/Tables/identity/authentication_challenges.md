# `identity.authentication_challenges`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Durable single-use, purpose-bound proofs for unified login, step-up, authenticator enrollment and password recovery; server-resolved identity, policy and context binding.

| Attribute | Contract |
| --- | --- |
| Identity | identity.authentication_challenges |
| Classification | Transactional |
| Proposed business write owner | Authentication_Access |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 25 columns; 23 PK/FK/UQ/CHECK/exclusion constraints; 13 named PostgreSQL 18 NOT NULL constraints; 7 indexes; 1 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `attempts` | `integer` | No | `0` | Attempts | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `binding_json` | `jsonb` | No | `'{}'::jsonb` | Binding json | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `blocked_at` | `timestamp with time zone` | Yes | — | Blocked at | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `consumed_at` | `timestamp with time zone` | Yes | — | Consumed at | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Created at | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Created by | Supports the documented owner workflow or referential invariant. | FK → `identity.users` via `authentication_challenges_created_by_fkey` |
| `expires_at` | `timestamp with time zone` | No | — | Expires at | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `factor_type` | `character varying(16)` | No | — | Factor type | Supports the documented owner workflow or referential invariant. | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Id | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `identifier_encrypted` | `bytea` | Yes | — | Identifier encrypted | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `identity_version` | `bigint` | Yes | — | Identity version | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `internal_id` | `bigint` | No | — | Internal id | Supports the documented owner workflow or referential invariant. | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `max_attempts` | `integer` | No | — | Max attempts | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `mfa_factor_id` | `uuid` | Yes | — | Mfa factor id | Supports the documented owner workflow or referential invariant. | FK → `identity.mfa_factors` via `authentication_challenges_mfa_factor_id_fkey`; FK → `identity.mfa_factors` via `fk_auth_challenge_factor_owner` |
| `otp_challenge_id` | `uuid` | Yes | — | Otp challenge id | Supports the documented owner workflow or referential invariant. | FK → `identity.otp_challenges` via `authentication_challenges_otp_challenge_id_fkey` |
| `parent_challenge_id` | `uuid` | Yes | — | Parent challenge id | Supports the documented owner workflow or referential invariant. | FK → `identity.authentication_challenges` via `authentication_challenges_parent_challenge_id_fkey` |
| `policy_version` | `character varying(64)` | No | — | Policy version | Supports the documented owner workflow or referential invariant. | Collation: default |
| `purpose` | `character varying(32)` | No | — | Purpose | Supports the documented owner workflow or referential invariant. | Collation: default |
| `requested_context_hash` | `character varying(255)` | Yes | — | Requested context hash | Supports the documented owner workflow or referential invariant. | Collation: default |
| `row_version` | `bigint` | No | `1` | Row version | Supports the documented owner workflow or referential invariant. | Checked positive; optimistic precondition and maintenance trigger |
| `session_id` | `uuid` | Yes | — | Session id | Supports the documented owner workflow or referential invariant. | FK → `identity.sessions` via `authentication_challenges_session_id_fkey`; FK → `identity.sessions` via `fk_auth_challenge_session_owner` |
| `token_hash` | `character varying(255)` | No | — | Token hash | Supports the documented owner workflow or referential invariant. | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Updated at | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Updated by | Supports the documented owner workflow or referential invariant. | FK → `identity.users` via `authentication_challenges_updated_by_fkey` |
| `user_id` | `uuid` | Yes | — | User id | Supports the documented owner workflow or referential invariant. | FK → `identity.users` via `authentication_challenges_user_id_fkey`; FK → `identity.mfa_factors` via `fk_auth_challenge_factor_owner`; FK → `identity.sessions` via `fk_auth_challenge_session_owner` |

## Record lifecycle and users

Identity creates transient transactional security state after abuse checks; consumes/blocks/expires or revokes it through a locked owner command. Retain replay evidence through the full credential acceptance horizon; D-003 approves purge limits. No deployment seeds; no raw credentials. All application behaviors remain unimplemented.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| authentication_challenges_created_by_fkey | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id)` |
| authentication_challenges_mfa_factor_id_fkey | `mfa_factor_id` | [`identity.mfa_factors`](../../Tables/identity/mfa_factors.md) | `FOREIGN KEY (mfa_factor_id) REFERENCES identity.mfa_factors(id)` |
| authentication_challenges_otp_challenge_id_fkey | `otp_challenge_id` | [`identity.otp_challenges`](../../Tables/identity/otp_challenges.md) | `FOREIGN KEY (otp_challenge_id) REFERENCES identity.otp_challenges(id)` |
| authentication_challenges_parent_challenge_id_fkey | `parent_challenge_id` | [`identity.authentication_challenges`](../../Tables/identity/authentication_challenges.md) | `FOREIGN KEY (parent_challenge_id) REFERENCES identity.authentication_challenges(id)` |
| authentication_challenges_session_id_fkey | `session_id` | [`identity.sessions`](../../Tables/identity/sessions.md) | `FOREIGN KEY (session_id) REFERENCES identity.sessions(id) ON DELETE CASCADE` |
| authentication_challenges_updated_by_fkey | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id)` |
| authentication_challenges_user_id_fkey | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| fk_auth_challenge_factor_owner | `mfa_factor_id, user_id` | [`identity.mfa_factors`](../../Tables/identity/mfa_factors.md) | `FOREIGN KEY (mfa_factor_id, user_id) REFERENCES identity.mfa_factors(id, user_id) DEFERRABLE INITIALLY DEFERRED` |
| fk_auth_challenge_session_owner | `session_id, user_id` | [`identity.sessions`](../../Tables/identity/sessions.md) | `FOREIGN KEY (session_id, user_id) REFERENCES identity.sessions(id, user_id) DEFERRABLE INITIALLY DEFERRED` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`identity.authentication_challenges`](../../Tables/identity/authentication_challenges.md) | authentication_challenges_parent_challenge_id_fkey | `parent_challenge_id` | `id` |

## `identity.authentication_challenges` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `authentication_challenges_created_by_fkey` |
| `mfa_factor_id` | `identity.mfa_factors` | `authentication_challenges_mfa_factor_id_fkey` |
| `otp_challenge_id` | `identity.otp_challenges` | `authentication_challenges_otp_challenge_id_fkey` |
| `parent_challenge_id` | `identity.authentication_challenges` | `authentication_challenges_parent_challenge_id_fkey` |
| `session_id` | `identity.sessions` | `authentication_challenges_session_id_fkey` |
| `updated_by` | `identity.users` | `authentication_challenges_updated_by_fkey` |
| `user_id` | `identity.users` | `authentication_challenges_user_id_fkey` |
| `mfa_factor_id, user_id` | `identity.mfa_factors` | `fk_auth_challenge_factor_owner` |
| `session_id, user_id` | `identity.sessions` | `fk_auth_challenge_session_owner` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `authentication_challenges_attempts_check` | CHECK | `CHECK (attempts >= 0)` |
| `authentication_challenges_binding_json_check` | CHECK | `CHECK (jsonb_typeof(binding_json) = 'object'::text)` |
| `authentication_challenges_check` | CHECK | `CHECK (max_attempts > 0 AND attempts <= max_attempts)` |
| `authentication_challenges_created_by_fkey` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id)` |
| `authentication_challenges_factor_type_check` | CHECK | `CHECK (factor_type::text = ANY (ARRAY['otp'::text, 'password'::text, 'totp'::text]))` |
| `authentication_challenges_id_key` | UNIQUE | `UNIQUE (id)` |
| `authentication_challenges_identity_version_check` | CHECK | `CHECK (identity_version IS NULL OR identity_version > 0)` |
| `authentication_challenges_mfa_factor_id_fkey` | FOREIGN KEY | `FOREIGN KEY (mfa_factor_id) REFERENCES identity.mfa_factors(id)` |
| `authentication_challenges_otp_challenge_id_fkey` | FOREIGN KEY | `FOREIGN KEY (otp_challenge_id) REFERENCES identity.otp_challenges(id)` |
| `authentication_challenges_parent_challenge_id_fkey` | FOREIGN KEY | `FOREIGN KEY (parent_challenge_id) REFERENCES identity.authentication_challenges(id)` |
| `authentication_challenges_pkey` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `authentication_challenges_purpose_check` | CHECK | `CHECK (purpose::text = ANY (ARRAY['login'::text, 'step_up'::text, 'mfa_enrollment'::text, 'password_recovery'::text]))` |
| `authentication_challenges_row_version_check` | CHECK | `CHECK (row_version > 0)` |
| `authentication_challenges_session_id_fkey` | FOREIGN KEY | `FOREIGN KEY (session_id) REFERENCES identity.sessions(id) ON DELETE CASCADE` |
| `authentication_challenges_token_hash_key` | UNIQUE | `UNIQUE (token_hash)` |
| `authentication_challenges_updated_by_fkey` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id)` |
| `authentication_challenges_user_id_fkey` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `ck_auth_challenge_factor_owner` | CHECK | `CHECK (mfa_factor_id IS NULL OR user_id IS NOT NULL)` |
| `ck_identity_challenge_expiry` | CHECK | `CHECK (expires_at > created_at)` |
| `ck_identity_challenge_not_self_parent` | CHECK | `CHECK (parent_challenge_id IS NULL OR parent_challenge_id <> id)` |
| `ck_identity_challenge_session` | CHECK | `CHECK ((purpose::text <> ALL (ARRAY['step_up'::text, 'mfa_enrollment'::text])) OR user_id IS NOT NULL AND session_id IS NOT NULL)` |
| `fk_auth_challenge_factor_owner` | FOREIGN KEY | `FOREIGN KEY (mfa_factor_id, user_id) REFERENCES identity.mfa_factors(id, user_id) DEFERRABLE INITIALLY DEFERRED` |
| `fk_auth_challenge_session_owner` | FOREIGN KEY | `FOREIGN KEY (session_id, user_id) REFERENCES identity.sessions(id, user_id) DEFERRABLE INITIALLY DEFERRED` |
| `authentication_challenges_attempts_not_null` | NOT NULL | `NOT NULL attempts` |
| `authentication_challenges_binding_json_not_null` | NOT NULL | `NOT NULL binding_json` |
| `authentication_challenges_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `authentication_challenges_expires_at_not_null` | NOT NULL | `NOT NULL expires_at` |
| `authentication_challenges_factor_type_not_null` | NOT NULL | `NOT NULL factor_type` |
| `authentication_challenges_id_not_null` | NOT NULL | `NOT NULL id` |
| `authentication_challenges_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `authentication_challenges_max_attempts_not_null` | NOT NULL | `NOT NULL max_attempts` |
| `authentication_challenges_policy_version_not_null` | NOT NULL | `NOT NULL policy_version` |
| `authentication_challenges_purpose_not_null` | NOT NULL | `NOT NULL purpose` |
| `authentication_challenges_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `authentication_challenges_token_hash_not_null` | NOT NULL | `NOT NULL token_hash` |
| `authentication_challenges_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `authentication_challenges_id_key` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX authentication_challenges_id_key ON identity.authentication_challenges USING btree (id)` |
| `authentication_challenges_pkey` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX authentication_challenges_pkey ON identity.authentication_challenges USING btree (internal_id)` |
| `authentication_challenges_token_hash_key` | btree | `(token_hash)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX authentication_challenges_token_hash_key ON identity.authentication_challenges USING btree (token_hash)` |
| `ix_identity_challenges_session` | btree | `(session_id)` | session_id IS NOT NULL | Read/join/filter access path; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_challenges_session ON identity.authentication_challenges USING btree (session_id) WHERE session_id IS NOT NULL` |
| `ix_identity_challenges_user_pending` | btree | `(user_id, expires_at)` | consumed_at IS NULL AND blocked_at IS NULL | Read/join/filter access path; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_challenges_user_pending ON identity.authentication_challenges USING btree (user_id, expires_at) WHERE consumed_at IS NULL AND blocked_at IS NULL` |
| `uq_identity_challenge_child` | btree | `(parent_challenge_id)` | parent_challenge_id IS NOT NULL | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_identity_challenge_child ON identity.authentication_challenges USING btree (parent_challenge_id) WHERE parent_challenge_id IS NOT NULL` |
| `uq_identity_challenge_otp` | btree | `(otp_challenge_id)` | otp_challenge_id IS NOT NULL | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_identity_challenge_otp ON identity.authentication_challenges USING btree (otp_challenge_id) WHERE otp_challenge_id IS NOT NULL` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.authentication_challenges FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
