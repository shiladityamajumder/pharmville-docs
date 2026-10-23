# support.tickets

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds tickets records within the support domain (customer support case records). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 30 columns, 21 constraints, 7 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `appointment_id` | `uuid` | Yes | — | Reference linking this record to appointments | Ensures related business data can be joined and validated | FK → `appointment.appointments` (fk_support_tickets_appointment_id_appointments) |
| `appointment_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.appointments` (fk_support_tickets_appointment_id_appointments_numeric); Numeric/public-key pair verification required |
| `assigned_team` | `character varying(64)` | Yes | — | Inferred: stores assigned team for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `assigned_to_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_support_tickets_assigned_to_user_id_users) |
| `category` | `character varying(64)` | No | — | Inferred: stores category for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `closed_at` | `timestamp with time zone` | Yes | — | Time of closed | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_support_tickets_created_by_users) |
| `description` | `text` | No | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `diagnostic_order_id` | `uuid` | Yes | — | Reference linking this record to diagnostic orders | Ensures related business data can be joined and validated | FK → `diagnostics.diagnostic_orders` (fk_support_tickets_diagnostic_order_id_diagnostic_orders) |
| `diagnostic_order_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.diagnostic_orders` (fk_support_tickets_diagnostic_order_id_diagnostic_order_e812); Numeric/public-key pair verification required |
| `first_responded_at` | `timestamp with time zone` | Yes | — | Time of first responded | Support chronology, deadlines or audit evidence | See exact constraints |
| `first_response_due_at` | `timestamp with time zone` | Yes | — | Time of first response due | Support chronology, deadlines or audit evidence | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `order_id` | `uuid` | Yes | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` (fk_support_tickets_order_id_orders) |
| `order_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` (fk_support_tickets_order_id_orders_numeric); Numeric/public-key pair verification required |
| `priority` | `character varying(16)` | No | — | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `resolution_due_at` | `timestamp with time zone` | Yes | — | Time of resolution due | Support chronology, deadlines or audit evidence | See exact constraints |
| `resolved_at` | `timestamp with time zone` | Yes | — | Time of resolved | Support chronology, deadlines or audit evidence | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `sla_policy_id` | `uuid` | Yes | — | Reference linking this record to sla policies | Ensures related business data can be joined and validated | FK → `support.sla_policies` (fk_support_tickets_sla_policy_id_sla_policies) |
| `sla_policy_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `support.sla_policies` (fk_support_tickets_sla_policy_id_sla_policies_numeric); Numeric/public-key pair verification required |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `subcategory` | `character varying(64)` | Yes | — | Inferred: stores subcategory for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `subject` | `character varying(255)` | No | — | Inferred: stores subject for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `ticket_number` | `character varying(64)` | No | — | Inferred: stores ticket number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_support_tickets_updated_by_users) |
| `user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_support_tickets_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the tickets business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `support.tickets` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_support_tickets_user_id_users`; FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE SET NULL
- `assigned_to_user_id` → `identity.users(id)` via `fk_support_tickets_assigned_to_user_id_users`; FOREIGN KEY (assigned_to_user_id) REFERENCES identity.users(id) ON DELETE SET NULL
- `created_by` → `identity.users(id)` via `fk_support_tickets_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_support_tickets_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `sla_policy_id` → `support.sla_policies(id)` via `fk_support_tickets_sla_policy_id_sla_policies`; FOREIGN KEY (sla_policy_id) REFERENCES support.sla_policies(id) ON DELETE SET NULL
- `appointment_id` → `appointment.appointments(id)` via `fk_support_tickets_appointment_id_appointments`; FOREIGN KEY (appointment_id) REFERENCES appointment.appointments(id) ON DELETE SET NULL
- `diagnostic_order_id` → `diagnostics.diagnostic_orders(id)` via `fk_support_tickets_diagnostic_order_id_diagnostic_orders`; FOREIGN KEY (diagnostic_order_id) REFERENCES diagnostics.diagnostic_orders(id) ON DELETE SET NULL
- `order_id` → `commerce.orders(id)` via `fk_support_tickets_order_id_orders`; FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE SET NULL
- `appointment_id_internal_id` → `appointment.appointments(internal_id)` via `fk_support_tickets_appointment_id_appointments_numeric`; FOREIGN KEY (appointment_id_internal_id) REFERENCES appointment.appointments(internal_id) ON DELETE SET NULL
- `diagnostic_order_id_internal_id` → `diagnostics.diagnostic_orders(internal_id)` via `fk_support_tickets_diagnostic_order_id_diagnostic_order_e812`; FOREIGN KEY (diagnostic_order_id_internal_id) REFERENCES diagnostics.diagnostic_orders(internal_id) ON DELETE SET NULL
- `order_id_internal_id` → `commerce.orders(internal_id)` via `fk_support_tickets_order_id_orders_numeric`; FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE SET NULL
- `sla_policy_id_internal_id` → `support.sla_policies(internal_id)` via `fk_support_tickets_sla_policy_id_sla_policies_numeric`; FOREIGN KEY (sla_policy_id_internal_id) REFERENCES support.sla_policies(internal_id) ON DELETE SET NULL

**Referenced by 10 FK constraints** (sample): `support.ticket_messages`, `support.ticket_attachments`, `support.ticket_actions`, `support.ticket_status_history`, `support.ticket_tag_assignments`, `support.ticket_actions`, `support.ticket_attachments`, `support.ticket_messages`, `support.ticket_status_history`, `support.ticket_tag_assignments`.

## support.tickets — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 30 columns, 21 constraints, 7 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_support_tickets_user_id_users` |
| `assigned_to_user_id` | `identity.users` | `fk_support_tickets_assigned_to_user_id_users` |
| `created_by` | `identity.users` | `fk_support_tickets_created_by_users` |
| `updated_by` | `identity.users` | `fk_support_tickets_updated_by_users` |
| `sla_policy_id` | `support.sla_policies` | `fk_support_tickets_sla_policy_id_sla_policies` |
| `appointment_id` | `appointment.appointments` | `fk_support_tickets_appointment_id_appointments` |
| `diagnostic_order_id` | `diagnostics.diagnostic_orders` | `fk_support_tickets_diagnostic_order_id_diagnostic_orders` |
| `order_id` | `commerce.orders` | `fk_support_tickets_order_id_orders` |
| `appointment_id_internal_id` | `appointment.appointments` | `fk_support_tickets_appointment_id_appointments_numeric` |
| `diagnostic_order_id_internal_id` | `diagnostics.diagnostic_orders` | `fk_support_tickets_diagnostic_order_id_diagnostic_order_e812` |
| `order_id_internal_id` | `commerce.orders` | `fk_support_tickets_order_id_orders_numeric` |
| `sla_policy_id_internal_id` | `support.sla_policies` | `fk_support_tickets_sla_policy_id_sla_policies_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_support_tickets_numeric_pair_appointment_id` | CHECK | `CHECK ((appointment_id IS NULL) = (appointment_id_internal_id IS NULL))` |
| `ck_support_tickets_numeric_pair_diagnostic_order_id` | CHECK | `CHECK ((diagnostic_order_id IS NULL) = (diagnostic_order_id_internal_id IS NULL))` |
| `ck_support_tickets_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_support_tickets_numeric_pair_sla_policy_id` | CHECK | `CHECK ((sla_policy_id IS NULL) = (sla_policy_id_internal_id IS NULL))` |
| `ck_support_tickets_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_support_tickets_ticketstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['open'::text, 'pending_customer'::text, 'pending_internal'::text, 'resolved'::text, 'closed'::text, 'reopened'::text]))` |
| `fk_support_tickets_appointment_id_appointments` | FOREIGN KEY | `FOREIGN KEY (appointment_id) REFERENCES appointment.appointments(id) ON DELETE SET NULL` |
| `fk_support_tickets_appointment_id_appointments_numeric` | FOREIGN KEY | `FOREIGN KEY (appointment_id_internal_id) REFERENCES appointment.appointments(internal_id) ON DELETE SET NULL` |
| `fk_support_tickets_assigned_to_user_id_users` | FOREIGN KEY | `FOREIGN KEY (assigned_to_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_support_tickets_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_support_tickets_diagnostic_order_id_diagnostic_order_e812` | FOREIGN KEY | `FOREIGN KEY (diagnostic_order_id_internal_id) REFERENCES diagnostics.diagnostic_orders(internal_id) ON DELETE SET NULL` |
| `fk_support_tickets_diagnostic_order_id_diagnostic_orders` | FOREIGN KEY | `FOREIGN KEY (diagnostic_order_id) REFERENCES diagnostics.diagnostic_orders(id) ON DELETE SET NULL` |
| `fk_support_tickets_order_id_orders` | FOREIGN KEY | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE SET NULL` |
| `fk_support_tickets_order_id_orders_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE SET NULL` |
| `fk_support_tickets_sla_policy_id_sla_policies` | FOREIGN KEY | `FOREIGN KEY (sla_policy_id) REFERENCES support.sla_policies(id) ON DELETE SET NULL` |
| `fk_support_tickets_sla_policy_id_sla_policies_numeric` | FOREIGN KEY | `FOREIGN KEY (sla_policy_id_internal_id) REFERENCES support.sla_policies(internal_id) ON DELETE SET NULL` |
| `fk_support_tickets_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_support_tickets_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `pk_support_tickets` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `ticket_number` | UNIQUE | `UNIQUE (ticket_number)` |
| `uq_support_tickets_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_support_tickets_assignee` | `CREATE INDEX ix_support_tickets_assignee ON support.tickets USING btree (assigned_to_user_id)` |
| `ix_support_tickets_order` | `CREATE INDEX ix_support_tickets_order ON support.tickets USING btree (order_id)` |
| `ix_support_tickets_status_priority` | `CREATE INDEX ix_support_tickets_status_priority ON support.tickets USING btree (status, priority)` |
| `ix_support_tickets_user` | `CREATE INDEX ix_support_tickets_user ON support.tickets USING btree (user_id)` |
| `pk_support_tickets` | `CREATE UNIQUE INDEX pk_support_tickets ON support.tickets USING btree (internal_id)` |
| `ticket_number` | `CREATE UNIQUE INDEX ticket_number ON support.tickets USING btree (ticket_number)` |
| `uq_support_tickets_id` | `CREATE UNIQUE INDEX uq_support_tickets_id ON support.tickets USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON support.tickets FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["appointment_id","appointment_id_internal_id","appointment","appointments"],["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"],["order_id","order_id_internal_id","commerce","orders"],["sla_policy_id","sla_policy_id_internal_id","support","sla_policies"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON support.tickets FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON support.tickets FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["appointment_id","appointment_id_internal_id","appointment","appointments"],["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"],["order_id","order_id_internal_id","commerce","orders"],["sla_policy_id","sla_policy_id_internal_id","support","sla_policies"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
