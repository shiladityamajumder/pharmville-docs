# `payment.customer_payment_methods`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds customer payment methods records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 8 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `card_last4` | `character varying(4)` | Yes | — | Inferred: stores card last4 for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `card_network` | `character varying(32)` | Yes | — | Inferred: stores card network for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_customer_payment_methods_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_customer_payment_methods_deleted_by_users) |
| `display_label` | `character varying(128)` | Yes | — | Inferred: stores display label for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `expiry_month` | `integer` | Yes | — | Inferred: stores expiry month for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `expiry_year` | `integer` | Yes | — | Inferred: stores expiry year for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_default` | `boolean` | No | `false` | Yes/no flag for is default | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `method_type` | `character varying(32)` | No | — | Inferred: stores method type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider_token` | `character varying(512)` | No | — | Inferred: stores provider token for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_customer_payment_methods_updated_by_users) |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_customer_payment_methods_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the customer payment methods business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.customer_payment_methods` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_payment_customer_payment_methods_user_id_users`; `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE`
- `created_by` → `identity.users(id)` via `fk_payment_customer_payment_methods_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_payment_customer_payment_methods_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_payment_customer_payment_methods_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

**Referenced by 2 FK constraints** (sample): `membership.subscriptions`, `membership.subscriptions`.

## `payment.customer_payment_methods` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 21 columns, 8 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_payment_customer_payment_methods_user_id_users` |
| `created_by` | `identity.users` | `fk_payment_customer_payment_methods_created_by_users` |
| `deleted_by` | `identity.users` | `fk_payment_customer_payment_methods_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_payment_customer_payment_methods_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_payment_customer_payment_methods_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_payment_customer_payment_methods_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_payment_customer_payment_methods_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_payment_customer_payment_methods_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_payment_customer_payment_methods_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_payment_customer_payment_methods` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_payment_customer_payment_methods_id` | UNIQUE | `UNIQUE (id)` |
| `user_provider_token` | UNIQUE | `UNIQUE (user_id, provider, provider_token)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_payment_customer_methods_user` | `CREATE INDEX ix_payment_customer_methods_user ON payment.customer_payment_methods USING btree (user_id)` |
| `pk_payment_customer_payment_methods` | `CREATE UNIQUE INDEX pk_payment_customer_payment_methods ON payment.customer_payment_methods USING btree (internal_id)` |
| `uq_payment_customer_payment_methods_id` | `CREATE UNIQUE INDEX uq_payment_customer_payment_methods_id ON payment.customer_payment_methods USING btree (id)` |
| `uq_payment_default_method_active` | `CREATE UNIQUE INDEX uq_payment_default_method_active ON payment.customer_payment_methods USING btree (user_id) WHERE is_default = true AND is_deleted = false` |
| `user_provider_token` | `CREATE UNIQUE INDEX user_provider_token ON payment.customer_payment_methods USING btree (user_id, provider, provider_token)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.customer_payment_methods FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.customer_payment_methods FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.customer_payment_methods FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
