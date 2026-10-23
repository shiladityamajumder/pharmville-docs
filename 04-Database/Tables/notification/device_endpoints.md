# notification.device_endpoints

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds device endpoints records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 7 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_device_endpoints_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_device_endpoints_deleted_by_users) |
| `device_id` | `character varying(255)` | No | — | Identifier associated with device | Link the event or entity to its subject; verify constraints | See exact constraints |
| `enabled` | `boolean` | No | `true` | Inferred: stores enabled for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `invalidated_at` | `timestamp with time zone` | Yes | — | Time of invalidated | Support chronology, deadlines or audit evidence | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `last_seen_at` | `timestamp with time zone` | Yes | — | Time of last seen | Support chronology, deadlines or audit evidence | See exact constraints |
| `locale` | `character varying(16)` | Yes | — | Inferred: stores locale for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `platform` | `character varying(32)` | No | — | Inferred: stores platform for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `timezone` | `character varying(64)` | Yes | — | Inferred: stores timezone for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `token_encrypted` | `bytea` | No | — | Inferred: stores token encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `token_hash` | `character varying(128)` | No | — | Inferred: stores token hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_device_endpoints_updated_by_users) |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_device_endpoints_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the device endpoints business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Rider_App, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `notification.device_endpoints` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_notification_device_endpoints_user_id_users`; FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE
- `created_by` → `identity.users(id)` via `fk_notification_device_endpoints_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_notification_device_endpoints_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_notification_device_endpoints_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT

## notification.device_endpoints — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 21 columns, 7 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_notification_device_endpoints_user_id_users` |
| `created_by` | `identity.users` | `fk_notification_device_endpoints_created_by_users` |
| `deleted_by` | `identity.users` | `fk_notification_device_endpoints_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_notification_device_endpoints_updated_by_users` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_notification_device_endpoints_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_notification_device_endpoints_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_device_endpoints_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_device_endpoints_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_device_endpoints_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_notification_device_endpoints` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_notification_device_endpoints_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_notification_device_endpoints_user` | `CREATE INDEX ix_notification_device_endpoints_user ON notification.device_endpoints USING btree (user_id)` |
| `pk_notification_device_endpoints` | `CREATE UNIQUE INDEX pk_notification_device_endpoints ON notification.device_endpoints USING btree (internal_id)` |
| `uq_notification_device_endpoints_device_active` | `CREATE UNIQUE INDEX uq_notification_device_endpoints_device_active ON notification.device_endpoints USING btree (user_id, device_id, provider) WHERE is_deleted = false` |
| `uq_notification_device_endpoints_id` | `CREATE UNIQUE INDEX uq_notification_device_endpoints_id ON notification.device_endpoints USING btree (id)` |
| `uq_notification_device_endpoints_token_active` | `CREATE UNIQUE INDEX uq_notification_device_endpoints_token_active ON notification.device_endpoints USING btree (token_hash) WHERE is_deleted = false` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON notification.device_endpoints FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON notification.device_endpoints FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON notification.device_endpoints FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
