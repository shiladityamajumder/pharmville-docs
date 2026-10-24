# Cart Checkout database contract

**Structure validated; business write assignment Proposed.** Cart and checkout intent; Order Management owns orders, Inventory owns holds, Payments owns monetary truth. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

| Table | Classification | Write-owner approval |
| --- | --- | --- |
| [`commerce.cart_items`](../../04-Database/Tables/commerce/cart_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`commerce.carts`](../../04-Database/Tables/commerce/carts.md) | Transactional | D-024; SQL grants reviewed independently |
| [`commerce.checkouts`](../../04-Database/Tables/commerce/checkouts.md) | Transactional | D-024; SQL grants reviewed independently |

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md) | `id`, `is_active`, `row_version` | None | Product_Catalog | API-020 |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | `commerce_class`, `id`, `is_deleted`, `row_version`, `status` | None | Product_Catalog | API-018, API-019, API-020, API-021 |
| [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md) | `family_member_id`, `id`, `is_deleted`, `row_version`, `user_id` | None | Prescription_Upload | API-020, API-021 |
| [`commerce.cart_items`](../../04-Database/Tables/commerce/cart_items.md) | `cart_id`, `id`, `prescription_id`, `product_id`, `quantity`, `row_version`, `unit_price_snapshot` | `cart_id`, `product_id`, `quantity`, `unit_price_snapshot` | Cart_Checkout | API-018, API-019, API-020, API-021 |
| [`commerce.carts`](../../04-Database/Tables/commerce/carts.md) | `currency`, `expires_at`, `id`, `merged_into_cart_id`, `row_version`, `status`, `user_id` | `currency`, `status`, `user_id` | Cart_Checkout | API-018, API-019, API-020, API-021 |
| [`commerce.checkouts`](../../04-Database/Tables/commerce/checkouts.md) | None | `address_id`, `cart_id`, `checkout_number`, `expires_at`, `idempotency_key`, `inventory_snapshot`, `prescription_snapshot`, `pricing_snapshot`, `serviceability_snapshot`, `status`, `user_id` | Cart_Checkout | API-021 |
| [`commerce.order_items`](../../04-Database/Tables/commerce/order_items.md) | None | `commerce_class_snapshot`, `commerce_class_version_snapshot`, `discount_amount`, `line_total`, `order_id`, `product_id`, `product_snapshot`, `quantity`, `status`, `tax_amount`, `unit_mrp`, `unit_price` | Order_Operations | API-021 |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | None | `accepted_at`, `accepted_by_user_id`, `currency`, `discount_total`, `grand_total`, `line_items_snapshot`, `order_id`, `other_charges_total`, `price_snapshot`, `quote_hash`, `revision_number`, `shipping_snapshot`, `shipping_total`, `status`, `subtotal`, `tax_total` | Order_Operations | API-021 |
| [`commerce.order_status_history`](../../04-Database/Tables/commerce/order_status_history.md) | None | `changed_at`, `changed_by_user_id`, `from_status`, `order_id`, `reason_code`, `to_status` | Order_Operations | API-021 |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | None | `checkout_id`, `currency`, `current_revision_id`, `discount_total`, `grand_total`, `order_number`, `other_charges_total`, `patient_profile_id`, `shipping_address_snapshot`, `shipping_total`, `source_channel`, `status`, `subtotal`, `tax_total`, `user_id` | Order_Operations | API-021 |
| [`customer.addresses`](../../04-Database/Tables/customer/addresses.md) | `id`, `is_deleted`, `row_version`, `user_id` | None | Customer_Accounts | API-020, API-021 |
| [`customer.family_members`](../../04-Database/Tables/customer/family_members.md) | `customer_user_id`, `id`, `is_deleted`, `row_version` | None | Customer_Accounts | API-020 |
| [`logistics.serviceability_rules`](../../04-Database/Tables/logistics/serviceability_rules.md) | `id`, `is_deleted`, `row_version` | None | Delivery_Operations | API-020 |
| [`platform.application_settings`](../../04-Database/Tables/platform/application_settings.md) | `id`, `is_deleted`, `row_version` | None | Admin_CMS | API-020 |
| [`pricing.coupon_codes`](../../04-Database/Tables/pricing/coupon_codes.md) | `id`, `is_active`, `is_deleted`, `promotion_id`, `row_version`, `valid_from`, `valid_until` | None | Product_Catalog | API-020 |
| [`pricing.price_books`](../../04-Database/Tables/pricing/price_books.md) | `id`, `is_deleted`, `row_version`, `status`, `valid_from`, `valid_until`, `warehouse_id` | None | Product_Catalog | API-020 |
| [`pricing.product_prices`](../../04-Database/Tables/pricing/product_prices.md) | `id`, `price_book_id`, `product_id`, `row_version`, `selling_price`, `valid_from`, `valid_until` | None | Product_Catalog | API-020 |
| [`pricing.promotion_redemptions`](../../04-Database/Tables/pricing/promotion_redemptions.md) | `coupon_code_id`, `id`, `order_id`, `promotion_id`, `promotion_version_id`, `user_id` | None | Product_Catalog | API-020 |
| [`pricing.promotion_versions`](../../04-Database/Tables/pricing/promotion_versions.md) | `id`, `promotion_id`, `row_version` | None | Product_Catalog | API-020 |
| [`pricing.promotions`](../../04-Database/Tables/pricing/promotions.md) | `id`, `is_deleted`, `row_version`, `status` | None | Product_Catalog | API-020 |
| [`pricing.tax_rules`](../../04-Database/Tables/pricing/tax_rules.md) | `id`, `is_deleted`, `row_version`, `valid_from`, `valid_until` | None | Finance_Payments | API-020 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`customer.family_members`](../../04-Database/Tables/customer/family_members.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`logistics.serviceability_rules`](../../04-Database/Tables/logistics/serviceability_rules.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`platform.application_settings`](../../04-Database/Tables/platform/application_settings.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`pricing.coupon_codes`](../../04-Database/Tables/pricing/coupon_codes.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`pricing.price_books`](../../04-Database/Tables/pricing/price_books.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`pricing.product_prices`](../../04-Database/Tables/pricing/product_prices.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`pricing.promotions`](../../04-Database/Tables/pricing/promotions.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`pricing.tax_rules`](../../04-Database/Tables/pricing/tax_rules.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
