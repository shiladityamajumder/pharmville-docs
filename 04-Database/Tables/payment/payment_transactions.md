# `payment.payment_transactions`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds payment transactions records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | payment.payment_transactions |
| Classification | Transactional |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 10 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(16,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `payment_attempt_id` | `uuid` | Yes | — | Reference linking this record to payment attempts | Ensures related business data can be joined and validated | FK → `payment.payment_attempts` via `fk_payment_payment_transactions_payment_attempt_id_paym_6565` |
| `payment_attempt_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.payment_attempts` via `fk_payment_payment_transactions_payment_attempt_id_paym_969d` |
| `payment_intent_id` | `uuid` | No | — | Reference linking this record to payment intents | Ensures related business data can be joined and validated | FK → `payment.payment_intents` via `fk_payment_payment_transactions_payment_intent_id_payme_3fef` |
| `payment_intent_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.payment_intents` via `fk_payment_payment_transactions_payment_intent_id_payme_02b1` |
| `processed_at` | `timestamp with time zone` | Yes | — | Time of processed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider_response` | `jsonb` | No | `'{}'::jsonb` | Structured provider response information | Retain a versioned payload or relevant details | Exact constraints below |
| `provider_transaction_id` | `character varying(255)` | Yes | — | Identifier associated with provider transaction | Link the event or entity to its subject; verify constraints | Collation: default |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `transaction_type` | `character varying(32)` | No | — | Inferred: stores transaction type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the payment transactions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.payment_transactions` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_payment_payment_transactions_payment_attempt_id_paym_6565 | `payment_attempt_id` | [`payment.payment_attempts`](../../Tables/payment/payment_attempts.md) | `FOREIGN KEY (payment_attempt_id) REFERENCES payment.payment_attempts(id) ON DELETE SET NULL` |
| fk_payment_payment_transactions_payment_attempt_id_paym_969d | `payment_attempt_id_internal_id` | [`payment.payment_attempts`](../../Tables/payment/payment_attempts.md) | `FOREIGN KEY (payment_attempt_id_internal_id) REFERENCES payment.payment_attempts(internal_id) ON DELETE SET NULL` |
| fk_payment_payment_transactions_payment_intent_id_payme_02b1 | `payment_intent_id_internal_id` | [`payment.payment_intents`](../../Tables/payment/payment_intents.md) | `FOREIGN KEY (payment_intent_id_internal_id) REFERENCES payment.payment_intents(internal_id) ON DELETE RESTRICT` |
| fk_payment_payment_transactions_payment_intent_id_payme_3fef | `payment_intent_id` | [`payment.payment_intents`](../../Tables/payment/payment_intents.md) | `FOREIGN KEY (payment_intent_id) REFERENCES payment.payment_intents(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`payment.chargebacks`](../../Tables/payment/chargebacks.md) | fk_payment_chargebacks_payment_transaction_id_payment_t_0492 | `payment_transaction_id_internal_id` | `internal_id` |
| [`payment.chargebacks`](../../Tables/payment/chargebacks.md) | fk_payment_chargebacks_payment_transaction_id_payment_t_d77b | `payment_transaction_id` | `id` |
| [`payment.refunds`](../../Tables/payment/refunds.md) | fk_payment_refunds_payment_transaction_id_payment_trans_11c4 | `payment_transaction_id_internal_id` | `internal_id` |
| [`payment.refunds`](../../Tables/payment/refunds.md) | fk_payment_refunds_payment_transaction_id_payment_transactions | `payment_transaction_id` | `id` |

## `payment.payment_transactions` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `payment_attempt_id` | `payment.payment_attempts` | `fk_payment_payment_transactions_payment_attempt_id_paym_6565` |
| `payment_attempt_id_internal_id` | `payment.payment_attempts` | `fk_payment_payment_transactions_payment_attempt_id_paym_969d` |
| `payment_intent_id_internal_id` | `payment.payment_intents` | `fk_payment_payment_transactions_payment_intent_id_payme_02b1` |
| `payment_intent_id` | `payment.payment_intents` | `fk_payment_payment_transactions_payment_intent_id_payme_3fef` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_payment_payment_transactions_amount_positive` | CHECK | `CHECK (amount > 0::numeric)` |
| `ck_payment_payment_transactions_finite_numeric_values` | CHECK | `CHECK (amount IS NULL OR (amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_payment_payment_transactions_numeric_pair_payment_attempt_id` | CHECK | `CHECK ((payment_attempt_id IS NULL) = (payment_attempt_id_internal_id IS NULL))` |
| `ck_payment_payment_transactions_numeric_pair_payment_intent_id` | CHECK | `CHECK ((payment_intent_id IS NULL) = (payment_intent_id_internal_id IS NULL))` |
| `fk_payment_payment_transactions_payment_attempt_id_paym_6565` | FOREIGN KEY | `FOREIGN KEY (payment_attempt_id) REFERENCES payment.payment_attempts(id) ON DELETE SET NULL` |
| `fk_payment_payment_transactions_payment_attempt_id_paym_969d` | FOREIGN KEY | `FOREIGN KEY (payment_attempt_id_internal_id) REFERENCES payment.payment_attempts(internal_id) ON DELETE SET NULL` |
| `fk_payment_payment_transactions_payment_intent_id_payme_02b1` | FOREIGN KEY | `FOREIGN KEY (payment_intent_id_internal_id) REFERENCES payment.payment_intents(internal_id) ON DELETE RESTRICT` |
| `fk_payment_payment_transactions_payment_intent_id_payme_3fef` | FOREIGN KEY | `FOREIGN KEY (payment_intent_id) REFERENCES payment.payment_intents(id) ON DELETE RESTRICT` |
| `pk_payment_payment_transactions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_payment_payment_transactions_id` | UNIQUE | `UNIQUE (id)` |
| `payment_transactions_amount_not_null` | NOT NULL | `NOT NULL amount` |
| `payment_transactions_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `payment_transactions_id_not_null` | NOT NULL | `NOT NULL id` |
| `payment_transactions_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `payment_transactions_payment_intent_id_internal_id_not_null` | NOT NULL | `NOT NULL payment_intent_id_internal_id` |
| `payment_transactions_payment_intent_id_not_null` | NOT NULL | `NOT NULL payment_intent_id` |
| `payment_transactions_provider_not_null` | NOT NULL | `NOT NULL provider` |
| `payment_transactions_provider_response_not_null` | NOT NULL | `NOT NULL provider_response` |
| `payment_transactions_status_not_null` | NOT NULL | `NOT NULL status` |
| `payment_transactions_transaction_type_not_null` | NOT NULL | `NOT NULL transaction_type` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_payment_transactions_intent` | btree | `(payment_intent_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_transactions_intent ON payment.payment_transactions USING btree (payment_intent_id)` |
| `ix_payment_transactions_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_transactions_status ON payment.payment_transactions USING btree (status)` |
| `pk_payment_payment_transactions` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_payment_payment_transactions ON payment.payment_transactions USING btree (internal_id)` |
| `uq_payment_payment_transactions_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_payment_payment_transactions_id ON payment.payment_transactions USING btree (id)` |
| `uq_payment_transactions_provider_present` | btree | `(provider, provider_transaction_id)` | provider_transaction_id IS NOT NULL | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_payment_transactions_provider_present ON payment.payment_transactions USING btree (provider, provider_transaction_id) WHERE provider_transaction_id IS NOT NULL` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.payment_transactions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["payment_attempt_id","payment_attempt_id_internal_id","payment","payment_attempts"],["payment_intent_id","payment_intent_id_internal_id","payment","payment_intents"]]', 'internal_id', 'id')` | O |
| `transaction_append_only` | `CREATE TRIGGER transaction_append_only BEFORE DELETE OR UPDATE ON payment.payment_transactions FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `transaction_quote_guard` | `CREATE TRIGGER transaction_quote_guard BEFORE INSERT ON payment.payment_transactions FOR EACH ROW EXECUTE FUNCTION payment.guard_transaction_quote()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.payment_transactions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["payment_attempt_id","payment_attempt_id_internal_id","payment","payment_attempts"],["payment_intent_id","payment_intent_id_internal_id","payment","payment_intents"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
