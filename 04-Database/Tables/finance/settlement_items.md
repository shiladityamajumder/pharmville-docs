# finance.settlement_items

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds settlement items records within the finance domain (invoicing, ledgers and settlement). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 13 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `adjustment_amount` | `numeric(18,2)` | No | `0` | Value of adjustment amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `commission_amount` | `numeric(18,2)` | No | `0` | Value of commission amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `gross_amount` | `numeric(18,2)` | No | — | Value of gross amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `net_amount` | `numeric(18,2)` | No | — | Value of net amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `order_group_id` | `uuid` | Yes | — | Reference linking this record to order groups | Ensures related business data can be joined and validated | FK → `commerce.order_groups` (fk_finance_settlement_items_order_group_id_order_groups) |
| `order_group_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_groups` (fk_finance_settlement_items_order_group_id_order_groups_numeric); Numeric/public-key pair verification required |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` (fk_finance_settlement_items_order_id_orders) |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` (fk_finance_settlement_items_order_id_orders_numeric); Numeric/public-key pair verification required |
| `settlement_run_id` | `uuid` | No | — | Reference linking this record to settlement runs | Ensures related business data can be joined and validated | FK → `finance.settlement_runs` (fk_finance_settlement_items_settlement_run_id_settlement_runs) |
| `settlement_run_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `finance.settlement_runs` (fk_finance_settlement_items_settlement_run_id_settlemen_37f2); Numeric/public-key pair verification required |
| `tax_amount` | `numeric(18,2)` | No | `0` | Value of tax amount | Enable pricing, reconciliation or reporting | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the settlement items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `finance.settlement_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `settlement_run_id` → `finance.settlement_runs(id)` via `fk_finance_settlement_items_settlement_run_id_settlement_runs`; FOREIGN KEY (settlement_run_id) REFERENCES finance.settlement_runs(id) ON DELETE CASCADE
- `order_group_id` → `commerce.order_groups(id)` via `fk_finance_settlement_items_order_group_id_order_groups`; FOREIGN KEY (order_group_id) REFERENCES commerce.order_groups(id) ON DELETE SET NULL
- `order_id` → `commerce.orders(id)` via `fk_finance_settlement_items_order_id_orders`; FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT
- `order_group_id_internal_id` → `commerce.order_groups(internal_id)` via `fk_finance_settlement_items_order_group_id_order_groups_numeric`; FOREIGN KEY (order_group_id_internal_id) REFERENCES commerce.order_groups(internal_id) ON DELETE SET NULL
- `order_id_internal_id` → `commerce.orders(internal_id)` via `fk_finance_settlement_items_order_id_orders_numeric`; FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT
- `settlement_run_id_internal_id` → `finance.settlement_runs(internal_id)` via `fk_finance_settlement_items_settlement_run_id_settlemen_37f2`; FOREIGN KEY (settlement_run_id_internal_id) REFERENCES finance.settlement_runs(internal_id) ON DELETE CASCADE

## finance.settlement_items — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 14 columns, 13 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `settlement_run_id` | `finance.settlement_runs` | `fk_finance_settlement_items_settlement_run_id_settlement_runs` |
| `order_group_id` | `commerce.order_groups` | `fk_finance_settlement_items_order_group_id_order_groups` |
| `order_id` | `commerce.orders` | `fk_finance_settlement_items_order_id_orders` |
| `order_group_id_internal_id` | `commerce.order_groups` | `fk_finance_settlement_items_order_group_id_order_groups_numeric` |
| `order_id_internal_id` | `commerce.orders` | `fk_finance_settlement_items_order_id_orders_numeric` |
| `settlement_run_id_internal_id` | `finance.settlement_runs` | `fk_finance_settlement_items_settlement_run_id_settlemen_37f2` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_finance_settlement_items_amounts_nonnegative` | CHECK | `CHECK (gross_amount >= 0::numeric AND net_amount >= 0::numeric)` |
| `ck_finance_settlement_items_finite_numeric_values` | CHECK | `CHECK ((gross_amount IS NULL OR (gross_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (commission_amount IS NULL OR (commission_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (tax_amount IS NULL OR (tax_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (adjustment_amount IS NULL OR (adjustment_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (net_amount IS NULL OR (net_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_finance_settlement_items_numeric_pair_order_group_id` | CHECK | `CHECK ((order_group_id IS NULL) = (order_group_id_internal_id IS NULL))` |
| `ck_finance_settlement_items_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_finance_settlement_items_numeric_pair_settlement_run_id` | CHECK | `CHECK ((settlement_run_id IS NULL) = (settlement_run_id_internal_id IS NULL))` |
| `fk_finance_settlement_items_order_group_id_order_groups` | FOREIGN KEY | `FOREIGN KEY (order_group_id) REFERENCES commerce.order_groups(id) ON DELETE SET NULL` |
| `fk_finance_settlement_items_order_group_id_order_groups_numeric` | FOREIGN KEY | `FOREIGN KEY (order_group_id_internal_id) REFERENCES commerce.order_groups(internal_id) ON DELETE SET NULL` |
| `fk_finance_settlement_items_order_id_orders` | FOREIGN KEY | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| `fk_finance_settlement_items_order_id_orders_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| `fk_finance_settlement_items_settlement_run_id_settlemen_37f2` | FOREIGN KEY | `FOREIGN KEY (settlement_run_id_internal_id) REFERENCES finance.settlement_runs(internal_id) ON DELETE CASCADE` |
| `fk_finance_settlement_items_settlement_run_id_settlement_runs` | FOREIGN KEY | `FOREIGN KEY (settlement_run_id) REFERENCES finance.settlement_runs(id) ON DELETE CASCADE` |
| `pk_finance_settlement_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_finance_settlement_items_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_finance_settlement_items_order` | `CREATE INDEX ix_finance_settlement_items_order ON finance.settlement_items USING btree (order_id)` |
| `ix_finance_settlement_items_run` | `CREATE INDEX ix_finance_settlement_items_run ON finance.settlement_items USING btree (settlement_run_id)` |
| `pk_finance_settlement_items` | `CREATE UNIQUE INDEX pk_finance_settlement_items ON finance.settlement_items USING btree (internal_id)` |
| `uq_finance_settlement_items_id` | `CREATE UNIQUE INDEX uq_finance_settlement_items_id ON finance.settlement_items USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON finance.settlement_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_group_id","order_group_id_internal_id","commerce","order_groups"],["order_id","order_id_internal_id","commerce","orders"],["settlement_run_id","settlement_run_id_internal_id","finance","settlement_runs"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON finance.settlement_items FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON finance.settlement_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_group_id","order_group_id_internal_id","commerce","order_groups"],["order_id","order_id_internal_id","commerce","orders"],["settlement_run_id","settlement_run_id_internal_id","finance","settlement_runs"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
