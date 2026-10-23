# pricing.product_prices

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds product prices records within the pricing domain (prices, taxes, promotions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 19 columns, 21 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `cost_price` | `numeric(14,2)` | Yes | — | Value of cost price | Enable pricing, reconciliation or reporting | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_pricing_product_prices_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `mrp` | `numeric(14,2)` | No | — | Inferred: stores mrp for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `price_book_id` | `uuid` | No | — | Reference linking this record to price books | Ensures related business data can be joined and validated | FK → `pricing.price_books` (fk_pricing_product_prices_price_book_id_price_books) |
| `price_book_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `pricing.price_books` (fk_pricing_product_prices_price_book_id_price_books_numeric); Numeric/public-key pair verification required |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_pricing_product_prices_product_id_products) |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_pricing_product_prices_product_id_products_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `selling_price` | `numeric(14,2)` | No | — | Value of selling price | Enable pricing, reconciliation or reporting | See exact constraints |
| `source` | `character varying(32)` | No | `'manual'::character varying` | Inferred: stores source for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_pricing_product_prices_updated_by_users) |
| `valid_from` | `timestamp with time zone` | No | — | Inferred: stores valid from for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `valid_until` | `timestamp with time zone` | Yes | — | Inferred: stores valid until for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` (fk_pricing_product_prices_variant_id_product_variants) |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` (fk_pricing_product_prices_variant_id_product_variants_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the product prices business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Cart_Checkout. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `pricing.product_prices` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_pricing_product_prices_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_pricing_product_prices_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `price_book_id` → `pricing.price_books(id)` via `fk_pricing_product_prices_price_book_id_price_books`; FOREIGN KEY (price_book_id) REFERENCES pricing.price_books(id) ON DELETE CASCADE
- `variant_id` → `catalog.product_variants(id)` via `fk_pricing_product_prices_variant_id_product_variants`; FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE CASCADE
- `product_id` → `catalog.products(id)` via `fk_pricing_product_prices_product_id_products`; FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE
- `price_book_id_internal_id` → `pricing.price_books(internal_id)` via `fk_pricing_product_prices_price_book_id_price_books_numeric`; FOREIGN KEY (price_book_id_internal_id) REFERENCES pricing.price_books(internal_id) ON DELETE CASCADE
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_pricing_product_prices_product_id_products_numeric`; FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE
- `variant_id_internal_id` → `catalog.product_variants(internal_id)` via `fk_pricing_product_prices_variant_id_product_variants_numeric`; FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE CASCADE

## pricing.product_prices — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 19 columns, 21 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_pricing_product_prices_created_by_users` |
| `updated_by` | `identity.users` | `fk_pricing_product_prices_updated_by_users` |
| `price_book_id` | `pricing.price_books` | `fk_pricing_product_prices_price_book_id_price_books` |
| `variant_id` | `catalog.product_variants` | `fk_pricing_product_prices_variant_id_product_variants` |
| `product_id` | `catalog.products` | `fk_pricing_product_prices_product_id_products` |
| `price_book_id_internal_id` | `pricing.price_books` | `fk_pricing_product_prices_price_book_id_price_books_numeric` |
| `product_id_internal_id` | `catalog.products` | `fk_pricing_product_prices_product_id_products_numeric` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_pricing_product_prices_variant_id_product_variants_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_pricing_product_prices_cost_price_nonnegative` | CHECK | `CHECK (cost_price IS NULL OR cost_price >= 0::numeric)` |
| `ck_pricing_product_prices_finite_numeric_values` | CHECK | `CHECK ((mrp IS NULL OR (mrp <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (selling_price IS NULL OR (selling_price <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (cost_price IS NULL OR (cost_price <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_pricing_product_prices_mrp_nonnegative` | CHECK | `CHECK (mrp >= 0::numeric)` |
| `ck_pricing_product_prices_numeric_pair_price_book_id` | CHECK | `CHECK ((price_book_id IS NULL) = (price_book_id_internal_id IS NULL))` |
| `ck_pricing_product_prices_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_pricing_product_prices_numeric_pair_variant_id` | CHECK | `CHECK ((variant_id IS NULL) = (variant_id_internal_id IS NULL))` |
| `ck_pricing_product_prices_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_pricing_product_prices_selling_not_above_mrp` | CHECK | `CHECK (selling_price <= mrp)` |
| `ck_pricing_product_prices_selling_price_nonnegative` | CHECK | `CHECK (selling_price >= 0::numeric)` |
| `ck_pricing_product_prices_valid_window` | CHECK | `CHECK (valid_until IS NULL OR valid_until > valid_from)` |
| `fk_pricing_product_prices_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_pricing_product_prices_price_book_id_price_books` | FOREIGN KEY | `FOREIGN KEY (price_book_id) REFERENCES pricing.price_books(id) ON DELETE CASCADE` |
| `fk_pricing_product_prices_price_book_id_price_books_numeric` | FOREIGN KEY | `FOREIGN KEY (price_book_id_internal_id) REFERENCES pricing.price_books(internal_id) ON DELETE CASCADE` |
| `fk_pricing_product_prices_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| `fk_pricing_product_prices_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| `fk_pricing_product_prices_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_pricing_product_prices_variant_id_product_variants` | FOREIGN KEY | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE CASCADE` |
| `fk_pricing_product_prices_variant_id_product_variants_numeric` | FOREIGN KEY | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE CASCADE` |
| `pk_pricing_product_prices` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `price_window` | UNIQUE | `UNIQUE NULLS NOT DISTINCT (price_book_id, product_id, variant_id, valid_from)` |
| `uq_pricing_product_prices_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_pricing_product_prices_price_book` | `CREATE INDEX ix_pricing_product_prices_price_book ON pricing.product_prices USING btree (price_book_id)` |
| `ix_pricing_product_prices_product` | `CREATE INDEX ix_pricing_product_prices_product ON pricing.product_prices USING btree (product_id, variant_id)` |
| `pk_pricing_product_prices` | `CREATE UNIQUE INDEX pk_pricing_product_prices ON pricing.product_prices USING btree (internal_id)` |
| `price_window` | `CREATE UNIQUE INDEX price_window ON pricing.product_prices USING btree (price_book_id, product_id, variant_id, valid_from) NULLS NOT DISTINCT` |
| `uq_pricing_product_prices_id` | `CREATE UNIQUE INDEX uq_pricing_product_prices_id ON pricing.product_prices USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON pricing.product_prices FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["price_book_id","price_book_id_internal_id","pricing","price_books"],["product_id","product_id_internal_id","catalog","products"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON pricing.product_prices FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON pricing.product_prices FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["price_book_id","price_book_id_internal_id","pricing","price_books"],["product_id","product_id_internal_id","catalog","products"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
