# Rider Operations database contract

**Structure validated; business write assignment Proposed.** Rider client workflows; no independent direct table write ownership or clinical/finance authority. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

This client/projection module has no independently owned authoritative tables. It delegates commands to the owners below.

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `review_id`, `row_version` | None | Pharmacist_Review | API-071 |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | None | Pharmacist_Review | API-071 |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | `id`, `order_id`, `status` | None | Order_Operations | API-071 |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | `currency`, `current_revision_id`, `id`, `internal_id`, `patient_profile_id`, `row_version`, `status`, `user_id` | None | Order_Operations | API-071, API-073 |
| [`fulfillment.fulfillment_orders`](../../04-Database/Tables/fulfillment/fulfillment_orders.md) | `id`, `order_id`, `order_revision_id`, `row_version`, `status`, `warehouse_id` | `status` | Store_Operations | API-071 |
| [`fulfillment.packages`](../../04-Database/Tables/fulfillment/packages.md) | `fulfillment_order_id`, `id`, `row_version`, `status` | None | Store_Operations | API-071 |
| [`logistics.delivery_assignments`](../../04-Database/Tables/logistics/delivery_assignments.md) | `accepted_at`, `assigned_at`, `completed_at`, `delivery_user_id`, `ended_at`, `id`, `is_current`, `row_version`, `shipment_id`, `status` | `accepted_at`, `completed_at`, `status` | Delivery_Operations | API-069, API-070, API-071, API-072, API-073, API-074 |
| [`logistics.delivery_attempts`](../../04-Database/Tables/logistics/delivery_attempts.md) | `attempt_number`, `attempted_at`, `delivery_user_id`, `id`, `proof_file_id`, `proof_metadata`, `reason_code`, `reason_code_id`, `row_version`, `shipment_id`, `status` | `attempt_number`, `attempted_at`, `delivery_user_id`, `otp_verified`, `proof_file_id`, `proof_metadata`, `reason_code`, `shipment_id`, `status` | Delivery_Operations | API-073, API-074 |
| [`logistics.delivery_failure_reasons`](../../04-Database/Tables/logistics/delivery_failure_reasons.md) | `id`, `is_active`, `row_version` | None | Delivery_Operations | API-074 |
| [`logistics.delivery_location_updates`](../../04-Database/Tables/logistics/delivery_location_updates.md) | None | `accuracy_m`, `assignment_id`, `delivery_user_id`, `latitude`, `longitude`, `received_at`, `recorded_at`, `shift_id`, `source` | Delivery_Operations | API-072 |
| [`logistics.delivery_otp_challenges`](../../04-Database/Tables/logistics/delivery_otp_challenges.md) | `assignment_id`, `attempt_count`, `expires_at`, `id`, `max_attempts`, `otp_digest`, `shipment_id`, `status`, `verified_at` | `attempt_count`, `status`, `verified_at` | Delivery_Operations | API-073 |
| [`logistics.ndr_cases`](../../04-Database/Tables/logistics/ndr_cases.md) | None | `reason_code`, `shipment_id`, `status` | Delivery_Operations | API-074 |
| [`logistics.rider_shifts`](../../04-Database/Tables/logistics/rider_shifts.md) | `ended_at`, `id`, `rider_user_id`, `started_at` | `ended_at`, `rider_user_id`, `started_at` | Delivery_Operations | API-069, API-070, API-072 |
| [`logistics.shipment_events`](../../04-Database/Tables/logistics/shipment_events.md) | None | `event_code`, `event_time`, `raw_payload`, `shipment_id`, `status` | Delivery_Operations | API-071 |
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | `id`, `order_id`, `order_revision_id`, `package_id`, `row_version`, `shipping_label_file_id`, `status` | `delivered_at`, `dispatched_at`, `status` | Delivery_Operations | API-070, API-071, API-073, API-074 |
| [`organization.licenses`](../../04-Database/Tables/organization/licenses.md) | `expires_at`, `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `verification_status` | None | Admin_CMS | API-071 |
| [`payment.cod_collections`](../../04-Database/Tables/payment/cod_collections.md) | `amount`, `id`, `order_id`, `order_revision_id`, `row_version`, `shipment_id`, `status` | `amount`, `collected_at`, `collected_by_user_id`, `status` | Finance_Payments | API-071, API-073 |
| [`payment.payment_intents`](../../04-Database/Tables/payment/payment_intents.md) | `expires_at`, `id`, `order_id`, `order_revision_id`, `row_version`, `status` | None | Finance_Payments | API-071 |
| [`platform.file_access_grants`](../../04-Database/Tables/platform/file_access_grants.md) | `expires_at`, `file_object_id`, `id`, `row_version` | None | Shared platform file service — engineering owner; no clinical write grant | API-073 |
| [`platform.file_objects`](../../04-Database/Tables/platform/file_objects.md) | `access_type`, `classification`, `id`, `is_deleted`, `malware_scan_status`, `owner_id`, `owner_type`, `row_version`, `sha256`, `size_bytes`, `status` | None | Shared platform file service — engineering owner; no clinical write grant | API-073, API-074 |
| [`warehouse.stock_reservations`](../../04-Database/Tables/warehouse/stock_reservations.md) | `expires_at`, `id`, `order_id`, `order_item_id`, `order_revision_id`, `row_version`, `status`, `warehouse_id` | None | Inventory | API-071 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`logistics.delivery_failure_reasons`](../../04-Database/Tables/logistics/delivery_failure_reasons.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`platform.file_access_grants`](../../04-Database/Tables/platform/file_access_grants.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
