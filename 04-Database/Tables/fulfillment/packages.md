# `fulfillment.packages`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds packages records within the fulfillment domain (picking, packing, and shipment preparation). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | fulfillment.packages |
| Classification | Transactional |
| Proposed business write owner | Store_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 20 columns; 14 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_fulfillment_packages_created_by_users` |
| `dimensions_json` | `jsonb` | No | `'{}'::jsonb` | Structured dimensions json information | Retain a versioned payload or relevant details | Exact constraints below |
| `fulfillment_order_id` | `uuid` | No | — | Reference linking this record to fulfillment orders | Ensures related business data can be joined and validated | FK → `fulfillment.fulfillment_orders` via `fk_fulfillment_packages_fulfillment_order_id_fulfillment_orders` |
| `fulfillment_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.fulfillment_orders` via `fk_fulfillment_packages_fulfillment_order_id_fulfillmen_deb3` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `pack_task_id` | `uuid` | Yes | — | Reference linking this record to pack tasks | Ensures related business data can be joined and validated | FK → `fulfillment.pack_tasks` via `fk_fulfillment_packages_pack_task_id_pack_tasks` |
| `pack_task_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.pack_tasks` via `fk_fulfillment_packages_pack_task_id_pack_tasks_numeric` |
| `package_number` | `character varying(64)` | No | — | Inferred: stores package number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `packaging_type` | `character varying(32)` | Yes | — | Inferred: stores packaging type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `packed_at` | `timestamp with time zone` | Yes | — | Time of packed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `packed_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_fulfillment_packages_packed_by_user_id_users` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `tamper_seal_number` | `character varying(128)` | Yes | — | Inferred: stores tamper seal number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `temperature_controlled` | `boolean` | No | `false` | Inferred: stores temperature controlled for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_fulfillment_packages_updated_by_users` |
| `weight_grams` | `integer` | Yes | — | Inferred: stores weight grams for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the packages business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Order_Operations, Store_Operations, Warehouse, Delivery_Operations. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `fulfillment.packages` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_fulfillment_packages_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_fulfillment_packages_fulfillment_order_id_fulfillmen_deb3 | `fulfillment_order_id_internal_id` | [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | `FOREIGN KEY (fulfillment_order_id_internal_id) REFERENCES fulfillment.fulfillment_orders(internal_id) ON DELETE CASCADE` |
| fk_fulfillment_packages_fulfillment_order_id_fulfillment_orders | `fulfillment_order_id` | [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | `FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment.fulfillment_orders(id) ON DELETE CASCADE` |
| fk_fulfillment_packages_pack_task_id_pack_tasks | `pack_task_id` | [`fulfillment.pack_tasks`](../../Tables/fulfillment/pack_tasks.md) | `FOREIGN KEY (pack_task_id) REFERENCES fulfillment.pack_tasks(id) ON DELETE SET NULL` |
| fk_fulfillment_packages_pack_task_id_pack_tasks_numeric | `pack_task_id_internal_id` | [`fulfillment.pack_tasks`](../../Tables/fulfillment/pack_tasks.md) | `FOREIGN KEY (pack_task_id_internal_id) REFERENCES fulfillment.pack_tasks(internal_id) ON DELETE SET NULL` |
| fk_fulfillment_packages_packed_by_user_id_users | `packed_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (packed_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_fulfillment_packages_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`fulfillment.package_items`](../../Tables/fulfillment/package_items.md) | fk_fulfillment_package_items_package_id_packages | `package_id` | `id` |
| [`fulfillment.package_items`](../../Tables/fulfillment/package_items.md) | fk_fulfillment_package_items_package_id_packages_numeric | `package_id_internal_id` | `internal_id` |
| [`logistics.shipments`](../../Tables/logistics/shipments.md) | fk_logistics_shipments_package_id_packages | `package_id` | `id` |
| [`logistics.shipments`](../../Tables/logistics/shipments.md) | fk_logistics_shipments_package_id_packages_numeric | `package_id_internal_id` | `internal_id` |

## `fulfillment.packages` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_fulfillment_packages_created_by_users` |
| `fulfillment_order_id_internal_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_packages_fulfillment_order_id_fulfillmen_deb3` |
| `fulfillment_order_id` | `fulfillment.fulfillment_orders` | `fk_fulfillment_packages_fulfillment_order_id_fulfillment_orders` |
| `pack_task_id` | `fulfillment.pack_tasks` | `fk_fulfillment_packages_pack_task_id_pack_tasks` |
| `pack_task_id_internal_id` | `fulfillment.pack_tasks` | `fk_fulfillment_packages_pack_task_id_pack_tasks_numeric` |
| `packed_by_user_id` | `identity.users` | `fk_fulfillment_packages_packed_by_user_id_users` |
| `updated_by` | `identity.users` | `fk_fulfillment_packages_updated_by_users` |

### Existing constraints

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
| `packages_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `packages_dimensions_json_not_null` | NOT NULL | `NOT NULL dimensions_json` |
| `packages_fulfillment_order_id_internal_id_not_null` | NOT NULL | `NOT NULL fulfillment_order_id_internal_id` |
| `packages_fulfillment_order_id_not_null` | NOT NULL | `NOT NULL fulfillment_order_id` |
| `packages_id_not_null` | NOT NULL | `NOT NULL id` |
| `packages_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `packages_package_number_not_null` | NOT NULL | `NOT NULL package_number` |
| `packages_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `packages_status_not_null` | NOT NULL | `NOT NULL status` |
| `packages_temperature_controlled_not_null` | NOT NULL | `NOT NULL temperature_controlled` |
| `packages_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_fulfillment_packages_order` | btree | `(fulfillment_order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_fulfillment_packages_order ON fulfillment.packages USING btree (fulfillment_order_id)` |
| `ix_fulfillment_packages_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_fulfillment_packages_status ON fulfillment.packages USING btree (status)` |
| `package_number` | btree | `(package_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX package_number ON fulfillment.packages USING btree (package_number)` |
| `pk_fulfillment_packages` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_fulfillment_packages ON fulfillment.packages USING btree (internal_id)` |
| `uq_fulfillment_packages_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_fulfillment_packages_id ON fulfillment.packages USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.packages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"],["pack_task_id","pack_task_id_internal_id","fulfillment","pack_tasks"]]', 'internal_id', 'id')` | O |
| `authorized_task_entry` | `CREATE TRIGGER authorized_task_entry BEFORE INSERT OR UPDATE ON fulfillment.packages FOR EACH ROW EXECUTE FUNCTION fulfillment.guard_task_entry()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON fulfillment.packages FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.packages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["fulfillment_order_id","fulfillment_order_id_internal_id","fulfillment","fulfillment_orders"],["pack_task_id","pack_task_id_internal_id","fulfillment","pack_tasks"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
