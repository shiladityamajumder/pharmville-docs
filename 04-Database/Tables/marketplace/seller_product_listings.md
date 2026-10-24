# `marketplace.seller_product_listings`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds seller product listings records within the marketplace domain (sellers and commercial listings). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | marketplace.seller_product_listings |
| Classification | Mapping / Junction |
| Proposed business write owner | Future marketplace owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 17 PK/FK/UQ/CHECK/exclusion constraints; 14 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_marketplace_seller_product_listings_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_marketplace_seller_product_listings_deleted_by_users` |
| `fulfillment_mode` | `character varying(32)` | No | `'platform'::character varying` | Inferred: stores fulfillment mode for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `lead_time_minutes` | `integer` | No | `0` | Inferred: stores lead time minutes for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | Exact constraints below |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_marketplace_seller_product_listings_product_id_products` |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_marketplace_seller_product_listings_product_id_produ_4e59` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `seller_id` | `uuid` | No | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` via `fk_marketplace_seller_product_listings_seller_id_sellers` |
| `seller_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` via `fk_marketplace_seller_product_listings_seller_id_seller_b68d` |
| `seller_sku` | `character varying(128)` | Yes | — | Inferred: stores seller sku for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `status` | `character varying(32)` | No | `'draft'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_marketplace_seller_product_listings_updated_by_users` |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` via `fk_marketplace_seller_product_listings_variant_id_produ_4a78` |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` via `fk_marketplace_seller_product_listings_variant_id_produ_69a3` |

## Record lifecycle and users

- **Created:** when the seller product listings business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `marketplace.seller_product_listings` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_marketplace_seller_product_listings_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_marketplace_seller_product_listings_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_marketplace_seller_product_listings_product_id_produ_4e59 | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| fk_marketplace_seller_product_listings_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| fk_marketplace_seller_product_listings_seller_id_seller_b68d | `seller_id_internal_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE CASCADE` |
| fk_marketplace_seller_product_listings_seller_id_sellers | `seller_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE CASCADE` |
| fk_marketplace_seller_product_listings_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_marketplace_seller_product_listings_variant_id_produ_4a78 | `variant_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT` |
| fk_marketplace_seller_product_listings_variant_id_produ_69a3 | `variant_id_internal_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `marketplace.seller_product_listings` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_marketplace_seller_product_listings_created_by_users` |
| `deleted_by` | `identity.users` | `fk_marketplace_seller_product_listings_deleted_by_users` |
| `product_id_internal_id` | `catalog.products` | `fk_marketplace_seller_product_listings_product_id_produ_4e59` |
| `product_id` | `catalog.products` | `fk_marketplace_seller_product_listings_product_id_products` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_marketplace_seller_product_listings_seller_id_seller_b68d` |
| `seller_id` | `marketplace.sellers` | `fk_marketplace_seller_product_listings_seller_id_sellers` |
| `updated_by` | `identity.users` | `fk_marketplace_seller_product_listings_updated_by_users` |
| `variant_id` | `catalog.product_variants` | `fk_marketplace_seller_product_listings_variant_id_produ_4a78` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_marketplace_seller_product_listings_variant_id_produ_69a3` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_marketplace_seller_product_listings_lead_time_nonnegative` | CHECK | `CHECK (lead_time_minutes >= 0)` |
| `ck_marketplace_seller_product_listings_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_marketplace_seller_product_listings_numeric_pair_seller_id` | CHECK | `CHECK ((seller_id IS NULL) = (seller_id_internal_id IS NULL))` |
| `ck_marketplace_seller_product_listings_numeric_pair_variant_id` | CHECK | `CHECK ((variant_id IS NULL) = (variant_id_internal_id IS NULL))` |
| `ck_marketplace_seller_product_listings_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_marketplace_seller_product_listings_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_product_listings_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_product_listings_product_id_produ_4e59` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_product_listings_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_product_listings_seller_id_seller_b68d` | FOREIGN KEY | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE CASCADE` |
| `fk_marketplace_seller_product_listings_seller_id_sellers` | FOREIGN KEY | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE CASCADE` |
| `fk_marketplace_seller_product_listings_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_product_listings_variant_id_produ_4a78` | FOREIGN KEY | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_product_listings_variant_id_produ_69a3` | FOREIGN KEY | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT` |
| `pk_marketplace_seller_product_listings` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `seller_product_variant` | UNIQUE | `UNIQUE NULLS NOT DISTINCT (seller_id, product_id, variant_id)` |
| `uq_marketplace_seller_product_listings_id` | UNIQUE | `UNIQUE (id)` |
| `seller_product_listings_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `seller_product_listings_fulfillment_mode_not_null` | NOT NULL | `NOT NULL fulfillment_mode` |
| `seller_product_listings_id_not_null` | NOT NULL | `NOT NULL id` |
| `seller_product_listings_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `seller_product_listings_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `seller_product_listings_lead_time_minutes_not_null` | NOT NULL | `NOT NULL lead_time_minutes` |
| `seller_product_listings_metadata_json_not_null` | NOT NULL | `NOT NULL metadata_json` |
| `seller_product_listings_product_id_internal_id_not_null` | NOT NULL | `NOT NULL product_id_internal_id` |
| `seller_product_listings_product_id_not_null` | NOT NULL | `NOT NULL product_id` |
| `seller_product_listings_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `seller_product_listings_seller_id_internal_id_not_null` | NOT NULL | `NOT NULL seller_id_internal_id` |
| `seller_product_listings_seller_id_not_null` | NOT NULL | `NOT NULL seller_id` |
| `seller_product_listings_status_not_null` | NOT NULL | `NOT NULL status` |
| `seller_product_listings_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_marketplace_listings_product` | btree | `(product_id, variant_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_marketplace_listings_product ON marketplace.seller_product_listings USING btree (product_id, variant_id)` |
| `ix_marketplace_listings_seller_status` | btree | `(seller_id, status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_marketplace_listings_seller_status ON marketplace.seller_product_listings USING btree (seller_id, status)` |
| `pk_marketplace_seller_product_listings` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_marketplace_seller_product_listings ON marketplace.seller_product_listings USING btree (internal_id)` |
| `seller_product_variant` | btree | `(seller_id, product_id, variant_id) NULLS NOT DISTINCT` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX seller_product_variant ON marketplace.seller_product_listings USING btree (seller_id, product_id, variant_id) NULLS NOT DISTINCT` |
| `uq_marketplace_seller_product_listings_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_marketplace_seller_product_listings_id ON marketplace.seller_product_listings USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_product_listings FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["seller_id","seller_id_internal_id","marketplace","sellers"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON marketplace.seller_product_listings FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_product_listings FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["seller_id","seller_id_internal_id","marketplace","sellers"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
