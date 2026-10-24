# `support.ticket_attachments`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds ticket attachments records within the support domain (customer support case records). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 13 columns, 15 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_support_ticket_attachments_created_by_users) |
| `file_object_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_support_ticket_attachments_file_object_id_file_objects) |
| `file_object_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_support_ticket_attachments_file_object_id_file_objec_8e8b); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `ticket_id` | `uuid` | No | — | Reference linking this record to tickets | Ensures related business data can be joined and validated | FK → `support.tickets` (fk_support_ticket_attachments_ticket_id_tickets) |
| `ticket_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `support.tickets` (fk_support_ticket_attachments_ticket_id_tickets_numeric); Numeric/public-key pair verification required |
| `ticket_message_id` | `uuid` | Yes | — | Reference linking this record to ticket messages | Ensures related business data can be joined and validated | FK → `support.ticket_messages` (fk_support_ticket_attachments_ticket_message_id_ticket_messages) |
| `ticket_message_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `support.ticket_messages` (fk_support_ticket_attachments_ticket_message_id_ticket__7442); Numeric/public-key pair verification required |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_support_ticket_attachments_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the ticket attachments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `support.ticket_attachments` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_support_ticket_attachments_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_support_ticket_attachments_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `ticket_id` → `support.tickets(id)` via `fk_support_ticket_attachments_ticket_id_tickets`; `FOREIGN KEY (ticket_id) REFERENCES support.tickets(id) ON DELETE CASCADE`
- `ticket_message_id` → `support.ticket_messages(id)` via `fk_support_ticket_attachments_ticket_message_id_ticket_messages`; `FOREIGN KEY (ticket_message_id) REFERENCES support.ticket_messages(id) ON DELETE CASCADE`
- `file_object_id` → `platform.file_objects(id)` via `fk_support_ticket_attachments_file_object_id_file_objects`; `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT`
- `file_object_id_internal_id` → `platform.file_objects(internal_id)` via `fk_support_ticket_attachments_file_object_id_file_objec_8e8b`; `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT`
- `ticket_id_internal_id` → `support.tickets(internal_id)` via `fk_support_ticket_attachments_ticket_id_tickets_numeric`; `FOREIGN KEY (ticket_id_internal_id) REFERENCES support.tickets(internal_id) ON DELETE CASCADE`
- `ticket_message_id_internal_id` → `support.ticket_messages(internal_id)` via `fk_support_ticket_attachments_ticket_message_id_ticket__7442`; `FOREIGN KEY (ticket_message_id_internal_id) REFERENCES support.ticket_messages(internal_id) ON DELETE CASCADE`

## `support.ticket_attachments` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 13 columns, 15 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_support_ticket_attachments_created_by_users` |
| `updated_by` | `identity.users` | `fk_support_ticket_attachments_updated_by_users` |
| `ticket_id` | `support.tickets` | `fk_support_ticket_attachments_ticket_id_tickets` |
| `ticket_message_id` | `support.ticket_messages` | `fk_support_ticket_attachments_ticket_message_id_ticket_messages` |
| `file_object_id` | `platform.file_objects` | `fk_support_ticket_attachments_file_object_id_file_objects` |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_support_ticket_attachments_file_object_id_file_objec_8e8b` |
| `ticket_id_internal_id` | `support.tickets` | `fk_support_ticket_attachments_ticket_id_tickets_numeric` |
| `ticket_message_id_internal_id` | `support.ticket_messages` | `fk_support_ticket_attachments_ticket_message_id_ticket__7442` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_support_ticket_attachments_numeric_pair_file_object_id` | CHECK | `CHECK ((file_object_id IS NULL) = (file_object_id_internal_id IS NULL))` |
| `ck_support_ticket_attachments_numeric_pair_ticket_id` | CHECK | `CHECK ((ticket_id IS NULL) = (ticket_id_internal_id IS NULL))` |
| `ck_support_ticket_attachments_numeric_pair_ticket_message_id` | CHECK | `CHECK ((ticket_message_id IS NULL) = (ticket_message_id_internal_id IS NULL))` |
| `ck_support_ticket_attachments_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_support_ticket_attachments_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_support_ticket_attachments_file_object_id_file_objec_8e8b` | FOREIGN KEY | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT` |
| `fk_support_ticket_attachments_file_object_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT` |
| `fk_support_ticket_attachments_ticket_id_tickets` | FOREIGN KEY | `FOREIGN KEY (ticket_id) REFERENCES support.tickets(id) ON DELETE CASCADE` |
| `fk_support_ticket_attachments_ticket_id_tickets_numeric` | FOREIGN KEY | `FOREIGN KEY (ticket_id_internal_id) REFERENCES support.tickets(internal_id) ON DELETE CASCADE` |
| `fk_support_ticket_attachments_ticket_message_id_ticket__7442` | FOREIGN KEY | `FOREIGN KEY (ticket_message_id_internal_id) REFERENCES support.ticket_messages(internal_id) ON DELETE CASCADE` |
| `fk_support_ticket_attachments_ticket_message_id_ticket_messages` | FOREIGN KEY | `FOREIGN KEY (ticket_message_id) REFERENCES support.ticket_messages(id) ON DELETE CASCADE` |
| `fk_support_ticket_attachments_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_support_ticket_attachments` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `ticket_attachment_file` | UNIQUE | `UNIQUE (file_object_id)` |
| `uq_support_ticket_attachments_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_support_ticket_attachments_file` | `CREATE INDEX ix_support_ticket_attachments_file ON support.ticket_attachments USING btree (file_object_id)` |
| `ix_support_ticket_attachments_message` | `CREATE INDEX ix_support_ticket_attachments_message ON support.ticket_attachments USING btree (ticket_message_id)` |
| `pk_support_ticket_attachments` | `CREATE UNIQUE INDEX pk_support_ticket_attachments ON support.ticket_attachments USING btree (internal_id)` |
| `ticket_attachment_file` | `CREATE UNIQUE INDEX ticket_attachment_file ON support.ticket_attachments USING btree (file_object_id)` |
| `uq_support_ticket_attachments_id` | `CREATE UNIQUE INDEX uq_support_ticket_attachments_id ON support.ticket_attachments USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON support.ticket_attachments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"],["ticket_id","ticket_id_internal_id","support","tickets"],["ticket_message_id","ticket_message_id_internal_id","support","ticket_messages"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON support.ticket_attachments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON support.ticket_attachments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"],["ticket_id","ticket_id_internal_id","support","tickets"],["ticket_message_id","ticket_message_id_internal_id","support","ticket_messages"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
