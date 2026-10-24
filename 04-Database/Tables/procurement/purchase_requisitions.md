# `procurement.purchase_requisitions`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds purchase requisitions records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | procurement.purchase_requisitions |
| Classification | Transactional |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 10 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_purchase_requisitions_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `notes` | `text` | Yes | — | Inferred: stores notes for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `priority` | `character varying(16)` | No | `'normal'::character varying` | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `requested_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_purchase_requisitions_requested_by_user_id_users` |
| `required_by` | `date` | Yes | — | Actor associated with required | Record responsibility for the change | Exact constraints below |
| `requisition_number` | `character varying(64)` | No | — | Inferred: stores requisition number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'draft'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_purchase_requisitions_updated_by_users` |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_procurement_purchase_requisitions_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_procurement_purchase_requisitions_warehouse_id_wareh_cf7d` |

## Record lifecycle and users

- **Created:** when the purchase requisitions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.purchase_requisitions` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_procurement_purchase_requisitions_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_requisitions_requested_by_user_id_users | `requested_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_requisitions_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_requisitions_warehouse_id_wareh_cf7d | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| fk_procurement_purchase_requisitions_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`procurement.purchase_orders`](../../Tables/procurement/purchase_orders.md) | fk_procurement_purchase_orders_requisition_id_purchase__59c2 | `requisition_id` | `id` |
| [`procurement.purchase_orders`](../../Tables/procurement/purchase_orders.md) | fk_procurement_purchase_orders_requisition_id_purchase__ce28 | `requisition_id_internal_id` | `internal_id` |
| [`procurement.purchase_requisition_items`](../../Tables/procurement/purchase_requisition_items.md) | fk_procurement_purchase_requisition_items_requisition_i_527b | `requisition_id` | `id` |
| [`procurement.purchase_requisition_items`](../../Tables/procurement/purchase_requisition_items.md) | fk_procurement_purchase_requisition_items_requisition_i_84f9 | `requisition_id_internal_id` | `internal_id` |

## `procurement.purchase_requisitions` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_purchase_requisitions_created_by_users` |
| `requested_by_user_id` | `identity.users` | `fk_procurement_purchase_requisitions_requested_by_user_id_users` |
| `updated_by` | `identity.users` | `fk_procurement_purchase_requisitions_updated_by_users` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_procurement_purchase_requisitions_warehouse_id_wareh_cf7d` |
| `warehouse_id` | `warehouse.warehouses` | `fk_procurement_purchase_requisitions_warehouse_id_warehouses` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_procurement_purchase_requisitions_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_procurement_purchase_requisitions_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_procurement_purchase_requisitions_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_requisitions_requested_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_requisitions_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_requisitions_warehouse_id_wareh_cf7d` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_requisitions_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `pk_procurement_purchase_requisitions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `requisition_number` | UNIQUE | `UNIQUE (requisition_number)` |
| `uq_procurement_purchase_requisitions_id` | UNIQUE | `UNIQUE (id)` |
| `purchase_requisitions_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `purchase_requisitions_id_not_null` | NOT NULL | `NOT NULL id` |
| `purchase_requisitions_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `purchase_requisitions_priority_not_null` | NOT NULL | `NOT NULL priority` |
| `purchase_requisitions_requested_by_user_id_not_null` | NOT NULL | `NOT NULL requested_by_user_id` |
| `purchase_requisitions_requisition_number_not_null` | NOT NULL | `NOT NULL requisition_number` |
| `purchase_requisitions_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `purchase_requisitions_status_not_null` | NOT NULL | `NOT NULL status` |
| `purchase_requisitions_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `purchase_requisitions_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL warehouse_id_internal_id` |
| `purchase_requisitions_warehouse_id_not_null` | NOT NULL | `NOT NULL warehouse_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_procurement_requisitions_warehouse_status` | btree | `(warehouse_id, status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_requisitions_warehouse_status ON procurement.purchase_requisitions USING btree (warehouse_id, status)` |
| `pk_procurement_purchase_requisitions` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_procurement_purchase_requisitions ON procurement.purchase_requisitions USING btree (internal_id)` |
| `requisition_number` | btree | `(requisition_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX requisition_number ON procurement.purchase_requisitions USING btree (requisition_number)` |
| `uq_procurement_purchase_requisitions_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_procurement_purchase_requisitions_id ON procurement.purchase_requisitions USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_requisitions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.purchase_requisitions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_requisitions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
