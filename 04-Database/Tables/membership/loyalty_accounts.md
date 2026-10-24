# `membership.loyalty_accounts`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds loyalty accounts records within the membership domain (benefits and loyalty). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | membership.loyalty_accounts |
| Classification | Derived / Operational |
| Proposed business write owner | Future membership owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 11 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 8 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_membership_loyalty_accounts_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `points_balance` | `numeric(18,3)` | No | `0` | Inferred: stores points balance for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `tier` | `character varying(32)` | No | `'base'::character varying` | Inferred: stores tier for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `tier_expires_at` | `timestamp with time zone` | Yes | — | Time of tier expires | Support chronology, deadlines or audit evidence | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_membership_loyalty_accounts_updated_by_users` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_membership_loyalty_accounts_user_id_users` |

## Record lifecycle and users

- **Created:** when the loyalty accounts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `membership.loyalty_accounts` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_membership_loyalty_accounts_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_membership_loyalty_accounts_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_membership_loyalty_accounts_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`membership.loyalty_ledger`](../../Tables/membership/loyalty_ledger.md) | fk_membership_loyalty_ledger_loyalty_account_id_loyalty_c32f | `loyalty_account_id_internal_id` | `internal_id` |
| [`membership.loyalty_ledger`](../../Tables/membership/loyalty_ledger.md) | fk_membership_loyalty_ledger_loyalty_account_id_loyalty_ee85 | `loyalty_account_id` | `id` |

## `membership.loyalty_accounts` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_membership_loyalty_accounts_created_by_users` |
| `updated_by` | `identity.users` | `fk_membership_loyalty_accounts_updated_by_users` |
| `user_id` | `identity.users` | `fk_membership_loyalty_accounts_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_membership_loyalty_accounts_finite_numeric_values` | CHECK | `CHECK (points_balance IS NULL OR (points_balance <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_membership_loyalty_accounts_points_balance_nonnegative` | CHECK | `CHECK (points_balance >= 0::numeric)` |
| `ck_membership_loyalty_accounts_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_membership_loyalty_accounts_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_membership_loyalty_accounts_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_membership_loyalty_accounts_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_membership_loyalty_accounts` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_membership_loyalty_accounts_id` | UNIQUE | `UNIQUE (id)` |
| `user_loyalty_account` | UNIQUE | `UNIQUE (user_id)` |
| `loyalty_accounts_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `loyalty_accounts_id_not_null` | NOT NULL | `NOT NULL id` |
| `loyalty_accounts_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `loyalty_accounts_points_balance_not_null` | NOT NULL | `NOT NULL points_balance` |
| `loyalty_accounts_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `loyalty_accounts_tier_not_null` | NOT NULL | `NOT NULL tier` |
| `loyalty_accounts_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `loyalty_accounts_user_id_not_null` | NOT NULL | `NOT NULL user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_membership_loyalty_accounts` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_membership_loyalty_accounts ON membership.loyalty_accounts USING btree (internal_id)` |
| `uq_membership_loyalty_accounts_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_membership_loyalty_accounts_id ON membership.loyalty_accounts USING btree (id)` |
| `user_loyalty_account` | btree | `(user_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX user_loyalty_account ON membership.loyalty_accounts USING btree (user_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON membership.loyalty_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON membership.loyalty_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON membership.loyalty_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
