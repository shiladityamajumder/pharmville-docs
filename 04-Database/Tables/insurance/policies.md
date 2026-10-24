# `insurance.policies`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds policies records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 25 columns, 20 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `coverage_end` | `date` | No | — | Inferred: stores coverage end for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `coverage_start` | `date` | No | — | Inferred: stores coverage start for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_insurance_policies_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_insurance_policies_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `insurer_id` | `uuid` | No | — | Reference linking this record to insurers | Ensures related business data can be joined and validated | FK → `insurance.insurers` (fk_insurance_policies_insurer_id_insurers) |
| `insurer_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `insurance.insurers` (fk_insurance_policies_insurer_id_insurers_numeric); Numeric/public-key pair verification required |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `patient_profile_id` | `uuid` | Yes | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` (fk_insurance_policies_patient_profile_id_patient_profiles) |
| `patient_profile_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` (fk_insurance_policies_patient_profile_id_patient_profil_0c08); Numeric/public-key pair verification required |
| `plan_name` | `character varying(255)` | Yes | — | Inferred: stores plan name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `policy_metadata` | `jsonb` | No | `'{}'::jsonb` | Structured policy metadata information | Retain a versioned payload or relevant details | See exact constraints |
| `policy_number_encrypted` | `bytea` | No | — | Inferred: stores policy number encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `policy_number_hash` | `character varying(128)` | No | — | Inferred: stores policy number hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `sum_insured` | `numeric(18,2)` | Yes | — | Inferred: stores sum insured for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `tpa_id` | `uuid` | Yes | — | Reference linking this record to tpas | Ensures related business data can be joined and validated | FK → `insurance.tpas` (fk_insurance_policies_tpa_id_tpas) |
| `tpa_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `insurance.tpas` (fk_insurance_policies_tpa_id_tpas_numeric); Numeric/public-key pair verification required |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_insurance_policies_updated_by_users) |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_insurance_policies_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the policies business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `insurance.policies` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_insurance_policies_user_id_users`; `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE`
- `created_by` → `identity.users(id)` via `fk_insurance_policies_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_insurance_policies_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_insurance_policies_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `tpa_id` → `insurance.tpas(id)` via `fk_insurance_policies_tpa_id_tpas`; `FOREIGN KEY (tpa_id) REFERENCES insurance.tpas(id) ON DELETE SET NULL`
- `insurer_id` → `insurance.insurers(id)` via `fk_insurance_policies_insurer_id_insurers`; `FOREIGN KEY (insurer_id) REFERENCES insurance.insurers(id) ON DELETE RESTRICT`
- `patient_profile_id` → `clinical.patient_profiles(id)` via `fk_insurance_policies_patient_profile_id_patient_profiles`; `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE SET NULL`
- `insurer_id_internal_id` → `insurance.insurers(internal_id)` via `fk_insurance_policies_insurer_id_insurers_numeric`; `FOREIGN KEY (insurer_id_internal_id) REFERENCES insurance.insurers(internal_id) ON DELETE RESTRICT`
- `patient_profile_id_internal_id` → `clinical.patient_profiles(internal_id)` via `fk_insurance_policies_patient_profile_id_patient_profil_0c08`; `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE SET NULL`
- `tpa_id_internal_id` → `insurance.tpas(internal_id)` via `fk_insurance_policies_tpa_id_tpas_numeric`; `FOREIGN KEY (tpa_id_internal_id) REFERENCES insurance.tpas(internal_id) ON DELETE SET NULL`

**Referenced by 6 FK constraints** (sample): `insurance.policy_members`, `insurance.eligibility_checks`, `insurance.claims`, `insurance.claims`, `insurance.eligibility_checks`, `insurance.policy_members`.

## `insurance.policies` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 25 columns, 20 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_insurance_policies_user_id_users` |
| `created_by` | `identity.users` | `fk_insurance_policies_created_by_users` |
| `deleted_by` | `identity.users` | `fk_insurance_policies_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_insurance_policies_updated_by_users` |
| `tpa_id` | `insurance.tpas` | `fk_insurance_policies_tpa_id_tpas` |
| `insurer_id` | `insurance.insurers` | `fk_insurance_policies_insurer_id_insurers` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_insurance_policies_patient_profile_id_patient_profiles` |
| `insurer_id_internal_id` | `insurance.insurers` | `fk_insurance_policies_insurer_id_insurers_numeric` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_insurance_policies_patient_profile_id_patient_profil_0c08` |
| `tpa_id_internal_id` | `insurance.tpas` | `fk_insurance_policies_tpa_id_tpas_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_insurance_policies_coverage_window` | CHECK | `CHECK (coverage_end >= coverage_start)` |
| `ck_insurance_policies_finite_numeric_values` | CHECK | `CHECK (sum_insured IS NULL OR (sum_insured <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_insurance_policies_numeric_pair_insurer_id` | CHECK | `CHECK ((insurer_id IS NULL) = (insurer_id_internal_id IS NULL))` |
| `ck_insurance_policies_numeric_pair_patient_profile_id` | CHECK | `CHECK ((patient_profile_id IS NULL) = (patient_profile_id_internal_id IS NULL))` |
| `ck_insurance_policies_numeric_pair_tpa_id` | CHECK | `CHECK ((tpa_id IS NULL) = (tpa_id_internal_id IS NULL))` |
| `ck_insurance_policies_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_insurance_policies_sum_insured_nonnegative` | CHECK | `CHECK (sum_insured IS NULL OR sum_insured >= 0::numeric)` |
| `fk_insurance_policies_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_insurance_policies_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_insurance_policies_insurer_id_insurers` | FOREIGN KEY | `FOREIGN KEY (insurer_id) REFERENCES insurance.insurers(id) ON DELETE RESTRICT` |
| `fk_insurance_policies_insurer_id_insurers_numeric` | FOREIGN KEY | `FOREIGN KEY (insurer_id_internal_id) REFERENCES insurance.insurers(internal_id) ON DELETE RESTRICT` |
| `fk_insurance_policies_patient_profile_id_patient_profil_0c08` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE SET NULL` |
| `fk_insurance_policies_patient_profile_id_patient_profiles` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE SET NULL` |
| `fk_insurance_policies_tpa_id_tpas` | FOREIGN KEY | `FOREIGN KEY (tpa_id) REFERENCES insurance.tpas(id) ON DELETE SET NULL` |
| `fk_insurance_policies_tpa_id_tpas_numeric` | FOREIGN KEY | `FOREIGN KEY (tpa_id_internal_id) REFERENCES insurance.tpas(internal_id) ON DELETE SET NULL` |
| `fk_insurance_policies_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_insurance_policies_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `insurer_policy_number` | UNIQUE | `UNIQUE (insurer_id, policy_number_hash)` |
| `pk_insurance_policies` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_insurance_policies_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `insurer_policy_number` | `CREATE UNIQUE INDEX insurer_policy_number ON insurance.policies USING btree (insurer_id, policy_number_hash)` |
| `ix_insurance_policies_status` | `CREATE INDEX ix_insurance_policies_status ON insurance.policies USING btree (status)` |
| `ix_insurance_policies_user` | `CREATE INDEX ix_insurance_policies_user ON insurance.policies USING btree (user_id)` |
| `pk_insurance_policies` | `CREATE UNIQUE INDEX pk_insurance_policies ON insurance.policies USING btree (internal_id)` |
| `uq_insurance_policies_id` | `CREATE UNIQUE INDEX uq_insurance_policies_id ON insurance.policies USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON insurance.policies FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["insurer_id","insurer_id_internal_id","insurance","insurers"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["tpa_id","tpa_id_internal_id","insurance","tpas"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON insurance.policies FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON insurance.policies FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["insurer_id","insurer_id_internal_id","insurance","insurers"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["tpa_id","tpa_id_internal_id","insurance","tpas"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
