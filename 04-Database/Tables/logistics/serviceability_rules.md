# `logistics.serviceability_rules`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds serviceability rules records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | logistics.serviceability_rules |
| Classification | Configuration |
| Proposed business write owner | Delivery_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 14 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `active_from` | `date` | Yes | — | Inferred: stores active from for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `active_until` | `date` | Yes | — | Inferred: stores active until for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `carrier_id` | `uuid` | No | — | Reference linking this record to carriers | Ensures related business data can be joined and validated | FK → `logistics.carriers` via `fk_logistics_serviceability_rules_carrier_id_carriers` |
| `carrier_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.carriers` via `fk_logistics_serviceability_rules_carrier_id_carriers_numeric` |
| `cod_supported` | `boolean` | No | `false` | Inferred: stores cod supported for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `cold_chain_supported` | `boolean` | No | `false` | Inferred: stores cold chain supported for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_serviceability_rules_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_serviceability_rules_deleted_by_users` |
| `destination_postal_code` | `character varying(16)` | No | — | Code for destination postal | Link to controlled business classification or an external reference | Collation: default |
| `estimated_days` | `integer` | No | — | Inferred: stores estimated days for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `max_weight_grams` | `integer` | Yes | — | Inferred: stores max weight grams for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `origin_postal_code` | `character varying(16)` | No | — | Code for origin postal | Link to controlled business classification or an external reference | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `service_type` | `character varying(32)` | No | — | Inferred: stores service type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_serviceability_rules_updated_by_users` |

## Record lifecycle and users

- **Created:** when the serviceability rules business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.serviceability_rules` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_logistics_serviceability_rules_carrier_id_carriers | `carrier_id` | [`logistics.carriers`](../../Tables/logistics/carriers.md) | `FOREIGN KEY (carrier_id) REFERENCES logistics.carriers(id) ON DELETE CASCADE` |
| fk_logistics_serviceability_rules_carrier_id_carriers_numeric | `carrier_id_internal_id` | [`logistics.carriers`](../../Tables/logistics/carriers.md) | `FOREIGN KEY (carrier_id_internal_id) REFERENCES logistics.carriers(internal_id) ON DELETE CASCADE` |
| fk_logistics_serviceability_rules_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_logistics_serviceability_rules_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_logistics_serviceability_rules_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `logistics.serviceability_rules` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `carrier_id` | `logistics.carriers` | `fk_logistics_serviceability_rules_carrier_id_carriers` |
| `carrier_id_internal_id` | `logistics.carriers` | `fk_logistics_serviceability_rules_carrier_id_carriers_numeric` |
| `created_by` | `identity.users` | `fk_logistics_serviceability_rules_created_by_users` |
| `deleted_by` | `identity.users` | `fk_logistics_serviceability_rules_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_logistics_serviceability_rules_updated_by_users` |

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
| `serviceability_rules_carrier_id_internal_id_not_null` | NOT NULL | `NOT NULL carrier_id_internal_id` |
| `serviceability_rules_carrier_id_not_null` | NOT NULL | `NOT NULL carrier_id` |
| `serviceability_rules_cod_supported_not_null` | NOT NULL | `NOT NULL cod_supported` |
| `serviceability_rules_cold_chain_supported_not_null` | NOT NULL | `NOT NULL cold_chain_supported` |
| `serviceability_rules_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `serviceability_rules_destination_postal_code_not_null` | NOT NULL | `NOT NULL destination_postal_code` |
| `serviceability_rules_estimated_days_not_null` | NOT NULL | `NOT NULL estimated_days` |
| `serviceability_rules_id_not_null` | NOT NULL | `NOT NULL id` |
| `serviceability_rules_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `serviceability_rules_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `serviceability_rules_origin_postal_code_not_null` | NOT NULL | `NOT NULL origin_postal_code` |
| `serviceability_rules_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `serviceability_rules_service_type_not_null` | NOT NULL | `NOT NULL service_type` |
| `serviceability_rules_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `carrier_lane_service` | btree | `(carrier_id, origin_postal_code, destination_postal_code, service_type)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX carrier_lane_service ON logistics.serviceability_rules USING btree (carrier_id, origin_postal_code, destination_postal_code, service_type)` |
| `ix_logistics_serviceability_destination` | btree | `(destination_postal_code)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_serviceability_destination ON logistics.serviceability_rules USING btree (destination_postal_code)` |
| `pk_logistics_serviceability_rules` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_logistics_serviceability_rules ON logistics.serviceability_rules USING btree (internal_id)` |
| `uq_logistics_serviceability_rules_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_serviceability_rules_id ON logistics.serviceability_rules USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.serviceability_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_id","carrier_id_internal_id","logistics","carriers"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.serviceability_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.serviceability_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_id","carrier_id_internal_id","logistics","carriers"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
