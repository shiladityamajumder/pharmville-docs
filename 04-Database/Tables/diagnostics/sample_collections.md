# `diagnostics.sample_collections`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds sample collections records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | diagnostics.sample_collections |
| Classification | Transactional |
| Proposed business write owner | Future diagnostics owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 8 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `arrived_at` | `timestamp with time zone` | Yes | — | Time of arrived | Support chronology, deadlines or audit evidence | Exact constraints below |
| `collected_at` | `timestamp with time zone` | Yes | — | Time of collected | Support chronology, deadlines or audit evidence | Exact constraints below |
| `collector_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_sample_collections_collector_user_id_users` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_sample_collections_created_by_users` |
| `diagnostic_order_id` | `uuid` | No | — | Reference linking this record to diagnostic orders | Ensures related business data can be joined and validated | FK → `diagnostics.diagnostic_orders` via `fk_diagnostics_sample_collections_diagnostic_order_id_d_9075` |
| `diagnostic_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.diagnostic_orders` via `fk_diagnostics_sample_collections_diagnostic_order_id_d_c953` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `notes` | `text` | Yes | — | Inferred: stores notes for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `scheduled_at` | `timestamp with time zone` | Yes | — | Time of scheduled | Support chronology, deadlines or audit evidence | Exact constraints below |
| `status` | `character varying(32)` | No | `'scheduled'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_sample_collections_updated_by_users` |

## Record lifecycle and users

- **Created:** when the sample collections business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.sample_collections` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_diagnostics_sample_collections_collector_user_id_users | `collector_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (collector_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_diagnostics_sample_collections_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_diagnostics_sample_collections_diagnostic_order_id_d_9075 | `diagnostic_order_id` | [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | `FOREIGN KEY (diagnostic_order_id) REFERENCES diagnostics.diagnostic_orders(id) ON DELETE CASCADE` |
| fk_diagnostics_sample_collections_diagnostic_order_id_d_c953 | `diagnostic_order_id_internal_id` | [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | `FOREIGN KEY (diagnostic_order_id_internal_id) REFERENCES diagnostics.diagnostic_orders(internal_id) ON DELETE CASCADE` |
| fk_diagnostics_sample_collections_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`diagnostics.samples`](../../Tables/diagnostics/samples.md) | fk_diagnostics_samples_collection_id_sample_collections | `collection_id` | `id` |
| [`diagnostics.samples`](../../Tables/diagnostics/samples.md) | fk_diagnostics_samples_collection_id_sample_collections_numeric | `collection_id_internal_id` | `internal_id` |

## `diagnostics.sample_collections` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `collector_user_id` | `identity.users` | `fk_diagnostics_sample_collections_collector_user_id_users` |
| `created_by` | `identity.users` | `fk_diagnostics_sample_collections_created_by_users` |
| `diagnostic_order_id` | `diagnostics.diagnostic_orders` | `fk_diagnostics_sample_collections_diagnostic_order_id_d_9075` |
| `diagnostic_order_id_internal_id` | `diagnostics.diagnostic_orders` | `fk_diagnostics_sample_collections_diagnostic_order_id_d_c953` |
| `updated_by` | `identity.users` | `fk_diagnostics_sample_collections_updated_by_users` |

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
| `sample_collections_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `sample_collections_diagnostic_order_id_internal_id_not_null` | NOT NULL | `NOT NULL diagnostic_order_id_internal_id` |
| `sample_collections_diagnostic_order_id_not_null` | NOT NULL | `NOT NULL diagnostic_order_id` |
| `sample_collections_id_not_null` | NOT NULL | `NOT NULL id` |
| `sample_collections_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `sample_collections_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `sample_collections_status_not_null` | NOT NULL | `NOT NULL status` |
| `sample_collections_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_diagnostics_sample_collections_collector` | btree | `(collector_user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_diagnostics_sample_collections_collector ON diagnostics.sample_collections USING btree (collector_user_id)` |
| `ix_diagnostics_sample_collections_order` | btree | `(diagnostic_order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_diagnostics_sample_collections_order ON diagnostics.sample_collections USING btree (diagnostic_order_id)` |
| `pk_diagnostics_sample_collections` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_diagnostics_sample_collections ON diagnostics.sample_collections USING btree (internal_id)` |
| `uq_diagnostics_sample_collections_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_diagnostics_sample_collections_id ON diagnostics.sample_collections USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.sample_collections FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.sample_collections FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.sample_collections FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
