# `catalog.product_salts`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds product salts records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | catalog.product_salts |
| Classification | Mapping / Junction |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 13 columns; 13 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_product_salts_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_catalog_product_salts_product_id_products` |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_catalog_product_salts_product_id_products_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `salt_id` | `uuid` | No | — | Reference linking this record to salts | Ensures related business data can be joined and validated | FK → `catalog.salts` via `fk_catalog_product_salts_salt_id_salts` |
| `salt_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.salts` via `fk_catalog_product_salts_salt_id_salts_numeric` |
| `sequence` | `smallint` | No | `1` | Inferred: stores sequence for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `strength` | `character varying(128)` | Yes | — | Inferred: stores strength for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_product_salts_updated_by_users` |

## Record lifecycle and users

- **Created:** when the product salts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.product_salts` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_catalog_product_salts_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_product_salts_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| fk_catalog_product_salts_product_id_products_numeric | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| fk_catalog_product_salts_salt_id_salts | `salt_id` | [`catalog.salts`](../../Tables/catalog/salts.md) | `FOREIGN KEY (salt_id) REFERENCES catalog.salts(id) ON DELETE RESTRICT` |
| fk_catalog_product_salts_salt_id_salts_numeric | `salt_id_internal_id` | [`catalog.salts`](../../Tables/catalog/salts.md) | `FOREIGN KEY (salt_id_internal_id) REFERENCES catalog.salts(internal_id) ON DELETE RESTRICT` |
| fk_catalog_product_salts_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `catalog.product_salts` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_product_salts_created_by_users` |
| `product_id` | `catalog.products` | `fk_catalog_product_salts_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_catalog_product_salts_product_id_products_numeric` |
| `salt_id` | `catalog.salts` | `fk_catalog_product_salts_salt_id_salts` |
| `salt_id_internal_id` | `catalog.salts` | `fk_catalog_product_salts_salt_id_salts_numeric` |
| `updated_by` | `identity.users` | `fk_catalog_product_salts_updated_by_users` |

### Existing constraints

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
| `product_salts_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `product_salts_id_not_null` | NOT NULL | `NOT NULL id` |
| `product_salts_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `product_salts_product_id_internal_id_not_null` | NOT NULL | `NOT NULL product_id_internal_id` |
| `product_salts_product_id_not_null` | NOT NULL | `NOT NULL product_id` |
| `product_salts_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `product_salts_salt_id_internal_id_not_null` | NOT NULL | `NOT NULL salt_id_internal_id` |
| `product_salts_salt_id_not_null` | NOT NULL | `NOT NULL salt_id` |
| `product_salts_sequence_not_null` | NOT NULL | `NOT NULL sequence` |
| `product_salts_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_catalog_product_salts_product_id` | btree | `(product_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_product_salts_product_id ON catalog.product_salts USING btree (product_id)` |
| `ix_catalog_product_salts_salt_id` | btree | `(salt_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_product_salts_salt_id ON catalog.product_salts USING btree (salt_id)` |
| `pk_catalog_product_salts` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_catalog_product_salts ON catalog.product_salts USING btree (internal_id)` |
| `product_salt_sequence` | btree | `(product_id, salt_id, sequence)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX product_salt_sequence ON catalog.product_salts USING btree (product_id, salt_id, sequence)` |
| `uq_catalog_product_salts_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_product_salts_id ON catalog.product_salts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_salts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["salt_id","salt_id_internal_id","catalog","salts"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.product_salts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_salts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["salt_id","salt_id_internal_id","catalog","salts"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
