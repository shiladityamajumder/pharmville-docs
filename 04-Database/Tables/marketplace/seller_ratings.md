# `marketplace.seller_ratings`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds seller ratings records within the marketplace domain (sellers and commercial listings). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | marketplace.seller_ratings |
| Classification | Transactional |
| Proposed business write owner | Future marketplace owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 10 columns; 11 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` via `fk_domain_marketplace_seller_ratings_order_id` |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` via `fk_domain_marketplace_seller_ratings_order_id_numeric` |
| `rating` | `integer` | No | — | Inferred: stores rating for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `review_text` | `text` | Yes | — | Inferred: stores review text for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `seller_id` | `uuid` | No | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` via `fk_marketplace_seller_ratings_seller_id_sellers` |
| `seller_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` via `fk_marketplace_seller_ratings_seller_id_sellers_numeric` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `commerce.orders` via `fk_domain_marketplace_seller_ratings_order_id`; FK → `commerce.orders` via `fk_domain_marketplace_seller_ratings_order_id_numeric`; FK → `identity.users` via `fk_marketplace_seller_ratings_user_id_users` |

## Record lifecycle and users

- **Created:** when the seller ratings business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `marketplace.seller_ratings` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_domain_marketplace_seller_ratings_order_id | `order_id, user_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id, user_id) REFERENCES commerce.orders(id, user_id) ON DELETE RESTRICT` |
| fk_domain_marketplace_seller_ratings_order_id_numeric | `order_id_internal_id, user_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id_internal_id, user_id) REFERENCES commerce.orders(internal_id, user_id) ON DELETE RESTRICT` |
| fk_marketplace_seller_ratings_seller_id_sellers | `seller_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE CASCADE` |
| fk_marketplace_seller_ratings_seller_id_sellers_numeric | `seller_id_internal_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE CASCADE` |
| fk_marketplace_seller_ratings_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `marketplace.seller_ratings` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `order_id, user_id` | `commerce.orders` | `fk_domain_marketplace_seller_ratings_order_id` |
| `order_id_internal_id, user_id` | `commerce.orders` | `fk_domain_marketplace_seller_ratings_order_id_numeric` |
| `seller_id` | `marketplace.sellers` | `fk_marketplace_seller_ratings_seller_id_sellers` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_marketplace_seller_ratings_seller_id_sellers_numeric` |
| `user_id` | `identity.users` | `fk_marketplace_seller_ratings_user_id_users` |

### Existing constraints

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
| `seller_ratings_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `seller_ratings_id_not_null` | NOT NULL | `NOT NULL id` |
| `seller_ratings_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `seller_ratings_order_id_internal_id_not_null` | NOT NULL | `NOT NULL order_id_internal_id` |
| `seller_ratings_order_id_not_null` | NOT NULL | `NOT NULL order_id` |
| `seller_ratings_rating_not_null` | NOT NULL | `NOT NULL rating` |
| `seller_ratings_seller_id_internal_id_not_null` | NOT NULL | `NOT NULL seller_id_internal_id` |
| `seller_ratings_seller_id_not_null` | NOT NULL | `NOT NULL seller_id` |
| `seller_ratings_user_id_not_null` | NOT NULL | `NOT NULL user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_marketplace_seller_ratings_seller` | btree | `(seller_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_marketplace_seller_ratings_seller ON marketplace.seller_ratings USING btree (seller_id)` |
| `pk_marketplace_seller_ratings` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_marketplace_seller_ratings ON marketplace.seller_ratings USING btree (internal_id)` |
| `seller_order_user_rating` | btree | `(seller_id, order_id, user_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX seller_order_user_rating ON marketplace.seller_ratings USING btree (seller_id, order_id, user_id)` |
| `uq_marketplace_seller_ratings_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_marketplace_seller_ratings_id ON marketplace.seller_ratings USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_ratings FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON marketplace.seller_ratings FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_ratings FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
