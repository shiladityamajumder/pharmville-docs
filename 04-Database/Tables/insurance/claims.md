# `insurance.claims`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds claims records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | insurance.claims |
| Classification | Transactional |
| Proposed business write owner | Future insurance owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 16 PK/FK/UQ/CHECK/exclusion constraints; 15 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approved_amount` | `numeric(18,2)` | Yes | — | Value of approved amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `claim_number` | `character varying(64)` | No | — | Inferred: stores claim number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `claimed_amount` | `numeric(18,2)` | No | — | Value of claimed amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_insurance_claims_created_by_users` |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` via `fk_insurance_claims_patient_profile_id_patient_profiles` |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` via `fk_insurance_claims_patient_profile_id_patient_profiles_numeric` |
| `policy_id` | `uuid` | No | — | Reference linking this record to policies | Ensures related business data can be joined and validated | FK → `insurance.policies` via `fk_insurance_claims_policy_id_policies` |
| `policy_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `insurance.policies` via `fk_insurance_claims_policy_id_policies_numeric` |
| `provider_claim_reference` | `character varying(255)` | Yes | — | Inferred: stores provider claim reference for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `reference_id` | `uuid` | No | — | Identifier associated with reference | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `reference_type` | `character varying(32)` | No | — | Inferred: stores reference type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `resolved_at` | `timestamp with time zone` | Yes | — | Time of resolved | Support chronology, deadlines or audit evidence | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(18)` | No | `'draft'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `submitted_at` | `timestamp with time zone` | Yes | — | Time of submitted | Support chronology, deadlines or audit evidence | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_insurance_claims_updated_by_users` |

## Record lifecycle and users

- **Created:** when the claims business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `insurance.claims` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_insurance_claims_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_insurance_claims_patient_profile_id_patient_profiles | `patient_profile_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| fk_insurance_claims_patient_profile_id_patient_profiles_numeric | `patient_profile_id_internal_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| fk_insurance_claims_policy_id_policies | `policy_id` | [`insurance.policies`](../../Tables/insurance/policies.md) | `FOREIGN KEY (policy_id) REFERENCES insurance.policies(id) ON DELETE RESTRICT` |
| fk_insurance_claims_policy_id_policies_numeric | `policy_id_internal_id` | [`insurance.policies`](../../Tables/insurance/policies.md) | `FOREIGN KEY (policy_id_internal_id) REFERENCES insurance.policies(internal_id) ON DELETE RESTRICT` |
| fk_insurance_claims_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`insurance.claim_documents`](../../Tables/insurance/claim_documents.md) | fk_insurance_claim_documents_claim_id_claims | `claim_id` | `id` |
| [`insurance.claim_documents`](../../Tables/insurance/claim_documents.md) | fk_insurance_claim_documents_claim_id_claims_numeric | `claim_id_internal_id` | `internal_id` |
| [`insurance.claim_status_history`](../../Tables/insurance/claim_status_history.md) | fk_insurance_claim_status_history_claim_id_claims | `claim_id` | `id` |
| [`insurance.claim_status_history`](../../Tables/insurance/claim_status_history.md) | fk_insurance_claim_status_history_claim_id_claims_numeric | `claim_id_internal_id` | `internal_id` |

## `insurance.claims` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_insurance_claims_created_by_users` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_insurance_claims_patient_profile_id_patient_profiles` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_insurance_claims_patient_profile_id_patient_profiles_numeric` |
| `policy_id` | `insurance.policies` | `fk_insurance_claims_policy_id_policies` |
| `policy_id_internal_id` | `insurance.policies` | `fk_insurance_claims_policy_id_policies_numeric` |
| `updated_by` | `identity.users` | `fk_insurance_claims_updated_by_users` |

### Existing constraints

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
| `claims_claim_number_not_null` | NOT NULL | `NOT NULL claim_number` |
| `claims_claimed_amount_not_null` | NOT NULL | `NOT NULL claimed_amount` |
| `claims_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `claims_currency_not_null` | NOT NULL | `NOT NULL currency` |
| `claims_id_not_null` | NOT NULL | `NOT NULL id` |
| `claims_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `claims_patient_profile_id_internal_id_not_null` | NOT NULL | `NOT NULL patient_profile_id_internal_id` |
| `claims_patient_profile_id_not_null` | NOT NULL | `NOT NULL patient_profile_id` |
| `claims_policy_id_internal_id_not_null` | NOT NULL | `NOT NULL policy_id_internal_id` |
| `claims_policy_id_not_null` | NOT NULL | `NOT NULL policy_id` |
| `claims_reference_id_not_null` | NOT NULL | `NOT NULL reference_id` |
| `claims_reference_type_not_null` | NOT NULL | `NOT NULL reference_type` |
| `claims_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `claims_status_not_null` | NOT NULL | `NOT NULL status` |
| `claims_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `claim_number` | btree | `(claim_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX claim_number ON insurance.claims USING btree (claim_number)` |
| `ix_insurance_claims_policy` | btree | `(policy_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_insurance_claims_policy ON insurance.claims USING btree (policy_id)` |
| `ix_insurance_claims_reference` | btree | `(reference_type, reference_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_insurance_claims_reference ON insurance.claims USING btree (reference_type, reference_id)` |
| `ix_insurance_claims_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_insurance_claims_status ON insurance.claims USING btree (status)` |
| `pk_insurance_claims` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_insurance_claims ON insurance.claims USING btree (internal_id)` |
| `uq_insurance_claims_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_insurance_claims_id ON insurance.claims USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON insurance.claims FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["policy_id","policy_id_internal_id","insurance","policies"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON insurance.claims FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON insurance.claims FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["policy_id","policy_id_internal_id","insurance","policies"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
