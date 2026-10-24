# `customer.addresses`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds addresses records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | customer.addresses |
| Classification | Transactional |
| Proposed business write owner | Customer_Accounts |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 30 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 16 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `city` | `character varying(100)` | No | — | Inferred: stores city for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `country_code` | `character varying(2)` | No | `'IN'::character varying` | Code for country | Link to controlled business classification or an external reference | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_addresses_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_addresses_deleted_by_users` |
| `district` | `character varying(100)` | Yes | — | Inferred: stores district for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_default` | `boolean` | No | `false` | Yes/no flag for is default | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `label` | `character varying(64)` | Yes | — | Inferred: stores label for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `landmark` | `character varying(255)` | Yes | — | Inferred: stores landmark for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `latitude` | `numeric(10,7)` | Yes | — | Inferred: stores latitude for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `line1` | `character varying(255)` | No | — | Inferred: stores line1 for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `line2` | `character varying(255)` | Yes | — | Inferred: stores line2 for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `locality` | `character varying(150)` | Yes | — | Inferred: stores locality for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `longitude` | `numeric(10,7)` | Yes | — | Inferred: stores longitude for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `postal_code` | `character varying(16)` | No | — | Code for postal | Link to controlled business classification or an external reference | Collation: default |
| `recipient_name` | `character varying(150)` | No | — | Inferred: stores recipient name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `recipient_phone` | `character varying(32)` | No | — | Inferred: stores recipient phone for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `state` | `character varying(100)` | No | — | Inferred: stores state for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `state_code` | `character varying(8)` | Yes | — | Code for state | Link to controlled business classification or an external reference | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_addresses_updated_by_users` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_addresses_user_id_users` |
| `validated_at` | `timestamp with time zone` | Yes | — | Time of validated | Support chronology, deadlines or audit evidence | Exact constraints below |
| `validation_provider` | `character varying(64)` | Yes | — | Inferred: stores validation provider for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `validation_status` | `character varying(32)` | No | `'unverified'::character varying` | Inferred: stores validation status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the addresses business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Cart_Checkout, Prescription_Upload. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `customer.addresses` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_customer_addresses_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_customer_addresses_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_customer_addresses_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_customer_addresses_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`commerce.checkouts`](../../Tables/commerce/checkouts.md) | fk_commerce_checkouts_address_id_addresses | `address_id` | `id` |
| [`commerce.checkouts`](../../Tables/commerce/checkouts.md) | fk_commerce_checkouts_address_id_addresses_numeric | `address_id_internal_id` | `internal_id` |
| [`customer.profiles`](../../Tables/customer/profiles.md) | fk_domain_customer_profiles_default_address_id | `default_address_id, user_id` | `id, user_id` |
| [`customer.profiles`](../../Tables/customer/profiles.md) | fk_domain_customer_profiles_default_address_id_numeric | `default_address_id_internal_id, user_id` | `internal_id, user_id` |
| [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | fk_diagnostics_diagnostic_orders_address_id_addresses | `address_id` | `id` |
| [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | fk_diagnostics_diagnostic_orders_address_id_addresses_numeric | `address_id_internal_id` | `internal_id` |

## `customer.addresses` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_customer_addresses_created_by_users` |
| `deleted_by` | `identity.users` | `fk_customer_addresses_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_customer_addresses_updated_by_users` |
| `user_id` | `identity.users` | `fk_customer_addresses_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_customer_addresses_finite_numeric_values` | CHECK | `CHECK ((latitude IS NULL OR (latitude <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (longitude IS NULL OR (longitude <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_customer_addresses_latitude_range` | CHECK | `CHECK (latitude IS NULL OR latitude >= '-90'::integer::numeric AND latitude <= 90::numeric)` |
| `ck_customer_addresses_longitude_range` | CHECK | `CHECK (longitude IS NULL OR longitude >= '-180'::integer::numeric AND longitude <= 180::numeric)` |
| `ck_customer_addresses_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_customer_addresses_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_addresses_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_addresses_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_addresses_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_customer_addresses` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_customer_addresses_id` | UNIQUE | `UNIQUE (id)` |
| `uq_numeric_customer_addresses_internal_id_user_id` | UNIQUE | `UNIQUE (internal_id, user_id)` |
| `uq_scope_customer_addresses_user_id` | UNIQUE | `UNIQUE (id, user_id)` |
| `addresses_city_not_null` | NOT NULL | `NOT NULL city` |
| `addresses_country_code_not_null` | NOT NULL | `NOT NULL country_code` |
| `addresses_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `addresses_id_not_null` | NOT NULL | `NOT NULL id` |
| `addresses_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `addresses_is_default_not_null` | NOT NULL | `NOT NULL is_default` |
| `addresses_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `addresses_line1_not_null` | NOT NULL | `NOT NULL line1` |
| `addresses_postal_code_not_null` | NOT NULL | `NOT NULL postal_code` |
| `addresses_recipient_name_not_null` | NOT NULL | `NOT NULL recipient_name` |
| `addresses_recipient_phone_not_null` | NOT NULL | `NOT NULL recipient_phone` |
| `addresses_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `addresses_state_not_null` | NOT NULL | `NOT NULL state` |
| `addresses_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `addresses_user_id_not_null` | NOT NULL | `NOT NULL user_id` |
| `addresses_validation_status_not_null` | NOT NULL | `NOT NULL validation_status` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_customer_addresses_postal_code` | btree | `(postal_code)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_customer_addresses_postal_code ON customer.addresses USING btree (postal_code)` |
| `ix_customer_addresses_user_id` | btree | `(user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_customer_addresses_user_id ON customer.addresses USING btree (user_id)` |
| `pk_customer_addresses` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_customer_addresses ON customer.addresses USING btree (internal_id)` |
| `uq_customer_addresses_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_customer_addresses_id ON customer.addresses USING btree (id)` |
| `uq_numeric_customer_addresses_internal_id_user_id` | btree | `(internal_id, user_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_numeric_customer_addresses_internal_id_user_id ON customer.addresses USING btree (internal_id, user_id)` |
| `uq_scope_customer_addresses_user_id` | btree | `(id, user_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_scope_customer_addresses_user_id ON customer.addresses USING btree (id, user_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON customer.addresses FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON customer.addresses FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON customer.addresses FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
