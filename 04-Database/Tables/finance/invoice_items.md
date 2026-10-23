# finance.invoice_items

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds invoice items records within the finance domain (invoicing, ledgers and settlement). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 20 columns, 14 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_finance_invoice_items_created_by_users) |
| `description` | `character varying(255)` | No | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `discount_amount` | `numeric(14,2)` | No | `0` | Value of discount amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `hsn_code` | `character varying(32)` | Yes | — | Code for hsn | Link to controlled business classification or an external reference | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `invoice_id` | `uuid` | No | — | Reference linking this record to invoices | Ensures related business data can be joined and validated | FK → `finance.invoices` (fk_finance_invoice_items_invoice_id_invoices) |
| `invoice_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `finance.invoices` (fk_finance_invoice_items_invoice_id_invoices_numeric); Numeric/public-key pair verification required |
| `line_total` | `numeric(16,2)` | No | — | Value of line total | Enable pricing, reconciliation or reporting | See exact constraints |
| `order_item_id` | `uuid` | Yes | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` (fk_finance_invoice_items_order_item_id_order_items) |
| `order_item_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` (fk_finance_invoice_items_order_item_id_order_items_numeric); Numeric/public-key pair verification required |
| `quantity` | `numeric(12,3)` | No | — | Quantity value | Track resource or item amounts accurately | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `tax_amount` | `numeric(14,2)` | No | — | Value of tax amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `tax_breakup` | `jsonb` | No | `'{}'::jsonb` | Structured tax breakup information | Retain a versioned payload or relevant details | See exact constraints |
| `tax_rate` | `numeric(7,4)` | No | — | Inferred: stores tax rate for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `unit_price` | `numeric(14,2)` | No | — | Value of unit price | Enable pricing, reconciliation or reporting | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_finance_invoice_items_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the invoice items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `finance.invoice_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_finance_invoice_items_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_finance_invoice_items_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `invoice_id` → `finance.invoices(id)` via `fk_finance_invoice_items_invoice_id_invoices`; FOREIGN KEY (invoice_id) REFERENCES finance.invoices(id) ON DELETE CASCADE
- `order_item_id` → `commerce.order_items(id)` via `fk_finance_invoice_items_order_item_id_order_items`; FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT
- `invoice_id_internal_id` → `finance.invoices(internal_id)` via `fk_finance_invoice_items_invoice_id_invoices_numeric`; FOREIGN KEY (invoice_id_internal_id) REFERENCES finance.invoices(internal_id) ON DELETE CASCADE
- `order_item_id_internal_id` → `commerce.order_items(internal_id)` via `fk_finance_invoice_items_order_item_id_order_items_numeric`; FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT

## finance.invoice_items — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 20 columns, 14 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_finance_invoice_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_finance_invoice_items_updated_by_users` |
| `invoice_id` | `finance.invoices` | `fk_finance_invoice_items_invoice_id_invoices` |
| `order_item_id` | `commerce.order_items` | `fk_finance_invoice_items_order_item_id_order_items` |
| `invoice_id_internal_id` | `finance.invoices` | `fk_finance_invoice_items_invoice_id_invoices_numeric` |
| `order_item_id_internal_id` | `commerce.order_items` | `fk_finance_invoice_items_order_item_id_order_items_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_finance_invoice_items_invoice` | `CREATE INDEX ix_finance_invoice_items_invoice ON finance.invoice_items USING btree (invoice_id)` |
| `ix_finance_invoice_items_order_item` | `CREATE INDEX ix_finance_invoice_items_order_item ON finance.invoice_items USING btree (order_item_id)` |
| `pk_finance_invoice_items` | `CREATE UNIQUE INDEX pk_finance_invoice_items ON finance.invoice_items USING btree (internal_id)` |
| `uq_finance_invoice_items_id` | `CREATE UNIQUE INDEX uq_finance_invoice_items_id ON finance.invoice_items USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON finance.invoice_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["invoice_id","invoice_id_internal_id","finance","invoices"],["order_item_id","order_item_id_internal_id","commerce","order_items"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON finance.invoice_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON finance.invoice_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["invoice_id","invoice_id_internal_id","finance","invoices"],["order_item_id","order_item_id_internal_id","commerce","order_items"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
