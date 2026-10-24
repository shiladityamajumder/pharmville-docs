# `appointment.practitioner_services`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds practitioner services records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 23 columns, 22 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `buffer_minutes` | `integer` | No | `0` | Inferred: stores buffer minutes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_appointment_practitioner_services_created_by_users) |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | See exact constraints |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_appointment_practitioner_services_deleted_by_users) |
| `duration_minutes` | `integer` | No | — | Inferred: stores duration minutes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `fee` | `numeric(14,2)` | No | `0` | Inferred: stores fee for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `location_id` | `uuid` | Yes | — | Reference linking this record to locations | Ensures related business data can be joined and validated | FK → `organization.locations` (fk_appointment_practitioner_services_location_id_locations) |
| `location_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.locations` (fk_appointment_practitioner_services_location_id_locati_e2b2); Numeric/public-key pair verification required |
| `organization_id` | `uuid` | Yes | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` (fk_appointment_practitioner_services_organization_id_or_328c) |
| `organization_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` (fk_appointment_practitioner_services_organization_id_or_7c6f); Numeric/public-key pair verification required |
| `practitioner_profile_id` | `uuid` | No | — | Reference linking this record to practitioner profiles | Ensures related business data can be joined and validated | FK → `clinical.practitioner_profiles` (fk_appointment_practitioner_services_practitioner_profi_de52) |
| `practitioner_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.practitioner_profiles` (fk_appointment_practitioner_services_practitioner_profi_c30c); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `service_type_id` | `uuid` | No | — | Reference linking this record to service types | Ensures related business data can be joined and validated | FK → `appointment.service_types` (fk_appointment_practitioner_services_service_type_id_se_8789) |
| `service_type_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.service_types` (fk_appointment_practitioner_services_service_type_id_se_6043); Numeric/public-key pair verification required |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_appointment_practitioner_services_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the practitioner services business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `appointment.practitioner_services` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_appointment_practitioner_services_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_appointment_practitioner_services_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_appointment_practitioner_services_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `service_type_id` → `appointment.service_types(id)` via `fk_appointment_practitioner_services_service_type_id_se_8789`; `FOREIGN KEY (service_type_id) REFERENCES appointment.service_types(id) ON DELETE RESTRICT`
- `practitioner_profile_id` → `clinical.practitioner_profiles(id)` via `fk_appointment_practitioner_services_practitioner_profi_de52`; `FOREIGN KEY (practitioner_profile_id) REFERENCES clinical.practitioner_profiles(id) ON DELETE CASCADE`
- `location_id` → `organization.locations(id)` via `fk_appointment_practitioner_services_location_id_locations`; `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE CASCADE`
- `organization_id` → `organization.organizations(id)` via `fk_appointment_practitioner_services_organization_id_or_328c`; `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE`
- `location_id_internal_id` → `organization.locations(internal_id)` via `fk_appointment_practitioner_services_location_id_locati_e2b2`; `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE CASCADE`
- `organization_id_internal_id` → `organization.organizations(internal_id)` via `fk_appointment_practitioner_services_organization_id_or_7c6f`; `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE`
- `practitioner_profile_id_internal_id` → `clinical.practitioner_profiles(internal_id)` via `fk_appointment_practitioner_services_practitioner_profi_c30c`; `FOREIGN KEY (practitioner_profile_id_internal_id) REFERENCES clinical.practitioner_profiles(internal_id) ON DELETE CASCADE`
- `service_type_id_internal_id` → `appointment.service_types(internal_id)` via `fk_appointment_practitioner_services_service_type_id_se_6043`; `FOREIGN KEY (service_type_id_internal_id) REFERENCES appointment.service_types(internal_id) ON DELETE RESTRICT`

**Referenced by 8 FK constraints** (sample): `appointment.availability_rules`, `appointment.availability_exceptions`, `appointment.appointment_slots`, `appointment.appointments`, `appointment.appointment_slots`, `appointment.appointments`, `appointment.availability_exceptions`, `appointment.availability_rules`.

## `appointment.practitioner_services` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 23 columns, 22 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_appointment_practitioner_services_created_by_users` |
| `deleted_by` | `identity.users` | `fk_appointment_practitioner_services_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_appointment_practitioner_services_updated_by_users` |
| `service_type_id` | `appointment.service_types` | `fk_appointment_practitioner_services_service_type_id_se_8789` |
| `practitioner_profile_id` | `clinical.practitioner_profiles` | `fk_appointment_practitioner_services_practitioner_profi_de52` |
| `location_id` | `organization.locations` | `fk_appointment_practitioner_services_location_id_locations` |
| `organization_id` | `organization.organizations` | `fk_appointment_practitioner_services_organization_id_or_328c` |
| `location_id_internal_id` | `organization.locations` | `fk_appointment_practitioner_services_location_id_locati_e2b2` |
| `organization_id_internal_id` | `organization.organizations` | `fk_appointment_practitioner_services_organization_id_or_7c6f` |
| `practitioner_profile_id_internal_id` | `clinical.practitioner_profiles` | `fk_appointment_practitioner_services_practitioner_profi_c30c` |
| `service_type_id_internal_id` | `appointment.service_types` | `fk_appointment_practitioner_services_service_type_id_se_6043` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_appointment_practitioner_services_practitioner` | `CREATE INDEX ix_appointment_practitioner_services_practitioner ON appointment.practitioner_services USING btree (practitioner_profile_id)` |
| `pk_appointment_practitioner_services` | `CREATE UNIQUE INDEX pk_appointment_practitioner_services ON appointment.practitioner_services USING btree (internal_id)` |
| `practitioner_service_location` | `CREATE UNIQUE INDEX practitioner_service_location ON appointment.practitioner_services USING btree (practitioner_profile_id, service_type_id, organization_id, location_id) NULLS NOT DISTINCT` |
| `uq_appointment_practitioner_services_id` | `CREATE UNIQUE INDEX uq_appointment_practitioner_services_id ON appointment.practitioner_services USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON appointment.practitioner_services FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"],["practitioner_profile_id","practitioner_profile_id_internal_id","clinical","practitioner_profiles"],["service_type_id","service_type_id_internal_id","appointment","service_types"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON appointment.practitioner_services FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON appointment.practitioner_services FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"],["practitioner_profile_id","practitioner_profile_id_internal_id","clinical","practitioner_profiles"],["service_type_id","service_type_id_internal_id","appointment","service_types"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
