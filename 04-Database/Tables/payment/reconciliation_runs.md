# payment.reconciliation_runs

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds reconciliation runs records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 12 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `account_id` | `uuid` | Yes | — | Reference linking this record to provider accounts | Ensures related business data can be joined and validated | FK → `payment.provider_accounts` (fk_payment_reconciliation_runs_account_id_provider_accounts) |
| `account_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.provider_accounts` (fk_payment_reconciliation_runs_account_id_provider_acco_d922); Numeric/public-key pair verification required |
| `completed_at` | `timestamp with time zone` | Yes | — | Time of completed | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_reconciliation_runs_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `run_date` | `date` | No | — | Inferred: stores run date for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `source_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_payment_reconciliation_runs_source_file_id_file_objects) |
| `source_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_payment_reconciliation_runs_source_file_id_file_obje_5a14); Numeric/public-key pair verification required |
| `started_at` | `timestamp with time zone` | No | — | Time of started | Support chronology, deadlines or audit evidence | See exact constraints |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `summary` | `jsonb` | No | `'{}'::jsonb` | Structured summary information | Retain a versioned payload or relevant details | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_reconciliation_runs_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the reconciliation runs business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.reconciliation_runs` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_payment_reconciliation_runs_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_payment_reconciliation_runs_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `source_file_id` → `platform.file_objects(id)` via `fk_payment_reconciliation_runs_source_file_id_file_objects`; FOREIGN KEY (source_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL
- `account_id` → `payment.provider_accounts(id)` via `fk_payment_reconciliation_runs_account_id_provider_accounts`; FOREIGN KEY (account_id) REFERENCES payment.provider_accounts(id) ON DELETE SET NULL
- `account_id_internal_id` → `payment.provider_accounts(internal_id)` via `fk_payment_reconciliation_runs_account_id_provider_acco_d922`; FOREIGN KEY (account_id_internal_id) REFERENCES payment.provider_accounts(internal_id) ON DELETE SET NULL
- `source_file_id_internal_id` → `platform.file_objects(internal_id)` via `fk_payment_reconciliation_runs_source_file_id_file_obje_5a14`; FOREIGN KEY (source_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL

**Referenced by 2 FK constraints** (sample): `payment.reconciliation_items`, `payment.reconciliation_items`.

## payment.reconciliation_runs — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 17 columns, 12 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_payment_reconciliation_runs_created_by_users` |
| `updated_by` | `identity.users` | `fk_payment_reconciliation_runs_updated_by_users` |
| `source_file_id` | `platform.file_objects` | `fk_payment_reconciliation_runs_source_file_id_file_objects` |
| `account_id` | `payment.provider_accounts` | `fk_payment_reconciliation_runs_account_id_provider_accounts` |
| `account_id_internal_id` | `payment.provider_accounts` | `fk_payment_reconciliation_runs_account_id_provider_acco_d922` |
| `source_file_id_internal_id` | `platform.file_objects` | `fk_payment_reconciliation_runs_source_file_id_file_obje_5a14` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_payment_reconciliation_runs_status` | `CREATE INDEX ix_payment_reconciliation_runs_status ON payment.reconciliation_runs USING btree (status)` |
| `pk_payment_reconciliation_runs` | `CREATE UNIQUE INDEX pk_payment_reconciliation_runs ON payment.reconciliation_runs USING btree (internal_id)` |
| `recon_provider_date_account` | `CREATE UNIQUE INDEX recon_provider_date_account ON payment.reconciliation_runs USING btree (provider, run_date, account_id) NULLS NOT DISTINCT` |
| `uq_payment_reconciliation_runs_id` | `CREATE UNIQUE INDEX uq_payment_reconciliation_runs_id ON payment.reconciliation_runs USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.reconciliation_runs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["account_id","account_id_internal_id","payment","provider_accounts"],["source_file_id","source_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.reconciliation_runs FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.reconciliation_runs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["account_id","account_id_internal_id","payment","provider_accounts"],["source_file_id","source_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
