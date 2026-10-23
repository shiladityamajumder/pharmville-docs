# compliance.recall_lots

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds recall lots records within the compliance domain (regulatory documentation and retention actions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 13 columns, 12 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `action_status` | `character varying(32)` | No | `'pending'::character varying` | Inferred: stores action status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `affected_quantity` | `character varying(64)` | Yes | — | Affected quantity value | Track resource or item amounts accurately | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_compliance_recall_lots_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `lot_id` | `uuid` | No | — | Reference linking this record to inventory lots | Ensures related business data can be joined and validated | FK → `warehouse.inventory_lots` (fk_compliance_recall_lots_lot_id_inventory_lots) |
| `lot_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_lots` (fk_compliance_recall_lots_lot_id_inventory_lots_numeric); Numeric/public-key pair verification required |
| `recall_id` | `uuid` | No | — | Reference linking this record to product recalls | Ensures related business data can be joined and validated | FK → `compliance.product_recalls` (fk_compliance_recall_lots_recall_id_product_recalls) |
| `recall_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `compliance.product_recalls` (fk_compliance_recall_lots_recall_id_product_recalls_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_compliance_recall_lots_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the recall lots business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Pharmacist_Review, Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `compliance.recall_lots` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_compliance_recall_lots_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_compliance_recall_lots_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `lot_id` → `warehouse.inventory_lots(id)` via `fk_compliance_recall_lots_lot_id_inventory_lots`; FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT
- `recall_id` → `compliance.product_recalls(id)` via `fk_compliance_recall_lots_recall_id_product_recalls`; FOREIGN KEY (recall_id) REFERENCES compliance.product_recalls(id) ON DELETE CASCADE
- `lot_id_internal_id` → `warehouse.inventory_lots(internal_id)` via `fk_compliance_recall_lots_lot_id_inventory_lots_numeric`; FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT
- `recall_id_internal_id` → `compliance.product_recalls(internal_id)` via `fk_compliance_recall_lots_recall_id_product_recalls_numeric`; FOREIGN KEY (recall_id_internal_id) REFERENCES compliance.product_recalls(internal_id) ON DELETE CASCADE

## compliance.recall_lots — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 13 columns, 12 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_compliance_recall_lots_created_by_users` |
| `updated_by` | `identity.users` | `fk_compliance_recall_lots_updated_by_users` |
| `lot_id` | `warehouse.inventory_lots` | `fk_compliance_recall_lots_lot_id_inventory_lots` |
| `recall_id` | `compliance.product_recalls` | `fk_compliance_recall_lots_recall_id_product_recalls` |
| `lot_id_internal_id` | `warehouse.inventory_lots` | `fk_compliance_recall_lots_lot_id_inventory_lots_numeric` |
| `recall_id_internal_id` | `compliance.product_recalls` | `fk_compliance_recall_lots_recall_id_product_recalls_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_compliance_recall_lots_lot` | `CREATE INDEX ix_compliance_recall_lots_lot ON compliance.recall_lots USING btree (lot_id)` |
| `pk_compliance_recall_lots` | `CREATE UNIQUE INDEX pk_compliance_recall_lots ON compliance.recall_lots USING btree (internal_id)` |
| `recall_lot` | `CREATE UNIQUE INDEX recall_lot ON compliance.recall_lots USING btree (recall_id, lot_id)` |
| `uq_compliance_recall_lots_id` | `CREATE UNIQUE INDEX uq_compliance_recall_lots_id ON compliance.recall_lots USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON compliance.recall_lots FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["recall_id","recall_id_internal_id","compliance","product_recalls"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON compliance.recall_lots FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON compliance.recall_lots FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["recall_id","recall_id_internal_id","compliance","product_recalls"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
