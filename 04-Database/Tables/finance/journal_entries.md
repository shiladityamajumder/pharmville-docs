# finance.journal_entries

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds journal entries records within the finance domain (invoicing, ledgers and settlement). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 16 columns, 9 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_finance_journal_entries_created_by_users) |
| `description` | `text` | Yes | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `entry_date` | `date` | No | — | Inferred: stores entry date for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `entry_number` | `character varying(64)` | No | — | Inferred: stores entry number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `posted_at` | `timestamp with time zone` | Yes | — | Time of posted | Support chronology, deadlines or audit evidence | See exact constraints |
| `reference_id` | `uuid` | No | — | Identifier associated with reference | Link the event or entity to its subject; verify constraints | See exact constraints |
| `reference_type` | `character varying(64)` | No | — | Inferred: stores reference type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `reversed_entry_id` | `uuid` | Yes | — | Reference linking this record to journal entries | Ensures related business data can be joined and validated | FK → `finance.journal_entries` (fk_finance_journal_entries_reversed_entry_id_journal_entries) |
| `reversed_entry_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `finance.journal_entries` (fk_finance_journal_entries_reversed_entry_id_journal_en_410f); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_finance_journal_entries_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the journal entries business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `finance.journal_entries` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_finance_journal_entries_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_finance_journal_entries_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `reversed_entry_id` → `finance.journal_entries(id)` via `fk_finance_journal_entries_reversed_entry_id_journal_entries`; FOREIGN KEY (reversed_entry_id) REFERENCES finance.journal_entries(id) ON DELETE SET NULL
- `reversed_entry_id_internal_id` → `finance.journal_entries(internal_id)` via `fk_finance_journal_entries_reversed_entry_id_journal_en_410f`; FOREIGN KEY (reversed_entry_id_internal_id) REFERENCES finance.journal_entries(internal_id) ON DELETE SET NULL

**Referenced by 4 FK constraints** (sample): `finance.journal_entries`, `finance.journal_lines`, `finance.journal_entries`, `finance.journal_lines`.

## finance.journal_entries — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 16 columns, 9 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_finance_journal_entries_created_by_users` |
| `updated_by` | `identity.users` | `fk_finance_journal_entries_updated_by_users` |
| `reversed_entry_id` | `finance.journal_entries` | `fk_finance_journal_entries_reversed_entry_id_journal_entries` |
| `reversed_entry_id_internal_id` | `finance.journal_entries` | `fk_finance_journal_entries_reversed_entry_id_journal_en_410f` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_finance_journal_entries_reference` | `CREATE INDEX ix_finance_journal_entries_reference ON finance.journal_entries USING btree (reference_type, reference_id)` |
| `ix_finance_journal_entries_status` | `CREATE INDEX ix_finance_journal_entries_status ON finance.journal_entries USING btree (status)` |
| `journal_entry_number` | `CREATE UNIQUE INDEX journal_entry_number ON finance.journal_entries USING btree (entry_number)` |
| `pk_finance_journal_entries` | `CREATE UNIQUE INDEX pk_finance_journal_entries ON finance.journal_entries USING btree (internal_id)` |
| `uq_finance_journal_entries_id` | `CREATE UNIQUE INDEX uq_finance_journal_entries_id ON finance.journal_entries USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON finance.journal_entries FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["reversed_entry_id","reversed_entry_id_internal_id","finance","journal_entries"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON finance.journal_entries FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON finance.journal_entries FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["reversed_entry_id","reversed_entry_id_internal_id","finance","journal_entries"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
