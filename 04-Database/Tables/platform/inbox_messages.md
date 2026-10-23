# platform.inbox_messages

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds inbox messages records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 6 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `consumer_name` | `character varying(128)` | No | — | Inferred: stores consumer name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_inbox_messages_created_by_users) |
| `error_message` | `text` | Yes | — | Inferred: stores error message for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `event_type` | `character varying(128)` | No | — | Inferred: stores event type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `message_id` | `uuid` | No | — | Identifier associated with message | Link the event or entity to its subject; verify constraints | See exact constraints |
| `payload_hash` | `character varying(64)` | Yes | — | Inferred: stores payload hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `processed_at` | `timestamp with time zone` | Yes | — | Time of processed | Support chronology, deadlines or audit evidence | See exact constraints |
| `received_at` | `timestamp with time zone` | No | `now()` | Time of received | Support chronology, deadlines or audit evidence | See exact constraints |
| `result` | `character varying(32)` | No | `'received'::character varying` | Inferred: stores result for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_inbox_messages_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the inbox messages business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.inbox_messages` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_platform_inbox_messages_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_platform_inbox_messages_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT

## platform.inbox_messages — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 15 columns, 6 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_platform_inbox_messages_created_by_users` |
| `updated_by` | `identity.users` | `fk_platform_inbox_messages_updated_by_users` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_inbox_messages_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `consumer_message` | UNIQUE | `UNIQUE (consumer_name, message_id)` |
| `fk_platform_inbox_messages_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_inbox_messages_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_platform_inbox_messages` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_inbox_messages_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `consumer_message` | `CREATE UNIQUE INDEX consumer_message ON platform.inbox_messages USING btree (consumer_name, message_id)` |
| `ix_platform_inbox_messages_message` | `CREATE INDEX ix_platform_inbox_messages_message ON platform.inbox_messages USING btree (message_id)` |
| `ix_platform_inbox_messages_processed` | `CREATE INDEX ix_platform_inbox_messages_processed ON platform.inbox_messages USING btree (processed_at)` |
| `pk_platform_inbox_messages` | `CREATE UNIQUE INDEX pk_platform_inbox_messages ON platform.inbox_messages USING btree (internal_id)` |
| `uq_platform_inbox_messages_id` | `CREATE UNIQUE INDEX uq_platform_inbox_messages_id ON platform.inbox_messages USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.inbox_messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.inbox_messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.inbox_messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
