# `catalog.product_relationships`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds product relationships records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | catalog.product_relationships |
| Classification | Mapping / Junction |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 14 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_product_relationships_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | Exact constraints below |
| `priority` | `integer` | No | `0` | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `relationship_type` | `character varying(32)` | No | — | Inferred: stores relationship type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `source_product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_catalog_product_relationships_source_product_id_products` |
| `source_product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_catalog_product_relationships_source_product_id_prod_62c6` |
| `target_product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_catalog_product_relationships_target_product_id_products` |
| `target_product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_catalog_product_relationships_target_product_id_prod_6cc5` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_product_relationships_updated_by_users` |

## Record lifecycle and users

- **Created:** when the product relationships business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.product_relationships` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_catalog_product_relationships_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_product_relationships_source_product_id_prod_62c6 | `source_product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (source_product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| fk_catalog_product_relationships_source_product_id_products | `source_product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (source_product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| fk_catalog_product_relationships_target_product_id_prod_6cc5 | `target_product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (target_product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| fk_catalog_product_relationships_target_product_id_products | `target_product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (target_product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| fk_catalog_product_relationships_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `catalog.product_relationships` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_product_relationships_created_by_users` |
| `source_product_id_internal_id` | `catalog.products` | `fk_catalog_product_relationships_source_product_id_prod_62c6` |
| `source_product_id` | `catalog.products` | `fk_catalog_product_relationships_source_product_id_products` |
| `target_product_id_internal_id` | `catalog.products` | `fk_catalog_product_relationships_target_product_id_prod_6cc5` |
| `target_product_id` | `catalog.products` | `fk_catalog_product_relationships_target_product_id_products` |
| `updated_by` | `identity.users` | `fk_catalog_product_relationships_updated_by_users` |

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
| `product_relationships_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `product_relationships_id_not_null` | NOT NULL | `NOT NULL id` |
| `product_relationships_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `product_relationships_metadata_json_not_null` | NOT NULL | `NOT NULL metadata_json` |
| `product_relationships_priority_not_null` | NOT NULL | `NOT NULL priority` |
| `product_relationships_relationship_type_not_null` | NOT NULL | `NOT NULL relationship_type` |
| `product_relationships_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `product_relationships_source_product_id_internal_id_not_null` | NOT NULL | `NOT NULL source_product_id_internal_id` |
| `product_relationships_source_product_id_not_null` | NOT NULL | `NOT NULL source_product_id` |
| `product_relationships_target_product_id_internal_id_not_null` | NOT NULL | `NOT NULL target_product_id_internal_id` |
| `product_relationships_target_product_id_not_null` | NOT NULL | `NOT NULL target_product_id` |
| `product_relationships_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_catalog_product_relationships_source` | btree | `(source_product_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_product_relationships_source ON catalog.product_relationships USING btree (source_product_id)` |
| `ix_catalog_product_relationships_target` | btree | `(target_product_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_product_relationships_target ON catalog.product_relationships USING btree (target_product_id)` |
| `pk_catalog_product_relationships` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_catalog_product_relationships ON catalog.product_relationships USING btree (internal_id)` |
| `product_relationship` | btree | `(source_product_id, target_product_id, relationship_type)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX product_relationship ON catalog.product_relationships USING btree (source_product_id, target_product_id, relationship_type)` |
| `uq_catalog_product_relationships_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_product_relationships_id ON catalog.product_relationships USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_relationships FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["source_product_id","source_product_id_internal_id","catalog","products"],["target_product_id","target_product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.product_relationships FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_relationships FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["source_product_id","source_product_id_internal_id","catalog","products"],["target_product_id","target_product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
