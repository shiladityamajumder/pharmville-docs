# support.ticket_status_history

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds ticket status history records within the support domain (customer support case records). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 9 columns, 6 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `actor_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_support_ticket_status_history_actor_user_id_users) |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `from_status` | `character varying(32)` | Yes | — | Inferred: stores from status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `reason` | `text` | Yes | — | Inferred: stores reason for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `ticket_id` | `uuid` | No | — | Reference linking this record to tickets | Ensures related business data can be joined and validated | FK → `support.tickets` (fk_support_ticket_status_history_ticket_id_tickets) |
| `ticket_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `support.tickets` (fk_support_ticket_status_history_ticket_id_tickets_numeric); Numeric/public-key pair verification required |
| `to_status` | `character varying(32)` | No | — | Inferred: stores to status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the ticket status history business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `support.ticket_status_history` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `actor_user_id` → `identity.users(id)` via `fk_support_ticket_status_history_actor_user_id_users`; FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `ticket_id` → `support.tickets(id)` via `fk_support_ticket_status_history_ticket_id_tickets`; FOREIGN KEY (ticket_id) REFERENCES support.tickets(id) ON DELETE CASCADE
- `ticket_id_internal_id` → `support.tickets(internal_id)` via `fk_support_ticket_status_history_ticket_id_tickets_numeric`; FOREIGN KEY (ticket_id_internal_id) REFERENCES support.tickets(internal_id) ON DELETE CASCADE

## support.ticket_status_history — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 9 columns, 6 constraints, 3 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `actor_user_id` | `identity.users` | `fk_support_ticket_status_history_actor_user_id_users` |
| `ticket_id` | `support.tickets` | `fk_support_ticket_status_history_ticket_id_tickets` |
| `ticket_id_internal_id` | `support.tickets` | `fk_support_ticket_status_history_ticket_id_tickets_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_support_ticket_status_history_numeric_pair_ticket_id` | CHECK | `CHECK ((ticket_id IS NULL) = (ticket_id_internal_id IS NULL))` |
| `fk_support_ticket_status_history_actor_user_id_users` | FOREIGN KEY | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_support_ticket_status_history_ticket_id_tickets` | FOREIGN KEY | `FOREIGN KEY (ticket_id) REFERENCES support.tickets(id) ON DELETE CASCADE` |
| `fk_support_ticket_status_history_ticket_id_tickets_numeric` | FOREIGN KEY | `FOREIGN KEY (ticket_id_internal_id) REFERENCES support.tickets(internal_id) ON DELETE CASCADE` |
| `pk_support_ticket_status_history` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_support_ticket_status_history_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_support_ticket_status_history_ticket_time` | `CREATE INDEX ix_support_ticket_status_history_ticket_time ON support.ticket_status_history USING btree (ticket_id, created_at)` |
| `pk_support_ticket_status_history` | `CREATE UNIQUE INDEX pk_support_ticket_status_history ON support.ticket_status_history USING btree (internal_id)` |
| `uq_support_ticket_status_history_id` | `CREATE UNIQUE INDEX uq_support_ticket_status_history_id ON support.ticket_status_history USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON support.ticket_status_history FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["ticket_id","ticket_id_internal_id","support","tickets"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON support.ticket_status_history FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON support.ticket_status_history FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["ticket_id","ticket_id_internal_id","support","tickets"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
