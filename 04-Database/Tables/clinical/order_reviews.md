# `clinical.order_reviews`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds order reviews records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 22 columns, 30 constraints, 9 indexes, 5 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `assigned_to_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_order_reviews_assigned_to_user_id_users) |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` (fk_clinical_order_reviews_order_id_orders); FK → `commerce.orders` (fk_clinical_order_reviews_order_patient) |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` (fk_clinical_order_reviews_order_id_orders_numeric); FK → `commerce.orders` (fk_clinical_order_reviews_order_patient_numeric); Numeric/public-key pair verification required |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` (fk_clinical_order_reviews_patient_profile_id_patient_profiles); FK → `clinical.prescriptions` (fk_clinical_order_reviews_rx_patient); FK → `commerce.orders` (fk_clinical_order_reviews_order_patient) |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` (fk_clinical_order_reviews_order_patient_numeric); FK → `clinical.patient_profiles` (fk_clinical_order_reviews_patient_profile_id_patient_pr_b642); FK → `clinical.prescriptions` (fk_clinical_order_reviews_rx_patient_numeric); Numeric/public-key pair verification required |
| `prescription_document_id` | `uuid` | No | — | Reference linking this record to prescription documents | Ensures related business data can be joined and validated | FK → `clinical.prescription_documents` (fk_clinical_order_reviews_document_rx); FK → `clinical.prescription_documents` (fk_clinical_order_reviews_prescription_document_id_pres_1fab) |
| `prescription_document_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescription_documents` (fk_clinical_order_reviews_document_rx_numeric); FK → `clinical.prescription_documents` (fk_clinical_order_reviews_prescription_document_id_pres_f5a7); Numeric/public-key pair verification required |
| `prescription_id` | `uuid` | No | — | Reference linking this record to prescription documents | Ensures related business data can be joined and validated | FK → `clinical.prescription_documents` (fk_clinical_order_reviews_document_rx); FK → `clinical.prescriptions` (fk_clinical_order_reviews_rx_patient); FK → `clinical.prescriptions` (fk_clinical_order_reviews_prescription_id_prescriptions) |
| `prescription_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescription_documents` (fk_clinical_order_reviews_document_rx_numeric); FK → `clinical.prescriptions` (fk_clinical_order_reviews_prescription_id_prescriptions_numeric); FK → `clinical.prescriptions` (fk_clinical_order_reviews_rx_patient_numeric); Numeric/public-key pair verification required |
| `reason_code` | `character varying(64)` | Yes | — | Reference linking this record to review reason codes | Ensures related business data can be joined and validated | FK → `clinical.review_reason_codes` (fk_clinical_order_reviews_controlled_reason) |
| `reason_code_id` | `bigint` | Yes | — | Reference linking this record to review reason codes | Ensures related business data can be joined and validated | FK → `clinical.review_reason_codes` (fk_clinical_order_reviews_controlled_reason) |
| `requested_at` | `timestamp with time zone` | No | `now()` | Time of requested | Support chronology, deadlines or audit evidence | See exact constraints |
| `review_notes` | `text` | Yes | — | Inferred: stores review notes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `review_version` | `integer` | No | — | Inferred: stores review version for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `reviewed_at` | `timestamp with time zone` | Yes | — | Time of reviewed | Support chronology, deadlines or audit evidence | See exact constraints |
| `reviewed_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_order_reviews_reviewed_by_user_id_users) |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(24)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the order reviews business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.order_reviews` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `assigned_to_user_id` → `identity.users(id)` via `fk_clinical_order_reviews_assigned_to_user_id_users`; `FOREIGN KEY (assigned_to_user_id) REFERENCES identity.users(id) ON DELETE SET NULL`
- `reviewed_by_user_id` → `identity.users(id)` via `fk_clinical_order_reviews_reviewed_by_user_id_users`; `FOREIGN KEY (reviewed_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `reason_code_id, reason_code` → `clinical.review_reason_codes(id, code)` via `fk_clinical_order_reviews_controlled_reason`; `FOREIGN KEY (reason_code_id, reason_code) REFERENCES clinical.review_reason_codes(id, code) ON DELETE RESTRICT`
- `order_id` → `commerce.orders(id)` via `fk_clinical_order_reviews_order_id_orders`; `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT`
- `prescription_document_id, prescription_id` → `clinical.prescription_documents(id, prescription_id)` via `fk_clinical_order_reviews_document_rx`; `FOREIGN KEY (prescription_document_id, prescription_id) REFERENCES clinical.prescription_documents(id, prescription_id) ON DELETE RESTRICT`
- `patient_profile_id` → `clinical.patient_profiles(id)` via `fk_clinical_order_reviews_patient_profile_id_patient_profiles`; `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT`
- `prescription_id, patient_profile_id` → `clinical.prescriptions(id, patient_profile_id)` via `fk_clinical_order_reviews_rx_patient`; `FOREIGN KEY (prescription_id, patient_profile_id) REFERENCES clinical.prescriptions(id, patient_profile_id) ON DELETE RESTRICT`
- `prescription_id` → `clinical.prescriptions(id)` via `fk_clinical_order_reviews_prescription_id_prescriptions`; `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE RESTRICT`
- `order_id, patient_profile_id` → `commerce.orders(id, patient_profile_id)` via `fk_clinical_order_reviews_order_patient`; `FOREIGN KEY (order_id, patient_profile_id) REFERENCES commerce.orders(id, patient_profile_id) ON DELETE RESTRICT`
- `prescription_document_id` → `clinical.prescription_documents(id)` via `fk_clinical_order_reviews_prescription_document_id_pres_1fab`; `FOREIGN KEY (prescription_document_id) REFERENCES clinical.prescription_documents(id) ON DELETE RESTRICT`
- `prescription_document_id_internal_id, prescription_id_internal_id` → `clinical.prescription_documents(internal_id, prescription_id_internal_id)` via `fk_clinical_order_reviews_document_rx_numeric`; `FOREIGN KEY (prescription_document_id_internal_id, prescription_id_internal_id) REFERENCES clinical.prescription_documents(internal_id, prescription_id_internal_id) ON DELETE RESTRICT`
- `order_id_internal_id` → `commerce.orders(internal_id)` via `fk_clinical_order_reviews_order_id_orders_numeric`; `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT`
- `order_id_internal_id, patient_profile_id_internal_id` → `commerce.orders(internal_id, patient_profile_id_internal_id)` via `fk_clinical_order_reviews_order_patient_numeric`; `FOREIGN KEY (order_id_internal_id, patient_profile_id_internal_id) REFERENCES commerce.orders(internal_id, patient_profile_id_internal_id) ON DELETE RESTRICT`
- `patient_profile_id_internal_id` → `clinical.patient_profiles(internal_id)` via `fk_clinical_order_reviews_patient_profile_id_patient_pr_b642`; `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT`
- `prescription_document_id_internal_id` → `clinical.prescription_documents(internal_id)` via `fk_clinical_order_reviews_prescription_document_id_pres_f5a7`; `FOREIGN KEY (prescription_document_id_internal_id) REFERENCES clinical.prescription_documents(internal_id) ON DELETE RESTRICT`
- `prescription_id_internal_id` → `clinical.prescriptions(internal_id)` via `fk_clinical_order_reviews_prescription_id_prescriptions_numeric`; `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE RESTRICT`
- `prescription_id_internal_id, patient_profile_id_internal_id` → `clinical.prescriptions(internal_id, patient_profile_id_internal_id)` via `fk_clinical_order_reviews_rx_patient_numeric`; `FOREIGN KEY (prescription_id_internal_id, patient_profile_id_internal_id) REFERENCES clinical.prescriptions(internal_id, patient_profile_id_internal_id) ON DELETE RESTRICT`

**Referenced by 2 FK constraints** (sample): `clinical.order_review_items`, `clinical.order_review_items`.

## `clinical.order_reviews` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 22 columns, 30 constraints, 9 indexes, 5 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `assigned_to_user_id` | `identity.users` | `fk_clinical_order_reviews_assigned_to_user_id_users` |
| `reviewed_by_user_id` | `identity.users` | `fk_clinical_order_reviews_reviewed_by_user_id_users` |
| `reason_code_id`, `reason_code` | `clinical.review_reason_codes` | `fk_clinical_order_reviews_controlled_reason` |
| `order_id` | `commerce.orders` | `fk_clinical_order_reviews_order_id_orders` |
| `prescription_document_id`, `prescription_id` | `clinical.prescription_documents` | `fk_clinical_order_reviews_document_rx` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_clinical_order_reviews_patient_profile_id_patient_profiles` |
| `prescription_id`, `patient_profile_id` | `clinical.prescriptions` | `fk_clinical_order_reviews_rx_patient` |
| `prescription_id` | `clinical.prescriptions` | `fk_clinical_order_reviews_prescription_id_prescriptions` |
| `order_id`, `patient_profile_id` | `commerce.orders` | `fk_clinical_order_reviews_order_patient` |
| `prescription_document_id` | `clinical.prescription_documents` | `fk_clinical_order_reviews_prescription_document_id_pres_1fab` |
| `prescription_document_id_internal_id`, `prescription_id_internal_id` | `clinical.prescription_documents` | `fk_clinical_order_reviews_document_rx_numeric` |
| `order_id_internal_id` | `commerce.orders` | `fk_clinical_order_reviews_order_id_orders_numeric` |
| `order_id_internal_id`, `patient_profile_id_internal_id` | `commerce.orders` | `fk_clinical_order_reviews_order_patient_numeric` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_clinical_order_reviews_patient_profile_id_patient_pr_b642` |
| `prescription_document_id_internal_id` | `clinical.prescription_documents` | `fk_clinical_order_reviews_prescription_document_id_pres_f5a7` |
| `prescription_id_internal_id` | `clinical.prescriptions` | `fk_clinical_order_reviews_prescription_id_prescriptions_numeric` |
| `prescription_id_internal_id`, `patient_profile_id_internal_id` | `clinical.prescriptions` | `fk_clinical_order_reviews_rx_patient_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_order_reviews_controlled_reason_pair` | CHECK | `CHECK (reason_code_id IS NULL OR reason_code IS NOT NULL)` |
| `ck_clinical_order_reviews_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_clinical_order_reviews_numeric_pair_patient_profile_id` | CHECK | `CHECK ((patient_profile_id IS NULL) = (patient_profile_id_internal_id IS NULL))` |
| `ck_clinical_order_reviews_numeric_pair_prescription_document_id` | CHECK | `CHECK ((prescription_document_id IS NULL) = (prescription_document_id_internal_id IS NULL))` |
| `ck_clinical_order_reviews_numeric_pair_prescription_id` | CHECK | `CHECK ((prescription_id IS NULL) = (prescription_id_internal_id IS NULL))` |
| `ck_clinical_order_reviews_orderreviewstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['pending'::text, 'in_review'::text, 'action_required'::text, 'approved'::text, 'partially_approved'::text, 'rejected'::text, 'superseded'::text, 'cancelled'::text]))` |
| `ck_clinical_order_reviews_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_clinical_order_reviews_version_positive` | CHECK | `CHECK (review_version > 0)` |
| `fk_clinical_order_reviews_assigned_to_user_id_users` | FOREIGN KEY | `FOREIGN KEY (assigned_to_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_clinical_order_reviews_controlled_reason` | FOREIGN KEY | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES clinical.review_reason_codes(id, code) ON DELETE RESTRICT` |
| `fk_clinical_order_reviews_document_rx` | FOREIGN KEY | `FOREIGN KEY (prescription_document_id, prescription_id) REFERENCES clinical.prescription_documents(id, prescription_id) ON DELETE RESTRICT` |
| `fk_clinical_order_reviews_document_rx_numeric` | FOREIGN KEY | `FOREIGN KEY (prescription_document_id_internal_id, prescription_id_internal_id) REFERENCES clinical.prescription_documents(internal_id, prescription_id_internal_id) ON DELETE RESTRICT` |
| `fk_clinical_order_reviews_order_id_orders` | FOREIGN KEY | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| `fk_clinical_order_reviews_order_id_orders_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| `fk_clinical_order_reviews_order_patient` | FOREIGN KEY | `FOREIGN KEY (order_id, patient_profile_id) REFERENCES commerce.orders(id, patient_profile_id) ON DELETE RESTRICT` |
| `fk_clinical_order_reviews_order_patient_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id, patient_profile_id_internal_id) REFERENCES commerce.orders(internal_id, patient_profile_id_internal_id) ON DELETE RESTRICT` |
| `fk_clinical_order_reviews_patient_profile_id_patient_pr_b642` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| `fk_clinical_order_reviews_patient_profile_id_patient_profiles` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| `fk_clinical_order_reviews_prescription_document_id_pres_1fab` | FOREIGN KEY | `FOREIGN KEY (prescription_document_id) REFERENCES clinical.prescription_documents(id) ON DELETE RESTRICT` |
| `fk_clinical_order_reviews_prescription_document_id_pres_f5a7` | FOREIGN KEY | `FOREIGN KEY (prescription_document_id_internal_id) REFERENCES clinical.prescription_documents(internal_id) ON DELETE RESTRICT` |
| `fk_clinical_order_reviews_prescription_id_prescriptions` | FOREIGN KEY | `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE RESTRICT` |
| `fk_clinical_order_reviews_prescription_id_prescriptions_numeric` | FOREIGN KEY | `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE RESTRICT` |
| `fk_clinical_order_reviews_reviewed_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (reviewed_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_order_reviews_rx_patient` | FOREIGN KEY | `FOREIGN KEY (prescription_id, patient_profile_id) REFERENCES clinical.prescriptions(id, patient_profile_id) ON DELETE RESTRICT` |
| `fk_clinical_order_reviews_rx_patient_numeric` | FOREIGN KEY | `FOREIGN KEY (prescription_id_internal_id, patient_profile_id_internal_id) REFERENCES clinical.prescriptions(internal_id, patient_profile_id_internal_id) ON DELETE RESTRICT` |
| `pk_clinical_order_reviews` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_clinical_order_reviews_id` | UNIQUE | `UNIQUE (id)` |
| `uq_clinical_order_reviews_identity` | UNIQUE | `UNIQUE (id, order_id, prescription_id)` |
| `uq_clinical_order_reviews_version` | UNIQUE | `UNIQUE (order_id, review_version)` |
| `uq_numeric_clinical_order_reviews_internal_id_order_id__d676` | UNIQUE | `UNIQUE (internal_id, order_id_internal_id, prescription_id_internal_id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_clinical_order_reviews_patient_time` | `CREATE INDEX ix_clinical_order_reviews_patient_time ON clinical.order_reviews USING btree (patient_profile_id, requested_at DESC)` |
| `ix_clinical_order_reviews_prescription` | `CREATE INDEX ix_clinical_order_reviews_prescription ON clinical.order_reviews USING btree (prescription_id)` |
| `ix_clinical_order_reviews_queue` | `CREATE INDEX ix_clinical_order_reviews_queue ON clinical.order_reviews USING btree (status, requested_at, id) WHERE status::text = ANY (ARRAY['pending'::text, 'in_review'::text, 'action_required'::text])` |
| `pk_clinical_order_reviews` | `CREATE UNIQUE INDEX pk_clinical_order_reviews ON clinical.order_reviews USING btree (internal_id)` |
| `uq_clinical_order_reviews_id` | `CREATE UNIQUE INDEX uq_clinical_order_reviews_id ON clinical.order_reviews USING btree (id)` |
| `uq_clinical_order_reviews_identity` | `CREATE UNIQUE INDEX uq_clinical_order_reviews_identity ON clinical.order_reviews USING btree (id, order_id, prescription_id)` |
| `uq_clinical_order_reviews_one_open` | `CREATE UNIQUE INDEX uq_clinical_order_reviews_one_open ON clinical.order_reviews USING btree (order_id) WHERE status::text = ANY (ARRAY['pending'::text, 'in_review'::text, 'action_required'::text])` |
| `uq_clinical_order_reviews_version` | `CREATE UNIQUE INDEX uq_clinical_order_reviews_version ON clinical.order_reviews USING btree (order_id, review_version)` |
| `uq_numeric_clinical_order_reviews_internal_id_order_id__d676` | `CREATE UNIQUE INDEX uq_numeric_clinical_order_reviews_internal_id_order_id__d676 ON clinical.order_reviews USING btree (internal_id, order_id_internal_id, prescription_id_internal_id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.order_reviews FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["prescription_document_id","prescription_document_id_internal_id","clinical","prescription_documents"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"]]', 'internal_id', 'id')` |
| `controlled_reason` | `CREATE TRIGGER controlled_reason BEFORE INSERT OR UPDATE ON clinical.order_reviews FOR EACH ROW EXECUTE FUNCTION platform.normalize_reason('clinical.review_reason_codes')` |
| `order_review_guard` | `CREATE TRIGGER order_review_guard BEFORE INSERT OR DELETE OR UPDATE ON clinical.order_reviews FOR EACH ROW EXECUTE FUNCTION clinical.guard_review()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.order_reviews FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.order_reviews FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["prescription_document_id","prescription_document_id_internal_id","clinical","prescription_documents"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
