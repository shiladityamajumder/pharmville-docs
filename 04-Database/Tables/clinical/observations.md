# `clinical.observations`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds observations records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 19 columns, 12 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | Yes | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `code_system` | `character varying(64)` | Yes | — | Inferred: stores code system for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `consultation_id` | `uuid` | Yes | — | Reference linking this record to consultations | Ensures related business data can be joined and validated | FK → `clinical.consultations` (fk_clinical_observations_consultation_id_consultations) |
| `consultation_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.consultations` (fk_clinical_observations_consultation_id_consultations_numeric); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_observations_created_by_users) |
| `display` | `character varying(255)` | No | — | Inferred: stores display for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `observed_at` | `timestamp with time zone` | No | — | Time of observed | Support chronology, deadlines or audit evidence | See exact constraints |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` (fk_clinical_observations_patient_profile_id_patient_profiles) |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` (fk_clinical_observations_patient_profile_id_patient_pro_995e); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_observations_updated_by_users) |
| `value_json` | `jsonb` | Yes | — | Structured value json information | Retain a versioned payload or relevant details | See exact constraints |
| `value_quantity` | `numeric(18,6)` | Yes | — | Value quantity value | Track resource or item amounts accurately | See exact constraints |
| `value_text` | `text` | Yes | — | Inferred: stores value text for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `value_unit` | `character varying(32)` | Yes | — | Inferred: stores value unit for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the observations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.observations` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_clinical_observations_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_clinical_observations_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `consultation_id` → `clinical.consultations(id)` via `fk_clinical_observations_consultation_id_consultations`; `FOREIGN KEY (consultation_id) REFERENCES clinical.consultations(id) ON DELETE SET NULL`
- `patient_profile_id` → `clinical.patient_profiles(id)` via `fk_clinical_observations_patient_profile_id_patient_profiles`; `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT`
- `consultation_id_internal_id` → `clinical.consultations(internal_id)` via `fk_clinical_observations_consultation_id_consultations_numeric`; `FOREIGN KEY (consultation_id_internal_id) REFERENCES clinical.consultations(internal_id) ON DELETE SET NULL`
- `patient_profile_id_internal_id` → `clinical.patient_profiles(internal_id)` via `fk_clinical_observations_patient_profile_id_patient_pro_995e`; `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT`

## `clinical.observations` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 19 columns, 12 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_clinical_observations_created_by_users` |
| `updated_by` | `identity.users` | `fk_clinical_observations_updated_by_users` |
| `consultation_id` | `clinical.consultations` | `fk_clinical_observations_consultation_id_consultations` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_clinical_observations_patient_profile_id_patient_profiles` |
| `consultation_id_internal_id` | `clinical.consultations` | `fk_clinical_observations_consultation_id_consultations_numeric` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_clinical_observations_patient_profile_id_patient_pro_995e` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_observations_finite_numeric_values` | CHECK | `CHECK (value_quantity IS NULL OR (value_quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_clinical_observations_numeric_pair_consultation_id` | CHECK | `CHECK ((consultation_id IS NULL) = (consultation_id_internal_id IS NULL))` |
| `ck_clinical_observations_numeric_pair_patient_profile_id` | CHECK | `CHECK ((patient_profile_id IS NULL) = (patient_profile_id_internal_id IS NULL))` |
| `ck_clinical_observations_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_clinical_observations_consultation_id_consultations` | FOREIGN KEY | `FOREIGN KEY (consultation_id) REFERENCES clinical.consultations(id) ON DELETE SET NULL` |
| `fk_clinical_observations_consultation_id_consultations_numeric` | FOREIGN KEY | `FOREIGN KEY (consultation_id_internal_id) REFERENCES clinical.consultations(internal_id) ON DELETE SET NULL` |
| `fk_clinical_observations_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_observations_patient_profile_id_patient_pro_995e` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| `fk_clinical_observations_patient_profile_id_patient_profiles` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| `fk_clinical_observations_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_clinical_observations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_clinical_observations_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_clinical_observations_code` | `CREATE INDEX ix_clinical_observations_code ON clinical.observations USING btree (code_system, code)` |
| `ix_clinical_observations_patient_time` | `CREATE INDEX ix_clinical_observations_patient_time ON clinical.observations USING btree (patient_profile_id, observed_at)` |
| `pk_clinical_observations` | `CREATE UNIQUE INDEX pk_clinical_observations ON clinical.observations USING btree (internal_id)` |
| `uq_clinical_observations_id` | `CREATE UNIQUE INDEX uq_clinical_observations_id ON clinical.observations USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.observations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["consultation_id","consultation_id_internal_id","clinical","consultations"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.observations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.observations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["consultation_id","consultation_id_internal_id","clinical","consultations"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
