# `commerce.cart_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds cart items records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | commerce.cart_items |
| Classification | Transactional |
| Proposed business write owner | Cart_Checkout |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 24 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `cart_id` | `uuid` | No | — | Reference linking this record to carts | Ensures related business data can be joined and validated | FK → `commerce.carts` via `fk_commerce_cart_items_cart_id_carts` |
| `cart_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.carts` via `fk_commerce_cart_items_cart_id_carts_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_cart_items_created_by_users` |
| `fulfillment_preference` | `character varying(32)` | Yes | — | Inferred: stores fulfillment preference for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | Exact constraints below |
| `prescription_id` | `uuid` | Yes | — | Reference linking this record to prescriptions | Ensures related business data can be joined and validated | FK → `clinical.prescriptions` via `fk_commerce_cart_items_prescription_id_prescriptions` |
| `prescription_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescriptions` via `fk_commerce_cart_items_prescription_id_prescriptions_numeric` |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_commerce_cart_items_product_id_products` |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_commerce_cart_items_product_id_products_numeric` |
| `quantity` | `numeric(12,3)` | No | — | Quantity value | Track resource or item amounts accurately | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `seller_id` | `uuid` | Yes | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` via `fk_commerce_cart_items_seller_id_sellers` |
| `seller_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` via `fk_commerce_cart_items_seller_id_sellers_numeric` |
| `unit_price_snapshot` | `numeric(14,2)` | No | — | Structured unit price snapshot information | Retain a versioned payload or relevant details | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_cart_items_updated_by_users` |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` via `fk_commerce_cart_items_variant_id_product_variants` |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` via `fk_commerce_cart_items_variant_id_product_variants_numeric` |

## Record lifecycle and users

- **Created:** when the cart items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.cart_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_commerce_cart_items_cart_id_carts | `cart_id` | [`commerce.carts`](../../Tables/commerce/carts.md) | `FOREIGN KEY (cart_id) REFERENCES commerce.carts(id) ON DELETE CASCADE` |
| fk_commerce_cart_items_cart_id_carts_numeric | `cart_id_internal_id` | [`commerce.carts`](../../Tables/commerce/carts.md) | `FOREIGN KEY (cart_id_internal_id) REFERENCES commerce.carts(internal_id) ON DELETE CASCADE` |
| fk_commerce_cart_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_commerce_cart_items_prescription_id_prescriptions | `prescription_id` | [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE SET NULL` |
| fk_commerce_cart_items_prescription_id_prescriptions_numeric | `prescription_id_internal_id` | [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE SET NULL` |
| fk_commerce_cart_items_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| fk_commerce_cart_items_product_id_products_numeric | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| fk_commerce_cart_items_seller_id_sellers | `seller_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE SET NULL` |
| fk_commerce_cart_items_seller_id_sellers_numeric | `seller_id_internal_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE SET NULL` |
| fk_commerce_cart_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_commerce_cart_items_variant_id_product_variants | `variant_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT` |
| fk_commerce_cart_items_variant_id_product_variants_numeric | `variant_id_internal_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `commerce.cart_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `cart_id` | `commerce.carts` | `fk_commerce_cart_items_cart_id_carts` |
| `cart_id_internal_id` | `commerce.carts` | `fk_commerce_cart_items_cart_id_carts_numeric` |
| `created_by` | `identity.users` | `fk_commerce_cart_items_created_by_users` |
| `prescription_id` | `clinical.prescriptions` | `fk_commerce_cart_items_prescription_id_prescriptions` |
| `prescription_id_internal_id` | `clinical.prescriptions` | `fk_commerce_cart_items_prescription_id_prescriptions_numeric` |
| `product_id` | `catalog.products` | `fk_commerce_cart_items_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_commerce_cart_items_product_id_products_numeric` |
| `seller_id` | `marketplace.sellers` | `fk_commerce_cart_items_seller_id_sellers` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_commerce_cart_items_seller_id_sellers_numeric` |
| `updated_by` | `identity.users` | `fk_commerce_cart_items_updated_by_users` |
| `variant_id` | `catalog.product_variants` | `fk_commerce_cart_items_variant_id_product_variants` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_commerce_cart_items_variant_id_product_variants_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `cart_line_identity` | UNIQUE | `UNIQUE NULLS NOT DISTINCT (cart_id, product_id, variant_id, prescription_id, seller_id)` |
| `ck_commerce_cart_items_finite_numeric_values` | CHECK | `CHECK ((quantity IS NULL OR (quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (unit_price_snapshot IS NULL OR (unit_price_snapshot <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_commerce_cart_items_numeric_pair_cart_id` | CHECK | `CHECK ((cart_id IS NULL) = (cart_id_internal_id IS NULL))` |
| `ck_commerce_cart_items_numeric_pair_prescription_id` | CHECK | `CHECK ((prescription_id IS NULL) = (prescription_id_internal_id IS NULL))` |
| `ck_commerce_cart_items_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_commerce_cart_items_numeric_pair_seller_id` | CHECK | `CHECK ((seller_id IS NULL) = (seller_id_internal_id IS NULL))` |
| `ck_commerce_cart_items_numeric_pair_variant_id` | CHECK | `CHECK ((variant_id IS NULL) = (variant_id_internal_id IS NULL))` |
| `ck_commerce_cart_items_quantity_positive` | CHECK | `CHECK (quantity > 0::numeric)` |
| `ck_commerce_cart_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_commerce_cart_items_unit_price_nonnegative` | CHECK | `CHECK (unit_price_snapshot >= 0::numeric)` |
| `fk_commerce_cart_items_cart_id_carts` | FOREIGN KEY | `FOREIGN KEY (cart_id) REFERENCES commerce.carts(id) ON DELETE CASCADE` |
| `fk_commerce_cart_items_cart_id_carts_numeric` | FOREIGN KEY | `FOREIGN KEY (cart_id_internal_id) REFERENCES commerce.carts(internal_id) ON DELETE CASCADE` |
| `fk_commerce_cart_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_cart_items_prescription_id_prescriptions` | FOREIGN KEY | `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE SET NULL` |
| `fk_commerce_cart_items_prescription_id_prescriptions_numeric` | FOREIGN KEY | `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE SET NULL` |
| `fk_commerce_cart_items_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| `fk_commerce_cart_items_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| `fk_commerce_cart_items_seller_id_sellers` | FOREIGN KEY | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE SET NULL` |
| `fk_commerce_cart_items_seller_id_sellers_numeric` | FOREIGN KEY | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE SET NULL` |
| `fk_commerce_cart_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_cart_items_variant_id_product_variants` | FOREIGN KEY | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT` |
| `fk_commerce_cart_items_variant_id_product_variants_numeric` | FOREIGN KEY | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT` |
| `pk_commerce_cart_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_commerce_cart_items_id` | UNIQUE | `UNIQUE (id)` |
| `cart_items_cart_id_internal_id_not_null` | NOT NULL | `NOT NULL cart_id_internal_id` |
| `cart_items_cart_id_not_null` | NOT NULL | `NOT NULL cart_id` |
| `cart_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `cart_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `cart_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `cart_items_metadata_json_not_null` | NOT NULL | `NOT NULL metadata_json` |
| `cart_items_product_id_internal_id_not_null` | NOT NULL | `NOT NULL product_id_internal_id` |
| `cart_items_product_id_not_null` | NOT NULL | `NOT NULL product_id` |
| `cart_items_quantity_not_null` | NOT NULL | `NOT NULL quantity` |
| `cart_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `cart_items_unit_price_snapshot_not_null` | NOT NULL | `NOT NULL unit_price_snapshot` |
| `cart_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `cart_line_identity` | btree | `(cart_id, product_id, variant_id, prescription_id, seller_id) NULLS NOT DISTINCT` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX cart_line_identity ON commerce.cart_items USING btree (cart_id, product_id, variant_id, prescription_id, seller_id) NULLS NOT DISTINCT` |
| `ix_commerce_cart_items_cart` | btree | `(cart_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_cart_items_cart ON commerce.cart_items USING btree (cart_id)` |
| `ix_commerce_cart_items_prescription` | btree | `(prescription_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_cart_items_prescription ON commerce.cart_items USING btree (prescription_id)` |
| `ix_commerce_cart_items_product` | btree | `(product_id, variant_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_cart_items_product ON commerce.cart_items USING btree (product_id, variant_id)` |
| `pk_commerce_cart_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_commerce_cart_items ON commerce.cart_items USING btree (internal_id)` |
| `uq_commerce_cart_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_cart_items_id ON commerce.cart_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.cart_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["cart_id","cart_id_internal_id","commerce","carts"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["product_id","product_id_internal_id","catalog","products"],["seller_id","seller_id_internal_id","marketplace","sellers"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.cart_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.cart_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["cart_id","cart_id_internal_id","commerce","carts"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["product_id","product_id_internal_id","catalog","products"],["seller_id","seller_id_internal_id","marketplace","sellers"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
