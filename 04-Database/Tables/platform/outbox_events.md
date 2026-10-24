# `platform.outbox_events`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds outbox events records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | platform.outbox_events |
| Classification | Derived / Operational |
| Proposed business write owner | Shared platform runtime — engineering owner |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 20 columns; 7 PK/FK/UQ/CHECK/exclusion constraints; 14 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `aggregate_id` | `uuid` | No | — | Identifier associated with aggregate | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `aggregate_type` | `character varying(64)` | No | — | Inferred: stores aggregate type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `available_at` | `timestamp with time zone` | No | `now()` | Time of available | Support chronology, deadlines or audit evidence | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_outbox_events_created_by_users` |
| `event_type` | `character varying(128)` | No | — | Inferred: stores event type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `event_version` | `integer` | No | `1` | Inferred: stores event version for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `headers` | `jsonb` | No | `'{}'::jsonb` | Structured headers information | Retain a versioned payload or relevant details | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `last_error` | `text` | Yes | — | Inferred: stores last error for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `locked_at` | `timestamp with time zone` | Yes | — | Time of locked | Support chronology, deadlines or audit evidence | Exact constraints below |
| `locked_by` | `character varying(128)` | Yes | — | Actor associated with locked | Record responsibility for the change | Collation: default |
| `occurred_at` | `timestamp with time zone` | No | `now()` | Time of occurred | Support chronology, deadlines or audit evidence | Exact constraints below |
| `payload` | `jsonb` | No | — | Structured payload information | Retain a versioned payload or relevant details | Exact constraints below |
| `publish_attempts` | `integer` | No | `0` | Inferred: stores publish attempts for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `published_at` | `timestamp with time zone` | Yes | — | Time of published | Support chronology, deadlines or audit evidence | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_outbox_events_updated_by_users` |

## Record lifecycle and users

- **Created:** when the outbox events business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.outbox_events` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_platform_outbox_events_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_outbox_events_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `platform.outbox_events` — exact structural contracts

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
| `outbox_events_aggregate_id_not_null` | NOT NULL | `NOT NULL aggregate_id` |
| `outbox_events_aggregate_type_not_null` | NOT NULL | `NOT NULL aggregate_type` |
| `outbox_events_available_at_not_null` | NOT NULL | `NOT NULL available_at` |
| `outbox_events_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `outbox_events_event_type_not_null` | NOT NULL | `NOT NULL event_type` |
| `outbox_events_event_version_not_null` | NOT NULL | `NOT NULL event_version` |
| `outbox_events_headers_not_null` | NOT NULL | `NOT NULL headers` |
| `outbox_events_id_not_null` | NOT NULL | `NOT NULL id` |
| `outbox_events_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `outbox_events_occurred_at_not_null` | NOT NULL | `NOT NULL occurred_at` |
| `outbox_events_payload_not_null` | NOT NULL | `NOT NULL payload` |
| `outbox_events_publish_attempts_not_null` | NOT NULL | `NOT NULL publish_attempts` |
| `outbox_events_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `outbox_events_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_platform_outbox_events_aggregate` | btree | `(aggregate_type, aggregate_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_outbox_events_aggregate ON platform.outbox_events USING btree (aggregate_type, aggregate_id)` |
| `ix_platform_outbox_events_event_type` | btree | `(event_type)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_outbox_events_event_type ON platform.outbox_events USING btree (event_type)` |
| `ix_platform_outbox_events_pending` | btree | `(published_at, occurred_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_outbox_events_pending ON platform.outbox_events USING btree (published_at, occurred_at)` |
| `ix_platform_outbox_events_ready` | btree | `(available_at, id)` | published_at IS NULL | Read/join/filter access path; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_outbox_events_ready ON platform.outbox_events USING btree (available_at, id) WHERE published_at IS NULL` |
| `pk_platform_outbox_events` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_platform_outbox_events ON platform.outbox_events USING btree (internal_id)` |
| `uq_platform_outbox_events_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_outbox_events_id ON platform.outbox_events USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.outbox_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.outbox_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.outbox_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
