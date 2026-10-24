# `clinical.prescriptions`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds prescriptions records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 23 columns, 18 constraints, 10 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `consultation_id` | `uuid` | Yes | — | Reference linking this record to consultations | Ensures related business data can be joined and validated | FK → `clinical.consultations` (fk_clinical_prescriptions_consultation_id_consultations) |
| `consultation_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.consultations` (fk_clinical_prescriptions_consultation_id_consultations_numeric); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_prescriptions_created_by_users) |
| `digital_signature` | `bytea` | Yes | — | Inferred: stores digital signature for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `issued_at` | `timestamp with time zone` | Yes | — | Time of issued | Support chronology, deadlines or audit evidence | See exact constraints |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` (fk_clinical_prescriptions_patient_profile_id_patient_profiles) |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` (fk_clinical_prescriptions_patient_profile_id_patient_pr_5a89); Numeric/public-key pair verification required |
| `prescriber_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_prescriptions_prescriber_user_id_users) |
| `prescription_number` | `character varying(128)` | Yes | — | Inferred: stores prescription number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `review_notes` | `text` | Yes | — | Inferred: stores review notes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `reviewed_at` | `timestamp with time zone` | Yes | — | Time of reviewed | Support chronology, deadlines or audit evidence | See exact constraints |
| `reviewed_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_prescriptions_reviewed_by_user_id_users) |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `signature_algorithm` | `character varying(64)` | Yes | — | Inferred: stores signature algorithm for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `source` | `character varying(32)` | No | — | Inferred: stores source for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `status` | `character varying(18)` | No | `'uploaded'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_prescriptions_updated_by_users) |
| `uploaded_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_prescriptions_uploaded_by_user_id_users) |
| `valid_until` | `timestamp with time zone` | Yes | — | Inferred: stores valid until for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the prescriptions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.prescriptions` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `prescriber_user_id` → `identity.users(id)` via `fk_clinical_prescriptions_prescriber_user_id_users`; `FOREIGN KEY (prescriber_user_id) REFERENCES identity.users(id) ON DELETE SET NULL`
- `uploaded_by_user_id` → `identity.users(id)` via `fk_clinical_prescriptions_uploaded_by_user_id_users`; `FOREIGN KEY (uploaded_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `reviewed_by_user_id` → `identity.users(id)` via `fk_clinical_prescriptions_reviewed_by_user_id_users`; `FOREIGN KEY (reviewed_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL`
- `created_by` → `identity.users(id)` via `fk_clinical_prescriptions_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_clinical_prescriptions_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `patient_profile_id` → `clinical.patient_profiles(id)` via `fk_clinical_prescriptions_patient_profile_id_patient_profiles`; `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT`
- `consultation_id` → `clinical.consultations(id)` via `fk_clinical_prescriptions_consultation_id_consultations`; `FOREIGN KEY (consultation_id) REFERENCES clinical.consultations(id) ON DELETE SET NULL`
- `consultation_id_internal_id` → `clinical.consultations(internal_id)` via `fk_clinical_prescriptions_consultation_id_consultations_numeric`; `FOREIGN KEY (consultation_id_internal_id) REFERENCES clinical.consultations(internal_id) ON DELETE SET NULL`
- `patient_profile_id_internal_id` → `clinical.patient_profiles(internal_id)` via `fk_clinical_prescriptions_patient_profile_id_patient_pr_5a89`; `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT`

**Referenced by 16 FK constraints** (sample): `clinical.prescription_documents`, `clinical.prescription_items`, `clinical.prescription_access_logs`, `commerce.cart_items`, `commerce.order_items`, `compliance.adverse_event_reports`, `clinical.order_reviews`, `clinical.order_reviews`, `clinical.order_reviews`, `clinical.order_reviews`, `clinical.prescription_access_logs`, `clinical.prescription_documents`.

## `clinical.prescriptions` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 23 columns, 18 constraints, 10 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `prescriber_user_id` | `identity.users` | `fk_clinical_prescriptions_prescriber_user_id_users` |
| `uploaded_by_user_id` | `identity.users` | `fk_clinical_prescriptions_uploaded_by_user_id_users` |
| `reviewed_by_user_id` | `identity.users` | `fk_clinical_prescriptions_reviewed_by_user_id_users` |
| `created_by` | `identity.users` | `fk_clinical_prescriptions_created_by_users` |
| `updated_by` | `identity.users` | `fk_clinical_prescriptions_updated_by_users` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_clinical_prescriptions_patient_profile_id_patient_profiles` |
| `consultation_id` | `clinical.consultations` | `fk_clinical_prescriptions_consultation_id_consultations` |
| `consultation_id_internal_id` | `clinical.consultations` | `fk_clinical_prescriptions_consultation_id_consultations_numeric` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_clinical_prescriptions_patient_profile_id_patient_pr_5a89` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_prescriptions_numeric_pair_consultation_id` | CHECK | `CHECK ((consultation_id IS NULL) = (consultation_id_internal_id IS NULL))` |
| `ck_clinical_prescriptions_numeric_pair_patient_profile_id` | CHECK | `CHECK ((patient_profile_id IS NULL) = (patient_profile_id_internal_id IS NULL))` |
| `ck_clinical_prescriptions_prescription_dates` | CHECK | `CHECK (valid_until IS NULL OR issued_at IS NULL OR valid_until >= issued_at)` |
| `ck_clinical_prescriptions_prescriptionstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['uploaded'::text, 'under_review'::text, 'approved'::text, 'partially_approved'::text, 'rejected'::text, 'expired'::text, 'cancelled'::text]))` |
| `ck_clinical_prescriptions_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_clinical_prescriptions_consultation_id_consultations` | FOREIGN KEY | `FOREIGN KEY (consultation_id) REFERENCES clinical.consultations(id) ON DELETE SET NULL` |
| `fk_clinical_prescriptions_consultation_id_consultations_numeric` | FOREIGN KEY | `FOREIGN KEY (consultation_id_internal_id) REFERENCES clinical.consultations(internal_id) ON DELETE SET NULL` |
| `fk_clinical_prescriptions_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_prescriptions_patient_profile_id_patient_pr_5a89` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| `fk_clinical_prescriptions_patient_profile_id_patient_profiles` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| `fk_clinical_prescriptions_prescriber_user_id_users` | FOREIGN KEY | `FOREIGN KEY (prescriber_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_clinical_prescriptions_reviewed_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (reviewed_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_clinical_prescriptions_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_prescriptions_uploaded_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (uploaded_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_clinical_prescriptions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_clinical_prescriptions_id` | UNIQUE | `UNIQUE (id)` |
| `uq_clinical_prescriptions_id_patient` | UNIQUE | `UNIQUE (id, patient_profile_id)` |
| `uq_numeric_clinical_prescriptions_internal_id_patient_p_2997` | UNIQUE | `UNIQUE (internal_id, patient_profile_id_internal_id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_clinical_prescriptions_consultation` | `CREATE INDEX ix_clinical_prescriptions_consultation ON clinical.prescriptions USING btree (consultation_id)` |
| `ix_clinical_prescriptions_patient` | `CREATE INDEX ix_clinical_prescriptions_patient ON clinical.prescriptions USING btree (patient_profile_id)` |
| `ix_clinical_prescriptions_prescriber` | `CREATE INDEX ix_clinical_prescriptions_prescriber ON clinical.prescriptions USING btree (prescriber_user_id)` |
| `ix_clinical_prescriptions_reviewed_by` | `CREATE INDEX ix_clinical_prescriptions_reviewed_by ON clinical.prescriptions USING btree (reviewed_by_user_id)` |
| `ix_clinical_prescriptions_status` | `CREATE INDEX ix_clinical_prescriptions_status ON clinical.prescriptions USING btree (status)` |
| `ix_clinical_prescriptions_uploaded_by` | `CREATE INDEX ix_clinical_prescriptions_uploaded_by ON clinical.prescriptions USING btree (uploaded_by_user_id)` |
| `pk_clinical_prescriptions` | `CREATE UNIQUE INDEX pk_clinical_prescriptions ON clinical.prescriptions USING btree (internal_id)` |
| `uq_clinical_prescriptions_id` | `CREATE UNIQUE INDEX uq_clinical_prescriptions_id ON clinical.prescriptions USING btree (id)` |
| `uq_clinical_prescriptions_id_patient` | `CREATE UNIQUE INDEX uq_clinical_prescriptions_id_patient ON clinical.prescriptions USING btree (id, patient_profile_id)` |
| `uq_numeric_clinical_prescriptions_internal_id_patient_p_2997` | `CREATE UNIQUE INDEX uq_numeric_clinical_prescriptions_internal_id_patient_p_2997 ON clinical.prescriptions USING btree (internal_id, patient_profile_id_internal_id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.prescriptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["consultation_id","consultation_id_internal_id","clinical","consultations"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.prescriptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.prescriptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["consultation_id","consultation_id_internal_id","clinical","consultations"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
