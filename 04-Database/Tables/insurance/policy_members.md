# `insurance.policy_members`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds policy members records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | insurance.policy_members |
| Classification | Mapping / Junction |
| Proposed business write owner | Future insurance owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `coverage_metadata` | `jsonb` | No | `'{}'::jsonb` | Structured coverage metadata information | Retain a versioned payload or relevant details | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_insurance_policy_members_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `member_id_hash` | `character varying(128)` | Yes | — | Inferred: stores member id hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` via `fk_insurance_policy_members_patient_profile_id_patient_profiles` |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` via `fk_insurance_policy_members_patient_profile_id_patient__bcd9` |
| `policy_id` | `uuid` | No | — | Reference linking this record to policies | Ensures related business data can be joined and validated | FK → `insurance.policies` via `fk_insurance_policy_members_policy_id_policies` |
| `policy_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `insurance.policies` via `fk_insurance_policy_members_policy_id_policies_numeric` |
| `relationship` | `character varying(64)` | Yes | — | Inferred: stores relationship for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_insurance_policy_members_updated_by_users` |

## Record lifecycle and users

- **Created:** when the policy members business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `insurance.policy_members` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_insurance_policy_members_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_insurance_policy_members_patient_profile_id_patient__bcd9 | `patient_profile_id_internal_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| fk_insurance_policy_members_patient_profile_id_patient_profiles | `patient_profile_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| fk_insurance_policy_members_policy_id_policies | `policy_id` | [`insurance.policies`](../../Tables/insurance/policies.md) | `FOREIGN KEY (policy_id) REFERENCES insurance.policies(id) ON DELETE CASCADE` |
| fk_insurance_policy_members_policy_id_policies_numeric | `policy_id_internal_id` | [`insurance.policies`](../../Tables/insurance/policies.md) | `FOREIGN KEY (policy_id_internal_id) REFERENCES insurance.policies(internal_id) ON DELETE CASCADE` |
| fk_insurance_policy_members_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `insurance.policy_members` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_insurance_policy_members_created_by_users` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_insurance_policy_members_patient_profile_id_patient__bcd9` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_insurance_policy_members_patient_profile_id_patient_profiles` |
| `policy_id` | `insurance.policies` | `fk_insurance_policy_members_policy_id_policies` |
| `policy_id_internal_id` | `insurance.policies` | `fk_insurance_policy_members_policy_id_policies_numeric` |
| `updated_by` | `identity.users` | `fk_insurance_policy_members_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_insurance_policy_members_numeric_pair_patient_profile_id` | CHECK | `CHECK ((patient_profile_id IS NULL) = (patient_profile_id_internal_id IS NULL))` |
| `ck_insurance_policy_members_numeric_pair_policy_id` | CHECK | `CHECK ((policy_id IS NULL) = (policy_id_internal_id IS NULL))` |
| `ck_insurance_policy_members_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_insurance_policy_members_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_insurance_policy_members_patient_profile_id_patient__bcd9` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| `fk_insurance_policy_members_patient_profile_id_patient_profiles` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| `fk_insurance_policy_members_policy_id_policies` | FOREIGN KEY | `FOREIGN KEY (policy_id) REFERENCES insurance.policies(id) ON DELETE CASCADE` |
| `fk_insurance_policy_members_policy_id_policies_numeric` | FOREIGN KEY | `FOREIGN KEY (policy_id_internal_id) REFERENCES insurance.policies(internal_id) ON DELETE CASCADE` |
| `fk_insurance_policy_members_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_insurance_policy_members` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `policy_patient` | UNIQUE | `UNIQUE (policy_id, patient_profile_id)` |
| `uq_insurance_policy_members_id` | UNIQUE | `UNIQUE (id)` |
| `policy_members_coverage_metadata_not_null` | NOT NULL | `NOT NULL coverage_metadata` |
| `policy_members_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `policy_members_id_not_null` | NOT NULL | `NOT NULL id` |
| `policy_members_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `policy_members_patient_profile_id_internal_id_not_null` | NOT NULL | `NOT NULL patient_profile_id_internal_id` |
| `policy_members_patient_profile_id_not_null` | NOT NULL | `NOT NULL patient_profile_id` |
| `policy_members_policy_id_internal_id_not_null` | NOT NULL | `NOT NULL policy_id_internal_id` |
| `policy_members_policy_id_not_null` | NOT NULL | `NOT NULL policy_id` |
| `policy_members_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `policy_members_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_insurance_policy_members_patient` | btree | `(patient_profile_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_insurance_policy_members_patient ON insurance.policy_members USING btree (patient_profile_id)` |
| `pk_insurance_policy_members` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_insurance_policy_members ON insurance.policy_members USING btree (internal_id)` |
| `policy_patient` | btree | `(policy_id, patient_profile_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX policy_patient ON insurance.policy_members USING btree (policy_id, patient_profile_id)` |
| `uq_insurance_policy_members_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_insurance_policy_members_id ON insurance.policy_members USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON insurance.policy_members FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["policy_id","policy_id_internal_id","insurance","policies"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON insurance.policy_members FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON insurance.policy_members FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["policy_id","policy_id_internal_id","insurance","policies"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
