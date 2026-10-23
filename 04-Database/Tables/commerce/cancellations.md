# commerce.cancellations

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds cancellations records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 16 columns, 12 constraints, 4 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approved_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_cancellations_approved_by_user_id_users) |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_cancellations_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` (fk_commerce_cancellations_order_id_orders) |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` (fk_commerce_cancellations_order_id_orders_numeric); Numeric/public-key pair verification required |
| `reason_code` | `character varying(64)` | No | — | Reference linking this record to cancellation reason codes | Ensures related business data can be joined and validated | FK → `commerce.cancellation_reason_codes` (fk_commerce_cancellations_controlled_reason) |
| `reason_code_id` | `bigint` | Yes | — | Reference linking this record to cancellation reason codes | Ensures related business data can be joined and validated | FK → `commerce.cancellation_reason_codes` (fk_commerce_cancellations_controlled_reason) |
| `reason_text` | `text` | Yes | — | Inferred: stores reason text for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `requested_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_cancellations_requested_by_user_id_users) |
| `resolved_at` | `timestamp with time zone` | Yes | — | Time of resolved | Support chronology, deadlines or audit evidence | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_cancellations_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the cancellations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.cancellations` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `requested_by_user_id` → `identity.users(id)` via `fk_commerce_cancellations_requested_by_user_id_users`; FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `approved_by_user_id` → `identity.users(id)` via `fk_commerce_cancellations_approved_by_user_id_users`; FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL
- `reason_code_id, reason_code` → `commerce.cancellation_reason_codes(id, code)` via `fk_commerce_cancellations_controlled_reason`; FOREIGN KEY (reason_code_id, reason_code) REFERENCES commerce.cancellation_reason_codes(id, code) ON DELETE RESTRICT
- `created_by` → `identity.users(id)` via `fk_commerce_cancellations_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_commerce_cancellations_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `order_id` → `commerce.orders(id)` via `fk_commerce_cancellations_order_id_orders`; FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT
- `order_id_internal_id` → `commerce.orders(internal_id)` via `fk_commerce_cancellations_order_id_orders_numeric`; FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT

**Referenced by 2 FK constraints** (sample): `commerce.cancellation_items`, `commerce.cancellation_items`.

## commerce.cancellations — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 16 columns, 12 constraints, 4 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `requested_by_user_id` | `identity.users` | `fk_commerce_cancellations_requested_by_user_id_users` |
| `approved_by_user_id` | `identity.users` | `fk_commerce_cancellations_approved_by_user_id_users` |
| `reason_code_id`, `reason_code` | `commerce.cancellation_reason_codes` | `fk_commerce_cancellations_controlled_reason` |
| `created_by` | `identity.users` | `fk_commerce_cancellations_created_by_users` |
| `updated_by` | `identity.users` | `fk_commerce_cancellations_updated_by_users` |
| `order_id` | `commerce.orders` | `fk_commerce_cancellations_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_commerce_cancellations_order_id_orders_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_commerce_cancellations_order` | `CREATE INDEX ix_commerce_cancellations_order ON commerce.cancellations USING btree (order_id)` |
| `ix_commerce_cancellations_status` | `CREATE INDEX ix_commerce_cancellations_status ON commerce.cancellations USING btree (status)` |
| `pk_commerce_cancellations` | `CREATE UNIQUE INDEX pk_commerce_cancellations ON commerce.cancellations USING btree (internal_id)` |
| `uq_commerce_cancellations_id` | `CREATE UNIQUE INDEX uq_commerce_cancellations_id ON commerce.cancellations USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.cancellations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"]]', 'internal_id', 'id')` |
| `controlled_reason` | `CREATE TRIGGER controlled_reason BEFORE INSERT OR UPDATE ON commerce.cancellations FOR EACH ROW EXECUTE FUNCTION platform.normalize_reason('commerce.cancellation_reason_codes')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.cancellations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.cancellations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
