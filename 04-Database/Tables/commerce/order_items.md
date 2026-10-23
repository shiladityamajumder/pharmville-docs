# commerce.order_items

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds order items records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 30 columns, 35 constraints, 10 indexes, 5 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `commerce_class_snapshot` | `character varying(1)` | Yes | — | Reference linking this record to commerce classes | Ensures related business data can be joined and validated | FK → `catalog.commerce_classes` (fk_commerce_order_items_commerce_class_snapshot_commerc_4b6d) |
| `commerce_class_version_snapshot` | `bigint` | Yes | — | Structured commerce class version snapshot information | Retain a versioned payload or relevant details | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_order_items_created_by_users) |
| `discount_amount` | `numeric(14,2)` | No | `0` | Value of discount amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `line_total` | `numeric(16,2)` | No | — | Value of line total | Enable pricing, reconciliation or reporting | See exact constraints |
| `order_group_id` | `uuid` | Yes | — | Reference linking this record to order groups | Ensures related business data can be joined and validated | FK → `commerce.order_groups` (fk_commerce_order_items_order_group_id_order_groups); FK → `commerce.order_groups` (fk_commerce_order_items_group_order) |
| `order_group_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_groups` (fk_commerce_order_items_group_order_numeric); FK → `commerce.order_groups` (fk_commerce_order_items_order_group_id_order_groups_numeric); Numeric/public-key pair verification required |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` (fk_commerce_order_items_order_id_orders); FK → `commerce.order_groups` (fk_commerce_order_items_group_order) |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_groups` (fk_commerce_order_items_group_order_numeric); FK → `commerce.orders` (fk_commerce_order_items_order_id_orders_numeric); Numeric/public-key pair verification required |
| `prescription_id` | `uuid` | Yes | — | Reference linking this record to prescriptions | Ensures related business data can be joined and validated | FK → `clinical.prescriptions` (fk_commerce_order_items_prescription_id_prescriptions) |
| `prescription_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescriptions` (fk_commerce_order_items_prescription_id_prescriptions_numeric); Numeric/public-key pair verification required |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_commerce_order_items_product_id_products) |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_commerce_order_items_product_id_products_numeric); Numeric/public-key pair verification required |
| `product_snapshot` | `jsonb` | No | — | Structured product snapshot information | Retain a versioned payload or relevant details | See exact constraints |
| `quantity` | `numeric(12,3)` | No | — | Quantity value | Track resource or item amounts accurately | See exact constraints |
| `returnable_until` | `timestamp with time zone` | Yes | — | Inferred: stores returnable until for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `seller_id` | `uuid` | Yes | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` (fk_commerce_order_items_seller_id_sellers) |
| `seller_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` (fk_commerce_order_items_seller_id_sellers_numeric); Numeric/public-key pair verification required |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `tax_amount` | `numeric(14,2)` | No | `0` | Value of tax amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `unit_mrp` | `numeric(14,2)` | No | — | Inferred: stores unit mrp for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `unit_price` | `numeric(14,2)` | No | — | Value of unit price | Enable pricing, reconciliation or reporting | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_order_items_updated_by_users) |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` (fk_commerce_order_items_variant_id_product_variants) |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` (fk_commerce_order_items_variant_id_product_variants_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the order items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.order_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `commerce_class_snapshot` → `catalog.commerce_classes(code)` via `fk_commerce_order_items_commerce_class_snapshot_commerc_4b6d`; FOREIGN KEY (commerce_class_snapshot) REFERENCES catalog.commerce_classes(code) ON DELETE RESTRICT
- `created_by` → `identity.users(id)` via `fk_commerce_order_items_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_commerce_order_items_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `variant_id` → `catalog.product_variants(id)` via `fk_commerce_order_items_variant_id_product_variants`; FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT
- `order_group_id` → `commerce.order_groups(id)` via `fk_commerce_order_items_order_group_id_order_groups`; FOREIGN KEY (order_group_id) REFERENCES commerce.order_groups(id) ON DELETE SET NULL
- `order_id` → `commerce.orders(id)` via `fk_commerce_order_items_order_id_orders`; FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE CASCADE
- `product_id` → `catalog.products(id)` via `fk_commerce_order_items_product_id_products`; FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT
- `order_group_id, order_id` → `commerce.order_groups(id, order_id)` via `fk_commerce_order_items_group_order`; FOREIGN KEY (order_group_id, order_id) REFERENCES commerce.order_groups(id, order_id) ON DELETE RESTRICT
- `prescription_id` → `clinical.prescriptions(id)` via `fk_commerce_order_items_prescription_id_prescriptions`; FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE SET NULL
- `seller_id` → `marketplace.sellers(id)` via `fk_commerce_order_items_seller_id_sellers`; FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE SET NULL
- `order_group_id_internal_id, order_id_internal_id` → `commerce.order_groups(internal_id, order_id_internal_id)` via `fk_commerce_order_items_group_order_numeric`; FOREIGN KEY (order_group_id_internal_id, order_id_internal_id) REFERENCES commerce.order_groups(internal_id, order_id_internal_id) ON DELETE RESTRICT
- `order_group_id_internal_id` → `commerce.order_groups(internal_id)` via `fk_commerce_order_items_order_group_id_order_groups_numeric`; FOREIGN KEY (order_group_id_internal_id) REFERENCES commerce.order_groups(internal_id) ON DELETE SET NULL
- `order_id_internal_id` → `commerce.orders(internal_id)` via `fk_commerce_order_items_order_id_orders_numeric`; FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE CASCADE
- `prescription_id_internal_id` → `clinical.prescriptions(internal_id)` via `fk_commerce_order_items_prescription_id_prescriptions_numeric`; FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE SET NULL
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_commerce_order_items_product_id_products_numeric`; FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT
- `seller_id_internal_id` → `marketplace.sellers(internal_id)` via `fk_commerce_order_items_seller_id_sellers_numeric`; FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE SET NULL
- `variant_id_internal_id` → `catalog.product_variants(internal_id)` via `fk_commerce_order_items_variant_id_product_variants_numeric`; FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT

**Referenced by 22 FK constraints** (sample): `commerce.order_discounts`, `commerce.order_allocations`, `commerce.cancellation_items`, `commerce.return_items`, `finance.invoice_items`, `fulfillment.fulfillment_order_items`, `fulfillment.pick_task_items`, `fulfillment.package_items`, `clinical.order_review_items`, `payment.refund_allocations`, `warehouse.stock_reservations`, `clinical.order_review_items`.

## commerce.order_items — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 30 columns, 35 constraints, 10 indexes, 5 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `commerce_class_snapshot` | `catalog.commerce_classes` | `fk_commerce_order_items_commerce_class_snapshot_commerc_4b6d` |
| `created_by` | `identity.users` | `fk_commerce_order_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_commerce_order_items_updated_by_users` |
| `variant_id` | `catalog.product_variants` | `fk_commerce_order_items_variant_id_product_variants` |
| `order_group_id` | `commerce.order_groups` | `fk_commerce_order_items_order_group_id_order_groups` |
| `order_id` | `commerce.orders` | `fk_commerce_order_items_order_id_orders` |
| `product_id` | `catalog.products` | `fk_commerce_order_items_product_id_products` |
| `order_group_id`, `order_id` | `commerce.order_groups` | `fk_commerce_order_items_group_order` |
| `prescription_id` | `clinical.prescriptions` | `fk_commerce_order_items_prescription_id_prescriptions` |
| `seller_id` | `marketplace.sellers` | `fk_commerce_order_items_seller_id_sellers` |
| `order_group_id_internal_id`, `order_id_internal_id` | `commerce.order_groups` | `fk_commerce_order_items_group_order_numeric` |
| `order_group_id_internal_id` | `commerce.order_groups` | `fk_commerce_order_items_order_group_id_order_groups_numeric` |
| `order_id_internal_id` | `commerce.orders` | `fk_commerce_order_items_order_id_orders_numeric` |
| `prescription_id_internal_id` | `clinical.prescriptions` | `fk_commerce_order_items_prescription_id_prescriptions_numeric` |
| `product_id_internal_id` | `catalog.products` | `fk_commerce_order_items_product_id_products_numeric` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_commerce_order_items_seller_id_sellers_numeric` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_commerce_order_items_variant_id_product_variants_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_commerce_order_items_group` | `CREATE INDEX ix_commerce_order_items_group ON commerce.order_items USING btree (order_group_id)` |
| `ix_commerce_order_items_internal_order` | `CREATE INDEX ix_commerce_order_items_internal_order ON commerce.order_items USING btree (order_id_internal_id)` |
| `ix_commerce_order_items_order` | `CREATE INDEX ix_commerce_order_items_order ON commerce.order_items USING btree (order_id)` |
| `ix_commerce_order_items_prescription` | `CREATE INDEX ix_commerce_order_items_prescription ON commerce.order_items USING btree (prescription_id)` |
| `ix_commerce_order_items_product` | `CREATE INDEX ix_commerce_order_items_product ON commerce.order_items USING btree (product_id, variant_id)` |
| `ix_commerce_order_items_status` | `CREATE INDEX ix_commerce_order_items_status ON commerce.order_items USING btree (status)` |
| `pk_commerce_order_items` | `CREATE UNIQUE INDEX pk_commerce_order_items ON commerce.order_items USING btree (internal_id)` |
| `uq_commerce_order_items_id` | `CREATE UNIQUE INDEX uq_commerce_order_items_id ON commerce.order_items USING btree (id)` |
| `uq_commerce_order_items_id_order` | `CREATE UNIQUE INDEX uq_commerce_order_items_id_order ON commerce.order_items USING btree (id, order_id)` |
| `uq_numeric_commerce_order_items_internal_id_order_id_in_fa29` | `CREATE UNIQUE INDEX uq_numeric_commerce_order_items_internal_id_order_id_in_fa29 ON commerce.order_items USING btree (internal_id, order_id_internal_id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_group_id","order_group_id_internal_id","commerce","order_groups"],["order_id","order_id_internal_id","commerce","orders"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["product_id","product_id_internal_id","catalog","products"],["seller_id","seller_id_internal_id","marketplace","sellers"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |
| `order_clinical_gate` | `CREATE TRIGGER order_clinical_gate AFTER INSERT OR UPDATE ON commerce.order_items FOR EACH ROW EXECUTE FUNCTION commerce.refresh_clinical_gate()` |
| `order_item_guard` | `CREATE TRIGGER order_item_guard BEFORE INSERT OR DELETE OR UPDATE ON commerce.order_items FOR EACH ROW EXECUTE FUNCTION commerce.guard_order_item()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_group_id","order_group_id_internal_id","commerce","order_groups"],["order_id","order_id_internal_id","commerce","orders"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["product_id","product_id_internal_id","catalog","products"],["seller_id","seller_id_internal_id","marketplace","sellers"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
