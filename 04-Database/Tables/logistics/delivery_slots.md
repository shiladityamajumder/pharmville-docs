# logistics.delivery_slots

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds delivery slots records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 13 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `booked_count` | `integer` | No | `0` | Inferred: stores booked count for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `capacity` | `integer` | No | — | Inferred: stores capacity for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_delivery_slots_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_delivery_slots_deleted_by_users) |
| `ends_at` | `timestamp with time zone` | No | — | Time of ends | Support chronology, deadlines or audit evidence | See exact constraints |
| `fee` | `numeric(14,2)` | No | `0` | Inferred: stores fee for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `postal_code` | `character varying(16)` | No | — | Code for postal | Link to controlled business classification or an external reference | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `service_date` | `date` | No | — | Inferred: stores service date for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `slot_code` | `character varying(64)` | No | — | Code for slot | Link to controlled business classification or an external reference | See exact constraints |
| `starts_at` | `timestamp with time zone` | No | — | Time of starts | Support chronology, deadlines or audit evidence | See exact constraints |
| `status` | `character varying(32)` | No | `'open'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_delivery_slots_updated_by_users) |
| `warehouse_id` | `uuid` | Yes | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_logistics_delivery_slots_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_logistics_delivery_slots_warehouse_id_warehouses_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the delivery slots business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.delivery_slots` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_logistics_delivery_slots_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_logistics_delivery_slots_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_logistics_delivery_slots_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_logistics_delivery_slots_warehouse_id_warehouses`; FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE SET NULL
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_logistics_delivery_slots_warehouse_id_warehouses_numeric`; FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE SET NULL

**Referenced by 2 FK constraints** (sample): `logistics.shipments`, `logistics.shipments`.

## logistics.delivery_slots — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 21 columns, 13 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_logistics_delivery_slots_created_by_users` |
| `deleted_by` | `identity.users` | `fk_logistics_delivery_slots_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_logistics_delivery_slots_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_logistics_delivery_slots_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_logistics_delivery_slots_warehouse_id_warehouses_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `delivery_slot` | `CREATE UNIQUE INDEX delivery_slot ON logistics.delivery_slots USING btree (postal_code, service_date, slot_code)` |
| `ix_logistics_delivery_slots_postal_date` | `CREATE INDEX ix_logistics_delivery_slots_postal_date ON logistics.delivery_slots USING btree (postal_code, service_date)` |
| `pk_logistics_delivery_slots` | `CREATE UNIQUE INDEX pk_logistics_delivery_slots ON logistics.delivery_slots USING btree (internal_id)` |
| `uq_logistics_delivery_slots_id` | `CREATE UNIQUE INDEX uq_logistics_delivery_slots_id ON logistics.delivery_slots USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_slots FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.delivery_slots FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_slots FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
