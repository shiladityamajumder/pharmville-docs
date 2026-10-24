# Store Operations database contract

**Structure validated; business write assignment Proposed.** Store pick/pack and preparation tasks; Inventory commits stock and Delivery owns custody after handoff. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

| Table | Classification | Write-owner approval |
| --- | --- | --- |
| [`fulfillment.fulfillment_events`](../../04-Database/Tables/fulfillment/fulfillment_events.md) | Audit / History | D-024; SQL grants reviewed independently |
| [`fulfillment.fulfillment_order_items`](../../04-Database/Tables/fulfillment/fulfillment_order_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`fulfillment.fulfillment_orders`](../../04-Database/Tables/fulfillment/fulfillment_orders.md) | Transactional | D-024; SQL grants reviewed independently |
| [`fulfillment.pack_tasks`](../../04-Database/Tables/fulfillment/pack_tasks.md) | Transactional | D-024; SQL grants reviewed independently |
| [`fulfillment.package_items`](../../04-Database/Tables/fulfillment/package_items.md) | Mapping / Junction | D-024; SQL grants reviewed independently |
| [`fulfillment.packages`](../../04-Database/Tables/fulfillment/packages.md) | Transactional | D-024; SQL grants reviewed independently |
| [`fulfillment.pick_task_items`](../../04-Database/Tables/fulfillment/pick_task_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`fulfillment.pick_tasks`](../../04-Database/Tables/fulfillment/pick_tasks.md) | Transactional | D-024; SQL grants reviewed independently |
| [`fulfillment.picking_wave_orders`](../../04-Database/Tables/fulfillment/picking_wave_orders.md) | Mapping / Junction | D-024; SQL grants reviewed independently |
| [`fulfillment.picking_waves`](../../04-Database/Tables/fulfillment/picking_waves.md) | Derived / Operational | D-024; SQL grants reviewed independently |

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`catalog.product_identifiers`](../../04-Database/Tables/catalog/product_identifiers.md) | `id`, `row_version` | None | Product_Catalog | API-046 |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | `id`, `is_deleted`, `row_version`, `status` | None | Product_Catalog | API-048 |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `review_id`, `row_version` | None | Pharmacist_Review | API-045, API-046, API-047 |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | None | Pharmacist_Review | API-045, API-046, API-047 |
| [`commerce.order_items`](../../04-Database/Tables/commerce/order_items.md) | `id`, `order_id`, `prescription_id`, `row_version`, `status` | None | Order_Operations | API-047 |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | `id`, `order_id`, `status` | None | Order_Operations | API-045, API-046, API-047 |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | `current_revision_id`, `id`, `internal_id`, `patient_profile_id`, `row_version`, `status`, `user_id` | None | Order_Operations | API-045, API-046, API-047 |
| [`fulfillment.fulfillment_events`](../../04-Database/Tables/fulfillment/fulfillment_events.md) | None | `actor_user_id`, `event_type`, `fulfillment_order_id`, `payload` | Store_Operations | API-045, API-046, API-047 |
| [`fulfillment.fulfillment_orders`](../../04-Database/Tables/fulfillment/fulfillment_orders.md) | `id`, `order_id`, `order_revision_id`, `priority`, `row_version`, `status`, `warehouse_id` | `status` | Store_Operations | API-044, API-045, API-046, API-047 |
| [`fulfillment.pack_tasks`](../../04-Database/Tables/fulfillment/pack_tasks.md) | `assigned_to_user_id`, `fulfillment_order_id`, `id`, `row_version`, `status` | `completed_at`, `fulfillment_order_id`, `started_at`, `status` | Store_Operations | API-045, API-047 |
| [`fulfillment.package_items`](../../04-Database/Tables/fulfillment/package_items.md) | `id`, `lot_id`, `order_item_id`, `package_id`, `quantity`, `row_version` | `lot_id`, `order_item_id`, `package_id`, `quantity` | Store_Operations | API-047 |
| [`fulfillment.packages`](../../04-Database/Tables/fulfillment/packages.md) | `fulfillment_order_id`, `id`, `pack_task_id`, `package_number`, `row_version`, `status`, `tamper_seal_number`, `weight_grams` | `dimensions_json`, `fulfillment_order_id`, `pack_task_id`, `package_number`, `packed_at`, `packed_by_user_id`, `status`, `tamper_seal_number`, `temperature_controlled`, `weight_grams` | Store_Operations | API-047 |
| [`fulfillment.pick_task_items`](../../04-Database/Tables/fulfillment/pick_task_items.md) | `bin_id`, `id`, `lot_id`, `order_item_id`, `pick_task_id`, `picked_qty`, `required_qty`, `row_version` | `bin_id`, `lot_id`, `order_item_id`, `pick_task_id`, `picked_qty`, `required_qty` | Store_Operations | API-045, API-046, API-047 |
| [`fulfillment.pick_tasks`](../../04-Database/Tables/fulfillment/pick_tasks.md) | `assigned_to_user_id`, `fulfillment_order_id`, `id`, `row_version`, `status` | `assigned_to_user_id`, `completed_at`, `fulfillment_order_id`, `started_at`, `status` | Store_Operations | API-045, API-046, API-047 |
| [`organization.licenses`](../../04-Database/Tables/organization/licenses.md) | `expires_at`, `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `verification_status` | None | Admin_CMS | API-045, API-046, API-047 |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `id`, `location_id`, `organization_id`, `row_version`, `status`, `user_id` | None | Admin_CMS | API-044 |
| [`procurement.purchase_requisition_items`](../../04-Database/Tables/procurement/purchase_requisition_items.md) | None | `product_id`, `requested_qty`, `requisition_id` | Warehouse | API-048 |
| [`procurement.purchase_requisitions`](../../04-Database/Tables/procurement/purchase_requisitions.md) | None | `priority`, `requested_by_user_id`, `required_by`, `requisition_number`, `status`, `warehouse_id` | Warehouse | API-048 |
| [`warehouse.inventory_lots`](../../04-Database/Tables/warehouse/inventory_lots.md) | `batch_number`, `expires_at`, `id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | None | Inventory | API-046, API-049 |
| [`warehouse.replenishment_rules`](../../04-Database/Tables/warehouse/replenishment_rules.md) | `id`, `is_active`, `is_deleted`, `product_id`, `row_version`, `warehouse_id` | None | Warehouse | API-048 |
| [`warehouse.stock_reservations`](../../04-Database/Tables/warehouse/stock_reservations.md) | `expires_at`, `id`, `lot_id`, `order_id`, `order_item_id`, `order_revision_id`, `quantity`, `row_version`, `status`, `warehouse_id` | None | Inventory | API-045, API-046, API-047 |
| [`warehouse.stock_transfer_items`](../../04-Database/Tables/warehouse/stock_transfer_items.md) | `id`, `lot_id`, `received_qty`, `row_version`, `transfer_id` | `received_qty` | Warehouse | API-049 |
| [`warehouse.stock_transfers`](../../04-Database/Tables/warehouse/stock_transfers.md) | `destination_warehouse_id`, `dispatched_at`, `id`, `received_at`, `row_version`, `source_warehouse_id`, `status`, `transfer_number` | `received_at`, `status` | Warehouse | API-049 |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | None | Warehouse | API-044, API-048 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`catalog.product_identifiers`](../../04-Database/Tables/catalog/product_identifiers.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`fulfillment.package_items`](../../04-Database/Tables/fulfillment/package_items.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`warehouse.replenishment_rules`](../../04-Database/Tables/warehouse/replenishment_rules.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
