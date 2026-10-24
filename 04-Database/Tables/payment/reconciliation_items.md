# `payment.reconciliation_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds reconciliation items records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | payment.reconciliation_items |
| Classification | Transactional |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `actual_amount` | `numeric(16,2)` | Yes | — | Value of actual amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_reconciliation_items_created_by_users` |
| `expected_amount` | `numeric(16,2)` | Yes | — | Value of expected amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `internal_reference` | `character varying(255)` | Yes | — | Inferred: stores internal reference for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider_reference` | `character varying(255)` | No | — | Inferred: stores provider reference for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `resolution_notes` | `text` | Yes | — | Inferred: stores resolution notes for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `run_id` | `uuid` | No | — | Reference linking this record to reconciliation runs | Ensures related business data can be joined and validated | FK → `payment.reconciliation_runs` via `fk_payment_reconciliation_items_run_id_reconciliation_runs` |
| `run_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.reconciliation_runs` via `fk_payment_reconciliation_items_run_id_reconciliation_r_bf55` |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_reconciliation_items_updated_by_users` |

## Record lifecycle and users

- **Created:** when the reconciliation items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.reconciliation_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_payment_reconciliation_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_payment_reconciliation_items_run_id_reconciliation_r_bf55 | `run_id_internal_id` | [`payment.reconciliation_runs`](../../Tables/payment/reconciliation_runs.md) | `FOREIGN KEY (run_id_internal_id) REFERENCES payment.reconciliation_runs(internal_id) ON DELETE CASCADE` |
| fk_payment_reconciliation_items_run_id_reconciliation_runs | `run_id` | [`payment.reconciliation_runs`](../../Tables/payment/reconciliation_runs.md) | `FOREIGN KEY (run_id) REFERENCES payment.reconciliation_runs(id) ON DELETE CASCADE` |
| fk_payment_reconciliation_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `payment.reconciliation_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_payment_reconciliation_items_created_by_users` |
| `run_id_internal_id` | `payment.reconciliation_runs` | `fk_payment_reconciliation_items_run_id_reconciliation_r_bf55` |
| `run_id` | `payment.reconciliation_runs` | `fk_payment_reconciliation_items_run_id_reconciliation_runs` |
| `updated_by` | `identity.users` | `fk_payment_reconciliation_items_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_payment_reconciliation_items_finite_numeric_values` | CHECK | `CHECK ((expected_amount IS NULL OR (expected_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (actual_amount IS NULL OR (actual_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_payment_reconciliation_items_numeric_pair_run_id` | CHECK | `CHECK ((run_id IS NULL) = (run_id_internal_id IS NULL))` |
| `ck_payment_reconciliation_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_payment_reconciliation_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_payment_reconciliation_items_run_id_reconciliation_r_bf55` | FOREIGN KEY | `FOREIGN KEY (run_id_internal_id) REFERENCES payment.reconciliation_runs(internal_id) ON DELETE CASCADE` |
| `fk_payment_reconciliation_items_run_id_reconciliation_runs` | FOREIGN KEY | `FOREIGN KEY (run_id) REFERENCES payment.reconciliation_runs(id) ON DELETE CASCADE` |
| `fk_payment_reconciliation_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_payment_reconciliation_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_payment_reconciliation_items_id` | UNIQUE | `UNIQUE (id)` |
| `reconciliation_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `reconciliation_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `reconciliation_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `reconciliation_items_provider_reference_not_null` | NOT NULL | `NOT NULL provider_reference` |
| `reconciliation_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `reconciliation_items_run_id_internal_id_not_null` | NOT NULL | `NOT NULL run_id_internal_id` |
| `reconciliation_items_run_id_not_null` | NOT NULL | `NOT NULL run_id` |
| `reconciliation_items_status_not_null` | NOT NULL | `NOT NULL status` |
| `reconciliation_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_payment_reconciliation_items_run` | btree | `(run_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_reconciliation_items_run ON payment.reconciliation_items USING btree (run_id)` |
| `ix_payment_reconciliation_items_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_reconciliation_items_status ON payment.reconciliation_items USING btree (status)` |
| `pk_payment_reconciliation_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_payment_reconciliation_items ON payment.reconciliation_items USING btree (internal_id)` |
| `uq_payment_reconciliation_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_payment_reconciliation_items_id ON payment.reconciliation_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.reconciliation_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["run_id","run_id_internal_id","payment","reconciliation_runs"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.reconciliation_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.reconciliation_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["run_id","run_id_internal_id","payment","reconciliation_runs"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
