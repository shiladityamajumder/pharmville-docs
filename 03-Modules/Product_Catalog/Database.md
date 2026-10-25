# Product Catalog database contract

**Structure validated; business write assignment Proposed.** Catalog/classification and discovery; tax meaning remains Finance-owned and search is derived. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

| Table | Classification | Write-owner approval |
| --- | --- | --- |
| [`catalog.brands`](../../04-Database/Tables/catalog/brands.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`catalog.categories`](../../04-Database/Tables/catalog/categories.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`catalog.dosage_forms`](../../04-Database/Tables/catalog/dosage_forms.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`catalog.manufacturers`](../../04-Database/Tables/catalog/manufacturers.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`catalog.product_attributes`](../../04-Database/Tables/catalog/product_attributes.md) | Configuration | D-024; SQL grants reviewed independently |
| [`catalog.product_classification_history`](../../04-Database/Tables/catalog/product_classification_history.md) | Audit / History | D-024; SQL grants reviewed independently |
| [`catalog.product_content`](../../04-Database/Tables/catalog/product_content.md) | Configuration | D-024; SQL grants reviewed independently |
| [`catalog.product_identifiers`](../../04-Database/Tables/catalog/product_identifiers.md) | Mapping / Junction | D-024; SQL grants reviewed independently |
| [`catalog.product_media`](../../04-Database/Tables/catalog/product_media.md) | Mapping / Junction | D-024; SQL grants reviewed independently |
| [`catalog.product_regulatory`](../../04-Database/Tables/catalog/product_regulatory.md) | Configuration | D-024; SQL grants reviewed independently |
| [`catalog.product_relationships`](../../04-Database/Tables/catalog/product_relationships.md) | Mapping / Junction | D-024; SQL grants reviewed independently |
| [`catalog.product_salts`](../../04-Database/Tables/catalog/product_salts.md) | Mapping / Junction | D-024; SQL grants reviewed independently |
| [`catalog.product_variants`](../../04-Database/Tables/catalog/product_variants.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`catalog.salts`](../../04-Database/Tables/catalog/salts.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`catalog.substitution_group_products`](../../04-Database/Tables/catalog/substitution_group_products.md) | Mapping / Junction | D-024; SQL grants reviewed independently |
| [`catalog.substitution_groups`](../../04-Database/Tables/catalog/substitution_groups.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`catalog.units_of_measure`](../../04-Database/Tables/catalog/units_of_measure.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`pricing.coupon_codes`](../../04-Database/Tables/pricing/coupon_codes.md) | Configuration | D-024; SQL grants reviewed independently |
| [`pricing.price_books`](../../04-Database/Tables/pricing/price_books.md) | Configuration | D-024; SQL grants reviewed independently |
| [`pricing.pricing_evaluations`](../../04-Database/Tables/pricing/pricing_evaluations.md) | Derived / Operational | D-024; SQL grants reviewed independently |
| [`pricing.product_prices`](../../04-Database/Tables/pricing/product_prices.md) | Configuration | D-024; SQL grants reviewed independently |
| [`pricing.promotion_redemptions`](../../04-Database/Tables/pricing/promotion_redemptions.md) | Transactional | D-024; SQL grants reviewed independently |
| [`pricing.promotion_versions`](../../04-Database/Tables/pricing/promotion_versions.md) | Audit / History | D-024; SQL grants reviewed independently |
| [`pricing.promotions`](../../04-Database/Tables/pricing/promotions.md) | Configuration | D-024; SQL grants reviewed independently |
| [`search.documents`](../../04-Database/Tables/search/documents.md) | Derived / Operational | D-024; SQL grants reviewed independently |
| [`search.indexing_jobs`](../../04-Database/Tables/search/indexing_jobs.md) | Derived / Operational | D-024; SQL grants reviewed independently |
| [`search.query_events`](../../04-Database/Tables/search/query_events.md) | Audit / History | D-024; SQL grants reviewed independently |
| [`search.redirects`](../../04-Database/Tables/search/redirects.md) | Configuration | D-024; SQL grants reviewed independently |
| [`search.synonyms`](../../04-Database/Tables/search/synonyms.md) | Configuration | D-024; SQL grants reviewed independently |

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`catalog.brands`](../../04-Database/Tables/catalog/brands.md) | `id`, `is_active`, `is_deleted`, `name`, `row_version` | None | Product_Catalog | API-011, API-012, API-013, API-014, API-016, API-017 |
| [`catalog.categories`](../../04-Database/Tables/catalog/categories.md) | `display_order`, `id`, `is_active`, `is_deleted`, `level`, `name`, `parent_id`, `row_version`, `slug` | None | Product_Catalog | API-010, API-011, API-012, API-013, API-014, API-016, API-017 |
| [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md) | `id`, `is_active`, `row_version` | None | Product_Catalog | API-011, API-012, API-013, API-014, API-016, API-017 |
| [`catalog.dosage_forms`](../../04-Database/Tables/catalog/dosage_forms.md) | `id`, `is_active`, `is_deleted`, `row_version` | None | Product_Catalog | API-017 |
| [`catalog.manufacturers`](../../04-Database/Tables/catalog/manufacturers.md) | `id`, `is_active`, `is_deleted`, `name`, `organization_id`, `row_version` | None | Product_Catalog | API-012, API-017 |
| [`catalog.product_classification_history`](../../04-Database/Tables/catalog/product_classification_history.md) | `id`, `new_class`, `old_class`, `product_id`, `reason_code` | `approved_at`, `approved_by_user_id`, `decision_note`, `new_class`, `old_class`, `product_id`, `reason_code`, `version` | Product_Catalog | API-016 |
| [`catalog.product_content`](../../04-Database/Tables/catalog/product_content.md) | `id`, `is_deleted`, `locale`, `product_id`, `row_version`, `title` | None | Product_Catalog | API-012 |
| [`catalog.product_salts`](../../04-Database/Tables/catalog/product_salts.md) | `id`, `product_id`, `row_version`, `salt_id`, `strength` | None | Product_Catalog | API-012, API-013 |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | `brand_id`, `category_id`, `commerce_class`, `commerce_class_approved_at`, `commerce_class_version`, `display_name`, `dosage_form_id`, `id`, `is_deleted`, `manufacturer_id`, `name`, `pack_size_display`, `prescription_required`, `published_at`, `row_version`, `status`, `strength_display` | `commerce_class`, `commerce_class_approved_at`, `commerce_class_approved_by_user_id`, `commerce_class_version`, `prescription_required`, `published_at`, `status` | Product_Catalog | API-011, API-012, API-013, API-014, API-015, API-016, API-017 |
| [`catalog.salts`](../../04-Database/Tables/catalog/salts.md) | `id`, `is_deleted`, `row_version` | None | Product_Catalog | API-012, API-013 |
| [`logistics.serviceability_rules`](../../04-Database/Tables/logistics/serviceability_rules.md) | `id`, `is_deleted`, `row_version` | None | Delivery_Operations | API-014 |
| [`organization.licenses`](../../04-Database/Tables/organization/licenses.md) | `expires_at`, `id`, `is_deleted`, `location_id`, `organization_id`, `row_version`, `verification_status` | None | Admin_CMS | API-014 |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `is_active`, `is_deleted`, `organization_id`, `postal_code`, `row_version` | None | Admin_CMS | API-014 |
| [`platform.file_objects`](../../04-Database/Tables/platform/file_objects.md) | `access_type`, `classification`, `id`, `is_deleted`, `malware_scan_status`, `owner_id`, `owner_type`, `row_version`, `sha256`, `size_bytes`, `status` | None | Shared platform file service — engineering owner; no clinical write grant | API-015 |
| [`platform.scheduled_jobs`](../../04-Database/Tables/platform/scheduled_jobs.md) | None | `job_key`, `job_type`, `next_run_at`, `payload`, `status` | Shared platform runtime — engineering owner | API-015 |
| [`pricing.price_books`](../../04-Database/Tables/pricing/price_books.md) | `id`, `is_deleted`, `row_version`, `status`, `valid_from`, `valid_until`, `warehouse_id` | None | Product_Catalog | API-012 |
| [`pricing.product_prices`](../../04-Database/Tables/pricing/product_prices.md) | `id`, `price_book_id`, `product_id`, `row_version`, `valid_from`, `valid_until` | None | Product_Catalog | API-012, API-015, API-017 |
| [`pricing.tax_rules`](../../04-Database/Tables/pricing/tax_rules.md) | `id`, `is_deleted`, `row_version`, `valid_from`, `valid_until` | None | Finance_Payments | API-017 |
| [`search.documents`](../../04-Database/Tables/search/documents.md) | `id`, `row_version` | None | Product_Catalog | API-013 |
| [`search.synonyms`](../../04-Database/Tables/search/synonyms.md) | `id`, `is_active`, `is_deleted`, `row_version` | None | Product_Catalog | API-013 |
| [`warehouse.inventory_lots`](../../04-Database/Tables/warehouse/inventory_lots.md) | `batch_number`, `expires_at`, `id`, `product_id`, `quality_status`, `recall_status`, `row_version`, `warehouse_id` | None | Inventory | API-014 |
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `lot_id`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | None | Inventory | API-014 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`catalog.brands`](../../04-Database/Tables/catalog/brands.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`catalog.categories`](../../04-Database/Tables/catalog/categories.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`catalog.commerce_classes`](../../04-Database/Tables/catalog/commerce_classes.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`catalog.dosage_forms`](../../04-Database/Tables/catalog/dosage_forms.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`catalog.manufacturers`](../../04-Database/Tables/catalog/manufacturers.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`catalog.product_content`](../../04-Database/Tables/catalog/product_content.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`catalog.product_salts`](../../04-Database/Tables/catalog/product_salts.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`catalog.salts`](../../04-Database/Tables/catalog/salts.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`logistics.serviceability_rules`](../../04-Database/Tables/logistics/serviceability_rules.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`pricing.price_books`](../../04-Database/Tables/pricing/price_books.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`pricing.product_prices`](../../04-Database/Tables/pricing/product_prices.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`pricing.tax_rules`](../../04-Database/Tables/pricing/tax_rules.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`search.synonyms`](../../04-Database/Tables/search/synonyms.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
