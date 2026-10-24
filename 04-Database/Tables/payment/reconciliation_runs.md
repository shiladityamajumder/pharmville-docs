# `payment.reconciliation_runs`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds reconciliation runs records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | payment.reconciliation_runs |
| Classification | Transactional |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `account_id` | `uuid` | Yes | — | Reference linking this record to provider accounts | Ensures related business data can be joined and validated | FK → `payment.provider_accounts` via `fk_payment_reconciliation_runs_account_id_provider_accounts` |
| `account_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.provider_accounts` via `fk_payment_reconciliation_runs_account_id_provider_acco_d922` |
| `completed_at` | `timestamp with time zone` | Yes | — | Time of completed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_reconciliation_runs_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `run_date` | `date` | No | — | Inferred: stores run date for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `source_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_payment_reconciliation_runs_source_file_id_file_objects` |
| `source_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_payment_reconciliation_runs_source_file_id_file_obje_5a14` |
| `started_at` | `timestamp with time zone` | No | — | Time of started | Support chronology, deadlines or audit evidence | Exact constraints below |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `summary` | `jsonb` | No | `'{}'::jsonb` | Structured summary information | Retain a versioned payload or relevant details | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_reconciliation_runs_updated_by_users` |

## Record lifecycle and users

- **Created:** when the reconciliation runs business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.reconciliation_runs` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_payment_reconciliation_runs_account_id_provider_acco_d922 | `account_id_internal_id` | [`payment.provider_accounts`](../../Tables/payment/provider_accounts.md) | `FOREIGN KEY (account_id_internal_id) REFERENCES payment.provider_accounts(internal_id) ON DELETE SET NULL` |
| fk_payment_reconciliation_runs_account_id_provider_accounts | `account_id` | [`payment.provider_accounts`](../../Tables/payment/provider_accounts.md) | `FOREIGN KEY (account_id) REFERENCES payment.provider_accounts(id) ON DELETE SET NULL` |
| fk_payment_reconciliation_runs_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_payment_reconciliation_runs_source_file_id_file_obje_5a14 | `source_file_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (source_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| fk_payment_reconciliation_runs_source_file_id_file_objects | `source_file_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (source_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| fk_payment_reconciliation_runs_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`payment.reconciliation_items`](../../Tables/payment/reconciliation_items.md) | fk_payment_reconciliation_items_run_id_reconciliation_r_bf55 | `run_id_internal_id` | `internal_id` |
| [`payment.reconciliation_items`](../../Tables/payment/reconciliation_items.md) | fk_payment_reconciliation_items_run_id_reconciliation_runs | `run_id` | `id` |

## `payment.reconciliation_runs` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `account_id_internal_id` | `payment.provider_accounts` | `fk_payment_reconciliation_runs_account_id_provider_acco_d922` |
| `account_id` | `payment.provider_accounts` | `fk_payment_reconciliation_runs_account_id_provider_accounts` |
| `created_by` | `identity.users` | `fk_payment_reconciliation_runs_created_by_users` |
| `source_file_id_internal_id` | `platform.file_objects` | `fk_payment_reconciliation_runs_source_file_id_file_obje_5a14` |
| `source_file_id` | `platform.file_objects` | `fk_payment_reconciliation_runs_source_file_id_file_objects` |
| `updated_by` | `identity.users` | `fk_payment_reconciliation_runs_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_payment_reconciliation_runs_numeric_pair_account_id` | CHECK | `CHECK ((account_id IS NULL) = (account_id_internal_id IS NULL))` |
| `ck_payment_reconciliation_runs_numeric_pair_source_file_id` | CHECK | `CHECK ((source_file_id IS NULL) = (source_file_id_internal_id IS NULL))` |
| `ck_payment_reconciliation_runs_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_payment_reconciliation_runs_account_id_provider_acco_d922` | FOREIGN KEY | `FOREIGN KEY (account_id_internal_id) REFERENCES payment.provider_accounts(internal_id) ON DELETE SET NULL` |
| `fk_payment_reconciliation_runs_account_id_provider_accounts` | FOREIGN KEY | `FOREIGN KEY (account_id) REFERENCES payment.provider_accounts(id) ON DELETE SET NULL` |
| `fk_payment_reconciliation_runs_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_payment_reconciliation_runs_source_file_id_file_obje_5a14` | FOREIGN KEY | `FOREIGN KEY (source_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| `fk_payment_reconciliation_runs_source_file_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (source_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| `fk_payment_reconciliation_runs_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_payment_reconciliation_runs` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `recon_provider_date_account` | UNIQUE | `UNIQUE NULLS NOT DISTINCT (provider, run_date, account_id)` |
| `uq_payment_reconciliation_runs_id` | UNIQUE | `UNIQUE (id)` |
| `reconciliation_runs_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `reconciliation_runs_id_not_null` | NOT NULL | `NOT NULL id` |
| `reconciliation_runs_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `reconciliation_runs_provider_not_null` | NOT NULL | `NOT NULL provider` |
| `reconciliation_runs_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `reconciliation_runs_run_date_not_null` | NOT NULL | `NOT NULL run_date` |
| `reconciliation_runs_started_at_not_null` | NOT NULL | `NOT NULL started_at` |
| `reconciliation_runs_status_not_null` | NOT NULL | `NOT NULL status` |
| `reconciliation_runs_summary_not_null` | NOT NULL | `NOT NULL summary` |
| `reconciliation_runs_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_payment_reconciliation_runs_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_reconciliation_runs_status ON payment.reconciliation_runs USING btree (status)` |
| `pk_payment_reconciliation_runs` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_payment_reconciliation_runs ON payment.reconciliation_runs USING btree (internal_id)` |
| `recon_provider_date_account` | btree | `(provider, run_date, account_id) NULLS NOT DISTINCT` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX recon_provider_date_account ON payment.reconciliation_runs USING btree (provider, run_date, account_id) NULLS NOT DISTINCT` |
| `uq_payment_reconciliation_runs_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_payment_reconciliation_runs_id ON payment.reconciliation_runs USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.reconciliation_runs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["account_id","account_id_internal_id","payment","provider_accounts"],["source_file_id","source_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.reconciliation_runs FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.reconciliation_runs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["account_id","account_id_internal_id","payment","provider_accounts"],["source_file_id","source_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
