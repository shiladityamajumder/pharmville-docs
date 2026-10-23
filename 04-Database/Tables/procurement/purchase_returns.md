# procurement.purchase_returns

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds purchase returns records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 12 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_purchase_returns_created_by_users) |
| `dispatched_at` | `timestamp with time zone` | Yes | — | Time of dispatched | Support chronology, deadlines or audit evidence | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `reason` | `character varying(255)` | No | — | Inferred: stores reason for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `return_number` | `character varying(64)` | No | — | Inferred: stores return number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `supplier_id` | `uuid` | No | — | Reference linking this record to suppliers | Ensures related business data can be joined and validated | FK → `procurement.suppliers` (fk_procurement_purchase_returns_supplier_id_suppliers) |
| `supplier_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.suppliers` (fk_procurement_purchase_returns_supplier_id_suppliers_numeric); Numeric/public-key pair verification required |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_purchase_returns_updated_by_users) |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_procurement_purchase_returns_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_procurement_purchase_returns_warehouse_id_warehouses_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the purchase returns business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.purchase_returns` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_procurement_purchase_returns_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_procurement_purchase_returns_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `supplier_id` → `procurement.suppliers(id)` via `fk_procurement_purchase_returns_supplier_id_suppliers`; FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE RESTRICT
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_procurement_purchase_returns_warehouse_id_warehouses`; FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT
- `supplier_id_internal_id` → `procurement.suppliers(internal_id)` via `fk_procurement_purchase_returns_supplier_id_suppliers_numeric`; FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE RESTRICT
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_procurement_purchase_returns_warehouse_id_warehouses_numeric`; FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT

**Referenced by 2 FK constraints** (sample): `procurement.purchase_return_items`, `procurement.purchase_return_items`.

## procurement.purchase_returns — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 15 columns, 12 constraints, 6 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_purchase_returns_created_by_users` |
| `updated_by` | `identity.users` | `fk_procurement_purchase_returns_updated_by_users` |
| `supplier_id` | `procurement.suppliers` | `fk_procurement_purchase_returns_supplier_id_suppliers` |
| `warehouse_id` | `warehouse.warehouses` | `fk_procurement_purchase_returns_warehouse_id_warehouses` |
| `supplier_id_internal_id` | `procurement.suppliers` | `fk_procurement_purchase_returns_supplier_id_suppliers_numeric` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_procurement_purchase_returns_warehouse_id_warehouses_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_procurement_purchase_returns_status` | `CREATE INDEX ix_procurement_purchase_returns_status ON procurement.purchase_returns USING btree (status)` |
| `ix_procurement_purchase_returns_supplier` | `CREATE INDEX ix_procurement_purchase_returns_supplier ON procurement.purchase_returns USING btree (supplier_id)` |
| `ix_procurement_purchase_returns_warehouse` | `CREATE INDEX ix_procurement_purchase_returns_warehouse ON procurement.purchase_returns USING btree (warehouse_id)` |
| `pk_procurement_purchase_returns` | `CREATE UNIQUE INDEX pk_procurement_purchase_returns ON procurement.purchase_returns USING btree (internal_id)` |
| `purchase_return_number` | `CREATE UNIQUE INDEX purchase_return_number ON procurement.purchase_returns USING btree (return_number)` |
| `uq_procurement_purchase_returns_id` | `CREATE UNIQUE INDEX uq_procurement_purchase_returns_id ON procurement.purchase_returns USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_returns FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["supplier_id","supplier_id_internal_id","procurement","suppliers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.purchase_returns FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_returns FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["supplier_id","supplier_id_internal_id","procurement","suppliers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
