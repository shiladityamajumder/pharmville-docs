# `payment.provider_accounts`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds provider accounts records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | payment.provider_accounts |
| Classification | Configuration |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 8 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_provider_accounts_created_by_users` |
| `credentials_secret_ref` | `character varying(255)` | No | — | Inferred: stores credentials secret ref for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_provider_accounts_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `merchant_account_ref` | `character varying(255)` | No | — | Inferred: stores merchant account ref for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `supported_methods` | `jsonb` | No | `'[]'::jsonb` | Structured supported methods information | Retain a versioned payload or relevant details | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_provider_accounts_updated_by_users` |

## Record lifecycle and users

- **Created:** when the provider accounts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.provider_accounts` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_payment_provider_accounts_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_payment_provider_accounts_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_payment_provider_accounts_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`payment.payment_intents`](../../Tables/payment/payment_intents.md) | fk_payment_payment_intents_provider_account_id_provider_5a73 | `provider_account_id` | `id` |
| [`payment.payment_intents`](../../Tables/payment/payment_intents.md) | fk_payment_payment_intents_provider_account_id_provider_c869 | `provider_account_id_internal_id` | `internal_id` |
| [`payment.reconciliation_runs`](../../Tables/payment/reconciliation_runs.md) | fk_payment_reconciliation_runs_account_id_provider_acco_d922 | `account_id_internal_id` | `internal_id` |
| [`payment.reconciliation_runs`](../../Tables/payment/reconciliation_runs.md) | fk_payment_reconciliation_runs_account_id_provider_accounts | `account_id` | `id` |

## `payment.provider_accounts` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_payment_provider_accounts_created_by_users` |
| `deleted_by` | `identity.users` | `fk_payment_provider_accounts_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_payment_provider_accounts_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_payment_provider_accounts_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_payment_provider_accounts_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(merchant_account_ref::text)) > 0 AND merchant_account_ref::text = btrim(merchant_account_ref::text))` |
| `fk_payment_provider_accounts_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_payment_provider_accounts_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_payment_provider_accounts_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_payment_provider_accounts` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `provider_merchant_account` | UNIQUE | `UNIQUE (provider, merchant_account_ref)` |
| `uq_payment_provider_accounts_id` | UNIQUE | `UNIQUE (id)` |
| `provider_accounts_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `provider_accounts_credentials_secret_ref_not_null` | NOT NULL | `NOT NULL credentials_secret_ref` |
| `provider_accounts_id_not_null` | NOT NULL | `NOT NULL id` |
| `provider_accounts_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `provider_accounts_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `provider_accounts_merchant_account_ref_not_null` | NOT NULL | `NOT NULL merchant_account_ref` |
| `provider_accounts_provider_not_null` | NOT NULL | `NOT NULL provider` |
| `provider_accounts_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `provider_accounts_status_not_null` | NOT NULL | `NOT NULL status` |
| `provider_accounts_supported_methods_not_null` | NOT NULL | `NOT NULL supported_methods` |
| `provider_accounts_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_payment_provider_accounts_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_provider_accounts_status ON payment.provider_accounts USING btree (status)` |
| `pk_payment_provider_accounts` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_payment_provider_accounts ON payment.provider_accounts USING btree (internal_id)` |
| `provider_merchant_account` | btree | `(provider, merchant_account_ref)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX provider_merchant_account ON payment.provider_accounts USING btree (provider, merchant_account_ref)` |
| `uq_payment_provider_accounts_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_payment_provider_accounts_id ON payment.provider_accounts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.provider_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON payment.provider_accounts FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('merchant_account_ref', '["provider"]')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.provider_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.provider_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
