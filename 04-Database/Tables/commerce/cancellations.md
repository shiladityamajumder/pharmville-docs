# `commerce.cancellations`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds cancellations records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | commerce.cancellations |
| Classification | Transactional |
| Proposed business write owner | Order_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 16 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approved_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_cancellations_approved_by_user_id_users` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_cancellations_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` via `fk_commerce_cancellations_order_id_orders` |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` via `fk_commerce_cancellations_order_id_orders_numeric` |
| `reason_code` | `character varying(64)` | No | — | Reference linking this record to cancellation reason codes | Ensures related business data can be joined and validated | FK → `commerce.cancellation_reason_codes` via `fk_commerce_cancellations_controlled_reason`; Collation: default |
| `reason_code_id` | `bigint` | Yes | — | Reference linking this record to cancellation reason codes | Ensures related business data can be joined and validated | FK → `commerce.cancellation_reason_codes` via `fk_commerce_cancellations_controlled_reason` |
| `reason_text` | `text` | Yes | — | Inferred: stores reason text for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `requested_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_cancellations_requested_by_user_id_users` |
| `resolved_at` | `timestamp with time zone` | Yes | — | Time of resolved | Support chronology, deadlines or audit evidence | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_commerce_cancellations_updated_by_users` |

## Record lifecycle and users

- **Created:** when the cancellations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.cancellations` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_commerce_cancellations_approved_by_user_id_users | `approved_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_commerce_cancellations_controlled_reason | `reason_code_id, reason_code` | [`commerce.cancellation_reason_codes`](../../Tables/commerce/cancellation_reason_codes.md) | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES commerce.cancellation_reason_codes(id, code) ON DELETE RESTRICT` |
| fk_commerce_cancellations_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_commerce_cancellations_order_id_orders | `order_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| fk_commerce_cancellations_order_id_orders_numeric | `order_id_internal_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| fk_commerce_cancellations_requested_by_user_id_users | `requested_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_commerce_cancellations_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`commerce.cancellation_items`](../../Tables/commerce/cancellation_items.md) | fk_commerce_cancellation_items_cancellation_id_cancella_a1bd | `cancellation_id_internal_id` | `internal_id` |
| [`commerce.cancellation_items`](../../Tables/commerce/cancellation_items.md) | fk_commerce_cancellation_items_cancellation_id_cancellations | `cancellation_id` | `id` |

## `commerce.cancellations` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `approved_by_user_id` | `identity.users` | `fk_commerce_cancellations_approved_by_user_id_users` |
| `reason_code_id, reason_code` | `commerce.cancellation_reason_codes` | `fk_commerce_cancellations_controlled_reason` |
| `created_by` | `identity.users` | `fk_commerce_cancellations_created_by_users` |
| `order_id` | `commerce.orders` | `fk_commerce_cancellations_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_commerce_cancellations_order_id_orders_numeric` |
| `requested_by_user_id` | `identity.users` | `fk_commerce_cancellations_requested_by_user_id_users` |
| `updated_by` | `identity.users` | `fk_commerce_cancellations_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_commerce_cancellations_controlled_reason_pair` | CHECK | `CHECK (reason_code_id IS NULL OR reason_code IS NOT NULL)` |
| `ck_commerce_cancellations_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_commerce_cancellations_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_commerce_cancellations_approved_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_commerce_cancellations_controlled_reason` | FOREIGN KEY | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES commerce.cancellation_reason_codes(id, code) ON DELETE RESTRICT` |
| `fk_commerce_cancellations_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_cancellations_order_id_orders` | FOREIGN KEY | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| `fk_commerce_cancellations_order_id_orders_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| `fk_commerce_cancellations_requested_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_cancellations_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_commerce_cancellations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_commerce_cancellations_id` | UNIQUE | `UNIQUE (id)` |
| `cancellations_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `cancellations_id_not_null` | NOT NULL | `NOT NULL id` |
| `cancellations_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `cancellations_order_id_internal_id_not_null` | NOT NULL | `NOT NULL order_id_internal_id` |
| `cancellations_order_id_not_null` | NOT NULL | `NOT NULL order_id` |
| `cancellations_reason_code_not_null` | NOT NULL | `NOT NULL reason_code` |
| `cancellations_requested_by_user_id_not_null` | NOT NULL | `NOT NULL requested_by_user_id` |
| `cancellations_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `cancellations_status_not_null` | NOT NULL | `NOT NULL status` |
| `cancellations_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_commerce_cancellations_order` | btree | `(order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_cancellations_order ON commerce.cancellations USING btree (order_id)` |
| `ix_commerce_cancellations_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_commerce_cancellations_status ON commerce.cancellations USING btree (status)` |
| `pk_commerce_cancellations` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_commerce_cancellations ON commerce.cancellations USING btree (internal_id)` |
| `uq_commerce_cancellations_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_commerce_cancellations_id ON commerce.cancellations USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.cancellations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"]]', 'internal_id', 'id')` | O |
| `controlled_reason` | `CREATE TRIGGER controlled_reason BEFORE INSERT OR UPDATE ON commerce.cancellations FOR EACH ROW EXECUTE FUNCTION platform.normalize_reason('commerce.cancellation_reason_codes')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.cancellations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.cancellations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
