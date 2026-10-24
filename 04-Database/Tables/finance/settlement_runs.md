# `finance.settlement_runs`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds settlement runs records within the finance domain (invoicing, ledgers and settlement). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 20 columns, 11 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `adjustments` | `numeric(18,2)` | No | `0` | Inferred: stores adjustments for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `commission_amount` | `numeric(18,2)` | No | `0` | Value of commission amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_finance_settlement_runs_created_by_users) |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | See exact constraints |
| `gross_amount` | `numeric(18,2)` | No | — | Value of gross amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `net_amount` | `numeric(18,2)` | No | — | Value of net amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `paid_at` | `timestamp with time zone` | Yes | — | Time of paid | Support chronology, deadlines or audit evidence | See exact constraints |
| `period_end` | `date` | No | — | Inferred: stores period end for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `period_start` | `date` | No | — | Inferred: stores period start for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `run_number` | `character varying(64)` | No | — | Inferred: stores run number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `seller_id` | `uuid` | No | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` (fk_finance_settlement_runs_seller_id_sellers) |
| `seller_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` (fk_finance_settlement_runs_seller_id_sellers_numeric); Numeric/public-key pair verification required |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `tax_withheld` | `numeric(18,2)` | No | `0` | Inferred: stores tax withheld for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_finance_settlement_runs_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the settlement runs business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `finance.settlement_runs` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_finance_settlement_runs_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_finance_settlement_runs_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `seller_id` → `marketplace.sellers(id)` via `fk_finance_settlement_runs_seller_id_sellers`; `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE RESTRICT`
- `seller_id_internal_id` → `marketplace.sellers(internal_id)` via `fk_finance_settlement_runs_seller_id_sellers_numeric`; `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE RESTRICT`

**Referenced by 2 FK constraints** (sample): `finance.settlement_items`, `finance.settlement_items`.

## `finance.settlement_runs` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 20 columns, 11 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_finance_settlement_runs_created_by_users` |
| `updated_by` | `identity.users` | `fk_finance_settlement_runs_updated_by_users` |
| `seller_id` | `marketplace.sellers` | `fk_finance_settlement_runs_seller_id_sellers` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_finance_settlement_runs_seller_id_sellers_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_finance_settlement_runs_finite_numeric_values` | CHECK | `CHECK ((gross_amount IS NULL OR (gross_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (commission_amount IS NULL OR (commission_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (tax_withheld IS NULL OR (tax_withheld <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (adjustments IS NULL OR (adjustments <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (net_amount IS NULL OR (net_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_finance_settlement_runs_numeric_pair_seller_id` | CHECK | `CHECK ((seller_id IS NULL) = (seller_id_internal_id IS NULL))` |
| `ck_finance_settlement_runs_period_window` | CHECK | `CHECK (period_end >= period_start)` |
| `ck_finance_settlement_runs_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_finance_settlement_runs_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_finance_settlement_runs_seller_id_sellers` | FOREIGN KEY | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE RESTRICT` |
| `fk_finance_settlement_runs_seller_id_sellers_numeric` | FOREIGN KEY | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE RESTRICT` |
| `fk_finance_settlement_runs_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_finance_settlement_runs` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `settlement_run_number` | UNIQUE | `UNIQUE (run_number)` |
| `uq_finance_settlement_runs_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_finance_settlement_runs_seller` | `CREATE INDEX ix_finance_settlement_runs_seller ON finance.settlement_runs USING btree (seller_id)` |
| `ix_finance_settlement_runs_status` | `CREATE INDEX ix_finance_settlement_runs_status ON finance.settlement_runs USING btree (status)` |
| `pk_finance_settlement_runs` | `CREATE UNIQUE INDEX pk_finance_settlement_runs ON finance.settlement_runs USING btree (internal_id)` |
| `settlement_run_number` | `CREATE UNIQUE INDEX settlement_run_number ON finance.settlement_runs USING btree (run_number)` |
| `uq_finance_settlement_runs_id` | `CREATE UNIQUE INDEX uq_finance_settlement_runs_id ON finance.settlement_runs USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON finance.settlement_runs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON finance.settlement_runs FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON finance.settlement_runs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
