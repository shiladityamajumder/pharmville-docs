# commerce.order_groups

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds order groups records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 17 constraints, 7 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_order_groups_created_by_users) |
| `delivery_promise_end` | `timestamp with time zone` | Yes | — | Inferred: stores delivery promise end for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `delivery_promise_start` | `timestamp with time zone` | Yes | — | Inferred: stores delivery promise start for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `group_number` | `integer` | No | — | Inferred: stores group number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` (fk_commerce_order_groups_order_id_orders) |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` (fk_commerce_order_groups_order_id_orders_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `seller_id` | `uuid` | Yes | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` (fk_commerce_order_groups_seller_id_sellers) |
| `seller_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` (fk_commerce_order_groups_seller_id_sellers_numeric); Numeric/public-key pair verification required |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_order_groups_updated_by_users) |
| `warehouse_id` | `uuid` | Yes | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_commerce_order_groups_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_commerce_order_groups_warehouse_id_warehouses_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the order groups business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.order_groups` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_commerce_order_groups_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_commerce_order_groups_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_commerce_order_groups_warehouse_id_warehouses`; FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE SET NULL
- `seller_id` → `marketplace.sellers(id)` via `fk_commerce_order_groups_seller_id_sellers`; FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE SET NULL
- `order_id` → `commerce.orders(id)` via `fk_commerce_order_groups_order_id_orders`; FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE CASCADE
- `order_id_internal_id` → `commerce.orders(internal_id)` via `fk_commerce_order_groups_order_id_orders_numeric`; FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE CASCADE
- `seller_id_internal_id` → `marketplace.sellers(internal_id)` via `fk_commerce_order_groups_seller_id_sellers_numeric`; FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE SET NULL
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_commerce_order_groups_warehouse_id_warehouses_numeric`; FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE SET NULL

**Referenced by 12 FK constraints** (sample): `commerce.order_items`, `commerce.order_items`, `finance.settlement_items`, `fulfillment.fulfillment_orders`, `logistics.shipments`, `logistics.shipments`, `commerce.order_items`, `commerce.order_items`, `finance.settlement_items`, `fulfillment.fulfillment_orders`, `logistics.shipments`, `logistics.shipments`.

## commerce.order_groups — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 17 columns, 17 constraints, 7 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_commerce_order_groups_created_by_users` |
| `updated_by` | `identity.users` | `fk_commerce_order_groups_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_commerce_order_groups_warehouse_id_warehouses` |
| `seller_id` | `marketplace.sellers` | `fk_commerce_order_groups_seller_id_sellers` |
| `order_id` | `commerce.orders` | `fk_commerce_order_groups_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_commerce_order_groups_order_id_orders_numeric` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_commerce_order_groups_seller_id_sellers_numeric` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_commerce_order_groups_warehouse_id_warehouses_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_commerce_order_groups_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_commerce_order_groups_numeric_pair_seller_id` | CHECK | `CHECK ((seller_id IS NULL) = (seller_id_internal_id IS NULL))` |
| `ck_commerce_order_groups_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_commerce_order_groups_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_commerce_order_groups_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_order_groups_order_id_orders` | FOREIGN KEY | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE CASCADE` |
| `fk_commerce_order_groups_order_id_orders_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE CASCADE` |
| `fk_commerce_order_groups_seller_id_sellers` | FOREIGN KEY | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE SET NULL` |
| `fk_commerce_order_groups_seller_id_sellers_numeric` | FOREIGN KEY | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE SET NULL` |
| `fk_commerce_order_groups_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_order_groups_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE SET NULL` |
| `fk_commerce_order_groups_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE SET NULL` |
| `order_group_number` | UNIQUE | `UNIQUE (order_id, group_number)` |
| `pk_commerce_order_groups` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_commerce_order_groups_id` | UNIQUE | `UNIQUE (id)` |
| `uq_commerce_order_groups_id_order` | UNIQUE | `UNIQUE (id, order_id)` |
| `uq_numeric_commerce_order_groups_internal_id_order_id_i_bf54` | UNIQUE | `UNIQUE (internal_id, order_id_internal_id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_commerce_order_groups_order` | `CREATE INDEX ix_commerce_order_groups_order ON commerce.order_groups USING btree (order_id)` |
| `ix_commerce_order_groups_seller` | `CREATE INDEX ix_commerce_order_groups_seller ON commerce.order_groups USING btree (seller_id)` |
| `order_group_number` | `CREATE UNIQUE INDEX order_group_number ON commerce.order_groups USING btree (order_id, group_number)` |
| `pk_commerce_order_groups` | `CREATE UNIQUE INDEX pk_commerce_order_groups ON commerce.order_groups USING btree (internal_id)` |
| `uq_commerce_order_groups_id` | `CREATE UNIQUE INDEX uq_commerce_order_groups_id ON commerce.order_groups USING btree (id)` |
| `uq_commerce_order_groups_id_order` | `CREATE UNIQUE INDEX uq_commerce_order_groups_id_order ON commerce.order_groups USING btree (id, order_id)` |
| `uq_numeric_commerce_order_groups_internal_id_order_id_i_bf54` | `CREATE UNIQUE INDEX uq_numeric_commerce_order_groups_internal_id_order_id_i_bf54 ON commerce.order_groups USING btree (internal_id, order_id_internal_id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_groups FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["seller_id","seller_id_internal_id","marketplace","sellers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.order_groups FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.order_groups FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["seller_id","seller_id_internal_id","marketplace","sellers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
