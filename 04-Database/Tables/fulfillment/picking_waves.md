# `fulfillment.picking_waves`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds picking waves records within the fulfillment domain (picking, packing, and shipment preparation). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | fulfillment.picking_waves |
| Classification | Derived / Operational |
| Proposed business write owner | Store_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 11 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `completed_at` | `timestamp with time zone` | Yes | — | Time of completed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_fulfillment_picking_waves_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `released_at` | `timestamp with time zone` | Yes | — | Time of released | Support chronology, deadlines or audit evidence | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'created'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `strategy` | `character varying(32)` | No | `'order'::character varying` | Inferred: stores strategy for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_fulfillment_picking_waves_updated_by_users` |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_fulfillment_picking_waves_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_fulfillment_picking_waves_warehouse_id_warehouses_numeric` |
| `wave_number` | `character varying(64)` | No | — | Inferred: stores wave number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the picking waves business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Order_Operations, Store_Operations, Warehouse, Delivery_Operations. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `fulfillment.picking_waves` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_fulfillment_picking_waves_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_fulfillment_picking_waves_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_fulfillment_picking_waves_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| fk_fulfillment_picking_waves_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | fk_domain_fulfillment_fulfillment_orders_wave_id | `wave_id, warehouse_id` | `id, warehouse_id` |
| [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | fk_domain_fulfillment_fulfillment_orders_wave_id_numeric | `wave_id_internal_id, warehouse_id_internal_id` | `internal_id, warehouse_id_internal_id` |
| [`fulfillment.pick_tasks`](../../Tables/fulfillment/pick_tasks.md) | fk_fulfillment_pick_tasks_wave_id_picking_waves | `wave_id` | `id` |
| [`fulfillment.pick_tasks`](../../Tables/fulfillment/pick_tasks.md) | fk_fulfillment_pick_tasks_wave_id_picking_waves_numeric | `wave_id_internal_id` | `internal_id` |
| [`fulfillment.picking_wave_orders`](../../Tables/fulfillment/picking_wave_orders.md) | fk_fulfillment_picking_wave_orders_wave_id_picking_wave_c16a | `wave_id_internal_id` | `internal_id` |
| [`fulfillment.picking_wave_orders`](../../Tables/fulfillment/picking_wave_orders.md) | fk_fulfillment_picking_wave_orders_wave_id_picking_waves | `wave_id` | `id` |

## `fulfillment.picking_waves` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_fulfillment_picking_waves_created_by_users` |
| `updated_by` | `identity.users` | `fk_fulfillment_picking_waves_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_fulfillment_picking_waves_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_fulfillment_picking_waves_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_fulfillment_picking_waves_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_fulfillment_picking_waves_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_fulfillment_picking_waves_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_fulfillment_picking_waves_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_fulfillment_picking_waves_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_fulfillment_picking_waves_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `picking_wave_number` | UNIQUE | `UNIQUE (wave_number)` |
| `pk_fulfillment_picking_waves` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_fulfillment_picking_waves_id` | UNIQUE | `UNIQUE (id)` |
| `uq_numeric_fulfillment_picking_waves_internal_id_wareho_a2bf` | UNIQUE | `UNIQUE (internal_id, warehouse_id_internal_id)` |
| `uq_scope_fulfillment_picking_waves_warehouse_id` | UNIQUE | `UNIQUE (id, warehouse_id)` |
| `picking_waves_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `picking_waves_id_not_null` | NOT NULL | `NOT NULL id` |
| `picking_waves_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `picking_waves_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `picking_waves_status_not_null` | NOT NULL | `NOT NULL status` |
| `picking_waves_strategy_not_null` | NOT NULL | `NOT NULL strategy` |
| `picking_waves_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `picking_waves_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL warehouse_id_internal_id` |
| `picking_waves_warehouse_id_not_null` | NOT NULL | `NOT NULL warehouse_id` |
| `picking_waves_wave_number_not_null` | NOT NULL | `NOT NULL wave_number` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_fulfillment_picking_waves_warehouse_status` | btree | `(warehouse_id, status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_fulfillment_picking_waves_warehouse_status ON fulfillment.picking_waves USING btree (warehouse_id, status)` |
| `picking_wave_number` | btree | `(wave_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX picking_wave_number ON fulfillment.picking_waves USING btree (wave_number)` |
| `pk_fulfillment_picking_waves` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_fulfillment_picking_waves ON fulfillment.picking_waves USING btree (internal_id)` |
| `uq_fulfillment_picking_waves_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_fulfillment_picking_waves_id ON fulfillment.picking_waves USING btree (id)` |
| `uq_numeric_fulfillment_picking_waves_internal_id_wareho_a2bf` | btree | `(internal_id, warehouse_id_internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_numeric_fulfillment_picking_waves_internal_id_wareho_a2bf ON fulfillment.picking_waves USING btree (internal_id, warehouse_id_internal_id)` |
| `uq_scope_fulfillment_picking_waves_warehouse_id` | btree | `(id, warehouse_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_scope_fulfillment_picking_waves_warehouse_id ON fulfillment.picking_waves USING btree (id, warehouse_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.picking_waves FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON fulfillment.picking_waves FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.picking_waves FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
