# `commerce.order_discounts`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds order discounts records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | commerce.order_discounts |
| Classification | Transactional |
| Proposed business write owner | Order_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 16 columns; 16 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(14,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_order_discounts_created_by_users` |
| `discount_type` | `character varying(64)` | No | — | Inferred: stores discount type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | Exact constraints below |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` via `fk_commerce_order_discounts_order_id_orders` |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` via `fk_commerce_order_discounts_order_id_orders_numeric` |
| `order_item_id` | `uuid` | Yes | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` via `fk_commerce_order_discounts_order_item_id_order_items` |
| `order_item_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` via `fk_commerce_order_discounts_order_item_id_order_items_numeric` |
| `promotion_id` | `uuid` | Yes | — | Reference linking this record to promotions | Ensures related business data can be joined and validated | FK → `pricing.promotions` via `fk_commerce_order_discounts_promotion_id_promotions` |
| `promotion_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `pricing.promotions` via `fk_commerce_order_discounts_promotion_id_promotions_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_order_discounts_updated_by_users` |

## Record lifecycle and users

- **Created:** when the order discounts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.order_discounts` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_commerce_order_discounts_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_commerce_order_discounts_order_id_orders | `order_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE CASCADE` |
| fk_commerce_order_discounts_order_id_orders_numeric | `order_id_internal_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE CASCADE` |
| fk_commerce_order_discounts_order_item_id_order_items | `order_item_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE CASCADE` |
| fk_commerce_order_discounts_order_item_id_order_items_numeric | `order_item_id_internal_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE CASCADE` |
| fk_commerce_order_discounts_promotion_id_promotions | `promotion_id` | [`pricing.promotions`](../../Tables/pricing/promotions.md) | `FOREIGN KEY (promotion_id) REFERENCES pricing.promotions(id) ON DELETE SET NULL` |
| fk_commerce_order_discounts_promotion_id_promotions_numeric | `promotion_id_internal_id` | [`pricing.promotions`](../../Tables/pricing/promotions.md) | `FOREIGN KEY (promotion_id_internal_id) REFERENCES pricing.promotions(internal_id) ON DELETE SET NULL` |
| fk_commerce_order_discounts_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `commerce.order_discounts` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_commerce_order_discounts_created_by_users` |
| `order_id` | `commerce.orders` | `fk_commerce_order_discounts_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_commerce_order_discounts_order_id_orders_numeric` |
| `order_item_id` | `commerce.order_items` | `fk_commerce_order_discounts_order_item_id_order_items` |
| `order_item_id_internal_id` | `commerce.order_items` | `fk_commerce_order_discounts_order_item_id_order_items_numeric` |
| `promotion_id` | `pricing.promotions` | `fk_commerce_order_discounts_promotion_id_promotions` |
| `promotion_id_internal_id` | `pricing.promotions` | `fk_commerce_order_discounts_promotion_id_promotions_numeric` |
| `updated_by` | `identity.users` | `fk_commerce_order_discounts_updated_by_users` |

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
| `order_discounts_amount_not_null` | NOT NULL | `NOT NULL amount` |
| `order_discounts_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `order_discounts_discount_type_not_null` | NOT NULL | `NOT NULL discount_type` |
| `order_discounts_id_not_null` | NOT NULL | `NOT NULL id` |
| `order_discounts_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `order_discounts_metadata_json_not_null` | NOT NULL | `NOT NULL metadata_json` |
| `order_discounts_order_id_internal_id_not_null` | NOT NULL | `NOT NULL order_id_internal_id` |
| `order_discounts_order_id_not_null` | NOT NULL | `NOT NULL order_id` |
| `order_discounts_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `order_discounts_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_commerce_order_discounts_order` | btree | `(order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_order_discounts_order ON commerce.order_discounts USING btree (order_id)` |
| `pk_commerce_order_discounts` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_commerce_order_discounts ON commerce.order_discounts USING btree (internal_id)` |
| `uq_commerce_order_discounts_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_order_discounts_id ON commerce.order_discounts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_discounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_item_id","order_item_id_internal_id","commerce","order_items"],["promotion_id","promotion_id_internal_id","pricing","promotions"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.order_discounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_discounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_item_id","order_item_id_internal_id","commerce","order_items"],["promotion_id","promotion_id_internal_id","pricing","promotions"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
