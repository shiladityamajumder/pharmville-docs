# `platform.scheduled_jobs`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds scheduled jobs records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | platform.scheduled_jobs |
| Classification | Derived / Operational |
| Proposed business write owner | Shared platform runtime — engineering owner |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 16 columns; 6 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_scheduled_jobs_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `job_key` | `character varying(128)` | No | — | Inferred: stores job key for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `job_type` | `character varying(128)` | No | — | Inferred: stores job type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `last_run_at` | `timestamp with time zone` | Yes | — | Time of last run | Support chronology, deadlines or audit evidence | Exact constraints below |
| `locked_at` | `timestamp with time zone` | Yes | — | Time of locked | Support chronology, deadlines or audit evidence | Exact constraints below |
| `locked_by` | `character varying(128)` | Yes | — | Actor associated with locked | Record responsibility for the change | Collation: default |
| `next_run_at` | `timestamp with time zone` | Yes | — | Time of next run | Support chronology, deadlines or audit evidence | Exact constraints below |
| `payload` | `jsonb` | No | `'{}'::jsonb` | Structured payload information | Retain a versioned payload or relevant details | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `schedule_expression` | `character varying(128)` | Yes | — | Inferred: stores schedule expression for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_scheduled_jobs_updated_by_users` |

## Record lifecycle and users

- **Created:** when the scheduled jobs business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.scheduled_jobs` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_platform_scheduled_jobs_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_scheduled_jobs_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `platform.scheduled_jobs` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_platform_scheduled_jobs_created_by_users` |
| `updated_by` | `identity.users` | `fk_platform_scheduled_jobs_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_scheduled_jobs_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_platform_scheduled_jobs_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_scheduled_jobs_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_platform_scheduled_jobs` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `scheduled_job_key` | UNIQUE | `UNIQUE (job_key)` |
| `uq_platform_scheduled_jobs_id` | UNIQUE | `UNIQUE (id)` |
| `scheduled_jobs_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `scheduled_jobs_id_not_null` | NOT NULL | `NOT NULL id` |
| `scheduled_jobs_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `scheduled_jobs_job_key_not_null` | NOT NULL | `NOT NULL job_key` |
| `scheduled_jobs_job_type_not_null` | NOT NULL | `NOT NULL job_type` |
| `scheduled_jobs_payload_not_null` | NOT NULL | `NOT NULL payload` |
| `scheduled_jobs_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `scheduled_jobs_status_not_null` | NOT NULL | `NOT NULL status` |
| `scheduled_jobs_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_platform_scheduled_jobs_status_next` | btree | `(status, next_run_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_scheduled_jobs_status_next ON platform.scheduled_jobs USING btree (status, next_run_at)` |
| `pk_platform_scheduled_jobs` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_platform_scheduled_jobs ON platform.scheduled_jobs USING btree (internal_id)` |
| `scheduled_job_key` | btree | `(job_key)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX scheduled_job_key ON platform.scheduled_jobs USING btree (job_key)` |
| `uq_platform_scheduled_jobs_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_scheduled_jobs_id ON platform.scheduled_jobs USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.scheduled_jobs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.scheduled_jobs FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.scheduled_jobs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
