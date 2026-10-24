# `search.query_events`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds query events records within the search domain (search indexing and query signals). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 11 columns, 3 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `filters` | `jsonb` | No | `'{}'::jsonb` | Structured filters information | Retain a versioned payload or relevant details | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `query_normalized` | `character varying(512)` | No | — | Inferred: stores query normalized for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `query_raw` | `text` | No | — | Inferred: stores query raw for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `result_count` | `integer` | No | `0` | Inferred: stores result count for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `selected_entity_id` | `uuid` | Yes | — | Identifier associated with selected entity | Link the event or entity to its subject; verify constraints | See exact constraints |
| `selected_entity_type` | `character varying(64)` | Yes | — | Inferred: stores selected entity type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `session_id` | `character varying(128)` | Yes | — | Identifier associated with session | Link the event or entity to its subject; verify constraints | See exact constraints |
| `user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_search_query_events_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the query events business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `search.query_events` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_search_query_events_user_id_users`; `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`

## `search.query_events` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 11 columns, 3 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_search_query_events_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `fk_search_query_events_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_search_query_events` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_search_query_events_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_search_query_events_query_time` | `CREATE INDEX ix_search_query_events_query_time ON search.query_events USING btree (query_normalized, created_at)` |
| `ix_search_query_events_user_time` | `CREATE INDEX ix_search_query_events_user_time ON search.query_events USING btree (user_id, created_at)` |
| `pk_search_query_events` | `CREATE UNIQUE INDEX pk_search_query_events ON search.query_events USING btree (internal_id)` |
| `uq_search_query_events_id` | `CREATE UNIQUE INDEX uq_search_query_events_id ON search.query_events USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON search.query_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON search.query_events FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON search.query_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
