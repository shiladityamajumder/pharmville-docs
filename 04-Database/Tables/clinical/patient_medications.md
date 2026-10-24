# `clinical.patient_medications`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds patient medications records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 20 columns, 13 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_patient_medications_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_patient_medications_deleted_by_users) |
| `dosage` | `character varying(128)` | Yes | — | Inferred: stores dosage for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `ended_at` | `date` | Yes | — | Time of ended | Support chronology, deadlines or audit evidence | See exact constraints |
| `frequency` | `character varying(128)` | Yes | — | Inferred: stores frequency for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `medicine_name` | `character varying(255)` | No | — | Inferred: stores medicine name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` (fk_clinical_patient_medications_patient_profile_id_pati_2854) |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` (fk_clinical_patient_medications_patient_profile_id_pati_3f4f); Numeric/public-key pair verification required |
| `product_id` | `uuid` | Yes | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_clinical_patient_medications_product_id_products) |
| `product_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_clinical_patient_medications_product_id_products_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `source` | `character varying(32)` | No | — | Inferred: stores source for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `started_at` | `date` | Yes | — | Time of started | Support chronology, deadlines or audit evidence | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_patient_medications_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the patient medications business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.patient_medications` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_clinical_patient_medications_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_clinical_patient_medications_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_clinical_patient_medications_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `product_id` → `catalog.products(id)` via `fk_clinical_patient_medications_product_id_products`; `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE SET NULL`
- `patient_profile_id` → `clinical.patient_profiles(id)` via `fk_clinical_patient_medications_patient_profile_id_pati_2854`; `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE CASCADE`
- `patient_profile_id_internal_id` → `clinical.patient_profiles(internal_id)` via `fk_clinical_patient_medications_patient_profile_id_pati_3f4f`; `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE CASCADE`
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_clinical_patient_medications_product_id_products_numeric`; `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE SET NULL`

## `clinical.patient_medications` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 20 columns, 13 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_clinical_patient_medications_created_by_users` |
| `deleted_by` | `identity.users` | `fk_clinical_patient_medications_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_clinical_patient_medications_updated_by_users` |
| `product_id` | `catalog.products` | `fk_clinical_patient_medications_product_id_products` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_clinical_patient_medications_patient_profile_id_pati_2854` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_clinical_patient_medications_patient_profile_id_pati_3f4f` |
| `product_id_internal_id` | `catalog.products` | `fk_clinical_patient_medications_product_id_products_numeric` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_clinical_patient_medications_patient` | `CREATE INDEX ix_clinical_patient_medications_patient ON clinical.patient_medications USING btree (patient_profile_id)` |
| `ix_clinical_patient_medications_product` | `CREATE INDEX ix_clinical_patient_medications_product ON clinical.patient_medications USING btree (product_id)` |
| `pk_clinical_patient_medications` | `CREATE UNIQUE INDEX pk_clinical_patient_medications ON clinical.patient_medications USING btree (internal_id)` |
| `uq_clinical_patient_medications_id` | `CREATE UNIQUE INDEX uq_clinical_patient_medications_id ON clinical.patient_medications USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.patient_medications FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.patient_medications FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.patient_medications FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
