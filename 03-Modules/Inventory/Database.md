# Inventory database contract

**Structure validated; business write assignment Proposed.** Lots, balances, movement ledger, holds and adjustments; stores/warehouses supply evidence and request movements. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

| Table | Classification | Write-owner approval |
| --- | --- | --- |
| [`warehouse.cycle_count_items`](../../04-Database/Tables/warehouse/cycle_count_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`warehouse.cycle_counts`](../../04-Database/Tables/warehouse/cycle_counts.md) | Transactional | D-024; SQL grants reviewed independently |
| [`warehouse.inventory_adjustment_items`](../../04-Database/Tables/warehouse/inventory_adjustment_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`warehouse.inventory_adjustments`](../../04-Database/Tables/warehouse/inventory_adjustments.md) | Transactional | D-024; SQL grants reviewed independently |
| [`warehouse.inventory_lots`](../../04-Database/Tables/warehouse/inventory_lots.md) | Transactional | D-024; SQL grants reviewed independently |
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | Derived / Operational | D-024; SQL grants reviewed independently |
| [`warehouse.stock_holds`](../../04-Database/Tables/warehouse/stock_holds.md) | Transactional | D-024; SQL grants reviewed independently |
| [`warehouse.stock_ledger`](../../04-Database/Tables/warehouse/stock_ledger.md) | Audit / History | D-024; SQL grants reviewed independently |
| [`warehouse.stock_movement_reason_codes`](../../04-Database/Tables/warehouse/stock_movement_reason_codes.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`warehouse.stock_reservations`](../../04-Database/Tables/warehouse/stock_reservations.md) | Transactional | D-024; SQL grants reviewed independently |

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | `id`, `is_deleted`, `row_version`, `status` | None | Product_Catalog | API-052 |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `review_id`, `row_version` | None | Pharmacist_Review | API-052 |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | None | Pharmacist_Review | API-052 |
| [`commerce.order_items`](../../04-Database/Tables/commerce/order_items.md) | `id`, `order_id`, `prescription_id`, `product_id`, `row_version`, `status` | None | Order_Operations | API-052 |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | `id`, `order_id`, `status` | None | Order_Operations | API-052 |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | `current_revision_id`, `id`, `internal_id`, `patient_profile_id`, `row_version`, `status`, `user_id` | None | Order_Operations | API-052 |
| [`organization.licenses`](../../04-Database/Tables/organization/licenses.md) | `expires_at`, `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `verification_status` | None | Admin_CMS | API-052 |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `is_active`, `is_deleted`, `organization_id`, `row_version` | None | Admin_CMS | API-052 |
| [`warehouse.inventory_adjustment_items`](../../04-Database/Tables/warehouse/inventory_adjustment_items.md) | None | `adjustment_id`, `bin_id`, `lot_id`, `notes`, `quantity_delta` | Inventory | API-054 |
| [`warehouse.inventory_adjustments`](../../04-Database/Tables/warehouse/inventory_adjustments.md) | None | `adjustment_number`, `reason_code`, `requested_by_user_id`, `status`, `warehouse_id` | Inventory | API-054 |
| [`warehouse.inventory_lots`](../../04-Database/Tables/warehouse/inventory_lots.md) | `batch_number`, `expires_at`, `id`, `product_id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | None | Inventory | API-050, API-051, API-052, API-054, API-055 |
| [`warehouse.replenishment_rules`](../../04-Database/Tables/warehouse/replenishment_rules.md) | `id`, `is_active`, `is_deleted`, `row_version`, `warehouse_id` | None | Warehouse | API-055 |
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | `bin_id`, `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `lot_id`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | `inventory_observed_at`, `inventory_observed_by_user_id`, `inventory_source`, `reserved_qty` | Inventory | API-050, API-051, API-052, API-053, API-054, API-055 |
| [`warehouse.stock_holds`](../../04-Database/Tables/warehouse/stock_holds.md) | `id`, `lot_id`, `row_version`, `status`, `warehouse_id` | None | Inventory | API-052 |
| [`warehouse.stock_movement_reason_codes`](../../04-Database/Tables/warehouse/stock_movement_reason_codes.md) | `id`, `is_active`, `row_version` | None | Inventory | API-053, API-054 |
| [`warehouse.stock_reservations`](../../04-Database/Tables/warehouse/stock_reservations.md) | `expires_at`, `id`, `lot_id`, `order_id`, `order_item_id`, `order_revision_id`, `quantity`, `reservation_number`, `row_version`, `status`, `warehouse_id` | `bin_id`, `expires_at`, `lot_id`, `order_id`, `order_item_id`, `order_revision_id`, `quantity`, `released_at`, `reservation_number`, `status`, `warehouse_id` | Inventory | API-052, API-053 |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | None | Warehouse | API-050, API-051, API-052 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`warehouse.replenishment_rules`](../../04-Database/Tables/warehouse/replenishment_rules.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`warehouse.stock_movement_reason_codes`](../../04-Database/Tables/warehouse/stock_movement_reason_codes.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
