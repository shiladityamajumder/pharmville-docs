# `marketplace.seller_locations`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds seller locations records within the marketplace domain (sellers and commercial listings). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 21 constraints, 4 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approval_evidence` | `character varying(512)` | Yes | — | Inferred: stores approval evidence for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `approved_at` | `timestamp with time zone` | Yes | — | Time of approved | Support chronology, deadlines or audit evidence | See exact constraints |
| `approved_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_marketplace_seller_locations_approved_by_user_id_users) |
| `authorization_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores authorization status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_marketplace_seller_locations_created_by_users) |
| `fulfillment_mode` | `character varying(32)` | No | `'platform'::character varying` | Inferred: stores fulfillment mode for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `license_id` | `uuid` | Yes | — | Reference linking this record to licenses | Ensures related business data can be joined and validated | FK → `organization.licenses` (fk_marketplace_seller_locations_license_id_licenses) |
| `license_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.licenses` (fk_marketplace_seller_locations_license_id_licenses_numeric); Numeric/public-key pair verification required |
| `location_id` | `uuid` | No | — | Reference linking this record to locations | Ensures related business data can be joined and validated | FK → `organization.locations` (fk_marketplace_seller_locations_location_id_locations) |
| `location_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.locations` (fk_marketplace_seller_locations_location_id_locations_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `seller_id` | `uuid` | No | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` (fk_marketplace_seller_locations_seller_id_sellers) |
| `seller_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` (fk_marketplace_seller_locations_seller_id_sellers_numeric); Numeric/public-key pair verification required |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_marketplace_seller_locations_updated_by_users) |
| `warehouse_id` | `uuid` | Yes | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_marketplace_seller_locations_warehouse_id_warehouses) |
| `warehouse_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` (fk_marketplace_seller_locations_warehouse_id_warehouses_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the seller locations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `marketplace.seller_locations` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_marketplace_seller_locations_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_marketplace_seller_locations_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `seller_id` → `marketplace.sellers(id)` via `fk_marketplace_seller_locations_seller_id_sellers`; `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE CASCADE`
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_marketplace_seller_locations_warehouse_id_warehouses`; `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE SET NULL`
- `location_id` → `organization.locations(id)` via `fk_marketplace_seller_locations_location_id_locations`; `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE RESTRICT`
- `approved_by_user_id` → `identity.users(id)` via `fk_marketplace_seller_locations_approved_by_user_id_users`; `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `license_id` → `organization.licenses(id)` via `fk_marketplace_seller_locations_license_id_licenses`; `FOREIGN KEY (license_id) REFERENCES organization.licenses(id) ON DELETE RESTRICT`
- `license_id_internal_id` → `organization.licenses(internal_id)` via `fk_marketplace_seller_locations_license_id_licenses_numeric`; `FOREIGN KEY (license_id_internal_id) REFERENCES organization.licenses(internal_id) ON DELETE RESTRICT`
- `location_id_internal_id` → `organization.locations(internal_id)` via `fk_marketplace_seller_locations_location_id_locations_numeric`; `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE RESTRICT`
- `seller_id_internal_id` → `marketplace.sellers(internal_id)` via `fk_marketplace_seller_locations_seller_id_sellers_numeric`; `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE CASCADE`
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_marketplace_seller_locations_warehouse_id_warehouses_numeric`; `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE SET NULL`

## `marketplace.seller_locations` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 21 columns, 21 constraints, 4 indexes, 4 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_marketplace_seller_locations_created_by_users` |
| `updated_by` | `identity.users` | `fk_marketplace_seller_locations_updated_by_users` |
| `seller_id` | `marketplace.sellers` | `fk_marketplace_seller_locations_seller_id_sellers` |
| `warehouse_id` | `warehouse.warehouses` | `fk_marketplace_seller_locations_warehouse_id_warehouses` |
| `location_id` | `organization.locations` | `fk_marketplace_seller_locations_location_id_locations` |
| `approved_by_user_id` | `identity.users` | `fk_marketplace_seller_locations_approved_by_user_id_users` |
| `license_id` | `organization.licenses` | `fk_marketplace_seller_locations_license_id_licenses` |
| `license_id_internal_id` | `organization.licenses` | `fk_marketplace_seller_locations_license_id_licenses_numeric` |
| `location_id_internal_id` | `organization.locations` | `fk_marketplace_seller_locations_location_id_locations_numeric` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_marketplace_seller_locations_seller_id_sellers_numeric` |
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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_marketplace_seller_locations_seller` | `CREATE INDEX ix_marketplace_seller_locations_seller ON marketplace.seller_locations USING btree (seller_id)` |
| `pk_marketplace_seller_locations` | `CREATE UNIQUE INDEX pk_marketplace_seller_locations ON marketplace.seller_locations USING btree (internal_id)` |
| `seller_location` | `CREATE UNIQUE INDEX seller_location ON marketplace.seller_locations USING btree (seller_id, location_id)` |
| `uq_marketplace_seller_locations_id` | `CREATE UNIQUE INDEX uq_marketplace_seller_locations_id ON marketplace.seller_locations USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["license_id","license_id_internal_id","organization","licenses"],["location_id","location_id_internal_id","organization","locations"],["seller_id","seller_id_internal_id","marketplace","sellers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |
| `fulfillment_approval_guard` | `CREATE TRIGGER fulfillment_approval_guard BEFORE INSERT OR UPDATE ON marketplace.seller_locations FOR EACH ROW EXECUTE FUNCTION marketplace.guard_fulfillment_approval()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON marketplace.seller_locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["license_id","license_id_internal_id","organization","licenses"],["location_id","location_id_internal_id","organization","locations"],["seller_id","seller_id_internal_id","marketplace","sellers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
