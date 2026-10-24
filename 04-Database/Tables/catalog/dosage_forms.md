# `catalog.dosage_forms`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds dosage forms records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 7 constraints, 3 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_dosage_forms_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_dosage_forms_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `name` | `character varying(128)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `route_of_administration` | `character varying(64)` | Yes | — | Inferred: stores route of administration for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_dosage_forms_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the dosage forms business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.dosage_forms` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_catalog_dosage_forms_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_catalog_dosage_forms_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_catalog_dosage_forms_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

**Referenced by 4 FK constraints** (sample): `catalog.products`, `catalog.substitution_groups`, `catalog.products`, `catalog.substitution_groups`.

## `catalog.dosage_forms` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 14 columns, 7 constraints, 3 indexes, 4 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_dosage_forms_created_by_users` |
| `deleted_by` | `identity.users` | `fk_catalog_dosage_forms_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_catalog_dosage_forms_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_dosage_forms_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_catalog_dosage_forms_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(code::text)) > 0 AND code::text = btrim(code::text))` |
| `fk_catalog_dosage_forms_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_dosage_forms_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_dosage_forms_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_catalog_dosage_forms` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_catalog_dosage_forms_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_catalog_dosage_forms` | `CREATE UNIQUE INDEX pk_catalog_dosage_forms ON catalog.dosage_forms USING btree (internal_id)` |
| `uq_catalog_dosage_forms_code_active` | `CREATE UNIQUE INDEX uq_catalog_dosage_forms_code_active ON catalog.dosage_forms USING btree (code) WHERE is_deleted = false` |
| `uq_catalog_dosage_forms_id` | `CREATE UNIQUE INDEX uq_catalog_dosage_forms_id ON catalog.dosage_forms USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.dosage_forms FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON catalog.dosage_forms FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '[]')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.dosage_forms FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.dosage_forms FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `catalog.dosage_forms` |
| Category | Master / Reference — Approved medicine dosage-form reference |
| Proposed owner / maintenance role | Product_Catalog / Pharmacy-approved Catalog steward |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `catalog.products`, `catalog.substitution_groups` |
| Features | `ACC-07`, `ADM-06`, `ADM-07`, `CAT-01`, `CAT-02`, `CAT-03`, `CAT-04`, `CHK-01`, `CHK-02`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08`, `INV-01`, `INV-03`, `OMS-05`, `STO-03` |
| API consumers | [API-011](../../../05-APIs/Product_Catalog.md), [API-012](../../../05-APIs/Product_Catalog.md), [API-013](../../../05-APIs/Product_Catalog.md), [API-014](../../../05-APIs/Product_Catalog.md), [API-015](../../../05-APIs/Product_Catalog.md), [API-016](../../../05-APIs/Product_Catalog.md), [API-017](../../../05-APIs/Product_Catalog.md), [API-018](../../../05-APIs/Cart_Checkout.md), [API-019](../../../05-APIs/Cart_Checkout.md), [API-020](../../../05-APIs/Cart_Checkout.md), [API-021](../../../05-APIs/Cart_Checkout.md), [API-043](../../../05-APIs/Order_Operations.md), [API-048](../../../05-APIs/Store_Operations.md), [API-052](../../../05-APIs/Inventory.md), [ACC-ROUTE-008](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-009](../../../05-APIs/Customer_Accounts.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Pharmacy must supply dosage codes, names and route_of_administration from an approved medicine reference. No clinical vocabulary or routes are invented. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `code`, `name`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Pharmacy-approved Catalog steward through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use is_active=false to retire from new selection; keep referenced history. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_catalog_dosage_forms_code_active ON catalog.dosage_forms USING btree (code) WHERE is_deleted = false; CREATE UNIQUE INDEX uq_catalog_dosage_forms_id ON catalog.dosage_forms USING btree (id) |
| Foreign-key dependencies | No non-actor FK dependencies recorded. |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-006/D-019 clinical/catalog source validation. |
