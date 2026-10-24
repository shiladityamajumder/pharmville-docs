# `identity.api_client_secrets`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds api client secrets records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | identity.api_client_secrets |
| Classification | Configuration |
| Proposed business write owner | Authentication_Access |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 13 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `api_client_id` | `uuid` | No | — | Reference linking this record to api clients | Ensures related business data can be joined and validated | FK → `identity.api_clients` via `fk_identity_api_client_secrets_api_client_id_api_clients` |
| `api_client_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `identity.api_clients` via `fk_identity_api_client_secrets_api_client_id_api_client_3b2b` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_api_client_secrets_created_by_users` |
| `expires_at` | `timestamp with time zone` | Yes | — | Expiration time | Determine validity windows | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `revoked_at` | `timestamp with time zone` | Yes | — | Time of revoked | Support chronology, deadlines or audit evidence | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `secret_hash` | `character varying(255)` | No | — | Inferred: stores secret hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_api_client_secrets_updated_by_users` |
| `valid_from` | `timestamp with time zone` | No | `now()` | Inferred: stores valid from for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the api client secrets business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.api_client_secrets` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_identity_api_client_secrets_api_client_id_api_client_3b2b | `api_client_id_internal_id` | [`identity.api_clients`](../../Tables/identity/api_clients.md) | `FOREIGN KEY (api_client_id_internal_id) REFERENCES identity.api_clients(internal_id) ON DELETE CASCADE` |
| fk_identity_api_client_secrets_api_client_id_api_clients | `api_client_id` | [`identity.api_clients`](../../Tables/identity/api_clients.md) | `FOREIGN KEY (api_client_id) REFERENCES identity.api_clients(id) ON DELETE CASCADE` |
| fk_identity_api_client_secrets_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_identity_api_client_secrets_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `identity.api_client_secrets` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `api_client_id_internal_id` | `identity.api_clients` | `fk_identity_api_client_secrets_api_client_id_api_client_3b2b` |
| `api_client_id` | `identity.api_clients` | `fk_identity_api_client_secrets_api_client_id_api_clients` |
| `created_by` | `identity.users` | `fk_identity_api_client_secrets_created_by_users` |
| `updated_by` | `identity.users` | `fk_identity_api_client_secrets_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_api_client_secrets_expiry_after_created` | CHECK | `CHECK (expires_at IS NULL OR expires_at > created_at)` |
| `ck_identity_api_client_secrets_numeric_pair_api_client_id` | CHECK | `CHECK ((api_client_id IS NULL) = (api_client_id_internal_id IS NULL))` |
| `ck_identity_api_client_secrets_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_identity_api_client_secrets_api_client_id_api_client_3b2b` | FOREIGN KEY | `FOREIGN KEY (api_client_id_internal_id) REFERENCES identity.api_clients(internal_id) ON DELETE CASCADE` |
| `fk_identity_api_client_secrets_api_client_id_api_clients` | FOREIGN KEY | `FOREIGN KEY (api_client_id) REFERENCES identity.api_clients(id) ON DELETE CASCADE` |
| `fk_identity_api_client_secrets_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_api_client_secrets_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_identity_api_client_secrets` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_identity_api_client_secrets_id` | UNIQUE | `UNIQUE (id)` |
| `api_client_secrets_api_client_id_internal_id_not_null` | NOT NULL | `NOT NULL api_client_id_internal_id` |
| `api_client_secrets_api_client_id_not_null` | NOT NULL | `NOT NULL api_client_id` |
| `api_client_secrets_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `api_client_secrets_id_not_null` | NOT NULL | `NOT NULL id` |
| `api_client_secrets_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `api_client_secrets_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `api_client_secrets_secret_hash_not_null` | NOT NULL | `NOT NULL secret_hash` |
| `api_client_secrets_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `api_client_secrets_valid_from_not_null` | NOT NULL | `NOT NULL valid_from` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_identity_api_client_secrets_client_id` | btree | `(api_client_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_api_client_secrets_client_id ON identity.api_client_secrets USING btree (api_client_id)` |
| `pk_identity_api_client_secrets` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_identity_api_client_secrets ON identity.api_client_secrets USING btree (internal_id)` |
| `uq_identity_api_client_secrets_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_identity_api_client_secrets_id ON identity.api_client_secrets USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.api_client_secrets FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["api_client_id","api_client_id_internal_id","identity","api_clients"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.api_client_secrets FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.api_client_secrets FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["api_client_id","api_client_id_internal_id","identity","api_clients"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
