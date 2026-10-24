# `marketplace.sellers`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds sellers records within the marketplace domain (sellers and commercial listings). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 13 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `commission_plan_id` | `uuid` | Yes | — | Reference linking this record to commission plans | Ensures related business data can be joined and validated | FK → `marketplace.commission_plans` (fk_domain_marketplace_sellers_commission_plan_id) |
| `commission_plan_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.commission_plans` (fk_domain_marketplace_sellers_commission_plan_id_numeric); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_marketplace_sellers_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_marketplace_sellers_deleted_by_users) |
| `display_name` | `character varying(255)` | No | — | Inferred: stores display name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `organization_id` | `uuid` | No | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` (fk_marketplace_sellers_organization_id_organizations) |
| `organization_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` (fk_marketplace_sellers_organization_id_organizations_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `seller_code` | `character varying(64)` | No | — | Code for seller | Link to controlled business classification or an external reference | See exact constraints |
| `seller_type` | `character varying(32)` | No | — | Inferred: stores seller type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `settlement_cycle` | `character varying(32)` | No | `'weekly'::character varying` | Inferred: stores settlement cycle for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `status` | `character varying(32)` | No | `'onboarding'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_marketplace_sellers_updated_by_users) |
| `verification_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores verification status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the sellers business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `marketplace.sellers` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_marketplace_sellers_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_marketplace_sellers_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_marketplace_sellers_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `organization_id` → `organization.organizations(id)` via `fk_marketplace_sellers_organization_id_organizations`; `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE RESTRICT`
- `commission_plan_id` → `marketplace.commission_plans(id)` via `fk_domain_marketplace_sellers_commission_plan_id`; `FOREIGN KEY (commission_plan_id) REFERENCES marketplace.commission_plans(id) ON DELETE RESTRICT`
- `commission_plan_id_internal_id` → `marketplace.commission_plans(internal_id)` via `fk_domain_marketplace_sellers_commission_plan_id_numeric`; `FOREIGN KEY (commission_plan_id_internal_id) REFERENCES marketplace.commission_plans(internal_id) ON DELETE RESTRICT`
- `organization_id_internal_id` → `organization.organizations(internal_id)` via `fk_marketplace_sellers_organization_id_organizations_numeric`; `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE RESTRICT`

**Referenced by 26 FK constraints** (sample): `commerce.cart_items`, `commerce.order_groups`, `commerce.order_items`, `commerce.order_allocations`, `finance.invoices`, `finance.settlement_runs`, `fulfillment.fulfillment_orders`, `marketplace.seller_locations`, `marketplace.seller_product_listings`, `marketplace.seller_commission_assignments`, `marketplace.seller_ratings`, `marketplace.seller_service_levels`.

## `marketplace.sellers` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 21 columns, 13 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_marketplace_sellers_created_by_users` |
| `deleted_by` | `identity.users` | `fk_marketplace_sellers_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_marketplace_sellers_updated_by_users` |
| `organization_id` | `organization.organizations` | `fk_marketplace_sellers_organization_id_organizations` |
| `commission_plan_id` | `marketplace.commission_plans` | `fk_domain_marketplace_sellers_commission_plan_id` |
| `commission_plan_id_internal_id` | `marketplace.commission_plans` | `fk_domain_marketplace_sellers_commission_plan_id_numeric` |
| `organization_id_internal_id` | `organization.organizations` | `fk_marketplace_sellers_organization_id_organizations_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_marketplace_sellers_numeric_pair_commission_plan_id` | CHECK | `CHECK ((commission_plan_id IS NULL) = (commission_plan_id_internal_id IS NULL))` |
| `ck_marketplace_sellers_numeric_pair_organization_id` | CHECK | `CHECK ((organization_id IS NULL) = (organization_id_internal_id IS NULL))` |
| `ck_marketplace_sellers_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_marketplace_sellers_verificationstatus` | CHECK | `CHECK (verification_status::text = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text, 'expired'::text]))` |
| `fk_domain_marketplace_sellers_commission_plan_id` | FOREIGN KEY | `FOREIGN KEY (commission_plan_id) REFERENCES marketplace.commission_plans(id) ON DELETE RESTRICT` |
| `fk_domain_marketplace_sellers_commission_plan_id_numeric` | FOREIGN KEY | `FOREIGN KEY (commission_plan_id_internal_id) REFERENCES marketplace.commission_plans(internal_id) ON DELETE RESTRICT` |
| `fk_marketplace_sellers_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_marketplace_sellers_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_marketplace_sellers_organization_id_organizations` | FOREIGN KEY | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE RESTRICT` |
| `fk_marketplace_sellers_organization_id_organizations_numeric` | FOREIGN KEY | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE RESTRICT` |
| `fk_marketplace_sellers_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_marketplace_sellers` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_marketplace_sellers_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_marketplace_sellers_organization` | `CREATE INDEX ix_marketplace_sellers_organization ON marketplace.sellers USING btree (organization_id)` |
| `ix_marketplace_sellers_status` | `CREATE INDEX ix_marketplace_sellers_status ON marketplace.sellers USING btree (verification_status)` |
| `pk_marketplace_sellers` | `CREATE UNIQUE INDEX pk_marketplace_sellers ON marketplace.sellers USING btree (internal_id)` |
| `uq_marketplace_sellers_code_active` | `CREATE UNIQUE INDEX uq_marketplace_sellers_code_active ON marketplace.sellers USING btree (seller_code) WHERE is_deleted = false` |
| `uq_marketplace_sellers_id` | `CREATE UNIQUE INDEX uq_marketplace_sellers_id ON marketplace.sellers USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON marketplace.sellers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["commission_plan_id","commission_plan_id_internal_id","marketplace","commission_plans"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON marketplace.sellers FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON marketplace.sellers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["commission_plan_id","commission_plan_id_internal_id","marketplace","commission_plans"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `marketplace.sellers` |
| Category | Master / Reference — Verified seller parties |
| Proposed owner / maintenance role | Future marketplace / Marketplace onboarding owner |
| Scope | Organization-specific via organization_id. |
| Referencing tables | `commerce.cart_items`, `commerce.order_allocations`, `commerce.order_groups`, `commerce.order_items`, `finance.invoices`, `finance.settlement_runs`, `fulfillment.fulfillment_orders`, `marketplace.seller_commission_assignments`, `marketplace.seller_locations`, `marketplace.seller_product_listings`, `marketplace.seller_ratings`, `marketplace.seller_service_levels`, `pricing.price_books` |
| Features | `CAT-02`, `CHK-01`, `CHK-02`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08`, `FIN-02`, `INV-01`, `INV-03`, `OMS-01`, `OMS-02`, `OMS-03`, `OMS-04`, `OMS-05`, `ORD-02`, `ORD-03`, `ORD-04`, `ORD-05`, `PHM-03`, `PHM-05`, `REP-01`, `REP-02`, `REP-04`, `RID-02`, `RX-04`, `RX-05`, `STO-01`, `STO-02`, `WH-04` |
| API consumers | [API-012](../../../05-APIs/Product_Catalog.md), [API-018](../../../05-APIs/Cart_Checkout.md), [API-019](../../../05-APIs/Cart_Checkout.md), [API-020](../../../05-APIs/Cart_Checkout.md), [API-021](../../../05-APIs/Cart_Checkout.md), [API-024](../../../05-APIs/Prescription_Upload.md), [API-026](../../../05-APIs/Customer_Orders.md), [API-027](../../../05-APIs/Customer_Orders.md), [API-028](../../../05-APIs/Customer_Orders.md), [API-029](../../../05-APIs/Customer_Orders.md), [API-039](../../../05-APIs/Order_Operations.md), [API-040](../../../05-APIs/Order_Operations.md), [API-041](../../../05-APIs/Order_Operations.md), [API-042](../../../05-APIs/Order_Operations.md), [API-043](../../../05-APIs/Order_Operations.md), [API-044](../../../05-APIs/Store_Operations.md), [API-045](../../../05-APIs/Store_Operations.md), [API-046](../../../05-APIs/Store_Operations.md), [API-047](../../../05-APIs/Store_Operations.md), [API-052](../../../05-APIs/Inventory.md), [API-059](../../../05-APIs/Warehouse.md), [API-062](../../../05-APIs/Pharmacist_Review.md), [API-063](../../../05-APIs/Pharmacist_Review.md), [API-071](../../../05-APIs/Rider_App.md), [API-081](../../../05-APIs/Finance_Payments.md), [API-082](../../../05-APIs/Reporting.md), [API-083](../../../05-APIs/Reporting.md), [API-085](../../../05-APIs/Reporting.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `display_name`, `organization_id`, `seller_code`, `seller_type`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Deferred future module: no launch seed or API scope is implied. |
| Create/update permissions | Marketplace onboarding owner through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use is_active=false to retire from new selection; keep referenced history. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_marketplace_sellers_code_active ON marketplace.sellers USING btree (seller_code) WHERE is_deleted = false; CREATE UNIQUE INDEX uq_marketplace_sellers_id ON marketplace.sellers USING btree (id) |
| Foreign-key dependencies | `marketplace.commission_plans`, `organization.organizations` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-001 phase scope and responsible steward evidence. |
