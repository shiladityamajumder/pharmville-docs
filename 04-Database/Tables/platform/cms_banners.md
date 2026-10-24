# `platform.cms_banners`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds cms banners records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 9 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(80)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `ends_at` | `timestamp with time zone` | Yes | — | Time of ends | Support chronology, deadlines or audit evidence | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `image_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_platform_cms_banners_image_file_id_file_objects) |
| `image_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_platform_cms_banners_image_file_id_file_objects_numeric); Numeric/public-key pair verification required |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `link_url` | `text` | Yes | — | Inferred: stores link url for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `locale` | `character varying(16)` | No | `'en-IN'::character varying` | Inferred: stores locale for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `placement` | `character varying(80)` | No | — | Inferred: stores placement for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `priority` | `integer` | No | `0` | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `starts_at` | `timestamp with time zone` | Yes | — | Time of starts | Support chronology, deadlines or audit evidence | See exact constraints |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `title` | `character varying(255)` | Yes | — | Inferred: stores title for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the cms banners business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.cms_banners` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `image_file_id` → `platform.file_objects(id)` via `fk_platform_cms_banners_image_file_id_file_objects`; `FOREIGN KEY (image_file_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT`
- `image_file_id_internal_id` → `platform.file_objects(internal_id)` via `fk_platform_cms_banners_image_file_id_file_objects_numeric`; `FOREIGN KEY (image_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT`

## `platform.cms_banners` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 15 columns, 9 constraints, 3 indexes, 3 triggers.

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_platform_cms_banners` | `CREATE UNIQUE INDEX pk_platform_cms_banners ON platform.cms_banners USING btree (internal_id)` |
| `uq_platform_cms_banners_code_locale` | `CREATE UNIQUE INDEX uq_platform_cms_banners_code_locale ON platform.cms_banners USING btree (code, locale)` |
| `uq_platform_cms_banners_id` | `CREATE UNIQUE INDEX uq_platform_cms_banners_id ON platform.cms_banners USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.cms_banners FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["image_file_id","image_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.cms_banners FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('timestamp')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.cms_banners FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["image_file_id","image_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
