# `identity.api_clients`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds api clients records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | identity.api_clients |
| Classification | Configuration |
| Proposed business write owner | Authentication_Access |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 18 columns; 7 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `allowed_cidrs` | `jsonb` | No | `'[]'::jsonb` | Structured allowed cidrs information | Retain a versioned payload or relevant details | Exact constraints below |
| `allowed_scopes` | `jsonb` | No | `'[]'::jsonb` | Structured allowed scopes information | Retain a versioned payload or relevant details | Exact constraints below |
| `client_key` | `character varying(128)` | No | — | Inferred: stores client key for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `client_name` | `character varying(128)` | No | — | Inferred: stores client name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_api_clients_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_api_clients_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `last_used_at` | `timestamp with time zone` | Yes | — | Time of last used | Support chronology, deadlines or audit evidence | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `secret_hash` | `character varying(255)` | No | — | Inferred: stores secret hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `secret_rotated_at` | `timestamp with time zone` | Yes | — | Time of secret rotated | Support chronology, deadlines or audit evidence | Exact constraints below |
| `status` | `character varying(16)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_api_clients_updated_by_users` |

## Record lifecycle and users

- **Created:** when the api clients business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.api_clients` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_identity_api_clients_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_identity_api_clients_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_identity_api_clients_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`identity.api_client_secrets`](../../Tables/identity/api_client_secrets.md) | fk_identity_api_client_secrets_api_client_id_api_client_3b2b | `api_client_id_internal_id` | `internal_id` |
| [`identity.api_client_secrets`](../../Tables/identity/api_client_secrets.md) | fk_identity_api_client_secrets_api_client_id_api_clients | `api_client_id` | `id` |

## `identity.api_clients` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_identity_api_clients_created_by_users` |
| `deleted_by` | `identity.users` | `fk_identity_api_clients_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_identity_api_clients_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_api_clients_activestatus` | CHECK | `CHECK (status::text = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text, 'archived'::text]))` |
| `ck_identity_api_clients_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_identity_api_clients_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_api_clients_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_api_clients_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_identity_api_clients` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_identity_api_clients_id` | UNIQUE | `UNIQUE (id)` |
| `api_clients_allowed_cidrs_not_null` | NOT NULL | `NOT NULL allowed_cidrs` |
| `api_clients_allowed_scopes_not_null` | NOT NULL | `NOT NULL allowed_scopes` |
| `api_clients_client_key_not_null` | NOT NULL | `NOT NULL client_key` |
| `api_clients_client_name_not_null` | NOT NULL | `NOT NULL client_name` |
| `api_clients_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `api_clients_id_not_null` | NOT NULL | `NOT NULL id` |
| `api_clients_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `api_clients_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `api_clients_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `api_clients_secret_hash_not_null` | NOT NULL | `NOT NULL secret_hash` |
| `api_clients_status_not_null` | NOT NULL | `NOT NULL status` |
| `api_clients_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_identity_api_clients` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_identity_api_clients ON identity.api_clients USING btree (internal_id)` |
| `uq_identity_api_clients_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_identity_api_clients_id ON identity.api_clients USING btree (id)` |
| `uq_identity_api_clients_key_active` | btree | `(client_key)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_identity_api_clients_key_active ON identity.api_clients USING btree (client_key) WHERE is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.api_clients FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.api_clients FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.api_clients FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
