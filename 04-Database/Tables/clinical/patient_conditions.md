# `clinical.patient_conditions`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds patient conditions records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 18 columns, 9 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `clinical_status` | `character varying(32)` | No | — | Inferred: stores clinical status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `condition_code` | `character varying(128)` | Yes | — | Code for condition | Link to controlled business classification or an external reference | See exact constraints |
| `condition_name` | `character varying(255)` | No | — | Inferred: stores condition name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_patient_conditions_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_patient_conditions_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `notes` | `text` | Yes | — | Inferred: stores notes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `onset_date` | `date` | Yes | — | Inferred: stores onset date for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` (fk_clinical_patient_conditions_patient_profile_id_patie_982f) |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` (fk_clinical_patient_conditions_patient_profile_id_patie_c663); Numeric/public-key pair verification required |
| `resolved_date` | `date` | Yes | — | Inferred: stores resolved date for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_patient_conditions_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the patient conditions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.patient_conditions` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_clinical_patient_conditions_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_clinical_patient_conditions_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_clinical_patient_conditions_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `patient_profile_id` → `clinical.patient_profiles(id)` via `fk_clinical_patient_conditions_patient_profile_id_patie_982f`; `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE CASCADE`
- `patient_profile_id_internal_id` → `clinical.patient_profiles(internal_id)` via `fk_clinical_patient_conditions_patient_profile_id_patie_c663`; `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE CASCADE`

## `clinical.patient_conditions` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 18 columns, 9 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_clinical_patient_conditions_created_by_users` |
| `deleted_by` | `identity.users` | `fk_clinical_patient_conditions_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_clinical_patient_conditions_updated_by_users` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_clinical_patient_conditions_patient_profile_id_patie_982f` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_clinical_patient_conditions_patient_profile_id_patie_c663` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_patient_conditions_numeric_pair_patient_profile_id` | CHECK | `CHECK ((patient_profile_id IS NULL) = (patient_profile_id_internal_id IS NULL))` |
| `ck_clinical_patient_conditions_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_clinical_patient_conditions_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_patient_conditions_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_patient_conditions_patient_profile_id_patie_982f` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE CASCADE` |
| `fk_clinical_patient_conditions_patient_profile_id_patie_c663` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE CASCADE` |
| `fk_clinical_patient_conditions_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_clinical_patient_conditions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_clinical_patient_conditions_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_clinical_patient_conditions_code` | `CREATE INDEX ix_clinical_patient_conditions_code ON clinical.patient_conditions USING btree (condition_code)` |
| `ix_clinical_patient_conditions_patient` | `CREATE INDEX ix_clinical_patient_conditions_patient ON clinical.patient_conditions USING btree (patient_profile_id)` |
| `pk_clinical_patient_conditions` | `CREATE UNIQUE INDEX pk_clinical_patient_conditions ON clinical.patient_conditions USING btree (internal_id)` |
| `uq_clinical_patient_conditions_id` | `CREATE UNIQUE INDEX uq_clinical_patient_conditions_id ON clinical.patient_conditions USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.patient_conditions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.patient_conditions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.patient_conditions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
