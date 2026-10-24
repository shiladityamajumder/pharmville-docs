# `notification.provider_webhooks`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds provider webhooks records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 6 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_provider_webhooks_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `payload` | `jsonb` | No | — | Structured payload information | Retain a versioned payload or relevant details | See exact constraints |
| `processed_at` | `timestamp with time zone` | Yes | — | Time of processed | Support chronology, deadlines or audit evidence | See exact constraints |
| `processing_status` | `character varying(32)` | No | `'pending'::character varying` | Inferred: stores processing status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider_event_id` | `character varying(255)` | No | — | Identifier associated with provider event | Link the event or entity to its subject; verify constraints | See exact constraints |
| `provider_message_id` | `character varying(255)` | Yes | — | Identifier associated with provider message | Link the event or entity to its subject; verify constraints | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `signature_valid` | `boolean` | No | — | Inferred: stores signature valid for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_provider_webhooks_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the provider webhooks business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Rider_App, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `notification.provider_webhooks` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_notification_provider_webhooks_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_notification_provider_webhooks_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

## `notification.provider_webhooks` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 14 columns, 6 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_notification_provider_webhooks_created_by_users` |
| `updated_by` | `identity.users` | `fk_notification_provider_webhooks_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_notification_provider_webhooks_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_notification_provider_webhooks_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_provider_webhooks_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `notification_provider_event` | UNIQUE | `UNIQUE (provider, provider_event_id)` |
| `pk_notification_provider_webhooks` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_notification_provider_webhooks_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_notification_provider_webhooks_status` | `CREATE INDEX ix_notification_provider_webhooks_status ON notification.provider_webhooks USING btree (processing_status)` |
| `notification_provider_event` | `CREATE UNIQUE INDEX notification_provider_event ON notification.provider_webhooks USING btree (provider, provider_event_id)` |
| `pk_notification_provider_webhooks` | `CREATE UNIQUE INDEX pk_notification_provider_webhooks ON notification.provider_webhooks USING btree (internal_id)` |
| `uq_notification_provider_webhooks_id` | `CREATE UNIQUE INDEX uq_notification_provider_webhooks_id ON notification.provider_webhooks USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON notification.provider_webhooks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON notification.provider_webhooks FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON notification.provider_webhooks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
