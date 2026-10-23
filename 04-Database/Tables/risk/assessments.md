# risk.assessments

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds assessments records within the risk domain (risk rules, cases and signals). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 11 columns, 6 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `decision` | `character varying(16)` | No | — | Inferred: stores decision for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `model_version` | `character varying(64)` | No | — | Inferred: stores model version for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `reasons` | `jsonb` | No | — | Structured reasons information | Retain a versioned payload or relevant details | See exact constraints |
| `request_id` | `uuid` | Yes | — | Identifier associated with request | Link the event or entity to its subject; verify constraints | See exact constraints |
| `score` | `numeric(10,4)` | No | — | Inferred: stores score for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `subject_id` | `uuid` | No | — | Identifier associated with subject | Link the event or entity to its subject; verify constraints | See exact constraints |
| `subject_type` | `character varying(64)` | No | — | Inferred: stores subject type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_risk_assessments_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the assessments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `risk.assessments` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_risk_assessments_user_id_users`; FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE SET NULL

**Referenced by 4 FK constraints** (sample): `risk.signals`, `risk.cases`, `risk.cases`, `risk.signals`.

## risk.assessments — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 11 columns, 6 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_risk_assessments_user_id_users` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_risk_assessments_finite_numeric_values` | CHECK | `CHECK (score IS NULL OR (score <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_risk_assessments_riskdecision` | CHECK | `CHECK (decision::text = ANY (ARRAY['allow'::text, 'review'::text, 'block'::text]))` |
| `ck_risk_assessments_score_nonnegative` | CHECK | `CHECK (score >= 0::numeric)` |
| `fk_risk_assessments_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `pk_risk_assessments` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_risk_assessments_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_risk_assessments_decision_time` | `CREATE INDEX ix_risk_assessments_decision_time ON risk.assessments USING btree (decision, created_at)` |
| `ix_risk_assessments_subject` | `CREATE INDEX ix_risk_assessments_subject ON risk.assessments USING btree (subject_type, subject_id)` |
| `pk_risk_assessments` | `CREATE UNIQUE INDEX pk_risk_assessments ON risk.assessments USING btree (internal_id)` |
| `uq_risk_assessments_id` | `CREATE UNIQUE INDEX uq_risk_assessments_id ON risk.assessments USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON risk.assessments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON risk.assessments FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON risk.assessments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
