# `commerce.order_revisions`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds order revisions records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | commerce.order_revisions |
| Classification | Transactional |
| Proposed business write owner | Order_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 20 columns; 15 PK/FK/UQ/CHECK/exclusion constraints; 18 named PostgreSQL 18 NOT NULL constraints; 8 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `accepted_at` | `timestamp with time zone` | Yes | — | Time of accepted | Support chronology, deadlines or audit evidence | Exact constraints below |
| `accepted_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_order_revisions_accepted_by_user_id_users` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | Collation: default |
| `discount_total` | `numeric(16,2)` | No | `0` | Value of discount total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `grand_total` | `numeric(16,2)` | No | — | Value of grand total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `line_items_snapshot` | `jsonb` | No | — | Structured line items snapshot information | Retain a versioned payload or relevant details | Exact constraints below |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` via `fk_commerce_order_revisions_order_id_orders` |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` via `fk_commerce_order_revisions_order_id_orders_numeric` |
| `other_charges_total` | `numeric(16,2)` | No | `0` | Value of other charges total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `price_snapshot` | `jsonb` | No | — | Structured price snapshot information | Retain a versioned payload or relevant details | Exact constraints below |
| `quote_hash` | `character varying(64)` | No | — | Inferred: stores quote hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `revision_number` | `integer` | No | — | Inferred: stores revision number for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `shipping_snapshot` | `jsonb` | No | — | Structured shipping snapshot information | Retain a versioned payload or relevant details | Exact constraints below |
| `shipping_total` | `numeric(16,2)` | No | `0` | Value of shipping total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `subtotal` | `numeric(16,2)` | No | — | Inferred: stores subtotal for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `tax_total` | `numeric(16,2)` | No | `0` | Value of tax total | Enable pricing, reconciliation or reporting | Exact constraints below |

## Record lifecycle and users

- **Created:** when the order revisions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.order_revisions` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_commerce_order_revisions_accepted_by_user_id_users | `accepted_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (accepted_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_commerce_order_revisions_order_id_orders | `order_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| fk_commerce_order_revisions_order_id_orders_numeric | `order_id_internal_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`commerce.orders`](../../Tables/commerce/orders.md) | fk_commerce_orders_revision_scope | `current_revision_id, id` | `id, order_id` |
| [`commerce.orders`](../../Tables/commerce/orders.md) | fk_commerce_orders_revision_scope_numeric | `current_revision_id_internal_id, internal_id` | `internal_id, order_id_internal_id` |
| [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | fk_fulfillment_fulfillment_orders_revision_scope | `order_revision_id, order_id` | `id, order_id` |
| [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | fk_fulfillment_fulfillment_orders_revision_scope_numeric | `order_revision_id_internal_id, order_id_internal_id` | `internal_id, order_id_internal_id` |
| [`logistics.shipments`](../../Tables/logistics/shipments.md) | fk_logistics_shipments_revision_scope | `order_revision_id, order_id` | `id, order_id` |
| [`logistics.shipments`](../../Tables/logistics/shipments.md) | fk_logistics_shipments_revision_scope_numeric | `order_revision_id_internal_id, order_id_internal_id` | `internal_id, order_id_internal_id` |
| [`payment.cod_collections`](../../Tables/payment/cod_collections.md) | fk_payment_cod_collections_revision_scope | `order_revision_id, order_id` | `id, order_id` |
| [`payment.cod_collections`](../../Tables/payment/cod_collections.md) | fk_payment_cod_collections_revision_scope_numeric | `order_revision_id_internal_id, order_id_internal_id` | `internal_id, order_id_internal_id` |
| [`payment.payment_intents`](../../Tables/payment/payment_intents.md) | fk_payment_intents_revision_order | `order_revision_id, order_id` | `id, order_id` |
| [`payment.payment_intents`](../../Tables/payment/payment_intents.md) | fk_payment_intents_revision_order_numeric | `order_revision_id_internal_id, order_id_internal_id` | `internal_id, order_id_internal_id` |
| [`payment.refunds`](../../Tables/payment/refunds.md) | fk_payment_refunds_revision_scope | `order_revision_id, order_id` | `id, order_id` |
| [`payment.refunds`](../../Tables/payment/refunds.md) | fk_payment_refunds_revision_scope_numeric | `order_revision_id_internal_id, order_id_internal_id` | `internal_id, order_id_internal_id` |
| [`warehouse.stock_reservations`](../../Tables/warehouse/stock_reservations.md) | fk_warehouse_stock_reservations_revision_scope | `order_revision_id, order_id` | `id, order_id` |
| [`warehouse.stock_reservations`](../../Tables/warehouse/stock_reservations.md) | fk_warehouse_stock_reservations_revision_scope_numeric | `order_revision_id_internal_id, order_id_internal_id` | `internal_id, order_id_internal_id` |

## `commerce.order_revisions` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `accepted_by_user_id` | `identity.users` | `fk_commerce_order_revisions_accepted_by_user_id_users` |
| `order_id` | `commerce.orders` | `fk_commerce_order_revisions_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_commerce_order_revisions_order_id_orders_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_commerce_order_revisions_acceptance_required` | CHECK | `CHECK (status::text <> 'accepted'::text OR accepted_by_user_id IS NOT NULL AND accepted_at IS NOT NULL)` |
| `ck_commerce_order_revisions_amounts_nonnegative` | CHECK | `CHECK (subtotal >= 0::numeric AND discount_total >= 0::numeric AND tax_total >= 0::numeric AND shipping_total >= 0::numeric AND other_charges_total >= 0::numeric AND grand_total >= 0::numeric)` |
| `ck_commerce_order_revisions_finite_numeric_values` | CHECK | `CHECK ((subtotal IS NULL OR (subtotal <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (discount_total IS NULL OR (discount_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (tax_total IS NULL OR (tax_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (shipping_total IS NULL OR (shipping_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (other_charges_total IS NULL OR (other_charges_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (grand_total IS NULL OR (grand_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_commerce_order_revisions_grand_total_formula` | CHECK | `CHECK (grand_total = (subtotal - discount_total + tax_total + shipping_total + other_charges_total))` |
| `ck_commerce_order_revisions_number_positive` | CHECK | `CHECK (revision_number > 0)` |
| `ck_commerce_order_revisions_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_commerce_order_revisions_revisionstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['proposed'::text, 'accepted'::text, 'superseded'::text, 'cancelled'::text]))` |
| `fk_commerce_order_revisions_accepted_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (accepted_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_order_revisions_order_id_orders` | FOREIGN KEY | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| `fk_commerce_order_revisions_order_id_orders_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| `pk_commerce_order_revisions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_commerce_order_revisions_id` | UNIQUE | `UNIQUE (id)` |
| `uq_commerce_order_revisions_id_order` | UNIQUE | `UNIQUE (id, order_id)` |
| `uq_commerce_order_revisions_number` | UNIQUE | `UNIQUE (order_id, revision_number)` |
| `uq_numeric_commerce_order_revisions_internal_id_order_i_468b` | UNIQUE | `UNIQUE (internal_id, order_id_internal_id)` |
| `order_revisions_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `order_revisions_currency_not_null` | NOT NULL | `NOT NULL currency` |
| `order_revisions_discount_total_not_null` | NOT NULL | `NOT NULL discount_total` |
| `order_revisions_grand_total_not_null` | NOT NULL | `NOT NULL grand_total` |
| `order_revisions_id_not_null` | NOT NULL | `NOT NULL id` |
| `order_revisions_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `order_revisions_line_items_snapshot_not_null` | NOT NULL | `NOT NULL line_items_snapshot` |
| `order_revisions_order_id_internal_id_not_null` | NOT NULL | `NOT NULL order_id_internal_id` |
| `order_revisions_order_id_not_null` | NOT NULL | `NOT NULL order_id` |
| `order_revisions_other_charges_total_not_null` | NOT NULL | `NOT NULL other_charges_total` |
| `order_revisions_price_snapshot_not_null` | NOT NULL | `NOT NULL price_snapshot` |
| `order_revisions_quote_hash_not_null` | NOT NULL | `NOT NULL quote_hash` |
| `order_revisions_revision_number_not_null` | NOT NULL | `NOT NULL revision_number` |
| `order_revisions_shipping_snapshot_not_null` | NOT NULL | `NOT NULL shipping_snapshot` |
| `order_revisions_shipping_total_not_null` | NOT NULL | `NOT NULL shipping_total` |
| `order_revisions_status_not_null` | NOT NULL | `NOT NULL status` |
| `order_revisions_subtotal_not_null` | NOT NULL | `NOT NULL subtotal` |
| `order_revisions_tax_total_not_null` | NOT NULL | `NOT NULL tax_total` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_commerce_order_revisions_order_time` | btree | `(order_id, created_at DESC)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_order_revisions_order_time ON commerce.order_revisions USING btree (order_id, created_at DESC)` |
| `ix_commerce_order_revisions_pending` | btree | `(status, created_at)` | status::text = 'proposed'::text | Read/join/filter access path; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_order_revisions_pending ON commerce.order_revisions USING btree (status, created_at) WHERE status::text = 'proposed'::text` |
| `pk_commerce_order_revisions` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_commerce_order_revisions ON commerce.order_revisions USING btree (internal_id)` |
| `uq_commerce_one_accepted_revision` | btree | `(order_id)` | status::text = 'accepted'::text | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_one_accepted_revision ON commerce.order_revisions USING btree (order_id) WHERE status::text = 'accepted'::text` |
| `uq_commerce_order_revisions_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_order_revisions_id ON commerce.order_revisions USING btree (id)` |
| `uq_commerce_order_revisions_id_order` | btree | `(id, order_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_order_revisions_id_order ON commerce.order_revisions USING btree (id, order_id)` |
| `uq_commerce_order_revisions_number` | btree | `(order_id, revision_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_order_revisions_number ON commerce.order_revisions USING btree (order_id, revision_number)` |
| `uq_numeric_commerce_order_revisions_internal_id_order_i_468b` | btree | `(internal_id, order_id_internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_numeric_commerce_order_revisions_internal_id_order_i_468b ON commerce.order_revisions USING btree (internal_id, order_id_internal_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_revisions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"]]', 'internal_id', 'id')` | O |
| `accepted_revision_sync` | `CREATE TRIGGER accepted_revision_sync AFTER INSERT OR UPDATE ON commerce.order_revisions FOR EACH ROW EXECUTE FUNCTION commerce.sync_accepted_revision()` | O |
| `order_revision_guard` | `CREATE TRIGGER order_revision_guard BEFORE INSERT OR DELETE OR UPDATE ON commerce.order_revisions FOR EACH ROW EXECUTE FUNCTION commerce.guard_revision()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_revisions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
