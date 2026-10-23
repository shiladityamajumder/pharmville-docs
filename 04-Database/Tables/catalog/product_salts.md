# catalog.product_salts

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds product salts records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 13 columns, 13 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_product_salts_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_catalog_product_salts_product_id_products) |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_catalog_product_salts_product_id_products_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `salt_id` | `uuid` | No | — | Reference linking this record to salts | Ensures related business data can be joined and validated | FK → `catalog.salts` (fk_catalog_product_salts_salt_id_salts) |
| `salt_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.salts` (fk_catalog_product_salts_salt_id_salts_numeric); Numeric/public-key pair verification required |
| `sequence` | `smallint` | No | `1` | Inferred: stores sequence for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `strength` | `character varying(128)` | Yes | — | Inferred: stores strength for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_product_salts_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the product salts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.product_salts` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_catalog_product_salts_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_catalog_product_salts_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `salt_id` → `catalog.salts(id)` via `fk_catalog_product_salts_salt_id_salts`; FOREIGN KEY (salt_id) REFERENCES catalog.salts(id) ON DELETE RESTRICT
- `product_id` → `catalog.products(id)` via `fk_catalog_product_salts_product_id_products`; FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_catalog_product_salts_product_id_products_numeric`; FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE
- `salt_id_internal_id` → `catalog.salts(internal_id)` via `fk_catalog_product_salts_salt_id_salts_numeric`; FOREIGN KEY (salt_id_internal_id) REFERENCES catalog.salts(internal_id) ON DELETE RESTRICT

## catalog.product_salts — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 13 columns, 13 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_product_salts_created_by_users` |
| `updated_by` | `identity.users` | `fk_catalog_product_salts_updated_by_users` |
| `salt_id` | `catalog.salts` | `fk_catalog_product_salts_salt_id_salts` |
| `product_id` | `catalog.products` | `fk_catalog_product_salts_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_catalog_product_salts_product_id_products_numeric` |
| `salt_id_internal_id` | `catalog.salts` | `fk_catalog_product_salts_salt_id_salts_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_product_salts_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_catalog_product_salts_numeric_pair_salt_id` | CHECK | `CHECK ((salt_id IS NULL) = (salt_id_internal_id IS NULL))` |
| `ck_catalog_product_salts_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_catalog_product_salts_sequence_positive` | CHECK | `CHECK (sequence > 0)` |
| `fk_catalog_product_salts_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_product_salts_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| `fk_catalog_product_salts_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| `fk_catalog_product_salts_salt_id_salts` | FOREIGN KEY | `FOREIGN KEY (salt_id) REFERENCES catalog.salts(id) ON DELETE RESTRICT` |
| `fk_catalog_product_salts_salt_id_salts_numeric` | FOREIGN KEY | `FOREIGN KEY (salt_id_internal_id) REFERENCES catalog.salts(internal_id) ON DELETE RESTRICT` |
| `fk_catalog_product_salts_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_catalog_product_salts` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `product_salt_sequence` | UNIQUE | `UNIQUE (product_id, salt_id, sequence)` |
| `uq_catalog_product_salts_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_catalog_product_salts_product_id` | `CREATE INDEX ix_catalog_product_salts_product_id ON catalog.product_salts USING btree (product_id)` |
| `ix_catalog_product_salts_salt_id` | `CREATE INDEX ix_catalog_product_salts_salt_id ON catalog.product_salts USING btree (salt_id)` |
| `pk_catalog_product_salts` | `CREATE UNIQUE INDEX pk_catalog_product_salts ON catalog.product_salts USING btree (internal_id)` |
| `product_salt_sequence` | `CREATE UNIQUE INDEX product_salt_sequence ON catalog.product_salts USING btree (product_id, salt_id, sequence)` |
| `uq_catalog_product_salts_id` | `CREATE UNIQUE INDEX uq_catalog_product_salts_id ON catalog.product_salts USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_salts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["salt_id","salt_id_internal_id","catalog","salts"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.product_salts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_salts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["salt_id","salt_id_internal_id","catalog","salts"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
