# `finance.journal_lines`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds journal lines records within the finance domain (invoicing, ledgers and settlement). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 10 columns, 11 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `account_id` | `uuid` | No | — | Reference linking this record to accounts | Ensures related business data can be joined and validated | FK → `finance.accounts` (fk_finance_journal_lines_account_id_accounts) |
| `account_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `finance.accounts` (fk_finance_journal_lines_account_id_accounts_numeric); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `credit` | `numeric(18,2)` | No | `0` | Inferred: stores credit for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `debit` | `numeric(18,2)` | No | `0` | Inferred: stores debit for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `dimensions` | `jsonb` | No | `'{}'::jsonb` | Structured dimensions information | Retain a versioned payload or relevant details | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `journal_entry_id` | `uuid` | No | — | Reference linking this record to journal entries | Ensures related business data can be joined and validated | FK → `finance.journal_entries` (fk_finance_journal_lines_journal_entry_id_journal_entries) |
| `journal_entry_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `finance.journal_entries` (fk_finance_journal_lines_journal_entry_id_journal_entri_eae6); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the journal lines business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `finance.journal_lines` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `account_id` → `finance.accounts(id)` via `fk_finance_journal_lines_account_id_accounts`; `FOREIGN KEY (account_id) REFERENCES finance.accounts(id) ON DELETE RESTRICT`
- `journal_entry_id` → `finance.journal_entries(id)` via `fk_finance_journal_lines_journal_entry_id_journal_entries`; `FOREIGN KEY (journal_entry_id) REFERENCES finance.journal_entries(id) ON DELETE CASCADE`
- `account_id_internal_id` → `finance.accounts(internal_id)` via `fk_finance_journal_lines_account_id_accounts_numeric`; `FOREIGN KEY (account_id_internal_id) REFERENCES finance.accounts(internal_id) ON DELETE RESTRICT`
- `journal_entry_id_internal_id` → `finance.journal_entries(internal_id)` via `fk_finance_journal_lines_journal_entry_id_journal_entri_eae6`; `FOREIGN KEY (journal_entry_id_internal_id) REFERENCES finance.journal_entries(internal_id) ON DELETE CASCADE`

## `finance.journal_lines` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 10 columns, 11 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `account_id` | `finance.accounts` | `fk_finance_journal_lines_account_id_accounts` |
| `journal_entry_id` | `finance.journal_entries` | `fk_finance_journal_lines_journal_entry_id_journal_entries` |
| `account_id_internal_id` | `finance.accounts` | `fk_finance_journal_lines_account_id_accounts_numeric` |
| `journal_entry_id_internal_id` | `finance.journal_entries` | `fk_finance_journal_lines_journal_entry_id_journal_entri_eae6` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_finance_journal_lines_account` | `CREATE INDEX ix_finance_journal_lines_account ON finance.journal_lines USING btree (account_id)` |
| `ix_finance_journal_lines_entry` | `CREATE INDEX ix_finance_journal_lines_entry ON finance.journal_lines USING btree (journal_entry_id)` |
| `pk_finance_journal_lines` | `CREATE UNIQUE INDEX pk_finance_journal_lines ON finance.journal_lines USING btree (internal_id)` |
| `uq_finance_journal_lines_id` | `CREATE UNIQUE INDEX uq_finance_journal_lines_id ON finance.journal_lines USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON finance.journal_lines FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["account_id","account_id_internal_id","finance","accounts"],["journal_entry_id","journal_entry_id_internal_id","finance","journal_entries"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON finance.journal_lines FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON finance.journal_lines FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["account_id","account_id_internal_id","finance","accounts"],["journal_entry_id","journal_entry_id_internal_id","finance","journal_entries"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
