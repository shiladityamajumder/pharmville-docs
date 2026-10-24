# `identity.user_profiles`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds user profiles records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | identity.user_profiles |
| Classification | Master / Reference |
| Proposed business write owner | Authentication_Access |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 16 columns; 10 PK/FK/UQ/CHECK/exclusion constraints; 7 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `avatar_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_identity_user_profiles_avatar_file_id_file_objects` |
| `avatar_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_identity_user_profiles_avatar_file_id_file_objects_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_user_profiles_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_user_profiles_deleted_by_users` |
| `first_name` | `character varying(100)` | Yes | — | Inferred: stores first name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `last_name` | `character varying(100)` | Yes | — | Inferred: stores last name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `preferred_name` | `character varying(100)` | Yes | — | Inferred: stores preferred name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_user_profiles_updated_by_users` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_user_profiles_user_id_users` |

## Record lifecycle and users

- **Created:** when the user profiles business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.user_profiles` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_identity_user_profiles_avatar_file_id_file_objects | `avatar_file_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (avatar_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| fk_identity_user_profiles_avatar_file_id_file_objects_numeric | `avatar_file_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (avatar_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| fk_identity_user_profiles_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_identity_user_profiles_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_identity_user_profiles_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_identity_user_profiles_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `identity.user_profiles` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `avatar_file_id` | `platform.file_objects` | `fk_identity_user_profiles_avatar_file_id_file_objects` |
| `avatar_file_id_internal_id` | `platform.file_objects` | `fk_identity_user_profiles_avatar_file_id_file_objects_numeric` |
| `created_by` | `identity.users` | `fk_identity_user_profiles_created_by_users` |
| `deleted_by` | `identity.users` | `fk_identity_user_profiles_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_identity_user_profiles_updated_by_users` |
| `user_id` | `identity.users` | `fk_identity_user_profiles_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_user_profiles_numeric_pair_avatar_file_id` | CHECK | `CHECK ((avatar_file_id IS NULL) = (avatar_file_id_internal_id IS NULL))` |
| `ck_identity_user_profiles_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_identity_user_profiles_avatar_file_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (avatar_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| `fk_identity_user_profiles_avatar_file_id_file_objects_numeric` | FOREIGN KEY | `FOREIGN KEY (avatar_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| `fk_identity_user_profiles_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_user_profiles_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_user_profiles_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_user_profiles_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_identity_user_profiles` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_identity_user_profiles_id` | UNIQUE | `UNIQUE (id)` |
| `user_profiles_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `user_profiles_id_not_null` | NOT NULL | `NOT NULL id` |
| `user_profiles_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `user_profiles_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `user_profiles_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `user_profiles_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `user_profiles_user_id_not_null` | NOT NULL | `NOT NULL user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_identity_user_profiles_first_name` | btree | `(first_name)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_user_profiles_first_name ON identity.user_profiles USING btree (first_name)` |
| `ix_identity_user_profiles_last_name` | btree | `(last_name)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_user_profiles_last_name ON identity.user_profiles USING btree (last_name)` |
| `pk_identity_user_profiles` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_identity_user_profiles ON identity.user_profiles USING btree (internal_id)` |
| `uq_identity_user_profiles_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_identity_user_profiles_id ON identity.user_profiles USING btree (id)` |
| `uq_identity_user_profiles_user_active` | btree | `(user_id)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_identity_user_profiles_user_active ON identity.user_profiles USING btree (user_id) WHERE is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.user_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["avatar_file_id","avatar_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.user_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.user_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["avatar_file_id","avatar_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `identity.user_profiles` |
| Category | Master / Reference — Staff/general identity display-profile companion |
| Proposed owner / maintenance role | Authentication_Access / Identity administrator / own-profile owner |
| Scope | User/patient-specific protected party master. |
| Referencing tables | No inbound FK recorded; API and logical consumers still require review. |
| Features | Outside the 110-feature launch API scope; table existence does not approve a new feature. |
| API consumers | No inventoried API. Future-scope onboarding/maintenance requires separate approved requirements. |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `user_id`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Identity administrator / own-profile owner through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | No is_active/status column. Soft-delete through is_deleted only after privacy/reference review; retain historical FK targets. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_identity_user_profiles_id ON identity.user_profiles USING btree (id); CREATE UNIQUE INDEX uq_identity_user_profiles_user_active ON identity.user_profiles USING btree (user_id) WHERE is_deleted = false |
| Foreign-key dependencies | `platform.file_objects` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-003 exact role/grant and identity lifecycle approval. |
