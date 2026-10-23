# insurance.eligibility_checks

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds eligibility checks records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 10 columns, 5 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `eligible` | `boolean` | No | — | Inferred: stores eligible for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `policy_id` | `uuid` | No | — | Reference linking this record to policies | Ensures related business data can be joined and validated | FK → `insurance.policies` (fk_insurance_eligibility_checks_policy_id_policies) |
| `policy_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `insurance.policies` (fk_insurance_eligibility_checks_policy_id_policies_numeric); Numeric/public-key pair verification required |
| `provider_reference` | `character varying(255)` | Yes | — | Inferred: stores provider reference for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `reference_id` | `uuid` | No | — | Identifier associated with reference | Link the event or entity to its subject; verify constraints | See exact constraints |
| `reference_type` | `character varying(32)` | No | — | Inferred: stores reference type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `response_payload` | `jsonb` | No | — | Structured response payload information | Retain a versioned payload or relevant details | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the eligibility checks business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `insurance.eligibility_checks` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `policy_id` → `insurance.policies(id)` via `fk_insurance_eligibility_checks_policy_id_policies`; FOREIGN KEY (policy_id) REFERENCES insurance.policies(id) ON DELETE RESTRICT
- `policy_id_internal_id` → `insurance.policies(internal_id)` via `fk_insurance_eligibility_checks_policy_id_policies_numeric`; FOREIGN KEY (policy_id_internal_id) REFERENCES insurance.policies(internal_id) ON DELETE RESTRICT

## insurance.eligibility_checks — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 10 columns, 5 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `policy_id` | `insurance.policies` | `fk_insurance_eligibility_checks_policy_id_policies` |
| `policy_id_internal_id` | `insurance.policies` | `fk_insurance_eligibility_checks_policy_id_policies_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_insurance_eligibility_checks_numeric_pair_policy_id` | CHECK | `CHECK ((policy_id IS NULL) = (policy_id_internal_id IS NULL))` |
| `fk_insurance_eligibility_checks_policy_id_policies` | FOREIGN KEY | `FOREIGN KEY (policy_id) REFERENCES insurance.policies(id) ON DELETE RESTRICT` |
| `fk_insurance_eligibility_checks_policy_id_policies_numeric` | FOREIGN KEY | `FOREIGN KEY (policy_id_internal_id) REFERENCES insurance.policies(internal_id) ON DELETE RESTRICT` |
| `pk_insurance_eligibility_checks` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_insurance_eligibility_checks_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_insurance_eligibility_policy_time` | `CREATE INDEX ix_insurance_eligibility_policy_time ON insurance.eligibility_checks USING btree (policy_id, created_at)` |
| `ix_insurance_eligibility_reference` | `CREATE INDEX ix_insurance_eligibility_reference ON insurance.eligibility_checks USING btree (reference_type, reference_id)` |
| `pk_insurance_eligibility_checks` | `CREATE UNIQUE INDEX pk_insurance_eligibility_checks ON insurance.eligibility_checks USING btree (internal_id)` |
| `uq_insurance_eligibility_checks_id` | `CREATE UNIQUE INDEX uq_insurance_eligibility_checks_id ON insurance.eligibility_checks USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON insurance.eligibility_checks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["policy_id","policy_id_internal_id","insurance","policies"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON insurance.eligibility_checks FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON insurance.eligibility_checks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["policy_id","policy_id_internal_id","insurance","policies"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
