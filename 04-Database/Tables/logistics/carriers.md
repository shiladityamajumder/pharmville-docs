# `logistics.carriers`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds carriers records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | logistics.carriers |
| Classification | Master / Reference |
| Proposed business write owner | Delivery_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 18 columns; 7 PK/FK/UQ/CHECK/exclusion constraints; 13 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_carriers_created_by_users` |
| `credentials_secret_ref` | `character varying(255)` | Yes | — | Inferred: stores credentials secret ref for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_carriers_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `integration_type` | `character varying(32)` | No | — | Inferred: stores integration type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `name` | `character varying(128)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `supports_cod` | `boolean` | No | `false` | Inferred: stores supports cod for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `supports_cold_chain` | `boolean` | No | `false` | Inferred: stores supports cold chain for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `supports_reverse` | `boolean` | No | `false` | Inferred: stores supports reverse for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_carriers_updated_by_users` |

## Record lifecycle and users

- **Created:** when the carriers business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.carriers` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_logistics_carriers_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_logistics_carriers_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_logistics_carriers_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`logistics.carrier_accounts`](../../Tables/logistics/carrier_accounts.md) | fk_logistics_carrier_accounts_carrier_id_carriers | `carrier_id` | `id` |
| [`logistics.carrier_accounts`](../../Tables/logistics/carrier_accounts.md) | fk_logistics_carrier_accounts_carrier_id_carriers_numeric | `carrier_id_internal_id` | `internal_id` |
| [`logistics.reverse_shipments`](../../Tables/logistics/reverse_shipments.md) | fk_logistics_reverse_shipments_carrier_id_carriers | `carrier_id` | `id` |
| [`logistics.reverse_shipments`](../../Tables/logistics/reverse_shipments.md) | fk_logistics_reverse_shipments_carrier_id_carriers_numeric | `carrier_id_internal_id` | `internal_id` |
| [`logistics.serviceability_rules`](../../Tables/logistics/serviceability_rules.md) | fk_logistics_serviceability_rules_carrier_id_carriers | `carrier_id` | `id` |
| [`logistics.serviceability_rules`](../../Tables/logistics/serviceability_rules.md) | fk_logistics_serviceability_rules_carrier_id_carriers_numeric | `carrier_id_internal_id` | `internal_id` |
| [`logistics.shipment_events`](../../Tables/logistics/shipment_events.md) | fk_logistics_shipment_events_carrier_id_carriers | `carrier_id` | `id` |
| [`logistics.shipment_events`](../../Tables/logistics/shipment_events.md) | fk_logistics_shipment_events_carrier_id_carriers_numeric | `carrier_id_internal_id` | `internal_id` |
| [`logistics.shipments`](../../Tables/logistics/shipments.md) | fk_logistics_shipments_carrier_id_carriers | `carrier_id` | `id` |
| [`logistics.shipments`](../../Tables/logistics/shipments.md) | fk_logistics_shipments_carrier_id_carriers_numeric | `carrier_id_internal_id` | `internal_id` |

## `logistics.carriers` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_logistics_carriers_created_by_users` |
| `deleted_by` | `identity.users` | `fk_logistics_carriers_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_logistics_carriers_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_carriers_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_logistics_carriers_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(code::text)) > 0 AND code::text = btrim(code::text))` |
| `fk_logistics_carriers_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_carriers_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_carriers_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_logistics_carriers` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_logistics_carriers_id` | UNIQUE | `UNIQUE (id)` |
| `carriers_code_not_null` | NOT NULL | `NOT NULL code` |
| `carriers_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `carriers_id_not_null` | NOT NULL | `NOT NULL id` |
| `carriers_integration_type_not_null` | NOT NULL | `NOT NULL integration_type` |
| `carriers_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `carriers_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `carriers_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `carriers_name_not_null` | NOT NULL | `NOT NULL name` |
| `carriers_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `carriers_supports_cod_not_null` | NOT NULL | `NOT NULL supports_cod` |
| `carriers_supports_cold_chain_not_null` | NOT NULL | `NOT NULL supports_cold_chain` |
| `carriers_supports_reverse_not_null` | NOT NULL | `NOT NULL supports_reverse` |
| `carriers_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_logistics_carriers` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_logistics_carriers ON logistics.carriers USING btree (internal_id)` |
| `uq_logistics_carrier_code_active` | btree | `(code)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_carrier_code_active ON logistics.carriers USING btree (code) WHERE is_deleted = false` |
| `uq_logistics_carriers_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_carriers_id ON logistics.carriers USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.carriers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON logistics.carriers FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '[]')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.carriers FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.carriers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `logistics.carriers` |
| Category | Master / Reference — Delivery operator and integration capability identities |
| Proposed owner / maintenance role | Delivery_Operations / Delivery configuration administrator |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `logistics.carrier_accounts`, `logistics.reverse_shipments`, `logistics.serviceability_rules`, `logistics.shipment_events`, `logistics.shipments` |
| Features | `ADM-01`, `CAT-04`, `CHK-02`, `CHK-05`, `CHK-06`, `DLV-01`, `DLV-02`, `DLV-03`, `DLV-04`, `OMS-03`, `OMS-04`, `ORD-07`, `REP-04`, `RID-02`, `RID-04`, `RID-06` |
| API consumers | [API-014](../../../03-Modules/Product_Catalog/APIs.md), [API-020](../../../03-Modules/Cart_Checkout/APIs.md), [API-031](../../../03-Modules/Customer_Orders/APIs.md), [API-032](../../../03-Modules/Admin_CMS/APIs.md), [API-041](../../../03-Modules/Order_Operations/APIs.md), [API-042](../../../03-Modules/Order_Operations/APIs.md), [API-064](../../../03-Modules/Delivery_Operations/APIs.md), [API-065](../../../03-Modules/Delivery_Operations/APIs.md), [API-066](../../../03-Modules/Delivery_Operations/APIs.md), [API-067](../../../03-Modules/Delivery_Operations/APIs.md), [API-070](../../../03-Modules/Rider_App/APIs.md), [API-071](../../../03-Modules/Rider_App/APIs.md), [API-073](../../../03-Modules/Rider_App/APIs.md), [API-074](../../../03-Modules/Rider_App/APIs.md), [API-085](../../../03-Modules/Reporting/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `code`, `integration_type`, `name`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Delivery configuration administrator through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use is_active=false to retire from new selection; keep referenced history. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_logistics_carrier_code_active ON logistics.carriers USING btree (code) WHERE is_deleted = false; CREATE UNIQUE INDEX uq_logistics_carriers_id ON logistics.carriers USING btree (id) |
| Foreign-key dependencies | No non-actor FK dependencies recorded. |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-001 phase scope and responsible steward evidence. |
