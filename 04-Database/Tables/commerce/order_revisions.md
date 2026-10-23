# commerce.order_revisions

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds order revisions records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 20 columns, 15 constraints, 8 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `accepted_at` | `timestamp with time zone` | Yes | — | Time of accepted | Support chronology, deadlines or audit evidence | See exact constraints |
| `accepted_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_order_revisions_accepted_by_user_id_users) |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | See exact constraints |
| `discount_total` | `numeric(16,2)` | No | `0` | Value of discount total | Enable pricing, reconciliation or reporting | See exact constraints |
| `grand_total` | `numeric(16,2)` | No | — | Value of grand total | Enable pricing, reconciliation or reporting | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `line_items_snapshot` | `jsonb` | No | — | Structured line items snapshot information | Retain a versioned payload or relevant details | See exact constraints |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` (fk_commerce_order_revisions_order_id_orders) |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` (fk_commerce_order_revisions_order_id_orders_numeric); Numeric/public-key pair verification required |
| `other_charges_total` | `numeric(16,2)` | No | `0` | Value of other charges total | Enable pricing, reconciliation or reporting | See exact constraints |
| `price_snapshot` | `jsonb` | No | — | Structured price snapshot information | Retain a versioned payload or relevant details | See exact constraints |
| `quote_hash` | `character varying(64)` | No | — | Inferred: stores quote hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `revision_number` | `integer` | No | — | Inferred: stores revision number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `shipping_snapshot` | `jsonb` | No | — | Structured shipping snapshot information | Retain a versioned payload or relevant details | See exact constraints |
| `shipping_total` | `numeric(16,2)` | No | `0` | Value of shipping total | Enable pricing, reconciliation or reporting | See exact constraints |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `subtotal` | `numeric(16,2)` | No | — | Inferred: stores subtotal for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `tax_total` | `numeric(16,2)` | No | `0` | Value of tax total | Enable pricing, reconciliation or reporting | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the order revisions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.order_revisions` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `accepted_by_user_id` → `identity.users(id)` via `fk_commerce_order_revisions_accepted_by_user_id_users`; FOREIGN KEY (accepted_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `order_id` → `commerce.orders(id)` via `fk_commerce_order_revisions_order_id_orders`; FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT
- `order_id_internal_id` → `commerce.orders(internal_id)` via `fk_commerce_order_revisions_order_id_orders_numeric`; FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT

**Referenced by 14 FK constraints** (sample): `commerce.orders`, `fulfillment.fulfillment_orders`, `logistics.shipments`, `payment.payment_intents`, `payment.refunds`, `payment.cod_collections`, `warehouse.stock_reservations`, `commerce.orders`, `fulfillment.fulfillment_orders`, `logistics.shipments`, `payment.cod_collections`, `payment.payment_intents`.

## commerce.order_revisions — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 20 columns, 15 constraints, 8 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `accepted_by_user_id` | `identity.users` | `fk_commerce_order_revisions_accepted_by_user_id_users` |
| `order_id` | `commerce.orders` | `fk_commerce_order_revisions_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_commerce_order_revisions_order_id_orders_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_commerce_order_revisions_order_time` | `CREATE INDEX ix_commerce_order_revisions_order_time ON commerce.order_revisions USING btree (order_id, created_at DESC)` |
| `ix_commerce_order_revisions_pending` | `CREATE INDEX ix_commerce_order_revisions_pending ON commerce.order_revisions USING btree (status, created_at) WHERE status::text = 'proposed'::text` |
| `pk_commerce_order_revisions` | `CREATE UNIQUE INDEX pk_commerce_order_revisions ON commerce.order_revisions USING btree (internal_id)` |
| `uq_commerce_one_accepted_revision` | `CREATE UNIQUE INDEX uq_commerce_one_accepted_revision ON commerce.order_revisions USING btree (order_id) WHERE status::text = 'accepted'::text` |
| `uq_commerce_order_revisions_id` | `CREATE UNIQUE INDEX uq_commerce_order_revisions_id ON commerce.order_revisions USING btree (id)` |
| `uq_commerce_order_revisions_id_order` | `CREATE UNIQUE INDEX uq_commerce_order_revisions_id_order ON commerce.order_revisions USING btree (id, order_id)` |
| `uq_commerce_order_revisions_number` | `CREATE UNIQUE INDEX uq_commerce_order_revisions_number ON commerce.order_revisions USING btree (order_id, revision_number)` |
| `uq_numeric_commerce_order_revisions_internal_id_order_i_468b` | `CREATE UNIQUE INDEX uq_numeric_commerce_order_revisions_internal_id_order_i_468b ON commerce.order_revisions USING btree (internal_id, order_id_internal_id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_revisions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"]]', 'internal_id', 'id')` |
| `accepted_revision_sync` | `CREATE TRIGGER accepted_revision_sync AFTER INSERT OR UPDATE ON commerce.order_revisions FOR EACH ROW EXECUTE FUNCTION commerce.sync_accepted_revision()` |
| `order_revision_guard` | `CREATE TRIGGER order_revision_guard BEFORE INSERT OR DELETE OR UPDATE ON commerce.order_revisions FOR EACH ROW EXECUTE FUNCTION commerce.guard_revision()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_revisions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
