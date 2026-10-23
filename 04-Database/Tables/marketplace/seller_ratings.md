# marketplace.seller_ratings

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds seller ratings records within the marketplace domain (sellers and commercial listings). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 10 columns, 11 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` (fk_domain_marketplace_seller_ratings_order_id) |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` (fk_domain_marketplace_seller_ratings_order_id_numeric); Numeric/public-key pair verification required |
| `rating` | `integer` | No | — | Inferred: stores rating for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `review_text` | `text` | Yes | — | Inferred: stores review text for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `seller_id` | `uuid` | No | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` (fk_marketplace_seller_ratings_seller_id_sellers) |
| `seller_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` (fk_marketplace_seller_ratings_seller_id_sellers_numeric); Numeric/public-key pair verification required |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_marketplace_seller_ratings_user_id_users); FK → `commerce.orders` (fk_domain_marketplace_seller_ratings_order_id); FK → `commerce.orders` (fk_domain_marketplace_seller_ratings_order_id_numeric) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the seller ratings business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `marketplace.seller_ratings` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_marketplace_seller_ratings_user_id_users`; FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `seller_id` → `marketplace.sellers(id)` via `fk_marketplace_seller_ratings_seller_id_sellers`; FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE CASCADE
- `order_id, user_id` → `commerce.orders(id, user_id)` via `fk_domain_marketplace_seller_ratings_order_id`; FOREIGN KEY (order_id, user_id) REFERENCES commerce.orders(id, user_id) ON DELETE RESTRICT
- `order_id_internal_id, user_id` → `commerce.orders(internal_id, user_id)` via `fk_domain_marketplace_seller_ratings_order_id_numeric`; FOREIGN KEY (order_id_internal_id, user_id) REFERENCES commerce.orders(internal_id, user_id) ON DELETE RESTRICT
- `seller_id_internal_id` → `marketplace.sellers(internal_id)` via `fk_marketplace_seller_ratings_seller_id_sellers_numeric`; FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE CASCADE

## marketplace.seller_ratings — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 10 columns, 11 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_marketplace_seller_ratings_user_id_users` |
| `seller_id` | `marketplace.sellers` | `fk_marketplace_seller_ratings_seller_id_sellers` |
| `order_id`, `user_id` | `commerce.orders` | `fk_domain_marketplace_seller_ratings_order_id` |
| `order_id_internal_id`, `user_id` | `commerce.orders` | `fk_domain_marketplace_seller_ratings_order_id_numeric` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_marketplace_seller_ratings_seller_id_sellers_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_marketplace_seller_ratings_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_marketplace_seller_ratings_numeric_pair_seller_id` | CHECK | `CHECK ((seller_id IS NULL) = (seller_id_internal_id IS NULL))` |
| `ck_marketplace_seller_ratings_rating_range` | CHECK | `CHECK (rating >= 1 AND rating <= 5)` |
| `fk_domain_marketplace_seller_ratings_order_id` | FOREIGN KEY | `FOREIGN KEY (order_id, user_id) REFERENCES commerce.orders(id, user_id) ON DELETE RESTRICT` |
| `fk_domain_marketplace_seller_ratings_order_id_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id, user_id) REFERENCES commerce.orders(internal_id, user_id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_ratings_seller_id_sellers` | FOREIGN KEY | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE CASCADE` |
| `fk_marketplace_seller_ratings_seller_id_sellers_numeric` | FOREIGN KEY | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE CASCADE` |
| `fk_marketplace_seller_ratings_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_marketplace_seller_ratings` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `seller_order_user_rating` | UNIQUE | `UNIQUE (seller_id, order_id, user_id)` |
| `uq_marketplace_seller_ratings_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_marketplace_seller_ratings_seller` | `CREATE INDEX ix_marketplace_seller_ratings_seller ON marketplace.seller_ratings USING btree (seller_id)` |
| `pk_marketplace_seller_ratings` | `CREATE UNIQUE INDEX pk_marketplace_seller_ratings ON marketplace.seller_ratings USING btree (internal_id)` |
| `seller_order_user_rating` | `CREATE UNIQUE INDEX seller_order_user_rating ON marketplace.seller_ratings USING btree (seller_id, order_id, user_id)` |
| `uq_marketplace_seller_ratings_id` | `CREATE UNIQUE INDEX uq_marketplace_seller_ratings_id ON marketplace.seller_ratings USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_ratings FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON marketplace.seller_ratings FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_ratings FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
