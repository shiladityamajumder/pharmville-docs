# `commerce.carts`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds carts records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | commerce.carts |
| Classification | Transactional |
| Proposed business write owner | Cart_Checkout |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 11 PK/FK/UQ/CHECK/exclusion constraints; 7 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `anonymous_token` | `character varying(128)` | Yes | — | Inferred: stores anonymous token for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_carts_created_by_users` |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | Collation: default |
| `expires_at` | `timestamp with time zone` | Yes | — | Expiration time | Determine validity windows | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `merged_into_cart_id` | `uuid` | Yes | — | Reference linking this record to carts | Ensures related business data can be joined and validated | FK → `commerce.carts` via `fk_commerce_carts_merged_into_cart_id_carts` |
| `merged_into_cart_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.carts` via `fk_commerce_carts_merged_into_cart_id_carts_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(16)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_carts_updated_by_users` |
| `user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_carts_user_id_users` |

## Record lifecycle and users

- **Created:** when the carts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.carts` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_commerce_carts_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_commerce_carts_merged_into_cart_id_carts | `merged_into_cart_id` | [`commerce.carts`](../../Tables/commerce/carts.md) | `FOREIGN KEY (merged_into_cart_id) REFERENCES commerce.carts(id) ON DELETE SET NULL` |
| fk_commerce_carts_merged_into_cart_id_carts_numeric | `merged_into_cart_id_internal_id` | [`commerce.carts`](../../Tables/commerce/carts.md) | `FOREIGN KEY (merged_into_cart_id_internal_id) REFERENCES commerce.carts(internal_id) ON DELETE SET NULL` |
| fk_commerce_carts_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_commerce_carts_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`commerce.cart_items`](../../Tables/commerce/cart_items.md) | fk_commerce_cart_items_cart_id_carts | `cart_id` | `id` |
| [`commerce.cart_items`](../../Tables/commerce/cart_items.md) | fk_commerce_cart_items_cart_id_carts_numeric | `cart_id_internal_id` | `internal_id` |
| [`commerce.carts`](../../Tables/commerce/carts.md) | fk_commerce_carts_merged_into_cart_id_carts | `merged_into_cart_id` | `id` |
| [`commerce.carts`](../../Tables/commerce/carts.md) | fk_commerce_carts_merged_into_cart_id_carts_numeric | `merged_into_cart_id_internal_id` | `internal_id` |
| [`commerce.checkouts`](../../Tables/commerce/checkouts.md) | fk_commerce_checkouts_cart_id_carts | `cart_id` | `id` |
| [`commerce.checkouts`](../../Tables/commerce/checkouts.md) | fk_commerce_checkouts_cart_id_carts_numeric | `cart_id_internal_id` | `internal_id` |

## `commerce.carts` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_commerce_carts_created_by_users` |
| `merged_into_cart_id` | `commerce.carts` | `fk_commerce_carts_merged_into_cart_id_carts` |
| `merged_into_cart_id_internal_id` | `commerce.carts` | `fk_commerce_carts_merged_into_cart_id_carts_numeric` |
| `updated_by` | `identity.users` | `fk_commerce_carts_updated_by_users` |
| `user_id` | `identity.users` | `fk_commerce_carts_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_commerce_carts_cartstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['active'::text, 'converted'::text, 'abandoned'::text, 'expired'::text]))` |
| `ck_commerce_carts_numeric_pair_merged_into_cart_id` | CHECK | `CHECK ((merged_into_cart_id IS NULL) = (merged_into_cart_id_internal_id IS NULL))` |
| `ck_commerce_carts_owner_required` | CHECK | `CHECK (num_nonnulls(user_id, anonymous_token) >= 1)` |
| `ck_commerce_carts_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_commerce_carts_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_carts_merged_into_cart_id_carts` | FOREIGN KEY | `FOREIGN KEY (merged_into_cart_id) REFERENCES commerce.carts(id) ON DELETE SET NULL` |
| `fk_commerce_carts_merged_into_cart_id_carts_numeric` | FOREIGN KEY | `FOREIGN KEY (merged_into_cart_id_internal_id) REFERENCES commerce.carts(internal_id) ON DELETE SET NULL` |
| `fk_commerce_carts_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_carts_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_commerce_carts` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_commerce_carts_id` | UNIQUE | `UNIQUE (id)` |
| `carts_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `carts_currency_not_null` | NOT NULL | `NOT NULL currency` |
| `carts_id_not_null` | NOT NULL | `NOT NULL id` |
| `carts_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `carts_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `carts_status_not_null` | NOT NULL | `NOT NULL status` |
| `carts_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_commerce_carts_expires_at` | btree | `(expires_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_carts_expires_at ON commerce.carts USING btree (expires_at)` |
| `ix_commerce_carts_user_status` | btree | `(user_id, status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_carts_user_status ON commerce.carts USING btree (user_id, status)` |
| `pk_commerce_carts` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_commerce_carts ON commerce.carts USING btree (internal_id)` |
| `uq_commerce_active_anonymous_cart` | btree | `(anonymous_token)` | anonymous_token IS NOT NULL AND status::text = 'active'::text | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_active_anonymous_cart ON commerce.carts USING btree (anonymous_token) WHERE anonymous_token IS NOT NULL AND status::text = 'active'::text` |
| `uq_commerce_active_user_cart` | btree | `(user_id)` | user_id IS NOT NULL AND status::text = 'active'::text | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_active_user_cart ON commerce.carts USING btree (user_id) WHERE user_id IS NOT NULL AND status::text = 'active'::text` |
| `uq_commerce_carts_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_carts_id ON commerce.carts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.carts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["merged_into_cart_id","merged_into_cart_id_internal_id","commerce","carts"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.carts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.carts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["merged_into_cart_id","merged_into_cart_id_internal_id","commerce","carts"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
