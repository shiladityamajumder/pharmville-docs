# `catalog.brands`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds brands records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 18 columns, 13 constraints, 4 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_brands_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_brands_deleted_by_users) |
| `description` | `text` | Yes | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `logo_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_catalog_brands_logo_file_id_file_objects) |
| `logo_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_catalog_brands_logo_file_id_file_objects_numeric); Numeric/public-key pair verification required |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `owner_organization_id` | `uuid` | Yes | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` (fk_catalog_brands_owner_organization_id_organizations) |
| `owner_organization_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` (fk_catalog_brands_owner_organization_id_organizations_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `slug` | `character varying(255)` | No | — | Inferred: stores slug for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_brands_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the brands business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.brands` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `deleted_by` → `identity.users(id)` via `fk_catalog_brands_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_catalog_brands_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `created_by` → `identity.users(id)` via `fk_catalog_brands_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `logo_file_id` → `platform.file_objects(id)` via `fk_catalog_brands_logo_file_id_file_objects`; `FOREIGN KEY (logo_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL`
- `owner_organization_id` → `organization.organizations(id)` via `fk_catalog_brands_owner_organization_id_organizations`; `FOREIGN KEY (owner_organization_id) REFERENCES organization.organizations(id) ON DELETE SET NULL`
- `logo_file_id_internal_id` → `platform.file_objects(internal_id)` via `fk_catalog_brands_logo_file_id_file_objects_numeric`; `FOREIGN KEY (logo_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL`
- `owner_organization_id_internal_id` → `organization.organizations(internal_id)` via `fk_catalog_brands_owner_organization_id_organizations_numeric`; `FOREIGN KEY (owner_organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE SET NULL`

**Referenced by 2 FK constraints** (sample): `catalog.products`, `catalog.products`.

## `catalog.brands` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 18 columns, 13 constraints, 4 indexes, 4 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `deleted_by` | `identity.users` | `fk_catalog_brands_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_catalog_brands_updated_by_users` |
| `created_by` | `identity.users` | `fk_catalog_brands_created_by_users` |
| `logo_file_id` | `platform.file_objects` | `fk_catalog_brands_logo_file_id_file_objects` |
| `owner_organization_id` | `organization.organizations` | `fk_catalog_brands_owner_organization_id_organizations` |
| `logo_file_id_internal_id` | `platform.file_objects` | `fk_catalog_brands_logo_file_id_file_objects_numeric` |
| `owner_organization_id_internal_id` | `organization.organizations` | `fk_catalog_brands_owner_organization_id_organizations_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_brands_numeric_pair_logo_file_id` | CHECK | `CHECK ((logo_file_id IS NULL) = (logo_file_id_internal_id IS NULL))` |
| `ck_catalog_brands_numeric_pair_owner_organization_id` | CHECK | `CHECK ((owner_organization_id IS NULL) = (owner_organization_id_internal_id IS NULL))` |
| `ck_catalog_brands_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_catalog_brands_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(slug::text)) > 0 AND slug::text = btrim(slug::text))` |
| `fk_catalog_brands_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_brands_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_brands_logo_file_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (logo_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| `fk_catalog_brands_logo_file_id_file_objects_numeric` | FOREIGN KEY | `FOREIGN KEY (logo_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| `fk_catalog_brands_owner_organization_id_organizations` | FOREIGN KEY | `FOREIGN KEY (owner_organization_id) REFERENCES organization.organizations(id) ON DELETE SET NULL` |
| `fk_catalog_brands_owner_organization_id_organizations_numeric` | FOREIGN KEY | `FOREIGN KEY (owner_organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE SET NULL` |
| `fk_catalog_brands_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_catalog_brands` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_catalog_brands_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_catalog_brands` | `CREATE UNIQUE INDEX pk_catalog_brands ON catalog.brands USING btree (internal_id)` |
| `uq_catalog_brands_id` | `CREATE UNIQUE INDEX uq_catalog_brands_id ON catalog.brands USING btree (id)` |
| `uq_catalog_brands_name_active` | `CREATE UNIQUE INDEX uq_catalog_brands_name_active ON catalog.brands USING btree (name) WHERE is_deleted = false` |
| `uq_catalog_brands_slug_active` | `CREATE UNIQUE INDEX uq_catalog_brands_slug_active ON catalog.brands USING btree (slug) WHERE is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.brands FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["logo_file_id","logo_file_id_internal_id","platform","file_objects"],["owner_organization_id","owner_organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON catalog.brands FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('slug', '[]')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.brands FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.brands FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["logo_file_id","logo_file_id_internal_id","platform","file_objects"],["owner_organization_id","owner_organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
