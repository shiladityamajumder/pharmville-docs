# `membership.loyalty_accounts`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds loyalty accounts records within the membership domain (benefits and loyalty). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 11 columns, 9 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_membership_loyalty_accounts_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `points_balance` | `numeric(18,3)` | No | `0` | Inferred: stores points balance for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `tier` | `character varying(32)` | No | `'base'::character varying` | Inferred: stores tier for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `tier_expires_at` | `timestamp with time zone` | Yes | — | Time of tier expires | Support chronology, deadlines or audit evidence | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_membership_loyalty_accounts_updated_by_users) |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_membership_loyalty_accounts_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the loyalty accounts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `membership.loyalty_accounts` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_membership_loyalty_accounts_user_id_users`; `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE`
- `created_by` → `identity.users(id)` via `fk_membership_loyalty_accounts_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_membership_loyalty_accounts_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

**Referenced by 2 FK constraints** (sample): `membership.loyalty_ledger`, `membership.loyalty_ledger`.

## `membership.loyalty_accounts` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 11 columns, 9 constraints, 3 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_membership_loyalty_accounts_user_id_users` |
| `created_by` | `identity.users` | `fk_membership_loyalty_accounts_created_by_users` |
| `updated_by` | `identity.users` | `fk_membership_loyalty_accounts_updated_by_users` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_membership_loyalty_accounts` | `CREATE UNIQUE INDEX pk_membership_loyalty_accounts ON membership.loyalty_accounts USING btree (internal_id)` |
| `uq_membership_loyalty_accounts_id` | `CREATE UNIQUE INDEX uq_membership_loyalty_accounts_id ON membership.loyalty_accounts USING btree (id)` |
| `user_loyalty_account` | `CREATE UNIQUE INDEX user_loyalty_account ON membership.loyalty_accounts USING btree (user_id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON membership.loyalty_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON membership.loyalty_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON membership.loyalty_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
