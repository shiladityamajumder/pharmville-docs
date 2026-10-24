# `marketplace.seller_product_listings`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds seller product listings records within the marketplace domain (sellers and commercial listings). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 17 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_marketplace_seller_product_listings_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_marketplace_seller_product_listings_deleted_by_users) |
| `fulfillment_mode` | `character varying(32)` | No | `'platform'::character varying` | Inferred: stores fulfillment mode for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `lead_time_minutes` | `integer` | No | `0` | Inferred: stores lead time minutes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | See exact constraints |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_marketplace_seller_product_listings_product_id_products) |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_marketplace_seller_product_listings_product_id_produ_4e59); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `seller_id` | `uuid` | No | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` (fk_marketplace_seller_product_listings_seller_id_sellers) |
| `seller_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` (fk_marketplace_seller_product_listings_seller_id_seller_b68d); Numeric/public-key pair verification required |
| `seller_sku` | `character varying(128)` | Yes | — | Inferred: stores seller sku for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `status` | `character varying(32)` | No | `'draft'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_marketplace_seller_product_listings_updated_by_users) |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` (fk_marketplace_seller_product_listings_variant_id_produ_4a78) |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` (fk_marketplace_seller_product_listings_variant_id_produ_69a3); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the seller product listings business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `marketplace.seller_product_listings` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_marketplace_seller_product_listings_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_marketplace_seller_product_listings_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_marketplace_seller_product_listings_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `seller_id` → `marketplace.sellers(id)` via `fk_marketplace_seller_product_listings_seller_id_sellers`; `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE CASCADE`
- `variant_id` → `catalog.product_variants(id)` via `fk_marketplace_seller_product_listings_variant_id_produ_4a78`; `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT`
- `product_id` → `catalog.products(id)` via `fk_marketplace_seller_product_listings_product_id_products`; `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT`
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_marketplace_seller_product_listings_product_id_produ_4e59`; `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT`
- `seller_id_internal_id` → `marketplace.sellers(internal_id)` via `fk_marketplace_seller_product_listings_seller_id_seller_b68d`; `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE CASCADE`
- `variant_id_internal_id` → `catalog.product_variants(internal_id)` via `fk_marketplace_seller_product_listings_variant_id_produ_69a3`; `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT`

## `marketplace.seller_product_listings` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 21 columns, 17 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_marketplace_seller_product_listings_created_by_users` |
| `deleted_by` | `identity.users` | `fk_marketplace_seller_product_listings_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_marketplace_seller_product_listings_updated_by_users` |
| `seller_id` | `marketplace.sellers` | `fk_marketplace_seller_product_listings_seller_id_sellers` |
| `variant_id` | `catalog.product_variants` | `fk_marketplace_seller_product_listings_variant_id_produ_4a78` |
| `product_id` | `catalog.products` | `fk_marketplace_seller_product_listings_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_marketplace_seller_product_listings_product_id_produ_4e59` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_marketplace_seller_product_listings_seller_id_seller_b68d` |
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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_marketplace_listings_product` | `CREATE INDEX ix_marketplace_listings_product ON marketplace.seller_product_listings USING btree (product_id, variant_id)` |
| `ix_marketplace_listings_seller_status` | `CREATE INDEX ix_marketplace_listings_seller_status ON marketplace.seller_product_listings USING btree (seller_id, status)` |
| `pk_marketplace_seller_product_listings` | `CREATE UNIQUE INDEX pk_marketplace_seller_product_listings ON marketplace.seller_product_listings USING btree (internal_id)` |
| `seller_product_variant` | `CREATE UNIQUE INDEX seller_product_variant ON marketplace.seller_product_listings USING btree (seller_id, product_id, variant_id) NULLS NOT DISTINCT` |
| `uq_marketplace_seller_product_listings_id` | `CREATE UNIQUE INDEX uq_marketplace_seller_product_listings_id ON marketplace.seller_product_listings USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_product_listings FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["seller_id","seller_id_internal_id","marketplace","sellers"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON marketplace.seller_product_listings FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_product_listings FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["seller_id","seller_id_internal_id","marketplace","sellers"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
