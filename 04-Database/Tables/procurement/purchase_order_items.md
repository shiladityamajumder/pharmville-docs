# `procurement.purchase_order_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds purchase order items records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | procurement.purchase_order_items |
| Classification | Transactional |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 20 columns; 21 PK/FK/UQ/CHECK/exclusion constraints; 14 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_purchase_order_items_created_by_users` |
| `discount_amount` | `numeric(14,2)` | No | `0` | Value of discount amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `ordered_qty` | `numeric(16,3)` | No | — | Ordered qty value | Track resource or item amounts accurately | Exact constraints below |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_procurement_purchase_order_items_product_id_products` |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_procurement_purchase_order_items_product_id_products_numeric` |
| `purchase_order_id` | `uuid` | No | — | Reference linking this record to purchase orders | Ensures related business data can be joined and validated | FK → `procurement.purchase_orders` via `fk_procurement_purchase_order_items_purchase_order_id_p_bb14` |
| `purchase_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.purchase_orders` via `fk_procurement_purchase_order_items_purchase_order_id_p_c99d` |
| `received_qty` | `numeric(16,3)` | No | `0` | Received qty value | Track resource or item amounts accurately | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `supplier_product_id` | `uuid` | Yes | — | Reference linking this record to supplier products | Ensures related business data can be joined and validated | FK → `procurement.supplier_products` via `fk_procurement_purchase_order_items_supplier_product_id_c908` |
| `supplier_product_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.supplier_products` via `fk_procurement_purchase_order_items_supplier_product_id_b5cc` |
| `tax_rate` | `numeric(7,4)` | No | `0` | Inferred: stores tax rate for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `unit_cost` | `numeric(14,2)` | No | — | Inferred: stores unit cost for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_purchase_order_items_updated_by_users` |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` via `fk_procurement_purchase_order_items_variant_id_product_variants` |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` via `fk_procurement_purchase_order_items_variant_id_product__7c24` |

## Record lifecycle and users

- **Created:** when the purchase order items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.purchase_order_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_procurement_purchase_order_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_order_items_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_order_items_product_id_products_numeric | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| fk_procurement_purchase_order_items_purchase_order_id_p_bb14 | `purchase_order_id` | [`procurement.purchase_orders`](../../Tables/procurement/purchase_orders.md) | `FOREIGN KEY (purchase_order_id) REFERENCES procurement.purchase_orders(id) ON DELETE CASCADE` |
| fk_procurement_purchase_order_items_purchase_order_id_p_c99d | `purchase_order_id_internal_id` | [`procurement.purchase_orders`](../../Tables/procurement/purchase_orders.md) | `FOREIGN KEY (purchase_order_id_internal_id) REFERENCES procurement.purchase_orders(internal_id) ON DELETE CASCADE` |
| fk_procurement_purchase_order_items_supplier_product_id_b5cc | `supplier_product_id_internal_id` | [`procurement.supplier_products`](../../Tables/procurement/supplier_products.md) | `FOREIGN KEY (supplier_product_id_internal_id) REFERENCES procurement.supplier_products(internal_id) ON DELETE SET NULL` |
| fk_procurement_purchase_order_items_supplier_product_id_c908 | `supplier_product_id` | [`procurement.supplier_products`](../../Tables/procurement/supplier_products.md) | `FOREIGN KEY (supplier_product_id) REFERENCES procurement.supplier_products(id) ON DELETE SET NULL` |
| fk_procurement_purchase_order_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_order_items_variant_id_product__7c24 | `variant_id_internal_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT` |
| fk_procurement_purchase_order_items_variant_id_product_variants | `variant_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`procurement.goods_receipt_items`](../../Tables/procurement/goods_receipt_items.md) | fk_procurement_goods_receipt_items_purchase_order_item__9047 | `purchase_order_item_id_internal_id` | `internal_id` |
| [`procurement.goods_receipt_items`](../../Tables/procurement/goods_receipt_items.md) | fk_procurement_goods_receipt_items_purchase_order_item__eead | `purchase_order_item_id` | `id` |

## `procurement.purchase_order_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_purchase_order_items_created_by_users` |
| `product_id` | `catalog.products` | `fk_procurement_purchase_order_items_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_procurement_purchase_order_items_product_id_products_numeric` |
| `purchase_order_id` | `procurement.purchase_orders` | `fk_procurement_purchase_order_items_purchase_order_id_p_bb14` |
| `purchase_order_id_internal_id` | `procurement.purchase_orders` | `fk_procurement_purchase_order_items_purchase_order_id_p_c99d` |
| `supplier_product_id_internal_id` | `procurement.supplier_products` | `fk_procurement_purchase_order_items_supplier_product_id_b5cc` |
| `supplier_product_id` | `procurement.supplier_products` | `fk_procurement_purchase_order_items_supplier_product_id_c908` |
| `updated_by` | `identity.users` | `fk_procurement_purchase_order_items_updated_by_users` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_procurement_purchase_order_items_variant_id_product__7c24` |
| `variant_id` | `catalog.product_variants` | `fk_procurement_purchase_order_items_variant_id_product_variants` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_procurement_purchase_order_items_cost_tax_nonnegative` | CHECK | `CHECK (unit_cost >= 0::numeric AND tax_rate >= 0::numeric)` |
| `ck_procurement_purchase_order_items_finite_numeric_values` | CHECK | `CHECK ((ordered_qty IS NULL OR (ordered_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (received_qty IS NULL OR (received_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (unit_cost IS NULL OR (unit_cost <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (discount_amount IS NULL OR (discount_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (tax_rate IS NULL OR (tax_rate <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_procurement_purchase_order_items_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_procurement_purchase_order_items_numeric_pair_purcha_769d` | CHECK | `CHECK ((purchase_order_id IS NULL) = (purchase_order_id_internal_id IS NULL))` |
| `ck_procurement_purchase_order_items_numeric_pair_suppli_1f67` | CHECK | `CHECK ((supplier_product_id IS NULL) = (supplier_product_id_internal_id IS NULL))` |
| `ck_procurement_purchase_order_items_numeric_pair_variant_id` | CHECK | `CHECK ((variant_id IS NULL) = (variant_id_internal_id IS NULL))` |
| `ck_procurement_purchase_order_items_ordered_qty_positive` | CHECK | `CHECK (ordered_qty > 0::numeric)` |
| `ck_procurement_purchase_order_items_received_qty_range` | CHECK | `CHECK (received_qty >= 0::numeric AND received_qty <= ordered_qty)` |
| `ck_procurement_purchase_order_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_procurement_purchase_order_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_order_items_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_order_items_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_order_items_purchase_order_id_p_bb14` | FOREIGN KEY | `FOREIGN KEY (purchase_order_id) REFERENCES procurement.purchase_orders(id) ON DELETE CASCADE` |
| `fk_procurement_purchase_order_items_purchase_order_id_p_c99d` | FOREIGN KEY | `FOREIGN KEY (purchase_order_id_internal_id) REFERENCES procurement.purchase_orders(internal_id) ON DELETE CASCADE` |
| `fk_procurement_purchase_order_items_supplier_product_id_b5cc` | FOREIGN KEY | `FOREIGN KEY (supplier_product_id_internal_id) REFERENCES procurement.supplier_products(internal_id) ON DELETE SET NULL` |
| `fk_procurement_purchase_order_items_supplier_product_id_c908` | FOREIGN KEY | `FOREIGN KEY (supplier_product_id) REFERENCES procurement.supplier_products(id) ON DELETE SET NULL` |
| `fk_procurement_purchase_order_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_order_items_variant_id_product__7c24` | FOREIGN KEY | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_order_items_variant_id_product_variants` | FOREIGN KEY | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT` |
| `pk_procurement_purchase_order_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_procurement_purchase_order_items_id` | UNIQUE | `UNIQUE (id)` |
| `purchase_order_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `purchase_order_items_discount_amount_not_null` | NOT NULL | `NOT NULL discount_amount` |
| `purchase_order_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `purchase_order_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `purchase_order_items_ordered_qty_not_null` | NOT NULL | `NOT NULL ordered_qty` |
| `purchase_order_items_product_id_internal_id_not_null` | NOT NULL | `NOT NULL product_id_internal_id` |
| `purchase_order_items_product_id_not_null` | NOT NULL | `NOT NULL product_id` |
| `purchase_order_items_purchase_order_id_internal_id_not_null` | NOT NULL | `NOT NULL purchase_order_id_internal_id` |
| `purchase_order_items_purchase_order_id_not_null` | NOT NULL | `NOT NULL purchase_order_id` |
| `purchase_order_items_received_qty_not_null` | NOT NULL | `NOT NULL received_qty` |
| `purchase_order_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `purchase_order_items_tax_rate_not_null` | NOT NULL | `NOT NULL tax_rate` |
| `purchase_order_items_unit_cost_not_null` | NOT NULL | `NOT NULL unit_cost` |
| `purchase_order_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_procurement_purchase_order_items_po` | btree | `(purchase_order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_purchase_order_items_po ON procurement.purchase_order_items USING btree (purchase_order_id)` |
| `ix_procurement_purchase_order_items_product` | btree | `(product_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_purchase_order_items_product ON procurement.purchase_order_items USING btree (product_id)` |
| `pk_procurement_purchase_order_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_procurement_purchase_order_items ON procurement.purchase_order_items USING btree (internal_id)` |
| `uq_procurement_purchase_order_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_procurement_purchase_order_items_id ON procurement.purchase_order_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["purchase_order_id","purchase_order_id_internal_id","procurement","purchase_orders"],["supplier_product_id","supplier_product_id_internal_id","procurement","supplier_products"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.purchase_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["purchase_order_id","purchase_order_id_internal_id","procurement","purchase_orders"],["supplier_product_id","supplier_product_id_internal_id","procurement","supplier_products"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
