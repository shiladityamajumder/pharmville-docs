# `logistics.shipment_events`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds shipment events records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 8 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `carrier_id` | `uuid` | Yes | — | Reference linking this record to carriers | Ensures related business data can be joined and validated | FK → `logistics.carriers` (fk_logistics_shipment_events_carrier_id_carriers) |
| `carrier_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.carriers` (fk_logistics_shipment_events_carrier_id_carriers_numeric); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `description` | `text` | Yes | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `event_code` | `character varying(64)` | No | — | Code for event | Link to controlled business classification or an external reference | See exact constraints |
| `event_time` | `timestamp with time zone` | No | — | Inferred: stores event time for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `location` | `character varying(255)` | Yes | — | Inferred: stores location for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider_event_id` | `character varying(255)` | Yes | — | Identifier associated with provider event | Link the event or entity to its subject; verify constraints | See exact constraints |
| `raw_payload` | `jsonb` | No | `'{}'::jsonb` | Structured raw payload information | Retain a versioned payload or relevant details | See exact constraints |
| `shipment_id` | `uuid` | No | — | Reference linking this record to shipments | Ensures related business data can be joined and validated | FK → `logistics.shipments` (fk_logistics_shipment_events_shipment_id_shipments) |
| `shipment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `logistics.shipments` (fk_logistics_shipment_events_shipment_id_shipments_numeric); Numeric/public-key pair verification required |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the shipment events business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.shipment_events` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `carrier_id` → `logistics.carriers(id)` via `fk_logistics_shipment_events_carrier_id_carriers`; `FOREIGN KEY (carrier_id) REFERENCES logistics.carriers(id) ON DELETE SET NULL`
- `shipment_id` → `logistics.shipments(id)` via `fk_logistics_shipment_events_shipment_id_shipments`; `FOREIGN KEY (shipment_id) REFERENCES logistics.shipments(id) ON DELETE CASCADE`
- `carrier_id_internal_id` → `logistics.carriers(internal_id)` via `fk_logistics_shipment_events_carrier_id_carriers_numeric`; `FOREIGN KEY (carrier_id_internal_id) REFERENCES logistics.carriers(internal_id) ON DELETE SET NULL`
- `shipment_id_internal_id` → `logistics.shipments(internal_id)` via `fk_logistics_shipment_events_shipment_id_shipments_numeric`; `FOREIGN KEY (shipment_id_internal_id) REFERENCES logistics.shipments(internal_id) ON DELETE CASCADE`

## `logistics.shipment_events` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 14 columns, 8 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `carrier_id` | `logistics.carriers` | `fk_logistics_shipment_events_carrier_id_carriers` |
| `shipment_id` | `logistics.shipments` | `fk_logistics_shipment_events_shipment_id_shipments` |
| `carrier_id_internal_id` | `logistics.carriers` | `fk_logistics_shipment_events_carrier_id_carriers_numeric` |
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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_logistics_shipment_events_shipment_time` | `CREATE INDEX ix_logistics_shipment_events_shipment_time ON logistics.shipment_events USING btree (shipment_id, event_time)` |
| `ix_logistics_shipment_events_status` | `CREATE INDEX ix_logistics_shipment_events_status ON logistics.shipment_events USING btree (status)` |
| `pk_logistics_shipment_events` | `CREATE UNIQUE INDEX pk_logistics_shipment_events ON logistics.shipment_events USING btree (internal_id)` |
| `uq_logistics_shipment_events_id` | `CREATE UNIQUE INDEX uq_logistics_shipment_events_id ON logistics.shipment_events USING btree (id)` |
| `uq_logistics_shipment_events_provider_present` | `CREATE UNIQUE INDEX uq_logistics_shipment_events_provider_present ON logistics.shipment_events USING btree (carrier_id, provider_event_id) WHERE carrier_id IS NOT NULL AND provider_event_id IS NOT NULL` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.shipment_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_id","carrier_id_internal_id","logistics","carriers"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON logistics.shipment_events FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.shipment_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["carrier_id","carrier_id_internal_id","logistics","carriers"],["shipment_id","shipment_id_internal_id","logistics","shipments"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
