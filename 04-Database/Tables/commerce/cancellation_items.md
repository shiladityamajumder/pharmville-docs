# `commerce.cancellation_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds cancellation items records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | commerce.cancellation_items |
| Classification | Transactional |
| Proposed business write owner | Order_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 12 columns; 14 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `cancellation_id` | `uuid` | No | — | Reference linking this record to cancellations | Ensures related business data can be joined and validated | FK → `commerce.cancellations` via `fk_commerce_cancellation_items_cancellation_id_cancellations` |
| `cancellation_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.cancellations` via `fk_commerce_cancellation_items_cancellation_id_cancella_a1bd` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_cancellation_items_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `order_item_id` | `uuid` | No | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` via `fk_commerce_cancellation_items_order_item_id_order_items` |
| `order_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` via `fk_commerce_cancellation_items_order_item_id_order_item_a716` |
| `quantity` | `numeric(12,3)` | No | — | Quantity value | Track resource or item amounts accurately | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_cancellation_items_updated_by_users` |

## Record lifecycle and users

- **Created:** when the cancellation items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.cancellation_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_commerce_cancellation_items_cancellation_id_cancella_a1bd | `cancellation_id_internal_id` | [`commerce.cancellations`](../../Tables/commerce/cancellations.md) | `FOREIGN KEY (cancellation_id_internal_id) REFERENCES commerce.cancellations(internal_id) ON DELETE CASCADE` |
| fk_commerce_cancellation_items_cancellation_id_cancellations | `cancellation_id` | [`commerce.cancellations`](../../Tables/commerce/cancellations.md) | `FOREIGN KEY (cancellation_id) REFERENCES commerce.cancellations(id) ON DELETE CASCADE` |
| fk_commerce_cancellation_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_commerce_cancellation_items_order_item_id_order_item_a716 | `order_item_id_internal_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT` |
| fk_commerce_cancellation_items_order_item_id_order_items | `order_item_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT` |
| fk_commerce_cancellation_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `commerce.cancellation_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `cancellation_id_internal_id` | `commerce.cancellations` | `fk_commerce_cancellation_items_cancellation_id_cancella_a1bd` |
| `cancellation_id` | `commerce.cancellations` | `fk_commerce_cancellation_items_cancellation_id_cancellations` |
| `created_by` | `identity.users` | `fk_commerce_cancellation_items_created_by_users` |
| `order_item_id_internal_id` | `commerce.order_items` | `fk_commerce_cancellation_items_order_item_id_order_item_a716` |
| `order_item_id` | `commerce.order_items` | `fk_commerce_cancellation_items_order_item_id_order_items` |
| `updated_by` | `identity.users` | `fk_commerce_cancellation_items_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `cancellation_order_item` | UNIQUE | `UNIQUE (cancellation_id, order_item_id)` |
| `ck_commerce_cancellation_items_finite_numeric_values` | CHECK | `CHECK (quantity IS NULL OR (quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_commerce_cancellation_items_numeric_pair_cancellation_id` | CHECK | `CHECK ((cancellation_id IS NULL) = (cancellation_id_internal_id IS NULL))` |
| `ck_commerce_cancellation_items_numeric_pair_order_item_id` | CHECK | `CHECK ((order_item_id IS NULL) = (order_item_id_internal_id IS NULL))` |
| `ck_commerce_cancellation_items_quantity_positive` | CHECK | `CHECK (quantity > 0::numeric)` |
| `ck_commerce_cancellation_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_commerce_cancellation_items_cancellation_id_cancella_a1bd` | FOREIGN KEY | `FOREIGN KEY (cancellation_id_internal_id) REFERENCES commerce.cancellations(internal_id) ON DELETE CASCADE` |
| `fk_commerce_cancellation_items_cancellation_id_cancellations` | FOREIGN KEY | `FOREIGN KEY (cancellation_id) REFERENCES commerce.cancellations(id) ON DELETE CASCADE` |
| `fk_commerce_cancellation_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_cancellation_items_order_item_id_order_item_a716` | FOREIGN KEY | `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT` |
| `fk_commerce_cancellation_items_order_item_id_order_items` | FOREIGN KEY | `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT` |
| `fk_commerce_cancellation_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_commerce_cancellation_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_commerce_cancellation_items_id` | UNIQUE | `UNIQUE (id)` |
| `cancellation_items_cancellation_id_internal_id_not_null` | NOT NULL | `NOT NULL cancellation_id_internal_id` |
| `cancellation_items_cancellation_id_not_null` | NOT NULL | `NOT NULL cancellation_id` |
| `cancellation_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `cancellation_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `cancellation_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `cancellation_items_order_item_id_internal_id_not_null` | NOT NULL | `NOT NULL order_item_id_internal_id` |
| `cancellation_items_order_item_id_not_null` | NOT NULL | `NOT NULL order_item_id` |
| `cancellation_items_quantity_not_null` | NOT NULL | `NOT NULL quantity` |
| `cancellation_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `cancellation_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `cancellation_order_item` | btree | `(cancellation_id, order_item_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX cancellation_order_item ON commerce.cancellation_items USING btree (cancellation_id, order_item_id)` |
| `pk_commerce_cancellation_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_commerce_cancellation_items ON commerce.cancellation_items USING btree (internal_id)` |
| `uq_commerce_cancellation_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_cancellation_items_id ON commerce.cancellation_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.cancellation_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["cancellation_id","cancellation_id_internal_id","commerce","cancellations"],["order_item_id","order_item_id_internal_id","commerce","order_items"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.cancellation_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.cancellation_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["cancellation_id","cancellation_id_internal_id","commerce","cancellations"],["order_item_id","order_item_id_internal_id","commerce","order_items"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
