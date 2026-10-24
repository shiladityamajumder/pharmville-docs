# `catalog.product_identifiers`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds product identifiers records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 13 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_product_identifiers_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `identifier_type` | `character varying(32)` | No | — | Inferred: stores identifier type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `identifier_value` | `character varying(128)` | No | — | Inferred: stores identifier value for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_primary` | `boolean` | No | `false` | Yes/no flag for is primary | Control conditional business behavior | See exact constraints |
| `product_id` | `uuid` | Yes | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_catalog_product_identifiers_product_id_products) |
| `product_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_catalog_product_identifiers_product_id_products_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_product_identifiers_updated_by_users) |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` (fk_catalog_product_identifiers_variant_id_product_variants) |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` (fk_catalog_product_identifiers_variant_id_product_varia_946b); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the product identifiers business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.product_identifiers` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_catalog_product_identifiers_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_catalog_product_identifiers_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `product_id` → `catalog.products(id)` via `fk_catalog_product_identifiers_product_id_products`; `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE`
- `variant_id` → `catalog.product_variants(id)` via `fk_catalog_product_identifiers_variant_id_product_variants`; `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE CASCADE`
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_catalog_product_identifiers_product_id_products_numeric`; `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE`
- `variant_id_internal_id` → `catalog.product_variants(internal_id)` via `fk_catalog_product_identifiers_variant_id_product_varia_946b`; `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE CASCADE`

## `catalog.product_identifiers` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 14 columns, 13 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_product_identifiers_created_by_users` |
| `updated_by` | `identity.users` | `fk_catalog_product_identifiers_updated_by_users` |
| `product_id` | `catalog.products` | `fk_catalog_product_identifiers_product_id_products` |
| `variant_id` | `catalog.product_variants` | `fk_catalog_product_identifiers_variant_id_product_variants` |
| `product_id_internal_id` | `catalog.products` | `fk_catalog_product_identifiers_product_id_products_numeric` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_catalog_product_identifiers_variant_id_product_varia_946b` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_product_identifiers_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_catalog_product_identifiers_numeric_pair_variant_id` | CHECK | `CHECK ((variant_id IS NULL) = (variant_id_internal_id IS NULL))` |
| `ck_catalog_product_identifiers_product_or_variant_required` | CHECK | `CHECK (product_id IS NOT NULL OR variant_id IS NOT NULL)` |
| `ck_catalog_product_identifiers_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_catalog_product_identifiers_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_product_identifiers_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| `fk_catalog_product_identifiers_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| `fk_catalog_product_identifiers_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_product_identifiers_variant_id_product_varia_946b` | FOREIGN KEY | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE CASCADE` |
| `fk_catalog_product_identifiers_variant_id_product_variants` | FOREIGN KEY | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE CASCADE` |
| `pk_catalog_product_identifiers` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `product_identifier` | UNIQUE | `UNIQUE (identifier_type, identifier_value)` |
| `uq_catalog_product_identifiers_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_catalog_product_identifiers_product_id` | `CREATE INDEX ix_catalog_product_identifiers_product_id ON catalog.product_identifiers USING btree (product_id)` |
| `ix_catalog_product_identifiers_variant_id` | `CREATE INDEX ix_catalog_product_identifiers_variant_id ON catalog.product_identifiers USING btree (variant_id)` |
| `pk_catalog_product_identifiers` | `CREATE UNIQUE INDEX pk_catalog_product_identifiers ON catalog.product_identifiers USING btree (internal_id)` |
| `product_identifier` | `CREATE UNIQUE INDEX product_identifier ON catalog.product_identifiers USING btree (identifier_type, identifier_value)` |
| `uq_catalog_product_identifiers_id` | `CREATE UNIQUE INDEX uq_catalog_product_identifiers_id ON catalog.product_identifiers USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_identifiers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.product_identifiers FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_identifiers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
