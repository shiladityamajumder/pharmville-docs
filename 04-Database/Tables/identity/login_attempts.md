# `identity.login_attempts`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds login attempts records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | identity.login_attempts |
| Classification | Audit / History |
| Proposed business write owner | Authentication_Access |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 10 columns; 3 PK/FK/UQ/CHECK/exclusion constraints; 5 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `failure_code` | `character varying(64)` | Yes | — | Code for failure | Link to controlled business classification or an external reference | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `ip_address` | `inet` | Yes | — | Inferred: stores ip address for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `login_identifier_hash` | `character varying(255)` | No | — | Inferred: stores login identifier hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `request_id` | `uuid` | Yes | — | Identifier associated with request | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `success` | `boolean` | No | — | Inferred: stores success for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `user_agent` | `text` | Yes | — | Inferred: stores user agent for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_login_attempts_user_id_users` |

## Record lifecycle and users

- **Created:** when the login attempts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.login_attempts` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_identity_login_attempts_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `identity.login_attempts` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_identity_login_attempts_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `fk_identity_login_attempts_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `pk_identity_login_attempts` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_identity_login_attempts_id` | UNIQUE | `UNIQUE (id)` |
| `login_attempts_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `login_attempts_id_not_null` | NOT NULL | `NOT NULL id` |
| `login_attempts_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `login_attempts_login_identifier_hash_not_null` | NOT NULL | `NOT NULL login_identifier_hash` |
| `login_attempts_success_not_null` | NOT NULL | `NOT NULL success` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_identity_login_attempts_ip_created_at` | btree | `(ip_address, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_login_attempts_ip_created_at ON identity.login_attempts USING btree (ip_address, created_at)` |
| `ix_identity_login_attempts_user_id_created_at` | btree | `(user_id, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_login_attempts_user_id_created_at ON identity.login_attempts USING btree (user_id, created_at)` |
| `pk_identity_login_attempts` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_identity_login_attempts ON identity.login_attempts USING btree (internal_id)` |
| `uq_identity_login_attempts_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_identity_login_attempts_id ON identity.login_attempts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.login_attempts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON identity.login_attempts FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.login_attempts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
