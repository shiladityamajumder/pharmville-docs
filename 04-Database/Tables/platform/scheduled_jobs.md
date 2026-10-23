# platform.scheduled_jobs

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds scheduled jobs records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 16 columns, 6 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_scheduled_jobs_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `job_key` | `character varying(128)` | No | — | Inferred: stores job key for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `job_type` | `character varying(128)` | No | — | Inferred: stores job type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `last_run_at` | `timestamp with time zone` | Yes | — | Time of last run | Support chronology, deadlines or audit evidence | See exact constraints |
| `locked_at` | `timestamp with time zone` | Yes | — | Time of locked | Support chronology, deadlines or audit evidence | See exact constraints |
| `locked_by` | `character varying(128)` | Yes | — | Actor associated with locked | Record responsibility for the change | See exact constraints |
| `next_run_at` | `timestamp with time zone` | Yes | — | Time of next run | Support chronology, deadlines or audit evidence | See exact constraints |
| `payload` | `jsonb` | No | `'{}'::jsonb` | Structured payload information | Retain a versioned payload or relevant details | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `schedule_expression` | `character varying(128)` | Yes | — | Inferred: stores schedule expression for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_scheduled_jobs_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the scheduled jobs business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.scheduled_jobs` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_platform_scheduled_jobs_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_platform_scheduled_jobs_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT

## platform.scheduled_jobs — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 16 columns, 6 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_platform_scheduled_jobs_created_by_users` |
| `updated_by` | `identity.users` | `fk_platform_scheduled_jobs_updated_by_users` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_scheduled_jobs_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_platform_scheduled_jobs_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_scheduled_jobs_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_platform_scheduled_jobs` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `scheduled_job_key` | UNIQUE | `UNIQUE (job_key)` |
| `uq_platform_scheduled_jobs_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_platform_scheduled_jobs_status_next` | `CREATE INDEX ix_platform_scheduled_jobs_status_next ON platform.scheduled_jobs USING btree (status, next_run_at)` |
| `pk_platform_scheduled_jobs` | `CREATE UNIQUE INDEX pk_platform_scheduled_jobs ON platform.scheduled_jobs USING btree (internal_id)` |
| `scheduled_job_key` | `CREATE UNIQUE INDEX scheduled_job_key ON platform.scheduled_jobs USING btree (job_key)` |
| `uq_platform_scheduled_jobs_id` | `CREATE UNIQUE INDEX uq_platform_scheduled_jobs_id ON platform.scheduled_jobs USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.scheduled_jobs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.scheduled_jobs FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.scheduled_jobs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
