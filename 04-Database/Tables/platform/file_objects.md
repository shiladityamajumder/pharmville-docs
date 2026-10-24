# `platform.file_objects`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds file objects records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | platform.file_objects |
| Classification | Derived / Operational |
| Proposed business write owner | Shared platform file service — engineering owner; no clinical write grant |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 32 columns; 16 PK/FK/UQ/CHECK/exclusion constraints; 19 named PostgreSQL 18 NOT NULL constraints; 7 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `access_type` | `character varying(16)` | No | `'private'::character varying` | Inferred: stores access type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `available_at` | `timestamp with time zone` | Yes | — | Time of available | Support chronology, deadlines or audit evidence | Exact constraints below |
| `bucket` | `character varying(128)` | No | — | Inferred: stores bucket for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `classification` | `character varying(32)` | No | `'internal'::character varying` | Inferred: stores classification for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `content_type` | `character varying(128)` | No | — | Inferred: stores content type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_file_objects_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_file_objects_deleted_by_users` |
| `encryption_key_ref` | `character varying(255)` | Yes | — | Inferred: stores encryption key ref for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `etag` | `character varying(255)` | Yes | — | Inferred: stores etag for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `expected_size_bytes` | `bigint` | No | — | Inferred: stores expected size bytes for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `malware_scan_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores malware scan status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | Exact constraints below |
| `object_key` | `character varying(512)` | No | — | Inferred: stores object key for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `original_filename` | `character varying(255)` | No | — | Inferred: stores original filename for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `owner_id` | `uuid` | No | — | Identifier associated with owner | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `owner_type` | `character varying(64)` | No | — | Inferred: stores owner type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `public_url` | `character varying(2048)` | Yes | — | Inferred: stores public url for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `retention_until` | `timestamp with time zone` | Yes | — | Inferred: stores retention until for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `sha256` | `character varying(64)` | Yes | — | Inferred: stores sha256 for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `size_bytes` | `bigint` | Yes | — | Inferred: stores size bytes for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `status` | `character varying(16)` | No | `'pending_upload'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `storage_provider` | `character varying(32)` | No | `'s3'::character varying` | Inferred: stores storage provider for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `storage_version_id` | `character varying(255)` | Yes | — | Identifier associated with storage version | Link the event or entity to its subject; verify constraints | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_file_objects_updated_by_users` |
| `uploaded_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_file_objects_uploaded_by_user_id_users` |

## Record lifecycle and users

- **Created:** when the file objects business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.file_objects` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_platform_file_objects_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_file_objects_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_file_objects_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_file_objects_uploaded_by_user_id_users | `uploaded_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (uploaded_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`appointment.teleconsultation_sessions`](../../Tables/appointment/teleconsultation_sessions.md) | fk_appointment_teleconsultation_sessions_recording_file_7410 | `recording_file_id` | `id` |
| [`appointment.teleconsultation_sessions`](../../Tables/appointment/teleconsultation_sessions.md) | fk_appointment_teleconsultation_sessions_recording_file_885a | `recording_file_id_internal_id` | `internal_id` |
| [`catalog.brands`](../../Tables/catalog/brands.md) | fk_catalog_brands_logo_file_id_file_objects | `logo_file_id` | `id` |
| [`catalog.brands`](../../Tables/catalog/brands.md) | fk_catalog_brands_logo_file_id_file_objects_numeric | `logo_file_id_internal_id` | `internal_id` |
| [`catalog.product_media`](../../Tables/catalog/product_media.md) | fk_catalog_product_media_file_object_id_file_objects | `file_object_id` | `id` |
| [`catalog.product_media`](../../Tables/catalog/product_media.md) | fk_catalog_product_media_file_object_id_file_objects_numeric | `file_object_id_internal_id` | `internal_id` |
| [`clinical.prescription_documents`](../../Tables/clinical/prescription_documents.md) | fk_clinical_prescription_documents_file_object_id_file__7c34 | `file_object_id_internal_id` | `internal_id` |
| [`clinical.prescription_documents`](../../Tables/clinical/prescription_documents.md) | fk_clinical_prescription_documents_file_object_id_file_objects | `file_object_id` | `id` |
| [`compliance.evidence`](../../Tables/compliance/evidence.md) | fk_compliance_evidence_file_object_id_file_objects | `file_object_id` | `id` |
| [`compliance.evidence`](../../Tables/compliance/evidence.md) | fk_compliance_evidence_file_object_id_file_objects_numeric | `file_object_id_internal_id` | `internal_id` |
| [`compliance.regulatory_registrations`](../../Tables/compliance/regulatory_registrations.md) | fk_compliance_regulatory_registrations_document_file_id_1e84 | `document_file_id_internal_id` | `internal_id` |
| [`compliance.regulatory_registrations`](../../Tables/compliance/regulatory_registrations.md) | fk_compliance_regulatory_registrations_document_file_id_e38a | `document_file_id` | `id` |
| [`customer.profiles`](../../Tables/customer/profiles.md) | fk_customer_profiles_avatar_file_id_file_objects | `avatar_file_id` | `id` |
| [`customer.profiles`](../../Tables/customer/profiles.md) | fk_customer_profiles_avatar_file_id_file_objects_numeric | `avatar_file_id_internal_id` | `internal_id` |
| [`diagnostics.diagnostic_reports`](../../Tables/diagnostics/diagnostic_reports.md) | fk_diagnostics_diagnostic_reports_file_object_id_file_o_e8a0 | `file_object_id_internal_id` | `internal_id` |
| [`diagnostics.diagnostic_reports`](../../Tables/diagnostics/diagnostic_reports.md) | fk_diagnostics_diagnostic_reports_file_object_id_file_objects | `file_object_id` | `id` |
| [`finance.credit_notes`](../../Tables/finance/credit_notes.md) | fk_finance_credit_notes_document_file_id_file_objects | `document_file_id` | `id` |
| [`finance.credit_notes`](../../Tables/finance/credit_notes.md) | fk_finance_credit_notes_document_file_id_file_objects_numeric | `document_file_id_internal_id` | `internal_id` |
| [`finance.invoices`](../../Tables/finance/invoices.md) | fk_finance_invoices_document_file_id_file_objects | `document_file_id` | `id` |
| [`finance.invoices`](../../Tables/finance/invoices.md) | fk_finance_invoices_document_file_id_file_objects_numeric | `document_file_id_internal_id` | `internal_id` |
| [`identity.user_profiles`](../../Tables/identity/user_profiles.md) | fk_identity_user_profiles_avatar_file_id_file_objects | `avatar_file_id` | `id` |
| [`identity.user_profiles`](../../Tables/identity/user_profiles.md) | fk_identity_user_profiles_avatar_file_id_file_objects_numeric | `avatar_file_id_internal_id` | `internal_id` |
| [`insurance.claim_documents`](../../Tables/insurance/claim_documents.md) | fk_insurance_claim_documents_file_object_id_file_object_2e7f | `file_object_id_internal_id` | `internal_id` |
| [`insurance.claim_documents`](../../Tables/insurance/claim_documents.md) | fk_insurance_claim_documents_file_object_id_file_objects | `file_object_id` | `id` |
| [`logistics.delivery_attempts`](../../Tables/logistics/delivery_attempts.md) | fk_logistics_delivery_attempts_proof_file_id_file_objec_b2c0 | `proof_file_id_internal_id` | `internal_id` |
| [`logistics.delivery_attempts`](../../Tables/logistics/delivery_attempts.md) | fk_logistics_delivery_attempts_proof_file_id_file_objects | `proof_file_id` | `id` |
| [`logistics.shipments`](../../Tables/logistics/shipments.md) | fk_logistics_shipments_shipping_label_file_id_file_obje_c402 | `shipping_label_file_id_internal_id` | `internal_id` |
| [`logistics.shipments`](../../Tables/logistics/shipments.md) | fk_logistics_shipments_shipping_label_file_id_file_objects | `shipping_label_file_id` | `id` |
| [`notification.in_app_notifications`](../../Tables/notification/in_app_notifications.md) | fk_notification_in_app_notifications_image_file_id_file_ce63 | `image_file_id_internal_id` | `internal_id` |
| [`notification.in_app_notifications`](../../Tables/notification/in_app_notifications.md) | fk_notification_in_app_notifications_image_file_id_file_objects | `image_file_id` | `id` |
| [`notification.message_attachments`](../../Tables/notification/message_attachments.md) | fk_notification_message_attachments_file_object_id_file_0d0a | `file_object_id_internal_id` | `internal_id` |
| [`notification.message_attachments`](../../Tables/notification/message_attachments.md) | fk_notification_message_attachments_file_object_id_file_objects | `file_object_id` | `id` |
| [`organization.licenses`](../../Tables/organization/licenses.md) | fk_organization_licenses_document_file_id_file_objects | `document_file_id` | `id` |
| [`organization.licenses`](../../Tables/organization/licenses.md) | fk_organization_licenses_document_file_id_file_objects_numeric | `document_file_id_internal_id` | `internal_id` |
| [`payment.reconciliation_runs`](../../Tables/payment/reconciliation_runs.md) | fk_payment_reconciliation_runs_source_file_id_file_obje_5a14 | `source_file_id_internal_id` | `internal_id` |
| [`payment.reconciliation_runs`](../../Tables/payment/reconciliation_runs.md) | fk_payment_reconciliation_runs_source_file_id_file_objects | `source_file_id` | `id` |
| [`platform.cms_banners`](../../Tables/platform/cms_banners.md) | fk_platform_cms_banners_image_file_id_file_objects | `image_file_id` | `id` |
| [`platform.cms_banners`](../../Tables/platform/cms_banners.md) | fk_platform_cms_banners_image_file_id_file_objects_numeric | `image_file_id_internal_id` | `internal_id` |
| [`platform.file_access_events`](../../Tables/platform/file_access_events.md) | fk_platform_file_access_events_file_object_id_file_obje_47c7 | `file_object_id_internal_id` | `internal_id` |
| [`platform.file_access_events`](../../Tables/platform/file_access_events.md) | fk_platform_file_access_events_file_object_id_file_objects | `file_object_id` | `id` |
| [`platform.file_access_grants`](../../Tables/platform/file_access_grants.md) | fk_platform_file_access_grants_file_object_id_file_obje_fef8 | `file_object_id_internal_id` | `internal_id` |
| [`platform.file_access_grants`](../../Tables/platform/file_access_grants.md) | fk_platform_file_access_grants_file_object_id_file_objects | `file_object_id` | `id` |
| [`platform.file_scan_events`](../../Tables/platform/file_scan_events.md) | fk_platform_file_scan_events_file_object_id_file_object_6b3d | `file_object_id_internal_id` | `internal_id` |
| [`platform.file_scan_events`](../../Tables/platform/file_scan_events.md) | fk_platform_file_scan_events_file_object_id_file_objects | `file_object_id` | `id` |
| [`platform.file_upload_sessions`](../../Tables/platform/file_upload_sessions.md) | fk_platform_file_upload_sessions_file_object_id_file_ob_88b9 | `file_object_id_internal_id` | `internal_id` |
| [`platform.file_upload_sessions`](../../Tables/platform/file_upload_sessions.md) | fk_platform_file_upload_sessions_file_object_id_file_objects | `file_object_id` | `id` |
| [`platform.file_variants`](../../Tables/platform/file_variants.md) | fk_platform_file_variants_source_file_id_file_objects | `source_file_id` | `id` |
| [`platform.file_variants`](../../Tables/platform/file_variants.md) | fk_platform_file_variants_source_file_id_file_objects_numeric | `source_file_id_internal_id` | `internal_id` |
| [`platform.file_variants`](../../Tables/platform/file_variants.md) | fk_platform_file_variants_variant_file_id_file_objects | `variant_file_id` | `id` |
| [`platform.file_variants`](../../Tables/platform/file_variants.md) | fk_platform_file_variants_variant_file_id_file_objects_numeric | `variant_file_id_internal_id` | `internal_id` |
| [`platform.report_runs`](../../Tables/platform/report_runs.md) | fk_platform_report_runs_result_file_object_id_file_obje_a9ad | `result_file_object_id_internal_id` | `internal_id` |
| [`platform.report_runs`](../../Tables/platform/report_runs.md) | fk_platform_report_runs_result_file_object_id_file_objects | `result_file_object_id` | `id` |
| [`procurement.supplier_invoices`](../../Tables/procurement/supplier_invoices.md) | fk_procurement_supplier_invoices_document_file_id_file__3eb3 | `document_file_id_internal_id` | `internal_id` |
| [`procurement.supplier_invoices`](../../Tables/procurement/supplier_invoices.md) | fk_procurement_supplier_invoices_document_file_id_file_objects | `document_file_id` | `id` |
| [`procurement.supplier_licenses`](../../Tables/procurement/supplier_licenses.md) | fk_procurement_supplier_licenses_document_file_id_file__c5bf | `document_file_id_internal_id` | `internal_id` |
| [`procurement.supplier_licenses`](../../Tables/procurement/supplier_licenses.md) | fk_procurement_supplier_licenses_document_file_id_file_objects | `document_file_id` | `id` |
| [`support.ticket_attachments`](../../Tables/support/ticket_attachments.md) | fk_support_ticket_attachments_file_object_id_file_objec_8e8b | `file_object_id_internal_id` | `internal_id` |
| [`support.ticket_attachments`](../../Tables/support/ticket_attachments.md) | fk_support_ticket_attachments_file_object_id_file_objects | `file_object_id` | `id` |

## `platform.file_objects` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_platform_file_objects_created_by_users` |
| `deleted_by` | `identity.users` | `fk_platform_file_objects_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_platform_file_objects_updated_by_users` |
| `uploaded_by_user_id` | `identity.users` | `fk_platform_file_objects_uploaded_by_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_file_objects_available_has_safe_final_metadata` | CHECK | `CHECK (status::text <> 'available'::text OR size_bytes IS NOT NULL AND sha256 IS NOT NULL AND malware_scan_status::text = 'clean'::text)` |
| `ck_platform_file_objects_expected_size_positive` | CHECK | `CHECK (expected_size_bytes > 0)` |
| `ck_platform_file_objects_fileaccesstype` | CHECK | `CHECK (access_type::text = ANY (ARRAY['public'::text, 'private'::text]))` |
| `ck_platform_file_objects_fileobjectstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['pending_upload'::text, 'uploaded'::text, 'scanning'::text, 'available'::text, 'quarantined'::text, 'rejected'::text, 'deleted'::text]))` |
| `ck_platform_file_objects_malwarescanstatus` | CHECK | `CHECK (malware_scan_status::text = ANY (ARRAY['pending'::text, 'scanning'::text, 'clean'::text, 'infected'::text, 'failed'::text]))` |
| `ck_platform_file_objects_private_has_no_public_url` | CHECK | `CHECK (access_type::text <> 'private'::text OR public_url IS NULL)` |
| `ck_platform_file_objects_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_platform_file_objects_sha256_length` | CHECK | `CHECK (sha256 IS NULL OR char_length(sha256::text) = 64)` |
| `ck_platform_file_objects_size_positive` | CHECK | `CHECK (size_bytes IS NULL OR size_bytes > 0)` |
| `file_bucket_object_key` | UNIQUE | `UNIQUE (bucket, object_key)` |
| `fk_platform_file_objects_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_file_objects_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_file_objects_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_file_objects_uploaded_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (uploaded_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `pk_platform_file_objects` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_file_objects_id` | UNIQUE | `UNIQUE (id)` |
| `file_objects_access_type_not_null` | NOT NULL | `NOT NULL access_type` |
| `file_objects_bucket_not_null` | NOT NULL | `NOT NULL bucket` |
| `file_objects_classification_not_null` | NOT NULL | `NOT NULL classification` |
| `file_objects_content_type_not_null` | NOT NULL | `NOT NULL content_type` |
| `file_objects_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `file_objects_expected_size_bytes_not_null` | NOT NULL | `NOT NULL expected_size_bytes` |
| `file_objects_id_not_null` | NOT NULL | `NOT NULL id` |
| `file_objects_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `file_objects_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `file_objects_malware_scan_status_not_null` | NOT NULL | `NOT NULL malware_scan_status` |
| `file_objects_metadata_json_not_null` | NOT NULL | `NOT NULL metadata_json` |
| `file_objects_object_key_not_null` | NOT NULL | `NOT NULL object_key` |
| `file_objects_original_filename_not_null` | NOT NULL | `NOT NULL original_filename` |
| `file_objects_owner_id_not_null` | NOT NULL | `NOT NULL owner_id` |
| `file_objects_owner_type_not_null` | NOT NULL | `NOT NULL owner_type` |
| `file_objects_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `file_objects_status_not_null` | NOT NULL | `NOT NULL status` |
| `file_objects_storage_provider_not_null` | NOT NULL | `NOT NULL storage_provider` |
| `file_objects_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `file_bucket_object_key` | btree | `(bucket, object_key)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX file_bucket_object_key ON platform.file_objects USING btree (bucket, object_key)` |
| `ix_platform_file_objects_owner` | btree | `(owner_type, owner_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_file_objects_owner ON platform.file_objects USING btree (owner_type, owner_id)` |
| `ix_platform_file_objects_sha256` | btree | `(sha256)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_file_objects_sha256 ON platform.file_objects USING btree (sha256)` |
| `ix_platform_file_objects_status` | btree | `(status, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_file_objects_status ON platform.file_objects USING btree (status, created_at)` |
| `ix_platform_file_objects_uploaded_by` | btree | `(uploaded_by_user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_file_objects_uploaded_by ON platform.file_objects USING btree (uploaded_by_user_id)` |
| `pk_platform_file_objects` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_platform_file_objects ON platform.file_objects USING btree (internal_id)` |
| `uq_platform_file_objects_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_file_objects_id ON platform.file_objects USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.file_objects FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `reviewed_file_identity_guard` | `CREATE TRIGGER reviewed_file_identity_guard BEFORE UPDATE ON platform.file_objects FOR EACH ROW EXECUTE FUNCTION platform.guard_reviewed_file_identity()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.file_objects FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.file_objects FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
