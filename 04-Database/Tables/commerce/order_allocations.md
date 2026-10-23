# commerce.order_allocations

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds order allocations records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 21 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `allocated_qty` | `numeric(12,3)` | No | — | Allocated qty value | Track resource or item amounts accurately | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_order_allocations_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `order_item_id` | `uuid` | No | — | Reference linking this record to stock reservations | Ensures related business data can be joined and validated | FK → `warehouse.stock_reservations` (fk_commerce_order_allocations_reservation_item); FK → `commerce.order_items` (fk_commerce_order_allocations_order_item_id_order_items) |
| `order_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` (fk_commerce_order_allocations_order_item_id_order_items_numeric); FK → `warehouse.stock_reservations` (fk_commerce_order_allocations_reservation_item_numeric); Numeric/public-key pair verification required |
| `reservation_id` | `uuid` | Yes | — | Reference linking this record to stock reservations | Ensures related business data can be joined and validated | FK → `warehouse.stock_reservations` (fk_commerce_order_allocations_reservation_item); FK → `warehouse.stock_reservations` (fk_commerce_order_allocations_reservation_id_stock_reservations) |
| `reservation_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.stock_reservations` (fk_commerce_order_allocations_reservation_id_stock_rese_0af9); FK → `warehouse.stock_reservations` (fk_commerce_order_allocations_reservation_item_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `seller_id` | `uuid` | Yes | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` (fk_commerce_order_allocations_seller_id_sellers) |
| `seller_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` (fk_commerce_order_allocations_seller_id_sellers_numeric); Numeric/public-key pair verification required |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_order_allocations_updated_by_users) |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_commerce_order_allocations_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_commerce_order_allocations_warehouse_id_warehouses_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the order allocations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.order_allocations` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_commerce_order_allocations_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_commerce_order_allocations_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_commerce_order_allocations_warehouse_id_warehouses`; FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT
- `seller_id` → `marketplace.sellers(id)` via `fk_commerce_order_allocations_seller_id_sellers`; FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE SET NULL
- `reservation_id, order_item_id` → `warehouse.stock_reservations(id, order_item_id)` via `fk_commerce_order_allocations_reservation_item`; FOREIGN KEY (reservation_id, order_item_id) REFERENCES warehouse.stock_reservations(id, order_item_id) ON DELETE RESTRICT
- `reservation_id` → `warehouse.stock_reservations(id)` via `fk_commerce_order_allocations_reservation_id_stock_reservations`; FOREIGN KEY (reservation_id) REFERENCES warehouse.stock_reservations(id) ON DELETE SET NULL
- `order_item_id` → `commerce.order_items(id)` via `fk_commerce_order_allocations_order_item_id_order_items`; FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE CASCADE
- `order_item_id_internal_id` → `commerce.order_items(internal_id)` via `fk_commerce_order_allocations_order_item_id_order_items_numeric`; FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE CASCADE
- `reservation_id_internal_id` → `warehouse.stock_reservations(internal_id)` via `fk_commerce_order_allocations_reservation_id_stock_rese_0af9`; FOREIGN KEY (reservation_id_internal_id) REFERENCES warehouse.stock_reservations(internal_id) ON DELETE SET NULL
- `reservation_id_internal_id, order_item_id_internal_id` → `warehouse.stock_reservations(internal_id, order_item_id_internal_id)` via `fk_commerce_order_allocations_reservation_item_numeric`; FOREIGN KEY (reservation_id_internal_id, order_item_id_internal_id) REFERENCES warehouse.stock_reservations(internal_id, order_item_id_internal_id) ON DELETE RESTRICT
- `seller_id_internal_id` → `marketplace.sellers(internal_id)` via `fk_commerce_order_allocations_seller_id_sellers_numeric`; FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE SET NULL
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_commerce_order_allocations_warehouse_id_warehouses_numeric`; FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT

## commerce.order_allocations — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 17 columns, 21 constraints, 6 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_commerce_order_allocations_created_by_users` |
| `updated_by` | `identity.users` | `fk_commerce_order_allocations_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_commerce_order_allocations_warehouse_id_warehouses` |
| `seller_id` | `marketplace.sellers` | `fk_commerce_order_allocations_seller_id_sellers` |
| `reservation_id`, `order_item_id` | `warehouse.stock_reservations` | `fk_commerce_order_allocations_reservation_item` |
| `reservation_id` | `warehouse.stock_reservations` | `fk_commerce_order_allocations_reservation_id_stock_reservations` |
| `order_item_id` | `commerce.order_items` | `fk_commerce_order_allocations_order_item_id_order_items` |
| `order_item_id_internal_id` | `commerce.order_items` | `fk_commerce_order_allocations_order_item_id_order_items_numeric` |
| `reservation_id_internal_id` | `warehouse.stock_reservations` | `fk_commerce_order_allocations_reservation_id_stock_rese_0af9` |
| `reservation_id_internal_id`, `order_item_id_internal_id` | `warehouse.stock_reservations` | `fk_commerce_order_allocations_reservation_item_numeric` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_commerce_order_allocations_seller_id_sellers_numeric` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_commerce_order_allocations_warehouse_id_warehouses_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_commerce_order_allocations_item` | `CREATE INDEX ix_commerce_order_allocations_item ON commerce.order_allocations USING btree (order_item_id)` |
| `ix_commerce_order_allocations_reservation` | `CREATE INDEX ix_commerce_order_allocations_reservation ON commerce.order_allocations USING btree (reservation_id)` |
| `ix_commerce_order_allocations_status` | `CREATE INDEX ix_commerce_order_allocations_status ON commerce.order_allocations USING btree (status)` |
| `ix_commerce_order_allocations_warehouse` | `CREATE INDEX ix_commerce_order_allocations_warehouse ON commerce.order_allocations USING btree (warehouse_id)` |
| `pk_commerce_order_allocations` | `CREATE UNIQUE INDEX pk_commerce_order_allocations ON commerce.order_allocations USING btree (internal_id)` |
| `uq_commerce_order_allocations_id` | `CREATE UNIQUE INDEX uq_commerce_order_allocations_id ON commerce.order_allocations USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_allocations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_item_id","order_item_id_internal_id","commerce","order_items"],["reservation_id","reservation_id_internal_id","warehouse","stock_reservations"],["seller_id","seller_id_internal_id","marketplace","sellers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.order_allocations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_allocations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_item_id","order_item_id_internal_id","commerce","order_items"],["reservation_id","reservation_id_internal_id","warehouse","stock_reservations"],["seller_id","seller_id_internal_id","marketplace","sellers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
