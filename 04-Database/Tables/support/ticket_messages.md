# `support.ticket_messages`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds ticket messages records within the support domain (customer support case records). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 9 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `author_type` | `character varying(32)` | No | — | Inferred: stores author type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `author_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_support_ticket_messages_author_user_id_users) |
| `body` | `text` | No | — | Inferred: stores body for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `channel` | `character varying(32)` | No | `'in_app'::character varying` | Inferred: stores channel for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_support_ticket_messages_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_internal` | `boolean` | No | `false` | Yes/no flag for is internal | Control conditional business behavior | See exact constraints |
| `message_type` | `character varying(32)` | No | — | Inferred: stores message type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `ticket_id` | `uuid` | No | — | Reference linking this record to tickets | Ensures related business data can be joined and validated | FK → `support.tickets` (fk_support_ticket_messages_ticket_id_tickets) |
| `ticket_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `support.tickets` (fk_support_ticket_messages_ticket_id_tickets_numeric); Numeric/public-key pair verification required |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_support_ticket_messages_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the ticket messages business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `support.ticket_messages` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `author_user_id` → `identity.users(id)` via `fk_support_ticket_messages_author_user_id_users`; `FOREIGN KEY (author_user_id) REFERENCES identity.users(id) ON DELETE SET NULL`
- `created_by` → `identity.users(id)` via `fk_support_ticket_messages_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_support_ticket_messages_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `ticket_id` → `support.tickets(id)` via `fk_support_ticket_messages_ticket_id_tickets`; `FOREIGN KEY (ticket_id) REFERENCES support.tickets(id) ON DELETE CASCADE`
- `ticket_id_internal_id` → `support.tickets(internal_id)` via `fk_support_ticket_messages_ticket_id_tickets_numeric`; `FOREIGN KEY (ticket_id_internal_id) REFERENCES support.tickets(internal_id) ON DELETE CASCADE`

**Referenced by 2 FK constraints** (sample): `support.ticket_attachments`, `support.ticket_attachments`.

## `support.ticket_messages` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 15 columns, 9 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `author_user_id` | `identity.users` | `fk_support_ticket_messages_author_user_id_users` |
| `created_by` | `identity.users` | `fk_support_ticket_messages_created_by_users` |
| `updated_by` | `identity.users` | `fk_support_ticket_messages_updated_by_users` |
| `ticket_id` | `support.tickets` | `fk_support_ticket_messages_ticket_id_tickets` |
| `ticket_id_internal_id` | `support.tickets` | `fk_support_ticket_messages_ticket_id_tickets_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_support_ticket_messages_numeric_pair_ticket_id` | CHECK | `CHECK ((ticket_id IS NULL) = (ticket_id_internal_id IS NULL))` |
| `ck_support_ticket_messages_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_support_ticket_messages_author_user_id_users` | FOREIGN KEY | `FOREIGN KEY (author_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_support_ticket_messages_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_support_ticket_messages_ticket_id_tickets` | FOREIGN KEY | `FOREIGN KEY (ticket_id) REFERENCES support.tickets(id) ON DELETE CASCADE` |
| `fk_support_ticket_messages_ticket_id_tickets_numeric` | FOREIGN KEY | `FOREIGN KEY (ticket_id_internal_id) REFERENCES support.tickets(internal_id) ON DELETE CASCADE` |
| `fk_support_ticket_messages_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_support_ticket_messages` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_support_ticket_messages_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_support_ticket_messages_author` | `CREATE INDEX ix_support_ticket_messages_author ON support.ticket_messages USING btree (author_user_id)` |
| `ix_support_ticket_messages_ticket_time` | `CREATE INDEX ix_support_ticket_messages_ticket_time ON support.ticket_messages USING btree (ticket_id, created_at)` |
| `pk_support_ticket_messages` | `CREATE UNIQUE INDEX pk_support_ticket_messages ON support.ticket_messages USING btree (internal_id)` |
| `uq_support_ticket_messages_id` | `CREATE UNIQUE INDEX uq_support_ticket_messages_id ON support.ticket_messages USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON support.ticket_messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["ticket_id","ticket_id_internal_id","support","tickets"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON support.ticket_messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON support.ticket_messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["ticket_id","ticket_id_internal_id","support","tickets"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
