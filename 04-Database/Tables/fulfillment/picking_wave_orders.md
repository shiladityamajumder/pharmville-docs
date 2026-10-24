# `fulfillment.picking_wave_orders`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds picking wave orders records within the fulfillment domain (picking, packing, and shipment preparation). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 11 columns, 12 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_fulfillment_picking_wave_orders_created_by_users) |
| `fulfillment_order_id` | `uuid` | No | — | Reference linking this record to fulfillment orders | Ensures related business data can be joined and validated | FK → `fulfillment.fulfillment_orders` (fk_fulfillment_picking_wave_orders_fulfillment_order_id_b656) |
| `fulfillment_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.fulfillment_orders` (fk_fulfillment_picking_wave_orders_fulfillment_order_id_499e); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_fulfillment_picking_wave_orders_updated_by_users) |
| `wave_id` | `uuid` | No | — | Reference linking this record to picking waves | Ensures related business data can be joined and validated | FK → `fulfillment.picking_waves` (fk_fulfillment_picking_wave_orders_wave_id_picking_waves) |
| `wave_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.picking_waves` (fk_fulfillment_picking_wave_orders_wave_id_picking_wave_c16a); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the picking wave orders business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Order_Operations, Store_Operations, Warehouse, Delivery_Operations. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `fulfillment.picking_wave_orders` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_fulfillment_picking_wave_orders_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_fulfillment_picking_wave_orders_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `wave_id` → `fulfillment.picking_waves(id)` via `fk_fulfillment_picking_wave_orders_wave_id_picking_waves`; `FOREIGN KEY (wave_id) REFERENCES fulfillment.picking_waves(id) ON DELETE CASCADE`
- `fulfillment_order_id` → `fulfillment.fulfillment_orders(id)` via `fk_fulfillment_picking_wave_orders_fulfillment_order_id_b656`; `FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment.fulfillment_orders(id) ON DELETE CASCADE`
- `fulfillment_order_id_internal_id` → `fulfillment.fulfillment_orders(internal_id)` via `fk_fulfillment_picking_wave_orders_fulfillment_order_id_499e`; `FOREIGN KEY (fulfillment_order_id_internal_id) REFERENCES fulfillment.fulfillment_orders(internal_id) ON DELETE CASCADE`
- `wave_id_internal_id` → `fulfillment.picking_waves(internal_id)` via `fk_fulfillment_picking_wave_orders_wave_id_picking_wave_c16a`; `FOREIGN KEY (wave_id_internal_id) REFERENCES fulfillment.picking_waves(internal_id) ON DELETE CASCADE`

## `fulfillment.picking_wave_orders` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 11 columns, 12 constraints, 3 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_fulfillment_picking_wave_orders_created_by_users` |
| `updated_by` | `identity.users` | `fk_fulfillment_picking_wave_orders_updated_by_users` |
| `wave_id` | `fulfillment.picking_waves` | `fk_fulfillment_picking_wave_orders_wave_id_picking_waves` |
| `fulfillment_order_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_picking_wave_orders_fulfillment_order_id_b656` |
| `fulfillment_order_id_internal_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_picking_wave_orders_fulfillment_order_id_499e` |
| `wave_id_internal_id` | `fulfillment.picking_waves` | `fk_fulfillment_picking_wave_orders_wave_id_picking_wave_c16a` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_fulfillment_picking_wave_orders_numeric_pair_fulfill_ed98` | CHECK | `CHECK ((fulfillment_order_id IS NULL) = (fulfillment_order_id_internal_id IS NULL))` |
| `ck_fulfillment_picking_wave_orders_numeric_pair_wave_id` | CHECK | `CHECK ((wave_id IS NULL) = (wave_id_internal_id IS NULL))` |
| `ck_fulfillment_picking_wave_orders_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_fulfillment_picking_wave_orders_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_fulfillment_picking_wave_orders_fulfillment_order_id_499e` | FOREIGN KEY | `FOREIGN KEY (fulfillment_order_id_internal_id) REFERENCES fulfillment.fulfillment_orders(internal_id) ON DELETE CASCADE` |
| `fk_fulfillment_picking_wave_orders_fulfillment_order_id_b656` | FOREIGN KEY | `FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment.fulfillment_orders(id) ON DELETE CASCADE` |
| `fk_fulfillment_picking_wave_orders_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_fulfillment_picking_wave_orders_wave_id_picking_wave_c16a` | FOREIGN KEY | `FOREIGN KEY (wave_id_internal_id) REFERENCES fulfillment.picking_waves(internal_id) ON DELETE CASCADE` |
| `fk_fulfillment_picking_wave_orders_wave_id_picking_waves` | FOREIGN KEY | `FOREIGN KEY (wave_id) REFERENCES fulfillment.picking_waves(id) ON DELETE CASCADE` |
| `pk_fulfillment_picking_wave_orders` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_fulfillment_picking_wave_orders_id` | UNIQUE | `UNIQUE (id)` |
| `wave_fulfillment_order` | UNIQUE | `UNIQUE (wave_id, fulfillment_order_id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_fulfillment_picking_wave_orders` | `CREATE UNIQUE INDEX pk_fulfillment_picking_wave_orders ON fulfillment.picking_wave_orders USING btree (internal_id)` |
| `uq_fulfillment_picking_wave_orders_id` | `CREATE UNIQUE INDEX uq_fulfillment_picking_wave_orders_id ON fulfillment.picking_wave_orders USING btree (id)` |
| `wave_fulfillment_order` | `CREATE UNIQUE INDEX wave_fulfillment_order ON fulfillment.picking_wave_orders USING btree (wave_id, fulfillment_order_id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.picking_wave_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"],["wave_id","wave_id_internal_id","fulfillment","picking_waves"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON fulfillment.picking_wave_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.picking_wave_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"],["wave_id","wave_id_internal_id","fulfillment","picking_waves"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
