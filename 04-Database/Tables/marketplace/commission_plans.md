# `marketplace.commission_plans`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds commission plans records within the marketplace domain (sellers and commercial listings). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | marketplace.commission_plans |
| Classification | Configuration |
| Proposed business write owner | Future marketplace owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 6 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `calculation_type` | `character varying(32)` | No | — | Inferred: stores calculation type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_marketplace_commission_plans_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_marketplace_commission_plans_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `name` | `character varying(128)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `rules` | `jsonb` | No | — | Structured rules information | Retain a versioned payload or relevant details | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_marketplace_commission_plans_updated_by_users` |
| `valid_from` | `timestamp with time zone` | No | — | Inferred: stores valid from for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `valid_until` | `timestamp with time zone` | Yes | — | Inferred: stores valid until for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the commission plans business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `marketplace.commission_plans` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_marketplace_commission_plans_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_marketplace_commission_plans_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_marketplace_commission_plans_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`marketplace.seller_commission_assignments`](../../Tables/marketplace/seller_commission_assignments.md) | fk_marketplace_seller_commission_assignments_commission_b453 | `commission_plan_id` | `id` |
| [`marketplace.seller_commission_assignments`](../../Tables/marketplace/seller_commission_assignments.md) | fk_marketplace_seller_commission_assignments_commission_de18 | `commission_plan_id_internal_id` | `internal_id` |
| [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | fk_domain_marketplace_sellers_commission_plan_id | `commission_plan_id` | `id` |
| [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | fk_domain_marketplace_sellers_commission_plan_id_numeric | `commission_plan_id_internal_id` | `internal_id` |

## `marketplace.commission_plans` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_marketplace_commission_plans_created_by_users` |
| `deleted_by` | `identity.users` | `fk_marketplace_commission_plans_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_marketplace_commission_plans_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_marketplace_commission_plans_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_marketplace_commission_plans_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_marketplace_commission_plans_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_marketplace_commission_plans_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_marketplace_commission_plans` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_marketplace_commission_plans_id` | UNIQUE | `UNIQUE (id)` |
| `commission_plans_calculation_type_not_null` | NOT NULL | `NOT NULL calculation_type` |
| `commission_plans_code_not_null` | NOT NULL | `NOT NULL code` |
| `commission_plans_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `commission_plans_id_not_null` | NOT NULL | `NOT NULL id` |
| `commission_plans_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `commission_plans_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `commission_plans_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `commission_plans_name_not_null` | NOT NULL | `NOT NULL name` |
| `commission_plans_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `commission_plans_rules_not_null` | NOT NULL | `NOT NULL rules` |
| `commission_plans_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `commission_plans_valid_from_not_null` | NOT NULL | `NOT NULL valid_from` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_marketplace_commission_plans` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_marketplace_commission_plans ON marketplace.commission_plans USING btree (internal_id)` |
| `uq_marketplace_commission_plan_code_active` | btree | `(code)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_marketplace_commission_plan_code_active ON marketplace.commission_plans USING btree (code) WHERE is_deleted = false` |
| `uq_marketplace_commission_plans_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_marketplace_commission_plans_id ON marketplace.commission_plans USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON marketplace.commission_plans FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON marketplace.commission_plans FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON marketplace.commission_plans FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
