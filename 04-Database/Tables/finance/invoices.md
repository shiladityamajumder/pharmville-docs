# finance.invoices

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds invoices records within the finance domain (invoicing, ledgers and settlement). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 25 columns, 18 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_finance_invoices_created_by_users) |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | See exact constraints |
| `discount_total` | `numeric(16,2)` | No | `0` | Value of discount total | Enable pricing, reconciliation or reporting | See exact constraints |
| `document_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_finance_invoices_document_file_id_file_objects) |
| `document_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_finance_invoices_document_file_id_file_objects_numeric); Numeric/public-key pair verification required |
| `grand_total` | `numeric(16,2)` | No | — | Value of grand total | Enable pricing, reconciliation or reporting | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `invoice_number` | `character varying(64)` | No | — | Inferred: stores invoice number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `invoice_type` | `character varying(32)` | No | — | Inferred: stores invoice type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `issued_at` | `timestamp with time zone` | No | — | Time of issued | Support chronology, deadlines or audit evidence | See exact constraints |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` (fk_finance_invoices_order_id_orders) |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` (fk_finance_invoices_order_id_orders_numeric); Numeric/public-key pair verification required |
| `place_of_supply_code` | `character varying(8)` | Yes | — | Code for place of supply | Link to controlled business classification or an external reference | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `seller_id` | `uuid` | Yes | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` (fk_finance_invoices_seller_id_sellers) |
| `seller_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` (fk_finance_invoices_seller_id_sellers_numeric); Numeric/public-key pair verification required |
| `shipping_total` | `numeric(16,2)` | No | `0` | Value of shipping total | Enable pricing, reconciliation or reporting | See exact constraints |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `subtotal` | `numeric(16,2)` | No | — | Inferred: stores subtotal for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `supply_state_code` | `character varying(8)` | Yes | — | Code for supply state | Link to controlled business classification or an external reference | See exact constraints |
| `tax_total` | `numeric(16,2)` | No | — | Value of tax total | Enable pricing, reconciliation or reporting | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_finance_invoices_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the invoices business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `finance.invoices` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_finance_invoices_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_finance_invoices_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `seller_id` → `marketplace.sellers(id)` via `fk_finance_invoices_seller_id_sellers`; FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE SET NULL
- `order_id` → `commerce.orders(id)` via `fk_finance_invoices_order_id_orders`; FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT
- `document_file_id` → `platform.file_objects(id)` via `fk_finance_invoices_document_file_id_file_objects`; FOREIGN KEY (document_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL
- `document_file_id_internal_id` → `platform.file_objects(internal_id)` via `fk_finance_invoices_document_file_id_file_objects_numeric`; FOREIGN KEY (document_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL
- `order_id_internal_id` → `commerce.orders(internal_id)` via `fk_finance_invoices_order_id_orders_numeric`; FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT
- `seller_id_internal_id` → `marketplace.sellers(internal_id)` via `fk_finance_invoices_seller_id_sellers_numeric`; FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE SET NULL

**Referenced by 4 FK constraints** (sample): `finance.invoice_items`, `finance.credit_notes`, `finance.credit_notes`, `finance.invoice_items`.

## finance.invoices — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 25 columns, 18 constraints, 6 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_finance_invoices_created_by_users` |
| `updated_by` | `identity.users` | `fk_finance_invoices_updated_by_users` |
| `seller_id` | `marketplace.sellers` | `fk_finance_invoices_seller_id_sellers` |
| `order_id` | `commerce.orders` | `fk_finance_invoices_order_id_orders` |
| `document_file_id` | `platform.file_objects` | `fk_finance_invoices_document_file_id_file_objects` |
| `document_file_id_internal_id` | `platform.file_objects` | `fk_finance_invoices_document_file_id_file_objects_numeric` |
| `order_id_internal_id` | `commerce.orders` | `fk_finance_invoices_order_id_orders_numeric` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_finance_invoices_seller_id_sellers_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `invoice_number` | `CREATE UNIQUE INDEX invoice_number ON finance.invoices USING btree (invoice_number)` |
| `ix_finance_invoices_order` | `CREATE INDEX ix_finance_invoices_order ON finance.invoices USING btree (order_id)` |
| `ix_finance_invoices_seller` | `CREATE INDEX ix_finance_invoices_seller ON finance.invoices USING btree (seller_id)` |
| `ix_finance_invoices_status` | `CREATE INDEX ix_finance_invoices_status ON finance.invoices USING btree (status)` |
| `pk_finance_invoices` | `CREATE UNIQUE INDEX pk_finance_invoices ON finance.invoices USING btree (internal_id)` |
| `uq_finance_invoices_id` | `CREATE UNIQUE INDEX uq_finance_invoices_id ON finance.invoices USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON finance.invoices FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["order_id","order_id_internal_id","commerce","orders"],["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON finance.invoices FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON finance.invoices FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["order_id","order_id_internal_id","commerce","orders"],["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
