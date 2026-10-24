# `warehouse.warehouses`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds warehouses records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 13 constraints, 6 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_warehouses_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_warehouses_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `location_id` | `uuid` | No | — | Reference linking this record to locations | Ensures related business data can be joined and validated | FK → `organization.locations` (fk_warehouse_warehouses_location_id_locations) |
| `location_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.locations` (fk_warehouse_warehouses_location_id_locations_numeric); Numeric/public-key pair verification required |
| `name` | `character varying(150)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `operating_hours` | `jsonb` | No | `'{}'::jsonb` | Structured operating hours information | Retain a versioned payload or relevant details | See exact constraints |
| `organization_id` | `uuid` | No | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` (fk_warehouse_warehouses_organization_id_organizations) |
| `organization_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` (fk_warehouse_warehouses_organization_id_organizations_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `supports_cold_chain` | `boolean` | No | `false` | Inferred: stores supports cold chain for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `supports_controlled_drugs` | `boolean` | No | `false` | Inferred: stores supports controlled drugs for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_warehouses_updated_by_users) |
| `warehouse_type` | `character varying(32)` | No | — | Inferred: stores warehouse type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the warehouses business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.warehouses` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_warehouse_warehouses_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_warehouse_warehouses_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_warehouse_warehouses_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `location_id` → `organization.locations(id)` via `fk_warehouse_warehouses_location_id_locations`; `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE RESTRICT`
- `organization_id` → `organization.organizations(id)` via `fk_warehouse_warehouses_organization_id_organizations`; `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE RESTRICT`
- `location_id_internal_id` → `organization.locations(internal_id)` via `fk_warehouse_warehouses_location_id_locations_numeric`; `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE RESTRICT`
- `organization_id_internal_id` → `organization.organizations(internal_id)` via `fk_warehouse_warehouses_organization_id_organizations_numeric`; `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE RESTRICT`

**Referenced by 52 FK constraints** (sample): `commerce.order_groups`, `commerce.order_allocations`, `fulfillment.fulfillment_orders`, `fulfillment.picking_waves`, `logistics.delivery_slots`, `logistics.delivery_routes`, `marketplace.seller_locations`, `pricing.price_books`, `procurement.purchase_requisitions`, `procurement.purchase_orders`, `procurement.goods_receipts`, `procurement.purchase_returns`.

## `warehouse.warehouses` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 21 columns, 13 constraints, 6 indexes, 4 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_warehouse_warehouses_created_by_users` |
| `deleted_by` | `identity.users` | `fk_warehouse_warehouses_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_warehouse_warehouses_updated_by_users` |
| `location_id` | `organization.locations` | `fk_warehouse_warehouses_location_id_locations` |
| `organization_id` | `organization.organizations` | `fk_warehouse_warehouses_organization_id_organizations` |
| `location_id_internal_id` | `organization.locations` | `fk_warehouse_warehouses_location_id_locations_numeric` |
| `organization_id_internal_id` | `organization.organizations` | `fk_warehouse_warehouses_organization_id_organizations_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_warehouses_numeric_pair_location_id` | CHECK | `CHECK ((location_id IS NULL) = (location_id_internal_id IS NULL))` |
| `ck_warehouse_warehouses_numeric_pair_organization_id` | CHECK | `CHECK ((organization_id IS NULL) = (organization_id_internal_id IS NULL))` |
| `ck_warehouse_warehouses_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_warehouse_warehouses_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(code::text)) > 0 AND code::text = btrim(code::text))` |
| `fk_warehouse_warehouses_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_warehouses_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_warehouses_location_id_locations` | FOREIGN KEY | `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE RESTRICT` |
| `fk_warehouse_warehouses_location_id_locations_numeric` | FOREIGN KEY | `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_warehouses_organization_id_organizations` | FOREIGN KEY | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE RESTRICT` |
| `fk_warehouse_warehouses_organization_id_organizations_numeric` | FOREIGN KEY | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_warehouses_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_warehouse_warehouses` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_warehouse_warehouses_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_warehouse_warehouses_location` | `CREATE INDEX ix_warehouse_warehouses_location ON warehouse.warehouses USING btree (location_id)` |
| `ix_warehouse_warehouses_organization` | `CREATE INDEX ix_warehouse_warehouses_organization ON warehouse.warehouses USING btree (organization_id)` |
| `ix_warehouse_warehouses_status` | `CREATE INDEX ix_warehouse_warehouses_status ON warehouse.warehouses USING btree (status)` |
| `pk_warehouse_warehouses` | `CREATE UNIQUE INDEX pk_warehouse_warehouses ON warehouse.warehouses USING btree (internal_id)` |
| `uq_warehouse_code_active` | `CREATE UNIQUE INDEX uq_warehouse_code_active ON warehouse.warehouses USING btree (code) WHERE is_deleted = false` |
| `uq_warehouse_warehouses_id` | `CREATE UNIQUE INDEX uq_warehouse_warehouses_id ON warehouse.warehouses USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.warehouses FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON warehouse.warehouses FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '[]')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.warehouses FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.warehouses FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `warehouse.warehouses` |
| Category | Master / Reference — Stock-holding site identities linked to organization locations |
| Proposed owner / maintenance role | Warehouse / Organization / Warehouse administrator |
| Scope | Organization-specific via organization_id. |
| Referencing tables | `commerce.order_allocations`, `commerce.order_groups`, `fulfillment.fulfillment_orders`, `fulfillment.picking_waves`, `logistics.delivery_routes`, `logistics.delivery_slots`, `marketplace.seller_locations`, `pricing.price_books`, `procurement.goods_receipts`, `procurement.purchase_orders`, `procurement.purchase_requisitions`, `procurement.purchase_returns`, `warehouse.aisles`, `warehouse.bins`, `warehouse.cycle_counts`, `warehouse.inventory_adjustments`, `warehouse.inventory_lots`, `warehouse.racks`, `warehouse.replenishment_rules`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`, `warehouse.stock_reservations`, `warehouse.stock_transfers`, `warehouse.zones` |
| Features | `ADM-01`, `CAT-02`, `CAT-04`, `CHK-02`, `CHK-03`, `CHK-05`, `CHK-06`, `CHK-08`, `FIN-01`, `INV-01`, `INV-03`, `INV-04`, `INV-05`, `INV-07`, `OMS-01`, `OMS-02`, `OMS-03`, `OMS-04`, `ORD-04`, `REP-03`, `REP-04`, `RID-02`, `STO-01`, `STO-02`, `STO-03`, `STO-04`, `WH-01`, `WH-02`, `WH-04` |
| API consumers | [API-012](../../../05-APIs/Product_Catalog.md), [API-014](../../../05-APIs/Product_Catalog.md), [API-020](../../../05-APIs/Cart_Checkout.md), [API-027](../../../05-APIs/Customer_Orders.md), [API-032](../../../05-APIs/Admin_CMS.md), [API-039](../../../05-APIs/Order_Operations.md), [API-040](../../../05-APIs/Order_Operations.md), [API-041](../../../05-APIs/Order_Operations.md), [API-042](../../../05-APIs/Order_Operations.md), [API-044](../../../05-APIs/Store_Operations.md), [API-045](../../../05-APIs/Store_Operations.md), [API-046](../../../05-APIs/Store_Operations.md), [API-047](../../../05-APIs/Store_Operations.md), [API-048](../../../05-APIs/Store_Operations.md), [API-049](../../../05-APIs/Store_Operations.md), [API-050](../../../05-APIs/Inventory.md), [API-051](../../../05-APIs/Inventory.md), [API-052](../../../05-APIs/Inventory.md), [API-053](../../../05-APIs/Inventory.md), [API-054](../../../05-APIs/Inventory.md), [API-055](../../../05-APIs/Inventory.md), [API-056](../../../05-APIs/Warehouse.md), [API-057](../../../05-APIs/Warehouse.md), [API-058](../../../05-APIs/Warehouse.md), [API-059](../../../05-APIs/Warehouse.md), [API-071](../../../05-APIs/Rider_App.md), [API-075](../../../05-APIs/Finance_Payments.md), [API-084](../../../05-APIs/Reporting.md), [API-085](../../../05-APIs/Reporting.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Create one stock-holding warehouse record per approved eligible location mapping; the 1+33 operating model does not by itself establish exact warehouse records/code/location_id values. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `code`, `location_id`, `name`, `organization_id`, `warehouse_type`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Organization / Warehouse administrator through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use approved inactive/closed status from the table CHECK/owner policy; do not invent unsupported status values. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_warehouse_code_active ON warehouse.warehouses USING btree (code) WHERE is_deleted = false; CREATE UNIQUE INDEX uq_warehouse_warehouses_id ON warehouse.warehouses USING btree (id) |
| Foreign-key dependencies | `organization.locations`, `organization.organizations` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-001 phase scope and responsible steward evidence. |
