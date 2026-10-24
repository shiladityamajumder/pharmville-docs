# `clinical.review_reason_codes`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds review reason codes records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 11 columns, 9 constraints, 3 indexes, 4 triggers; PK: `id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_review_reason_codes_created_by_user_id_users) |
| `description` | `text` | Yes | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `display_name` | `character varying(150)` | No | — | Inferred: stores display name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `bigint` | No | — | Internal numeric primary key | Uniquely identifies a master or newer table row | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `sort_order` | `integer` | No | `0` | Inferred: stores sort order for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_review_reason_codes_updated_by_user_id_users) |

**Primary key columns (Confirmed):** `id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the review reason codes business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.review_reason_codes` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by_user_id` → `identity.users(id)` via `fk_clinical_review_reason_codes_created_by_user_id_users`; `FOREIGN KEY (created_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by_user_id` → `identity.users(id)` via `fk_clinical_review_reason_codes_updated_by_user_id_users`; `FOREIGN KEY (updated_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`

**Referenced by 2 FK constraints** (sample): `clinical.order_reviews`, `clinical.order_review_items`.

## `clinical.review_reason_codes` — exact structural contracts

**Identity:** `id` BIGINT.

**Counts:** 11 columns, 9 constraints, 3 indexes, 4 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by_user_id` | `identity.users` | `fk_clinical_review_reason_codes_created_by_user_id_users` |
| `updated_by_user_id` | `identity.users` | `fk_clinical_review_reason_codes_updated_by_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_review_reason_codes_canonical_code` | CHECK | `CHECK (code::text ~ '^[A-Z][A-Z0-9_]{0,63}$'::text)` |
| `ck_clinical_review_reason_codes_display_name_nonblank` | CHECK | `CHECK (length(btrim(display_name::text)) > 0)` |
| `ck_clinical_review_reason_codes_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_clinical_review_reason_codes_sort_order_nonnegative` | CHECK | `CHECK (sort_order >= 0)` |
| `fk_clinical_review_reason_codes_created_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (created_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_review_reason_codes_updated_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (updated_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_clinical_review_reason_codes` | PRIMARY KEY | `PRIMARY KEY (id)` |
| `uq_clinical_review_reason_codes_code` | UNIQUE | `UNIQUE (code)` |
| `uq_clinical_review_reason_codes_id_code` | UNIQUE | `UNIQUE (id, code)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_clinical_review_reason_codes` | `CREATE UNIQUE INDEX pk_clinical_review_reason_codes ON clinical.review_reason_codes USING btree (id)` |
| `uq_clinical_review_reason_codes_code` | `CREATE UNIQUE INDEX uq_clinical_review_reason_codes_code ON clinical.review_reason_codes USING btree (code)` |
| `uq_clinical_review_reason_codes_id_code` | `CREATE UNIQUE INDEX uq_clinical_review_reason_codes_id_code ON clinical.review_reason_codes USING btree (id, code)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.review_reason_codes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'id', '')` |
| `master_guard` | `CREATE TRIGGER master_guard BEFORE INSERT OR DELETE OR UPDATE ON clinical.review_reason_codes FOR EACH ROW EXECUTE FUNCTION platform.guard_master()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.review_reason_codes FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.review_reason_codes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'id', '')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `clinical.review_reason_codes` |
| Category | Master / Reference — Controlled clinical review outcome reasons |
| Proposed owner / maintenance role | Pharmacist_Review / Pharmacy clinical policy owner |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `clinical.order_review_items`, `clinical.order_reviews` |
| Features | `ADM-01`, `CHK-03`, `CHK-08`, `FIN-01`, `INV-01`, `INV-03`, `OMS-03`, `OMS-04`, `PHM-01`, `PHM-02`, `PHM-03`, `PHM-05`, `RID-02`, `RX-05`, `STO-02` |
| API consumers | [API-032](../../../05-APIs/Admin_CMS.md), [API-041](../../../05-APIs/Order_Operations.md), [API-042](../../../05-APIs/Order_Operations.md), [API-045](../../../05-APIs/Store_Operations.md), [API-046](../../../05-APIs/Store_Operations.md), [API-047](../../../05-APIs/Store_Operations.md), [API-052](../../../05-APIs/Inventory.md), [API-060](../../../05-APIs/Pharmacist_Review.md), [API-061](../../../05-APIs/Pharmacist_Review.md), [API-062](../../../05-APIs/Pharmacist_Review.md), [API-063](../../../05-APIs/Pharmacist_Review.md), [API-071](../../../05-APIs/Rider_App.md), [API-075](../../../05-APIs/Finance_Payments.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Pharmacy must supply approved clinical decision codes/display names and rejection/correction meanings. No clinical reason values are invented. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `code`, `display_name`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Pharmacy clinical policy owner through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use is_active=false to retire from new selection; keep referenced history. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (code); UNIQUE: UNIQUE (id, code); CREATE UNIQUE INDEX uq_clinical_review_reason_codes_code ON clinical.review_reason_codes USING btree (code); CREATE UNIQUE INDEX uq_clinical_review_reason_codes_id_code ON clinical.review_reason_codes USING btree (id, code) |
| Foreign-key dependencies | No non-actor FK dependencies recorded. |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-006/D-019 clinical/catalog source validation. |
