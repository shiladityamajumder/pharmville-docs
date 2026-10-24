# `clinical.order_review_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds order review items records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | clinical.order_review_items |
| Classification | Transactional |
| Proposed business write owner | Pharmacist_Review |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 22 PK/FK/UQ/CHECK/exclusion constraints; 14 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 5 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approved_quantity` | `numeric(12,3)` | Yes | — | Approved quantity value | Track resource or item amounts accurately | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `decided_at` | `timestamp with time zone` | Yes | — | Time of decided | Support chronology, deadlines or audit evidence | Exact constraints below |
| `decision` | `character varying(20)` | No | `'pending'::character varying` | Inferred: stores decision for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `order_id` | `uuid` | No | — | Reference linking this record to order reviews | Ensures related business data can be joined and validated | FK → `commerce.order_items` via `fk_clinical_review_items_item_order`; FK → `clinical.order_reviews` via `fk_clinical_review_items_review_order_rx` |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` via `fk_clinical_review_items_item_order_numeric`; FK → `clinical.order_reviews` via `fk_clinical_review_items_review_order_rx_numeric` |
| `order_item_id` | `uuid` | No | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` via `fk_clinical_review_items_item_order` |
| `order_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` via `fk_clinical_review_items_item_order_numeric` |
| `prescription_id` | `uuid` | No | — | Reference linking this record to prescription items | Ensures related business data can be joined and validated | FK → `clinical.order_reviews` via `fk_clinical_review_items_review_order_rx`; FK → `clinical.prescription_items` via `fk_clinical_review_items_rx_item` |
| `prescription_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.order_reviews` via `fk_clinical_review_items_review_order_rx_numeric`; FK → `clinical.prescription_items` via `fk_clinical_review_items_rx_item_numeric` |
| `prescription_item_id` | `uuid` | Yes | — | Reference linking this record to prescription items | Ensures related business data can be joined and validated | FK → `clinical.prescription_items` via `fk_clinical_review_items_rx_item` |
| `prescription_item_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescription_items` via `fk_clinical_review_items_rx_item_numeric` |
| `reason_code` | `character varying(64)` | Yes | — | Reference linking this record to review reason codes | Ensures related business data can be joined and validated | FK → `clinical.review_reason_codes` via `fk_clinical_order_review_items_controlled_reason`; Collation: default |
| `reason_code_id` | `bigint` | Yes | — | Reference linking this record to review reason codes | Ensures related business data can be joined and validated | FK → `clinical.review_reason_codes` via `fk_clinical_order_review_items_controlled_reason` |
| `reason_note` | `text` | Yes | — | Inferred: stores reason note for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `review_id` | `uuid` | No | — | Reference linking this record to order reviews | Ensures related business data can be joined and validated | FK → `clinical.order_reviews` via `fk_clinical_review_items_review_order_rx` |
| `review_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.order_reviews` via `fk_clinical_review_items_review_order_rx_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |

## Record lifecycle and users

- **Created:** when the order review items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.order_review_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_clinical_order_review_items_controlled_reason | `reason_code_id, reason_code` | [`clinical.review_reason_codes`](../../Tables/clinical/review_reason_codes.md) | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES clinical.review_reason_codes(id, code) ON DELETE RESTRICT` |
| fk_clinical_review_items_item_order | `order_item_id, order_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id, order_id) REFERENCES commerce.order_items(id, order_id) ON DELETE RESTRICT` |
| fk_clinical_review_items_item_order_numeric | `order_item_id_internal_id, order_id_internal_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id_internal_id, order_id_internal_id) REFERENCES commerce.order_items(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| fk_clinical_review_items_review_order_rx | `review_id, order_id, prescription_id` | [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | `FOREIGN KEY (review_id, order_id, prescription_id) REFERENCES clinical.order_reviews(id, order_id, prescription_id) ON DELETE RESTRICT` |
| fk_clinical_review_items_review_order_rx_numeric | `review_id_internal_id, order_id_internal_id, prescription_id_internal_id` | [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | `FOREIGN KEY (review_id_internal_id, order_id_internal_id, prescription_id_internal_id) REFERENCES clinical.order_reviews(internal_id, order_id_internal_id, prescription_id_internal_id) ON DELETE RESTRICT` |
| fk_clinical_review_items_rx_item | `prescription_item_id, prescription_id` | [`clinical.prescription_items`](../../Tables/clinical/prescription_items.md) | `FOREIGN KEY (prescription_item_id, prescription_id) REFERENCES clinical.prescription_items(id, prescription_id) ON DELETE RESTRICT` |
| fk_clinical_review_items_rx_item_numeric | `prescription_item_id_internal_id, prescription_id_internal_id` | [`clinical.prescription_items`](../../Tables/clinical/prescription_items.md) | `FOREIGN KEY (prescription_item_id_internal_id, prescription_id_internal_id) REFERENCES clinical.prescription_items(internal_id, prescription_id_internal_id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `clinical.order_review_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `reason_code_id, reason_code` | `clinical.review_reason_codes` | `fk_clinical_order_review_items_controlled_reason` |
| `order_item_id, order_id` | `commerce.order_items` | `fk_clinical_review_items_item_order` |
| `order_item_id_internal_id, order_id_internal_id` | `commerce.order_items` | `fk_clinical_review_items_item_order_numeric` |
| `review_id, order_id, prescription_id` | `clinical.order_reviews` | `fk_clinical_review_items_review_order_rx` |
| `review_id_internal_id, order_id_internal_id, prescription_id_internal_id` | `clinical.order_reviews` | `fk_clinical_review_items_review_order_rx_numeric` |
| `prescription_item_id, prescription_id` | `clinical.prescription_items` | `fk_clinical_review_items_rx_item` |
| `prescription_item_id_internal_id, prescription_id_internal_id` | `clinical.prescription_items` | `fk_clinical_review_items_rx_item_numeric` |

### Existing constraints

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
| `order_review_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `order_review_items_decision_not_null` | NOT NULL | `NOT NULL decision` |
| `order_review_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `order_review_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `order_review_items_order_id_internal_id_not_null` | NOT NULL | `NOT NULL order_id_internal_id` |
| `order_review_items_order_id_not_null` | NOT NULL | `NOT NULL order_id` |
| `order_review_items_order_item_id_internal_id_not_null` | NOT NULL | `NOT NULL order_item_id_internal_id` |
| `order_review_items_order_item_id_not_null` | NOT NULL | `NOT NULL order_item_id` |
| `order_review_items_prescription_id_internal_id_not_null` | NOT NULL | `NOT NULL prescription_id_internal_id` |
| `order_review_items_prescription_id_not_null` | NOT NULL | `NOT NULL prescription_id` |
| `order_review_items_review_id_internal_id_not_null` | NOT NULL | `NOT NULL review_id_internal_id` |
| `order_review_items_review_id_not_null` | NOT NULL | `NOT NULL review_id` |
| `order_review_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `order_review_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_clinical_review_items_decision` | btree | `(review_id, decision)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_review_items_decision ON clinical.order_review_items USING btree (review_id, decision)` |
| `ix_clinical_review_items_item_time` | btree | `(order_item_id, created_at DESC)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_review_items_item_time ON clinical.order_review_items USING btree (order_item_id, created_at DESC)` |
| `pk_clinical_order_review_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_clinical_order_review_items ON clinical.order_review_items USING btree (internal_id)` |
| `uq_clinical_order_review_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_order_review_items_id ON clinical.order_review_items USING btree (id)` |
| `uq_clinical_review_items_review_item` | btree | `(review_id, order_item_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_review_items_review_item ON clinical.order_review_items USING btree (review_id, order_item_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.order_review_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_item_id","order_item_id_internal_id","commerce","order_items"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["prescription_item_id","prescription_item_id_internal_id","clinical","prescription_items"],["review_id","review_id_internal_id","clinical","order_reviews"]]', 'internal_id', 'id')` | O |
| `controlled_reason` | `CREATE TRIGGER controlled_reason BEFORE INSERT OR UPDATE ON clinical.order_review_items FOR EACH ROW EXECUTE FUNCTION platform.normalize_reason('clinical.review_reason_codes')` | O |
| `review_item_guard` | `CREATE TRIGGER review_item_guard BEFORE INSERT OR DELETE OR UPDATE ON clinical.order_review_items FOR EACH ROW EXECUTE FUNCTION clinical.guard_review_item()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.order_review_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.order_review_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_id","order_id_internal_id","commerce","orders"],["order_item_id","order_item_id_internal_id","commerce","order_items"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["prescription_item_id","prescription_item_id_internal_id","clinical","prescription_items"],["review_id","review_id_internal_id","clinical","order_reviews"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
