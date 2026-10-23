# payment.payment_intents

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds payment intents records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 22 columns, 18 constraints, 8 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(16,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_payment_intents_created_by_users) |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | See exact constraints |
| `expires_at` | `timestamp with time zone` | Yes | — | Expiration time | Determine validity windows | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | See exact constraints |
| `method` | `character varying(32)` | No | — | Inferred: stores method for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `order_id` | `uuid` | No | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` (fk_payment_intents_revision_order); FK → `commerce.orders` (fk_payment_payment_intents_order_id_orders) |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_revisions` (fk_payment_intents_revision_order_numeric); FK → `commerce.orders` (fk_payment_payment_intents_order_id_orders_numeric); Numeric/public-key pair verification required |
| `order_revision_id` | `uuid` | Yes | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` (fk_payment_intents_revision_order) |
| `order_revision_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_revisions` (fk_payment_intents_revision_order_numeric); Numeric/public-key pair verification required |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider_account_id` | `uuid` | Yes | — | Reference linking this record to provider accounts | Ensures related business data can be joined and validated | FK → `payment.provider_accounts` (fk_payment_payment_intents_provider_account_id_provider_5a73) |
| `provider_account_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.provider_accounts` (fk_payment_payment_intents_provider_account_id_provider_c869); Numeric/public-key pair verification required |
| `provider_intent_id` | `character varying(255)` | Yes | — | Identifier associated with provider intent | Link the event or entity to its subject; verify constraints | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(18)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_payment_intents_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the payment intents business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.payment_intents` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_payment_payment_intents_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_payment_payment_intents_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `provider_account_id` → `payment.provider_accounts(id)` via `fk_payment_payment_intents_provider_account_id_provider_5a73`; FOREIGN KEY (provider_account_id) REFERENCES payment.provider_accounts(id) ON DELETE SET NULL
- `order_revision_id, order_id` → `commerce.order_revisions(id, order_id)` via `fk_payment_intents_revision_order`; FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT
- `order_id` → `commerce.orders(id)` via `fk_payment_payment_intents_order_id_orders`; FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT
- `order_revision_id_internal_id, order_id_internal_id` → `commerce.order_revisions(internal_id, order_id_internal_id)` via `fk_payment_intents_revision_order_numeric`; FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT
- `order_id_internal_id` → `commerce.orders(internal_id)` via `fk_payment_payment_intents_order_id_orders_numeric`; FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT
- `provider_account_id_internal_id` → `payment.provider_accounts(internal_id)` via `fk_payment_payment_intents_provider_account_id_provider_c869`; FOREIGN KEY (provider_account_id_internal_id) REFERENCES payment.provider_accounts(internal_id) ON DELETE SET NULL

**Referenced by 4 FK constraints** (sample): `payment.payment_attempts`, `payment.payment_transactions`, `payment.payment_attempts`, `payment.payment_transactions`.

## payment.payment_intents — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 22 columns, 18 constraints, 8 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_payment_payment_intents_created_by_users` |
| `updated_by` | `identity.users` | `fk_payment_payment_intents_updated_by_users` |
| `provider_account_id` | `payment.provider_accounts` | `fk_payment_payment_intents_provider_account_id_provider_5a73` |
| `order_revision_id`, `order_id` | `commerce.order_revisions` | `fk_payment_intents_revision_order` |
| `order_id` | `commerce.orders` | `fk_payment_payment_intents_order_id_orders` |
| `order_revision_id_internal_id`, `order_id_internal_id` | `commerce.order_revisions` | `fk_payment_intents_revision_order_numeric` |
| `order_id_internal_id` | `commerce.orders` | `fk_payment_payment_intents_order_id_orders_numeric` |
| `provider_account_id_internal_id` | `payment.provider_accounts` | `fk_payment_payment_intents_provider_account_id_provider_c869` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_payment_intents_expires_at` | `CREATE INDEX ix_payment_intents_expires_at ON payment.payment_intents USING btree (expires_at)` |
| `ix_payment_intents_order` | `CREATE INDEX ix_payment_intents_order ON payment.payment_intents USING btree (order_id)` |
| `ix_payment_intents_provider_intent` | `CREATE INDEX ix_payment_intents_provider_intent ON payment.payment_intents USING btree (provider, provider_intent_id)` |
| `ix_payment_intents_revision_status` | `CREATE INDEX ix_payment_intents_revision_status ON payment.payment_intents USING btree (order_revision_id, status)` |
| `ix_payment_intents_status` | `CREATE INDEX ix_payment_intents_status ON payment.payment_intents USING btree (status)` |
| `payment_intent_idempotency` | `CREATE UNIQUE INDEX payment_intent_idempotency ON payment.payment_intents USING btree (idempotency_key)` |
| `pk_payment_payment_intents` | `CREATE UNIQUE INDEX pk_payment_payment_intents ON payment.payment_intents USING btree (internal_id)` |
| `uq_payment_payment_intents_id` | `CREATE UNIQUE INDEX uq_payment_payment_intents_id ON payment.payment_intents USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.payment_intents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["provider_account_id","provider_account_id_internal_id","payment","provider_accounts"]]', 'internal_id', 'id')` |
| `payment_revision_guard` | `CREATE TRIGGER payment_revision_guard BEFORE INSERT OR UPDATE ON payment.payment_intents FOR EACH ROW EXECUTE FUNCTION payment.guard_intent_revision()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.payment_intents FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.payment_intents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["provider_account_id","provider_account_id_internal_id","payment","provider_accounts"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
