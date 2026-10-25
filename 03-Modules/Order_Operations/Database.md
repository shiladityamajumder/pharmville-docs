# Order Management database contract

**Structure validated; business write assignment Proposed.** Order aggregate, revisions and orchestration; consumers request commands rather than directly mutating order state. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

| Table | Classification | Write-owner approval |
| --- | --- | --- |
| [`commerce.cancellation_items`](../../04-Database/Tables/commerce/cancellation_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`commerce.cancellation_reason_codes`](../../04-Database/Tables/commerce/cancellation_reason_codes.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`commerce.cancellations`](../../04-Database/Tables/commerce/cancellations.md) | Transactional | D-024; SQL grants reviewed independently |
| [`commerce.order_allocations`](../../04-Database/Tables/commerce/order_allocations.md) | Transactional | D-024; SQL grants reviewed independently |
| [`commerce.order_charges`](../../04-Database/Tables/commerce/order_charges.md) | Transactional | D-024; SQL grants reviewed independently |
| [`commerce.order_discounts`](../../04-Database/Tables/commerce/order_discounts.md) | Transactional | D-024; SQL grants reviewed independently |
| [`commerce.order_groups`](../../04-Database/Tables/commerce/order_groups.md) | Transactional | D-024; SQL grants reviewed independently |
| [`commerce.order_items`](../../04-Database/Tables/commerce/order_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | Transactional | D-024; SQL grants reviewed independently |
| [`commerce.order_status_history`](../../04-Database/Tables/commerce/order_status_history.md) | Audit / History | D-024; SQL grants reviewed independently |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | Transactional | D-024; SQL grants reviewed independently |
| [`commerce.return_items`](../../04-Database/Tables/commerce/return_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`commerce.return_reason_codes`](../../04-Database/Tables/commerce/return_reason_codes.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`commerce.returns`](../../04-Database/Tables/commerce/returns.md) | Transactional | D-024; SQL grants reviewed independently |

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | `id`, `is_deleted`, `row_version`, `status` | None | Product_Catalog | API-043 |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `review_id`, `row_version` | None | Pharmacist_Review | API-041, API-042, API-063 |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | None | Pharmacist_Review | API-041, API-042, API-063 |
| [`commerce.cancellation_items`](../../04-Database/Tables/commerce/cancellation_items.md) | None | `cancellation_id`, `order_item_id`, `quantity` | Order_Operations | API-027 |
| [`commerce.cancellation_reason_codes`](../../04-Database/Tables/commerce/cancellation_reason_codes.md) | `id`, `is_active`, `row_version` | None | Order_Operations | API-027 |
| [`commerce.cancellations`](../../04-Database/Tables/commerce/cancellations.md) | None | `order_id`, `reason_code`, `reason_text`, `requested_by_user_id`, `status` | Order_Operations | API-027 |
| [`commerce.order_allocations`](../../04-Database/Tables/commerce/order_allocations.md) | `id`, `order_item_id`, `row_version`, `status`, `warehouse_id` | `allocated_qty`, `order_item_id`, `reservation_id`, `status`, `warehouse_id` | Order_Operations | API-039, API-040, API-041, API-042 |
| [`commerce.order_items`](../../04-Database/Tables/commerce/order_items.md) | `commerce_class_snapshot`, `id`, `line_total`, `order_id`, `prescription_id`, `product_id`, `quantity`, `row_version`, `status`, `tax_amount`, `unit_price` | `commerce_class_snapshot`, `commerce_class_version_snapshot`, `discount_amount`, `line_total`, `quantity`, `tax_amount`, `unit_price` | Order_Operations | API-027, API-028, API-040, API-041, API-042, API-043, API-063 |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | `accepted_at`, `currency`, `grand_total`, `id`, `order_id`, `revision_number`, `status` | `accepted_at`, `accepted_by_user_id`, `currency`, `discount_total`, `grand_total`, `line_items_snapshot`, `order_id`, `other_charges_total`, `price_snapshot`, `quote_hash`, `revision_number`, `shipping_snapshot`, `shipping_total`, `status`, `subtotal`, `tax_total` | Order_Operations | API-040, API-041, API-042, API-043, API-063 |
| [`commerce.order_status_history`](../../04-Database/Tables/commerce/order_status_history.md) | None | `changed_at`, `changed_by_user_id`, `from_status`, `order_id`, `reason_code`, `to_status` | Order_Operations | API-027, API-042, API-063 |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | `currency`, `current_revision_id`, `fulfillment_status`, `grand_total`, `id`, `internal_id`, `order_number`, `patient_profile_id`, `payment_status`, `placed_at`, `prescription_status`, `row_version`, `shipping_address_snapshot`, `status`, `user_id` | `cancelled_at`, `current_revision_id`, `discount_total`, `fulfillment_status`, `grand_total`, `other_charges_total`, `prescription_status`, `shipping_total`, `status`, `subtotal`, `tax_total` | Order_Operations | API-027, API-028, API-039, API-040, API-041, API-042, API-043, API-063 |
| [`commerce.return_items`](../../04-Database/Tables/commerce/return_items.md) | `id`, `order_item_id`, `quantity`, `return_id`, `row_version` | `order_item_id`, `quantity`, `resolution`, `return_id` | Order_Operations | API-028 |
| [`commerce.return_reason_codes`](../../04-Database/Tables/commerce/return_reason_codes.md) | `id`, `is_active`, `row_version` | None | Order_Operations | API-028 |
| [`commerce.returns`](../../04-Database/Tables/commerce/returns.md) | `id`, `order_id`, `pickup_required`, `reason_code`, `reason_code_id`, `requested_at`, `return_number`, `row_version`, `status`, `user_id` | `order_id`, `pickup_required`, `reason_code`, `requested_at`, `return_number`, `status`, `user_id` | Order_Operations | API-028 |
| [`fulfillment.fulfillment_orders`](../../04-Database/Tables/fulfillment/fulfillment_orders.md) | `id`, `order_id`, `order_revision_id`, `row_version`, `status`, `warehouse_id` | `fulfillment_number`, `order_id`, `order_revision_id`, `status`, `warehouse_id` | Store_Operations | API-027, API-041, API-042 |
| [`logistics.serviceability_rules`](../../04-Database/Tables/logistics/serviceability_rules.md) | `id`, `is_deleted`, `row_version` | None | Delivery_Operations | API-041, API-042 |
| [`organization.licenses`](../../04-Database/Tables/organization/licenses.md) | `expires_at`, `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `verification_status` | None | Admin_CMS | API-041, API-042 |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `is_active`, `is_deleted`, `organization_id`, `row_version` | None | Admin_CMS | API-041, API-042 |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `id`, `location_id`, `organization_id`, `row_version`, `status`, `user_id` | None | Admin_CMS | API-039 |
| [`pricing.product_prices`](../../04-Database/Tables/pricing/product_prices.md) | `id`, `product_id`, `row_version`, `valid_from`, `valid_until` | None | Product_Catalog | API-043 |
| [`pricing.tax_rules`](../../04-Database/Tables/pricing/tax_rules.md) | `id`, `is_deleted`, `row_version`, `valid_from`, `valid_until` | None | Finance_Payments | API-043 |
| [`warehouse.inventory_lots`](../../04-Database/Tables/warehouse/inventory_lots.md) | `batch_number`, `expires_at`, `id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | None | Inventory | API-041, API-042 |
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `lot_id`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | None | Inventory | API-041, API-042 |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | None | Warehouse | API-039, API-040, API-041, API-042 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`commerce.cancellation_reason_codes`](../../04-Database/Tables/commerce/cancellation_reason_codes.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`commerce.return_reason_codes`](../../04-Database/Tables/commerce/return_reason_codes.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`logistics.serviceability_rules`](../../04-Database/Tables/logistics/serviceability_rules.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`pricing.product_prices`](../../04-Database/Tables/pricing/product_prices.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`pricing.tax_rules`](../../04-Database/Tables/pricing/tax_rules.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
