# commerce.cart_items

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds cart items records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 24 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `cart_id` | `uuid` | No | — | Reference linking this record to carts | Ensures related business data can be joined and validated | FK → `commerce.carts` (fk_commerce_cart_items_cart_id_carts) |
| `cart_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.carts` (fk_commerce_cart_items_cart_id_carts_numeric); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_cart_items_created_by_users) |
| `fulfillment_preference` | `character varying(32)` | Yes | — | Inferred: stores fulfillment preference for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | See exact constraints |
| `prescription_id` | `uuid` | Yes | — | Reference linking this record to prescriptions | Ensures related business data can be joined and validated | FK → `clinical.prescriptions` (fk_commerce_cart_items_prescription_id_prescriptions) |
| `prescription_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescriptions` (fk_commerce_cart_items_prescription_id_prescriptions_numeric); Numeric/public-key pair verification required |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_commerce_cart_items_product_id_products) |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_commerce_cart_items_product_id_products_numeric); Numeric/public-key pair verification required |
| `quantity` | `numeric(12,3)` | No | — | Quantity value | Track resource or item amounts accurately | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `seller_id` | `uuid` | Yes | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` (fk_commerce_cart_items_seller_id_sellers) |
| `seller_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` (fk_commerce_cart_items_seller_id_sellers_numeric); Numeric/public-key pair verification required |
| `unit_price_snapshot` | `numeric(14,2)` | No | — | Structured unit price snapshot information | Retain a versioned payload or relevant details | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_cart_items_updated_by_users) |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` (fk_commerce_cart_items_variant_id_product_variants) |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` (fk_commerce_cart_items_variant_id_product_variants_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the cart items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.cart_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_commerce_cart_items_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_commerce_cart_items_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `prescription_id` → `clinical.prescriptions(id)` via `fk_commerce_cart_items_prescription_id_prescriptions`; FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE SET NULL
- `product_id` → `catalog.products(id)` via `fk_commerce_cart_items_product_id_products`; FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT
- `seller_id` → `marketplace.sellers(id)` via `fk_commerce_cart_items_seller_id_sellers`; FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE SET NULL
- `variant_id` → `catalog.product_variants(id)` via `fk_commerce_cart_items_variant_id_product_variants`; FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT
- `cart_id` → `commerce.carts(id)` via `fk_commerce_cart_items_cart_id_carts`; FOREIGN KEY (cart_id) REFERENCES commerce.carts(id) ON DELETE CASCADE
- `cart_id_internal_id` → `commerce.carts(internal_id)` via `fk_commerce_cart_items_cart_id_carts_numeric`; FOREIGN KEY (cart_id_internal_id) REFERENCES commerce.carts(internal_id) ON DELETE CASCADE
- `prescription_id_internal_id` → `clinical.prescriptions(internal_id)` via `fk_commerce_cart_items_prescription_id_prescriptions_numeric`; FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE SET NULL
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_commerce_cart_items_product_id_products_numeric`; FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT
- `seller_id_internal_id` → `marketplace.sellers(internal_id)` via `fk_commerce_cart_items_seller_id_sellers_numeric`; FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE SET NULL
- `variant_id_internal_id` → `catalog.product_variants(internal_id)` via `fk_commerce_cart_items_variant_id_product_variants_numeric`; FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT

## commerce.cart_items — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 21 columns, 24 constraints, 6 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_commerce_cart_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_commerce_cart_items_updated_by_users` |
| `prescription_id` | `clinical.prescriptions` | `fk_commerce_cart_items_prescription_id_prescriptions` |
| `product_id` | `catalog.products` | `fk_commerce_cart_items_product_id_products` |
| `seller_id` | `marketplace.sellers` | `fk_commerce_cart_items_seller_id_sellers` |
| `variant_id` | `catalog.product_variants` | `fk_commerce_cart_items_variant_id_product_variants` |
| `cart_id` | `commerce.carts` | `fk_commerce_cart_items_cart_id_carts` |
| `cart_id_internal_id` | `commerce.carts` | `fk_commerce_cart_items_cart_id_carts_numeric` |
| `prescription_id_internal_id` | `clinical.prescriptions` | `fk_commerce_cart_items_prescription_id_prescriptions_numeric` |
| `product_id_internal_id` | `catalog.products` | `fk_commerce_cart_items_product_id_products_numeric` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_commerce_cart_items_seller_id_sellers_numeric` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_commerce_cart_items_variant_id_product_variants_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `cart_line_identity` | `CREATE UNIQUE INDEX cart_line_identity ON commerce.cart_items USING btree (cart_id, product_id, variant_id, prescription_id, seller_id) NULLS NOT DISTINCT` |
| `ix_commerce_cart_items_cart` | `CREATE INDEX ix_commerce_cart_items_cart ON commerce.cart_items USING btree (cart_id)` |
| `ix_commerce_cart_items_prescription` | `CREATE INDEX ix_commerce_cart_items_prescription ON commerce.cart_items USING btree (prescription_id)` |
| `ix_commerce_cart_items_product` | `CREATE INDEX ix_commerce_cart_items_product ON commerce.cart_items USING btree (product_id, variant_id)` |
| `pk_commerce_cart_items` | `CREATE UNIQUE INDEX pk_commerce_cart_items ON commerce.cart_items USING btree (internal_id)` |
| `uq_commerce_cart_items_id` | `CREATE UNIQUE INDEX uq_commerce_cart_items_id ON commerce.cart_items USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.cart_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["cart_id","cart_id_internal_id","commerce","carts"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["product_id","product_id_internal_id","catalog","products"],["seller_id","seller_id_internal_id","marketplace","sellers"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.cart_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.cart_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["cart_id","cart_id_internal_id","commerce","carts"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["product_id","product_id_internal_id","catalog","products"],["seller_id","seller_id_internal_id","marketplace","sellers"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
