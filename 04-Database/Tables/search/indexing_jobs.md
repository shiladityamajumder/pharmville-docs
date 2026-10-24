# `search.indexing_jobs`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds indexing jobs records within the search domain (search indexing and query signals). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 6 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `attempts` | `integer` | No | `0` | Inferred: stores attempts for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `available_at` | `timestamp with time zone` | No | — | Time of available | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_search_indexing_jobs_created_by_users) |
| `entity_id` | `uuid` | No | — | Identifier associated with entity | Link the event or entity to its subject; verify constraints | See exact constraints |
| `entity_type` | `character varying(64)` | No | — | Inferred: stores entity type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `last_error` | `text` | Yes | — | Inferred: stores last error for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `operation` | `character varying(16)` | No | — | Inferred: stores operation for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `payload` | `jsonb` | No | `'{}'::jsonb` | Structured payload information | Retain a versioned payload or relevant details | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_search_indexing_jobs_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the indexing jobs business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `search.indexing_jobs` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_search_indexing_jobs_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_search_indexing_jobs_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

## `search.indexing_jobs` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 15 columns, 6 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_search_indexing_jobs_created_by_users` |
| `updated_by` | `identity.users` | `fk_search_indexing_jobs_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_search_indexing_jobs_attempts_nonnegative` | CHECK | `CHECK (attempts >= 0)` |
| `ck_search_indexing_jobs_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_search_indexing_jobs_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_search_indexing_jobs_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_search_indexing_jobs` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_search_indexing_jobs_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_search_indexing_jobs_entity` | `CREATE INDEX ix_search_indexing_jobs_entity ON search.indexing_jobs USING btree (entity_type, entity_id)` |
| `ix_search_indexing_jobs_status_schedule` | `CREATE INDEX ix_search_indexing_jobs_status_schedule ON search.indexing_jobs USING btree (status, available_at)` |
| `pk_search_indexing_jobs` | `CREATE UNIQUE INDEX pk_search_indexing_jobs ON search.indexing_jobs USING btree (internal_id)` |
| `uq_search_indexing_jobs_id` | `CREATE UNIQUE INDEX uq_search_indexing_jobs_id ON search.indexing_jobs USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON search.indexing_jobs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON search.indexing_jobs FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON search.indexing_jobs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
