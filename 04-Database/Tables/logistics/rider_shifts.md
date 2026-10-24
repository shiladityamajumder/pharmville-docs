# `logistics.rider_shifts`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds rider shifts records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | logistics.rider_shifts |
| Classification | Transactional |
| Proposed business write owner | Delivery_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | id |
| Structural counts | 6 columns; 4 PK/FK/UQ/CHECK/exclusion constraints; 5 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `ended_at` | `timestamp with time zone` | Yes | — | Time of ended | Support chronology, deadlines or audit evidence | Exact constraints below |
| `id` | `bigint` | No | — | Internal numeric primary key | Uniquely identifies a master or newer table row | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `rider_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_rider_shifts_rider_user_id_users` |
| `started_at` | `timestamp with time zone` | No | `now()` | Time of started | Support chronology, deadlines or audit evidence | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |

## Record lifecycle and users

- **Created:** when the rider shifts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.rider_shifts` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_logistics_rider_shifts_rider_user_id_users | `rider_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (rider_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`logistics.delivery_location_updates`](../../Tables/logistics/delivery_location_updates.md) | fk_logistics_location_shift_rider | `shift_id, delivery_user_id` | `id, rider_user_id` |

## `logistics.rider_shifts` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `rider_user_id` | `identity.users` | `fk_logistics_rider_shifts_rider_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_rider_shifts_valid_period` | CHECK | `CHECK (ended_at IS NULL OR ended_at > started_at)` |
| `fk_logistics_rider_shifts_rider_user_id_users` | FOREIGN KEY | `FOREIGN KEY (rider_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_logistics_rider_shifts` | PRIMARY KEY | `PRIMARY KEY (id)` |
| `uq_logistics_rider_shifts_id_user` | UNIQUE | `UNIQUE (id, rider_user_id)` |
| `rider_shifts_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `rider_shifts_id_not_null` | NOT NULL | `NOT NULL id` |
| `rider_shifts_rider_user_id_not_null` | NOT NULL | `NOT NULL rider_user_id` |
| `rider_shifts_started_at_not_null` | NOT NULL | `NOT NULL started_at` |
| `rider_shifts_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_logistics_rider_shifts_user_time` | btree | `(rider_user_id, started_at DESC)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_rider_shifts_user_time ON logistics.rider_shifts USING btree (rider_user_id, started_at DESC)` |
| `pk_logistics_rider_shifts` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_logistics_rider_shifts ON logistics.rider_shifts USING btree (id)` |
| `uq_logistics_rider_shifts_id_user` | btree | `(id, rider_user_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_rider_shifts_id_user ON logistics.rider_shifts USING btree (id, rider_user_id)` |
| `uq_logistics_rider_shifts_one_open` | btree | `(rider_user_id)` | ended_at IS NULL | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_rider_shifts_one_open ON logistics.rider_shifts USING btree (rider_user_id) WHERE ended_at IS NULL` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.rider_shifts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'id', '')` | O |
| `rider_shift_guard` | `CREATE TRIGGER rider_shift_guard BEFORE INSERT OR DELETE OR UPDATE ON logistics.rider_shifts FOR EACH ROW EXECUTE FUNCTION logistics.guard_shift()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.rider_shifts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('timestamp')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.rider_shifts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'id', '')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
