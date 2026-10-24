# `finance.journal_lines`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds journal lines records within the finance domain (invoicing, ledgers and settlement). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | finance.journal_lines |
| Classification | Transactional |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 10 columns; 11 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `account_id` | `uuid` | No | — | Reference linking this record to accounts | Ensures related business data can be joined and validated | FK → `finance.accounts` via `fk_finance_journal_lines_account_id_accounts` |
| `account_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `finance.accounts` via `fk_finance_journal_lines_account_id_accounts_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `credit` | `numeric(18,2)` | No | `0` | Inferred: stores credit for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `debit` | `numeric(18,2)` | No | `0` | Inferred: stores debit for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `dimensions` | `jsonb` | No | `'{}'::jsonb` | Structured dimensions information | Retain a versioned payload or relevant details | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `journal_entry_id` | `uuid` | No | — | Reference linking this record to journal entries | Ensures related business data can be joined and validated | FK → `finance.journal_entries` via `fk_finance_journal_lines_journal_entry_id_journal_entries` |
| `journal_entry_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `finance.journal_entries` via `fk_finance_journal_lines_journal_entry_id_journal_entri_eae6` |

## Record lifecycle and users

- **Created:** when the journal lines business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `finance.journal_lines` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_finance_journal_lines_account_id_accounts | `account_id` | [`finance.accounts`](../../Tables/finance/accounts.md) | `FOREIGN KEY (account_id) REFERENCES finance.accounts(id) ON DELETE RESTRICT` |
| fk_finance_journal_lines_account_id_accounts_numeric | `account_id_internal_id` | [`finance.accounts`](../../Tables/finance/accounts.md) | `FOREIGN KEY (account_id_internal_id) REFERENCES finance.accounts(internal_id) ON DELETE RESTRICT` |
| fk_finance_journal_lines_journal_entry_id_journal_entri_eae6 | `journal_entry_id_internal_id` | [`finance.journal_entries`](../../Tables/finance/journal_entries.md) | `FOREIGN KEY (journal_entry_id_internal_id) REFERENCES finance.journal_entries(internal_id) ON DELETE CASCADE` |
| fk_finance_journal_lines_journal_entry_id_journal_entries | `journal_entry_id` | [`finance.journal_entries`](../../Tables/finance/journal_entries.md) | `FOREIGN KEY (journal_entry_id) REFERENCES finance.journal_entries(id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `finance.journal_lines` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `account_id` | `finance.accounts` | `fk_finance_journal_lines_account_id_accounts` |
| `account_id_internal_id` | `finance.accounts` | `fk_finance_journal_lines_account_id_accounts_numeric` |
| `journal_entry_id_internal_id` | `finance.journal_entries` | `fk_finance_journal_lines_journal_entry_id_journal_entri_eae6` |
| `journal_entry_id` | `finance.journal_entries` | `fk_finance_journal_lines_journal_entry_id_journal_entries` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_finance_journal_lines_amounts_nonnegative` | CHECK | `CHECK (debit >= 0::numeric AND credit >= 0::numeric)` |
| `ck_finance_journal_lines_finite_numeric_values` | CHECK | `CHECK ((debit IS NULL OR (debit <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (credit IS NULL OR (credit <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_finance_journal_lines_numeric_pair_account_id` | CHECK | `CHECK ((account_id IS NULL) = (account_id_internal_id IS NULL))` |
| `ck_finance_journal_lines_numeric_pair_journal_entry_id` | CHECK | `CHECK ((journal_entry_id IS NULL) = (journal_entry_id_internal_id IS NULL))` |
| `ck_finance_journal_lines_one_sided_line` | CHECK | `CHECK (debit > 0::numeric AND credit = 0::numeric OR credit > 0::numeric AND debit = 0::numeric)` |
| `fk_finance_journal_lines_account_id_accounts` | FOREIGN KEY | `FOREIGN KEY (account_id) REFERENCES finance.accounts(id) ON DELETE RESTRICT` |
| `fk_finance_journal_lines_account_id_accounts_numeric` | FOREIGN KEY | `FOREIGN KEY (account_id_internal_id) REFERENCES finance.accounts(internal_id) ON DELETE RESTRICT` |
| `fk_finance_journal_lines_journal_entry_id_journal_entri_eae6` | FOREIGN KEY | `FOREIGN KEY (journal_entry_id_internal_id) REFERENCES finance.journal_entries(internal_id) ON DELETE CASCADE` |
| `fk_finance_journal_lines_journal_entry_id_journal_entries` | FOREIGN KEY | `FOREIGN KEY (journal_entry_id) REFERENCES finance.journal_entries(id) ON DELETE CASCADE` |
| `pk_finance_journal_lines` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_finance_journal_lines_id` | UNIQUE | `UNIQUE (id)` |
| `journal_lines_account_id_internal_id_not_null` | NOT NULL | `NOT NULL account_id_internal_id` |
| `journal_lines_account_id_not_null` | NOT NULL | `NOT NULL account_id` |
| `journal_lines_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `journal_lines_credit_not_null` | NOT NULL | `NOT NULL credit` |
| `journal_lines_debit_not_null` | NOT NULL | `NOT NULL debit` |
| `journal_lines_dimensions_not_null` | NOT NULL | `NOT NULL dimensions` |
| `journal_lines_id_not_null` | NOT NULL | `NOT NULL id` |
| `journal_lines_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `journal_lines_journal_entry_id_internal_id_not_null` | NOT NULL | `NOT NULL journal_entry_id_internal_id` |
| `journal_lines_journal_entry_id_not_null` | NOT NULL | `NOT NULL journal_entry_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_finance_journal_lines_account` | btree | `(account_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_finance_journal_lines_account ON finance.journal_lines USING btree (account_id)` |
| `ix_finance_journal_lines_entry` | btree | `(journal_entry_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_finance_journal_lines_entry ON finance.journal_lines USING btree (journal_entry_id)` |
| `pk_finance_journal_lines` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_finance_journal_lines ON finance.journal_lines USING btree (internal_id)` |
| `uq_finance_journal_lines_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_finance_journal_lines_id ON finance.journal_lines USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON finance.journal_lines FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["account_id","account_id_internal_id","finance","accounts"],["journal_entry_id","journal_entry_id_internal_id","finance","journal_entries"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON finance.journal_lines FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON finance.journal_lines FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["account_id","account_id_internal_id","finance","accounts"],["journal_entry_id","journal_entry_id_internal_id","finance","journal_entries"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
