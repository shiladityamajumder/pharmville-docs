# `catalog.product_regulatory`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds product regulatory records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | catalog.product_regulatory |
| Classification | Configuration |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 20 columns; 11 PK/FK/UQ/CHECK/exclusion constraints; 13 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `controlled_substance` | `boolean` | No | `false` | Inferred: stores controlled substance for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_product_regulatory_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_product_regulatory_deleted_by_users` |
| `drug_license_category` | `character varying(64)` | Yes | — | Inferred: stores drug license category for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `max_order_quantity` | `numeric(12,3)` | Yes | — | Max order quantity value | Track resource or item amounts accurately | Exact constraints below |
| `narcotic_register_required` | `boolean` | No | `false` | Inferred: stores narcotic register required for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_catalog_product_regulatory_product_id_products` |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_catalog_product_regulatory_product_id_products_numeric` |
| `regulatory_metadata` | `jsonb` | No | `'{}'::jsonb` | Structured regulatory metadata information | Retain a versioned payload or relevant details | Exact constraints below |
| `requires_age_verification` | `boolean` | No | `false` | Inferred: stores requires age verification for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `requires_cold_chain` | `boolean` | No | `false` | Inferred: stores requires cold chain for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `storage_conditions` | `text` | Yes | — | Inferred: stores storage conditions for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_product_regulatory_updated_by_users` |

## Record lifecycle and users

- **Created:** when the product regulatory business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.product_regulatory` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_catalog_product_regulatory_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_product_regulatory_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_product_regulatory_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| fk_catalog_product_regulatory_product_id_products_numeric | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| fk_catalog_product_regulatory_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `catalog.product_regulatory` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_product_regulatory_created_by_users` |
| `deleted_by` | `identity.users` | `fk_catalog_product_regulatory_deleted_by_users` |
| `product_id` | `catalog.products` | `fk_catalog_product_regulatory_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_catalog_product_regulatory_product_id_products_numeric` |
| `updated_by` | `identity.users` | `fk_catalog_product_regulatory_updated_by_users` |

### Existing constraints

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
| `product_regulatory_controlled_substance_not_null` | NOT NULL | `NOT NULL controlled_substance` |
| `product_regulatory_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `product_regulatory_id_not_null` | NOT NULL | `NOT NULL id` |
| `product_regulatory_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `product_regulatory_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `product_regulatory_narcotic_register_required_not_null` | NOT NULL | `NOT NULL narcotic_register_required` |
| `product_regulatory_product_id_internal_id_not_null` | NOT NULL | `NOT NULL product_id_internal_id` |
| `product_regulatory_product_id_not_null` | NOT NULL | `NOT NULL product_id` |
| `product_regulatory_regulatory_metadata_not_null` | NOT NULL | `NOT NULL regulatory_metadata` |
| `product_regulatory_requires_age_verification_not_null` | NOT NULL | `NOT NULL requires_age_verification` |
| `product_regulatory_requires_cold_chain_not_null` | NOT NULL | `NOT NULL requires_cold_chain` |
| `product_regulatory_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `product_regulatory_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_catalog_product_regulatory` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_catalog_product_regulatory ON catalog.product_regulatory USING btree (internal_id)` |
| `uq_catalog_product_regulatory_active` | btree | `(product_id)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_product_regulatory_active ON catalog.product_regulatory USING btree (product_id) WHERE is_deleted = false` |
| `uq_catalog_product_regulatory_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_product_regulatory_id ON catalog.product_regulatory USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_regulatory FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.product_regulatory FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_regulatory FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
