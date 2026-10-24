# `diagnostics.samples`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds samples records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 13 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `barcode` | `character varying(128)` | No | — | Inferred: stores barcode for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `collected_at` | `timestamp with time zone` | Yes | — | Time of collected | Support chronology, deadlines or audit evidence | See exact constraints |
| `collection_id` | `uuid` | Yes | — | Reference linking this record to sample collections | Ensures related business data can be joined and validated | FK → `diagnostics.sample_collections` (fk_diagnostics_samples_collection_id_sample_collections) |
| `collection_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.sample_collections` (fk_diagnostics_samples_collection_id_sample_collections_numeric); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_samples_created_by_users) |
| `diagnostic_order_id` | `uuid` | No | — | Reference linking this record to diagnostic orders | Ensures related business data can be joined and validated | FK → `diagnostics.diagnostic_orders` (fk_diagnostics_samples_diagnostic_order_id_diagnostic_orders) |
| `diagnostic_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.diagnostic_orders` (fk_diagnostics_samples_diagnostic_order_id_diagnostic_o_a6c8); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `received_at` | `timestamp with time zone` | Yes | — | Time of received | Support chronology, deadlines or audit evidence | See exact constraints |
| `rejected_reason` | `character varying(255)` | Yes | — | Inferred: stores rejected reason for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `sample_type` | `character varying(64)` | No | — | Inferred: stores sample type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `status` | `character varying(16)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_samples_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the samples business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.samples` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_diagnostics_samples_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_diagnostics_samples_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `collection_id` → `diagnostics.sample_collections(id)` via `fk_diagnostics_samples_collection_id_sample_collections`; `FOREIGN KEY (collection_id) REFERENCES diagnostics.sample_collections(id) ON DELETE SET NULL`
- `diagnostic_order_id` → `diagnostics.diagnostic_orders(id)` via `fk_diagnostics_samples_diagnostic_order_id_diagnostic_orders`; `FOREIGN KEY (diagnostic_order_id) REFERENCES diagnostics.diagnostic_orders(id) ON DELETE CASCADE`
- `collection_id_internal_id` → `diagnostics.sample_collections(internal_id)` via `fk_diagnostics_samples_collection_id_sample_collections_numeric`; `FOREIGN KEY (collection_id_internal_id) REFERENCES diagnostics.sample_collections(internal_id) ON DELETE SET NULL`
- `diagnostic_order_id_internal_id` → `diagnostics.diagnostic_orders(internal_id)` via `fk_diagnostics_samples_diagnostic_order_id_diagnostic_o_a6c8`; `FOREIGN KEY (diagnostic_order_id_internal_id) REFERENCES diagnostics.diagnostic_orders(internal_id) ON DELETE CASCADE`

**Referenced by 2 FK constraints** (sample): `diagnostics.sample_events`, `diagnostics.sample_events`.

## `diagnostics.samples` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 17 columns, 13 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_diagnostics_samples_created_by_users` |
| `updated_by` | `identity.users` | `fk_diagnostics_samples_updated_by_users` |
| `collection_id` | `diagnostics.sample_collections` | `fk_diagnostics_samples_collection_id_sample_collections` |
| `diagnostic_order_id` | `diagnostics.diagnostic_orders` | `fk_diagnostics_samples_diagnostic_order_id_diagnostic_orders` |
| `collection_id_internal_id` | `diagnostics.sample_collections` | `fk_diagnostics_samples_collection_id_sample_collections_numeric` |
| `diagnostic_order_id_internal_id` | `diagnostics.diagnostic_orders` | `fk_diagnostics_samples_diagnostic_order_id_diagnostic_o_a6c8` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_diagnostics_samples_numeric_pair_collection_id` | CHECK | `CHECK ((collection_id IS NULL) = (collection_id_internal_id IS NULL))` |
| `ck_diagnostics_samples_numeric_pair_diagnostic_order_id` | CHECK | `CHECK ((diagnostic_order_id IS NULL) = (diagnostic_order_id_internal_id IS NULL))` |
| `ck_diagnostics_samples_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_diagnostics_samples_samplestatus` | CHECK | `CHECK (status::text = ANY (ARRAY['pending'::text, 'collected'::text, 'in_transit'::text, 'received'::text, 'accepted'::text, 'rejected'::text, 'processed'::text, 'disposed'::text]))` |
| `fk_diagnostics_samples_collection_id_sample_collections` | FOREIGN KEY | `FOREIGN KEY (collection_id) REFERENCES diagnostics.sample_collections(id) ON DELETE SET NULL` |
| `fk_diagnostics_samples_collection_id_sample_collections_numeric` | FOREIGN KEY | `FOREIGN KEY (collection_id_internal_id) REFERENCES diagnostics.sample_collections(internal_id) ON DELETE SET NULL` |
| `fk_diagnostics_samples_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_samples_diagnostic_order_id_diagnostic_o_a6c8` | FOREIGN KEY | `FOREIGN KEY (diagnostic_order_id_internal_id) REFERENCES diagnostics.diagnostic_orders(internal_id) ON DELETE CASCADE` |
| `fk_diagnostics_samples_diagnostic_order_id_diagnostic_orders` | FOREIGN KEY | `FOREIGN KEY (diagnostic_order_id) REFERENCES diagnostics.diagnostic_orders(id) ON DELETE CASCADE` |
| `fk_diagnostics_samples_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_diagnostics_samples` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `sample_barcode` | UNIQUE | `UNIQUE (barcode)` |
| `uq_diagnostics_samples_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_diagnostics_samples_order` | `CREATE INDEX ix_diagnostics_samples_order ON diagnostics.samples USING btree (diagnostic_order_id)` |
| `ix_diagnostics_samples_status` | `CREATE INDEX ix_diagnostics_samples_status ON diagnostics.samples USING btree (status)` |
| `pk_diagnostics_samples` | `CREATE UNIQUE INDEX pk_diagnostics_samples ON diagnostics.samples USING btree (internal_id)` |
| `sample_barcode` | `CREATE UNIQUE INDEX sample_barcode ON diagnostics.samples USING btree (barcode)` |
| `uq_diagnostics_samples_id` | `CREATE UNIQUE INDEX uq_diagnostics_samples_id ON diagnostics.samples USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.samples FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["collection_id","collection_id_internal_id","diagnostics","sample_collections"],["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.samples FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.samples FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["collection_id","collection_id_internal_id","diagnostics","sample_collections"],["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
