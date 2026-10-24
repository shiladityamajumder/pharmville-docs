# `logistics.delivery_slots`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds delivery slots records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | logistics.delivery_slots |
| Classification | Derived / Operational |
| Proposed business write owner | Delivery_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 13 PK/FK/UQ/CHECK/exclusion constraints; 15 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `booked_count` | `integer` | No | `0` | Inferred: stores booked count for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `capacity` | `integer` | No | — | Inferred: stores capacity for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_delivery_slots_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_delivery_slots_deleted_by_users` |
| `ends_at` | `timestamp with time zone` | No | — | Time of ends | Support chronology, deadlines or audit evidence | Exact constraints below |
| `fee` | `numeric(14,2)` | No | `0` | Inferred: stores fee for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `postal_code` | `character varying(16)` | No | — | Code for postal | Link to controlled business classification or an external reference | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `service_date` | `date` | No | — | Inferred: stores service date for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `slot_code` | `character varying(64)` | No | — | Code for slot | Link to controlled business classification or an external reference | Collation: default |
| `starts_at` | `timestamp with time zone` | No | — | Time of starts | Support chronology, deadlines or audit evidence | Exact constraints below |
| `status` | `character varying(32)` | No | `'open'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_delivery_slots_updated_by_users` |
| `warehouse_id` | `uuid` | Yes | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_logistics_delivery_slots_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_logistics_delivery_slots_warehouse_id_warehouses_numeric` |

## Record lifecycle and users

- **Created:** when the delivery slots business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.delivery_slots` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_logistics_delivery_slots_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_logistics_delivery_slots_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_logistics_delivery_slots_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_logistics_delivery_slots_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE SET NULL` |
| fk_logistics_delivery_slots_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE SET NULL` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`logistics.shipments`](../../Tables/logistics/shipments.md) | fk_logistics_shipments_delivery_slot_id_delivery_slots | `delivery_slot_id` | `id` |
| [`logistics.shipments`](../../Tables/logistics/shipments.md) | fk_logistics_shipments_delivery_slot_id_delivery_slots_numeric | `delivery_slot_id_internal_id` | `internal_id` |

## `logistics.delivery_slots` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_logistics_delivery_slots_created_by_users` |
| `deleted_by` | `identity.users` | `fk_logistics_delivery_slots_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_logistics_delivery_slots_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_logistics_delivery_slots_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_logistics_delivery_slots_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_delivery_slots_booked_within_capacity` | CHECK | `CHECK (booked_count >= 0 AND booked_count <= capacity)` |
| `ck_logistics_delivery_slots_capacity_positive` | CHECK | `CHECK (capacity > 0)` |
| `ck_logistics_delivery_slots_finite_numeric_values` | CHECK | `CHECK (fee IS NULL OR (fee <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_logistics_delivery_slots_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_logistics_delivery_slots_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `delivery_slot` | UNIQUE | `UNIQUE (postal_code, service_date, slot_code)` |
| `fk_logistics_delivery_slots_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_slots_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_slots_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_slots_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE SET NULL` |
| `fk_logistics_delivery_slots_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE SET NULL` |
| `pk_logistics_delivery_slots` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_logistics_delivery_slots_id` | UNIQUE | `UNIQUE (id)` |
| `delivery_slots_booked_count_not_null` | NOT NULL | `NOT NULL booked_count` |
| `delivery_slots_capacity_not_null` | NOT NULL | `NOT NULL capacity` |
| `delivery_slots_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `delivery_slots_ends_at_not_null` | NOT NULL | `NOT NULL ends_at` |
| `delivery_slots_fee_not_null` | NOT NULL | `NOT NULL fee` |
| `delivery_slots_id_not_null` | NOT NULL | `NOT NULL id` |
| `delivery_slots_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `delivery_slots_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `delivery_slots_postal_code_not_null` | NOT NULL | `NOT NULL postal_code` |
| `delivery_slots_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `delivery_slots_service_date_not_null` | NOT NULL | `NOT NULL service_date` |
| `delivery_slots_slot_code_not_null` | NOT NULL | `NOT NULL slot_code` |
| `delivery_slots_starts_at_not_null` | NOT NULL | `NOT NULL starts_at` |
| `delivery_slots_status_not_null` | NOT NULL | `NOT NULL status` |
| `delivery_slots_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `delivery_slot` | btree | `(postal_code, service_date, slot_code)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX delivery_slot ON logistics.delivery_slots USING btree (postal_code, service_date, slot_code)` |
| `ix_logistics_delivery_slots_postal_date` | btree | `(postal_code, service_date)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_delivery_slots_postal_date ON logistics.delivery_slots USING btree (postal_code, service_date)` |
| `pk_logistics_delivery_slots` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_logistics_delivery_slots ON logistics.delivery_slots USING btree (internal_id)` |
| `uq_logistics_delivery_slots_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_delivery_slots_id ON logistics.delivery_slots USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_slots FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.delivery_slots FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_slots FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
