# `logistics.serviceability_rules`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds serviceability rules records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 12 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `active_from` | `date` | Yes | — | Inferred: stores active from for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `active_until` | `date` | Yes | — | Inferred: stores active until for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `carrier_id` | `uuid` | No | — | Reference linking this record to carriers | Ensures related business data can be joined and validated | FK → `logistics.carriers` (fk_logistics_serviceability_rules_carrier_id_carriers) |
| `carrier_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.carriers` (fk_logistics_serviceability_rules_carrier_id_carriers_numeric); Numeric/public-key pair verification required |
| `cod_supported` | `boolean` | No | `false` | Inferred: stores cod supported for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `cold_chain_supported` | `boolean` | No | `false` | Inferred: stores cold chain supported for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_serviceability_rules_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_serviceability_rules_deleted_by_users) |
| `destination_postal_code` | `character varying(16)` | No | — | Code for destination postal | Link to controlled business classification or an external reference | See exact constraints |
| `estimated_days` | `integer` | No | — | Inferred: stores estimated days for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `max_weight_grams` | `integer` | Yes | — | Inferred: stores max weight grams for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `origin_postal_code` | `character varying(16)` | No | — | Code for origin postal | Link to controlled business classification or an external reference | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `service_type` | `character varying(32)` | No | — | Inferred: stores service type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_serviceability_rules_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the serviceability rules business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.serviceability_rules` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_logistics_serviceability_rules_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_logistics_serviceability_rules_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_logistics_serviceability_rules_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `carrier_id` → `logistics.carriers(id)` via `fk_logistics_serviceability_rules_carrier_id_carriers`; `FOREIGN KEY (carrier_id) REFERENCES logistics.carriers(id) ON DELETE CASCADE`
- `carrier_id_internal_id` → `logistics.carriers(internal_id)` via `fk_logistics_serviceability_rules_carrier_id_carriers_numeric`; `FOREIGN KEY (carrier_id_internal_id) REFERENCES logistics.carriers(internal_id) ON DELETE CASCADE`

## `logistics.serviceability_rules` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 21 columns, 12 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_logistics_serviceability_rules_created_by_users` |
| `deleted_by` | `identity.users` | `fk_logistics_serviceability_rules_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_logistics_serviceability_rules_updated_by_users` |
| `carrier_id` | `logistics.carriers` | `fk_logistics_serviceability_rules_carrier_id_carriers` |
| `carrier_id_internal_id` | `logistics.carriers` | `fk_logistics_serviceability_rules_carrier_id_carriers_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `carrier_lane_service` | UNIQUE | `UNIQUE (carrier_id, origin_postal_code, destination_postal_code, service_type)` |
| `ck_logistics_serviceability_rules_estimated_days_nonnegative` | CHECK | `CHECK (estimated_days >= 0)` |
| `ck_logistics_serviceability_rules_max_weight_positive` | CHECK | `CHECK (max_weight_grams IS NULL OR max_weight_grams > 0)` |
| `ck_logistics_serviceability_rules_numeric_pair_carrier_id` | CHECK | `CHECK ((carrier_id IS NULL) = (carrier_id_internal_id IS NULL))` |
| `ck_logistics_serviceability_rules_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_logistics_serviceability_rules_carrier_id_carriers` | FOREIGN KEY | `FOREIGN KEY (carrier_id) REFERENCES logistics.carriers(id) ON DELETE CASCADE` |
| `fk_logistics_serviceability_rules_carrier_id_carriers_numeric` | FOREIGN KEY | `FOREIGN KEY (carrier_id_internal_id) REFERENCES logistics.carriers(internal_id) ON DELETE CASCADE` |
| `fk_logistics_serviceability_rules_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_serviceability_rules_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_serviceability_rules_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_logistics_serviceability_rules` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_logistics_serviceability_rules_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `carrier_lane_service` | `CREATE UNIQUE INDEX carrier_lane_service ON logistics.serviceability_rules USING btree (carrier_id, origin_postal_code, destination_postal_code, service_type)` |
| `ix_logistics_serviceability_destination` | `CREATE INDEX ix_logistics_serviceability_destination ON logistics.serviceability_rules USING btree (destination_postal_code)` |
| `pk_logistics_serviceability_rules` | `CREATE UNIQUE INDEX pk_logistics_serviceability_rules ON logistics.serviceability_rules USING btree (internal_id)` |
| `uq_logistics_serviceability_rules_id` | `CREATE UNIQUE INDEX uq_logistics_serviceability_rules_id ON logistics.serviceability_rules USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.serviceability_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_id","carrier_id_internal_id","logistics","carriers"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.serviceability_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.serviceability_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_id","carrier_id_internal_id","logistics","carriers"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
