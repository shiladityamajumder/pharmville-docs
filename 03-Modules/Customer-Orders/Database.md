# Customer Orders database contract

**Structure validated; business write assignment Proposed.** Customer order projections and command facade; no independent authoritative order, payment or clinical tables. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

This client/projection module has no independently owned authoritative tables. It delegates commands to the owners below.

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`commerce.cancellation_items`](../../04-Database/Tables/commerce/cancellation_items.md) | None | `cancellation_id`, `order_item_id`, `quantity` | Order_Operations | API-027 |
| [`commerce.cancellation_reason_codes`](../../04-Database/Tables/commerce/cancellation_reason_codes.md) | `id`, `is_active`, `row_version` | None | Order_Operations | API-027 |
| [`commerce.cancellations`](../../04-Database/Tables/commerce/cancellations.md) | None | `order_id`, `reason_code`, `reason_text`, `requested_by_user_id`, `status` | Order_Operations | API-027 |
| [`commerce.order_items`](../../04-Database/Tables/commerce/order_items.md) | `commerce_class_snapshot`, `id`, `line_total`, `order_id`, `prescription_id`, `product_id`, `quantity`, `row_version`, `status`, `tax_amount`, `unit_price` | None | Order_Operations | API-026, API-027, API-028 |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | `id`, `order_id`, `status` | None | Order_Operations | API-026 |
| [`commerce.order_status_history`](../../04-Database/Tables/commerce/order_status_history.md) | None | `changed_at`, `changed_by_user_id`, `from_status`, `order_id`, `reason_code`, `to_status` | Order_Operations | API-027 |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | `currency`, `current_revision_id`, `fulfillment_status`, `grand_total`, `id`, `internal_id`, `order_number`, `patient_profile_id`, `payment_status`, `placed_at`, `prescription_status`, `row_version`, `shipping_address_snapshot`, `status`, `user_id` | `cancelled_at`, `status` | Order_Operations | API-025, API-026, API-027, API-028, API-029, API-030, API-031 |
| [`commerce.return_items`](../../04-Database/Tables/commerce/return_items.md) | `id`, `order_item_id`, `quantity`, `return_id`, `row_version` | `order_item_id`, `quantity`, `resolution`, `return_id` | Order_Operations | API-028 |
| [`commerce.return_reason_codes`](../../04-Database/Tables/commerce/return_reason_codes.md) | `id`, `is_active`, `row_version` | None | Order_Operations | API-028 |
| [`commerce.returns`](../../04-Database/Tables/commerce/returns.md) | `id`, `order_id`, `pickup_required`, `reason_code`, `reason_code_id`, `requested_at`, `return_number`, `row_version`, `status`, `user_id` | `order_id`, `pickup_required`, `reason_code`, `requested_at`, `return_number`, `status`, `user_id` | Order_Operations | API-028 |
| [`finance.invoice_items`](../../04-Database/Tables/finance/invoice_items.md) | `description`, `hsn_code`, `id`, `invoice_id`, `line_total`, `order_item_id`, `quantity`, `row_version`, `tax_amount`, `unit_price` | None | Finance_Payments | API-029 |
| [`finance.invoices`](../../04-Database/Tables/finance/invoices.md) | `currency`, `document_file_id`, `grand_total`, `id`, `invoice_number`, `issued_at`, `order_id`, `row_version`, `status`, `subtotal`, `tax_total` | None | Finance_Payments | API-029 |
| [`fulfillment.fulfillment_orders`](../../04-Database/Tables/fulfillment/fulfillment_orders.md) | `id`, `order_id`, `order_revision_id`, `row_version`, `status`, `warehouse_id` | None | Store_Operations | API-027 |
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | `delivered_at`, `dispatched_at`, `estimated_delivery_at`, `id`, `order_id`, `order_revision_id`, `row_version`, `status` | None | Delivery_Operations | API-031 |
| [`payment.refunds`](../../04-Database/Tables/payment/refunds.md) | `amount`, `created_at`, `id`, `order_id`, `order_revision_id`, `row_version`, `status` | None | Finance_Payments | API-030 |
| [`platform.file_access_grants`](../../04-Database/Tables/platform/file_access_grants.md) | `expires_at`, `file_object_id`, `id`, `row_version` | None | Shared platform file service — engineering owner; no clinical write grant | API-029 |
| [`platform.file_objects`](../../04-Database/Tables/platform/file_objects.md) | `access_type`, `classification`, `id`, `is_deleted`, `malware_scan_status`, `owner_id`, `owner_type`, `row_version`, `sha256`, `size_bytes`, `status` | None | Shared platform file service — engineering owner; no clinical write grant | API-029 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`commerce.cancellation_reason_codes`](../../04-Database/Tables/commerce/cancellation_reason_codes.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`commerce.return_reason_codes`](../../04-Database/Tables/commerce/return_reason_codes.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`platform.file_access_grants`](../../04-Database/Tables/platform/file_access_grants.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
