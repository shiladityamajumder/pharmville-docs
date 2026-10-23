# catalog.substitution_group_products

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds substitution group products records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 12 columns, 12 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_substitution_group_products_created_by_users) |
| `group_id` | `uuid` | No | — | Reference linking this record to substitution groups | Ensures related business data can be joined and validated | FK → `catalog.substitution_groups` (fk_catalog_substitution_group_products_group_id_substit_4ece) |
| `group_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.substitution_groups` (fk_catalog_substitution_group_products_group_id_substit_4e48); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `priority` | `integer` | No | `0` | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_catalog_substitution_group_products_product_id_products) |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_catalog_substitution_group_products_product_id_produ_da79); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_substitution_group_products_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the substitution group products business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.substitution_group_products` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_catalog_substitution_group_products_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_catalog_substitution_group_products_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `product_id` → `catalog.products(id)` via `fk_catalog_substitution_group_products_product_id_products`; FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE
- `group_id` → `catalog.substitution_groups(id)` via `fk_catalog_substitution_group_products_group_id_substit_4ece`; FOREIGN KEY (group_id) REFERENCES catalog.substitution_groups(id) ON DELETE CASCADE
- `group_id_internal_id` → `catalog.substitution_groups(internal_id)` via `fk_catalog_substitution_group_products_group_id_substit_4e48`; FOREIGN KEY (group_id_internal_id) REFERENCES catalog.substitution_groups(internal_id) ON DELETE CASCADE
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_catalog_substitution_group_products_product_id_produ_da79`; FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE

## catalog.substitution_group_products — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 12 columns, 12 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_substitution_group_products_created_by_users` |
| `updated_by` | `identity.users` | `fk_catalog_substitution_group_products_updated_by_users` |
| `product_id` | `catalog.products` | `fk_catalog_substitution_group_products_product_id_products` |
| `group_id` | `catalog.substitution_groups` | `fk_catalog_substitution_group_products_group_id_substit_4ece` |
| `group_id_internal_id` | `catalog.substitution_groups` | `fk_catalog_substitution_group_products_group_id_substit_4e48` |
| `product_id_internal_id` | `catalog.products` | `fk_catalog_substitution_group_products_product_id_produ_da79` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_substitution_group_products_numeric_pair_group_id` | CHECK | `CHECK ((group_id IS NULL) = (group_id_internal_id IS NULL))` |
| `ck_catalog_substitution_group_products_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_catalog_substitution_group_products_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_catalog_substitution_group_products_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_substitution_group_products_group_id_substit_4e48` | FOREIGN KEY | `FOREIGN KEY (group_id_internal_id) REFERENCES catalog.substitution_groups(internal_id) ON DELETE CASCADE` |
| `fk_catalog_substitution_group_products_group_id_substit_4ece` | FOREIGN KEY | `FOREIGN KEY (group_id) REFERENCES catalog.substitution_groups(id) ON DELETE CASCADE` |
| `fk_catalog_substitution_group_products_product_id_produ_da79` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| `fk_catalog_substitution_group_products_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| `fk_catalog_substitution_group_products_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_catalog_substitution_group_products` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `substitution_group_product` | UNIQUE | `UNIQUE (group_id, product_id)` |
| `uq_catalog_substitution_group_products_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_catalog_substitution_group_products_product` | `CREATE INDEX ix_catalog_substitution_group_products_product ON catalog.substitution_group_products USING btree (product_id)` |
| `pk_catalog_substitution_group_products` | `CREATE UNIQUE INDEX pk_catalog_substitution_group_products ON catalog.substitution_group_products USING btree (internal_id)` |
| `substitution_group_product` | `CREATE UNIQUE INDEX substitution_group_product ON catalog.substitution_group_products USING btree (group_id, product_id)` |
| `uq_catalog_substitution_group_products_id` | `CREATE UNIQUE INDEX uq_catalog_substitution_group_products_id ON catalog.substitution_group_products USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.substitution_group_products FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["group_id","group_id_internal_id","catalog","substitution_groups"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.substitution_group_products FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.substitution_group_products FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["group_id","group_id_internal_id","catalog","substitution_groups"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
