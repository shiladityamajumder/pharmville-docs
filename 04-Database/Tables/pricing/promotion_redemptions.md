# `pricing.promotion_redemptions`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds promotion redemptions records within the pricing domain (prices, taxes, promotions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | pricing.promotion_redemptions |
| Classification | Transactional |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 18 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `coupon_code_id` | `uuid` | Yes | — | Reference linking this record to coupon codes | Ensures related business data can be joined and validated | FK → `pricing.coupon_codes` via `fk_pricing_promotion_redemptions_coupon_code_id_coupon_codes` |
| `coupon_code_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `pricing.coupon_codes` via `fk_pricing_promotion_redemptions_coupon_code_id_coupon__6f82` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `discount_amount` | `numeric(14,2)` | No | — | Value of discount amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `order_id` | `uuid` | Yes | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` via `fk_domain_pricing_promotion_redemptions_order_id` |
| `order_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` via `fk_domain_pricing_promotion_redemptions_order_id_numeric` |
| `promotion_id` | `uuid` | No | — | Reference linking this record to promotions | Ensures related business data can be joined and validated | FK → `pricing.promotions` via `fk_pricing_promotion_redemptions_promotion_id_promotions` |
| `promotion_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `pricing.promotions` via `fk_pricing_promotion_redemptions_promotion_id_promotion_069a` |
| `promotion_version_id` | `uuid` | Yes | — | Reference linking this record to promotion versions | Ensures related business data can be joined and validated | FK → `pricing.promotion_versions` via `fk_pricing_promotion_redemptions_promotion_version_id_p_00d1` |
| `promotion_version_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `pricing.promotion_versions` via `fk_pricing_promotion_redemptions_promotion_version_id_p_0bd8` |
| `redeemed_at` | `timestamp with time zone` | No | `now()` | Time of redeemed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `commerce.orders` via `fk_domain_pricing_promotion_redemptions_order_id`; FK → `commerce.orders` via `fk_domain_pricing_promotion_redemptions_order_id_numeric`; FK → `identity.users` via `fk_pricing_promotion_redemptions_user_id_users` |

## Record lifecycle and users

- **Created:** when the promotion redemptions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Cart_Checkout. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `pricing.promotion_redemptions` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_domain_pricing_promotion_redemptions_order_id | `order_id, user_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id, user_id) REFERENCES commerce.orders(id, user_id) ON DELETE RESTRICT` |
| fk_domain_pricing_promotion_redemptions_order_id_numeric | `order_id_internal_id, user_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id_internal_id, user_id) REFERENCES commerce.orders(internal_id, user_id) ON DELETE RESTRICT` |
| fk_pricing_promotion_redemptions_coupon_code_id_coupon__6f82 | `coupon_code_id_internal_id` | [`pricing.coupon_codes`](../../Tables/pricing/coupon_codes.md) | `FOREIGN KEY (coupon_code_id_internal_id) REFERENCES pricing.coupon_codes(internal_id) ON DELETE SET NULL` |
| fk_pricing_promotion_redemptions_coupon_code_id_coupon_codes | `coupon_code_id` | [`pricing.coupon_codes`](../../Tables/pricing/coupon_codes.md) | `FOREIGN KEY (coupon_code_id) REFERENCES pricing.coupon_codes(id) ON DELETE SET NULL` |
| fk_pricing_promotion_redemptions_promotion_id_promotion_069a | `promotion_id_internal_id` | [`pricing.promotions`](../../Tables/pricing/promotions.md) | `FOREIGN KEY (promotion_id_internal_id) REFERENCES pricing.promotions(internal_id) ON DELETE RESTRICT` |
| fk_pricing_promotion_redemptions_promotion_id_promotions | `promotion_id` | [`pricing.promotions`](../../Tables/pricing/promotions.md) | `FOREIGN KEY (promotion_id) REFERENCES pricing.promotions(id) ON DELETE RESTRICT` |
| fk_pricing_promotion_redemptions_promotion_version_id_p_00d1 | `promotion_version_id` | [`pricing.promotion_versions`](../../Tables/pricing/promotion_versions.md) | `FOREIGN KEY (promotion_version_id) REFERENCES pricing.promotion_versions(id) ON DELETE SET NULL` |
| fk_pricing_promotion_redemptions_promotion_version_id_p_0bd8 | `promotion_version_id_internal_id` | [`pricing.promotion_versions`](../../Tables/pricing/promotion_versions.md) | `FOREIGN KEY (promotion_version_id_internal_id) REFERENCES pricing.promotion_versions(internal_id) ON DELETE SET NULL` |
| fk_pricing_promotion_redemptions_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `pricing.promotion_redemptions` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `order_id, user_id` | `commerce.orders` | `fk_domain_pricing_promotion_redemptions_order_id` |
| `order_id_internal_id, user_id` | `commerce.orders` | `fk_domain_pricing_promotion_redemptions_order_id_numeric` |
| `coupon_code_id_internal_id` | `pricing.coupon_codes` | `fk_pricing_promotion_redemptions_coupon_code_id_coupon__6f82` |
| `coupon_code_id` | `pricing.coupon_codes` | `fk_pricing_promotion_redemptions_coupon_code_id_coupon_codes` |
| `promotion_id_internal_id` | `pricing.promotions` | `fk_pricing_promotion_redemptions_promotion_id_promotion_069a` |
| `promotion_id` | `pricing.promotions` | `fk_pricing_promotion_redemptions_promotion_id_promotions` |
| `promotion_version_id` | `pricing.promotion_versions` | `fk_pricing_promotion_redemptions_promotion_version_id_p_00d1` |
| `promotion_version_id_internal_id` | `pricing.promotion_versions` | `fk_pricing_promotion_redemptions_promotion_version_id_p_0bd8` |
| `user_id` | `identity.users` | `fk_pricing_promotion_redemptions_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_pricing_promotion_redemptions_discount_nonnegative` | CHECK | `CHECK (discount_amount >= 0::numeric)` |
| `ck_pricing_promotion_redemptions_finite_numeric_values` | CHECK | `CHECK (discount_amount IS NULL OR (discount_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_pricing_promotion_redemptions_numeric_pair_coupon_code_id` | CHECK | `CHECK ((coupon_code_id IS NULL) = (coupon_code_id_internal_id IS NULL))` |
| `ck_pricing_promotion_redemptions_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_pricing_promotion_redemptions_numeric_pair_promotion_8674` | CHECK | `CHECK ((promotion_version_id IS NULL) = (promotion_version_id_internal_id IS NULL))` |
| `ck_pricing_promotion_redemptions_numeric_pair_promotion_id` | CHECK | `CHECK ((promotion_id IS NULL) = (promotion_id_internal_id IS NULL))` |
| `fk_domain_pricing_promotion_redemptions_order_id` | FOREIGN KEY | `FOREIGN KEY (order_id, user_id) REFERENCES commerce.orders(id, user_id) ON DELETE RESTRICT` |
| `fk_domain_pricing_promotion_redemptions_order_id_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id, user_id) REFERENCES commerce.orders(internal_id, user_id) ON DELETE RESTRICT` |
| `fk_pricing_promotion_redemptions_coupon_code_id_coupon__6f82` | FOREIGN KEY | `FOREIGN KEY (coupon_code_id_internal_id) REFERENCES pricing.coupon_codes(internal_id) ON DELETE SET NULL` |
| `fk_pricing_promotion_redemptions_coupon_code_id_coupon_codes` | FOREIGN KEY | `FOREIGN KEY (coupon_code_id) REFERENCES pricing.coupon_codes(id) ON DELETE SET NULL` |
| `fk_pricing_promotion_redemptions_promotion_id_promotion_069a` | FOREIGN KEY | `FOREIGN KEY (promotion_id_internal_id) REFERENCES pricing.promotions(internal_id) ON DELETE RESTRICT` |
| `fk_pricing_promotion_redemptions_promotion_id_promotions` | FOREIGN KEY | `FOREIGN KEY (promotion_id) REFERENCES pricing.promotions(id) ON DELETE RESTRICT` |
| `fk_pricing_promotion_redemptions_promotion_version_id_p_00d1` | FOREIGN KEY | `FOREIGN KEY (promotion_version_id) REFERENCES pricing.promotion_versions(id) ON DELETE SET NULL` |
| `fk_pricing_promotion_redemptions_promotion_version_id_p_0bd8` | FOREIGN KEY | `FOREIGN KEY (promotion_version_id_internal_id) REFERENCES pricing.promotion_versions(internal_id) ON DELETE SET NULL` |
| `fk_pricing_promotion_redemptions_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_pricing_promotion_redemptions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_pricing_promotion_redemptions_id` | UNIQUE | `UNIQUE (id)` |
| `uq_pricing_promotion_redemptions_idempotency_key` | UNIQUE | `UNIQUE (idempotency_key)` |
| `promotion_redemptions_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `promotion_redemptions_discount_amount_not_null` | NOT NULL | `NOT NULL discount_amount` |
| `promotion_redemptions_id_not_null` | NOT NULL | `NOT NULL id` |
| `promotion_redemptions_idempotency_key_not_null` | NOT NULL | `NOT NULL idempotency_key` |
| `promotion_redemptions_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `promotion_redemptions_promotion_id_internal_id_not_null` | NOT NULL | `NOT NULL promotion_id_internal_id` |
| `promotion_redemptions_promotion_id_not_null` | NOT NULL | `NOT NULL promotion_id` |
| `promotion_redemptions_redeemed_at_not_null` | NOT NULL | `NOT NULL redeemed_at` |
| `promotion_redemptions_user_id_not_null` | NOT NULL | `NOT NULL user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_pricing_redemptions_order` | btree | `(order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_pricing_redemptions_order ON pricing.promotion_redemptions USING btree (order_id)` |
| `ix_pricing_redemptions_promotion_user` | btree | `(promotion_id, user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_pricing_redemptions_promotion_user ON pricing.promotion_redemptions USING btree (promotion_id, user_id)` |
| `pk_pricing_promotion_redemptions` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_pricing_promotion_redemptions ON pricing.promotion_redemptions USING btree (internal_id)` |
| `uq_pricing_promotion_redemptions_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_pricing_promotion_redemptions_id ON pricing.promotion_redemptions USING btree (id)` |
| `uq_pricing_promotion_redemptions_idempotency_key` | btree | `(idempotency_key)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_pricing_promotion_redemptions_idempotency_key ON pricing.promotion_redemptions USING btree (idempotency_key)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON pricing.promotion_redemptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["coupon_code_id","coupon_code_id_internal_id","pricing","coupon_codes"],["order_id","order_id_internal_id","commerce","orders"],["promotion_id","promotion_id_internal_id","pricing","promotions"],["promotion_version_id","promotion_version_id_internal_id","pricing","promotion_versions"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON pricing.promotion_redemptions FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON pricing.promotion_redemptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["coupon_code_id","coupon_code_id_internal_id","pricing","coupon_codes"],["order_id","order_id_internal_id","commerce","orders"],["promotion_id","promotion_id_internal_id","pricing","promotions"],["promotion_version_id","promotion_version_id_internal_id","pricing","promotion_versions"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
