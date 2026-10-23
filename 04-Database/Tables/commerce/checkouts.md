# commerce.checkouts

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds checkouts records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 20 columns, 16 constraints, 7 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `address_id` | `uuid` | No | — | Reference linking this record to addresses | Ensures related business data can be joined and validated | FK → `customer.addresses` (fk_commerce_checkouts_address_id_addresses) |
| `address_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `customer.addresses` (fk_commerce_checkouts_address_id_addresses_numeric); Numeric/public-key pair verification required |
| `cart_id` | `uuid` | No | — | Reference linking this record to carts | Ensures related business data can be joined and validated | FK → `commerce.carts` (fk_commerce_checkouts_cart_id_carts) |
| `cart_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.carts` (fk_commerce_checkouts_cart_id_carts_numeric); Numeric/public-key pair verification required |
| `checkout_number` | `character varying(64)` | No | — | Inferred: stores checkout number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_checkouts_created_by_users) |
| `expires_at` | `timestamp with time zone` | No | — | Expiration time | Determine validity windows | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `inventory_snapshot` | `jsonb` | No | — | Structured inventory snapshot information | Retain a versioned payload or relevant details | See exact constraints |
| `prescription_snapshot` | `jsonb` | No | `'{}'::jsonb` | Structured prescription snapshot information | Retain a versioned payload or relevant details | See exact constraints |
| `pricing_snapshot` | `jsonb` | No | — | Structured pricing snapshot information | Retain a versioned payload or relevant details | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `serviceability_snapshot` | `jsonb` | No | `'{}'::jsonb` | Structured serviceability snapshot information | Retain a versioned payload or relevant details | See exact constraints |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_checkouts_updated_by_users) |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_checkouts_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the checkouts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.checkouts` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_commerce_checkouts_user_id_users`; FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `created_by` → `identity.users(id)` via `fk_commerce_checkouts_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_commerce_checkouts_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `cart_id` → `commerce.carts(id)` via `fk_commerce_checkouts_cart_id_carts`; FOREIGN KEY (cart_id) REFERENCES commerce.carts(id) ON DELETE RESTRICT
- `address_id` → `customer.addresses(id)` via `fk_commerce_checkouts_address_id_addresses`; FOREIGN KEY (address_id) REFERENCES customer.addresses(id) ON DELETE RESTRICT
- `address_id_internal_id` → `customer.addresses(internal_id)` via `fk_commerce_checkouts_address_id_addresses_numeric`; FOREIGN KEY (address_id_internal_id) REFERENCES customer.addresses(internal_id) ON DELETE RESTRICT
- `cart_id_internal_id` → `commerce.carts(internal_id)` via `fk_commerce_checkouts_cart_id_carts_numeric`; FOREIGN KEY (cart_id_internal_id) REFERENCES commerce.carts(internal_id) ON DELETE RESTRICT

**Referenced by 2 FK constraints** (sample): `commerce.orders`, `commerce.orders`.

## commerce.checkouts — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 20 columns, 16 constraints, 7 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_commerce_checkouts_user_id_users` |
| `created_by` | `identity.users` | `fk_commerce_checkouts_created_by_users` |
| `updated_by` | `identity.users` | `fk_commerce_checkouts_updated_by_users` |
| `cart_id` | `commerce.carts` | `fk_commerce_checkouts_cart_id_carts` |
| `address_id` | `customer.addresses` | `fk_commerce_checkouts_address_id_addresses` |
| `address_id_internal_id` | `customer.addresses` | `fk_commerce_checkouts_address_id_addresses_numeric` |
| `cart_id_internal_id` | `commerce.carts` | `fk_commerce_checkouts_cart_id_carts_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `checkout_idempotency_key` | UNIQUE | `UNIQUE (idempotency_key)` |
| `checkout_number` | UNIQUE | `UNIQUE (checkout_number)` |
| `ck_commerce_checkouts_checkoutstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['open'::text, 'validating'::text, 'ready'::text, 'completed'::text, 'failed'::text, 'expired'::text]))` |
| `ck_commerce_checkouts_expires_after_created` | CHECK | `CHECK (expires_at > created_at)` |
| `ck_commerce_checkouts_numeric_pair_address_id` | CHECK | `CHECK ((address_id IS NULL) = (address_id_internal_id IS NULL))` |
| `ck_commerce_checkouts_numeric_pair_cart_id` | CHECK | `CHECK ((cart_id IS NULL) = (cart_id_internal_id IS NULL))` |
| `ck_commerce_checkouts_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_commerce_checkouts_address_id_addresses` | FOREIGN KEY | `FOREIGN KEY (address_id) REFERENCES customer.addresses(id) ON DELETE RESTRICT` |
| `fk_commerce_checkouts_address_id_addresses_numeric` | FOREIGN KEY | `FOREIGN KEY (address_id_internal_id) REFERENCES customer.addresses(internal_id) ON DELETE RESTRICT` |
| `fk_commerce_checkouts_cart_id_carts` | FOREIGN KEY | `FOREIGN KEY (cart_id) REFERENCES commerce.carts(id) ON DELETE RESTRICT` |
| `fk_commerce_checkouts_cart_id_carts_numeric` | FOREIGN KEY | `FOREIGN KEY (cart_id_internal_id) REFERENCES commerce.carts(internal_id) ON DELETE RESTRICT` |
| `fk_commerce_checkouts_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_checkouts_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_checkouts_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_commerce_checkouts` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_commerce_checkouts_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `checkout_idempotency_key` | `CREATE UNIQUE INDEX checkout_idempotency_key ON commerce.checkouts USING btree (idempotency_key)` |
| `checkout_number` | `CREATE UNIQUE INDEX checkout_number ON commerce.checkouts USING btree (checkout_number)` |
| `ix_commerce_checkouts_cart` | `CREATE INDEX ix_commerce_checkouts_cart ON commerce.checkouts USING btree (cart_id)` |
| `ix_commerce_checkouts_expires_at` | `CREATE INDEX ix_commerce_checkouts_expires_at ON commerce.checkouts USING btree (expires_at)` |
| `ix_commerce_checkouts_user_status` | `CREATE INDEX ix_commerce_checkouts_user_status ON commerce.checkouts USING btree (user_id, status)` |
| `pk_commerce_checkouts` | `CREATE UNIQUE INDEX pk_commerce_checkouts ON commerce.checkouts USING btree (internal_id)` |
| `uq_commerce_checkouts_id` | `CREATE UNIQUE INDEX uq_commerce_checkouts_id ON commerce.checkouts USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.checkouts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["address_id","address_id_internal_id","customer","addresses"],["cart_id","cart_id_internal_id","commerce","carts"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.checkouts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.checkouts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["address_id","address_id_internal_id","customer","addresses"],["cart_id","cart_id_internal_id","commerce","carts"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
