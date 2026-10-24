# `diagnostics.lab_providers`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds lab providers records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 10 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_lab_providers_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_lab_providers_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `integration_type` | `character varying(32)` | No | `'manual'::character varying` | Inferred: stores integration type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `organization_id` | `uuid` | No | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` (fk_diagnostics_lab_providers_organization_id_organizations) |
| `organization_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` (fk_diagnostics_lab_providers_organization_id_organizati_15a2); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_lab_providers_updated_by_users) |
| `verification_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores verification status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the lab providers business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.lab_providers` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_diagnostics_lab_providers_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_diagnostics_lab_providers_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_diagnostics_lab_providers_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `organization_id` → `organization.organizations(id)` via `fk_diagnostics_lab_providers_organization_id_organizations`; `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE RESTRICT`
- `organization_id_internal_id` → `organization.organizations(internal_id)` via `fk_diagnostics_lab_providers_organization_id_organizati_15a2`; `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE RESTRICT`

**Referenced by 2 FK constraints** (sample): `diagnostics.lab_locations`, `diagnostics.lab_locations`.

## `diagnostics.lab_providers` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 17 columns, 10 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_diagnostics_lab_providers_created_by_users` |
| `deleted_by` | `identity.users` | `fk_diagnostics_lab_providers_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_diagnostics_lab_providers_updated_by_users` |
| `organization_id` | `organization.organizations` | `fk_diagnostics_lab_providers_organization_id_organizations` |
| `organization_id_internal_id` | `organization.organizations` | `fk_diagnostics_lab_providers_organization_id_organizati_15a2` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_diagnostics_lab_providers_numeric_pair_organization_id` | CHECK | `CHECK ((organization_id IS NULL) = (organization_id_internal_id IS NULL))` |
| `ck_diagnostics_lab_providers_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_diagnostics_lab_providers_verificationstatus` | CHECK | `CHECK (verification_status::text = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text, 'expired'::text]))` |
| `fk_diagnostics_lab_providers_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_providers_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_providers_organization_id_organizati_15a2` | FOREIGN KEY | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_providers_organization_id_organizations` | FOREIGN KEY | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_providers_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_diagnostics_lab_providers` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_diagnostics_lab_providers_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_diagnostics_lab_providers_organization` | `CREATE INDEX ix_diagnostics_lab_providers_organization ON diagnostics.lab_providers USING btree (organization_id)` |
| `ix_diagnostics_lab_providers_status` | `CREATE INDEX ix_diagnostics_lab_providers_status ON diagnostics.lab_providers USING btree (verification_status)` |
| `pk_diagnostics_lab_providers` | `CREATE UNIQUE INDEX pk_diagnostics_lab_providers ON diagnostics.lab_providers USING btree (internal_id)` |
| `uq_diagnostics_lab_providers_id` | `CREATE UNIQUE INDEX uq_diagnostics_lab_providers_id ON diagnostics.lab_providers USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.lab_providers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.lab_providers FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.lab_providers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `diagnostics.lab_providers` |
| Category | Master / Reference — Verified diagnostic lab provider parties |
| Proposed owner / maintenance role | Future diagnostics / Diagnostic credentialing owner |
| Scope | Organization-specific via organization_id. |
| Referencing tables | `diagnostics.lab_locations` |
| Features | Outside the 110-feature launch API scope; table existence does not approve a new feature. |
| API consumers | No inventoried API. Future-scope onboarding/maintenance requires separate approved requirements. |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `code`, `name`, `organization_id`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Deferred future module: no launch seed or API scope is implied. |
| Create/update permissions | Diagnostic credentialing owner through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use is_active=false to retire from new selection; keep referenced history. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_diagnostics_lab_providers_id ON diagnostics.lab_providers USING btree (id) |
| Foreign-key dependencies | `organization.organizations` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-001 phase scope and responsible steward evidence. |
