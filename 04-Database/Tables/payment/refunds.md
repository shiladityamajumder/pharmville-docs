# `payment.refunds`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds refunds records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | payment.refunds |
| Classification | Transactional |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 23 columns; 26 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 9 indexes; 5 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(16,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_refunds_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `order_id` | `uuid` | No | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.orders` via `fk_payment_refunds_order_id_orders`; FK → `commerce.order_revisions` via `fk_payment_refunds_revision_scope` |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` via `fk_payment_refunds_order_id_orders_numeric`; FK → `commerce.order_revisions` via `fk_payment_refunds_revision_scope_numeric` |
| `order_revision_id` | `uuid` | Yes | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` via `fk_payment_refunds_revision_scope` |
| `order_revision_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_revisions` via `fk_payment_refunds_revision_scope_numeric` |
| `payment_transaction_id` | `uuid` | Yes | — | Reference linking this record to payment transactions | Ensures related business data can be joined and validated | FK → `payment.payment_transactions` via `fk_payment_refunds_payment_transaction_id_payment_transactions` |
| `payment_transaction_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.payment_transactions` via `fk_payment_refunds_payment_transaction_id_payment_trans_11c4` |
| `processed_at` | `timestamp with time zone` | Yes | — | Time of processed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `provider_refund_id` | `character varying(255)` | Yes | — | Identifier associated with provider refund | Link the event or entity to its subject; verify constraints | Collation: default |
| `reason_code` | `character varying(64)` | No | — | Reference linking this record to refund reason codes | Ensures related business data can be joined and validated | FK → `payment.refund_reason_codes` via `fk_payment_refunds_controlled_reason`; Collation: default |
| `reason_code_id` | `bigint` | Yes | — | Reference linking this record to refund reason codes | Ensures related business data can be joined and validated | FK → `payment.refund_reason_codes` via `fk_payment_refunds_controlled_reason` |
| `refund_number` | `character varying(64)` | No | — | Inferred: stores refund number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `return_id` | `uuid` | Yes | — | Reference linking this record to returns | Ensures related business data can be joined and validated | FK → `commerce.returns` via `fk_payment_refunds_return_id_returns` |
| `return_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.returns` via `fk_payment_refunds_return_id_returns_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_refunds_updated_by_users` |

## Record lifecycle and users

- **Created:** when the refunds business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.refunds` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_payment_refunds_controlled_reason | `reason_code_id, reason_code` | [`payment.refund_reason_codes`](../../Tables/payment/refund_reason_codes.md) | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES payment.refund_reason_codes(id, code) ON DELETE RESTRICT` |
| fk_payment_refunds_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_payment_refunds_order_id_orders | `order_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| fk_payment_refunds_order_id_orders_numeric | `order_id_internal_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| fk_payment_refunds_payment_transaction_id_payment_trans_11c4 | `payment_transaction_id_internal_id` | [`payment.payment_transactions`](../../Tables/payment/payment_transactions.md) | `FOREIGN KEY (payment_transaction_id_internal_id) REFERENCES payment.payment_transactions(internal_id) ON DELETE RESTRICT` |
| fk_payment_refunds_payment_transaction_id_payment_transactions | `payment_transaction_id` | [`payment.payment_transactions`](../../Tables/payment/payment_transactions.md) | `FOREIGN KEY (payment_transaction_id) REFERENCES payment.payment_transactions(id) ON DELETE RESTRICT` |
| fk_payment_refunds_return_id_returns | `return_id` | [`commerce.returns`](../../Tables/commerce/returns.md) | `FOREIGN KEY (return_id) REFERENCES commerce.returns(id) ON DELETE SET NULL` |
| fk_payment_refunds_return_id_returns_numeric | `return_id_internal_id` | [`commerce.returns`](../../Tables/commerce/returns.md) | `FOREIGN KEY (return_id_internal_id) REFERENCES commerce.returns(internal_id) ON DELETE SET NULL` |
| fk_payment_refunds_revision_scope | `order_revision_id, order_id` | [`commerce.order_revisions`](../../Tables/commerce/order_revisions.md) | `FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT` |
| fk_payment_refunds_revision_scope_numeric | `order_revision_id_internal_id, order_id_internal_id` | [`commerce.order_revisions`](../../Tables/commerce/order_revisions.md) | `FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| fk_payment_refunds_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`finance.credit_notes`](../../Tables/finance/credit_notes.md) | fk_finance_credit_notes_refund_id_refunds | `refund_id` | `id` |
| [`finance.credit_notes`](../../Tables/finance/credit_notes.md) | fk_finance_credit_notes_refund_id_refunds_numeric | `refund_id_internal_id` | `internal_id` |
| [`payment.refund_allocations`](../../Tables/payment/refund_allocations.md) | fk_payment_refund_allocations_refund_id_refunds | `refund_id` | `id` |
| [`payment.refund_allocations`](../../Tables/payment/refund_allocations.md) | fk_payment_refund_allocations_refund_id_refunds_numeric | `refund_id_internal_id` | `internal_id` |
| [`payment.refund_allocations`](../../Tables/payment/refund_allocations.md) | fk_payment_refund_allocations_revision | `refund_id, order_revision_id` | `id, order_revision_id` |
| [`payment.refund_allocations`](../../Tables/payment/refund_allocations.md) | fk_payment_refund_allocations_revision_numeric | `refund_id_internal_id, order_revision_id_internal_id` | `internal_id, order_revision_id_internal_id` |

## `payment.refunds` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `reason_code_id, reason_code` | `payment.refund_reason_codes` | `fk_payment_refunds_controlled_reason` |
| `created_by` | `identity.users` | `fk_payment_refunds_created_by_users` |
| `order_id` | `commerce.orders` | `fk_payment_refunds_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_payment_refunds_order_id_orders_numeric` |
| `payment_transaction_id_internal_id` | `payment.payment_transactions` | `fk_payment_refunds_payment_transaction_id_payment_trans_11c4` |
| `payment_transaction_id` | `payment.payment_transactions` | `fk_payment_refunds_payment_transaction_id_payment_transactions` |
| `return_id` | `commerce.returns` | `fk_payment_refunds_return_id_returns` |
| `return_id_internal_id` | `commerce.returns` | `fk_payment_refunds_return_id_returns_numeric` |
| `order_revision_id, order_id` | `commerce.order_revisions` | `fk_payment_refunds_revision_scope` |
| `order_revision_id_internal_id, order_id_internal_id` | `commerce.order_revisions` | `fk_payment_refunds_revision_scope_numeric` |
| `updated_by` | `identity.users` | `fk_payment_refunds_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_payment_refunds_amount_positive` | CHECK | `CHECK (amount > 0::numeric)` |
| `ck_payment_refunds_controlled_reason_pair` | CHECK | `CHECK (reason_code_id IS NULL OR reason_code IS NOT NULL)` |
| `ck_payment_refunds_finite_numeric_values` | CHECK | `CHECK (amount IS NULL OR (amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_payment_refunds_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_payment_refunds_numeric_pair_order_revision_id` | CHECK | `CHECK ((order_revision_id IS NULL) = (order_revision_id_internal_id IS NULL))` |
| `ck_payment_refunds_numeric_pair_payment_transaction_id` | CHECK | `CHECK ((payment_transaction_id IS NULL) = (payment_transaction_id_internal_id IS NULL))` |
| `ck_payment_refunds_numeric_pair_return_id` | CHECK | `CHECK ((return_id IS NULL) = (return_id_internal_id IS NULL))` |
| `ck_payment_refunds_refundstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['requested'::text, 'approved'::text, 'processing'::text, 'succeeded'::text, 'failed'::text, 'cancelled'::text]))` |
| `ck_payment_refunds_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_payment_refunds_controlled_reason` | FOREIGN KEY | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES payment.refund_reason_codes(id, code) ON DELETE RESTRICT` |
| `fk_payment_refunds_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_payment_refunds_order_id_orders` | FOREIGN KEY | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| `fk_payment_refunds_order_id_orders_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| `fk_payment_refunds_payment_transaction_id_payment_trans_11c4` | FOREIGN KEY | `FOREIGN KEY (payment_transaction_id_internal_id) REFERENCES payment.payment_transactions(internal_id) ON DELETE RESTRICT` |
| `fk_payment_refunds_payment_transaction_id_payment_transactions` | FOREIGN KEY | `FOREIGN KEY (payment_transaction_id) REFERENCES payment.payment_transactions(id) ON DELETE RESTRICT` |
| `fk_payment_refunds_return_id_returns` | FOREIGN KEY | `FOREIGN KEY (return_id) REFERENCES commerce.returns(id) ON DELETE SET NULL` |
| `fk_payment_refunds_return_id_returns_numeric` | FOREIGN KEY | `FOREIGN KEY (return_id_internal_id) REFERENCES commerce.returns(internal_id) ON DELETE SET NULL` |
| `fk_payment_refunds_revision_scope` | FOREIGN KEY | `FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT` |
| `fk_payment_refunds_revision_scope_numeric` | FOREIGN KEY | `FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| `fk_payment_refunds_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_payment_refunds` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `refund_idempotency` | UNIQUE | `UNIQUE (idempotency_key)` |
| `refund_number` | UNIQUE | `UNIQUE (refund_number)` |
| `uq_numeric_payment_refunds_internal_id_order_revision_i_f25b` | UNIQUE | `UNIQUE (internal_id, order_revision_id_internal_id)` |
| `uq_payment_refunds_id` | UNIQUE | `UNIQUE (id)` |
| `uq_payment_refunds_id_revision` | UNIQUE | `UNIQUE (id, order_revision_id)` |
| `refunds_amount_not_null` | NOT NULL | `NOT NULL amount` |
| `refunds_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `refunds_id_not_null` | NOT NULL | `NOT NULL id` |
| `refunds_idempotency_key_not_null` | NOT NULL | `NOT NULL idempotency_key` |
| `refunds_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `refunds_order_id_internal_id_not_null` | NOT NULL | `NOT NULL order_id_internal_id` |
| `refunds_order_id_not_null` | NOT NULL | `NOT NULL order_id` |
| `refunds_reason_code_not_null` | NOT NULL | `NOT NULL reason_code` |
| `refunds_refund_number_not_null` | NOT NULL | `NOT NULL refund_number` |
| `refunds_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `refunds_status_not_null` | NOT NULL | `NOT NULL status` |
| `refunds_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_payment_refunds_order` | btree | `(order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_refunds_order ON payment.refunds USING btree (order_id)` |
| `ix_payment_refunds_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_refunds_status ON payment.refunds USING btree (status)` |
| `ix_payment_refunds_transaction` | btree | `(payment_transaction_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_refunds_transaction ON payment.refunds USING btree (payment_transaction_id)` |
| `pk_payment_refunds` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_payment_refunds ON payment.refunds USING btree (internal_id)` |
| `refund_idempotency` | btree | `(idempotency_key)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX refund_idempotency ON payment.refunds USING btree (idempotency_key)` |
| `refund_number` | btree | `(refund_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX refund_number ON payment.refunds USING btree (refund_number)` |
| `uq_numeric_payment_refunds_internal_id_order_revision_i_f25b` | btree | `(internal_id, order_revision_id_internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_numeric_payment_refunds_internal_id_order_revision_i_f25b ON payment.refunds USING btree (internal_id, order_revision_id_internal_id)` |
| `uq_payment_refunds_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_payment_refunds_id ON payment.refunds USING btree (id)` |
| `uq_payment_refunds_id_revision` | btree | `(id, order_revision_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_payment_refunds_id_revision ON payment.refunds USING btree (id, order_revision_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.refunds FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["payment_transaction_id","payment_transaction_id_internal_id","payment","payment_transactions"],["return_id","return_id_internal_id","commerce","returns"]]', 'internal_id', 'id')` | O |
| `controlled_reason` | `CREATE TRIGGER controlled_reason BEFORE INSERT OR UPDATE ON payment.refunds FOR EACH ROW EXECUTE FUNCTION platform.normalize_reason('payment.refund_reason_codes')` | O |
| `refund_guard` | `CREATE TRIGGER refund_guard BEFORE INSERT OR UPDATE ON payment.refunds FOR EACH ROW EXECUTE FUNCTION payment.guard_refund()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.refunds FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.refunds FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["payment_transaction_id","payment_transaction_id_internal_id","payment","payment_transactions"],["return_id","return_id_internal_id","commerce","returns"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
