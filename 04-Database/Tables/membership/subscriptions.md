# `membership.subscriptions`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds subscriptions records within the membership domain (benefits and loyalty). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | membership.subscriptions |
| Classification | Transactional |
| Proposed business write owner | Future membership owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 19 columns; 15 PK/FK/UQ/CHECK/exclusion constraints; 13 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `auto_renew` | `boolean` | No | `false` | Inferred: stores auto renew for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `cancellation_reason` | `character varying(255)` | Yes | — | Inferred: stores cancellation reason for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `cancelled_at` | `timestamp with time zone` | Yes | — | Time of cancelled | Support chronology, deadlines or audit evidence | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_membership_subscriptions_created_by_users` |
| `ends_at` | `timestamp with time zone` | No | — | Time of ends | Support chronology, deadlines or audit evidence | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `payment_method_id` | `uuid` | Yes | — | Reference linking this record to customer payment methods | Ensures related business data can be joined and validated | FK → `payment.customer_payment_methods` via `fk_membership_subscriptions_payment_method_id_customer__142d` |
| `payment_method_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.customer_payment_methods` via `fk_membership_subscriptions_payment_method_id_customer__d281` |
| `plan_id` | `uuid` | No | — | Reference linking this record to plans | Ensures related business data can be joined and validated | FK → `membership.plans` via `fk_membership_subscriptions_plan_id_plans` |
| `plan_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `membership.plans` via `fk_membership_subscriptions_plan_id_plans_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `starts_at` | `timestamp with time zone` | No | — | Time of starts | Support chronology, deadlines or audit evidence | Exact constraints below |
| `status` | `character varying(16)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `subscription_number` | `character varying(64)` | No | — | Inferred: stores subscription number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_membership_subscriptions_updated_by_users` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_membership_subscriptions_user_id_users` |

## Record lifecycle and users

- **Created:** when the subscriptions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `membership.subscriptions` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_membership_subscriptions_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_membership_subscriptions_payment_method_id_customer__142d | `payment_method_id` | [`payment.customer_payment_methods`](../../Tables/payment/customer_payment_methods.md) | `FOREIGN KEY (payment_method_id) REFERENCES payment.customer_payment_methods(id) ON DELETE SET NULL` |
| fk_membership_subscriptions_payment_method_id_customer__d281 | `payment_method_id_internal_id` | [`payment.customer_payment_methods`](../../Tables/payment/customer_payment_methods.md) | `FOREIGN KEY (payment_method_id_internal_id) REFERENCES payment.customer_payment_methods(internal_id) ON DELETE SET NULL` |
| fk_membership_subscriptions_plan_id_plans | `plan_id` | [`membership.plans`](../../Tables/membership/plans.md) | `FOREIGN KEY (plan_id) REFERENCES membership.plans(id) ON DELETE RESTRICT` |
| fk_membership_subscriptions_plan_id_plans_numeric | `plan_id_internal_id` | [`membership.plans`](../../Tables/membership/plans.md) | `FOREIGN KEY (plan_id_internal_id) REFERENCES membership.plans(internal_id) ON DELETE RESTRICT` |
| fk_membership_subscriptions_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_membership_subscriptions_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`membership.benefit_usage`](../../Tables/membership/benefit_usage.md) | fk_membership_benefit_usage_subscription_id_subscriptio_1c27 | `subscription_id_internal_id` | `internal_id` |
| [`membership.benefit_usage`](../../Tables/membership/benefit_usage.md) | fk_membership_benefit_usage_subscription_id_subscriptions | `subscription_id` | `id` |

## `membership.subscriptions` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_membership_subscriptions_created_by_users` |
| `payment_method_id` | `payment.customer_payment_methods` | `fk_membership_subscriptions_payment_method_id_customer__142d` |
| `payment_method_id_internal_id` | `payment.customer_payment_methods` | `fk_membership_subscriptions_payment_method_id_customer__d281` |
| `plan_id` | `membership.plans` | `fk_membership_subscriptions_plan_id_plans` |
| `plan_id_internal_id` | `membership.plans` | `fk_membership_subscriptions_plan_id_plans_numeric` |
| `updated_by` | `identity.users` | `fk_membership_subscriptions_updated_by_users` |
| `user_id` | `identity.users` | `fk_membership_subscriptions_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_membership_subscriptions_numeric_pair_payment_method_id` | CHECK | `CHECK ((payment_method_id IS NULL) = (payment_method_id_internal_id IS NULL))` |
| `ck_membership_subscriptions_numeric_pair_plan_id` | CHECK | `CHECK ((plan_id IS NULL) = (plan_id_internal_id IS NULL))` |
| `ck_membership_subscriptions_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_membership_subscriptions_subscriptionstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['pending'::text, 'active'::text, 'paused'::text, 'cancelled'::text, 'expired'::text]))` |
| `ck_membership_subscriptions_valid_window` | CHECK | `CHECK (ends_at > starts_at)` |
| `fk_membership_subscriptions_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_membership_subscriptions_payment_method_id_customer__142d` | FOREIGN KEY | `FOREIGN KEY (payment_method_id) REFERENCES payment.customer_payment_methods(id) ON DELETE SET NULL` |
| `fk_membership_subscriptions_payment_method_id_customer__d281` | FOREIGN KEY | `FOREIGN KEY (payment_method_id_internal_id) REFERENCES payment.customer_payment_methods(internal_id) ON DELETE SET NULL` |
| `fk_membership_subscriptions_plan_id_plans` | FOREIGN KEY | `FOREIGN KEY (plan_id) REFERENCES membership.plans(id) ON DELETE RESTRICT` |
| `fk_membership_subscriptions_plan_id_plans_numeric` | FOREIGN KEY | `FOREIGN KEY (plan_id_internal_id) REFERENCES membership.plans(internal_id) ON DELETE RESTRICT` |
| `fk_membership_subscriptions_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_membership_subscriptions_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_membership_subscriptions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_membership_subscriptions_id` | UNIQUE | `UNIQUE (id)` |
| `uq_membership_subscriptions_subscription_number` | UNIQUE | `UNIQUE (subscription_number)` |
| `subscriptions_auto_renew_not_null` | NOT NULL | `NOT NULL auto_renew` |
| `subscriptions_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `subscriptions_ends_at_not_null` | NOT NULL | `NOT NULL ends_at` |
| `subscriptions_id_not_null` | NOT NULL | `NOT NULL id` |
| `subscriptions_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `subscriptions_plan_id_internal_id_not_null` | NOT NULL | `NOT NULL plan_id_internal_id` |
| `subscriptions_plan_id_not_null` | NOT NULL | `NOT NULL plan_id` |
| `subscriptions_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `subscriptions_starts_at_not_null` | NOT NULL | `NOT NULL starts_at` |
| `subscriptions_status_not_null` | NOT NULL | `NOT NULL status` |
| `subscriptions_subscription_number_not_null` | NOT NULL | `NOT NULL subscription_number` |
| `subscriptions_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `subscriptions_user_id_not_null` | NOT NULL | `NOT NULL user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_membership_subscriptions_plan` | btree | `(plan_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_membership_subscriptions_plan ON membership.subscriptions USING btree (plan_id)` |
| `ix_membership_subscriptions_user_status` | btree | `(user_id, status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_membership_subscriptions_user_status ON membership.subscriptions USING btree (user_id, status)` |
| `pk_membership_subscriptions` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_membership_subscriptions ON membership.subscriptions USING btree (internal_id)` |
| `uq_membership_subscriptions_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_membership_subscriptions_id ON membership.subscriptions USING btree (id)` |
| `uq_membership_subscriptions_subscription_number` | btree | `(subscription_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_membership_subscriptions_subscription_number ON membership.subscriptions USING btree (subscription_number)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON membership.subscriptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["payment_method_id","payment_method_id_internal_id","payment","customer_payment_methods"],["plan_id","plan_id_internal_id","membership","plans"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON membership.subscriptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON membership.subscriptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["payment_method_id","payment_method_id_internal_id","payment","customer_payment_methods"],["plan_id","plan_id_internal_id","membership","plans"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
