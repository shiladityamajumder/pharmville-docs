# payment.payment_transactions

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds payment transactions records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 10 constraints, 5 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(16,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `payment_attempt_id` | `uuid` | Yes | — | Reference linking this record to payment attempts | Ensures related business data can be joined and validated | FK → `payment.payment_attempts` (fk_payment_payment_transactions_payment_attempt_id_paym_6565) |
| `payment_attempt_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.payment_attempts` (fk_payment_payment_transactions_payment_attempt_id_paym_969d); Numeric/public-key pair verification required |
| `payment_intent_id` | `uuid` | No | — | Reference linking this record to payment intents | Ensures related business data can be joined and validated | FK → `payment.payment_intents` (fk_payment_payment_transactions_payment_intent_id_payme_3fef) |
| `payment_intent_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.payment_intents` (fk_payment_payment_transactions_payment_intent_id_payme_02b1); Numeric/public-key pair verification required |
| `processed_at` | `timestamp with time zone` | Yes | — | Time of processed | Support chronology, deadlines or audit evidence | See exact constraints |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider_response` | `jsonb` | No | `'{}'::jsonb` | Structured provider response information | Retain a versioned payload or relevant details | See exact constraints |
| `provider_transaction_id` | `character varying(255)` | Yes | — | Identifier associated with provider transaction | Link the event or entity to its subject; verify constraints | See exact constraints |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `transaction_type` | `character varying(32)` | No | — | Inferred: stores transaction type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the payment transactions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.payment_transactions` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `payment_attempt_id` → `payment.payment_attempts(id)` via `fk_payment_payment_transactions_payment_attempt_id_paym_6565`; FOREIGN KEY (payment_attempt_id) REFERENCES payment.payment_attempts(id) ON DELETE SET NULL
- `payment_intent_id` → `payment.payment_intents(id)` via `fk_payment_payment_transactions_payment_intent_id_payme_3fef`; FOREIGN KEY (payment_intent_id) REFERENCES payment.payment_intents(id) ON DELETE RESTRICT
- `payment_attempt_id_internal_id` → `payment.payment_attempts(internal_id)` via `fk_payment_payment_transactions_payment_attempt_id_paym_969d`; FOREIGN KEY (payment_attempt_id_internal_id) REFERENCES payment.payment_attempts(internal_id) ON DELETE SET NULL
- `payment_intent_id_internal_id` → `payment.payment_intents(internal_id)` via `fk_payment_payment_transactions_payment_intent_id_payme_02b1`; FOREIGN KEY (payment_intent_id_internal_id) REFERENCES payment.payment_intents(internal_id) ON DELETE RESTRICT

**Referenced by 4 FK constraints** (sample): `payment.refunds`, `payment.chargebacks`, `payment.chargebacks`, `payment.refunds`.

## payment.payment_transactions — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 14 columns, 10 constraints, 5 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `payment_attempt_id` | `payment.payment_attempts` | `fk_payment_payment_transactions_payment_attempt_id_paym_6565` |
| `payment_intent_id` | `payment.payment_intents` | `fk_payment_payment_transactions_payment_intent_id_payme_3fef` |
| `payment_attempt_id_internal_id` | `payment.payment_attempts` | `fk_payment_payment_transactions_payment_attempt_id_paym_969d` |
| `payment_intent_id_internal_id` | `payment.payment_intents` | `fk_payment_payment_transactions_payment_intent_id_payme_02b1` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_payment_transactions_intent` | `CREATE INDEX ix_payment_transactions_intent ON payment.payment_transactions USING btree (payment_intent_id)` |
| `ix_payment_transactions_status` | `CREATE INDEX ix_payment_transactions_status ON payment.payment_transactions USING btree (status)` |
| `pk_payment_payment_transactions` | `CREATE UNIQUE INDEX pk_payment_payment_transactions ON payment.payment_transactions USING btree (internal_id)` |
| `uq_payment_payment_transactions_id` | `CREATE UNIQUE INDEX uq_payment_payment_transactions_id ON payment.payment_transactions USING btree (id)` |
| `uq_payment_transactions_provider_present` | `CREATE UNIQUE INDEX uq_payment_transactions_provider_present ON payment.payment_transactions USING btree (provider, provider_transaction_id) WHERE provider_transaction_id IS NOT NULL` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.payment_transactions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["payment_attempt_id","payment_attempt_id_internal_id","payment","payment_attempts"],["payment_intent_id","payment_intent_id_internal_id","payment","payment_intents"]]', 'internal_id', 'id')` |
| `transaction_append_only` | `CREATE TRIGGER transaction_append_only BEFORE DELETE OR UPDATE ON payment.payment_transactions FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `transaction_quote_guard` | `CREATE TRIGGER transaction_quote_guard BEFORE INSERT ON payment.payment_transactions FOR EACH ROW EXECUTE FUNCTION payment.guard_transaction_quote()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.payment_transactions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["payment_attempt_id","payment_attempt_id_internal_id","payment","payment_attempts"],["payment_intent_id","payment_intent_id_internal_id","payment","payment_intents"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
