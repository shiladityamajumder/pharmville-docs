# `logistics.ndr_cases`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds ndr cases records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | logistics.ndr_cases |
| Classification | Transactional |
| Proposed business write owner | Delivery_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 16 columns; 10 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_ndr_cases_created_by_users` |
| `customer_response` | `character varying(64)` | Yes | — | Inferred: stores customer response for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `next_action` | `character varying(64)` | Yes | — | Inferred: stores next action for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `next_attempt_at` | `timestamp with time zone` | Yes | — | Time of next attempt | Support chronology, deadlines or audit evidence | Exact constraints below |
| `reason_code` | `character varying(64)` | No | — | Reference linking this record to delivery failure reasons | Ensures related business data can be joined and validated | FK → `logistics.delivery_failure_reasons` via `fk_logistics_ndr_cases_controlled_reason`; Collation: default |
| `reason_code_id` | `bigint` | Yes | — | Reference linking this record to delivery failure reasons | Ensures related business data can be joined and validated | FK → `logistics.delivery_failure_reasons` via `fk_logistics_ndr_cases_controlled_reason` |
| `resolved_at` | `timestamp with time zone` | Yes | — | Time of resolved | Support chronology, deadlines or audit evidence | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `shipment_id` | `uuid` | No | — | Reference linking this record to shipments | Ensures related business data can be joined and validated | FK → `logistics.shipments` via `fk_logistics_ndr_cases_shipment_id_shipments` |
| `shipment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.shipments` via `fk_logistics_ndr_cases_shipment_id_shipments_numeric` |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_ndr_cases_updated_by_users` |

## Record lifecycle and users

- **Created:** when the ndr cases business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.ndr_cases` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_logistics_ndr_cases_controlled_reason | `reason_code_id, reason_code` | [`logistics.delivery_failure_reasons`](../../Tables/logistics/delivery_failure_reasons.md) | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES logistics.delivery_failure_reasons(id, code) ON DELETE RESTRICT` |
| fk_logistics_ndr_cases_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_logistics_ndr_cases_shipment_id_shipments | `shipment_id` | [`logistics.shipments`](../../Tables/logistics/shipments.md) | `FOREIGN KEY (shipment_id) REFERENCES logistics.shipments(id) ON DELETE CASCADE` |
| fk_logistics_ndr_cases_shipment_id_shipments_numeric | `shipment_id_internal_id` | [`logistics.shipments`](../../Tables/logistics/shipments.md) | `FOREIGN KEY (shipment_id_internal_id) REFERENCES logistics.shipments(internal_id) ON DELETE CASCADE` |
| fk_logistics_ndr_cases_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `logistics.ndr_cases` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `reason_code_id, reason_code` | `logistics.delivery_failure_reasons` | `fk_logistics_ndr_cases_controlled_reason` |
| `created_by` | `identity.users` | `fk_logistics_ndr_cases_created_by_users` |
| `shipment_id` | `logistics.shipments` | `fk_logistics_ndr_cases_shipment_id_shipments` |
| `shipment_id_internal_id` | `logistics.shipments` | `fk_logistics_ndr_cases_shipment_id_shipments_numeric` |
| `updated_by` | `identity.users` | `fk_logistics_ndr_cases_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_ndr_cases_controlled_reason_pair` | CHECK | `CHECK (reason_code_id IS NULL OR reason_code IS NOT NULL)` |
| `ck_logistics_ndr_cases_numeric_pair_shipment_id` | CHECK | `CHECK ((shipment_id IS NULL) = (shipment_id_internal_id IS NULL))` |
| `ck_logistics_ndr_cases_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_logistics_ndr_cases_controlled_reason` | FOREIGN KEY | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES logistics.delivery_failure_reasons(id, code) ON DELETE RESTRICT` |
| `fk_logistics_ndr_cases_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_ndr_cases_shipment_id_shipments` | FOREIGN KEY | `FOREIGN KEY (shipment_id) REFERENCES logistics.shipments(id) ON DELETE CASCADE` |
| `fk_logistics_ndr_cases_shipment_id_shipments_numeric` | FOREIGN KEY | `FOREIGN KEY (shipment_id_internal_id) REFERENCES logistics.shipments(internal_id) ON DELETE CASCADE` |
| `fk_logistics_ndr_cases_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_logistics_ndr_cases` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_logistics_ndr_cases_id` | UNIQUE | `UNIQUE (id)` |
| `ndr_cases_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `ndr_cases_id_not_null` | NOT NULL | `NOT NULL id` |
| `ndr_cases_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `ndr_cases_reason_code_not_null` | NOT NULL | `NOT NULL reason_code` |
| `ndr_cases_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `ndr_cases_shipment_id_internal_id_not_null` | NOT NULL | `NOT NULL shipment_id_internal_id` |
| `ndr_cases_shipment_id_not_null` | NOT NULL | `NOT NULL shipment_id` |
| `ndr_cases_status_not_null` | NOT NULL | `NOT NULL status` |
| `ndr_cases_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_logistics_ndr_cases_shipment` | btree | `(shipment_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_ndr_cases_shipment ON logistics.ndr_cases USING btree (shipment_id)` |
| `ix_logistics_ndr_cases_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_ndr_cases_status ON logistics.ndr_cases USING btree (status)` |
| `pk_logistics_ndr_cases` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_logistics_ndr_cases ON logistics.ndr_cases USING btree (internal_id)` |
| `uq_logistics_ndr_cases_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_ndr_cases_id ON logistics.ndr_cases USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.ndr_cases FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` | O |
| `controlled_reason` | `CREATE TRIGGER controlled_reason BEFORE INSERT OR UPDATE ON logistics.ndr_cases FOR EACH ROW EXECUTE FUNCTION platform.normalize_reason('logistics.delivery_failure_reasons')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.ndr_cases FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.ndr_cases FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
