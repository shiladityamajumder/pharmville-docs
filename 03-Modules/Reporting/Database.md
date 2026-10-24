# Reporting database contract

**Structure validated; business write assignment Proposed.** Report definitions, runs and scoped read-only outputs; source domains own data and correction commands. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

| Table | Classification | Write-owner approval |
| --- | --- | --- |
| [`platform.report_definitions`](../../04-Database/Tables/platform/report_definitions.md) | Configuration | D-024; SQL grants reviewed independently |
| [`platform.report_runs`](../../04-Database/Tables/platform/report_runs.md) | Derived / Operational | D-024; SQL grants reviewed independently |

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | None | Order_Operations | API-082, API-083 |
| [`finance.invoice_items`](../../04-Database/Tables/finance/invoice_items.md) | `hsn_code`, `id`, `invoice_id`, `line_total`, `order_item_id`, `row_version`, `tax_amount`, `tax_rate` | None | Finance_Payments | API-083 |
| [`finance.invoices`](../../04-Database/Tables/finance/invoices.md) | `currency`, `grand_total`, `id`, `issued_at`, `order_id`, `row_version`, `status`, `subtotal`, `tax_total` | None | Finance_Payments | API-082, API-083 |
| [`fulfillment.fulfillment_orders`](../../04-Database/Tables/fulfillment/fulfillment_orders.md) | `id`, `order_id`, `order_revision_id`, `row_version`, `status`, `warehouse_id` | None | Store_Operations | API-085 |
| [`fulfillment.packages`](../../04-Database/Tables/fulfillment/packages.md) | `fulfillment_order_id`, `id`, `row_version`, `status` | None | Store_Operations | API-085 |
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | `delivered_at`, `dispatched_at`, `estimated_delivery_at`, `id`, `order_id`, `order_revision_id`, `package_id`, `row_version`, `status` | None | Delivery_Operations | API-085 |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `id`, `location_id`, `organization_id`, `row_version`, `status`, `user_id` | None | Admin_CMS | API-086 |
| [`platform.report_definitions`](../../04-Database/Tables/platform/report_definitions.md) | `code`, `id`, `is_active` | None | Reporting | API-082, API-083, API-084, API-085, API-086 |
| [`platform.report_runs`](../../04-Database/Tables/platform/report_runs.md) | None | `definition_id`, `parameters`, `requested_at`, `requested_by_user_id`, `status` | Reporting | API-086 |
| [`warehouse.inventory_lots`](../../04-Database/Tables/warehouse/inventory_lots.md) | `batch_number`, `expires_at`, `id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | None | Inventory | API-084 |
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | `bin_id`, `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `lot_id`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | None | Inventory | API-084 |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `status` | None | Warehouse | API-084 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`platform.report_definitions`](../../04-Database/Tables/platform/report_definitions.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
