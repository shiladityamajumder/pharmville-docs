# customer.wishlist_items

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds wishlist items records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 12 columns, 12 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_customer_wishlist_items_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `notes` | `character varying(255)` | Yes | — | Inferred: stores notes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_customer_wishlist_items_product_id_products) |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_customer_wishlist_items_product_id_products_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_customer_wishlist_items_updated_by_users) |
| `wishlist_id` | `uuid` | No | — | Reference linking this record to wishlists | Ensures related business data can be joined and validated | FK → `customer.wishlists` (fk_customer_wishlist_items_wishlist_id_wishlists) |
| `wishlist_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `customer.wishlists` (fk_customer_wishlist_items_wishlist_id_wishlists_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the wishlist items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Cart_Checkout, Prescription_Upload. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `customer.wishlist_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_customer_wishlist_items_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_customer_wishlist_items_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `wishlist_id` → `customer.wishlists(id)` via `fk_customer_wishlist_items_wishlist_id_wishlists`; FOREIGN KEY (wishlist_id) REFERENCES customer.wishlists(id) ON DELETE CASCADE
- `product_id` → `catalog.products(id)` via `fk_customer_wishlist_items_product_id_products`; FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_customer_wishlist_items_product_id_products_numeric`; FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE
- `wishlist_id_internal_id` → `customer.wishlists(internal_id)` via `fk_customer_wishlist_items_wishlist_id_wishlists_numeric`; FOREIGN KEY (wishlist_id_internal_id) REFERENCES customer.wishlists(internal_id) ON DELETE CASCADE

## customer.wishlist_items — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 12 columns, 12 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_customer_wishlist_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_customer_wishlist_items_updated_by_users` |
| `wishlist_id` | `customer.wishlists` | `fk_customer_wishlist_items_wishlist_id_wishlists` |
| `product_id` | `catalog.products` | `fk_customer_wishlist_items_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_customer_wishlist_items_product_id_products_numeric` |
| `wishlist_id_internal_id` | `customer.wishlists` | `fk_customer_wishlist_items_wishlist_id_wishlists_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_customer_wishlist_items_product_id` | `CREATE INDEX ix_customer_wishlist_items_product_id ON customer.wishlist_items USING btree (product_id)` |
| `ix_customer_wishlist_items_wishlist_id` | `CREATE INDEX ix_customer_wishlist_items_wishlist_id ON customer.wishlist_items USING btree (wishlist_id)` |
| `pk_customer_wishlist_items` | `CREATE UNIQUE INDEX pk_customer_wishlist_items ON customer.wishlist_items USING btree (internal_id)` |
| `uq_customer_wishlist_items_id` | `CREATE UNIQUE INDEX uq_customer_wishlist_items_id ON customer.wishlist_items USING btree (id)` |
| `wishlist_product` | `CREATE UNIQUE INDEX wishlist_product ON customer.wishlist_items USING btree (wishlist_id, product_id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON customer.wishlist_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["wishlist_id","wishlist_id_internal_id","customer","wishlists"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON customer.wishlist_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON customer.wishlist_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["wishlist_id","wishlist_id_internal_id","customer","wishlists"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
