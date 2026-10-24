# `platform.cms_page_versions`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds cms page versions records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | platform.cms_page_versions |
| Classification | Audit / History |
| Proposed business write owner | Admin_CMS |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 11 columns; 10 PK/FK/UQ/CHECK/exclusion constraints; 8 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approved_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_cms_page_versions_approved_by_user_id_users` |
| `body` | `jsonb` | No | — | Structured body information | Retain a versioned payload or relevant details | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_cms_page_versions_created_by_user_id_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `page_id` | `uuid` | No | — | Reference linking this record to cms pages | Ensures related business data can be joined and validated | FK → `platform.cms_pages` via `fk_platform_cms_page_versions_page_id_cms_pages` |
| `page_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.cms_pages` via `fk_platform_cms_page_versions_page_id_cms_pages_numeric` |
| `published_at` | `timestamp with time zone` | Yes | — | Time of published | Support chronology, deadlines or audit evidence | Exact constraints below |
| `summary` | `text` | Yes | — | Inferred: stores summary for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `version` | `integer` | No | — | Inferred: stores version for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the cms page versions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.cms_page_versions` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_platform_cms_page_versions_approved_by_user_id_users | `approved_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_cms_page_versions_created_by_user_id_users | `created_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_cms_page_versions_page_id_cms_pages | `page_id` | [`platform.cms_pages`](../../Tables/platform/cms_pages.md) | `FOREIGN KEY (page_id) REFERENCES platform.cms_pages(id) ON DELETE RESTRICT` |
| fk_platform_cms_page_versions_page_id_cms_pages_numeric | `page_id_internal_id` | [`platform.cms_pages`](../../Tables/platform/cms_pages.md) | `FOREIGN KEY (page_id_internal_id) REFERENCES platform.cms_pages(internal_id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `platform.cms_page_versions` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `approved_by_user_id` | `identity.users` | `fk_platform_cms_page_versions_approved_by_user_id_users` |
| `created_by_user_id` | `identity.users` | `fk_platform_cms_page_versions_created_by_user_id_users` |
| `page_id` | `platform.cms_pages` | `fk_platform_cms_page_versions_page_id_cms_pages` |
| `page_id_internal_id` | `platform.cms_pages` | `fk_platform_cms_page_versions_page_id_cms_pages_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_cms_page_versions_numeric_pair_page_id` | CHECK | `CHECK ((page_id IS NULL) = (page_id_internal_id IS NULL))` |
| `ck_platform_cms_page_versions_publication_approved` | CHECK | `CHECK (published_at IS NULL OR approved_by_user_id IS NOT NULL)` |
| `ck_platform_cms_page_versions_version_positive` | CHECK | `CHECK (version > 0)` |
| `fk_platform_cms_page_versions_approved_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_cms_page_versions_created_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (created_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_cms_page_versions_page_id_cms_pages` | FOREIGN KEY | `FOREIGN KEY (page_id) REFERENCES platform.cms_pages(id) ON DELETE RESTRICT` |
| `fk_platform_cms_page_versions_page_id_cms_pages_numeric` | FOREIGN KEY | `FOREIGN KEY (page_id_internal_id) REFERENCES platform.cms_pages(internal_id) ON DELETE RESTRICT` |
| `pk_platform_cms_page_versions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_cms_page_versions_id` | UNIQUE | `UNIQUE (id)` |
| `uq_platform_cms_page_versions_number` | UNIQUE | `UNIQUE (page_id, version)` |
| `cms_page_versions_body_not_null` | NOT NULL | `NOT NULL body` |
| `cms_page_versions_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `cms_page_versions_created_by_user_id_not_null` | NOT NULL | `NOT NULL created_by_user_id` |
| `cms_page_versions_id_not_null` | NOT NULL | `NOT NULL id` |
| `cms_page_versions_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `cms_page_versions_page_id_internal_id_not_null` | NOT NULL | `NOT NULL page_id_internal_id` |
| `cms_page_versions_page_id_not_null` | NOT NULL | `NOT NULL page_id` |
| `cms_page_versions_version_not_null` | NOT NULL | `NOT NULL version` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_platform_cms_page_versions_published` | btree | `(page_id, published_at DESC)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_cms_page_versions_published ON platform.cms_page_versions USING btree (page_id, published_at DESC)` |
| `pk_platform_cms_page_versions` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_platform_cms_page_versions ON platform.cms_page_versions USING btree (internal_id)` |
| `uq_platform_cms_page_versions_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_cms_page_versions_id ON platform.cms_page_versions USING btree (id)` |
| `uq_platform_cms_page_versions_number` | btree | `(page_id, version)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_cms_page_versions_number ON platform.cms_page_versions USING btree (page_id, version)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.cms_page_versions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["page_id","page_id_internal_id","platform","cms_pages"]]', 'internal_id', 'id')` | O |
| `cms_version_guard` | `CREATE TRIGGER cms_version_guard BEFORE INSERT OR DELETE OR UPDATE ON platform.cms_page_versions FOR EACH ROW EXECUTE FUNCTION platform.guard_published_version()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.cms_page_versions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["page_id","page_id_internal_id","platform","cms_pages"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
