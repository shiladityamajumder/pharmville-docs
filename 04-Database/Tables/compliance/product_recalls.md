# `compliance.product_recalls`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds product recalls records within the compliance domain (regulatory documentation and retention actions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | compliance.product_recalls |
| Classification | Transactional |
| Proposed business write owner | Pharmacist_Review via Compliance owner |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `announced_at` | `timestamp with time zone` | No | — | Time of announced | Support chronology, deadlines or audit evidence | Exact constraints below |
| `authority_id` | `uuid` | Yes | — | Reference linking this record to regulatory authorities | Ensures related business data can be joined and validated | FK → `compliance.regulatory_authorities` via `fk_compliance_product_recalls_authority_id_regulatory_a_6e3a` |
| `authority_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `compliance.regulatory_authorities` via `fk_compliance_product_recalls_authority_id_regulatory_a_02b2` |
| `closed_at` | `timestamp with time zone` | Yes | — | Time of closed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_compliance_product_recalls_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_compliance_product_recalls_product_id_products` |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_compliance_product_recalls_product_id_products_numeric` |
| `reason` | `text` | No | — | Inferred: stores reason for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `recall_class` | `character varying(32)` | Yes | — | Inferred: stores recall class for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `recall_number` | `character varying(64)` | No | — | Inferred: stores recall number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'open'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_compliance_product_recalls_updated_by_users` |

## Record lifecycle and users

- **Created:** when the product recalls business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Pharmacist_Review, Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `compliance.product_recalls` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_compliance_product_recalls_authority_id_regulatory_a_02b2 | `authority_id_internal_id` | [`compliance.regulatory_authorities`](../../Tables/compliance/regulatory_authorities.md) | `FOREIGN KEY (authority_id_internal_id) REFERENCES compliance.regulatory_authorities(internal_id) ON DELETE SET NULL` |
| fk_compliance_product_recalls_authority_id_regulatory_a_6e3a | `authority_id` | [`compliance.regulatory_authorities`](../../Tables/compliance/regulatory_authorities.md) | `FOREIGN KEY (authority_id) REFERENCES compliance.regulatory_authorities(id) ON DELETE SET NULL` |
| fk_compliance_product_recalls_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_compliance_product_recalls_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| fk_compliance_product_recalls_product_id_products_numeric | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| fk_compliance_product_recalls_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`compliance.recall_lots`](../../Tables/compliance/recall_lots.md) | fk_compliance_recall_lots_recall_id_product_recalls | `recall_id` | `id` |
| [`compliance.recall_lots`](../../Tables/compliance/recall_lots.md) | fk_compliance_recall_lots_recall_id_product_recalls_numeric | `recall_id_internal_id` | `internal_id` |

## `compliance.product_recalls` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `authority_id_internal_id` | `compliance.regulatory_authorities` | `fk_compliance_product_recalls_authority_id_regulatory_a_02b2` |
| `authority_id` | `compliance.regulatory_authorities` | `fk_compliance_product_recalls_authority_id_regulatory_a_6e3a` |
| `created_by` | `identity.users` | `fk_compliance_product_recalls_created_by_users` |
| `product_id` | `catalog.products` | `fk_compliance_product_recalls_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_compliance_product_recalls_product_id_products_numeric` |
| `updated_by` | `identity.users` | `fk_compliance_product_recalls_updated_by_users` |

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
| `product_recalls_announced_at_not_null` | NOT NULL | `NOT NULL announced_at` |
| `product_recalls_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `product_recalls_id_not_null` | NOT NULL | `NOT NULL id` |
| `product_recalls_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `product_recalls_product_id_internal_id_not_null` | NOT NULL | `NOT NULL product_id_internal_id` |
| `product_recalls_product_id_not_null` | NOT NULL | `NOT NULL product_id` |
| `product_recalls_reason_not_null` | NOT NULL | `NOT NULL reason` |
| `product_recalls_recall_number_not_null` | NOT NULL | `NOT NULL recall_number` |
| `product_recalls_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `product_recalls_status_not_null` | NOT NULL | `NOT NULL status` |
| `product_recalls_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_compliance_product_recalls_product` | btree | `(product_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_compliance_product_recalls_product ON compliance.product_recalls USING btree (product_id)` |
| `ix_compliance_product_recalls_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_compliance_product_recalls_status ON compliance.product_recalls USING btree (status)` |
| `pk_compliance_product_recalls` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_compliance_product_recalls ON compliance.product_recalls USING btree (internal_id)` |
| `recall_number` | btree | `(recall_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX recall_number ON compliance.product_recalls USING btree (recall_number)` |
| `uq_compliance_product_recalls_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_compliance_product_recalls_id ON compliance.product_recalls USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON compliance.product_recalls FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["authority_id","authority_id_internal_id","compliance","regulatory_authorities"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON compliance.product_recalls FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON compliance.product_recalls FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["authority_id","authority_id_internal_id","compliance","regulatory_authorities"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
