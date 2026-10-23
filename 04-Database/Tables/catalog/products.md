# catalog.products

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds products records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 39 columns, 26 constraints, 9 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `brand_id` | `uuid` | Yes | — | Reference linking this record to brands | Ensures related business data can be joined and validated | FK → `catalog.brands` (fk_catalog_products_brand_id_brands) |
| `brand_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.brands` (fk_catalog_products_brand_id_brands_numeric); Numeric/public-key pair verification required |
| `category_id` | `uuid` | Yes | — | Reference linking this record to categories | Ensures related business data can be joined and validated | FK → `catalog.categories` (fk_catalog_products_category_id_categories) |
| `category_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.categories` (fk_catalog_products_category_id_categories_numeric); Numeric/public-key pair verification required |
| `commerce_class` | `character varying(1)` | Yes | — | Reference linking this record to commerce classes | Ensures related business data can be joined and validated | FK → `catalog.commerce_classes` (fk_catalog_products_commerce_class_commerce_classes) |
| `commerce_class_approved_at` | `timestamp with time zone` | Yes | — | Time of commerce class approved | Support chronology, deadlines or audit evidence | See exact constraints |
| `commerce_class_approved_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_products_commerce_class_approved_by_user_id_users) |
| `commerce_class_version` | `bigint` | No | `1` | Inferred: stores commerce class version for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_products_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_products_deleted_by_users) |
| `discontinued_at` | `timestamp with time zone` | Yes | — | Time of discontinued | Support chronology, deadlines or audit evidence | See exact constraints |
| `display_name` | `character varying(255)` | Yes | — | Inferred: stores display name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `dosage_form_id` | `uuid` | Yes | — | Reference linking this record to dosage forms | Ensures related business data can be joined and validated | FK → `catalog.dosage_forms` (fk_catalog_products_dosage_form_id_dosage_forms) |
| `dosage_form_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.dosage_forms` (fk_catalog_products_dosage_form_id_dosage_forms_numeric); Numeric/public-key pair verification required |
| `hsn_code` | `character varying(32)` | Yes | — | Code for hsn | Link to controlled business classification or an external reference | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `is_returnable` | `boolean` | No | `true` | Yes/no flag for is returnable | Control conditional business behavior | See exact constraints |
| `manufacturer_id` | `uuid` | Yes | — | Reference linking this record to manufacturers | Ensures related business data can be joined and validated | FK → `catalog.manufacturers` (fk_catalog_products_manufacturer_id_manufacturers) |
| `manufacturer_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.manufacturers` (fk_catalog_products_manufacturer_id_manufacturers_numeric); Numeric/public-key pair verification required |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `pack_size_display` | `character varying(128)` | Yes | — | Inferred: stores pack size display for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `prescription_required` | `boolean` | No | `false` | Inferred: stores prescription required for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `product_type` | `character varying(16)` | No | — | Inferred: stores product type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `published_at` | `timestamp with time zone` | Yes | — | Time of published | Support chronology, deadlines or audit evidence | See exact constraints |
| `return_window_days` | `integer` | Yes | — | Inferred: stores return window days for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `schedule_class` | `character varying(32)` | Yes | — | Inferred: stores schedule class for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `search_keywords` | `jsonb` | No | `'[]'::jsonb` | Structured search keywords information | Retain a versioned payload or relevant details | See exact constraints |
| `sku` | `character varying(64)` | No | — | Inferred: stores sku for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `slug` | `character varying(255)` | No | — | Inferred: stores slug for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `status` | `character varying(16)` | No | `'draft'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `strength_display` | `character varying(128)` | Yes | — | Inferred: stores strength display for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `tax_code` | `character varying(64)` | Yes | — | Code for tax | Link to controlled business classification or an external reference | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_products_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the products business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.products` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `commerce_class_approved_by_user_id` → `identity.users(id)` via `fk_catalog_products_commerce_class_approved_by_user_id_users`; FOREIGN KEY (commerce_class_approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `commerce_class` → `catalog.commerce_classes(code)` via `fk_catalog_products_commerce_class_commerce_classes`; FOREIGN KEY (commerce_class) REFERENCES catalog.commerce_classes(code) ON DELETE RESTRICT
- `created_by` → `identity.users(id)` via `fk_catalog_products_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_catalog_products_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_catalog_products_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `dosage_form_id` → `catalog.dosage_forms(id)` via `fk_catalog_products_dosage_form_id_dosage_forms`; FOREIGN KEY (dosage_form_id) REFERENCES catalog.dosage_forms(id) ON DELETE SET NULL
- `category_id` → `catalog.categories(id)` via `fk_catalog_products_category_id_categories`; FOREIGN KEY (category_id) REFERENCES catalog.categories(id) ON DELETE SET NULL
- `brand_id` → `catalog.brands(id)` via `fk_catalog_products_brand_id_brands`; FOREIGN KEY (brand_id) REFERENCES catalog.brands(id) ON DELETE SET NULL
- `manufacturer_id` → `catalog.manufacturers(id)` via `fk_catalog_products_manufacturer_id_manufacturers`; FOREIGN KEY (manufacturer_id) REFERENCES catalog.manufacturers(id) ON DELETE SET NULL
- `brand_id_internal_id` → `catalog.brands(internal_id)` via `fk_catalog_products_brand_id_brands_numeric`; FOREIGN KEY (brand_id_internal_id) REFERENCES catalog.brands(internal_id) ON DELETE SET NULL
- `category_id_internal_id` → `catalog.categories(internal_id)` via `fk_catalog_products_category_id_categories_numeric`; FOREIGN KEY (category_id_internal_id) REFERENCES catalog.categories(internal_id) ON DELETE SET NULL
- `dosage_form_id_internal_id` → `catalog.dosage_forms(internal_id)` via `fk_catalog_products_dosage_form_id_dosage_forms_numeric`; FOREIGN KEY (dosage_form_id_internal_id) REFERENCES catalog.dosage_forms(internal_id) ON DELETE SET NULL
- `manufacturer_id_internal_id` → `catalog.manufacturers(internal_id)` via `fk_catalog_products_manufacturer_id_manufacturers_numeric`; FOREIGN KEY (manufacturer_id_internal_id) REFERENCES catalog.manufacturers(internal_id) ON DELETE SET NULL

**Referenced by 50 FK constraints** (sample): `catalog.product_variants`, `catalog.product_identifiers`, `catalog.product_salts`, `catalog.product_attributes`, `catalog.product_media`, `catalog.product_relationships`, `catalog.product_relationships`, `catalog.product_regulatory`, `catalog.product_content`, `catalog.substitution_group_products`, `clinical.patient_medications`, `clinical.prescription_items`.

## catalog.products — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 39 columns, 26 constraints, 9 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `commerce_class_approved_by_user_id` | `identity.users` | `fk_catalog_products_commerce_class_approved_by_user_id_users` |
| `commerce_class` | `catalog.commerce_classes` | `fk_catalog_products_commerce_class_commerce_classes` |
| `created_by` | `identity.users` | `fk_catalog_products_created_by_users` |
| `deleted_by` | `identity.users` | `fk_catalog_products_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_catalog_products_updated_by_users` |
| `dosage_form_id` | `catalog.dosage_forms` | `fk_catalog_products_dosage_form_id_dosage_forms` |
| `category_id` | `catalog.categories` | `fk_catalog_products_category_id_categories` |
| `brand_id` | `catalog.brands` | `fk_catalog_products_brand_id_brands` |
| `manufacturer_id` | `catalog.manufacturers` | `fk_catalog_products_manufacturer_id_manufacturers` |
| `brand_id_internal_id` | `catalog.brands` | `fk_catalog_products_brand_id_brands_numeric` |
| `category_id_internal_id` | `catalog.categories` | `fk_catalog_products_category_id_categories_numeric` |
| `dosage_form_id_internal_id` | `catalog.dosage_forms` | `fk_catalog_products_dosage_form_id_dosage_forms_numeric` |
| `manufacturer_id_internal_id` | `catalog.manufacturers` | `fk_catalog_products_manufacturer_id_manufacturers_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_products_commerce_class` | CHECK | `CHECK (commerce_class IS NULL OR (commerce_class::text = ANY (ARRAY['P'::text, 'M'::text, 'O'::text])))` |
| `ck_catalog_products_commerce_class_prescription` | CHECK | `CHECK (commerce_class IS NULL OR prescription_required = (commerce_class::text = 'P'::text))` |
| `ck_catalog_products_commerce_class_version_positive` | CHECK | `CHECK (commerce_class_version > 0)` |
| `ck_catalog_products_numeric_pair_brand_id` | CHECK | `CHECK ((brand_id IS NULL) = (brand_id_internal_id IS NULL))` |
| `ck_catalog_products_numeric_pair_category_id` | CHECK | `CHECK ((category_id IS NULL) = (category_id_internal_id IS NULL))` |
| `ck_catalog_products_numeric_pair_dosage_form_id` | CHECK | `CHECK ((dosage_form_id IS NULL) = (dosage_form_id_internal_id IS NULL))` |
| `ck_catalog_products_numeric_pair_manufacturer_id` | CHECK | `CHECK ((manufacturer_id IS NULL) = (manufacturer_id_internal_id IS NULL))` |
| `ck_catalog_products_productstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['draft'::text, 'review'::text, 'active'::text, 'inactive'::text, 'discontinued'::text, 'recalled'::text]))` |
| `ck_catalog_products_producttype` | CHECK | `CHECK (product_type::text = ANY (ARRAY['medicine'::text, 'otc'::text, 'device'::text, 'wellness'::text, 'lab_test'::text, 'service'::text]))` |
| `ck_catalog_products_return_window_nonnegative` | CHECK | `CHECK (return_window_days IS NULL OR return_window_days >= 0)` |
| `ck_catalog_products_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_catalog_products_brand_id_brands` | FOREIGN KEY | `FOREIGN KEY (brand_id) REFERENCES catalog.brands(id) ON DELETE SET NULL` |
| `fk_catalog_products_brand_id_brands_numeric` | FOREIGN KEY | `FOREIGN KEY (brand_id_internal_id) REFERENCES catalog.brands(internal_id) ON DELETE SET NULL` |
| `fk_catalog_products_category_id_categories` | FOREIGN KEY | `FOREIGN KEY (category_id) REFERENCES catalog.categories(id) ON DELETE SET NULL` |
| `fk_catalog_products_category_id_categories_numeric` | FOREIGN KEY | `FOREIGN KEY (category_id_internal_id) REFERENCES catalog.categories(internal_id) ON DELETE SET NULL` |
| `fk_catalog_products_commerce_class_approved_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (commerce_class_approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_products_commerce_class_commerce_classes` | FOREIGN KEY | `FOREIGN KEY (commerce_class) REFERENCES catalog.commerce_classes(code) ON DELETE RESTRICT` |
| `fk_catalog_products_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_products_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_products_dosage_form_id_dosage_forms` | FOREIGN KEY | `FOREIGN KEY (dosage_form_id) REFERENCES catalog.dosage_forms(id) ON DELETE SET NULL` |
| `fk_catalog_products_dosage_form_id_dosage_forms_numeric` | FOREIGN KEY | `FOREIGN KEY (dosage_form_id_internal_id) REFERENCES catalog.dosage_forms(internal_id) ON DELETE SET NULL` |
| `fk_catalog_products_manufacturer_id_manufacturers` | FOREIGN KEY | `FOREIGN KEY (manufacturer_id) REFERENCES catalog.manufacturers(id) ON DELETE SET NULL` |
| `fk_catalog_products_manufacturer_id_manufacturers_numeric` | FOREIGN KEY | `FOREIGN KEY (manufacturer_id_internal_id) REFERENCES catalog.manufacturers(internal_id) ON DELETE SET NULL` |
| `fk_catalog_products_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_catalog_products` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_catalog_products_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_catalog_products_brand_id` | `CREATE INDEX ix_catalog_products_brand_id ON catalog.products USING btree (brand_id)` |
| `ix_catalog_products_category_id` | `CREATE INDEX ix_catalog_products_category_id ON catalog.products USING btree (category_id)` |
| `ix_catalog_products_manufacturer_id` | `CREATE INDEX ix_catalog_products_manufacturer_id ON catalog.products USING btree (manufacturer_id)` |
| `ix_catalog_products_status_commerce_class` | `CREATE INDEX ix_catalog_products_status_commerce_class ON catalog.products USING btree (status, commerce_class) WHERE is_deleted = false` |
| `ix_catalog_products_status_type` | `CREATE INDEX ix_catalog_products_status_type ON catalog.products USING btree (status, product_type)` |
| `pk_catalog_products` | `CREATE UNIQUE INDEX pk_catalog_products ON catalog.products USING btree (internal_id)` |
| `uq_catalog_products_id` | `CREATE UNIQUE INDEX uq_catalog_products_id ON catalog.products USING btree (id)` |
| `uq_catalog_products_sku_active` | `CREATE UNIQUE INDEX uq_catalog_products_sku_active ON catalog.products USING btree (sku) WHERE is_deleted = false` |
| `uq_catalog_products_slug_active` | `CREATE UNIQUE INDEX uq_catalog_products_slug_active ON catalog.products USING btree (slug) WHERE is_deleted = false` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.products FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["brand_id","brand_id_internal_id","catalog","brands"],["category_id","category_id_internal_id","catalog","categories"],["dosage_form_id","dosage_form_id_internal_id","catalog","dosage_forms"],["manufacturer_id","manufacturer_id_internal_id","catalog","manufacturers"]]', 'internal_id', 'id')` |
| `product_classification_guard` | `CREATE TRIGGER product_classification_guard BEFORE INSERT OR UPDATE ON catalog.products FOR EACH ROW EXECUTE FUNCTION catalog.guard_classification()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.products FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.products FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["brand_id","brand_id_internal_id","catalog","brands"],["category_id","category_id_internal_id","catalog","categories"],["dosage_form_id","dosage_form_id_internal_id","catalog","dosage_forms"],["manufacturer_id","manufacturer_id_internal_id","catalog","manufacturers"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
