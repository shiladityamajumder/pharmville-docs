# payment.provider_accounts

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds provider accounts records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 8 constraints, 4 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_provider_accounts_created_by_users) |
| `credentials_secret_ref` | `character varying(255)` | No | — | Inferred: stores credentials secret ref for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_provider_accounts_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `merchant_account_ref` | `character varying(255)` | No | — | Inferred: stores merchant account ref for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `supported_methods` | `jsonb` | No | `'[]'::jsonb` | Structured supported methods information | Retain a versioned payload or relevant details | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_provider_accounts_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the provider accounts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.provider_accounts` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_payment_provider_accounts_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_payment_provider_accounts_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_payment_provider_accounts_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT

**Referenced by 4 FK constraints** (sample): `payment.payment_intents`, `payment.reconciliation_runs`, `payment.payment_intents`, `payment.reconciliation_runs`.

## payment.provider_accounts — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 15 columns, 8 constraints, 4 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_payment_provider_accounts_created_by_users` |
| `deleted_by` | `identity.users` | `fk_payment_provider_accounts_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_payment_provider_accounts_updated_by_users` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_payment_provider_accounts_status` | `CREATE INDEX ix_payment_provider_accounts_status ON payment.provider_accounts USING btree (status)` |
| `pk_payment_provider_accounts` | `CREATE UNIQUE INDEX pk_payment_provider_accounts ON payment.provider_accounts USING btree (internal_id)` |
| `provider_merchant_account` | `CREATE UNIQUE INDEX provider_merchant_account ON payment.provider_accounts USING btree (provider, merchant_account_ref)` |
| `uq_payment_provider_accounts_id` | `CREATE UNIQUE INDEX uq_payment_provider_accounts_id ON payment.provider_accounts USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.provider_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON payment.provider_accounts FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('merchant_account_ref', '["provider"]')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.provider_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.provider_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
