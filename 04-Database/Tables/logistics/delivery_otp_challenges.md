# `logistics.delivery_otp_challenges`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds delivery otp challenges records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | logistics.delivery_otp_challenges |
| Classification | Transactional |
| Proposed business write owner | Delivery_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 13 PK/FK/UQ/CHECK/exclusion constraints; 13 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 5 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `assignment_id` | `uuid` | No | — | Reference linking this record to delivery assignments | Ensures related business data can be joined and validated | FK → `logistics.delivery_assignments` via `fk_logistics_otp_assignment_shipment` |
| `assignment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.delivery_assignments` via `fk_logistics_otp_assignment_shipment_numeric` |
| `attempt_count` | `smallint` | No | `0` | Inferred: stores attempt count for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `expires_at` | `timestamp with time zone` | No | — | Expiration time | Determine validity windows | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `max_attempts` | `smallint` | No | `5` | Inferred: stores max attempts for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `otp_digest` | `character varying(255)` | No | — | Inferred: stores otp digest for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `shipment_id` | `uuid` | No | — | Reference linking this record to shipments | Ensures related business data can be joined and validated | FK → `logistics.shipments` via `fk_logistics_delivery_otp_challenges_shipment_id_shipments`; FK → `logistics.delivery_assignments` via `fk_logistics_otp_assignment_shipment` |
| `shipment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.shipments` via `fk_logistics_delivery_otp_challenges_shipment_id_shipme_04c6`; FK → `logistics.delivery_assignments` via `fk_logistics_otp_assignment_shipment_numeric` |
| `status` | `character varying(16)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `verified_at` | `timestamp with time zone` | Yes | — | Time of verified | Support chronology, deadlines or audit evidence | Exact constraints below |

## Record lifecycle and users

- **Created:** when the delivery otp challenges business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.delivery_otp_challenges` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_logistics_delivery_otp_challenges_shipment_id_shipme_04c6 | `shipment_id_internal_id` | [`logistics.shipments`](../../Tables/logistics/shipments.md) | `FOREIGN KEY (shipment_id_internal_id) REFERENCES logistics.shipments(internal_id) ON DELETE RESTRICT` |
| fk_logistics_delivery_otp_challenges_shipment_id_shipments | `shipment_id` | [`logistics.shipments`](../../Tables/logistics/shipments.md) | `FOREIGN KEY (shipment_id) REFERENCES logistics.shipments(id) ON DELETE RESTRICT` |
| fk_logistics_otp_assignment_shipment | `assignment_id, shipment_id` | [`logistics.delivery_assignments`](../../Tables/logistics/delivery_assignments.md) | `FOREIGN KEY (assignment_id, shipment_id) REFERENCES logistics.delivery_assignments(id, shipment_id) ON DELETE RESTRICT` |
| fk_logistics_otp_assignment_shipment_numeric | `assignment_id_internal_id, shipment_id_internal_id` | [`logistics.delivery_assignments`](../../Tables/logistics/delivery_assignments.md) | `FOREIGN KEY (assignment_id_internal_id, shipment_id_internal_id) REFERENCES logistics.delivery_assignments(internal_id, shipment_id_internal_id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `logistics.delivery_otp_challenges` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `shipment_id_internal_id` | `logistics.shipments` | `fk_logistics_delivery_otp_challenges_shipment_id_shipme_04c6` |
| `shipment_id` | `logistics.shipments` | `fk_logistics_delivery_otp_challenges_shipment_id_shipments` |
| `assignment_id, shipment_id` | `logistics.delivery_assignments` | `fk_logistics_otp_assignment_shipment` |
| `assignment_id_internal_id, shipment_id_internal_id` | `logistics.delivery_assignments` | `fk_logistics_otp_assignment_shipment_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_delivery_otp_challenges_attempt_count_range` | CHECK | `CHECK (attempt_count >= 0 AND attempt_count <= max_attempts)` |
| `ck_logistics_delivery_otp_challenges_deliveryotpstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['active'::text, 'verified'::text, 'expired'::text, 'locked'::text, 'cancelled'::text]))` |
| `ck_logistics_delivery_otp_challenges_expiry_after_created` | CHECK | `CHECK (expires_at > created_at)` |
| `ck_logistics_delivery_otp_challenges_max_attempts_range` | CHECK | `CHECK (max_attempts >= 1 AND max_attempts <= 10)` |
| `ck_logistics_delivery_otp_challenges_numeric_pair_assignment_id` | CHECK | `CHECK ((assignment_id IS NULL) = (assignment_id_internal_id IS NULL))` |
| `ck_logistics_delivery_otp_challenges_numeric_pair_shipment_id` | CHECK | `CHECK ((shipment_id IS NULL) = (shipment_id_internal_id IS NULL))` |
| `ck_logistics_delivery_otp_challenges_verified_timestamp` | CHECK | `CHECK (status::text <> 'verified'::text OR verified_at IS NOT NULL)` |
| `fk_logistics_delivery_otp_challenges_shipment_id_shipme_04c6` | FOREIGN KEY | `FOREIGN KEY (shipment_id_internal_id) REFERENCES logistics.shipments(internal_id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_otp_challenges_shipment_id_shipments` | FOREIGN KEY | `FOREIGN KEY (shipment_id) REFERENCES logistics.shipments(id) ON DELETE RESTRICT` |
| `fk_logistics_otp_assignment_shipment` | FOREIGN KEY | `FOREIGN KEY (assignment_id, shipment_id) REFERENCES logistics.delivery_assignments(id, shipment_id) ON DELETE RESTRICT` |
| `fk_logistics_otp_assignment_shipment_numeric` | FOREIGN KEY | `FOREIGN KEY (assignment_id_internal_id, shipment_id_internal_id) REFERENCES logistics.delivery_assignments(internal_id, shipment_id_internal_id) ON DELETE RESTRICT` |
| `pk_logistics_delivery_otp_challenges` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_logistics_delivery_otp_challenges_id` | UNIQUE | `UNIQUE (id)` |
| `delivery_otp_challenges_assignment_id_internal_id_not_null` | NOT NULL | `NOT NULL assignment_id_internal_id` |
| `delivery_otp_challenges_assignment_id_not_null` | NOT NULL | `NOT NULL assignment_id` |
| `delivery_otp_challenges_attempt_count_not_null` | NOT NULL | `NOT NULL attempt_count` |
| `delivery_otp_challenges_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `delivery_otp_challenges_expires_at_not_null` | NOT NULL | `NOT NULL expires_at` |
| `delivery_otp_challenges_id_not_null` | NOT NULL | `NOT NULL id` |
| `delivery_otp_challenges_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `delivery_otp_challenges_max_attempts_not_null` | NOT NULL | `NOT NULL max_attempts` |
| `delivery_otp_challenges_otp_digest_not_null` | NOT NULL | `NOT NULL otp_digest` |
| `delivery_otp_challenges_shipment_id_internal_id_not_null` | NOT NULL | `NOT NULL shipment_id_internal_id` |
| `delivery_otp_challenges_shipment_id_not_null` | NOT NULL | `NOT NULL shipment_id` |
| `delivery_otp_challenges_status_not_null` | NOT NULL | `NOT NULL status` |
| `delivery_otp_challenges_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_logistics_otp_assignment_time` | btree | `(assignment_id, created_at DESC)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_otp_assignment_time ON logistics.delivery_otp_challenges USING btree (assignment_id, created_at DESC)` |
| `ix_logistics_otp_expiry` | btree | `(status, expires_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_otp_expiry ON logistics.delivery_otp_challenges USING btree (status, expires_at)` |
| `pk_logistics_delivery_otp_challenges` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_logistics_delivery_otp_challenges ON logistics.delivery_otp_challenges USING btree (internal_id)` |
| `uq_logistics_delivery_otp_challenges_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_delivery_otp_challenges_id ON logistics.delivery_otp_challenges USING btree (id)` |
| `uq_logistics_otp_one_active` | btree | `(shipment_id)` | status::text = 'active'::text | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_otp_one_active ON logistics.delivery_otp_challenges USING btree (shipment_id) WHERE status::text = 'active'::text` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_otp_challenges FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["assignment_id","assignment_id_internal_id","logistics","delivery_assignments"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` | O |
| `otp_guard` | `CREATE TRIGGER otp_guard BEFORE INSERT OR UPDATE ON logistics.delivery_otp_challenges FOR EACH ROW EXECUTE FUNCTION logistics.guard_otp()` | O |
| `otp_outcome_audit` | `CREATE TRIGGER otp_outcome_audit AFTER INSERT OR UPDATE ON logistics.delivery_otp_challenges FOR EACH ROW EXECUTE FUNCTION logistics.audit_otp_outcome()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.delivery_otp_challenges FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('timestamp')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_otp_challenges FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["assignment_id","assignment_id_internal_id","logistics","delivery_assignments"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
