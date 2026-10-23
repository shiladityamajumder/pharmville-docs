# marketplace.commission_plans

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds commission plans records within the marketplace domain (sellers and commercial listings). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 6 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `calculation_type` | `character varying(32)` | No | — | Inferred: stores calculation type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_marketplace_commission_plans_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_marketplace_commission_plans_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `name` | `character varying(128)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `rules` | `jsonb` | No | — | Structured rules information | Retain a versioned payload or relevant details | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_marketplace_commission_plans_updated_by_users) |
| `valid_from` | `timestamp with time zone` | No | — | Inferred: stores valid from for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `valid_until` | `timestamp with time zone` | Yes | — | Inferred: stores valid until for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the commission plans business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `marketplace.commission_plans` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_marketplace_commission_plans_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_marketplace_commission_plans_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_marketplace_commission_plans_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT

**Referenced by 4 FK constraints** (sample): `marketplace.seller_commission_assignments`, `marketplace.sellers`, `marketplace.seller_commission_assignments`, `marketplace.sellers`.

## marketplace.commission_plans — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 17 columns, 6 constraints, 3 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_marketplace_commission_plans_created_by_users` |
| `deleted_by` | `identity.users` | `fk_marketplace_commission_plans_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_marketplace_commission_plans_updated_by_users` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_marketplace_commission_plans_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_marketplace_commission_plans_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_marketplace_commission_plans_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_marketplace_commission_plans_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_marketplace_commission_plans` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_marketplace_commission_plans_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_marketplace_commission_plans` | `CREATE UNIQUE INDEX pk_marketplace_commission_plans ON marketplace.commission_plans USING btree (internal_id)` |
| `uq_marketplace_commission_plan_code_active` | `CREATE UNIQUE INDEX uq_marketplace_commission_plan_code_active ON marketplace.commission_plans USING btree (code) WHERE is_deleted = false` |
| `uq_marketplace_commission_plans_id` | `CREATE UNIQUE INDEX uq_marketplace_commission_plans_id ON marketplace.commission_plans USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON marketplace.commission_plans FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON marketplace.commission_plans FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON marketplace.commission_plans FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
