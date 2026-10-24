# `logistics.shipments`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds shipments records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 31 columns, 33 constraints, 8 indexes, 5 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `carrier_account_id` | `uuid` | Yes | — | Reference linking this record to carrier accounts | Ensures related business data can be joined and validated | FK → `logistics.carrier_accounts` (fk_logistics_shipments_carrier_account_id_carrier_accounts) |
| `carrier_account_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.carrier_accounts` (fk_logistics_shipments_carrier_account_id_carrier_accou_456d); Numeric/public-key pair verification required |
| `carrier_id` | `uuid` | No | — | Reference linking this record to carriers | Ensures related business data can be joined and validated | FK → `logistics.carriers` (fk_logistics_shipments_carrier_id_carriers) |
| `carrier_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.carriers` (fk_logistics_shipments_carrier_id_carriers_numeric); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_shipments_created_by_users) |
| `delivered_at` | `timestamp with time zone` | Yes | — | Time of delivered | Support chronology, deadlines or audit evidence | See exact constraints |
| `delivery_slot_id` | `uuid` | Yes | — | Reference linking this record to delivery slots | Ensures related business data can be joined and validated | FK → `logistics.delivery_slots` (fk_logistics_shipments_delivery_slot_id_delivery_slots) |
| `delivery_slot_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.delivery_slots` (fk_logistics_shipments_delivery_slot_id_delivery_slots_numeric); Numeric/public-key pair verification required |
| `destination_snapshot` | `jsonb` | No | — | Structured destination snapshot information | Retain a versioned payload or relevant details | See exact constraints |
| `dispatched_at` | `timestamp with time zone` | Yes | — | Time of dispatched | Support chronology, deadlines or audit evidence | See exact constraints |
| `estimated_delivery_at` | `timestamp with time zone` | Yes | — | Time of estimated delivery | Support chronology, deadlines or audit evidence | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `order_group_id` | `uuid` | Yes | — | Reference linking this record to order groups | Ensures related business data can be joined and validated | FK → `commerce.order_groups` (fk_logistics_shipments_order_group_id_order_groups); FK → `commerce.order_groups` (fk_logistics_shipments_group_order) |
| `order_group_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_groups` (fk_logistics_shipments_group_order_numeric); FK → `commerce.order_groups` (fk_logistics_shipments_order_group_id_order_groups_numeric); Numeric/public-key pair verification required |
| `order_id` | `uuid` | No | — | Reference linking this record to order groups | Ensures related business data can be joined and validated | FK → `commerce.order_groups` (fk_logistics_shipments_group_order); FK → `commerce.orders` (fk_logistics_shipments_order_id_orders); FK → `commerce.order_revisions` (fk_logistics_shipments_revision_scope) |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_groups` (fk_logistics_shipments_group_order_numeric); FK → `commerce.orders` (fk_logistics_shipments_order_id_orders_numeric); FK → `commerce.order_revisions` (fk_logistics_shipments_revision_scope_numeric); Numeric/public-key pair verification required |
| `order_revision_id` | `uuid` | Yes | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` (fk_logistics_shipments_revision_scope) |
| `order_revision_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_revisions` (fk_logistics_shipments_revision_scope_numeric); Numeric/public-key pair verification required |
| `package_id` | `uuid` | No | — | Reference linking this record to packages | Ensures related business data can be joined and validated | FK → `fulfillment.packages` (fk_logistics_shipments_package_id_packages) |
| `package_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.packages` (fk_logistics_shipments_package_id_packages_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `service_type` | `character varying(32)` | No | — | Inferred: stores service type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `shipment_number` | `character varying(64)` | No | — | Inferred: stores shipment number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `shipping_label_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_logistics_shipments_shipping_label_file_id_file_objects) |
| `shipping_label_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_logistics_shipments_shipping_label_file_id_file_obje_c402); Numeric/public-key pair verification required |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `tracking_number` | `character varying(128)` | Yes | — | Inferred: stores tracking number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_shipments_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the shipments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.shipments` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_logistics_shipments_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_logistics_shipments_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `order_group_id` → `commerce.order_groups(id)` via `fk_logistics_shipments_order_group_id_order_groups`; `FOREIGN KEY (order_group_id) REFERENCES commerce.order_groups(id) ON DELETE SET NULL`
- `carrier_id` → `logistics.carriers(id)` via `fk_logistics_shipments_carrier_id_carriers`; `FOREIGN KEY (carrier_id) REFERENCES logistics.carriers(id) ON DELETE RESTRICT`
- `order_group_id, order_id` → `commerce.order_groups(id, order_id)` via `fk_logistics_shipments_group_order`; `FOREIGN KEY (order_group_id, order_id) REFERENCES commerce.order_groups(id, order_id) ON DELETE RESTRICT`
- `order_id` → `commerce.orders(id)` via `fk_logistics_shipments_order_id_orders`; `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT`
- `carrier_account_id` → `logistics.carrier_accounts(id)` via `fk_logistics_shipments_carrier_account_id_carrier_accounts`; `FOREIGN KEY (carrier_account_id) REFERENCES logistics.carrier_accounts(id) ON DELETE SET NULL`
- `order_revision_id, order_id` → `commerce.order_revisions(id, order_id)` via `fk_logistics_shipments_revision_scope`; `FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT`
- `delivery_slot_id` → `logistics.delivery_slots(id)` via `fk_logistics_shipments_delivery_slot_id_delivery_slots`; `FOREIGN KEY (delivery_slot_id) REFERENCES logistics.delivery_slots(id) ON DELETE SET NULL`
- `package_id` → `fulfillment.packages(id)` via `fk_logistics_shipments_package_id_packages`; `FOREIGN KEY (package_id) REFERENCES fulfillment.packages(id) ON DELETE RESTRICT`
- `shipping_label_file_id` → `platform.file_objects(id)` via `fk_logistics_shipments_shipping_label_file_id_file_objects`; `FOREIGN KEY (shipping_label_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL`
- `carrier_account_id_internal_id` → `logistics.carrier_accounts(internal_id)` via `fk_logistics_shipments_carrier_account_id_carrier_accou_456d`; `FOREIGN KEY (carrier_account_id_internal_id) REFERENCES logistics.carrier_accounts(internal_id) ON DELETE SET NULL`
- `carrier_id_internal_id` → `logistics.carriers(internal_id)` via `fk_logistics_shipments_carrier_id_carriers_numeric`; `FOREIGN KEY (carrier_id_internal_id) REFERENCES logistics.carriers(internal_id) ON DELETE RESTRICT`
- `delivery_slot_id_internal_id` → `logistics.delivery_slots(internal_id)` via `fk_logistics_shipments_delivery_slot_id_delivery_slots_numeric`; `FOREIGN KEY (delivery_slot_id_internal_id) REFERENCES logistics.delivery_slots(internal_id) ON DELETE SET NULL`
- `order_group_id_internal_id, order_id_internal_id` → `commerce.order_groups(internal_id, order_id_internal_id)` via `fk_logistics_shipments_group_order_numeric`; `FOREIGN KEY (order_group_id_internal_id, order_id_internal_id) REFERENCES commerce.order_groups(internal_id, order_id_internal_id) ON DELETE RESTRICT`
- `order_group_id_internal_id` → `commerce.order_groups(internal_id)` via `fk_logistics_shipments_order_group_id_order_groups_numeric`; `FOREIGN KEY (order_group_id_internal_id) REFERENCES commerce.order_groups(internal_id) ON DELETE SET NULL`
- `order_id_internal_id` → `commerce.orders(internal_id)` via `fk_logistics_shipments_order_id_orders_numeric`; `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT`
- `package_id_internal_id` → `fulfillment.packages(internal_id)` via `fk_logistics_shipments_package_id_packages_numeric`; `FOREIGN KEY (package_id_internal_id) REFERENCES fulfillment.packages(internal_id) ON DELETE RESTRICT`
- `order_revision_id_internal_id, order_id_internal_id` → `commerce.order_revisions(internal_id, order_id_internal_id)` via `fk_logistics_shipments_revision_scope_numeric`; `FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT`
- `shipping_label_file_id_internal_id` → `platform.file_objects(internal_id)` via `fk_logistics_shipments_shipping_label_file_id_file_obje_c402`; `FOREIGN KEY (shipping_label_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL`

**Referenced by 12 FK constraints** (sample): `logistics.shipment_events`, `logistics.delivery_assignments`, `logistics.delivery_attempts`, `logistics.ndr_cases`, `payment.cod_collections`, `logistics.delivery_otp_challenges`, `logistics.delivery_assignments`, `logistics.delivery_attempts`, `logistics.delivery_otp_challenges`, `logistics.ndr_cases`, `logistics.shipment_events`, `payment.cod_collections`.

## `logistics.shipments` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 31 columns, 33 constraints, 8 indexes, 5 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_logistics_shipments_created_by_users` |
| `updated_by` | `identity.users` | `fk_logistics_shipments_updated_by_users` |
| `order_group_id` | `commerce.order_groups` | `fk_logistics_shipments_order_group_id_order_groups` |
| `carrier_id` | `logistics.carriers` | `fk_logistics_shipments_carrier_id_carriers` |
| `order_group_id`, `order_id` | `commerce.order_groups` | `fk_logistics_shipments_group_order` |
| `order_id` | `commerce.orders` | `fk_logistics_shipments_order_id_orders` |
| `carrier_account_id` | `logistics.carrier_accounts` | `fk_logistics_shipments_carrier_account_id_carrier_accounts` |
| `order_revision_id`, `order_id` | `commerce.order_revisions` | `fk_logistics_shipments_revision_scope` |
| `delivery_slot_id` | `logistics.delivery_slots` | `fk_logistics_shipments_delivery_slot_id_delivery_slots` |
| `package_id` | `fulfillment.packages` | `fk_logistics_shipments_package_id_packages` |
| `shipping_label_file_id` | `platform.file_objects` | `fk_logistics_shipments_shipping_label_file_id_file_objects` |
| `carrier_account_id_internal_id` | `logistics.carrier_accounts` | `fk_logistics_shipments_carrier_account_id_carrier_accou_456d` |
| `carrier_id_internal_id` | `logistics.carriers` | `fk_logistics_shipments_carrier_id_carriers_numeric` |
| `delivery_slot_id_internal_id` | `logistics.delivery_slots` | `fk_logistics_shipments_delivery_slot_id_delivery_slots_numeric` |
| `order_group_id_internal_id`, `order_id_internal_id` | `commerce.order_groups` | `fk_logistics_shipments_group_order_numeric` |
| `order_group_id_internal_id` | `commerce.order_groups` | `fk_logistics_shipments_order_group_id_order_groups_numeric` |
| `order_id_internal_id` | `commerce.orders` | `fk_logistics_shipments_order_id_orders_numeric` |
| `package_id_internal_id` | `fulfillment.packages` | `fk_logistics_shipments_package_id_packages_numeric` |
| `order_revision_id_internal_id`, `order_id_internal_id` | `commerce.order_revisions` | `fk_logistics_shipments_revision_scope_numeric` |
| `shipping_label_file_id_internal_id` | `platform.file_objects` | `fk_logistics_shipments_shipping_label_file_id_file_obje_c402` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_shipments_numeric_pair_carrier_account_id` | CHECK | `CHECK ((carrier_account_id IS NULL) = (carrier_account_id_internal_id IS NULL))` |
| `ck_logistics_shipments_numeric_pair_carrier_id` | CHECK | `CHECK ((carrier_id IS NULL) = (carrier_id_internal_id IS NULL))` |
| `ck_logistics_shipments_numeric_pair_delivery_slot_id` | CHECK | `CHECK ((delivery_slot_id IS NULL) = (delivery_slot_id_internal_id IS NULL))` |
| `ck_logistics_shipments_numeric_pair_order_group_id` | CHECK | `CHECK ((order_group_id IS NULL) = (order_group_id_internal_id IS NULL))` |
| `ck_logistics_shipments_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_logistics_shipments_numeric_pair_order_revision_id` | CHECK | `CHECK ((order_revision_id IS NULL) = (order_revision_id_internal_id IS NULL))` |
| `ck_logistics_shipments_numeric_pair_package_id` | CHECK | `CHECK ((package_id IS NULL) = (package_id_internal_id IS NULL))` |
| `ck_logistics_shipments_numeric_pair_shipping_label_file_id` | CHECK | `CHECK ((shipping_label_file_id IS NULL) = (shipping_label_file_id_internal_id IS NULL))` |
| `ck_logistics_shipments_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_logistics_shipments_shipmentstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['created'::text, 'label_created'::text, 'pickup_scheduled'::text, 'picked_up'::text, 'in_transit'::text, 'out_for_delivery'::text, 'delivered'::text, 'delivery_failed'::text, 'rto_initiated'::text, 'rto_delivered'::text, 'cancelled'::text]))` |
| `fk_logistics_shipments_carrier_account_id_carrier_accou_456d` | FOREIGN KEY | `FOREIGN KEY (carrier_account_id_internal_id) REFERENCES logistics.carrier_accounts(internal_id) ON DELETE SET NULL` |
| `fk_logistics_shipments_carrier_account_id_carrier_accounts` | FOREIGN KEY | `FOREIGN KEY (carrier_account_id) REFERENCES logistics.carrier_accounts(id) ON DELETE SET NULL` |
| `fk_logistics_shipments_carrier_id_carriers` | FOREIGN KEY | `FOREIGN KEY (carrier_id) REFERENCES logistics.carriers(id) ON DELETE RESTRICT` |
| `fk_logistics_shipments_carrier_id_carriers_numeric` | FOREIGN KEY | `FOREIGN KEY (carrier_id_internal_id) REFERENCES logistics.carriers(internal_id) ON DELETE RESTRICT` |
| `fk_logistics_shipments_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_shipments_delivery_slot_id_delivery_slots` | FOREIGN KEY | `FOREIGN KEY (delivery_slot_id) REFERENCES logistics.delivery_slots(id) ON DELETE SET NULL` |
| `fk_logistics_shipments_delivery_slot_id_delivery_slots_numeric` | FOREIGN KEY | `FOREIGN KEY (delivery_slot_id_internal_id) REFERENCES logistics.delivery_slots(internal_id) ON DELETE SET NULL` |
| `fk_logistics_shipments_group_order` | FOREIGN KEY | `FOREIGN KEY (order_group_id, order_id) REFERENCES commerce.order_groups(id, order_id) ON DELETE RESTRICT` |
| `fk_logistics_shipments_group_order_numeric` | FOREIGN KEY | `FOREIGN KEY (order_group_id_internal_id, order_id_internal_id) REFERENCES commerce.order_groups(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| `fk_logistics_shipments_order_group_id_order_groups` | FOREIGN KEY | `FOREIGN KEY (order_group_id) REFERENCES commerce.order_groups(id) ON DELETE SET NULL` |
| `fk_logistics_shipments_order_group_id_order_groups_numeric` | FOREIGN KEY | `FOREIGN KEY (order_group_id_internal_id) REFERENCES commerce.order_groups(internal_id) ON DELETE SET NULL` |
| `fk_logistics_shipments_order_id_orders` | FOREIGN KEY | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| `fk_logistics_shipments_order_id_orders_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| `fk_logistics_shipments_package_id_packages` | FOREIGN KEY | `FOREIGN KEY (package_id) REFERENCES fulfillment.packages(id) ON DELETE RESTRICT` |
| `fk_logistics_shipments_package_id_packages_numeric` | FOREIGN KEY | `FOREIGN KEY (package_id_internal_id) REFERENCES fulfillment.packages(internal_id) ON DELETE RESTRICT` |
| `fk_logistics_shipments_revision_scope` | FOREIGN KEY | `FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT` |
| `fk_logistics_shipments_revision_scope_numeric` | FOREIGN KEY | `FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| `fk_logistics_shipments_shipping_label_file_id_file_obje_c402` | FOREIGN KEY | `FOREIGN KEY (shipping_label_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| `fk_logistics_shipments_shipping_label_file_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (shipping_label_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| `fk_logistics_shipments_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_logistics_shipments` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `shipment_number` | UNIQUE | `UNIQUE (shipment_number)` |
| `uq_logistics_shipments_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_logistics_shipments_carrier` | `CREATE INDEX ix_logistics_shipments_carrier ON logistics.shipments USING btree (carrier_id)` |
| `ix_logistics_shipments_order` | `CREATE INDEX ix_logistics_shipments_order ON logistics.shipments USING btree (order_id)` |
| `ix_logistics_shipments_package` | `CREATE INDEX ix_logistics_shipments_package ON logistics.shipments USING btree (package_id)` |
| `ix_logistics_shipments_status` | `CREATE INDEX ix_logistics_shipments_status ON logistics.shipments USING btree (status)` |
| `pk_logistics_shipments` | `CREATE UNIQUE INDEX pk_logistics_shipments ON logistics.shipments USING btree (internal_id)` |
| `shipment_number` | `CREATE UNIQUE INDEX shipment_number ON logistics.shipments USING btree (shipment_number)` |
| `uq_logistics_shipments_id` | `CREATE UNIQUE INDEX uq_logistics_shipments_id ON logistics.shipments USING btree (id)` |
| `uq_logistics_shipments_tracking_present` | `CREATE UNIQUE INDEX uq_logistics_shipments_tracking_present ON logistics.shipments USING btree (carrier_id, tracking_number) WHERE tracking_number IS NOT NULL` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.shipments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_account_id","carrier_account_id_internal_id","logistics","carrier_accounts"],["carrier_id","carrier_id_internal_id","logistics","carriers"],["delivery_slot_id","delivery_slot_id_internal_id","logistics","delivery_slots"],["order_group_id","order_group_id_internal_id","commerce","order_groups"],["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["package_id","package_id_internal_id","fulfillment","packages"],["shipping_label_file_id","shipping_label_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |
| `ab_authorized_dispatch` | `CREATE TRIGGER ab_authorized_dispatch BEFORE INSERT OR UPDATE ON logistics.shipments FOR EACH ROW EXECUTE FUNCTION logistics.guard_authorized_dispatch()` |
| `shipment_dispatch_guard` | `CREATE TRIGGER shipment_dispatch_guard BEFORE INSERT OR UPDATE ON logistics.shipments FOR EACH ROW EXECUTE FUNCTION logistics.guard_shipment_dispatch()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.shipments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.shipments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_account_id","carrier_account_id_internal_id","logistics","carrier_accounts"],["carrier_id","carrier_id_internal_id","logistics","carriers"],["delivery_slot_id","delivery_slot_id_internal_id","logistics","delivery_slots"],["order_group_id","order_group_id_internal_id","commerce","order_groups"],["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["package_id","package_id_internal_id","fulfillment","packages"],["shipping_label_file_id","shipping_label_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
