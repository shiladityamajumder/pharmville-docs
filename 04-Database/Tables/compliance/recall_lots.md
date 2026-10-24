# `compliance.recall_lots`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds recall lots records within the compliance domain (regulatory documentation and retention actions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | compliance.recall_lots |
| Classification | Mapping / Junction |
| Proposed business write owner | Pharmacist_Review via Compliance owner |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 13 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `action_status` | `character varying(32)` | No | `'pending'::character varying` | Inferred: stores action status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `affected_quantity` | `character varying(64)` | Yes | — | Affected quantity value | Track resource or item amounts accurately | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_compliance_recall_lots_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `lot_id` | `uuid` | No | — | Reference linking this record to inventory lots | Ensures related business data can be joined and validated | FK → `warehouse.inventory_lots` via `fk_compliance_recall_lots_lot_id_inventory_lots` |
| `lot_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_lots` via `fk_compliance_recall_lots_lot_id_inventory_lots_numeric` |
| `recall_id` | `uuid` | No | — | Reference linking this record to product recalls | Ensures related business data can be joined and validated | FK → `compliance.product_recalls` via `fk_compliance_recall_lots_recall_id_product_recalls` |
| `recall_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `compliance.product_recalls` via `fk_compliance_recall_lots_recall_id_product_recalls_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_compliance_recall_lots_updated_by_users` |

## Record lifecycle and users

- **Created:** when the recall lots business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Pharmacist_Review, Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `compliance.recall_lots` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_compliance_recall_lots_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_compliance_recall_lots_lot_id_inventory_lots | `lot_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| fk_compliance_recall_lots_lot_id_inventory_lots_numeric | `lot_id_internal_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| fk_compliance_recall_lots_recall_id_product_recalls | `recall_id` | [`compliance.product_recalls`](../../Tables/compliance/product_recalls.md) | `FOREIGN KEY (recall_id) REFERENCES compliance.product_recalls(id) ON DELETE CASCADE` |
| fk_compliance_recall_lots_recall_id_product_recalls_numeric | `recall_id_internal_id` | [`compliance.product_recalls`](../../Tables/compliance/product_recalls.md) | `FOREIGN KEY (recall_id_internal_id) REFERENCES compliance.product_recalls(internal_id) ON DELETE CASCADE` |
| fk_compliance_recall_lots_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `compliance.recall_lots` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_compliance_recall_lots_created_by_users` |
| `lot_id` | `warehouse.inventory_lots` | `fk_compliance_recall_lots_lot_id_inventory_lots` |
| `lot_id_internal_id` | `warehouse.inventory_lots` | `fk_compliance_recall_lots_lot_id_inventory_lots_numeric` |
| `recall_id` | `compliance.product_recalls` | `fk_compliance_recall_lots_recall_id_product_recalls` |
| `recall_id_internal_id` | `compliance.product_recalls` | `fk_compliance_recall_lots_recall_id_product_recalls_numeric` |
| `updated_by` | `identity.users` | `fk_compliance_recall_lots_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_compliance_recall_lots_numeric_pair_lot_id` | CHECK | `CHECK ((lot_id IS NULL) = (lot_id_internal_id IS NULL))` |
| `ck_compliance_recall_lots_numeric_pair_recall_id` | CHECK | `CHECK ((recall_id IS NULL) = (recall_id_internal_id IS NULL))` |
| `ck_compliance_recall_lots_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_compliance_recall_lots_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_compliance_recall_lots_lot_id_inventory_lots` | FOREIGN KEY | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| `fk_compliance_recall_lots_lot_id_inventory_lots_numeric` | FOREIGN KEY | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| `fk_compliance_recall_lots_recall_id_product_recalls` | FOREIGN KEY | `FOREIGN KEY (recall_id) REFERENCES compliance.product_recalls(id) ON DELETE CASCADE` |
| `fk_compliance_recall_lots_recall_id_product_recalls_numeric` | FOREIGN KEY | `FOREIGN KEY (recall_id_internal_id) REFERENCES compliance.product_recalls(internal_id) ON DELETE CASCADE` |
| `fk_compliance_recall_lots_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_compliance_recall_lots` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `recall_lot` | UNIQUE | `UNIQUE (recall_id, lot_id)` |
| `uq_compliance_recall_lots_id` | UNIQUE | `UNIQUE (id)` |
| `recall_lots_action_status_not_null` | NOT NULL | `NOT NULL action_status` |
| `recall_lots_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `recall_lots_id_not_null` | NOT NULL | `NOT NULL id` |
| `recall_lots_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `recall_lots_lot_id_internal_id_not_null` | NOT NULL | `NOT NULL lot_id_internal_id` |
| `recall_lots_lot_id_not_null` | NOT NULL | `NOT NULL lot_id` |
| `recall_lots_recall_id_internal_id_not_null` | NOT NULL | `NOT NULL recall_id_internal_id` |
| `recall_lots_recall_id_not_null` | NOT NULL | `NOT NULL recall_id` |
| `recall_lots_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `recall_lots_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_compliance_recall_lots_lot` | btree | `(lot_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_compliance_recall_lots_lot ON compliance.recall_lots USING btree (lot_id)` |
| `pk_compliance_recall_lots` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_compliance_recall_lots ON compliance.recall_lots USING btree (internal_id)` |
| `recall_lot` | btree | `(recall_id, lot_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX recall_lot ON compliance.recall_lots USING btree (recall_id, lot_id)` |
| `uq_compliance_recall_lots_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_compliance_recall_lots_id ON compliance.recall_lots USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON compliance.recall_lots FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["recall_id","recall_id_internal_id","compliance","product_recalls"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON compliance.recall_lots FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON compliance.recall_lots FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["recall_id","recall_id_internal_id","compliance","product_recalls"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
