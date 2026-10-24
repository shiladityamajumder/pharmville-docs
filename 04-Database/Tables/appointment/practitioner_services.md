# `appointment.practitioner_services`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds practitioner services records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | appointment.practitioner_services |
| Classification | Mapping / Junction |
| Proposed business write owner | Future appointment owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 23 columns; 22 PK/FK/UQ/CHECK/exclusion constraints; 15 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `buffer_minutes` | `integer` | No | `0` | Inferred: stores buffer minutes for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_appointment_practitioner_services_created_by_users` |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | Collation: default |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_appointment_practitioner_services_deleted_by_users` |
| `duration_minutes` | `integer` | No | — | Inferred: stores duration minutes for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `fee` | `numeric(14,2)` | No | `0` | Inferred: stores fee for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `location_id` | `uuid` | Yes | — | Reference linking this record to locations | Ensures related business data can be joined and validated | FK → `organization.locations` via `fk_appointment_practitioner_services_location_id_locations` |
| `location_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.locations` via `fk_appointment_practitioner_services_location_id_locati_e2b2` |
| `organization_id` | `uuid` | Yes | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` via `fk_appointment_practitioner_services_organization_id_or_328c` |
| `organization_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` via `fk_appointment_practitioner_services_organization_id_or_7c6f` |
| `practitioner_profile_id` | `uuid` | No | — | Reference linking this record to practitioner profiles | Ensures related business data can be joined and validated | FK → `clinical.practitioner_profiles` via `fk_appointment_practitioner_services_practitioner_profi_de52` |
| `practitioner_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.practitioner_profiles` via `fk_appointment_practitioner_services_practitioner_profi_c30c` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `service_type_id` | `uuid` | No | — | Reference linking this record to service types | Ensures related business data can be joined and validated | FK → `appointment.service_types` via `fk_appointment_practitioner_services_service_type_id_se_8789` |
| `service_type_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.service_types` via `fk_appointment_practitioner_services_service_type_id_se_6043` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_appointment_practitioner_services_updated_by_users` |

## Record lifecycle and users

- **Created:** when the practitioner services business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `appointment.practitioner_services` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_appointment_practitioner_services_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_appointment_practitioner_services_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_appointment_practitioner_services_location_id_locati_e2b2 | `location_id_internal_id` | [`organization.locations`](../../Tables/organization/locations.md) | `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE CASCADE` |
| fk_appointment_practitioner_services_location_id_locations | `location_id` | [`organization.locations`](../../Tables/organization/locations.md) | `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE CASCADE` |
| fk_appointment_practitioner_services_organization_id_or_328c | `organization_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE` |
| fk_appointment_practitioner_services_organization_id_or_7c6f | `organization_id_internal_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE` |
| fk_appointment_practitioner_services_practitioner_profi_c30c | `practitioner_profile_id_internal_id` | [`clinical.practitioner_profiles`](../../Tables/clinical/practitioner_profiles.md) | `FOREIGN KEY (practitioner_profile_id_internal_id) REFERENCES clinical.practitioner_profiles(internal_id) ON DELETE CASCADE` |
| fk_appointment_practitioner_services_practitioner_profi_de52 | `practitioner_profile_id` | [`clinical.practitioner_profiles`](../../Tables/clinical/practitioner_profiles.md) | `FOREIGN KEY (practitioner_profile_id) REFERENCES clinical.practitioner_profiles(id) ON DELETE CASCADE` |
| fk_appointment_practitioner_services_service_type_id_se_6043 | `service_type_id_internal_id` | [`appointment.service_types`](../../Tables/appointment/service_types.md) | `FOREIGN KEY (service_type_id_internal_id) REFERENCES appointment.service_types(internal_id) ON DELETE RESTRICT` |
| fk_appointment_practitioner_services_service_type_id_se_8789 | `service_type_id` | [`appointment.service_types`](../../Tables/appointment/service_types.md) | `FOREIGN KEY (service_type_id) REFERENCES appointment.service_types(id) ON DELETE RESTRICT` |
| fk_appointment_practitioner_services_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`appointment.appointment_slots`](../../Tables/appointment/appointment_slots.md) | fk_appointment_appointment_slots_practitioner_service_i_63f0 | `practitioner_service_id_internal_id` | `internal_id` |
| [`appointment.appointment_slots`](../../Tables/appointment/appointment_slots.md) | fk_appointment_appointment_slots_practitioner_service_i_a41a | `practitioner_service_id` | `id` |
| [`appointment.appointments`](../../Tables/appointment/appointments.md) | fk_appointment_appointments_practitioner_service_id_pra_39cd | `practitioner_service_id` | `id` |
| [`appointment.appointments`](../../Tables/appointment/appointments.md) | fk_appointment_appointments_practitioner_service_id_pra_6424 | `practitioner_service_id_internal_id` | `internal_id` |
| [`appointment.availability_exceptions`](../../Tables/appointment/availability_exceptions.md) | fk_appointment_availability_exceptions_practitioner_ser_5867 | `practitioner_service_id` | `id` |
| [`appointment.availability_exceptions`](../../Tables/appointment/availability_exceptions.md) | fk_appointment_availability_exceptions_practitioner_ser_be1d | `practitioner_service_id_internal_id` | `internal_id` |
| [`appointment.availability_rules`](../../Tables/appointment/availability_rules.md) | fk_appointment_availability_rules_practitioner_service__3b93 | `practitioner_service_id_internal_id` | `internal_id` |
| [`appointment.availability_rules`](../../Tables/appointment/availability_rules.md) | fk_appointment_availability_rules_practitioner_service__4974 | `practitioner_service_id` | `id` |

## `appointment.practitioner_services` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_appointment_practitioner_services_created_by_users` |
| `deleted_by` | `identity.users` | `fk_appointment_practitioner_services_deleted_by_users` |
| `location_id_internal_id` | `organization.locations` | `fk_appointment_practitioner_services_location_id_locati_e2b2` |
| `location_id` | `organization.locations` | `fk_appointment_practitioner_services_location_id_locations` |
| `organization_id` | `organization.organizations` | `fk_appointment_practitioner_services_organization_id_or_328c` |
| `organization_id_internal_id` | `organization.organizations` | `fk_appointment_practitioner_services_organization_id_or_7c6f` |
| `practitioner_profile_id_internal_id` | `clinical.practitioner_profiles` | `fk_appointment_practitioner_services_practitioner_profi_c30c` |
| `practitioner_profile_id` | `clinical.practitioner_profiles` | `fk_appointment_practitioner_services_practitioner_profi_de52` |
| `service_type_id_internal_id` | `appointment.service_types` | `fk_appointment_practitioner_services_service_type_id_se_6043` |
| `service_type_id` | `appointment.service_types` | `fk_appointment_practitioner_services_service_type_id_se_8789` |
| `updated_by` | `identity.users` | `fk_appointment_practitioner_services_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_appointment_practitioner_services_duration_positive` | CHECK | `CHECK (duration_minutes > 0)` |
| `ck_appointment_practitioner_services_fee_nonnegative` | CHECK | `CHECK (fee >= 0::numeric)` |
| `ck_appointment_practitioner_services_finite_numeric_values` | CHECK | `CHECK (fee IS NULL OR (fee <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_appointment_practitioner_services_numeric_pair_location_id` | CHECK | `CHECK ((location_id IS NULL) = (location_id_internal_id IS NULL))` |
| `ck_appointment_practitioner_services_numeric_pair_organ_af7d` | CHECK | `CHECK ((organization_id IS NULL) = (organization_id_internal_id IS NULL))` |
| `ck_appointment_practitioner_services_numeric_pair_pract_4fa7` | CHECK | `CHECK ((practitioner_profile_id IS NULL) = (practitioner_profile_id_internal_id IS NULL))` |
| `ck_appointment_practitioner_services_numeric_pair_servi_439c` | CHECK | `CHECK ((service_type_id IS NULL) = (service_type_id_internal_id IS NULL))` |
| `ck_appointment_practitioner_services_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_appointment_practitioner_services_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_appointment_practitioner_services_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_appointment_practitioner_services_location_id_locati_e2b2` | FOREIGN KEY | `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE CASCADE` |
| `fk_appointment_practitioner_services_location_id_locations` | FOREIGN KEY | `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE CASCADE` |
| `fk_appointment_practitioner_services_organization_id_or_328c` | FOREIGN KEY | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE` |
| `fk_appointment_practitioner_services_organization_id_or_7c6f` | FOREIGN KEY | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE` |
| `fk_appointment_practitioner_services_practitioner_profi_c30c` | FOREIGN KEY | `FOREIGN KEY (practitioner_profile_id_internal_id) REFERENCES clinical.practitioner_profiles(internal_id) ON DELETE CASCADE` |
| `fk_appointment_practitioner_services_practitioner_profi_de52` | FOREIGN KEY | `FOREIGN KEY (practitioner_profile_id) REFERENCES clinical.practitioner_profiles(id) ON DELETE CASCADE` |
| `fk_appointment_practitioner_services_service_type_id_se_6043` | FOREIGN KEY | `FOREIGN KEY (service_type_id_internal_id) REFERENCES appointment.service_types(internal_id) ON DELETE RESTRICT` |
| `fk_appointment_practitioner_services_service_type_id_se_8789` | FOREIGN KEY | `FOREIGN KEY (service_type_id) REFERENCES appointment.service_types(id) ON DELETE RESTRICT` |
| `fk_appointment_practitioner_services_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_appointment_practitioner_services` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `practitioner_service_location` | UNIQUE | `UNIQUE NULLS NOT DISTINCT (practitioner_profile_id, service_type_id, organization_id, location_id)` |
| `uq_appointment_practitioner_services_id` | UNIQUE | `UNIQUE (id)` |
| `practitioner_services_buffer_minutes_not_null` | NOT NULL | `NOT NULL buffer_minutes` |
| `practitioner_services_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `practitioner_services_currency_not_null` | NOT NULL | `NOT NULL currency` |
| `practitioner_services_duration_minutes_not_null` | NOT NULL | `NOT NULL duration_minutes` |
| `practitioner_services_fee_not_null` | NOT NULL | `NOT NULL fee` |
| `practitioner_services_id_not_null` | NOT NULL | `NOT NULL id` |
| `practitioner_services_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `practitioner_services_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `practitioner_services_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `practitioner_services_practitioner_profile_id_internal_not_null` | NOT NULL | `NOT NULL practitioner_profile_id_internal_id` |
| `practitioner_services_practitioner_profile_id_not_null` | NOT NULL | `NOT NULL practitioner_profile_id` |
| `practitioner_services_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `practitioner_services_service_type_id_internal_id_not_null` | NOT NULL | `NOT NULL service_type_id_internal_id` |
| `practitioner_services_service_type_id_not_null` | NOT NULL | `NOT NULL service_type_id` |
| `practitioner_services_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_appointment_practitioner_services_practitioner` | btree | `(practitioner_profile_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_appointment_practitioner_services_practitioner ON appointment.practitioner_services USING btree (practitioner_profile_id)` |
| `pk_appointment_practitioner_services` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_appointment_practitioner_services ON appointment.practitioner_services USING btree (internal_id)` |
| `practitioner_service_location` | btree | `(practitioner_profile_id, service_type_id, organization_id, location_id) NULLS NOT DISTINCT` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX practitioner_service_location ON appointment.practitioner_services USING btree (practitioner_profile_id, service_type_id, organization_id, location_id) NULLS NOT DISTINCT` |
| `uq_appointment_practitioner_services_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_appointment_practitioner_services_id ON appointment.practitioner_services USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON appointment.practitioner_services FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"],["practitioner_profile_id","practitioner_profile_id_internal_id","clinical","practitioner_profiles"],["service_type_id","service_type_id_internal_id","appointment","service_types"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON appointment.practitioner_services FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON appointment.practitioner_services FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"],["practitioner_profile_id","practitioner_profile_id_internal_id","clinical","practitioner_profiles"],["service_type_id","service_type_id_internal_id","appointment","service_types"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
