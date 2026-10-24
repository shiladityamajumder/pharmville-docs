# `warehouse.inventory_adjustments`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds inventory adjustments records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | warehouse.inventory_adjustments |
| Classification | Transactional |
| Proposed business write owner | Inventory |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 16 columns; 13 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `adjustment_number` | `character varying(64)` | No | — | Inferred: stores adjustment number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `approved_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_inventory_adjustments_approved_by_user_id_users` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_inventory_adjustments_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `posted_at` | `timestamp with time zone` | Yes | — | Time of posted | Support chronology, deadlines or audit evidence | Exact constraints below |
| `reason_code` | `character varying(64)` | No | — | Reference linking this record to stock movement reason codes | Ensures related business data can be joined and validated | FK → `warehouse.stock_movement_reason_codes` via `fk_warehouse_inventory_adjustments_controlled_reason`; Collation: default |
| `reason_code_id` | `bigint` | Yes | — | Reference linking this record to stock movement reason codes | Ensures related business data can be joined and validated | FK → `warehouse.stock_movement_reason_codes` via `fk_warehouse_inventory_adjustments_controlled_reason` |
| `requested_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_inventory_adjustments_requested_by_user_id_users` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'draft'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_inventory_adjustments_updated_by_users` |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_warehouse_inventory_adjustments_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_warehouse_inventory_adjustments_warehouse_id_warehou_bdcd` |

## Record lifecycle and users

- **Created:** when the inventory adjustments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.inventory_adjustments` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_warehouse_inventory_adjustments_approved_by_user_id_users | `approved_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_inventory_adjustments_controlled_reason | `reason_code_id, reason_code` | [`warehouse.stock_movement_reason_codes`](../../Tables/warehouse/stock_movement_reason_codes.md) | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES warehouse.stock_movement_reason_codes(id, code) ON DELETE RESTRICT` |
| fk_warehouse_inventory_adjustments_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_inventory_adjustments_requested_by_user_id_users | `requested_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_inventory_adjustments_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_inventory_adjustments_warehouse_id_warehou_bdcd | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_inventory_adjustments_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`warehouse.inventory_adjustment_items`](../../Tables/warehouse/inventory_adjustment_items.md) | fk_warehouse_inventory_adjustment_items_adjustment_id_i_ba31 | `adjustment_id_internal_id` | `internal_id` |
| [`warehouse.inventory_adjustment_items`](../../Tables/warehouse/inventory_adjustment_items.md) | fk_warehouse_inventory_adjustment_items_adjustment_id_i_bfdf | `adjustment_id` | `id` |

## `warehouse.inventory_adjustments` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `approved_by_user_id` | `identity.users` | `fk_warehouse_inventory_adjustments_approved_by_user_id_users` |
| `reason_code_id, reason_code` | `warehouse.stock_movement_reason_codes` | `fk_warehouse_inventory_adjustments_controlled_reason` |
| `created_by` | `identity.users` | `fk_warehouse_inventory_adjustments_created_by_users` |
| `requested_by_user_id` | `identity.users` | `fk_warehouse_inventory_adjustments_requested_by_user_id_users` |
| `updated_by` | `identity.users` | `fk_warehouse_inventory_adjustments_updated_by_users` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_inventory_adjustments_warehouse_id_warehou_bdcd` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_inventory_adjustments_warehouse_id_warehouses` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `adjustment_number` | UNIQUE | `UNIQUE (adjustment_number)` |
| `ck_warehouse_inventory_adjustments_controlled_reason_pair` | CHECK | `CHECK (reason_code_id IS NULL OR reason_code IS NOT NULL)` |
| `ck_warehouse_inventory_adjustments_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_inventory_adjustments_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_warehouse_inventory_adjustments_approved_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_adjustments_controlled_reason` | FOREIGN KEY | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES warehouse.stock_movement_reason_codes(id, code) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_adjustments_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_adjustments_requested_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_adjustments_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_adjustments_warehouse_id_warehou_bdcd` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_adjustments_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `pk_warehouse_inventory_adjustments` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_warehouse_inventory_adjustments_id` | UNIQUE | `UNIQUE (id)` |
| `inventory_adjustments_adjustment_number_not_null` | NOT NULL | `NOT NULL adjustment_number` |
| `inventory_adjustments_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `inventory_adjustments_id_not_null` | NOT NULL | `NOT NULL id` |
| `inventory_adjustments_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `inventory_adjustments_reason_code_not_null` | NOT NULL | `NOT NULL reason_code` |
| `inventory_adjustments_requested_by_user_id_not_null` | NOT NULL | `NOT NULL requested_by_user_id` |
| `inventory_adjustments_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `inventory_adjustments_status_not_null` | NOT NULL | `NOT NULL status` |
| `inventory_adjustments_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `inventory_adjustments_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL warehouse_id_internal_id` |
| `inventory_adjustments_warehouse_id_not_null` | NOT NULL | `NOT NULL warehouse_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `adjustment_number` | btree | `(adjustment_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX adjustment_number ON warehouse.inventory_adjustments USING btree (adjustment_number)` |
| `ix_warehouse_adjustments_warehouse_status` | btree | `(warehouse_id, status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_adjustments_warehouse_status ON warehouse.inventory_adjustments USING btree (warehouse_id, status)` |
| `pk_warehouse_inventory_adjustments` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_warehouse_inventory_adjustments ON warehouse.inventory_adjustments USING btree (internal_id)` |
| `uq_warehouse_inventory_adjustments_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_inventory_adjustments_id ON warehouse.inventory_adjustments USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.inventory_adjustments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `controlled_reason` | `CREATE TRIGGER controlled_reason BEFORE INSERT OR UPDATE ON warehouse.inventory_adjustments FOR EACH ROW EXECUTE FUNCTION platform.normalize_reason('warehouse.stock_movement_reason_codes')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.inventory_adjustments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.inventory_adjustments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
