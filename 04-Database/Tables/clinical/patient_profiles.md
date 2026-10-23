# clinical.patient_profiles

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds patient profiles records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 18 columns, 11 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `abha_address_encrypted` | `bytea` | Yes | — | Inferred: stores abha address encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `abha_number_hash` | `character varying(128)` | Yes | — | Inferred: stores abha number hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `blood_group` | `character varying(8)` | Yes | — | Inferred: stores blood group for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_patient_profiles_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_patient_profiles_deleted_by_users) |
| `emergency_contact` | `jsonb` | No | `'{}'::jsonb` | Structured emergency contact information | Retain a versioned payload or relevant details | See exact constraints |
| `family_member_id` | `uuid` | Yes | — | Reference linking this record to family members | Ensures related business data can be joined and validated | FK → `customer.family_members` (fk_clinical_patient_profiles_family_member_id_family_members) |
| `family_member_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `customer.family_members` (fk_clinical_patient_profiles_family_member_id_family_me_da24); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `medical_record_number` | `character varying(64)` | Yes | — | Inferred: stores medical record number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_patient_profiles_updated_by_users) |
| `user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_patient_profiles_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the patient profiles business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.patient_profiles` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_clinical_patient_profiles_user_id_users`; FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE
- `created_by` → `identity.users(id)` via `fk_clinical_patient_profiles_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_clinical_patient_profiles_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_clinical_patient_profiles_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `family_member_id` → `customer.family_members(id)` via `fk_clinical_patient_profiles_family_member_id_family_members`; FOREIGN KEY (family_member_id) REFERENCES customer.family_members(id) ON DELETE CASCADE
- `family_member_id_internal_id` → `customer.family_members(internal_id)` via `fk_clinical_patient_profiles_family_member_id_family_me_da24`; FOREIGN KEY (family_member_id_internal_id) REFERENCES customer.family_members(internal_id) ON DELETE CASCADE

**Referenced by 30 FK constraints** (sample): `appointment.appointments`, `clinical.patient_allergies`, `clinical.patient_conditions`, `clinical.patient_medications`, `clinical.care_episodes`, `clinical.consultations`, `clinical.observations`, `clinical.prescriptions`, `commerce.orders`, `compliance.adverse_event_reports`, `diagnostics.diagnostic_orders`, `insurance.policies`.

## clinical.patient_profiles — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 18 columns, 11 constraints, 6 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_clinical_patient_profiles_user_id_users` |
| `created_by` | `identity.users` | `fk_clinical_patient_profiles_created_by_users` |
| `deleted_by` | `identity.users` | `fk_clinical_patient_profiles_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_clinical_patient_profiles_updated_by_users` |
| `family_member_id` | `customer.family_members` | `fk_clinical_patient_profiles_family_member_id_family_members` |
| `family_member_id_internal_id` | `customer.family_members` | `fk_clinical_patient_profiles_family_member_id_family_me_da24` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_patient_profiles_exactly_one_patient_owner` | CHECK | `CHECK (num_nonnulls(user_id, family_member_id) = 1)` |
| `ck_clinical_patient_profiles_numeric_pair_family_member_id` | CHECK | `CHECK ((family_member_id IS NULL) = (family_member_id_internal_id IS NULL))` |
| `ck_clinical_patient_profiles_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_clinical_patient_profiles_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_patient_profiles_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_patient_profiles_family_member_id_family_me_da24` | FOREIGN KEY | `FOREIGN KEY (family_member_id_internal_id) REFERENCES customer.family_members(internal_id) ON DELETE CASCADE` |
| `fk_clinical_patient_profiles_family_member_id_family_members` | FOREIGN KEY | `FOREIGN KEY (family_member_id) REFERENCES customer.family_members(id) ON DELETE CASCADE` |
| `fk_clinical_patient_profiles_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_patient_profiles_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_clinical_patient_profiles` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_clinical_patient_profiles_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_clinical_patient_profiles_family_member_id` | `CREATE INDEX ix_clinical_patient_profiles_family_member_id ON clinical.patient_profiles USING btree (family_member_id)` |
| `ix_clinical_patient_profiles_user_id` | `CREATE INDEX ix_clinical_patient_profiles_user_id ON clinical.patient_profiles USING btree (user_id)` |
| `pk_clinical_patient_profiles` | `CREATE UNIQUE INDEX pk_clinical_patient_profiles ON clinical.patient_profiles USING btree (internal_id)` |
| `uq_clinical_patient_family_active` | `CREATE UNIQUE INDEX uq_clinical_patient_family_active ON clinical.patient_profiles USING btree (family_member_id) WHERE family_member_id IS NOT NULL AND is_deleted = false` |
| `uq_clinical_patient_profiles_id` | `CREATE UNIQUE INDEX uq_clinical_patient_profiles_id ON clinical.patient_profiles USING btree (id)` |
| `uq_clinical_patient_user_active` | `CREATE UNIQUE INDEX uq_clinical_patient_user_active ON clinical.patient_profiles USING btree (user_id) WHERE user_id IS NOT NULL AND is_deleted = false` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.patient_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["family_member_id","family_member_id_internal_id","customer","family_members"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.patient_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.patient_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["family_member_id","family_member_id_internal_id","customer","family_members"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
