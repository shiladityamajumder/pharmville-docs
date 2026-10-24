# `fulfillment.picking_wave_orders`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds picking wave orders records within the fulfillment domain (picking, packing, and shipment preparation). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | fulfillment.picking_wave_orders |
| Classification | Mapping / Junction |
| Proposed business write owner | Store_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 11 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_fulfillment_picking_wave_orders_created_by_users` |
| `fulfillment_order_id` | `uuid` | No | — | Reference linking this record to fulfillment orders | Ensures related business data can be joined and validated | FK → `fulfillment.fulfillment_orders` via `fk_fulfillment_picking_wave_orders_fulfillment_order_id_b656` |
| `fulfillment_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.fulfillment_orders` via `fk_fulfillment_picking_wave_orders_fulfillment_order_id_499e` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_fulfillment_picking_wave_orders_updated_by_users` |
| `wave_id` | `uuid` | No | — | Reference linking this record to picking waves | Ensures related business data can be joined and validated | FK → `fulfillment.picking_waves` via `fk_fulfillment_picking_wave_orders_wave_id_picking_waves` |
| `wave_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.picking_waves` via `fk_fulfillment_picking_wave_orders_wave_id_picking_wave_c16a` |

## Record lifecycle and users

- **Created:** when the picking wave orders business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Order_Operations, Store_Operations, Warehouse, Delivery_Operations. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `fulfillment.picking_wave_orders` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_fulfillment_picking_wave_orders_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_fulfillment_picking_wave_orders_fulfillment_order_id_499e | `fulfillment_order_id_internal_id` | [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | `FOREIGN KEY (fulfillment_order_id_internal_id) REFERENCES fulfillment.fulfillment_orders(internal_id) ON DELETE CASCADE` |
| fk_fulfillment_picking_wave_orders_fulfillment_order_id_b656 | `fulfillment_order_id` | [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | `FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment.fulfillment_orders(id) ON DELETE CASCADE` |
| fk_fulfillment_picking_wave_orders_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_fulfillment_picking_wave_orders_wave_id_picking_wave_c16a | `wave_id_internal_id` | [`fulfillment.picking_waves`](../../Tables/fulfillment/picking_waves.md) | `FOREIGN KEY (wave_id_internal_id) REFERENCES fulfillment.picking_waves(internal_id) ON DELETE CASCADE` |
| fk_fulfillment_picking_wave_orders_wave_id_picking_waves | `wave_id` | [`fulfillment.picking_waves`](../../Tables/fulfillment/picking_waves.md) | `FOREIGN KEY (wave_id) REFERENCES fulfillment.picking_waves(id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `fulfillment.picking_wave_orders` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_fulfillment_picking_wave_orders_created_by_users` |
| `fulfillment_order_id_internal_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_picking_wave_orders_fulfillment_order_id_499e` |
| `fulfillment_order_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_picking_wave_orders_fulfillment_order_id_b656` |
| `updated_by` | `identity.users` | `fk_fulfillment_picking_wave_orders_updated_by_users` |
| `wave_id_internal_id` | `fulfillment.picking_waves` | `fk_fulfillment_picking_wave_orders_wave_id_picking_wave_c16a` |
| `wave_id` | `fulfillment.picking_waves` | `fk_fulfillment_picking_wave_orders_wave_id_picking_waves` |

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
| `picking_wave_orders_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `picking_wave_orders_fulfillment_order_id_internal_id_not_null` | NOT NULL | `NOT NULL fulfillment_order_id_internal_id` |
| `picking_wave_orders_fulfillment_order_id_not_null` | NOT NULL | `NOT NULL fulfillment_order_id` |
| `picking_wave_orders_id_not_null` | NOT NULL | `NOT NULL id` |
| `picking_wave_orders_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `picking_wave_orders_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `picking_wave_orders_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `picking_wave_orders_wave_id_internal_id_not_null` | NOT NULL | `NOT NULL wave_id_internal_id` |
| `picking_wave_orders_wave_id_not_null` | NOT NULL | `NOT NULL wave_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_fulfillment_picking_wave_orders` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_fulfillment_picking_wave_orders ON fulfillment.picking_wave_orders USING btree (internal_id)` |
| `uq_fulfillment_picking_wave_orders_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_fulfillment_picking_wave_orders_id ON fulfillment.picking_wave_orders USING btree (id)` |
| `wave_fulfillment_order` | btree | `(wave_id, fulfillment_order_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX wave_fulfillment_order ON fulfillment.picking_wave_orders USING btree (wave_id, fulfillment_order_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.picking_wave_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"],["wave_id","wave_id_internal_id","fulfillment","picking_waves"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON fulfillment.picking_wave_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.picking_wave_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"],["wave_id","wave_id_internal_id","fulfillment","picking_waves"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
