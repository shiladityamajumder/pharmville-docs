# `platform.file_scan_events`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds file scan events records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | platform.file_scan_events |
| Classification | Audit / History |
| Proposed business write owner | Shared platform file service — engineering owner; no clinical write grant |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 9 columns; 5 PK/FK/UQ/CHECK/exclusion constraints; 8 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `file_object_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_platform_file_scan_events_file_object_id_file_objects` |
| `file_object_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_platform_file_scan_events_file_object_id_file_object_6b3d` |
| `findings` | `jsonb` | No | `'{}'::jsonb` | Structured findings information | Retain a versioned payload or relevant details | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `scanner` | `character varying(64)` | No | — | Inferred: stores scanner for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `signature_version` | `character varying(64)` | Yes | — | Inferred: stores signature version for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |

## Record lifecycle and users

- **Created:** when the file scan events business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.file_scan_events` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_platform_file_scan_events_file_object_id_file_object_6b3d | `file_object_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE CASCADE` |
| fk_platform_file_scan_events_file_object_id_file_objects | `file_object_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `platform.file_scan_events` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_platform_file_scan_events_file_object_id_file_object_6b3d` |
| `file_object_id` | `platform.file_objects` | `fk_platform_file_scan_events_file_object_id_file_objects` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_file_scan_events_numeric_pair_file_object_id` | CHECK | `CHECK ((file_object_id IS NULL) = (file_object_id_internal_id IS NULL))` |
| `fk_platform_file_scan_events_file_object_id_file_object_6b3d` | FOREIGN KEY | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE CASCADE` |
| `fk_platform_file_scan_events_file_object_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE CASCADE` |
| `pk_platform_file_scan_events` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_file_scan_events_id` | UNIQUE | `UNIQUE (id)` |
| `file_scan_events_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `file_scan_events_file_object_id_internal_id_not_null` | NOT NULL | `NOT NULL file_object_id_internal_id` |
| `file_scan_events_file_object_id_not_null` | NOT NULL | `NOT NULL file_object_id` |
| `file_scan_events_findings_not_null` | NOT NULL | `NOT NULL findings` |
| `file_scan_events_id_not_null` | NOT NULL | `NOT NULL id` |
| `file_scan_events_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `file_scan_events_scanner_not_null` | NOT NULL | `NOT NULL scanner` |
| `file_scan_events_status_not_null` | NOT NULL | `NOT NULL status` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_platform_file_scan_events_file_time` | btree | `(file_object_id, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_file_scan_events_file_time ON platform.file_scan_events USING btree (file_object_id, created_at)` |
| `pk_platform_file_scan_events` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_platform_file_scan_events ON platform.file_scan_events USING btree (internal_id)` |
| `uq_platform_file_scan_events_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_file_scan_events_id ON platform.file_scan_events USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.file_scan_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON platform.file_scan_events FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.file_scan_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
