# `clinical.prescription_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds prescription items records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | clinical.prescription_items |
| Classification | Transactional |
| Proposed business write owner | Prescription_Upload |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 15 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_prescription_items_created_by_users` |
| `dosage` | `character varying(128)` | Yes | — | Inferred: stores dosage for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `duration` | `character varying(128)` | Yes | — | Inferred: stores duration for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `frequency` | `character varying(128)` | Yes | — | Inferred: stores frequency for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `instructions` | `text` | Yes | — | Inferred: stores instructions for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `medicine_name` | `character varying(255)` | No | — | Inferred: stores medicine name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `prescription_id` | `uuid` | No | — | Reference linking this record to prescriptions | Ensures related business data can be joined and validated | FK → `clinical.prescriptions` via `fk_clinical_prescription_items_prescription_id_prescriptions` |
| `prescription_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescriptions` via `fk_clinical_prescription_items_prescription_id_prescrip_079d` |
| `product_id` | `uuid` | Yes | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_clinical_prescription_items_product_id_products` |
| `product_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_clinical_prescription_items_product_id_products_numeric` |
| `quantity` | `numeric(12,3)` | Yes | — | Quantity value | Track resource or item amounts accurately | Exact constraints below |
| `review_status` | `character varying(32)` | No | `'pending'::character varying` | Inferred: stores review status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `route` | `character varying(64)` | Yes | — | Inferred: stores route for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `strength` | `character varying(64)` | Yes | — | Inferred: stores strength for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `substitution_allowed` | `boolean` | Yes | — | Inferred: stores substitution allowed for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_prescription_items_updated_by_users` |

## Record lifecycle and users

- **Created:** when the prescription items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.prescription_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_clinical_prescription_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_prescription_items_prescription_id_prescrip_079d | `prescription_id_internal_id` | [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE CASCADE` |
| fk_clinical_prescription_items_prescription_id_prescriptions | `prescription_id` | [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE CASCADE` |
| fk_clinical_prescription_items_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE SET NULL` |
| fk_clinical_prescription_items_product_id_products_numeric | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE SET NULL` |
| fk_clinical_prescription_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`clinical.order_review_items`](../../Tables/clinical/order_review_items.md) | fk_clinical_review_items_rx_item | `prescription_item_id, prescription_id` | `id, prescription_id` |
| [`clinical.order_review_items`](../../Tables/clinical/order_review_items.md) | fk_clinical_review_items_rx_item_numeric | `prescription_item_id_internal_id, prescription_id_internal_id` | `internal_id, prescription_id_internal_id` |

## `clinical.prescription_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_clinical_prescription_items_created_by_users` |
| `prescription_id_internal_id` | `clinical.prescriptions` | `fk_clinical_prescription_items_prescription_id_prescrip_079d` |
| `prescription_id` | `clinical.prescriptions` | `fk_clinical_prescription_items_prescription_id_prescriptions` |
| `product_id` | `catalog.products` | `fk_clinical_prescription_items_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_clinical_prescription_items_product_id_products_numeric` |
| `updated_by` | `identity.users` | `fk_clinical_prescription_items_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_prescription_items_finite_numeric_values` | CHECK | `CHECK (quantity IS NULL OR (quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_clinical_prescription_items_numeric_pair_prescription_id` | CHECK | `CHECK ((prescription_id IS NULL) = (prescription_id_internal_id IS NULL))` |
| `ck_clinical_prescription_items_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_clinical_prescription_items_quantity_positive` | CHECK | `CHECK (quantity IS NULL OR quantity > 0::numeric)` |
| `ck_clinical_prescription_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_clinical_prescription_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_prescription_items_prescription_id_prescrip_079d` | FOREIGN KEY | `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE CASCADE` |
| `fk_clinical_prescription_items_prescription_id_prescriptions` | FOREIGN KEY | `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE CASCADE` |
| `fk_clinical_prescription_items_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE SET NULL` |
| `fk_clinical_prescription_items_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE SET NULL` |
| `fk_clinical_prescription_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_clinical_prescription_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_clinical_prescription_items_id` | UNIQUE | `UNIQUE (id)` |
| `uq_clinical_prescription_items_id_prescription` | UNIQUE | `UNIQUE (id, prescription_id)` |
| `uq_numeric_clinical_prescription_items_internal_id_pres_2214` | UNIQUE | `UNIQUE (internal_id, prescription_id_internal_id)` |
| `prescription_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `prescription_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `prescription_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `prescription_items_medicine_name_not_null` | NOT NULL | `NOT NULL medicine_name` |
| `prescription_items_prescription_id_internal_id_not_null` | NOT NULL | `NOT NULL prescription_id_internal_id` |
| `prescription_items_prescription_id_not_null` | NOT NULL | `NOT NULL prescription_id` |
| `prescription_items_review_status_not_null` | NOT NULL | `NOT NULL review_status` |
| `prescription_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `prescription_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_clinical_prescription_items_prescription` | btree | `(prescription_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_prescription_items_prescription ON clinical.prescription_items USING btree (prescription_id)` |
| `ix_clinical_prescription_items_product` | btree | `(product_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_prescription_items_product ON clinical.prescription_items USING btree (product_id)` |
| `pk_clinical_prescription_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_clinical_prescription_items ON clinical.prescription_items USING btree (internal_id)` |
| `uq_clinical_prescription_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_prescription_items_id ON clinical.prescription_items USING btree (id)` |
| `uq_clinical_prescription_items_id_prescription` | btree | `(id, prescription_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_prescription_items_id_prescription ON clinical.prescription_items USING btree (id, prescription_id)` |
| `uq_numeric_clinical_prescription_items_internal_id_pres_2214` | btree | `(internal_id, prescription_id_internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_numeric_clinical_prescription_items_internal_id_pres_2214 ON clinical.prescription_items USING btree (internal_id, prescription_id_internal_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.prescription_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.prescription_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.prescription_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
