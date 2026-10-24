# `risk.assessments`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds assessments records within the risk domain (risk rules, cases and signals). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | risk.assessments |
| Classification | Derived / Operational |
| Proposed business write owner | Future risk owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 11 columns; 6 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `decision` | `character varying(16)` | No | — | Inferred: stores decision for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `model_version` | `character varying(64)` | No | — | Inferred: stores model version for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `reasons` | `jsonb` | No | — | Structured reasons information | Retain a versioned payload or relevant details | Exact constraints below |
| `request_id` | `uuid` | Yes | — | Identifier associated with request | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `score` | `numeric(10,4)` | No | — | Inferred: stores score for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `subject_id` | `uuid` | No | — | Identifier associated with subject | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `subject_type` | `character varying(64)` | No | — | Inferred: stores subject type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_risk_assessments_user_id_users` |

## Record lifecycle and users

- **Created:** when the assessments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `risk.assessments` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_risk_assessments_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`risk.cases`](../../Tables/risk/cases.md) | fk_risk_cases_assessment_id_assessments | `assessment_id` | `id` |
| [`risk.cases`](../../Tables/risk/cases.md) | fk_risk_cases_assessment_id_assessments_numeric | `assessment_id_internal_id` | `internal_id` |
| [`risk.signals`](../../Tables/risk/signals.md) | fk_risk_signals_assessment_id_assessments | `assessment_id` | `id` |
| [`risk.signals`](../../Tables/risk/signals.md) | fk_risk_signals_assessment_id_assessments_numeric | `assessment_id_internal_id` | `internal_id` |

## `risk.assessments` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_risk_assessments_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_risk_assessments_finite_numeric_values` | CHECK | `CHECK (score IS NULL OR (score <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_risk_assessments_riskdecision` | CHECK | `CHECK (decision::text = ANY (ARRAY['allow'::text, 'review'::text, 'block'::text]))` |
| `ck_risk_assessments_score_nonnegative` | CHECK | `CHECK (score >= 0::numeric)` |
| `fk_risk_assessments_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `pk_risk_assessments` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_risk_assessments_id` | UNIQUE | `UNIQUE (id)` |
| `assessments_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `assessments_decision_not_null` | NOT NULL | `NOT NULL decision` |
| `assessments_id_not_null` | NOT NULL | `NOT NULL id` |
| `assessments_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `assessments_model_version_not_null` | NOT NULL | `NOT NULL model_version` |
| `assessments_reasons_not_null` | NOT NULL | `NOT NULL reasons` |
| `assessments_score_not_null` | NOT NULL | `NOT NULL score` |
| `assessments_subject_id_not_null` | NOT NULL | `NOT NULL subject_id` |
| `assessments_subject_type_not_null` | NOT NULL | `NOT NULL subject_type` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_risk_assessments_decision_time` | btree | `(decision, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_risk_assessments_decision_time ON risk.assessments USING btree (decision, created_at)` |
| `ix_risk_assessments_subject` | btree | `(subject_type, subject_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_risk_assessments_subject ON risk.assessments USING btree (subject_type, subject_id)` |
| `pk_risk_assessments` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_risk_assessments ON risk.assessments USING btree (internal_id)` |
| `uq_risk_assessments_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_risk_assessments_id ON risk.assessments USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON risk.assessments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON risk.assessments FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON risk.assessments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
