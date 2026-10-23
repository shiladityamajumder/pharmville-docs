# catalog.product_regulatory

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds product regulatory records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 20 columns, 11 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `controlled_substance` | `boolean` | No | `false` | Inferred: stores controlled substance for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_product_regulatory_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_product_regulatory_deleted_by_users) |
| `drug_license_category` | `character varying(64)` | Yes | — | Inferred: stores drug license category for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `max_order_quantity` | `numeric(12,3)` | Yes | — | Max order quantity value | Track resource or item amounts accurately | See exact constraints |
| `narcotic_register_required` | `boolean` | No | `false` | Inferred: stores narcotic register required for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_catalog_product_regulatory_product_id_products) |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_catalog_product_regulatory_product_id_products_numeric); Numeric/public-key pair verification required |
| `regulatory_metadata` | `jsonb` | No | `'{}'::jsonb` | Structured regulatory metadata information | Retain a versioned payload or relevant details | See exact constraints |
| `requires_age_verification` | `boolean` | No | `false` | Inferred: stores requires age verification for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `requires_cold_chain` | `boolean` | No | `false` | Inferred: stores requires cold chain for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `storage_conditions` | `text` | Yes | — | Inferred: stores storage conditions for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_product_regulatory_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the product regulatory business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.product_regulatory` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_catalog_product_regulatory_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_catalog_product_regulatory_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_catalog_product_regulatory_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `product_id` → `catalog.products(id)` via `fk_catalog_product_regulatory_product_id_products`; FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_catalog_product_regulatory_product_id_products_numeric`; FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE

## catalog.product_regulatory — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 20 columns, 11 constraints, 3 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_product_regulatory_created_by_users` |
| `deleted_by` | `identity.users` | `fk_catalog_product_regulatory_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_catalog_product_regulatory_updated_by_users` |
| `product_id` | `catalog.products` | `fk_catalog_product_regulatory_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_catalog_product_regulatory_product_id_products_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_product_regulatory_finite_numeric_values` | CHECK | `CHECK (max_order_quantity IS NULL OR (max_order_quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_catalog_product_regulatory_max_order_quantity_positive` | CHECK | `CHECK (max_order_quantity IS NULL OR max_order_quantity > 0::numeric)` |
| `ck_catalog_product_regulatory_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_catalog_product_regulatory_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_catalog_product_regulatory_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_product_regulatory_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_product_regulatory_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| `fk_catalog_product_regulatory_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| `fk_catalog_product_regulatory_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_catalog_product_regulatory` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_catalog_product_regulatory_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_catalog_product_regulatory` | `CREATE UNIQUE INDEX pk_catalog_product_regulatory ON catalog.product_regulatory USING btree (internal_id)` |
| `uq_catalog_product_regulatory_active` | `CREATE UNIQUE INDEX uq_catalog_product_regulatory_active ON catalog.product_regulatory USING btree (product_id) WHERE is_deleted = false` |
| `uq_catalog_product_regulatory_id` | `CREATE UNIQUE INDEX uq_catalog_product_regulatory_id ON catalog.product_regulatory USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_regulatory FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.product_regulatory FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_regulatory FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
