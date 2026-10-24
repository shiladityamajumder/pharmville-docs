# `catalog.products`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds products records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | catalog.products |
| Classification | Master / Reference |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 39 columns; 26 PK/FK/UQ/CHECK/exclusion constraints; 15 named PostgreSQL 18 NOT NULL constraints; 9 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `brand_id` | `uuid` | Yes | — | Reference linking this record to brands | Ensures related business data can be joined and validated | FK → `catalog.brands` via `fk_catalog_products_brand_id_brands` |
| `brand_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.brands` via `fk_catalog_products_brand_id_brands_numeric` |
| `category_id` | `uuid` | Yes | — | Reference linking this record to categories | Ensures related business data can be joined and validated | FK → `catalog.categories` via `fk_catalog_products_category_id_categories` |
| `category_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.categories` via `fk_catalog_products_category_id_categories_numeric` |
| `commerce_class` | `character varying(1)` | Yes | — | Reference linking this record to commerce classes | Ensures related business data can be joined and validated | FK → `catalog.commerce_classes` via `fk_catalog_products_commerce_class_commerce_classes`; Collation: default |
| `commerce_class_approved_at` | `timestamp with time zone` | Yes | — | Time of commerce class approved | Support chronology, deadlines or audit evidence | Exact constraints below |
| `commerce_class_approved_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_products_commerce_class_approved_by_user_id_users` |
| `commerce_class_version` | `bigint` | No | `1` | Inferred: stores commerce class version for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_products_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_products_deleted_by_users` |
| `discontinued_at` | `timestamp with time zone` | Yes | — | Time of discontinued | Support chronology, deadlines or audit evidence | Exact constraints below |
| `display_name` | `character varying(255)` | Yes | — | Inferred: stores display name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `dosage_form_id` | `uuid` | Yes | — | Reference linking this record to dosage forms | Ensures related business data can be joined and validated | FK → `catalog.dosage_forms` via `fk_catalog_products_dosage_form_id_dosage_forms` |
| `dosage_form_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.dosage_forms` via `fk_catalog_products_dosage_form_id_dosage_forms_numeric` |
| `hsn_code` | `character varying(32)` | Yes | — | Code for hsn | Link to controlled business classification or an external reference | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `is_returnable` | `boolean` | No | `true` | Yes/no flag for is returnable | Control conditional business behavior | Exact constraints below |
| `manufacturer_id` | `uuid` | Yes | — | Reference linking this record to manufacturers | Ensures related business data can be joined and validated | FK → `catalog.manufacturers` via `fk_catalog_products_manufacturer_id_manufacturers` |
| `manufacturer_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.manufacturers` via `fk_catalog_products_manufacturer_id_manufacturers_numeric` |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `pack_size_display` | `character varying(128)` | Yes | — | Inferred: stores pack size display for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `prescription_required` | `boolean` | No | `false` | Inferred: stores prescription required for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `product_type` | `character varying(16)` | No | — | Inferred: stores product type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `published_at` | `timestamp with time zone` | Yes | — | Time of published | Support chronology, deadlines or audit evidence | Exact constraints below |
| `return_window_days` | `integer` | Yes | — | Inferred: stores return window days for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `schedule_class` | `character varying(32)` | Yes | — | Inferred: stores schedule class for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `search_keywords` | `jsonb` | No | `'[]'::jsonb` | Structured search keywords information | Retain a versioned payload or relevant details | Exact constraints below |
| `sku` | `character varying(64)` | No | — | Inferred: stores sku for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `slug` | `character varying(255)` | No | — | Inferred: stores slug for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `status` | `character varying(16)` | No | `'draft'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `strength_display` | `character varying(128)` | Yes | — | Inferred: stores strength display for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `tax_code` | `character varying(64)` | Yes | — | Code for tax | Link to controlled business classification or an external reference | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_products_updated_by_users` |

## Record lifecycle and users

- **Created:** when the products business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.products` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_catalog_products_brand_id_brands | `brand_id` | [`catalog.brands`](../../Tables/catalog/brands.md) | `FOREIGN KEY (brand_id) REFERENCES catalog.brands(id) ON DELETE SET NULL` |
| fk_catalog_products_brand_id_brands_numeric | `brand_id_internal_id` | [`catalog.brands`](../../Tables/catalog/brands.md) | `FOREIGN KEY (brand_id_internal_id) REFERENCES catalog.brands(internal_id) ON DELETE SET NULL` |
| fk_catalog_products_category_id_categories | `category_id` | [`catalog.categories`](../../Tables/catalog/categories.md) | `FOREIGN KEY (category_id) REFERENCES catalog.categories(id) ON DELETE SET NULL` |
| fk_catalog_products_category_id_categories_numeric | `category_id_internal_id` | [`catalog.categories`](../../Tables/catalog/categories.md) | `FOREIGN KEY (category_id_internal_id) REFERENCES catalog.categories(internal_id) ON DELETE SET NULL` |
| fk_catalog_products_commerce_class_approved_by_user_id_users | `commerce_class_approved_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (commerce_class_approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_products_commerce_class_commerce_classes | `commerce_class` | [`catalog.commerce_classes`](../../Tables/catalog/commerce_classes.md) | `FOREIGN KEY (commerce_class) REFERENCES catalog.commerce_classes(code) ON DELETE RESTRICT` |
| fk_catalog_products_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_products_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_products_dosage_form_id_dosage_forms | `dosage_form_id` | [`catalog.dosage_forms`](../../Tables/catalog/dosage_forms.md) | `FOREIGN KEY (dosage_form_id) REFERENCES catalog.dosage_forms(id) ON DELETE SET NULL` |
| fk_catalog_products_dosage_form_id_dosage_forms_numeric | `dosage_form_id_internal_id` | [`catalog.dosage_forms`](../../Tables/catalog/dosage_forms.md) | `FOREIGN KEY (dosage_form_id_internal_id) REFERENCES catalog.dosage_forms(internal_id) ON DELETE SET NULL` |
| fk_catalog_products_manufacturer_id_manufacturers | `manufacturer_id` | [`catalog.manufacturers`](../../Tables/catalog/manufacturers.md) | `FOREIGN KEY (manufacturer_id) REFERENCES catalog.manufacturers(id) ON DELETE SET NULL` |
| fk_catalog_products_manufacturer_id_manufacturers_numeric | `manufacturer_id_internal_id` | [`catalog.manufacturers`](../../Tables/catalog/manufacturers.md) | `FOREIGN KEY (manufacturer_id_internal_id) REFERENCES catalog.manufacturers(internal_id) ON DELETE SET NULL` |
| fk_catalog_products_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`catalog.product_attributes`](../../Tables/catalog/product_attributes.md) | fk_catalog_product_attributes_product_id_products | `product_id` | `id` |
| [`catalog.product_attributes`](../../Tables/catalog/product_attributes.md) | fk_catalog_product_attributes_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`catalog.product_classification_history`](../../Tables/catalog/product_classification_history.md) | fk_catalog_product_classification_history_product_id_pr_6e05 | `product_id_internal_id` | `internal_id` |
| [`catalog.product_classification_history`](../../Tables/catalog/product_classification_history.md) | fk_catalog_product_classification_history_product_id_products | `product_id` | `id` |
| [`catalog.product_content`](../../Tables/catalog/product_content.md) | fk_catalog_product_content_product_id_products | `product_id` | `id` |
| [`catalog.product_content`](../../Tables/catalog/product_content.md) | fk_catalog_product_content_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`catalog.product_identifiers`](../../Tables/catalog/product_identifiers.md) | fk_catalog_product_identifiers_product_id_products | `product_id` | `id` |
| [`catalog.product_identifiers`](../../Tables/catalog/product_identifiers.md) | fk_catalog_product_identifiers_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`catalog.product_media`](../../Tables/catalog/product_media.md) | fk_catalog_product_media_product_id_products | `product_id` | `id` |
| [`catalog.product_media`](../../Tables/catalog/product_media.md) | fk_catalog_product_media_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`catalog.product_regulatory`](../../Tables/catalog/product_regulatory.md) | fk_catalog_product_regulatory_product_id_products | `product_id` | `id` |
| [`catalog.product_regulatory`](../../Tables/catalog/product_regulatory.md) | fk_catalog_product_regulatory_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`catalog.product_relationships`](../../Tables/catalog/product_relationships.md) | fk_catalog_product_relationships_source_product_id_prod_62c6 | `source_product_id_internal_id` | `internal_id` |
| [`catalog.product_relationships`](../../Tables/catalog/product_relationships.md) | fk_catalog_product_relationships_source_product_id_products | `source_product_id` | `id` |
| [`catalog.product_relationships`](../../Tables/catalog/product_relationships.md) | fk_catalog_product_relationships_target_product_id_prod_6cc5 | `target_product_id_internal_id` | `internal_id` |
| [`catalog.product_relationships`](../../Tables/catalog/product_relationships.md) | fk_catalog_product_relationships_target_product_id_products | `target_product_id` | `id` |
| [`catalog.product_salts`](../../Tables/catalog/product_salts.md) | fk_catalog_product_salts_product_id_products | `product_id` | `id` |
| [`catalog.product_salts`](../../Tables/catalog/product_salts.md) | fk_catalog_product_salts_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | fk_catalog_product_variants_product_id_products | `product_id` | `id` |
| [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | fk_catalog_product_variants_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`catalog.substitution_group_products`](../../Tables/catalog/substitution_group_products.md) | fk_catalog_substitution_group_products_product_id_produ_da79 | `product_id_internal_id` | `internal_id` |
| [`catalog.substitution_group_products`](../../Tables/catalog/substitution_group_products.md) | fk_catalog_substitution_group_products_product_id_products | `product_id` | `id` |
| [`clinical.patient_medications`](../../Tables/clinical/patient_medications.md) | fk_clinical_patient_medications_product_id_products | `product_id` | `id` |
| [`clinical.patient_medications`](../../Tables/clinical/patient_medications.md) | fk_clinical_patient_medications_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`clinical.prescription_items`](../../Tables/clinical/prescription_items.md) | fk_clinical_prescription_items_product_id_products | `product_id` | `id` |
| [`clinical.prescription_items`](../../Tables/clinical/prescription_items.md) | fk_clinical_prescription_items_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`commerce.cart_items`](../../Tables/commerce/cart_items.md) | fk_commerce_cart_items_product_id_products | `product_id` | `id` |
| [`commerce.cart_items`](../../Tables/commerce/cart_items.md) | fk_commerce_cart_items_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`commerce.order_items`](../../Tables/commerce/order_items.md) | fk_commerce_order_items_product_id_products | `product_id` | `id` |
| [`commerce.order_items`](../../Tables/commerce/order_items.md) | fk_commerce_order_items_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`compliance.adverse_event_reports`](../../Tables/compliance/adverse_event_reports.md) | fk_compliance_adverse_event_reports_product_id_products | `product_id` | `id` |
| [`compliance.adverse_event_reports`](../../Tables/compliance/adverse_event_reports.md) | fk_compliance_adverse_event_reports_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`compliance.product_recalls`](../../Tables/compliance/product_recalls.md) | fk_compliance_product_recalls_product_id_products | `product_id` | `id` |
| [`compliance.product_recalls`](../../Tables/compliance/product_recalls.md) | fk_compliance_product_recalls_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`customer.wishlist_items`](../../Tables/customer/wishlist_items.md) | fk_customer_wishlist_items_product_id_products | `product_id` | `id` |
| [`customer.wishlist_items`](../../Tables/customer/wishlist_items.md) | fk_customer_wishlist_items_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`marketplace.seller_product_listings`](../../Tables/marketplace/seller_product_listings.md) | fk_marketplace_seller_product_listings_product_id_produ_4e59 | `product_id_internal_id` | `internal_id` |
| [`marketplace.seller_product_listings`](../../Tables/marketplace/seller_product_listings.md) | fk_marketplace_seller_product_listings_product_id_products | `product_id` | `id` |
| [`pricing.product_prices`](../../Tables/pricing/product_prices.md) | fk_pricing_product_prices_product_id_products | `product_id` | `id` |
| [`pricing.product_prices`](../../Tables/pricing/product_prices.md) | fk_pricing_product_prices_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`procurement.purchase_order_items`](../../Tables/procurement/purchase_order_items.md) | fk_procurement_purchase_order_items_product_id_products | `product_id` | `id` |
| [`procurement.purchase_order_items`](../../Tables/procurement/purchase_order_items.md) | fk_procurement_purchase_order_items_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`procurement.purchase_requisition_items`](../../Tables/procurement/purchase_requisition_items.md) | fk_procurement_purchase_requisition_items_product_id_pr_cb94 | `product_id_internal_id` | `internal_id` |
| [`procurement.purchase_requisition_items`](../../Tables/procurement/purchase_requisition_items.md) | fk_procurement_purchase_requisition_items_product_id_products | `product_id` | `id` |
| [`procurement.supplier_products`](../../Tables/procurement/supplier_products.md) | fk_procurement_supplier_products_product_id_products | `product_id` | `id` |
| [`procurement.supplier_products`](../../Tables/procurement/supplier_products.md) | fk_procurement_supplier_products_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | fk_warehouse_inventory_lots_product_id_products | `product_id` | `id` |
| [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | fk_warehouse_inventory_lots_product_id_products_numeric | `product_id_internal_id` | `internal_id` |
| [`warehouse.replenishment_rules`](../../Tables/warehouse/replenishment_rules.md) | fk_warehouse_replenishment_rules_product_id_products | `product_id` | `id` |
| [`warehouse.replenishment_rules`](../../Tables/warehouse/replenishment_rules.md) | fk_warehouse_replenishment_rules_product_id_products_numeric | `product_id_internal_id` | `internal_id` |

## `catalog.products` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `brand_id` | `catalog.brands` | `fk_catalog_products_brand_id_brands` |
| `brand_id_internal_id` | `catalog.brands` | `fk_catalog_products_brand_id_brands_numeric` |
| `category_id` | `catalog.categories` | `fk_catalog_products_category_id_categories` |
| `category_id_internal_id` | `catalog.categories` | `fk_catalog_products_category_id_categories_numeric` |
| `commerce_class_approved_by_user_id` | `identity.users` | `fk_catalog_products_commerce_class_approved_by_user_id_users` |
| `commerce_class` | `catalog.commerce_classes` | `fk_catalog_products_commerce_class_commerce_classes` |
| `created_by` | `identity.users` | `fk_catalog_products_created_by_users` |
| `deleted_by` | `identity.users` | `fk_catalog_products_deleted_by_users` |
| `dosage_form_id` | `catalog.dosage_forms` | `fk_catalog_products_dosage_form_id_dosage_forms` |
| `dosage_form_id_internal_id` | `catalog.dosage_forms` | `fk_catalog_products_dosage_form_id_dosage_forms_numeric` |
| `manufacturer_id` | `catalog.manufacturers` | `fk_catalog_products_manufacturer_id_manufacturers` |
| `manufacturer_id_internal_id` | `catalog.manufacturers` | `fk_catalog_products_manufacturer_id_manufacturers_numeric` |
| `updated_by` | `identity.users` | `fk_catalog_products_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_products_commerce_class` | CHECK | `CHECK (commerce_class IS NULL OR (commerce_class::text = ANY (ARRAY['P'::text, 'M'::text, 'O'::text])))` |
| `ck_catalog_products_commerce_class_prescription` | CHECK | `CHECK (commerce_class IS NULL OR prescription_required = (commerce_class::text = 'P'::text))` |
| `ck_catalog_products_commerce_class_version_positive` | CHECK | `CHECK (commerce_class_version > 0)` |
| `ck_catalog_products_numeric_pair_brand_id` | CHECK | `CHECK ((brand_id IS NULL) = (brand_id_internal_id IS NULL))` |
| `ck_catalog_products_numeric_pair_category_id` | CHECK | `CHECK ((category_id IS NULL) = (category_id_internal_id IS NULL))` |
| `ck_catalog_products_numeric_pair_dosage_form_id` | CHECK | `CHECK ((dosage_form_id IS NULL) = (dosage_form_id_internal_id IS NULL))` |
| `ck_catalog_products_numeric_pair_manufacturer_id` | CHECK | `CHECK ((manufacturer_id IS NULL) = (manufacturer_id_internal_id IS NULL))` |
| `ck_catalog_products_productstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['draft'::text, 'review'::text, 'active'::text, 'inactive'::text, 'discontinued'::text, 'recalled'::text]))` |
| `ck_catalog_products_producttype` | CHECK | `CHECK (product_type::text = ANY (ARRAY['medicine'::text, 'otc'::text, 'device'::text, 'wellness'::text, 'lab_test'::text, 'service'::text]))` |
| `ck_catalog_products_return_window_nonnegative` | CHECK | `CHECK (return_window_days IS NULL OR return_window_days >= 0)` |
| `ck_catalog_products_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_catalog_products_brand_id_brands` | FOREIGN KEY | `FOREIGN KEY (brand_id) REFERENCES catalog.brands(id) ON DELETE SET NULL` |
| `fk_catalog_products_brand_id_brands_numeric` | FOREIGN KEY | `FOREIGN KEY (brand_id_internal_id) REFERENCES catalog.brands(internal_id) ON DELETE SET NULL` |
| `fk_catalog_products_category_id_categories` | FOREIGN KEY | `FOREIGN KEY (category_id) REFERENCES catalog.categories(id) ON DELETE SET NULL` |
| `fk_catalog_products_category_id_categories_numeric` | FOREIGN KEY | `FOREIGN KEY (category_id_internal_id) REFERENCES catalog.categories(internal_id) ON DELETE SET NULL` |
| `fk_catalog_products_commerce_class_approved_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (commerce_class_approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_products_commerce_class_commerce_classes` | FOREIGN KEY | `FOREIGN KEY (commerce_class) REFERENCES catalog.commerce_classes(code) ON DELETE RESTRICT` |
| `fk_catalog_products_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_products_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_products_dosage_form_id_dosage_forms` | FOREIGN KEY | `FOREIGN KEY (dosage_form_id) REFERENCES catalog.dosage_forms(id) ON DELETE SET NULL` |
| `fk_catalog_products_dosage_form_id_dosage_forms_numeric` | FOREIGN KEY | `FOREIGN KEY (dosage_form_id_internal_id) REFERENCES catalog.dosage_forms(internal_id) ON DELETE SET NULL` |
| `fk_catalog_products_manufacturer_id_manufacturers` | FOREIGN KEY | `FOREIGN KEY (manufacturer_id) REFERENCES catalog.manufacturers(id) ON DELETE SET NULL` |
| `fk_catalog_products_manufacturer_id_manufacturers_numeric` | FOREIGN KEY | `FOREIGN KEY (manufacturer_id_internal_id) REFERENCES catalog.manufacturers(internal_id) ON DELETE SET NULL` |
| `fk_catalog_products_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_catalog_products` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_catalog_products_id` | UNIQUE | `UNIQUE (id)` |
| `products_commerce_class_version_not_null` | NOT NULL | `NOT NULL commerce_class_version` |
| `products_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `products_id_not_null` | NOT NULL | `NOT NULL id` |
| `products_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `products_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `products_is_returnable_not_null` | NOT NULL | `NOT NULL is_returnable` |
| `products_name_not_null` | NOT NULL | `NOT NULL name` |
| `products_prescription_required_not_null` | NOT NULL | `NOT NULL prescription_required` |
| `products_product_type_not_null` | NOT NULL | `NOT NULL product_type` |
| `products_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `products_search_keywords_not_null` | NOT NULL | `NOT NULL search_keywords` |
| `products_sku_not_null` | NOT NULL | `NOT NULL sku` |
| `products_slug_not_null` | NOT NULL | `NOT NULL slug` |
| `products_status_not_null` | NOT NULL | `NOT NULL status` |
| `products_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_catalog_products_brand_id` | btree | `(brand_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_products_brand_id ON catalog.products USING btree (brand_id)` |
| `ix_catalog_products_category_id` | btree | `(category_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_products_category_id ON catalog.products USING btree (category_id)` |
| `ix_catalog_products_manufacturer_id` | btree | `(manufacturer_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_products_manufacturer_id ON catalog.products USING btree (manufacturer_id)` |
| `ix_catalog_products_status_commerce_class` | btree | `(status, commerce_class)` | is_deleted = false | Read/join/filter access path; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_products_status_commerce_class ON catalog.products USING btree (status, commerce_class) WHERE is_deleted = false` |
| `ix_catalog_products_status_type` | btree | `(status, product_type)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_products_status_type ON catalog.products USING btree (status, product_type)` |
| `pk_catalog_products` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_catalog_products ON catalog.products USING btree (internal_id)` |
| `uq_catalog_products_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_products_id ON catalog.products USING btree (id)` |
| `uq_catalog_products_sku_active` | btree | `(sku)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_products_sku_active ON catalog.products USING btree (sku) WHERE is_deleted = false` |
| `uq_catalog_products_slug_active` | btree | `(slug)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_products_slug_active ON catalog.products USING btree (slug) WHERE is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.products FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["brand_id","brand_id_internal_id","catalog","brands"],["category_id","category_id_internal_id","catalog","categories"],["dosage_form_id","dosage_form_id_internal_id","catalog","dosage_forms"],["manufacturer_id","manufacturer_id_internal_id","catalog","manufacturers"]]', 'internal_id', 'id')` | O |
| `product_classification_guard` | `CREATE TRIGGER product_classification_guard BEFORE INSERT OR UPDATE ON catalog.products FOR EACH ROW EXECUTE FUNCTION catalog.guard_classification()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.products FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.products FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["brand_id","brand_id_internal_id","catalog","brands"],["category_id","category_id_internal_id","catalog","categories"],["dosage_form_id","dosage_form_id_internal_id","catalog","dosage_forms"],["manufacturer_id","manufacturer_id_internal_id","catalog","manufacturers"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `catalog.products` |
| Category | Master / Reference — Stable sellable product identities and approved classifications |
| Proposed owner / maintenance role | Product_Catalog / Catalog Manager |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `catalog.product_attributes`, `catalog.product_classification_history`, `catalog.product_content`, `catalog.product_identifiers`, `catalog.product_media`, `catalog.product_regulatory`, `catalog.product_relationships`, `catalog.product_salts`, `catalog.product_variants`, `catalog.substitution_group_products`, `clinical.patient_medications`, `clinical.prescription_items`, `commerce.cart_items`, `commerce.order_items`, `compliance.adverse_event_reports`, `compliance.product_recalls`, `customer.wishlist_items`, `marketplace.seller_product_listings`, `pricing.product_prices`, `procurement.purchase_order_items`, `procurement.purchase_requisition_items`, `procurement.supplier_products`, `warehouse.inventory_lots`, `warehouse.replenishment_rules` |
| Features | `ACC-07`, `ADM-06`, `ADM-07`, `CAT-01`, `CAT-02`, `CAT-03`, `CAT-04`, `CHK-01`, `CHK-02`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08`, `INV-01`, `INV-03`, `INV-04`, `INV-05`, `INV-07`, `OMS-02`, `OMS-03`, `OMS-04`, `OMS-05`, `ORD-02`, `ORD-04`, `ORD-05`, `PHM-03`, `PHM-05`, `REP-03`, `RX-04`, `RX-05`, `STO-02`, `STO-03`, `STO-04`, `WH-01`, `WH-02` |
| API consumers | [API-011](../../../03-Modules/Product-Catalog/APIs.md), [API-012](../../../03-Modules/Product-Catalog/APIs.md), [API-013](../../../03-Modules/Product-Catalog/APIs.md), [API-014](../../../03-Modules/Product-Catalog/APIs.md), [API-015](../../../03-Modules/Product-Catalog/APIs.md), [API-016](../../../03-Modules/Product-Catalog/APIs.md), [API-017](../../../03-Modules/Product-Catalog/APIs.md), [API-018](../../../03-Modules/Cart-Checkout/APIs.md), [API-019](../../../03-Modules/Cart-Checkout/APIs.md), [API-020](../../../03-Modules/Cart-Checkout/APIs.md), [API-021](../../../03-Modules/Cart-Checkout/APIs.md), [API-024](../../../03-Modules/Prescription-Management/APIs.md), [API-026](../../../03-Modules/Customer-Orders/APIs.md), [API-027](../../../03-Modules/Customer-Orders/APIs.md), [API-028](../../../03-Modules/Customer-Orders/APIs.md), [API-040](../../../03-Modules/Order-Management/APIs.md), [API-041](../../../03-Modules/Order-Management/APIs.md), [API-042](../../../03-Modules/Order-Management/APIs.md), [API-043](../../../03-Modules/Order-Management/APIs.md), [API-046](../../../03-Modules/Store-Operations/APIs.md), [API-047](../../../03-Modules/Store-Operations/APIs.md), [API-048](../../../03-Modules/Store-Operations/APIs.md), [API-049](../../../03-Modules/Store-Operations/APIs.md), [API-050](../../../03-Modules/Inventory/APIs.md), [API-051](../../../03-Modules/Inventory/APIs.md), [API-052](../../../03-Modules/Inventory/APIs.md), [API-054](../../../03-Modules/Inventory/APIs.md), [API-055](../../../03-Modules/Inventory/APIs.md), [API-056](../../../03-Modules/Warehouse/APIs.md), [API-057](../../../03-Modules/Warehouse/APIs.md), [API-058](../../../03-Modules/Warehouse/APIs.md), [API-062](../../../03-Modules/Pharmacist-Review/APIs.md), [API-063](../../../03-Modules/Pharmacist-Review/APIs.md), [API-084](../../../03-Modules/Reporting/APIs.md), [ACC-ROUTE-008](../../../03-Modules/Customer-Accounts/APIs.md), [ACC-ROUTE-009](../../../03-Modules/Customer-Accounts/APIs.md), [ACC-ROUTE-010](../../../03-Modules/Customer-Accounts/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `name`, `product_type`, `sku`, `slug`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Catalog Manager through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use approved inactive/closed status from the table CHECK/owner policy; do not invent unsupported status values. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_catalog_products_id ON catalog.products USING btree (id); CREATE UNIQUE INDEX uq_catalog_products_sku_active ON catalog.products USING btree (sku) WHERE is_deleted = false; CREATE UNIQUE INDEX uq_catalog_products_slug_active ON catalog.products USING btree (slug) WHERE is_deleted = false |
| Foreign-key dependencies | `catalog.brands`, `catalog.categories`, `catalog.commerce_classes`, `catalog.dosage_forms`, `catalog.manufacturers` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-006/D-019 clinical/catalog source validation. |
