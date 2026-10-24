# `commerce.checkouts`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds checkouts records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | commerce.checkouts |
| Classification | Transactional |
| Proposed business write owner | Cart_Checkout |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 20 columns; 16 PK/FK/UQ/CHECK/exclusion constraints; 18 named PostgreSQL 18 NOT NULL constraints; 7 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `address_id` | `uuid` | No | — | Reference linking this record to addresses | Ensures related business data can be joined and validated | FK → `customer.addresses` via `fk_commerce_checkouts_address_id_addresses` |
| `address_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `customer.addresses` via `fk_commerce_checkouts_address_id_addresses_numeric` |
| `cart_id` | `uuid` | No | — | Reference linking this record to carts | Ensures related business data can be joined and validated | FK → `commerce.carts` via `fk_commerce_checkouts_cart_id_carts` |
| `cart_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.carts` via `fk_commerce_checkouts_cart_id_carts_numeric` |
| `checkout_number` | `character varying(64)` | No | — | Inferred: stores checkout number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_checkouts_created_by_users` |
| `expires_at` | `timestamp with time zone` | No | — | Expiration time | Determine validity windows | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `inventory_snapshot` | `jsonb` | No | — | Structured inventory snapshot information | Retain a versioned payload or relevant details | Exact constraints below |
| `prescription_snapshot` | `jsonb` | No | `'{}'::jsonb` | Structured prescription snapshot information | Retain a versioned payload or relevant details | Exact constraints below |
| `pricing_snapshot` | `jsonb` | No | — | Structured pricing snapshot information | Retain a versioned payload or relevant details | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `serviceability_snapshot` | `jsonb` | No | `'{}'::jsonb` | Structured serviceability snapshot information | Retain a versioned payload or relevant details | Exact constraints below |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_checkouts_updated_by_users` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_checkouts_user_id_users` |

## Record lifecycle and users

- **Created:** when the checkouts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.checkouts` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_commerce_checkouts_address_id_addresses | `address_id` | [`customer.addresses`](../../Tables/customer/addresses.md) | `FOREIGN KEY (address_id) REFERENCES customer.addresses(id) ON DELETE RESTRICT` |
| fk_commerce_checkouts_address_id_addresses_numeric | `address_id_internal_id` | [`customer.addresses`](../../Tables/customer/addresses.md) | `FOREIGN KEY (address_id_internal_id) REFERENCES customer.addresses(internal_id) ON DELETE RESTRICT` |
| fk_commerce_checkouts_cart_id_carts | `cart_id` | [`commerce.carts`](../../Tables/commerce/carts.md) | `FOREIGN KEY (cart_id) REFERENCES commerce.carts(id) ON DELETE RESTRICT` |
| fk_commerce_checkouts_cart_id_carts_numeric | `cart_id_internal_id` | [`commerce.carts`](../../Tables/commerce/carts.md) | `FOREIGN KEY (cart_id_internal_id) REFERENCES commerce.carts(internal_id) ON DELETE RESTRICT` |
| fk_commerce_checkouts_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_commerce_checkouts_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_commerce_checkouts_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`commerce.orders`](../../Tables/commerce/orders.md) | fk_commerce_orders_checkout_id_checkouts | `checkout_id` | `id` |
| [`commerce.orders`](../../Tables/commerce/orders.md) | fk_commerce_orders_checkout_id_checkouts_numeric | `checkout_id_internal_id` | `internal_id` |

## `commerce.checkouts` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `address_id` | `customer.addresses` | `fk_commerce_checkouts_address_id_addresses` |
| `address_id_internal_id` | `customer.addresses` | `fk_commerce_checkouts_address_id_addresses_numeric` |
| `cart_id` | `commerce.carts` | `fk_commerce_checkouts_cart_id_carts` |
| `cart_id_internal_id` | `commerce.carts` | `fk_commerce_checkouts_cart_id_carts_numeric` |
| `created_by` | `identity.users` | `fk_commerce_checkouts_created_by_users` |
| `updated_by` | `identity.users` | `fk_commerce_checkouts_updated_by_users` |
| `user_id` | `identity.users` | `fk_commerce_checkouts_user_id_users` |

### Existing constraints

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
| `checkouts_address_id_internal_id_not_null` | NOT NULL | `NOT NULL address_id_internal_id` |
| `checkouts_address_id_not_null` | NOT NULL | `NOT NULL address_id` |
| `checkouts_cart_id_internal_id_not_null` | NOT NULL | `NOT NULL cart_id_internal_id` |
| `checkouts_cart_id_not_null` | NOT NULL | `NOT NULL cart_id` |
| `checkouts_checkout_number_not_null` | NOT NULL | `NOT NULL checkout_number` |
| `checkouts_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `checkouts_expires_at_not_null` | NOT NULL | `NOT NULL expires_at` |
| `checkouts_id_not_null` | NOT NULL | `NOT NULL id` |
| `checkouts_idempotency_key_not_null` | NOT NULL | `NOT NULL idempotency_key` |
| `checkouts_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `checkouts_inventory_snapshot_not_null` | NOT NULL | `NOT NULL inventory_snapshot` |
| `checkouts_prescription_snapshot_not_null` | NOT NULL | `NOT NULL prescription_snapshot` |
| `checkouts_pricing_snapshot_not_null` | NOT NULL | `NOT NULL pricing_snapshot` |
| `checkouts_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `checkouts_serviceability_snapshot_not_null` | NOT NULL | `NOT NULL serviceability_snapshot` |
| `checkouts_status_not_null` | NOT NULL | `NOT NULL status` |
| `checkouts_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `checkouts_user_id_not_null` | NOT NULL | `NOT NULL user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `checkout_idempotency_key` | btree | `(idempotency_key)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX checkout_idempotency_key ON commerce.checkouts USING btree (idempotency_key)` |
| `checkout_number` | btree | `(checkout_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX checkout_number ON commerce.checkouts USING btree (checkout_number)` |
| `ix_commerce_checkouts_cart` | btree | `(cart_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_checkouts_cart ON commerce.checkouts USING btree (cart_id)` |
| `ix_commerce_checkouts_expires_at` | btree | `(expires_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_checkouts_expires_at ON commerce.checkouts USING btree (expires_at)` |
| `ix_commerce_checkouts_user_status` | btree | `(user_id, status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_checkouts_user_status ON commerce.checkouts USING btree (user_id, status)` |
| `pk_commerce_checkouts` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_commerce_checkouts ON commerce.checkouts USING btree (internal_id)` |
| `uq_commerce_checkouts_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_checkouts_id ON commerce.checkouts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.checkouts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["address_id","address_id_internal_id","customer","addresses"],["cart_id","cart_id_internal_id","commerce","carts"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.checkouts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.checkouts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["address_id","address_id_internal_id","customer","addresses"],["cart_id","cart_id_internal_id","commerce","carts"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
