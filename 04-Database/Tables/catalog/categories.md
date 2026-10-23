# catalog.categories

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds categories records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 19 columns, 12 constraints, 5 indexes, 5 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_categories_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_categories_deleted_by_users) |
| `display_order` | `integer` | No | `0` | Inferred: stores display order for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `level` | `smallint` | No | — | Inferred: stores level for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | See exact constraints |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `parent_id` | `uuid` | Yes | — | Reference linking this record to categories | Ensures related business data can be joined and validated | FK → `catalog.categories` (fk_catalog_categories_parent_id_categories) |
| `parent_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.categories` (fk_catalog_categories_parent_id_categories_numeric); Numeric/public-key pair verification required |
| `path` | `character varying(1024)` | No | — | Inferred: stores path for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `slug` | `character varying(255)` | No | — | Inferred: stores slug for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_categories_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the categories business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.categories` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_catalog_categories_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_catalog_categories_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_catalog_categories_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `parent_id` → `catalog.categories(id)` via `fk_catalog_categories_parent_id_categories`; FOREIGN KEY (parent_id) REFERENCES catalog.categories(id) ON DELETE SET NULL
- `parent_id_internal_id` → `catalog.categories(internal_id)` via `fk_catalog_categories_parent_id_categories_numeric`; FOREIGN KEY (parent_id_internal_id) REFERENCES catalog.categories(internal_id) ON DELETE SET NULL

**Referenced by 4 FK constraints** (sample): `catalog.categories`, `catalog.products`, `catalog.categories`, `catalog.products`.

## catalog.categories — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 19 columns, 12 constraints, 5 indexes, 5 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_categories_created_by_users` |
| `deleted_by` | `identity.users` | `fk_catalog_categories_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_catalog_categories_updated_by_users` |
| `parent_id` | `catalog.categories` | `fk_catalog_categories_parent_id_categories` |
| `parent_id_internal_id` | `catalog.categories` | `fk_catalog_categories_parent_id_categories_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_categories_display_order_nonnegative` | CHECK | `CHECK (display_order >= 0)` |
| `ck_catalog_categories_level_nonnegative` | CHECK | `CHECK (level >= 0)` |
| `ck_catalog_categories_numeric_pair_parent_id` | CHECK | `CHECK ((parent_id IS NULL) = (parent_id_internal_id IS NULL))` |
| `ck_catalog_categories_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_catalog_categories_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(slug::text)) > 0 AND slug::text = btrim(slug::text))` |
| `fk_catalog_categories_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_categories_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_categories_parent_id_categories` | FOREIGN KEY | `FOREIGN KEY (parent_id) REFERENCES catalog.categories(id) ON DELETE SET NULL` |
| `fk_catalog_categories_parent_id_categories_numeric` | FOREIGN KEY | `FOREIGN KEY (parent_id_internal_id) REFERENCES catalog.categories(internal_id) ON DELETE SET NULL` |
| `fk_catalog_categories_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_catalog_categories` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_catalog_categories_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_catalog_categories_parent_id` | `CREATE INDEX ix_catalog_categories_parent_id ON catalog.categories USING btree (parent_id)` |
| `ix_catalog_categories_path` | `CREATE INDEX ix_catalog_categories_path ON catalog.categories USING btree (path)` |
| `pk_catalog_categories` | `CREATE UNIQUE INDEX pk_catalog_categories ON catalog.categories USING btree (internal_id)` |
| `uq_catalog_categories_id` | `CREATE UNIQUE INDEX uq_catalog_categories_id ON catalog.categories USING btree (id)` |
| `uq_catalog_categories_slug_active` | `CREATE UNIQUE INDEX uq_catalog_categories_slug_active ON catalog.categories USING btree (slug) WHERE is_deleted = false` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.categories FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["parent_id","parent_id_internal_id","catalog","categories"]]', 'internal_id', 'id')` |
| `category_parent_guard` | `CREATE TRIGGER category_parent_guard BEFORE INSERT OR UPDATE OF parent_id ON catalog.categories FOR EACH ROW EXECUTE FUNCTION catalog.guard_category_parent()` |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON catalog.categories FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('slug', '[]')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.categories FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.categories FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["parent_id","parent_id_internal_id","catalog","categories"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
