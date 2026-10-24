# `platform.webhook_deliveries`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds webhook deliveries records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 9 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `attempt_count` | `integer` | No | `0` | Inferred: stores attempt count for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_webhook_deliveries_created_by_users) |
| `delivered_at` | `timestamp with time zone` | Yes | — | Time of delivered | Support chronology, deadlines or audit evidence | See exact constraints |
| `endpoint_id` | `uuid` | No | — | Reference linking this record to webhook endpoints | Ensures related business data can be joined and validated | FK → `platform.webhook_endpoints` (fk_platform_webhook_deliveries_endpoint_id_webhook_endpoints) |
| `endpoint_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.webhook_endpoints` (fk_platform_webhook_deliveries_endpoint_id_webhook_endp_fc9c); Numeric/public-key pair verification required |
| `event_id` | `uuid` | No | — | Identifier associated with event | Link the event or entity to its subject; verify constraints | See exact constraints |
| `event_type` | `character varying(128)` | No | — | Inferred: stores event type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `last_response_code` | `integer` | Yes | — | Code for last response | Link to controlled business classification or an external reference | See exact constraints |
| `next_attempt_at` | `timestamp with time zone` | Yes | — | Time of next attempt | Support chronology, deadlines or audit evidence | See exact constraints |
| `payload` | `jsonb` | No | — | Structured payload information | Retain a versioned payload or relevant details | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_webhook_deliveries_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the webhook deliveries business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.webhook_deliveries` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_platform_webhook_deliveries_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_platform_webhook_deliveries_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `endpoint_id` → `platform.webhook_endpoints(id)` via `fk_platform_webhook_deliveries_endpoint_id_webhook_endpoints`; `FOREIGN KEY (endpoint_id) REFERENCES platform.webhook_endpoints(id) ON DELETE CASCADE`
- `endpoint_id_internal_id` → `platform.webhook_endpoints(internal_id)` via `fk_platform_webhook_deliveries_endpoint_id_webhook_endp_fc9c`; `FOREIGN KEY (endpoint_id_internal_id) REFERENCES platform.webhook_endpoints(internal_id) ON DELETE CASCADE`

## `platform.webhook_deliveries` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 17 columns, 9 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_platform_webhook_deliveries_created_by_users` |
| `updated_by` | `identity.users` | `fk_platform_webhook_deliveries_updated_by_users` |
| `endpoint_id` | `platform.webhook_endpoints` | `fk_platform_webhook_deliveries_endpoint_id_webhook_endpoints` |
| `endpoint_id_internal_id` | `platform.webhook_endpoints` | `fk_platform_webhook_deliveries_endpoint_id_webhook_endp_fc9c` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_webhook_deliveries_numeric_pair_endpoint_id` | CHECK | `CHECK ((endpoint_id IS NULL) = (endpoint_id_internal_id IS NULL))` |
| `ck_platform_webhook_deliveries_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `endpoint_event_delivery` | UNIQUE | `UNIQUE (endpoint_id, event_id)` |
| `fk_platform_webhook_deliveries_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_webhook_deliveries_endpoint_id_webhook_endp_fc9c` | FOREIGN KEY | `FOREIGN KEY (endpoint_id_internal_id) REFERENCES platform.webhook_endpoints(internal_id) ON DELETE CASCADE` |
| `fk_platform_webhook_deliveries_endpoint_id_webhook_endpoints` | FOREIGN KEY | `FOREIGN KEY (endpoint_id) REFERENCES platform.webhook_endpoints(id) ON DELETE CASCADE` |
| `fk_platform_webhook_deliveries_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_platform_webhook_deliveries` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_webhook_deliveries_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `endpoint_event_delivery` | `CREATE UNIQUE INDEX endpoint_event_delivery ON platform.webhook_deliveries USING btree (endpoint_id, event_id)` |
| `ix_platform_webhook_deliveries_status_next` | `CREATE INDEX ix_platform_webhook_deliveries_status_next ON platform.webhook_deliveries USING btree (status, next_attempt_at)` |
| `pk_platform_webhook_deliveries` | `CREATE UNIQUE INDEX pk_platform_webhook_deliveries ON platform.webhook_deliveries USING btree (internal_id)` |
| `uq_platform_webhook_deliveries_id` | `CREATE UNIQUE INDEX uq_platform_webhook_deliveries_id ON platform.webhook_deliveries USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.webhook_deliveries FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["endpoint_id","endpoint_id_internal_id","platform","webhook_endpoints"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.webhook_deliveries FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.webhook_deliveries FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["endpoint_id","endpoint_id_internal_id","platform","webhook_endpoints"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
