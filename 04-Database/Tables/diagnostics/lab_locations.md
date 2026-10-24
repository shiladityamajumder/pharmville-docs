# `diagnostics.lab_locations`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds lab locations records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | diagnostics.lab_locations |
| Classification | Mapping / Junction |
| Proposed business write owner | Future diagnostics owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 13 PK/FK/UQ/CHECK/exclusion constraints; 13 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `collection_supported` | `boolean` | No | `true` | Inferred: stores collection supported for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_lab_locations_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_lab_locations_deleted_by_users` |
| `home_collection_supported` | `boolean` | No | `false` | Inferred: stores home collection supported for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `lab_provider_id` | `uuid` | No | — | Reference linking this record to lab providers | Ensures related business data can be joined and validated | FK → `diagnostics.lab_providers` via `fk_diagnostics_lab_locations_lab_provider_id_lab_providers` |
| `lab_provider_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.lab_providers` via `fk_diagnostics_lab_locations_lab_provider_id_lab_provid_d7d7` |
| `location_id` | `uuid` | No | — | Reference linking this record to locations | Ensures related business data can be joined and validated | FK → `organization.locations` via `fk_diagnostics_lab_locations_location_id_locations` |
| `location_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.locations` via `fk_diagnostics_lab_locations_location_id_locations_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_lab_locations_updated_by_users` |

## Record lifecycle and users

- **Created:** when the lab locations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.lab_locations` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_diagnostics_lab_locations_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_diagnostics_lab_locations_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_diagnostics_lab_locations_lab_provider_id_lab_provid_d7d7 | `lab_provider_id_internal_id` | [`diagnostics.lab_providers`](../../Tables/diagnostics/lab_providers.md) | `FOREIGN KEY (lab_provider_id_internal_id) REFERENCES diagnostics.lab_providers(internal_id) ON DELETE CASCADE` |
| fk_diagnostics_lab_locations_lab_provider_id_lab_providers | `lab_provider_id` | [`diagnostics.lab_providers`](../../Tables/diagnostics/lab_providers.md) | `FOREIGN KEY (lab_provider_id) REFERENCES diagnostics.lab_providers(id) ON DELETE CASCADE` |
| fk_diagnostics_lab_locations_location_id_locations | `location_id` | [`organization.locations`](../../Tables/organization/locations.md) | `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE RESTRICT` |
| fk_diagnostics_lab_locations_location_id_locations_numeric | `location_id_internal_id` | [`organization.locations`](../../Tables/organization/locations.md) | `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE RESTRICT` |
| fk_diagnostics_lab_locations_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | fk_diagnostics_diagnostic_orders_lab_location_id_lab_lo_e7ed | `lab_location_id_internal_id` | `internal_id` |
| [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | fk_diagnostics_diagnostic_orders_lab_location_id_lab_locations | `lab_location_id` | `id` |
| [`diagnostics.lab_offerings`](../../Tables/diagnostics/lab_offerings.md) | fk_diagnostics_lab_offerings_lab_location_id_lab_locati_de16 | `lab_location_id_internal_id` | `internal_id` |
| [`diagnostics.lab_offerings`](../../Tables/diagnostics/lab_offerings.md) | fk_diagnostics_lab_offerings_lab_location_id_lab_locations | `lab_location_id` | `id` |

## `diagnostics.lab_locations` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_diagnostics_lab_locations_created_by_users` |
| `deleted_by` | `identity.users` | `fk_diagnostics_lab_locations_deleted_by_users` |
| `lab_provider_id_internal_id` | `diagnostics.lab_providers` | `fk_diagnostics_lab_locations_lab_provider_id_lab_provid_d7d7` |
| `lab_provider_id` | `diagnostics.lab_providers` | `fk_diagnostics_lab_locations_lab_provider_id_lab_providers` |
| `location_id` | `organization.locations` | `fk_diagnostics_lab_locations_location_id_locations` |
| `location_id_internal_id` | `organization.locations` | `fk_diagnostics_lab_locations_location_id_locations_numeric` |
| `updated_by` | `identity.users` | `fk_diagnostics_lab_locations_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_diagnostics_lab_locations_numeric_pair_lab_provider_id` | CHECK | `CHECK ((lab_provider_id IS NULL) = (lab_provider_id_internal_id IS NULL))` |
| `ck_diagnostics_lab_locations_numeric_pair_location_id` | CHECK | `CHECK ((location_id IS NULL) = (location_id_internal_id IS NULL))` |
| `ck_diagnostics_lab_locations_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_diagnostics_lab_locations_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_locations_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_locations_lab_provider_id_lab_provid_d7d7` | FOREIGN KEY | `FOREIGN KEY (lab_provider_id_internal_id) REFERENCES diagnostics.lab_providers(internal_id) ON DELETE CASCADE` |
| `fk_diagnostics_lab_locations_lab_provider_id_lab_providers` | FOREIGN KEY | `FOREIGN KEY (lab_provider_id) REFERENCES diagnostics.lab_providers(id) ON DELETE CASCADE` |
| `fk_diagnostics_lab_locations_location_id_locations` | FOREIGN KEY | `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_locations_location_id_locations_numeric` | FOREIGN KEY | `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_locations_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `lab_provider_location` | UNIQUE | `UNIQUE (lab_provider_id, location_id)` |
| `pk_diagnostics_lab_locations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_diagnostics_lab_locations_id` | UNIQUE | `UNIQUE (id)` |
| `lab_locations_collection_supported_not_null` | NOT NULL | `NOT NULL collection_supported` |
| `lab_locations_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `lab_locations_home_collection_supported_not_null` | NOT NULL | `NOT NULL home_collection_supported` |
| `lab_locations_id_not_null` | NOT NULL | `NOT NULL id` |
| `lab_locations_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `lab_locations_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `lab_locations_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `lab_locations_lab_provider_id_internal_id_not_null` | NOT NULL | `NOT NULL lab_provider_id_internal_id` |
| `lab_locations_lab_provider_id_not_null` | NOT NULL | `NOT NULL lab_provider_id` |
| `lab_locations_location_id_internal_id_not_null` | NOT NULL | `NOT NULL location_id_internal_id` |
| `lab_locations_location_id_not_null` | NOT NULL | `NOT NULL location_id` |
| `lab_locations_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `lab_locations_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_diagnostics_lab_locations_provider` | btree | `(lab_provider_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_diagnostics_lab_locations_provider ON diagnostics.lab_locations USING btree (lab_provider_id)` |
| `lab_provider_location` | btree | `(lab_provider_id, location_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX lab_provider_location ON diagnostics.lab_locations USING btree (lab_provider_id, location_id)` |
| `pk_diagnostics_lab_locations` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_diagnostics_lab_locations ON diagnostics.lab_locations USING btree (internal_id)` |
| `uq_diagnostics_lab_locations_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_diagnostics_lab_locations_id ON diagnostics.lab_locations USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.lab_locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lab_provider_id","lab_provider_id_internal_id","diagnostics","lab_providers"],["location_id","location_id_internal_id","organization","locations"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.lab_locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.lab_locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lab_provider_id","lab_provider_id_internal_id","diagnostics","lab_providers"],["location_id","location_id_internal_id","organization","locations"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
