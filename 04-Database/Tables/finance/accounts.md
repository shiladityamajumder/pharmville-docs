# `finance.accounts`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds accounts records within the finance domain (invoicing, ledgers and settlement). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | finance.accounts |
| Classification | Master / Reference |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 10 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `account_code` | `character varying(64)` | No | — | Code for account | Link to controlled business classification or an external reference | Collation: default |
| `account_type` | `character varying(32)` | No | — | Inferred: stores account type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_finance_accounts_created_by_users` |
| `currency` | `character varying(3)` | Yes | — | Monetary currency code | Avoid interpreting amounts without a denomination | Collation: default |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_finance_accounts_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `parent_account_id` | `uuid` | Yes | — | Reference linking this record to accounts | Ensures related business data can be joined and validated | FK → `finance.accounts` via `fk_finance_accounts_parent_account_id_accounts` |
| `parent_account_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `finance.accounts` via `fk_finance_accounts_parent_account_id_accounts_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_finance_accounts_updated_by_users` |

## Record lifecycle and users

- **Created:** when the accounts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `finance.accounts` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_finance_accounts_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_finance_accounts_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_finance_accounts_parent_account_id_accounts | `parent_account_id` | [`finance.accounts`](../../Tables/finance/accounts.md) | `FOREIGN KEY (parent_account_id) REFERENCES finance.accounts(id) ON DELETE SET NULL` |
| fk_finance_accounts_parent_account_id_accounts_numeric | `parent_account_id_internal_id` | [`finance.accounts`](../../Tables/finance/accounts.md) | `FOREIGN KEY (parent_account_id_internal_id) REFERENCES finance.accounts(internal_id) ON DELETE SET NULL` |
| fk_finance_accounts_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`finance.accounts`](../../Tables/finance/accounts.md) | fk_finance_accounts_parent_account_id_accounts | `parent_account_id` | `id` |
| [`finance.accounts`](../../Tables/finance/accounts.md) | fk_finance_accounts_parent_account_id_accounts_numeric | `parent_account_id_internal_id` | `internal_id` |
| [`finance.journal_lines`](../../Tables/finance/journal_lines.md) | fk_finance_journal_lines_account_id_accounts | `account_id` | `id` |
| [`finance.journal_lines`](../../Tables/finance/journal_lines.md) | fk_finance_journal_lines_account_id_accounts_numeric | `account_id_internal_id` | `internal_id` |

## `finance.accounts` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_finance_accounts_created_by_users` |
| `deleted_by` | `identity.users` | `fk_finance_accounts_deleted_by_users` |
| `parent_account_id` | `finance.accounts` | `fk_finance_accounts_parent_account_id_accounts` |
| `parent_account_id_internal_id` | `finance.accounts` | `fk_finance_accounts_parent_account_id_accounts_numeric` |
| `updated_by` | `identity.users` | `fk_finance_accounts_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_finance_accounts_numeric_pair_parent_account_id` | CHECK | `CHECK ((parent_account_id IS NULL) = (parent_account_id_internal_id IS NULL))` |
| `ck_finance_accounts_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_finance_accounts_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(account_code::text)) > 0 AND account_code::text = btrim(account_code::text))` |
| `fk_finance_accounts_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_finance_accounts_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_finance_accounts_parent_account_id_accounts` | FOREIGN KEY | `FOREIGN KEY (parent_account_id) REFERENCES finance.accounts(id) ON DELETE SET NULL` |
| `fk_finance_accounts_parent_account_id_accounts_numeric` | FOREIGN KEY | `FOREIGN KEY (parent_account_id_internal_id) REFERENCES finance.accounts(internal_id) ON DELETE SET NULL` |
| `fk_finance_accounts_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_finance_accounts` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_finance_accounts_id` | UNIQUE | `UNIQUE (id)` |
| `accounts_account_code_not_null` | NOT NULL | `NOT NULL account_code` |
| `accounts_account_type_not_null` | NOT NULL | `NOT NULL account_type` |
| `accounts_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `accounts_id_not_null` | NOT NULL | `NOT NULL id` |
| `accounts_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `accounts_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `accounts_name_not_null` | NOT NULL | `NOT NULL name` |
| `accounts_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `accounts_status_not_null` | NOT NULL | `NOT NULL status` |
| `accounts_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_finance_accounts_parent` | btree | `(parent_account_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_finance_accounts_parent ON finance.accounts USING btree (parent_account_id)` |
| `pk_finance_accounts` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_finance_accounts ON finance.accounts USING btree (internal_id)` |
| `uq_finance_accounts_code_active` | btree | `(account_code)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_finance_accounts_code_active ON finance.accounts USING btree (account_code) WHERE is_deleted = false` |
| `uq_finance_accounts_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_finance_accounts_id ON finance.accounts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON finance.accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["parent_account_id","parent_account_id_internal_id","finance","accounts"]]', 'internal_id', 'id')` | O |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON finance.accounts FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('account_code', '[]')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON finance.accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON finance.accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["parent_account_id","parent_account_id_internal_id","finance","accounts"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `finance.accounts` |
| Category | Master / Reference — Chart-of-accounts identities used by journal lines |
| Proposed owner / maintenance role | Finance_Payments / Finance accounting owner |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `finance.accounts`, `finance.journal_lines` |
| Features | Outside the 110-feature launch API scope; table existence does not approve a new feature. |
| API consumers | No inventoried API. Future-scope onboarding/maintenance requires separate approved requirements. |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Finance/CA must provide the chart of accounts, account_code/account_type/currency and hierarchy. No accounting codes or financial classifications are fabricated. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `account_code`, `account_type`, `name`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Finance accounting owner through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use approved inactive/closed status from the table CHECK/owner policy; do not invent unsupported status values. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_finance_accounts_code_active ON finance.accounts USING btree (account_code) WHERE is_deleted = false; CREATE UNIQUE INDEX uq_finance_accounts_id ON finance.accounts USING btree (id) |
| Foreign-key dependencies | `finance.accounts` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-008/D-012 financial/legal evidence. |
