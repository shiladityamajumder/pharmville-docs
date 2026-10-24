# `pricing.price_books`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds price books records within the pricing domain (prices, taxes, promotions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | pricing.price_books |
| Classification | Configuration |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 22 columns; 13 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `channel` | `character varying(32)` | No | — | Inferred: stores channel for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_price_books_created_by_users` |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | Collation: default |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_price_books_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `name` | `character varying(128)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `priority` | `integer` | No | `0` | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `region_code` | `character varying(64)` | Yes | — | Code for region | Link to controlled business classification or an external reference | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `seller_id` | `uuid` | Yes | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` via `fk_domain_pricing_price_books_seller_id` |
| `seller_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` via `fk_domain_pricing_price_books_seller_id_numeric` |
| `status` | `character varying(32)` | No | `'draft'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_price_books_updated_by_users` |
| `valid_from` | `timestamp with time zone` | No | — | Inferred: stores valid from for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `valid_until` | `timestamp with time zone` | Yes | — | Inferred: stores valid until for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `warehouse_id` | `uuid` | Yes | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_pricing_price_books_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_pricing_price_books_warehouse_id_warehouses_numeric` |

## Record lifecycle and users

- **Created:** when the price books business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Cart_Checkout. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `pricing.price_books` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_domain_pricing_price_books_seller_id | `seller_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE RESTRICT` |
| fk_domain_pricing_price_books_seller_id_numeric | `seller_id_internal_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE RESTRICT` |
| fk_pricing_price_books_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_pricing_price_books_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_pricing_price_books_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_pricing_price_books_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE SET NULL` |
| fk_pricing_price_books_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE SET NULL` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`pricing.product_prices`](../../Tables/pricing/product_prices.md) | fk_pricing_product_prices_price_book_id_price_books | `price_book_id` | `id` |
| [`pricing.product_prices`](../../Tables/pricing/product_prices.md) | fk_pricing_product_prices_price_book_id_price_books_numeric | `price_book_id_internal_id` | `internal_id` |

## `pricing.price_books` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `seller_id` | `marketplace.sellers` | `fk_domain_pricing_price_books_seller_id` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_domain_pricing_price_books_seller_id_numeric` |
| `created_by` | `identity.users` | `fk_pricing_price_books_created_by_users` |
| `deleted_by` | `identity.users` | `fk_pricing_price_books_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_pricing_price_books_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_pricing_price_books_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_pricing_price_books_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_pricing_price_books_numeric_pair_seller_id` | CHECK | `CHECK ((seller_id IS NULL) = (seller_id_internal_id IS NULL))` |
| `ck_pricing_price_books_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_pricing_price_books_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_pricing_price_books_valid_window` | CHECK | `CHECK (valid_until IS NULL OR valid_until > valid_from)` |
| `fk_domain_pricing_price_books_seller_id` | FOREIGN KEY | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE RESTRICT` |
| `fk_domain_pricing_price_books_seller_id_numeric` | FOREIGN KEY | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE RESTRICT` |
| `fk_pricing_price_books_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_pricing_price_books_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_pricing_price_books_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_pricing_price_books_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE SET NULL` |
| `fk_pricing_price_books_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE SET NULL` |
| `pk_pricing_price_books` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_pricing_price_books_id` | UNIQUE | `UNIQUE (id)` |
| `price_books_channel_not_null` | NOT NULL | `NOT NULL channel` |
| `price_books_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `price_books_currency_not_null` | NOT NULL | `NOT NULL currency` |
| `price_books_id_not_null` | NOT NULL | `NOT NULL id` |
| `price_books_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `price_books_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `price_books_name_not_null` | NOT NULL | `NOT NULL name` |
| `price_books_priority_not_null` | NOT NULL | `NOT NULL priority` |
| `price_books_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `price_books_status_not_null` | NOT NULL | `NOT NULL status` |
| `price_books_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `price_books_valid_from_not_null` | NOT NULL | `NOT NULL valid_from` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_pricing_price_books_scope` | btree | `(channel, region_code, seller_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_pricing_price_books_scope ON pricing.price_books USING btree (channel, region_code, seller_id)` |
| `ix_pricing_price_books_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_pricing_price_books_status ON pricing.price_books USING btree (status)` |
| `pk_pricing_price_books` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_pricing_price_books ON pricing.price_books USING btree (internal_id)` |
| `uq_pricing_price_books_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_pricing_price_books_id ON pricing.price_books USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON pricing.price_books FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["seller_id","seller_id_internal_id","marketplace","sellers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON pricing.price_books FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON pricing.price_books FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["seller_id","seller_id_internal_id","marketplace","sellers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
