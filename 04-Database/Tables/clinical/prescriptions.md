# `clinical.prescriptions`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds prescriptions records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | clinical.prescriptions |
| Classification | Transactional |
| Proposed business write owner | Prescription_Upload |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 23 columns; 18 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 10 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `consultation_id` | `uuid` | Yes | — | Reference linking this record to consultations | Ensures related business data can be joined and validated | FK → `clinical.consultations` via `fk_clinical_prescriptions_consultation_id_consultations` |
| `consultation_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.consultations` via `fk_clinical_prescriptions_consultation_id_consultations_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_prescriptions_created_by_users` |
| `digital_signature` | `bytea` | Yes | — | Inferred: stores digital signature for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `issued_at` | `timestamp with time zone` | Yes | — | Time of issued | Support chronology, deadlines or audit evidence | Exact constraints below |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` via `fk_clinical_prescriptions_patient_profile_id_patient_profiles` |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` via `fk_clinical_prescriptions_patient_profile_id_patient_pr_5a89` |
| `prescriber_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_prescriptions_prescriber_user_id_users` |
| `prescription_number` | `character varying(128)` | Yes | — | Inferred: stores prescription number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `review_notes` | `text` | Yes | — | Inferred: stores review notes for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `reviewed_at` | `timestamp with time zone` | Yes | — | Time of reviewed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `reviewed_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_prescriptions_reviewed_by_user_id_users` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `signature_algorithm` | `character varying(64)` | Yes | — | Inferred: stores signature algorithm for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `source` | `character varying(32)` | No | — | Inferred: stores source for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `status` | `character varying(18)` | No | `'uploaded'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_prescriptions_updated_by_users` |
| `uploaded_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_prescriptions_uploaded_by_user_id_users` |
| `valid_until` | `timestamp with time zone` | Yes | — | Inferred: stores valid until for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the prescriptions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.prescriptions` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_clinical_prescriptions_consultation_id_consultations | `consultation_id` | [`clinical.consultations`](../../Tables/clinical/consultations.md) | `FOREIGN KEY (consultation_id) REFERENCES clinical.consultations(id) ON DELETE SET NULL` |
| fk_clinical_prescriptions_consultation_id_consultations_numeric | `consultation_id_internal_id` | [`clinical.consultations`](../../Tables/clinical/consultations.md) | `FOREIGN KEY (consultation_id_internal_id) REFERENCES clinical.consultations(internal_id) ON DELETE SET NULL` |
| fk_clinical_prescriptions_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_prescriptions_patient_profile_id_patient_pr_5a89 | `patient_profile_id_internal_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| fk_clinical_prescriptions_patient_profile_id_patient_profiles | `patient_profile_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| fk_clinical_prescriptions_prescriber_user_id_users | `prescriber_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (prescriber_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_clinical_prescriptions_reviewed_by_user_id_users | `reviewed_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (reviewed_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_clinical_prescriptions_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_prescriptions_uploaded_by_user_id_users | `uploaded_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (uploaded_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | fk_clinical_order_reviews_prescription_id_prescriptions | `prescription_id` | `id` |
| [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | fk_clinical_order_reviews_prescription_id_prescriptions_numeric | `prescription_id_internal_id` | `internal_id` |
| [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | fk_clinical_order_reviews_rx_patient | `prescription_id, patient_profile_id` | `id, patient_profile_id` |
| [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | fk_clinical_order_reviews_rx_patient_numeric | `prescription_id_internal_id, patient_profile_id_internal_id` | `internal_id, patient_profile_id_internal_id` |
| [`clinical.prescription_access_logs`](../../Tables/clinical/prescription_access_logs.md) | fk_clinical_prescription_access_logs_prescription_id_pr_2810 | `prescription_id_internal_id` | `internal_id` |
| [`clinical.prescription_access_logs`](../../Tables/clinical/prescription_access_logs.md) | fk_clinical_prescription_access_logs_prescription_id_pr_fb69 | `prescription_id` | `id` |
| [`clinical.prescription_documents`](../../Tables/clinical/prescription_documents.md) | fk_clinical_prescription_documents_prescription_id_pres_4ec8 | `prescription_id` | `id` |
| [`clinical.prescription_documents`](../../Tables/clinical/prescription_documents.md) | fk_clinical_prescription_documents_prescription_id_pres_6c80 | `prescription_id_internal_id` | `internal_id` |
| [`clinical.prescription_items`](../../Tables/clinical/prescription_items.md) | fk_clinical_prescription_items_prescription_id_prescrip_079d | `prescription_id_internal_id` | `internal_id` |
| [`clinical.prescription_items`](../../Tables/clinical/prescription_items.md) | fk_clinical_prescription_items_prescription_id_prescriptions | `prescription_id` | `id` |
| [`commerce.cart_items`](../../Tables/commerce/cart_items.md) | fk_commerce_cart_items_prescription_id_prescriptions | `prescription_id` | `id` |
| [`commerce.cart_items`](../../Tables/commerce/cart_items.md) | fk_commerce_cart_items_prescription_id_prescriptions_numeric | `prescription_id_internal_id` | `internal_id` |
| [`commerce.order_items`](../../Tables/commerce/order_items.md) | fk_commerce_order_items_prescription_id_prescriptions | `prescription_id` | `id` |
| [`commerce.order_items`](../../Tables/commerce/order_items.md) | fk_commerce_order_items_prescription_id_prescriptions_numeric | `prescription_id_internal_id` | `internal_id` |
| [`compliance.adverse_event_reports`](../../Tables/compliance/adverse_event_reports.md) | fk_compliance_adverse_event_reports_prescription_id_pre_401a | `prescription_id_internal_id` | `internal_id` |
| [`compliance.adverse_event_reports`](../../Tables/compliance/adverse_event_reports.md) | fk_compliance_adverse_event_reports_prescription_id_pre_e002 | `prescription_id` | `id` |

## `clinical.prescriptions` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `consultation_id` | `clinical.consultations` | `fk_clinical_prescriptions_consultation_id_consultations` |
| `consultation_id_internal_id` | `clinical.consultations` | `fk_clinical_prescriptions_consultation_id_consultations_numeric` |
| `created_by` | `identity.users` | `fk_clinical_prescriptions_created_by_users` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_clinical_prescriptions_patient_profile_id_patient_pr_5a89` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_clinical_prescriptions_patient_profile_id_patient_profiles` |
| `prescriber_user_id` | `identity.users` | `fk_clinical_prescriptions_prescriber_user_id_users` |
| `reviewed_by_user_id` | `identity.users` | `fk_clinical_prescriptions_reviewed_by_user_id_users` |
| `updated_by` | `identity.users` | `fk_clinical_prescriptions_updated_by_users` |
| `uploaded_by_user_id` | `identity.users` | `fk_clinical_prescriptions_uploaded_by_user_id_users` |

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
| `prescriptions_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `prescriptions_id_not_null` | NOT NULL | `NOT NULL id` |
| `prescriptions_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `prescriptions_patient_profile_id_internal_id_not_null` | NOT NULL | `NOT NULL patient_profile_id_internal_id` |
| `prescriptions_patient_profile_id_not_null` | NOT NULL | `NOT NULL patient_profile_id` |
| `prescriptions_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `prescriptions_source_not_null` | NOT NULL | `NOT NULL source` |
| `prescriptions_status_not_null` | NOT NULL | `NOT NULL status` |
| `prescriptions_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `prescriptions_uploaded_by_user_id_not_null` | NOT NULL | `NOT NULL uploaded_by_user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_clinical_prescriptions_consultation` | btree | `(consultation_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_prescriptions_consultation ON clinical.prescriptions USING btree (consultation_id)` |
| `ix_clinical_prescriptions_patient` | btree | `(patient_profile_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_prescriptions_patient ON clinical.prescriptions USING btree (patient_profile_id)` |
| `ix_clinical_prescriptions_prescriber` | btree | `(prescriber_user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_prescriptions_prescriber ON clinical.prescriptions USING btree (prescriber_user_id)` |
| `ix_clinical_prescriptions_reviewed_by` | btree | `(reviewed_by_user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_prescriptions_reviewed_by ON clinical.prescriptions USING btree (reviewed_by_user_id)` |
| `ix_clinical_prescriptions_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_prescriptions_status ON clinical.prescriptions USING btree (status)` |
| `ix_clinical_prescriptions_uploaded_by` | btree | `(uploaded_by_user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_prescriptions_uploaded_by ON clinical.prescriptions USING btree (uploaded_by_user_id)` |
| `pk_clinical_prescriptions` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_clinical_prescriptions ON clinical.prescriptions USING btree (internal_id)` |
| `uq_clinical_prescriptions_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_prescriptions_id ON clinical.prescriptions USING btree (id)` |
| `uq_clinical_prescriptions_id_patient` | btree | `(id, patient_profile_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_prescriptions_id_patient ON clinical.prescriptions USING btree (id, patient_profile_id)` |
| `uq_numeric_clinical_prescriptions_internal_id_patient_p_2997` | btree | `(internal_id, patient_profile_id_internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_numeric_clinical_prescriptions_internal_id_patient_p_2997 ON clinical.prescriptions USING btree (internal_id, patient_profile_id_internal_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.prescriptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["consultation_id","consultation_id_internal_id","clinical","consultations"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.prescriptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.prescriptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["consultation_id","consultation_id_internal_id","clinical","consultations"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
