# `finance.settlement_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds settlement items records within the finance domain (invoicing, ledgers and settlement). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | finance.settlement_items |
| Classification | Transactional |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 13 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `adjustment_amount` | `numeric(18,2)` | No | `0` | Value of adjustment amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `commission_amount` | `numeric(18,2)` | No | `0` | Value of commission amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `gross_amount` | `numeric(18,2)` | No | — | Value of gross amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `net_amount` | `numeric(18,2)` | No | — | Value of net amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `order_group_id` | `uuid` | Yes | — | Reference linking this record to order groups | Ensures related business data can be joined and validated | FK → `commerce.order_groups` via `fk_finance_settlement_items_order_group_id_order_groups` |
| `order_group_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_groups` via `fk_finance_settlement_items_order_group_id_order_groups_numeric` |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` via `fk_finance_settlement_items_order_id_orders` |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` via `fk_finance_settlement_items_order_id_orders_numeric` |
| `settlement_run_id` | `uuid` | No | — | Reference linking this record to settlement runs | Ensures related business data can be joined and validated | FK → `finance.settlement_runs` via `fk_finance_settlement_items_settlement_run_id_settlement_runs` |
| `settlement_run_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `finance.settlement_runs` via `fk_finance_settlement_items_settlement_run_id_settlemen_37f2` |
| `tax_amount` | `numeric(18,2)` | No | `0` | Value of tax amount | Enable pricing, reconciliation or reporting | Exact constraints below |

## Record lifecycle and users

- **Created:** when the settlement items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `finance.settlement_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_finance_settlement_items_order_group_id_order_groups | `order_group_id` | [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | `FOREIGN KEY (order_group_id) REFERENCES commerce.order_groups(id) ON DELETE SET NULL` |
| fk_finance_settlement_items_order_group_id_order_groups_numeric | `order_group_id_internal_id` | [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | `FOREIGN KEY (order_group_id_internal_id) REFERENCES commerce.order_groups(internal_id) ON DELETE SET NULL` |
| fk_finance_settlement_items_order_id_orders | `order_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| fk_finance_settlement_items_order_id_orders_numeric | `order_id_internal_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| fk_finance_settlement_items_settlement_run_id_settlemen_37f2 | `settlement_run_id_internal_id` | [`finance.settlement_runs`](../../Tables/finance/settlement_runs.md) | `FOREIGN KEY (settlement_run_id_internal_id) REFERENCES finance.settlement_runs(internal_id) ON DELETE CASCADE` |
| fk_finance_settlement_items_settlement_run_id_settlement_runs | `settlement_run_id` | [`finance.settlement_runs`](../../Tables/finance/settlement_runs.md) | `FOREIGN KEY (settlement_run_id) REFERENCES finance.settlement_runs(id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `finance.settlement_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `order_group_id` | `commerce.order_groups` | `fk_finance_settlement_items_order_group_id_order_groups` |
| `order_group_id_internal_id` | `commerce.order_groups` | `fk_finance_settlement_items_order_group_id_order_groups_numeric` |
| `order_id` | `commerce.orders` | `fk_finance_settlement_items_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_finance_settlement_items_order_id_orders_numeric` |
| `settlement_run_id_internal_id` | `finance.settlement_runs` | `fk_finance_settlement_items_settlement_run_id_settlemen_37f2` |
| `settlement_run_id` | `finance.settlement_runs` | `fk_finance_settlement_items_settlement_run_id_settlement_runs` |

### Existing constraints

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
| `settlement_items_adjustment_amount_not_null` | NOT NULL | `NOT NULL adjustment_amount` |
| `settlement_items_commission_amount_not_null` | NOT NULL | `NOT NULL commission_amount` |
| `settlement_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `settlement_items_gross_amount_not_null` | NOT NULL | `NOT NULL gross_amount` |
| `settlement_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `settlement_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `settlement_items_net_amount_not_null` | NOT NULL | `NOT NULL net_amount` |
| `settlement_items_order_id_internal_id_not_null` | NOT NULL | `NOT NULL order_id_internal_id` |
| `settlement_items_order_id_not_null` | NOT NULL | `NOT NULL order_id` |
| `settlement_items_settlement_run_id_internal_id_not_null` | NOT NULL | `NOT NULL settlement_run_id_internal_id` |
| `settlement_items_settlement_run_id_not_null` | NOT NULL | `NOT NULL settlement_run_id` |
| `settlement_items_tax_amount_not_null` | NOT NULL | `NOT NULL tax_amount` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_finance_settlement_items_order` | btree | `(order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_finance_settlement_items_order ON finance.settlement_items USING btree (order_id)` |
| `ix_finance_settlement_items_run` | btree | `(settlement_run_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_finance_settlement_items_run ON finance.settlement_items USING btree (settlement_run_id)` |
| `pk_finance_settlement_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_finance_settlement_items ON finance.settlement_items USING btree (internal_id)` |
| `uq_finance_settlement_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_finance_settlement_items_id ON finance.settlement_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON finance.settlement_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_group_id","order_group_id_internal_id","commerce","order_groups"],["order_id","order_id_internal_id","commerce","orders"],["settlement_run_id","settlement_run_id_internal_id","finance","settlement_runs"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON finance.settlement_items FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON finance.settlement_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_group_id","order_group_id_internal_id","commerce","order_groups"],["order_id","order_id_internal_id","commerce","orders"],["settlement_run_id","settlement_run_id_internal_id","finance","settlement_runs"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
