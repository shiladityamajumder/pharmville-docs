# `clinical.order_reviews`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds order reviews records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | clinical.order_reviews |
| Classification | Transactional |
| Proposed business write owner | Pharmacist_Review |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 22 columns; 30 PK/FK/UQ/CHECK/exclusion constraints; 16 named PostgreSQL 18 NOT NULL constraints; 9 indexes; 5 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `assigned_to_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_order_reviews_assigned_to_user_id_users` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` via `fk_clinical_order_reviews_order_id_orders`; FK → `commerce.orders` via `fk_clinical_order_reviews_order_patient` |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` via `fk_clinical_order_reviews_order_id_orders_numeric`; FK → `commerce.orders` via `fk_clinical_order_reviews_order_patient_numeric` |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `commerce.orders` via `fk_clinical_order_reviews_order_patient`; FK → `clinical.patient_profiles` via `fk_clinical_order_reviews_patient_profile_id_patient_profiles`; FK → `clinical.prescriptions` via `fk_clinical_order_reviews_rx_patient` |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` via `fk_clinical_order_reviews_order_patient_numeric`; FK → `clinical.patient_profiles` via `fk_clinical_order_reviews_patient_profile_id_patient_pr_b642`; FK → `clinical.prescriptions` via `fk_clinical_order_reviews_rx_patient_numeric` |
| `prescription_document_id` | `uuid` | No | — | Reference linking this record to prescription documents | Ensures related business data can be joined and validated | FK → `clinical.prescription_documents` via `fk_clinical_order_reviews_document_rx`; FK → `clinical.prescription_documents` via `fk_clinical_order_reviews_prescription_document_id_pres_1fab` |
| `prescription_document_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescription_documents` via `fk_clinical_order_reviews_document_rx_numeric`; FK → `clinical.prescription_documents` via `fk_clinical_order_reviews_prescription_document_id_pres_f5a7` |
| `prescription_id` | `uuid` | No | — | Reference linking this record to prescription documents | Ensures related business data can be joined and validated | FK → `clinical.prescription_documents` via `fk_clinical_order_reviews_document_rx`; FK → `clinical.prescriptions` via `fk_clinical_order_reviews_prescription_id_prescriptions`; FK → `clinical.prescriptions` via `fk_clinical_order_reviews_rx_patient` |
| `prescription_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescription_documents` via `fk_clinical_order_reviews_document_rx_numeric`; FK → `clinical.prescriptions` via `fk_clinical_order_reviews_prescription_id_prescriptions_numeric`; FK → `clinical.prescriptions` via `fk_clinical_order_reviews_rx_patient_numeric` |
| `reason_code` | `character varying(64)` | Yes | — | Reference linking this record to review reason codes | Ensures related business data can be joined and validated | FK → `clinical.review_reason_codes` via `fk_clinical_order_reviews_controlled_reason`; Collation: default |
| `reason_code_id` | `bigint` | Yes | — | Reference linking this record to review reason codes | Ensures related business data can be joined and validated | FK → `clinical.review_reason_codes` via `fk_clinical_order_reviews_controlled_reason` |
| `requested_at` | `timestamp with time zone` | No | `now()` | Time of requested | Support chronology, deadlines or audit evidence | Exact constraints below |
| `review_notes` | `text` | Yes | — | Inferred: stores review notes for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `review_version` | `integer` | No | — | Inferred: stores review version for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `reviewed_at` | `timestamp with time zone` | Yes | — | Time of reviewed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `reviewed_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_order_reviews_reviewed_by_user_id_users` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(24)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |

## Record lifecycle and users

- **Created:** when the order reviews business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.order_reviews` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_clinical_order_reviews_assigned_to_user_id_users | `assigned_to_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (assigned_to_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_clinical_order_reviews_controlled_reason | `reason_code_id, reason_code` | [`clinical.review_reason_codes`](../../Tables/clinical/review_reason_codes.md) | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES clinical.review_reason_codes(id, code) ON DELETE RESTRICT` |
| fk_clinical_order_reviews_document_rx | `prescription_document_id, prescription_id` | [`clinical.prescription_documents`](../../Tables/clinical/prescription_documents.md) | `FOREIGN KEY (prescription_document_id, prescription_id) REFERENCES clinical.prescription_documents(id, prescription_id) ON DELETE RESTRICT` |
| fk_clinical_order_reviews_document_rx_numeric | `prescription_document_id_internal_id, prescription_id_internal_id` | [`clinical.prescription_documents`](../../Tables/clinical/prescription_documents.md) | `FOREIGN KEY (prescription_document_id_internal_id, prescription_id_internal_id) REFERENCES clinical.prescription_documents(internal_id, prescription_id_internal_id) ON DELETE RESTRICT` |
| fk_clinical_order_reviews_order_id_orders | `order_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| fk_clinical_order_reviews_order_id_orders_numeric | `order_id_internal_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| fk_clinical_order_reviews_order_patient | `order_id, patient_profile_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id, patient_profile_id) REFERENCES commerce.orders(id, patient_profile_id) ON DELETE RESTRICT` |
| fk_clinical_order_reviews_order_patient_numeric | `order_id_internal_id, patient_profile_id_internal_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id_internal_id, patient_profile_id_internal_id) REFERENCES commerce.orders(internal_id, patient_profile_id_internal_id) ON DELETE RESTRICT` |
| fk_clinical_order_reviews_patient_profile_id_patient_pr_b642 | `patient_profile_id_internal_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| fk_clinical_order_reviews_patient_profile_id_patient_profiles | `patient_profile_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| fk_clinical_order_reviews_prescription_document_id_pres_1fab | `prescription_document_id` | [`clinical.prescription_documents`](../../Tables/clinical/prescription_documents.md) | `FOREIGN KEY (prescription_document_id) REFERENCES clinical.prescription_documents(id) ON DELETE RESTRICT` |
| fk_clinical_order_reviews_prescription_document_id_pres_f5a7 | `prescription_document_id_internal_id` | [`clinical.prescription_documents`](../../Tables/clinical/prescription_documents.md) | `FOREIGN KEY (prescription_document_id_internal_id) REFERENCES clinical.prescription_documents(internal_id) ON DELETE RESTRICT` |
| fk_clinical_order_reviews_prescription_id_prescriptions | `prescription_id` | [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE RESTRICT` |
| fk_clinical_order_reviews_prescription_id_prescriptions_numeric | `prescription_id_internal_id` | [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE RESTRICT` |
| fk_clinical_order_reviews_reviewed_by_user_id_users | `reviewed_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (reviewed_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_order_reviews_rx_patient | `prescription_id, patient_profile_id` | [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | `FOREIGN KEY (prescription_id, patient_profile_id) REFERENCES clinical.prescriptions(id, patient_profile_id) ON DELETE RESTRICT` |
| fk_clinical_order_reviews_rx_patient_numeric | `prescription_id_internal_id, patient_profile_id_internal_id` | [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | `FOREIGN KEY (prescription_id_internal_id, patient_profile_id_internal_id) REFERENCES clinical.prescriptions(internal_id, patient_profile_id_internal_id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`clinical.order_review_items`](../../Tables/clinical/order_review_items.md) | fk_clinical_review_items_review_order_rx | `review_id, order_id, prescription_id` | `id, order_id, prescription_id` |
| [`clinical.order_review_items`](../../Tables/clinical/order_review_items.md) | fk_clinical_review_items_review_order_rx_numeric | `review_id_internal_id, order_id_internal_id, prescription_id_internal_id` | `internal_id, order_id_internal_id, prescription_id_internal_id` |

## `clinical.order_reviews` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `assigned_to_user_id` | `identity.users` | `fk_clinical_order_reviews_assigned_to_user_id_users` |
| `reason_code_id, reason_code` | `clinical.review_reason_codes` | `fk_clinical_order_reviews_controlled_reason` |
| `prescription_document_id, prescription_id` | `clinical.prescription_documents` | `fk_clinical_order_reviews_document_rx` |
| `prescription_document_id_internal_id, prescription_id_internal_id` | `clinical.prescription_documents` | `fk_clinical_order_reviews_document_rx_numeric` |
| `order_id` | `commerce.orders` | `fk_clinical_order_reviews_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_clinical_order_reviews_order_id_orders_numeric` |
| `order_id, patient_profile_id` | `commerce.orders` | `fk_clinical_order_reviews_order_patient` |
| `order_id_internal_id, patient_profile_id_internal_id` | `commerce.orders` | `fk_clinical_order_reviews_order_patient_numeric` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_clinical_order_reviews_patient_profile_id_patient_pr_b642` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_clinical_order_reviews_patient_profile_id_patient_profiles` |
| `prescription_document_id` | `clinical.prescription_documents` | `fk_clinical_order_reviews_prescription_document_id_pres_1fab` |
| `prescription_document_id_internal_id` | `clinical.prescription_documents` | `fk_clinical_order_reviews_prescription_document_id_pres_f5a7` |
| `prescription_id` | `clinical.prescriptions` | `fk_clinical_order_reviews_prescription_id_prescriptions` |
| `prescription_id_internal_id` | `clinical.prescriptions` | `fk_clinical_order_reviews_prescription_id_prescriptions_numeric` |
| `reviewed_by_user_id` | `identity.users` | `fk_clinical_order_reviews_reviewed_by_user_id_users` |
| `prescription_id, patient_profile_id` | `clinical.prescriptions` | `fk_clinical_order_reviews_rx_patient` |
| `prescription_id_internal_id, patient_profile_id_internal_id` | `clinical.prescriptions` | `fk_clinical_order_reviews_rx_patient_numeric` |

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
| `order_reviews_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `order_reviews_id_not_null` | NOT NULL | `NOT NULL id` |
| `order_reviews_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `order_reviews_order_id_internal_id_not_null` | NOT NULL | `NOT NULL order_id_internal_id` |
| `order_reviews_order_id_not_null` | NOT NULL | `NOT NULL order_id` |
| `order_reviews_patient_profile_id_internal_id_not_null` | NOT NULL | `NOT NULL patient_profile_id_internal_id` |
| `order_reviews_patient_profile_id_not_null` | NOT NULL | `NOT NULL patient_profile_id` |
| `order_reviews_prescription_document_id_internal_id_not_null` | NOT NULL | `NOT NULL prescription_document_id_internal_id` |
| `order_reviews_prescription_document_id_not_null` | NOT NULL | `NOT NULL prescription_document_id` |
| `order_reviews_prescription_id_internal_id_not_null` | NOT NULL | `NOT NULL prescription_id_internal_id` |
| `order_reviews_prescription_id_not_null` | NOT NULL | `NOT NULL prescription_id` |
| `order_reviews_requested_at_not_null` | NOT NULL | `NOT NULL requested_at` |
| `order_reviews_review_version_not_null` | NOT NULL | `NOT NULL review_version` |
| `order_reviews_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `order_reviews_status_not_null` | NOT NULL | `NOT NULL status` |
| `order_reviews_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_clinical_order_reviews_patient_time` | btree | `(patient_profile_id, requested_at DESC)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_order_reviews_patient_time ON clinical.order_reviews USING btree (patient_profile_id, requested_at DESC)` |
| `ix_clinical_order_reviews_prescription` | btree | `(prescription_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_order_reviews_prescription ON clinical.order_reviews USING btree (prescription_id)` |
| `ix_clinical_order_reviews_queue` | btree | `(status, requested_at, id)` | status::text = ANY (ARRAY['pending'::text, 'in_review'::text, 'action_required'::text]) | Read/join/filter access path; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_order_reviews_queue ON clinical.order_reviews USING btree (status, requested_at, id) WHERE status::text = ANY (ARRAY['pending'::text, 'in_review'::text, 'action_required'::text])` |
| `pk_clinical_order_reviews` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_clinical_order_reviews ON clinical.order_reviews USING btree (internal_id)` |
| `uq_clinical_order_reviews_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_order_reviews_id ON clinical.order_reviews USING btree (id)` |
| `uq_clinical_order_reviews_identity` | btree | `(id, order_id, prescription_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_order_reviews_identity ON clinical.order_reviews USING btree (id, order_id, prescription_id)` |
| `uq_clinical_order_reviews_one_open` | btree | `(order_id)` | status::text = ANY (ARRAY['pending'::text, 'in_review'::text, 'action_required'::text]) | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_order_reviews_one_open ON clinical.order_reviews USING btree (order_id) WHERE status::text = ANY (ARRAY['pending'::text, 'in_review'::text, 'action_required'::text])` |
| `uq_clinical_order_reviews_version` | btree | `(order_id, review_version)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_order_reviews_version ON clinical.order_reviews USING btree (order_id, review_version)` |
| `uq_numeric_clinical_order_reviews_internal_id_order_id__d676` | btree | `(internal_id, order_id_internal_id, prescription_id_internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_numeric_clinical_order_reviews_internal_id_order_id__d676 ON clinical.order_reviews USING btree (internal_id, order_id_internal_id, prescription_id_internal_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.order_reviews FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["prescription_document_id","prescription_document_id_internal_id","clinical","prescription_documents"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"]]', 'internal_id', 'id')` | O |
| `controlled_reason` | `CREATE TRIGGER controlled_reason BEFORE INSERT OR UPDATE ON clinical.order_reviews FOR EACH ROW EXECUTE FUNCTION platform.normalize_reason('clinical.review_reason_codes')` | O |
| `order_review_guard` | `CREATE TRIGGER order_review_guard BEFORE INSERT OR DELETE OR UPDATE ON clinical.order_reviews FOR EACH ROW EXECUTE FUNCTION clinical.guard_review()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.order_reviews FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.order_reviews FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["prescription_document_id","prescription_document_id_internal_id","clinical","prescription_documents"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
