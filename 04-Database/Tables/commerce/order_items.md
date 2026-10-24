# `commerce.order_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds order items records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | commerce.order_items |
| Classification | Transactional |
| Proposed business write owner | Order_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 30 columns; 35 PK/FK/UQ/CHECK/exclusion constraints; 17 named PostgreSQL 18 NOT NULL constraints; 10 indexes; 5 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `commerce_class_snapshot` | `character varying(1)` | Yes | — | Reference linking this record to commerce classes | Ensures related business data can be joined and validated | FK → `catalog.commerce_classes` via `fk_commerce_order_items_commerce_class_snapshot_commerc_4b6d`; Collation: default |
| `commerce_class_version_snapshot` | `bigint` | Yes | — | Structured commerce class version snapshot information | Retain a versioned payload or relevant details | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_order_items_created_by_users` |
| `discount_amount` | `numeric(14,2)` | No | `0` | Value of discount amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `line_total` | `numeric(16,2)` | No | — | Value of line total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `order_group_id` | `uuid` | Yes | — | Reference linking this record to order groups | Ensures related business data can be joined and validated | FK → `commerce.order_groups` via `fk_commerce_order_items_group_order`; FK → `commerce.order_groups` via `fk_commerce_order_items_order_group_id_order_groups` |
| `order_group_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_groups` via `fk_commerce_order_items_group_order_numeric`; FK → `commerce.order_groups` via `fk_commerce_order_items_order_group_id_order_groups_numeric` |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.order_groups` via `fk_commerce_order_items_group_order`; FK → `commerce.orders` via `fk_commerce_order_items_order_id_orders` |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_groups` via `fk_commerce_order_items_group_order_numeric`; FK → `commerce.orders` via `fk_commerce_order_items_order_id_orders_numeric` |
| `prescription_id` | `uuid` | Yes | — | Reference linking this record to prescriptions | Ensures related business data can be joined and validated | FK → `clinical.prescriptions` via `fk_commerce_order_items_prescription_id_prescriptions` |
| `prescription_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescriptions` via `fk_commerce_order_items_prescription_id_prescriptions_numeric` |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_commerce_order_items_product_id_products` |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_commerce_order_items_product_id_products_numeric` |
| `product_snapshot` | `jsonb` | No | — | Structured product snapshot information | Retain a versioned payload or relevant details | Exact constraints below |
| `quantity` | `numeric(12,3)` | No | — | Quantity value | Track resource or item amounts accurately | Exact constraints below |
| `returnable_until` | `timestamp with time zone` | Yes | — | Inferred: stores returnable until for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `seller_id` | `uuid` | Yes | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` via `fk_commerce_order_items_seller_id_sellers` |
| `seller_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` via `fk_commerce_order_items_seller_id_sellers_numeric` |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `tax_amount` | `numeric(14,2)` | No | `0` | Value of tax amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `unit_mrp` | `numeric(14,2)` | No | — | Inferred: stores unit mrp for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `unit_price` | `numeric(14,2)` | No | — | Value of unit price | Enable pricing, reconciliation or reporting | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_order_items_updated_by_users` |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` via `fk_commerce_order_items_variant_id_product_variants` |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` via `fk_commerce_order_items_variant_id_product_variants_numeric` |

## Record lifecycle and users

- **Created:** when the order items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.order_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_commerce_order_items_commerce_class_snapshot_commerc_4b6d | `commerce_class_snapshot` | [`catalog.commerce_classes`](../../Tables/catalog/commerce_classes.md) | `FOREIGN KEY (commerce_class_snapshot) REFERENCES catalog.commerce_classes(code) ON DELETE RESTRICT` |
| fk_commerce_order_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_commerce_order_items_group_order | `order_group_id, order_id` | [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | `FOREIGN KEY (order_group_id, order_id) REFERENCES commerce.order_groups(id, order_id) ON DELETE RESTRICT` |
| fk_commerce_order_items_group_order_numeric | `order_group_id_internal_id, order_id_internal_id` | [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | `FOREIGN KEY (order_group_id_internal_id, order_id_internal_id) REFERENCES commerce.order_groups(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| fk_commerce_order_items_order_group_id_order_groups | `order_group_id` | [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | `FOREIGN KEY (order_group_id) REFERENCES commerce.order_groups(id) ON DELETE SET NULL` |
| fk_commerce_order_items_order_group_id_order_groups_numeric | `order_group_id_internal_id` | [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | `FOREIGN KEY (order_group_id_internal_id) REFERENCES commerce.order_groups(internal_id) ON DELETE SET NULL` |
| fk_commerce_order_items_order_id_orders | `order_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE CASCADE` |
| fk_commerce_order_items_order_id_orders_numeric | `order_id_internal_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE CASCADE` |
| fk_commerce_order_items_prescription_id_prescriptions | `prescription_id` | [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE SET NULL` |
| fk_commerce_order_items_prescription_id_prescriptions_numeric | `prescription_id_internal_id` | [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE SET NULL` |
| fk_commerce_order_items_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| fk_commerce_order_items_product_id_products_numeric | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| fk_commerce_order_items_seller_id_sellers | `seller_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE SET NULL` |
| fk_commerce_order_items_seller_id_sellers_numeric | `seller_id_internal_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE SET NULL` |
| fk_commerce_order_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_commerce_order_items_variant_id_product_variants | `variant_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT` |
| fk_commerce_order_items_variant_id_product_variants_numeric | `variant_id_internal_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`clinical.order_review_items`](../../Tables/clinical/order_review_items.md) | fk_clinical_review_items_item_order | `order_item_id, order_id` | `id, order_id` |
| [`clinical.order_review_items`](../../Tables/clinical/order_review_items.md) | fk_clinical_review_items_item_order_numeric | `order_item_id_internal_id, order_id_internal_id` | `internal_id, order_id_internal_id` |
| [`commerce.cancellation_items`](../../Tables/commerce/cancellation_items.md) | fk_commerce_cancellation_items_order_item_id_order_item_a716 | `order_item_id_internal_id` | `internal_id` |
| [`commerce.cancellation_items`](../../Tables/commerce/cancellation_items.md) | fk_commerce_cancellation_items_order_item_id_order_items | `order_item_id` | `id` |
| [`commerce.order_allocations`](../../Tables/commerce/order_allocations.md) | fk_commerce_order_allocations_order_item_id_order_items | `order_item_id` | `id` |
| [`commerce.order_allocations`](../../Tables/commerce/order_allocations.md) | fk_commerce_order_allocations_order_item_id_order_items_numeric | `order_item_id_internal_id` | `internal_id` |
| [`commerce.order_discounts`](../../Tables/commerce/order_discounts.md) | fk_commerce_order_discounts_order_item_id_order_items | `order_item_id` | `id` |
| [`commerce.order_discounts`](../../Tables/commerce/order_discounts.md) | fk_commerce_order_discounts_order_item_id_order_items_numeric | `order_item_id_internal_id` | `internal_id` |
| [`commerce.return_items`](../../Tables/commerce/return_items.md) | fk_commerce_return_items_order_item_id_order_items | `order_item_id` | `id` |
| [`commerce.return_items`](../../Tables/commerce/return_items.md) | fk_commerce_return_items_order_item_id_order_items_numeric | `order_item_id_internal_id` | `internal_id` |
| [`finance.invoice_items`](../../Tables/finance/invoice_items.md) | fk_finance_invoice_items_order_item_id_order_items | `order_item_id` | `id` |
| [`finance.invoice_items`](../../Tables/finance/invoice_items.md) | fk_finance_invoice_items_order_item_id_order_items_numeric | `order_item_id_internal_id` | `internal_id` |
| [`fulfillment.fulfillment_order_items`](../../Tables/fulfillment/fulfillment_order_items.md) | fk_fulfillment_fulfillment_order_items_order_item_id_or_9354 | `order_item_id` | `id` |
| [`fulfillment.fulfillment_order_items`](../../Tables/fulfillment/fulfillment_order_items.md) | fk_fulfillment_fulfillment_order_items_order_item_id_or_caeb | `order_item_id_internal_id` | `internal_id` |
| [`fulfillment.package_items`](../../Tables/fulfillment/package_items.md) | fk_fulfillment_package_items_order_item_id_order_items | `order_item_id` | `id` |
| [`fulfillment.package_items`](../../Tables/fulfillment/package_items.md) | fk_fulfillment_package_items_order_item_id_order_items_numeric | `order_item_id_internal_id` | `internal_id` |
| [`fulfillment.pick_task_items`](../../Tables/fulfillment/pick_task_items.md) | fk_fulfillment_pick_task_items_order_item_id_order_item_e4d0 | `order_item_id_internal_id` | `internal_id` |
| [`fulfillment.pick_task_items`](../../Tables/fulfillment/pick_task_items.md) | fk_fulfillment_pick_task_items_order_item_id_order_items | `order_item_id` | `id` |
| [`payment.refund_allocations`](../../Tables/payment/refund_allocations.md) | fk_payment_refund_allocations_order_item_id_order_items | `order_item_id` | `id` |
| [`payment.refund_allocations`](../../Tables/payment/refund_allocations.md) | fk_payment_refund_allocations_order_item_id_order_items_numeric | `order_item_id_internal_id` | `internal_id` |
| [`warehouse.stock_reservations`](../../Tables/warehouse/stock_reservations.md) | fk_warehouse_stock_reservations_item_order | `order_item_id, order_id` | `id, order_id` |
| [`warehouse.stock_reservations`](../../Tables/warehouse/stock_reservations.md) | fk_warehouse_stock_reservations_item_order_numeric | `order_item_id_internal_id, order_id_internal_id` | `internal_id, order_id_internal_id` |

## `commerce.order_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `commerce_class_snapshot` | `catalog.commerce_classes` | `fk_commerce_order_items_commerce_class_snapshot_commerc_4b6d` |
| `created_by` | `identity.users` | `fk_commerce_order_items_created_by_users` |
| `order_group_id, order_id` | `commerce.order_groups` | `fk_commerce_order_items_group_order` |
| `order_group_id_internal_id, order_id_internal_id` | `commerce.order_groups` | `fk_commerce_order_items_group_order_numeric` |
| `order_group_id` | `commerce.order_groups` | `fk_commerce_order_items_order_group_id_order_groups` |
| `order_group_id_internal_id` | `commerce.order_groups` | `fk_commerce_order_items_order_group_id_order_groups_numeric` |
| `order_id` | `commerce.orders` | `fk_commerce_order_items_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_commerce_order_items_order_id_orders_numeric` |
| `prescription_id` | `clinical.prescriptions` | `fk_commerce_order_items_prescription_id_prescriptions` |
| `prescription_id_internal_id` | `clinical.prescriptions` | `fk_commerce_order_items_prescription_id_prescriptions_numeric` |
| `product_id` | `catalog.products` | `fk_commerce_order_items_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_commerce_order_items_product_id_products_numeric` |
| `seller_id` | `marketplace.sellers` | `fk_commerce_order_items_seller_id_sellers` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_commerce_order_items_seller_id_sellers_numeric` |
| `updated_by` | `identity.users` | `fk_commerce_order_items_updated_by_users` |
| `variant_id` | `catalog.product_variants` | `fk_commerce_order_items_variant_id_product_variants` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_commerce_order_items_variant_id_product_variants_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_commerce_order_items_amounts_nonnegative` | CHECK | `CHECK (discount_amount >= 0::numeric AND tax_amount >= 0::numeric)` |
| `ck_commerce_order_items_commerce_class_snapshot` | CHECK | `CHECK (commerce_class_snapshot IS NULL OR (commerce_class_snapshot::text = ANY (ARRAY['P'::text, 'M'::text, 'O'::text])))` |
| `ck_commerce_order_items_commerce_class_version_positive` | CHECK | `CHECK (commerce_class_version_snapshot IS NULL OR commerce_class_version_snapshot > 0)` |
| `ck_commerce_order_items_finite_numeric_values` | CHECK | `CHECK ((quantity IS NULL OR (quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (unit_mrp IS NULL OR (unit_mrp <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (unit_price IS NULL OR (unit_price <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (discount_amount IS NULL OR (discount_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (tax_amount IS NULL OR (tax_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (line_total IS NULL OR (line_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_commerce_order_items_line_total_nonnegative` | CHECK | `CHECK (line_total >= 0::numeric)` |
| `ck_commerce_order_items_numeric_pair_order_group_id` | CHECK | `CHECK ((order_group_id IS NULL) = (order_group_id_internal_id IS NULL))` |
| `ck_commerce_order_items_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_commerce_order_items_numeric_pair_prescription_id` | CHECK | `CHECK ((prescription_id IS NULL) = (prescription_id_internal_id IS NULL))` |
| `ck_commerce_order_items_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_commerce_order_items_numeric_pair_seller_id` | CHECK | `CHECK ((seller_id IS NULL) = (seller_id_internal_id IS NULL))` |
| `ck_commerce_order_items_numeric_pair_variant_id` | CHECK | `CHECK ((variant_id IS NULL) = (variant_id_internal_id IS NULL))` |
| `ck_commerce_order_items_quantity_positive` | CHECK | `CHECK (quantity > 0::numeric)` |
| `ck_commerce_order_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_commerce_order_items_unit_prices_nonnegative` | CHECK | `CHECK (unit_mrp >= 0::numeric AND unit_price >= 0::numeric)` |
| `fk_commerce_order_items_commerce_class_snapshot_commerc_4b6d` | FOREIGN KEY | `FOREIGN KEY (commerce_class_snapshot) REFERENCES catalog.commerce_classes(code) ON DELETE RESTRICT` |
| `fk_commerce_order_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_order_items_group_order` | FOREIGN KEY | `FOREIGN KEY (order_group_id, order_id) REFERENCES commerce.order_groups(id, order_id) ON DELETE RESTRICT` |
| `fk_commerce_order_items_group_order_numeric` | FOREIGN KEY | `FOREIGN KEY (order_group_id_internal_id, order_id_internal_id) REFERENCES commerce.order_groups(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| `fk_commerce_order_items_order_group_id_order_groups` | FOREIGN KEY | `FOREIGN KEY (order_group_id) REFERENCES commerce.order_groups(id) ON DELETE SET NULL` |
| `fk_commerce_order_items_order_group_id_order_groups_numeric` | FOREIGN KEY | `FOREIGN KEY (order_group_id_internal_id) REFERENCES commerce.order_groups(internal_id) ON DELETE SET NULL` |
| `fk_commerce_order_items_order_id_orders` | FOREIGN KEY | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE CASCADE` |
| `fk_commerce_order_items_order_id_orders_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE CASCADE` |
| `fk_commerce_order_items_prescription_id_prescriptions` | FOREIGN KEY | `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE SET NULL` |
| `fk_commerce_order_items_prescription_id_prescriptions_numeric` | FOREIGN KEY | `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE SET NULL` |
| `fk_commerce_order_items_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| `fk_commerce_order_items_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| `fk_commerce_order_items_seller_id_sellers` | FOREIGN KEY | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE SET NULL` |
| `fk_commerce_order_items_seller_id_sellers_numeric` | FOREIGN KEY | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE SET NULL` |
| `fk_commerce_order_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_order_items_variant_id_product_variants` | FOREIGN KEY | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT` |
| `fk_commerce_order_items_variant_id_product_variants_numeric` | FOREIGN KEY | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT` |
| `pk_commerce_order_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_commerce_order_items_id` | UNIQUE | `UNIQUE (id)` |
| `uq_commerce_order_items_id_order` | UNIQUE | `UNIQUE (id, order_id)` |
| `uq_numeric_commerce_order_items_internal_id_order_id_in_fa29` | UNIQUE | `UNIQUE (internal_id, order_id_internal_id)` |
| `order_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `order_items_discount_amount_not_null` | NOT NULL | `NOT NULL discount_amount` |
| `order_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `order_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `order_items_line_total_not_null` | NOT NULL | `NOT NULL line_total` |
| `order_items_order_id_internal_id_not_null` | NOT NULL | `NOT NULL order_id_internal_id` |
| `order_items_order_id_not_null` | NOT NULL | `NOT NULL order_id` |
| `order_items_product_id_internal_id_not_null` | NOT NULL | `NOT NULL product_id_internal_id` |
| `order_items_product_id_not_null` | NOT NULL | `NOT NULL product_id` |
| `order_items_product_snapshot_not_null` | NOT NULL | `NOT NULL product_snapshot` |
| `order_items_quantity_not_null` | NOT NULL | `NOT NULL quantity` |
| `order_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `order_items_status_not_null` | NOT NULL | `NOT NULL status` |
| `order_items_tax_amount_not_null` | NOT NULL | `NOT NULL tax_amount` |
| `order_items_unit_mrp_not_null` | NOT NULL | `NOT NULL unit_mrp` |
| `order_items_unit_price_not_null` | NOT NULL | `NOT NULL unit_price` |
| `order_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_commerce_order_items_group` | btree | `(order_group_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_order_items_group ON commerce.order_items USING btree (order_group_id)` |
| `ix_commerce_order_items_internal_order` | btree | `(order_id_internal_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_order_items_internal_order ON commerce.order_items USING btree (order_id_internal_id)` |
| `ix_commerce_order_items_order` | btree | `(order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_order_items_order ON commerce.order_items USING btree (order_id)` |
| `ix_commerce_order_items_prescription` | btree | `(prescription_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_order_items_prescription ON commerce.order_items USING btree (prescription_id)` |
| `ix_commerce_order_items_product` | btree | `(product_id, variant_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_order_items_product ON commerce.order_items USING btree (product_id, variant_id)` |
| `ix_commerce_order_items_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_order_items_status ON commerce.order_items USING btree (status)` |
| `pk_commerce_order_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_commerce_order_items ON commerce.order_items USING btree (internal_id)` |
| `uq_commerce_order_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_order_items_id ON commerce.order_items USING btree (id)` |
| `uq_commerce_order_items_id_order` | btree | `(id, order_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_order_items_id_order ON commerce.order_items USING btree (id, order_id)` |
| `uq_numeric_commerce_order_items_internal_id_order_id_in_fa29` | btree | `(internal_id, order_id_internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_numeric_commerce_order_items_internal_id_order_id_in_fa29 ON commerce.order_items USING btree (internal_id, order_id_internal_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_group_id","order_group_id_internal_id","commerce","order_groups"],["order_id","order_id_internal_id","commerce","orders"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["product_id","product_id_internal_id","catalog","products"],["seller_id","seller_id_internal_id","marketplace","sellers"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` | O |
| `order_clinical_gate` | `CREATE TRIGGER order_clinical_gate AFTER INSERT OR UPDATE ON commerce.order_items FOR EACH ROW EXECUTE FUNCTION commerce.refresh_clinical_gate()` | O |
| `order_item_guard` | `CREATE TRIGGER order_item_guard BEFORE INSERT OR DELETE OR UPDATE ON commerce.order_items FOR EACH ROW EXECUTE FUNCTION commerce.guard_order_item()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_group_id","order_group_id_internal_id","commerce","order_groups"],["order_id","order_id_internal_id","commerce","orders"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["product_id","product_id_internal_id","catalog","products"],["seller_id","seller_id_internal_id","marketplace","sellers"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
