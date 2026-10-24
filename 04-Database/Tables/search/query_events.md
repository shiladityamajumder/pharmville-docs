# `search.query_events`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds query events records within the search domain (search indexing and query signals). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | search.query_events |
| Classification | Audit / History |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 11 columns; 3 PK/FK/UQ/CHECK/exclusion constraints; 7 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `filters` | `jsonb` | No | `'{}'::jsonb` | Structured filters information | Retain a versioned payload or relevant details | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `query_normalized` | `character varying(512)` | No | — | Inferred: stores query normalized for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `query_raw` | `text` | No | — | Inferred: stores query raw for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `result_count` | `integer` | No | `0` | Inferred: stores result count for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `selected_entity_id` | `uuid` | Yes | — | Identifier associated with selected entity | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `selected_entity_type` | `character varying(64)` | Yes | — | Inferred: stores selected entity type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `session_id` | `character varying(128)` | Yes | — | Identifier associated with session | Link the event or entity to its subject; verify constraints | Collation: default |
| `user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_search_query_events_user_id_users` |

## Record lifecycle and users

- **Created:** when the query events business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `search.query_events` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_search_query_events_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `search.query_events` — exact structural contracts

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
| `query_events_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `query_events_filters_not_null` | NOT NULL | `NOT NULL filters` |
| `query_events_id_not_null` | NOT NULL | `NOT NULL id` |
| `query_events_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `query_events_query_normalized_not_null` | NOT NULL | `NOT NULL query_normalized` |
| `query_events_query_raw_not_null` | NOT NULL | `NOT NULL query_raw` |
| `query_events_result_count_not_null` | NOT NULL | `NOT NULL result_count` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_search_query_events_query_time` | btree | `(query_normalized, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_search_query_events_query_time ON search.query_events USING btree (query_normalized, created_at)` |
| `ix_search_query_events_user_time` | btree | `(user_id, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_search_query_events_user_time ON search.query_events USING btree (user_id, created_at)` |
| `pk_search_query_events` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_search_query_events ON search.query_events USING btree (internal_id)` |
| `uq_search_query_events_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_search_query_events_id ON search.query_events USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON search.query_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON search.query_events FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON search.query_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
