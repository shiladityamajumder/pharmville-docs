# `logistics.delivery_attempts`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds delivery attempts records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 19 columns, 16 constraints, 5 indexes, 5 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `attempt_number` | `integer` | No | — | Inferred: stores attempt number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `attempted_at` | `timestamp with time zone` | No | — | Time of attempted | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_delivery_attempts_created_by_users) |
| `delivery_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_delivery_attempts_delivery_user_id_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `otp_verified` | `boolean` | No | `false` | Inferred: stores otp verified for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `proof_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_logistics_delivery_attempts_proof_file_id_file_objects) |
| `proof_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_logistics_delivery_attempts_proof_file_id_file_objec_b2c0); Numeric/public-key pair verification required |
| `proof_metadata` | `jsonb` | No | `'{}'::jsonb` | Structured proof metadata information | Retain a versioned payload or relevant details | See exact constraints |
| `reason_code` | `character varying(64)` | Yes | — | Reference linking this record to delivery failure reasons | Ensures related business data can be joined and validated | FK → `logistics.delivery_failure_reasons` (fk_logistics_delivery_attempts_controlled_reason) |
| `reason_code_id` | `bigint` | Yes | — | Reference linking this record to delivery failure reasons | Ensures related business data can be joined and validated | FK → `logistics.delivery_failure_reasons` (fk_logistics_delivery_attempts_controlled_reason) |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `shipment_id` | `uuid` | No | — | Reference linking this record to shipments | Ensures related business data can be joined and validated | FK → `logistics.shipments` (fk_logistics_delivery_attempts_shipment_id_shipments) |
| `shipment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.shipments` (fk_logistics_delivery_attempts_shipment_id_shipments_numeric); Numeric/public-key pair verification required |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_delivery_attempts_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the delivery attempts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.delivery_attempts` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `delivery_user_id` → `identity.users(id)` via `fk_logistics_delivery_attempts_delivery_user_id_users`; `FOREIGN KEY (delivery_user_id) REFERENCES identity.users(id) ON DELETE SET NULL`
- `reason_code_id, reason_code` → `logistics.delivery_failure_reasons(id, code)` via `fk_logistics_delivery_attempts_controlled_reason`; `FOREIGN KEY (reason_code_id, reason_code) REFERENCES logistics.delivery_failure_reasons(id, code) ON DELETE RESTRICT`
- `created_by` → `identity.users(id)` via `fk_logistics_delivery_attempts_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_logistics_delivery_attempts_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `shipment_id` → `logistics.shipments(id)` via `fk_logistics_delivery_attempts_shipment_id_shipments`; `FOREIGN KEY (shipment_id) REFERENCES logistics.shipments(id) ON DELETE CASCADE`
- `proof_file_id` → `platform.file_objects(id)` via `fk_logistics_delivery_attempts_proof_file_id_file_objects`; `FOREIGN KEY (proof_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL`
- `proof_file_id_internal_id` → `platform.file_objects(internal_id)` via `fk_logistics_delivery_attempts_proof_file_id_file_objec_b2c0`; `FOREIGN KEY (proof_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL`
- `shipment_id_internal_id` → `logistics.shipments(internal_id)` via `fk_logistics_delivery_attempts_shipment_id_shipments_numeric`; `FOREIGN KEY (shipment_id_internal_id) REFERENCES logistics.shipments(internal_id) ON DELETE CASCADE`

## `logistics.delivery_attempts` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 19 columns, 16 constraints, 5 indexes, 5 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `delivery_user_id` | `identity.users` | `fk_logistics_delivery_attempts_delivery_user_id_users` |
| `reason_code_id`, `reason_code` | `logistics.delivery_failure_reasons` | `fk_logistics_delivery_attempts_controlled_reason` |
| `created_by` | `identity.users` | `fk_logistics_delivery_attempts_created_by_users` |
| `updated_by` | `identity.users` | `fk_logistics_delivery_attempts_updated_by_users` |
| `shipment_id` | `logistics.shipments` | `fk_logistics_delivery_attempts_shipment_id_shipments` |
| `proof_file_id` | `platform.file_objects` | `fk_logistics_delivery_attempts_proof_file_id_file_objects` |
| `proof_file_id_internal_id` | `platform.file_objects` | `fk_logistics_delivery_attempts_proof_file_id_file_objec_b2c0` |
| `shipment_id_internal_id` | `logistics.shipments` | `fk_logistics_delivery_attempts_shipment_id_shipments_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_delivery_attempts_attempt_number_positive` | CHECK | `CHECK (attempt_number > 0)` |
| `ck_logistics_delivery_attempts_controlled_reason_pair` | CHECK | `CHECK (reason_code_id IS NULL OR reason_code IS NOT NULL)` |
| `ck_logistics_delivery_attempts_numeric_pair_proof_file_id` | CHECK | `CHECK ((proof_file_id IS NULL) = (proof_file_id_internal_id IS NULL))` |
| `ck_logistics_delivery_attempts_numeric_pair_shipment_id` | CHECK | `CHECK ((shipment_id IS NULL) = (shipment_id_internal_id IS NULL))` |
| `ck_logistics_delivery_attempts_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `delivery_attempt_number` | UNIQUE | `UNIQUE (shipment_id, attempt_number)` |
| `fk_logistics_delivery_attempts_controlled_reason` | FOREIGN KEY | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES logistics.delivery_failure_reasons(id, code) ON DELETE RESTRICT` |
| `fk_logistics_delivery_attempts_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_attempts_delivery_user_id_users` | FOREIGN KEY | `FOREIGN KEY (delivery_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_logistics_delivery_attempts_proof_file_id_file_objec_b2c0` | FOREIGN KEY | `FOREIGN KEY (proof_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| `fk_logistics_delivery_attempts_proof_file_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (proof_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| `fk_logistics_delivery_attempts_shipment_id_shipments` | FOREIGN KEY | `FOREIGN KEY (shipment_id) REFERENCES logistics.shipments(id) ON DELETE CASCADE` |
| `fk_logistics_delivery_attempts_shipment_id_shipments_numeric` | FOREIGN KEY | `FOREIGN KEY (shipment_id_internal_id) REFERENCES logistics.shipments(internal_id) ON DELETE CASCADE` |
| `fk_logistics_delivery_attempts_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_logistics_delivery_attempts` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_logistics_delivery_attempts_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `delivery_attempt_number` | `CREATE UNIQUE INDEX delivery_attempt_number ON logistics.delivery_attempts USING btree (shipment_id, attempt_number)` |
| `ix_logistics_delivery_attempts_shipment` | `CREATE INDEX ix_logistics_delivery_attempts_shipment ON logistics.delivery_attempts USING btree (shipment_id)` |
| `ix_logistics_delivery_attempts_status` | `CREATE INDEX ix_logistics_delivery_attempts_status ON logistics.delivery_attempts USING btree (status)` |
| `pk_logistics_delivery_attempts` | `CREATE UNIQUE INDEX pk_logistics_delivery_attempts ON logistics.delivery_attempts USING btree (internal_id)` |
| `uq_logistics_delivery_attempts_id` | `CREATE UNIQUE INDEX uq_logistics_delivery_attempts_id ON logistics.delivery_attempts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_attempts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["proof_file_id","proof_file_id_internal_id","platform","file_objects"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` |
| `controlled_reason` | `CREATE TRIGGER controlled_reason BEFORE INSERT OR UPDATE ON logistics.delivery_attempts FOR EACH ROW EXECUTE FUNCTION platform.normalize_reason('logistics.delivery_failure_reasons')` |
| `delivery_proof_guard` | `CREATE TRIGGER delivery_proof_guard BEFORE INSERT OR UPDATE ON logistics.delivery_attempts FOR EACH ROW EXECUTE FUNCTION logistics.guard_delivery_proof()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.delivery_attempts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_attempts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["proof_file_id","proof_file_id_internal_id","platform","file_objects"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
