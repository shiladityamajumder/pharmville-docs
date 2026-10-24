# `procurement.purchase_returns`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds purchase returns records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | procurement.purchase_returns |
| Classification | Transactional |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_purchase_returns_created_by_users` |
| `dispatched_at` | `timestamp with time zone` | Yes | — | Time of dispatched | Support chronology, deadlines or audit evidence | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `reason` | `character varying(255)` | No | — | Inferred: stores reason for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `return_number` | `character varying(64)` | No | — | Inferred: stores return number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `supplier_id` | `uuid` | No | — | Reference linking this record to suppliers | Ensures related business data can be joined and validated | FK → `procurement.suppliers` via `fk_procurement_purchase_returns_supplier_id_suppliers` |
| `supplier_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.suppliers` via `fk_procurement_purchase_returns_supplier_id_suppliers_numeric` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_purchase_returns_updated_by_users` |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_procurement_purchase_returns_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_procurement_purchase_returns_warehouse_id_warehouses_numeric` |

## Record lifecycle and users

- **Created:** when the purchase returns business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.purchase_returns` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_procurement_purchase_returns_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_returns_supplier_id_suppliers | `supplier_id` | [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | `FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_returns_supplier_id_suppliers_numeric | `supplier_id_internal_id` | [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | `FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE RESTRICT` |
| fk_procurement_purchase_returns_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_returns_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_returns_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`procurement.purchase_return_items`](../../Tables/procurement/purchase_return_items.md) | fk_procurement_purchase_return_items_purchase_return_id_8f72 | `purchase_return_id_internal_id` | `internal_id` |
| [`procurement.purchase_return_items`](../../Tables/procurement/purchase_return_items.md) | fk_procurement_purchase_return_items_purchase_return_id_e7fa | `purchase_return_id` | `id` |

## `procurement.purchase_returns` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_purchase_returns_created_by_users` |
| `supplier_id` | `procurement.suppliers` | `fk_procurement_purchase_returns_supplier_id_suppliers` |
| `supplier_id_internal_id` | `procurement.suppliers` | `fk_procurement_purchase_returns_supplier_id_suppliers_numeric` |
| `updated_by` | `identity.users` | `fk_procurement_purchase_returns_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_procurement_purchase_returns_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_procurement_purchase_returns_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_procurement_purchase_returns_numeric_pair_supplier_id` | CHECK | `CHECK ((supplier_id IS NULL) = (supplier_id_internal_id IS NULL))` |
| `ck_procurement_purchase_returns_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_procurement_purchase_returns_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_procurement_purchase_returns_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_returns_supplier_id_suppliers` | FOREIGN KEY | `FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_returns_supplier_id_suppliers_numeric` | FOREIGN KEY | `FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_returns_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_returns_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_returns_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `pk_procurement_purchase_returns` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `purchase_return_number` | UNIQUE | `UNIQUE (return_number)` |
| `uq_procurement_purchase_returns_id` | UNIQUE | `UNIQUE (id)` |
| `purchase_returns_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `purchase_returns_id_not_null` | NOT NULL | `NOT NULL id` |
| `purchase_returns_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `purchase_returns_reason_not_null` | NOT NULL | `NOT NULL reason` |
| `purchase_returns_return_number_not_null` | NOT NULL | `NOT NULL return_number` |
| `purchase_returns_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `purchase_returns_status_not_null` | NOT NULL | `NOT NULL status` |
| `purchase_returns_supplier_id_internal_id_not_null` | NOT NULL | `NOT NULL supplier_id_internal_id` |
| `purchase_returns_supplier_id_not_null` | NOT NULL | `NOT NULL supplier_id` |
| `purchase_returns_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `purchase_returns_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL warehouse_id_internal_id` |
| `purchase_returns_warehouse_id_not_null` | NOT NULL | `NOT NULL warehouse_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_procurement_purchase_returns_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_purchase_returns_status ON procurement.purchase_returns USING btree (status)` |
| `ix_procurement_purchase_returns_supplier` | btree | `(supplier_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_purchase_returns_supplier ON procurement.purchase_returns USING btree (supplier_id)` |
| `ix_procurement_purchase_returns_warehouse` | btree | `(warehouse_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_purchase_returns_warehouse ON procurement.purchase_returns USING btree (warehouse_id)` |
| `pk_procurement_purchase_returns` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_procurement_purchase_returns ON procurement.purchase_returns USING btree (internal_id)` |
| `purchase_return_number` | btree | `(return_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX purchase_return_number ON procurement.purchase_returns USING btree (return_number)` |
| `uq_procurement_purchase_returns_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_procurement_purchase_returns_id ON procurement.purchase_returns USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_returns FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["supplier_id","supplier_id_internal_id","procurement","suppliers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.purchase_returns FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_returns FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["supplier_id","supplier_id_internal_id","procurement","suppliers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
