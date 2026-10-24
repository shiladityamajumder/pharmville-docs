# `clinical.patient_medications`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds patient medications records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | clinical.patient_medications |
| Classification | Transactional |
| Proposed business write owner | Future clinical-care owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 20 columns; 13 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_patient_medications_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_patient_medications_deleted_by_users` |
| `dosage` | `character varying(128)` | Yes | — | Inferred: stores dosage for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `ended_at` | `date` | Yes | — | Time of ended | Support chronology, deadlines or audit evidence | Exact constraints below |
| `frequency` | `character varying(128)` | Yes | — | Inferred: stores frequency for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `medicine_name` | `character varying(255)` | No | — | Inferred: stores medicine name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` via `fk_clinical_patient_medications_patient_profile_id_pati_2854` |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` via `fk_clinical_patient_medications_patient_profile_id_pati_3f4f` |
| `product_id` | `uuid` | Yes | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_clinical_patient_medications_product_id_products` |
| `product_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_clinical_patient_medications_product_id_products_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `source` | `character varying(32)` | No | — | Inferred: stores source for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `started_at` | `date` | Yes | — | Time of started | Support chronology, deadlines or audit evidence | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_patient_medications_updated_by_users` |

## Record lifecycle and users

- **Created:** when the patient medications business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.patient_medications` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_clinical_patient_medications_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_patient_medications_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_patient_medications_patient_profile_id_pati_2854 | `patient_profile_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE CASCADE` |
| fk_clinical_patient_medications_patient_profile_id_pati_3f4f | `patient_profile_id_internal_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE CASCADE` |
| fk_clinical_patient_medications_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE SET NULL` |
| fk_clinical_patient_medications_product_id_products_numeric | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE SET NULL` |
| fk_clinical_patient_medications_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `clinical.patient_medications` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_clinical_patient_medications_created_by_users` |
| `deleted_by` | `identity.users` | `fk_clinical_patient_medications_deleted_by_users` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_clinical_patient_medications_patient_profile_id_pati_2854` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_clinical_patient_medications_patient_profile_id_pati_3f4f` |
| `product_id` | `catalog.products` | `fk_clinical_patient_medications_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_clinical_patient_medications_product_id_products_numeric` |
| `updated_by` | `identity.users` | `fk_clinical_patient_medications_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_patient_medications_medication_dates` | CHECK | `CHECK (ended_at IS NULL OR started_at IS NULL OR ended_at >= started_at)` |
| `ck_clinical_patient_medications_numeric_pair_patient_profile_id` | CHECK | `CHECK ((patient_profile_id IS NULL) = (patient_profile_id_internal_id IS NULL))` |
| `ck_clinical_patient_medications_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_clinical_patient_medications_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_clinical_patient_medications_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_patient_medications_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_patient_medications_patient_profile_id_pati_2854` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE CASCADE` |
| `fk_clinical_patient_medications_patient_profile_id_pati_3f4f` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE CASCADE` |
| `fk_clinical_patient_medications_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE SET NULL` |
| `fk_clinical_patient_medications_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE SET NULL` |
| `fk_clinical_patient_medications_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_clinical_patient_medications` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_clinical_patient_medications_id` | UNIQUE | `UNIQUE (id)` |
| `patient_medications_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `patient_medications_id_not_null` | NOT NULL | `NOT NULL id` |
| `patient_medications_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `patient_medications_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `patient_medications_medicine_name_not_null` | NOT NULL | `NOT NULL medicine_name` |
| `patient_medications_patient_profile_id_internal_id_not_null` | NOT NULL | `NOT NULL patient_profile_id_internal_id` |
| `patient_medications_patient_profile_id_not_null` | NOT NULL | `NOT NULL patient_profile_id` |
| `patient_medications_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `patient_medications_source_not_null` | NOT NULL | `NOT NULL source` |
| `patient_medications_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_clinical_patient_medications_patient` | btree | `(patient_profile_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_patient_medications_patient ON clinical.patient_medications USING btree (patient_profile_id)` |
| `ix_clinical_patient_medications_product` | btree | `(product_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_patient_medications_product ON clinical.patient_medications USING btree (product_id)` |
| `pk_clinical_patient_medications` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_clinical_patient_medications ON clinical.patient_medications USING btree (internal_id)` |
| `uq_clinical_patient_medications_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_patient_medications_id ON clinical.patient_medications USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.patient_medications FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.patient_medications FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.patient_medications FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
