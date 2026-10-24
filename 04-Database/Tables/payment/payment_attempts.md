# `payment.payment_attempts`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds payment attempts records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | payment.payment_attempts |
| Classification | Transactional |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 18 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(16,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `attempt_number` | `integer` | No | — | Inferred: stores attempt number for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `completed_at` | `timestamp with time zone` | Yes | — | Time of completed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_payment_attempts_created_by_users` |
| `failure_code` | `character varying(128)` | Yes | — | Code for failure | Link to controlled business classification or an external reference | Collation: default |
| `failure_message` | `text` | Yes | — | Inferred: stores failure message for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `initiated_at` | `timestamp with time zone` | No | `now()` | Time of initiated | Support chronology, deadlines or audit evidence | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `payment_intent_id` | `uuid` | No | — | Reference linking this record to payment intents | Ensures related business data can be joined and validated | FK → `payment.payment_intents` via `fk_payment_payment_attempts_payment_intent_id_payment_intents` |
| `payment_intent_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.payment_intents` via `fk_payment_payment_attempts_payment_intent_id_payment_i_7c0e` |
| `provider_reference` | `character varying(255)` | Yes | — | Inferred: stores provider reference for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider_response` | `jsonb` | No | `'{}'::jsonb` | Structured provider response information | Retain a versioned payload or relevant details | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_payment_attempts_updated_by_users` |

## Record lifecycle and users

- **Created:** when the payment attempts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.payment_attempts` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_payment_payment_attempts_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_payment_payment_attempts_payment_intent_id_payment_i_7c0e | `payment_intent_id_internal_id` | [`payment.payment_intents`](../../Tables/payment/payment_intents.md) | `FOREIGN KEY (payment_intent_id_internal_id) REFERENCES payment.payment_intents(internal_id) ON DELETE CASCADE` |
| fk_payment_payment_attempts_payment_intent_id_payment_intents | `payment_intent_id` | [`payment.payment_intents`](../../Tables/payment/payment_intents.md) | `FOREIGN KEY (payment_intent_id) REFERENCES payment.payment_intents(id) ON DELETE CASCADE` |
| fk_payment_payment_attempts_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`payment.payment_transactions`](../../Tables/payment/payment_transactions.md) | fk_payment_payment_transactions_payment_attempt_id_paym_6565 | `payment_attempt_id` | `id` |
| [`payment.payment_transactions`](../../Tables/payment/payment_transactions.md) | fk_payment_payment_transactions_payment_attempt_id_paym_969d | `payment_attempt_id_internal_id` | `internal_id` |

## `payment.payment_attempts` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_payment_payment_attempts_created_by_users` |
| `payment_intent_id_internal_id` | `payment.payment_intents` | `fk_payment_payment_attempts_payment_intent_id_payment_i_7c0e` |
| `payment_intent_id` | `payment.payment_intents` | `fk_payment_payment_attempts_payment_intent_id_payment_intents` |
| `updated_by` | `identity.users` | `fk_payment_payment_attempts_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_payment_payment_attempts_amount_positive` | CHECK | `CHECK (amount > 0::numeric)` |
| `ck_payment_payment_attempts_attempt_number_positive` | CHECK | `CHECK (attempt_number > 0)` |
| `ck_payment_payment_attempts_finite_numeric_values` | CHECK | `CHECK (amount IS NULL OR (amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_payment_payment_attempts_numeric_pair_payment_intent_id` | CHECK | `CHECK ((payment_intent_id IS NULL) = (payment_intent_id_internal_id IS NULL))` |
| `ck_payment_payment_attempts_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_payment_payment_attempts_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_payment_payment_attempts_payment_intent_id_payment_i_7c0e` | FOREIGN KEY | `FOREIGN KEY (payment_intent_id_internal_id) REFERENCES payment.payment_intents(internal_id) ON DELETE CASCADE` |
| `fk_payment_payment_attempts_payment_intent_id_payment_intents` | FOREIGN KEY | `FOREIGN KEY (payment_intent_id) REFERENCES payment.payment_intents(id) ON DELETE CASCADE` |
| `fk_payment_payment_attempts_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `payment_attempt_number` | UNIQUE | `UNIQUE (payment_intent_id, attempt_number)` |
| `pk_payment_payment_attempts` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_payment_payment_attempts_id` | UNIQUE | `UNIQUE (id)` |
| `payment_attempts_amount_not_null` | NOT NULL | `NOT NULL amount` |
| `payment_attempts_attempt_number_not_null` | NOT NULL | `NOT NULL attempt_number` |
| `payment_attempts_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `payment_attempts_id_not_null` | NOT NULL | `NOT NULL id` |
| `payment_attempts_initiated_at_not_null` | NOT NULL | `NOT NULL initiated_at` |
| `payment_attempts_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `payment_attempts_payment_intent_id_internal_id_not_null` | NOT NULL | `NOT NULL payment_intent_id_internal_id` |
| `payment_attempts_payment_intent_id_not_null` | NOT NULL | `NOT NULL payment_intent_id` |
| `payment_attempts_provider_response_not_null` | NOT NULL | `NOT NULL provider_response` |
| `payment_attempts_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `payment_attempts_status_not_null` | NOT NULL | `NOT NULL status` |
| `payment_attempts_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_payment_attempts_intent` | btree | `(payment_intent_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_attempts_intent ON payment.payment_attempts USING btree (payment_intent_id)` |
| `ix_payment_attempts_provider_reference` | btree | `(provider_reference)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_attempts_provider_reference ON payment.payment_attempts USING btree (provider_reference)` |
| `payment_attempt_number` | btree | `(payment_intent_id, attempt_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX payment_attempt_number ON payment.payment_attempts USING btree (payment_intent_id, attempt_number)` |
| `pk_payment_payment_attempts` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_payment_payment_attempts ON payment.payment_attempts USING btree (internal_id)` |
| `uq_payment_payment_attempts_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_payment_payment_attempts_id ON payment.payment_attempts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.payment_attempts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["payment_intent_id","payment_intent_id_internal_id","payment","payment_intents"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.payment_attempts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.payment_attempts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["payment_intent_id","payment_intent_id_internal_id","payment","payment_intents"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
