# `customer.wishlist_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds wishlist items records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | customer.wishlist_items |
| Classification | Mapping / Junction |
| Proposed business write owner | Customer_Accounts |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 12 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_wishlist_items_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `notes` | `character varying(255)` | Yes | — | Inferred: stores notes for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_customer_wishlist_items_product_id_products` |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_customer_wishlist_items_product_id_products_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_wishlist_items_updated_by_users` |
| `wishlist_id` | `uuid` | No | — | Reference linking this record to wishlists | Ensures related business data can be joined and validated | FK → `customer.wishlists` via `fk_customer_wishlist_items_wishlist_id_wishlists` |
| `wishlist_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `customer.wishlists` via `fk_customer_wishlist_items_wishlist_id_wishlists_numeric` |

## Record lifecycle and users

- **Created:** when the wishlist items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Cart_Checkout, Prescription_Upload. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `customer.wishlist_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_customer_wishlist_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_customer_wishlist_items_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| fk_customer_wishlist_items_product_id_products_numeric | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| fk_customer_wishlist_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_customer_wishlist_items_wishlist_id_wishlists | `wishlist_id` | [`customer.wishlists`](../../Tables/customer/wishlists.md) | `FOREIGN KEY (wishlist_id) REFERENCES customer.wishlists(id) ON DELETE CASCADE` |
| fk_customer_wishlist_items_wishlist_id_wishlists_numeric | `wishlist_id_internal_id` | [`customer.wishlists`](../../Tables/customer/wishlists.md) | `FOREIGN KEY (wishlist_id_internal_id) REFERENCES customer.wishlists(internal_id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `customer.wishlist_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_customer_wishlist_items_created_by_users` |
| `product_id` | `catalog.products` | `fk_customer_wishlist_items_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_customer_wishlist_items_product_id_products_numeric` |
| `updated_by` | `identity.users` | `fk_customer_wishlist_items_updated_by_users` |
| `wishlist_id` | `customer.wishlists` | `fk_customer_wishlist_items_wishlist_id_wishlists` |
| `wishlist_id_internal_id` | `customer.wishlists` | `fk_customer_wishlist_items_wishlist_id_wishlists_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_customer_wishlist_items_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_customer_wishlist_items_numeric_pair_wishlist_id` | CHECK | `CHECK ((wishlist_id IS NULL) = (wishlist_id_internal_id IS NULL))` |
| `ck_customer_wishlist_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_customer_wishlist_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_wishlist_items_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| `fk_customer_wishlist_items_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| `fk_customer_wishlist_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_wishlist_items_wishlist_id_wishlists` | FOREIGN KEY | `FOREIGN KEY (wishlist_id) REFERENCES customer.wishlists(id) ON DELETE CASCADE` |
| `fk_customer_wishlist_items_wishlist_id_wishlists_numeric` | FOREIGN KEY | `FOREIGN KEY (wishlist_id_internal_id) REFERENCES customer.wishlists(internal_id) ON DELETE CASCADE` |
| `pk_customer_wishlist_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_customer_wishlist_items_id` | UNIQUE | `UNIQUE (id)` |
| `wishlist_product` | UNIQUE | `UNIQUE (wishlist_id, product_id)` |
| `wishlist_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `wishlist_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `wishlist_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `wishlist_items_product_id_internal_id_not_null` | NOT NULL | `NOT NULL product_id_internal_id` |
| `wishlist_items_product_id_not_null` | NOT NULL | `NOT NULL product_id` |
| `wishlist_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `wishlist_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `wishlist_items_wishlist_id_internal_id_not_null` | NOT NULL | `NOT NULL wishlist_id_internal_id` |
| `wishlist_items_wishlist_id_not_null` | NOT NULL | `NOT NULL wishlist_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_customer_wishlist_items_product_id` | btree | `(product_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_customer_wishlist_items_product_id ON customer.wishlist_items USING btree (product_id)` |
| `ix_customer_wishlist_items_wishlist_id` | btree | `(wishlist_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_customer_wishlist_items_wishlist_id ON customer.wishlist_items USING btree (wishlist_id)` |
| `pk_customer_wishlist_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_customer_wishlist_items ON customer.wishlist_items USING btree (internal_id)` |
| `uq_customer_wishlist_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_customer_wishlist_items_id ON customer.wishlist_items USING btree (id)` |
| `wishlist_product` | btree | `(wishlist_id, product_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX wishlist_product ON customer.wishlist_items USING btree (wishlist_id, product_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON customer.wishlist_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["wishlist_id","wishlist_id_internal_id","customer","wishlists"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON customer.wishlist_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON customer.wishlist_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["wishlist_id","wishlist_id_internal_id","customer","wishlists"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
