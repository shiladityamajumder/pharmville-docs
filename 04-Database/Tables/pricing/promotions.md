# pricing.promotions

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds promotions records within the pricing domain (prices, taxes, promotions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 22 columns, 11 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `budget_amount` | `numeric(16,2)` | Yes | — | Value of budget amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_pricing_promotions_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_pricing_promotions_deleted_by_users) |
| `ends_at` | `timestamp with time zone` | Yes | — | Time of ends | Support chronology, deadlines or audit evidence | See exact constraints |
| `exclusive` | `boolean` | No | `false` | Inferred: stores exclusive for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `per_user_limit` | `integer` | Yes | — | Inferred: stores per user limit for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `priority` | `integer` | No | `0` | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `promotion_type` | `character varying(32)` | No | — | Inferred: stores promotion type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `stackability_group` | `character varying(64)` | Yes | — | Inferred: stores stackability group for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `starts_at` | `timestamp with time zone` | No | — | Time of starts | Support chronology, deadlines or audit evidence | See exact constraints |
| `status` | `character varying(32)` | No | `'draft'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_pricing_promotions_updated_by_users) |
| `usage_limit` | `integer` | Yes | — | Inferred: stores usage limit for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the promotions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Cart_Checkout. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `pricing.promotions` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_pricing_promotions_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_pricing_promotions_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_pricing_promotions_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT

**Referenced by 8 FK constraints** (sample): `commerce.order_discounts`, `pricing.promotion_versions`, `pricing.coupon_codes`, `pricing.promotion_redemptions`, `commerce.order_discounts`, `pricing.coupon_codes`, `pricing.promotion_redemptions`, `pricing.promotion_versions`.

## pricing.promotions — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 22 columns, 11 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_pricing_promotions_created_by_users` |
| `deleted_by` | `identity.users` | `fk_pricing_promotions_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_pricing_promotions_updated_by_users` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_pricing_promotions_status_window` | `CREATE INDEX ix_pricing_promotions_status_window ON pricing.promotions USING btree (status, starts_at, ends_at)` |
| `pk_pricing_promotions` | `CREATE UNIQUE INDEX pk_pricing_promotions ON pricing.promotions USING btree (internal_id)` |
| `uq_pricing_promotions_code_active` | `CREATE UNIQUE INDEX uq_pricing_promotions_code_active ON pricing.promotions USING btree (code) WHERE is_deleted = false` |
| `uq_pricing_promotions_id` | `CREATE UNIQUE INDEX uq_pricing_promotions_id ON pricing.promotions USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON pricing.promotions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON pricing.promotions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON pricing.promotions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
