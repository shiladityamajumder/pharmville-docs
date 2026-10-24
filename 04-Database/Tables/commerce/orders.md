# `commerce.orders`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds orders records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | commerce.orders |
| Classification | Transactional |
| Proposed business write owner | Order_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 32 columns; 28 PK/FK/UQ/CHECK/exclusion constraints; 21 named PostgreSQL 18 NOT NULL constraints; 11 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `billing_address_snapshot` | `jsonb` | Yes | — | Structured billing address snapshot information | Retain a versioned payload or relevant details | Exact constraints below |
| `cancelled_at` | `timestamp with time zone` | Yes | — | Time of cancelled | Support chronology, deadlines or audit evidence | Exact constraints below |
| `checkout_id` | `uuid` | Yes | — | Reference linking this record to checkouts | Ensures related business data can be joined and validated | FK → `commerce.checkouts` via `fk_commerce_orders_checkout_id_checkouts` |
| `checkout_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.checkouts` via `fk_commerce_orders_checkout_id_checkouts_numeric` |
| `confirmed_at` | `timestamp with time zone` | Yes | — | Time of confirmed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_orders_created_by_users` |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | Collation: default |
| `current_revision_id` | `uuid` | Yes | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` via `fk_commerce_orders_revision_scope` |
| `current_revision_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_revisions` via `fk_commerce_orders_revision_scope_numeric` |
| `discount_total` | `numeric(16,2)` | No | `0` | Value of discount total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `fulfillment_status` | `character varying(32)` | No | — | Inferred: stores fulfillment status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `grand_total` | `numeric(16,2)` | No | — | Value of grand total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | FK → `commerce.order_revisions` via `fk_commerce_orders_revision_scope` |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | FK → `commerce.order_revisions` via `fk_commerce_orders_revision_scope_numeric`; GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `order_number` | `character varying(64)` | No | — | Inferred: stores order number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `other_charges_total` | `numeric(16,2)` | No | `0` | Value of other charges total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `patient_profile_id` | `uuid` | Yes | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` via `fk_commerce_orders_patient_profile_id_patient_profiles` |
| `patient_profile_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` via `fk_commerce_orders_patient_profile_id_patient_profiles_numeric` |
| `payment_status` | `character varying(32)` | No | — | Inferred: stores payment status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `placed_at` | `timestamp with time zone` | No | `now()` | Time of placed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `prescription_status` | `character varying(32)` | No | — | Inferred: stores prescription status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `shipping_address_snapshot` | `jsonb` | No | — | Structured shipping address snapshot information | Retain a versioned payload or relevant details | Exact constraints below |
| `shipping_total` | `numeric(16,2)` | No | `0` | Value of shipping total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `source_channel` | `character varying(32)` | No | `'app'::character varying` | Inferred: stores source channel for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `status` | `character varying(19)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `subtotal` | `numeric(16,2)` | No | — | Inferred: stores subtotal for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `tax_total` | `numeric(16,2)` | No | `0` | Value of tax total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_orders_updated_by_users` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_orders_user_id_users` |

## Record lifecycle and users

- **Created:** when the orders business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.orders` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_commerce_orders_checkout_id_checkouts | `checkout_id` | [`commerce.checkouts`](../../Tables/commerce/checkouts.md) | `FOREIGN KEY (checkout_id) REFERENCES commerce.checkouts(id) ON DELETE RESTRICT` |
| fk_commerce_orders_checkout_id_checkouts_numeric | `checkout_id_internal_id` | [`commerce.checkouts`](../../Tables/commerce/checkouts.md) | `FOREIGN KEY (checkout_id_internal_id) REFERENCES commerce.checkouts(internal_id) ON DELETE RESTRICT` |
| fk_commerce_orders_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_commerce_orders_patient_profile_id_patient_profiles | `patient_profile_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| fk_commerce_orders_patient_profile_id_patient_profiles_numeric | `patient_profile_id_internal_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| fk_commerce_orders_revision_scope | `current_revision_id, id` | [`commerce.order_revisions`](../../Tables/commerce/order_revisions.md) | `FOREIGN KEY (current_revision_id, id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT` |
| fk_commerce_orders_revision_scope_numeric | `current_revision_id_internal_id, internal_id` | [`commerce.order_revisions`](../../Tables/commerce/order_revisions.md) | `FOREIGN KEY (current_revision_id_internal_id, internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| fk_commerce_orders_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_commerce_orders_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | fk_clinical_order_reviews_order_id_orders | `order_id` | `id` |
| [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | fk_clinical_order_reviews_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |
| [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | fk_clinical_order_reviews_order_patient | `order_id, patient_profile_id` | `id, patient_profile_id` |
| [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | fk_clinical_order_reviews_order_patient_numeric | `order_id_internal_id, patient_profile_id_internal_id` | `internal_id, patient_profile_id_internal_id` |
| [`commerce.cancellations`](../../Tables/commerce/cancellations.md) | fk_commerce_cancellations_order_id_orders | `order_id` | `id` |
| [`commerce.cancellations`](../../Tables/commerce/cancellations.md) | fk_commerce_cancellations_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |
| [`commerce.order_charges`](../../Tables/commerce/order_charges.md) | fk_commerce_order_charges_order_id_orders | `order_id` | `id` |
| [`commerce.order_charges`](../../Tables/commerce/order_charges.md) | fk_commerce_order_charges_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |
| [`commerce.order_discounts`](../../Tables/commerce/order_discounts.md) | fk_commerce_order_discounts_order_id_orders | `order_id` | `id` |
| [`commerce.order_discounts`](../../Tables/commerce/order_discounts.md) | fk_commerce_order_discounts_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |
| [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | fk_commerce_order_groups_order_id_orders | `order_id` | `id` |
| [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | fk_commerce_order_groups_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |
| [`commerce.order_items`](../../Tables/commerce/order_items.md) | fk_commerce_order_items_order_id_orders | `order_id` | `id` |
| [`commerce.order_items`](../../Tables/commerce/order_items.md) | fk_commerce_order_items_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |
| [`commerce.order_revisions`](../../Tables/commerce/order_revisions.md) | fk_commerce_order_revisions_order_id_orders | `order_id` | `id` |
| [`commerce.order_revisions`](../../Tables/commerce/order_revisions.md) | fk_commerce_order_revisions_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |
| [`commerce.order_status_history`](../../Tables/commerce/order_status_history.md) | fk_commerce_order_status_history_order_id_orders | `order_id` | `id` |
| [`commerce.order_status_history`](../../Tables/commerce/order_status_history.md) | fk_commerce_order_status_history_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |
| [`commerce.returns`](../../Tables/commerce/returns.md) | fk_commerce_returns_order_id_orders | `order_id` | `id` |
| [`commerce.returns`](../../Tables/commerce/returns.md) | fk_commerce_returns_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |
| [`finance.invoices`](../../Tables/finance/invoices.md) | fk_finance_invoices_order_id_orders | `order_id` | `id` |
| [`finance.invoices`](../../Tables/finance/invoices.md) | fk_finance_invoices_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |
| [`finance.settlement_items`](../../Tables/finance/settlement_items.md) | fk_finance_settlement_items_order_id_orders | `order_id` | `id` |
| [`finance.settlement_items`](../../Tables/finance/settlement_items.md) | fk_finance_settlement_items_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |
| [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | fk_fulfillment_fulfillment_orders_order_id_orders | `order_id` | `id` |
| [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | fk_fulfillment_fulfillment_orders_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |
| [`logistics.shipments`](../../Tables/logistics/shipments.md) | fk_logistics_shipments_order_id_orders | `order_id` | `id` |
| [`logistics.shipments`](../../Tables/logistics/shipments.md) | fk_logistics_shipments_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |
| [`marketplace.seller_ratings`](../../Tables/marketplace/seller_ratings.md) | fk_domain_marketplace_seller_ratings_order_id | `order_id, user_id` | `id, user_id` |
| [`marketplace.seller_ratings`](../../Tables/marketplace/seller_ratings.md) | fk_domain_marketplace_seller_ratings_order_id_numeric | `order_id_internal_id, user_id` | `internal_id, user_id` |
| [`payment.chargebacks`](../../Tables/payment/chargebacks.md) | fk_payment_chargebacks_order_id_orders | `order_id` | `id` |
| [`payment.chargebacks`](../../Tables/payment/chargebacks.md) | fk_payment_chargebacks_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |
| [`payment.cod_collections`](../../Tables/payment/cod_collections.md) | fk_payment_cod_collections_order_id_orders | `order_id` | `id` |
| [`payment.cod_collections`](../../Tables/payment/cod_collections.md) | fk_payment_cod_collections_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |
| [`payment.payment_intents`](../../Tables/payment/payment_intents.md) | fk_payment_payment_intents_order_id_orders | `order_id` | `id` |
| [`payment.payment_intents`](../../Tables/payment/payment_intents.md) | fk_payment_payment_intents_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |
| [`payment.refunds`](../../Tables/payment/refunds.md) | fk_payment_refunds_order_id_orders | `order_id` | `id` |
| [`payment.refunds`](../../Tables/payment/refunds.md) | fk_payment_refunds_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |
| [`pricing.promotion_redemptions`](../../Tables/pricing/promotion_redemptions.md) | fk_domain_pricing_promotion_redemptions_order_id | `order_id, user_id` | `id, user_id` |
| [`pricing.promotion_redemptions`](../../Tables/pricing/promotion_redemptions.md) | fk_domain_pricing_promotion_redemptions_order_id_numeric | `order_id_internal_id, user_id` | `internal_id, user_id` |
| [`support.tickets`](../../Tables/support/tickets.md) | fk_support_tickets_order_id_orders | `order_id` | `id` |
| [`support.tickets`](../../Tables/support/tickets.md) | fk_support_tickets_order_id_orders_numeric | `order_id_internal_id` | `internal_id` |

## `commerce.orders` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `checkout_id` | `commerce.checkouts` | `fk_commerce_orders_checkout_id_checkouts` |
| `checkout_id_internal_id` | `commerce.checkouts` | `fk_commerce_orders_checkout_id_checkouts_numeric` |
| `created_by` | `identity.users` | `fk_commerce_orders_created_by_users` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_commerce_orders_patient_profile_id_patient_profiles` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_commerce_orders_patient_profile_id_patient_profiles_numeric` |
| `current_revision_id, id` | `commerce.order_revisions` | `fk_commerce_orders_revision_scope` |
| `current_revision_id_internal_id, internal_id` | `commerce.order_revisions` | `fk_commerce_orders_revision_scope_numeric` |
| `updated_by` | `identity.users` | `fk_commerce_orders_updated_by_users` |
| `user_id` | `identity.users` | `fk_commerce_orders_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_commerce_orders_discount_nonnegative` | CHECK | `CHECK (discount_total >= 0::numeric)` |
| `ck_commerce_orders_finite_numeric_values` | CHECK | `CHECK ((subtotal IS NULL OR (subtotal <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (discount_total IS NULL OR (discount_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (tax_total IS NULL OR (tax_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (shipping_total IS NULL OR (shipping_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (other_charges_total IS NULL OR (other_charges_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (grand_total IS NULL OR (grand_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_commerce_orders_grand_total_formula` | CHECK | `CHECK (grand_total = (subtotal - discount_total + tax_total + shipping_total + other_charges_total))` |
| `ck_commerce_orders_grand_total_nonnegative` | CHECK | `CHECK (grand_total >= 0::numeric)` |
| `ck_commerce_orders_numeric_pair_checkout_id` | CHECK | `CHECK ((checkout_id IS NULL) = (checkout_id_internal_id IS NULL))` |
| `ck_commerce_orders_numeric_pair_current_revision_id` | CHECK | `CHECK ((current_revision_id IS NULL) = (current_revision_id_internal_id IS NULL))` |
| `ck_commerce_orders_numeric_pair_patient_profile_id` | CHECK | `CHECK ((patient_profile_id IS NULL) = (patient_profile_id_internal_id IS NULL))` |
| `ck_commerce_orders_orderstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['created'::text, 'pending_payment'::text, 'payment_confirmed'::text, 'prescription_review'::text, 'confirmed'::text, 'allocated'::text, 'processing'::text, 'partially_fulfilled'::text, 'fulfilled'::text, 'cancelled'::text, 'closed'::text]))` |
| `ck_commerce_orders_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_commerce_orders_shipping_nonnegative` | CHECK | `CHECK (shipping_total >= 0::numeric)` |
| `ck_commerce_orders_subtotal_nonnegative` | CHECK | `CHECK (subtotal >= 0::numeric)` |
| `ck_commerce_orders_tax_nonnegative` | CHECK | `CHECK (tax_total >= 0::numeric)` |
| `fk_commerce_orders_checkout_id_checkouts` | FOREIGN KEY | `FOREIGN KEY (checkout_id) REFERENCES commerce.checkouts(id) ON DELETE RESTRICT` |
| `fk_commerce_orders_checkout_id_checkouts_numeric` | FOREIGN KEY | `FOREIGN KEY (checkout_id_internal_id) REFERENCES commerce.checkouts(internal_id) ON DELETE RESTRICT` |
| `fk_commerce_orders_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_orders_patient_profile_id_patient_profiles` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| `fk_commerce_orders_patient_profile_id_patient_profiles_numeric` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| `fk_commerce_orders_revision_scope` | FOREIGN KEY | `FOREIGN KEY (current_revision_id, id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT` |
| `fk_commerce_orders_revision_scope_numeric` | FOREIGN KEY | `FOREIGN KEY (current_revision_id_internal_id, internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| `fk_commerce_orders_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_orders_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `order_number` | UNIQUE | `UNIQUE (order_number)` |
| `pk_commerce_orders` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_commerce_orders_id` | UNIQUE | `UNIQUE (id)` |
| `uq_commerce_orders_id_patient` | UNIQUE | `UNIQUE (id, patient_profile_id)` |
| `uq_numeric_commerce_orders_internal_id_patient_profile__4a64` | UNIQUE | `UNIQUE (internal_id, patient_profile_id_internal_id)` |
| `uq_numeric_commerce_orders_internal_id_user_id` | UNIQUE | `UNIQUE (internal_id, user_id)` |
| `uq_scope_commerce_orders_user_id` | UNIQUE | `UNIQUE (id, user_id)` |
| `orders_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `orders_currency_not_null` | NOT NULL | `NOT NULL currency` |
| `orders_discount_total_not_null` | NOT NULL | `NOT NULL discount_total` |
| `orders_fulfillment_status_not_null` | NOT NULL | `NOT NULL fulfillment_status` |
| `orders_grand_total_not_null` | NOT NULL | `NOT NULL grand_total` |
| `orders_id_not_null` | NOT NULL | `NOT NULL id` |
| `orders_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `orders_order_number_not_null` | NOT NULL | `NOT NULL order_number` |
| `orders_other_charges_total_not_null` | NOT NULL | `NOT NULL other_charges_total` |
| `orders_payment_status_not_null` | NOT NULL | `NOT NULL payment_status` |
| `orders_placed_at_not_null` | NOT NULL | `NOT NULL placed_at` |
| `orders_prescription_status_not_null` | NOT NULL | `NOT NULL prescription_status` |
| `orders_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `orders_shipping_address_snapshot_not_null` | NOT NULL | `NOT NULL shipping_address_snapshot` |
| `orders_shipping_total_not_null` | NOT NULL | `NOT NULL shipping_total` |
| `orders_source_channel_not_null` | NOT NULL | `NOT NULL source_channel` |
| `orders_status_not_null` | NOT NULL | `NOT NULL status` |
| `orders_subtotal_not_null` | NOT NULL | `NOT NULL subtotal` |
| `orders_tax_total_not_null` | NOT NULL | `NOT NULL tax_total` |
| `orders_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `orders_user_id_not_null` | NOT NULL | `NOT NULL user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_commerce_orders_payment_status` | btree | `(payment_status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_orders_payment_status ON commerce.orders USING btree (payment_status)` |
| `ix_commerce_orders_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_orders_status ON commerce.orders USING btree (status)` |
| `ix_commerce_orders_user_time` | btree | `(user_id, placed_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_orders_user_time ON commerce.orders USING btree (user_id, placed_at)` |
| `order_number` | btree | `(order_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX order_number ON commerce.orders USING btree (order_number)` |
| `pk_commerce_orders` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_commerce_orders ON commerce.orders USING btree (internal_id)` |
| `uq_commerce_orders_checkout_present` | btree | `(checkout_id)` | checkout_id IS NOT NULL | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_orders_checkout_present ON commerce.orders USING btree (checkout_id) WHERE checkout_id IS NOT NULL` |
| `uq_commerce_orders_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_orders_id ON commerce.orders USING btree (id)` |
| `uq_commerce_orders_id_patient` | btree | `(id, patient_profile_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_orders_id_patient ON commerce.orders USING btree (id, patient_profile_id)` |
| `uq_numeric_commerce_orders_internal_id_patient_profile__4a64` | btree | `(internal_id, patient_profile_id_internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_numeric_commerce_orders_internal_id_patient_profile__4a64 ON commerce.orders USING btree (internal_id, patient_profile_id_internal_id)` |
| `uq_numeric_commerce_orders_internal_id_user_id` | btree | `(internal_id, user_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_numeric_commerce_orders_internal_id_user_id ON commerce.orders USING btree (internal_id, user_id)` |
| `uq_scope_commerce_orders_user_id` | btree | `(id, user_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_scope_commerce_orders_user_id ON commerce.orders USING btree (id, user_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["checkout_id","checkout_id_internal_id","commerce","checkouts"],["current_revision_id","current_revision_id_internal_id","commerce","order_revisions"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` | O |
| `order_patient_money_guard` | `CREATE TRIGGER order_patient_money_guard BEFORE UPDATE ON commerce.orders FOR EACH ROW EXECUTE FUNCTION commerce.guard_order_patient_and_money()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["checkout_id","checkout_id_internal_id","commerce","checkouts"],["current_revision_id","current_revision_id_internal_id","commerce","order_revisions"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
