# membership.plans

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds plans records within the membership domain (benefits and loyalty). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 18 columns, 9 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `auto_renew_supported` | `boolean` | No | `true` | Inferred: stores auto renew supported for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_membership_plans_created_by_users) |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | See exact constraints |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_membership_plans_deleted_by_users) |
| `description` | `text` | Yes | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `duration_days` | `integer` | No | — | Inferred: stores duration days for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `price` | `numeric(14,2)` | No | — | Inferred: stores price for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_membership_plans_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the plans business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `membership.plans` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_membership_plans_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_membership_plans_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_membership_plans_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT

**Referenced by 4 FK constraints** (sample): `membership.plan_benefits`, `membership.subscriptions`, `membership.plan_benefits`, `membership.subscriptions`.

## membership.plans — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 18 columns, 9 constraints, 3 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_membership_plans_created_by_users` |
| `deleted_by` | `identity.users` | `fk_membership_plans_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_membership_plans_updated_by_users` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_membership_plans_duration_positive` | CHECK | `CHECK (duration_days > 0)` |
| `ck_membership_plans_finite_numeric_values` | CHECK | `CHECK (price IS NULL OR (price <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_membership_plans_price_nonnegative` | CHECK | `CHECK (price >= 0::numeric)` |
| `ck_membership_plans_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_membership_plans_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_membership_plans_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_membership_plans_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_membership_plans` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_membership_plans_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_membership_plans` | `CREATE UNIQUE INDEX pk_membership_plans ON membership.plans USING btree (internal_id)` |
| `uq_membership_plan_code_active` | `CREATE UNIQUE INDEX uq_membership_plan_code_active ON membership.plans USING btree (code) WHERE is_deleted = false` |
| `uq_membership_plans_id` | `CREATE UNIQUE INDEX uq_membership_plans_id ON membership.plans USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON membership.plans FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON membership.plans FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON membership.plans FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
