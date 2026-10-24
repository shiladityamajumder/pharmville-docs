# `risk.cases`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds cases records within the risk domain (risk rules, cases and signals). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 18 columns, 10 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `assessment_id` | `uuid` | Yes | — | Reference linking this record to assessments | Ensures related business data can be joined and validated | FK → `risk.assessments` (fk_risk_cases_assessment_id_assessments) |
| `assessment_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `risk.assessments` (fk_risk_cases_assessment_id_assessments_numeric); Numeric/public-key pair verification required |
| `assigned_to_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_risk_cases_assigned_to_user_id_users) |
| `case_number` | `character varying(64)` | No | — | Inferred: stores case number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_risk_cases_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `priority` | `character varying(16)` | No | `'normal'::character varying` | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `resolution` | `character varying(64)` | Yes | — | Inferred: stores resolution for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `resolution_notes` | `text` | Yes | — | Inferred: stores resolution notes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `resolved_at` | `timestamp with time zone` | Yes | — | Time of resolved | Support chronology, deadlines or audit evidence | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'open'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `subject_id` | `uuid` | No | — | Identifier associated with subject | Link the event or entity to its subject; verify constraints | See exact constraints |
| `subject_type` | `character varying(64)` | No | — | Inferred: stores subject type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_risk_cases_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the cases business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `risk.cases` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_risk_cases_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_risk_cases_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `assigned_to_user_id` → `identity.users(id)` via `fk_risk_cases_assigned_to_user_id_users`; `FOREIGN KEY (assigned_to_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `assessment_id` → `risk.assessments(id)` via `fk_risk_cases_assessment_id_assessments`; `FOREIGN KEY (assessment_id) REFERENCES risk.assessments(id) ON DELETE SET NULL`
- `assessment_id_internal_id` → `risk.assessments(internal_id)` via `fk_risk_cases_assessment_id_assessments_numeric`; `FOREIGN KEY (assessment_id_internal_id) REFERENCES risk.assessments(internal_id) ON DELETE SET NULL`

**Referenced by 2 FK constraints** (sample): `risk.blocklists`, `risk.blocklists`.

## `risk.cases` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 18 columns, 10 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_risk_cases_created_by_users` |
| `updated_by` | `identity.users` | `fk_risk_cases_updated_by_users` |
| `assigned_to_user_id` | `identity.users` | `fk_risk_cases_assigned_to_user_id_users` |
| `assessment_id` | `risk.assessments` | `fk_risk_cases_assessment_id_assessments` |
| `assessment_id_internal_id` | `risk.assessments` | `fk_risk_cases_assessment_id_assessments_numeric` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_risk_cases_status_priority` | `CREATE INDEX ix_risk_cases_status_priority ON risk.cases USING btree (status, priority)` |
| `ix_risk_cases_subject` | `CREATE INDEX ix_risk_cases_subject ON risk.cases USING btree (subject_type, subject_id)` |
| `pk_risk_cases` | `CREATE UNIQUE INDEX pk_risk_cases ON risk.cases USING btree (internal_id)` |
| `risk_case_number` | `CREATE UNIQUE INDEX risk_case_number ON risk.cases USING btree (case_number)` |
| `uq_risk_cases_id` | `CREATE UNIQUE INDEX uq_risk_cases_id ON risk.cases USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON risk.cases FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["assessment_id","assessment_id_internal_id","risk","assessments"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON risk.cases FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON risk.cases FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["assessment_id","assessment_id_internal_id","risk","assessments"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
