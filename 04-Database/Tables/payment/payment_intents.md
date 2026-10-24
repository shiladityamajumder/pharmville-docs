# `payment.payment_intents`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds payment intents records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | payment.payment_intents |
| Classification | Transactional |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 22 columns; 18 PK/FK/UQ/CHECK/exclusion constraints; 14 named PostgreSQL 18 NOT NULL constraints; 8 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(16,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_payment_intents_created_by_users` |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | Collation: default |
| `expires_at` | `timestamp with time zone` | Yes | — | Expiration time | Determine validity windows | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | Exact constraints below |
| `method` | `character varying(32)` | No | — | Inferred: stores method for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `order_id` | `uuid` | No | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` via `fk_payment_intents_revision_order`; FK → `commerce.orders` via `fk_payment_payment_intents_order_id_orders` |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_revisions` via `fk_payment_intents_revision_order_numeric`; FK → `commerce.orders` via `fk_payment_payment_intents_order_id_orders_numeric` |
| `order_revision_id` | `uuid` | Yes | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` via `fk_payment_intents_revision_order` |
| `order_revision_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_revisions` via `fk_payment_intents_revision_order_numeric` |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider_account_id` | `uuid` | Yes | — | Reference linking this record to provider accounts | Ensures related business data can be joined and validated | FK → `payment.provider_accounts` via `fk_payment_payment_intents_provider_account_id_provider_5a73` |
| `provider_account_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.provider_accounts` via `fk_payment_payment_intents_provider_account_id_provider_c869` |
| `provider_intent_id` | `character varying(255)` | Yes | — | Identifier associated with provider intent | Link the event or entity to its subject; verify constraints | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(18)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_payment_intents_updated_by_users` |

## Record lifecycle and users

- **Created:** when the payment intents business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.payment_intents` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_payment_intents_revision_order | `order_revision_id, order_id` | [`commerce.order_revisions`](../../Tables/commerce/order_revisions.md) | `FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT` |
| fk_payment_intents_revision_order_numeric | `order_revision_id_internal_id, order_id_internal_id` | [`commerce.order_revisions`](../../Tables/commerce/order_revisions.md) | `FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| fk_payment_payment_intents_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_payment_payment_intents_order_id_orders | `order_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| fk_payment_payment_intents_order_id_orders_numeric | `order_id_internal_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| fk_payment_payment_intents_provider_account_id_provider_5a73 | `provider_account_id` | [`payment.provider_accounts`](../../Tables/payment/provider_accounts.md) | `FOREIGN KEY (provider_account_id) REFERENCES payment.provider_accounts(id) ON DELETE SET NULL` |
| fk_payment_payment_intents_provider_account_id_provider_c869 | `provider_account_id_internal_id` | [`payment.provider_accounts`](../../Tables/payment/provider_accounts.md) | `FOREIGN KEY (provider_account_id_internal_id) REFERENCES payment.provider_accounts(internal_id) ON DELETE SET NULL` |
| fk_payment_payment_intents_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`payment.payment_attempts`](../../Tables/payment/payment_attempts.md) | fk_payment_payment_attempts_payment_intent_id_payment_i_7c0e | `payment_intent_id_internal_id` | `internal_id` |
| [`payment.payment_attempts`](../../Tables/payment/payment_attempts.md) | fk_payment_payment_attempts_payment_intent_id_payment_intents | `payment_intent_id` | `id` |
| [`payment.payment_transactions`](../../Tables/payment/payment_transactions.md) | fk_payment_payment_transactions_payment_intent_id_payme_02b1 | `payment_intent_id_internal_id` | `internal_id` |
| [`payment.payment_transactions`](../../Tables/payment/payment_transactions.md) | fk_payment_payment_transactions_payment_intent_id_payme_3fef | `payment_intent_id` | `id` |

## `payment.payment_intents` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `order_revision_id, order_id` | `commerce.order_revisions` | `fk_payment_intents_revision_order` |
| `order_revision_id_internal_id, order_id_internal_id` | `commerce.order_revisions` | `fk_payment_intents_revision_order_numeric` |
| `created_by` | `identity.users` | `fk_payment_payment_intents_created_by_users` |
| `order_id` | `commerce.orders` | `fk_payment_payment_intents_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_payment_payment_intents_order_id_orders_numeric` |
| `provider_account_id` | `payment.provider_accounts` | `fk_payment_payment_intents_provider_account_id_provider_5a73` |
| `provider_account_id_internal_id` | `payment.provider_accounts` | `fk_payment_payment_intents_provider_account_id_provider_c869` |
| `updated_by` | `identity.users` | `fk_payment_payment_intents_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_payment_payment_intents_amount_positive` | CHECK | `CHECK (amount > 0::numeric)` |
| `ck_payment_payment_intents_finite_numeric_values` | CHECK | `CHECK (amount IS NULL OR (amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_payment_payment_intents_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_payment_payment_intents_numeric_pair_order_revision_id` | CHECK | `CHECK ((order_revision_id IS NULL) = (order_revision_id_internal_id IS NULL))` |
| `ck_payment_payment_intents_numeric_pair_provider_account_id` | CHECK | `CHECK ((provider_account_id IS NULL) = (provider_account_id_internal_id IS NULL))` |
| `ck_payment_payment_intents_paymentstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['created'::text, 'requires_action'::text, 'authorized'::text, 'captured'::text, 'partially_refunded'::text, 'refunded'::text, 'failed'::text, 'cancelled'::text, 'expired'::text]))` |
| `ck_payment_payment_intents_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_payment_intents_revision_order` | FOREIGN KEY | `FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT` |
| `fk_payment_intents_revision_order_numeric` | FOREIGN KEY | `FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| `fk_payment_payment_intents_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_payment_payment_intents_order_id_orders` | FOREIGN KEY | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| `fk_payment_payment_intents_order_id_orders_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| `fk_payment_payment_intents_provider_account_id_provider_5a73` | FOREIGN KEY | `FOREIGN KEY (provider_account_id) REFERENCES payment.provider_accounts(id) ON DELETE SET NULL` |
| `fk_payment_payment_intents_provider_account_id_provider_c869` | FOREIGN KEY | `FOREIGN KEY (provider_account_id_internal_id) REFERENCES payment.provider_accounts(internal_id) ON DELETE SET NULL` |
| `fk_payment_payment_intents_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `payment_intent_idempotency` | UNIQUE | `UNIQUE (idempotency_key)` |
| `pk_payment_payment_intents` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_payment_payment_intents_id` | UNIQUE | `UNIQUE (id)` |
| `payment_intents_amount_not_null` | NOT NULL | `NOT NULL amount` |
| `payment_intents_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `payment_intents_currency_not_null` | NOT NULL | `NOT NULL currency` |
| `payment_intents_id_not_null` | NOT NULL | `NOT NULL id` |
| `payment_intents_idempotency_key_not_null` | NOT NULL | `NOT NULL idempotency_key` |
| `payment_intents_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `payment_intents_metadata_json_not_null` | NOT NULL | `NOT NULL metadata_json` |
| `payment_intents_method_not_null` | NOT NULL | `NOT NULL method` |
| `payment_intents_order_id_internal_id_not_null` | NOT NULL | `NOT NULL order_id_internal_id` |
| `payment_intents_order_id_not_null` | NOT NULL | `NOT NULL order_id` |
| `payment_intents_provider_not_null` | NOT NULL | `NOT NULL provider` |
| `payment_intents_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `payment_intents_status_not_null` | NOT NULL | `NOT NULL status` |
| `payment_intents_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_payment_intents_expires_at` | btree | `(expires_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_intents_expires_at ON payment.payment_intents USING btree (expires_at)` |
| `ix_payment_intents_order` | btree | `(order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_intents_order ON payment.payment_intents USING btree (order_id)` |
| `ix_payment_intents_provider_intent` | btree | `(provider, provider_intent_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_intents_provider_intent ON payment.payment_intents USING btree (provider, provider_intent_id)` |
| `ix_payment_intents_revision_status` | btree | `(order_revision_id, status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_intents_revision_status ON payment.payment_intents USING btree (order_revision_id, status)` |
| `ix_payment_intents_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_intents_status ON payment.payment_intents USING btree (status)` |
| `payment_intent_idempotency` | btree | `(idempotency_key)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX payment_intent_idempotency ON payment.payment_intents USING btree (idempotency_key)` |
| `pk_payment_payment_intents` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_payment_payment_intents ON payment.payment_intents USING btree (internal_id)` |
| `uq_payment_payment_intents_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_payment_payment_intents_id ON payment.payment_intents USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.payment_intents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["provider_account_id","provider_account_id_internal_id","payment","provider_accounts"]]', 'internal_id', 'id')` | O |
| `payment_revision_guard` | `CREATE TRIGGER payment_revision_guard BEFORE INSERT OR UPDATE ON payment.payment_intents FOR EACH ROW EXECUTE FUNCTION payment.guard_intent_revision()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.payment_intents FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.payment_intents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["provider_account_id","provider_account_id_internal_id","payment","provider_accounts"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
