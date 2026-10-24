# `procurement.supplier_invoices`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds supplier invoices records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | procurement.supplier_invoices |
| Classification | Transactional |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 19 columns; 17 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_supplier_invoices_created_by_users` |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | Collation: default |
| `document_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_procurement_supplier_invoices_document_file_id_file_objects` |
| `document_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_procurement_supplier_invoices_document_file_id_file__3eb3` |
| `due_date` | `date` | Yes | — | Inferred: stores due date for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `grand_total` | `numeric(16,2)` | No | — | Value of grand total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `invoice_date` | `date` | No | — | Inferred: stores invoice date for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `invoice_number` | `character varying(128)` | No | — | Inferred: stores invoice number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `purchase_order_id` | `uuid` | Yes | — | Reference linking this record to purchase orders | Ensures related business data can be joined and validated | FK → `procurement.purchase_orders` via `fk_procurement_supplier_invoices_purchase_order_id_purc_9c6d` |
| `purchase_order_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.purchase_orders` via `fk_procurement_supplier_invoices_purchase_order_id_purc_1999` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'received'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `supplier_id` | `uuid` | No | — | Reference linking this record to suppliers | Ensures related business data can be joined and validated | FK → `procurement.suppliers` via `fk_procurement_supplier_invoices_supplier_id_suppliers` |
| `supplier_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.suppliers` via `fk_procurement_supplier_invoices_supplier_id_suppliers_numeric` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_supplier_invoices_updated_by_users` |

## Record lifecycle and users

- **Created:** when the supplier invoices business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.supplier_invoices` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_procurement_supplier_invoices_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_supplier_invoices_document_file_id_file__3eb3 | `document_file_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (document_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| fk_procurement_supplier_invoices_document_file_id_file_objects | `document_file_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (document_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| fk_procurement_supplier_invoices_purchase_order_id_purc_1999 | `purchase_order_id_internal_id` | [`procurement.purchase_orders`](../../Tables/procurement/purchase_orders.md) | `FOREIGN KEY (purchase_order_id_internal_id) REFERENCES procurement.purchase_orders(internal_id) ON DELETE SET NULL` |
| fk_procurement_supplier_invoices_purchase_order_id_purc_9c6d | `purchase_order_id` | [`procurement.purchase_orders`](../../Tables/procurement/purchase_orders.md) | `FOREIGN KEY (purchase_order_id) REFERENCES procurement.purchase_orders(id) ON DELETE SET NULL` |
| fk_procurement_supplier_invoices_supplier_id_suppliers | `supplier_id` | [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | `FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE RESTRICT` |
| fk_procurement_supplier_invoices_supplier_id_suppliers_numeric | `supplier_id_internal_id` | [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | `FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE RESTRICT` |
| fk_procurement_supplier_invoices_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`procurement.goods_receipts`](../../Tables/procurement/goods_receipts.md) | fk_procurement_goods_receipts_supplier_invoice_id_suppl_76a5 | `supplier_invoice_id_internal_id` | `internal_id` |
| [`procurement.goods_receipts`](../../Tables/procurement/goods_receipts.md) | fk_procurement_goods_receipts_supplier_invoice_id_suppl_d9fd | `supplier_invoice_id` | `id` |

## `procurement.supplier_invoices` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_supplier_invoices_created_by_users` |
| `document_file_id_internal_id` | `platform.file_objects` | `fk_procurement_supplier_invoices_document_file_id_file__3eb3` |
| `document_file_id` | `platform.file_objects` | `fk_procurement_supplier_invoices_document_file_id_file_objects` |
| `purchase_order_id_internal_id` | `procurement.purchase_orders` | `fk_procurement_supplier_invoices_purchase_order_id_purc_1999` |
| `purchase_order_id` | `procurement.purchase_orders` | `fk_procurement_supplier_invoices_purchase_order_id_purc_9c6d` |
| `supplier_id` | `procurement.suppliers` | `fk_procurement_supplier_invoices_supplier_id_suppliers` |
| `supplier_id_internal_id` | `procurement.suppliers` | `fk_procurement_supplier_invoices_supplier_id_suppliers_numeric` |
| `updated_by` | `identity.users` | `fk_procurement_supplier_invoices_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_procurement_supplier_invoices_finite_numeric_values` | CHECK | `CHECK (grand_total IS NULL OR (grand_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_procurement_supplier_invoices_grand_total_nonnegative` | CHECK | `CHECK (grand_total >= 0::numeric)` |
| `ck_procurement_supplier_invoices_numeric_pair_document_file_id` | CHECK | `CHECK ((document_file_id IS NULL) = (document_file_id_internal_id IS NULL))` |
| `ck_procurement_supplier_invoices_numeric_pair_purchase_order_id` | CHECK | `CHECK ((purchase_order_id IS NULL) = (purchase_order_id_internal_id IS NULL))` |
| `ck_procurement_supplier_invoices_numeric_pair_supplier_id` | CHECK | `CHECK ((supplier_id IS NULL) = (supplier_id_internal_id IS NULL))` |
| `ck_procurement_supplier_invoices_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_procurement_supplier_invoices_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_supplier_invoices_document_file_id_file__3eb3` | FOREIGN KEY | `FOREIGN KEY (document_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| `fk_procurement_supplier_invoices_document_file_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (document_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| `fk_procurement_supplier_invoices_purchase_order_id_purc_1999` | FOREIGN KEY | `FOREIGN KEY (purchase_order_id_internal_id) REFERENCES procurement.purchase_orders(internal_id) ON DELETE SET NULL` |
| `fk_procurement_supplier_invoices_purchase_order_id_purc_9c6d` | FOREIGN KEY | `FOREIGN KEY (purchase_order_id) REFERENCES procurement.purchase_orders(id) ON DELETE SET NULL` |
| `fk_procurement_supplier_invoices_supplier_id_suppliers` | FOREIGN KEY | `FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE RESTRICT` |
| `fk_procurement_supplier_invoices_supplier_id_suppliers_numeric` | FOREIGN KEY | `FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE RESTRICT` |
| `fk_procurement_supplier_invoices_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_procurement_supplier_invoices` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `supplier_invoice_number` | UNIQUE | `UNIQUE (supplier_id, invoice_number)` |
| `uq_procurement_supplier_invoices_id` | UNIQUE | `UNIQUE (id)` |
| `supplier_invoices_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `supplier_invoices_currency_not_null` | NOT NULL | `NOT NULL currency` |
| `supplier_invoices_grand_total_not_null` | NOT NULL | `NOT NULL grand_total` |
| `supplier_invoices_id_not_null` | NOT NULL | `NOT NULL id` |
| `supplier_invoices_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `supplier_invoices_invoice_date_not_null` | NOT NULL | `NOT NULL invoice_date` |
| `supplier_invoices_invoice_number_not_null` | NOT NULL | `NOT NULL invoice_number` |
| `supplier_invoices_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `supplier_invoices_status_not_null` | NOT NULL | `NOT NULL status` |
| `supplier_invoices_supplier_id_internal_id_not_null` | NOT NULL | `NOT NULL supplier_id_internal_id` |
| `supplier_invoices_supplier_id_not_null` | NOT NULL | `NOT NULL supplier_id` |
| `supplier_invoices_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_procurement_supplier_invoices_po` | btree | `(purchase_order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_supplier_invoices_po ON procurement.supplier_invoices USING btree (purchase_order_id)` |
| `ix_procurement_supplier_invoices_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_supplier_invoices_status ON procurement.supplier_invoices USING btree (status)` |
| `pk_procurement_supplier_invoices` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_procurement_supplier_invoices ON procurement.supplier_invoices USING btree (internal_id)` |
| `supplier_invoice_number` | btree | `(supplier_id, invoice_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX supplier_invoice_number ON procurement.supplier_invoices USING btree (supplier_id, invoice_number)` |
| `uq_procurement_supplier_invoices_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_procurement_supplier_invoices_id ON procurement.supplier_invoices USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.supplier_invoices FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["purchase_order_id","purchase_order_id_internal_id","procurement","purchase_orders"],["supplier_id","supplier_id_internal_id","procurement","suppliers"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.supplier_invoices FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.supplier_invoices FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["purchase_order_id","purchase_order_id_internal_id","procurement","purchase_orders"],["supplier_id","supplier_id_internal_id","procurement","suppliers"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
