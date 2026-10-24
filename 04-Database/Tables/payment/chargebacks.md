# `payment.chargebacks`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds chargebacks records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | payment.chargebacks |
| Classification | Transactional |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 18 columns; 14 PK/FK/UQ/CHECK/exclusion constraints; 13 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(16,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_chargebacks_created_by_users` |
| `evidence_due_at` | `timestamp with time zone` | Yes | — | Time of evidence due | Support chronology, deadlines or audit evidence | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` via `fk_payment_chargebacks_order_id_orders` |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` via `fk_payment_chargebacks_order_id_orders_numeric` |
| `payment_transaction_id` | `uuid` | No | — | Reference linking this record to payment transactions | Ensures related business data can be joined and validated | FK → `payment.payment_transactions` via `fk_payment_chargebacks_payment_transaction_id_payment_t_d77b` |
| `payment_transaction_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.payment_transactions` via `fk_payment_chargebacks_payment_transaction_id_payment_t_0492` |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider_chargeback_id` | `character varying(255)` | No | — | Identifier associated with provider chargeback | Link the event or entity to its subject; verify constraints | Collation: default |
| `reason_code` | `character varying(128)` | Yes | — | Code for reason | Link to controlled business classification or an external reference | Collation: default |
| `resolved_at` | `timestamp with time zone` | Yes | — | Time of resolved | Support chronology, deadlines or audit evidence | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_chargebacks_updated_by_users` |

## Record lifecycle and users

- **Created:** when the chargebacks business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.chargebacks` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_payment_chargebacks_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_payment_chargebacks_order_id_orders | `order_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| fk_payment_chargebacks_order_id_orders_numeric | `order_id_internal_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| fk_payment_chargebacks_payment_transaction_id_payment_t_0492 | `payment_transaction_id_internal_id` | [`payment.payment_transactions`](../../Tables/payment/payment_transactions.md) | `FOREIGN KEY (payment_transaction_id_internal_id) REFERENCES payment.payment_transactions(internal_id) ON DELETE RESTRICT` |
| fk_payment_chargebacks_payment_transaction_id_payment_t_d77b | `payment_transaction_id` | [`payment.payment_transactions`](../../Tables/payment/payment_transactions.md) | `FOREIGN KEY (payment_transaction_id) REFERENCES payment.payment_transactions(id) ON DELETE RESTRICT` |
| fk_payment_chargebacks_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `payment.chargebacks` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_payment_chargebacks_created_by_users` |
| `order_id` | `commerce.orders` | `fk_payment_chargebacks_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_payment_chargebacks_order_id_orders_numeric` |
| `payment_transaction_id_internal_id` | `payment.payment_transactions` | `fk_payment_chargebacks_payment_transaction_id_payment_t_0492` |
| `payment_transaction_id` | `payment.payment_transactions` | `fk_payment_chargebacks_payment_transaction_id_payment_t_d77b` |
| `updated_by` | `identity.users` | `fk_payment_chargebacks_updated_by_users` |

### Existing constraints

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
| `chargebacks_amount_not_null` | NOT NULL | `NOT NULL amount` |
| `chargebacks_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `chargebacks_id_not_null` | NOT NULL | `NOT NULL id` |
| `chargebacks_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `chargebacks_order_id_internal_id_not_null` | NOT NULL | `NOT NULL order_id_internal_id` |
| `chargebacks_order_id_not_null` | NOT NULL | `NOT NULL order_id` |
| `chargebacks_payment_transaction_id_internal_id_not_null` | NOT NULL | `NOT NULL payment_transaction_id_internal_id` |
| `chargebacks_payment_transaction_id_not_null` | NOT NULL | `NOT NULL payment_transaction_id` |
| `chargebacks_provider_chargeback_id_not_null` | NOT NULL | `NOT NULL provider_chargeback_id` |
| `chargebacks_provider_not_null` | NOT NULL | `NOT NULL provider` |
| `chargebacks_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `chargebacks_status_not_null` | NOT NULL | `NOT NULL status` |
| `chargebacks_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_payment_chargebacks_order` | btree | `(order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_chargebacks_order ON payment.chargebacks USING btree (order_id)` |
| `ix_payment_chargebacks_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_chargebacks_status ON payment.chargebacks USING btree (status)` |
| `pk_payment_chargebacks` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_payment_chargebacks ON payment.chargebacks USING btree (internal_id)` |
| `provider_chargeback` | btree | `(provider, provider_chargeback_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX provider_chargeback ON payment.chargebacks USING btree (provider, provider_chargeback_id)` |
| `uq_payment_chargebacks_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_payment_chargebacks_id ON payment.chargebacks USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.chargebacks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["payment_transaction_id","payment_transaction_id_internal_id","payment","payment_transactions"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.chargebacks FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.chargebacks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["payment_transaction_id","payment_transaction_id_internal_id","payment","payment_transactions"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
