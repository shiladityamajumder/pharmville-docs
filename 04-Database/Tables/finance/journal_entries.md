# `finance.journal_entries`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds journal entries records within the finance domain (invoicing, ledgers and settlement). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | finance.journal_entries |
| Classification | Transactional |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 16 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_finance_journal_entries_created_by_users` |
| `description` | `text` | Yes | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `entry_date` | `date` | No | — | Inferred: stores entry date for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `entry_number` | `character varying(64)` | No | — | Inferred: stores entry number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `posted_at` | `timestamp with time zone` | Yes | — | Time of posted | Support chronology, deadlines or audit evidence | Exact constraints below |
| `reference_id` | `uuid` | No | — | Identifier associated with reference | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `reference_type` | `character varying(64)` | No | — | Inferred: stores reference type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `reversed_entry_id` | `uuid` | Yes | — | Reference linking this record to journal entries | Ensures related business data can be joined and validated | FK → `finance.journal_entries` via `fk_finance_journal_entries_reversed_entry_id_journal_entries` |
| `reversed_entry_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `finance.journal_entries` via `fk_finance_journal_entries_reversed_entry_id_journal_en_410f` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_finance_journal_entries_updated_by_users` |

## Record lifecycle and users

- **Created:** when the journal entries business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `finance.journal_entries` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_finance_journal_entries_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_finance_journal_entries_reversed_entry_id_journal_en_410f | `reversed_entry_id_internal_id` | [`finance.journal_entries`](../../Tables/finance/journal_entries.md) | `FOREIGN KEY (reversed_entry_id_internal_id) REFERENCES finance.journal_entries(internal_id) ON DELETE SET NULL` |
| fk_finance_journal_entries_reversed_entry_id_journal_entries | `reversed_entry_id` | [`finance.journal_entries`](../../Tables/finance/journal_entries.md) | `FOREIGN KEY (reversed_entry_id) REFERENCES finance.journal_entries(id) ON DELETE SET NULL` |
| fk_finance_journal_entries_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`finance.journal_entries`](../../Tables/finance/journal_entries.md) | fk_finance_journal_entries_reversed_entry_id_journal_en_410f | `reversed_entry_id_internal_id` | `internal_id` |
| [`finance.journal_entries`](../../Tables/finance/journal_entries.md) | fk_finance_journal_entries_reversed_entry_id_journal_entries | `reversed_entry_id` | `id` |
| [`finance.journal_lines`](../../Tables/finance/journal_lines.md) | fk_finance_journal_lines_journal_entry_id_journal_entri_eae6 | `journal_entry_id_internal_id` | `internal_id` |
| [`finance.journal_lines`](../../Tables/finance/journal_lines.md) | fk_finance_journal_lines_journal_entry_id_journal_entries | `journal_entry_id` | `id` |

## `finance.journal_entries` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_finance_journal_entries_created_by_users` |
| `reversed_entry_id_internal_id` | `finance.journal_entries` | `fk_finance_journal_entries_reversed_entry_id_journal_en_410f` |
| `reversed_entry_id` | `finance.journal_entries` | `fk_finance_journal_entries_reversed_entry_id_journal_entries` |
| `updated_by` | `identity.users` | `fk_finance_journal_entries_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_finance_journal_entries_numeric_pair_reversed_entry_id` | CHECK | `CHECK ((reversed_entry_id IS NULL) = (reversed_entry_id_internal_id IS NULL))` |
| `ck_finance_journal_entries_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_finance_journal_entries_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_finance_journal_entries_reversed_entry_id_journal_en_410f` | FOREIGN KEY | `FOREIGN KEY (reversed_entry_id_internal_id) REFERENCES finance.journal_entries(internal_id) ON DELETE SET NULL` |
| `fk_finance_journal_entries_reversed_entry_id_journal_entries` | FOREIGN KEY | `FOREIGN KEY (reversed_entry_id) REFERENCES finance.journal_entries(id) ON DELETE SET NULL` |
| `fk_finance_journal_entries_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `journal_entry_number` | UNIQUE | `UNIQUE (entry_number)` |
| `pk_finance_journal_entries` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_finance_journal_entries_id` | UNIQUE | `UNIQUE (id)` |
| `journal_entries_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `journal_entries_entry_date_not_null` | NOT NULL | `NOT NULL entry_date` |
| `journal_entries_entry_number_not_null` | NOT NULL | `NOT NULL entry_number` |
| `journal_entries_id_not_null` | NOT NULL | `NOT NULL id` |
| `journal_entries_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `journal_entries_reference_id_not_null` | NOT NULL | `NOT NULL reference_id` |
| `journal_entries_reference_type_not_null` | NOT NULL | `NOT NULL reference_type` |
| `journal_entries_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `journal_entries_status_not_null` | NOT NULL | `NOT NULL status` |
| `journal_entries_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_finance_journal_entries_reference` | btree | `(reference_type, reference_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_finance_journal_entries_reference ON finance.journal_entries USING btree (reference_type, reference_id)` |
| `ix_finance_journal_entries_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_finance_journal_entries_status ON finance.journal_entries USING btree (status)` |
| `journal_entry_number` | btree | `(entry_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX journal_entry_number ON finance.journal_entries USING btree (entry_number)` |
| `pk_finance_journal_entries` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_finance_journal_entries ON finance.journal_entries USING btree (internal_id)` |
| `uq_finance_journal_entries_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_finance_journal_entries_id ON finance.journal_entries USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON finance.journal_entries FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["reversed_entry_id","reversed_entry_id_internal_id","finance","journal_entries"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON finance.journal_entries FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON finance.journal_entries FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["reversed_entry_id","reversed_entry_id_internal_id","finance","journal_entries"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
