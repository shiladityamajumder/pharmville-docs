# `logistics.shipments`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds shipments records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | logistics.shipments |
| Classification | Transactional |
| Proposed business write owner | Delivery_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 31 columns; 33 PK/FK/UQ/CHECK/exclusion constraints; 15 named PostgreSQL 18 NOT NULL constraints; 8 indexes; 5 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `carrier_account_id` | `uuid` | Yes | — | Reference linking this record to carrier accounts | Ensures related business data can be joined and validated | FK → `logistics.carrier_accounts` via `fk_logistics_shipments_carrier_account_id_carrier_accounts` |
| `carrier_account_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.carrier_accounts` via `fk_logistics_shipments_carrier_account_id_carrier_accou_456d` |
| `carrier_id` | `uuid` | No | — | Reference linking this record to carriers | Ensures related business data can be joined and validated | FK → `logistics.carriers` via `fk_logistics_shipments_carrier_id_carriers` |
| `carrier_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.carriers` via `fk_logistics_shipments_carrier_id_carriers_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_shipments_created_by_users` |
| `delivered_at` | `timestamp with time zone` | Yes | — | Time of delivered | Support chronology, deadlines or audit evidence | Exact constraints below |
| `delivery_slot_id` | `uuid` | Yes | — | Reference linking this record to delivery slots | Ensures related business data can be joined and validated | FK → `logistics.delivery_slots` via `fk_logistics_shipments_delivery_slot_id_delivery_slots` |
| `delivery_slot_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.delivery_slots` via `fk_logistics_shipments_delivery_slot_id_delivery_slots_numeric` |
| `destination_snapshot` | `jsonb` | No | — | Structured destination snapshot information | Retain a versioned payload or relevant details | Exact constraints below |
| `dispatched_at` | `timestamp with time zone` | Yes | — | Time of dispatched | Support chronology, deadlines or audit evidence | Exact constraints below |
| `estimated_delivery_at` | `timestamp with time zone` | Yes | — | Time of estimated delivery | Support chronology, deadlines or audit evidence | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `order_group_id` | `uuid` | Yes | — | Reference linking this record to order groups | Ensures related business data can be joined and validated | FK → `commerce.order_groups` via `fk_logistics_shipments_group_order`; FK → `commerce.order_groups` via `fk_logistics_shipments_order_group_id_order_groups` |
| `order_group_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_groups` via `fk_logistics_shipments_group_order_numeric`; FK → `commerce.order_groups` via `fk_logistics_shipments_order_group_id_order_groups_numeric` |
| `order_id` | `uuid` | No | — | Reference linking this record to order groups | Ensures related business data can be joined and validated | FK → `commerce.order_groups` via `fk_logistics_shipments_group_order`; FK → `commerce.orders` via `fk_logistics_shipments_order_id_orders`; FK → `commerce.order_revisions` via `fk_logistics_shipments_revision_scope` |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_groups` via `fk_logistics_shipments_group_order_numeric`; FK → `commerce.orders` via `fk_logistics_shipments_order_id_orders_numeric`; FK → `commerce.order_revisions` via `fk_logistics_shipments_revision_scope_numeric` |
| `order_revision_id` | `uuid` | Yes | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` via `fk_logistics_shipments_revision_scope` |
| `order_revision_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_revisions` via `fk_logistics_shipments_revision_scope_numeric` |
| `package_id` | `uuid` | No | — | Reference linking this record to packages | Ensures related business data can be joined and validated | FK → `fulfillment.packages` via `fk_logistics_shipments_package_id_packages` |
| `package_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.packages` via `fk_logistics_shipments_package_id_packages_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `service_type` | `character varying(32)` | No | — | Inferred: stores service type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `shipment_number` | `character varying(64)` | No | — | Inferred: stores shipment number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `shipping_label_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_logistics_shipments_shipping_label_file_id_file_objects` |
| `shipping_label_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_logistics_shipments_shipping_label_file_id_file_obje_c402` |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `tracking_number` | `character varying(128)` | Yes | — | Inferred: stores tracking number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_shipments_updated_by_users` |

## Record lifecycle and users

- **Created:** when the shipments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.shipments` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_logistics_shipments_carrier_account_id_carrier_accou_456d | `carrier_account_id_internal_id` | [`logistics.carrier_accounts`](../../Tables/logistics/carrier_accounts.md) | `FOREIGN KEY (carrier_account_id_internal_id) REFERENCES logistics.carrier_accounts(internal_id) ON DELETE SET NULL` |
| fk_logistics_shipments_carrier_account_id_carrier_accounts | `carrier_account_id` | [`logistics.carrier_accounts`](../../Tables/logistics/carrier_accounts.md) | `FOREIGN KEY (carrier_account_id) REFERENCES logistics.carrier_accounts(id) ON DELETE SET NULL` |
| fk_logistics_shipments_carrier_id_carriers | `carrier_id` | [`logistics.carriers`](../../Tables/logistics/carriers.md) | `FOREIGN KEY (carrier_id) REFERENCES logistics.carriers(id) ON DELETE RESTRICT` |
| fk_logistics_shipments_carrier_id_carriers_numeric | `carrier_id_internal_id` | [`logistics.carriers`](../../Tables/logistics/carriers.md) | `FOREIGN KEY (carrier_id_internal_id) REFERENCES logistics.carriers(internal_id) ON DELETE RESTRICT` |
| fk_logistics_shipments_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_logistics_shipments_delivery_slot_id_delivery_slots | `delivery_slot_id` | [`logistics.delivery_slots`](../../Tables/logistics/delivery_slots.md) | `FOREIGN KEY (delivery_slot_id) REFERENCES logistics.delivery_slots(id) ON DELETE SET NULL` |
| fk_logistics_shipments_delivery_slot_id_delivery_slots_numeric | `delivery_slot_id_internal_id` | [`logistics.delivery_slots`](../../Tables/logistics/delivery_slots.md) | `FOREIGN KEY (delivery_slot_id_internal_id) REFERENCES logistics.delivery_slots(internal_id) ON DELETE SET NULL` |
| fk_logistics_shipments_group_order | `order_group_id, order_id` | [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | `FOREIGN KEY (order_group_id, order_id) REFERENCES commerce.order_groups(id, order_id) ON DELETE RESTRICT` |
| fk_logistics_shipments_group_order_numeric | `order_group_id_internal_id, order_id_internal_id` | [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | `FOREIGN KEY (order_group_id_internal_id, order_id_internal_id) REFERENCES commerce.order_groups(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| fk_logistics_shipments_order_group_id_order_groups | `order_group_id` | [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | `FOREIGN KEY (order_group_id) REFERENCES commerce.order_groups(id) ON DELETE SET NULL` |
| fk_logistics_shipments_order_group_id_order_groups_numeric | `order_group_id_internal_id` | [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | `FOREIGN KEY (order_group_id_internal_id) REFERENCES commerce.order_groups(internal_id) ON DELETE SET NULL` |
| fk_logistics_shipments_order_id_orders | `order_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| fk_logistics_shipments_order_id_orders_numeric | `order_id_internal_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| fk_logistics_shipments_package_id_packages | `package_id` | [`fulfillment.packages`](../../Tables/fulfillment/packages.md) | `FOREIGN KEY (package_id) REFERENCES fulfillment.packages(id) ON DELETE RESTRICT` |
| fk_logistics_shipments_package_id_packages_numeric | `package_id_internal_id` | [`fulfillment.packages`](../../Tables/fulfillment/packages.md) | `FOREIGN KEY (package_id_internal_id) REFERENCES fulfillment.packages(internal_id) ON DELETE RESTRICT` |
| fk_logistics_shipments_revision_scope | `order_revision_id, order_id` | [`commerce.order_revisions`](../../Tables/commerce/order_revisions.md) | `FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT` |
| fk_logistics_shipments_revision_scope_numeric | `order_revision_id_internal_id, order_id_internal_id` | [`commerce.order_revisions`](../../Tables/commerce/order_revisions.md) | `FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| fk_logistics_shipments_shipping_label_file_id_file_obje_c402 | `shipping_label_file_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (shipping_label_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| fk_logistics_shipments_shipping_label_file_id_file_objects | `shipping_label_file_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (shipping_label_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| fk_logistics_shipments_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`logistics.delivery_assignments`](../../Tables/logistics/delivery_assignments.md) | fk_logistics_delivery_assignments_shipment_id_shipments | `shipment_id` | `id` |
| [`logistics.delivery_assignments`](../../Tables/logistics/delivery_assignments.md) | fk_logistics_delivery_assignments_shipment_id_shipments_numeric | `shipment_id_internal_id` | `internal_id` |
| [`logistics.delivery_attempts`](../../Tables/logistics/delivery_attempts.md) | fk_logistics_delivery_attempts_shipment_id_shipments | `shipment_id` | `id` |
| [`logistics.delivery_attempts`](../../Tables/logistics/delivery_attempts.md) | fk_logistics_delivery_attempts_shipment_id_shipments_numeric | `shipment_id_internal_id` | `internal_id` |
| [`logistics.delivery_otp_challenges`](../../Tables/logistics/delivery_otp_challenges.md) | fk_logistics_delivery_otp_challenges_shipment_id_shipme_04c6 | `shipment_id_internal_id` | `internal_id` |
| [`logistics.delivery_otp_challenges`](../../Tables/logistics/delivery_otp_challenges.md) | fk_logistics_delivery_otp_challenges_shipment_id_shipments | `shipment_id` | `id` |
| [`logistics.ndr_cases`](../../Tables/logistics/ndr_cases.md) | fk_logistics_ndr_cases_shipment_id_shipments | `shipment_id` | `id` |
| [`logistics.ndr_cases`](../../Tables/logistics/ndr_cases.md) | fk_logistics_ndr_cases_shipment_id_shipments_numeric | `shipment_id_internal_id` | `internal_id` |
| [`logistics.shipment_events`](../../Tables/logistics/shipment_events.md) | fk_logistics_shipment_events_shipment_id_shipments | `shipment_id` | `id` |
| [`logistics.shipment_events`](../../Tables/logistics/shipment_events.md) | fk_logistics_shipment_events_shipment_id_shipments_numeric | `shipment_id_internal_id` | `internal_id` |
| [`payment.cod_collections`](../../Tables/payment/cod_collections.md) | fk_payment_cod_collections_shipment_id_shipments | `shipment_id` | `id` |
| [`payment.cod_collections`](../../Tables/payment/cod_collections.md) | fk_payment_cod_collections_shipment_id_shipments_numeric | `shipment_id_internal_id` | `internal_id` |

## `logistics.shipments` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `carrier_account_id_internal_id` | `logistics.carrier_accounts` | `fk_logistics_shipments_carrier_account_id_carrier_accou_456d` |
| `carrier_account_id` | `logistics.carrier_accounts` | `fk_logistics_shipments_carrier_account_id_carrier_accounts` |
| `carrier_id` | `logistics.carriers` | `fk_logistics_shipments_carrier_id_carriers` |
| `carrier_id_internal_id` | `logistics.carriers` | `fk_logistics_shipments_carrier_id_carriers_numeric` |
| `created_by` | `identity.users` | `fk_logistics_shipments_created_by_users` |
| `delivery_slot_id` | `logistics.delivery_slots` | `fk_logistics_shipments_delivery_slot_id_delivery_slots` |
| `delivery_slot_id_internal_id` | `logistics.delivery_slots` | `fk_logistics_shipments_delivery_slot_id_delivery_slots_numeric` |
| `order_group_id, order_id` | `commerce.order_groups` | `fk_logistics_shipments_group_order` |
| `order_group_id_internal_id, order_id_internal_id` | `commerce.order_groups` | `fk_logistics_shipments_group_order_numeric` |
| `order_group_id` | `commerce.order_groups` | `fk_logistics_shipments_order_group_id_order_groups` |
| `order_group_id_internal_id` | `commerce.order_groups` | `fk_logistics_shipments_order_group_id_order_groups_numeric` |
| `order_id` | `commerce.orders` | `fk_logistics_shipments_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_logistics_shipments_order_id_orders_numeric` |
| `package_id` | `fulfillment.packages` | `fk_logistics_shipments_package_id_packages` |
| `package_id_internal_id` | `fulfillment.packages` | `fk_logistics_shipments_package_id_packages_numeric` |
| `order_revision_id, order_id` | `commerce.order_revisions` | `fk_logistics_shipments_revision_scope` |
| `order_revision_id_internal_id, order_id_internal_id` | `commerce.order_revisions` | `fk_logistics_shipments_revision_scope_numeric` |
| `shipping_label_file_id_internal_id` | `platform.file_objects` | `fk_logistics_shipments_shipping_label_file_id_file_obje_c402` |
| `shipping_label_file_id` | `platform.file_objects` | `fk_logistics_shipments_shipping_label_file_id_file_objects` |
| `updated_by` | `identity.users` | `fk_logistics_shipments_updated_by_users` |

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
| `shipments_carrier_id_internal_id_not_null` | NOT NULL | `NOT NULL carrier_id_internal_id` |
| `shipments_carrier_id_not_null` | NOT NULL | `NOT NULL carrier_id` |
| `shipments_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `shipments_destination_snapshot_not_null` | NOT NULL | `NOT NULL destination_snapshot` |
| `shipments_id_not_null` | NOT NULL | `NOT NULL id` |
| `shipments_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `shipments_order_id_internal_id_not_null` | NOT NULL | `NOT NULL order_id_internal_id` |
| `shipments_order_id_not_null` | NOT NULL | `NOT NULL order_id` |
| `shipments_package_id_internal_id_not_null` | NOT NULL | `NOT NULL package_id_internal_id` |
| `shipments_package_id_not_null` | NOT NULL | `NOT NULL package_id` |
| `shipments_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `shipments_service_type_not_null` | NOT NULL | `NOT NULL service_type` |
| `shipments_shipment_number_not_null` | NOT NULL | `NOT NULL shipment_number` |
| `shipments_status_not_null` | NOT NULL | `NOT NULL status` |
| `shipments_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_logistics_shipments_carrier` | btree | `(carrier_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_shipments_carrier ON logistics.shipments USING btree (carrier_id)` |
| `ix_logistics_shipments_order` | btree | `(order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_shipments_order ON logistics.shipments USING btree (order_id)` |
| `ix_logistics_shipments_package` | btree | `(package_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_shipments_package ON logistics.shipments USING btree (package_id)` |
| `ix_logistics_shipments_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_shipments_status ON logistics.shipments USING btree (status)` |
| `pk_logistics_shipments` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_logistics_shipments ON logistics.shipments USING btree (internal_id)` |
| `shipment_number` | btree | `(shipment_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX shipment_number ON logistics.shipments USING btree (shipment_number)` |
| `uq_logistics_shipments_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_shipments_id ON logistics.shipments USING btree (id)` |
| `uq_logistics_shipments_tracking_present` | btree | `(carrier_id, tracking_number)` | tracking_number IS NOT NULL | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_shipments_tracking_present ON logistics.shipments USING btree (carrier_id, tracking_number) WHERE tracking_number IS NOT NULL` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.shipments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_account_id","carrier_account_id_internal_id","logistics","carrier_accounts"],["carrier_id","carrier_id_internal_id","logistics","carriers"],["delivery_slot_id","delivery_slot_id_internal_id","logistics","delivery_slots"],["order_group_id","order_group_id_internal_id","commerce","order_groups"],["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["package_id","package_id_internal_id","fulfillment","packages"],["shipping_label_file_id","shipping_label_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |
| `ab_authorized_dispatch` | `CREATE TRIGGER ab_authorized_dispatch BEFORE INSERT OR UPDATE ON logistics.shipments FOR EACH ROW EXECUTE FUNCTION logistics.guard_authorized_dispatch()` | O |
| `shipment_dispatch_guard` | `CREATE TRIGGER shipment_dispatch_guard BEFORE INSERT OR UPDATE ON logistics.shipments FOR EACH ROW EXECUTE FUNCTION logistics.guard_shipment_dispatch()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.shipments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.shipments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_account_id","carrier_account_id_internal_id","logistics","carrier_accounts"],["carrier_id","carrier_id_internal_id","logistics","carriers"],["delivery_slot_id","delivery_slot_id_internal_id","logistics","delivery_slots"],["order_group_id","order_group_id_internal_id","commerce","order_groups"],["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["package_id","package_id_internal_id","fulfillment","packages"],["shipping_label_file_id","shipping_label_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
