# `risk.signals`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds signals records within the risk domain (risk rules, cases and signals). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 10 columns, 5 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `assessment_id` | `uuid` | Yes | — | Reference linking this record to assessments | Ensures related business data can be joined and validated | FK → `risk.assessments` (fk_risk_signals_assessment_id_assessments) |
| `assessment_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `risk.assessments` (fk_risk_signals_assessment_id_assessments_numeric); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `signal_code` | `character varying(128)` | No | — | Code for signal | Link to controlled business classification or an external reference | See exact constraints |
| `signal_value` | `jsonb` | No | — | Structured signal value information | Retain a versioned payload or relevant details | See exact constraints |
| `source` | `character varying(64)` | No | — | Inferred: stores source for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `subject_id` | `uuid` | No | — | Identifier associated with subject | Link the event or entity to its subject; verify constraints | See exact constraints |
| `subject_type` | `character varying(64)` | No | — | Inferred: stores subject type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the signals business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `risk.signals` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `assessment_id` → `risk.assessments(id)` via `fk_risk_signals_assessment_id_assessments`; `FOREIGN KEY (assessment_id) REFERENCES risk.assessments(id) ON DELETE CASCADE`
- `assessment_id_internal_id` → `risk.assessments(internal_id)` via `fk_risk_signals_assessment_id_assessments_numeric`; `FOREIGN KEY (assessment_id_internal_id) REFERENCES risk.assessments(internal_id) ON DELETE CASCADE`

## `risk.signals` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 10 columns, 5 constraints, 4 indexes, 3 triggers.

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_risk_signals_code_time` | `CREATE INDEX ix_risk_signals_code_time ON risk.signals USING btree (signal_code, created_at)` |
| `ix_risk_signals_subject` | `CREATE INDEX ix_risk_signals_subject ON risk.signals USING btree (subject_type, subject_id)` |
| `pk_risk_signals` | `CREATE UNIQUE INDEX pk_risk_signals ON risk.signals USING btree (internal_id)` |
| `uq_risk_signals_id` | `CREATE UNIQUE INDEX uq_risk_signals_id ON risk.signals USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON risk.signals FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["assessment_id","assessment_id_internal_id","risk","assessments"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON risk.signals FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON risk.signals FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["assessment_id","assessment_id_internal_id","risk","assessments"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
