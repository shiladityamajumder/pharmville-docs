# `logistics.delivery_location_updates`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds delivery location updates records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | logistics.delivery_location_updates |
| Classification | Audit / History |
| Proposed business write owner | Delivery_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 13 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `accuracy_m` | `numeric(9,2)` | Yes | — | Inferred: stores accuracy m for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `assignment_id` | `uuid` | No | — | Reference linking this record to delivery assignments | Ensures related business data can be joined and validated | FK → `logistics.delivery_assignments` via `fk_logistics_delivery_location_updates_assignment_id_de_dfbd` |
| `assignment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.delivery_assignments` via `fk_logistics_delivery_location_updates_assignment_id_de_1eb9` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `delivery_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_delivery_location_updates_delivery_user_id_users`; FK → `logistics.rider_shifts` via `fk_logistics_location_shift_rider` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `latitude` | `numeric(10,7)` | No | — | Inferred: stores latitude for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `longitude` | `numeric(10,7)` | No | — | Inferred: stores longitude for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `received_at` | `timestamp with time zone` | No | `now()` | Time of received | Support chronology, deadlines or audit evidence | Exact constraints below |
| `recorded_at` | `timestamp with time zone` | No | — | Time of recorded | Support chronology, deadlines or audit evidence | Exact constraints below |
| `shift_id` | `bigint` | Yes | — | Reference linking this record to rider shifts | Ensures related business data can be joined and validated | FK → `logistics.rider_shifts` via `fk_logistics_location_shift_rider` |
| `source` | `character varying(16)` | No | `'rider'::character varying` | Inferred: stores source for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the delivery location updates business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.delivery_location_updates` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_logistics_delivery_location_updates_assignment_id_de_1eb9 | `assignment_id_internal_id` | [`logistics.delivery_assignments`](../../Tables/logistics/delivery_assignments.md) | `FOREIGN KEY (assignment_id_internal_id) REFERENCES logistics.delivery_assignments(internal_id) ON DELETE RESTRICT` |
| fk_logistics_delivery_location_updates_assignment_id_de_dfbd | `assignment_id` | [`logistics.delivery_assignments`](../../Tables/logistics/delivery_assignments.md) | `FOREIGN KEY (assignment_id) REFERENCES logistics.delivery_assignments(id) ON DELETE RESTRICT` |
| fk_logistics_delivery_location_updates_delivery_user_id_users | `delivery_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (delivery_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_logistics_location_shift_rider | `shift_id, delivery_user_id` | [`logistics.rider_shifts`](../../Tables/logistics/rider_shifts.md) | `FOREIGN KEY (shift_id, delivery_user_id) REFERENCES logistics.rider_shifts(id, rider_user_id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `logistics.delivery_location_updates` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `assignment_id_internal_id` | `logistics.delivery_assignments` | `fk_logistics_delivery_location_updates_assignment_id_de_1eb9` |
| `assignment_id` | `logistics.delivery_assignments` | `fk_logistics_delivery_location_updates_assignment_id_de_dfbd` |
| `delivery_user_id` | `identity.users` | `fk_logistics_delivery_location_updates_delivery_user_id_users` |
| `shift_id, delivery_user_id` | `logistics.rider_shifts` | `fk_logistics_location_shift_rider` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_delivery_location_updates_accuracy_nonnegative` | CHECK | `CHECK (accuracy_m IS NULL OR accuracy_m >= 0::numeric)` |
| `ck_logistics_delivery_location_updates_finite_numeric_values` | CHECK | `CHECK ((latitude IS NULL OR (latitude <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (longitude IS NULL OR (longitude <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (accuracy_m IS NULL OR (accuracy_m <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_logistics_delivery_location_updates_latitude_range` | CHECK | `CHECK (latitude >= '-90'::integer::numeric AND latitude <= 90::numeric)` |
| `ck_logistics_delivery_location_updates_longitude_range` | CHECK | `CHECK (longitude >= '-180'::integer::numeric AND longitude <= 180::numeric)` |
| `ck_logistics_delivery_location_updates_numeric_pair_ass_f01e` | CHECK | `CHECK ((assignment_id IS NULL) = (assignment_id_internal_id IS NULL))` |
| `ck_logistics_delivery_location_updates_source` | CHECK | `CHECK (source::text = ANY (ARRAY['rider'::text, 'carrier'::text]))` |
| `fk_logistics_delivery_location_updates_assignment_id_de_1eb9` | FOREIGN KEY | `FOREIGN KEY (assignment_id_internal_id) REFERENCES logistics.delivery_assignments(internal_id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_location_updates_assignment_id_de_dfbd` | FOREIGN KEY | `FOREIGN KEY (assignment_id) REFERENCES logistics.delivery_assignments(id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_location_updates_delivery_user_id_users` | FOREIGN KEY | `FOREIGN KEY (delivery_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_location_shift_rider` | FOREIGN KEY | `FOREIGN KEY (shift_id, delivery_user_id) REFERENCES logistics.rider_shifts(id, rider_user_id) ON DELETE RESTRICT` |
| `pk_logistics_delivery_location_updates` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_logistics_delivery_location_updates_id` | UNIQUE | `UNIQUE (id)` |
| `delivery_location_updates_assignment_id_internal_id_not_null` | NOT NULL | `NOT NULL assignment_id_internal_id` |
| `delivery_location_updates_assignment_id_not_null` | NOT NULL | `NOT NULL assignment_id` |
| `delivery_location_updates_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `delivery_location_updates_delivery_user_id_not_null` | NOT NULL | `NOT NULL delivery_user_id` |
| `delivery_location_updates_id_not_null` | NOT NULL | `NOT NULL id` |
| `delivery_location_updates_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `delivery_location_updates_latitude_not_null` | NOT NULL | `NOT NULL latitude` |
| `delivery_location_updates_longitude_not_null` | NOT NULL | `NOT NULL longitude` |
| `delivery_location_updates_received_at_not_null` | NOT NULL | `NOT NULL received_at` |
| `delivery_location_updates_recorded_at_not_null` | NOT NULL | `NOT NULL recorded_at` |
| `delivery_location_updates_source_not_null` | NOT NULL | `NOT NULL source` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_logistics_location_assignment_time` | btree | `(assignment_id, recorded_at DESC)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_location_assignment_time ON logistics.delivery_location_updates USING btree (assignment_id, recorded_at DESC)` |
| `ix_logistics_location_user_time` | btree | `(delivery_user_id, recorded_at DESC)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_location_user_time ON logistics.delivery_location_updates USING btree (delivery_user_id, recorded_at DESC)` |
| `pk_logistics_delivery_location_updates` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_logistics_delivery_location_updates ON logistics.delivery_location_updates USING btree (internal_id)` |
| `uq_logistics_delivery_location_updates_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_delivery_location_updates_id ON logistics.delivery_location_updates USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_location_updates FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["assignment_id","assignment_id_internal_id","logistics","delivery_assignments"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON logistics.delivery_location_updates FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `location_guard` | `CREATE TRIGGER location_guard BEFORE INSERT ON logistics.delivery_location_updates FOR EACH ROW EXECUTE FUNCTION logistics.guard_location()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_location_updates FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["assignment_id","assignment_id_internal_id","logistics","delivery_assignments"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
