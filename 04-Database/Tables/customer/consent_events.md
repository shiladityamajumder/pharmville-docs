# customer.consent_events

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds consent events records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 9 columns, 6 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `actor_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_customer_consent_events_actor_user_id_users) |
| `consent_id` | `uuid` | No | — | Reference linking this record to consents | Ensures related business data can be joined and validated | FK → `customer.consents` (fk_customer_consent_events_consent_id_consents) |
| `consent_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `customer.consents` (fk_customer_consent_events_consent_id_consents_numeric); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `event_type` | `character varying(32)` | No | — | Inferred: stores event type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | See exact constraints |
| `request_id` | `uuid` | Yes | — | Identifier associated with request | Link the event or entity to its subject; verify constraints | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the consent events business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Cart_Checkout, Prescription_Upload. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `customer.consent_events` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `actor_user_id` → `identity.users(id)` via `fk_customer_consent_events_actor_user_id_users`; FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `consent_id` → `customer.consents(id)` via `fk_customer_consent_events_consent_id_consents`; FOREIGN KEY (consent_id) REFERENCES customer.consents(id) ON DELETE CASCADE
- `consent_id_internal_id` → `customer.consents(internal_id)` via `fk_customer_consent_events_consent_id_consents_numeric`; FOREIGN KEY (consent_id_internal_id) REFERENCES customer.consents(internal_id) ON DELETE CASCADE

## customer.consent_events — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 9 columns, 6 constraints, 3 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `actor_user_id` | `identity.users` | `fk_customer_consent_events_actor_user_id_users` |
| `consent_id` | `customer.consents` | `fk_customer_consent_events_consent_id_consents` |
| `consent_id_internal_id` | `customer.consents` | `fk_customer_consent_events_consent_id_consents_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_customer_consent_events_numeric_pair_consent_id` | CHECK | `CHECK ((consent_id IS NULL) = (consent_id_internal_id IS NULL))` |
| `fk_customer_consent_events_actor_user_id_users` | FOREIGN KEY | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_consent_events_consent_id_consents` | FOREIGN KEY | `FOREIGN KEY (consent_id) REFERENCES customer.consents(id) ON DELETE CASCADE` |
| `fk_customer_consent_events_consent_id_consents_numeric` | FOREIGN KEY | `FOREIGN KEY (consent_id_internal_id) REFERENCES customer.consents(internal_id) ON DELETE CASCADE` |
| `pk_customer_consent_events` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_customer_consent_events_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_customer_consent_events_consent_id_created_at` | `CREATE INDEX ix_customer_consent_events_consent_id_created_at ON customer.consent_events USING btree (consent_id, created_at)` |
| `pk_customer_consent_events` | `CREATE UNIQUE INDEX pk_customer_consent_events ON customer.consent_events USING btree (internal_id)` |
| `uq_customer_consent_events_id` | `CREATE UNIQUE INDEX uq_customer_consent_events_id ON customer.consent_events USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON customer.consent_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["consent_id","consent_id_internal_id","customer","consents"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON customer.consent_events FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON customer.consent_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["consent_id","consent_id_internal_id","customer","consents"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
