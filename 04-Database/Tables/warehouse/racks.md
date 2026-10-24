# `warehouse.racks`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds racks records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 16 columns, 14 constraints, 4 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `aisle_id` | `uuid` | No | — | Reference linking this record to aisles | Ensures related business data can be joined and validated | FK → `warehouse.aisles` (fk_warehouse_racks_aisle_id_aisles) |
| `aisle_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.aisles` (fk_warehouse_racks_aisle_id_aisles_numeric); Numeric/public-key pair verification required |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_racks_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_racks_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `rack_type` | `character varying(32)` | Yes | — | Inferred: stores rack type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_racks_updated_by_users) |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_warehouse_racks_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_warehouse_racks_warehouse_id_warehouses_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the racks business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.racks` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_warehouse_racks_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_warehouse_racks_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_warehouse_racks_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_warehouse_racks_warehouse_id_warehouses`; `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE CASCADE`
- `aisle_id` → `warehouse.aisles(id)` via `fk_warehouse_racks_aisle_id_aisles`; `FOREIGN KEY (aisle_id) REFERENCES warehouse.aisles(id) ON DELETE CASCADE`
- `aisle_id_internal_id` → `warehouse.aisles(internal_id)` via `fk_warehouse_racks_aisle_id_aisles_numeric`; `FOREIGN KEY (aisle_id_internal_id) REFERENCES warehouse.aisles(internal_id) ON DELETE CASCADE`
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_warehouse_racks_warehouse_id_warehouses_numeric`; `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE CASCADE`

**Referenced by 2 FK constraints** (sample): `warehouse.bins`, `warehouse.bins`.

## `warehouse.racks` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 16 columns, 14 constraints, 4 indexes, 4 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_warehouse_racks_created_by_users` |
| `deleted_by` | `identity.users` | `fk_warehouse_racks_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_warehouse_racks_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_racks_warehouse_id_warehouses` |
| `aisle_id` | `warehouse.aisles` | `fk_warehouse_racks_aisle_id_aisles` |
| `aisle_id_internal_id` | `warehouse.aisles` | `fk_warehouse_racks_aisle_id_aisles_numeric` |
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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_warehouse_racks_aisle` | `CREATE INDEX ix_warehouse_racks_aisle ON warehouse.racks USING btree (aisle_id)` |
| `pk_warehouse_racks` | `CREATE UNIQUE INDEX pk_warehouse_racks ON warehouse.racks USING btree (internal_id)` |
| `uq_warehouse_racks_id` | `CREATE UNIQUE INDEX uq_warehouse_racks_id ON warehouse.racks USING btree (id)` |
| `warehouse_rack` | `CREATE UNIQUE INDEX warehouse_rack ON warehouse.racks USING btree (warehouse_id, code)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.racks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["aisle_id","aisle_id_internal_id","warehouse","aisles"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON warehouse.racks FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '["warehouse_id"]')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.racks FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.racks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["aisle_id","aisle_id_internal_id","warehouse","aisles"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.

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
