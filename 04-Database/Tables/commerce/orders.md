# `commerce.orders`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds orders records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 32 columns, 28 constraints, 11 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `billing_address_snapshot` | `jsonb` | Yes | — | Structured billing address snapshot information | Retain a versioned payload or relevant details | See exact constraints |
| `cancelled_at` | `timestamp with time zone` | Yes | — | Time of cancelled | Support chronology, deadlines or audit evidence | See exact constraints |
| `checkout_id` | `uuid` | Yes | — | Reference linking this record to checkouts | Ensures related business data can be joined and validated | FK → `commerce.checkouts` (fk_commerce_orders_checkout_id_checkouts) |
| `checkout_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.checkouts` (fk_commerce_orders_checkout_id_checkouts_numeric); Numeric/public-key pair verification required |
| `confirmed_at` | `timestamp with time zone` | Yes | — | Time of confirmed | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_orders_created_by_users) |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | See exact constraints |
| `current_revision_id` | `uuid` | Yes | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` (fk_commerce_orders_revision_scope) |
| `current_revision_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_revisions` (fk_commerce_orders_revision_scope_numeric); Numeric/public-key pair verification required |
| `discount_total` | `numeric(16,2)` | No | `0` | Value of discount total | Enable pricing, reconciliation or reporting | See exact constraints |
| `fulfillment_status` | `character varying(32)` | No | — | Inferred: stores fulfillment status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `grand_total` | `numeric(16,2)` | No | — | Value of grand total | Enable pricing, reconciliation or reporting | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | FK → `commerce.order_revisions` (fk_commerce_orders_revision_scope); key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | FK → `commerce.order_revisions` (fk_commerce_orders_revision_scope_numeric); key: review PK and unique rules below |
| `order_number` | `character varying(64)` | No | — | Inferred: stores order number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `other_charges_total` | `numeric(16,2)` | No | `0` | Value of other charges total | Enable pricing, reconciliation or reporting | See exact constraints |
| `patient_profile_id` | `uuid` | Yes | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` (fk_commerce_orders_patient_profile_id_patient_profiles) |
| `patient_profile_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` (fk_commerce_orders_patient_profile_id_patient_profiles_numeric); Numeric/public-key pair verification required |
| `payment_status` | `character varying(32)` | No | — | Inferred: stores payment status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `placed_at` | `timestamp with time zone` | No | `now()` | Time of placed | Support chronology, deadlines or audit evidence | See exact constraints |
| `prescription_status` | `character varying(32)` | No | — | Inferred: stores prescription status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `shipping_address_snapshot` | `jsonb` | No | — | Structured shipping address snapshot information | Retain a versioned payload or relevant details | See exact constraints |
| `shipping_total` | `numeric(16,2)` | No | `0` | Value of shipping total | Enable pricing, reconciliation or reporting | See exact constraints |
| `source_channel` | `character varying(32)` | No | `'app'::character varying` | Inferred: stores source channel for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `status` | `character varying(19)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `subtotal` | `numeric(16,2)` | No | — | Inferred: stores subtotal for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `tax_total` | `numeric(16,2)` | No | `0` | Value of tax total | Enable pricing, reconciliation or reporting | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_orders_updated_by_users) |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_orders_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the orders business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.orders` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_commerce_orders_user_id_users`; `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `created_by` → `identity.users(id)` via `fk_commerce_orders_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_commerce_orders_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `patient_profile_id` → `clinical.patient_profiles(id)` via `fk_commerce_orders_patient_profile_id_patient_profiles`; `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT`
- `checkout_id` → `commerce.checkouts(id)` via `fk_commerce_orders_checkout_id_checkouts`; `FOREIGN KEY (checkout_id) REFERENCES commerce.checkouts(id) ON DELETE RESTRICT`
- `current_revision_id, id` → `commerce.order_revisions(id, order_id)` via `fk_commerce_orders_revision_scope`; `FOREIGN KEY (current_revision_id, id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT`
- `checkout_id_internal_id` → `commerce.checkouts(internal_id)` via `fk_commerce_orders_checkout_id_checkouts_numeric`; `FOREIGN KEY (checkout_id_internal_id) REFERENCES commerce.checkouts(internal_id) ON DELETE RESTRICT`
- `patient_profile_id_internal_id` → `clinical.patient_profiles(internal_id)` via `fk_commerce_orders_patient_profile_id_patient_profiles_numeric`; `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT`
- `current_revision_id_internal_id, internal_id` → `commerce.order_revisions(internal_id, order_id_internal_id)` via `fk_commerce_orders_revision_scope_numeric`; `FOREIGN KEY (current_revision_id_internal_id, internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT`

**Referenced by 42 FK constraints** (sample): `commerce.order_groups`, `commerce.order_items`, `commerce.order_charges`, `commerce.order_discounts`, `commerce.order_status_history`, `commerce.cancellations`, `commerce.returns`, `finance.invoices`, `finance.settlement_items`, `fulfillment.fulfillment_orders`, `logistics.shipments`, `payment.payment_intents`.

## `commerce.orders` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 32 columns, 28 constraints, 11 indexes, 4 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_commerce_orders_user_id_users` |
| `created_by` | `identity.users` | `fk_commerce_orders_created_by_users` |
| `updated_by` | `identity.users` | `fk_commerce_orders_updated_by_users` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_commerce_orders_patient_profile_id_patient_profiles` |
| `checkout_id` | `commerce.checkouts` | `fk_commerce_orders_checkout_id_checkouts` |
| `current_revision_id`, `id` | `commerce.order_revisions` | `fk_commerce_orders_revision_scope` |
| `checkout_id_internal_id` | `commerce.checkouts` | `fk_commerce_orders_checkout_id_checkouts_numeric` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_commerce_orders_patient_profile_id_patient_profiles_numeric` |
| `current_revision_id_internal_id`, `internal_id` | `commerce.order_revisions` | `fk_commerce_orders_revision_scope_numeric` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_commerce_orders_payment_status` | `CREATE INDEX ix_commerce_orders_payment_status ON commerce.orders USING btree (payment_status)` |
| `ix_commerce_orders_status` | `CREATE INDEX ix_commerce_orders_status ON commerce.orders USING btree (status)` |
| `ix_commerce_orders_user_time` | `CREATE INDEX ix_commerce_orders_user_time ON commerce.orders USING btree (user_id, placed_at)` |
| `order_number` | `CREATE UNIQUE INDEX order_number ON commerce.orders USING btree (order_number)` |
| `pk_commerce_orders` | `CREATE UNIQUE INDEX pk_commerce_orders ON commerce.orders USING btree (internal_id)` |
| `uq_commerce_orders_checkout_present` | `CREATE UNIQUE INDEX uq_commerce_orders_checkout_present ON commerce.orders USING btree (checkout_id) WHERE checkout_id IS NOT NULL` |
| `uq_commerce_orders_id` | `CREATE UNIQUE INDEX uq_commerce_orders_id ON commerce.orders USING btree (id)` |
| `uq_commerce_orders_id_patient` | `CREATE UNIQUE INDEX uq_commerce_orders_id_patient ON commerce.orders USING btree (id, patient_profile_id)` |
| `uq_numeric_commerce_orders_internal_id_patient_profile__4a64` | `CREATE UNIQUE INDEX uq_numeric_commerce_orders_internal_id_patient_profile__4a64 ON commerce.orders USING btree (internal_id, patient_profile_id_internal_id)` |
| `uq_numeric_commerce_orders_internal_id_user_id` | `CREATE UNIQUE INDEX uq_numeric_commerce_orders_internal_id_user_id ON commerce.orders USING btree (internal_id, user_id)` |
| `uq_scope_commerce_orders_user_id` | `CREATE UNIQUE INDEX uq_scope_commerce_orders_user_id ON commerce.orders USING btree (id, user_id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["checkout_id","checkout_id_internal_id","commerce","checkouts"],["current_revision_id","current_revision_id_internal_id","commerce","order_revisions"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` |
| `order_patient_money_guard` | `CREATE TRIGGER order_patient_money_guard BEFORE UPDATE ON commerce.orders FOR EACH ROW EXECUTE FUNCTION commerce.guard_order_patient_and_money()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["checkout_id","checkout_id_internal_id","commerce","checkouts"],["current_revision_id","current_revision_id_internal_id","commerce","order_revisions"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
