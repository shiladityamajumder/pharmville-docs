# `logistics.delivery_assignments`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds delivery assignments records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | logistics.delivery_assignments |
| Classification | Transactional |
| Proposed business write owner | Delivery_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 19 columns; 16 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 8 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `accepted_at` | `timestamp with time zone` | Yes | — | Time of accepted | Support chronology, deadlines or audit evidence | Exact constraints below |
| `assigned_at` | `timestamp with time zone` | No | `now()` | Time of assigned | Support chronology, deadlines or audit evidence | Exact constraints below |
| `completed_at` | `timestamp with time zone` | Yes | — | Time of completed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_delivery_assignments_created_by_users` |
| `delivery_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_delivery_assignments_delivery_user_id_users` |
| `ended_at` | `timestamp with time zone` | Yes | — | Time of ended | Support chronology, deadlines or audit evidence | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_current` | `boolean` | No | `true` | Yes/no flag for is current | Control conditional business behavior | Exact constraints below |
| `route_id` | `uuid` | Yes | — | Reference linking this record to delivery routes | Ensures related business data can be joined and validated | FK → `logistics.delivery_routes` via `fk_logistics_delivery_assignments_route_id_delivery_routes` |
| `route_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.delivery_routes` via `fk_logistics_delivery_assignments_route_id_delivery_rou_bb4c` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `sequence_no` | `integer` | Yes | — | Inferred: stores sequence no for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `shipment_id` | `uuid` | No | — | Reference linking this record to shipments | Ensures related business data can be joined and validated | FK → `logistics.shipments` via `fk_logistics_delivery_assignments_shipment_id_shipments` |
| `shipment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.shipments` via `fk_logistics_delivery_assignments_shipment_id_shipments_numeric` |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_delivery_assignments_updated_by_users` |

## Record lifecycle and users

- **Created:** when the delivery assignments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.delivery_assignments` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_logistics_delivery_assignments_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_logistics_delivery_assignments_delivery_user_id_users | `delivery_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (delivery_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_logistics_delivery_assignments_route_id_delivery_rou_bb4c | `route_id_internal_id` | [`logistics.delivery_routes`](../../Tables/logistics/delivery_routes.md) | `FOREIGN KEY (route_id_internal_id) REFERENCES logistics.delivery_routes(internal_id) ON DELETE SET NULL` |
| fk_logistics_delivery_assignments_route_id_delivery_routes | `route_id` | [`logistics.delivery_routes`](../../Tables/logistics/delivery_routes.md) | `FOREIGN KEY (route_id) REFERENCES logistics.delivery_routes(id) ON DELETE SET NULL` |
| fk_logistics_delivery_assignments_shipment_id_shipments | `shipment_id` | [`logistics.shipments`](../../Tables/logistics/shipments.md) | `FOREIGN KEY (shipment_id) REFERENCES logistics.shipments(id) ON DELETE CASCADE` |
| fk_logistics_delivery_assignments_shipment_id_shipments_numeric | `shipment_id_internal_id` | [`logistics.shipments`](../../Tables/logistics/shipments.md) | `FOREIGN KEY (shipment_id_internal_id) REFERENCES logistics.shipments(internal_id) ON DELETE CASCADE` |
| fk_logistics_delivery_assignments_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`logistics.delivery_location_updates`](../../Tables/logistics/delivery_location_updates.md) | fk_logistics_delivery_location_updates_assignment_id_de_1eb9 | `assignment_id_internal_id` | `internal_id` |
| [`logistics.delivery_location_updates`](../../Tables/logistics/delivery_location_updates.md) | fk_logistics_delivery_location_updates_assignment_id_de_dfbd | `assignment_id` | `id` |
| [`logistics.delivery_otp_challenges`](../../Tables/logistics/delivery_otp_challenges.md) | fk_logistics_otp_assignment_shipment | `assignment_id, shipment_id` | `id, shipment_id` |
| [`logistics.delivery_otp_challenges`](../../Tables/logistics/delivery_otp_challenges.md) | fk_logistics_otp_assignment_shipment_numeric | `assignment_id_internal_id, shipment_id_internal_id` | `internal_id, shipment_id_internal_id` |

## `logistics.delivery_assignments` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_logistics_delivery_assignments_created_by_users` |
| `delivery_user_id` | `identity.users` | `fk_logistics_delivery_assignments_delivery_user_id_users` |
| `route_id_internal_id` | `logistics.delivery_routes` | `fk_logistics_delivery_assignments_route_id_delivery_rou_bb4c` |
| `route_id` | `logistics.delivery_routes` | `fk_logistics_delivery_assignments_route_id_delivery_routes` |
| `shipment_id` | `logistics.shipments` | `fk_logistics_delivery_assignments_shipment_id_shipments` |
| `shipment_id_internal_id` | `logistics.shipments` | `fk_logistics_delivery_assignments_shipment_id_shipments_numeric` |
| `updated_by` | `identity.users` | `fk_logistics_delivery_assignments_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_delivery_assignments_current_period` | CHECK | `CHECK (is_current = (ended_at IS NULL))` |
| `ck_logistics_delivery_assignments_numeric_pair_route_id` | CHECK | `CHECK ((route_id IS NULL) = (route_id_internal_id IS NULL))` |
| `ck_logistics_delivery_assignments_numeric_pair_shipment_id` | CHECK | `CHECK ((shipment_id IS NULL) = (shipment_id_internal_id IS NULL))` |
| `ck_logistics_delivery_assignments_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_logistics_delivery_assignments_valid_period` | CHECK | `CHECK (ended_at IS NULL OR ended_at >= assigned_at)` |
| `fk_logistics_delivery_assignments_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_assignments_delivery_user_id_users` | FOREIGN KEY | `FOREIGN KEY (delivery_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_assignments_route_id_delivery_rou_bb4c` | FOREIGN KEY | `FOREIGN KEY (route_id_internal_id) REFERENCES logistics.delivery_routes(internal_id) ON DELETE SET NULL` |
| `fk_logistics_delivery_assignments_route_id_delivery_routes` | FOREIGN KEY | `FOREIGN KEY (route_id) REFERENCES logistics.delivery_routes(id) ON DELETE SET NULL` |
| `fk_logistics_delivery_assignments_shipment_id_shipments` | FOREIGN KEY | `FOREIGN KEY (shipment_id) REFERENCES logistics.shipments(id) ON DELETE CASCADE` |
| `fk_logistics_delivery_assignments_shipment_id_shipments_numeric` | FOREIGN KEY | `FOREIGN KEY (shipment_id_internal_id) REFERENCES logistics.shipments(internal_id) ON DELETE CASCADE` |
| `fk_logistics_delivery_assignments_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_logistics_delivery_assignments` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_logistics_delivery_assignments_id` | UNIQUE | `UNIQUE (id)` |
| `uq_logistics_delivery_assignments_id_shipment` | UNIQUE | `UNIQUE (id, shipment_id)` |
| `uq_numeric_logistics_delivery_assignments_internal_id_s_7b2c` | UNIQUE | `UNIQUE (internal_id, shipment_id_internal_id)` |
| `delivery_assignments_assigned_at_not_null` | NOT NULL | `NOT NULL assigned_at` |
| `delivery_assignments_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `delivery_assignments_delivery_user_id_not_null` | NOT NULL | `NOT NULL delivery_user_id` |
| `delivery_assignments_id_not_null` | NOT NULL | `NOT NULL id` |
| `delivery_assignments_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `delivery_assignments_is_current_not_null` | NOT NULL | `NOT NULL is_current` |
| `delivery_assignments_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `delivery_assignments_shipment_id_internal_id_not_null` | NOT NULL | `NOT NULL shipment_id_internal_id` |
| `delivery_assignments_shipment_id_not_null` | NOT NULL | `NOT NULL shipment_id` |
| `delivery_assignments_status_not_null` | NOT NULL | `NOT NULL status` |
| `delivery_assignments_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_logistics_delivery_assignments_route` | btree | `(route_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_delivery_assignments_route ON logistics.delivery_assignments USING btree (route_id)` |
| `ix_logistics_delivery_assignments_shipment_time` | btree | `(shipment_id, assigned_at DESC)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_delivery_assignments_shipment_time ON logistics.delivery_assignments USING btree (shipment_id, assigned_at DESC)` |
| `ix_logistics_delivery_assignments_user_status` | btree | `(delivery_user_id, status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_delivery_assignments_user_status ON logistics.delivery_assignments USING btree (delivery_user_id, status)` |
| `pk_logistics_delivery_assignments` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_logistics_delivery_assignments ON logistics.delivery_assignments USING btree (internal_id)` |
| `uq_logistics_delivery_assignments_current` | btree | `(shipment_id)` | is_current = true | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_delivery_assignments_current ON logistics.delivery_assignments USING btree (shipment_id) WHERE is_current = true` |
| `uq_logistics_delivery_assignments_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_delivery_assignments_id ON logistics.delivery_assignments USING btree (id)` |
| `uq_logistics_delivery_assignments_id_shipment` | btree | `(id, shipment_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_delivery_assignments_id_shipment ON logistics.delivery_assignments USING btree (id, shipment_id)` |
| `uq_numeric_logistics_delivery_assignments_internal_id_s_7b2c` | btree | `(internal_id, shipment_id_internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_numeric_logistics_delivery_assignments_internal_id_s_7b2c ON logistics.delivery_assignments USING btree (internal_id, shipment_id_internal_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_assignments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["route_id","route_id_internal_id","logistics","delivery_routes"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` | O |
| `assignment_history_guard` | `CREATE TRIGGER assignment_history_guard BEFORE INSERT OR DELETE OR UPDATE ON logistics.delivery_assignments FOR EACH ROW EXECUTE FUNCTION logistics.guard_assignment_history()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.delivery_assignments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_assignments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["route_id","route_id_internal_id","logistics","delivery_routes"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
