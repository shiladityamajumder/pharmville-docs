# `clinical.consultations`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds consultations records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | clinical.consultations |
| Classification | Transactional |
| Proposed business write owner | Future clinical-care owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 23 columns; 20 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `appointment_id` | `uuid` | Yes | — | Reference linking this record to appointments | Ensures related business data can be joined and validated | FK → `appointment.appointments` via `fk_clinical_consultations_appointment_id_appointments` |
| `appointment_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.appointments` via `fk_clinical_consultations_appointment_id_appointments_numeric` |
| `care_episode_id` | `uuid` | Yes | — | Reference linking this record to care episodes | Ensures related business data can be joined and validated | FK → `clinical.care_episodes` via `fk_clinical_consultations_care_episode_id_care_episodes` |
| `care_episode_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.care_episodes` via `fk_clinical_consultations_care_episode_id_care_episodes_numeric` |
| `chief_complaint` | `text` | Yes | — | Inferred: stores chief complaint for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `clinical_notes_encrypted` | `bytea` | Yes | — | Inferred: stores clinical notes encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `consultation_type` | `character varying(32)` | No | — | Inferred: stores consultation type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_consultations_created_by_users` |
| `doctor_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_consultations_doctor_user_id_users` |
| `encryption_key_version` | `character varying(64)` | Yes | — | Inferred: stores encryption key version for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `ended_at` | `timestamp with time zone` | Yes | — | Time of ended | Support chronology, deadlines or audit evidence | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` via `fk_clinical_consultations_patient_profile_id_patient_profiles` |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` via `fk_clinical_consultations_patient_profile_id_patient_pr_496c` |
| `practitioner_profile_id` | `uuid` | Yes | — | Reference linking this record to practitioner profiles | Ensures related business data can be joined and validated | FK → `clinical.practitioner_profiles` via `fk_clinical_consultations_practitioner_profile_id_pract_1d98` |
| `practitioner_profile_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.practitioner_profiles` via `fk_clinical_consultations_practitioner_profile_id_pract_eab0` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `started_at` | `timestamp with time zone` | Yes | — | Time of started | Support chronology, deadlines or audit evidence | Exact constraints below |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_consultations_updated_by_users` |

## Record lifecycle and users

- **Created:** when the consultations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.consultations` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_clinical_consultations_appointment_id_appointments | `appointment_id` | [`appointment.appointments`](../../Tables/appointment/appointments.md) | `FOREIGN KEY (appointment_id) REFERENCES appointment.appointments(id) ON DELETE SET NULL` |
| fk_clinical_consultations_appointment_id_appointments_numeric | `appointment_id_internal_id` | [`appointment.appointments`](../../Tables/appointment/appointments.md) | `FOREIGN KEY (appointment_id_internal_id) REFERENCES appointment.appointments(internal_id) ON DELETE SET NULL` |
| fk_clinical_consultations_care_episode_id_care_episodes | `care_episode_id` | [`clinical.care_episodes`](../../Tables/clinical/care_episodes.md) | `FOREIGN KEY (care_episode_id) REFERENCES clinical.care_episodes(id) ON DELETE SET NULL` |
| fk_clinical_consultations_care_episode_id_care_episodes_numeric | `care_episode_id_internal_id` | [`clinical.care_episodes`](../../Tables/clinical/care_episodes.md) | `FOREIGN KEY (care_episode_id_internal_id) REFERENCES clinical.care_episodes(internal_id) ON DELETE SET NULL` |
| fk_clinical_consultations_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_consultations_doctor_user_id_users | `doctor_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (doctor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_consultations_patient_profile_id_patient_pr_496c | `patient_profile_id_internal_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| fk_clinical_consultations_patient_profile_id_patient_profiles | `patient_profile_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| fk_clinical_consultations_practitioner_profile_id_pract_1d98 | `practitioner_profile_id` | [`clinical.practitioner_profiles`](../../Tables/clinical/practitioner_profiles.md) | `FOREIGN KEY (practitioner_profile_id) REFERENCES clinical.practitioner_profiles(id) ON DELETE SET NULL` |
| fk_clinical_consultations_practitioner_profile_id_pract_eab0 | `practitioner_profile_id_internal_id` | [`clinical.practitioner_profiles`](../../Tables/clinical/practitioner_profiles.md) | `FOREIGN KEY (practitioner_profile_id_internal_id) REFERENCES clinical.practitioner_profiles(internal_id) ON DELETE SET NULL` |
| fk_clinical_consultations_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`clinical.diagnoses`](../../Tables/clinical/diagnoses.md) | fk_clinical_diagnoses_consultation_id_consultations | `consultation_id` | `id` |
| [`clinical.diagnoses`](../../Tables/clinical/diagnoses.md) | fk_clinical_diagnoses_consultation_id_consultations_numeric | `consultation_id_internal_id` | `internal_id` |
| [`clinical.observations`](../../Tables/clinical/observations.md) | fk_clinical_observations_consultation_id_consultations | `consultation_id` | `id` |
| [`clinical.observations`](../../Tables/clinical/observations.md) | fk_clinical_observations_consultation_id_consultations_numeric | `consultation_id_internal_id` | `internal_id` |
| [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | fk_clinical_prescriptions_consultation_id_consultations | `consultation_id` | `id` |
| [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | fk_clinical_prescriptions_consultation_id_consultations_numeric | `consultation_id_internal_id` | `internal_id` |

## `clinical.consultations` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `appointment_id` | `appointment.appointments` | `fk_clinical_consultations_appointment_id_appointments` |
| `appointment_id_internal_id` | `appointment.appointments` | `fk_clinical_consultations_appointment_id_appointments_numeric` |
| `care_episode_id` | `clinical.care_episodes` | `fk_clinical_consultations_care_episode_id_care_episodes` |
| `care_episode_id_internal_id` | `clinical.care_episodes` | `fk_clinical_consultations_care_episode_id_care_episodes_numeric` |
| `created_by` | `identity.users` | `fk_clinical_consultations_created_by_users` |
| `doctor_user_id` | `identity.users` | `fk_clinical_consultations_doctor_user_id_users` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_clinical_consultations_patient_profile_id_patient_pr_496c` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_clinical_consultations_patient_profile_id_patient_profiles` |
| `practitioner_profile_id` | `clinical.practitioner_profiles` | `fk_clinical_consultations_practitioner_profile_id_pract_1d98` |
| `practitioner_profile_id_internal_id` | `clinical.practitioner_profiles` | `fk_clinical_consultations_practitioner_profile_id_pract_eab0` |
| `updated_by` | `identity.users` | `fk_clinical_consultations_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_consultations_consultation_times` | CHECK | `CHECK (ended_at IS NULL OR started_at IS NULL OR ended_at >= started_at)` |
| `ck_clinical_consultations_consultationstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['scheduled'::text, 'waiting'::text, 'in_progress'::text, 'completed'::text, 'cancelled'::text]))` |
| `ck_clinical_consultations_numeric_pair_appointment_id` | CHECK | `CHECK ((appointment_id IS NULL) = (appointment_id_internal_id IS NULL))` |
| `ck_clinical_consultations_numeric_pair_care_episode_id` | CHECK | `CHECK ((care_episode_id IS NULL) = (care_episode_id_internal_id IS NULL))` |
| `ck_clinical_consultations_numeric_pair_patient_profile_id` | CHECK | `CHECK ((patient_profile_id IS NULL) = (patient_profile_id_internal_id IS NULL))` |
| `ck_clinical_consultations_numeric_pair_practitioner_profile_id` | CHECK | `CHECK ((practitioner_profile_id IS NULL) = (practitioner_profile_id_internal_id IS NULL))` |
| `ck_clinical_consultations_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_clinical_consultations_appointment_id_appointments` | FOREIGN KEY | `FOREIGN KEY (appointment_id) REFERENCES appointment.appointments(id) ON DELETE SET NULL` |
| `fk_clinical_consultations_appointment_id_appointments_numeric` | FOREIGN KEY | `FOREIGN KEY (appointment_id_internal_id) REFERENCES appointment.appointments(internal_id) ON DELETE SET NULL` |
| `fk_clinical_consultations_care_episode_id_care_episodes` | FOREIGN KEY | `FOREIGN KEY (care_episode_id) REFERENCES clinical.care_episodes(id) ON DELETE SET NULL` |
| `fk_clinical_consultations_care_episode_id_care_episodes_numeric` | FOREIGN KEY | `FOREIGN KEY (care_episode_id_internal_id) REFERENCES clinical.care_episodes(internal_id) ON DELETE SET NULL` |
| `fk_clinical_consultations_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_consultations_doctor_user_id_users` | FOREIGN KEY | `FOREIGN KEY (doctor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_consultations_patient_profile_id_patient_pr_496c` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| `fk_clinical_consultations_patient_profile_id_patient_profiles` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| `fk_clinical_consultations_practitioner_profile_id_pract_1d98` | FOREIGN KEY | `FOREIGN KEY (practitioner_profile_id) REFERENCES clinical.practitioner_profiles(id) ON DELETE SET NULL` |
| `fk_clinical_consultations_practitioner_profile_id_pract_eab0` | FOREIGN KEY | `FOREIGN KEY (practitioner_profile_id_internal_id) REFERENCES clinical.practitioner_profiles(internal_id) ON DELETE SET NULL` |
| `fk_clinical_consultations_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_clinical_consultations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_clinical_consultations_id` | UNIQUE | `UNIQUE (id)` |
| `consultations_consultation_type_not_null` | NOT NULL | `NOT NULL consultation_type` |
| `consultations_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `consultations_doctor_user_id_not_null` | NOT NULL | `NOT NULL doctor_user_id` |
| `consultations_id_not_null` | NOT NULL | `NOT NULL id` |
| `consultations_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `consultations_patient_profile_id_internal_id_not_null` | NOT NULL | `NOT NULL patient_profile_id_internal_id` |
| `consultations_patient_profile_id_not_null` | NOT NULL | `NOT NULL patient_profile_id` |
| `consultations_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `consultations_status_not_null` | NOT NULL | `NOT NULL status` |
| `consultations_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_clinical_consultations_appointment` | btree | `(appointment_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_consultations_appointment ON clinical.consultations USING btree (appointment_id)` |
| `ix_clinical_consultations_doctor` | btree | `(doctor_user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_consultations_doctor ON clinical.consultations USING btree (doctor_user_id)` |
| `ix_clinical_consultations_patient` | btree | `(patient_profile_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_consultations_patient ON clinical.consultations USING btree (patient_profile_id)` |
| `ix_clinical_consultations_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_consultations_status ON clinical.consultations USING btree (status)` |
| `pk_clinical_consultations` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_clinical_consultations ON clinical.consultations USING btree (internal_id)` |
| `uq_clinical_consultations_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_consultations_id ON clinical.consultations USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.consultations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["appointment_id","appointment_id_internal_id","appointment","appointments"],["care_episode_id","care_episode_id_internal_id","clinical","care_episodes"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["practitioner_profile_id","practitioner_profile_id_internal_id","clinical","practitioner_profiles"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.consultations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.consultations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["appointment_id","appointment_id_internal_id","appointment","appointments"],["care_episode_id","care_episode_id_internal_id","clinical","care_episodes"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["practitioner_profile_id","practitioner_profile_id_internal_id","clinical","practitioner_profiles"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
