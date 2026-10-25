# `customer.profiles`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds profiles records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | customer.profiles |
| Classification | Master / Reference |
| Proposed business write owner | Customer_Accounts |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 13 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `avatar_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_customer_profiles_avatar_file_id_file_objects` |
| `avatar_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_customer_profiles_avatar_file_id_file_objects_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_profiles_created_by_users` |
| `date_of_birth` | `date` | Yes | — | Inferred: stores date of birth for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `default_address_id` | `uuid` | Yes | — | Reference linking this record to addresses | Ensures related business data can be joined and validated | FK → `customer.addresses` via `fk_domain_customer_profiles_default_address_id` |
| `default_address_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `customer.addresses` via `fk_domain_customer_profiles_default_address_id_numeric` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_profiles_deleted_by_users` |
| `first_name` | `character varying(100)` | No | — | Inferred: stores first name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `gender` | `character varying(32)` | Yes | — | Inferred: stores gender for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `last_name` | `character varying(100)` | Yes | — | Inferred: stores last name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `marketing_opt_in` | `boolean` | No | `false` | Inferred: stores marketing opt in for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `preferred_name` | `character varying(100)` | Yes | — | Inferred: stores preferred name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_profiles_updated_by_users` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_profiles_user_id_users`; FK → `customer.addresses` via `fk_domain_customer_profiles_default_address_id`; FK → `customer.addresses` via `fk_domain_customer_profiles_default_address_id_numeric` |

## Record lifecycle and users

- **Created:** when the profiles business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Cart_Checkout, Prescription_Upload. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `customer.profiles` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_customer_profiles_avatar_file_id_file_objects | `avatar_file_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (avatar_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| fk_customer_profiles_avatar_file_id_file_objects_numeric | `avatar_file_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (avatar_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| fk_customer_profiles_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_customer_profiles_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_customer_profiles_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_customer_profiles_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| fk_domain_customer_profiles_default_address_id | `default_address_id, user_id` | [`customer.addresses`](../../Tables/customer/addresses.md) | `FOREIGN KEY (default_address_id, user_id) REFERENCES customer.addresses(id, user_id) ON DELETE RESTRICT` |
| fk_domain_customer_profiles_default_address_id_numeric | `default_address_id_internal_id, user_id` | [`customer.addresses`](../../Tables/customer/addresses.md) | `FOREIGN KEY (default_address_id_internal_id, user_id) REFERENCES customer.addresses(internal_id, user_id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `customer.profiles` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `avatar_file_id` | `platform.file_objects` | `fk_customer_profiles_avatar_file_id_file_objects` |
| `avatar_file_id_internal_id` | `platform.file_objects` | `fk_customer_profiles_avatar_file_id_file_objects_numeric` |
| `created_by` | `identity.users` | `fk_customer_profiles_created_by_users` |
| `deleted_by` | `identity.users` | `fk_customer_profiles_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_customer_profiles_updated_by_users` |
| `user_id` | `identity.users` | `fk_customer_profiles_user_id_users` |
| `default_address_id, user_id` | `customer.addresses` | `fk_domain_customer_profiles_default_address_id` |
| `default_address_id_internal_id, user_id` | `customer.addresses` | `fk_domain_customer_profiles_default_address_id_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_customer_profiles_numeric_pair_avatar_file_id` | CHECK | `CHECK ((avatar_file_id IS NULL) = (avatar_file_id_internal_id IS NULL))` |
| `ck_customer_profiles_numeric_pair_default_address_id` | CHECK | `CHECK ((default_address_id IS NULL) = (default_address_id_internal_id IS NULL))` |
| `ck_customer_profiles_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_customer_profiles_avatar_file_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (avatar_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| `fk_customer_profiles_avatar_file_id_file_objects_numeric` | FOREIGN KEY | `FOREIGN KEY (avatar_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| `fk_customer_profiles_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_profiles_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_profiles_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_profiles_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `fk_domain_customer_profiles_default_address_id` | FOREIGN KEY | `FOREIGN KEY (default_address_id, user_id) REFERENCES customer.addresses(id, user_id) ON DELETE RESTRICT` |
| `fk_domain_customer_profiles_default_address_id_numeric` | FOREIGN KEY | `FOREIGN KEY (default_address_id_internal_id, user_id) REFERENCES customer.addresses(internal_id, user_id) ON DELETE RESTRICT` |
| `pk_customer_profiles` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_customer_profiles_id` | UNIQUE | `UNIQUE (id)` |
| `profiles_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `profiles_first_name_not_null` | NOT NULL | `NOT NULL first_name` |
| `profiles_id_not_null` | NOT NULL | `NOT NULL id` |
| `profiles_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `profiles_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `profiles_marketing_opt_in_not_null` | NOT NULL | `NOT NULL marketing_opt_in` |
| `profiles_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `profiles_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `profiles_user_id_not_null` | NOT NULL | `NOT NULL user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_customer_profiles_default_address_id` | btree | `(default_address_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_customer_profiles_default_address_id ON customer.profiles USING btree (default_address_id)` |
| `pk_customer_profiles` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_customer_profiles ON customer.profiles USING btree (internal_id)` |
| `uq_customer_profiles_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_customer_profiles_id ON customer.profiles USING btree (id)` |
| `uq_customer_profiles_user_active` | btree | `(user_id)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_customer_profiles_user_active ON customer.profiles USING btree (user_id) WHERE is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON customer.profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["avatar_file_id","avatar_file_id_internal_id","platform","file_objects"],["default_address_id","default_address_id_internal_id","customer","addresses"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON customer.profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON customer.profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["avatar_file_id","avatar_file_id_internal_id","platform","file_objects"],["default_address_id","default_address_id_internal_id","customer","addresses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `customer.profiles` |
| Category | Master / Reference — Customer demographic master separated from identity credentials |
| Proposed owner / maintenance role | Customer_Accounts / Customer self-service / Customer Accounts |
| Scope | User/patient-specific protected party master. |
| Referencing tables | No inbound FK recorded; API and logical consumers still require review. |
| Features | `ACC-01`, `ACC-02`, `ACC-03`, `AUTH-03` |
| API consumers | [API-002](../../../03-Modules/Customer_Accounts/APIs.md), [API-003](../../../03-Modules/Customer_Accounts/APIs.md), [API-004](../../../03-Modules/Customer_Accounts/APIs.md), [API-006](../../../03-Modules/Customer_Accounts/APIs.md), [ACC-ROUTE-001](../../../03-Modules/Customer_Accounts/APIs.md), [ACC-ROUTE-002](../../../03-Modules/Customer_Accounts/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `first_name`, `user_id`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Customer self-service / Customer Accounts through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | No is_active/status column. Soft-delete through is_deleted only after privacy/reference review; retain historical FK targets. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_customer_profiles_id ON customer.profiles USING btree (id); CREATE UNIQUE INDEX uq_customer_profiles_user_active ON customer.profiles USING btree (user_id) WHERE is_deleted = false |
| Foreign-key dependencies | `customer.addresses`, `platform.file_objects` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-001 phase scope and responsible steward evidence. |
