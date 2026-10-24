# `clinical.review_reason_codes`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds review reason codes records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | clinical.review_reason_codes |
| Classification | Master / Reference |
| Proposed business write owner | Pharmacist_Review |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | id |
| Structural counts | 11 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 8 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_review_reason_codes_created_by_user_id_users` |
| `description` | `text` | Yes | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `display_name` | `character varying(150)` | No | — | Inferred: stores display name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `bigint` | No | — | Internal numeric primary key | Uniquely identifies a master or newer table row | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `sort_order` | `integer` | No | `0` | Inferred: stores sort order for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_review_reason_codes_updated_by_user_id_users` |

## Record lifecycle and users

- **Created:** when the review reason codes business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.review_reason_codes` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_clinical_review_reason_codes_created_by_user_id_users | `created_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_review_reason_codes_updated_by_user_id_users | `updated_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`clinical.order_review_items`](../../Tables/clinical/order_review_items.md) | fk_clinical_order_review_items_controlled_reason | `reason_code_id, reason_code` | `id, code` |
| [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | fk_clinical_order_reviews_controlled_reason | `reason_code_id, reason_code` | `id, code` |

## `clinical.review_reason_codes` — exact structural contracts

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
| `review_reason_codes_code_not_null` | NOT NULL | `NOT NULL code` |
| `review_reason_codes_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `review_reason_codes_display_name_not_null` | NOT NULL | `NOT NULL display_name` |
| `review_reason_codes_id_not_null` | NOT NULL | `NOT NULL id` |
| `review_reason_codes_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `review_reason_codes_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `review_reason_codes_sort_order_not_null` | NOT NULL | `NOT NULL sort_order` |
| `review_reason_codes_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_clinical_review_reason_codes` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_clinical_review_reason_codes ON clinical.review_reason_codes USING btree (id)` |
| `uq_clinical_review_reason_codes_code` | btree | `(code)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_review_reason_codes_code ON clinical.review_reason_codes USING btree (code)` |
| `uq_clinical_review_reason_codes_id_code` | btree | `(id, code)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_review_reason_codes_id_code ON clinical.review_reason_codes USING btree (id, code)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.review_reason_codes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'id', '')` | O |
| `master_guard` | `CREATE TRIGGER master_guard BEFORE INSERT OR DELETE OR UPDATE ON clinical.review_reason_codes FOR EACH ROW EXECUTE FUNCTION platform.guard_master()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.review_reason_codes FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.review_reason_codes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'id', '')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

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
| API consumers | [API-032](../../../03-Modules/Admin/APIs.md), [API-041](../../../03-Modules/Order-Management/APIs.md), [API-042](../../../03-Modules/Order-Management/APIs.md), [API-045](../../../03-Modules/Store-Operations/APIs.md), [API-046](../../../03-Modules/Store-Operations/APIs.md), [API-047](../../../03-Modules/Store-Operations/APIs.md), [API-052](../../../03-Modules/Inventory/APIs.md), [API-060](../../../03-Modules/Pharmacist-Review/APIs.md), [API-061](../../../03-Modules/Pharmacist-Review/APIs.md), [API-062](../../../03-Modules/Pharmacist-Review/APIs.md), [API-063](../../../03-Modules/Pharmacist-Review/APIs.md), [API-071](../../../03-Modules/Rider-Operations/APIs.md), [API-075](../../../03-Modules/Payments/APIs.md) |

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
