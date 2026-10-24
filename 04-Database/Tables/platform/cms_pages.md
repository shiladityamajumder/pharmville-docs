# `platform.cms_pages`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds cms pages records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | platform.cms_pages |
| Classification | Configuration |
| Proposed business write owner | Admin_CMS |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 16 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_cms_pages_created_by_users` |
| `created_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_cms_pages_created_by_user_id_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_cms_pages_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `locale` | `character varying(16)` | No | `'en-IN'::character varying` | Inferred: stores locale for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `slug` | `character varying(255)` | No | — | Inferred: stores slug for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `title` | `character varying(255)` | No | — | Inferred: stores title for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_cms_pages_updated_by_users` |
| `updated_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_cms_pages_updated_by_user_id_users` |

## Record lifecycle and users

- **Created:** when the cms pages business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.cms_pages` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_platform_cms_pages_created_by_user_id_users | `created_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_platform_cms_pages_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_cms_pages_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_cms_pages_updated_by_user_id_users | `updated_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_platform_cms_pages_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`platform.cms_page_versions`](../../Tables/platform/cms_page_versions.md) | fk_platform_cms_page_versions_page_id_cms_pages | `page_id` | `id` |
| [`platform.cms_page_versions`](../../Tables/platform/cms_page_versions.md) | fk_platform_cms_page_versions_page_id_cms_pages_numeric | `page_id_internal_id` | `internal_id` |

## `platform.cms_pages` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by_user_id` | `identity.users` | `fk_platform_cms_pages_created_by_user_id_users` |
| `created_by` | `identity.users` | `fk_platform_cms_pages_created_by_users` |
| `deleted_by` | `identity.users` | `fk_platform_cms_pages_deleted_by_users` |
| `updated_by_user_id` | `identity.users` | `fk_platform_cms_pages_updated_by_user_id_users` |
| `updated_by` | `identity.users` | `fk_platform_cms_pages_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_cms_pages_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_platform_cms_pages_status` | CHECK | `CHECK (status::text = ANY (ARRAY['draft'::text, 'in_review'::text, 'published'::text, 'archived'::text]))` |
| `fk_platform_cms_pages_created_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (created_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_platform_cms_pages_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_cms_pages_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_cms_pages_updated_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (updated_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_platform_cms_pages_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_platform_cms_pages` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_cms_pages_id` | UNIQUE | `UNIQUE (id)` |
| `cms_pages_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `cms_pages_id_not_null` | NOT NULL | `NOT NULL id` |
| `cms_pages_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `cms_pages_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `cms_pages_locale_not_null` | NOT NULL | `NOT NULL locale` |
| `cms_pages_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `cms_pages_slug_not_null` | NOT NULL | `NOT NULL slug` |
| `cms_pages_status_not_null` | NOT NULL | `NOT NULL status` |
| `cms_pages_title_not_null` | NOT NULL | `NOT NULL title` |
| `cms_pages_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_platform_cms_pages_status_time` | btree | `(status, updated_at DESC)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_cms_pages_status_time ON platform.cms_pages USING btree (status, updated_at DESC)` |
| `pk_platform_cms_pages` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_platform_cms_pages ON platform.cms_pages USING btree (internal_id)` |
| `uq_platform_cms_pages_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_cms_pages_id ON platform.cms_pages USING btree (id)` |
| `uq_platform_cms_pages_slug_locale` | btree | `(slug, locale)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_cms_pages_slug_locale ON platform.cms_pages USING btree (slug, locale) WHERE is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.cms_pages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `cms_publication_guard` | `CREATE TRIGGER cms_publication_guard BEFORE INSERT OR UPDATE ON platform.cms_pages FOR EACH ROW EXECUTE FUNCTION platform.guard_cms_publication()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.cms_pages FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.cms_pages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
