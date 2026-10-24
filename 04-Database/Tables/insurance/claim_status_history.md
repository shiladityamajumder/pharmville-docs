# `insurance.claim_status_history`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds claim status history records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | insurance.claim_status_history |
| Classification | Audit / History |
| Proposed business write owner | Future insurance owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 9 columns; 5 PK/FK/UQ/CHECK/exclusion constraints; 6 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `claim_id` | `uuid` | No | — | Reference linking this record to claims | Ensures related business data can be joined and validated | FK → `insurance.claims` via `fk_insurance_claim_status_history_claim_id_claims` |
| `claim_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `insurance.claims` via `fk_insurance_claim_status_history_claim_id_claims_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `from_status` | `character varying(32)` | Yes | — | Inferred: stores from status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `notes` | `text` | Yes | — | Inferred: stores notes for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `reason_code` | `character varying(64)` | Yes | — | Code for reason | Link to controlled business classification or an external reference | Collation: default |
| `to_status` | `character varying(32)` | No | — | Inferred: stores to status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the claim status history business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `insurance.claim_status_history` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_insurance_claim_status_history_claim_id_claims | `claim_id` | [`insurance.claims`](../../Tables/insurance/claims.md) | `FOREIGN KEY (claim_id) REFERENCES insurance.claims(id) ON DELETE CASCADE` |
| fk_insurance_claim_status_history_claim_id_claims_numeric | `claim_id_internal_id` | [`insurance.claims`](../../Tables/insurance/claims.md) | `FOREIGN KEY (claim_id_internal_id) REFERENCES insurance.claims(internal_id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `insurance.claim_status_history` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `claim_id` | `insurance.claims` | `fk_insurance_claim_status_history_claim_id_claims` |
| `claim_id_internal_id` | `insurance.claims` | `fk_insurance_claim_status_history_claim_id_claims_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_insurance_claim_status_history_numeric_pair_claim_id` | CHECK | `CHECK ((claim_id IS NULL) = (claim_id_internal_id IS NULL))` |
| `fk_insurance_claim_status_history_claim_id_claims` | FOREIGN KEY | `FOREIGN KEY (claim_id) REFERENCES insurance.claims(id) ON DELETE CASCADE` |
| `fk_insurance_claim_status_history_claim_id_claims_numeric` | FOREIGN KEY | `FOREIGN KEY (claim_id_internal_id) REFERENCES insurance.claims(internal_id) ON DELETE CASCADE` |
| `pk_insurance_claim_status_history` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_insurance_claim_status_history_id` | UNIQUE | `UNIQUE (id)` |
| `claim_status_history_claim_id_internal_id_not_null` | NOT NULL | `NOT NULL claim_id_internal_id` |
| `claim_status_history_claim_id_not_null` | NOT NULL | `NOT NULL claim_id` |
| `claim_status_history_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `claim_status_history_id_not_null` | NOT NULL | `NOT NULL id` |
| `claim_status_history_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `claim_status_history_to_status_not_null` | NOT NULL | `NOT NULL to_status` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_insurance_claim_status_history_claim_time` | btree | `(claim_id, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_insurance_claim_status_history_claim_time ON insurance.claim_status_history USING btree (claim_id, created_at)` |
| `pk_insurance_claim_status_history` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_insurance_claim_status_history ON insurance.claim_status_history USING btree (internal_id)` |
| `uq_insurance_claim_status_history_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_insurance_claim_status_history_id ON insurance.claim_status_history USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON insurance.claim_status_history FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["claim_id","claim_id_internal_id","insurance","claims"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON insurance.claim_status_history FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON insurance.claim_status_history FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["claim_id","claim_id_internal_id","insurance","claims"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
