# `compliance.regulatory_authorities`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds regulatory authorities records within the compliance domain (regulatory documentation and retention actions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | compliance.regulatory_authorities |
| Classification | Master / Reference |
| Proposed business write owner | Pharmacist_Review via Compliance owner |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 6 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `authority_type` | `character varying(64)` | No | — | Inferred: stores authority type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_compliance_regulatory_authorities_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_compliance_regulatory_authorities_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `jurisdiction` | `character varying(128)` | No | — | Inferred: stores jurisdiction for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_compliance_regulatory_authorities_updated_by_users` |

## Record lifecycle and users

- **Created:** when the regulatory authorities business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Pharmacist_Review, Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `compliance.regulatory_authorities` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_compliance_regulatory_authorities_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_compliance_regulatory_authorities_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_compliance_regulatory_authorities_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`compliance.product_recalls`](../../Tables/compliance/product_recalls.md) | fk_compliance_product_recalls_authority_id_regulatory_a_02b2 | `authority_id_internal_id` | `internal_id` |
| [`compliance.product_recalls`](../../Tables/compliance/product_recalls.md) | fk_compliance_product_recalls_authority_id_regulatory_a_6e3a | `authority_id` | `id` |
| [`compliance.regulatory_registrations`](../../Tables/compliance/regulatory_registrations.md) | fk_compliance_regulatory_registrations_authority_id_reg_698b | `authority_id_internal_id` | `internal_id` |
| [`compliance.regulatory_registrations`](../../Tables/compliance/regulatory_registrations.md) | fk_compliance_regulatory_registrations_authority_id_reg_d5f2 | `authority_id` | `id` |

## `compliance.regulatory_authorities` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_compliance_regulatory_authorities_created_by_users` |
| `deleted_by` | `identity.users` | `fk_compliance_regulatory_authorities_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_compliance_regulatory_authorities_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_compliance_regulatory_authorities_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_compliance_regulatory_authorities_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_compliance_regulatory_authorities_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_compliance_regulatory_authorities_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_compliance_regulatory_authorities` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_compliance_regulatory_authorities_id` | UNIQUE | `UNIQUE (id)` |
| `regulatory_authorities_authority_type_not_null` | NOT NULL | `NOT NULL authority_type` |
| `regulatory_authorities_code_not_null` | NOT NULL | `NOT NULL code` |
| `regulatory_authorities_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `regulatory_authorities_id_not_null` | NOT NULL | `NOT NULL id` |
| `regulatory_authorities_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `regulatory_authorities_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `regulatory_authorities_jurisdiction_not_null` | NOT NULL | `NOT NULL jurisdiction` |
| `regulatory_authorities_name_not_null` | NOT NULL | `NOT NULL name` |
| `regulatory_authorities_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `regulatory_authorities_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_compliance_regulatory_authorities` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_compliance_regulatory_authorities ON compliance.regulatory_authorities USING btree (internal_id)` |
| `uq_compliance_authority_code_active` | btree | `(code)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_compliance_authority_code_active ON compliance.regulatory_authorities USING btree (code) WHERE is_deleted = false` |
| `uq_compliance_regulatory_authorities_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_compliance_regulatory_authorities_id ON compliance.regulatory_authorities USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON compliance.regulatory_authorities FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON compliance.regulatory_authorities FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON compliance.regulatory_authorities FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `compliance.regulatory_authorities` |
| Category | Master / Reference — Authoritative regulatory-body identities referenced by verification records |
| Proposed owner / maintenance role | Admin_CMS via Compliance owner / Compliance and Legal steward |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `compliance.product_recalls`, `compliance.regulatory_registrations` |
| Features | Outside the 110-feature launch API scope; table existence does not approve a new feature. |
| API consumers | No inventoried API. Future-scope onboarding/maintenance requires separate approved requirements. |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `authority_type`, `code`, `jurisdiction`, `name`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Compliance and Legal steward through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | No is_active/status column. Soft-delete through is_deleted only after privacy/reference review; retain historical FK targets. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_compliance_authority_code_active ON compliance.regulatory_authorities USING btree (code) WHERE is_deleted = false; CREATE UNIQUE INDEX uq_compliance_regulatory_authorities_id ON compliance.regulatory_authorities USING btree (id) |
| Foreign-key dependencies | No non-actor FK dependencies recorded. |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-001 phase scope and responsible steward evidence. |
