# `warehouse.racks`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds racks records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | warehouse.racks |
| Classification | Master / Reference |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 16 columns; 14 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `aisle_id` | `uuid` | No | — | Reference linking this record to aisles | Ensures related business data can be joined and validated | FK → `warehouse.aisles` via `fk_warehouse_racks_aisle_id_aisles` |
| `aisle_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.aisles` via `fk_warehouse_racks_aisle_id_aisles_numeric` |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_racks_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_racks_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `rack_type` | `character varying(32)` | Yes | — | Inferred: stores rack type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_racks_updated_by_users` |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_warehouse_racks_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_warehouse_racks_warehouse_id_warehouses_numeric` |

## Record lifecycle and users

- **Created:** when the racks business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.racks` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_warehouse_racks_aisle_id_aisles | `aisle_id` | [`warehouse.aisles`](../../Tables/warehouse/aisles.md) | `FOREIGN KEY (aisle_id) REFERENCES warehouse.aisles(id) ON DELETE CASCADE` |
| fk_warehouse_racks_aisle_id_aisles_numeric | `aisle_id_internal_id` | [`warehouse.aisles`](../../Tables/warehouse/aisles.md) | `FOREIGN KEY (aisle_id_internal_id) REFERENCES warehouse.aisles(internal_id) ON DELETE CASCADE` |
| fk_warehouse_racks_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_racks_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_racks_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_racks_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE CASCADE` |
| fk_warehouse_racks_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE CASCADE` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`warehouse.bins`](../../Tables/warehouse/bins.md) | fk_warehouse_bins_rack_id_racks | `rack_id` | `id` |
| [`warehouse.bins`](../../Tables/warehouse/bins.md) | fk_warehouse_bins_rack_id_racks_numeric | `rack_id_internal_id` | `internal_id` |

## `warehouse.racks` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `aisle_id` | `warehouse.aisles` | `fk_warehouse_racks_aisle_id_aisles` |
| `aisle_id_internal_id` | `warehouse.aisles` | `fk_warehouse_racks_aisle_id_aisles_numeric` |
| `created_by` | `identity.users` | `fk_warehouse_racks_created_by_users` |
| `deleted_by` | `identity.users` | `fk_warehouse_racks_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_warehouse_racks_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_racks_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_racks_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_racks_numeric_pair_aisle_id` | CHECK | `CHECK ((aisle_id IS NULL) = (aisle_id_internal_id IS NULL))` |
| `ck_warehouse_racks_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_racks_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_warehouse_racks_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(code::text)) > 0 AND code::text = btrim(code::text))` |
| `fk_warehouse_racks_aisle_id_aisles` | FOREIGN KEY | `FOREIGN KEY (aisle_id) REFERENCES warehouse.aisles(id) ON DELETE CASCADE` |
| `fk_warehouse_racks_aisle_id_aisles_numeric` | FOREIGN KEY | `FOREIGN KEY (aisle_id_internal_id) REFERENCES warehouse.aisles(internal_id) ON DELETE CASCADE` |
| `fk_warehouse_racks_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_racks_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_racks_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_racks_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE CASCADE` |
| `fk_warehouse_racks_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE CASCADE` |
| `pk_warehouse_racks` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_warehouse_racks_id` | UNIQUE | `UNIQUE (id)` |
| `warehouse_rack` | UNIQUE | `UNIQUE (warehouse_id, code)` |
| `racks_aisle_id_internal_id_not_null` | NOT NULL | `NOT NULL aisle_id_internal_id` |
| `racks_aisle_id_not_null` | NOT NULL | `NOT NULL aisle_id` |
| `racks_code_not_null` | NOT NULL | `NOT NULL code` |
| `racks_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `racks_id_not_null` | NOT NULL | `NOT NULL id` |
| `racks_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `racks_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `racks_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `racks_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `racks_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL warehouse_id_internal_id` |
| `racks_warehouse_id_not_null` | NOT NULL | `NOT NULL warehouse_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_warehouse_racks_aisle` | btree | `(aisle_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_racks_aisle ON warehouse.racks USING btree (aisle_id)` |
| `pk_warehouse_racks` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_warehouse_racks ON warehouse.racks USING btree (internal_id)` |
| `uq_warehouse_racks_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_racks_id ON warehouse.racks USING btree (id)` |
| `warehouse_rack` | btree | `(warehouse_id, code)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX warehouse_rack ON warehouse.racks USING btree (warehouse_id, code)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.racks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["aisle_id","aisle_id_internal_id","warehouse","aisles"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON warehouse.racks FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '["warehouse_id"]')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.racks FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.racks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["aisle_id","aisle_id_internal_id","warehouse","aisles"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `warehouse.racks` |
| Category | Master / Reference — Persistent racks within aisles |
| Proposed owner / maintenance role | Warehouse / Warehouse supervisor |
| Scope | Warehouse-specific via warehouse_id. |
| Referencing tables | `warehouse.bins` |
| Features | Outside the 110-feature launch API scope; table existence does not approve a new feature. |
| API consumers | No inventoried API. Future-scope onboarding/maintenance requires separate approved requirements. |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `aisle_id`, `code`, `warehouse_id`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Warehouse supervisor through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | No is_active/status column. Soft-delete through is_deleted only after privacy/reference review; retain historical FK targets. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); UNIQUE: UNIQUE (warehouse_id, code); CREATE UNIQUE INDEX uq_warehouse_racks_id ON warehouse.racks USING btree (id); CREATE UNIQUE INDEX warehouse_rack ON warehouse.racks USING btree (warehouse_id, code) |
| Foreign-key dependencies | `warehouse.aisles`, `warehouse.warehouses` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-001 phase scope and responsible steward evidence. |
