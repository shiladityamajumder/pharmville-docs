# platform.file_scan_events

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds file scan events records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 9 columns, 5 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `file_object_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_platform_file_scan_events_file_object_id_file_objects) |
| `file_object_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_platform_file_scan_events_file_object_id_file_object_6b3d); Numeric/public-key pair verification required |
| `findings` | `jsonb` | No | `'{}'::jsonb` | Structured findings information | Retain a versioned payload or relevant details | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `scanner` | `character varying(64)` | No | — | Inferred: stores scanner for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `signature_version` | `character varying(64)` | Yes | — | Inferred: stores signature version for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the file scan events business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.file_scan_events` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `file_object_id` → `platform.file_objects(id)` via `fk_platform_file_scan_events_file_object_id_file_objects`; FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE CASCADE
- `file_object_id_internal_id` → `platform.file_objects(internal_id)` via `fk_platform_file_scan_events_file_object_id_file_object_6b3d`; FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE CASCADE

## platform.file_scan_events — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 9 columns, 5 constraints, 3 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `file_object_id` | `platform.file_objects` | `fk_platform_file_scan_events_file_object_id_file_objects` |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_platform_file_scan_events_file_object_id_file_object_6b3d` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_file_scan_events_numeric_pair_file_object_id` | CHECK | `CHECK ((file_object_id IS NULL) = (file_object_id_internal_id IS NULL))` |
| `fk_platform_file_scan_events_file_object_id_file_object_6b3d` | FOREIGN KEY | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE CASCADE` |
| `fk_platform_file_scan_events_file_object_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE CASCADE` |
| `pk_platform_file_scan_events` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_file_scan_events_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_platform_file_scan_events_file_time` | `CREATE INDEX ix_platform_file_scan_events_file_time ON platform.file_scan_events USING btree (file_object_id, created_at)` |
| `pk_platform_file_scan_events` | `CREATE UNIQUE INDEX pk_platform_file_scan_events ON platform.file_scan_events USING btree (internal_id)` |
| `uq_platform_file_scan_events_id` | `CREATE UNIQUE INDEX uq_platform_file_scan_events_id ON platform.file_scan_events USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.file_scan_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON platform.file_scan_events FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.file_scan_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
