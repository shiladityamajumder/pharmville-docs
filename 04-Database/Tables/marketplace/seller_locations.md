# `marketplace.seller_locations`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds seller locations records within the marketplace domain (sellers and commercial listings). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | marketplace.seller_locations |
| Classification | Mapping / Junction |
| Proposed business write owner | Future marketplace owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 21 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approval_evidence` | `character varying(512)` | Yes | — | Inferred: stores approval evidence for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `approved_at` | `timestamp with time zone` | Yes | — | Time of approved | Support chronology, deadlines or audit evidence | Exact constraints below |
| `approved_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_marketplace_seller_locations_approved_by_user_id_users` |
| `authorization_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores authorization status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_marketplace_seller_locations_created_by_users` |
| `fulfillment_mode` | `character varying(32)` | No | `'platform'::character varying` | Inferred: stores fulfillment mode for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `license_id` | `uuid` | Yes | — | Reference linking this record to licenses | Ensures related business data can be joined and validated | FK → `organization.licenses` via `fk_marketplace_seller_locations_license_id_licenses` |
| `license_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.licenses` via `fk_marketplace_seller_locations_license_id_licenses_numeric` |
| `location_id` | `uuid` | No | — | Reference linking this record to locations | Ensures related business data can be joined and validated | FK → `organization.locations` via `fk_marketplace_seller_locations_location_id_locations` |
| `location_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.locations` via `fk_marketplace_seller_locations_location_id_locations_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `seller_id` | `uuid` | No | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` via `fk_marketplace_seller_locations_seller_id_sellers` |
| `seller_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` via `fk_marketplace_seller_locations_seller_id_sellers_numeric` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_marketplace_seller_locations_updated_by_users` |
| `warehouse_id` | `uuid` | Yes | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_marketplace_seller_locations_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_marketplace_seller_locations_warehouse_id_warehouses_numeric` |

## Record lifecycle and users

- **Created:** when the seller locations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `marketplace.seller_locations` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_marketplace_seller_locations_approved_by_user_id_users | `approved_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_marketplace_seller_locations_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_marketplace_seller_locations_license_id_licenses | `license_id` | [`organization.licenses`](../../Tables/organization/licenses.md) | `FOREIGN KEY (license_id) REFERENCES organization.licenses(id) ON DELETE RESTRICT` |
| fk_marketplace_seller_locations_license_id_licenses_numeric | `license_id_internal_id` | [`organization.licenses`](../../Tables/organization/licenses.md) | `FOREIGN KEY (license_id_internal_id) REFERENCES organization.licenses(internal_id) ON DELETE RESTRICT` |
| fk_marketplace_seller_locations_location_id_locations | `location_id` | [`organization.locations`](../../Tables/organization/locations.md) | `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE RESTRICT` |
| fk_marketplace_seller_locations_location_id_locations_numeric | `location_id_internal_id` | [`organization.locations`](../../Tables/organization/locations.md) | `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE RESTRICT` |
| fk_marketplace_seller_locations_seller_id_sellers | `seller_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE CASCADE` |
| fk_marketplace_seller_locations_seller_id_sellers_numeric | `seller_id_internal_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE CASCADE` |
| fk_marketplace_seller_locations_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_marketplace_seller_locations_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE SET NULL` |
| fk_marketplace_seller_locations_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE SET NULL` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `marketplace.seller_locations` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `approved_by_user_id` | `identity.users` | `fk_marketplace_seller_locations_approved_by_user_id_users` |
| `created_by` | `identity.users` | `fk_marketplace_seller_locations_created_by_users` |
| `license_id` | `organization.licenses` | `fk_marketplace_seller_locations_license_id_licenses` |
| `license_id_internal_id` | `organization.licenses` | `fk_marketplace_seller_locations_license_id_licenses_numeric` |
| `location_id` | `organization.locations` | `fk_marketplace_seller_locations_location_id_locations` |
| `location_id_internal_id` | `organization.locations` | `fk_marketplace_seller_locations_location_id_locations_numeric` |
| `seller_id` | `marketplace.sellers` | `fk_marketplace_seller_locations_seller_id_sellers` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_marketplace_seller_locations_seller_id_sellers_numeric` |
| `updated_by` | `identity.users` | `fk_marketplace_seller_locations_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_marketplace_seller_locations_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_marketplace_seller_locations_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_marketplace_seller_locations_approved_evidence` | CHECK | `CHECK (authorization_status::text <> 'approved'::text OR license_id IS NOT NULL AND approved_by_user_id IS NOT NULL AND approved_at IS NOT NULL AND length(btrim(approval_evidence::text)) > 0)` |
| `ck_marketplace_seller_locations_authorization_status` | CHECK | `CHECK (authorization_status::text = ANY (ARRAY['pending'::text, 'approved'::text, 'suspended'::text]))` |
| `ck_marketplace_seller_locations_numeric_pair_license_id` | CHECK | `CHECK ((license_id IS NULL) = (license_id_internal_id IS NULL))` |
| `ck_marketplace_seller_locations_numeric_pair_location_id` | CHECK | `CHECK ((location_id IS NULL) = (location_id_internal_id IS NULL))` |
| `ck_marketplace_seller_locations_numeric_pair_seller_id` | CHECK | `CHECK ((seller_id IS NULL) = (seller_id_internal_id IS NULL))` |
| `ck_marketplace_seller_locations_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_marketplace_seller_locations_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_marketplace_seller_locations_approved_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_locations_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_locations_license_id_licenses` | FOREIGN KEY | `FOREIGN KEY (license_id) REFERENCES organization.licenses(id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_locations_license_id_licenses_numeric` | FOREIGN KEY | `FOREIGN KEY (license_id_internal_id) REFERENCES organization.licenses(internal_id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_locations_location_id_locations` | FOREIGN KEY | `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_locations_location_id_locations_numeric` | FOREIGN KEY | `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_locations_seller_id_sellers` | FOREIGN KEY | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE CASCADE` |
| `fk_marketplace_seller_locations_seller_id_sellers_numeric` | FOREIGN KEY | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE CASCADE` |
| `fk_marketplace_seller_locations_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_locations_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE SET NULL` |
| `fk_marketplace_seller_locations_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE SET NULL` |
| `pk_marketplace_seller_locations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `seller_location` | UNIQUE | `UNIQUE (seller_id, location_id)` |
| `uq_marketplace_seller_locations_id` | UNIQUE | `UNIQUE (id)` |
| `seller_locations_authorization_status_not_null` | NOT NULL | `NOT NULL authorization_status` |
| `seller_locations_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `seller_locations_fulfillment_mode_not_null` | NOT NULL | `NOT NULL fulfillment_mode` |
| `seller_locations_id_not_null` | NOT NULL | `NOT NULL id` |
| `seller_locations_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `seller_locations_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `seller_locations_location_id_internal_id_not_null` | NOT NULL | `NOT NULL location_id_internal_id` |
| `seller_locations_location_id_not_null` | NOT NULL | `NOT NULL location_id` |
| `seller_locations_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `seller_locations_seller_id_internal_id_not_null` | NOT NULL | `NOT NULL seller_id_internal_id` |
| `seller_locations_seller_id_not_null` | NOT NULL | `NOT NULL seller_id` |
| `seller_locations_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_marketplace_seller_locations_seller` | btree | `(seller_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_marketplace_seller_locations_seller ON marketplace.seller_locations USING btree (seller_id)` |
| `pk_marketplace_seller_locations` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_marketplace_seller_locations ON marketplace.seller_locations USING btree (internal_id)` |
| `seller_location` | btree | `(seller_id, location_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX seller_location ON marketplace.seller_locations USING btree (seller_id, location_id)` |
| `uq_marketplace_seller_locations_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_marketplace_seller_locations_id ON marketplace.seller_locations USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["license_id","license_id_internal_id","organization","licenses"],["location_id","location_id_internal_id","organization","locations"],["seller_id","seller_id_internal_id","marketplace","sellers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `fulfillment_approval_guard` | `CREATE TRIGGER fulfillment_approval_guard BEFORE INSERT OR UPDATE ON marketplace.seller_locations FOR EACH ROW EXECUTE FUNCTION marketplace.guard_fulfillment_approval()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON marketplace.seller_locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["license_id","license_id_internal_id","organization","licenses"],["location_id","location_id_internal_id","organization","locations"],["seller_id","seller_id_internal_id","marketplace","sellers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
