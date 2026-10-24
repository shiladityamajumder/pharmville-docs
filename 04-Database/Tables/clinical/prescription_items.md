# `clinical.prescription_items`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds prescription items records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 15 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_prescription_items_created_by_users) |
| `dosage` | `character varying(128)` | Yes | — | Inferred: stores dosage for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `duration` | `character varying(128)` | Yes | — | Inferred: stores duration for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `frequency` | `character varying(128)` | Yes | — | Inferred: stores frequency for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `instructions` | `text` | Yes | — | Inferred: stores instructions for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `medicine_name` | `character varying(255)` | No | — | Inferred: stores medicine name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `prescription_id` | `uuid` | No | — | Reference linking this record to prescriptions | Ensures related business data can be joined and validated | FK → `clinical.prescriptions` (fk_clinical_prescription_items_prescription_id_prescriptions) |
| `prescription_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescriptions` (fk_clinical_prescription_items_prescription_id_prescrip_079d); Numeric/public-key pair verification required |
| `product_id` | `uuid` | Yes | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_clinical_prescription_items_product_id_products) |
| `product_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_clinical_prescription_items_product_id_products_numeric); Numeric/public-key pair verification required |
| `quantity` | `numeric(12,3)` | Yes | — | Quantity value | Track resource or item amounts accurately | See exact constraints |
| `review_status` | `character varying(32)` | No | `'pending'::character varying` | Inferred: stores review status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `route` | `character varying(64)` | Yes | — | Inferred: stores route for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `strength` | `character varying(64)` | Yes | — | Inferred: stores strength for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `substitution_allowed` | `boolean` | Yes | — | Inferred: stores substitution allowed for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_prescription_items_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the prescription items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.prescription_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_clinical_prescription_items_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_clinical_prescription_items_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `prescription_id` → `clinical.prescriptions(id)` via `fk_clinical_prescription_items_prescription_id_prescriptions`; `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE CASCADE`
- `product_id` → `catalog.products(id)` via `fk_clinical_prescription_items_product_id_products`; `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE SET NULL`
- `prescription_id_internal_id` → `clinical.prescriptions(internal_id)` via `fk_clinical_prescription_items_prescription_id_prescrip_079d`; `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE CASCADE`
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_clinical_prescription_items_product_id_products_numeric`; `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE SET NULL`

**Referenced by 2 FK constraints** (sample): `clinical.order_review_items`, `clinical.order_review_items`.

## `clinical.prescription_items` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 21 columns, 15 constraints, 6 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_clinical_prescription_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_clinical_prescription_items_updated_by_users` |
| `prescription_id` | `clinical.prescriptions` | `fk_clinical_prescription_items_prescription_id_prescriptions` |
| `product_id` | `catalog.products` | `fk_clinical_prescription_items_product_id_products` |
| `prescription_id_internal_id` | `clinical.prescriptions` | `fk_clinical_prescription_items_prescription_id_prescrip_079d` |
| `product_id_internal_id` | `catalog.products` | `fk_clinical_prescription_items_product_id_products_numeric` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_clinical_prescription_items_prescription` | `CREATE INDEX ix_clinical_prescription_items_prescription ON clinical.prescription_items USING btree (prescription_id)` |
| `ix_clinical_prescription_items_product` | `CREATE INDEX ix_clinical_prescription_items_product ON clinical.prescription_items USING btree (product_id)` |
| `pk_clinical_prescription_items` | `CREATE UNIQUE INDEX pk_clinical_prescription_items ON clinical.prescription_items USING btree (internal_id)` |
| `uq_clinical_prescription_items_id` | `CREATE UNIQUE INDEX uq_clinical_prescription_items_id ON clinical.prescription_items USING btree (id)` |
| `uq_clinical_prescription_items_id_prescription` | `CREATE UNIQUE INDEX uq_clinical_prescription_items_id_prescription ON clinical.prescription_items USING btree (id, prescription_id)` |
| `uq_numeric_clinical_prescription_items_internal_id_pres_2214` | `CREATE UNIQUE INDEX uq_numeric_clinical_prescription_items_internal_id_pres_2214 ON clinical.prescription_items USING btree (internal_id, prescription_id_internal_id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.prescription_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.prescription_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.prescription_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
