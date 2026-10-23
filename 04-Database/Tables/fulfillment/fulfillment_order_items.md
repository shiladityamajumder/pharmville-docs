# fulfillment.fulfillment_order_items

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds fulfillment order items records within the fulfillment domain (picking, packing, and shipment preparation). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 15 constraints, 4 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_fulfillment_fulfillment_order_items_created_by_users) |
| `fulfilled_qty` | `numeric(12,3)` | No | `0` | Fulfilled qty value | Track resource or item amounts accurately | See exact constraints |
| `fulfillment_order_id` | `uuid` | No | — | Reference linking this record to fulfillment orders | Ensures related business data can be joined and validated | FK → `fulfillment.fulfillment_orders` (fk_fulfillment_fulfillment_order_items_fulfillment_orde_9a2d) |
| `fulfillment_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.fulfillment_orders` (fk_fulfillment_fulfillment_order_items_fulfillment_orde_ba7f); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `order_item_id` | `uuid` | No | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` (fk_fulfillment_fulfillment_order_items_order_item_id_or_9354) |
| `order_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` (fk_fulfillment_fulfillment_order_items_order_item_id_or_caeb); Numeric/public-key pair verification required |
| `required_qty` | `numeric(12,3)` | No | — | Required qty value | Track resource or item amounts accurately | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_fulfillment_fulfillment_order_items_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the fulfillment order items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Order_Operations, Store_Operations, Warehouse, Delivery_Operations. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `fulfillment.fulfillment_order_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_fulfillment_fulfillment_order_items_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_fulfillment_fulfillment_order_items_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `order_item_id` → `commerce.order_items(id)` via `fk_fulfillment_fulfillment_order_items_order_item_id_or_9354`; FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT
- `fulfillment_order_id` → `fulfillment.fulfillment_orders(id)` via `fk_fulfillment_fulfillment_order_items_fulfillment_orde_9a2d`; FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment.fulfillment_orders(id) ON DELETE CASCADE
- `fulfillment_order_id_internal_id` → `fulfillment.fulfillment_orders(internal_id)` via `fk_fulfillment_fulfillment_order_items_fulfillment_orde_ba7f`; FOREIGN KEY (fulfillment_order_id_internal_id) REFERENCES fulfillment.fulfillment_orders(internal_id) ON DELETE CASCADE
- `order_item_id_internal_id` → `commerce.order_items(internal_id)` via `fk_fulfillment_fulfillment_order_items_order_item_id_or_caeb`; FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT

## fulfillment.fulfillment_order_items — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 14 columns, 15 constraints, 4 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_fulfillment_fulfillment_order_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_fulfillment_fulfillment_order_items_updated_by_users` |
| `order_item_id` | `commerce.order_items` | `fk_fulfillment_fulfillment_order_items_order_item_id_or_9354` |
| `fulfillment_order_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_fulfillment_order_items_fulfillment_orde_9a2d` |
| `fulfillment_order_id_internal_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_fulfillment_order_items_fulfillment_orde_ba7f` |
| `order_item_id_internal_id` | `commerce.order_items` | `fk_fulfillment_fulfillment_order_items_order_item_id_or_caeb` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_fulfillment_fulfillment_order_items_finite_numeric_values` | CHECK | `CHECK ((required_qty IS NULL OR (required_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (fulfilled_qty IS NULL OR (fulfilled_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_fulfillment_fulfillment_order_items_fulfilled_qty_range` | CHECK | `CHECK (fulfilled_qty >= 0::numeric AND fulfilled_qty <= required_qty)` |
| `ck_fulfillment_fulfillment_order_items_numeric_pair_ful_3c82` | CHECK | `CHECK ((fulfillment_order_id IS NULL) = (fulfillment_order_id_internal_id IS NULL))` |
| `ck_fulfillment_fulfillment_order_items_numeric_pair_ord_1ef2` | CHECK | `CHECK ((order_item_id IS NULL) = (order_item_id_internal_id IS NULL))` |
| `ck_fulfillment_fulfillment_order_items_required_qty_positive` | CHECK | `CHECK (required_qty > 0::numeric)` |
| `ck_fulfillment_fulfillment_order_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_fulfillment_fulfillment_order_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_fulfillment_fulfillment_order_items_fulfillment_orde_9a2d` | FOREIGN KEY | `FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment.fulfillment_orders(id) ON DELETE CASCADE` |
| `fk_fulfillment_fulfillment_order_items_fulfillment_orde_ba7f` | FOREIGN KEY | `FOREIGN KEY (fulfillment_order_id_internal_id) REFERENCES fulfillment.fulfillment_orders(internal_id) ON DELETE CASCADE` |
| `fk_fulfillment_fulfillment_order_items_order_item_id_or_9354` | FOREIGN KEY | `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT` |
| `fk_fulfillment_fulfillment_order_items_order_item_id_or_caeb` | FOREIGN KEY | `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT` |
| `fk_fulfillment_fulfillment_order_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fulfillment_order_item` | UNIQUE | `UNIQUE (fulfillment_order_id, order_item_id)` |
| `pk_fulfillment_fulfillment_order_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_fulfillment_fulfillment_order_items_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `fulfillment_order_item` | `CREATE UNIQUE INDEX fulfillment_order_item ON fulfillment.fulfillment_order_items USING btree (fulfillment_order_id, order_item_id)` |
| `ix_fulfillment_order_items_order` | `CREATE INDEX ix_fulfillment_order_items_order ON fulfillment.fulfillment_order_items USING btree (fulfillment_order_id)` |
| `pk_fulfillment_fulfillment_order_items` | `CREATE UNIQUE INDEX pk_fulfillment_fulfillment_order_items ON fulfillment.fulfillment_order_items USING btree (internal_id)` |
| `uq_fulfillment_fulfillment_order_items_id` | `CREATE UNIQUE INDEX uq_fulfillment_fulfillment_order_items_id ON fulfillment.fulfillment_order_items USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.fulfillment_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"],["order_item_id","order_item_id_internal_id","commerce","order_items"]]', 'internal_id', 'id')` |
| `authorized_task_entry` | `CREATE TRIGGER authorized_task_entry BEFORE INSERT OR UPDATE ON fulfillment.fulfillment_order_items FOR EACH ROW EXECUTE FUNCTION fulfillment.guard_task_entry()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON fulfillment.fulfillment_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.fulfillment_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"],["order_item_id","order_item_id_internal_id","commerce","order_items"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
