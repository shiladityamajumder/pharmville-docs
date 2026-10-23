# payment.payment_attempts

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds payment attempts records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 18 columns, 12 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(16,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `attempt_number` | `integer` | No | — | Inferred: stores attempt number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `completed_at` | `timestamp with time zone` | Yes | — | Time of completed | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_payment_attempts_created_by_users) |
| `failure_code` | `character varying(128)` | Yes | — | Code for failure | Link to controlled business classification or an external reference | See exact constraints |
| `failure_message` | `text` | Yes | — | Inferred: stores failure message for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `initiated_at` | `timestamp with time zone` | No | `now()` | Time of initiated | Support chronology, deadlines or audit evidence | See exact constraints |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `payment_intent_id` | `uuid` | No | — | Reference linking this record to payment intents | Ensures related business data can be joined and validated | FK → `payment.payment_intents` (fk_payment_payment_attempts_payment_intent_id_payment_intents) |
| `payment_intent_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.payment_intents` (fk_payment_payment_attempts_payment_intent_id_payment_i_7c0e); Numeric/public-key pair verification required |
| `provider_reference` | `character varying(255)` | Yes | — | Inferred: stores provider reference for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider_response` | `jsonb` | No | `'{}'::jsonb` | Structured provider response information | Retain a versioned payload or relevant details | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_payment_attempts_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the payment attempts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.payment_attempts` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_payment_payment_attempts_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_payment_payment_attempts_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `payment_intent_id` → `payment.payment_intents(id)` via `fk_payment_payment_attempts_payment_intent_id_payment_intents`; FOREIGN KEY (payment_intent_id) REFERENCES payment.payment_intents(id) ON DELETE CASCADE
- `payment_intent_id_internal_id` → `payment.payment_intents(internal_id)` via `fk_payment_payment_attempts_payment_intent_id_payment_i_7c0e`; FOREIGN KEY (payment_intent_id_internal_id) REFERENCES payment.payment_intents(internal_id) ON DELETE CASCADE

**Referenced by 2 FK constraints** (sample): `payment.payment_transactions`, `payment.payment_transactions`.

## payment.payment_attempts — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 18 columns, 12 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_payment_payment_attempts_created_by_users` |
| `updated_by` | `identity.users` | `fk_payment_payment_attempts_updated_by_users` |
| `payment_intent_id` | `payment.payment_intents` | `fk_payment_payment_attempts_payment_intent_id_payment_intents` |
| `payment_intent_id_internal_id` | `payment.payment_intents` | `fk_payment_payment_attempts_payment_intent_id_payment_i_7c0e` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_payment_attempts_intent` | `CREATE INDEX ix_payment_attempts_intent ON payment.payment_attempts USING btree (payment_intent_id)` |
| `ix_payment_attempts_provider_reference` | `CREATE INDEX ix_payment_attempts_provider_reference ON payment.payment_attempts USING btree (provider_reference)` |
| `payment_attempt_number` | `CREATE UNIQUE INDEX payment_attempt_number ON payment.payment_attempts USING btree (payment_intent_id, attempt_number)` |
| `pk_payment_payment_attempts` | `CREATE UNIQUE INDEX pk_payment_payment_attempts ON payment.payment_attempts USING btree (internal_id)` |
| `uq_payment_payment_attempts_id` | `CREATE UNIQUE INDEX uq_payment_payment_attempts_id ON payment.payment_attempts USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.payment_attempts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["payment_intent_id","payment_intent_id_internal_id","payment","payment_intents"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.payment_attempts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.payment_attempts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["payment_intent_id","payment_intent_id_internal_id","payment","payment_intents"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
