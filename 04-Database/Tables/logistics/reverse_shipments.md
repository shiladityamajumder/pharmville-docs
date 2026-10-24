# `logistics.reverse_shipments`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds reverse shipments records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | logistics.reverse_shipments |
| Classification | Transactional |
| Proposed business write owner | Delivery_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 16 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `carrier_id` | `uuid` | Yes | — | Reference linking this record to carriers | Ensures related business data can be joined and validated | FK → `logistics.carriers` via `fk_logistics_reverse_shipments_carrier_id_carriers` |
| `carrier_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.carriers` via `fk_logistics_reverse_shipments_carrier_id_carriers_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_reverse_shipments_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `pickup_scheduled_at` | `timestamp with time zone` | Yes | — | Time of pickup scheduled | Support chronology, deadlines or audit evidence | Exact constraints below |
| `received_at` | `timestamp with time zone` | Yes | — | Time of received | Support chronology, deadlines or audit evidence | Exact constraints below |
| `return_id` | `uuid` | No | — | Reference linking this record to returns | Ensures related business data can be joined and validated | FK → `commerce.returns` via `fk_logistics_reverse_shipments_return_id_returns` |
| `return_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.returns` via `fk_logistics_reverse_shipments_return_id_returns_numeric` |
| `reverse_shipment_number` | `character varying(64)` | No | — | Inferred: stores reverse shipment number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `tracking_number` | `character varying(128)` | Yes | — | Inferred: stores tracking number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_logistics_reverse_shipments_updated_by_users` |

## Record lifecycle and users

- **Created:** when the reverse shipments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.reverse_shipments` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_logistics_reverse_shipments_carrier_id_carriers | `carrier_id` | [`logistics.carriers`](../../Tables/logistics/carriers.md) | `FOREIGN KEY (carrier_id) REFERENCES logistics.carriers(id) ON DELETE SET NULL` |
| fk_logistics_reverse_shipments_carrier_id_carriers_numeric | `carrier_id_internal_id` | [`logistics.carriers`](../../Tables/logistics/carriers.md) | `FOREIGN KEY (carrier_id_internal_id) REFERENCES logistics.carriers(internal_id) ON DELETE SET NULL` |
| fk_logistics_reverse_shipments_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_logistics_reverse_shipments_return_id_returns | `return_id` | [`commerce.returns`](../../Tables/commerce/returns.md) | `FOREIGN KEY (return_id) REFERENCES commerce.returns(id) ON DELETE RESTRICT` |
| fk_logistics_reverse_shipments_return_id_returns_numeric | `return_id_internal_id` | [`commerce.returns`](../../Tables/commerce/returns.md) | `FOREIGN KEY (return_id_internal_id) REFERENCES commerce.returns(internal_id) ON DELETE RESTRICT` |
| fk_logistics_reverse_shipments_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `logistics.reverse_shipments` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `carrier_id` | `logistics.carriers` | `fk_logistics_reverse_shipments_carrier_id_carriers` |
| `carrier_id_internal_id` | `logistics.carriers` | `fk_logistics_reverse_shipments_carrier_id_carriers_numeric` |
| `created_by` | `identity.users` | `fk_logistics_reverse_shipments_created_by_users` |
| `return_id` | `commerce.returns` | `fk_logistics_reverse_shipments_return_id_returns` |
| `return_id_internal_id` | `commerce.returns` | `fk_logistics_reverse_shipments_return_id_returns_numeric` |
| `updated_by` | `identity.users` | `fk_logistics_reverse_shipments_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_reverse_shipments_numeric_pair_carrier_id` | CHECK | `CHECK ((carrier_id IS NULL) = (carrier_id_internal_id IS NULL))` |
| `ck_logistics_reverse_shipments_numeric_pair_return_id` | CHECK | `CHECK ((return_id IS NULL) = (return_id_internal_id IS NULL))` |
| `ck_logistics_reverse_shipments_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_logistics_reverse_shipments_carrier_id_carriers` | FOREIGN KEY | `FOREIGN KEY (carrier_id) REFERENCES logistics.carriers(id) ON DELETE SET NULL` |
| `fk_logistics_reverse_shipments_carrier_id_carriers_numeric` | FOREIGN KEY | `FOREIGN KEY (carrier_id_internal_id) REFERENCES logistics.carriers(internal_id) ON DELETE SET NULL` |
| `fk_logistics_reverse_shipments_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_reverse_shipments_return_id_returns` | FOREIGN KEY | `FOREIGN KEY (return_id) REFERENCES commerce.returns(id) ON DELETE RESTRICT` |
| `fk_logistics_reverse_shipments_return_id_returns_numeric` | FOREIGN KEY | `FOREIGN KEY (return_id_internal_id) REFERENCES commerce.returns(internal_id) ON DELETE RESTRICT` |
| `fk_logistics_reverse_shipments_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_logistics_reverse_shipments` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `reverse_shipment_number` | UNIQUE | `UNIQUE (reverse_shipment_number)` |
| `uq_logistics_reverse_shipments_id` | UNIQUE | `UNIQUE (id)` |
| `reverse_shipments_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `reverse_shipments_id_not_null` | NOT NULL | `NOT NULL id` |
| `reverse_shipments_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `reverse_shipments_return_id_internal_id_not_null` | NOT NULL | `NOT NULL return_id_internal_id` |
| `reverse_shipments_return_id_not_null` | NOT NULL | `NOT NULL return_id` |
| `reverse_shipments_reverse_shipment_number_not_null` | NOT NULL | `NOT NULL reverse_shipment_number` |
| `reverse_shipments_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `reverse_shipments_status_not_null` | NOT NULL | `NOT NULL status` |
| `reverse_shipments_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_logistics_reverse_shipments_return` | btree | `(return_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_reverse_shipments_return ON logistics.reverse_shipments USING btree (return_id)` |
| `ix_logistics_reverse_shipments_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_reverse_shipments_status ON logistics.reverse_shipments USING btree (status)` |
| `pk_logistics_reverse_shipments` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_logistics_reverse_shipments ON logistics.reverse_shipments USING btree (internal_id)` |
| `reverse_shipment_number` | btree | `(reverse_shipment_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX reverse_shipment_number ON logistics.reverse_shipments USING btree (reverse_shipment_number)` |
| `uq_logistics_reverse_shipments_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_reverse_shipments_id ON logistics.reverse_shipments USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.reverse_shipments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_id","carrier_id_internal_id","logistics","carriers"],["return_id","return_id_internal_id","commerce","returns"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.reverse_shipments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.reverse_shipments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_id","carrier_id_internal_id","logistics","carriers"],["return_id","return_id_internal_id","commerce","returns"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
