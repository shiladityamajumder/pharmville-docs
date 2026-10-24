# `risk.signals`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds signals records within the risk domain (risk rules, cases and signals). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | risk.signals |
| Classification | Transactional |
| Proposed business write owner | Future risk owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 10 columns; 5 PK/FK/UQ/CHECK/exclusion constraints; 8 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `assessment_id` | `uuid` | Yes | — | Reference linking this record to assessments | Ensures related business data can be joined and validated | FK → `risk.assessments` via `fk_risk_signals_assessment_id_assessments` |
| `assessment_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `risk.assessments` via `fk_risk_signals_assessment_id_assessments_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `signal_code` | `character varying(128)` | No | — | Code for signal | Link to controlled business classification or an external reference | Collation: default |
| `signal_value` | `jsonb` | No | — | Structured signal value information | Retain a versioned payload or relevant details | Exact constraints below |
| `source` | `character varying(64)` | No | — | Inferred: stores source for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `subject_id` | `uuid` | No | — | Identifier associated with subject | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `subject_type` | `character varying(64)` | No | — | Inferred: stores subject type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the signals business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `risk.signals` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_risk_signals_assessment_id_assessments | `assessment_id` | [`risk.assessments`](../../Tables/risk/assessments.md) | `FOREIGN KEY (assessment_id) REFERENCES risk.assessments(id) ON DELETE CASCADE` |
| fk_risk_signals_assessment_id_assessments_numeric | `assessment_id_internal_id` | [`risk.assessments`](../../Tables/risk/assessments.md) | `FOREIGN KEY (assessment_id_internal_id) REFERENCES risk.assessments(internal_id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `risk.signals` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `assessment_id` | `risk.assessments` | `fk_risk_signals_assessment_id_assessments` |
| `assessment_id_internal_id` | `risk.assessments` | `fk_risk_signals_assessment_id_assessments_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_risk_signals_numeric_pair_assessment_id` | CHECK | `CHECK ((assessment_id IS NULL) = (assessment_id_internal_id IS NULL))` |
| `fk_risk_signals_assessment_id_assessments` | FOREIGN KEY | `FOREIGN KEY (assessment_id) REFERENCES risk.assessments(id) ON DELETE CASCADE` |
| `fk_risk_signals_assessment_id_assessments_numeric` | FOREIGN KEY | `FOREIGN KEY (assessment_id_internal_id) REFERENCES risk.assessments(internal_id) ON DELETE CASCADE` |
| `pk_risk_signals` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_risk_signals_id` | UNIQUE | `UNIQUE (id)` |
| `signals_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `signals_id_not_null` | NOT NULL | `NOT NULL id` |
| `signals_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `signals_signal_code_not_null` | NOT NULL | `NOT NULL signal_code` |
| `signals_signal_value_not_null` | NOT NULL | `NOT NULL signal_value` |
| `signals_source_not_null` | NOT NULL | `NOT NULL source` |
| `signals_subject_id_not_null` | NOT NULL | `NOT NULL subject_id` |
| `signals_subject_type_not_null` | NOT NULL | `NOT NULL subject_type` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_risk_signals_code_time` | btree | `(signal_code, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_risk_signals_code_time ON risk.signals USING btree (signal_code, created_at)` |
| `ix_risk_signals_subject` | btree | `(subject_type, subject_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_risk_signals_subject ON risk.signals USING btree (subject_type, subject_id)` |
| `pk_risk_signals` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_risk_signals ON risk.signals USING btree (internal_id)` |
| `uq_risk_signals_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_risk_signals_id ON risk.signals USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON risk.signals FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["assessment_id","assessment_id_internal_id","risk","assessments"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON risk.signals FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON risk.signals FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["assessment_id","assessment_id_internal_id","risk","assessments"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
