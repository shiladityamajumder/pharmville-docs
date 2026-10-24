# `catalog.product_relationships`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds product relationships records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 14 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_product_relationships_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | See exact constraints |
| `priority` | `integer` | No | `0` | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `relationship_type` | `character varying(32)` | No | — | Inferred: stores relationship type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `source_product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_catalog_product_relationships_source_product_id_products) |
| `source_product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_catalog_product_relationships_source_product_id_prod_62c6); Numeric/public-key pair verification required |
| `target_product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_catalog_product_relationships_target_product_id_products) |
| `target_product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_catalog_product_relationships_target_product_id_prod_6cc5); Numeric/public-key pair verification required |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_product_relationships_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the product relationships business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.product_relationships` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_catalog_product_relationships_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_catalog_product_relationships_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `target_product_id` → `catalog.products(id)` via `fk_catalog_product_relationships_target_product_id_products`; `FOREIGN KEY (target_product_id) REFERENCES catalog.products(id) ON DELETE CASCADE`
- `source_product_id` → `catalog.products(id)` via `fk_catalog_product_relationships_source_product_id_products`; `FOREIGN KEY (source_product_id) REFERENCES catalog.products(id) ON DELETE CASCADE`
- `source_product_id_internal_id` → `catalog.products(internal_id)` via `fk_catalog_product_relationships_source_product_id_prod_62c6`; `FOREIGN KEY (source_product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE`
- `target_product_id_internal_id` → `catalog.products(internal_id)` via `fk_catalog_product_relationships_target_product_id_prod_6cc5`; `FOREIGN KEY (target_product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE`

## `catalog.product_relationships` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 14 columns, 14 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_product_relationships_created_by_users` |
| `updated_by` | `identity.users` | `fk_catalog_product_relationships_updated_by_users` |
| `target_product_id` | `catalog.products` | `fk_catalog_product_relationships_target_product_id_products` |
| `source_product_id` | `catalog.products` | `fk_catalog_product_relationships_source_product_id_products` |
| `source_product_id_internal_id` | `catalog.products` | `fk_catalog_product_relationships_source_product_id_prod_62c6` |
| `target_product_id_internal_id` | `catalog.products` | `fk_catalog_product_relationships_target_product_id_prod_6cc5` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_product_relationships_not_self_referential` | CHECK | `CHECK (source_product_id <> target_product_id)` |
| `ck_catalog_product_relationships_numeric_pair_source_product_id` | CHECK | `CHECK ((source_product_id IS NULL) = (source_product_id_internal_id IS NULL))` |
| `ck_catalog_product_relationships_numeric_pair_target_product_id` | CHECK | `CHECK ((target_product_id IS NULL) = (target_product_id_internal_id IS NULL))` |
| `ck_catalog_product_relationships_priority_nonnegative` | CHECK | `CHECK (priority >= 0)` |
| `ck_catalog_product_relationships_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_catalog_product_relationships_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_product_relationships_source_product_id_prod_62c6` | FOREIGN KEY | `FOREIGN KEY (source_product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| `fk_catalog_product_relationships_source_product_id_products` | FOREIGN KEY | `FOREIGN KEY (source_product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| `fk_catalog_product_relationships_target_product_id_prod_6cc5` | FOREIGN KEY | `FOREIGN KEY (target_product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| `fk_catalog_product_relationships_target_product_id_products` | FOREIGN KEY | `FOREIGN KEY (target_product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| `fk_catalog_product_relationships_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_catalog_product_relationships` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `product_relationship` | UNIQUE | `UNIQUE (source_product_id, target_product_id, relationship_type)` |
| `uq_catalog_product_relationships_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_catalog_product_relationships_source` | `CREATE INDEX ix_catalog_product_relationships_source ON catalog.product_relationships USING btree (source_product_id)` |
| `ix_catalog_product_relationships_target` | `CREATE INDEX ix_catalog_product_relationships_target ON catalog.product_relationships USING btree (target_product_id)` |
| `pk_catalog_product_relationships` | `CREATE UNIQUE INDEX pk_catalog_product_relationships ON catalog.product_relationships USING btree (internal_id)` |
| `product_relationship` | `CREATE UNIQUE INDEX product_relationship ON catalog.product_relationships USING btree (source_product_id, target_product_id, relationship_type)` |
| `uq_catalog_product_relationships_id` | `CREATE UNIQUE INDEX uq_catalog_product_relationships_id ON catalog.product_relationships USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_relationships FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["source_product_id","source_product_id_internal_id","catalog","products"],["target_product_id","target_product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.product_relationships FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_relationships FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["source_product_id","source_product_id_internal_id","catalog","products"],["target_product_id","target_product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
