# `pricing.promotion_redemptions`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds promotion redemptions records within the pricing domain (prices, taxes, promotions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 18 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `coupon_code_id` | `uuid` | Yes | — | Reference linking this record to coupon codes | Ensures related business data can be joined and validated | FK → `pricing.coupon_codes` (fk_pricing_promotion_redemptions_coupon_code_id_coupon_codes) |
| `coupon_code_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `pricing.coupon_codes` (fk_pricing_promotion_redemptions_coupon_code_id_coupon__6f82); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `discount_amount` | `numeric(14,2)` | No | — | Value of discount amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `order_id` | `uuid` | Yes | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` (fk_domain_pricing_promotion_redemptions_order_id) |
| `order_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` (fk_domain_pricing_promotion_redemptions_order_id_numeric); Numeric/public-key pair verification required |
| `promotion_id` | `uuid` | No | — | Reference linking this record to promotions | Ensures related business data can be joined and validated | FK → `pricing.promotions` (fk_pricing_promotion_redemptions_promotion_id_promotions) |
| `promotion_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `pricing.promotions` (fk_pricing_promotion_redemptions_promotion_id_promotion_069a); Numeric/public-key pair verification required |
| `promotion_version_id` | `uuid` | Yes | — | Reference linking this record to promotion versions | Ensures related business data can be joined and validated | FK → `pricing.promotion_versions` (fk_pricing_promotion_redemptions_promotion_version_id_p_00d1) |
| `promotion_version_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `pricing.promotion_versions` (fk_pricing_promotion_redemptions_promotion_version_id_p_0bd8); Numeric/public-key pair verification required |
| `redeemed_at` | `timestamp with time zone` | No | `now()` | Time of redeemed | Support chronology, deadlines or audit evidence | See exact constraints |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_pricing_promotion_redemptions_user_id_users); FK → `commerce.orders` (fk_domain_pricing_promotion_redemptions_order_id); FK → `commerce.orders` (fk_domain_pricing_promotion_redemptions_order_id_numeric) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the promotion redemptions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Cart_Checkout. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `pricing.promotion_redemptions` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_pricing_promotion_redemptions_user_id_users`; `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `coupon_code_id` → `pricing.coupon_codes(id)` via `fk_pricing_promotion_redemptions_coupon_code_id_coupon_codes`; `FOREIGN KEY (coupon_code_id) REFERENCES pricing.coupon_codes(id) ON DELETE SET NULL`
- `promotion_version_id` → `pricing.promotion_versions(id)` via `fk_pricing_promotion_redemptions_promotion_version_id_p_00d1`; `FOREIGN KEY (promotion_version_id) REFERENCES pricing.promotion_versions(id) ON DELETE SET NULL`
- `promotion_id` → `pricing.promotions(id)` via `fk_pricing_promotion_redemptions_promotion_id_promotions`; `FOREIGN KEY (promotion_id) REFERENCES pricing.promotions(id) ON DELETE RESTRICT`
- `order_id, user_id` → `commerce.orders(id, user_id)` via `fk_domain_pricing_promotion_redemptions_order_id`; `FOREIGN KEY (order_id, user_id) REFERENCES commerce.orders(id, user_id) ON DELETE RESTRICT`
- `order_id_internal_id, user_id` → `commerce.orders(internal_id, user_id)` via `fk_domain_pricing_promotion_redemptions_order_id_numeric`; `FOREIGN KEY (order_id_internal_id, user_id) REFERENCES commerce.orders(internal_id, user_id) ON DELETE RESTRICT`
- `coupon_code_id_internal_id` → `pricing.coupon_codes(internal_id)` via `fk_pricing_promotion_redemptions_coupon_code_id_coupon__6f82`; `FOREIGN KEY (coupon_code_id_internal_id) REFERENCES pricing.coupon_codes(internal_id) ON DELETE SET NULL`
- `promotion_id_internal_id` → `pricing.promotions(internal_id)` via `fk_pricing_promotion_redemptions_promotion_id_promotion_069a`; `FOREIGN KEY (promotion_id_internal_id) REFERENCES pricing.promotions(internal_id) ON DELETE RESTRICT`
- `promotion_version_id_internal_id` → `pricing.promotion_versions(internal_id)` via `fk_pricing_promotion_redemptions_promotion_version_id_p_0bd8`; `FOREIGN KEY (promotion_version_id_internal_id) REFERENCES pricing.promotion_versions(internal_id) ON DELETE SET NULL`

## `pricing.promotion_redemptions` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 15 columns, 18 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_pricing_promotion_redemptions_user_id_users` |
| `coupon_code_id` | `pricing.coupon_codes` | `fk_pricing_promotion_redemptions_coupon_code_id_coupon_codes` |
| `promotion_version_id` | `pricing.promotion_versions` | `fk_pricing_promotion_redemptions_promotion_version_id_p_00d1` |
| `promotion_id` | `pricing.promotions` | `fk_pricing_promotion_redemptions_promotion_id_promotions` |
| `order_id`, `user_id` | `commerce.orders` | `fk_domain_pricing_promotion_redemptions_order_id` |
| `order_id_internal_id`, `user_id` | `commerce.orders` | `fk_domain_pricing_promotion_redemptions_order_id_numeric` |
| `coupon_code_id_internal_id` | `pricing.coupon_codes` | `fk_pricing_promotion_redemptions_coupon_code_id_coupon__6f82` |
| `promotion_id_internal_id` | `pricing.promotions` | `fk_pricing_promotion_redemptions_promotion_id_promotion_069a` |
| `promotion_version_id_internal_id` | `pricing.promotion_versions` | `fk_pricing_promotion_redemptions_promotion_version_id_p_0bd8` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_pricing_redemptions_order` | `CREATE INDEX ix_pricing_redemptions_order ON pricing.promotion_redemptions USING btree (order_id)` |
| `ix_pricing_redemptions_promotion_user` | `CREATE INDEX ix_pricing_redemptions_promotion_user ON pricing.promotion_redemptions USING btree (promotion_id, user_id)` |
| `pk_pricing_promotion_redemptions` | `CREATE UNIQUE INDEX pk_pricing_promotion_redemptions ON pricing.promotion_redemptions USING btree (internal_id)` |
| `uq_pricing_promotion_redemptions_id` | `CREATE UNIQUE INDEX uq_pricing_promotion_redemptions_id ON pricing.promotion_redemptions USING btree (id)` |
| `uq_pricing_promotion_redemptions_idempotency_key` | `CREATE UNIQUE INDEX uq_pricing_promotion_redemptions_idempotency_key ON pricing.promotion_redemptions USING btree (idempotency_key)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON pricing.promotion_redemptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["coupon_code_id","coupon_code_id_internal_id","pricing","coupon_codes"],["order_id","order_id_internal_id","commerce","orders"],["promotion_id","promotion_id_internal_id","pricing","promotions"],["promotion_version_id","promotion_version_id_internal_id","pricing","promotion_versions"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON pricing.promotion_redemptions FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON pricing.promotion_redemptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["coupon_code_id","coupon_code_id_internal_id","pricing","coupon_codes"],["order_id","order_id_internal_id","commerce","orders"],["promotion_id","promotion_id_internal_id","pricing","promotions"],["promotion_version_id","promotion_version_id_internal_id","pricing","promotion_versions"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
