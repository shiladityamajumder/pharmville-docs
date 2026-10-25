# `identity.sessions`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds sessions records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | identity.sessions |
| Classification | Transactional |
| Proposed business write owner | Authentication_Access |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 26 columns; 13 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 9 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `active_assignment_id` | `uuid` | Yes | — | Active assignment id | Supports the documented owner workflow or referential invariant. | FK → `identity.user_roles` via `fk_identity_session_assignment_owner` |
| `active_workspace_code` | `character varying(64)` | Yes | — | Active workspace code | Supports the documented owner workflow or referential invariant. | Collation: default |
| `authenticated_at` | `timestamp with time zone` | Yes | — | Authenticated at | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `authentication_policy_version` | `character varying(64)` | Yes | — | Authentication policy version | Supports the documented owner workflow or referential invariant. | Collation: default |
| `context_version` | `bigint` | No | `1` | Context version | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_sessions_created_by_users` |
| `device_id` | `character varying(255)` | Yes | — | Identifier associated with device | Link the event or entity to its subject; verify constraints | Collation: default |
| `device_type` | `character varying(32)` | Yes | — | Inferred: stores device type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `expires_at` | `timestamp with time zone` | No | — | Expiration time | Determine validity windows | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `ip_address` | `inet` | Yes | — | Inferred: stores ip address for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `last_seen_at` | `timestamp with time zone` | Yes | — | Time of last seen | Support chronology, deadlines or audit evidence | Exact constraints below |
| `mfa_verified_at` | `timestamp with time zone` | Yes | — | Mfa verified at | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `otp_verified_at` | `timestamp with time zone` | Yes | — | Otp verified at | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `password_verified_at` | `timestamp with time zone` | Yes | — | Password verified at | Supports the documented owner workflow or referential invariant. | Exact constraints below |
| `refresh_token_hash` | `character varying(255)` | No | — | Inferred: stores refresh token hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `revoke_reason` | `character varying(255)` | Yes | — | Inferred: stores revoke reason for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `revoked_at` | `timestamp with time zone` | Yes | — | Time of revoked | Support chronology, deadlines or audit evidence | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `token_family_id` | `uuid` | No | — | Identifier associated with token family | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_sessions_updated_by_users` |
| `user_agent` | `text` | Yes | — | Inferred: stores user agent for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.user_roles` via `fk_identity_session_assignment_owner`; FK → `identity.users` via `fk_identity_sessions_user_id_users` |

## Record lifecycle and users

- **Created:** when the sessions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.sessions` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_identity_session_assignment_owner | `active_assignment_id, user_id` | [`identity.user_roles`](../../Tables/identity/user_roles.md) | `FOREIGN KEY (active_assignment_id, user_id) REFERENCES identity.user_roles(id, user_id) DEFERRABLE INITIALLY DEFERRED` |
| fk_identity_sessions_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_identity_sessions_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_identity_sessions_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`identity.authentication_challenges`](../../Tables/identity/authentication_challenges.md) | authentication_challenges_session_id_fkey | `session_id` | `id` |
| [`identity.authentication_challenges`](../../Tables/identity/authentication_challenges.md) | fk_auth_challenge_session_owner | `session_id, user_id` | `id, user_id` |
| [`identity.session_refresh_tokens`](../../Tables/identity/session_refresh_tokens.md) | session_refresh_tokens_session_id_fkey | `session_id` | `id` |

## `identity.sessions` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `active_assignment_id, user_id` | `identity.user_roles` | `fk_identity_session_assignment_owner` |
| `created_by` | `identity.users` | `fk_identity_sessions_created_by_users` |
| `updated_by` | `identity.users` | `fk_identity_sessions_updated_by_users` |
| `user_id` | `identity.users` | `fk_identity_sessions_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_session_context_pair` | CHECK | `CHECK ((active_assignment_id IS NULL) = (active_workspace_code IS NULL))` |
| `ck_identity_session_context_version` | CHECK | `CHECK (context_version > 0)` |
| `ck_identity_session_workspace_nonblank` | CHECK | `CHECK (active_workspace_code IS NULL OR length(btrim(active_workspace_code::text)) > 0)` |
| `ck_identity_sessions_expires_after_created` | CHECK | `CHECK (expires_at > created_at)` |
| `ck_identity_sessions_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_identity_session_assignment_owner` | FOREIGN KEY | `FOREIGN KEY (active_assignment_id, user_id) REFERENCES identity.user_roles(id, user_id) DEFERRABLE INITIALLY DEFERRED` |
| `fk_identity_sessions_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_sessions_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_sessions_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_identity_sessions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `sessions_refresh_token_hash` | UNIQUE | `UNIQUE (refresh_token_hash)` |
| `uq_identity_sessions_id` | UNIQUE | `UNIQUE (id)` |
| `uq_sessions_id_user` | UNIQUE | `UNIQUE (id, user_id)` |
| `sessions_context_version_not_null` | NOT NULL | `NOT NULL context_version` |
| `sessions_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `sessions_expires_at_not_null` | NOT NULL | `NOT NULL expires_at` |
| `sessions_id_not_null` | NOT NULL | `NOT NULL id` |
| `sessions_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `sessions_refresh_token_hash_not_null` | NOT NULL | `NOT NULL refresh_token_hash` |
| `sessions_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `sessions_token_family_id_not_null` | NOT NULL | `NOT NULL token_family_id` |
| `sessions_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `sessions_user_id_not_null` | NOT NULL | `NOT NULL user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_identity_sessions_active_assignment` | btree | `(active_assignment_id)` | active_assignment_id IS NOT NULL | Read/join/filter access path; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_sessions_active_assignment ON identity.sessions USING btree (active_assignment_id) WHERE active_assignment_id IS NOT NULL` |
| `ix_identity_sessions_device_id` | btree | `(device_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_sessions_device_id ON identity.sessions USING btree (device_id)` |
| `ix_identity_sessions_expires_at` | btree | `(expires_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_sessions_expires_at ON identity.sessions USING btree (expires_at)` |
| `ix_identity_sessions_token_family` | btree | `(token_family_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_sessions_token_family ON identity.sessions USING btree (token_family_id)` |
| `ix_identity_sessions_user_id` | btree | `(user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_sessions_user_id ON identity.sessions USING btree (user_id)` |
| `pk_identity_sessions` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_identity_sessions ON identity.sessions USING btree (internal_id)` |
| `sessions_refresh_token_hash` | btree | `(refresh_token_hash)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX sessions_refresh_token_hash ON identity.sessions USING btree (refresh_token_hash)` |
| `uq_identity_sessions_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_identity_sessions_id ON identity.sessions USING btree (id)` |
| `uq_sessions_id_user` | btree | `(id, user_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_sessions_id_user ON identity.sessions USING btree (id, user_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `ab_session_context` | `CREATE TRIGGER ab_session_context BEFORE UPDATE ON identity.sessions FOR EACH ROW EXECUTE FUNCTION identity.guard_session_context()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
