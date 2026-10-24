# `finance.settlement_runs`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds settlement runs records within the finance domain (invoicing, ledgers and settlement). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | finance.settlement_runs |
| Classification | Transactional |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 20 columns; 11 PK/FK/UQ/CHECK/exclusion constraints; 17 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `adjustments` | `numeric(18,2)` | No | `0` | Inferred: stores adjustments for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `commission_amount` | `numeric(18,2)` | No | `0` | Value of commission amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_finance_settlement_runs_created_by_users` |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | Collation: default |
| `gross_amount` | `numeric(18,2)` | No | — | Value of gross amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `net_amount` | `numeric(18,2)` | No | — | Value of net amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `paid_at` | `timestamp with time zone` | Yes | — | Time of paid | Support chronology, deadlines or audit evidence | Exact constraints below |
| `period_end` | `date` | No | — | Inferred: stores period end for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `period_start` | `date` | No | — | Inferred: stores period start for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `run_number` | `character varying(64)` | No | — | Inferred: stores run number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `seller_id` | `uuid` | No | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` via `fk_finance_settlement_runs_seller_id_sellers` |
| `seller_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` via `fk_finance_settlement_runs_seller_id_sellers_numeric` |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `tax_withheld` | `numeric(18,2)` | No | `0` | Inferred: stores tax withheld for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_finance_settlement_runs_updated_by_users` |

## Record lifecycle and users

- **Created:** when the settlement runs business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `finance.settlement_runs` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_finance_settlement_runs_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_finance_settlement_runs_seller_id_sellers | `seller_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE RESTRICT` |
| fk_finance_settlement_runs_seller_id_sellers_numeric | `seller_id_internal_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE RESTRICT` |
| fk_finance_settlement_runs_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`finance.settlement_items`](../../Tables/finance/settlement_items.md) | fk_finance_settlement_items_settlement_run_id_settlemen_37f2 | `settlement_run_id_internal_id` | `internal_id` |
| [`finance.settlement_items`](../../Tables/finance/settlement_items.md) | fk_finance_settlement_items_settlement_run_id_settlement_runs | `settlement_run_id` | `id` |

## `finance.settlement_runs` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_finance_settlement_runs_created_by_users` |
| `seller_id` | `marketplace.sellers` | `fk_finance_settlement_runs_seller_id_sellers` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_finance_settlement_runs_seller_id_sellers_numeric` |
| `updated_by` | `identity.users` | `fk_finance_settlement_runs_updated_by_users` |

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
| `settlement_runs_adjustments_not_null` | NOT NULL | `NOT NULL adjustments` |
| `settlement_runs_commission_amount_not_null` | NOT NULL | `NOT NULL commission_amount` |
| `settlement_runs_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `settlement_runs_currency_not_null` | NOT NULL | `NOT NULL currency` |
| `settlement_runs_gross_amount_not_null` | NOT NULL | `NOT NULL gross_amount` |
| `settlement_runs_id_not_null` | NOT NULL | `NOT NULL id` |
| `settlement_runs_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `settlement_runs_net_amount_not_null` | NOT NULL | `NOT NULL net_amount` |
| `settlement_runs_period_end_not_null` | NOT NULL | `NOT NULL period_end` |
| `settlement_runs_period_start_not_null` | NOT NULL | `NOT NULL period_start` |
| `settlement_runs_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `settlement_runs_run_number_not_null` | NOT NULL | `NOT NULL run_number` |
| `settlement_runs_seller_id_internal_id_not_null` | NOT NULL | `NOT NULL seller_id_internal_id` |
| `settlement_runs_seller_id_not_null` | NOT NULL | `NOT NULL seller_id` |
| `settlement_runs_status_not_null` | NOT NULL | `NOT NULL status` |
| `settlement_runs_tax_withheld_not_null` | NOT NULL | `NOT NULL tax_withheld` |
| `settlement_runs_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_finance_settlement_runs_seller` | btree | `(seller_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_finance_settlement_runs_seller ON finance.settlement_runs USING btree (seller_id)` |
| `ix_finance_settlement_runs_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_finance_settlement_runs_status ON finance.settlement_runs USING btree (status)` |
| `pk_finance_settlement_runs` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_finance_settlement_runs ON finance.settlement_runs USING btree (internal_id)` |
| `settlement_run_number` | btree | `(run_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX settlement_run_number ON finance.settlement_runs USING btree (run_number)` |
| `uq_finance_settlement_runs_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_finance_settlement_runs_id ON finance.settlement_runs USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON finance.settlement_runs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON finance.settlement_runs FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON finance.settlement_runs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
