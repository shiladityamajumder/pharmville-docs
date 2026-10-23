# payment.chargebacks

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds chargebacks records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 18 columns, 14 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(16,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_chargebacks_created_by_users) |
| `evidence_due_at` | `timestamp with time zone` | Yes | — | Time of evidence due | Support chronology, deadlines or audit evidence | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` (fk_payment_chargebacks_order_id_orders) |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` (fk_payment_chargebacks_order_id_orders_numeric); Numeric/public-key pair verification required |
| `payment_transaction_id` | `uuid` | No | — | Reference linking this record to payment transactions | Ensures related business data can be joined and validated | FK → `payment.payment_transactions` (fk_payment_chargebacks_payment_transaction_id_payment_t_d77b) |
| `payment_transaction_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.payment_transactions` (fk_payment_chargebacks_payment_transaction_id_payment_t_0492); Numeric/public-key pair verification required |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider_chargeback_id` | `character varying(255)` | No | — | Identifier associated with provider chargeback | Link the event or entity to its subject; verify constraints | See exact constraints |
| `reason_code` | `character varying(128)` | Yes | — | Code for reason | Link to controlled business classification or an external reference | See exact constraints |
| `resolved_at` | `timestamp with time zone` | Yes | — | Time of resolved | Support chronology, deadlines or audit evidence | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_chargebacks_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the chargebacks business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.chargebacks` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_payment_chargebacks_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_payment_chargebacks_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `order_id` → `commerce.orders(id)` via `fk_payment_chargebacks_order_id_orders`; FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT
- `payment_transaction_id` → `payment.payment_transactions(id)` via `fk_payment_chargebacks_payment_transaction_id_payment_t_d77b`; FOREIGN KEY (payment_transaction_id) REFERENCES payment.payment_transactions(id) ON DELETE RESTRICT
- `order_id_internal_id` → `commerce.orders(internal_id)` via `fk_payment_chargebacks_order_id_orders_numeric`; FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT
- `payment_transaction_id_internal_id` → `payment.payment_transactions(internal_id)` via `fk_payment_chargebacks_payment_transaction_id_payment_t_0492`; FOREIGN KEY (payment_transaction_id_internal_id) REFERENCES payment.payment_transactions(internal_id) ON DELETE RESTRICT

## payment.chargebacks — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 18 columns, 14 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_payment_chargebacks_created_by_users` |
| `updated_by` | `identity.users` | `fk_payment_chargebacks_updated_by_users` |
| `order_id` | `commerce.orders` | `fk_payment_chargebacks_order_id_orders` |
| `payment_transaction_id` | `payment.payment_transactions` | `fk_payment_chargebacks_payment_transaction_id_payment_t_d77b` |
| `order_id_internal_id` | `commerce.orders` | `fk_payment_chargebacks_order_id_orders_numeric` |
| `payment_transaction_id_internal_id` | `payment.payment_transactions` | `fk_payment_chargebacks_payment_transaction_id_payment_t_0492` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_payment_chargebacks_amount_positive` | CHECK | `CHECK (amount > 0::numeric)` |
| `ck_payment_chargebacks_finite_numeric_values` | CHECK | `CHECK (amount IS NULL OR (amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_payment_chargebacks_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_payment_chargebacks_numeric_pair_payment_transaction_id` | CHECK | `CHECK ((payment_transaction_id IS NULL) = (payment_transaction_id_internal_id IS NULL))` |
| `ck_payment_chargebacks_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_payment_chargebacks_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_payment_chargebacks_order_id_orders` | FOREIGN KEY | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| `fk_payment_chargebacks_order_id_orders_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| `fk_payment_chargebacks_payment_transaction_id_payment_t_0492` | FOREIGN KEY | `FOREIGN KEY (payment_transaction_id_internal_id) REFERENCES payment.payment_transactions(internal_id) ON DELETE RESTRICT` |
| `fk_payment_chargebacks_payment_transaction_id_payment_t_d77b` | FOREIGN KEY | `FOREIGN KEY (payment_transaction_id) REFERENCES payment.payment_transactions(id) ON DELETE RESTRICT` |
| `fk_payment_chargebacks_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_payment_chargebacks` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `provider_chargeback` | UNIQUE | `UNIQUE (provider, provider_chargeback_id)` |
| `uq_payment_chargebacks_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_payment_chargebacks_order` | `CREATE INDEX ix_payment_chargebacks_order ON payment.chargebacks USING btree (order_id)` |
| `ix_payment_chargebacks_status` | `CREATE INDEX ix_payment_chargebacks_status ON payment.chargebacks USING btree (status)` |
| `pk_payment_chargebacks` | `CREATE UNIQUE INDEX pk_payment_chargebacks ON payment.chargebacks USING btree (internal_id)` |
| `provider_chargeback` | `CREATE UNIQUE INDEX provider_chargeback ON payment.chargebacks USING btree (provider, provider_chargeback_id)` |
| `uq_payment_chargebacks_id` | `CREATE UNIQUE INDEX uq_payment_chargebacks_id ON payment.chargebacks USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.chargebacks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["payment_transaction_id","payment_transaction_id_internal_id","payment","payment_transactions"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.chargebacks FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.chargebacks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["payment_transaction_id","payment_transaction_id_internal_id","payment","payment_transactions"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
