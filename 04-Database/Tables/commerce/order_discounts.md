# `commerce.order_discounts`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds order discounts records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 16 columns, 16 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(14,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_order_discounts_created_by_users) |
| `discount_type` | `character varying(64)` | No | — | Inferred: stores discount type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | See exact constraints |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` (fk_commerce_order_discounts_order_id_orders) |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` (fk_commerce_order_discounts_order_id_orders_numeric); Numeric/public-key pair verification required |
| `order_item_id` | `uuid` | Yes | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` (fk_commerce_order_discounts_order_item_id_order_items) |
| `order_item_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` (fk_commerce_order_discounts_order_item_id_order_items_numeric); Numeric/public-key pair verification required |
| `promotion_id` | `uuid` | Yes | — | Reference linking this record to promotions | Ensures related business data can be joined and validated | FK → `pricing.promotions` (fk_commerce_order_discounts_promotion_id_promotions) |
| `promotion_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `pricing.promotions` (fk_commerce_order_discounts_promotion_id_promotions_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_order_discounts_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the order discounts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.order_discounts` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_commerce_order_discounts_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_commerce_order_discounts_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `promotion_id` → `pricing.promotions(id)` via `fk_commerce_order_discounts_promotion_id_promotions`; `FOREIGN KEY (promotion_id) REFERENCES pricing.promotions(id) ON DELETE SET NULL`
- `order_item_id` → `commerce.order_items(id)` via `fk_commerce_order_discounts_order_item_id_order_items`; `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE CASCADE`
- `order_id` → `commerce.orders(id)` via `fk_commerce_order_discounts_order_id_orders`; `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE CASCADE`
- `order_id_internal_id` → `commerce.orders(internal_id)` via `fk_commerce_order_discounts_order_id_orders_numeric`; `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE CASCADE`
- `order_item_id_internal_id` → `commerce.order_items(internal_id)` via `fk_commerce_order_discounts_order_item_id_order_items_numeric`; `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE CASCADE`
- `promotion_id_internal_id` → `pricing.promotions(internal_id)` via `fk_commerce_order_discounts_promotion_id_promotions_numeric`; `FOREIGN KEY (promotion_id_internal_id) REFERENCES pricing.promotions(internal_id) ON DELETE SET NULL`

## `commerce.order_discounts` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 16 columns, 16 constraints, 3 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_commerce_order_discounts_created_by_users` |
| `updated_by` | `identity.users` | `fk_commerce_order_discounts_updated_by_users` |
| `promotion_id` | `pricing.promotions` | `fk_commerce_order_discounts_promotion_id_promotions` |
| `order_item_id` | `commerce.order_items` | `fk_commerce_order_discounts_order_item_id_order_items` |
| `order_id` | `commerce.orders` | `fk_commerce_order_discounts_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_commerce_order_discounts_order_id_orders_numeric` |
| `order_item_id_internal_id` | `commerce.order_items` | `fk_commerce_order_discounts_order_item_id_order_items_numeric` |
| `promotion_id_internal_id` | `pricing.promotions` | `fk_commerce_order_discounts_promotion_id_promotions_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_commerce_order_discounts_amount_nonnegative` | CHECK | `CHECK (amount >= 0::numeric)` |
| `ck_commerce_order_discounts_finite_numeric_values` | CHECK | `CHECK (amount IS NULL OR (amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_commerce_order_discounts_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_commerce_order_discounts_numeric_pair_order_item_id` | CHECK | `CHECK ((order_item_id IS NULL) = (order_item_id_internal_id IS NULL))` |
| `ck_commerce_order_discounts_numeric_pair_promotion_id` | CHECK | `CHECK ((promotion_id IS NULL) = (promotion_id_internal_id IS NULL))` |
| `ck_commerce_order_discounts_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_commerce_order_discounts_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_order_discounts_order_id_orders` | FOREIGN KEY | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE CASCADE` |
| `fk_commerce_order_discounts_order_id_orders_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE CASCADE` |
| `fk_commerce_order_discounts_order_item_id_order_items` | FOREIGN KEY | `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE CASCADE` |
| `fk_commerce_order_discounts_order_item_id_order_items_numeric` | FOREIGN KEY | `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE CASCADE` |
| `fk_commerce_order_discounts_promotion_id_promotions` | FOREIGN KEY | `FOREIGN KEY (promotion_id) REFERENCES pricing.promotions(id) ON DELETE SET NULL` |
| `fk_commerce_order_discounts_promotion_id_promotions_numeric` | FOREIGN KEY | `FOREIGN KEY (promotion_id_internal_id) REFERENCES pricing.promotions(internal_id) ON DELETE SET NULL` |
| `fk_commerce_order_discounts_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_commerce_order_discounts` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_commerce_order_discounts_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_commerce_order_discounts_order` | `CREATE INDEX ix_commerce_order_discounts_order ON commerce.order_discounts USING btree (order_id)` |
| `pk_commerce_order_discounts` | `CREATE UNIQUE INDEX pk_commerce_order_discounts ON commerce.order_discounts USING btree (internal_id)` |
| `uq_commerce_order_discounts_id` | `CREATE UNIQUE INDEX uq_commerce_order_discounts_id ON commerce.order_discounts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_discounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_item_id","order_item_id_internal_id","commerce","order_items"],["promotion_id","promotion_id_internal_id","pricing","promotions"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.order_discounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_discounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_item_id","order_item_id_internal_id","commerce","order_items"],["promotion_id","promotion_id_internal_id","pricing","promotions"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
