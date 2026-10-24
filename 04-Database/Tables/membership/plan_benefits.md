# `membership.plan_benefits`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds plan benefits records within the membership domain (benefits and loyalty). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 10 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `benefit_code` | `character varying(64)` | No | — | Code for benefit | Link to controlled business classification or an external reference | See exact constraints |
| `benefit_type` | `character varying(32)` | No | — | Inferred: stores benefit type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_membership_plan_benefits_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_membership_plan_benefits_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `plan_id` | `uuid` | No | — | Reference linking this record to plans | Ensures related business data can be joined and validated | FK → `membership.plans` (fk_membership_plan_benefits_plan_id_plans) |
| `plan_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `membership.plans` (fk_membership_plan_benefits_plan_id_plans_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `rules` | `jsonb` | No | — | Structured rules information | Retain a versioned payload or relevant details | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_membership_plan_benefits_updated_by_users) |
| `usage_limit` | `integer` | Yes | — | Inferred: stores usage limit for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the plan benefits business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `membership.plan_benefits` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_membership_plan_benefits_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_membership_plan_benefits_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_membership_plan_benefits_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `plan_id` → `membership.plans(id)` via `fk_membership_plan_benefits_plan_id_plans`; `FOREIGN KEY (plan_id) REFERENCES membership.plans(id) ON DELETE CASCADE`
- `plan_id_internal_id` → `membership.plans(internal_id)` via `fk_membership_plan_benefits_plan_id_plans_numeric`; `FOREIGN KEY (plan_id_internal_id) REFERENCES membership.plans(internal_id) ON DELETE CASCADE`

**Referenced by 2 FK constraints** (sample): `membership.benefit_usage`, `membership.benefit_usage`.

## `membership.plan_benefits` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 17 columns, 10 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_membership_plan_benefits_created_by_users` |
| `deleted_by` | `identity.users` | `fk_membership_plan_benefits_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_membership_plan_benefits_updated_by_users` |
| `plan_id` | `membership.plans` | `fk_membership_plan_benefits_plan_id_plans` |
| `plan_id_internal_id` | `membership.plans` | `fk_membership_plan_benefits_plan_id_plans_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_membership_plan_benefits_numeric_pair_plan_id` | CHECK | `CHECK ((plan_id IS NULL) = (plan_id_internal_id IS NULL))` |
| `ck_membership_plan_benefits_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_membership_plan_benefits_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_membership_plan_benefits_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_membership_plan_benefits_plan_id_plans` | FOREIGN KEY | `FOREIGN KEY (plan_id) REFERENCES membership.plans(id) ON DELETE CASCADE` |
| `fk_membership_plan_benefits_plan_id_plans_numeric` | FOREIGN KEY | `FOREIGN KEY (plan_id_internal_id) REFERENCES membership.plans(internal_id) ON DELETE CASCADE` |
| `fk_membership_plan_benefits_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_membership_plan_benefits` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `plan_benefit_code` | UNIQUE | `UNIQUE (plan_id, benefit_code)` |
| `uq_membership_plan_benefits_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_membership_plan_benefits_plan` | `CREATE INDEX ix_membership_plan_benefits_plan ON membership.plan_benefits USING btree (plan_id)` |
| `pk_membership_plan_benefits` | `CREATE UNIQUE INDEX pk_membership_plan_benefits ON membership.plan_benefits USING btree (internal_id)` |
| `plan_benefit_code` | `CREATE UNIQUE INDEX plan_benefit_code ON membership.plan_benefits USING btree (plan_id, benefit_code)` |
| `uq_membership_plan_benefits_id` | `CREATE UNIQUE INDEX uq_membership_plan_benefits_id ON membership.plan_benefits USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON membership.plan_benefits FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["plan_id","plan_id_internal_id","membership","plans"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON membership.plan_benefits FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON membership.plan_benefits FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["plan_id","plan_id_internal_id","membership","plans"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
