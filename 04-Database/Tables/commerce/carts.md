# `commerce.carts`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds carts records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 11 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `anonymous_token` | `character varying(128)` | Yes | — | Inferred: stores anonymous token for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_carts_created_by_users) |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | See exact constraints |
| `expires_at` | `timestamp with time zone` | Yes | — | Expiration time | Determine validity windows | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `merged_into_cart_id` | `uuid` | Yes | — | Reference linking this record to carts | Ensures related business data can be joined and validated | FK → `commerce.carts` (fk_commerce_carts_merged_into_cart_id_carts) |
| `merged_into_cart_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.carts` (fk_commerce_carts_merged_into_cart_id_carts_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(16)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_carts_updated_by_users) |
| `user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_carts_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the carts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.carts` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_commerce_carts_user_id_users`; `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE`
- `created_by` → `identity.users(id)` via `fk_commerce_carts_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_commerce_carts_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `merged_into_cart_id` → `commerce.carts(id)` via `fk_commerce_carts_merged_into_cart_id_carts`; `FOREIGN KEY (merged_into_cart_id) REFERENCES commerce.carts(id) ON DELETE SET NULL`
- `merged_into_cart_id_internal_id` → `commerce.carts(internal_id)` via `fk_commerce_carts_merged_into_cart_id_carts_numeric`; `FOREIGN KEY (merged_into_cart_id_internal_id) REFERENCES commerce.carts(internal_id) ON DELETE SET NULL`

**Referenced by 6 FK constraints** (sample): `commerce.carts`, `commerce.cart_items`, `commerce.checkouts`, `commerce.cart_items`, `commerce.carts`, `commerce.checkouts`.

## `commerce.carts` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 14 columns, 11 constraints, 6 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_commerce_carts_user_id_users` |
| `created_by` | `identity.users` | `fk_commerce_carts_created_by_users` |
| `updated_by` | `identity.users` | `fk_commerce_carts_updated_by_users` |
| `merged_into_cart_id` | `commerce.carts` | `fk_commerce_carts_merged_into_cart_id_carts` |
| `merged_into_cart_id_internal_id` | `commerce.carts` | `fk_commerce_carts_merged_into_cart_id_carts_numeric` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_commerce_carts_expires_at` | `CREATE INDEX ix_commerce_carts_expires_at ON commerce.carts USING btree (expires_at)` |
| `ix_commerce_carts_user_status` | `CREATE INDEX ix_commerce_carts_user_status ON commerce.carts USING btree (user_id, status)` |
| `pk_commerce_carts` | `CREATE UNIQUE INDEX pk_commerce_carts ON commerce.carts USING btree (internal_id)` |
| `uq_commerce_active_anonymous_cart` | `CREATE UNIQUE INDEX uq_commerce_active_anonymous_cart ON commerce.carts USING btree (anonymous_token) WHERE anonymous_token IS NOT NULL AND status::text = 'active'::text` |
| `uq_commerce_active_user_cart` | `CREATE UNIQUE INDEX uq_commerce_active_user_cart ON commerce.carts USING btree (user_id) WHERE user_id IS NOT NULL AND status::text = 'active'::text` |
| `uq_commerce_carts_id` | `CREATE UNIQUE INDEX uq_commerce_carts_id ON commerce.carts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.carts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["merged_into_cart_id","merged_into_cart_id_internal_id","commerce","carts"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.carts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.carts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["merged_into_cart_id","merged_into_cart_id_internal_id","commerce","carts"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
