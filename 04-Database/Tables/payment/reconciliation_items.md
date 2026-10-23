# payment.reconciliation_items

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds reconciliation items records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 9 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `actual_amount` | `numeric(16,2)` | Yes | — | Value of actual amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_reconciliation_items_created_by_users) |
| `expected_amount` | `numeric(16,2)` | Yes | — | Value of expected amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `internal_reference` | `character varying(255)` | Yes | — | Inferred: stores internal reference for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider_reference` | `character varying(255)` | No | — | Inferred: stores provider reference for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `resolution_notes` | `text` | Yes | — | Inferred: stores resolution notes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `run_id` | `uuid` | No | — | Reference linking this record to reconciliation runs | Ensures related business data can be joined and validated | FK → `payment.reconciliation_runs` (fk_payment_reconciliation_items_run_id_reconciliation_runs) |
| `run_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.reconciliation_runs` (fk_payment_reconciliation_items_run_id_reconciliation_r_bf55); Numeric/public-key pair verification required |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_reconciliation_items_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the reconciliation items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.reconciliation_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_payment_reconciliation_items_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_payment_reconciliation_items_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `run_id` → `payment.reconciliation_runs(id)` via `fk_payment_reconciliation_items_run_id_reconciliation_runs`; FOREIGN KEY (run_id) REFERENCES payment.reconciliation_runs(id) ON DELETE CASCADE
- `run_id_internal_id` → `payment.reconciliation_runs(internal_id)` via `fk_payment_reconciliation_items_run_id_reconciliation_r_bf55`; FOREIGN KEY (run_id_internal_id) REFERENCES payment.reconciliation_runs(internal_id) ON DELETE CASCADE

## payment.reconciliation_items — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 15 columns, 9 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_payment_reconciliation_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_payment_reconciliation_items_updated_by_users` |
| `run_id` | `payment.reconciliation_runs` | `fk_payment_reconciliation_items_run_id_reconciliation_runs` |
| `run_id_internal_id` | `payment.reconciliation_runs` | `fk_payment_reconciliation_items_run_id_reconciliation_r_bf55` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_payment_reconciliation_items_run` | `CREATE INDEX ix_payment_reconciliation_items_run ON payment.reconciliation_items USING btree (run_id)` |
| `ix_payment_reconciliation_items_status` | `CREATE INDEX ix_payment_reconciliation_items_status ON payment.reconciliation_items USING btree (status)` |
| `pk_payment_reconciliation_items` | `CREATE UNIQUE INDEX pk_payment_reconciliation_items ON payment.reconciliation_items USING btree (internal_id)` |
| `uq_payment_reconciliation_items_id` | `CREATE UNIQUE INDEX uq_payment_reconciliation_items_id ON payment.reconciliation_items USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.reconciliation_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["run_id","run_id_internal_id","payment","reconciliation_runs"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.reconciliation_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.reconciliation_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["run_id","run_id_internal_id","payment","reconciliation_runs"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
