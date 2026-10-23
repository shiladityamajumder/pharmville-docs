# logistics.delivery_otp_challenges

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds delivery otp challenges records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 13 constraints, 5 indexes, 5 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `assignment_id` | `uuid` | No | — | Reference linking this record to delivery assignments | Ensures related business data can be joined and validated | FK → `logistics.delivery_assignments` (fk_logistics_otp_assignment_shipment) |
| `assignment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.delivery_assignments` (fk_logistics_otp_assignment_shipment_numeric); Numeric/public-key pair verification required |
| `attempt_count` | `smallint` | No | `0` | Inferred: stores attempt count for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `expires_at` | `timestamp with time zone` | No | — | Expiration time | Determine validity windows | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `max_attempts` | `smallint` | No | `5` | Inferred: stores max attempts for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `otp_digest` | `character varying(255)` | No | — | Inferred: stores otp digest for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `shipment_id` | `uuid` | No | — | Reference linking this record to shipments | Ensures related business data can be joined and validated | FK → `logistics.shipments` (fk_logistics_delivery_otp_challenges_shipment_id_shipments); FK → `logistics.delivery_assignments` (fk_logistics_otp_assignment_shipment) |
| `shipment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.shipments` (fk_logistics_delivery_otp_challenges_shipment_id_shipme_04c6); FK → `logistics.delivery_assignments` (fk_logistics_otp_assignment_shipment_numeric); Numeric/public-key pair verification required |
| `status` | `character varying(16)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `verified_at` | `timestamp with time zone` | Yes | — | Time of verified | Support chronology, deadlines or audit evidence | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the delivery otp challenges business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.delivery_otp_challenges` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `shipment_id` → `logistics.shipments(id)` via `fk_logistics_delivery_otp_challenges_shipment_id_shipments`; FOREIGN KEY (shipment_id) REFERENCES logistics.shipments(id) ON DELETE RESTRICT
- `assignment_id, shipment_id` → `logistics.delivery_assignments(id, shipment_id)` via `fk_logistics_otp_assignment_shipment`; FOREIGN KEY (assignment_id, shipment_id) REFERENCES logistics.delivery_assignments(id, shipment_id) ON DELETE RESTRICT
- `shipment_id_internal_id` → `logistics.shipments(internal_id)` via `fk_logistics_delivery_otp_challenges_shipment_id_shipme_04c6`; FOREIGN KEY (shipment_id_internal_id) REFERENCES logistics.shipments(internal_id) ON DELETE RESTRICT
- `assignment_id_internal_id, shipment_id_internal_id` → `logistics.delivery_assignments(internal_id, shipment_id_internal_id)` via `fk_logistics_otp_assignment_shipment_numeric`; FOREIGN KEY (assignment_id_internal_id, shipment_id_internal_id) REFERENCES logistics.delivery_assignments(internal_id, shipment_id_internal_id) ON DELETE RESTRICT

## logistics.delivery_otp_challenges — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 14 columns, 13 constraints, 5 indexes, 5 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `shipment_id` | `logistics.shipments` | `fk_logistics_delivery_otp_challenges_shipment_id_shipments` |
| `assignment_id`, `shipment_id` | `logistics.delivery_assignments` | `fk_logistics_otp_assignment_shipment` |
| `shipment_id_internal_id` | `logistics.shipments` | `fk_logistics_delivery_otp_challenges_shipment_id_shipme_04c6` |
| `assignment_id_internal_id`, `shipment_id_internal_id` | `logistics.delivery_assignments` | `fk_logistics_otp_assignment_shipment_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_logistics_otp_assignment_time` | `CREATE INDEX ix_logistics_otp_assignment_time ON logistics.delivery_otp_challenges USING btree (assignment_id, created_at DESC)` |
| `ix_logistics_otp_expiry` | `CREATE INDEX ix_logistics_otp_expiry ON logistics.delivery_otp_challenges USING btree (status, expires_at)` |
| `pk_logistics_delivery_otp_challenges` | `CREATE UNIQUE INDEX pk_logistics_delivery_otp_challenges ON logistics.delivery_otp_challenges USING btree (internal_id)` |
| `uq_logistics_delivery_otp_challenges_id` | `CREATE UNIQUE INDEX uq_logistics_delivery_otp_challenges_id ON logistics.delivery_otp_challenges USING btree (id)` |
| `uq_logistics_otp_one_active` | `CREATE UNIQUE INDEX uq_logistics_otp_one_active ON logistics.delivery_otp_challenges USING btree (shipment_id) WHERE status::text = 'active'::text` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_otp_challenges FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["assignment_id","assignment_id_internal_id","logistics","delivery_assignments"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` |
| `otp_guard` | `CREATE TRIGGER otp_guard BEFORE INSERT OR UPDATE ON logistics.delivery_otp_challenges FOR EACH ROW EXECUTE FUNCTION logistics.guard_otp()` |
| `otp_outcome_audit` | `CREATE TRIGGER otp_outcome_audit AFTER INSERT OR UPDATE ON logistics.delivery_otp_challenges FOR EACH ROW EXECUTE FUNCTION logistics.audit_otp_outcome()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.delivery_otp_challenges FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('timestamp')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_otp_challenges FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["assignment_id","assignment_id_internal_id","logistics","delivery_assignments"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
