# `platform.webhook_deliveries`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds webhook deliveries records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | platform.webhook_deliveries |
| Classification | Transactional |
| Proposed business write owner | Shared platform runtime — engineering owner |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `attempt_count` | `integer` | No | `0` | Inferred: stores attempt count for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_webhook_deliveries_created_by_users` |
| `delivered_at` | `timestamp with time zone` | Yes | — | Time of delivered | Support chronology, deadlines or audit evidence | Exact constraints below |
| `endpoint_id` | `uuid` | No | — | Reference linking this record to webhook endpoints | Ensures related business data can be joined and validated | FK → `platform.webhook_endpoints` via `fk_platform_webhook_deliveries_endpoint_id_webhook_endpoints` |
| `endpoint_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.webhook_endpoints` via `fk_platform_webhook_deliveries_endpoint_id_webhook_endp_fc9c` |
| `event_id` | `uuid` | No | — | Identifier associated with event | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `event_type` | `character varying(128)` | No | — | Inferred: stores event type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `last_response_code` | `integer` | Yes | — | Code for last response | Link to controlled business classification or an external reference | Exact constraints below |
| `next_attempt_at` | `timestamp with time zone` | Yes | — | Time of next attempt | Support chronology, deadlines or audit evidence | Exact constraints below |
| `payload` | `jsonb` | No | — | Structured payload information | Retain a versioned payload or relevant details | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_webhook_deliveries_updated_by_users` |

## Record lifecycle and users

- **Created:** when the webhook deliveries business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.webhook_deliveries` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_platform_webhook_deliveries_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_webhook_deliveries_endpoint_id_webhook_endp_fc9c | `endpoint_id_internal_id` | [`platform.webhook_endpoints`](../../Tables/platform/webhook_endpoints.md) | `FOREIGN KEY (endpoint_id_internal_id) REFERENCES platform.webhook_endpoints(internal_id) ON DELETE CASCADE` |
| fk_platform_webhook_deliveries_endpoint_id_webhook_endpoints | `endpoint_id` | [`platform.webhook_endpoints`](../../Tables/platform/webhook_endpoints.md) | `FOREIGN KEY (endpoint_id) REFERENCES platform.webhook_endpoints(id) ON DELETE CASCADE` |
| fk_platform_webhook_deliveries_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `platform.webhook_deliveries` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_platform_webhook_deliveries_created_by_users` |
| `endpoint_id_internal_id` | `platform.webhook_endpoints` | `fk_platform_webhook_deliveries_endpoint_id_webhook_endp_fc9c` |
| `endpoint_id` | `platform.webhook_endpoints` | `fk_platform_webhook_deliveries_endpoint_id_webhook_endpoints` |
| `updated_by` | `identity.users` | `fk_platform_webhook_deliveries_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_webhook_deliveries_numeric_pair_endpoint_id` | CHECK | `CHECK ((endpoint_id IS NULL) = (endpoint_id_internal_id IS NULL))` |
| `ck_platform_webhook_deliveries_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `endpoint_event_delivery` | UNIQUE | `UNIQUE (endpoint_id, event_id)` |
| `fk_platform_webhook_deliveries_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_webhook_deliveries_endpoint_id_webhook_endp_fc9c` | FOREIGN KEY | `FOREIGN KEY (endpoint_id_internal_id) REFERENCES platform.webhook_endpoints(internal_id) ON DELETE CASCADE` |
| `fk_platform_webhook_deliveries_endpoint_id_webhook_endpoints` | FOREIGN KEY | `FOREIGN KEY (endpoint_id) REFERENCES platform.webhook_endpoints(id) ON DELETE CASCADE` |
| `fk_platform_webhook_deliveries_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_platform_webhook_deliveries` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_webhook_deliveries_id` | UNIQUE | `UNIQUE (id)` |
| `webhook_deliveries_attempt_count_not_null` | NOT NULL | `NOT NULL attempt_count` |
| `webhook_deliveries_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `webhook_deliveries_endpoint_id_internal_id_not_null` | NOT NULL | `NOT NULL endpoint_id_internal_id` |
| `webhook_deliveries_endpoint_id_not_null` | NOT NULL | `NOT NULL endpoint_id` |
| `webhook_deliveries_event_id_not_null` | NOT NULL | `NOT NULL event_id` |
| `webhook_deliveries_event_type_not_null` | NOT NULL | `NOT NULL event_type` |
| `webhook_deliveries_id_not_null` | NOT NULL | `NOT NULL id` |
| `webhook_deliveries_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `webhook_deliveries_payload_not_null` | NOT NULL | `NOT NULL payload` |
| `webhook_deliveries_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `webhook_deliveries_status_not_null` | NOT NULL | `NOT NULL status` |
| `webhook_deliveries_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `endpoint_event_delivery` | btree | `(endpoint_id, event_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX endpoint_event_delivery ON platform.webhook_deliveries USING btree (endpoint_id, event_id)` |
| `ix_platform_webhook_deliveries_status_next` | btree | `(status, next_attempt_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_webhook_deliveries_status_next ON platform.webhook_deliveries USING btree (status, next_attempt_at)` |
| `pk_platform_webhook_deliveries` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_platform_webhook_deliveries ON platform.webhook_deliveries USING btree (internal_id)` |
| `uq_platform_webhook_deliveries_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_webhook_deliveries_id ON platform.webhook_deliveries USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.webhook_deliveries FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["endpoint_id","endpoint_id_internal_id","platform","webhook_endpoints"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.webhook_deliveries FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.webhook_deliveries FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["endpoint_id","endpoint_id_internal_id","platform","webhook_endpoints"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
