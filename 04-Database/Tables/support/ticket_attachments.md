# `support.ticket_attachments`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds ticket attachments records within the support domain (customer support case records). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | support.ticket_attachments |
| Classification | Mapping / Junction |
| Proposed business write owner | Future support owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 13 columns; 15 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_support_ticket_attachments_created_by_users` |
| `file_object_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_support_ticket_attachments_file_object_id_file_objects` |
| `file_object_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_support_ticket_attachments_file_object_id_file_objec_8e8b` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `ticket_id` | `uuid` | No | — | Reference linking this record to tickets | Ensures related business data can be joined and validated | FK → `support.tickets` via `fk_support_ticket_attachments_ticket_id_tickets` |
| `ticket_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `support.tickets` via `fk_support_ticket_attachments_ticket_id_tickets_numeric` |
| `ticket_message_id` | `uuid` | Yes | — | Reference linking this record to ticket messages | Ensures related business data can be joined and validated | FK → `support.ticket_messages` via `fk_support_ticket_attachments_ticket_message_id_ticket_messages` |
| `ticket_message_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `support.ticket_messages` via `fk_support_ticket_attachments_ticket_message_id_ticket__7442` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_support_ticket_attachments_updated_by_users` |

## Record lifecycle and users

- **Created:** when the ticket attachments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `support.ticket_attachments` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_support_ticket_attachments_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_support_ticket_attachments_file_object_id_file_objec_8e8b | `file_object_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT` |
| fk_support_ticket_attachments_file_object_id_file_objects | `file_object_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT` |
| fk_support_ticket_attachments_ticket_id_tickets | `ticket_id` | [`support.tickets`](../../Tables/support/tickets.md) | `FOREIGN KEY (ticket_id) REFERENCES support.tickets(id) ON DELETE CASCADE` |
| fk_support_ticket_attachments_ticket_id_tickets_numeric | `ticket_id_internal_id` | [`support.tickets`](../../Tables/support/tickets.md) | `FOREIGN KEY (ticket_id_internal_id) REFERENCES support.tickets(internal_id) ON DELETE CASCADE` |
| fk_support_ticket_attachments_ticket_message_id_ticket__7442 | `ticket_message_id_internal_id` | [`support.ticket_messages`](../../Tables/support/ticket_messages.md) | `FOREIGN KEY (ticket_message_id_internal_id) REFERENCES support.ticket_messages(internal_id) ON DELETE CASCADE` |
| fk_support_ticket_attachments_ticket_message_id_ticket_messages | `ticket_message_id` | [`support.ticket_messages`](../../Tables/support/ticket_messages.md) | `FOREIGN KEY (ticket_message_id) REFERENCES support.ticket_messages(id) ON DELETE CASCADE` |
| fk_support_ticket_attachments_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `support.ticket_attachments` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_support_ticket_attachments_created_by_users` |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_support_ticket_attachments_file_object_id_file_objec_8e8b` |
| `file_object_id` | `platform.file_objects` | `fk_support_ticket_attachments_file_object_id_file_objects` |
| `ticket_id` | `support.tickets` | `fk_support_ticket_attachments_ticket_id_tickets` |
| `ticket_id_internal_id` | `support.tickets` | `fk_support_ticket_attachments_ticket_id_tickets_numeric` |
| `ticket_message_id_internal_id` | `support.ticket_messages` | `fk_support_ticket_attachments_ticket_message_id_ticket__7442` |
| `ticket_message_id` | `support.ticket_messages` | `fk_support_ticket_attachments_ticket_message_id_ticket_messages` |
| `updated_by` | `identity.users` | `fk_support_ticket_attachments_updated_by_users` |

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
| `ticket_attachments_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `ticket_attachments_file_object_id_internal_id_not_null` | NOT NULL | `NOT NULL file_object_id_internal_id` |
| `ticket_attachments_file_object_id_not_null` | NOT NULL | `NOT NULL file_object_id` |
| `ticket_attachments_id_not_null` | NOT NULL | `NOT NULL id` |
| `ticket_attachments_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `ticket_attachments_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `ticket_attachments_ticket_id_internal_id_not_null` | NOT NULL | `NOT NULL ticket_id_internal_id` |
| `ticket_attachments_ticket_id_not_null` | NOT NULL | `NOT NULL ticket_id` |
| `ticket_attachments_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_support_ticket_attachments_file` | btree | `(file_object_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_support_ticket_attachments_file ON support.ticket_attachments USING btree (file_object_id)` |
| `ix_support_ticket_attachments_message` | btree | `(ticket_message_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_support_ticket_attachments_message ON support.ticket_attachments USING btree (ticket_message_id)` |
| `pk_support_ticket_attachments` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_support_ticket_attachments ON support.ticket_attachments USING btree (internal_id)` |
| `ticket_attachment_file` | btree | `(file_object_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX ticket_attachment_file ON support.ticket_attachments USING btree (file_object_id)` |
| `uq_support_ticket_attachments_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_support_ticket_attachments_id ON support.ticket_attachments USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON support.ticket_attachments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"],["ticket_id","ticket_id_internal_id","support","tickets"],["ticket_message_id","ticket_message_id_internal_id","support","ticket_messages"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON support.ticket_attachments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON support.ticket_attachments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"],["ticket_id","ticket_id_internal_id","support","tickets"],["ticket_message_id","ticket_message_id_internal_id","support","ticket_messages"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
