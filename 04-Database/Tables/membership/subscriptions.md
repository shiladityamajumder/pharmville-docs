# membership.subscriptions

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds subscriptions records within the membership domain (benefits and loyalty). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 19 columns, 15 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `auto_renew` | `boolean` | No | `false` | Inferred: stores auto renew for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `cancellation_reason` | `character varying(255)` | Yes | — | Inferred: stores cancellation reason for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `cancelled_at` | `timestamp with time zone` | Yes | — | Time of cancelled | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_membership_subscriptions_created_by_users) |
| `ends_at` | `timestamp with time zone` | No | — | Time of ends | Support chronology, deadlines or audit evidence | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `payment_method_id` | `uuid` | Yes | — | Reference linking this record to customer payment methods | Ensures related business data can be joined and validated | FK → `payment.customer_payment_methods` (fk_membership_subscriptions_payment_method_id_customer__142d) |
| `payment_method_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.customer_payment_methods` (fk_membership_subscriptions_payment_method_id_customer__d281); Numeric/public-key pair verification required |
| `plan_id` | `uuid` | No | — | Reference linking this record to plans | Ensures related business data can be joined and validated | FK → `membership.plans` (fk_membership_subscriptions_plan_id_plans) |
| `plan_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `membership.plans` (fk_membership_subscriptions_plan_id_plans_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `starts_at` | `timestamp with time zone` | No | — | Time of starts | Support chronology, deadlines or audit evidence | See exact constraints |
| `status` | `character varying(16)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `subscription_number` | `character varying(64)` | No | — | Inferred: stores subscription number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_membership_subscriptions_updated_by_users) |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_membership_subscriptions_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the subscriptions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `membership.subscriptions` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_membership_subscriptions_user_id_users`; FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE
- `created_by` → `identity.users(id)` via `fk_membership_subscriptions_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_membership_subscriptions_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `payment_method_id` → `payment.customer_payment_methods(id)` via `fk_membership_subscriptions_payment_method_id_customer__142d`; FOREIGN KEY (payment_method_id) REFERENCES payment.customer_payment_methods(id) ON DELETE SET NULL
- `plan_id` → `membership.plans(id)` via `fk_membership_subscriptions_plan_id_plans`; FOREIGN KEY (plan_id) REFERENCES membership.plans(id) ON DELETE RESTRICT
- `payment_method_id_internal_id` → `payment.customer_payment_methods(internal_id)` via `fk_membership_subscriptions_payment_method_id_customer__d281`; FOREIGN KEY (payment_method_id_internal_id) REFERENCES payment.customer_payment_methods(internal_id) ON DELETE SET NULL
- `plan_id_internal_id` → `membership.plans(internal_id)` via `fk_membership_subscriptions_plan_id_plans_numeric`; FOREIGN KEY (plan_id_internal_id) REFERENCES membership.plans(internal_id) ON DELETE RESTRICT

**Referenced by 2 FK constraints** (sample): `membership.benefit_usage`, `membership.benefit_usage`.

## membership.subscriptions — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 19 columns, 15 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_membership_subscriptions_user_id_users` |
| `created_by` | `identity.users` | `fk_membership_subscriptions_created_by_users` |
| `updated_by` | `identity.users` | `fk_membership_subscriptions_updated_by_users` |
| `payment_method_id` | `payment.customer_payment_methods` | `fk_membership_subscriptions_payment_method_id_customer__142d` |
| `plan_id` | `membership.plans` | `fk_membership_subscriptions_plan_id_plans` |
| `payment_method_id_internal_id` | `payment.customer_payment_methods` | `fk_membership_subscriptions_payment_method_id_customer__d281` |
| `plan_id_internal_id` | `membership.plans` | `fk_membership_subscriptions_plan_id_plans_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_membership_subscriptions_plan` | `CREATE INDEX ix_membership_subscriptions_plan ON membership.subscriptions USING btree (plan_id)` |
| `ix_membership_subscriptions_user_status` | `CREATE INDEX ix_membership_subscriptions_user_status ON membership.subscriptions USING btree (user_id, status)` |
| `pk_membership_subscriptions` | `CREATE UNIQUE INDEX pk_membership_subscriptions ON membership.subscriptions USING btree (internal_id)` |
| `uq_membership_subscriptions_id` | `CREATE UNIQUE INDEX uq_membership_subscriptions_id ON membership.subscriptions USING btree (id)` |
| `uq_membership_subscriptions_subscription_number` | `CREATE UNIQUE INDEX uq_membership_subscriptions_subscription_number ON membership.subscriptions USING btree (subscription_number)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON membership.subscriptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["payment_method_id","payment_method_id_internal_id","payment","customer_payment_methods"],["plan_id","plan_id_internal_id","membership","plans"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON membership.subscriptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON membership.subscriptions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["payment_method_id","payment_method_id_internal_id","payment","customer_payment_methods"],["plan_id","plan_id_internal_id","membership","plans"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
