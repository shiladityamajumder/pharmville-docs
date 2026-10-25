# `catalog.categories`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds categories records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | catalog.categories |
| Classification | Master / Reference |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 19 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 13 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 5 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_categories_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_categories_deleted_by_users` |
| `display_order` | `integer` | No | `0` | Inferred: stores display order for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `level` | `smallint` | No | — | Inferred: stores level for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | Exact constraints below |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `parent_id` | `uuid` | Yes | — | Reference linking this record to categories | Ensures related business data can be joined and validated | FK → `catalog.categories` via `fk_catalog_categories_parent_id_categories` |
| `parent_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.categories` via `fk_catalog_categories_parent_id_categories_numeric` |
| `path` | `character varying(1024)` | No | — | Inferred: stores path for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `slug` | `character varying(255)` | No | — | Inferred: stores slug for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_categories_updated_by_users` |

## Record lifecycle and users

- **Created:** when the categories business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.categories` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_catalog_categories_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_categories_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_categories_parent_id_categories | `parent_id` | [`catalog.categories`](../../Tables/catalog/categories.md) | `FOREIGN KEY (parent_id) REFERENCES catalog.categories(id) ON DELETE SET NULL` |
| fk_catalog_categories_parent_id_categories_numeric | `parent_id_internal_id` | [`catalog.categories`](../../Tables/catalog/categories.md) | `FOREIGN KEY (parent_id_internal_id) REFERENCES catalog.categories(internal_id) ON DELETE SET NULL` |
| fk_catalog_categories_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`catalog.categories`](../../Tables/catalog/categories.md) | fk_catalog_categories_parent_id_categories | `parent_id` | `id` |
| [`catalog.categories`](../../Tables/catalog/categories.md) | fk_catalog_categories_parent_id_categories_numeric | `parent_id_internal_id` | `internal_id` |
| [`catalog.products`](../../Tables/catalog/products.md) | fk_catalog_products_category_id_categories | `category_id` | `id` |
| [`catalog.products`](../../Tables/catalog/products.md) | fk_catalog_products_category_id_categories_numeric | `category_id_internal_id` | `internal_id` |

## `catalog.categories` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_categories_created_by_users` |
| `deleted_by` | `identity.users` | `fk_catalog_categories_deleted_by_users` |
| `parent_id` | `catalog.categories` | `fk_catalog_categories_parent_id_categories` |
| `parent_id_internal_id` | `catalog.categories` | `fk_catalog_categories_parent_id_categories_numeric` |
| `updated_by` | `identity.users` | `fk_catalog_categories_updated_by_users` |

### Existing constraints

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
| `categories_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `categories_display_order_not_null` | NOT NULL | `NOT NULL display_order` |
| `categories_id_not_null` | NOT NULL | `NOT NULL id` |
| `categories_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `categories_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `categories_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `categories_level_not_null` | NOT NULL | `NOT NULL level` |
| `categories_metadata_json_not_null` | NOT NULL | `NOT NULL metadata_json` |
| `categories_name_not_null` | NOT NULL | `NOT NULL name` |
| `categories_path_not_null` | NOT NULL | `NOT NULL path` |
| `categories_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `categories_slug_not_null` | NOT NULL | `NOT NULL slug` |
| `categories_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_catalog_categories_parent_id` | btree | `(parent_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_categories_parent_id ON catalog.categories USING btree (parent_id)` |
| `ix_catalog_categories_path` | btree | `(path)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_categories_path ON catalog.categories USING btree (path)` |
| `pk_catalog_categories` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_catalog_categories ON catalog.categories USING btree (internal_id)` |
| `uq_catalog_categories_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_categories_id ON catalog.categories USING btree (id)` |
| `uq_catalog_categories_slug_active` | btree | `(slug)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_categories_slug_active ON catalog.categories USING btree (slug) WHERE is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.categories FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["parent_id","parent_id_internal_id","catalog","categories"]]', 'internal_id', 'id')` | O |
| `category_parent_guard` | `CREATE TRIGGER category_parent_guard BEFORE INSERT OR UPDATE OF parent_id ON catalog.categories FOR EACH ROW EXECUTE FUNCTION catalog.guard_category_parent()` | O |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON catalog.categories FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('slug', '[]')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.categories FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.categories FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["parent_id","parent_id_internal_id","catalog","categories"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `catalog.categories` |
| Category | Master / Reference — Customer browse taxonomy and hierarchy |
| Proposed owner / maintenance role | Product_Catalog / Catalog Manager |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `catalog.categories`, `catalog.products` |
| Features | `ACC-07`, `ADM-06`, `ADM-07`, `CAT-01`, `CAT-02`, `CAT-03`, `CAT-04`, `CHK-01`, `CHK-02`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08`, `INV-01`, `INV-03`, `OMS-05`, `STO-03` |
| API consumers | [API-010](../../../03-Modules/Product_Catalog/APIs.md), [API-011](../../../03-Modules/Product_Catalog/APIs.md), [API-012](../../../03-Modules/Product_Catalog/APIs.md), [API-013](../../../03-Modules/Product_Catalog/APIs.md), [API-014](../../../03-Modules/Product_Catalog/APIs.md), [API-015](../../../03-Modules/Product_Catalog/APIs.md), [API-016](../../../03-Modules/Product_Catalog/APIs.md), [API-017](../../../03-Modules/Product_Catalog/APIs.md), [API-018](../../../03-Modules/Cart_Checkout/APIs.md), [API-019](../../../03-Modules/Cart_Checkout/APIs.md), [API-020](../../../03-Modules/Cart_Checkout/APIs.md), [API-021](../../../03-Modules/Cart_Checkout/APIs.md), [API-043](../../../03-Modules/Order_Operations/APIs.md), [API-048](../../../03-Modules/Store_Operations/APIs.md), [API-052](../../../03-Modules/Inventory/APIs.md), [ACC-ROUTE-008](../../../03-Modules/Customer_Accounts/APIs.md), [ACC-ROUTE-009](../../../03-Modules/Customer_Accounts/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source | Additional schema attributes |
| --- | --- | --- | --- | --- | --- |
| personal-care | Personal care | Initial nonclinical browse category proposal; does not imply product eligibility. | Proposed | CAT-01 / ADM-06; taxonomy needs Catalog approval | slug=personal-care; level=0; parent_id=null; path=/personal-care; display_order=0; is_active=true; metadata_json={} |
| wellness | Wellness | Initial nonclinical browse category proposal; does not imply product eligibility. | Proposed | CAT-01 / ADM-06; taxonomy needs Catalog approval | slug=wellness; level=0; parent_id=null; path=/wellness; display_order=1; is_active=true; metadata_json={} |
| health-devices | Health devices | Initial nonclinical browse category proposal; does not imply product eligibility. | Proposed | CAT-01 / ADM-06; taxonomy needs Catalog approval | slug=health-devices; level=0; parent_id=null; path=/health-devices; display_order=2; is_active=true; metadata_json={} |

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Catalog Manager through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use is_active=false to retire from new selection; keep referenced history. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_catalog_categories_id ON catalog.categories USING btree (id); CREATE UNIQUE INDEX uq_catalog_categories_slug_active ON catalog.categories USING btree (slug) WHERE is_deleted = false |
| Foreign-key dependencies | `catalog.categories` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Explicit rows above are Confirmed domain values or Proposed initial records, never observed production/seed data. No live row existence or seed execution was verified. |
| Pending decisions | D-024 ownership/lifecycle approval; D-006/D-019 clinical/catalog source validation. |
