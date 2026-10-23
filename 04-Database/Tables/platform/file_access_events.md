# platform.file_access_events

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds file access events records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 6 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `action` | `character varying(32)` | No | — | Inferred: stores action for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `actor_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_file_access_events_actor_user_id_users) |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `decision` | `character varying(16)` | No | — | Inferred: stores decision for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `file_object_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_platform_file_access_events_file_object_id_file_objects) |
| `file_object_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_platform_file_access_events_file_object_id_file_obje_47c7); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `ip_address` | `inet` | Yes | — | Inferred: stores ip address for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | See exact constraints |
| `purpose` | `character varying(128)` | No | — | Inferred: stores purpose for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `request_id` | `uuid` | No | — | Identifier associated with request | Link the event or entity to its subject; verify constraints | See exact constraints |
| `signed_url_expires_at` | `timestamp with time zone` | Yes | — | Time of signed url expires | Support chronology, deadlines or audit evidence | See exact constraints |
| `user_agent` | `text` | Yes | — | Inferred: stores user agent for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the file access events business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.file_access_events` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `actor_user_id` → `identity.users(id)` via `fk_platform_file_access_events_actor_user_id_users`; FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE SET NULL
- `file_object_id` → `platform.file_objects(id)` via `fk_platform_file_access_events_file_object_id_file_objects`; FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT
- `file_object_id_internal_id` → `platform.file_objects(internal_id)` via `fk_platform_file_access_events_file_object_id_file_obje_47c7`; FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT

## platform.file_access_events — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 14 columns, 6 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `actor_user_id` | `identity.users` | `fk_platform_file_access_events_actor_user_id_users` |
| `file_object_id` | `platform.file_objects` | `fk_platform_file_access_events_file_object_id_file_objects` |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_platform_file_access_events_file_object_id_file_obje_47c7` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_file_access_events_numeric_pair_file_object_id` | CHECK | `CHECK ((file_object_id IS NULL) = (file_object_id_internal_id IS NULL))` |
| `fk_platform_file_access_events_actor_user_id_users` | FOREIGN KEY | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_platform_file_access_events_file_object_id_file_obje_47c7` | FOREIGN KEY | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT` |
| `fk_platform_file_access_events_file_object_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT` |
| `pk_platform_file_access_events` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_file_access_events_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_platform_file_access_events_actor_time` | `CREATE INDEX ix_platform_file_access_events_actor_time ON platform.file_access_events USING btree (actor_user_id, created_at)` |
| `ix_platform_file_access_events_file_time` | `CREATE INDEX ix_platform_file_access_events_file_time ON platform.file_access_events USING btree (file_object_id, created_at)` |
| `ix_platform_file_access_events_request` | `CREATE INDEX ix_platform_file_access_events_request ON platform.file_access_events USING btree (request_id)` |
| `pk_platform_file_access_events` | `CREATE UNIQUE INDEX pk_platform_file_access_events ON platform.file_access_events USING btree (internal_id)` |
| `uq_platform_file_access_events_id` | `CREATE UNIQUE INDEX uq_platform_file_access_events_id ON platform.file_access_events USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.file_access_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON platform.file_access_events FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.file_access_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
