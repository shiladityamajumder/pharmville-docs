# `search.indexing_jobs`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds indexing jobs records within the search domain (search indexing and query signals). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | search.indexing_jobs |
| Classification | Derived / Operational |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 6 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `attempts` | `integer` | No | `0` | Inferred: stores attempts for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `available_at` | `timestamp with time zone` | No | — | Time of available | Support chronology, deadlines or audit evidence | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_search_indexing_jobs_created_by_users` |
| `entity_id` | `uuid` | No | — | Identifier associated with entity | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `entity_type` | `character varying(64)` | No | — | Inferred: stores entity type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `last_error` | `text` | Yes | — | Inferred: stores last error for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `operation` | `character varying(16)` | No | — | Inferred: stores operation for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `payload` | `jsonb` | No | `'{}'::jsonb` | Structured payload information | Retain a versioned payload or relevant details | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_search_indexing_jobs_updated_by_users` |

## Record lifecycle and users

- **Created:** when the indexing jobs business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `search.indexing_jobs` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_search_indexing_jobs_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_search_indexing_jobs_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `search.indexing_jobs` — exact structural contracts

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
| `indexing_jobs_attempts_not_null` | NOT NULL | `NOT NULL attempts` |
| `indexing_jobs_available_at_not_null` | NOT NULL | `NOT NULL available_at` |
| `indexing_jobs_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `indexing_jobs_entity_id_not_null` | NOT NULL | `NOT NULL entity_id` |
| `indexing_jobs_entity_type_not_null` | NOT NULL | `NOT NULL entity_type` |
| `indexing_jobs_id_not_null` | NOT NULL | `NOT NULL id` |
| `indexing_jobs_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `indexing_jobs_operation_not_null` | NOT NULL | `NOT NULL operation` |
| `indexing_jobs_payload_not_null` | NOT NULL | `NOT NULL payload` |
| `indexing_jobs_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `indexing_jobs_status_not_null` | NOT NULL | `NOT NULL status` |
| `indexing_jobs_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_search_indexing_jobs_entity` | btree | `(entity_type, entity_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_search_indexing_jobs_entity ON search.indexing_jobs USING btree (entity_type, entity_id)` |
| `ix_search_indexing_jobs_status_schedule` | btree | `(status, available_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_search_indexing_jobs_status_schedule ON search.indexing_jobs USING btree (status, available_at)` |
| `pk_search_indexing_jobs` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_search_indexing_jobs ON search.indexing_jobs USING btree (internal_id)` |
| `uq_search_indexing_jobs_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_search_indexing_jobs_id ON search.indexing_jobs USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON search.indexing_jobs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON search.indexing_jobs FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON search.indexing_jobs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
