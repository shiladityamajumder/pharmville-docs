# `compliance.product_recalls`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds product recalls records within the compliance domain (regulatory documentation and retention actions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 12 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `announced_at` | `timestamp with time zone` | No | — | Time of announced | Support chronology, deadlines or audit evidence | See exact constraints |
| `authority_id` | `uuid` | Yes | — | Reference linking this record to regulatory authorities | Ensures related business data can be joined and validated | FK → `compliance.regulatory_authorities` (fk_compliance_product_recalls_authority_id_regulatory_a_6e3a) |
| `authority_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `compliance.regulatory_authorities` (fk_compliance_product_recalls_authority_id_regulatory_a_02b2); Numeric/public-key pair verification required |
| `closed_at` | `timestamp with time zone` | Yes | — | Time of closed | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_compliance_product_recalls_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_compliance_product_recalls_product_id_products) |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_compliance_product_recalls_product_id_products_numeric); Numeric/public-key pair verification required |
| `reason` | `text` | No | — | Inferred: stores reason for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `recall_class` | `character varying(32)` | Yes | — | Inferred: stores recall class for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `recall_number` | `character varying(64)` | No | — | Inferred: stores recall number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'open'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_compliance_product_recalls_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the product recalls business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Pharmacist_Review, Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `compliance.product_recalls` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_compliance_product_recalls_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_compliance_product_recalls_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `product_id` → `catalog.products(id)` via `fk_compliance_product_recalls_product_id_products`; `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT`
- `authority_id` → `compliance.regulatory_authorities(id)` via `fk_compliance_product_recalls_authority_id_regulatory_a_6e3a`; `FOREIGN KEY (authority_id) REFERENCES compliance.regulatory_authorities(id) ON DELETE SET NULL`
- `authority_id_internal_id` → `compliance.regulatory_authorities(internal_id)` via `fk_compliance_product_recalls_authority_id_regulatory_a_02b2`; `FOREIGN KEY (authority_id_internal_id) REFERENCES compliance.regulatory_authorities(internal_id) ON DELETE SET NULL`
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_compliance_product_recalls_product_id_products_numeric`; `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT`

**Referenced by 2 FK constraints** (sample): `compliance.recall_lots`, `compliance.recall_lots`.

## `compliance.product_recalls` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 17 columns, 12 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_compliance_product_recalls_created_by_users` |
| `updated_by` | `identity.users` | `fk_compliance_product_recalls_updated_by_users` |
| `product_id` | `catalog.products` | `fk_compliance_product_recalls_product_id_products` |
| `authority_id` | `compliance.regulatory_authorities` | `fk_compliance_product_recalls_authority_id_regulatory_a_6e3a` |
| `authority_id_internal_id` | `compliance.regulatory_authorities` | `fk_compliance_product_recalls_authority_id_regulatory_a_02b2` |
| `product_id_internal_id` | `catalog.products` | `fk_compliance_product_recalls_product_id_products_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_compliance_product_recalls_numeric_pair_authority_id` | CHECK | `CHECK ((authority_id IS NULL) = (authority_id_internal_id IS NULL))` |
| `ck_compliance_product_recalls_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_compliance_product_recalls_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_compliance_product_recalls_authority_id_regulatory_a_02b2` | FOREIGN KEY | `FOREIGN KEY (authority_id_internal_id) REFERENCES compliance.regulatory_authorities(internal_id) ON DELETE SET NULL` |
| `fk_compliance_product_recalls_authority_id_regulatory_a_6e3a` | FOREIGN KEY | `FOREIGN KEY (authority_id) REFERENCES compliance.regulatory_authorities(id) ON DELETE SET NULL` |
| `fk_compliance_product_recalls_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_compliance_product_recalls_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| `fk_compliance_product_recalls_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| `fk_compliance_product_recalls_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_compliance_product_recalls` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `recall_number` | UNIQUE | `UNIQUE (recall_number)` |
| `uq_compliance_product_recalls_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_compliance_product_recalls_product` | `CREATE INDEX ix_compliance_product_recalls_product ON compliance.product_recalls USING btree (product_id)` |
| `ix_compliance_product_recalls_status` | `CREATE INDEX ix_compliance_product_recalls_status ON compliance.product_recalls USING btree (status)` |
| `pk_compliance_product_recalls` | `CREATE UNIQUE INDEX pk_compliance_product_recalls ON compliance.product_recalls USING btree (internal_id)` |
| `recall_number` | `CREATE UNIQUE INDEX recall_number ON compliance.product_recalls USING btree (recall_number)` |
| `uq_compliance_product_recalls_id` | `CREATE UNIQUE INDEX uq_compliance_product_recalls_id ON compliance.product_recalls USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON compliance.product_recalls FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["authority_id","authority_id_internal_id","compliance","regulatory_authorities"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON compliance.product_recalls FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON compliance.product_recalls FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["authority_id","authority_id_internal_id","compliance","regulatory_authorities"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
