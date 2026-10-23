# payment.refunds

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds refunds records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 23 columns, 26 constraints, 9 indexes, 5 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(16,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_refunds_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `order_id` | `uuid` | No | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` (fk_payment_refunds_revision_scope); FK → `commerce.orders` (fk_payment_refunds_order_id_orders) |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` (fk_payment_refunds_order_id_orders_numeric); FK → `commerce.order_revisions` (fk_payment_refunds_revision_scope_numeric); Numeric/public-key pair verification required |
| `order_revision_id` | `uuid` | Yes | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` (fk_payment_refunds_revision_scope) |
| `order_revision_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_revisions` (fk_payment_refunds_revision_scope_numeric); Numeric/public-key pair verification required |
| `payment_transaction_id` | `uuid` | Yes | — | Reference linking this record to payment transactions | Ensures related business data can be joined and validated | FK → `payment.payment_transactions` (fk_payment_refunds_payment_transaction_id_payment_transactions) |
| `payment_transaction_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.payment_transactions` (fk_payment_refunds_payment_transaction_id_payment_trans_11c4); Numeric/public-key pair verification required |
| `processed_at` | `timestamp with time zone` | Yes | — | Time of processed | Support chronology, deadlines or audit evidence | See exact constraints |
| `provider_refund_id` | `character varying(255)` | Yes | — | Identifier associated with provider refund | Link the event or entity to its subject; verify constraints | See exact constraints |
| `reason_code` | `character varying(64)` | No | — | Reference linking this record to refund reason codes | Ensures related business data can be joined and validated | FK → `payment.refund_reason_codes` (fk_payment_refunds_controlled_reason) |
| `reason_code_id` | `bigint` | Yes | — | Reference linking this record to refund reason codes | Ensures related business data can be joined and validated | FK → `payment.refund_reason_codes` (fk_payment_refunds_controlled_reason) |
| `refund_number` | `character varying(64)` | No | — | Inferred: stores refund number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `return_id` | `uuid` | Yes | — | Reference linking this record to returns | Ensures related business data can be joined and validated | FK → `commerce.returns` (fk_payment_refunds_return_id_returns) |
| `return_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.returns` (fk_payment_refunds_return_id_returns_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_refunds_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the refunds business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.refunds` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `reason_code_id, reason_code` → `payment.refund_reason_codes(id, code)` via `fk_payment_refunds_controlled_reason`; FOREIGN KEY (reason_code_id, reason_code) REFERENCES payment.refund_reason_codes(id, code) ON DELETE RESTRICT
- `created_by` → `identity.users(id)` via `fk_payment_refunds_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_payment_refunds_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `return_id` → `commerce.returns(id)` via `fk_payment_refunds_return_id_returns`; FOREIGN KEY (return_id) REFERENCES commerce.returns(id) ON DELETE SET NULL
- `payment_transaction_id` → `payment.payment_transactions(id)` via `fk_payment_refunds_payment_transaction_id_payment_transactions`; FOREIGN KEY (payment_transaction_id) REFERENCES payment.payment_transactions(id) ON DELETE RESTRICT
- `order_revision_id, order_id` → `commerce.order_revisions(id, order_id)` via `fk_payment_refunds_revision_scope`; FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT
- `order_id` → `commerce.orders(id)` via `fk_payment_refunds_order_id_orders`; FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT
- `order_id_internal_id` → `commerce.orders(internal_id)` via `fk_payment_refunds_order_id_orders_numeric`; FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT
- `payment_transaction_id_internal_id` → `payment.payment_transactions(internal_id)` via `fk_payment_refunds_payment_transaction_id_payment_trans_11c4`; FOREIGN KEY (payment_transaction_id_internal_id) REFERENCES payment.payment_transactions(internal_id) ON DELETE RESTRICT
- `return_id_internal_id` → `commerce.returns(internal_id)` via `fk_payment_refunds_return_id_returns_numeric`; FOREIGN KEY (return_id_internal_id) REFERENCES commerce.returns(internal_id) ON DELETE SET NULL
- `order_revision_id_internal_id, order_id_internal_id` → `commerce.order_revisions(internal_id, order_id_internal_id)` via `fk_payment_refunds_revision_scope_numeric`; FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT

**Referenced by 6 FK constraints** (sample): `finance.credit_notes`, `payment.refund_allocations`, `payment.refund_allocations`, `finance.credit_notes`, `payment.refund_allocations`, `payment.refund_allocations`.

## payment.refunds — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 23 columns, 26 constraints, 9 indexes, 5 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `reason_code_id`, `reason_code` | `payment.refund_reason_codes` | `fk_payment_refunds_controlled_reason` |
| `created_by` | `identity.users` | `fk_payment_refunds_created_by_users` |
| `updated_by` | `identity.users` | `fk_payment_refunds_updated_by_users` |
| `return_id` | `commerce.returns` | `fk_payment_refunds_return_id_returns` |
| `payment_transaction_id` | `payment.payment_transactions` | `fk_payment_refunds_payment_transaction_id_payment_transactions` |
| `order_revision_id`, `order_id` | `commerce.order_revisions` | `fk_payment_refunds_revision_scope` |
| `order_id` | `commerce.orders` | `fk_payment_refunds_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_payment_refunds_order_id_orders_numeric` |
| `payment_transaction_id_internal_id` | `payment.payment_transactions` | `fk_payment_refunds_payment_transaction_id_payment_trans_11c4` |
| `return_id_internal_id` | `commerce.returns` | `fk_payment_refunds_return_id_returns_numeric` |
| `order_revision_id_internal_id`, `order_id_internal_id` | `commerce.order_revisions` | `fk_payment_refunds_revision_scope_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_payment_refunds_order` | `CREATE INDEX ix_payment_refunds_order ON payment.refunds USING btree (order_id)` |
| `ix_payment_refunds_status` | `CREATE INDEX ix_payment_refunds_status ON payment.refunds USING btree (status)` |
| `ix_payment_refunds_transaction` | `CREATE INDEX ix_payment_refunds_transaction ON payment.refunds USING btree (payment_transaction_id)` |
| `pk_payment_refunds` | `CREATE UNIQUE INDEX pk_payment_refunds ON payment.refunds USING btree (internal_id)` |
| `refund_idempotency` | `CREATE UNIQUE INDEX refund_idempotency ON payment.refunds USING btree (idempotency_key)` |
| `refund_number` | `CREATE UNIQUE INDEX refund_number ON payment.refunds USING btree (refund_number)` |
| `uq_numeric_payment_refunds_internal_id_order_revision_i_f25b` | `CREATE UNIQUE INDEX uq_numeric_payment_refunds_internal_id_order_revision_i_f25b ON payment.refunds USING btree (internal_id, order_revision_id_internal_id)` |
| `uq_payment_refunds_id` | `CREATE UNIQUE INDEX uq_payment_refunds_id ON payment.refunds USING btree (id)` |
| `uq_payment_refunds_id_revision` | `CREATE UNIQUE INDEX uq_payment_refunds_id_revision ON payment.refunds USING btree (id, order_revision_id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.refunds FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["payment_transaction_id","payment_transaction_id_internal_id","payment","payment_transactions"],["return_id","return_id_internal_id","commerce","returns"]]', 'internal_id', 'id')` |
| `controlled_reason` | `CREATE TRIGGER controlled_reason BEFORE INSERT OR UPDATE ON payment.refunds FOR EACH ROW EXECUTE FUNCTION platform.normalize_reason('payment.refund_reason_codes')` |
| `refund_guard` | `CREATE TRIGGER refund_guard BEFORE INSERT OR UPDATE ON payment.refunds FOR EACH ROW EXECUTE FUNCTION payment.guard_refund()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.refunds FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.refunds FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["payment_transaction_id","payment_transaction_id_internal_id","payment","payment_transactions"],["return_id","return_id_internal_id","commerce","returns"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
