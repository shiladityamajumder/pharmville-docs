# `platform.outbox_events`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds outbox events records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 20 columns, 7 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `aggregate_id` | `uuid` | No | — | Identifier associated with aggregate | Link the event or entity to its subject; verify constraints | See exact constraints |
| `aggregate_type` | `character varying(64)` | No | — | Inferred: stores aggregate type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `available_at` | `timestamp with time zone` | No | `now()` | Time of available | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_outbox_events_created_by_users) |
| `event_type` | `character varying(128)` | No | — | Inferred: stores event type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `event_version` | `integer` | No | `1` | Inferred: stores event version for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `headers` | `jsonb` | No | `'{}'::jsonb` | Structured headers information | Retain a versioned payload or relevant details | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `last_error` | `text` | Yes | — | Inferred: stores last error for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `locked_at` | `timestamp with time zone` | Yes | — | Time of locked | Support chronology, deadlines or audit evidence | See exact constraints |
| `locked_by` | `character varying(128)` | Yes | — | Actor associated with locked | Record responsibility for the change | See exact constraints |
| `occurred_at` | `timestamp with time zone` | No | `now()` | Time of occurred | Support chronology, deadlines or audit evidence | See exact constraints |
| `payload` | `jsonb` | No | — | Structured payload information | Retain a versioned payload or relevant details | See exact constraints |
| `publish_attempts` | `integer` | No | `0` | Inferred: stores publish attempts for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `published_at` | `timestamp with time zone` | Yes | — | Time of published | Support chronology, deadlines or audit evidence | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_outbox_events_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the outbox events business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.outbox_events` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_platform_outbox_events_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_platform_outbox_events_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

## `platform.outbox_events` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 20 columns, 7 constraints, 6 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_platform_outbox_events_created_by_users` |
| `updated_by` | `identity.users` | `fk_platform_outbox_events_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_outbox_events_event_version_positive` | CHECK | `CHECK (event_version > 0)` |
| `ck_platform_outbox_events_publish_attempts_nonnegative` | CHECK | `CHECK (publish_attempts >= 0)` |
| `ck_platform_outbox_events_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_platform_outbox_events_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_outbox_events_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_platform_outbox_events` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_outbox_events_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_platform_outbox_events_aggregate` | `CREATE INDEX ix_platform_outbox_events_aggregate ON platform.outbox_events USING btree (aggregate_type, aggregate_id)` |
| `ix_platform_outbox_events_event_type` | `CREATE INDEX ix_platform_outbox_events_event_type ON platform.outbox_events USING btree (event_type)` |
| `ix_platform_outbox_events_pending` | `CREATE INDEX ix_platform_outbox_events_pending ON platform.outbox_events USING btree (published_at, occurred_at)` |
| `ix_platform_outbox_events_ready` | `CREATE INDEX ix_platform_outbox_events_ready ON platform.outbox_events USING btree (available_at, id) WHERE published_at IS NULL` |
| `pk_platform_outbox_events` | `CREATE UNIQUE INDEX pk_platform_outbox_events ON platform.outbox_events USING btree (internal_id)` |
| `uq_platform_outbox_events_id` | `CREATE UNIQUE INDEX uq_platform_outbox_events_id ON platform.outbox_events USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.outbox_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.outbox_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.outbox_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
