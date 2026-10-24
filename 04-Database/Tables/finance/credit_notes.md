# `finance.credit_notes`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds credit notes records within the finance domain (invoicing, ledgers and settlement). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | finance.credit_notes |
| Classification | Transactional |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 17 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(16,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_finance_credit_notes_created_by_users` |
| `credit_note_number` | `character varying(64)` | No | — | Inferred: stores credit note number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `document_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_finance_credit_notes_document_file_id_file_objects` |
| `document_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_finance_credit_notes_document_file_id_file_objects_numeric` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `invoice_id` | `uuid` | No | — | Reference linking this record to invoices | Ensures related business data can be joined and validated | FK → `finance.invoices` via `fk_finance_credit_notes_invoice_id_invoices` |
| `invoice_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `finance.invoices` via `fk_finance_credit_notes_invoice_id_invoices_numeric` |
| `issued_at` | `timestamp with time zone` | No | — | Time of issued | Support chronology, deadlines or audit evidence | Exact constraints below |
| `reason` | `character varying(255)` | No | — | Inferred: stores reason for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `refund_id` | `uuid` | Yes | — | Reference linking this record to refunds | Ensures related business data can be joined and validated | FK → `payment.refunds` via `fk_finance_credit_notes_refund_id_refunds` |
| `refund_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.refunds` via `fk_finance_credit_notes_refund_id_refunds_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_finance_credit_notes_updated_by_users` |

## Record lifecycle and users

- **Created:** when the credit notes business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `finance.credit_notes` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_finance_credit_notes_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_finance_credit_notes_document_file_id_file_objects | `document_file_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (document_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| fk_finance_credit_notes_document_file_id_file_objects_numeric | `document_file_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (document_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| fk_finance_credit_notes_invoice_id_invoices | `invoice_id` | [`finance.invoices`](../../Tables/finance/invoices.md) | `FOREIGN KEY (invoice_id) REFERENCES finance.invoices(id) ON DELETE RESTRICT` |
| fk_finance_credit_notes_invoice_id_invoices_numeric | `invoice_id_internal_id` | [`finance.invoices`](../../Tables/finance/invoices.md) | `FOREIGN KEY (invoice_id_internal_id) REFERENCES finance.invoices(internal_id) ON DELETE RESTRICT` |
| fk_finance_credit_notes_refund_id_refunds | `refund_id` | [`payment.refunds`](../../Tables/payment/refunds.md) | `FOREIGN KEY (refund_id) REFERENCES payment.refunds(id) ON DELETE SET NULL` |
| fk_finance_credit_notes_refund_id_refunds_numeric | `refund_id_internal_id` | [`payment.refunds`](../../Tables/payment/refunds.md) | `FOREIGN KEY (refund_id_internal_id) REFERENCES payment.refunds(internal_id) ON DELETE SET NULL` |
| fk_finance_credit_notes_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `finance.credit_notes` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_finance_credit_notes_created_by_users` |
| `document_file_id` | `platform.file_objects` | `fk_finance_credit_notes_document_file_id_file_objects` |
| `document_file_id_internal_id` | `platform.file_objects` | `fk_finance_credit_notes_document_file_id_file_objects_numeric` |
| `invoice_id` | `finance.invoices` | `fk_finance_credit_notes_invoice_id_invoices` |
| `invoice_id_internal_id` | `finance.invoices` | `fk_finance_credit_notes_invoice_id_invoices_numeric` |
| `refund_id` | `payment.refunds` | `fk_finance_credit_notes_refund_id_refunds` |
| `refund_id_internal_id` | `payment.refunds` | `fk_finance_credit_notes_refund_id_refunds_numeric` |
| `updated_by` | `identity.users` | `fk_finance_credit_notes_updated_by_users` |

### Existing constraints

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
| `credit_notes_amount_not_null` | NOT NULL | `NOT NULL amount` |
| `credit_notes_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `credit_notes_credit_note_number_not_null` | NOT NULL | `NOT NULL credit_note_number` |
| `credit_notes_id_not_null` | NOT NULL | `NOT NULL id` |
| `credit_notes_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `credit_notes_invoice_id_internal_id_not_null` | NOT NULL | `NOT NULL invoice_id_internal_id` |
| `credit_notes_invoice_id_not_null` | NOT NULL | `NOT NULL invoice_id` |
| `credit_notes_issued_at_not_null` | NOT NULL | `NOT NULL issued_at` |
| `credit_notes_reason_not_null` | NOT NULL | `NOT NULL reason` |
| `credit_notes_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `credit_notes_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `credit_note_number` | btree | `(credit_note_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX credit_note_number ON finance.credit_notes USING btree (credit_note_number)` |
| `ix_finance_credit_notes_invoice` | btree | `(invoice_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_finance_credit_notes_invoice ON finance.credit_notes USING btree (invoice_id)` |
| `ix_finance_credit_notes_refund` | btree | `(refund_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_finance_credit_notes_refund ON finance.credit_notes USING btree (refund_id)` |
| `pk_finance_credit_notes` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_finance_credit_notes ON finance.credit_notes USING btree (internal_id)` |
| `uq_finance_credit_notes_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_finance_credit_notes_id ON finance.credit_notes USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON finance.credit_notes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["invoice_id","invoice_id_internal_id","finance","invoices"],["refund_id","refund_id_internal_id","payment","refunds"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON finance.credit_notes FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON finance.credit_notes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["invoice_id","invoice_id_internal_id","finance","invoices"],["refund_id","refund_id_internal_id","payment","refunds"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
