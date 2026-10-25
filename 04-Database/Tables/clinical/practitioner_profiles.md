# `clinical.practitioner_profiles`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds practitioner profiles records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | clinical.practitioner_profiles |
| Classification | Master / Reference |
| Proposed business write owner | Pharmacist_Review |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 8 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_practitioner_profiles_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_practitioner_profiles_deleted_by_users` |
| `hpr_id` | `character varying(128)` | Yes | — | Identifier associated with hpr | Link the event or entity to its subject; verify constraints | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `practitioner_type` | `character varying(32)` | No | — | Inferred: stores practitioner type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `profile_metadata` | `jsonb` | No | `'{}'::jsonb` | Structured profile metadata information | Retain a versioned payload or relevant details | Exact constraints below |
| `qualification` | `character varying(255)` | Yes | — | Inferred: stores qualification for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `registration_council` | `character varying(255)` | No | — | Inferred: stores registration council for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `registration_number` | `character varying(128)` | No | — | Inferred: stores registration number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `specialization` | `character varying(128)` | Yes | — | Inferred: stores specialization for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_practitioner_profiles_updated_by_users` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_practitioner_profiles_user_id_users` |
| `verification_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores verification status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `verified_at` | `timestamp with time zone` | Yes | — | Time of verified | Support chronology, deadlines or audit evidence | Exact constraints below |
| `years_of_experience` | `integer` | Yes | — | Inferred: stores years of experience for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the practitioner profiles business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.practitioner_profiles` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_clinical_practitioner_profiles_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_practitioner_profiles_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_practitioner_profiles_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_practitioner_profiles_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`appointment.appointments`](../../Tables/appointment/appointments.md) | fk_appointment_appointments_practitioner_profile_id_pra_450f | `practitioner_profile_id` | `id` |
| [`appointment.appointments`](../../Tables/appointment/appointments.md) | fk_appointment_appointments_practitioner_profile_id_pra_e47a | `practitioner_profile_id_internal_id` | `internal_id` |
| [`appointment.practitioner_services`](../../Tables/appointment/practitioner_services.md) | fk_appointment_practitioner_services_practitioner_profi_c30c | `practitioner_profile_id_internal_id` | `internal_id` |
| [`appointment.practitioner_services`](../../Tables/appointment/practitioner_services.md) | fk_appointment_practitioner_services_practitioner_profi_de52 | `practitioner_profile_id` | `id` |
| [`clinical.consultations`](../../Tables/clinical/consultations.md) | fk_clinical_consultations_practitioner_profile_id_pract_1d98 | `practitioner_profile_id` | `id` |
| [`clinical.consultations`](../../Tables/clinical/consultations.md) | fk_clinical_consultations_practitioner_profile_id_pract_eab0 | `practitioner_profile_id_internal_id` | `internal_id` |
| [`clinical.practitioner_organizations`](../../Tables/clinical/practitioner_organizations.md) | fk_clinical_practitioner_organizations_practitioner_pro_46c4 | `practitioner_profile_id` | `id` |
| [`clinical.practitioner_organizations`](../../Tables/clinical/practitioner_organizations.md) | fk_clinical_practitioner_organizations_practitioner_pro_6ec9 | `practitioner_profile_id_internal_id` | `internal_id` |

## `clinical.practitioner_profiles` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_clinical_practitioner_profiles_created_by_users` |
| `deleted_by` | `identity.users` | `fk_clinical_practitioner_profiles_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_clinical_practitioner_profiles_updated_by_users` |
| `user_id` | `identity.users` | `fk_clinical_practitioner_profiles_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_practitioner_profiles_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_clinical_practitioner_profiles_verificationstatus` | CHECK | `CHECK (verification_status::text = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text, 'expired'::text]))` |
| `fk_clinical_practitioner_profiles_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_practitioner_profiles_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_practitioner_profiles_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_practitioner_profiles_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_clinical_practitioner_profiles` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_clinical_practitioner_profiles_id` | UNIQUE | `UNIQUE (id)` |
| `practitioner_profiles_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `practitioner_profiles_id_not_null` | NOT NULL | `NOT NULL id` |
| `practitioner_profiles_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `practitioner_profiles_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `practitioner_profiles_practitioner_type_not_null` | NOT NULL | `NOT NULL practitioner_type` |
| `practitioner_profiles_profile_metadata_not_null` | NOT NULL | `NOT NULL profile_metadata` |
| `practitioner_profiles_registration_council_not_null` | NOT NULL | `NOT NULL registration_council` |
| `practitioner_profiles_registration_number_not_null` | NOT NULL | `NOT NULL registration_number` |
| `practitioner_profiles_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `practitioner_profiles_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `practitioner_profiles_user_id_not_null` | NOT NULL | `NOT NULL user_id` |
| `practitioner_profiles_verification_status_not_null` | NOT NULL | `NOT NULL verification_status` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_clinical_practitioner_profiles` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_clinical_practitioner_profiles ON clinical.practitioner_profiles USING btree (internal_id)` |
| `uq_clinical_practitioner_profiles_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_practitioner_profiles_id ON clinical.practitioner_profiles USING btree (id)` |
| `uq_clinical_practitioner_registration_active` | btree | `(registration_number, registration_council)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_practitioner_registration_active ON clinical.practitioner_profiles USING btree (registration_number, registration_council) WHERE is_deleted = false` |
| `uq_clinical_practitioner_user_active` | btree | `(user_id)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_practitioner_user_active ON clinical.practitioner_profiles USING btree (user_id) WHERE is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.practitioner_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.practitioner_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.practitioner_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `clinical.practitioner_profiles` |
| Category | Master / Reference — Verified practitioner identity and qualifications |
| Proposed owner / maintenance role | Pharmacist_Review / Credentialing administrator |
| Scope | User/patient-specific protected party master. |
| Referencing tables | `appointment.appointments`, `appointment.practitioner_services`, `clinical.consultations`, `clinical.practitioner_organizations` |
| Features | `PHM-01`, `PHM-03`, `PHM-05`, `RX-05` |
| API consumers | [API-060](../../../03-Modules/Pharmacist_Review/APIs.md), [API-062](../../../03-Modules/Pharmacist_Review/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `practitioner_type`, `registration_council`, `registration_number`, `user_id`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Credentialing administrator through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | No is_active/status column. Soft-delete through is_deleted only after privacy/reference review; retain historical FK targets. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_clinical_practitioner_profiles_id ON clinical.practitioner_profiles USING btree (id); CREATE UNIQUE INDEX uq_clinical_practitioner_registration_active ON clinical.practitioner_profiles USING btree (registration_number, registration_council) WHERE is_deleted = false; CREATE UNIQUE INDEX uq_clinical_practitioner_user_active ON clinical.practitioner_profiles USING btree (user_id) WHERE is_deleted = false |
| Foreign-key dependencies | No non-actor FK dependencies recorded. |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-006/D-019 clinical/catalog source validation. |
