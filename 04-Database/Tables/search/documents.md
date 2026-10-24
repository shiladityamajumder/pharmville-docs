# `search.documents`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds documents records within the search domain (search indexing and query signals). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 6 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `content_hash` | `character varying(64)` | No | — | Inferred: stores content hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_search_documents_created_by_users) |
| `document` | `jsonb` | No | — | Structured document information | Retain a versioned payload or relevant details | See exact constraints |
| `entity_id` | `uuid` | No | — | Identifier associated with entity | Link the event or entity to its subject; verify constraints | See exact constraints |
| `entity_type` | `character varying(64)` | No | — | Inferred: stores entity type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `index_status` | `character varying(32)` | No | `'pending'::character varying` | Inferred: stores index status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `indexed_at` | `timestamp with time zone` | Yes | — | Time of indexed | Support chronology, deadlines or audit evidence | See exact constraints |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `locale` | `character varying(16)` | No | `'en-IN'::character varying` | Inferred: stores locale for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_search_documents_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the documents business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `search.documents` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_search_documents_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_search_documents_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

## `search.documents` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 14 columns, 6 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_search_documents_created_by_users` |
| `updated_by` | `identity.users` | `fk_search_documents_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_search_documents_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_search_documents_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_search_documents_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_search_documents` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `search_entity_document` | UNIQUE | `UNIQUE (entity_type, entity_id, locale)` |
| `uq_search_documents_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_search_documents_entity` | `CREATE INDEX ix_search_documents_entity ON search.documents USING btree (entity_type, entity_id)` |
| `ix_search_documents_index_status` | `CREATE INDEX ix_search_documents_index_status ON search.documents USING btree (index_status)` |
| `pk_search_documents` | `CREATE UNIQUE INDEX pk_search_documents ON search.documents USING btree (internal_id)` |
| `search_entity_document` | `CREATE UNIQUE INDEX search_entity_document ON search.documents USING btree (entity_type, entity_id, locale)` |
| `uq_search_documents_id` | `CREATE UNIQUE INDEX uq_search_documents_id ON search.documents USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON search.documents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON search.documents FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON search.documents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
