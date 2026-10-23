# insurance.claim_status_history

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds claim status history records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 9 columns, 5 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `claim_id` | `uuid` | No | — | Reference linking this record to claims | Ensures related business data can be joined and validated | FK → `insurance.claims` (fk_insurance_claim_status_history_claim_id_claims) |
| `claim_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `insurance.claims` (fk_insurance_claim_status_history_claim_id_claims_numeric); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `from_status` | `character varying(32)` | Yes | — | Inferred: stores from status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `notes` | `text` | Yes | — | Inferred: stores notes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `reason_code` | `character varying(64)` | Yes | — | Code for reason | Link to controlled business classification or an external reference | See exact constraints |
| `to_status` | `character varying(32)` | No | — | Inferred: stores to status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the claim status history business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `insurance.claim_status_history` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `claim_id` → `insurance.claims(id)` via `fk_insurance_claim_status_history_claim_id_claims`; FOREIGN KEY (claim_id) REFERENCES insurance.claims(id) ON DELETE CASCADE
- `claim_id_internal_id` → `insurance.claims(internal_id)` via `fk_insurance_claim_status_history_claim_id_claims_numeric`; FOREIGN KEY (claim_id_internal_id) REFERENCES insurance.claims(internal_id) ON DELETE CASCADE

## insurance.claim_status_history — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 9 columns, 5 constraints, 3 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `claim_id` | `insurance.claims` | `fk_insurance_claim_status_history_claim_id_claims` |
| `claim_id_internal_id` | `insurance.claims` | `fk_insurance_claim_status_history_claim_id_claims_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_insurance_claim_status_history_numeric_pair_claim_id` | CHECK | `CHECK ((claim_id IS NULL) = (claim_id_internal_id IS NULL))` |
| `fk_insurance_claim_status_history_claim_id_claims` | FOREIGN KEY | `FOREIGN KEY (claim_id) REFERENCES insurance.claims(id) ON DELETE CASCADE` |
| `fk_insurance_claim_status_history_claim_id_claims_numeric` | FOREIGN KEY | `FOREIGN KEY (claim_id_internal_id) REFERENCES insurance.claims(internal_id) ON DELETE CASCADE` |
| `pk_insurance_claim_status_history` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_insurance_claim_status_history_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_insurance_claim_status_history_claim_time` | `CREATE INDEX ix_insurance_claim_status_history_claim_time ON insurance.claim_status_history USING btree (claim_id, created_at)` |
| `pk_insurance_claim_status_history` | `CREATE UNIQUE INDEX pk_insurance_claim_status_history ON insurance.claim_status_history USING btree (internal_id)` |
| `uq_insurance_claim_status_history_id` | `CREATE UNIQUE INDEX uq_insurance_claim_status_history_id ON insurance.claim_status_history USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON insurance.claim_status_history FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["claim_id","claim_id_internal_id","insurance","claims"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON insurance.claim_status_history FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON insurance.claim_status_history FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["claim_id","claim_id_internal_id","insurance","claims"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
