# `pricing.coupon_codes`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds coupon codes records within the pricing domain (prices, taxes, promotions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | pricing.coupon_codes |
| Classification | Configuration |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 18 columns; 11 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `assigned_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_coupon_codes_assigned_user_id_users` |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_coupon_codes_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_coupon_codes_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `max_redemptions` | `integer` | Yes | — | Inferred: stores max redemptions for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `promotion_id` | `uuid` | No | — | Reference linking this record to promotions | Ensures related business data can be joined and validated | FK → `pricing.promotions` via `fk_pricing_coupon_codes_promotion_id_promotions` |
| `promotion_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `pricing.promotions` via `fk_pricing_coupon_codes_promotion_id_promotions_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_coupon_codes_updated_by_users` |
| `valid_from` | `timestamp with time zone` | Yes | — | Inferred: stores valid from for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `valid_until` | `timestamp with time zone` | Yes | — | Inferred: stores valid until for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the coupon codes business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Cart_Checkout. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `pricing.coupon_codes` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_pricing_coupon_codes_assigned_user_id_users | `assigned_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (assigned_user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| fk_pricing_coupon_codes_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_pricing_coupon_codes_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_pricing_coupon_codes_promotion_id_promotions | `promotion_id` | [`pricing.promotions`](../../Tables/pricing/promotions.md) | `FOREIGN KEY (promotion_id) REFERENCES pricing.promotions(id) ON DELETE CASCADE` |
| fk_pricing_coupon_codes_promotion_id_promotions_numeric | `promotion_id_internal_id` | [`pricing.promotions`](../../Tables/pricing/promotions.md) | `FOREIGN KEY (promotion_id_internal_id) REFERENCES pricing.promotions(internal_id) ON DELETE CASCADE` |
| fk_pricing_coupon_codes_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`pricing.promotion_redemptions`](../../Tables/pricing/promotion_redemptions.md) | fk_pricing_promotion_redemptions_coupon_code_id_coupon__6f82 | `coupon_code_id_internal_id` | `internal_id` |
| [`pricing.promotion_redemptions`](../../Tables/pricing/promotion_redemptions.md) | fk_pricing_promotion_redemptions_coupon_code_id_coupon_codes | `coupon_code_id` | `id` |

## `pricing.coupon_codes` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `assigned_user_id` | `identity.users` | `fk_pricing_coupon_codes_assigned_user_id_users` |
| `created_by` | `identity.users` | `fk_pricing_coupon_codes_created_by_users` |
| `deleted_by` | `identity.users` | `fk_pricing_coupon_codes_deleted_by_users` |
| `promotion_id` | `pricing.promotions` | `fk_pricing_coupon_codes_promotion_id_promotions` |
| `promotion_id_internal_id` | `pricing.promotions` | `fk_pricing_coupon_codes_promotion_id_promotions_numeric` |
| `updated_by` | `identity.users` | `fk_pricing_coupon_codes_updated_by_users` |

### Existing constraints

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
| `coupon_codes_code_not_null` | NOT NULL | `NOT NULL code` |
| `coupon_codes_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `coupon_codes_id_not_null` | NOT NULL | `NOT NULL id` |
| `coupon_codes_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `coupon_codes_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `coupon_codes_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `coupon_codes_promotion_id_internal_id_not_null` | NOT NULL | `NOT NULL promotion_id_internal_id` |
| `coupon_codes_promotion_id_not_null` | NOT NULL | `NOT NULL promotion_id` |
| `coupon_codes_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `coupon_codes_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_pricing_coupon_codes_promotion` | btree | `(promotion_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_pricing_coupon_codes_promotion ON pricing.coupon_codes USING btree (promotion_id)` |
| `pk_pricing_coupon_codes` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_pricing_coupon_codes ON pricing.coupon_codes USING btree (internal_id)` |
| `uq_pricing_coupon_code_active` | btree | `(code)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_pricing_coupon_code_active ON pricing.coupon_codes USING btree (code) WHERE is_deleted = false` |
| `uq_pricing_coupon_codes_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_pricing_coupon_codes_id ON pricing.coupon_codes USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON pricing.coupon_codes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["promotion_id","promotion_id_internal_id","pricing","promotions"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON pricing.coupon_codes FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON pricing.coupon_codes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["promotion_id","promotion_id_internal_id","pricing","promotions"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
