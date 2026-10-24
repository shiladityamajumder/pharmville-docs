# `logistics.delivery_routes`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds delivery routes records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | logistics.delivery_routes |
| Classification | Derived / Operational |
| Proposed business write owner | Delivery_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 10 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_delivery_routes_created_by_users` |
| `delivery_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_delivery_routes_delivery_user_id_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `route_date` | `date` | No | — | Inferred: stores route date for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `route_geometry` | `jsonb` | No | `'{}'::jsonb` | Structured route geometry information | Retain a versioned payload or relevant details | Exact constraints below |
| `route_number` | `character varying(64)` | No | — | Inferred: stores route number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'planned'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_delivery_routes_updated_by_users` |
| `vehicle_identifier` | `character varying(128)` | Yes | — | Inferred: stores vehicle identifier for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_logistics_delivery_routes_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_logistics_delivery_routes_warehouse_id_warehouses_numeric` |

## Record lifecycle and users

- **Created:** when the delivery routes business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.delivery_routes` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_logistics_delivery_routes_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_logistics_delivery_routes_delivery_user_id_users | `delivery_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (delivery_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_logistics_delivery_routes_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_logistics_delivery_routes_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| fk_logistics_delivery_routes_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`logistics.delivery_assignments`](../../Tables/logistics/delivery_assignments.md) | fk_logistics_delivery_assignments_route_id_delivery_rou_bb4c | `route_id_internal_id` | `internal_id` |
| [`logistics.delivery_assignments`](../../Tables/logistics/delivery_assignments.md) | fk_logistics_delivery_assignments_route_id_delivery_routes | `route_id` | `id` |

## `logistics.delivery_routes` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_logistics_delivery_routes_created_by_users` |
| `delivery_user_id` | `identity.users` | `fk_logistics_delivery_routes_delivery_user_id_users` |
| `updated_by` | `identity.users` | `fk_logistics_delivery_routes_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_logistics_delivery_routes_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_logistics_delivery_routes_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_delivery_routes_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_logistics_delivery_routes_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `delivery_route_number` | UNIQUE | `UNIQUE (route_number)` |
| `fk_logistics_delivery_routes_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_routes_delivery_user_id_users` | FOREIGN KEY | `FOREIGN KEY (delivery_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_logistics_delivery_routes_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_routes_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_routes_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `pk_logistics_delivery_routes` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_logistics_delivery_routes_id` | UNIQUE | `UNIQUE (id)` |
| `delivery_routes_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `delivery_routes_id_not_null` | NOT NULL | `NOT NULL id` |
| `delivery_routes_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `delivery_routes_route_date_not_null` | NOT NULL | `NOT NULL route_date` |
| `delivery_routes_route_geometry_not_null` | NOT NULL | `NOT NULL route_geometry` |
| `delivery_routes_route_number_not_null` | NOT NULL | `NOT NULL route_number` |
| `delivery_routes_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `delivery_routes_status_not_null` | NOT NULL | `NOT NULL status` |
| `delivery_routes_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `delivery_routes_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL warehouse_id_internal_id` |
| `delivery_routes_warehouse_id_not_null` | NOT NULL | `NOT NULL warehouse_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `delivery_route_number` | btree | `(route_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX delivery_route_number ON logistics.delivery_routes USING btree (route_number)` |
| `ix_logistics_delivery_routes_date_status` | btree | `(route_date, status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_delivery_routes_date_status ON logistics.delivery_routes USING btree (route_date, status)` |
| `ix_logistics_delivery_routes_warehouse` | btree | `(warehouse_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_delivery_routes_warehouse ON logistics.delivery_routes USING btree (warehouse_id)` |
| `pk_logistics_delivery_routes` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_logistics_delivery_routes ON logistics.delivery_routes USING btree (internal_id)` |
| `uq_logistics_delivery_routes_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_delivery_routes_id ON logistics.delivery_routes USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_routes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.delivery_routes FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_routes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
