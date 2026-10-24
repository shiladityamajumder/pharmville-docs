# Warehouse database contract

**Structure validated; business write assignment Proposed.** Warehouse geometry, receiving and transfers/procurement; Inventory owns stock ledger and balances. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

| Table | Classification | Write-owner approval |
| --- | --- | --- |
| [`procurement.goods_receipt_items`](../../04-Database/Tables/procurement/goods_receipt_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`procurement.goods_receipt_quality_checks`](../../04-Database/Tables/procurement/goods_receipt_quality_checks.md) | Transactional | D-024; SQL grants reviewed independently |
| [`procurement.goods_receipts`](../../04-Database/Tables/procurement/goods_receipts.md) | Transactional | D-024; SQL grants reviewed independently |
| [`procurement.purchase_order_items`](../../04-Database/Tables/procurement/purchase_order_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`procurement.purchase_orders`](../../04-Database/Tables/procurement/purchase_orders.md) | Transactional | D-024; SQL grants reviewed independently |
| [`procurement.purchase_requisition_items`](../../04-Database/Tables/procurement/purchase_requisition_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`procurement.purchase_requisitions`](../../04-Database/Tables/procurement/purchase_requisitions.md) | Transactional | D-024; SQL grants reviewed independently |
| [`procurement.purchase_return_items`](../../04-Database/Tables/procurement/purchase_return_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`procurement.purchase_returns`](../../04-Database/Tables/procurement/purchase_returns.md) | Transactional | D-024; SQL grants reviewed independently |
| [`procurement.supplier_invoices`](../../04-Database/Tables/procurement/supplier_invoices.md) | Transactional | D-024; SQL grants reviewed independently |
| [`procurement.supplier_licenses`](../../04-Database/Tables/procurement/supplier_licenses.md) | Transactional | D-024; SQL grants reviewed independently |
| [`procurement.supplier_products`](../../04-Database/Tables/procurement/supplier_products.md) | Mapping / Junction | D-024; SQL grants reviewed independently |
| [`procurement.suppliers`](../../04-Database/Tables/procurement/suppliers.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`warehouse.aisles`](../../04-Database/Tables/warehouse/aisles.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`warehouse.bins`](../../04-Database/Tables/warehouse/bins.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`warehouse.racks`](../../04-Database/Tables/warehouse/racks.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`warehouse.replenishment_rules`](../../04-Database/Tables/warehouse/replenishment_rules.md) | Configuration | D-024; SQL grants reviewed independently |
| [`warehouse.stock_transfer_items`](../../04-Database/Tables/warehouse/stock_transfer_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`warehouse.stock_transfers`](../../04-Database/Tables/warehouse/stock_transfers.md) | Transactional | D-024; SQL grants reviewed independently |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`warehouse.zones`](../../04-Database/Tables/warehouse/zones.md) | Master / Reference | D-024; SQL grants reviewed independently |

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`commerce.order_allocations`](../../04-Database/Tables/commerce/order_allocations.md) | `id`, `order_item_id`, `row_version`, `status`, `warehouse_id` | None | Order_Operations | API-059 |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | `id`, `order_id`, `status` | None | Order_Operations | API-059 |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | `currency`, `current_revision_id`, `fulfillment_status`, `grand_total`, `id`, `internal_id`, `order_number`, `patient_profile_id`, `payment_status`, `placed_at`, `prescription_status`, `row_version`, `status`, `user_id` | None | Order_Operations | API-059 |
| [`organization.licenses`](../../04-Database/Tables/organization/licenses.md) | `expires_at`, `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `verification_status` | None | Admin_CMS | API-058 |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `is_active`, `is_deleted`, `organization_id`, `row_version` | None | Admin_CMS | API-059 |
| [`procurement.goods_receipt_items`](../../04-Database/Tables/procurement/goods_receipt_items.md) | None | `accepted_qty`, `batch_number`, `expiry_date`, `goods_receipt_id`, `mrp`, `purchase_order_item_id`, `quality_status`, `received_qty`, `rejected_qty`, `unit_cost` | Warehouse | API-056 |
| [`procurement.goods_receipt_quality_checks`](../../04-Database/Tables/procurement/goods_receipt_quality_checks.md) | None | `check_type`, `checked_at`, `checked_by_user_id`, `goods_receipt_item_id`, `observations`, `result` | Warehouse | API-056 |
| [`procurement.goods_receipts`](../../04-Database/Tables/procurement/goods_receipts.md) | None | `grn_number`, `purchase_order_id`, `received_at`, `received_by_user_id`, `status`, `supplier_invoice_id`, `warehouse_id` | Warehouse | API-056 |
| [`procurement.purchase_order_items`](../../04-Database/Tables/procurement/purchase_order_items.md) | `id`, `purchase_order_id`, `row_version` | None | Warehouse | API-056 |
| [`procurement.purchase_orders`](../../04-Database/Tables/procurement/purchase_orders.md) | `id`, `row_version`, `status`, `supplier_id`, `warehouse_id` | None | Warehouse | API-056 |
| [`procurement.purchase_requisition_items`](../../04-Database/Tables/procurement/purchase_requisition_items.md) | `id`, `requisition_id`, `row_version` | None | Warehouse | API-057 |
| [`procurement.purchase_requisitions`](../../04-Database/Tables/procurement/purchase_requisitions.md) | `id`, `requisition_number`, `row_version`, `status`, `warehouse_id` | None | Warehouse | API-057 |
| [`procurement.supplier_invoices`](../../04-Database/Tables/procurement/supplier_invoices.md) | `id`, `purchase_order_id`, `row_version`, `status`, `supplier_id` | None | Warehouse | API-056 |
| [`procurement.suppliers`](../../04-Database/Tables/procurement/suppliers.md) | `id`, `is_deleted`, `organization_id`, `row_version`, `status` | None | Warehouse | API-056 |
| [`warehouse.inventory_lots`](../../04-Database/Tables/warehouse/inventory_lots.md) | `batch_number`, `expires_at`, `id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | None | Inventory | API-049, API-058 |
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `lot_id`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | None | Inventory | API-058 |
| [`warehouse.stock_transfer_items`](../../04-Database/Tables/warehouse/stock_transfer_items.md) | `dispatched_qty`, `id`, `lot_id`, `received_qty`, `row_version`, `transfer_id` | `dispatched_qty`, `received_qty` | Warehouse | API-049, API-058 |
| [`warehouse.stock_transfers`](../../04-Database/Tables/warehouse/stock_transfers.md) | `destination_warehouse_id`, `dispatched_at`, `id`, `received_at`, `row_version`, `source_warehouse_id`, `status`, `transfer_number` | `dispatched_at`, `received_at`, `status` | Warehouse | API-049, API-058 |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | None | Warehouse | API-056, API-057, API-059 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`procurement.suppliers`](../../04-Database/Tables/procurement/suppliers.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
