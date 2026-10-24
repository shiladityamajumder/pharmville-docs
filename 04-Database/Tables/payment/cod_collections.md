# `payment.cod_collections`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds cod collections records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | payment.cod_collections |
| Classification | Transactional |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 20 columns; 18 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(16,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `collected_at` | `timestamp with time zone` | Yes | — | Time of collected | Support chronology, deadlines or audit evidence | Exact constraints below |
| `collected_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_cod_collections_collected_by_user_id_users` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_cod_collections_created_by_users` |
| `deposited_at` | `timestamp with time zone` | Yes | — | Time of deposited | Support chronology, deadlines or audit evidence | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` via `fk_payment_cod_collections_order_id_orders`; FK → `commerce.order_revisions` via `fk_payment_cod_collections_revision_scope` |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` via `fk_payment_cod_collections_order_id_orders_numeric`; FK → `commerce.order_revisions` via `fk_payment_cod_collections_revision_scope_numeric` |
| `order_revision_id` | `uuid` | Yes | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` via `fk_payment_cod_collections_revision_scope` |
| `order_revision_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_revisions` via `fk_payment_cod_collections_revision_scope_numeric` |
| `remitted_at` | `timestamp with time zone` | Yes | — | Time of remitted | Support chronology, deadlines or audit evidence | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `settled_at` | `timestamp with time zone` | Yes | — | Time of settled | Support chronology, deadlines or audit evidence | Exact constraints below |
| `shipment_id` | `uuid` | No | — | Reference linking this record to shipments | Ensures related business data can be joined and validated | FK → `logistics.shipments` via `fk_payment_cod_collections_shipment_id_shipments` |
| `shipment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.shipments` via `fk_payment_cod_collections_shipment_id_shipments_numeric` |
| `status` | `character varying(32)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_cod_collections_updated_by_users` |

## Record lifecycle and users

- **Created:** when the cod collections business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.cod_collections` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_payment_cod_collections_collected_by_user_id_users | `collected_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (collected_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_payment_cod_collections_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_payment_cod_collections_order_id_orders | `order_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| fk_payment_cod_collections_order_id_orders_numeric | `order_id_internal_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| fk_payment_cod_collections_revision_scope | `order_revision_id, order_id` | [`commerce.order_revisions`](../../Tables/commerce/order_revisions.md) | `FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT` |
| fk_payment_cod_collections_revision_scope_numeric | `order_revision_id_internal_id, order_id_internal_id` | [`commerce.order_revisions`](../../Tables/commerce/order_revisions.md) | `FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| fk_payment_cod_collections_shipment_id_shipments | `shipment_id` | [`logistics.shipments`](../../Tables/logistics/shipments.md) | `FOREIGN KEY (shipment_id) REFERENCES logistics.shipments(id) ON DELETE RESTRICT` |
| fk_payment_cod_collections_shipment_id_shipments_numeric | `shipment_id_internal_id` | [`logistics.shipments`](../../Tables/logistics/shipments.md) | `FOREIGN KEY (shipment_id_internal_id) REFERENCES logistics.shipments(internal_id) ON DELETE RESTRICT` |
| fk_payment_cod_collections_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `payment.cod_collections` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `collected_by_user_id` | `identity.users` | `fk_payment_cod_collections_collected_by_user_id_users` |
| `created_by` | `identity.users` | `fk_payment_cod_collections_created_by_users` |
| `order_id` | `commerce.orders` | `fk_payment_cod_collections_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_payment_cod_collections_order_id_orders_numeric` |
| `order_revision_id, order_id` | `commerce.order_revisions` | `fk_payment_cod_collections_revision_scope` |
| `order_revision_id_internal_id, order_id_internal_id` | `commerce.order_revisions` | `fk_payment_cod_collections_revision_scope_numeric` |
| `shipment_id` | `logistics.shipments` | `fk_payment_cod_collections_shipment_id_shipments` |
| `shipment_id_internal_id` | `logistics.shipments` | `fk_payment_cod_collections_shipment_id_shipments_numeric` |
| `updated_by` | `identity.users` | `fk_payment_cod_collections_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_payment_cod_collections_amount_nonnegative` | CHECK | `CHECK (amount >= 0::numeric)` |
| `ck_payment_cod_collections_finite_numeric_values` | CHECK | `CHECK (amount IS NULL OR (amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_payment_cod_collections_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_payment_cod_collections_numeric_pair_order_revision_id` | CHECK | `CHECK ((order_revision_id IS NULL) = (order_revision_id_internal_id IS NULL))` |
| `ck_payment_cod_collections_numeric_pair_shipment_id` | CHECK | `CHECK ((shipment_id IS NULL) = (shipment_id_internal_id IS NULL))` |
| `ck_payment_cod_collections_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_payment_cod_collections_collected_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (collected_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_payment_cod_collections_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_payment_cod_collections_order_id_orders` | FOREIGN KEY | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| `fk_payment_cod_collections_order_id_orders_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| `fk_payment_cod_collections_revision_scope` | FOREIGN KEY | `FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT` |
| `fk_payment_cod_collections_revision_scope_numeric` | FOREIGN KEY | `FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| `fk_payment_cod_collections_shipment_id_shipments` | FOREIGN KEY | `FOREIGN KEY (shipment_id) REFERENCES logistics.shipments(id) ON DELETE RESTRICT` |
| `fk_payment_cod_collections_shipment_id_shipments_numeric` | FOREIGN KEY | `FOREIGN KEY (shipment_id_internal_id) REFERENCES logistics.shipments(internal_id) ON DELETE RESTRICT` |
| `fk_payment_cod_collections_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_payment_cod_collections` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `shipment_cod_collection` | UNIQUE | `UNIQUE (shipment_id)` |
| `uq_payment_cod_collections_id` | UNIQUE | `UNIQUE (id)` |
| `cod_collections_amount_not_null` | NOT NULL | `NOT NULL amount` |
| `cod_collections_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `cod_collections_id_not_null` | NOT NULL | `NOT NULL id` |
| `cod_collections_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `cod_collections_order_id_internal_id_not_null` | NOT NULL | `NOT NULL order_id_internal_id` |
| `cod_collections_order_id_not_null` | NOT NULL | `NOT NULL order_id` |
| `cod_collections_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `cod_collections_shipment_id_internal_id_not_null` | NOT NULL | `NOT NULL shipment_id_internal_id` |
| `cod_collections_shipment_id_not_null` | NOT NULL | `NOT NULL shipment_id` |
| `cod_collections_status_not_null` | NOT NULL | `NOT NULL status` |
| `cod_collections_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_payment_cod_collections` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_payment_cod_collections ON payment.cod_collections USING btree (internal_id)` |
| `shipment_cod_collection` | btree | `(shipment_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX shipment_cod_collection ON payment.cod_collections USING btree (shipment_id)` |
| `uq_payment_cod_collections_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_payment_cod_collections_id ON payment.cod_collections USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.cod_collections FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` | O |
| `cod_lifecycle_guard` | `CREATE TRIGGER cod_lifecycle_guard BEFORE INSERT OR UPDATE ON payment.cod_collections FOR EACH ROW EXECUTE FUNCTION payment.guard_cod_lifecycle()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.cod_collections FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.cod_collections FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
