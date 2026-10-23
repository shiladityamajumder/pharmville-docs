# insurance.claims

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds claims records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 16 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approved_amount` | `numeric(18,2)` | Yes | — | Value of approved amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `claim_number` | `character varying(64)` | No | — | Inferred: stores claim number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `claimed_amount` | `numeric(18,2)` | No | — | Value of claimed amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_insurance_claims_created_by_users) |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` (fk_insurance_claims_patient_profile_id_patient_profiles) |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` (fk_insurance_claims_patient_profile_id_patient_profiles_numeric); Numeric/public-key pair verification required |
| `policy_id` | `uuid` | No | — | Reference linking this record to policies | Ensures related business data can be joined and validated | FK → `insurance.policies` (fk_insurance_claims_policy_id_policies) |
| `policy_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `insurance.policies` (fk_insurance_claims_policy_id_policies_numeric); Numeric/public-key pair verification required |
| `provider_claim_reference` | `character varying(255)` | Yes | — | Inferred: stores provider claim reference for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `reference_id` | `uuid` | No | — | Identifier associated with reference | Link the event or entity to its subject; verify constraints | See exact constraints |
| `reference_type` | `character varying(32)` | No | — | Inferred: stores reference type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `resolved_at` | `timestamp with time zone` | Yes | — | Time of resolved | Support chronology, deadlines or audit evidence | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(18)` | No | `'draft'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `submitted_at` | `timestamp with time zone` | Yes | — | Time of submitted | Support chronology, deadlines or audit evidence | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_insurance_claims_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the claims business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `insurance.claims` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_insurance_claims_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_insurance_claims_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `policy_id` → `insurance.policies(id)` via `fk_insurance_claims_policy_id_policies`; FOREIGN KEY (policy_id) REFERENCES insurance.policies(id) ON DELETE RESTRICT
- `patient_profile_id` → `clinical.patient_profiles(id)` via `fk_insurance_claims_patient_profile_id_patient_profiles`; FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT
- `patient_profile_id_internal_id` → `clinical.patient_profiles(internal_id)` via `fk_insurance_claims_patient_profile_id_patient_profiles_numeric`; FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT
- `policy_id_internal_id` → `insurance.policies(internal_id)` via `fk_insurance_claims_policy_id_policies_numeric`; FOREIGN KEY (policy_id_internal_id) REFERENCES insurance.policies(internal_id) ON DELETE RESTRICT

**Referenced by 4 FK constraints** (sample): `insurance.claim_documents`, `insurance.claim_status_history`, `insurance.claim_documents`, `insurance.claim_status_history`.

## insurance.claims — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 21 columns, 16 constraints, 6 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_insurance_claims_created_by_users` |
| `updated_by` | `identity.users` | `fk_insurance_claims_updated_by_users` |
| `policy_id` | `insurance.policies` | `fk_insurance_claims_policy_id_policies` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_insurance_claims_patient_profile_id_patient_profiles` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_insurance_claims_patient_profile_id_patient_profiles_numeric` |
| `policy_id_internal_id` | `insurance.policies` | `fk_insurance_claims_policy_id_policies_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_insurance_claims_approved_amount_nonnegative` | CHECK | `CHECK (approved_amount IS NULL OR approved_amount >= 0::numeric)` |
| `ck_insurance_claims_claimed_amount_positive` | CHECK | `CHECK (claimed_amount > 0::numeric)` |
| `ck_insurance_claims_claimstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['draft'::text, 'submitted'::text, 'under_review'::text, 'approved'::text, 'partially_approved'::text, 'rejected'::text, 'paid'::text, 'cancelled'::text]))` |
| `ck_insurance_claims_finite_numeric_values` | CHECK | `CHECK ((claimed_amount IS NULL OR (claimed_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (approved_amount IS NULL OR (approved_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_insurance_claims_numeric_pair_patient_profile_id` | CHECK | `CHECK ((patient_profile_id IS NULL) = (patient_profile_id_internal_id IS NULL))` |
| `ck_insurance_claims_numeric_pair_policy_id` | CHECK | `CHECK ((policy_id IS NULL) = (policy_id_internal_id IS NULL))` |
| `ck_insurance_claims_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `claim_number` | UNIQUE | `UNIQUE (claim_number)` |
| `fk_insurance_claims_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_insurance_claims_patient_profile_id_patient_profiles` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| `fk_insurance_claims_patient_profile_id_patient_profiles_numeric` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| `fk_insurance_claims_policy_id_policies` | FOREIGN KEY | `FOREIGN KEY (policy_id) REFERENCES insurance.policies(id) ON DELETE RESTRICT` |
| `fk_insurance_claims_policy_id_policies_numeric` | FOREIGN KEY | `FOREIGN KEY (policy_id_internal_id) REFERENCES insurance.policies(internal_id) ON DELETE RESTRICT` |
| `fk_insurance_claims_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_insurance_claims` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_insurance_claims_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `claim_number` | `CREATE UNIQUE INDEX claim_number ON insurance.claims USING btree (claim_number)` |
| `ix_insurance_claims_policy` | `CREATE INDEX ix_insurance_claims_policy ON insurance.claims USING btree (policy_id)` |
| `ix_insurance_claims_reference` | `CREATE INDEX ix_insurance_claims_reference ON insurance.claims USING btree (reference_type, reference_id)` |
| `ix_insurance_claims_status` | `CREATE INDEX ix_insurance_claims_status ON insurance.claims USING btree (status)` |
| `pk_insurance_claims` | `CREATE UNIQUE INDEX pk_insurance_claims ON insurance.claims USING btree (internal_id)` |
| `uq_insurance_claims_id` | `CREATE UNIQUE INDEX uq_insurance_claims_id ON insurance.claims USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON insurance.claims FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["policy_id","policy_id_internal_id","insurance","policies"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON insurance.claims FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON insurance.claims FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["policy_id","policy_id_internal_id","insurance","policies"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
