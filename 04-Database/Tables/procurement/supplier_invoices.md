# `procurement.supplier_invoices`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds supplier invoices records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 19 columns, 17 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_supplier_invoices_created_by_users) |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | See exact constraints |
| `document_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_procurement_supplier_invoices_document_file_id_file_objects) |
| `document_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_procurement_supplier_invoices_document_file_id_file__3eb3); Numeric/public-key pair verification required |
| `due_date` | `date` | Yes | — | Inferred: stores due date for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `grand_total` | `numeric(16,2)` | No | — | Value of grand total | Enable pricing, reconciliation or reporting | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `invoice_date` | `date` | No | — | Inferred: stores invoice date for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `invoice_number` | `character varying(128)` | No | — | Inferred: stores invoice number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `purchase_order_id` | `uuid` | Yes | — | Reference linking this record to purchase orders | Ensures related business data can be joined and validated | FK → `procurement.purchase_orders` (fk_procurement_supplier_invoices_purchase_order_id_purc_9c6d) |
| `purchase_order_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.purchase_orders` (fk_procurement_supplier_invoices_purchase_order_id_purc_1999); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'received'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `supplier_id` | `uuid` | No | — | Reference linking this record to suppliers | Ensures related business data can be joined and validated | FK → `procurement.suppliers` (fk_procurement_supplier_invoices_supplier_id_suppliers) |
| `supplier_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.suppliers` (fk_procurement_supplier_invoices_supplier_id_suppliers_numeric); Numeric/public-key pair verification required |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_supplier_invoices_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the supplier invoices business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.supplier_invoices` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_procurement_supplier_invoices_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_procurement_supplier_invoices_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `document_file_id` → `platform.file_objects(id)` via `fk_procurement_supplier_invoices_document_file_id_file_objects`; `FOREIGN KEY (document_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL`
- `purchase_order_id` → `procurement.purchase_orders(id)` via `fk_procurement_supplier_invoices_purchase_order_id_purc_9c6d`; `FOREIGN KEY (purchase_order_id) REFERENCES procurement.purchase_orders(id) ON DELETE SET NULL`
- `supplier_id` → `procurement.suppliers(id)` via `fk_procurement_supplier_invoices_supplier_id_suppliers`; `FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE RESTRICT`
- `document_file_id_internal_id` → `platform.file_objects(internal_id)` via `fk_procurement_supplier_invoices_document_file_id_file__3eb3`; `FOREIGN KEY (document_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL`
- `purchase_order_id_internal_id` → `procurement.purchase_orders(internal_id)` via `fk_procurement_supplier_invoices_purchase_order_id_purc_1999`; `FOREIGN KEY (purchase_order_id_internal_id) REFERENCES procurement.purchase_orders(internal_id) ON DELETE SET NULL`
- `supplier_id_internal_id` → `procurement.suppliers(internal_id)` via `fk_procurement_supplier_invoices_supplier_id_suppliers_numeric`; `FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE RESTRICT`

**Referenced by 2 FK constraints** (sample): `procurement.goods_receipts`, `procurement.goods_receipts`.

## `procurement.supplier_invoices` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 19 columns, 17 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_supplier_invoices_created_by_users` |
| `updated_by` | `identity.users` | `fk_procurement_supplier_invoices_updated_by_users` |
| `document_file_id` | `platform.file_objects` | `fk_procurement_supplier_invoices_document_file_id_file_objects` |
| `purchase_order_id` | `procurement.purchase_orders` | `fk_procurement_supplier_invoices_purchase_order_id_purc_9c6d` |
| `supplier_id` | `procurement.suppliers` | `fk_procurement_supplier_invoices_supplier_id_suppliers` |
| `document_file_id_internal_id` | `platform.file_objects` | `fk_procurement_supplier_invoices_document_file_id_file__3eb3` |
| `purchase_order_id_internal_id` | `procurement.purchase_orders` | `fk_procurement_supplier_invoices_purchase_order_id_purc_1999` |
| `supplier_id_internal_id` | `procurement.suppliers` | `fk_procurement_supplier_invoices_supplier_id_suppliers_numeric` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_procurement_supplier_invoices_po` | `CREATE INDEX ix_procurement_supplier_invoices_po ON procurement.supplier_invoices USING btree (purchase_order_id)` |
| `ix_procurement_supplier_invoices_status` | `CREATE INDEX ix_procurement_supplier_invoices_status ON procurement.supplier_invoices USING btree (status)` |
| `pk_procurement_supplier_invoices` | `CREATE UNIQUE INDEX pk_procurement_supplier_invoices ON procurement.supplier_invoices USING btree (internal_id)` |
| `supplier_invoice_number` | `CREATE UNIQUE INDEX supplier_invoice_number ON procurement.supplier_invoices USING btree (supplier_id, invoice_number)` |
| `uq_procurement_supplier_invoices_id` | `CREATE UNIQUE INDEX uq_procurement_supplier_invoices_id ON procurement.supplier_invoices USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.supplier_invoices FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["purchase_order_id","purchase_order_id_internal_id","procurement","purchase_orders"],["supplier_id","supplier_id_internal_id","procurement","suppliers"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.supplier_invoices FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.supplier_invoices FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["purchase_order_id","purchase_order_id_internal_id","procurement","purchase_orders"],["supplier_id","supplier_id_internal_id","procurement","suppliers"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
