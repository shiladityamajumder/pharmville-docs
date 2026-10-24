# `fulfillment.fulfillment_events`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds fulfillment events records within the fulfillment domain (picking, packing, and shipment preparation). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | fulfillment.fulfillment_events |
| Classification | Audit / History |
| Proposed business write owner | Store_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 8 columns; 6 PK/FK/UQ/CHECK/exclusion constraints; 7 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `actor_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_fulfillment_fulfillment_events_actor_user_id_users` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `event_type` | `character varying(64)` | No | — | Inferred: stores event type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `fulfillment_order_id` | `uuid` | No | — | Reference linking this record to fulfillment orders | Ensures related business data can be joined and validated | FK → `fulfillment.fulfillment_orders` via `fk_fulfillment_fulfillment_events_fulfillment_order_id__da3e` |
| `fulfillment_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.fulfillment_orders` via `fk_fulfillment_fulfillment_events_fulfillment_order_id__2c47` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `payload` | `jsonb` | No | `'{}'::jsonb` | Structured payload information | Retain a versioned payload or relevant details | Exact constraints below |

## Record lifecycle and users

- **Created:** when the fulfillment events business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Order_Operations, Store_Operations, Warehouse, Delivery_Operations. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `fulfillment.fulfillment_events` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_fulfillment_fulfillment_events_actor_user_id_users | `actor_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_fulfillment_fulfillment_events_fulfillment_order_id__2c47 | `fulfillment_order_id_internal_id` | [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | `FOREIGN KEY (fulfillment_order_id_internal_id) REFERENCES fulfillment.fulfillment_orders(internal_id) ON DELETE CASCADE` |
| fk_fulfillment_fulfillment_events_fulfillment_order_id__da3e | `fulfillment_order_id` | [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | `FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment.fulfillment_orders(id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `fulfillment.fulfillment_events` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `actor_user_id` | `identity.users` | `fk_fulfillment_fulfillment_events_actor_user_id_users` |
| `fulfillment_order_id_internal_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_fulfillment_events_fulfillment_order_id__2c47` |
| `fulfillment_order_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_fulfillment_events_fulfillment_order_id__da3e` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_fulfillment_fulfillment_events_numeric_pair_fulfillm_7045` | CHECK | `CHECK ((fulfillment_order_id IS NULL) = (fulfillment_order_id_internal_id IS NULL))` |
| `fk_fulfillment_fulfillment_events_actor_user_id_users` | FOREIGN KEY | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_fulfillment_fulfillment_events_fulfillment_order_id__2c47` | FOREIGN KEY | `FOREIGN KEY (fulfillment_order_id_internal_id) REFERENCES fulfillment.fulfillment_orders(internal_id) ON DELETE CASCADE` |
| `fk_fulfillment_fulfillment_events_fulfillment_order_id__da3e` | FOREIGN KEY | `FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment.fulfillment_orders(id) ON DELETE CASCADE` |
| `pk_fulfillment_fulfillment_events` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_fulfillment_fulfillment_events_id` | UNIQUE | `UNIQUE (id)` |
| `fulfillment_events_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `fulfillment_events_event_type_not_null` | NOT NULL | `NOT NULL event_type` |
| `fulfillment_events_fulfillment_order_id_internal_id_not_null` | NOT NULL | `NOT NULL fulfillment_order_id_internal_id` |
| `fulfillment_events_fulfillment_order_id_not_null` | NOT NULL | `NOT NULL fulfillment_order_id` |
| `fulfillment_events_id_not_null` | NOT NULL | `NOT NULL id` |
| `fulfillment_events_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `fulfillment_events_payload_not_null` | NOT NULL | `NOT NULL payload` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_fulfillment_events_order_time` | btree | `(fulfillment_order_id, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_fulfillment_events_order_time ON fulfillment.fulfillment_events USING btree (fulfillment_order_id, created_at)` |
| `pk_fulfillment_fulfillment_events` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_fulfillment_fulfillment_events ON fulfillment.fulfillment_events USING btree (internal_id)` |
| `uq_fulfillment_fulfillment_events_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_fulfillment_fulfillment_events_id ON fulfillment.fulfillment_events USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.fulfillment_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON fulfillment.fulfillment_events FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.fulfillment_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
