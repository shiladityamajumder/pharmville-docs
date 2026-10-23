# payment.cod_collections

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds cod collections records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 20 columns, 18 constraints, 3 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount` | `numeric(16,2)` | No | — | Inferred: stores amount for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `collected_at` | `timestamp with time zone` | Yes | — | Time of collected | Support chronology, deadlines or audit evidence | See exact constraints |
| `collected_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_cod_collections_collected_by_user_id_users) |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_cod_collections_created_by_users) |
| `deposited_at` | `timestamp with time zone` | Yes | — | Time of deposited | Support chronology, deadlines or audit evidence | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `order_id` | `uuid` | No | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` (fk_payment_cod_collections_order_id_orders); FK → `commerce.order_revisions` (fk_payment_cod_collections_revision_scope) |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` (fk_payment_cod_collections_order_id_orders_numeric); FK → `commerce.order_revisions` (fk_payment_cod_collections_revision_scope_numeric); Numeric/public-key pair verification required |
| `order_revision_id` | `uuid` | Yes | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` (fk_payment_cod_collections_revision_scope) |
| `order_revision_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_revisions` (fk_payment_cod_collections_revision_scope_numeric); Numeric/public-key pair verification required |
| `remitted_at` | `timestamp with time zone` | Yes | — | Time of remitted | Support chronology, deadlines or audit evidence | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `settled_at` | `timestamp with time zone` | Yes | — | Time of settled | Support chronology, deadlines or audit evidence | See exact constraints |
| `shipment_id` | `uuid` | No | — | Reference linking this record to shipments | Ensures related business data can be joined and validated | FK → `logistics.shipments` (fk_payment_cod_collections_shipment_id_shipments) |
| `shipment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.shipments` (fk_payment_cod_collections_shipment_id_shipments_numeric); Numeric/public-key pair verification required |
| `status` | `character varying(32)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_payment_cod_collections_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the cod collections business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.cod_collections` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_payment_cod_collections_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_payment_cod_collections_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `collected_by_user_id` → `identity.users(id)` via `fk_payment_cod_collections_collected_by_user_id_users`; FOREIGN KEY (collected_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `order_id` → `commerce.orders(id)` via `fk_payment_cod_collections_order_id_orders`; FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT
- `shipment_id` → `logistics.shipments(id)` via `fk_payment_cod_collections_shipment_id_shipments`; FOREIGN KEY (shipment_id) REFERENCES logistics.shipments(id) ON DELETE RESTRICT
- `order_revision_id, order_id` → `commerce.order_revisions(id, order_id)` via `fk_payment_cod_collections_revision_scope`; FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT
- `order_id_internal_id` → `commerce.orders(internal_id)` via `fk_payment_cod_collections_order_id_orders_numeric`; FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT
- `order_revision_id_internal_id, order_id_internal_id` → `commerce.order_revisions(internal_id, order_id_internal_id)` via `fk_payment_cod_collections_revision_scope_numeric`; FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT
- `shipment_id_internal_id` → `logistics.shipments(internal_id)` via `fk_payment_cod_collections_shipment_id_shipments_numeric`; FOREIGN KEY (shipment_id_internal_id) REFERENCES logistics.shipments(internal_id) ON DELETE RESTRICT

## payment.cod_collections — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 20 columns, 18 constraints, 3 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_payment_cod_collections_created_by_users` |
| `updated_by` | `identity.users` | `fk_payment_cod_collections_updated_by_users` |
| `collected_by_user_id` | `identity.users` | `fk_payment_cod_collections_collected_by_user_id_users` |
| `order_id` | `commerce.orders` | `fk_payment_cod_collections_order_id_orders` |
| `shipment_id` | `logistics.shipments` | `fk_payment_cod_collections_shipment_id_shipments` |
| `order_revision_id`, `order_id` | `commerce.order_revisions` | `fk_payment_cod_collections_revision_scope` |
| `order_id_internal_id` | `commerce.orders` | `fk_payment_cod_collections_order_id_orders_numeric` |
| `order_revision_id_internal_id`, `order_id_internal_id` | `commerce.order_revisions` | `fk_payment_cod_collections_revision_scope_numeric` |
| `shipment_id_internal_id` | `logistics.shipments` | `fk_payment_cod_collections_shipment_id_shipments_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_payment_cod_collections` | `CREATE UNIQUE INDEX pk_payment_cod_collections ON payment.cod_collections USING btree (internal_id)` |
| `shipment_cod_collection` | `CREATE UNIQUE INDEX shipment_cod_collection ON payment.cod_collections USING btree (shipment_id)` |
| `uq_payment_cod_collections_id` | `CREATE UNIQUE INDEX uq_payment_cod_collections_id ON payment.cod_collections USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.cod_collections FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` |
| `cod_lifecycle_guard` | `CREATE TRIGGER cod_lifecycle_guard BEFORE INSERT OR UPDATE ON payment.cod_collections FOR EACH ROW EXECUTE FUNCTION payment.guard_cod_lifecycle()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.cod_collections FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.cod_collections FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
