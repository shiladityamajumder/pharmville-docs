# `finance.invoice_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds invoice items records within the finance domain (invoicing, ledgers and settlement). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | finance.invoice_items |
| Classification | Transactional |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 20 columns; 14 PK/FK/UQ/CHECK/exclusion constraints; 15 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_finance_invoice_items_created_by_users` |
| `description` | `character varying(255)` | No | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `discount_amount` | `numeric(14,2)` | No | `0` | Value of discount amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `hsn_code` | `character varying(32)` | Yes | — | Code for hsn | Link to controlled business classification or an external reference | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `invoice_id` | `uuid` | No | — | Reference linking this record to invoices | Ensures related business data can be joined and validated | FK → `finance.invoices` via `fk_finance_invoice_items_invoice_id_invoices` |
| `invoice_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `finance.invoices` via `fk_finance_invoice_items_invoice_id_invoices_numeric` |
| `line_total` | `numeric(16,2)` | No | — | Value of line total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `order_item_id` | `uuid` | Yes | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` via `fk_finance_invoice_items_order_item_id_order_items` |
| `order_item_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` via `fk_finance_invoice_items_order_item_id_order_items_numeric` |
| `quantity` | `numeric(12,3)` | No | — | Quantity value | Track resource or item amounts accurately | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `tax_amount` | `numeric(14,2)` | No | — | Value of tax amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `tax_breakup` | `jsonb` | No | `'{}'::jsonb` | Structured tax breakup information | Retain a versioned payload or relevant details | Exact constraints below |
| `tax_rate` | `numeric(7,4)` | No | — | Inferred: stores tax rate for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `unit_price` | `numeric(14,2)` | No | — | Value of unit price | Enable pricing, reconciliation or reporting | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_finance_invoice_items_updated_by_users` |

## Record lifecycle and users

- **Created:** when the invoice items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `finance.invoice_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_finance_invoice_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_finance_invoice_items_invoice_id_invoices | `invoice_id` | [`finance.invoices`](../../Tables/finance/invoices.md) | `FOREIGN KEY (invoice_id) REFERENCES finance.invoices(id) ON DELETE CASCADE` |
| fk_finance_invoice_items_invoice_id_invoices_numeric | `invoice_id_internal_id` | [`finance.invoices`](../../Tables/finance/invoices.md) | `FOREIGN KEY (invoice_id_internal_id) REFERENCES finance.invoices(internal_id) ON DELETE CASCADE` |
| fk_finance_invoice_items_order_item_id_order_items | `order_item_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT` |
| fk_finance_invoice_items_order_item_id_order_items_numeric | `order_item_id_internal_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT` |
| fk_finance_invoice_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `finance.invoice_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_finance_invoice_items_created_by_users` |
| `invoice_id` | `finance.invoices` | `fk_finance_invoice_items_invoice_id_invoices` |
| `invoice_id_internal_id` | `finance.invoices` | `fk_finance_invoice_items_invoice_id_invoices_numeric` |
| `order_item_id` | `commerce.order_items` | `fk_finance_invoice_items_order_item_id_order_items` |
| `order_item_id_internal_id` | `commerce.order_items` | `fk_finance_invoice_items_order_item_id_order_items_numeric` |
| `updated_by` | `identity.users` | `fk_finance_invoice_items_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_finance_invoice_items_amounts_nonnegative` | CHECK | `CHECK (unit_price >= 0::numeric AND tax_rate >= 0::numeric AND tax_amount >= 0::numeric AND line_total >= 0::numeric)` |
| `ck_finance_invoice_items_finite_numeric_values` | CHECK | `CHECK ((quantity IS NULL OR (quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (unit_price IS NULL OR (unit_price <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (discount_amount IS NULL OR (discount_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (tax_rate IS NULL OR (tax_rate <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (tax_amount IS NULL OR (tax_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (line_total IS NULL OR (line_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_finance_invoice_items_numeric_pair_invoice_id` | CHECK | `CHECK ((invoice_id IS NULL) = (invoice_id_internal_id IS NULL))` |
| `ck_finance_invoice_items_numeric_pair_order_item_id` | CHECK | `CHECK ((order_item_id IS NULL) = (order_item_id_internal_id IS NULL))` |
| `ck_finance_invoice_items_quantity_positive` | CHECK | `CHECK (quantity > 0::numeric)` |
| `ck_finance_invoice_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_finance_invoice_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_finance_invoice_items_invoice_id_invoices` | FOREIGN KEY | `FOREIGN KEY (invoice_id) REFERENCES finance.invoices(id) ON DELETE CASCADE` |
| `fk_finance_invoice_items_invoice_id_invoices_numeric` | FOREIGN KEY | `FOREIGN KEY (invoice_id_internal_id) REFERENCES finance.invoices(internal_id) ON DELETE CASCADE` |
| `fk_finance_invoice_items_order_item_id_order_items` | FOREIGN KEY | `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT` |
| `fk_finance_invoice_items_order_item_id_order_items_numeric` | FOREIGN KEY | `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT` |
| `fk_finance_invoice_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_finance_invoice_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_finance_invoice_items_id` | UNIQUE | `UNIQUE (id)` |
| `invoice_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `invoice_items_description_not_null` | NOT NULL | `NOT NULL description` |
| `invoice_items_discount_amount_not_null` | NOT NULL | `NOT NULL discount_amount` |
| `invoice_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `invoice_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `invoice_items_invoice_id_internal_id_not_null` | NOT NULL | `NOT NULL invoice_id_internal_id` |
| `invoice_items_invoice_id_not_null` | NOT NULL | `NOT NULL invoice_id` |
| `invoice_items_line_total_not_null` | NOT NULL | `NOT NULL line_total` |
| `invoice_items_quantity_not_null` | NOT NULL | `NOT NULL quantity` |
| `invoice_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `invoice_items_tax_amount_not_null` | NOT NULL | `NOT NULL tax_amount` |
| `invoice_items_tax_breakup_not_null` | NOT NULL | `NOT NULL tax_breakup` |
| `invoice_items_tax_rate_not_null` | NOT NULL | `NOT NULL tax_rate` |
| `invoice_items_unit_price_not_null` | NOT NULL | `NOT NULL unit_price` |
| `invoice_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_finance_invoice_items_invoice` | btree | `(invoice_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_finance_invoice_items_invoice ON finance.invoice_items USING btree (invoice_id)` |
| `ix_finance_invoice_items_order_item` | btree | `(order_item_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_finance_invoice_items_order_item ON finance.invoice_items USING btree (order_item_id)` |
| `pk_finance_invoice_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_finance_invoice_items ON finance.invoice_items USING btree (internal_id)` |
| `uq_finance_invoice_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_finance_invoice_items_id ON finance.invoice_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON finance.invoice_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["invoice_id","invoice_id_internal_id","finance","invoices"],["order_item_id","order_item_id_internal_id","commerce","order_items"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON finance.invoice_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON finance.invoice_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["invoice_id","invoice_id_internal_id","finance","invoices"],["order_item_id","order_item_id_internal_id","commerce","order_items"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
