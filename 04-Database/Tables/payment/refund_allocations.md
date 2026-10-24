# `payment.refund_allocations`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds refund allocations records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | payment.refund_allocations |
| Classification | Transactional |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 13 columns; 17 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 5 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(16,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `order_item_id` | `uuid` | No | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` via `fk_payment_refund_allocations_order_item_id_order_items` |
| `order_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` via `fk_payment_refund_allocations_order_item_id_order_items_numeric` |
| `order_revision_id` | `uuid` | Yes | — | Reference linking this record to refunds | Ensures related business data can be joined and validated | FK → `payment.refunds` via `fk_payment_refund_allocations_revision` |
| `order_revision_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.refunds` via `fk_payment_refund_allocations_revision_numeric` |
| `quantity` | `numeric(12,3)` | Yes | — | Quantity value | Track resource or item amounts accurately | Exact constraints below |
| `reason_code` | `character varying(64)` | No | — | Reference linking this record to refund reason codes | Ensures related business data can be joined and validated | FK → `payment.refund_reason_codes` via `fk_payment_refund_allocations_controlled_reason`; Collation: default |
| `reason_code_id` | `bigint` | Yes | — | Reference linking this record to refund reason codes | Ensures related business data can be joined and validated | FK → `payment.refund_reason_codes` via `fk_payment_refund_allocations_controlled_reason` |
| `refund_id` | `uuid` | No | — | Reference linking this record to refunds | Ensures related business data can be joined and validated | FK → `payment.refunds` via `fk_payment_refund_allocations_refund_id_refunds`; FK → `payment.refunds` via `fk_payment_refund_allocations_revision` |
| `refund_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.refunds` via `fk_payment_refund_allocations_refund_id_refunds_numeric`; FK → `payment.refunds` via `fk_payment_refund_allocations_revision_numeric` |

## Record lifecycle and users

- **Created:** when the refund allocations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.refund_allocations` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_payment_refund_allocations_controlled_reason | `reason_code_id, reason_code` | [`payment.refund_reason_codes`](../../Tables/payment/refund_reason_codes.md) | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES payment.refund_reason_codes(id, code) ON DELETE RESTRICT` |
| fk_payment_refund_allocations_order_item_id_order_items | `order_item_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT` |
| fk_payment_refund_allocations_order_item_id_order_items_numeric | `order_item_id_internal_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT` |
| fk_payment_refund_allocations_refund_id_refunds | `refund_id` | [`payment.refunds`](../../Tables/payment/refunds.md) | `FOREIGN KEY (refund_id) REFERENCES payment.refunds(id) ON DELETE RESTRICT` |
| fk_payment_refund_allocations_refund_id_refunds_numeric | `refund_id_internal_id` | [`payment.refunds`](../../Tables/payment/refunds.md) | `FOREIGN KEY (refund_id_internal_id) REFERENCES payment.refunds(internal_id) ON DELETE RESTRICT` |
| fk_payment_refund_allocations_revision | `refund_id, order_revision_id` | [`payment.refunds`](../../Tables/payment/refunds.md) | `FOREIGN KEY (refund_id, order_revision_id) REFERENCES payment.refunds(id, order_revision_id) ON DELETE RESTRICT` |
| fk_payment_refund_allocations_revision_numeric | `refund_id_internal_id, order_revision_id_internal_id` | [`payment.refunds`](../../Tables/payment/refunds.md) | `FOREIGN KEY (refund_id_internal_id, order_revision_id_internal_id) REFERENCES payment.refunds(internal_id, order_revision_id_internal_id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `payment.refund_allocations` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `reason_code_id, reason_code` | `payment.refund_reason_codes` | `fk_payment_refund_allocations_controlled_reason` |
| `order_item_id` | `commerce.order_items` | `fk_payment_refund_allocations_order_item_id_order_items` |
| `order_item_id_internal_id` | `commerce.order_items` | `fk_payment_refund_allocations_order_item_id_order_items_numeric` |
| `refund_id` | `payment.refunds` | `fk_payment_refund_allocations_refund_id_refunds` |
| `refund_id_internal_id` | `payment.refunds` | `fk_payment_refund_allocations_refund_id_refunds_numeric` |
| `refund_id, order_revision_id` | `payment.refunds` | `fk_payment_refund_allocations_revision` |
| `refund_id_internal_id, order_revision_id_internal_id` | `payment.refunds` | `fk_payment_refund_allocations_revision_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_payment_refund_allocations_amount_positive` | CHECK | `CHECK (amount > 0::numeric)` |
| `ck_payment_refund_allocations_controlled_reason_pair` | CHECK | `CHECK (reason_code_id IS NULL OR reason_code IS NOT NULL)` |
| `ck_payment_refund_allocations_finite_numeric_values` | CHECK | `CHECK ((amount IS NULL OR (amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (quantity IS NULL OR (quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_payment_refund_allocations_numeric_pair_order_item_id` | CHECK | `CHECK ((order_item_id IS NULL) = (order_item_id_internal_id IS NULL))` |
| `ck_payment_refund_allocations_numeric_pair_order_revision_id` | CHECK | `CHECK ((order_revision_id IS NULL) = (order_revision_id_internal_id IS NULL))` |
| `ck_payment_refund_allocations_numeric_pair_refund_id` | CHECK | `CHECK ((refund_id IS NULL) = (refund_id_internal_id IS NULL))` |
| `ck_payment_refund_allocations_quantity_positive` | CHECK | `CHECK (quantity IS NULL OR quantity > 0::numeric)` |
| `fk_payment_refund_allocations_controlled_reason` | FOREIGN KEY | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES payment.refund_reason_codes(id, code) ON DELETE RESTRICT` |
| `fk_payment_refund_allocations_order_item_id_order_items` | FOREIGN KEY | `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT` |
| `fk_payment_refund_allocations_order_item_id_order_items_numeric` | FOREIGN KEY | `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT` |
| `fk_payment_refund_allocations_refund_id_refunds` | FOREIGN KEY | `FOREIGN KEY (refund_id) REFERENCES payment.refunds(id) ON DELETE RESTRICT` |
| `fk_payment_refund_allocations_refund_id_refunds_numeric` | FOREIGN KEY | `FOREIGN KEY (refund_id_internal_id) REFERENCES payment.refunds(internal_id) ON DELETE RESTRICT` |
| `fk_payment_refund_allocations_revision` | FOREIGN KEY | `FOREIGN KEY (refund_id, order_revision_id) REFERENCES payment.refunds(id, order_revision_id) ON DELETE RESTRICT` |
| `fk_payment_refund_allocations_revision_numeric` | FOREIGN KEY | `FOREIGN KEY (refund_id_internal_id, order_revision_id_internal_id) REFERENCES payment.refunds(internal_id, order_revision_id_internal_id) ON DELETE RESTRICT` |
| `pk_payment_refund_allocations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_payment_refund_allocations_id` | UNIQUE | `UNIQUE (id)` |
| `uq_payment_refund_allocations_item` | UNIQUE | `UNIQUE (refund_id, order_item_id)` |
| `refund_allocations_amount_not_null` | NOT NULL | `NOT NULL amount` |
| `refund_allocations_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `refund_allocations_id_not_null` | NOT NULL | `NOT NULL id` |
| `refund_allocations_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `refund_allocations_order_item_id_internal_id_not_null` | NOT NULL | `NOT NULL order_item_id_internal_id` |
| `refund_allocations_order_item_id_not_null` | NOT NULL | `NOT NULL order_item_id` |
| `refund_allocations_reason_code_not_null` | NOT NULL | `NOT NULL reason_code` |
| `refund_allocations_refund_id_internal_id_not_null` | NOT NULL | `NOT NULL refund_id_internal_id` |
| `refund_allocations_refund_id_not_null` | NOT NULL | `NOT NULL refund_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_payment_refund_allocations_item` | btree | `(order_item_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_refund_allocations_item ON payment.refund_allocations USING btree (order_item_id)` |
| `pk_payment_refund_allocations` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_payment_refund_allocations ON payment.refund_allocations USING btree (internal_id)` |
| `uq_payment_refund_allocations_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_payment_refund_allocations_id ON payment.refund_allocations USING btree (id)` |
| `uq_payment_refund_allocations_item` | btree | `(refund_id, order_item_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_payment_refund_allocations_item ON payment.refund_allocations USING btree (refund_id, order_item_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.refund_allocations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_item_id","order_item_id_internal_id","commerce","order_items"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["refund_id","refund_id_internal_id","payment","refunds"]]', 'internal_id', 'id')` | O |
| `controlled_reason` | `CREATE TRIGGER controlled_reason BEFORE INSERT OR UPDATE ON payment.refund_allocations FOR EACH ROW EXECUTE FUNCTION platform.normalize_reason('payment.refund_reason_codes')` | O |
| `refund_allocation_append_only` | `CREATE TRIGGER refund_allocation_append_only BEFORE DELETE OR UPDATE ON payment.refund_allocations FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `refund_allocation_guard` | `CREATE TRIGGER refund_allocation_guard BEFORE INSERT ON payment.refund_allocations FOR EACH ROW EXECUTE FUNCTION payment.guard_refund_allocation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.refund_allocations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_item_id","order_item_id_internal_id","commerce","order_items"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["refund_id","refund_id_internal_id","payment","refunds"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
