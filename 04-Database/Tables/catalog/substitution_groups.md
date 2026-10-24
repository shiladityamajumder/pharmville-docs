# `catalog.substitution_groups`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds substitution groups records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 9 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_substitution_groups_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_substitution_groups_deleted_by_users) |
| `dosage_form_id` | `uuid` | Yes | — | Reference linking this record to dosage forms | Ensures related business data can be joined and validated | FK → `catalog.dosage_forms` (fk_catalog_substitution_groups_dosage_form_id_dosage_forms) |
| `dosage_form_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.dosage_forms` (fk_catalog_substitution_groups_dosage_form_id_dosage_fo_76c1); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `salt_signature` | `character varying(512)` | No | — | Inferred: stores salt signature for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `strength_signature` | `character varying(255)` | Yes | — | Inferred: stores strength signature for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_substitution_groups_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the substitution groups business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.substitution_groups` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_catalog_substitution_groups_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_catalog_substitution_groups_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_catalog_substitution_groups_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `dosage_form_id` → `catalog.dosage_forms(id)` via `fk_catalog_substitution_groups_dosage_form_id_dosage_forms`; `FOREIGN KEY (dosage_form_id) REFERENCES catalog.dosage_forms(id) ON DELETE SET NULL`
- `dosage_form_id_internal_id` → `catalog.dosage_forms(internal_id)` via `fk_catalog_substitution_groups_dosage_form_id_dosage_fo_76c1`; `FOREIGN KEY (dosage_form_id_internal_id) REFERENCES catalog.dosage_forms(internal_id) ON DELETE SET NULL`

**Referenced by 2 FK constraints** (sample): `catalog.substitution_group_products`, `catalog.substitution_group_products`.

## `catalog.substitution_groups` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 15 columns, 9 constraints, 3 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_substitution_groups_created_by_users` |
| `deleted_by` | `identity.users` | `fk_catalog_substitution_groups_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_catalog_substitution_groups_updated_by_users` |
| `dosage_form_id` | `catalog.dosage_forms` | `fk_catalog_substitution_groups_dosage_form_id_dosage_forms` |
| `dosage_form_id_internal_id` | `catalog.dosage_forms` | `fk_catalog_substitution_groups_dosage_form_id_dosage_fo_76c1` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_substitution_groups_numeric_pair_dosage_form_id` | CHECK | `CHECK ((dosage_form_id IS NULL) = (dosage_form_id_internal_id IS NULL))` |
| `ck_catalog_substitution_groups_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_catalog_substitution_groups_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_substitution_groups_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_substitution_groups_dosage_form_id_dosage_fo_76c1` | FOREIGN KEY | `FOREIGN KEY (dosage_form_id_internal_id) REFERENCES catalog.dosage_forms(internal_id) ON DELETE SET NULL` |
| `fk_catalog_substitution_groups_dosage_form_id_dosage_forms` | FOREIGN KEY | `FOREIGN KEY (dosage_form_id) REFERENCES catalog.dosage_forms(id) ON DELETE SET NULL` |
| `fk_catalog_substitution_groups_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_catalog_substitution_groups` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_catalog_substitution_groups_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_catalog_substitution_groups_salt_signature` | `CREATE INDEX ix_catalog_substitution_groups_salt_signature ON catalog.substitution_groups USING btree (salt_signature)` |
| `pk_catalog_substitution_groups` | `CREATE UNIQUE INDEX pk_catalog_substitution_groups ON catalog.substitution_groups USING btree (internal_id)` |
| `uq_catalog_substitution_groups_id` | `CREATE UNIQUE INDEX uq_catalog_substitution_groups_id ON catalog.substitution_groups USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.substitution_groups FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["dosage_form_id","dosage_form_id_internal_id","catalog","dosage_forms"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.substitution_groups FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.substitution_groups FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["dosage_form_id","dosage_form_id_internal_id","catalog","dosage_forms"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `catalog.substitution_groups` |
| Category | Master / Reference — Approved equivalence group reference; no automatic substitution permission |
| Proposed owner / maintenance role | Product_Catalog / Pharmacist |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `catalog.substitution_group_products` |
| Features | Outside the 110-feature launch API scope; table existence does not approve a new feature. |
| API consumers | No inventoried API. Future-scope onboarding/maintenance requires separate approved requirements. |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | No substitution groups before Pharmacy approves dosage_form_id, salt_signature, strength_signature and applicable substitution policy. Presence does not authorize substitution. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `salt_signature`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Pharmacist through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use is_active=false to retire from new selection; keep referenced history. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_catalog_substitution_groups_id ON catalog.substitution_groups USING btree (id) |
| Foreign-key dependencies | `catalog.dosage_forms` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-006/D-019 clinical/catalog source validation. |
