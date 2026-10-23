# platform.cms_page_versions

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds cms page versions records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 11 columns, 10 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approved_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_cms_page_versions_approved_by_user_id_users) |
| `body` | `jsonb` | No | — | Structured body information | Retain a versioned payload or relevant details | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_cms_page_versions_created_by_user_id_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `page_id` | `uuid` | No | — | Reference linking this record to cms pages | Ensures related business data can be joined and validated | FK → `platform.cms_pages` (fk_platform_cms_page_versions_page_id_cms_pages) |
| `page_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.cms_pages` (fk_platform_cms_page_versions_page_id_cms_pages_numeric); Numeric/public-key pair verification required |
| `published_at` | `timestamp with time zone` | Yes | — | Time of published | Support chronology, deadlines or audit evidence | See exact constraints |
| `summary` | `text` | Yes | — | Inferred: stores summary for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `version` | `integer` | No | — | Inferred: stores version for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the cms page versions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.cms_page_versions` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `approved_by_user_id` → `identity.users(id)` via `fk_platform_cms_page_versions_approved_by_user_id_users`; FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `created_by_user_id` → `identity.users(id)` via `fk_platform_cms_page_versions_created_by_user_id_users`; FOREIGN KEY (created_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `page_id` → `platform.cms_pages(id)` via `fk_platform_cms_page_versions_page_id_cms_pages`; FOREIGN KEY (page_id) REFERENCES platform.cms_pages(id) ON DELETE RESTRICT
- `page_id_internal_id` → `platform.cms_pages(internal_id)` via `fk_platform_cms_page_versions_page_id_cms_pages_numeric`; FOREIGN KEY (page_id_internal_id) REFERENCES platform.cms_pages(internal_id) ON DELETE RESTRICT

## platform.cms_page_versions — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 11 columns, 10 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `approved_by_user_id` | `identity.users` | `fk_platform_cms_page_versions_approved_by_user_id_users` |
| `created_by_user_id` | `identity.users` | `fk_platform_cms_page_versions_created_by_user_id_users` |
| `page_id` | `platform.cms_pages` | `fk_platform_cms_page_versions_page_id_cms_pages` |
| `page_id_internal_id` | `platform.cms_pages` | `fk_platform_cms_page_versions_page_id_cms_pages_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_platform_cms_page_versions_published` | `CREATE INDEX ix_platform_cms_page_versions_published ON platform.cms_page_versions USING btree (page_id, published_at DESC)` |
| `pk_platform_cms_page_versions` | `CREATE UNIQUE INDEX pk_platform_cms_page_versions ON platform.cms_page_versions USING btree (internal_id)` |
| `uq_platform_cms_page_versions_id` | `CREATE UNIQUE INDEX uq_platform_cms_page_versions_id ON platform.cms_page_versions USING btree (id)` |
| `uq_platform_cms_page_versions_number` | `CREATE UNIQUE INDEX uq_platform_cms_page_versions_number ON platform.cms_page_versions USING btree (page_id, version)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.cms_page_versions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["page_id","page_id_internal_id","platform","cms_pages"]]', 'internal_id', 'id')` |
| `cms_version_guard` | `CREATE TRIGGER cms_version_guard BEFORE INSERT OR DELETE OR UPDATE ON platform.cms_page_versions FOR EACH ROW EXECUTE FUNCTION platform.guard_published_version()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.cms_page_versions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["page_id","page_id_internal_id","platform","cms_pages"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
