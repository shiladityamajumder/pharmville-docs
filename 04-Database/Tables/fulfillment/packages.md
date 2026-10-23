# fulfillment.packages

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds packages records within the fulfillment domain (picking, packing, and shipment preparation). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 20 columns, 14 constraints, 5 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_fulfillment_packages_created_by_users) |
| `dimensions_json` | `jsonb` | No | `'{}'::jsonb` | Structured dimensions json information | Retain a versioned payload or relevant details | See exact constraints |
| `fulfillment_order_id` | `uuid` | No | — | Reference linking this record to fulfillment orders | Ensures related business data can be joined and validated | FK → `fulfillment.fulfillment_orders` (fk_fulfillment_packages_fulfillment_order_id_fulfillment_orders) |
| `fulfillment_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.fulfillment_orders` (fk_fulfillment_packages_fulfillment_order_id_fulfillmen_deb3); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `pack_task_id` | `uuid` | Yes | — | Reference linking this record to pack tasks | Ensures related business data can be joined and validated | FK → `fulfillment.pack_tasks` (fk_fulfillment_packages_pack_task_id_pack_tasks) |
| `pack_task_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.pack_tasks` (fk_fulfillment_packages_pack_task_id_pack_tasks_numeric); Numeric/public-key pair verification required |
| `package_number` | `character varying(64)` | No | — | Inferred: stores package number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `packaging_type` | `character varying(32)` | Yes | — | Inferred: stores packaging type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `packed_at` | `timestamp with time zone` | Yes | — | Time of packed | Support chronology, deadlines or audit evidence | See exact constraints |
| `packed_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_fulfillment_packages_packed_by_user_id_users) |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `tamper_seal_number` | `character varying(128)` | Yes | — | Inferred: stores tamper seal number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `temperature_controlled` | `boolean` | No | `false` | Inferred: stores temperature controlled for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_fulfillment_packages_updated_by_users) |
| `weight_grams` | `integer` | Yes | — | Inferred: stores weight grams for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the packages business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Order_Operations, Store_Operations, Warehouse, Delivery_Operations. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `fulfillment.packages` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `packed_by_user_id` → `identity.users(id)` via `fk_fulfillment_packages_packed_by_user_id_users`; FOREIGN KEY (packed_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL
- `created_by` → `identity.users(id)` via `fk_fulfillment_packages_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_fulfillment_packages_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `fulfillment_order_id` → `fulfillment.fulfillment_orders(id)` via `fk_fulfillment_packages_fulfillment_order_id_fulfillment_orders`; FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment.fulfillment_orders(id) ON DELETE CASCADE
- `pack_task_id` → `fulfillment.pack_tasks(id)` via `fk_fulfillment_packages_pack_task_id_pack_tasks`; FOREIGN KEY (pack_task_id) REFERENCES fulfillment.pack_tasks(id) ON DELETE SET NULL
- `fulfillment_order_id_internal_id` → `fulfillment.fulfillment_orders(internal_id)` via `fk_fulfillment_packages_fulfillment_order_id_fulfillmen_deb3`; FOREIGN KEY (fulfillment_order_id_internal_id) REFERENCES fulfillment.fulfillment_orders(internal_id) ON DELETE CASCADE
- `pack_task_id_internal_id` → `fulfillment.pack_tasks(internal_id)` via `fk_fulfillment_packages_pack_task_id_pack_tasks_numeric`; FOREIGN KEY (pack_task_id_internal_id) REFERENCES fulfillment.pack_tasks(internal_id) ON DELETE SET NULL

**Referenced by 4 FK constraints** (sample): `fulfillment.package_items`, `logistics.shipments`, `fulfillment.package_items`, `logistics.shipments`.

## fulfillment.packages — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 20 columns, 14 constraints, 5 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `packed_by_user_id` | `identity.users` | `fk_fulfillment_packages_packed_by_user_id_users` |
| `created_by` | `identity.users` | `fk_fulfillment_packages_created_by_users` |
| `updated_by` | `identity.users` | `fk_fulfillment_packages_updated_by_users` |
| `fulfillment_order_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_packages_fulfillment_order_id_fulfillment_orders` |
| `pack_task_id` | `fulfillment.pack_tasks` | `fk_fulfillment_packages_pack_task_id_pack_tasks` |
| `fulfillment_order_id_internal_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_packages_fulfillment_order_id_fulfillmen_deb3` |
| `pack_task_id_internal_id` | `fulfillment.pack_tasks` | `fk_fulfillment_packages_pack_task_id_pack_tasks_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_fulfillment_packages_numeric_pair_fulfillment_order_id` | CHECK | `CHECK ((fulfillment_order_id IS NULL) = (fulfillment_order_id_internal_id IS NULL))` |
| `ck_fulfillment_packages_numeric_pair_pack_task_id` | CHECK | `CHECK ((pack_task_id IS NULL) = (pack_task_id_internal_id IS NULL))` |
| `ck_fulfillment_packages_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_fulfillment_packages_weight_positive` | CHECK | `CHECK (weight_grams IS NULL OR weight_grams > 0)` |
| `fk_fulfillment_packages_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_fulfillment_packages_fulfillment_order_id_fulfillmen_deb3` | FOREIGN KEY | `FOREIGN KEY (fulfillment_order_id_internal_id) REFERENCES fulfillment.fulfillment_orders(internal_id) ON DELETE CASCADE` |
| `fk_fulfillment_packages_fulfillment_order_id_fulfillment_orders` | FOREIGN KEY | `FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment.fulfillment_orders(id) ON DELETE CASCADE` |
| `fk_fulfillment_packages_pack_task_id_pack_tasks` | FOREIGN KEY | `FOREIGN KEY (pack_task_id) REFERENCES fulfillment.pack_tasks(id) ON DELETE SET NULL` |
| `fk_fulfillment_packages_pack_task_id_pack_tasks_numeric` | FOREIGN KEY | `FOREIGN KEY (pack_task_id_internal_id) REFERENCES fulfillment.pack_tasks(internal_id) ON DELETE SET NULL` |
| `fk_fulfillment_packages_packed_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (packed_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_fulfillment_packages_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `package_number` | UNIQUE | `UNIQUE (package_number)` |
| `pk_fulfillment_packages` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_fulfillment_packages_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_fulfillment_packages_order` | `CREATE INDEX ix_fulfillment_packages_order ON fulfillment.packages USING btree (fulfillment_order_id)` |
| `ix_fulfillment_packages_status` | `CREATE INDEX ix_fulfillment_packages_status ON fulfillment.packages USING btree (status)` |
| `package_number` | `CREATE UNIQUE INDEX package_number ON fulfillment.packages USING btree (package_number)` |
| `pk_fulfillment_packages` | `CREATE UNIQUE INDEX pk_fulfillment_packages ON fulfillment.packages USING btree (internal_id)` |
| `uq_fulfillment_packages_id` | `CREATE UNIQUE INDEX uq_fulfillment_packages_id ON fulfillment.packages USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.packages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"],["pack_task_id","pack_task_id_internal_id","fulfillment","pack_tasks"]]', 'internal_id', 'id')` |
| `authorized_task_entry` | `CREATE TRIGGER authorized_task_entry BEFORE INSERT OR UPDATE ON fulfillment.packages FOR EACH ROW EXECUTE FUNCTION fulfillment.guard_task_entry()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON fulfillment.packages FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.packages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"],["pack_task_id","pack_task_id_internal_id","fulfillment","pack_tasks"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
