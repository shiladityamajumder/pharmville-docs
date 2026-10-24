# `platform.idempotency_keys`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds idempotency keys records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 7 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_idempotency_keys_created_by_users) |
| `expires_at` | `timestamp with time zone` | No | — | Expiration time | Determine validity windows | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `locked_until` | `timestamp with time zone` | Yes | — | Inferred: stores locked until for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `request_hash` | `character varying(64)` | No | — | Inferred: stores request hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `request_metadata` | `jsonb` | No | `'{}'::jsonb` | Structured request metadata information | Retain a versioned payload or relevant details | See exact constraints |
| `response_body` | `jsonb` | Yes | — | Structured response body information | Retain a versioned payload or relevant details | See exact constraints |
| `response_code` | `integer` | Yes | — | Code for response | Link to controlled business classification or an external reference | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `scope` | `character varying(128)` | No | — | Inferred: stores scope for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_idempotency_keys_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the idempotency keys business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.idempotency_keys` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_platform_idempotency_keys_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_platform_idempotency_keys_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

## `platform.idempotency_keys` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 15 columns, 7 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_platform_idempotency_keys_created_by_users` |
| `updated_by` | `identity.users` | `fk_platform_idempotency_keys_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_idempotency_keys_expires_after_created` | CHECK | `CHECK (expires_at > created_at)` |
| `ck_platform_idempotency_keys_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_platform_idempotency_keys_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_idempotency_keys_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `idempotency_scope_key` | UNIQUE | `UNIQUE (scope, idempotency_key)` |
| `pk_platform_idempotency_keys` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_idempotency_keys_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `idempotency_scope_key` | `CREATE UNIQUE INDEX idempotency_scope_key ON platform.idempotency_keys USING btree (scope, idempotency_key)` |
| `ix_platform_idempotency_keys_expires_at` | `CREATE INDEX ix_platform_idempotency_keys_expires_at ON platform.idempotency_keys USING btree (expires_at)` |
| `pk_platform_idempotency_keys` | `CREATE UNIQUE INDEX pk_platform_idempotency_keys ON platform.idempotency_keys USING btree (internal_id)` |
| `uq_platform_idempotency_keys_id` | `CREATE UNIQUE INDEX uq_platform_idempotency_keys_id ON platform.idempotency_keys USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.idempotency_keys FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.idempotency_keys FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.idempotency_keys FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
