# `warehouse.stock_movement_reason_codes`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds stock movement reason codes records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | warehouse.stock_movement_reason_codes |
| Classification | Master / Reference |
| Proposed business write owner | Inventory |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | id |
| Structural counts | 11 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 8 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_stock_movement_reason_codes_created_by_use_4ca9` |
| `description` | `text` | Yes | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `display_name` | `character varying(150)` | No | — | Inferred: stores display name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `bigint` | No | — | Internal numeric primary key | Uniquely identifies a master or newer table row | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `sort_order` | `integer` | No | `0` | Inferred: stores sort order for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_stock_movement_reason_codes_updated_by_use_6a3d` |

## Record lifecycle and users

- **Created:** when the stock movement reason codes business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.stock_movement_reason_codes` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_warehouse_stock_movement_reason_codes_created_by_use_4ca9 | `created_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_movement_reason_codes_updated_by_use_6a3d | `updated_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`warehouse.cycle_count_items`](../../Tables/warehouse/cycle_count_items.md) | fk_warehouse_cycle_count_items_controlled_reason | `reason_code_id, reason_code` | `id, code` |
| [`warehouse.inventory_adjustments`](../../Tables/warehouse/inventory_adjustments.md) | fk_warehouse_inventory_adjustments_controlled_reason | `reason_code_id, reason_code` | `id, code` |
| [`warehouse.stock_holds`](../../Tables/warehouse/stock_holds.md) | fk_warehouse_stock_holds_controlled_reason | `reason_code_id, reason_code` | `id, code` |
| [`warehouse.stock_ledger`](../../Tables/warehouse/stock_ledger.md) | fk_warehouse_stock_ledger_controlled_reason | `reason_code_id, reason_code` | `id, code` |

## `warehouse.stock_movement_reason_codes` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by_user_id` | `identity.users` | `fk_warehouse_stock_movement_reason_codes_created_by_use_4ca9` |
| `updated_by_user_id` | `identity.users` | `fk_warehouse_stock_movement_reason_codes_updated_by_use_6a3d` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_stock_movement_reason_codes_canonical_code` | CHECK | `CHECK (code::text ~ '^[A-Z][A-Z0-9_]{0,63}$'::text)` |
| `ck_warehouse_stock_movement_reason_codes_display_name_nonblank` | CHECK | `CHECK (length(btrim(display_name::text)) > 0)` |
| `ck_warehouse_stock_movement_reason_codes_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_warehouse_stock_movement_reason_codes_sort_order_nonnegative` | CHECK | `CHECK (sort_order >= 0)` |
| `fk_warehouse_stock_movement_reason_codes_created_by_use_4ca9` | FOREIGN KEY | `FOREIGN KEY (created_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_movement_reason_codes_updated_by_use_6a3d` | FOREIGN KEY | `FOREIGN KEY (updated_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_warehouse_stock_movement_reason_codes` | PRIMARY KEY | `PRIMARY KEY (id)` |
| `uq_warehouse_stock_movement_reason_codes_code` | UNIQUE | `UNIQUE (code)` |
| `uq_warehouse_stock_movement_reason_codes_id_code` | UNIQUE | `UNIQUE (id, code)` |
| `stock_movement_reason_codes_code_not_null` | NOT NULL | `NOT NULL code` |
| `stock_movement_reason_codes_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `stock_movement_reason_codes_display_name_not_null` | NOT NULL | `NOT NULL display_name` |
| `stock_movement_reason_codes_id_not_null` | NOT NULL | `NOT NULL id` |
| `stock_movement_reason_codes_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `stock_movement_reason_codes_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `stock_movement_reason_codes_sort_order_not_null` | NOT NULL | `NOT NULL sort_order` |
| `stock_movement_reason_codes_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_warehouse_stock_movement_reason_codes` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_warehouse_stock_movement_reason_codes ON warehouse.stock_movement_reason_codes USING btree (id)` |
| `uq_warehouse_stock_movement_reason_codes_code` | btree | `(code)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_stock_movement_reason_codes_code ON warehouse.stock_movement_reason_codes USING btree (code)` |
| `uq_warehouse_stock_movement_reason_codes_id_code` | btree | `(id, code)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_stock_movement_reason_codes_id_code ON warehouse.stock_movement_reason_codes USING btree (id, code)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_movement_reason_codes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'id', '')` | O |
| `master_guard` | `CREATE TRIGGER master_guard BEFORE INSERT OR DELETE OR UPDATE ON warehouse.stock_movement_reason_codes FOR EACH ROW EXECUTE FUNCTION platform.guard_master()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.stock_movement_reason_codes FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_movement_reason_codes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'id', '')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `warehouse.stock_movement_reason_codes` |
| Category | Master / Reference — Controlled stock movement and discrepancy reasons |
| Proposed owner / maintenance role | Inventory / Inventory controller |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `warehouse.cycle_count_items`, `warehouse.inventory_adjustments`, `warehouse.stock_holds`, `warehouse.stock_ledger` |
| Features | `CHK-08`, `INV-01`, `INV-03`, `INV-04` |
| API consumers | [API-052](../../../03-Modules/Inventory/APIs.md), [API-053](../../../03-Modules/Inventory/APIs.md), [API-054](../../../03-Modules/Inventory/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source | Additional schema attributes |
| --- | --- | --- | --- | --- | --- |
| RECEIPT | Accepted supplier receipt | Operational reason/tag only; not a clinical, financial entitlement or automatic disposition rule. | Proposed | Existing reason-linked schema and relevant documented workflow | display_name=Accepted supplier receipt; is_active=true; sort_order=0 |
| TRANSFER | Inter-site transfer | Operational reason/tag only; not a clinical, financial entitlement or automatic disposition rule. | Proposed | Existing reason-linked schema and relevant documented workflow | display_name=Inter-site transfer; is_active=true; sort_order=1 |
| COUNT_VARIANCE | Investigated count variance | Operational reason/tag only; not a clinical, financial entitlement or automatic disposition rule. | Proposed | Existing reason-linked schema and relevant documented workflow | display_name=Investigated count variance; is_active=true; sort_order=2 |
| RESERVATION_RELEASE | Unused reservation released | Operational reason/tag only; not a clinical, financial entitlement or automatic disposition rule. | Proposed | Existing reason-linked schema and relevant documented workflow | display_name=Unused reservation released; is_active=true; sort_order=3 |

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Deployment reference seed after approval, followed by controlled administration. |
| Create/update permissions | Inventory controller through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use is_active=false to retire from new selection; keep referenced history. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (code); UNIQUE: UNIQUE (id, code); CREATE UNIQUE INDEX uq_warehouse_stock_movement_reason_codes_code ON warehouse.stock_movement_reason_codes USING btree (code); CREATE UNIQUE INDEX uq_warehouse_stock_movement_reason_codes_id_code ON warehouse.stock_movement_reason_codes USING btree (id, code) |
| Foreign-key dependencies | No non-actor FK dependencies recorded. |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Explicit rows above are Confirmed domain values or Proposed initial records, never observed production/seed data. No live row existence or seed execution was verified. |
| Pending decisions | D-024 ownership/lifecycle approval; D-001 phase scope and responsible steward evidence. |
