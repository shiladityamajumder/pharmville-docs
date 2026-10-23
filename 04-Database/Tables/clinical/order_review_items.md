# clinical.order_review_items

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds order review items records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 22 constraints, 5 indexes, 5 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approved_quantity` | `numeric(12,3)` | Yes | — | Approved quantity value | Track resource or item amounts accurately | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `decided_at` | `timestamp with time zone` | Yes | — | Time of decided | Support chronology, deadlines or audit evidence | See exact constraints |
| `decision` | `character varying(20)` | No | `'pending'::character varying` | Inferred: stores decision for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `order_id` | `uuid` | No | — | Reference linking this record to order reviews | Ensures related business data can be joined and validated | FK → `clinical.order_reviews` (fk_clinical_review_items_review_order_rx); FK → `commerce.order_items` (fk_clinical_review_items_item_order) |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` (fk_clinical_review_items_item_order_numeric); FK → `clinical.order_reviews` (fk_clinical_review_items_review_order_rx_numeric); Numeric/public-key pair verification required |
| `order_item_id` | `uuid` | No | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` (fk_clinical_review_items_item_order) |
| `order_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` (fk_clinical_review_items_item_order_numeric); Numeric/public-key pair verification required |
| `prescription_id` | `uuid` | No | — | Reference linking this record to prescription items | Ensures related business data can be joined and validated | FK → `clinical.prescription_items` (fk_clinical_review_items_rx_item); FK → `clinical.order_reviews` (fk_clinical_review_items_review_order_rx) |
| `prescription_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.order_reviews` (fk_clinical_review_items_review_order_rx_numeric); FK → `clinical.prescription_items` (fk_clinical_review_items_rx_item_numeric); Numeric/public-key pair verification required |
| `prescription_item_id` | `uuid` | Yes | — | Reference linking this record to prescription items | Ensures related business data can be joined and validated | FK → `clinical.prescription_items` (fk_clinical_review_items_rx_item) |
| `prescription_item_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescription_items` (fk_clinical_review_items_rx_item_numeric); Numeric/public-key pair verification required |
| `reason_code` | `character varying(64)` | Yes | — | Reference linking this record to review reason codes | Ensures related business data can be joined and validated | FK → `clinical.review_reason_codes` (fk_clinical_order_review_items_controlled_reason) |
| `reason_code_id` | `bigint` | Yes | — | Reference linking this record to review reason codes | Ensures related business data can be joined and validated | FK → `clinical.review_reason_codes` (fk_clinical_order_review_items_controlled_reason) |
| `reason_note` | `text` | Yes | — | Inferred: stores reason note for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `review_id` | `uuid` | No | — | Reference linking this record to order reviews | Ensures related business data can be joined and validated | FK → `clinical.order_reviews` (fk_clinical_review_items_review_order_rx) |
| `review_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.order_reviews` (fk_clinical_review_items_review_order_rx_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the order review items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.order_review_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `reason_code_id, reason_code` → `clinical.review_reason_codes(id, code)` via `fk_clinical_order_review_items_controlled_reason`; FOREIGN KEY (reason_code_id, reason_code) REFERENCES clinical.review_reason_codes(id, code) ON DELETE RESTRICT
- `prescription_item_id, prescription_id` → `clinical.prescription_items(id, prescription_id)` via `fk_clinical_review_items_rx_item`; FOREIGN KEY (prescription_item_id, prescription_id) REFERENCES clinical.prescription_items(id, prescription_id) ON DELETE RESTRICT
- `review_id, order_id, prescription_id` → `clinical.order_reviews(id, order_id, prescription_id)` via `fk_clinical_review_items_review_order_rx`; FOREIGN KEY (review_id, order_id, prescription_id) REFERENCES clinical.order_reviews(id, order_id, prescription_id) ON DELETE RESTRICT
- `order_item_id, order_id` → `commerce.order_items(id, order_id)` via `fk_clinical_review_items_item_order`; FOREIGN KEY (order_item_id, order_id) REFERENCES commerce.order_items(id, order_id) ON DELETE RESTRICT
- `order_item_id_internal_id, order_id_internal_id` → `commerce.order_items(internal_id, order_id_internal_id)` via `fk_clinical_review_items_item_order_numeric`; FOREIGN KEY (order_item_id_internal_id, order_id_internal_id) REFERENCES commerce.order_items(internal_id, order_id_internal_id) ON DELETE RESTRICT
- `review_id_internal_id, order_id_internal_id, prescription_id_internal_id` → `clinical.order_reviews(internal_id, order_id_internal_id, prescription_id_internal_id)` via `fk_clinical_review_items_review_order_rx_numeric`; FOREIGN KEY (review_id_internal_id, order_id_internal_id, prescription_id_internal_id) REFERENCES clinical.order_reviews(internal_id, order_id_internal_id, prescription_id_internal_id) ON DELETE RESTRICT
- `prescription_item_id_internal_id, prescription_id_internal_id` → `clinical.prescription_items(internal_id, prescription_id_internal_id)` via `fk_clinical_review_items_rx_item_numeric`; FOREIGN KEY (prescription_item_id_internal_id, prescription_id_internal_id) REFERENCES clinical.prescription_items(internal_id, prescription_id_internal_id) ON DELETE RESTRICT

## clinical.order_review_items — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 21 columns, 22 constraints, 5 indexes, 5 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `reason_code_id`, `reason_code` | `clinical.review_reason_codes` | `fk_clinical_order_review_items_controlled_reason` |
| `prescription_item_id`, `prescription_id` | `clinical.prescription_items` | `fk_clinical_review_items_rx_item` |
| `review_id`, `order_id`, `prescription_id` | `clinical.order_reviews` | `fk_clinical_review_items_review_order_rx` |
| `order_item_id`, `order_id` | `commerce.order_items` | `fk_clinical_review_items_item_order` |
| `order_item_id_internal_id`, `order_id_internal_id` | `commerce.order_items` | `fk_clinical_review_items_item_order_numeric` |
| `review_id_internal_id`, `order_id_internal_id`, `prescription_id_internal_id` | `clinical.order_reviews` | `fk_clinical_review_items_review_order_rx_numeric` |
| `prescription_item_id_internal_id`, `prescription_id_internal_id` | `clinical.prescription_items` | `fk_clinical_review_items_rx_item_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_order_review_items_approval_quantity_required` | CHECK | `CHECK (decision::text <> 'approved'::text OR approved_quantity IS NOT NULL)` |
| `ck_clinical_order_review_items_controlled_reason_pair` | CHECK | `CHECK (reason_code_id IS NULL OR reason_code IS NOT NULL)` |
| `ck_clinical_order_review_items_finite_numeric_values` | CHECK | `CHECK (approved_quantity IS NULL OR (approved_quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_clinical_order_review_items_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_clinical_order_review_items_numeric_pair_order_item_id` | CHECK | `CHECK ((order_item_id IS NULL) = (order_item_id_internal_id IS NULL))` |
| `ck_clinical_order_review_items_numeric_pair_prescriptio_8d8f` | CHECK | `CHECK ((prescription_item_id IS NULL) = (prescription_item_id_internal_id IS NULL))` |
| `ck_clinical_order_review_items_numeric_pair_prescription_id` | CHECK | `CHECK ((prescription_id IS NULL) = (prescription_id_internal_id IS NULL))` |
| `ck_clinical_order_review_items_numeric_pair_review_id` | CHECK | `CHECK ((review_id IS NULL) = (review_id_internal_id IS NULL))` |
| `ck_clinical_order_review_items_quantity_positive` | CHECK | `CHECK (approved_quantity IS NULL OR approved_quantity > 0::numeric)` |
| `ck_clinical_order_review_items_rejection_reason` | CHECK | `CHECK ((decision::text <> ALL (ARRAY['rejected'::text, 'needs_new_rx'::text])) OR reason_code IS NOT NULL)` |
| `ck_clinical_order_review_items_reviewdecision` | CHECK | `CHECK (decision::text = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'needs_new_rx'::text]))` |
| `ck_clinical_order_review_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_clinical_order_review_items_controlled_reason` | FOREIGN KEY | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES clinical.review_reason_codes(id, code) ON DELETE RESTRICT` |
| `fk_clinical_review_items_item_order` | FOREIGN KEY | `FOREIGN KEY (order_item_id, order_id) REFERENCES commerce.order_items(id, order_id) ON DELETE RESTRICT` |
| `fk_clinical_review_items_item_order_numeric` | FOREIGN KEY | `FOREIGN KEY (order_item_id_internal_id, order_id_internal_id) REFERENCES commerce.order_items(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| `fk_clinical_review_items_review_order_rx` | FOREIGN KEY | `FOREIGN KEY (review_id, order_id, prescription_id) REFERENCES clinical.order_reviews(id, order_id, prescription_id) ON DELETE RESTRICT` |
| `fk_clinical_review_items_review_order_rx_numeric` | FOREIGN KEY | `FOREIGN KEY (review_id_internal_id, order_id_internal_id, prescription_id_internal_id) REFERENCES clinical.order_reviews(internal_id, order_id_internal_id, prescription_id_internal_id) ON DELETE RESTRICT` |
| `fk_clinical_review_items_rx_item` | FOREIGN KEY | `FOREIGN KEY (prescription_item_id, prescription_id) REFERENCES clinical.prescription_items(id, prescription_id) ON DELETE RESTRICT` |
| `fk_clinical_review_items_rx_item_numeric` | FOREIGN KEY | `FOREIGN KEY (prescription_item_id_internal_id, prescription_id_internal_id) REFERENCES clinical.prescription_items(internal_id, prescription_id_internal_id) ON DELETE RESTRICT` |
| `pk_clinical_order_review_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_clinical_order_review_items_id` | UNIQUE | `UNIQUE (id)` |
| `uq_clinical_review_items_review_item` | UNIQUE | `UNIQUE (review_id, order_item_id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_clinical_review_items_decision` | `CREATE INDEX ix_clinical_review_items_decision ON clinical.order_review_items USING btree (review_id, decision)` |
| `ix_clinical_review_items_item_time` | `CREATE INDEX ix_clinical_review_items_item_time ON clinical.order_review_items USING btree (order_item_id, created_at DESC)` |
| `pk_clinical_order_review_items` | `CREATE UNIQUE INDEX pk_clinical_order_review_items ON clinical.order_review_items USING btree (internal_id)` |
| `uq_clinical_order_review_items_id` | `CREATE UNIQUE INDEX uq_clinical_order_review_items_id ON clinical.order_review_items USING btree (id)` |
| `uq_clinical_review_items_review_item` | `CREATE UNIQUE INDEX uq_clinical_review_items_review_item ON clinical.order_review_items USING btree (review_id, order_item_id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.order_review_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_item_id","order_item_id_internal_id","commerce","order_items"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["prescription_item_id","prescription_item_id_internal_id","clinical","prescription_items"],["review_id","review_id_internal_id","clinical","order_reviews"]]', 'internal_id', 'id')` |
| `controlled_reason` | `CREATE TRIGGER controlled_reason BEFORE INSERT OR UPDATE ON clinical.order_review_items FOR EACH ROW EXECUTE FUNCTION platform.normalize_reason('clinical.review_reason_codes')` |
| `review_item_guard` | `CREATE TRIGGER review_item_guard BEFORE INSERT OR DELETE OR UPDATE ON clinical.order_review_items FOR EACH ROW EXECUTE FUNCTION clinical.guard_review_item()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.order_review_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.order_review_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_item_id","order_item_id_internal_id","commerce","order_items"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["prescription_item_id","prescription_item_id_internal_id","clinical","prescription_items"],["review_id","review_id_internal_id","clinical","order_reviews"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
