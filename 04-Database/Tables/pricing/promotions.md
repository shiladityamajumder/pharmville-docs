# `pricing.promotions`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds promotions records within the pricing domain (prices, taxes, promotions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | pricing.promotions |
| Classification | Configuration |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 22 columns; 11 PK/FK/UQ/CHECK/exclusion constraints; 13 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `budget_amount` | `numeric(16,2)` | Yes | — | Value of budget amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_promotions_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_promotions_deleted_by_users` |
| `ends_at` | `timestamp with time zone` | Yes | — | Time of ends | Support chronology, deadlines or audit evidence | Exact constraints below |
| `exclusive` | `boolean` | No | `false` | Inferred: stores exclusive for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `per_user_limit` | `integer` | Yes | — | Inferred: stores per user limit for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `priority` | `integer` | No | `0` | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `promotion_type` | `character varying(32)` | No | — | Inferred: stores promotion type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `stackability_group` | `character varying(64)` | Yes | — | Inferred: stores stackability group for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `starts_at` | `timestamp with time zone` | No | — | Time of starts | Support chronology, deadlines or audit evidence | Exact constraints below |
| `status` | `character varying(32)` | No | `'draft'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_promotions_updated_by_users` |
| `usage_limit` | `integer` | Yes | — | Inferred: stores usage limit for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the promotions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Cart_Checkout. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `pricing.promotions` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_pricing_promotions_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_pricing_promotions_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_pricing_promotions_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`commerce.order_discounts`](../../Tables/commerce/order_discounts.md) | fk_commerce_order_discounts_promotion_id_promotions | `promotion_id` | `id` |
| [`commerce.order_discounts`](../../Tables/commerce/order_discounts.md) | fk_commerce_order_discounts_promotion_id_promotions_numeric | `promotion_id_internal_id` | `internal_id` |
| [`pricing.coupon_codes`](../../Tables/pricing/coupon_codes.md) | fk_pricing_coupon_codes_promotion_id_promotions | `promotion_id` | `id` |
| [`pricing.coupon_codes`](../../Tables/pricing/coupon_codes.md) | fk_pricing_coupon_codes_promotion_id_promotions_numeric | `promotion_id_internal_id` | `internal_id` |
| [`pricing.promotion_redemptions`](../../Tables/pricing/promotion_redemptions.md) | fk_pricing_promotion_redemptions_promotion_id_promotion_069a | `promotion_id_internal_id` | `internal_id` |
| [`pricing.promotion_redemptions`](../../Tables/pricing/promotion_redemptions.md) | fk_pricing_promotion_redemptions_promotion_id_promotions | `promotion_id` | `id` |
| [`pricing.promotion_versions`](../../Tables/pricing/promotion_versions.md) | fk_pricing_promotion_versions_promotion_id_promotions | `promotion_id` | `id` |
| [`pricing.promotion_versions`](../../Tables/pricing/promotion_versions.md) | fk_pricing_promotion_versions_promotion_id_promotions_numeric | `promotion_id_internal_id` | `internal_id` |

## `pricing.promotions` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_pricing_promotions_created_by_users` |
| `deleted_by` | `identity.users` | `fk_pricing_promotions_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_pricing_promotions_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_pricing_promotions_budget_nonnegative` | CHECK | `CHECK (budget_amount IS NULL OR budget_amount >= 0::numeric)` |
| `ck_pricing_promotions_finite_numeric_values` | CHECK | `CHECK (budget_amount IS NULL OR (budget_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_pricing_promotions_per_user_limit_positive` | CHECK | `CHECK (per_user_limit IS NULL OR per_user_limit > 0)` |
| `ck_pricing_promotions_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_pricing_promotions_usage_limit_positive` | CHECK | `CHECK (usage_limit IS NULL OR usage_limit > 0)` |
| `ck_pricing_promotions_valid_window` | CHECK | `CHECK (ends_at IS NULL OR ends_at > starts_at)` |
| `fk_pricing_promotions_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_pricing_promotions_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_pricing_promotions_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_pricing_promotions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_pricing_promotions_id` | UNIQUE | `UNIQUE (id)` |
| `promotions_code_not_null` | NOT NULL | `NOT NULL code` |
| `promotions_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `promotions_exclusive_not_null` | NOT NULL | `NOT NULL exclusive` |
| `promotions_id_not_null` | NOT NULL | `NOT NULL id` |
| `promotions_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `promotions_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `promotions_name_not_null` | NOT NULL | `NOT NULL name` |
| `promotions_priority_not_null` | NOT NULL | `NOT NULL priority` |
| `promotions_promotion_type_not_null` | NOT NULL | `NOT NULL promotion_type` |
| `promotions_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `promotions_starts_at_not_null` | NOT NULL | `NOT NULL starts_at` |
| `promotions_status_not_null` | NOT NULL | `NOT NULL status` |
| `promotions_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_pricing_promotions_status_window` | btree | `(status, starts_at, ends_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_pricing_promotions_status_window ON pricing.promotions USING btree (status, starts_at, ends_at)` |
| `pk_pricing_promotions` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_pricing_promotions ON pricing.promotions USING btree (internal_id)` |
| `uq_pricing_promotions_code_active` | btree | `(code)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_pricing_promotions_code_active ON pricing.promotions USING btree (code) WHERE is_deleted = false` |
| `uq_pricing_promotions_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_pricing_promotions_id ON pricing.promotions USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON pricing.promotions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON pricing.promotions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON pricing.promotions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
