# `pricing.product_prices`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds product prices records within the pricing domain (prices, taxes, promotions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | pricing.product_prices |
| Classification | Configuration |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 19 columns; 21 PK/FK/UQ/CHECK/exclusion constraints; 13 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `cost_price` | `numeric(14,2)` | Yes | — | Value of cost price | Enable pricing, reconciliation or reporting | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_product_prices_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `mrp` | `numeric(14,2)` | No | — | Inferred: stores mrp for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `price_book_id` | `uuid` | No | — | Reference linking this record to price books | Ensures related business data can be joined and validated | FK → `pricing.price_books` via `fk_pricing_product_prices_price_book_id_price_books` |
| `price_book_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `pricing.price_books` via `fk_pricing_product_prices_price_book_id_price_books_numeric` |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_pricing_product_prices_product_id_products` |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_pricing_product_prices_product_id_products_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `selling_price` | `numeric(14,2)` | No | — | Value of selling price | Enable pricing, reconciliation or reporting | Exact constraints below |
| `source` | `character varying(32)` | No | `'manual'::character varying` | Inferred: stores source for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_product_prices_updated_by_users` |
| `valid_from` | `timestamp with time zone` | No | — | Inferred: stores valid from for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `valid_until` | `timestamp with time zone` | Yes | — | Inferred: stores valid until for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` via `fk_pricing_product_prices_variant_id_product_variants` |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` via `fk_pricing_product_prices_variant_id_product_variants_numeric` |

## Record lifecycle and users

- **Created:** when the product prices business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Cart_Checkout. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `pricing.product_prices` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_pricing_product_prices_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_pricing_product_prices_price_book_id_price_books | `price_book_id` | [`pricing.price_books`](../../Tables/pricing/price_books.md) | `FOREIGN KEY (price_book_id) REFERENCES pricing.price_books(id) ON DELETE CASCADE` |
| fk_pricing_product_prices_price_book_id_price_books_numeric | `price_book_id_internal_id` | [`pricing.price_books`](../../Tables/pricing/price_books.md) | `FOREIGN KEY (price_book_id_internal_id) REFERENCES pricing.price_books(internal_id) ON DELETE CASCADE` |
| fk_pricing_product_prices_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| fk_pricing_product_prices_product_id_products_numeric | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| fk_pricing_product_prices_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_pricing_product_prices_variant_id_product_variants | `variant_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE CASCADE` |
| fk_pricing_product_prices_variant_id_product_variants_numeric | `variant_id_internal_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `pricing.product_prices` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_pricing_product_prices_created_by_users` |
| `price_book_id` | `pricing.price_books` | `fk_pricing_product_prices_price_book_id_price_books` |
| `price_book_id_internal_id` | `pricing.price_books` | `fk_pricing_product_prices_price_book_id_price_books_numeric` |
| `product_id` | `catalog.products` | `fk_pricing_product_prices_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_pricing_product_prices_product_id_products_numeric` |
| `updated_by` | `identity.users` | `fk_pricing_product_prices_updated_by_users` |
| `variant_id` | `catalog.product_variants` | `fk_pricing_product_prices_variant_id_product_variants` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_pricing_product_prices_variant_id_product_variants_numeric` |

### Existing constraints

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
| `product_prices_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `product_prices_id_not_null` | NOT NULL | `NOT NULL id` |
| `product_prices_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `product_prices_mrp_not_null` | NOT NULL | `NOT NULL mrp` |
| `product_prices_price_book_id_internal_id_not_null` | NOT NULL | `NOT NULL price_book_id_internal_id` |
| `product_prices_price_book_id_not_null` | NOT NULL | `NOT NULL price_book_id` |
| `product_prices_product_id_internal_id_not_null` | NOT NULL | `NOT NULL product_id_internal_id` |
| `product_prices_product_id_not_null` | NOT NULL | `NOT NULL product_id` |
| `product_prices_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `product_prices_selling_price_not_null` | NOT NULL | `NOT NULL selling_price` |
| `product_prices_source_not_null` | NOT NULL | `NOT NULL source` |
| `product_prices_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `product_prices_valid_from_not_null` | NOT NULL | `NOT NULL valid_from` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_pricing_product_prices_price_book` | btree | `(price_book_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_pricing_product_prices_price_book ON pricing.product_prices USING btree (price_book_id)` |
| `ix_pricing_product_prices_product` | btree | `(product_id, variant_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_pricing_product_prices_product ON pricing.product_prices USING btree (product_id, variant_id)` |
| `pk_pricing_product_prices` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_pricing_product_prices ON pricing.product_prices USING btree (internal_id)` |
| `price_window` | btree | `(price_book_id, product_id, variant_id, valid_from) NULLS NOT DISTINCT` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX price_window ON pricing.product_prices USING btree (price_book_id, product_id, variant_id, valid_from) NULLS NOT DISTINCT` |
| `uq_pricing_product_prices_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_pricing_product_prices_id ON pricing.product_prices USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON pricing.product_prices FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["price_book_id","price_book_id_internal_id","pricing","price_books"],["product_id","product_id_internal_id","catalog","products"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON pricing.product_prices FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON pricing.product_prices FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["price_book_id","price_book_id_internal_id","pricing","price_books"],["product_id","product_id_internal_id","catalog","products"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
