# `clinical.patient_profiles`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds patient profiles records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | clinical.patient_profiles |
| Classification | Master / Reference |
| Proposed business write owner | Prescription_Upload |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 18 columns; 11 PK/FK/UQ/CHECK/exclusion constraints; 7 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `abha_address_encrypted` | `bytea` | Yes | — | Inferred: stores abha address encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `abha_number_hash` | `character varying(128)` | Yes | — | Inferred: stores abha number hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `blood_group` | `character varying(8)` | Yes | — | Inferred: stores blood group for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_patient_profiles_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_patient_profiles_deleted_by_users` |
| `emergency_contact` | `jsonb` | No | `'{}'::jsonb` | Structured emergency contact information | Retain a versioned payload or relevant details | Exact constraints below |
| `family_member_id` | `uuid` | Yes | — | Reference linking this record to family members | Ensures related business data can be joined and validated | FK → `customer.family_members` via `fk_clinical_patient_profiles_family_member_id_family_members` |
| `family_member_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `customer.family_members` via `fk_clinical_patient_profiles_family_member_id_family_me_da24` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `medical_record_number` | `character varying(64)` | Yes | — | Inferred: stores medical record number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_patient_profiles_updated_by_users` |
| `user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_patient_profiles_user_id_users` |

## Record lifecycle and users

- **Created:** when the patient profiles business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.patient_profiles` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_clinical_patient_profiles_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_patient_profiles_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_patient_profiles_family_member_id_family_me_da24 | `family_member_id_internal_id` | [`customer.family_members`](../../Tables/customer/family_members.md) | `FOREIGN KEY (family_member_id_internal_id) REFERENCES customer.family_members(internal_id) ON DELETE CASCADE` |
| fk_clinical_patient_profiles_family_member_id_family_members | `family_member_id` | [`customer.family_members`](../../Tables/customer/family_members.md) | `FOREIGN KEY (family_member_id) REFERENCES customer.family_members(id) ON DELETE CASCADE` |
| fk_clinical_patient_profiles_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_patient_profiles_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`appointment.appointments`](../../Tables/appointment/appointments.md) | fk_appointment_appointments_patient_profile_id_patient__c088 | `patient_profile_id_internal_id` | `internal_id` |
| [`appointment.appointments`](../../Tables/appointment/appointments.md) | fk_appointment_appointments_patient_profile_id_patient_profiles | `patient_profile_id` | `id` |
| [`clinical.care_episodes`](../../Tables/clinical/care_episodes.md) | fk_clinical_care_episodes_patient_profile_id_patient_pr_7679 | `patient_profile_id_internal_id` | `internal_id` |
| [`clinical.care_episodes`](../../Tables/clinical/care_episodes.md) | fk_clinical_care_episodes_patient_profile_id_patient_profiles | `patient_profile_id` | `id` |
| [`clinical.consultations`](../../Tables/clinical/consultations.md) | fk_clinical_consultations_patient_profile_id_patient_pr_496c | `patient_profile_id_internal_id` | `internal_id` |
| [`clinical.consultations`](../../Tables/clinical/consultations.md) | fk_clinical_consultations_patient_profile_id_patient_profiles | `patient_profile_id` | `id` |
| [`clinical.observations`](../../Tables/clinical/observations.md) | fk_clinical_observations_patient_profile_id_patient_pro_995e | `patient_profile_id_internal_id` | `internal_id` |
| [`clinical.observations`](../../Tables/clinical/observations.md) | fk_clinical_observations_patient_profile_id_patient_profiles | `patient_profile_id` | `id` |
| [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | fk_clinical_order_reviews_patient_profile_id_patient_pr_b642 | `patient_profile_id_internal_id` | `internal_id` |
| [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | fk_clinical_order_reviews_patient_profile_id_patient_profiles | `patient_profile_id` | `id` |
| [`clinical.patient_allergies`](../../Tables/clinical/patient_allergies.md) | fk_clinical_patient_allergies_patient_profile_id_patien_7dc7 | `patient_profile_id` | `id` |
| [`clinical.patient_allergies`](../../Tables/clinical/patient_allergies.md) | fk_clinical_patient_allergies_patient_profile_id_patien_acc9 | `patient_profile_id_internal_id` | `internal_id` |
| [`clinical.patient_conditions`](../../Tables/clinical/patient_conditions.md) | fk_clinical_patient_conditions_patient_profile_id_patie_982f | `patient_profile_id` | `id` |
| [`clinical.patient_conditions`](../../Tables/clinical/patient_conditions.md) | fk_clinical_patient_conditions_patient_profile_id_patie_c663 | `patient_profile_id_internal_id` | `internal_id` |
| [`clinical.patient_medications`](../../Tables/clinical/patient_medications.md) | fk_clinical_patient_medications_patient_profile_id_pati_2854 | `patient_profile_id` | `id` |
| [`clinical.patient_medications`](../../Tables/clinical/patient_medications.md) | fk_clinical_patient_medications_patient_profile_id_pati_3f4f | `patient_profile_id_internal_id` | `internal_id` |
| [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | fk_clinical_prescriptions_patient_profile_id_patient_pr_5a89 | `patient_profile_id_internal_id` | `internal_id` |
| [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | fk_clinical_prescriptions_patient_profile_id_patient_profiles | `patient_profile_id` | `id` |
| [`commerce.orders`](../../Tables/commerce/orders.md) | fk_commerce_orders_patient_profile_id_patient_profiles | `patient_profile_id` | `id` |
| [`commerce.orders`](../../Tables/commerce/orders.md) | fk_commerce_orders_patient_profile_id_patient_profiles_numeric | `patient_profile_id_internal_id` | `internal_id` |
| [`compliance.adverse_event_reports`](../../Tables/compliance/adverse_event_reports.md) | fk_compliance_adverse_event_reports_patient_profile_id__4b0b | `patient_profile_id` | `id` |
| [`compliance.adverse_event_reports`](../../Tables/compliance/adverse_event_reports.md) | fk_compliance_adverse_event_reports_patient_profile_id__6d1c | `patient_profile_id_internal_id` | `internal_id` |
| [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | fk_diagnostics_diagnostic_orders_patient_profile_id_pat_0689 | `patient_profile_id_internal_id` | `internal_id` |
| [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | fk_diagnostics_diagnostic_orders_patient_profile_id_pat_4a11 | `patient_profile_id` | `id` |
| [`insurance.claims`](../../Tables/insurance/claims.md) | fk_insurance_claims_patient_profile_id_patient_profiles | `patient_profile_id` | `id` |
| [`insurance.claims`](../../Tables/insurance/claims.md) | fk_insurance_claims_patient_profile_id_patient_profiles_numeric | `patient_profile_id_internal_id` | `internal_id` |
| [`insurance.policies`](../../Tables/insurance/policies.md) | fk_insurance_policies_patient_profile_id_patient_profil_0c08 | `patient_profile_id_internal_id` | `internal_id` |
| [`insurance.policies`](../../Tables/insurance/policies.md) | fk_insurance_policies_patient_profile_id_patient_profiles | `patient_profile_id` | `id` |
| [`insurance.policy_members`](../../Tables/insurance/policy_members.md) | fk_insurance_policy_members_patient_profile_id_patient__bcd9 | `patient_profile_id_internal_id` | `internal_id` |
| [`insurance.policy_members`](../../Tables/insurance/policy_members.md) | fk_insurance_policy_members_patient_profile_id_patient_profiles | `patient_profile_id` | `id` |

## `clinical.patient_profiles` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_clinical_patient_profiles_created_by_users` |
| `deleted_by` | `identity.users` | `fk_clinical_patient_profiles_deleted_by_users` |
| `family_member_id_internal_id` | `customer.family_members` | `fk_clinical_patient_profiles_family_member_id_family_me_da24` |
| `family_member_id` | `customer.family_members` | `fk_clinical_patient_profiles_family_member_id_family_members` |
| `updated_by` | `identity.users` | `fk_clinical_patient_profiles_updated_by_users` |
| `user_id` | `identity.users` | `fk_clinical_patient_profiles_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_patient_profiles_exactly_one_patient_owner` | CHECK | `CHECK (num_nonnulls(user_id, family_member_id) = 1)` |
| `ck_clinical_patient_profiles_numeric_pair_family_member_id` | CHECK | `CHECK ((family_member_id IS NULL) = (family_member_id_internal_id IS NULL))` |
| `ck_clinical_patient_profiles_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_clinical_patient_profiles_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_patient_profiles_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_patient_profiles_family_member_id_family_me_da24` | FOREIGN KEY | `FOREIGN KEY (family_member_id_internal_id) REFERENCES customer.family_members(internal_id) ON DELETE CASCADE` |
| `fk_clinical_patient_profiles_family_member_id_family_members` | FOREIGN KEY | `FOREIGN KEY (family_member_id) REFERENCES customer.family_members(id) ON DELETE CASCADE` |
| `fk_clinical_patient_profiles_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_patient_profiles_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_clinical_patient_profiles` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_clinical_patient_profiles_id` | UNIQUE | `UNIQUE (id)` |
| `patient_profiles_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `patient_profiles_emergency_contact_not_null` | NOT NULL | `NOT NULL emergency_contact` |
| `patient_profiles_id_not_null` | NOT NULL | `NOT NULL id` |
| `patient_profiles_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `patient_profiles_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `patient_profiles_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `patient_profiles_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_clinical_patient_profiles_family_member_id` | btree | `(family_member_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_patient_profiles_family_member_id ON clinical.patient_profiles USING btree (family_member_id)` |
| `ix_clinical_patient_profiles_user_id` | btree | `(user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_patient_profiles_user_id ON clinical.patient_profiles USING btree (user_id)` |
| `pk_clinical_patient_profiles` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_clinical_patient_profiles ON clinical.patient_profiles USING btree (internal_id)` |
| `uq_clinical_patient_family_active` | btree | `(family_member_id)` | family_member_id IS NOT NULL AND is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_patient_family_active ON clinical.patient_profiles USING btree (family_member_id) WHERE family_member_id IS NOT NULL AND is_deleted = false` |
| `uq_clinical_patient_profiles_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_patient_profiles_id ON clinical.patient_profiles USING btree (id)` |
| `uq_clinical_patient_user_active` | btree | `(user_id)` | user_id IS NOT NULL AND is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_patient_user_active ON clinical.patient_profiles USING btree (user_id) WHERE user_id IS NOT NULL AND is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.patient_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["family_member_id","family_member_id_internal_id","customer","family_members"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.patient_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.patient_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["family_member_id","family_member_id_internal_id","customer","family_members"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `clinical.patient_profiles` |
| Category | Master / Reference — Stable protected patient identity, not clinical event history |
| Proposed owner / maintenance role | Prescription_Upload / Intake and Privacy owner |
| Scope | User/patient-specific protected party master. |
| Referencing tables | `appointment.appointments`, `clinical.care_episodes`, `clinical.consultations`, `clinical.observations`, `clinical.order_reviews`, `clinical.patient_allergies`, `clinical.patient_conditions`, `clinical.patient_medications`, `clinical.prescriptions`, `commerce.orders`, `compliance.adverse_event_reports`, `diagnostics.diagnostic_orders`, `insurance.claims`, `insurance.policies`, `insurance.policy_members` |
| Features | `ACC-04`, `ADM-01`, `CHK-02`, `CHK-03`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08`, `FIN-01`, `FIN-02`, `FIN-03`, `INV-01`, `INV-03`, `NOT-01`, `NOT-02`, `OMS-01`, `OMS-02`, `OMS-03`, `OMS-04`, `OMS-05`, `ORD-02`, `ORD-03`, `ORD-04`, `ORD-05`, `ORD-06`, `ORD-07`, `PHM-01`, `PHM-02`, `PHM-03`, `PHM-05`, `REP-01`, `REP-02`, `RID-02`, `RID-04`, `RX-04`, `RX-05`, `STO-02`, `WH-04` |
| API consumers | [API-007](../../../03-Modules/Customer_Accounts/APIs.md), [API-008](../../../03-Modules/Customer_Accounts/APIs.md), [API-020](../../../03-Modules/Cart_Checkout/APIs.md), [API-021](../../../03-Modules/Cart_Checkout/APIs.md), [API-024](../../../03-Modules/Prescription_Upload/APIs.md), [API-025](../../../03-Modules/Customer_Orders/APIs.md), [API-026](../../../03-Modules/Customer_Orders/APIs.md), [API-027](../../../03-Modules/Customer_Orders/APIs.md), [API-028](../../../03-Modules/Customer_Orders/APIs.md), [API-029](../../../03-Modules/Customer_Orders/APIs.md), [API-030](../../../03-Modules/Customer_Orders/APIs.md), [API-031](../../../03-Modules/Customer_Orders/APIs.md), [API-032](../../../03-Modules/Admin_CMS/APIs.md), [API-039](../../../03-Modules/Order_Operations/APIs.md), [API-040](../../../03-Modules/Order_Operations/APIs.md), [API-041](../../../03-Modules/Order_Operations/APIs.md), [API-042](../../../03-Modules/Order_Operations/APIs.md), [API-043](../../../03-Modules/Order_Operations/APIs.md), [API-045](../../../03-Modules/Store_Operations/APIs.md), [API-046](../../../03-Modules/Store_Operations/APIs.md), [API-047](../../../03-Modules/Store_Operations/APIs.md), [API-052](../../../03-Modules/Inventory/APIs.md), [API-059](../../../03-Modules/Warehouse/APIs.md), [API-060](../../../03-Modules/Pharmacist_Review/APIs.md), [API-061](../../../03-Modules/Pharmacist_Review/APIs.md), [API-062](../../../03-Modules/Pharmacist_Review/APIs.md), [API-063](../../../03-Modules/Pharmacist_Review/APIs.md), [API-071](../../../03-Modules/Rider_App/APIs.md), [API-073](../../../03-Modules/Rider_App/APIs.md), [API-075](../../../03-Modules/Finance_Payments/APIs.md), [API-076](../../../03-Modules/Finance_Payments/APIs.md), [API-077](../../../03-Modules/Finance_Payments/APIs.md), [API-078](../../../03-Modules/Finance_Payments/APIs.md), [API-081](../../../03-Modules/Finance_Payments/APIs.md), [API-082](../../../03-Modules/Reporting/APIs.md), [API-083](../../../03-Modules/Reporting/APIs.md), [API-094](../../../03-Modules/Notifications/APIs.md), [API-095](../../../03-Modules/Notifications/APIs.md), [ACC-ROUTE-003](../../../03-Modules/Customer_Accounts/APIs.md), [ACC-ROUTE-004](../../../03-Modules/Customer_Accounts/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: .

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Intake and Privacy owner through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | No is_active/status column. Soft-delete through is_deleted only after privacy/reference review; retain historical FK targets. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_clinical_patient_family_active ON clinical.patient_profiles USING btree (family_member_id) WHERE family_member_id IS NOT NULL AND is_deleted = false; CREATE UNIQUE INDEX uq_clinical_patient_profiles_id ON clinical.patient_profiles USING btree (id); CREATE UNIQUE INDEX uq_clinical_patient_user_active ON clinical.patient_profiles USING btree (user_id) WHERE user_id IS NOT NULL AND is_deleted = false |
| Foreign-key dependencies | `customer.family_members` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-006/D-019 clinical/catalog source validation. |
