# `platform.cms_banners`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds cms banners records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | platform.cms_banners |
| Classification | Configuration |
| Proposed business write owner | Admin_CMS |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(80)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `ends_at` | `timestamp with time zone` | Yes | — | Time of ends | Support chronology, deadlines or audit evidence | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `image_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_platform_cms_banners_image_file_id_file_objects` |
| `image_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_platform_cms_banners_image_file_id_file_objects_numeric` |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `link_url` | `text` | Yes | — | Inferred: stores link url for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `locale` | `character varying(16)` | No | `'en-IN'::character varying` | Inferred: stores locale for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `placement` | `character varying(80)` | No | — | Inferred: stores placement for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `priority` | `integer` | No | `0` | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `starts_at` | `timestamp with time zone` | Yes | — | Time of starts | Support chronology, deadlines or audit evidence | Exact constraints below |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `title` | `character varying(255)` | Yes | — | Inferred: stores title for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |

## Record lifecycle and users

- **Created:** when the cms banners business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.cms_banners` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_platform_cms_banners_image_file_id_file_objects | `image_file_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (image_file_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT` |
| fk_platform_cms_banners_image_file_id_file_objects_numeric | `image_file_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (image_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `platform.cms_banners` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `image_file_id` | `platform.file_objects` | `fk_platform_cms_banners_image_file_id_file_objects` |
| `image_file_id_internal_id` | `platform.file_objects` | `fk_platform_cms_banners_image_file_id_file_objects_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_cms_banners_numeric_pair_image_file_id` | CHECK | `CHECK ((image_file_id IS NULL) = (image_file_id_internal_id IS NULL))` |
| `ck_platform_cms_banners_priority_nonnegative` | CHECK | `CHECK (priority >= 0)` |
| `ck_platform_cms_banners_schedule` | CHECK | `CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at > starts_at)` |
| `ck_platform_cms_banners_status` | CHECK | `CHECK (status::text = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text]))` |
| `fk_platform_cms_banners_image_file_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (image_file_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT` |
| `fk_platform_cms_banners_image_file_id_file_objects_numeric` | FOREIGN KEY | `FOREIGN KEY (image_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT` |
| `pk_platform_cms_banners` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_cms_banners_code_locale` | UNIQUE | `UNIQUE (code, locale)` |
| `uq_platform_cms_banners_id` | UNIQUE | `UNIQUE (id)` |
| `cms_banners_code_not_null` | NOT NULL | `NOT NULL code` |
| `cms_banners_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `cms_banners_id_not_null` | NOT NULL | `NOT NULL id` |
| `cms_banners_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `cms_banners_locale_not_null` | NOT NULL | `NOT NULL locale` |
| `cms_banners_placement_not_null` | NOT NULL | `NOT NULL placement` |
| `cms_banners_priority_not_null` | NOT NULL | `NOT NULL priority` |
| `cms_banners_status_not_null` | NOT NULL | `NOT NULL status` |
| `cms_banners_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_platform_cms_banners` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_platform_cms_banners ON platform.cms_banners USING btree (internal_id)` |
| `uq_platform_cms_banners_code_locale` | btree | `(code, locale)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_cms_banners_code_locale ON platform.cms_banners USING btree (code, locale)` |
| `uq_platform_cms_banners_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_cms_banners_id ON platform.cms_banners USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.cms_banners FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["image_file_id","image_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.cms_banners FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('timestamp')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.cms_banners FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["image_file_id","image_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
