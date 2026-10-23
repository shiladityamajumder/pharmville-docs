# finance.accounts

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds accounts records within the finance domain (invoicing, ledgers and settlement). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 10 constraints, 4 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `account_code` | `character varying(64)` | No | — | Code for account | Link to controlled business classification or an external reference | See exact constraints |
| `account_type` | `character varying(32)` | No | — | Inferred: stores account type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_finance_accounts_created_by_users) |
| `currency` | `character varying(3)` | Yes | — | Monetary currency code | Avoid interpreting amounts without a denomination | See exact constraints |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_finance_accounts_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `parent_account_id` | `uuid` | Yes | — | Reference linking this record to accounts | Ensures related business data can be joined and validated | FK → `finance.accounts` (fk_finance_accounts_parent_account_id_accounts) |
| `parent_account_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `finance.accounts` (fk_finance_accounts_parent_account_id_accounts_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_finance_accounts_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the accounts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `finance.accounts` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_finance_accounts_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_finance_accounts_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_finance_accounts_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `parent_account_id` → `finance.accounts(id)` via `fk_finance_accounts_parent_account_id_accounts`; FOREIGN KEY (parent_account_id) REFERENCES finance.accounts(id) ON DELETE SET NULL
- `parent_account_id_internal_id` → `finance.accounts(internal_id)` via `fk_finance_accounts_parent_account_id_accounts_numeric`; FOREIGN KEY (parent_account_id_internal_id) REFERENCES finance.accounts(internal_id) ON DELETE SET NULL

**Referenced by 4 FK constraints** (sample): `finance.accounts`, `finance.journal_lines`, `finance.accounts`, `finance.journal_lines`.

## finance.accounts — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 17 columns, 10 constraints, 4 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_finance_accounts_created_by_users` |
| `deleted_by` | `identity.users` | `fk_finance_accounts_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_finance_accounts_updated_by_users` |
| `parent_account_id` | `finance.accounts` | `fk_finance_accounts_parent_account_id_accounts` |
| `parent_account_id_internal_id` | `finance.accounts` | `fk_finance_accounts_parent_account_id_accounts_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_finance_accounts_parent` | `CREATE INDEX ix_finance_accounts_parent ON finance.accounts USING btree (parent_account_id)` |
| `pk_finance_accounts` | `CREATE UNIQUE INDEX pk_finance_accounts ON finance.accounts USING btree (internal_id)` |
| `uq_finance_accounts_code_active` | `CREATE UNIQUE INDEX uq_finance_accounts_code_active ON finance.accounts USING btree (account_code) WHERE is_deleted = false` |
| `uq_finance_accounts_id` | `CREATE UNIQUE INDEX uq_finance_accounts_id ON finance.accounts USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON finance.accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["parent_account_id","parent_account_id_internal_id","finance","accounts"]]', 'internal_id', 'id')` |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON finance.accounts FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('account_code', '[]')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON finance.accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON finance.accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["parent_account_id","parent_account_id_internal_id","finance","accounts"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
