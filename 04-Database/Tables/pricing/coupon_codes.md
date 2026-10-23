# pricing.coupon_codes

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds coupon codes records within the pricing domain (prices, taxes, promotions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 18 columns, 11 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `assigned_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_pricing_coupon_codes_assigned_user_id_users) |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_pricing_coupon_codes_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_pricing_coupon_codes_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `max_redemptions` | `integer` | Yes | — | Inferred: stores max redemptions for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `promotion_id` | `uuid` | No | — | Reference linking this record to promotions | Ensures related business data can be joined and validated | FK → `pricing.promotions` (fk_pricing_coupon_codes_promotion_id_promotions) |
| `promotion_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `pricing.promotions` (fk_pricing_coupon_codes_promotion_id_promotions_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_pricing_coupon_codes_updated_by_users) |
| `valid_from` | `timestamp with time zone` | Yes | — | Inferred: stores valid from for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `valid_until` | `timestamp with time zone` | Yes | — | Inferred: stores valid until for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the coupon codes business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Cart_Checkout. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `pricing.coupon_codes` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `assigned_user_id` → `identity.users(id)` via `fk_pricing_coupon_codes_assigned_user_id_users`; FOREIGN KEY (assigned_user_id) REFERENCES identity.users(id) ON DELETE CASCADE
- `created_by` → `identity.users(id)` via `fk_pricing_coupon_codes_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_pricing_coupon_codes_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_pricing_coupon_codes_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `promotion_id` → `pricing.promotions(id)` via `fk_pricing_coupon_codes_promotion_id_promotions`; FOREIGN KEY (promotion_id) REFERENCES pricing.promotions(id) ON DELETE CASCADE
- `promotion_id_internal_id` → `pricing.promotions(internal_id)` via `fk_pricing_coupon_codes_promotion_id_promotions_numeric`; FOREIGN KEY (promotion_id_internal_id) REFERENCES pricing.promotions(internal_id) ON DELETE CASCADE

**Referenced by 2 FK constraints** (sample): `pricing.promotion_redemptions`, `pricing.promotion_redemptions`.

## pricing.coupon_codes — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 18 columns, 11 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `assigned_user_id` | `identity.users` | `fk_pricing_coupon_codes_assigned_user_id_users` |
| `created_by` | `identity.users` | `fk_pricing_coupon_codes_created_by_users` |
| `deleted_by` | `identity.users` | `fk_pricing_coupon_codes_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_pricing_coupon_codes_updated_by_users` |
| `promotion_id` | `pricing.promotions` | `fk_pricing_coupon_codes_promotion_id_promotions` |
| `promotion_id_internal_id` | `pricing.promotions` | `fk_pricing_coupon_codes_promotion_id_promotions_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_pricing_coupon_codes_max_redemptions_positive` | CHECK | `CHECK (max_redemptions IS NULL OR max_redemptions > 0)` |
| `ck_pricing_coupon_codes_numeric_pair_promotion_id` | CHECK | `CHECK ((promotion_id IS NULL) = (promotion_id_internal_id IS NULL))` |
| `ck_pricing_coupon_codes_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_pricing_coupon_codes_assigned_user_id_users` | FOREIGN KEY | `FOREIGN KEY (assigned_user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `fk_pricing_coupon_codes_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_pricing_coupon_codes_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_pricing_coupon_codes_promotion_id_promotions` | FOREIGN KEY | `FOREIGN KEY (promotion_id) REFERENCES pricing.promotions(id) ON DELETE CASCADE` |
| `fk_pricing_coupon_codes_promotion_id_promotions_numeric` | FOREIGN KEY | `FOREIGN KEY (promotion_id_internal_id) REFERENCES pricing.promotions(internal_id) ON DELETE CASCADE` |
| `fk_pricing_coupon_codes_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_pricing_coupon_codes` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_pricing_coupon_codes_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_pricing_coupon_codes_promotion` | `CREATE INDEX ix_pricing_coupon_codes_promotion ON pricing.coupon_codes USING btree (promotion_id)` |
| `pk_pricing_coupon_codes` | `CREATE UNIQUE INDEX pk_pricing_coupon_codes ON pricing.coupon_codes USING btree (internal_id)` |
| `uq_pricing_coupon_code_active` | `CREATE UNIQUE INDEX uq_pricing_coupon_code_active ON pricing.coupon_codes USING btree (code) WHERE is_deleted = false` |
| `uq_pricing_coupon_codes_id` | `CREATE UNIQUE INDEX uq_pricing_coupon_codes_id ON pricing.coupon_codes USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON pricing.coupon_codes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["promotion_id","promotion_id_internal_id","pricing","promotions"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON pricing.coupon_codes FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON pricing.coupon_codes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["promotion_id","promotion_id_internal_id","pricing","promotions"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
