# `fulfillment.pack_tasks`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds pack tasks records within the fulfillment domain (picking, packing, and shipment preparation). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 13 columns, 9 constraints, 4 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `assigned_to_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_fulfillment_pack_tasks_assigned_to_user_id_users) |
| `completed_at` | `timestamp with time zone` | Yes | — | Time of completed | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_fulfillment_pack_tasks_created_by_users) |
| `fulfillment_order_id` | `uuid` | No | — | Reference linking this record to fulfillment orders | Ensures related business data can be joined and validated | FK → `fulfillment.fulfillment_orders` (fk_fulfillment_pack_tasks_fulfillment_order_id_fulfillm_f6c1) |
| `fulfillment_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.fulfillment_orders` (fk_fulfillment_pack_tasks_fulfillment_order_id_fulfillm_046e); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `started_at` | `timestamp with time zone` | Yes | — | Time of started | Support chronology, deadlines or audit evidence | See exact constraints |
| `status` | `character varying(32)` | No | `'created'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_fulfillment_pack_tasks_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the pack tasks business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Order_Operations, Store_Operations, Warehouse, Delivery_Operations. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `fulfillment.pack_tasks` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `assigned_to_user_id` → `identity.users(id)` via `fk_fulfillment_pack_tasks_assigned_to_user_id_users`; `FOREIGN KEY (assigned_to_user_id) REFERENCES identity.users(id) ON DELETE SET NULL`
- `created_by` → `identity.users(id)` via `fk_fulfillment_pack_tasks_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_fulfillment_pack_tasks_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `fulfillment_order_id` → `fulfillment.fulfillment_orders(id)` via `fk_fulfillment_pack_tasks_fulfillment_order_id_fulfillm_f6c1`; `FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment.fulfillment_orders(id) ON DELETE CASCADE`
- `fulfillment_order_id_internal_id` → `fulfillment.fulfillment_orders(internal_id)` via `fk_fulfillment_pack_tasks_fulfillment_order_id_fulfillm_046e`; `FOREIGN KEY (fulfillment_order_id_internal_id) REFERENCES fulfillment.fulfillment_orders(internal_id) ON DELETE CASCADE`

**Referenced by 2 FK constraints** (sample): `fulfillment.packages`, `fulfillment.packages`.

## `fulfillment.pack_tasks` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 13 columns, 9 constraints, 4 indexes, 4 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `assigned_to_user_id` | `identity.users` | `fk_fulfillment_pack_tasks_assigned_to_user_id_users` |
| `created_by` | `identity.users` | `fk_fulfillment_pack_tasks_created_by_users` |
| `updated_by` | `identity.users` | `fk_fulfillment_pack_tasks_updated_by_users` |
| `fulfillment_order_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_pack_tasks_fulfillment_order_id_fulfillm_f6c1` |
| `fulfillment_order_id_internal_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_pack_tasks_fulfillment_order_id_fulfillm_046e` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_fulfillment_pack_tasks_numeric_pair_fulfillment_order_id` | CHECK | `CHECK ((fulfillment_order_id IS NULL) = (fulfillment_order_id_internal_id IS NULL))` |
| `ck_fulfillment_pack_tasks_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_fulfillment_pack_tasks_assigned_to_user_id_users` | FOREIGN KEY | `FOREIGN KEY (assigned_to_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_fulfillment_pack_tasks_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_fulfillment_pack_tasks_fulfillment_order_id_fulfillm_046e` | FOREIGN KEY | `FOREIGN KEY (fulfillment_order_id_internal_id) REFERENCES fulfillment.fulfillment_orders(internal_id) ON DELETE CASCADE` |
| `fk_fulfillment_pack_tasks_fulfillment_order_id_fulfillm_f6c1` | FOREIGN KEY | `FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment.fulfillment_orders(id) ON DELETE CASCADE` |
| `fk_fulfillment_pack_tasks_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_fulfillment_pack_tasks` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_fulfillment_pack_tasks_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_fulfillment_pack_tasks_assignee_status` | `CREATE INDEX ix_fulfillment_pack_tasks_assignee_status ON fulfillment.pack_tasks USING btree (assigned_to_user_id, status)` |
| `ix_fulfillment_pack_tasks_order` | `CREATE INDEX ix_fulfillment_pack_tasks_order ON fulfillment.pack_tasks USING btree (fulfillment_order_id)` |
| `pk_fulfillment_pack_tasks` | `CREATE UNIQUE INDEX pk_fulfillment_pack_tasks ON fulfillment.pack_tasks USING btree (internal_id)` |
| `uq_fulfillment_pack_tasks_id` | `CREATE UNIQUE INDEX uq_fulfillment_pack_tasks_id ON fulfillment.pack_tasks USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.pack_tasks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"]]', 'internal_id', 'id')` |
| `authorized_task_entry` | `CREATE TRIGGER authorized_task_entry BEFORE INSERT OR UPDATE ON fulfillment.pack_tasks FOR EACH ROW EXECUTE FUNCTION fulfillment.guard_task_entry()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON fulfillment.pack_tasks FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.pack_tasks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
