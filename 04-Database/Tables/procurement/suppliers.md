# procurement.suppliers

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds suppliers records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 19 columns, 12 constraints, 5 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `contact_json` | `jsonb` | No | `'{}'::jsonb` | Structured contact json information | Retain a versioned payload or relevant details | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_suppliers_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_suppliers_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `organization_id` | `uuid` | Yes | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` (fk_procurement_suppliers_organization_id_organizations) |
| `organization_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` (fk_procurement_suppliers_organization_id_organizations_numeric); Numeric/public-key pair verification required |
| `payment_terms_days` | `integer` | No | `0` | Inferred: stores payment terms days for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `risk_rating` | `character varying(32)` | Yes | — | Inferred: stores risk rating for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `supplier_code` | `character varying(64)` | No | — | Code for supplier | Link to controlled business classification or an external reference | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_suppliers_updated_by_users) |
| `verification_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores verification status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the suppliers business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.suppliers` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_procurement_suppliers_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_procurement_suppliers_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_procurement_suppliers_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `organization_id` → `organization.organizations(id)` via `fk_procurement_suppliers_organization_id_organizations`; FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE RESTRICT
- `organization_id_internal_id` → `organization.organizations(internal_id)` via `fk_procurement_suppliers_organization_id_organizations_numeric`; FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE RESTRICT

**Referenced by 14 FK constraints** (sample): `procurement.supplier_licenses`, `procurement.supplier_products`, `procurement.purchase_orders`, `procurement.supplier_invoices`, `procurement.purchase_returns`, `warehouse.inventory_lots`, `warehouse.replenishment_rules`, `procurement.purchase_orders`, `procurement.purchase_returns`, `procurement.supplier_invoices`, `procurement.supplier_licenses`, `procurement.supplier_products`.

## procurement.suppliers — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 19 columns, 12 constraints, 5 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_suppliers_created_by_users` |
| `deleted_by` | `identity.users` | `fk_procurement_suppliers_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_procurement_suppliers_updated_by_users` |
| `organization_id` | `organization.organizations` | `fk_procurement_suppliers_organization_id_organizations` |
| `organization_id_internal_id` | `organization.organizations` | `fk_procurement_suppliers_organization_id_organizations_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_procurement_suppliers_numeric_pair_organization_id` | CHECK | `CHECK ((organization_id IS NULL) = (organization_id_internal_id IS NULL))` |
| `ck_procurement_suppliers_payment_terms_nonnegative` | CHECK | `CHECK (payment_terms_days >= 0)` |
| `ck_procurement_suppliers_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_procurement_suppliers_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(supplier_code::text)) > 0 AND supplier_code::text = btrim(supplier_code::text))` |
| `ck_procurement_suppliers_verificationstatus` | CHECK | `CHECK (verification_status::text = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text, 'expired'::text]))` |
| `fk_procurement_suppliers_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_suppliers_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_suppliers_organization_id_organizations` | FOREIGN KEY | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE RESTRICT` |
| `fk_procurement_suppliers_organization_id_organizations_numeric` | FOREIGN KEY | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE RESTRICT` |
| `fk_procurement_suppliers_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_procurement_suppliers` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_procurement_suppliers_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_procurement_suppliers_organization` | `CREATE INDEX ix_procurement_suppliers_organization ON procurement.suppliers USING btree (organization_id)` |
| `ix_procurement_suppliers_status` | `CREATE INDEX ix_procurement_suppliers_status ON procurement.suppliers USING btree (status)` |
| `pk_procurement_suppliers` | `CREATE UNIQUE INDEX pk_procurement_suppliers ON procurement.suppliers USING btree (internal_id)` |
| `uq_procurement_supplier_code_active` | `CREATE UNIQUE INDEX uq_procurement_supplier_code_active ON procurement.suppliers USING btree (supplier_code) WHERE is_deleted = false` |
| `uq_procurement_suppliers_id` | `CREATE UNIQUE INDEX uq_procurement_suppliers_id ON procurement.suppliers USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.suppliers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON procurement.suppliers FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('supplier_code', '[]')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.suppliers FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.suppliers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
