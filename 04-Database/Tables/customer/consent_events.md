# `customer.consent_events`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds consent events records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | customer.consent_events |
| Classification | Audit / History |
| Proposed business write owner | Customer_Accounts |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 9 columns; 6 PK/FK/UQ/CHECK/exclusion constraints; 7 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `actor_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_consent_events_actor_user_id_users` |
| `consent_id` | `uuid` | No | — | Reference linking this record to consents | Ensures related business data can be joined and validated | FK → `customer.consents` via `fk_customer_consent_events_consent_id_consents` |
| `consent_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `customer.consents` via `fk_customer_consent_events_consent_id_consents_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `event_type` | `character varying(32)` | No | — | Inferred: stores event type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | Exact constraints below |
| `request_id` | `uuid` | Yes | — | Identifier associated with request | Link the event or entity to its subject; verify constraints | Exact constraints below |

## Record lifecycle and users

- **Created:** when the consent events business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Cart_Checkout, Prescription_Upload. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `customer.consent_events` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_customer_consent_events_actor_user_id_users | `actor_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_customer_consent_events_consent_id_consents | `consent_id` | [`customer.consents`](../../Tables/customer/consents.md) | `FOREIGN KEY (consent_id) REFERENCES customer.consents(id) ON DELETE CASCADE` |
| fk_customer_consent_events_consent_id_consents_numeric | `consent_id_internal_id` | [`customer.consents`](../../Tables/customer/consents.md) | `FOREIGN KEY (consent_id_internal_id) REFERENCES customer.consents(internal_id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `customer.consent_events` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `actor_user_id` | `identity.users` | `fk_customer_consent_events_actor_user_id_users` |
| `consent_id` | `customer.consents` | `fk_customer_consent_events_consent_id_consents` |
| `consent_id_internal_id` | `customer.consents` | `fk_customer_consent_events_consent_id_consents_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_customer_consent_events_numeric_pair_consent_id` | CHECK | `CHECK ((consent_id IS NULL) = (consent_id_internal_id IS NULL))` |
| `fk_customer_consent_events_actor_user_id_users` | FOREIGN KEY | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_consent_events_consent_id_consents` | FOREIGN KEY | `FOREIGN KEY (consent_id) REFERENCES customer.consents(id) ON DELETE CASCADE` |
| `fk_customer_consent_events_consent_id_consents_numeric` | FOREIGN KEY | `FOREIGN KEY (consent_id_internal_id) REFERENCES customer.consents(internal_id) ON DELETE CASCADE` |
| `pk_customer_consent_events` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_customer_consent_events_id` | UNIQUE | `UNIQUE (id)` |
| `consent_events_consent_id_internal_id_not_null` | NOT NULL | `NOT NULL consent_id_internal_id` |
| `consent_events_consent_id_not_null` | NOT NULL | `NOT NULL consent_id` |
| `consent_events_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `consent_events_event_type_not_null` | NOT NULL | `NOT NULL event_type` |
| `consent_events_id_not_null` | NOT NULL | `NOT NULL id` |
| `consent_events_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `consent_events_metadata_json_not_null` | NOT NULL | `NOT NULL metadata_json` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_customer_consent_events_consent_id_created_at` | btree | `(consent_id, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_customer_consent_events_consent_id_created_at ON customer.consent_events USING btree (consent_id, created_at)` |
| `pk_customer_consent_events` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_customer_consent_events ON customer.consent_events USING btree (internal_id)` |
| `uq_customer_consent_events_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_customer_consent_events_id ON customer.consent_events USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON customer.consent_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["consent_id","consent_id_internal_id","customer","consents"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON customer.consent_events FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON customer.consent_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["consent_id","consent_id_internal_id","customer","consents"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
