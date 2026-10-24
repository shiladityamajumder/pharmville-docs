# `commerce.order_allocations`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds order allocations records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | commerce.order_allocations |
| Classification | Transactional |
| Proposed business write owner | Order_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 21 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `allocated_qty` | `numeric(12,3)` | No | — | Allocated qty value | Track resource or item amounts accurately | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_order_allocations_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `order_item_id` | `uuid` | No | — | Reference linking this record to stock reservations | Ensures related business data can be joined and validated | FK → `commerce.order_items` via `fk_commerce_order_allocations_order_item_id_order_items`; FK → `warehouse.stock_reservations` via `fk_commerce_order_allocations_reservation_item` |
| `order_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` via `fk_commerce_order_allocations_order_item_id_order_items_numeric`; FK → `warehouse.stock_reservations` via `fk_commerce_order_allocations_reservation_item_numeric` |
| `reservation_id` | `uuid` | Yes | — | Reference linking this record to stock reservations | Ensures related business data can be joined and validated | FK → `warehouse.stock_reservations` via `fk_commerce_order_allocations_reservation_id_stock_reservations`; FK → `warehouse.stock_reservations` via `fk_commerce_order_allocations_reservation_item` |
| `reservation_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.stock_reservations` via `fk_commerce_order_allocations_reservation_id_stock_rese_0af9`; FK → `warehouse.stock_reservations` via `fk_commerce_order_allocations_reservation_item_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `seller_id` | `uuid` | Yes | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` via `fk_commerce_order_allocations_seller_id_sellers` |
| `seller_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` via `fk_commerce_order_allocations_seller_id_sellers_numeric` |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_order_allocations_updated_by_users` |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_commerce_order_allocations_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_commerce_order_allocations_warehouse_id_warehouses_numeric` |

## Record lifecycle and users

- **Created:** when the order allocations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.order_allocations` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_commerce_order_allocations_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_commerce_order_allocations_order_item_id_order_items | `order_item_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE CASCADE` |
| fk_commerce_order_allocations_order_item_id_order_items_numeric | `order_item_id_internal_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE CASCADE` |
| fk_commerce_order_allocations_reservation_id_stock_rese_0af9 | `reservation_id_internal_id` | [`warehouse.stock_reservations`](../../Tables/warehouse/stock_reservations.md) | `FOREIGN KEY (reservation_id_internal_id) REFERENCES warehouse.stock_reservations(internal_id) ON DELETE SET NULL` |
| fk_commerce_order_allocations_reservation_id_stock_reservations | `reservation_id` | [`warehouse.stock_reservations`](../../Tables/warehouse/stock_reservations.md) | `FOREIGN KEY (reservation_id) REFERENCES warehouse.stock_reservations(id) ON DELETE SET NULL` |
| fk_commerce_order_allocations_reservation_item | `reservation_id, order_item_id` | [`warehouse.stock_reservations`](../../Tables/warehouse/stock_reservations.md) | `FOREIGN KEY (reservation_id, order_item_id) REFERENCES warehouse.stock_reservations(id, order_item_id) ON DELETE RESTRICT` |
| fk_commerce_order_allocations_reservation_item_numeric | `reservation_id_internal_id, order_item_id_internal_id` | [`warehouse.stock_reservations`](../../Tables/warehouse/stock_reservations.md) | `FOREIGN KEY (reservation_id_internal_id, order_item_id_internal_id) REFERENCES warehouse.stock_reservations(internal_id, order_item_id_internal_id) ON DELETE RESTRICT` |
| fk_commerce_order_allocations_seller_id_sellers | `seller_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE SET NULL` |
| fk_commerce_order_allocations_seller_id_sellers_numeric | `seller_id_internal_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE SET NULL` |
| fk_commerce_order_allocations_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_commerce_order_allocations_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| fk_commerce_order_allocations_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `commerce.order_allocations` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_commerce_order_allocations_created_by_users` |
| `order_item_id` | `commerce.order_items` | `fk_commerce_order_allocations_order_item_id_order_items` |
| `order_item_id_internal_id` | `commerce.order_items` | `fk_commerce_order_allocations_order_item_id_order_items_numeric` |
| `reservation_id_internal_id` | `warehouse.stock_reservations` | `fk_commerce_order_allocations_reservation_id_stock_rese_0af9` |
| `reservation_id` | `warehouse.stock_reservations` | `fk_commerce_order_allocations_reservation_id_stock_reservations` |
| `reservation_id, order_item_id` | `warehouse.stock_reservations` | `fk_commerce_order_allocations_reservation_item` |
| `reservation_id_internal_id, order_item_id_internal_id` | `warehouse.stock_reservations` | `fk_commerce_order_allocations_reservation_item_numeric` |
| `seller_id` | `marketplace.sellers` | `fk_commerce_order_allocations_seller_id_sellers` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_commerce_order_allocations_seller_id_sellers_numeric` |
| `updated_by` | `identity.users` | `fk_commerce_order_allocations_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_commerce_order_allocations_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_commerce_order_allocations_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_commerce_order_allocations_allocated_qty_positive` | CHECK | `CHECK (allocated_qty > 0::numeric)` |
| `ck_commerce_order_allocations_finite_numeric_values` | CHECK | `CHECK (allocated_qty IS NULL OR (allocated_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_commerce_order_allocations_numeric_pair_order_item_id` | CHECK | `CHECK ((order_item_id IS NULL) = (order_item_id_internal_id IS NULL))` |
| `ck_commerce_order_allocations_numeric_pair_reservation_id` | CHECK | `CHECK ((reservation_id IS NULL) = (reservation_id_internal_id IS NULL))` |
| `ck_commerce_order_allocations_numeric_pair_seller_id` | CHECK | `CHECK ((seller_id IS NULL) = (seller_id_internal_id IS NULL))` |
| `ck_commerce_order_allocations_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_commerce_order_allocations_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_commerce_order_allocations_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_order_allocations_order_item_id_order_items` | FOREIGN KEY | `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE CASCADE` |
| `fk_commerce_order_allocations_order_item_id_order_items_numeric` | FOREIGN KEY | `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE CASCADE` |
| `fk_commerce_order_allocations_reservation_id_stock_rese_0af9` | FOREIGN KEY | `FOREIGN KEY (reservation_id_internal_id) REFERENCES warehouse.stock_reservations(internal_id) ON DELETE SET NULL` |
| `fk_commerce_order_allocations_reservation_id_stock_reservations` | FOREIGN KEY | `FOREIGN KEY (reservation_id) REFERENCES warehouse.stock_reservations(id) ON DELETE SET NULL` |
| `fk_commerce_order_allocations_reservation_item` | FOREIGN KEY | `FOREIGN KEY (reservation_id, order_item_id) REFERENCES warehouse.stock_reservations(id, order_item_id) ON DELETE RESTRICT` |
| `fk_commerce_order_allocations_reservation_item_numeric` | FOREIGN KEY | `FOREIGN KEY (reservation_id_internal_id, order_item_id_internal_id) REFERENCES warehouse.stock_reservations(internal_id, order_item_id_internal_id) ON DELETE RESTRICT` |
| `fk_commerce_order_allocations_seller_id_sellers` | FOREIGN KEY | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE SET NULL` |
| `fk_commerce_order_allocations_seller_id_sellers_numeric` | FOREIGN KEY | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE SET NULL` |
| `fk_commerce_order_allocations_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_order_allocations_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_commerce_order_allocations_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `pk_commerce_order_allocations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_commerce_order_allocations_id` | UNIQUE | `UNIQUE (id)` |
| `order_allocations_allocated_qty_not_null` | NOT NULL | `NOT NULL allocated_qty` |
| `order_allocations_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `order_allocations_id_not_null` | NOT NULL | `NOT NULL id` |
| `order_allocations_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `order_allocations_order_item_id_internal_id_not_null` | NOT NULL | `NOT NULL order_item_id_internal_id` |
| `order_allocations_order_item_id_not_null` | NOT NULL | `NOT NULL order_item_id` |
| `order_allocations_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `order_allocations_status_not_null` | NOT NULL | `NOT NULL status` |
| `order_allocations_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `order_allocations_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL warehouse_id_internal_id` |
| `order_allocations_warehouse_id_not_null` | NOT NULL | `NOT NULL warehouse_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_commerce_order_allocations_item` | btree | `(order_item_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_order_allocations_item ON commerce.order_allocations USING btree (order_item_id)` |
| `ix_commerce_order_allocations_reservation` | btree | `(reservation_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_order_allocations_reservation ON commerce.order_allocations USING btree (reservation_id)` |
| `ix_commerce_order_allocations_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_order_allocations_status ON commerce.order_allocations USING btree (status)` |
| `ix_commerce_order_allocations_warehouse` | btree | `(warehouse_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_order_allocations_warehouse ON commerce.order_allocations USING btree (warehouse_id)` |
| `pk_commerce_order_allocations` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_commerce_order_allocations ON commerce.order_allocations USING btree (internal_id)` |
| `uq_commerce_order_allocations_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_order_allocations_id ON commerce.order_allocations USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_allocations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_item_id","order_item_id_internal_id","commerce","order_items"],["reservation_id","reservation_id_internal_id","warehouse","stock_reservations"],["seller_id","seller_id_internal_id","marketplace","sellers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.order_allocations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_allocations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_item_id","order_item_id_internal_id","commerce","order_items"],["reservation_id","reservation_id_internal_id","warehouse","stock_reservations"],["seller_id","seller_id_internal_id","marketplace","sellers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
