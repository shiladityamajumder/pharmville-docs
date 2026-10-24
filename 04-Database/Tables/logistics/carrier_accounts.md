# `logistics.carrier_accounts`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds carrier accounts records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | logistics.carrier_accounts |
| Classification | Configuration |
| Proposed business write owner | Delivery_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 16 columns; 11 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `account_code` | `character varying(64)` | No | — | Code for account | Link to controlled business classification or an external reference | Collation: default |
| `carrier_id` | `uuid` | No | — | Reference linking this record to carriers | Ensures related business data can be joined and validated | FK → `logistics.carriers` via `fk_logistics_carrier_accounts_carrier_id_carriers` |
| `carrier_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.carriers` via `fk_logistics_carrier_accounts_carrier_id_carriers_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_carrier_accounts_created_by_users` |
| `credentials_secret_ref` | `character varying(255)` | No | — | Inferred: stores credentials secret ref for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_carrier_accounts_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `service_types` | `jsonb` | No | `'[]'::jsonb` | Structured service types information | Retain a versioned payload or relevant details | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_carrier_accounts_updated_by_users` |

## Record lifecycle and users

- **Created:** when the carrier accounts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.carrier_accounts` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_logistics_carrier_accounts_carrier_id_carriers | `carrier_id` | [`logistics.carriers`](../../Tables/logistics/carriers.md) | `FOREIGN KEY (carrier_id) REFERENCES logistics.carriers(id) ON DELETE CASCADE` |
| fk_logistics_carrier_accounts_carrier_id_carriers_numeric | `carrier_id_internal_id` | [`logistics.carriers`](../../Tables/logistics/carriers.md) | `FOREIGN KEY (carrier_id_internal_id) REFERENCES logistics.carriers(internal_id) ON DELETE CASCADE` |
| fk_logistics_carrier_accounts_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_logistics_carrier_accounts_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_logistics_carrier_accounts_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`logistics.shipments`](../../Tables/logistics/shipments.md) | fk_logistics_shipments_carrier_account_id_carrier_accou_456d | `carrier_account_id_internal_id` | `internal_id` |
| [`logistics.shipments`](../../Tables/logistics/shipments.md) | fk_logistics_shipments_carrier_account_id_carrier_accounts | `carrier_account_id` | `id` |

## `logistics.carrier_accounts` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `carrier_id` | `logistics.carriers` | `fk_logistics_carrier_accounts_carrier_id_carriers` |
| `carrier_id_internal_id` | `logistics.carriers` | `fk_logistics_carrier_accounts_carrier_id_carriers_numeric` |
| `created_by` | `identity.users` | `fk_logistics_carrier_accounts_created_by_users` |
| `deleted_by` | `identity.users` | `fk_logistics_carrier_accounts_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_logistics_carrier_accounts_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `carrier_account` | UNIQUE | `UNIQUE (carrier_id, account_code)` |
| `ck_logistics_carrier_accounts_numeric_pair_carrier_id` | CHECK | `CHECK ((carrier_id IS NULL) = (carrier_id_internal_id IS NULL))` |
| `ck_logistics_carrier_accounts_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_logistics_carrier_accounts_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(account_code::text)) > 0 AND account_code::text = btrim(account_code::text))` |
| `fk_logistics_carrier_accounts_carrier_id_carriers` | FOREIGN KEY | `FOREIGN KEY (carrier_id) REFERENCES logistics.carriers(id) ON DELETE CASCADE` |
| `fk_logistics_carrier_accounts_carrier_id_carriers_numeric` | FOREIGN KEY | `FOREIGN KEY (carrier_id_internal_id) REFERENCES logistics.carriers(internal_id) ON DELETE CASCADE` |
| `fk_logistics_carrier_accounts_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_carrier_accounts_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_carrier_accounts_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_logistics_carrier_accounts` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_logistics_carrier_accounts_id` | UNIQUE | `UNIQUE (id)` |
| `carrier_accounts_account_code_not_null` | NOT NULL | `NOT NULL account_code` |
| `carrier_accounts_carrier_id_internal_id_not_null` | NOT NULL | `NOT NULL carrier_id_internal_id` |
| `carrier_accounts_carrier_id_not_null` | NOT NULL | `NOT NULL carrier_id` |
| `carrier_accounts_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `carrier_accounts_credentials_secret_ref_not_null` | NOT NULL | `NOT NULL credentials_secret_ref` |
| `carrier_accounts_id_not_null` | NOT NULL | `NOT NULL id` |
| `carrier_accounts_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `carrier_accounts_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `carrier_accounts_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `carrier_accounts_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `carrier_accounts_service_types_not_null` | NOT NULL | `NOT NULL service_types` |
| `carrier_accounts_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `carrier_account` | btree | `(carrier_id, account_code)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX carrier_account ON logistics.carrier_accounts USING btree (carrier_id, account_code)` |
| `ix_logistics_carrier_accounts_carrier` | btree | `(carrier_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_carrier_accounts_carrier ON logistics.carrier_accounts USING btree (carrier_id)` |
| `pk_logistics_carrier_accounts` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_logistics_carrier_accounts ON logistics.carrier_accounts USING btree (internal_id)` |
| `uq_logistics_carrier_accounts_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_carrier_accounts_id ON logistics.carrier_accounts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.carrier_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_id","carrier_id_internal_id","logistics","carriers"]]', 'internal_id', 'id')` | O |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON logistics.carrier_accounts FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('account_code', '["carrier_id"]')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.carrier_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.carrier_accounts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_id","carrier_id_internal_id","logistics","carriers"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
