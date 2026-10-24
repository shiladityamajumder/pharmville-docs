# `payment.refund_allocations`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds refund allocations records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 13 columns, 17 constraints, 4 indexes, 5 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(16,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `order_item_id` | `uuid` | No | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` (fk_payment_refund_allocations_order_item_id_order_items) |
| `order_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` (fk_payment_refund_allocations_order_item_id_order_items_numeric); Numeric/public-key pair verification required |
| `order_revision_id` | `uuid` | Yes | — | Reference linking this record to refunds | Ensures related business data can be joined and validated | FK → `payment.refunds` (fk_payment_refund_allocations_revision) |
| `order_revision_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.refunds` (fk_payment_refund_allocations_revision_numeric); Numeric/public-key pair verification required |
| `quantity` | `numeric(12,3)` | Yes | — | Quantity value | Track resource or item amounts accurately | See exact constraints |
| `reason_code` | `character varying(64)` | No | — | Reference linking this record to refund reason codes | Ensures related business data can be joined and validated | FK → `payment.refund_reason_codes` (fk_payment_refund_allocations_controlled_reason) |
| `reason_code_id` | `bigint` | Yes | — | Reference linking this record to refund reason codes | Ensures related business data can be joined and validated | FK → `payment.refund_reason_codes` (fk_payment_refund_allocations_controlled_reason) |
| `refund_id` | `uuid` | No | — | Reference linking this record to refunds | Ensures related business data can be joined and validated | FK → `payment.refunds` (fk_payment_refund_allocations_refund_id_refunds); FK → `payment.refunds` (fk_payment_refund_allocations_revision) |
| `refund_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `payment.refunds` (fk_payment_refund_allocations_refund_id_refunds_numeric); FK → `payment.refunds` (fk_payment_refund_allocations_revision_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the refund allocations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.refund_allocations` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `reason_code_id, reason_code` → `payment.refund_reason_codes(id, code)` via `fk_payment_refund_allocations_controlled_reason`; `FOREIGN KEY (reason_code_id, reason_code) REFERENCES payment.refund_reason_codes(id, code) ON DELETE RESTRICT`
- `order_item_id` → `commerce.order_items(id)` via `fk_payment_refund_allocations_order_item_id_order_items`; `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT`
- `refund_id` → `payment.refunds(id)` via `fk_payment_refund_allocations_refund_id_refunds`; `FOREIGN KEY (refund_id) REFERENCES payment.refunds(id) ON DELETE RESTRICT`
- `refund_id, order_revision_id` → `payment.refunds(id, order_revision_id)` via `fk_payment_refund_allocations_revision`; `FOREIGN KEY (refund_id, order_revision_id) REFERENCES payment.refunds(id, order_revision_id) ON DELETE RESTRICT`
- `order_item_id_internal_id` → `commerce.order_items(internal_id)` via `fk_payment_refund_allocations_order_item_id_order_items_numeric`; `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT`
- `refund_id_internal_id` → `payment.refunds(internal_id)` via `fk_payment_refund_allocations_refund_id_refunds_numeric`; `FOREIGN KEY (refund_id_internal_id) REFERENCES payment.refunds(internal_id) ON DELETE RESTRICT`
- `refund_id_internal_id, order_revision_id_internal_id` → `payment.refunds(internal_id, order_revision_id_internal_id)` via `fk_payment_refund_allocations_revision_numeric`; `FOREIGN KEY (refund_id_internal_id, order_revision_id_internal_id) REFERENCES payment.refunds(internal_id, order_revision_id_internal_id) ON DELETE RESTRICT`

## `payment.refund_allocations` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 13 columns, 17 constraints, 4 indexes, 5 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `reason_code_id`, `reason_code` | `payment.refund_reason_codes` | `fk_payment_refund_allocations_controlled_reason` |
| `order_item_id` | `commerce.order_items` | `fk_payment_refund_allocations_order_item_id_order_items` |
| `refund_id` | `payment.refunds` | `fk_payment_refund_allocations_refund_id_refunds` |
| `refund_id`, `order_revision_id` | `payment.refunds` | `fk_payment_refund_allocations_revision` |
| `order_item_id_internal_id` | `commerce.order_items` | `fk_payment_refund_allocations_order_item_id_order_items_numeric` |
| `refund_id_internal_id` | `payment.refunds` | `fk_payment_refund_allocations_refund_id_refunds_numeric` |
| `refund_id_internal_id`, `order_revision_id_internal_id` | `payment.refunds` | `fk_payment_refund_allocations_revision_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_payment_refund_allocations_amount_positive` | CHECK | `CHECK (amount > 0::numeric)` |
| `ck_payment_refund_allocations_controlled_reason_pair` | CHECK | `CHECK (reason_code_id IS NULL OR reason_code IS NOT NULL)` |
| `ck_payment_refund_allocations_finite_numeric_values` | CHECK | `CHECK ((amount IS NULL OR (amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (quantity IS NULL OR (quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_payment_refund_allocations_numeric_pair_order_item_id` | CHECK | `CHECK ((order_item_id IS NULL) = (order_item_id_internal_id IS NULL))` |
| `ck_payment_refund_allocations_numeric_pair_order_revision_id` | CHECK | `CHECK ((order_revision_id IS NULL) = (order_revision_id_internal_id IS NULL))` |
| `ck_payment_refund_allocations_numeric_pair_refund_id` | CHECK | `CHECK ((refund_id IS NULL) = (refund_id_internal_id IS NULL))` |
| `ck_payment_refund_allocations_quantity_positive` | CHECK | `CHECK (quantity IS NULL OR quantity > 0::numeric)` |
| `fk_payment_refund_allocations_controlled_reason` | FOREIGN KEY | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES payment.refund_reason_codes(id, code) ON DELETE RESTRICT` |
| `fk_payment_refund_allocations_order_item_id_order_items` | FOREIGN KEY | `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT` |
| `fk_payment_refund_allocations_order_item_id_order_items_numeric` | FOREIGN KEY | `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT` |
| `fk_payment_refund_allocations_refund_id_refunds` | FOREIGN KEY | `FOREIGN KEY (refund_id) REFERENCES payment.refunds(id) ON DELETE RESTRICT` |
| `fk_payment_refund_allocations_refund_id_refunds_numeric` | FOREIGN KEY | `FOREIGN KEY (refund_id_internal_id) REFERENCES payment.refunds(internal_id) ON DELETE RESTRICT` |
| `fk_payment_refund_allocations_revision` | FOREIGN KEY | `FOREIGN KEY (refund_id, order_revision_id) REFERENCES payment.refunds(id, order_revision_id) ON DELETE RESTRICT` |
| `fk_payment_refund_allocations_revision_numeric` | FOREIGN KEY | `FOREIGN KEY (refund_id_internal_id, order_revision_id_internal_id) REFERENCES payment.refunds(internal_id, order_revision_id_internal_id) ON DELETE RESTRICT` |
| `pk_payment_refund_allocations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_payment_refund_allocations_id` | UNIQUE | `UNIQUE (id)` |
| `uq_payment_refund_allocations_item` | UNIQUE | `UNIQUE (refund_id, order_item_id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_payment_refund_allocations_item` | `CREATE INDEX ix_payment_refund_allocations_item ON payment.refund_allocations USING btree (order_item_id)` |
| `pk_payment_refund_allocations` | `CREATE UNIQUE INDEX pk_payment_refund_allocations ON payment.refund_allocations USING btree (internal_id)` |
| `uq_payment_refund_allocations_id` | `CREATE UNIQUE INDEX uq_payment_refund_allocations_id ON payment.refund_allocations USING btree (id)` |
| `uq_payment_refund_allocations_item` | `CREATE UNIQUE INDEX uq_payment_refund_allocations_item ON payment.refund_allocations USING btree (refund_id, order_item_id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.refund_allocations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_item_id","order_item_id_internal_id","commerce","order_items"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["refund_id","refund_id_internal_id","payment","refunds"]]', 'internal_id', 'id')` |
| `controlled_reason` | `CREATE TRIGGER controlled_reason BEFORE INSERT OR UPDATE ON payment.refund_allocations FOR EACH ROW EXECUTE FUNCTION platform.normalize_reason('payment.refund_reason_codes')` |
| `refund_allocation_append_only` | `CREATE TRIGGER refund_allocation_append_only BEFORE DELETE OR UPDATE ON payment.refund_allocations FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `refund_allocation_guard` | `CREATE TRIGGER refund_allocation_guard BEFORE INSERT ON payment.refund_allocations FOR EACH ROW EXECUTE FUNCTION payment.guard_refund_allocation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.refund_allocations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_item_id","order_item_id_internal_id","commerce","order_items"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["refund_id","refund_id_internal_id","payment","refunds"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
