# Prescription Management database contract

**Structure validated; business write assignment Proposed.** Patient/prescription linkage; shared file infrastructure controls object storage and Pharmacist Review owns clinical decisions. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

| Table | Classification | Write-owner approval |
| --- | --- | --- |
| [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`clinical.prescription_access_logs`](../../04-Database/Tables/clinical/prescription_access_logs.md) | Audit / History | D-024; SQL grants reviewed independently |
| [`clinical.prescription_documents`](../../04-Database/Tables/clinical/prescription_documents.md) | Mapping / Junction | D-024; SQL grants reviewed independently |
| [`clinical.prescription_items`](../../04-Database/Tables/clinical/prescription_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`clinical.prescriptions`](../../04-Database/Tables/clinical/prescriptions.md) | Transactional | D-024; SQL grants reviewed independently |

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | None | `decision`, `order_id`, `order_item_id`, `prescription_id`, `review_id` | Pharmacist_Review | API-024 |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | None | `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `requested_at`, `review_version`, `status` | Pharmacist_Review | API-024 |
| [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md) | `family_member_id`, `id`, `is_deleted`, `row_version`, `user_id` | None | Prescription_Upload | API-024 |
| [`clinical.prescription_documents`](../../04-Database/Tables/clinical/prescription_documents.md) | None | `file_object_id`, `prescription_id`, `redaction_status`, `version_number` | Prescription_Upload | API-024 |
| [`clinical.prescriptions`](../../04-Database/Tables/clinical/prescriptions.md) | None | `patient_profile_id`, `source`, `status`, `uploaded_by_user_id` | Prescription_Upload | API-024 |
| [`commerce.order_items`](../../04-Database/Tables/commerce/order_items.md) | `id`, `order_id`, `prescription_id`, `row_version`, `status` | `prescription_id` | Order_Operations | API-024 |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | None | Order_Operations | API-024 |
| [`customer.family_members`](../../04-Database/Tables/customer/family_members.md) | `customer_user_id`, `id`, `is_deleted`, `row_version` | None | Customer_Accounts | API-024 |
| [`platform.file_objects`](../../04-Database/Tables/platform/file_objects.md) | `access_type`, `classification`, `content_type`, `expected_size_bytes`, `id`, `is_deleted`, `malware_scan_status`, `original_filename`, `owner_id`, `owner_type`, `row_version`, `sha256`, `size_bytes`, `status` | `access_type`, `bucket`, `classification`, `content_type`, `etag`, `expected_size_bytes`, `malware_scan_status`, `object_key`, `original_filename`, `owner_id`, `owner_type`, `sha256`, `size_bytes`, `status`, `storage_provider`, `storage_version_id`, `uploaded_by_user_id` | Shared platform file service — engineering owner; no clinical write grant | API-022, API-023, API-024 |
| [`platform.file_upload_sessions`](../../04-Database/Tables/platform/file_upload_sessions.md) | `expires_at`, `file_object_id`, `id`, `row_version`, `status` | `completed_at`, `expires_at`, `file_object_id`, `idempotency_key`, `requested_by_user_id`, `scope`, `status`, `upload_method` | Shared platform file service — engineering owner; no clinical write grant | API-022, API-023 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`clinical.prescription_documents`](../../04-Database/Tables/clinical/prescription_documents.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`customer.family_members`](../../04-Database/Tables/customer/family_members.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
