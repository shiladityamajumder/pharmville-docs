# `customer.consents`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds consents records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 9 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `consent_type` | `character varying(64)` | No | — | Inferred: stores consent type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_customer_consents_created_by_users) |
| `evidence` | `jsonb` | No | `'{}'::jsonb` | Structured evidence information | Retain a versioned payload or relevant details | See exact constraints |
| `expires_at` | `timestamp with time zone` | Yes | — | Expiration time | Determine validity windows | See exact constraints |
| `granted_at` | `timestamp with time zone` | Yes | — | Time of granted | Support chronology, deadlines or audit evidence | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `purpose` | `character varying(128)` | No | — | Inferred: stores purpose for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `source` | `character varying(32)` | No | — | Inferred: stores source for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_customer_consents_updated_by_users) |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_customer_consents_user_id_users) |
| `version` | `character varying(32)` | No | — | Inferred: stores version for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `withdrawn_at` | `timestamp with time zone` | Yes | — | Time of withdrawn | Support chronology, deadlines or audit evidence | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the consents business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Cart_Checkout, Prescription_Upload. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `customer.consents` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_customer_consents_user_id_users`; `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE`
- `created_by` → `identity.users(id)` via `fk_customer_consents_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_customer_consents_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

**Referenced by 2 FK constraints** (sample): `customer.consent_events`, `customer.consent_events`.

## `customer.consents` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 17 columns, 9 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_customer_consents_user_id_users` |
| `created_by` | `identity.users` | `fk_customer_consents_created_by_users` |
| `updated_by` | `identity.users` | `fk_customer_consents_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_customer_consents_consentstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['requested'::text, 'granted'::text, 'denied'::text, 'revoked'::text, 'expired'::text]))` |
| `ck_customer_consents_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_customer_consents_withdrawn_after_granted` | CHECK | `CHECK (withdrawn_at IS NULL OR granted_at IS NULL OR withdrawn_at >= granted_at)` |
| `fk_customer_consents_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_consents_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_consents_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_customer_consents` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_customer_consents_id` | UNIQUE | `UNIQUE (id)` |
| `user_consent_version` | UNIQUE | `UNIQUE (user_id, consent_type, version, purpose)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_customer_consents_status` | `CREATE INDEX ix_customer_consents_status ON customer.consents USING btree (status)` |
| `ix_customer_consents_user_id` | `CREATE INDEX ix_customer_consents_user_id ON customer.consents USING btree (user_id)` |
| `pk_customer_consents` | `CREATE UNIQUE INDEX pk_customer_consents ON customer.consents USING btree (internal_id)` |
| `uq_customer_consents_id` | `CREATE UNIQUE INDEX uq_customer_consents_id ON customer.consents USING btree (id)` |
| `user_consent_version` | `CREATE UNIQUE INDEX user_consent_version ON customer.consents USING btree (user_id, consent_type, version, purpose)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON customer.consents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON customer.consents FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON customer.consents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
