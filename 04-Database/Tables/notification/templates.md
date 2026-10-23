# notification.templates

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds templates records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 19 columns, 9 constraints, 5 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `body_template` | `text` | No | — | Inferred: stores body template for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `channel` | `character varying(32)` | No | — | Inferred: stores channel for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `code` | `character varying(128)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_templates_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_templates_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `locale` | `character varying(16)` | No | — | Inferred: stores locale for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider_template_id` | `character varying(255)` | Yes | — | Identifier associated with provider template | Link the event or entity to its subject; verify constraints | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'draft'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `subject_template` | `text` | Yes | — | Inferred: stores subject template for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_notification_templates_updated_by_users) |
| `variables_schema` | `jsonb` | No | `'{}'::jsonb` | Structured variables schema information | Retain a versioned payload or relevant details | See exact constraints |
| `version` | `integer` | No | `1` | Inferred: stores version for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the templates business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Rider_App, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `notification.templates` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_notification_templates_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_notification_templates_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_notification_templates_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT

**Referenced by 2 FK constraints** (sample): `notification.messages`, `notification.messages`.

## notification.templates — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 19 columns, 9 constraints, 5 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_notification_templates_created_by_users` |
| `deleted_by` | `identity.users` | `fk_notification_templates_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_notification_templates_updated_by_users` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_notification_templates_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_notification_templates_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(code::text)) > 0 AND code::text = btrim(code::text))` |
| `ck_notification_templates_version_positive` | CHECK | `CHECK (version > 0)` |
| `fk_notification_templates_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_templates_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_notification_templates_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_notification_templates` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `template_version` | UNIQUE | `UNIQUE (code, channel, locale, version)` |
| `uq_notification_templates_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_notification_templates_code` | `CREATE INDEX ix_notification_templates_code ON notification.templates USING btree (code)` |
| `ix_notification_templates_status` | `CREATE INDEX ix_notification_templates_status ON notification.templates USING btree (status)` |
| `pk_notification_templates` | `CREATE UNIQUE INDEX pk_notification_templates ON notification.templates USING btree (internal_id)` |
| `template_version` | `CREATE UNIQUE INDEX template_version ON notification.templates USING btree (code, channel, locale, version)` |
| `uq_notification_templates_id` | `CREATE UNIQUE INDEX uq_notification_templates_id ON notification.templates USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON notification.templates FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON notification.templates FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '["channel", "locale", "version"]')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON notification.templates FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON notification.templates FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
