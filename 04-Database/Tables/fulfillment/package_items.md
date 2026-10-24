# `fulfillment.package_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds package items records within the fulfillment domain (picking, packing, and shipment preparation). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | fulfillment.package_items |
| Classification | Mapping / Junction |
| Proposed business write owner | Store_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 16 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 5 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_fulfillment_package_items_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `lot_id` | `uuid` | No | — | Reference linking this record to inventory lots | Ensures related business data can be joined and validated | FK → `warehouse.inventory_lots` via `fk_fulfillment_package_items_lot_id_inventory_lots` |
| `lot_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_lots` via `fk_fulfillment_package_items_lot_id_inventory_lots_numeric` |
| `order_item_id` | `uuid` | No | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` via `fk_fulfillment_package_items_order_item_id_order_items` |
| `order_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` via `fk_fulfillment_package_items_order_item_id_order_items_numeric` |
| `package_id` | `uuid` | No | — | Reference linking this record to packages | Ensures related business data can be joined and validated | FK → `fulfillment.packages` via `fk_fulfillment_package_items_package_id_packages` |
| `package_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.packages` via `fk_fulfillment_package_items_package_id_packages_numeric` |
| `quantity` | `numeric(12,3)` | No | — | Quantity value | Track resource or item amounts accurately | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_fulfillment_package_items_updated_by_users` |

## Record lifecycle and users

- **Created:** when the package items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Order_Operations, Store_Operations, Warehouse, Delivery_Operations. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `fulfillment.package_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_fulfillment_package_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_fulfillment_package_items_lot_id_inventory_lots | `lot_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| fk_fulfillment_package_items_lot_id_inventory_lots_numeric | `lot_id_internal_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| fk_fulfillment_package_items_order_item_id_order_items | `order_item_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT` |
| fk_fulfillment_package_items_order_item_id_order_items_numeric | `order_item_id_internal_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT` |
| fk_fulfillment_package_items_package_id_packages | `package_id` | [`fulfillment.packages`](../../Tables/fulfillment/packages.md) | `FOREIGN KEY (package_id) REFERENCES fulfillment.packages(id) ON DELETE CASCADE` |
| fk_fulfillment_package_items_package_id_packages_numeric | `package_id_internal_id` | [`fulfillment.packages`](../../Tables/fulfillment/packages.md) | `FOREIGN KEY (package_id_internal_id) REFERENCES fulfillment.packages(internal_id) ON DELETE CASCADE` |
| fk_fulfillment_package_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `fulfillment.package_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_fulfillment_package_items_created_by_users` |
| `lot_id` | `warehouse.inventory_lots` | `fk_fulfillment_package_items_lot_id_inventory_lots` |
| `lot_id_internal_id` | `warehouse.inventory_lots` | `fk_fulfillment_package_items_lot_id_inventory_lots_numeric` |
| `order_item_id` | `commerce.order_items` | `fk_fulfillment_package_items_order_item_id_order_items` |
| `order_item_id_internal_id` | `commerce.order_items` | `fk_fulfillment_package_items_order_item_id_order_items_numeric` |
| `package_id` | `fulfillment.packages` | `fk_fulfillment_package_items_package_id_packages` |
| `package_id_internal_id` | `fulfillment.packages` | `fk_fulfillment_package_items_package_id_packages_numeric` |
| `updated_by` | `identity.users` | `fk_fulfillment_package_items_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_fulfillment_package_items_finite_numeric_values` | CHECK | `CHECK (quantity IS NULL OR (quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_fulfillment_package_items_numeric_pair_lot_id` | CHECK | `CHECK ((lot_id IS NULL) = (lot_id_internal_id IS NULL))` |
| `ck_fulfillment_package_items_numeric_pair_order_item_id` | CHECK | `CHECK ((order_item_id IS NULL) = (order_item_id_internal_id IS NULL))` |
| `ck_fulfillment_package_items_numeric_pair_package_id` | CHECK | `CHECK ((package_id IS NULL) = (package_id_internal_id IS NULL))` |
| `ck_fulfillment_package_items_quantity_positive` | CHECK | `CHECK (quantity > 0::numeric)` |
| `ck_fulfillment_package_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_fulfillment_package_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_fulfillment_package_items_lot_id_inventory_lots` | FOREIGN KEY | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| `fk_fulfillment_package_items_lot_id_inventory_lots_numeric` | FOREIGN KEY | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| `fk_fulfillment_package_items_order_item_id_order_items` | FOREIGN KEY | `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT` |
| `fk_fulfillment_package_items_order_item_id_order_items_numeric` | FOREIGN KEY | `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT` |
| `fk_fulfillment_package_items_package_id_packages` | FOREIGN KEY | `FOREIGN KEY (package_id) REFERENCES fulfillment.packages(id) ON DELETE CASCADE` |
| `fk_fulfillment_package_items_package_id_packages_numeric` | FOREIGN KEY | `FOREIGN KEY (package_id_internal_id) REFERENCES fulfillment.packages(internal_id) ON DELETE CASCADE` |
| `fk_fulfillment_package_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_fulfillment_package_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_fulfillment_package_items_id` | UNIQUE | `UNIQUE (id)` |
| `package_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `package_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `package_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `package_items_lot_id_internal_id_not_null` | NOT NULL | `NOT NULL lot_id_internal_id` |
| `package_items_lot_id_not_null` | NOT NULL | `NOT NULL lot_id` |
| `package_items_order_item_id_internal_id_not_null` | NOT NULL | `NOT NULL order_item_id_internal_id` |
| `package_items_order_item_id_not_null` | NOT NULL | `NOT NULL order_item_id` |
| `package_items_package_id_internal_id_not_null` | NOT NULL | `NOT NULL package_id_internal_id` |
| `package_items_package_id_not_null` | NOT NULL | `NOT NULL package_id` |
| `package_items_quantity_not_null` | NOT NULL | `NOT NULL quantity` |
| `package_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `package_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_fulfillment_package_items_lot` | btree | `(lot_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_fulfillment_package_items_lot ON fulfillment.package_items USING btree (lot_id)` |
| `ix_fulfillment_package_items_order_item` | btree | `(order_item_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_fulfillment_package_items_order_item ON fulfillment.package_items USING btree (order_item_id)` |
| `ix_fulfillment_package_items_package` | btree | `(package_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_fulfillment_package_items_package ON fulfillment.package_items USING btree (package_id)` |
| `pk_fulfillment_package_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_fulfillment_package_items ON fulfillment.package_items USING btree (internal_id)` |
| `uq_fulfillment_package_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_fulfillment_package_items_id ON fulfillment.package_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.package_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["order_item_id","order_item_id_internal_id","commerce","order_items"],["package_id","package_id_internal_id","fulfillment","packages"]]', 'internal_id', 'id')` | O |
| `ab_authorized_package_site` | `CREATE TRIGGER ab_authorized_package_site BEFORE INSERT OR UPDATE ON fulfillment.package_items FOR EACH ROW EXECUTE FUNCTION fulfillment.guard_package_site()` | O |
| `package_item_guard` | `CREATE TRIGGER package_item_guard BEFORE INSERT OR UPDATE ON fulfillment.package_items FOR EACH ROW EXECUTE FUNCTION fulfillment.guard_package_item()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON fulfillment.package_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.package_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["order_item_id","order_item_id_internal_id","commerce","order_items"],["package_id","package_id_internal_id","fulfillment","packages"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
