# `finance.invoices`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds invoices records within the finance domain (invoicing, ledgers and settlement). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | finance.invoices |
| Classification | Transactional |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 25 columns; 18 PK/FK/UQ/CHECK/exclusion constraints; 17 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_finance_invoices_created_by_users` |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | Collation: default |
| `discount_total` | `numeric(16,2)` | No | `0` | Value of discount total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `document_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_finance_invoices_document_file_id_file_objects` |
| `document_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_finance_invoices_document_file_id_file_objects_numeric` |
| `grand_total` | `numeric(16,2)` | No | — | Value of grand total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `invoice_number` | `character varying(64)` | No | — | Inferred: stores invoice number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `invoice_type` | `character varying(32)` | No | — | Inferred: stores invoice type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `issued_at` | `timestamp with time zone` | No | — | Time of issued | Support chronology, deadlines or audit evidence | Exact constraints below |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` via `fk_finance_invoices_order_id_orders` |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` via `fk_finance_invoices_order_id_orders_numeric` |
| `place_of_supply_code` | `character varying(8)` | Yes | — | Code for place of supply | Link to controlled business classification or an external reference | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `seller_id` | `uuid` | Yes | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` via `fk_finance_invoices_seller_id_sellers` |
| `seller_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` via `fk_finance_invoices_seller_id_sellers_numeric` |
| `shipping_total` | `numeric(16,2)` | No | `0` | Value of shipping total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `subtotal` | `numeric(16,2)` | No | — | Inferred: stores subtotal for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `supply_state_code` | `character varying(8)` | Yes | — | Code for supply state | Link to controlled business classification or an external reference | Collation: default |
| `tax_total` | `numeric(16,2)` | No | — | Value of tax total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_finance_invoices_updated_by_users` |

## Record lifecycle and users

- **Created:** when the invoices business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `finance.invoices` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_finance_invoices_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_finance_invoices_document_file_id_file_objects | `document_file_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (document_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| fk_finance_invoices_document_file_id_file_objects_numeric | `document_file_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (document_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| fk_finance_invoices_order_id_orders | `order_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| fk_finance_invoices_order_id_orders_numeric | `order_id_internal_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| fk_finance_invoices_seller_id_sellers | `seller_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE SET NULL` |
| fk_finance_invoices_seller_id_sellers_numeric | `seller_id_internal_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE SET NULL` |
| fk_finance_invoices_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`finance.credit_notes`](../../Tables/finance/credit_notes.md) | fk_finance_credit_notes_invoice_id_invoices | `invoice_id` | `id` |
| [`finance.credit_notes`](../../Tables/finance/credit_notes.md) | fk_finance_credit_notes_invoice_id_invoices_numeric | `invoice_id_internal_id` | `internal_id` |
| [`finance.invoice_items`](../../Tables/finance/invoice_items.md) | fk_finance_invoice_items_invoice_id_invoices | `invoice_id` | `id` |
| [`finance.invoice_items`](../../Tables/finance/invoice_items.md) | fk_finance_invoice_items_invoice_id_invoices_numeric | `invoice_id_internal_id` | `internal_id` |

## `finance.invoices` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_finance_invoices_created_by_users` |
| `document_file_id` | `platform.file_objects` | `fk_finance_invoices_document_file_id_file_objects` |
| `document_file_id_internal_id` | `platform.file_objects` | `fk_finance_invoices_document_file_id_file_objects_numeric` |
| `order_id` | `commerce.orders` | `fk_finance_invoices_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_finance_invoices_order_id_orders_numeric` |
| `seller_id` | `marketplace.sellers` | `fk_finance_invoices_seller_id_sellers` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_finance_invoices_seller_id_sellers_numeric` |
| `updated_by` | `identity.users` | `fk_finance_invoices_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_finance_invoices_finite_numeric_values` | CHECK | `CHECK ((subtotal IS NULL OR (subtotal <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (discount_total IS NULL OR (discount_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (shipping_total IS NULL OR (shipping_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (tax_total IS NULL OR (tax_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (grand_total IS NULL OR (grand_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_finance_invoices_grand_total_formula` | CHECK | `CHECK (grand_total = (subtotal + tax_total + shipping_total - discount_total))` |
| `ck_finance_invoices_numeric_pair_document_file_id` | CHECK | `CHECK ((document_file_id IS NULL) = (document_file_id_internal_id IS NULL))` |
| `ck_finance_invoices_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_finance_invoices_numeric_pair_seller_id` | CHECK | `CHECK ((seller_id IS NULL) = (seller_id_internal_id IS NULL))` |
| `ck_finance_invoices_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_finance_invoices_totals_nonnegative` | CHECK | `CHECK (subtotal >= 0::numeric AND tax_total >= 0::numeric AND grand_total >= 0::numeric)` |
| `fk_finance_invoices_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_finance_invoices_document_file_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (document_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| `fk_finance_invoices_document_file_id_file_objects_numeric` | FOREIGN KEY | `FOREIGN KEY (document_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| `fk_finance_invoices_order_id_orders` | FOREIGN KEY | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| `fk_finance_invoices_order_id_orders_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| `fk_finance_invoices_seller_id_sellers` | FOREIGN KEY | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE SET NULL` |
| `fk_finance_invoices_seller_id_sellers_numeric` | FOREIGN KEY | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE SET NULL` |
| `fk_finance_invoices_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `invoice_number` | UNIQUE | `UNIQUE (invoice_number)` |
| `pk_finance_invoices` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_finance_invoices_id` | UNIQUE | `UNIQUE (id)` |
| `invoices_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `invoices_currency_not_null` | NOT NULL | `NOT NULL currency` |
| `invoices_discount_total_not_null` | NOT NULL | `NOT NULL discount_total` |
| `invoices_grand_total_not_null` | NOT NULL | `NOT NULL grand_total` |
| `invoices_id_not_null` | NOT NULL | `NOT NULL id` |
| `invoices_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `invoices_invoice_number_not_null` | NOT NULL | `NOT NULL invoice_number` |
| `invoices_invoice_type_not_null` | NOT NULL | `NOT NULL invoice_type` |
| `invoices_issued_at_not_null` | NOT NULL | `NOT NULL issued_at` |
| `invoices_order_id_internal_id_not_null` | NOT NULL | `NOT NULL order_id_internal_id` |
| `invoices_order_id_not_null` | NOT NULL | `NOT NULL order_id` |
| `invoices_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `invoices_shipping_total_not_null` | NOT NULL | `NOT NULL shipping_total` |
| `invoices_status_not_null` | NOT NULL | `NOT NULL status` |
| `invoices_subtotal_not_null` | NOT NULL | `NOT NULL subtotal` |
| `invoices_tax_total_not_null` | NOT NULL | `NOT NULL tax_total` |
| `invoices_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `invoice_number` | btree | `(invoice_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX invoice_number ON finance.invoices USING btree (invoice_number)` |
| `ix_finance_invoices_order` | btree | `(order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_finance_invoices_order ON finance.invoices USING btree (order_id)` |
| `ix_finance_invoices_seller` | btree | `(seller_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_finance_invoices_seller ON finance.invoices USING btree (seller_id)` |
| `ix_finance_invoices_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_finance_invoices_status ON finance.invoices USING btree (status)` |
| `pk_finance_invoices` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_finance_invoices ON finance.invoices USING btree (internal_id)` |
| `uq_finance_invoices_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_finance_invoices_id ON finance.invoices USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON finance.invoices FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["order_id","order_id_internal_id","commerce","orders"],["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON finance.invoices FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON finance.invoices FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["order_id","order_id_internal_id","commerce","orders"],["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
