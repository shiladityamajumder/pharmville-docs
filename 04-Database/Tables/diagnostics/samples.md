# `diagnostics.samples`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds samples records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | diagnostics.samples |
| Classification | Transactional |
| Proposed business write owner | Future diagnostics owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 13 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `barcode` | `character varying(128)` | No | — | Inferred: stores barcode for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `collected_at` | `timestamp with time zone` | Yes | — | Time of collected | Support chronology, deadlines or audit evidence | Exact constraints below |
| `collection_id` | `uuid` | Yes | — | Reference linking this record to sample collections | Ensures related business data can be joined and validated | FK → `diagnostics.sample_collections` via `fk_diagnostics_samples_collection_id_sample_collections` |
| `collection_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.sample_collections` via `fk_diagnostics_samples_collection_id_sample_collections_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_samples_created_by_users` |
| `diagnostic_order_id` | `uuid` | No | — | Reference linking this record to diagnostic orders | Ensures related business data can be joined and validated | FK → `diagnostics.diagnostic_orders` via `fk_diagnostics_samples_diagnostic_order_id_diagnostic_orders` |
| `diagnostic_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.diagnostic_orders` via `fk_diagnostics_samples_diagnostic_order_id_diagnostic_o_a6c8` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `received_at` | `timestamp with time zone` | Yes | — | Time of received | Support chronology, deadlines or audit evidence | Exact constraints below |
| `rejected_reason` | `character varying(255)` | Yes | — | Inferred: stores rejected reason for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `sample_type` | `character varying(64)` | No | — | Inferred: stores sample type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `status` | `character varying(16)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_samples_updated_by_users` |

## Record lifecycle and users

- **Created:** when the samples business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.samples` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_diagnostics_samples_collection_id_sample_collections | `collection_id` | [`diagnostics.sample_collections`](../../Tables/diagnostics/sample_collections.md) | `FOREIGN KEY (collection_id) REFERENCES diagnostics.sample_collections(id) ON DELETE SET NULL` |
| fk_diagnostics_samples_collection_id_sample_collections_numeric | `collection_id_internal_id` | [`diagnostics.sample_collections`](../../Tables/diagnostics/sample_collections.md) | `FOREIGN KEY (collection_id_internal_id) REFERENCES diagnostics.sample_collections(internal_id) ON DELETE SET NULL` |
| fk_diagnostics_samples_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_diagnostics_samples_diagnostic_order_id_diagnostic_o_a6c8 | `diagnostic_order_id_internal_id` | [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | `FOREIGN KEY (diagnostic_order_id_internal_id) REFERENCES diagnostics.diagnostic_orders(internal_id) ON DELETE CASCADE` |
| fk_diagnostics_samples_diagnostic_order_id_diagnostic_orders | `diagnostic_order_id` | [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | `FOREIGN KEY (diagnostic_order_id) REFERENCES diagnostics.diagnostic_orders(id) ON DELETE CASCADE` |
| fk_diagnostics_samples_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`diagnostics.sample_events`](../../Tables/diagnostics/sample_events.md) | fk_diagnostics_sample_events_sample_id_samples | `sample_id` | `id` |
| [`diagnostics.sample_events`](../../Tables/diagnostics/sample_events.md) | fk_diagnostics_sample_events_sample_id_samples_numeric | `sample_id_internal_id` | `internal_id` |

## `diagnostics.samples` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `collection_id` | `diagnostics.sample_collections` | `fk_diagnostics_samples_collection_id_sample_collections` |
| `collection_id_internal_id` | `diagnostics.sample_collections` | `fk_diagnostics_samples_collection_id_sample_collections_numeric` |
| `created_by` | `identity.users` | `fk_diagnostics_samples_created_by_users` |
| `diagnostic_order_id_internal_id` | `diagnostics.diagnostic_orders` | `fk_diagnostics_samples_diagnostic_order_id_diagnostic_o_a6c8` |
| `diagnostic_order_id` | `diagnostics.diagnostic_orders` | `fk_diagnostics_samples_diagnostic_order_id_diagnostic_orders` |
| `updated_by` | `identity.users` | `fk_diagnostics_samples_updated_by_users` |

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
| `samples_barcode_not_null` | NOT NULL | `NOT NULL barcode` |
| `samples_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `samples_diagnostic_order_id_internal_id_not_null` | NOT NULL | `NOT NULL diagnostic_order_id_internal_id` |
| `samples_diagnostic_order_id_not_null` | NOT NULL | `NOT NULL diagnostic_order_id` |
| `samples_id_not_null` | NOT NULL | `NOT NULL id` |
| `samples_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `samples_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `samples_sample_type_not_null` | NOT NULL | `NOT NULL sample_type` |
| `samples_status_not_null` | NOT NULL | `NOT NULL status` |
| `samples_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_diagnostics_samples_order` | btree | `(diagnostic_order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_diagnostics_samples_order ON diagnostics.samples USING btree (diagnostic_order_id)` |
| `ix_diagnostics_samples_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_diagnostics_samples_status ON diagnostics.samples USING btree (status)` |
| `pk_diagnostics_samples` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_diagnostics_samples ON diagnostics.samples USING btree (internal_id)` |
| `sample_barcode` | btree | `(barcode)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX sample_barcode ON diagnostics.samples USING btree (barcode)` |
| `uq_diagnostics_samples_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_diagnostics_samples_id ON diagnostics.samples USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.samples FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["collection_id","collection_id_internal_id","diagnostics","sample_collections"],["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.samples FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.samples FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["collection_id","collection_id_internal_id","diagnostics","sample_collections"],["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
