# finance.credit_notes

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds credit notes records within the finance domain (invoicing, ledgers and settlement). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 17 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(16,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_finance_credit_notes_created_by_users) |
| `credit_note_number` | `character varying(64)` | No | — | Inferred: stores credit note number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `document_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_finance_credit_notes_document_file_id_file_objects) |
| `document_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_finance_credit_notes_document_file_id_file_objects_numeric); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `invoice_id` | `uuid` | No | — | Reference linking this record to invoices | Ensures related business data can be joined and validated | FK → `finance.invoices` (fk_finance_credit_notes_invoice_id_invoices) |
| `invoice_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `finance.invoices` (fk_finance_credit_notes_invoice_id_invoices_numeric); Numeric/public-key pair verification required |
| `issued_at` | `timestamp with time zone` | No | — | Time of issued | Support chronology, deadlines or audit evidence | See exact constraints |
| `reason` | `character varying(255)` | No | — | Inferred: stores reason for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `refund_id` | `uuid` | Yes | — | Reference linking this record to refunds | Ensures related business data can be joined and validated | FK → `payment.refunds` (fk_finance_credit_notes_refund_id_refunds) |
| `refund_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.refunds` (fk_finance_credit_notes_refund_id_refunds_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_finance_credit_notes_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the credit notes business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `finance.credit_notes` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_finance_credit_notes_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_finance_credit_notes_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `document_file_id` → `platform.file_objects(id)` via `fk_finance_credit_notes_document_file_id_file_objects`; FOREIGN KEY (document_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL
- `refund_id` → `payment.refunds(id)` via `fk_finance_credit_notes_refund_id_refunds`; FOREIGN KEY (refund_id) REFERENCES payment.refunds(id) ON DELETE SET NULL
- `invoice_id` → `finance.invoices(id)` via `fk_finance_credit_notes_invoice_id_invoices`; FOREIGN KEY (invoice_id) REFERENCES finance.invoices(id) ON DELETE RESTRICT
- `document_file_id_internal_id` → `platform.file_objects(internal_id)` via `fk_finance_credit_notes_document_file_id_file_objects_numeric`; FOREIGN KEY (document_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL
- `invoice_id_internal_id` → `finance.invoices(internal_id)` via `fk_finance_credit_notes_invoice_id_invoices_numeric`; FOREIGN KEY (invoice_id_internal_id) REFERENCES finance.invoices(internal_id) ON DELETE RESTRICT
- `refund_id_internal_id` → `payment.refunds(internal_id)` via `fk_finance_credit_notes_refund_id_refunds_numeric`; FOREIGN KEY (refund_id_internal_id) REFERENCES payment.refunds(internal_id) ON DELETE SET NULL

## finance.credit_notes — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 17 columns, 17 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_finance_credit_notes_created_by_users` |
| `updated_by` | `identity.users` | `fk_finance_credit_notes_updated_by_users` |
| `document_file_id` | `platform.file_objects` | `fk_finance_credit_notes_document_file_id_file_objects` |
| `refund_id` | `payment.refunds` | `fk_finance_credit_notes_refund_id_refunds` |
| `invoice_id` | `finance.invoices` | `fk_finance_credit_notes_invoice_id_invoices` |
| `document_file_id_internal_id` | `platform.file_objects` | `fk_finance_credit_notes_document_file_id_file_objects_numeric` |
| `invoice_id_internal_id` | `finance.invoices` | `fk_finance_credit_notes_invoice_id_invoices_numeric` |
| `refund_id_internal_id` | `payment.refunds` | `fk_finance_credit_notes_refund_id_refunds_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_finance_credit_notes_amount_positive` | CHECK | `CHECK (amount > 0::numeric)` |
| `ck_finance_credit_notes_finite_numeric_values` | CHECK | `CHECK (amount IS NULL OR (amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_finance_credit_notes_numeric_pair_document_file_id` | CHECK | `CHECK ((document_file_id IS NULL) = (document_file_id_internal_id IS NULL))` |
| `ck_finance_credit_notes_numeric_pair_invoice_id` | CHECK | `CHECK ((invoice_id IS NULL) = (invoice_id_internal_id IS NULL))` |
| `ck_finance_credit_notes_numeric_pair_refund_id` | CHECK | `CHECK ((refund_id IS NULL) = (refund_id_internal_id IS NULL))` |
| `ck_finance_credit_notes_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `credit_note_number` | UNIQUE | `UNIQUE (credit_note_number)` |
| `fk_finance_credit_notes_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_finance_credit_notes_document_file_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (document_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| `fk_finance_credit_notes_document_file_id_file_objects_numeric` | FOREIGN KEY | `FOREIGN KEY (document_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| `fk_finance_credit_notes_invoice_id_invoices` | FOREIGN KEY | `FOREIGN KEY (invoice_id) REFERENCES finance.invoices(id) ON DELETE RESTRICT` |
| `fk_finance_credit_notes_invoice_id_invoices_numeric` | FOREIGN KEY | `FOREIGN KEY (invoice_id_internal_id) REFERENCES finance.invoices(internal_id) ON DELETE RESTRICT` |
| `fk_finance_credit_notes_refund_id_refunds` | FOREIGN KEY | `FOREIGN KEY (refund_id) REFERENCES payment.refunds(id) ON DELETE SET NULL` |
| `fk_finance_credit_notes_refund_id_refunds_numeric` | FOREIGN KEY | `FOREIGN KEY (refund_id_internal_id) REFERENCES payment.refunds(internal_id) ON DELETE SET NULL` |
| `fk_finance_credit_notes_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_finance_credit_notes` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_finance_credit_notes_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `credit_note_number` | `CREATE UNIQUE INDEX credit_note_number ON finance.credit_notes USING btree (credit_note_number)` |
| `ix_finance_credit_notes_invoice` | `CREATE INDEX ix_finance_credit_notes_invoice ON finance.credit_notes USING btree (invoice_id)` |
| `ix_finance_credit_notes_refund` | `CREATE INDEX ix_finance_credit_notes_refund ON finance.credit_notes USING btree (refund_id)` |
| `pk_finance_credit_notes` | `CREATE UNIQUE INDEX pk_finance_credit_notes ON finance.credit_notes USING btree (internal_id)` |
| `uq_finance_credit_notes_id` | `CREATE UNIQUE INDEX uq_finance_credit_notes_id ON finance.credit_notes USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON finance.credit_notes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["invoice_id","invoice_id_internal_id","finance","invoices"],["refund_id","refund_id_internal_id","payment","refunds"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON finance.credit_notes FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON finance.credit_notes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["invoice_id","invoice_id_internal_id","finance","invoices"],["refund_id","refund_id_internal_id","payment","refunds"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
