# `fulfillment.fulfillment_events`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds fulfillment events records within the fulfillment domain (picking, packing, and shipment preparation). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 8 columns, 6 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `actor_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_fulfillment_fulfillment_events_actor_user_id_users) |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `event_type` | `character varying(64)` | No | — | Inferred: stores event type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `fulfillment_order_id` | `uuid` | No | — | Reference linking this record to fulfillment orders | Ensures related business data can be joined and validated | FK → `fulfillment.fulfillment_orders` (fk_fulfillment_fulfillment_events_fulfillment_order_id__da3e) |
| `fulfillment_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.fulfillment_orders` (fk_fulfillment_fulfillment_events_fulfillment_order_id__2c47); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `payload` | `jsonb` | No | `'{}'::jsonb` | Structured payload information | Retain a versioned payload or relevant details | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the fulfillment events business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Order_Operations, Store_Operations, Warehouse, Delivery_Operations. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `fulfillment.fulfillment_events` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `actor_user_id` → `identity.users(id)` via `fk_fulfillment_fulfillment_events_actor_user_id_users`; `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `fulfillment_order_id` → `fulfillment.fulfillment_orders(id)` via `fk_fulfillment_fulfillment_events_fulfillment_order_id__da3e`; `FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment.fulfillment_orders(id) ON DELETE CASCADE`
- `fulfillment_order_id_internal_id` → `fulfillment.fulfillment_orders(internal_id)` via `fk_fulfillment_fulfillment_events_fulfillment_order_id__2c47`; `FOREIGN KEY (fulfillment_order_id_internal_id) REFERENCES fulfillment.fulfillment_orders(internal_id) ON DELETE CASCADE`

## `fulfillment.fulfillment_events` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 8 columns, 6 constraints, 3 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `actor_user_id` | `identity.users` | `fk_fulfillment_fulfillment_events_actor_user_id_users` |
| `fulfillment_order_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_fulfillment_events_fulfillment_order_id__da3e` |
| `fulfillment_order_id_internal_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_fulfillment_events_fulfillment_order_id__2c47` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_fulfillment_fulfillment_events_numeric_pair_fulfillm_7045` | CHECK | `CHECK ((fulfillment_order_id IS NULL) = (fulfillment_order_id_internal_id IS NULL))` |
| `fk_fulfillment_fulfillment_events_actor_user_id_users` | FOREIGN KEY | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_fulfillment_fulfillment_events_fulfillment_order_id__2c47` | FOREIGN KEY | `FOREIGN KEY (fulfillment_order_id_internal_id) REFERENCES fulfillment.fulfillment_orders(internal_id) ON DELETE CASCADE` |
| `fk_fulfillment_fulfillment_events_fulfillment_order_id__da3e` | FOREIGN KEY | `FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment.fulfillment_orders(id) ON DELETE CASCADE` |
| `pk_fulfillment_fulfillment_events` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_fulfillment_fulfillment_events_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_fulfillment_events_order_time` | `CREATE INDEX ix_fulfillment_events_order_time ON fulfillment.fulfillment_events USING btree (fulfillment_order_id, created_at)` |
| `pk_fulfillment_fulfillment_events` | `CREATE UNIQUE INDEX pk_fulfillment_fulfillment_events ON fulfillment.fulfillment_events USING btree (internal_id)` |
| `uq_fulfillment_fulfillment_events_id` | `CREATE UNIQUE INDEX uq_fulfillment_fulfillment_events_id ON fulfillment.fulfillment_events USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.fulfillment_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON fulfillment.fulfillment_events FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.fulfillment_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
