# `diagnostics.sample_collections`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds sample collections records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 9 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `arrived_at` | `timestamp with time zone` | Yes | — | Time of arrived | Support chronology, deadlines or audit evidence | See exact constraints |
| `collected_at` | `timestamp with time zone` | Yes | — | Time of collected | Support chronology, deadlines or audit evidence | See exact constraints |
| `collector_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_sample_collections_collector_user_id_users) |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_sample_collections_created_by_users) |
| `diagnostic_order_id` | `uuid` | No | — | Reference linking this record to diagnostic orders | Ensures related business data can be joined and validated | FK → `diagnostics.diagnostic_orders` (fk_diagnostics_sample_collections_diagnostic_order_id_d_9075) |
| `diagnostic_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.diagnostic_orders` (fk_diagnostics_sample_collections_diagnostic_order_id_d_c953); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `notes` | `text` | Yes | — | Inferred: stores notes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `scheduled_at` | `timestamp with time zone` | Yes | — | Time of scheduled | Support chronology, deadlines or audit evidence | See exact constraints |
| `status` | `character varying(32)` | No | `'scheduled'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_sample_collections_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the sample collections business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.sample_collections` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `collector_user_id` → `identity.users(id)` via `fk_diagnostics_sample_collections_collector_user_id_users`; `FOREIGN KEY (collector_user_id) REFERENCES identity.users(id) ON DELETE SET NULL`
- `created_by` → `identity.users(id)` via `fk_diagnostics_sample_collections_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_diagnostics_sample_collections_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `diagnostic_order_id` → `diagnostics.diagnostic_orders(id)` via `fk_diagnostics_sample_collections_diagnostic_order_id_d_9075`; `FOREIGN KEY (diagnostic_order_id) REFERENCES diagnostics.diagnostic_orders(id) ON DELETE CASCADE`
- `diagnostic_order_id_internal_id` → `diagnostics.diagnostic_orders(internal_id)` via `fk_diagnostics_sample_collections_diagnostic_order_id_d_c953`; `FOREIGN KEY (diagnostic_order_id_internal_id) REFERENCES diagnostics.diagnostic_orders(internal_id) ON DELETE CASCADE`

**Referenced by 2 FK constraints** (sample): `diagnostics.samples`, `diagnostics.samples`.

## `diagnostics.sample_collections` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 15 columns, 9 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `collector_user_id` | `identity.users` | `fk_diagnostics_sample_collections_collector_user_id_users` |
| `created_by` | `identity.users` | `fk_diagnostics_sample_collections_created_by_users` |
| `updated_by` | `identity.users` | `fk_diagnostics_sample_collections_updated_by_users` |
| `diagnostic_order_id` | `diagnostics.diagnostic_orders` | `fk_diagnostics_sample_collections_diagnostic_order_id_d_9075` |
| `diagnostic_order_id_internal_id` | `diagnostics.diagnostic_orders` | `fk_diagnostics_sample_collections_diagnostic_order_id_d_c953` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_diagnostics_sample_collections_numeric_pair_diagnost_3774` | CHECK | `CHECK ((diagnostic_order_id IS NULL) = (diagnostic_order_id_internal_id IS NULL))` |
| `ck_diagnostics_sample_collections_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_diagnostics_sample_collections_collector_user_id_users` | FOREIGN KEY | `FOREIGN KEY (collector_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_diagnostics_sample_collections_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_sample_collections_diagnostic_order_id_d_9075` | FOREIGN KEY | `FOREIGN KEY (diagnostic_order_id) REFERENCES diagnostics.diagnostic_orders(id) ON DELETE CASCADE` |
| `fk_diagnostics_sample_collections_diagnostic_order_id_d_c953` | FOREIGN KEY | `FOREIGN KEY (diagnostic_order_id_internal_id) REFERENCES diagnostics.diagnostic_orders(internal_id) ON DELETE CASCADE` |
| `fk_diagnostics_sample_collections_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_diagnostics_sample_collections` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_diagnostics_sample_collections_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_diagnostics_sample_collections_collector` | `CREATE INDEX ix_diagnostics_sample_collections_collector ON diagnostics.sample_collections USING btree (collector_user_id)` |
| `ix_diagnostics_sample_collections_order` | `CREATE INDEX ix_diagnostics_sample_collections_order ON diagnostics.sample_collections USING btree (diagnostic_order_id)` |
| `pk_diagnostics_sample_collections` | `CREATE UNIQUE INDEX pk_diagnostics_sample_collections ON diagnostics.sample_collections USING btree (internal_id)` |
| `uq_diagnostics_sample_collections_id` | `CREATE UNIQUE INDEX uq_diagnostics_sample_collections_id ON diagnostics.sample_collections USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.sample_collections FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.sample_collections FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.sample_collections FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
