# `fulfillment.fulfillment_order_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds fulfillment order items records within the fulfillment domain (picking, packing, and shipment preparation). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | fulfillment.fulfillment_order_items |
| Classification | Transactional |
| Proposed business write owner | Store_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 15 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_fulfillment_fulfillment_order_items_created_by_users` |
| `fulfilled_qty` | `numeric(12,3)` | No | `0` | Fulfilled qty value | Track resource or item amounts accurately | Exact constraints below |
| `fulfillment_order_id` | `uuid` | No | — | Reference linking this record to fulfillment orders | Ensures related business data can be joined and validated | FK → `fulfillment.fulfillment_orders` via `fk_fulfillment_fulfillment_order_items_fulfillment_orde_9a2d` |
| `fulfillment_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.fulfillment_orders` via `fk_fulfillment_fulfillment_order_items_fulfillment_orde_ba7f` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `order_item_id` | `uuid` | No | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` via `fk_fulfillment_fulfillment_order_items_order_item_id_or_9354` |
| `order_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` via `fk_fulfillment_fulfillment_order_items_order_item_id_or_caeb` |
| `required_qty` | `numeric(12,3)` | No | — | Required qty value | Track resource or item amounts accurately | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_fulfillment_fulfillment_order_items_updated_by_users` |

## Record lifecycle and users

- **Created:** when the fulfillment order items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Order_Operations, Store_Operations, Warehouse, Delivery_Operations. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `fulfillment.fulfillment_order_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_fulfillment_fulfillment_order_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_fulfillment_fulfillment_order_items_fulfillment_orde_9a2d | `fulfillment_order_id` | [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | `FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment.fulfillment_orders(id) ON DELETE CASCADE` |
| fk_fulfillment_fulfillment_order_items_fulfillment_orde_ba7f | `fulfillment_order_id_internal_id` | [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | `FOREIGN KEY (fulfillment_order_id_internal_id) REFERENCES fulfillment.fulfillment_orders(internal_id) ON DELETE CASCADE` |
| fk_fulfillment_fulfillment_order_items_order_item_id_or_9354 | `order_item_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT` |
| fk_fulfillment_fulfillment_order_items_order_item_id_or_caeb | `order_item_id_internal_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT` |
| fk_fulfillment_fulfillment_order_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `fulfillment.fulfillment_order_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_fulfillment_fulfillment_order_items_created_by_users` |
| `fulfillment_order_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_fulfillment_order_items_fulfillment_orde_9a2d` |
| `fulfillment_order_id_internal_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_fulfillment_order_items_fulfillment_orde_ba7f` |
| `order_item_id` | `commerce.order_items` | `fk_fulfillment_fulfillment_order_items_order_item_id_or_9354` |
| `order_item_id_internal_id` | `commerce.order_items` | `fk_fulfillment_fulfillment_order_items_order_item_id_or_caeb` |
| `updated_by` | `identity.users` | `fk_fulfillment_fulfillment_order_items_updated_by_users` |

### Existing constraints

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
| `fulfillment_order_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `fulfillment_order_items_fulfilled_qty_not_null` | NOT NULL | `NOT NULL fulfilled_qty` |
| `fulfillment_order_items_fulfillment_order_id_internal__not_null` | NOT NULL | `NOT NULL fulfillment_order_id_internal_id` |
| `fulfillment_order_items_fulfillment_order_id_not_null` | NOT NULL | `NOT NULL fulfillment_order_id` |
| `fulfillment_order_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `fulfillment_order_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `fulfillment_order_items_order_item_id_internal_id_not_null` | NOT NULL | `NOT NULL order_item_id_internal_id` |
| `fulfillment_order_items_order_item_id_not_null` | NOT NULL | `NOT NULL order_item_id` |
| `fulfillment_order_items_required_qty_not_null` | NOT NULL | `NOT NULL required_qty` |
| `fulfillment_order_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `fulfillment_order_items_status_not_null` | NOT NULL | `NOT NULL status` |
| `fulfillment_order_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `fulfillment_order_item` | btree | `(fulfillment_order_id, order_item_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX fulfillment_order_item ON fulfillment.fulfillment_order_items USING btree (fulfillment_order_id, order_item_id)` |
| `ix_fulfillment_order_items_order` | btree | `(fulfillment_order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_fulfillment_order_items_order ON fulfillment.fulfillment_order_items USING btree (fulfillment_order_id)` |
| `pk_fulfillment_fulfillment_order_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_fulfillment_fulfillment_order_items ON fulfillment.fulfillment_order_items USING btree (internal_id)` |
| `uq_fulfillment_fulfillment_order_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_fulfillment_fulfillment_order_items_id ON fulfillment.fulfillment_order_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.fulfillment_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"],["order_item_id","order_item_id_internal_id","commerce","order_items"]]', 'internal_id', 'id')` | O |
| `authorized_task_entry` | `CREATE TRIGGER authorized_task_entry BEFORE INSERT OR UPDATE ON fulfillment.fulfillment_order_items FOR EACH ROW EXECUTE FUNCTION fulfillment.guard_task_entry()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON fulfillment.fulfillment_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.fulfillment_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"],["order_item_id","order_item_id_internal_id","commerce","order_items"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
