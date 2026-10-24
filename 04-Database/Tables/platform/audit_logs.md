# `platform.audit_logs`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds audit logs records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 3 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `action` | `character varying(128)` | No | — | Inferred: stores action for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `actor_type` | `character varying(32)` | No | — | Inferred: stores actor type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `actor_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_audit_logs_actor_user_id_users) |
| `after_data` | `jsonb` | Yes | — | Structured after data information | Retain a versioned payload or relevant details | See exact constraints |
| `before_data` | `jsonb` | Yes | — | Structured before data information | Retain a versioned payload or relevant details | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `ip_address` | `inet` | Yes | — | Inferred: stores ip address for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | See exact constraints |
| `occurred_at` | `timestamp with time zone` | No | `now()` | Time of occurred | Support chronology, deadlines or audit evidence | See exact constraints |
| `request_id` | `uuid` | Yes | — | Identifier associated with request | Link the event or entity to its subject; verify constraints | See exact constraints |
| `resource_id` | `character varying(128)` | Yes | — | Identifier associated with resource | Link the event or entity to its subject; verify constraints | See exact constraints |
| `resource_type` | `character varying(128)` | No | — | Inferred: stores resource type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `trace_id` | `character varying(64)` | Yes | — | Identifier associated with trace | Link the event or entity to its subject; verify constraints | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the audit logs business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.audit_logs` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `actor_user_id` → `identity.users(id)` via `fk_platform_audit_logs_actor_user_id_users`; `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE SET NULL`

## `platform.audit_logs` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 15 columns, 3 constraints, 6 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `actor_user_id` | `identity.users` | `fk_platform_audit_logs_actor_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `fk_platform_audit_logs_actor_user_id_users` | FOREIGN KEY | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `pk_platform_audit_logs` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_audit_logs_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_platform_audit_logs_actor_time` | `CREATE INDEX ix_platform_audit_logs_actor_time ON platform.audit_logs USING btree (actor_user_id, occurred_at)` |
| `ix_platform_audit_logs_occurred_at` | `CREATE INDEX ix_platform_audit_logs_occurred_at ON platform.audit_logs USING btree (occurred_at)` |
| `ix_platform_audit_logs_request` | `CREATE INDEX ix_platform_audit_logs_request ON platform.audit_logs USING btree (request_id)` |
| `ix_platform_audit_logs_resource` | `CREATE INDEX ix_platform_audit_logs_resource ON platform.audit_logs USING btree (resource_type, resource_id)` |
| `pk_platform_audit_logs` | `CREATE UNIQUE INDEX pk_platform_audit_logs ON platform.audit_logs USING btree (internal_id)` |
| `uq_platform_audit_logs_id` | `CREATE UNIQUE INDEX uq_platform_audit_logs_id ON platform.audit_logs USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.audit_logs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON platform.audit_logs FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.audit_logs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
