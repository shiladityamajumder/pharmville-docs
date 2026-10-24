# Pharmacist Review database contract

**Structure validated; business write assignment Proposed.** Clinical review decisions and evidence; M/O-only orders do not enter mandatory pharmacist review. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

| Table | Classification | Write-owner approval |
| --- | --- | --- |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | Transactional | D-024; SQL grants reviewed independently |
| [`clinical.practitioner_profiles`](../../04-Database/Tables/clinical/practitioner_profiles.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`clinical.review_reason_codes`](../../04-Database/Tables/clinical/review_reason_codes.md) | Master / Reference | D-024; SQL grants reviewed independently |

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `prescription_item_id`, `reason_code`, `reason_code_id`, `review_id`, `row_version` | `approved_quantity`, `decided_at`, `decision`, `reason_code` | Pharmacist_Review | API-060, API-061, API-062, API-063 |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `reason_code`, `reason_code_id`, `requested_at`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | `review_version`, `reviewed_at`, `reviewed_by_user_id`, `status` | Pharmacist_Review | API-060, API-061, API-062, API-063 |
| [`clinical.practitioner_profiles`](../../04-Database/Tables/clinical/practitioner_profiles.md) | `id`, `is_deleted`, `row_version`, `user_id` | None | Pharmacist_Review | API-060, API-062 |
| [`clinical.prescription_documents`](../../04-Database/Tables/clinical/prescription_documents.md) | `id`, `prescription_id`, `row_version` | None | Prescription_Upload | API-061, API-062 |
| [`clinical.prescription_items`](../../04-Database/Tables/clinical/prescription_items.md) | `id`, `prescription_id`, `row_version` | None | Prescription_Upload | API-062 |
| [`clinical.prescriptions`](../../04-Database/Tables/clinical/prescriptions.md) | `id`, `patient_profile_id`, `row_version`, `status`, `valid_until` | None | Prescription_Upload | API-061, API-062 |
| [`clinical.review_reason_codes`](../../04-Database/Tables/clinical/review_reason_codes.md) | `id`, `is_active`, `row_version` | None | Pharmacist_Review | API-062 |
| [`commerce.order_items`](../../04-Database/Tables/commerce/order_items.md) | `id`, `order_id`, `prescription_id`, `row_version`, `status` | `commerce_class_snapshot`, `commerce_class_version_snapshot`, `discount_amount`, `line_total`, `quantity`, `tax_amount`, `unit_price` | Order_Operations | API-062, API-063 |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | `accepted_at`, `currency`, `grand_total`, `id`, `order_id`, `revision_number`, `status` | `accepted_at`, `accepted_by_user_id`, `status` | Order_Operations | API-061, API-062, API-063 |
| [`commerce.order_status_history`](../../04-Database/Tables/commerce/order_status_history.md) | None | `changed_at`, `changed_by_user_id`, `from_status`, `order_id`, `reason_code`, `to_status` | Order_Operations | API-063 |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | `current_revision_id`, `id`, `internal_id`, `patient_profile_id`, `row_version`, `status`, `user_id` | `current_revision_id`, `discount_total`, `grand_total`, `other_charges_total`, `prescription_status`, `shipping_total`, `subtotal`, `tax_total` | Order_Operations | API-061, API-062, API-063 |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `id`, `location_id`, `organization_id`, `row_version`, `status`, `user_id` | None | Admin_CMS | API-060 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`clinical.practitioner_profiles`](../../04-Database/Tables/clinical/practitioner_profiles.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`clinical.prescription_documents`](../../04-Database/Tables/clinical/prescription_documents.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`clinical.review_reason_codes`](../../04-Database/Tables/clinical/review_reason_codes.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
