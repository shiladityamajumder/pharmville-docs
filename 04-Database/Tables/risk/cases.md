# `risk.cases`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds cases records within the risk domain (risk rules, cases and signals). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | risk.cases |
| Classification | Transactional |
| Proposed business write owner | Future risk owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 18 columns; 10 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `assessment_id` | `uuid` | Yes | — | Reference linking this record to assessments | Ensures related business data can be joined and validated | FK → `risk.assessments` via `fk_risk_cases_assessment_id_assessments` |
| `assessment_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `risk.assessments` via `fk_risk_cases_assessment_id_assessments_numeric` |
| `assigned_to_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_risk_cases_assigned_to_user_id_users` |
| `case_number` | `character varying(64)` | No | — | Inferred: stores case number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_risk_cases_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `priority` | `character varying(16)` | No | `'normal'::character varying` | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `resolution` | `character varying(64)` | Yes | — | Inferred: stores resolution for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `resolution_notes` | `text` | Yes | — | Inferred: stores resolution notes for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `resolved_at` | `timestamp with time zone` | Yes | — | Time of resolved | Support chronology, deadlines or audit evidence | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'open'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `subject_id` | `uuid` | No | — | Identifier associated with subject | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `subject_type` | `character varying(64)` | No | — | Inferred: stores subject type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_risk_cases_updated_by_users` |

## Record lifecycle and users

- **Created:** when the cases business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `risk.cases` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_risk_cases_assessment_id_assessments | `assessment_id` | [`risk.assessments`](../../Tables/risk/assessments.md) | `FOREIGN KEY (assessment_id) REFERENCES risk.assessments(id) ON DELETE SET NULL` |
| fk_risk_cases_assessment_id_assessments_numeric | `assessment_id_internal_id` | [`risk.assessments`](../../Tables/risk/assessments.md) | `FOREIGN KEY (assessment_id_internal_id) REFERENCES risk.assessments(internal_id) ON DELETE SET NULL` |
| fk_risk_cases_assigned_to_user_id_users | `assigned_to_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (assigned_to_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_risk_cases_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_risk_cases_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`risk.blocklists`](../../Tables/risk/blocklists.md) | fk_risk_blocklists_source_case_id_cases | `source_case_id` | `id` |
| [`risk.blocklists`](../../Tables/risk/blocklists.md) | fk_risk_blocklists_source_case_id_cases_numeric | `source_case_id_internal_id` | `internal_id` |

## `risk.cases` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `assessment_id` | `risk.assessments` | `fk_risk_cases_assessment_id_assessments` |
| `assessment_id_internal_id` | `risk.assessments` | `fk_risk_cases_assessment_id_assessments_numeric` |
| `assigned_to_user_id` | `identity.users` | `fk_risk_cases_assigned_to_user_id_users` |
| `created_by` | `identity.users` | `fk_risk_cases_created_by_users` |
| `updated_by` | `identity.users` | `fk_risk_cases_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_risk_cases_numeric_pair_assessment_id` | CHECK | `CHECK ((assessment_id IS NULL) = (assessment_id_internal_id IS NULL))` |
| `ck_risk_cases_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_risk_cases_assessment_id_assessments` | FOREIGN KEY | `FOREIGN KEY (assessment_id) REFERENCES risk.assessments(id) ON DELETE SET NULL` |
| `fk_risk_cases_assessment_id_assessments_numeric` | FOREIGN KEY | `FOREIGN KEY (assessment_id_internal_id) REFERENCES risk.assessments(internal_id) ON DELETE SET NULL` |
| `fk_risk_cases_assigned_to_user_id_users` | FOREIGN KEY | `FOREIGN KEY (assigned_to_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_risk_cases_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_risk_cases_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_risk_cases` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `risk_case_number` | UNIQUE | `UNIQUE (case_number)` |
| `uq_risk_cases_id` | UNIQUE | `UNIQUE (id)` |
| `cases_case_number_not_null` | NOT NULL | `NOT NULL case_number` |
| `cases_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `cases_id_not_null` | NOT NULL | `NOT NULL id` |
| `cases_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `cases_priority_not_null` | NOT NULL | `NOT NULL priority` |
| `cases_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `cases_status_not_null` | NOT NULL | `NOT NULL status` |
| `cases_subject_id_not_null` | NOT NULL | `NOT NULL subject_id` |
| `cases_subject_type_not_null` | NOT NULL | `NOT NULL subject_type` |
| `cases_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_risk_cases_status_priority` | btree | `(status, priority)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_risk_cases_status_priority ON risk.cases USING btree (status, priority)` |
| `ix_risk_cases_subject` | btree | `(subject_type, subject_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_risk_cases_subject ON risk.cases USING btree (subject_type, subject_id)` |
| `pk_risk_cases` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_risk_cases ON risk.cases USING btree (internal_id)` |
| `risk_case_number` | btree | `(case_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX risk_case_number ON risk.cases USING btree (case_number)` |
| `uq_risk_cases_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_risk_cases_id ON risk.cases USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON risk.cases FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["assessment_id","assessment_id_internal_id","risk","assessments"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON risk.cases FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON risk.cases FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["assessment_id","assessment_id_internal_id","risk","assessments"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
