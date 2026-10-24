# `insurance.policies`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds policies records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | insurance.policies |
| Classification | Transactional |
| Proposed business write owner | Future insurance owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 25 columns; 20 PK/FK/UQ/CHECK/exclusion constraints; 15 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `coverage_end` | `date` | No | — | Inferred: stores coverage end for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `coverage_start` | `date` | No | — | Inferred: stores coverage start for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_insurance_policies_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_insurance_policies_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `insurer_id` | `uuid` | No | — | Reference linking this record to insurers | Ensures related business data can be joined and validated | FK → `insurance.insurers` via `fk_insurance_policies_insurer_id_insurers` |
| `insurer_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `insurance.insurers` via `fk_insurance_policies_insurer_id_insurers_numeric` |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `patient_profile_id` | `uuid` | Yes | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` via `fk_insurance_policies_patient_profile_id_patient_profiles` |
| `patient_profile_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` via `fk_insurance_policies_patient_profile_id_patient_profil_0c08` |
| `plan_name` | `character varying(255)` | Yes | — | Inferred: stores plan name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `policy_metadata` | `jsonb` | No | `'{}'::jsonb` | Structured policy metadata information | Retain a versioned payload or relevant details | Exact constraints below |
| `policy_number_encrypted` | `bytea` | No | — | Inferred: stores policy number encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `policy_number_hash` | `character varying(128)` | No | — | Inferred: stores policy number hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `sum_insured` | `numeric(18,2)` | Yes | — | Inferred: stores sum insured for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `tpa_id` | `uuid` | Yes | — | Reference linking this record to tpas | Ensures related business data can be joined and validated | FK → `insurance.tpas` via `fk_insurance_policies_tpa_id_tpas` |
| `tpa_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `insurance.tpas` via `fk_insurance_policies_tpa_id_tpas_numeric` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_insurance_policies_updated_by_users` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_insurance_policies_user_id_users` |

## Record lifecycle and users

- **Created:** when the policies business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `insurance.policies` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_insurance_policies_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_insurance_policies_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_insurance_policies_insurer_id_insurers | `insurer_id` | [`insurance.insurers`](../../Tables/insurance/insurers.md) | `FOREIGN KEY (insurer_id) REFERENCES insurance.insurers(id) ON DELETE RESTRICT` |
| fk_insurance_policies_insurer_id_insurers_numeric | `insurer_id_internal_id` | [`insurance.insurers`](../../Tables/insurance/insurers.md) | `FOREIGN KEY (insurer_id_internal_id) REFERENCES insurance.insurers(internal_id) ON DELETE RESTRICT` |
| fk_insurance_policies_patient_profile_id_patient_profil_0c08 | `patient_profile_id_internal_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE SET NULL` |
| fk_insurance_policies_patient_profile_id_patient_profiles | `patient_profile_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE SET NULL` |
| fk_insurance_policies_tpa_id_tpas | `tpa_id` | [`insurance.tpas`](../../Tables/insurance/tpas.md) | `FOREIGN KEY (tpa_id) REFERENCES insurance.tpas(id) ON DELETE SET NULL` |
| fk_insurance_policies_tpa_id_tpas_numeric | `tpa_id_internal_id` | [`insurance.tpas`](../../Tables/insurance/tpas.md) | `FOREIGN KEY (tpa_id_internal_id) REFERENCES insurance.tpas(internal_id) ON DELETE SET NULL` |
| fk_insurance_policies_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_insurance_policies_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`insurance.claims`](../../Tables/insurance/claims.md) | fk_insurance_claims_policy_id_policies | `policy_id` | `id` |
| [`insurance.claims`](../../Tables/insurance/claims.md) | fk_insurance_claims_policy_id_policies_numeric | `policy_id_internal_id` | `internal_id` |
| [`insurance.eligibility_checks`](../../Tables/insurance/eligibility_checks.md) | fk_insurance_eligibility_checks_policy_id_policies | `policy_id` | `id` |
| [`insurance.eligibility_checks`](../../Tables/insurance/eligibility_checks.md) | fk_insurance_eligibility_checks_policy_id_policies_numeric | `policy_id_internal_id` | `internal_id` |
| [`insurance.policy_members`](../../Tables/insurance/policy_members.md) | fk_insurance_policy_members_policy_id_policies | `policy_id` | `id` |
| [`insurance.policy_members`](../../Tables/insurance/policy_members.md) | fk_insurance_policy_members_policy_id_policies_numeric | `policy_id_internal_id` | `internal_id` |

## `insurance.policies` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_insurance_policies_created_by_users` |
| `deleted_by` | `identity.users` | `fk_insurance_policies_deleted_by_users` |
| `insurer_id` | `insurance.insurers` | `fk_insurance_policies_insurer_id_insurers` |
| `insurer_id_internal_id` | `insurance.insurers` | `fk_insurance_policies_insurer_id_insurers_numeric` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_insurance_policies_patient_profile_id_patient_profil_0c08` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_insurance_policies_patient_profile_id_patient_profiles` |
| `tpa_id` | `insurance.tpas` | `fk_insurance_policies_tpa_id_tpas` |
| `tpa_id_internal_id` | `insurance.tpas` | `fk_insurance_policies_tpa_id_tpas_numeric` |
| `updated_by` | `identity.users` | `fk_insurance_policies_updated_by_users` |
| `user_id` | `identity.users` | `fk_insurance_policies_user_id_users` |

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
| `policies_coverage_end_not_null` | NOT NULL | `NOT NULL coverage_end` |
| `policies_coverage_start_not_null` | NOT NULL | `NOT NULL coverage_start` |
| `policies_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `policies_id_not_null` | NOT NULL | `NOT NULL id` |
| `policies_insurer_id_internal_id_not_null` | NOT NULL | `NOT NULL insurer_id_internal_id` |
| `policies_insurer_id_not_null` | NOT NULL | `NOT NULL insurer_id` |
| `policies_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `policies_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `policies_policy_metadata_not_null` | NOT NULL | `NOT NULL policy_metadata` |
| `policies_policy_number_encrypted_not_null` | NOT NULL | `NOT NULL policy_number_encrypted` |
| `policies_policy_number_hash_not_null` | NOT NULL | `NOT NULL policy_number_hash` |
| `policies_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `policies_status_not_null` | NOT NULL | `NOT NULL status` |
| `policies_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `policies_user_id_not_null` | NOT NULL | `NOT NULL user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `insurer_policy_number` | btree | `(insurer_id, policy_number_hash)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX insurer_policy_number ON insurance.policies USING btree (insurer_id, policy_number_hash)` |
| `ix_insurance_policies_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_insurance_policies_status ON insurance.policies USING btree (status)` |
| `ix_insurance_policies_user` | btree | `(user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_insurance_policies_user ON insurance.policies USING btree (user_id)` |
| `pk_insurance_policies` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_insurance_policies ON insurance.policies USING btree (internal_id)` |
| `uq_insurance_policies_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_insurance_policies_id ON insurance.policies USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON insurance.policies FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["insurer_id","insurer_id_internal_id","insurance","insurers"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["tpa_id","tpa_id_internal_id","insurance","tpas"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON insurance.policies FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON insurance.policies FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["insurer_id","insurer_id_internal_id","insurance","insurers"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["tpa_id","tpa_id_internal_id","insurance","tpas"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
