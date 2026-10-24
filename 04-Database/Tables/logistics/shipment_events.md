# `logistics.shipment_events`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds shipment events records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | logistics.shipment_events |
| Classification | Audit / History |
| Proposed business write owner | Delivery_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 8 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `carrier_id` | `uuid` | Yes | — | Reference linking this record to carriers | Ensures related business data can be joined and validated | FK → `logistics.carriers` via `fk_logistics_shipment_events_carrier_id_carriers` |
| `carrier_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.carriers` via `fk_logistics_shipment_events_carrier_id_carriers_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `description` | `text` | Yes | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `event_code` | `character varying(64)` | No | — | Code for event | Link to controlled business classification or an external reference | Collation: default |
| `event_time` | `timestamp with time zone` | No | — | Inferred: stores event time for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `location` | `character varying(255)` | Yes | — | Inferred: stores location for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider_event_id` | `character varying(255)` | Yes | — | Identifier associated with provider event | Link the event or entity to its subject; verify constraints | Collation: default |
| `raw_payload` | `jsonb` | No | `'{}'::jsonb` | Structured raw payload information | Retain a versioned payload or relevant details | Exact constraints below |
| `shipment_id` | `uuid` | No | — | Reference linking this record to shipments | Ensures related business data can be joined and validated | FK → `logistics.shipments` via `fk_logistics_shipment_events_shipment_id_shipments` |
| `shipment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.shipments` via `fk_logistics_shipment_events_shipment_id_shipments_numeric` |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |

## Record lifecycle and users

- **Created:** when the shipment events business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.shipment_events` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_logistics_shipment_events_carrier_id_carriers | `carrier_id` | [`logistics.carriers`](../../Tables/logistics/carriers.md) | `FOREIGN KEY (carrier_id) REFERENCES logistics.carriers(id) ON DELETE SET NULL` |
| fk_logistics_shipment_events_carrier_id_carriers_numeric | `carrier_id_internal_id` | [`logistics.carriers`](../../Tables/logistics/carriers.md) | `FOREIGN KEY (carrier_id_internal_id) REFERENCES logistics.carriers(internal_id) ON DELETE SET NULL` |
| fk_logistics_shipment_events_shipment_id_shipments | `shipment_id` | [`logistics.shipments`](../../Tables/logistics/shipments.md) | `FOREIGN KEY (shipment_id) REFERENCES logistics.shipments(id) ON DELETE CASCADE` |
| fk_logistics_shipment_events_shipment_id_shipments_numeric | `shipment_id_internal_id` | [`logistics.shipments`](../../Tables/logistics/shipments.md) | `FOREIGN KEY (shipment_id_internal_id) REFERENCES logistics.shipments(internal_id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `logistics.shipment_events` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `carrier_id` | `logistics.carriers` | `fk_logistics_shipment_events_carrier_id_carriers` |
| `carrier_id_internal_id` | `logistics.carriers` | `fk_logistics_shipment_events_carrier_id_carriers_numeric` |
| `shipment_id` | `logistics.shipments` | `fk_logistics_shipment_events_shipment_id_shipments` |
| `shipment_id_internal_id` | `logistics.shipments` | `fk_logistics_shipment_events_shipment_id_shipments_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_shipment_events_numeric_pair_carrier_id` | CHECK | `CHECK ((carrier_id IS NULL) = (carrier_id_internal_id IS NULL))` |
| `ck_logistics_shipment_events_numeric_pair_shipment_id` | CHECK | `CHECK ((shipment_id IS NULL) = (shipment_id_internal_id IS NULL))` |
| `fk_logistics_shipment_events_carrier_id_carriers` | FOREIGN KEY | `FOREIGN KEY (carrier_id) REFERENCES logistics.carriers(id) ON DELETE SET NULL` |
| `fk_logistics_shipment_events_carrier_id_carriers_numeric` | FOREIGN KEY | `FOREIGN KEY (carrier_id_internal_id) REFERENCES logistics.carriers(internal_id) ON DELETE SET NULL` |
| `fk_logistics_shipment_events_shipment_id_shipments` | FOREIGN KEY | `FOREIGN KEY (shipment_id) REFERENCES logistics.shipments(id) ON DELETE CASCADE` |
| `fk_logistics_shipment_events_shipment_id_shipments_numeric` | FOREIGN KEY | `FOREIGN KEY (shipment_id_internal_id) REFERENCES logistics.shipments(internal_id) ON DELETE CASCADE` |
| `pk_logistics_shipment_events` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_logistics_shipment_events_id` | UNIQUE | `UNIQUE (id)` |
| `shipment_events_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `shipment_events_event_code_not_null` | NOT NULL | `NOT NULL event_code` |
| `shipment_events_event_time_not_null` | NOT NULL | `NOT NULL event_time` |
| `shipment_events_id_not_null` | NOT NULL | `NOT NULL id` |
| `shipment_events_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `shipment_events_raw_payload_not_null` | NOT NULL | `NOT NULL raw_payload` |
| `shipment_events_shipment_id_internal_id_not_null` | NOT NULL | `NOT NULL shipment_id_internal_id` |
| `shipment_events_shipment_id_not_null` | NOT NULL | `NOT NULL shipment_id` |
| `shipment_events_status_not_null` | NOT NULL | `NOT NULL status` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_logistics_shipment_events_shipment_time` | btree | `(shipment_id, event_time)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_shipment_events_shipment_time ON logistics.shipment_events USING btree (shipment_id, event_time)` |
| `ix_logistics_shipment_events_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_logistics_shipment_events_status ON logistics.shipment_events USING btree (status)` |
| `pk_logistics_shipment_events` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_logistics_shipment_events ON logistics.shipment_events USING btree (internal_id)` |
| `uq_logistics_shipment_events_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_shipment_events_id ON logistics.shipment_events USING btree (id)` |
| `uq_logistics_shipment_events_provider_present` | btree | `(carrier_id, provider_event_id)` | carrier_id IS NOT NULL AND provider_event_id IS NOT NULL | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_logistics_shipment_events_provider_present ON logistics.shipment_events USING btree (carrier_id, provider_event_id) WHERE carrier_id IS NOT NULL AND provider_event_id IS NOT NULL` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.shipment_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_id","carrier_id_internal_id","logistics","carriers"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON logistics.shipment_events FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.shipment_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_id","carrier_id_internal_id","logistics","carriers"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
