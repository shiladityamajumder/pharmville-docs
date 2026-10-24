# `insurance.eligibility_checks`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds eligibility checks records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | insurance.eligibility_checks |
| Classification | Transactional |
| Proposed business write owner | Future insurance owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 10 columns; 5 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `eligible` | `boolean` | No | — | Inferred: stores eligible for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `policy_id` | `uuid` | No | — | Reference linking this record to policies | Ensures related business data can be joined and validated | FK → `insurance.policies` via `fk_insurance_eligibility_checks_policy_id_policies` |
| `policy_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `insurance.policies` via `fk_insurance_eligibility_checks_policy_id_policies_numeric` |
| `provider_reference` | `character varying(255)` | Yes | — | Inferred: stores provider reference for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `reference_id` | `uuid` | No | — | Identifier associated with reference | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `reference_type` | `character varying(32)` | No | — | Inferred: stores reference type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `response_payload` | `jsonb` | No | — | Structured response payload information | Retain a versioned payload or relevant details | Exact constraints below |

## Record lifecycle and users

- **Created:** when the eligibility checks business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `insurance.eligibility_checks` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_insurance_eligibility_checks_policy_id_policies | `policy_id` | [`insurance.policies`](../../Tables/insurance/policies.md) | `FOREIGN KEY (policy_id) REFERENCES insurance.policies(id) ON DELETE RESTRICT` |
| fk_insurance_eligibility_checks_policy_id_policies_numeric | `policy_id_internal_id` | [`insurance.policies`](../../Tables/insurance/policies.md) | `FOREIGN KEY (policy_id_internal_id) REFERENCES insurance.policies(internal_id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `insurance.eligibility_checks` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `policy_id` | `insurance.policies` | `fk_insurance_eligibility_checks_policy_id_policies` |
| `policy_id_internal_id` | `insurance.policies` | `fk_insurance_eligibility_checks_policy_id_policies_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_insurance_eligibility_checks_numeric_pair_policy_id` | CHECK | `CHECK ((policy_id IS NULL) = (policy_id_internal_id IS NULL))` |
| `fk_insurance_eligibility_checks_policy_id_policies` | FOREIGN KEY | `FOREIGN KEY (policy_id) REFERENCES insurance.policies(id) ON DELETE RESTRICT` |
| `fk_insurance_eligibility_checks_policy_id_policies_numeric` | FOREIGN KEY | `FOREIGN KEY (policy_id_internal_id) REFERENCES insurance.policies(internal_id) ON DELETE RESTRICT` |
| `pk_insurance_eligibility_checks` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_insurance_eligibility_checks_id` | UNIQUE | `UNIQUE (id)` |
| `eligibility_checks_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `eligibility_checks_eligible_not_null` | NOT NULL | `NOT NULL eligible` |
| `eligibility_checks_id_not_null` | NOT NULL | `NOT NULL id` |
| `eligibility_checks_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `eligibility_checks_policy_id_internal_id_not_null` | NOT NULL | `NOT NULL policy_id_internal_id` |
| `eligibility_checks_policy_id_not_null` | NOT NULL | `NOT NULL policy_id` |
| `eligibility_checks_reference_id_not_null` | NOT NULL | `NOT NULL reference_id` |
| `eligibility_checks_reference_type_not_null` | NOT NULL | `NOT NULL reference_type` |
| `eligibility_checks_response_payload_not_null` | NOT NULL | `NOT NULL response_payload` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_insurance_eligibility_policy_time` | btree | `(policy_id, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_insurance_eligibility_policy_time ON insurance.eligibility_checks USING btree (policy_id, created_at)` |
| `ix_insurance_eligibility_reference` | btree | `(reference_type, reference_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_insurance_eligibility_reference ON insurance.eligibility_checks USING btree (reference_type, reference_id)` |
| `pk_insurance_eligibility_checks` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_insurance_eligibility_checks ON insurance.eligibility_checks USING btree (internal_id)` |
| `uq_insurance_eligibility_checks_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_insurance_eligibility_checks_id ON insurance.eligibility_checks USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON insurance.eligibility_checks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["policy_id","policy_id_internal_id","insurance","policies"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON insurance.eligibility_checks FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON insurance.eligibility_checks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["policy_id","policy_id_internal_id","insurance","policies"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
