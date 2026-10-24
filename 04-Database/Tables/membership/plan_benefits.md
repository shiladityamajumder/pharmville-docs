# `membership.plan_benefits`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds plan benefits records within the membership domain (benefits and loyalty). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | membership.plan_benefits |
| Classification | Configuration |
| Proposed business write owner | Future membership owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 10 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `benefit_code` | `character varying(64)` | No | — | Code for benefit | Link to controlled business classification or an external reference | Collation: default |
| `benefit_type` | `character varying(32)` | No | — | Inferred: stores benefit type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_membership_plan_benefits_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_membership_plan_benefits_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `plan_id` | `uuid` | No | — | Reference linking this record to plans | Ensures related business data can be joined and validated | FK → `membership.plans` via `fk_membership_plan_benefits_plan_id_plans` |
| `plan_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `membership.plans` via `fk_membership_plan_benefits_plan_id_plans_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `rules` | `jsonb` | No | — | Structured rules information | Retain a versioned payload or relevant details | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_membership_plan_benefits_updated_by_users` |
| `usage_limit` | `integer` | Yes | — | Inferred: stores usage limit for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the plan benefits business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `membership.plan_benefits` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_membership_plan_benefits_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_membership_plan_benefits_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_membership_plan_benefits_plan_id_plans | `plan_id` | [`membership.plans`](../../Tables/membership/plans.md) | `FOREIGN KEY (plan_id) REFERENCES membership.plans(id) ON DELETE CASCADE` |
| fk_membership_plan_benefits_plan_id_plans_numeric | `plan_id_internal_id` | [`membership.plans`](../../Tables/membership/plans.md) | `FOREIGN KEY (plan_id_internal_id) REFERENCES membership.plans(internal_id) ON DELETE CASCADE` |
| fk_membership_plan_benefits_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`membership.benefit_usage`](../../Tables/membership/benefit_usage.md) | fk_membership_benefit_usage_benefit_id_plan_benefits | `benefit_id` | `id` |
| [`membership.benefit_usage`](../../Tables/membership/benefit_usage.md) | fk_membership_benefit_usage_benefit_id_plan_benefits_numeric | `benefit_id_internal_id` | `internal_id` |

## `membership.plan_benefits` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_membership_plan_benefits_created_by_users` |
| `deleted_by` | `identity.users` | `fk_membership_plan_benefits_deleted_by_users` |
| `plan_id` | `membership.plans` | `fk_membership_plan_benefits_plan_id_plans` |
| `plan_id_internal_id` | `membership.plans` | `fk_membership_plan_benefits_plan_id_plans_numeric` |
| `updated_by` | `identity.users` | `fk_membership_plan_benefits_updated_by_users` |

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
| `plan_benefits_benefit_code_not_null` | NOT NULL | `NOT NULL benefit_code` |
| `plan_benefits_benefit_type_not_null` | NOT NULL | `NOT NULL benefit_type` |
| `plan_benefits_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `plan_benefits_id_not_null` | NOT NULL | `NOT NULL id` |
| `plan_benefits_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `plan_benefits_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `plan_benefits_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `plan_benefits_plan_id_internal_id_not_null` | NOT NULL | `NOT NULL plan_id_internal_id` |
| `plan_benefits_plan_id_not_null` | NOT NULL | `NOT NULL plan_id` |
| `plan_benefits_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `plan_benefits_rules_not_null` | NOT NULL | `NOT NULL rules` |
| `plan_benefits_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_membership_plan_benefits_plan` | btree | `(plan_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_membership_plan_benefits_plan ON membership.plan_benefits USING btree (plan_id)` |
| `pk_membership_plan_benefits` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_membership_plan_benefits ON membership.plan_benefits USING btree (internal_id)` |
| `plan_benefit_code` | btree | `(plan_id, benefit_code)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX plan_benefit_code ON membership.plan_benefits USING btree (plan_id, benefit_code)` |
| `uq_membership_plan_benefits_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_membership_plan_benefits_id ON membership.plan_benefits USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON membership.plan_benefits FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["plan_id","plan_id_internal_id","membership","plans"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON membership.plan_benefits FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON membership.plan_benefits FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["plan_id","plan_id_internal_id","membership","plans"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
