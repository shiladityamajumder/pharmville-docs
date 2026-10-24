# `payment.customer_payment_methods`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds customer payment methods records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | payment.customer_payment_methods |
| Classification | Configuration |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 8 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `card_last4` | `character varying(4)` | Yes | — | Inferred: stores card last4 for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `card_network` | `character varying(32)` | Yes | — | Inferred: stores card network for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_customer_payment_methods_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_customer_payment_methods_deleted_by_users` |
| `display_label` | `character varying(128)` | Yes | — | Inferred: stores display label for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `expiry_month` | `integer` | Yes | — | Inferred: stores expiry month for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `expiry_year` | `integer` | Yes | — | Inferred: stores expiry year for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_default` | `boolean` | No | `false` | Yes/no flag for is default | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `method_type` | `character varying(32)` | No | — | Inferred: stores method type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider_token` | `character varying(512)` | No | — | Inferred: stores provider token for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_customer_payment_methods_updated_by_users` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_customer_payment_methods_user_id_users` |

## Record lifecycle and users

- **Created:** when the customer payment methods business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.customer_payment_methods` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_payment_customer_payment_methods_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_payment_customer_payment_methods_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_payment_customer_payment_methods_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_payment_customer_payment_methods_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`membership.subscriptions`](../../Tables/membership/subscriptions.md) | fk_membership_subscriptions_payment_method_id_customer__142d | `payment_method_id` | `id` |
| [`membership.subscriptions`](../../Tables/membership/subscriptions.md) | fk_membership_subscriptions_payment_method_id_customer__d281 | `payment_method_id_internal_id` | `internal_id` |

## `payment.customer_payment_methods` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_payment_customer_payment_methods_created_by_users` |
| `deleted_by` | `identity.users` | `fk_payment_customer_payment_methods_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_payment_customer_payment_methods_updated_by_users` |
| `user_id` | `identity.users` | `fk_payment_customer_payment_methods_user_id_users` |

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
| `customer_payment_methods_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `customer_payment_methods_id_not_null` | NOT NULL | `NOT NULL id` |
| `customer_payment_methods_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `customer_payment_methods_is_default_not_null` | NOT NULL | `NOT NULL is_default` |
| `customer_payment_methods_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `customer_payment_methods_method_type_not_null` | NOT NULL | `NOT NULL method_type` |
| `customer_payment_methods_provider_not_null` | NOT NULL | `NOT NULL provider` |
| `customer_payment_methods_provider_token_not_null` | NOT NULL | `NOT NULL provider_token` |
| `customer_payment_methods_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `customer_payment_methods_status_not_null` | NOT NULL | `NOT NULL status` |
| `customer_payment_methods_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `customer_payment_methods_user_id_not_null` | NOT NULL | `NOT NULL user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_payment_customer_methods_user` | btree | `(user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_customer_methods_user ON payment.customer_payment_methods USING btree (user_id)` |
| `pk_payment_customer_payment_methods` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_payment_customer_payment_methods ON payment.customer_payment_methods USING btree (internal_id)` |
| `uq_payment_customer_payment_methods_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_payment_customer_payment_methods_id ON payment.customer_payment_methods USING btree (id)` |
| `uq_payment_default_method_active` | btree | `(user_id)` | is_default = true AND is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_payment_default_method_active ON payment.customer_payment_methods USING btree (user_id) WHERE is_default = true AND is_deleted = false` |
| `user_provider_token` | btree | `(user_id, provider, provider_token)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX user_provider_token ON payment.customer_payment_methods USING btree (user_id, provider, provider_token)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.customer_payment_methods FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.customer_payment_methods FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.customer_payment_methods FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
