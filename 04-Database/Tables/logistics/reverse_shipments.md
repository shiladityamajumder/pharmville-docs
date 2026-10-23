# logistics.reverse_shipments

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds reverse shipments records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 16 columns, 12 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `carrier_id` | `uuid` | Yes | — | Reference linking this record to carriers | Ensures related business data can be joined and validated | FK → `logistics.carriers` (fk_logistics_reverse_shipments_carrier_id_carriers) |
| `carrier_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.carriers` (fk_logistics_reverse_shipments_carrier_id_carriers_numeric); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_reverse_shipments_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `pickup_scheduled_at` | `timestamp with time zone` | Yes | — | Time of pickup scheduled | Support chronology, deadlines or audit evidence | See exact constraints |
| `received_at` | `timestamp with time zone` | Yes | — | Time of received | Support chronology, deadlines or audit evidence | See exact constraints |
| `return_id` | `uuid` | No | — | Reference linking this record to returns | Ensures related business data can be joined and validated | FK → `commerce.returns` (fk_logistics_reverse_shipments_return_id_returns) |
| `return_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.returns` (fk_logistics_reverse_shipments_return_id_returns_numeric); Numeric/public-key pair verification required |
| `reverse_shipment_number` | `character varying(64)` | No | — | Inferred: stores reverse shipment number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `tracking_number` | `character varying(128)` | Yes | — | Inferred: stores tracking number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_reverse_shipments_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the reverse shipments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.reverse_shipments` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_logistics_reverse_shipments_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_logistics_reverse_shipments_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `carrier_id` → `logistics.carriers(id)` via `fk_logistics_reverse_shipments_carrier_id_carriers`; FOREIGN KEY (carrier_id) REFERENCES logistics.carriers(id) ON DELETE SET NULL
- `return_id` → `commerce.returns(id)` via `fk_logistics_reverse_shipments_return_id_returns`; FOREIGN KEY (return_id) REFERENCES commerce.returns(id) ON DELETE RESTRICT
- `carrier_id_internal_id` → `logistics.carriers(internal_id)` via `fk_logistics_reverse_shipments_carrier_id_carriers_numeric`; FOREIGN KEY (carrier_id_internal_id) REFERENCES logistics.carriers(internal_id) ON DELETE SET NULL
- `return_id_internal_id` → `commerce.returns(internal_id)` via `fk_logistics_reverse_shipments_return_id_returns_numeric`; FOREIGN KEY (return_id_internal_id) REFERENCES commerce.returns(internal_id) ON DELETE RESTRICT

## logistics.reverse_shipments — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 16 columns, 12 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_logistics_reverse_shipments_created_by_users` |
| `updated_by` | `identity.users` | `fk_logistics_reverse_shipments_updated_by_users` |
| `carrier_id` | `logistics.carriers` | `fk_logistics_reverse_shipments_carrier_id_carriers` |
| `return_id` | `commerce.returns` | `fk_logistics_reverse_shipments_return_id_returns` |
| `carrier_id_internal_id` | `logistics.carriers` | `fk_logistics_reverse_shipments_carrier_id_carriers_numeric` |
| `return_id_internal_id` | `commerce.returns` | `fk_logistics_reverse_shipments_return_id_returns_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_reverse_shipments_numeric_pair_carrier_id` | CHECK | `CHECK ((carrier_id IS NULL) = (carrier_id_internal_id IS NULL))` |
| `ck_logistics_reverse_shipments_numeric_pair_return_id` | CHECK | `CHECK ((return_id IS NULL) = (return_id_internal_id IS NULL))` |
| `ck_logistics_reverse_shipments_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_logistics_reverse_shipments_carrier_id_carriers` | FOREIGN KEY | `FOREIGN KEY (carrier_id) REFERENCES logistics.carriers(id) ON DELETE SET NULL` |
| `fk_logistics_reverse_shipments_carrier_id_carriers_numeric` | FOREIGN KEY | `FOREIGN KEY (carrier_id_internal_id) REFERENCES logistics.carriers(internal_id) ON DELETE SET NULL` |
| `fk_logistics_reverse_shipments_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_reverse_shipments_return_id_returns` | FOREIGN KEY | `FOREIGN KEY (return_id) REFERENCES commerce.returns(id) ON DELETE RESTRICT` |
| `fk_logistics_reverse_shipments_return_id_returns_numeric` | FOREIGN KEY | `FOREIGN KEY (return_id_internal_id) REFERENCES commerce.returns(internal_id) ON DELETE RESTRICT` |
| `fk_logistics_reverse_shipments_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_logistics_reverse_shipments` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `reverse_shipment_number` | UNIQUE | `UNIQUE (reverse_shipment_number)` |
| `uq_logistics_reverse_shipments_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_logistics_reverse_shipments_return` | `CREATE INDEX ix_logistics_reverse_shipments_return ON logistics.reverse_shipments USING btree (return_id)` |
| `ix_logistics_reverse_shipments_status` | `CREATE INDEX ix_logistics_reverse_shipments_status ON logistics.reverse_shipments USING btree (status)` |
| `pk_logistics_reverse_shipments` | `CREATE UNIQUE INDEX pk_logistics_reverse_shipments ON logistics.reverse_shipments USING btree (internal_id)` |
| `reverse_shipment_number` | `CREATE UNIQUE INDEX reverse_shipment_number ON logistics.reverse_shipments USING btree (reverse_shipment_number)` |
| `uq_logistics_reverse_shipments_id` | `CREATE UNIQUE INDEX uq_logistics_reverse_shipments_id ON logistics.reverse_shipments USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.reverse_shipments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_id","carrier_id_internal_id","logistics","carriers"],["return_id","return_id_internal_id","commerce","returns"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.reverse_shipments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.reverse_shipments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_id","carrier_id_internal_id","logistics","carriers"],["return_id","return_id_internal_id","commerce","returns"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
