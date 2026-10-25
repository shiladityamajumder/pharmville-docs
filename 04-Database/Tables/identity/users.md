# `identity.users`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds users records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | identity.users |
| Classification | Master / Reference |
| Proposed business write owner | Authentication_Access |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | id |
| Structural counts | 22 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 8 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 1 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `account_closed_at` | `timestamp with time zone` | Yes | — | Time of account closed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_users_created_by_users` |
| `email` | `character varying(320)` | Yes | — | Inferred: stores email for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `email_normalized` | `character varying(320)` | Yes | — | Inferred: stores email normalized for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `email_verified_at` | `timestamp with time zone` | Yes | — | Time of email verified | Support chronology, deadlines or audit evidence | Exact constraints below |
| `failed_login_count` | `integer` | No | `0` | Inferred: stores failed login count for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Primary key |
| `last_login_at` | `timestamp with time zone` | Yes | — | Time of last login | Support chronology, deadlines or audit evidence | Exact constraints below |
| `locked_until` | `timestamp with time zone` | Yes | — | Inferred: stores locked until for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `password_hash` | `character varying(255)` | Yes | — | Inferred: stores password hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `phone_country_code` | `character varying(8)` | Yes | — | Code for phone country | Link to controlled business classification or an external reference | Collation: default |
| `phone_number` | `character varying(32)` | Yes | — | Inferred: stores phone number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `phone_verified_at` | `timestamp with time zone` | Yes | — | Time of phone verified | Support chronology, deadlines or audit evidence | Exact constraints below |
| `preferred_locale` | `character varying(16)` | No | `'en-IN'::character varying` | Inferred: stores preferred locale for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `privacy_version` | `character varying(32)` | Yes | — | Inferred: stores privacy version for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(16)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `terms_version` | `character varying(32)` | Yes | — | Inferred: stores terms version for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `timezone` | `character varying(64)` | No | `'Asia/Kolkata'::character varying` | Inferred: stores timezone for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_users_updated_by_users` |

## Record lifecycle and users

- **Created:** when the users business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.users` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_identity_users_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_identity_users_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`appointment.appointment_slots`](../../Tables/appointment/appointment_slots.md) | fk_appointment_appointment_slots_created_by_users | `created_by` | `id` |
| [`appointment.appointment_slots`](../../Tables/appointment/appointment_slots.md) | fk_appointment_appointment_slots_updated_by_users | `updated_by` | `id` |
| [`appointment.appointment_status_history`](../../Tables/appointment/appointment_status_history.md) | fk_appointment_appointment_status_history_actor_user_id_users | `actor_user_id` | `id` |
| [`appointment.appointments`](../../Tables/appointment/appointments.md) | fk_appointment_appointments_booked_by_user_id_users | `booked_by_user_id` | `id` |
| [`appointment.appointments`](../../Tables/appointment/appointments.md) | fk_appointment_appointments_created_by_users | `created_by` | `id` |
| [`appointment.appointments`](../../Tables/appointment/appointments.md) | fk_appointment_appointments_updated_by_users | `updated_by` | `id` |
| [`appointment.availability_exceptions`](../../Tables/appointment/availability_exceptions.md) | fk_appointment_availability_exceptions_created_by_users | `created_by` | `id` |
| [`appointment.availability_exceptions`](../../Tables/appointment/availability_exceptions.md) | fk_appointment_availability_exceptions_updated_by_users | `updated_by` | `id` |
| [`appointment.availability_rules`](../../Tables/appointment/availability_rules.md) | fk_appointment_availability_rules_created_by_users | `created_by` | `id` |
| [`appointment.availability_rules`](../../Tables/appointment/availability_rules.md) | fk_appointment_availability_rules_deleted_by_users | `deleted_by` | `id` |
| [`appointment.availability_rules`](../../Tables/appointment/availability_rules.md) | fk_appointment_availability_rules_updated_by_users | `updated_by` | `id` |
| [`appointment.practitioner_services`](../../Tables/appointment/practitioner_services.md) | fk_appointment_practitioner_services_created_by_users | `created_by` | `id` |
| [`appointment.practitioner_services`](../../Tables/appointment/practitioner_services.md) | fk_appointment_practitioner_services_deleted_by_users | `deleted_by` | `id` |
| [`appointment.practitioner_services`](../../Tables/appointment/practitioner_services.md) | fk_appointment_practitioner_services_updated_by_users | `updated_by` | `id` |
| [`appointment.service_types`](../../Tables/appointment/service_types.md) | fk_appointment_service_types_created_by_users | `created_by` | `id` |
| [`appointment.service_types`](../../Tables/appointment/service_types.md) | fk_appointment_service_types_deleted_by_users | `deleted_by` | `id` |
| [`appointment.service_types`](../../Tables/appointment/service_types.md) | fk_appointment_service_types_updated_by_users | `updated_by` | `id` |
| [`appointment.teleconsultation_sessions`](../../Tables/appointment/teleconsultation_sessions.md) | fk_appointment_teleconsultation_sessions_created_by_users | `created_by` | `id` |
| [`appointment.teleconsultation_sessions`](../../Tables/appointment/teleconsultation_sessions.md) | fk_appointment_teleconsultation_sessions_updated_by_users | `updated_by` | `id` |
| [`catalog.brands`](../../Tables/catalog/brands.md) | fk_catalog_brands_created_by_users | `created_by` | `id` |
| [`catalog.brands`](../../Tables/catalog/brands.md) | fk_catalog_brands_deleted_by_users | `deleted_by` | `id` |
| [`catalog.brands`](../../Tables/catalog/brands.md) | fk_catalog_brands_updated_by_users | `updated_by` | `id` |
| [`catalog.categories`](../../Tables/catalog/categories.md) | fk_catalog_categories_created_by_users | `created_by` | `id` |
| [`catalog.categories`](../../Tables/catalog/categories.md) | fk_catalog_categories_deleted_by_users | `deleted_by` | `id` |
| [`catalog.categories`](../../Tables/catalog/categories.md) | fk_catalog_categories_updated_by_users | `updated_by` | `id` |
| [`catalog.commerce_classes`](../../Tables/catalog/commerce_classes.md) | fk_catalog_commerce_classes_created_by_user_id_users | `created_by_user_id` | `id` |
| [`catalog.commerce_classes`](../../Tables/catalog/commerce_classes.md) | fk_catalog_commerce_classes_updated_by_user_id_users | `updated_by_user_id` | `id` |
| [`catalog.dosage_forms`](../../Tables/catalog/dosage_forms.md) | fk_catalog_dosage_forms_created_by_users | `created_by` | `id` |
| [`catalog.dosage_forms`](../../Tables/catalog/dosage_forms.md) | fk_catalog_dosage_forms_deleted_by_users | `deleted_by` | `id` |
| [`catalog.dosage_forms`](../../Tables/catalog/dosage_forms.md) | fk_catalog_dosage_forms_updated_by_users | `updated_by` | `id` |
| [`catalog.manufacturers`](../../Tables/catalog/manufacturers.md) | fk_catalog_manufacturers_created_by_users | `created_by` | `id` |
| [`catalog.manufacturers`](../../Tables/catalog/manufacturers.md) | fk_catalog_manufacturers_deleted_by_users | `deleted_by` | `id` |
| [`catalog.manufacturers`](../../Tables/catalog/manufacturers.md) | fk_catalog_manufacturers_updated_by_users | `updated_by` | `id` |
| [`catalog.product_attributes`](../../Tables/catalog/product_attributes.md) | fk_catalog_product_attributes_created_by_users | `created_by` | `id` |
| [`catalog.product_attributes`](../../Tables/catalog/product_attributes.md) | fk_catalog_product_attributes_updated_by_users | `updated_by` | `id` |
| [`catalog.product_classification_history`](../../Tables/catalog/product_classification_history.md) | fk_catalog_product_classification_history_approved_by_u_625c | `approved_by_user_id` | `id` |
| [`catalog.product_content`](../../Tables/catalog/product_content.md) | fk_catalog_product_content_created_by_users | `created_by` | `id` |
| [`catalog.product_content`](../../Tables/catalog/product_content.md) | fk_catalog_product_content_deleted_by_users | `deleted_by` | `id` |
| [`catalog.product_content`](../../Tables/catalog/product_content.md) | fk_catalog_product_content_updated_by_users | `updated_by` | `id` |
| [`catalog.product_identifiers`](../../Tables/catalog/product_identifiers.md) | fk_catalog_product_identifiers_created_by_users | `created_by` | `id` |
| [`catalog.product_identifiers`](../../Tables/catalog/product_identifiers.md) | fk_catalog_product_identifiers_updated_by_users | `updated_by` | `id` |
| [`catalog.product_media`](../../Tables/catalog/product_media.md) | fk_catalog_product_media_created_by_users | `created_by` | `id` |
| [`catalog.product_media`](../../Tables/catalog/product_media.md) | fk_catalog_product_media_deleted_by_users | `deleted_by` | `id` |
| [`catalog.product_media`](../../Tables/catalog/product_media.md) | fk_catalog_product_media_updated_by_users | `updated_by` | `id` |
| [`catalog.product_regulatory`](../../Tables/catalog/product_regulatory.md) | fk_catalog_product_regulatory_created_by_users | `created_by` | `id` |
| [`catalog.product_regulatory`](../../Tables/catalog/product_regulatory.md) | fk_catalog_product_regulatory_deleted_by_users | `deleted_by` | `id` |
| [`catalog.product_regulatory`](../../Tables/catalog/product_regulatory.md) | fk_catalog_product_regulatory_updated_by_users | `updated_by` | `id` |
| [`catalog.product_relationships`](../../Tables/catalog/product_relationships.md) | fk_catalog_product_relationships_created_by_users | `created_by` | `id` |
| [`catalog.product_relationships`](../../Tables/catalog/product_relationships.md) | fk_catalog_product_relationships_updated_by_users | `updated_by` | `id` |
| [`catalog.product_salts`](../../Tables/catalog/product_salts.md) | fk_catalog_product_salts_created_by_users | `created_by` | `id` |
| [`catalog.product_salts`](../../Tables/catalog/product_salts.md) | fk_catalog_product_salts_updated_by_users | `updated_by` | `id` |
| [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | fk_catalog_product_variants_created_by_users | `created_by` | `id` |
| [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | fk_catalog_product_variants_deleted_by_users | `deleted_by` | `id` |
| [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | fk_catalog_product_variants_updated_by_users | `updated_by` | `id` |
| [`catalog.products`](../../Tables/catalog/products.md) | fk_catalog_products_commerce_class_approved_by_user_id_users | `commerce_class_approved_by_user_id` | `id` |
| [`catalog.products`](../../Tables/catalog/products.md) | fk_catalog_products_created_by_users | `created_by` | `id` |
| [`catalog.products`](../../Tables/catalog/products.md) | fk_catalog_products_deleted_by_users | `deleted_by` | `id` |
| [`catalog.products`](../../Tables/catalog/products.md) | fk_catalog_products_updated_by_users | `updated_by` | `id` |
| [`catalog.salts`](../../Tables/catalog/salts.md) | fk_catalog_salts_created_by_users | `created_by` | `id` |
| [`catalog.salts`](../../Tables/catalog/salts.md) | fk_catalog_salts_deleted_by_users | `deleted_by` | `id` |
| [`catalog.salts`](../../Tables/catalog/salts.md) | fk_catalog_salts_updated_by_users | `updated_by` | `id` |
| [`catalog.substitution_group_products`](../../Tables/catalog/substitution_group_products.md) | fk_catalog_substitution_group_products_created_by_users | `created_by` | `id` |
| [`catalog.substitution_group_products`](../../Tables/catalog/substitution_group_products.md) | fk_catalog_substitution_group_products_updated_by_users | `updated_by` | `id` |
| [`catalog.substitution_groups`](../../Tables/catalog/substitution_groups.md) | fk_catalog_substitution_groups_created_by_users | `created_by` | `id` |
| [`catalog.substitution_groups`](../../Tables/catalog/substitution_groups.md) | fk_catalog_substitution_groups_deleted_by_users | `deleted_by` | `id` |
| [`catalog.substitution_groups`](../../Tables/catalog/substitution_groups.md) | fk_catalog_substitution_groups_updated_by_users | `updated_by` | `id` |
| [`catalog.units_of_measure`](../../Tables/catalog/units_of_measure.md) | fk_catalog_units_of_measure_created_by_users | `created_by` | `id` |
| [`catalog.units_of_measure`](../../Tables/catalog/units_of_measure.md) | fk_catalog_units_of_measure_deleted_by_users | `deleted_by` | `id` |
| [`catalog.units_of_measure`](../../Tables/catalog/units_of_measure.md) | fk_catalog_units_of_measure_updated_by_users | `updated_by` | `id` |
| [`clinical.care_episodes`](../../Tables/clinical/care_episodes.md) | fk_clinical_care_episodes_created_by_users | `created_by` | `id` |
| [`clinical.care_episodes`](../../Tables/clinical/care_episodes.md) | fk_clinical_care_episodes_deleted_by_users | `deleted_by` | `id` |
| [`clinical.care_episodes`](../../Tables/clinical/care_episodes.md) | fk_clinical_care_episodes_updated_by_users | `updated_by` | `id` |
| [`clinical.consultations`](../../Tables/clinical/consultations.md) | fk_clinical_consultations_created_by_users | `created_by` | `id` |
| [`clinical.consultations`](../../Tables/clinical/consultations.md) | fk_clinical_consultations_doctor_user_id_users | `doctor_user_id` | `id` |
| [`clinical.consultations`](../../Tables/clinical/consultations.md) | fk_clinical_consultations_updated_by_users | `updated_by` | `id` |
| [`clinical.diagnoses`](../../Tables/clinical/diagnoses.md) | fk_clinical_diagnoses_created_by_users | `created_by` | `id` |
| [`clinical.diagnoses`](../../Tables/clinical/diagnoses.md) | fk_clinical_diagnoses_updated_by_users | `updated_by` | `id` |
| [`clinical.observations`](../../Tables/clinical/observations.md) | fk_clinical_observations_created_by_users | `created_by` | `id` |
| [`clinical.observations`](../../Tables/clinical/observations.md) | fk_clinical_observations_updated_by_users | `updated_by` | `id` |
| [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | fk_clinical_order_reviews_assigned_to_user_id_users | `assigned_to_user_id` | `id` |
| [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | fk_clinical_order_reviews_reviewed_by_user_id_users | `reviewed_by_user_id` | `id` |
| [`clinical.patient_allergies`](../../Tables/clinical/patient_allergies.md) | fk_clinical_patient_allergies_created_by_users | `created_by` | `id` |
| [`clinical.patient_allergies`](../../Tables/clinical/patient_allergies.md) | fk_clinical_patient_allergies_deleted_by_users | `deleted_by` | `id` |
| [`clinical.patient_allergies`](../../Tables/clinical/patient_allergies.md) | fk_clinical_patient_allergies_updated_by_users | `updated_by` | `id` |
| [`clinical.patient_conditions`](../../Tables/clinical/patient_conditions.md) | fk_clinical_patient_conditions_created_by_users | `created_by` | `id` |
| [`clinical.patient_conditions`](../../Tables/clinical/patient_conditions.md) | fk_clinical_patient_conditions_deleted_by_users | `deleted_by` | `id` |
| [`clinical.patient_conditions`](../../Tables/clinical/patient_conditions.md) | fk_clinical_patient_conditions_updated_by_users | `updated_by` | `id` |
| [`clinical.patient_medications`](../../Tables/clinical/patient_medications.md) | fk_clinical_patient_medications_created_by_users | `created_by` | `id` |
| [`clinical.patient_medications`](../../Tables/clinical/patient_medications.md) | fk_clinical_patient_medications_deleted_by_users | `deleted_by` | `id` |
| [`clinical.patient_medications`](../../Tables/clinical/patient_medications.md) | fk_clinical_patient_medications_updated_by_users | `updated_by` | `id` |
| [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | fk_clinical_patient_profiles_created_by_users | `created_by` | `id` |
| [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | fk_clinical_patient_profiles_deleted_by_users | `deleted_by` | `id` |
| [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | fk_clinical_patient_profiles_updated_by_users | `updated_by` | `id` |
| [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | fk_clinical_patient_profiles_user_id_users | `user_id` | `id` |
| [`clinical.practitioner_organizations`](../../Tables/clinical/practitioner_organizations.md) | fk_clinical_practitioner_organizations_created_by_users | `created_by` | `id` |
| [`clinical.practitioner_organizations`](../../Tables/clinical/practitioner_organizations.md) | fk_clinical_practitioner_organizations_updated_by_users | `updated_by` | `id` |
| [`clinical.practitioner_profiles`](../../Tables/clinical/practitioner_profiles.md) | fk_clinical_practitioner_profiles_created_by_users | `created_by` | `id` |
| [`clinical.practitioner_profiles`](../../Tables/clinical/practitioner_profiles.md) | fk_clinical_practitioner_profiles_deleted_by_users | `deleted_by` | `id` |
| [`clinical.practitioner_profiles`](../../Tables/clinical/practitioner_profiles.md) | fk_clinical_practitioner_profiles_updated_by_users | `updated_by` | `id` |
| [`clinical.practitioner_profiles`](../../Tables/clinical/practitioner_profiles.md) | fk_clinical_practitioner_profiles_user_id_users | `user_id` | `id` |
| [`clinical.prescription_access_logs`](../../Tables/clinical/prescription_access_logs.md) | fk_clinical_prescription_access_logs_actor_user_id_users | `actor_user_id` | `id` |
| [`clinical.prescription_documents`](../../Tables/clinical/prescription_documents.md) | fk_clinical_prescription_documents_created_by_users | `created_by` | `id` |
| [`clinical.prescription_documents`](../../Tables/clinical/prescription_documents.md) | fk_clinical_prescription_documents_updated_by_users | `updated_by` | `id` |
| [`clinical.prescription_items`](../../Tables/clinical/prescription_items.md) | fk_clinical_prescription_items_created_by_users | `created_by` | `id` |
| [`clinical.prescription_items`](../../Tables/clinical/prescription_items.md) | fk_clinical_prescription_items_updated_by_users | `updated_by` | `id` |
| [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | fk_clinical_prescriptions_created_by_users | `created_by` | `id` |
| [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | fk_clinical_prescriptions_prescriber_user_id_users | `prescriber_user_id` | `id` |
| [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | fk_clinical_prescriptions_reviewed_by_user_id_users | `reviewed_by_user_id` | `id` |
| [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | fk_clinical_prescriptions_updated_by_users | `updated_by` | `id` |
| [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | fk_clinical_prescriptions_uploaded_by_user_id_users | `uploaded_by_user_id` | `id` |
| [`clinical.review_reason_codes`](../../Tables/clinical/review_reason_codes.md) | fk_clinical_review_reason_codes_created_by_user_id_users | `created_by_user_id` | `id` |
| [`clinical.review_reason_codes`](../../Tables/clinical/review_reason_codes.md) | fk_clinical_review_reason_codes_updated_by_user_id_users | `updated_by_user_id` | `id` |
| [`commerce.cancellation_items`](../../Tables/commerce/cancellation_items.md) | fk_commerce_cancellation_items_created_by_users | `created_by` | `id` |
| [`commerce.cancellation_items`](../../Tables/commerce/cancellation_items.md) | fk_commerce_cancellation_items_updated_by_users | `updated_by` | `id` |
| [`commerce.cancellation_reason_codes`](../../Tables/commerce/cancellation_reason_codes.md) | fk_commerce_cancellation_reason_codes_created_by_user_id_users | `created_by_user_id` | `id` |
| [`commerce.cancellation_reason_codes`](../../Tables/commerce/cancellation_reason_codes.md) | fk_commerce_cancellation_reason_codes_updated_by_user_id_users | `updated_by_user_id` | `id` |
| [`commerce.cancellations`](../../Tables/commerce/cancellations.md) | fk_commerce_cancellations_approved_by_user_id_users | `approved_by_user_id` | `id` |
| [`commerce.cancellations`](../../Tables/commerce/cancellations.md) | fk_commerce_cancellations_created_by_users | `created_by` | `id` |
| [`commerce.cancellations`](../../Tables/commerce/cancellations.md) | fk_commerce_cancellations_requested_by_user_id_users | `requested_by_user_id` | `id` |
| [`commerce.cancellations`](../../Tables/commerce/cancellations.md) | fk_commerce_cancellations_updated_by_users | `updated_by` | `id` |
| [`commerce.cart_items`](../../Tables/commerce/cart_items.md) | fk_commerce_cart_items_created_by_users | `created_by` | `id` |
| [`commerce.cart_items`](../../Tables/commerce/cart_items.md) | fk_commerce_cart_items_updated_by_users | `updated_by` | `id` |
| [`commerce.carts`](../../Tables/commerce/carts.md) | fk_commerce_carts_created_by_users | `created_by` | `id` |
| [`commerce.carts`](../../Tables/commerce/carts.md) | fk_commerce_carts_updated_by_users | `updated_by` | `id` |
| [`commerce.carts`](../../Tables/commerce/carts.md) | fk_commerce_carts_user_id_users | `user_id` | `id` |
| [`commerce.checkouts`](../../Tables/commerce/checkouts.md) | fk_commerce_checkouts_created_by_users | `created_by` | `id` |
| [`commerce.checkouts`](../../Tables/commerce/checkouts.md) | fk_commerce_checkouts_updated_by_users | `updated_by` | `id` |
| [`commerce.checkouts`](../../Tables/commerce/checkouts.md) | fk_commerce_checkouts_user_id_users | `user_id` | `id` |
| [`commerce.order_allocations`](../../Tables/commerce/order_allocations.md) | fk_commerce_order_allocations_created_by_users | `created_by` | `id` |
| [`commerce.order_allocations`](../../Tables/commerce/order_allocations.md) | fk_commerce_order_allocations_updated_by_users | `updated_by` | `id` |
| [`commerce.order_charges`](../../Tables/commerce/order_charges.md) | fk_commerce_order_charges_created_by_users | `created_by` | `id` |
| [`commerce.order_charges`](../../Tables/commerce/order_charges.md) | fk_commerce_order_charges_updated_by_users | `updated_by` | `id` |
| [`commerce.order_discounts`](../../Tables/commerce/order_discounts.md) | fk_commerce_order_discounts_created_by_users | `created_by` | `id` |
| [`commerce.order_discounts`](../../Tables/commerce/order_discounts.md) | fk_commerce_order_discounts_updated_by_users | `updated_by` | `id` |
| [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | fk_commerce_order_groups_created_by_users | `created_by` | `id` |
| [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | fk_commerce_order_groups_updated_by_users | `updated_by` | `id` |
| [`commerce.order_items`](../../Tables/commerce/order_items.md) | fk_commerce_order_items_created_by_users | `created_by` | `id` |
| [`commerce.order_items`](../../Tables/commerce/order_items.md) | fk_commerce_order_items_updated_by_users | `updated_by` | `id` |
| [`commerce.order_revisions`](../../Tables/commerce/order_revisions.md) | fk_commerce_order_revisions_accepted_by_user_id_users | `accepted_by_user_id` | `id` |
| [`commerce.order_status_history`](../../Tables/commerce/order_status_history.md) | fk_commerce_order_status_history_changed_by_user_id_users | `changed_by_user_id` | `id` |
| [`commerce.orders`](../../Tables/commerce/orders.md) | fk_commerce_orders_created_by_users | `created_by` | `id` |
| [`commerce.orders`](../../Tables/commerce/orders.md) | fk_commerce_orders_updated_by_users | `updated_by` | `id` |
| [`commerce.orders`](../../Tables/commerce/orders.md) | fk_commerce_orders_user_id_users | `user_id` | `id` |
| [`commerce.return_items`](../../Tables/commerce/return_items.md) | fk_commerce_return_items_created_by_users | `created_by` | `id` |
| [`commerce.return_items`](../../Tables/commerce/return_items.md) | fk_commerce_return_items_updated_by_users | `updated_by` | `id` |
| [`commerce.return_reason_codes`](../../Tables/commerce/return_reason_codes.md) | fk_commerce_return_reason_codes_created_by_user_id_users | `created_by_user_id` | `id` |
| [`commerce.return_reason_codes`](../../Tables/commerce/return_reason_codes.md) | fk_commerce_return_reason_codes_updated_by_user_id_users | `updated_by_user_id` | `id` |
| [`commerce.returns`](../../Tables/commerce/returns.md) | fk_commerce_returns_created_by_users | `created_by` | `id` |
| [`commerce.returns`](../../Tables/commerce/returns.md) | fk_commerce_returns_updated_by_users | `updated_by` | `id` |
| [`commerce.returns`](../../Tables/commerce/returns.md) | fk_commerce_returns_user_id_users | `user_id` | `id` |
| [`compliance.adverse_event_reports`](../../Tables/compliance/adverse_event_reports.md) | fk_compliance_adverse_event_reports_created_by_users | `created_by` | `id` |
| [`compliance.adverse_event_reports`](../../Tables/compliance/adverse_event_reports.md) | fk_compliance_adverse_event_reports_reported_by_user_id_users | `reported_by_user_id` | `id` |
| [`compliance.adverse_event_reports`](../../Tables/compliance/adverse_event_reports.md) | fk_compliance_adverse_event_reports_updated_by_users | `updated_by` | `id` |
| [`compliance.legal_holds`](../../Tables/compliance/legal_holds.md) | fk_compliance_legal_holds_created_by_users | `created_by` | `id` |
| [`compliance.legal_holds`](../../Tables/compliance/legal_holds.md) | fk_compliance_legal_holds_deleted_by_users | `deleted_by` | `id` |
| [`compliance.legal_holds`](../../Tables/compliance/legal_holds.md) | fk_compliance_legal_holds_updated_by_users | `updated_by` | `id` |
| [`compliance.privacy_requests`](../../Tables/compliance/privacy_requests.md) | fk_compliance_privacy_requests_created_by_users | `created_by` | `id` |
| [`compliance.privacy_requests`](../../Tables/compliance/privacy_requests.md) | fk_compliance_privacy_requests_updated_by_users | `updated_by` | `id` |
| [`compliance.privacy_requests`](../../Tables/compliance/privacy_requests.md) | fk_compliance_privacy_requests_user_id_users | `user_id` | `id` |
| [`compliance.product_recalls`](../../Tables/compliance/product_recalls.md) | fk_compliance_product_recalls_created_by_users | `created_by` | `id` |
| [`compliance.product_recalls`](../../Tables/compliance/product_recalls.md) | fk_compliance_product_recalls_updated_by_users | `updated_by` | `id` |
| [`compliance.recall_lots`](../../Tables/compliance/recall_lots.md) | fk_compliance_recall_lots_created_by_users | `created_by` | `id` |
| [`compliance.recall_lots`](../../Tables/compliance/recall_lots.md) | fk_compliance_recall_lots_updated_by_users | `updated_by` | `id` |
| [`compliance.regulatory_authorities`](../../Tables/compliance/regulatory_authorities.md) | fk_compliance_regulatory_authorities_created_by_users | `created_by` | `id` |
| [`compliance.regulatory_authorities`](../../Tables/compliance/regulatory_authorities.md) | fk_compliance_regulatory_authorities_deleted_by_users | `deleted_by` | `id` |
| [`compliance.regulatory_authorities`](../../Tables/compliance/regulatory_authorities.md) | fk_compliance_regulatory_authorities_updated_by_users | `updated_by` | `id` |
| [`compliance.regulatory_registrations`](../../Tables/compliance/regulatory_registrations.md) | fk_compliance_regulatory_registrations_created_by_users | `created_by` | `id` |
| [`compliance.regulatory_registrations`](../../Tables/compliance/regulatory_registrations.md) | fk_compliance_regulatory_registrations_deleted_by_users | `deleted_by` | `id` |
| [`compliance.regulatory_registrations`](../../Tables/compliance/regulatory_registrations.md) | fk_compliance_regulatory_registrations_updated_by_users | `updated_by` | `id` |
| [`customer.addresses`](../../Tables/customer/addresses.md) | fk_customer_addresses_created_by_users | `created_by` | `id` |
| [`customer.addresses`](../../Tables/customer/addresses.md) | fk_customer_addresses_deleted_by_users | `deleted_by` | `id` |
| [`customer.addresses`](../../Tables/customer/addresses.md) | fk_customer_addresses_updated_by_users | `updated_by` | `id` |
| [`customer.addresses`](../../Tables/customer/addresses.md) | fk_customer_addresses_user_id_users | `user_id` | `id` |
| [`customer.consent_events`](../../Tables/customer/consent_events.md) | fk_customer_consent_events_actor_user_id_users | `actor_user_id` | `id` |
| [`customer.consents`](../../Tables/customer/consents.md) | fk_customer_consents_created_by_users | `created_by` | `id` |
| [`customer.consents`](../../Tables/customer/consents.md) | fk_customer_consents_updated_by_users | `updated_by` | `id` |
| [`customer.consents`](../../Tables/customer/consents.md) | fk_customer_consents_user_id_users | `user_id` | `id` |
| [`customer.family_members`](../../Tables/customer/family_members.md) | fk_customer_family_members_created_by_users | `created_by` | `id` |
| [`customer.family_members`](../../Tables/customer/family_members.md) | fk_customer_family_members_customer_user_id_users | `customer_user_id` | `id` |
| [`customer.family_members`](../../Tables/customer/family_members.md) | fk_customer_family_members_deleted_by_users | `deleted_by` | `id` |
| [`customer.family_members`](../../Tables/customer/family_members.md) | fk_customer_family_members_guardian_user_id_users | `guardian_user_id` | `id` |
| [`customer.family_members`](../../Tables/customer/family_members.md) | fk_customer_family_members_linked_user_id_users | `linked_user_id` | `id` |
| [`customer.family_members`](../../Tables/customer/family_members.md) | fk_customer_family_members_updated_by_users | `updated_by` | `id` |
| [`customer.preferences`](../../Tables/customer/preferences.md) | fk_customer_preferences_created_by_users | `created_by` | `id` |
| [`customer.preferences`](../../Tables/customer/preferences.md) | fk_customer_preferences_deleted_by_users | `deleted_by` | `id` |
| [`customer.preferences`](../../Tables/customer/preferences.md) | fk_customer_preferences_updated_by_users | `updated_by` | `id` |
| [`customer.preferences`](../../Tables/customer/preferences.md) | fk_customer_preferences_user_id_users | `user_id` | `id` |
| [`customer.profiles`](../../Tables/customer/profiles.md) | fk_customer_profiles_created_by_users | `created_by` | `id` |
| [`customer.profiles`](../../Tables/customer/profiles.md) | fk_customer_profiles_deleted_by_users | `deleted_by` | `id` |
| [`customer.profiles`](../../Tables/customer/profiles.md) | fk_customer_profiles_updated_by_users | `updated_by` | `id` |
| [`customer.profiles`](../../Tables/customer/profiles.md) | fk_customer_profiles_user_id_users | `user_id` | `id` |
| [`customer.wishlist_items`](../../Tables/customer/wishlist_items.md) | fk_customer_wishlist_items_created_by_users | `created_by` | `id` |
| [`customer.wishlist_items`](../../Tables/customer/wishlist_items.md) | fk_customer_wishlist_items_updated_by_users | `updated_by` | `id` |
| [`customer.wishlists`](../../Tables/customer/wishlists.md) | fk_customer_wishlists_created_by_users | `created_by` | `id` |
| [`customer.wishlists`](../../Tables/customer/wishlists.md) | fk_customer_wishlists_deleted_by_users | `deleted_by` | `id` |
| [`customer.wishlists`](../../Tables/customer/wishlists.md) | fk_customer_wishlists_updated_by_users | `updated_by` | `id` |
| [`customer.wishlists`](../../Tables/customer/wishlists.md) | fk_customer_wishlists_user_id_users | `user_id` | `id` |
| [`diagnostics.diagnostic_order_items`](../../Tables/diagnostics/diagnostic_order_items.md) | fk_diagnostics_diagnostic_order_items_created_by_users | `created_by` | `id` |
| [`diagnostics.diagnostic_order_items`](../../Tables/diagnostics/diagnostic_order_items.md) | fk_diagnostics_diagnostic_order_items_updated_by_users | `updated_by` | `id` |
| [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | fk_diagnostics_diagnostic_orders_created_by_users | `created_by` | `id` |
| [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | fk_diagnostics_diagnostic_orders_updated_by_users | `updated_by` | `id` |
| [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | fk_diagnostics_diagnostic_orders_user_id_users | `user_id` | `id` |
| [`diagnostics.diagnostic_reports`](../../Tables/diagnostics/diagnostic_reports.md) | fk_diagnostics_diagnostic_reports_created_by_users | `created_by` | `id` |
| [`diagnostics.diagnostic_reports`](../../Tables/diagnostics/diagnostic_reports.md) | fk_diagnostics_diagnostic_reports_updated_by_users | `updated_by` | `id` |
| [`diagnostics.diagnostic_reports`](../../Tables/diagnostics/diagnostic_reports.md) | fk_diagnostics_diagnostic_reports_verified_by_user_id_users | `verified_by_user_id` | `id` |
| [`diagnostics.diagnostic_result_values`](../../Tables/diagnostics/diagnostic_result_values.md) | fk_diagnostics_diagnostic_result_values_created_by_users | `created_by` | `id` |
| [`diagnostics.diagnostic_result_values`](../../Tables/diagnostics/diagnostic_result_values.md) | fk_diagnostics_diagnostic_result_values_updated_by_users | `updated_by` | `id` |
| [`diagnostics.lab_locations`](../../Tables/diagnostics/lab_locations.md) | fk_diagnostics_lab_locations_created_by_users | `created_by` | `id` |
| [`diagnostics.lab_locations`](../../Tables/diagnostics/lab_locations.md) | fk_diagnostics_lab_locations_deleted_by_users | `deleted_by` | `id` |
| [`diagnostics.lab_locations`](../../Tables/diagnostics/lab_locations.md) | fk_diagnostics_lab_locations_updated_by_users | `updated_by` | `id` |
| [`diagnostics.lab_offerings`](../../Tables/diagnostics/lab_offerings.md) | fk_diagnostics_lab_offerings_created_by_users | `created_by` | `id` |
| [`diagnostics.lab_offerings`](../../Tables/diagnostics/lab_offerings.md) | fk_diagnostics_lab_offerings_deleted_by_users | `deleted_by` | `id` |
| [`diagnostics.lab_offerings`](../../Tables/diagnostics/lab_offerings.md) | fk_diagnostics_lab_offerings_updated_by_users | `updated_by` | `id` |
| [`diagnostics.lab_providers`](../../Tables/diagnostics/lab_providers.md) | fk_diagnostics_lab_providers_created_by_users | `created_by` | `id` |
| [`diagnostics.lab_providers`](../../Tables/diagnostics/lab_providers.md) | fk_diagnostics_lab_providers_deleted_by_users | `deleted_by` | `id` |
| [`diagnostics.lab_providers`](../../Tables/diagnostics/lab_providers.md) | fk_diagnostics_lab_providers_updated_by_users | `updated_by` | `id` |
| [`diagnostics.sample_collections`](../../Tables/diagnostics/sample_collections.md) | fk_diagnostics_sample_collections_collector_user_id_users | `collector_user_id` | `id` |
| [`diagnostics.sample_collections`](../../Tables/diagnostics/sample_collections.md) | fk_diagnostics_sample_collections_created_by_users | `created_by` | `id` |
| [`diagnostics.sample_collections`](../../Tables/diagnostics/sample_collections.md) | fk_diagnostics_sample_collections_updated_by_users | `updated_by` | `id` |
| [`diagnostics.sample_events`](../../Tables/diagnostics/sample_events.md) | fk_diagnostics_sample_events_actor_user_id_users | `actor_user_id` | `id` |
| [`diagnostics.samples`](../../Tables/diagnostics/samples.md) | fk_diagnostics_samples_created_by_users | `created_by` | `id` |
| [`diagnostics.samples`](../../Tables/diagnostics/samples.md) | fk_diagnostics_samples_updated_by_users | `updated_by` | `id` |
| [`diagnostics.test_definitions`](../../Tables/diagnostics/test_definitions.md) | fk_diagnostics_test_definitions_created_by_users | `created_by` | `id` |
| [`diagnostics.test_definitions`](../../Tables/diagnostics/test_definitions.md) | fk_diagnostics_test_definitions_deleted_by_users | `deleted_by` | `id` |
| [`diagnostics.test_definitions`](../../Tables/diagnostics/test_definitions.md) | fk_diagnostics_test_definitions_updated_by_users | `updated_by` | `id` |
| [`diagnostics.test_package_items`](../../Tables/diagnostics/test_package_items.md) | fk_diagnostics_test_package_items_created_by_users | `created_by` | `id` |
| [`diagnostics.test_package_items`](../../Tables/diagnostics/test_package_items.md) | fk_diagnostics_test_package_items_updated_by_users | `updated_by` | `id` |
| [`diagnostics.test_packages`](../../Tables/diagnostics/test_packages.md) | fk_diagnostics_test_packages_created_by_users | `created_by` | `id` |
| [`diagnostics.test_packages`](../../Tables/diagnostics/test_packages.md) | fk_diagnostics_test_packages_deleted_by_users | `deleted_by` | `id` |
| [`diagnostics.test_packages`](../../Tables/diagnostics/test_packages.md) | fk_diagnostics_test_packages_updated_by_users | `updated_by` | `id` |
| [`finance.accounts`](../../Tables/finance/accounts.md) | fk_finance_accounts_created_by_users | `created_by` | `id` |
| [`finance.accounts`](../../Tables/finance/accounts.md) | fk_finance_accounts_deleted_by_users | `deleted_by` | `id` |
| [`finance.accounts`](../../Tables/finance/accounts.md) | fk_finance_accounts_updated_by_users | `updated_by` | `id` |
| [`finance.credit_notes`](../../Tables/finance/credit_notes.md) | fk_finance_credit_notes_created_by_users | `created_by` | `id` |
| [`finance.credit_notes`](../../Tables/finance/credit_notes.md) | fk_finance_credit_notes_updated_by_users | `updated_by` | `id` |
| [`finance.invoice_items`](../../Tables/finance/invoice_items.md) | fk_finance_invoice_items_created_by_users | `created_by` | `id` |
| [`finance.invoice_items`](../../Tables/finance/invoice_items.md) | fk_finance_invoice_items_updated_by_users | `updated_by` | `id` |
| [`finance.invoices`](../../Tables/finance/invoices.md) | fk_finance_invoices_created_by_users | `created_by` | `id` |
| [`finance.invoices`](../../Tables/finance/invoices.md) | fk_finance_invoices_updated_by_users | `updated_by` | `id` |
| [`finance.journal_entries`](../../Tables/finance/journal_entries.md) | fk_finance_journal_entries_created_by_users | `created_by` | `id` |
| [`finance.journal_entries`](../../Tables/finance/journal_entries.md) | fk_finance_journal_entries_updated_by_users | `updated_by` | `id` |
| [`finance.settlement_runs`](../../Tables/finance/settlement_runs.md) | fk_finance_settlement_runs_created_by_users | `created_by` | `id` |
| [`finance.settlement_runs`](../../Tables/finance/settlement_runs.md) | fk_finance_settlement_runs_updated_by_users | `updated_by` | `id` |
| [`fulfillment.fulfillment_events`](../../Tables/fulfillment/fulfillment_events.md) | fk_fulfillment_fulfillment_events_actor_user_id_users | `actor_user_id` | `id` |
| [`fulfillment.fulfillment_order_items`](../../Tables/fulfillment/fulfillment_order_items.md) | fk_fulfillment_fulfillment_order_items_created_by_users | `created_by` | `id` |
| [`fulfillment.fulfillment_order_items`](../../Tables/fulfillment/fulfillment_order_items.md) | fk_fulfillment_fulfillment_order_items_updated_by_users | `updated_by` | `id` |
| [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | fk_fulfillment_fulfillment_orders_created_by_users | `created_by` | `id` |
| [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | fk_fulfillment_fulfillment_orders_updated_by_users | `updated_by` | `id` |
| [`fulfillment.pack_tasks`](../../Tables/fulfillment/pack_tasks.md) | fk_fulfillment_pack_tasks_assigned_to_user_id_users | `assigned_to_user_id` | `id` |
| [`fulfillment.pack_tasks`](../../Tables/fulfillment/pack_tasks.md) | fk_fulfillment_pack_tasks_created_by_users | `created_by` | `id` |
| [`fulfillment.pack_tasks`](../../Tables/fulfillment/pack_tasks.md) | fk_fulfillment_pack_tasks_updated_by_users | `updated_by` | `id` |
| [`fulfillment.package_items`](../../Tables/fulfillment/package_items.md) | fk_fulfillment_package_items_created_by_users | `created_by` | `id` |
| [`fulfillment.package_items`](../../Tables/fulfillment/package_items.md) | fk_fulfillment_package_items_updated_by_users | `updated_by` | `id` |
| [`fulfillment.packages`](../../Tables/fulfillment/packages.md) | fk_fulfillment_packages_created_by_users | `created_by` | `id` |
| [`fulfillment.packages`](../../Tables/fulfillment/packages.md) | fk_fulfillment_packages_packed_by_user_id_users | `packed_by_user_id` | `id` |
| [`fulfillment.packages`](../../Tables/fulfillment/packages.md) | fk_fulfillment_packages_updated_by_users | `updated_by` | `id` |
| [`fulfillment.pick_task_items`](../../Tables/fulfillment/pick_task_items.md) | fk_fulfillment_pick_task_items_created_by_users | `created_by` | `id` |
| [`fulfillment.pick_task_items`](../../Tables/fulfillment/pick_task_items.md) | fk_fulfillment_pick_task_items_updated_by_users | `updated_by` | `id` |
| [`fulfillment.pick_tasks`](../../Tables/fulfillment/pick_tasks.md) | fk_fulfillment_pick_tasks_assigned_to_user_id_users | `assigned_to_user_id` | `id` |
| [`fulfillment.pick_tasks`](../../Tables/fulfillment/pick_tasks.md) | fk_fulfillment_pick_tasks_created_by_users | `created_by` | `id` |
| [`fulfillment.pick_tasks`](../../Tables/fulfillment/pick_tasks.md) | fk_fulfillment_pick_tasks_updated_by_users | `updated_by` | `id` |
| [`fulfillment.picking_wave_orders`](../../Tables/fulfillment/picking_wave_orders.md) | fk_fulfillment_picking_wave_orders_created_by_users | `created_by` | `id` |
| [`fulfillment.picking_wave_orders`](../../Tables/fulfillment/picking_wave_orders.md) | fk_fulfillment_picking_wave_orders_updated_by_users | `updated_by` | `id` |
| [`fulfillment.picking_waves`](../../Tables/fulfillment/picking_waves.md) | fk_fulfillment_picking_waves_created_by_users | `created_by` | `id` |
| [`fulfillment.picking_waves`](../../Tables/fulfillment/picking_waves.md) | fk_fulfillment_picking_waves_updated_by_users | `updated_by` | `id` |
| [`identity.api_client_secrets`](../../Tables/identity/api_client_secrets.md) | fk_identity_api_client_secrets_created_by_users | `created_by` | `id` |
| [`identity.api_client_secrets`](../../Tables/identity/api_client_secrets.md) | fk_identity_api_client_secrets_updated_by_users | `updated_by` | `id` |
| [`identity.api_clients`](../../Tables/identity/api_clients.md) | fk_identity_api_clients_created_by_users | `created_by` | `id` |
| [`identity.api_clients`](../../Tables/identity/api_clients.md) | fk_identity_api_clients_deleted_by_users | `deleted_by` | `id` |
| [`identity.api_clients`](../../Tables/identity/api_clients.md) | fk_identity_api_clients_updated_by_users | `updated_by` | `id` |
| [`identity.authentication_challenges`](../../Tables/identity/authentication_challenges.md) | authentication_challenges_created_by_fkey | `created_by` | `id` |
| [`identity.authentication_challenges`](../../Tables/identity/authentication_challenges.md) | authentication_challenges_updated_by_fkey | `updated_by` | `id` |
| [`identity.authentication_challenges`](../../Tables/identity/authentication_challenges.md) | authentication_challenges_user_id_fkey | `user_id` | `id` |
| [`identity.login_attempts`](../../Tables/identity/login_attempts.md) | fk_identity_login_attempts_user_id_users | `user_id` | `id` |
| [`identity.mfa_factors`](../../Tables/identity/mfa_factors.md) | fk_identity_mfa_factors_created_by_users | `created_by` | `id` |
| [`identity.mfa_factors`](../../Tables/identity/mfa_factors.md) | fk_identity_mfa_factors_updated_by_users | `updated_by` | `id` |
| [`identity.mfa_factors`](../../Tables/identity/mfa_factors.md) | fk_identity_mfa_factors_user_id_users | `user_id` | `id` |
| [`identity.otp_challenges`](../../Tables/identity/otp_challenges.md) | fk_identity_otp_challenges_created_by_users | `created_by` | `id` |
| [`identity.otp_challenges`](../../Tables/identity/otp_challenges.md) | fk_identity_otp_challenges_updated_by_users | `updated_by` | `id` |
| [`identity.password_history`](../../Tables/identity/password_history.md) | fk_identity_password_history_user_id_users | `user_id` | `id` |
| [`identity.permissions`](../../Tables/identity/permissions.md) | fk_identity_permissions_created_by_users | `created_by` | `id` |
| [`identity.permissions`](../../Tables/identity/permissions.md) | fk_identity_permissions_deleted_by_users | `deleted_by` | `id` |
| [`identity.permissions`](../../Tables/identity/permissions.md) | fk_identity_permissions_updated_by_users | `updated_by` | `id` |
| [`identity.role_permissions`](../../Tables/identity/role_permissions.md) | fk_identity_role_permissions_created_by_users | `created_by` | `id` |
| [`identity.role_permissions`](../../Tables/identity/role_permissions.md) | fk_identity_role_permissions_updated_by_users | `updated_by` | `id` |
| [`identity.roles`](../../Tables/identity/roles.md) | fk_identity_roles_created_by_users | `created_by` | `id` |
| [`identity.roles`](../../Tables/identity/roles.md) | fk_identity_roles_deleted_by_users | `deleted_by` | `id` |
| [`identity.roles`](../../Tables/identity/roles.md) | fk_identity_roles_updated_by_users | `updated_by` | `id` |
| [`identity.session_refresh_tokens`](../../Tables/identity/session_refresh_tokens.md) | session_refresh_tokens_created_by_fkey | `created_by` | `id` |
| [`identity.session_refresh_tokens`](../../Tables/identity/session_refresh_tokens.md) | session_refresh_tokens_updated_by_fkey | `updated_by` | `id` |
| [`identity.sessions`](../../Tables/identity/sessions.md) | fk_identity_sessions_created_by_users | `created_by` | `id` |
| [`identity.sessions`](../../Tables/identity/sessions.md) | fk_identity_sessions_updated_by_users | `updated_by` | `id` |
| [`identity.sessions`](../../Tables/identity/sessions.md) | fk_identity_sessions_user_id_users | `user_id` | `id` |
| [`identity.trusted_devices`](../../Tables/identity/trusted_devices.md) | fk_identity_trusted_devices_created_by_users | `created_by` | `id` |
| [`identity.trusted_devices`](../../Tables/identity/trusted_devices.md) | fk_identity_trusted_devices_updated_by_users | `updated_by` | `id` |
| [`identity.trusted_devices`](../../Tables/identity/trusted_devices.md) | fk_identity_trusted_devices_user_id_users | `user_id` | `id` |
| [`identity.user_profiles`](../../Tables/identity/user_profiles.md) | fk_identity_user_profiles_created_by_users | `created_by` | `id` |
| [`identity.user_profiles`](../../Tables/identity/user_profiles.md) | fk_identity_user_profiles_deleted_by_users | `deleted_by` | `id` |
| [`identity.user_profiles`](../../Tables/identity/user_profiles.md) | fk_identity_user_profiles_updated_by_users | `updated_by` | `id` |
| [`identity.user_profiles`](../../Tables/identity/user_profiles.md) | fk_identity_user_profiles_user_id_users | `user_id` | `id` |
| [`identity.user_roles`](../../Tables/identity/user_roles.md) | fk_identity_user_roles_created_by_users | `created_by` | `id` |
| [`identity.user_roles`](../../Tables/identity/user_roles.md) | fk_identity_user_roles_updated_by_users | `updated_by` | `id` |
| [`identity.user_roles`](../../Tables/identity/user_roles.md) | fk_identity_user_roles_user_id_users | `user_id` | `id` |
| [`identity.users`](../../Tables/identity/users.md) | fk_identity_users_created_by_users | `created_by` | `id` |
| [`identity.users`](../../Tables/identity/users.md) | fk_identity_users_updated_by_users | `updated_by` | `id` |
| [`insurance.claim_documents`](../../Tables/insurance/claim_documents.md) | fk_insurance_claim_documents_created_by_users | `created_by` | `id` |
| [`insurance.claim_documents`](../../Tables/insurance/claim_documents.md) | fk_insurance_claim_documents_updated_by_users | `updated_by` | `id` |
| [`insurance.claims`](../../Tables/insurance/claims.md) | fk_insurance_claims_created_by_users | `created_by` | `id` |
| [`insurance.claims`](../../Tables/insurance/claims.md) | fk_insurance_claims_updated_by_users | `updated_by` | `id` |
| [`insurance.insurers`](../../Tables/insurance/insurers.md) | fk_insurance_insurers_created_by_users | `created_by` | `id` |
| [`insurance.insurers`](../../Tables/insurance/insurers.md) | fk_insurance_insurers_deleted_by_users | `deleted_by` | `id` |
| [`insurance.insurers`](../../Tables/insurance/insurers.md) | fk_insurance_insurers_updated_by_users | `updated_by` | `id` |
| [`insurance.policies`](../../Tables/insurance/policies.md) | fk_insurance_policies_created_by_users | `created_by` | `id` |
| [`insurance.policies`](../../Tables/insurance/policies.md) | fk_insurance_policies_deleted_by_users | `deleted_by` | `id` |
| [`insurance.policies`](../../Tables/insurance/policies.md) | fk_insurance_policies_updated_by_users | `updated_by` | `id` |
| [`insurance.policies`](../../Tables/insurance/policies.md) | fk_insurance_policies_user_id_users | `user_id` | `id` |
| [`insurance.policy_members`](../../Tables/insurance/policy_members.md) | fk_insurance_policy_members_created_by_users | `created_by` | `id` |
| [`insurance.policy_members`](../../Tables/insurance/policy_members.md) | fk_insurance_policy_members_updated_by_users | `updated_by` | `id` |
| [`insurance.tpas`](../../Tables/insurance/tpas.md) | fk_insurance_tpas_created_by_users | `created_by` | `id` |
| [`insurance.tpas`](../../Tables/insurance/tpas.md) | fk_insurance_tpas_deleted_by_users | `deleted_by` | `id` |
| [`insurance.tpas`](../../Tables/insurance/tpas.md) | fk_insurance_tpas_updated_by_users | `updated_by` | `id` |
| [`logistics.carrier_accounts`](../../Tables/logistics/carrier_accounts.md) | fk_logistics_carrier_accounts_created_by_users | `created_by` | `id` |
| [`logistics.carrier_accounts`](../../Tables/logistics/carrier_accounts.md) | fk_logistics_carrier_accounts_deleted_by_users | `deleted_by` | `id` |
| [`logistics.carrier_accounts`](../../Tables/logistics/carrier_accounts.md) | fk_logistics_carrier_accounts_updated_by_users | `updated_by` | `id` |
| [`logistics.carriers`](../../Tables/logistics/carriers.md) | fk_logistics_carriers_created_by_users | `created_by` | `id` |
| [`logistics.carriers`](../../Tables/logistics/carriers.md) | fk_logistics_carriers_deleted_by_users | `deleted_by` | `id` |
| [`logistics.carriers`](../../Tables/logistics/carriers.md) | fk_logistics_carriers_updated_by_users | `updated_by` | `id` |
| [`logistics.delivery_assignments`](../../Tables/logistics/delivery_assignments.md) | fk_logistics_delivery_assignments_created_by_users | `created_by` | `id` |
| [`logistics.delivery_assignments`](../../Tables/logistics/delivery_assignments.md) | fk_logistics_delivery_assignments_delivery_user_id_users | `delivery_user_id` | `id` |
| [`logistics.delivery_assignments`](../../Tables/logistics/delivery_assignments.md) | fk_logistics_delivery_assignments_updated_by_users | `updated_by` | `id` |
| [`logistics.delivery_attempts`](../../Tables/logistics/delivery_attempts.md) | fk_logistics_delivery_attempts_created_by_users | `created_by` | `id` |
| [`logistics.delivery_attempts`](../../Tables/logistics/delivery_attempts.md) | fk_logistics_delivery_attempts_delivery_user_id_users | `delivery_user_id` | `id` |
| [`logistics.delivery_attempts`](../../Tables/logistics/delivery_attempts.md) | fk_logistics_delivery_attempts_updated_by_users | `updated_by` | `id` |
| [`logistics.delivery_failure_reasons`](../../Tables/logistics/delivery_failure_reasons.md) | fk_logistics_delivery_failure_reasons_created_by_user_id_users | `created_by_user_id` | `id` |
| [`logistics.delivery_failure_reasons`](../../Tables/logistics/delivery_failure_reasons.md) | fk_logistics_delivery_failure_reasons_updated_by_user_id_users | `updated_by_user_id` | `id` |
| [`logistics.delivery_location_updates`](../../Tables/logistics/delivery_location_updates.md) | fk_logistics_delivery_location_updates_delivery_user_id_users | `delivery_user_id` | `id` |
| [`logistics.delivery_routes`](../../Tables/logistics/delivery_routes.md) | fk_logistics_delivery_routes_created_by_users | `created_by` | `id` |
| [`logistics.delivery_routes`](../../Tables/logistics/delivery_routes.md) | fk_logistics_delivery_routes_delivery_user_id_users | `delivery_user_id` | `id` |
| [`logistics.delivery_routes`](../../Tables/logistics/delivery_routes.md) | fk_logistics_delivery_routes_updated_by_users | `updated_by` | `id` |
| [`logistics.delivery_slots`](../../Tables/logistics/delivery_slots.md) | fk_logistics_delivery_slots_created_by_users | `created_by` | `id` |
| [`logistics.delivery_slots`](../../Tables/logistics/delivery_slots.md) | fk_logistics_delivery_slots_deleted_by_users | `deleted_by` | `id` |
| [`logistics.delivery_slots`](../../Tables/logistics/delivery_slots.md) | fk_logistics_delivery_slots_updated_by_users | `updated_by` | `id` |
| [`logistics.ndr_cases`](../../Tables/logistics/ndr_cases.md) | fk_logistics_ndr_cases_created_by_users | `created_by` | `id` |
| [`logistics.ndr_cases`](../../Tables/logistics/ndr_cases.md) | fk_logistics_ndr_cases_updated_by_users | `updated_by` | `id` |
| [`logistics.reverse_shipments`](../../Tables/logistics/reverse_shipments.md) | fk_logistics_reverse_shipments_created_by_users | `created_by` | `id` |
| [`logistics.reverse_shipments`](../../Tables/logistics/reverse_shipments.md) | fk_logistics_reverse_shipments_updated_by_users | `updated_by` | `id` |
| [`logistics.rider_shifts`](../../Tables/logistics/rider_shifts.md) | fk_logistics_rider_shifts_rider_user_id_users | `rider_user_id` | `id` |
| [`logistics.serviceability_rules`](../../Tables/logistics/serviceability_rules.md) | fk_logistics_serviceability_rules_created_by_users | `created_by` | `id` |
| [`logistics.serviceability_rules`](../../Tables/logistics/serviceability_rules.md) | fk_logistics_serviceability_rules_deleted_by_users | `deleted_by` | `id` |
| [`logistics.serviceability_rules`](../../Tables/logistics/serviceability_rules.md) | fk_logistics_serviceability_rules_updated_by_users | `updated_by` | `id` |
| [`logistics.shipments`](../../Tables/logistics/shipments.md) | fk_logistics_shipments_created_by_users | `created_by` | `id` |
| [`logistics.shipments`](../../Tables/logistics/shipments.md) | fk_logistics_shipments_updated_by_users | `updated_by` | `id` |
| [`marketplace.commission_plans`](../../Tables/marketplace/commission_plans.md) | fk_marketplace_commission_plans_created_by_users | `created_by` | `id` |
| [`marketplace.commission_plans`](../../Tables/marketplace/commission_plans.md) | fk_marketplace_commission_plans_deleted_by_users | `deleted_by` | `id` |
| [`marketplace.commission_plans`](../../Tables/marketplace/commission_plans.md) | fk_marketplace_commission_plans_updated_by_users | `updated_by` | `id` |
| [`marketplace.seller_commission_assignments`](../../Tables/marketplace/seller_commission_assignments.md) | fk_marketplace_seller_commission_assignments_created_by_users | `created_by` | `id` |
| [`marketplace.seller_commission_assignments`](../../Tables/marketplace/seller_commission_assignments.md) | fk_marketplace_seller_commission_assignments_updated_by_users | `updated_by` | `id` |
| [`marketplace.seller_locations`](../../Tables/marketplace/seller_locations.md) | fk_marketplace_seller_locations_approved_by_user_id_users | `approved_by_user_id` | `id` |
| [`marketplace.seller_locations`](../../Tables/marketplace/seller_locations.md) | fk_marketplace_seller_locations_created_by_users | `created_by` | `id` |
| [`marketplace.seller_locations`](../../Tables/marketplace/seller_locations.md) | fk_marketplace_seller_locations_updated_by_users | `updated_by` | `id` |
| [`marketplace.seller_product_listings`](../../Tables/marketplace/seller_product_listings.md) | fk_marketplace_seller_product_listings_created_by_users | `created_by` | `id` |
| [`marketplace.seller_product_listings`](../../Tables/marketplace/seller_product_listings.md) | fk_marketplace_seller_product_listings_deleted_by_users | `deleted_by` | `id` |
| [`marketplace.seller_product_listings`](../../Tables/marketplace/seller_product_listings.md) | fk_marketplace_seller_product_listings_updated_by_users | `updated_by` | `id` |
| [`marketplace.seller_ratings`](../../Tables/marketplace/seller_ratings.md) | fk_marketplace_seller_ratings_user_id_users | `user_id` | `id` |
| [`marketplace.seller_service_levels`](../../Tables/marketplace/seller_service_levels.md) | fk_marketplace_seller_service_levels_created_by_users | `created_by` | `id` |
| [`marketplace.seller_service_levels`](../../Tables/marketplace/seller_service_levels.md) | fk_marketplace_seller_service_levels_updated_by_users | `updated_by` | `id` |
| [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | fk_marketplace_sellers_created_by_users | `created_by` | `id` |
| [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | fk_marketplace_sellers_deleted_by_users | `deleted_by` | `id` |
| [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | fk_marketplace_sellers_updated_by_users | `updated_by` | `id` |
| [`membership.loyalty_accounts`](../../Tables/membership/loyalty_accounts.md) | fk_membership_loyalty_accounts_created_by_users | `created_by` | `id` |
| [`membership.loyalty_accounts`](../../Tables/membership/loyalty_accounts.md) | fk_membership_loyalty_accounts_updated_by_users | `updated_by` | `id` |
| [`membership.loyalty_accounts`](../../Tables/membership/loyalty_accounts.md) | fk_membership_loyalty_accounts_user_id_users | `user_id` | `id` |
| [`membership.plan_benefits`](../../Tables/membership/plan_benefits.md) | fk_membership_plan_benefits_created_by_users | `created_by` | `id` |
| [`membership.plan_benefits`](../../Tables/membership/plan_benefits.md) | fk_membership_plan_benefits_deleted_by_users | `deleted_by` | `id` |
| [`membership.plan_benefits`](../../Tables/membership/plan_benefits.md) | fk_membership_plan_benefits_updated_by_users | `updated_by` | `id` |
| [`membership.plans`](../../Tables/membership/plans.md) | fk_membership_plans_created_by_users | `created_by` | `id` |
| [`membership.plans`](../../Tables/membership/plans.md) | fk_membership_plans_deleted_by_users | `deleted_by` | `id` |
| [`membership.plans`](../../Tables/membership/plans.md) | fk_membership_plans_updated_by_users | `updated_by` | `id` |
| [`membership.subscriptions`](../../Tables/membership/subscriptions.md) | fk_membership_subscriptions_created_by_users | `created_by` | `id` |
| [`membership.subscriptions`](../../Tables/membership/subscriptions.md) | fk_membership_subscriptions_updated_by_users | `updated_by` | `id` |
| [`membership.subscriptions`](../../Tables/membership/subscriptions.md) | fk_membership_subscriptions_user_id_users | `user_id` | `id` |
| [`notification.device_endpoints`](../../Tables/notification/device_endpoints.md) | fk_notification_device_endpoints_created_by_users | `created_by` | `id` |
| [`notification.device_endpoints`](../../Tables/notification/device_endpoints.md) | fk_notification_device_endpoints_deleted_by_users | `deleted_by` | `id` |
| [`notification.device_endpoints`](../../Tables/notification/device_endpoints.md) | fk_notification_device_endpoints_updated_by_users | `updated_by` | `id` |
| [`notification.device_endpoints`](../../Tables/notification/device_endpoints.md) | fk_notification_device_endpoints_user_id_users | `user_id` | `id` |
| [`notification.in_app_notifications`](../../Tables/notification/in_app_notifications.md) | fk_notification_in_app_notifications_created_by_users | `created_by` | `id` |
| [`notification.in_app_notifications`](../../Tables/notification/in_app_notifications.md) | fk_notification_in_app_notifications_deleted_by_users | `deleted_by` | `id` |
| [`notification.in_app_notifications`](../../Tables/notification/in_app_notifications.md) | fk_notification_in_app_notifications_updated_by_users | `updated_by` | `id` |
| [`notification.in_app_notifications`](../../Tables/notification/in_app_notifications.md) | fk_notification_in_app_notifications_user_id_users | `user_id` | `id` |
| [`notification.message_attachments`](../../Tables/notification/message_attachments.md) | fk_notification_message_attachments_created_by_users | `created_by` | `id` |
| [`notification.message_attachments`](../../Tables/notification/message_attachments.md) | fk_notification_message_attachments_updated_by_users | `updated_by` | `id` |
| [`notification.messages`](../../Tables/notification/messages.md) | fk_notification_messages_created_by_users | `created_by` | `id` |
| [`notification.messages`](../../Tables/notification/messages.md) | fk_notification_messages_updated_by_users | `updated_by` | `id` |
| [`notification.messages`](../../Tables/notification/messages.md) | fk_notification_messages_user_id_users | `user_id` | `id` |
| [`notification.provider_configurations`](../../Tables/notification/provider_configurations.md) | fk_notification_provider_configurations_created_by_users | `created_by` | `id` |
| [`notification.provider_configurations`](../../Tables/notification/provider_configurations.md) | fk_notification_provider_configurations_deleted_by_users | `deleted_by` | `id` |
| [`notification.provider_configurations`](../../Tables/notification/provider_configurations.md) | fk_notification_provider_configurations_updated_by_users | `updated_by` | `id` |
| [`notification.provider_webhooks`](../../Tables/notification/provider_webhooks.md) | fk_notification_provider_webhooks_created_by_users | `created_by` | `id` |
| [`notification.provider_webhooks`](../../Tables/notification/provider_webhooks.md) | fk_notification_provider_webhooks_updated_by_users | `updated_by` | `id` |
| [`notification.suppressions`](../../Tables/notification/suppressions.md) | fk_notification_suppressions_created_by_users | `created_by` | `id` |
| [`notification.suppressions`](../../Tables/notification/suppressions.md) | fk_notification_suppressions_deleted_by_users | `deleted_by` | `id` |
| [`notification.suppressions`](../../Tables/notification/suppressions.md) | fk_notification_suppressions_updated_by_users | `updated_by` | `id` |
| [`notification.templates`](../../Tables/notification/templates.md) | fk_notification_templates_created_by_users | `created_by` | `id` |
| [`notification.templates`](../../Tables/notification/templates.md) | fk_notification_templates_deleted_by_users | `deleted_by` | `id` |
| [`notification.templates`](../../Tables/notification/templates.md) | fk_notification_templates_updated_by_users | `updated_by` | `id` |
| [`notification.user_channel_preferences`](../../Tables/notification/user_channel_preferences.md) | fk_notification_user_channel_preferences_created_by_users | `created_by` | `id` |
| [`notification.user_channel_preferences`](../../Tables/notification/user_channel_preferences.md) | fk_notification_user_channel_preferences_deleted_by_users | `deleted_by` | `id` |
| [`notification.user_channel_preferences`](../../Tables/notification/user_channel_preferences.md) | fk_notification_user_channel_preferences_updated_by_users | `updated_by` | `id` |
| [`notification.user_channel_preferences`](../../Tables/notification/user_channel_preferences.md) | fk_notification_user_channel_preferences_user_id_users | `user_id` | `id` |
| [`organization.bank_accounts`](../../Tables/organization/bank_accounts.md) | fk_organization_bank_accounts_created_by_users | `created_by` | `id` |
| [`organization.bank_accounts`](../../Tables/organization/bank_accounts.md) | fk_organization_bank_accounts_deleted_by_users | `deleted_by` | `id` |
| [`organization.bank_accounts`](../../Tables/organization/bank_accounts.md) | fk_organization_bank_accounts_updated_by_users | `updated_by` | `id` |
| [`organization.departments`](../../Tables/organization/departments.md) | fk_organization_departments_created_by_users | `created_by` | `id` |
| [`organization.departments`](../../Tables/organization/departments.md) | fk_organization_departments_deleted_by_users | `deleted_by` | `id` |
| [`organization.departments`](../../Tables/organization/departments.md) | fk_organization_departments_updated_by_users | `updated_by` | `id` |
| [`organization.licenses`](../../Tables/organization/licenses.md) | fk_organization_licenses_created_by_users | `created_by` | `id` |
| [`organization.licenses`](../../Tables/organization/licenses.md) | fk_organization_licenses_deleted_by_users | `deleted_by` | `id` |
| [`organization.licenses`](../../Tables/organization/licenses.md) | fk_organization_licenses_updated_by_users | `updated_by` | `id` |
| [`organization.locations`](../../Tables/organization/locations.md) | fk_organization_locations_created_by_users | `created_by` | `id` |
| [`organization.locations`](../../Tables/organization/locations.md) | fk_organization_locations_deleted_by_users | `deleted_by` | `id` |
| [`organization.locations`](../../Tables/organization/locations.md) | fk_organization_locations_updated_by_users | `updated_by` | `id` |
| [`organization.memberships`](../../Tables/organization/memberships.md) | fk_organization_memberships_created_by_users | `created_by` | `id` |
| [`organization.memberships`](../../Tables/organization/memberships.md) | fk_organization_memberships_manager_user_id_users | `manager_user_id` | `id` |
| [`organization.memberships`](../../Tables/organization/memberships.md) | fk_organization_memberships_updated_by_users | `updated_by` | `id` |
| [`organization.memberships`](../../Tables/organization/memberships.md) | fk_organization_memberships_user_id_users | `user_id` | `id` |
| [`organization.organizations`](../../Tables/organization/organizations.md) | fk_organization_organizations_created_by_users | `created_by` | `id` |
| [`organization.organizations`](../../Tables/organization/organizations.md) | fk_organization_organizations_deleted_by_users | `deleted_by` | `id` |
| [`organization.organizations`](../../Tables/organization/organizations.md) | fk_organization_organizations_updated_by_users | `updated_by` | `id` |
| [`payment.chargebacks`](../../Tables/payment/chargebacks.md) | fk_payment_chargebacks_created_by_users | `created_by` | `id` |
| [`payment.chargebacks`](../../Tables/payment/chargebacks.md) | fk_payment_chargebacks_updated_by_users | `updated_by` | `id` |
| [`payment.cod_collections`](../../Tables/payment/cod_collections.md) | fk_payment_cod_collections_collected_by_user_id_users | `collected_by_user_id` | `id` |
| [`payment.cod_collections`](../../Tables/payment/cod_collections.md) | fk_payment_cod_collections_created_by_users | `created_by` | `id` |
| [`payment.cod_collections`](../../Tables/payment/cod_collections.md) | fk_payment_cod_collections_updated_by_users | `updated_by` | `id` |
| [`payment.customer_payment_methods`](../../Tables/payment/customer_payment_methods.md) | fk_payment_customer_payment_methods_created_by_users | `created_by` | `id` |
| [`payment.customer_payment_methods`](../../Tables/payment/customer_payment_methods.md) | fk_payment_customer_payment_methods_deleted_by_users | `deleted_by` | `id` |
| [`payment.customer_payment_methods`](../../Tables/payment/customer_payment_methods.md) | fk_payment_customer_payment_methods_updated_by_users | `updated_by` | `id` |
| [`payment.customer_payment_methods`](../../Tables/payment/customer_payment_methods.md) | fk_payment_customer_payment_methods_user_id_users | `user_id` | `id` |
| [`payment.payment_attempts`](../../Tables/payment/payment_attempts.md) | fk_payment_payment_attempts_created_by_users | `created_by` | `id` |
| [`payment.payment_attempts`](../../Tables/payment/payment_attempts.md) | fk_payment_payment_attempts_updated_by_users | `updated_by` | `id` |
| [`payment.payment_intents`](../../Tables/payment/payment_intents.md) | fk_payment_payment_intents_created_by_users | `created_by` | `id` |
| [`payment.payment_intents`](../../Tables/payment/payment_intents.md) | fk_payment_payment_intents_updated_by_users | `updated_by` | `id` |
| [`payment.payment_webhooks`](../../Tables/payment/payment_webhooks.md) | fk_payment_payment_webhooks_created_by_users | `created_by` | `id` |
| [`payment.payment_webhooks`](../../Tables/payment/payment_webhooks.md) | fk_payment_payment_webhooks_updated_by_users | `updated_by` | `id` |
| [`payment.provider_accounts`](../../Tables/payment/provider_accounts.md) | fk_payment_provider_accounts_created_by_users | `created_by` | `id` |
| [`payment.provider_accounts`](../../Tables/payment/provider_accounts.md) | fk_payment_provider_accounts_deleted_by_users | `deleted_by` | `id` |
| [`payment.provider_accounts`](../../Tables/payment/provider_accounts.md) | fk_payment_provider_accounts_updated_by_users | `updated_by` | `id` |
| [`payment.reconciliation_items`](../../Tables/payment/reconciliation_items.md) | fk_payment_reconciliation_items_created_by_users | `created_by` | `id` |
| [`payment.reconciliation_items`](../../Tables/payment/reconciliation_items.md) | fk_payment_reconciliation_items_updated_by_users | `updated_by` | `id` |
| [`payment.reconciliation_runs`](../../Tables/payment/reconciliation_runs.md) | fk_payment_reconciliation_runs_created_by_users | `created_by` | `id` |
| [`payment.reconciliation_runs`](../../Tables/payment/reconciliation_runs.md) | fk_payment_reconciliation_runs_updated_by_users | `updated_by` | `id` |
| [`payment.refund_reason_codes`](../../Tables/payment/refund_reason_codes.md) | fk_payment_refund_reason_codes_created_by_user_id_users | `created_by_user_id` | `id` |
| [`payment.refund_reason_codes`](../../Tables/payment/refund_reason_codes.md) | fk_payment_refund_reason_codes_updated_by_user_id_users | `updated_by_user_id` | `id` |
| [`payment.refunds`](../../Tables/payment/refunds.md) | fk_payment_refunds_created_by_users | `created_by` | `id` |
| [`payment.refunds`](../../Tables/payment/refunds.md) | fk_payment_refunds_updated_by_users | `updated_by` | `id` |
| [`platform.application_settings`](../../Tables/platform/application_settings.md) | fk_platform_application_settings_created_by_users | `created_by` | `id` |
| [`platform.application_settings`](../../Tables/platform/application_settings.md) | fk_platform_application_settings_deleted_by_users | `deleted_by` | `id` |
| [`platform.application_settings`](../../Tables/platform/application_settings.md) | fk_platform_application_settings_updated_by_users | `updated_by` | `id` |
| [`platform.audit_logs`](../../Tables/platform/audit_logs.md) | fk_platform_audit_logs_actor_user_id_users | `actor_user_id` | `id` |
| [`platform.cms_page_versions`](../../Tables/platform/cms_page_versions.md) | fk_platform_cms_page_versions_approved_by_user_id_users | `approved_by_user_id` | `id` |
| [`platform.cms_page_versions`](../../Tables/platform/cms_page_versions.md) | fk_platform_cms_page_versions_created_by_user_id_users | `created_by_user_id` | `id` |
| [`platform.cms_pages`](../../Tables/platform/cms_pages.md) | fk_platform_cms_pages_created_by_user_id_users | `created_by_user_id` | `id` |
| [`platform.cms_pages`](../../Tables/platform/cms_pages.md) | fk_platform_cms_pages_created_by_users | `created_by` | `id` |
| [`platform.cms_pages`](../../Tables/platform/cms_pages.md) | fk_platform_cms_pages_deleted_by_users | `deleted_by` | `id` |
| [`platform.cms_pages`](../../Tables/platform/cms_pages.md) | fk_platform_cms_pages_updated_by_user_id_users | `updated_by_user_id` | `id` |
| [`platform.cms_pages`](../../Tables/platform/cms_pages.md) | fk_platform_cms_pages_updated_by_users | `updated_by` | `id` |
| [`platform.data_retention_policies`](../../Tables/platform/data_retention_policies.md) | fk_platform_data_retention_policies_created_by_users | `created_by` | `id` |
| [`platform.data_retention_policies`](../../Tables/platform/data_retention_policies.md) | fk_platform_data_retention_policies_deleted_by_users | `deleted_by` | `id` |
| [`platform.data_retention_policies`](../../Tables/platform/data_retention_policies.md) | fk_platform_data_retention_policies_updated_by_users | `updated_by` | `id` |
| [`platform.feature_flags`](../../Tables/platform/feature_flags.md) | fk_platform_feature_flags_created_by_users | `created_by` | `id` |
| [`platform.feature_flags`](../../Tables/platform/feature_flags.md) | fk_platform_feature_flags_deleted_by_users | `deleted_by` | `id` |
| [`platform.feature_flags`](../../Tables/platform/feature_flags.md) | fk_platform_feature_flags_updated_by_users | `updated_by` | `id` |
| [`platform.file_access_events`](../../Tables/platform/file_access_events.md) | fk_platform_file_access_events_actor_user_id_users | `actor_user_id` | `id` |
| [`platform.file_access_grants`](../../Tables/platform/file_access_grants.md) | fk_platform_file_access_grants_created_by_users | `created_by` | `id` |
| [`platform.file_access_grants`](../../Tables/platform/file_access_grants.md) | fk_platform_file_access_grants_updated_by_users | `updated_by` | `id` |
| [`platform.file_objects`](../../Tables/platform/file_objects.md) | fk_platform_file_objects_created_by_users | `created_by` | `id` |
| [`platform.file_objects`](../../Tables/platform/file_objects.md) | fk_platform_file_objects_deleted_by_users | `deleted_by` | `id` |
| [`platform.file_objects`](../../Tables/platform/file_objects.md) | fk_platform_file_objects_updated_by_users | `updated_by` | `id` |
| [`platform.file_objects`](../../Tables/platform/file_objects.md) | fk_platform_file_objects_uploaded_by_user_id_users | `uploaded_by_user_id` | `id` |
| [`platform.file_upload_sessions`](../../Tables/platform/file_upload_sessions.md) | fk_platform_file_upload_sessions_created_by_users | `created_by` | `id` |
| [`platform.file_upload_sessions`](../../Tables/platform/file_upload_sessions.md) | fk_platform_file_upload_sessions_requested_by_user_id_users | `requested_by_user_id` | `id` |
| [`platform.file_upload_sessions`](../../Tables/platform/file_upload_sessions.md) | fk_platform_file_upload_sessions_updated_by_users | `updated_by` | `id` |
| [`platform.file_variants`](../../Tables/platform/file_variants.md) | fk_platform_file_variants_created_by_users | `created_by` | `id` |
| [`platform.file_variants`](../../Tables/platform/file_variants.md) | fk_platform_file_variants_deleted_by_users | `deleted_by` | `id` |
| [`platform.file_variants`](../../Tables/platform/file_variants.md) | fk_platform_file_variants_updated_by_users | `updated_by` | `id` |
| [`platform.idempotency_keys`](../../Tables/platform/idempotency_keys.md) | fk_platform_idempotency_keys_created_by_users | `created_by` | `id` |
| [`platform.idempotency_keys`](../../Tables/platform/idempotency_keys.md) | fk_platform_idempotency_keys_updated_by_users | `updated_by` | `id` |
| [`platform.inbox_messages`](../../Tables/platform/inbox_messages.md) | fk_platform_inbox_messages_created_by_users | `created_by` | `id` |
| [`platform.inbox_messages`](../../Tables/platform/inbox_messages.md) | fk_platform_inbox_messages_updated_by_users | `updated_by` | `id` |
| [`platform.outbox_events`](../../Tables/platform/outbox_events.md) | fk_platform_outbox_events_created_by_users | `created_by` | `id` |
| [`platform.outbox_events`](../../Tables/platform/outbox_events.md) | fk_platform_outbox_events_updated_by_users | `updated_by` | `id` |
| [`platform.report_runs`](../../Tables/platform/report_runs.md) | fk_platform_report_runs_requested_by_user_id_users | `requested_by_user_id` | `id` |
| [`platform.scheduled_jobs`](../../Tables/platform/scheduled_jobs.md) | fk_platform_scheduled_jobs_created_by_users | `created_by` | `id` |
| [`platform.scheduled_jobs`](../../Tables/platform/scheduled_jobs.md) | fk_platform_scheduled_jobs_updated_by_users | `updated_by` | `id` |
| [`platform.webhook_deliveries`](../../Tables/platform/webhook_deliveries.md) | fk_platform_webhook_deliveries_created_by_users | `created_by` | `id` |
| [`platform.webhook_deliveries`](../../Tables/platform/webhook_deliveries.md) | fk_platform_webhook_deliveries_updated_by_users | `updated_by` | `id` |
| [`platform.webhook_endpoints`](../../Tables/platform/webhook_endpoints.md) | fk_platform_webhook_endpoints_created_by_users | `created_by` | `id` |
| [`platform.webhook_endpoints`](../../Tables/platform/webhook_endpoints.md) | fk_platform_webhook_endpoints_deleted_by_users | `deleted_by` | `id` |
| [`platform.webhook_endpoints`](../../Tables/platform/webhook_endpoints.md) | fk_platform_webhook_endpoints_updated_by_users | `updated_by` | `id` |
| [`pricing.coupon_codes`](../../Tables/pricing/coupon_codes.md) | fk_pricing_coupon_codes_assigned_user_id_users | `assigned_user_id` | `id` |
| [`pricing.coupon_codes`](../../Tables/pricing/coupon_codes.md) | fk_pricing_coupon_codes_created_by_users | `created_by` | `id` |
| [`pricing.coupon_codes`](../../Tables/pricing/coupon_codes.md) | fk_pricing_coupon_codes_deleted_by_users | `deleted_by` | `id` |
| [`pricing.coupon_codes`](../../Tables/pricing/coupon_codes.md) | fk_pricing_coupon_codes_updated_by_users | `updated_by` | `id` |
| [`pricing.price_books`](../../Tables/pricing/price_books.md) | fk_pricing_price_books_created_by_users | `created_by` | `id` |
| [`pricing.price_books`](../../Tables/pricing/price_books.md) | fk_pricing_price_books_deleted_by_users | `deleted_by` | `id` |
| [`pricing.price_books`](../../Tables/pricing/price_books.md) | fk_pricing_price_books_updated_by_users | `updated_by` | `id` |
| [`pricing.pricing_evaluations`](../../Tables/pricing/pricing_evaluations.md) | fk_pricing_pricing_evaluations_user_id_users | `user_id` | `id` |
| [`pricing.product_prices`](../../Tables/pricing/product_prices.md) | fk_pricing_product_prices_created_by_users | `created_by` | `id` |
| [`pricing.product_prices`](../../Tables/pricing/product_prices.md) | fk_pricing_product_prices_updated_by_users | `updated_by` | `id` |
| [`pricing.promotion_redemptions`](../../Tables/pricing/promotion_redemptions.md) | fk_pricing_promotion_redemptions_user_id_users | `user_id` | `id` |
| [`pricing.promotion_versions`](../../Tables/pricing/promotion_versions.md) | fk_pricing_promotion_versions_created_by_users | `created_by` | `id` |
| [`pricing.promotion_versions`](../../Tables/pricing/promotion_versions.md) | fk_pricing_promotion_versions_updated_by_users | `updated_by` | `id` |
| [`pricing.promotions`](../../Tables/pricing/promotions.md) | fk_pricing_promotions_created_by_users | `created_by` | `id` |
| [`pricing.promotions`](../../Tables/pricing/promotions.md) | fk_pricing_promotions_deleted_by_users | `deleted_by` | `id` |
| [`pricing.promotions`](../../Tables/pricing/promotions.md) | fk_pricing_promotions_updated_by_users | `updated_by` | `id` |
| [`pricing.tax_rules`](../../Tables/pricing/tax_rules.md) | fk_pricing_tax_rules_created_by_users | `created_by` | `id` |
| [`pricing.tax_rules`](../../Tables/pricing/tax_rules.md) | fk_pricing_tax_rules_deleted_by_users | `deleted_by` | `id` |
| [`pricing.tax_rules`](../../Tables/pricing/tax_rules.md) | fk_pricing_tax_rules_updated_by_users | `updated_by` | `id` |
| [`procurement.goods_receipt_items`](../../Tables/procurement/goods_receipt_items.md) | fk_procurement_goods_receipt_items_created_by_users | `created_by` | `id` |
| [`procurement.goods_receipt_items`](../../Tables/procurement/goods_receipt_items.md) | fk_procurement_goods_receipt_items_updated_by_users | `updated_by` | `id` |
| [`procurement.goods_receipt_quality_checks`](../../Tables/procurement/goods_receipt_quality_checks.md) | fk_procurement_goods_receipt_quality_checks_checked_by__6713 | `checked_by_user_id` | `id` |
| [`procurement.goods_receipt_quality_checks`](../../Tables/procurement/goods_receipt_quality_checks.md) | fk_procurement_goods_receipt_quality_checks_created_by_users | `created_by` | `id` |
| [`procurement.goods_receipt_quality_checks`](../../Tables/procurement/goods_receipt_quality_checks.md) | fk_procurement_goods_receipt_quality_checks_updated_by_users | `updated_by` | `id` |
| [`procurement.goods_receipts`](../../Tables/procurement/goods_receipts.md) | fk_procurement_goods_receipts_created_by_users | `created_by` | `id` |
| [`procurement.goods_receipts`](../../Tables/procurement/goods_receipts.md) | fk_procurement_goods_receipts_received_by_user_id_users | `received_by_user_id` | `id` |
| [`procurement.goods_receipts`](../../Tables/procurement/goods_receipts.md) | fk_procurement_goods_receipts_updated_by_users | `updated_by` | `id` |
| [`procurement.purchase_order_items`](../../Tables/procurement/purchase_order_items.md) | fk_procurement_purchase_order_items_created_by_users | `created_by` | `id` |
| [`procurement.purchase_order_items`](../../Tables/procurement/purchase_order_items.md) | fk_procurement_purchase_order_items_updated_by_users | `updated_by` | `id` |
| [`procurement.purchase_orders`](../../Tables/procurement/purchase_orders.md) | fk_procurement_purchase_orders_approved_by_user_id_users | `approved_by_user_id` | `id` |
| [`procurement.purchase_orders`](../../Tables/procurement/purchase_orders.md) | fk_procurement_purchase_orders_created_by_users | `created_by` | `id` |
| [`procurement.purchase_orders`](../../Tables/procurement/purchase_orders.md) | fk_procurement_purchase_orders_updated_by_users | `updated_by` | `id` |
| [`procurement.purchase_requisition_items`](../../Tables/procurement/purchase_requisition_items.md) | fk_procurement_purchase_requisition_items_created_by_users | `created_by` | `id` |
| [`procurement.purchase_requisition_items`](../../Tables/procurement/purchase_requisition_items.md) | fk_procurement_purchase_requisition_items_updated_by_users | `updated_by` | `id` |
| [`procurement.purchase_requisitions`](../../Tables/procurement/purchase_requisitions.md) | fk_procurement_purchase_requisitions_created_by_users | `created_by` | `id` |
| [`procurement.purchase_requisitions`](../../Tables/procurement/purchase_requisitions.md) | fk_procurement_purchase_requisitions_requested_by_user_id_users | `requested_by_user_id` | `id` |
| [`procurement.purchase_requisitions`](../../Tables/procurement/purchase_requisitions.md) | fk_procurement_purchase_requisitions_updated_by_users | `updated_by` | `id` |
| [`procurement.purchase_return_items`](../../Tables/procurement/purchase_return_items.md) | fk_procurement_purchase_return_items_created_by_users | `created_by` | `id` |
| [`procurement.purchase_return_items`](../../Tables/procurement/purchase_return_items.md) | fk_procurement_purchase_return_items_updated_by_users | `updated_by` | `id` |
| [`procurement.purchase_returns`](../../Tables/procurement/purchase_returns.md) | fk_procurement_purchase_returns_created_by_users | `created_by` | `id` |
| [`procurement.purchase_returns`](../../Tables/procurement/purchase_returns.md) | fk_procurement_purchase_returns_updated_by_users | `updated_by` | `id` |
| [`procurement.supplier_invoices`](../../Tables/procurement/supplier_invoices.md) | fk_procurement_supplier_invoices_created_by_users | `created_by` | `id` |
| [`procurement.supplier_invoices`](../../Tables/procurement/supplier_invoices.md) | fk_procurement_supplier_invoices_updated_by_users | `updated_by` | `id` |
| [`procurement.supplier_licenses`](../../Tables/procurement/supplier_licenses.md) | fk_procurement_supplier_licenses_created_by_users | `created_by` | `id` |
| [`procurement.supplier_licenses`](../../Tables/procurement/supplier_licenses.md) | fk_procurement_supplier_licenses_deleted_by_users | `deleted_by` | `id` |
| [`procurement.supplier_licenses`](../../Tables/procurement/supplier_licenses.md) | fk_procurement_supplier_licenses_updated_by_users | `updated_by` | `id` |
| [`procurement.supplier_products`](../../Tables/procurement/supplier_products.md) | fk_procurement_supplier_products_created_by_users | `created_by` | `id` |
| [`procurement.supplier_products`](../../Tables/procurement/supplier_products.md) | fk_procurement_supplier_products_deleted_by_users | `deleted_by` | `id` |
| [`procurement.supplier_products`](../../Tables/procurement/supplier_products.md) | fk_procurement_supplier_products_updated_by_users | `updated_by` | `id` |
| [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | fk_procurement_suppliers_created_by_users | `created_by` | `id` |
| [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | fk_procurement_suppliers_deleted_by_users | `deleted_by` | `id` |
| [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | fk_procurement_suppliers_updated_by_users | `updated_by` | `id` |
| [`risk.assessments`](../../Tables/risk/assessments.md) | fk_risk_assessments_user_id_users | `user_id` | `id` |
| [`risk.blocklists`](../../Tables/risk/blocklists.md) | fk_risk_blocklists_created_by_users | `created_by` | `id` |
| [`risk.blocklists`](../../Tables/risk/blocklists.md) | fk_risk_blocklists_deleted_by_users | `deleted_by` | `id` |
| [`risk.blocklists`](../../Tables/risk/blocklists.md) | fk_risk_blocklists_updated_by_users | `updated_by` | `id` |
| [`risk.cases`](../../Tables/risk/cases.md) | fk_risk_cases_assigned_to_user_id_users | `assigned_to_user_id` | `id` |
| [`risk.cases`](../../Tables/risk/cases.md) | fk_risk_cases_created_by_users | `created_by` | `id` |
| [`risk.cases`](../../Tables/risk/cases.md) | fk_risk_cases_updated_by_users | `updated_by` | `id` |
| [`risk.rules`](../../Tables/risk/rules.md) | fk_risk_rules_created_by_users | `created_by` | `id` |
| [`risk.rules`](../../Tables/risk/rules.md) | fk_risk_rules_deleted_by_users | `deleted_by` | `id` |
| [`risk.rules`](../../Tables/risk/rules.md) | fk_risk_rules_updated_by_users | `updated_by` | `id` |
| [`search.documents`](../../Tables/search/documents.md) | fk_search_documents_created_by_users | `created_by` | `id` |
| [`search.documents`](../../Tables/search/documents.md) | fk_search_documents_updated_by_users | `updated_by` | `id` |
| [`search.indexing_jobs`](../../Tables/search/indexing_jobs.md) | fk_search_indexing_jobs_created_by_users | `created_by` | `id` |
| [`search.indexing_jobs`](../../Tables/search/indexing_jobs.md) | fk_search_indexing_jobs_updated_by_users | `updated_by` | `id` |
| [`search.query_events`](../../Tables/search/query_events.md) | fk_search_query_events_user_id_users | `user_id` | `id` |
| [`search.redirects`](../../Tables/search/redirects.md) | fk_search_redirects_created_by_users | `created_by` | `id` |
| [`search.redirects`](../../Tables/search/redirects.md) | fk_search_redirects_deleted_by_users | `deleted_by` | `id` |
| [`search.redirects`](../../Tables/search/redirects.md) | fk_search_redirects_updated_by_users | `updated_by` | `id` |
| [`search.synonyms`](../../Tables/search/synonyms.md) | fk_search_synonyms_created_by_users | `created_by` | `id` |
| [`search.synonyms`](../../Tables/search/synonyms.md) | fk_search_synonyms_deleted_by_users | `deleted_by` | `id` |
| [`search.synonyms`](../../Tables/search/synonyms.md) | fk_search_synonyms_updated_by_users | `updated_by` | `id` |
| [`support.sla_policies`](../../Tables/support/sla_policies.md) | fk_support_sla_policies_created_by_users | `created_by` | `id` |
| [`support.sla_policies`](../../Tables/support/sla_policies.md) | fk_support_sla_policies_deleted_by_users | `deleted_by` | `id` |
| [`support.sla_policies`](../../Tables/support/sla_policies.md) | fk_support_sla_policies_updated_by_users | `updated_by` | `id` |
| [`support.ticket_actions`](../../Tables/support/ticket_actions.md) | fk_support_ticket_actions_approved_by_user_id_users | `approved_by_user_id` | `id` |
| [`support.ticket_actions`](../../Tables/support/ticket_actions.md) | fk_support_ticket_actions_created_by_users | `created_by` | `id` |
| [`support.ticket_actions`](../../Tables/support/ticket_actions.md) | fk_support_ticket_actions_requested_by_user_id_users | `requested_by_user_id` | `id` |
| [`support.ticket_actions`](../../Tables/support/ticket_actions.md) | fk_support_ticket_actions_updated_by_users | `updated_by` | `id` |
| [`support.ticket_attachments`](../../Tables/support/ticket_attachments.md) | fk_support_ticket_attachments_created_by_users | `created_by` | `id` |
| [`support.ticket_attachments`](../../Tables/support/ticket_attachments.md) | fk_support_ticket_attachments_updated_by_users | `updated_by` | `id` |
| [`support.ticket_messages`](../../Tables/support/ticket_messages.md) | fk_support_ticket_messages_author_user_id_users | `author_user_id` | `id` |
| [`support.ticket_messages`](../../Tables/support/ticket_messages.md) | fk_support_ticket_messages_created_by_users | `created_by` | `id` |
| [`support.ticket_messages`](../../Tables/support/ticket_messages.md) | fk_support_ticket_messages_updated_by_users | `updated_by` | `id` |
| [`support.ticket_status_history`](../../Tables/support/ticket_status_history.md) | fk_support_ticket_status_history_actor_user_id_users | `actor_user_id` | `id` |
| [`support.ticket_tags`](../../Tables/support/ticket_tags.md) | fk_support_ticket_tags_created_by_users | `created_by` | `id` |
| [`support.ticket_tags`](../../Tables/support/ticket_tags.md) | fk_support_ticket_tags_deleted_by_users | `deleted_by` | `id` |
| [`support.ticket_tags`](../../Tables/support/ticket_tags.md) | fk_support_ticket_tags_updated_by_users | `updated_by` | `id` |
| [`support.tickets`](../../Tables/support/tickets.md) | fk_support_tickets_assigned_to_user_id_users | `assigned_to_user_id` | `id` |
| [`support.tickets`](../../Tables/support/tickets.md) | fk_support_tickets_created_by_users | `created_by` | `id` |
| [`support.tickets`](../../Tables/support/tickets.md) | fk_support_tickets_updated_by_users | `updated_by` | `id` |
| [`support.tickets`](../../Tables/support/tickets.md) | fk_support_tickets_user_id_users | `user_id` | `id` |
| [`warehouse.aisles`](../../Tables/warehouse/aisles.md) | fk_warehouse_aisles_created_by_users | `created_by` | `id` |
| [`warehouse.aisles`](../../Tables/warehouse/aisles.md) | fk_warehouse_aisles_deleted_by_users | `deleted_by` | `id` |
| [`warehouse.aisles`](../../Tables/warehouse/aisles.md) | fk_warehouse_aisles_updated_by_users | `updated_by` | `id` |
| [`warehouse.bins`](../../Tables/warehouse/bins.md) | fk_warehouse_bins_created_by_users | `created_by` | `id` |
| [`warehouse.bins`](../../Tables/warehouse/bins.md) | fk_warehouse_bins_deleted_by_users | `deleted_by` | `id` |
| [`warehouse.bins`](../../Tables/warehouse/bins.md) | fk_warehouse_bins_updated_by_users | `updated_by` | `id` |
| [`warehouse.cycle_count_items`](../../Tables/warehouse/cycle_count_items.md) | fk_warehouse_cycle_count_items_created_by_users | `created_by` | `id` |
| [`warehouse.cycle_count_items`](../../Tables/warehouse/cycle_count_items.md) | fk_warehouse_cycle_count_items_updated_by_users | `updated_by` | `id` |
| [`warehouse.cycle_counts`](../../Tables/warehouse/cycle_counts.md) | fk_warehouse_cycle_counts_assigned_to_user_id_users | `assigned_to_user_id` | `id` |
| [`warehouse.cycle_counts`](../../Tables/warehouse/cycle_counts.md) | fk_warehouse_cycle_counts_created_by_users | `created_by` | `id` |
| [`warehouse.cycle_counts`](../../Tables/warehouse/cycle_counts.md) | fk_warehouse_cycle_counts_updated_by_users | `updated_by` | `id` |
| [`warehouse.inventory_adjustment_items`](../../Tables/warehouse/inventory_adjustment_items.md) | fk_warehouse_inventory_adjustment_items_created_by_users | `created_by` | `id` |
| [`warehouse.inventory_adjustment_items`](../../Tables/warehouse/inventory_adjustment_items.md) | fk_warehouse_inventory_adjustment_items_updated_by_users | `updated_by` | `id` |
| [`warehouse.inventory_adjustments`](../../Tables/warehouse/inventory_adjustments.md) | fk_warehouse_inventory_adjustments_approved_by_user_id_users | `approved_by_user_id` | `id` |
| [`warehouse.inventory_adjustments`](../../Tables/warehouse/inventory_adjustments.md) | fk_warehouse_inventory_adjustments_created_by_users | `created_by` | `id` |
| [`warehouse.inventory_adjustments`](../../Tables/warehouse/inventory_adjustments.md) | fk_warehouse_inventory_adjustments_requested_by_user_id_users | `requested_by_user_id` | `id` |
| [`warehouse.inventory_adjustments`](../../Tables/warehouse/inventory_adjustments.md) | fk_warehouse_inventory_adjustments_updated_by_users | `updated_by` | `id` |
| [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | fk_warehouse_inventory_lots_created_by_users | `created_by` | `id` |
| [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | fk_warehouse_inventory_lots_updated_by_users | `updated_by` | `id` |
| [`warehouse.racks`](../../Tables/warehouse/racks.md) | fk_warehouse_racks_created_by_users | `created_by` | `id` |
| [`warehouse.racks`](../../Tables/warehouse/racks.md) | fk_warehouse_racks_deleted_by_users | `deleted_by` | `id` |
| [`warehouse.racks`](../../Tables/warehouse/racks.md) | fk_warehouse_racks_updated_by_users | `updated_by` | `id` |
| [`warehouse.replenishment_rules`](../../Tables/warehouse/replenishment_rules.md) | fk_warehouse_replenishment_rules_created_by_users | `created_by` | `id` |
| [`warehouse.replenishment_rules`](../../Tables/warehouse/replenishment_rules.md) | fk_warehouse_replenishment_rules_deleted_by_users | `deleted_by` | `id` |
| [`warehouse.replenishment_rules`](../../Tables/warehouse/replenishment_rules.md) | fk_warehouse_replenishment_rules_updated_by_users | `updated_by` | `id` |
| [`warehouse.stock_balances`](../../Tables/warehouse/stock_balances.md) | fk_warehouse_stock_balances_created_by_users | `created_by` | `id` |
| [`warehouse.stock_balances`](../../Tables/warehouse/stock_balances.md) | fk_warehouse_stock_balances_inventory_observed_by_user_id_users | `inventory_observed_by_user_id` | `id` |
| [`warehouse.stock_balances`](../../Tables/warehouse/stock_balances.md) | fk_warehouse_stock_balances_updated_by_users | `updated_by` | `id` |
| [`warehouse.stock_holds`](../../Tables/warehouse/stock_holds.md) | fk_warehouse_stock_holds_created_by_users | `created_by` | `id` |
| [`warehouse.stock_holds`](../../Tables/warehouse/stock_holds.md) | fk_warehouse_stock_holds_released_by_user_id_users | `released_by_user_id` | `id` |
| [`warehouse.stock_holds`](../../Tables/warehouse/stock_holds.md) | fk_warehouse_stock_holds_updated_by_users | `updated_by` | `id` |
| [`warehouse.stock_ledger`](../../Tables/warehouse/stock_ledger.md) | fk_warehouse_stock_ledger_actor_user_id_users | `actor_user_id` | `id` |
| [`warehouse.stock_movement_reason_codes`](../../Tables/warehouse/stock_movement_reason_codes.md) | fk_warehouse_stock_movement_reason_codes_created_by_use_4ca9 | `created_by_user_id` | `id` |
| [`warehouse.stock_movement_reason_codes`](../../Tables/warehouse/stock_movement_reason_codes.md) | fk_warehouse_stock_movement_reason_codes_updated_by_use_6a3d | `updated_by_user_id` | `id` |
| [`warehouse.stock_reservations`](../../Tables/warehouse/stock_reservations.md) | fk_warehouse_stock_reservations_created_by_users | `created_by` | `id` |
| [`warehouse.stock_reservations`](../../Tables/warehouse/stock_reservations.md) | fk_warehouse_stock_reservations_updated_by_users | `updated_by` | `id` |
| [`warehouse.stock_transfer_items`](../../Tables/warehouse/stock_transfer_items.md) | fk_warehouse_stock_transfer_items_created_by_users | `created_by` | `id` |
| [`warehouse.stock_transfer_items`](../../Tables/warehouse/stock_transfer_items.md) | fk_warehouse_stock_transfer_items_updated_by_users | `updated_by` | `id` |
| [`warehouse.stock_transfers`](../../Tables/warehouse/stock_transfers.md) | fk_warehouse_stock_transfers_approved_by_user_id_users | `approved_by_user_id` | `id` |
| [`warehouse.stock_transfers`](../../Tables/warehouse/stock_transfers.md) | fk_warehouse_stock_transfers_created_by_users | `created_by` | `id` |
| [`warehouse.stock_transfers`](../../Tables/warehouse/stock_transfers.md) | fk_warehouse_stock_transfers_requested_by_user_id_users | `requested_by_user_id` | `id` |
| [`warehouse.stock_transfers`](../../Tables/warehouse/stock_transfers.md) | fk_warehouse_stock_transfers_updated_by_users | `updated_by` | `id` |
| [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | fk_warehouse_warehouses_created_by_users | `created_by` | `id` |
| [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | fk_warehouse_warehouses_deleted_by_users | `deleted_by` | `id` |
| [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | fk_warehouse_warehouses_updated_by_users | `updated_by` | `id` |
| [`warehouse.zones`](../../Tables/warehouse/zones.md) | fk_warehouse_zones_created_by_users | `created_by` | `id` |
| [`warehouse.zones`](../../Tables/warehouse/zones.md) | fk_warehouse_zones_deleted_by_users | `deleted_by` | `id` |
| [`warehouse.zones`](../../Tables/warehouse/zones.md) | fk_warehouse_zones_updated_by_users | `updated_by` | `id` |

## `identity.users` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_identity_users_created_by_users` |
| `updated_by` | `identity.users` | `fk_identity_users_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_users_contact_required` | CHECK | `CHECK (email_normalized IS NOT NULL OR phone_number IS NOT NULL)` |
| `ck_identity_users_failed_login_nonnegative` | CHECK | `CHECK (failed_login_count >= 0)` |
| `ck_identity_users_phone_pair_complete` | CHECK | `CHECK (phone_country_code IS NULL AND phone_number IS NULL OR phone_country_code IS NOT NULL AND phone_number IS NOT NULL)` |
| `ck_identity_users_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_identity_users_userstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['pending'::text, 'active'::text, 'locked'::text, 'suspended'::text, 'closed'::text]))` |
| `fk_identity_users_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_users_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_identity_users` | PRIMARY KEY | `PRIMARY KEY (id)` |
| `users_email_normalized` | UNIQUE | `UNIQUE (email_normalized)` |
| `users_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `users_failed_login_count_not_null` | NOT NULL | `NOT NULL failed_login_count` |
| `users_id_not_null` | NOT NULL | `NOT NULL id` |
| `users_preferred_locale_not_null` | NOT NULL | `NOT NULL preferred_locale` |
| `users_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `users_status_not_null` | NOT NULL | `NOT NULL status` |
| `users_timezone_not_null` | NOT NULL | `NOT NULL timezone` |
| `users_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_identity_users_last_login_at` | btree | `(last_login_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_users_last_login_at ON identity.users USING btree (last_login_at)` |
| `ix_identity_users_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_users_status ON identity.users USING btree (status)` |
| `pk_identity_users` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_identity_users ON identity.users USING btree (id)` |
| `uq_identity_users_phone_present` | btree | `(phone_country_code, phone_number)` | phone_country_code IS NOT NULL AND phone_number IS NOT NULL | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_identity_users_phone_present ON identity.users USING btree (phone_country_code, phone_number) WHERE phone_country_code IS NOT NULL AND phone_number IS NOT NULL` |
| `users_email_normalized` | btree | `(email_normalized)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX users_email_normalized ON identity.users USING btree (email_normalized)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.users FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `identity.users` |
| Category | Master / Reference — Stable identity account master; credentials are protected attributes |
| Proposed owner / maintenance role | Authentication_Access / Identity administrator / verified onboarding |
| Scope | User/patient-specific protected party master. |
| Referencing tables | `appointment.appointment_slots`, `appointment.appointment_status_history`, `appointment.appointments`, `appointment.availability_exceptions`, `appointment.availability_rules`, `appointment.practitioner_services`, `appointment.service_types`, `appointment.teleconsultation_sessions`, `catalog.brands`, `catalog.categories`, `catalog.commerce_classes`, `catalog.dosage_forms`, `catalog.manufacturers`, `catalog.product_attributes`, `catalog.product_classification_history`, `catalog.product_content`, `catalog.product_identifiers`, `catalog.product_media`, `catalog.product_regulatory`, `catalog.product_relationships`, `catalog.product_salts`, `catalog.product_variants`, `catalog.products`, `catalog.salts`, `catalog.substitution_group_products`, `catalog.substitution_groups`, `catalog.units_of_measure`, `clinical.care_episodes`, `clinical.consultations`, `clinical.diagnoses`, `clinical.observations`, `clinical.order_reviews`, `clinical.patient_allergies`, `clinical.patient_conditions`, `clinical.patient_medications`, `clinical.patient_profiles`, `clinical.practitioner_organizations`, `clinical.practitioner_profiles`, `clinical.prescription_access_logs`, `clinical.prescription_documents`, `clinical.prescription_items`, `clinical.prescriptions`, `clinical.review_reason_codes`, `commerce.cancellation_items`, `commerce.cancellation_reason_codes`, `commerce.cancellations`, `commerce.cart_items`, `commerce.carts`, `commerce.checkouts`, `commerce.order_allocations`, `commerce.order_charges`, `commerce.order_discounts`, `commerce.order_groups`, `commerce.order_items`, `commerce.order_revisions`, `commerce.order_status_history`, `commerce.orders`, `commerce.return_items`, `commerce.return_reason_codes`, `commerce.returns`, `compliance.adverse_event_reports`, `compliance.legal_holds`, `compliance.privacy_requests`, `compliance.product_recalls`, `compliance.recall_lots`, `compliance.regulatory_authorities`, `compliance.regulatory_registrations`, `customer.addresses`, `customer.consent_events`, `customer.consents`, `customer.family_members`, `customer.preferences`, `customer.profiles`, `customer.wishlist_items`, `customer.wishlists`, `diagnostics.diagnostic_order_items`, `diagnostics.diagnostic_orders`, `diagnostics.diagnostic_reports`, `diagnostics.diagnostic_result_values`, `diagnostics.lab_locations`, `diagnostics.lab_offerings`, `diagnostics.lab_providers`, `diagnostics.sample_collections`, `diagnostics.sample_events`, `diagnostics.samples`, `diagnostics.test_definitions`, `diagnostics.test_package_items`, `diagnostics.test_packages`, `finance.accounts`, `finance.credit_notes`, `finance.invoice_items`, `finance.invoices`, `finance.journal_entries`, `finance.settlement_runs`, `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`, `fulfillment.fulfillment_orders`, `fulfillment.pack_tasks`, `fulfillment.package_items`, `fulfillment.packages`, `fulfillment.pick_task_items`, `fulfillment.pick_tasks`, `fulfillment.picking_wave_orders`, `fulfillment.picking_waves`, `identity.api_client_secrets`, `identity.api_clients`, `identity.login_attempts`, `identity.mfa_factors`, `identity.otp_challenges`, `identity.password_history`, `identity.permissions`, `identity.role_permissions`, `identity.roles`, `identity.sessions`, `identity.trusted_devices`, `identity.user_profiles`, `identity.user_roles`, `identity.users`, `insurance.claim_documents`, `insurance.claims`, `insurance.insurers`, `insurance.policies`, `insurance.policy_members`, `insurance.tpas`, `logistics.carrier_accounts`, `logistics.carriers`, `logistics.delivery_assignments`, `logistics.delivery_attempts`, `logistics.delivery_failure_reasons`, `logistics.delivery_location_updates`, `logistics.delivery_routes`, `logistics.delivery_slots`, `logistics.ndr_cases`, `logistics.reverse_shipments`, `logistics.rider_shifts`, `logistics.serviceability_rules`, `logistics.shipments`, `marketplace.commission_plans`, `marketplace.seller_commission_assignments`, `marketplace.seller_locations`, `marketplace.seller_product_listings`, `marketplace.seller_ratings`, `marketplace.seller_service_levels`, `marketplace.sellers`, `membership.loyalty_accounts`, `membership.plan_benefits`, `membership.plans`, `membership.subscriptions`, `notification.device_endpoints`, `notification.in_app_notifications`, `notification.message_attachments`, `notification.messages`, `notification.provider_configurations`, `notification.provider_webhooks`, `notification.suppressions`, `notification.templates`, `notification.user_channel_preferences`, `organization.bank_accounts`, `organization.departments`, `organization.licenses`, `organization.locations`, `organization.memberships`, `organization.organizations`, `payment.chargebacks`, `payment.cod_collections`, `payment.customer_payment_methods`, `payment.payment_attempts`, `payment.payment_intents`, `payment.payment_webhooks`, `payment.provider_accounts`, `payment.reconciliation_items`, `payment.reconciliation_runs`, `payment.refund_reason_codes`, `payment.refunds`, `platform.application_settings`, `platform.audit_logs`, `platform.cms_page_versions`, `platform.cms_pages`, `platform.data_retention_policies`, `platform.feature_flags`, `platform.file_access_events`, `platform.file_access_grants`, `platform.file_objects`, `platform.file_upload_sessions`, `platform.file_variants`, `platform.idempotency_keys`, `platform.inbox_messages`, `platform.outbox_events`, `platform.report_runs`, `platform.scheduled_jobs`, `platform.webhook_deliveries`, `platform.webhook_endpoints`, `pricing.coupon_codes`, `pricing.price_books`, `pricing.pricing_evaluations`, `pricing.product_prices`, `pricing.promotion_redemptions`, `pricing.promotion_versions`, `pricing.promotions`, `pricing.tax_rules`, `procurement.goods_receipt_items`, `procurement.goods_receipt_quality_checks`, `procurement.goods_receipts`, `procurement.purchase_order_items`, `procurement.purchase_orders`, `procurement.purchase_requisition_items`, `procurement.purchase_requisitions`, `procurement.purchase_return_items`, `procurement.purchase_returns`, `procurement.supplier_invoices`, `procurement.supplier_licenses`, `procurement.supplier_products`, `procurement.suppliers`, `risk.assessments`, `risk.blocklists`, `risk.cases`, `risk.rules`, `search.documents`, `search.indexing_jobs`, `search.query_events`, `search.redirects`, `search.synonyms`, `support.sla_policies`, `support.ticket_actions`, `support.ticket_attachments`, `support.ticket_messages`, `support.ticket_status_history`, `support.ticket_tags`, `support.tickets`, `warehouse.aisles`, `warehouse.bins`, `warehouse.cycle_count_items`, `warehouse.cycle_counts`, `warehouse.inventory_adjustment_items`, `warehouse.inventory_adjustments`, `warehouse.inventory_lots`, `warehouse.racks`, `warehouse.replenishment_rules`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`, `warehouse.stock_movement_reason_codes`, `warehouse.stock_reservations`, `warehouse.stock_transfer_items`, `warehouse.stock_transfers`, `warehouse.warehouses`, `warehouse.zones` |
| Features | `ACC-01`, `ACC-02`, `ACC-03`, `ACC-04`, `ACC-05`, `ACC-06`, `ACC-07`, `ADM-01`, `ADM-02`, `ADM-04`, `ADM-05`, `ADM-06`, `ADM-07`, `ADM-08`, `AUD-01`, `AUD-02`, `AUTH-01`, `AUTH-02`, `AUTH-03`, `AUTH-04`, `CAT-01`, `CAT-02`, `CAT-03`, `CAT-04`, `CHK-01`, `CHK-02`, `CHK-03`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08`, `DLV-01`, `DLV-02`, `DLV-03`, `DLV-04`, `DLV-05`, `FIN-01`, `FIN-02`, `FIN-03`, `FIN-05`, `FIN-06`, `INV-01`, `INV-03`, `INV-04`, `INV-05`, `INV-07`, `NOT-01`, `NOT-02`, `NOT-03`, `NOT-04`, `OMS-01`, `OMS-02`, `OMS-03`, `OMS-04`, `OMS-05`, `ORD-02`, `ORD-03`, `ORD-04`, `ORD-05`, `ORD-06`, `ORD-07`, `PHM-01`, `PHM-02`, `PHM-03`, `PHM-05`, `REP-01`, `REP-02`, `REP-03`, `REP-04`, `REP-07`, `RID-01`, `RID-02`, `RID-03`, `RID-04`, `RID-06`, `RX-01`, `RX-04`, `RX-05`, `STO-01`, `STO-02`, `STO-03`, `STO-04`, `WH-01`, `WH-02`, `WH-04` |
| API consumers | [API-001](../../../03-Modules/Customer-Accounts/APIs.md), [API-002](../../../03-Modules/Customer-Accounts/APIs.md), [API-003](../../../03-Modules/Customer-Accounts/APIs.md), [API-004](../../../03-Modules/Customer-Accounts/APIs.md), [API-005](../../../03-Modules/Customer-Accounts/APIs.md), [API-006](../../../03-Modules/Customer-Accounts/APIs.md), [API-007](../../../03-Modules/Customer-Accounts/APIs.md), [API-008](../../../03-Modules/Customer-Accounts/APIs.md), [API-009](../../../03-Modules/Customer-Accounts/APIs.md), [ACC-ROUTE-005](../../../03-Modules/Customer-Accounts/APIs.md), [API-010](../../../03-Modules/Product-Catalog/APIs.md), [API-011](../../../03-Modules/Product-Catalog/APIs.md), [API-012](../../../03-Modules/Product-Catalog/APIs.md), [API-013](../../../03-Modules/Product-Catalog/APIs.md), [API-014](../../../03-Modules/Product-Catalog/APIs.md), [API-015](../../../03-Modules/Product-Catalog/APIs.md), [API-016](../../../03-Modules/Product-Catalog/APIs.md), [API-017](../../../03-Modules/Product-Catalog/APIs.md), [API-018](../../../03-Modules/Cart-Checkout/APIs.md), [API-019](../../../03-Modules/Cart-Checkout/APIs.md), [API-020](../../../03-Modules/Cart-Checkout/APIs.md), [API-021](../../../03-Modules/Cart-Checkout/APIs.md), [API-022](../../../03-Modules/Prescription-Management/APIs.md), [API-023](../../../03-Modules/Prescription-Management/APIs.md), [API-024](../../../03-Modules/Prescription-Management/APIs.md), [API-025](../../../03-Modules/Customer-Orders/APIs.md), [API-026](../../../03-Modules/Customer-Orders/APIs.md), [API-027](../../../03-Modules/Customer-Orders/APIs.md), [API-028](../../../03-Modules/Customer-Orders/APIs.md), [API-029](../../../03-Modules/Customer-Orders/APIs.md), [API-030](../../../03-Modules/Customer-Orders/APIs.md), [API-031](../../../03-Modules/Customer-Orders/APIs.md), [API-032](../../../03-Modules/Admin/APIs.md), [API-033](../../../03-Modules/Admin/APIs.md), [API-034](../../../03-Modules/Admin/APIs.md), [API-035](../../../03-Modules/Admin/APIs.md), [API-036](../../../03-Modules/Admin/APIs.md), [API-037](../../../03-Modules/Admin/APIs.md), [API-038](../../../03-Modules/Admin/APIs.md), [API-039](../../../03-Modules/Order-Management/APIs.md), [API-040](../../../03-Modules/Order-Management/APIs.md), [API-041](../../../03-Modules/Order-Management/APIs.md), [API-042](../../../03-Modules/Order-Management/APIs.md), [API-043](../../../03-Modules/Order-Management/APIs.md), [API-044](../../../03-Modules/Store-Operations/APIs.md), [API-045](../../../03-Modules/Store-Operations/APIs.md), [API-046](../../../03-Modules/Store-Operations/APIs.md), [API-047](../../../03-Modules/Store-Operations/APIs.md), [API-048](../../../03-Modules/Store-Operations/APIs.md), [API-049](../../../03-Modules/Store-Operations/APIs.md), [API-050](../../../03-Modules/Inventory/APIs.md), [API-051](../../../03-Modules/Inventory/APIs.md), [API-052](../../../03-Modules/Inventory/APIs.md), [API-053](../../../03-Modules/Inventory/APIs.md), [API-054](../../../03-Modules/Inventory/APIs.md), [API-055](../../../03-Modules/Inventory/APIs.md), [API-056](../../../03-Modules/Warehouse/APIs.md), [API-057](../../../03-Modules/Warehouse/APIs.md), [API-058](../../../03-Modules/Warehouse/APIs.md), [API-059](../../../03-Modules/Warehouse/APIs.md), [API-060](../../../03-Modules/Pharmacist-Review/APIs.md), [API-061](../../../03-Modules/Pharmacist-Review/APIs.md), [API-062](../../../03-Modules/Pharmacist-Review/APIs.md), [API-063](../../../03-Modules/Pharmacist-Review/APIs.md), [API-064](../../../03-Modules/Delivery/APIs.md), [API-065](../../../03-Modules/Delivery/APIs.md), [API-066](../../../03-Modules/Delivery/APIs.md), [API-067](../../../03-Modules/Delivery/APIs.md), [API-068](../../../03-Modules/Delivery/APIs.md), [API-069](../../../03-Modules/Rider-Operations/APIs.md), [API-070](../../../03-Modules/Rider-Operations/APIs.md), [API-071](../../../03-Modules/Rider-Operations/APIs.md), [API-072](../../../03-Modules/Rider-Operations/APIs.md), [API-073](../../../03-Modules/Rider-Operations/APIs.md), [API-074](../../../03-Modules/Rider-Operations/APIs.md), [API-075](../../../03-Modules/Payments/APIs.md), [API-076](../../../03-Modules/Payments/APIs.md), [API-077](../../../03-Modules/Payments/APIs.md), [API-078](../../../03-Modules/Payments/APIs.md), [API-079](../../../03-Modules/Payments/APIs.md), [API-080](../../../03-Modules/Payments/APIs.md), [API-081](../../../03-Modules/Payments/APIs.md), [API-082](../../../03-Modules/Reporting/APIs.md), [API-083](../../../03-Modules/Reporting/APIs.md), [API-084](../../../03-Modules/Reporting/APIs.md), [API-085](../../../03-Modules/Reporting/APIs.md), [API-086](../../../03-Modules/Reporting/APIs.md), [API-087](../../../03-Modules/Audit/APIs.md), [API-088](../../../03-Modules/Audit/APIs.md), [API-089](../../../03-Modules/Authentication/APIs.md), [API-090](../../../03-Modules/Authentication/APIs.md), [API-091](../../../03-Modules/Authentication/APIs.md), [API-092](../../../03-Modules/Authentication/APIs.md), [API-093](../../../03-Modules/Authentication/APIs.md), [API-094](../../../03-Modules/Notifications/APIs.md), [API-095](../../../03-Modules/Notifications/APIs.md), [API-096](../../../03-Modules/Notifications/APIs.md), [API-097](../../../03-Modules/Notifications/APIs.md), [ACC-ROUTE-001](../../../03-Modules/Customer-Accounts/APIs.md), [ACC-ROUTE-002](../../../03-Modules/Customer-Accounts/APIs.md), [ACC-ROUTE-007](../../../03-Modules/Customer-Accounts/APIs.md), [ACC-ROUTE-006](../../../03-Modules/Customer-Accounts/APIs.md), [ACC-ROUTE-003](../../../03-Modules/Customer-Accounts/APIs.md), [ACC-ROUTE-004](../../../03-Modules/Customer-Accounts/APIs.md), [ACC-ROUTE-008](../../../03-Modules/Customer-Accounts/APIs.md), [ACC-ROUTE-009](../../../03-Modules/Customer-Accounts/APIs.md), [ACC-ROUTE-010](../../../03-Modules/Customer-Accounts/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: .

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Identity administrator / verified onboarding through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use approved inactive/closed status from the table CHECK/owner policy; do not invent unsupported status values. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (email_normalized); CREATE UNIQUE INDEX uq_identity_users_phone_present ON identity.users USING btree (phone_country_code, phone_number) WHERE phone_country_code IS NOT NULL AND phone_number IS NOT NULL; CREATE UNIQUE INDEX users_email_normalized ON identity.users USING btree (email_normalized) |
| Foreign-key dependencies | No non-actor FK dependencies recorded. |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-003 exact role/grant and identity lifecycle approval. |
