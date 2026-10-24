# `organization.bank_accounts`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds bank accounts records within the organization domain (operating companies, sites and licenses). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | organization.bank_accounts |
| Classification | Configuration |
| Proposed business write owner | Admin_CMS |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 19 columns; 10 PK/FK/UQ/CHECK/exclusion constraints; 14 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `account_holder_name` | `character varying(255)` | No | — | Inferred: stores account holder name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `account_number_encrypted` | `bytea` | No | — | Inferred: stores account number encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `account_number_last4` | `character varying(4)` | No | — | Inferred: stores account number last4 for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `bank_name` | `character varying(128)` | Yes | — | Inferred: stores bank name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_organization_bank_accounts_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_organization_bank_accounts_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `ifsc_code` | `character varying(16)` | No | — | Code for ifsc | Link to controlled business classification or an external reference | Collation: default |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `is_primary` | `boolean` | No | `false` | Yes/no flag for is primary | Control conditional business behavior | Exact constraints below |
| `organization_id` | `uuid` | No | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` via `fk_organization_bank_accounts_organization_id_organizations` |
| `organization_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` via `fk_organization_bank_accounts_organization_id_organizat_e061` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_organization_bank_accounts_updated_by_users` |
| `verification_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores verification status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the bank accounts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Admin_CMS, Order_Operations, Delivery_Operations, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `organization.bank_accounts` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_organization_bank_accounts_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_organization_bank_accounts_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_organization_bank_accounts_organization_id_organizat_e061 | `organization_id_internal_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE` |
| fk_organization_bank_accounts_organization_id_organizations | `organization_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE` |
| fk_organization_bank_accounts_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `organization.bank_accounts` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_organization_bank_accounts_created_by_users` |
| `deleted_by` | `identity.users` | `fk_organization_bank_accounts_deleted_by_users` |
| `organization_id_internal_id` | `organization.organizations` | `fk_organization_bank_accounts_organization_id_organizat_e061` |
| `organization_id` | `organization.organizations` | `fk_organization_bank_accounts_organization_id_organizations` |
| `updated_by` | `identity.users` | `fk_organization_bank_accounts_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_organization_bank_accounts_numeric_pair_organization_id` | CHECK | `CHECK ((organization_id IS NULL) = (organization_id_internal_id IS NULL))` |
| `ck_organization_bank_accounts_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_organization_bank_accounts_verificationstatus` | CHECK | `CHECK (verification_status::text = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text, 'expired'::text]))` |
| `fk_organization_bank_accounts_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_organization_bank_accounts_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_organization_bank_accounts_organization_id_organizat_e061` | FOREIGN KEY | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE` |
| `fk_organization_bank_accounts_organization_id_organizations` | FOREIGN KEY | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE` |
| `fk_organization_bank_accounts_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_organization_bank_accounts` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_organization_bank_accounts_id` | UNIQUE | `UNIQUE (id)` |
| `bank_accounts_account_holder_name_not_null` | NOT NULL | `NOT NULL account_holder_name` |
| `bank_accounts_account_number_encrypted_not_null` | NOT NULL | `NOT NULL account_number_encrypted` |
| `bank_accounts_account_number_last4_not_null` | NOT NULL | `NOT NULL account_number_last4` |
| `bank_accounts_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `bank_accounts_id_not_null` | NOT NULL | `NOT NULL id` |
| `bank_accounts_ifsc_code_not_null` | NOT NULL | `NOT NULL ifsc_code` |
| `bank_accounts_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `bank_accounts_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `bank_accounts_is_primary_not_null` | NOT NULL | `NOT NULL is_primary` |
| `bank_accounts_organization_id_internal_id_not_null` | NOT NULL | `NOT NULL organization_id_internal_id` |
| `bank_accounts_organization_id_not_null` | NOT NULL | `NOT NULL organization_id` |
| `bank_accounts_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `bank_accounts_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `bank_accounts_verification_status_not_null` | NOT NULL | `NOT NULL verification_status` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_organization_bank_accounts_organization_id` | btree | `(organization_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_organization_bank_accounts_organization_id ON organization.bank_accounts USING btree (organization_id)` |
| `pk_organization_bank_accounts` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_organization_bank_accounts ON organization.bank_accounts USING btree (internal_id)` |
| `uq_organization_bank_accounts_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_organization_bank_accounts_id ON organization.bank_accounts USING btree (id)` |
| `uq_organization_primary_bank_active` | btree | `(organization_id)` | is_primary = true AND is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_organization_primary_bank_active ON organization.bank_accounts USING btree (organization_id) WHERE is_primary = true AND is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON organization.bank_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON organization.bank_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON organization.bank_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
