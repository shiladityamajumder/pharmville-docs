# clinical.consultations

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds consultations records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 23 columns, 20 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `appointment_id` | `uuid` | Yes | — | Reference linking this record to appointments | Ensures related business data can be joined and validated | FK → `appointment.appointments` (fk_clinical_consultations_appointment_id_appointments) |
| `appointment_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.appointments` (fk_clinical_consultations_appointment_id_appointments_numeric); Numeric/public-key pair verification required |
| `care_episode_id` | `uuid` | Yes | — | Reference linking this record to care episodes | Ensures related business data can be joined and validated | FK → `clinical.care_episodes` (fk_clinical_consultations_care_episode_id_care_episodes) |
| `care_episode_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.care_episodes` (fk_clinical_consultations_care_episode_id_care_episodes_numeric); Numeric/public-key pair verification required |
| `chief_complaint` | `text` | Yes | — | Inferred: stores chief complaint for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `clinical_notes_encrypted` | `bytea` | Yes | — | Inferred: stores clinical notes encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `consultation_type` | `character varying(32)` | No | — | Inferred: stores consultation type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_consultations_created_by_users) |
| `doctor_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_consultations_doctor_user_id_users) |
| `encryption_key_version` | `character varying(64)` | Yes | — | Inferred: stores encryption key version for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `ended_at` | `timestamp with time zone` | Yes | — | Time of ended | Support chronology, deadlines or audit evidence | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` (fk_clinical_consultations_patient_profile_id_patient_profiles) |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` (fk_clinical_consultations_patient_profile_id_patient_pr_496c); Numeric/public-key pair verification required |
| `practitioner_profile_id` | `uuid` | Yes | — | Reference linking this record to practitioner profiles | Ensures related business data can be joined and validated | FK → `clinical.practitioner_profiles` (fk_clinical_consultations_practitioner_profile_id_pract_1d98) |
| `practitioner_profile_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.practitioner_profiles` (fk_clinical_consultations_practitioner_profile_id_pract_eab0); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `started_at` | `timestamp with time zone` | Yes | — | Time of started | Support chronology, deadlines or audit evidence | See exact constraints |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_consultations_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the consultations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.consultations` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `doctor_user_id` → `identity.users(id)` via `fk_clinical_consultations_doctor_user_id_users`; FOREIGN KEY (doctor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `created_by` → `identity.users(id)` via `fk_clinical_consultations_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_clinical_consultations_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `appointment_id` → `appointment.appointments(id)` via `fk_clinical_consultations_appointment_id_appointments`; FOREIGN KEY (appointment_id) REFERENCES appointment.appointments(id) ON DELETE SET NULL
- `patient_profile_id` → `clinical.patient_profiles(id)` via `fk_clinical_consultations_patient_profile_id_patient_profiles`; FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT
- `care_episode_id` → `clinical.care_episodes(id)` via `fk_clinical_consultations_care_episode_id_care_episodes`; FOREIGN KEY (care_episode_id) REFERENCES clinical.care_episodes(id) ON DELETE SET NULL
- `practitioner_profile_id` → `clinical.practitioner_profiles(id)` via `fk_clinical_consultations_practitioner_profile_id_pract_1d98`; FOREIGN KEY (practitioner_profile_id) REFERENCES clinical.practitioner_profiles(id) ON DELETE SET NULL
- `appointment_id_internal_id` → `appointment.appointments(internal_id)` via `fk_clinical_consultations_appointment_id_appointments_numeric`; FOREIGN KEY (appointment_id_internal_id) REFERENCES appointment.appointments(internal_id) ON DELETE SET NULL
- `care_episode_id_internal_id` → `clinical.care_episodes(internal_id)` via `fk_clinical_consultations_care_episode_id_care_episodes_numeric`; FOREIGN KEY (care_episode_id_internal_id) REFERENCES clinical.care_episodes(internal_id) ON DELETE SET NULL
- `patient_profile_id_internal_id` → `clinical.patient_profiles(internal_id)` via `fk_clinical_consultations_patient_profile_id_patient_pr_496c`; FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT
- `practitioner_profile_id_internal_id` → `clinical.practitioner_profiles(internal_id)` via `fk_clinical_consultations_practitioner_profile_id_pract_eab0`; FOREIGN KEY (practitioner_profile_id_internal_id) REFERENCES clinical.practitioner_profiles(internal_id) ON DELETE SET NULL

**Referenced by 6 FK constraints** (sample): `clinical.diagnoses`, `clinical.observations`, `clinical.prescriptions`, `clinical.diagnoses`, `clinical.observations`, `clinical.prescriptions`.

## clinical.consultations — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 23 columns, 20 constraints, 6 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `doctor_user_id` | `identity.users` | `fk_clinical_consultations_doctor_user_id_users` |
| `created_by` | `identity.users` | `fk_clinical_consultations_created_by_users` |
| `updated_by` | `identity.users` | `fk_clinical_consultations_updated_by_users` |
| `appointment_id` | `appointment.appointments` | `fk_clinical_consultations_appointment_id_appointments` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_clinical_consultations_patient_profile_id_patient_profiles` |
| `care_episode_id` | `clinical.care_episodes` | `fk_clinical_consultations_care_episode_id_care_episodes` |
| `practitioner_profile_id` | `clinical.practitioner_profiles` | `fk_clinical_consultations_practitioner_profile_id_pract_1d98` |
| `appointment_id_internal_id` | `appointment.appointments` | `fk_clinical_consultations_appointment_id_appointments_numeric` |
| `care_episode_id_internal_id` | `clinical.care_episodes` | `fk_clinical_consultations_care_episode_id_care_episodes_numeric` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_clinical_consultations_patient_profile_id_patient_pr_496c` |
| `practitioner_profile_id_internal_id` | `clinical.practitioner_profiles` | `fk_clinical_consultations_practitioner_profile_id_pract_eab0` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_clinical_consultations_appointment` | `CREATE INDEX ix_clinical_consultations_appointment ON clinical.consultations USING btree (appointment_id)` |
| `ix_clinical_consultations_doctor` | `CREATE INDEX ix_clinical_consultations_doctor ON clinical.consultations USING btree (doctor_user_id)` |
| `ix_clinical_consultations_patient` | `CREATE INDEX ix_clinical_consultations_patient ON clinical.consultations USING btree (patient_profile_id)` |
| `ix_clinical_consultations_status` | `CREATE INDEX ix_clinical_consultations_status ON clinical.consultations USING btree (status)` |
| `pk_clinical_consultations` | `CREATE UNIQUE INDEX pk_clinical_consultations ON clinical.consultations USING btree (internal_id)` |
| `uq_clinical_consultations_id` | `CREATE UNIQUE INDEX uq_clinical_consultations_id ON clinical.consultations USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.consultations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["appointment_id","appointment_id_internal_id","appointment","appointments"],["care_episode_id","care_episode_id_internal_id","clinical","care_episodes"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["practitioner_profile_id","practitioner_profile_id_internal_id","clinical","practitioner_profiles"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.consultations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.consultations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["appointment_id","appointment_id_internal_id","appointment","appointments"],["care_episode_id","care_episode_id_internal_id","clinical","care_episodes"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["practitioner_profile_id","practitioner_profile_id_internal_id","clinical","practitioner_profiles"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
