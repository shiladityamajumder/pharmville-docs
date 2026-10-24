# `insurance.policy_members`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds policy members records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 12 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `coverage_metadata` | `jsonb` | No | `'{}'::jsonb` | Structured coverage metadata information | Retain a versioned payload or relevant details | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_insurance_policy_members_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `member_id_hash` | `character varying(128)` | Yes | — | Inferred: stores member id hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` (fk_insurance_policy_members_patient_profile_id_patient_profiles) |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` (fk_insurance_policy_members_patient_profile_id_patient__bcd9); Numeric/public-key pair verification required |
| `policy_id` | `uuid` | No | — | Reference linking this record to policies | Ensures related business data can be joined and validated | FK → `insurance.policies` (fk_insurance_policy_members_policy_id_policies) |
| `policy_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `insurance.policies` (fk_insurance_policy_members_policy_id_policies_numeric); Numeric/public-key pair verification required |
| `relationship` | `character varying(64)` | Yes | — | Inferred: stores relationship for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_insurance_policy_members_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the policy members business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `insurance.policy_members` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_insurance_policy_members_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_insurance_policy_members_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `patient_profile_id` → `clinical.patient_profiles(id)` via `fk_insurance_policy_members_patient_profile_id_patient_profiles`; `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT`
- `policy_id` → `insurance.policies(id)` via `fk_insurance_policy_members_policy_id_policies`; `FOREIGN KEY (policy_id) REFERENCES insurance.policies(id) ON DELETE CASCADE`
- `patient_profile_id_internal_id` → `clinical.patient_profiles(internal_id)` via `fk_insurance_policy_members_patient_profile_id_patient__bcd9`; `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT`
- `policy_id_internal_id` → `insurance.policies(internal_id)` via `fk_insurance_policy_members_policy_id_policies_numeric`; `FOREIGN KEY (policy_id_internal_id) REFERENCES insurance.policies(internal_id) ON DELETE CASCADE`

## `insurance.policy_members` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 14 columns, 12 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_insurance_policy_members_created_by_users` |
| `updated_by` | `identity.users` | `fk_insurance_policy_members_updated_by_users` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_insurance_policy_members_patient_profile_id_patient_profiles` |
| `policy_id` | `insurance.policies` | `fk_insurance_policy_members_policy_id_policies` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_insurance_policy_members_patient_profile_id_patient__bcd9` |
| `policy_id_internal_id` | `insurance.policies` | `fk_insurance_policy_members_policy_id_policies_numeric` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_insurance_policy_members_patient` | `CREATE INDEX ix_insurance_policy_members_patient ON insurance.policy_members USING btree (patient_profile_id)` |
| `pk_insurance_policy_members` | `CREATE UNIQUE INDEX pk_insurance_policy_members ON insurance.policy_members USING btree (internal_id)` |
| `policy_patient` | `CREATE UNIQUE INDEX policy_patient ON insurance.policy_members USING btree (policy_id, patient_profile_id)` |
| `uq_insurance_policy_members_id` | `CREATE UNIQUE INDEX uq_insurance_policy_members_id ON insurance.policy_members USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON insurance.policy_members FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["policy_id","policy_id_internal_id","insurance","policies"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON insurance.policy_members FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON insurance.policy_members FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["policy_id","policy_id_internal_id","insurance","policies"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
