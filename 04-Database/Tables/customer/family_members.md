# `customer.family_members`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds family members records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | customer.family_members |
| Classification | Mapping / Junction |
| Proposed business write owner | Customer_Accounts |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 18 columns; 10 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_family_members_created_by_users` |
| `customer_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_family_members_customer_user_id_users` |
| `date_of_birth` | `date` | Yes | — | Inferred: stores date of birth for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_family_members_deleted_by_users` |
| `gender` | `character varying(32)` | Yes | — | Inferred: stores gender for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `guardian_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_family_members_guardian_user_id_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `is_dependent` | `boolean` | No | `true` | Yes/no flag for is dependent | Control conditional business behavior | Exact constraints below |
| `linked_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_family_members_linked_user_id_users` |
| `name` | `character varying(150)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `relationship` | `character varying(64)` | No | — | Inferred: stores relationship for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_family_members_updated_by_users` |

## Record lifecycle and users

- **Created:** when the family members business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Cart_Checkout, Prescription_Upload. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `customer.family_members` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_customer_family_members_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_customer_family_members_customer_user_id_users | `customer_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (customer_user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| fk_customer_family_members_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_customer_family_members_guardian_user_id_users | `guardian_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (guardian_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_customer_family_members_linked_user_id_users | `linked_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (linked_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_customer_family_members_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | fk_clinical_patient_profiles_family_member_id_family_me_da24 | `family_member_id_internal_id` | `internal_id` |
| [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | fk_clinical_patient_profiles_family_member_id_family_members | `family_member_id` | `id` |

## `customer.family_members` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_customer_family_members_created_by_users` |
| `customer_user_id` | `identity.users` | `fk_customer_family_members_customer_user_id_users` |
| `deleted_by` | `identity.users` | `fk_customer_family_members_deleted_by_users` |
| `guardian_user_id` | `identity.users` | `fk_customer_family_members_guardian_user_id_users` |
| `linked_user_id` | `identity.users` | `fk_customer_family_members_linked_user_id_users` |
| `updated_by` | `identity.users` | `fk_customer_family_members_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_customer_family_members_cannot_link_self` | CHECK | `CHECK (linked_user_id IS NULL OR linked_user_id <> customer_user_id)` |
| `ck_customer_family_members_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_customer_family_members_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_family_members_customer_user_id_users` | FOREIGN KEY | `FOREIGN KEY (customer_user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `fk_customer_family_members_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_family_members_guardian_user_id_users` | FOREIGN KEY | `FOREIGN KEY (guardian_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_customer_family_members_linked_user_id_users` | FOREIGN KEY | `FOREIGN KEY (linked_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_customer_family_members_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_customer_family_members` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_customer_family_members_id` | UNIQUE | `UNIQUE (id)` |
| `family_members_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `family_members_customer_user_id_not_null` | NOT NULL | `NOT NULL customer_user_id` |
| `family_members_id_not_null` | NOT NULL | `NOT NULL id` |
| `family_members_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `family_members_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `family_members_is_dependent_not_null` | NOT NULL | `NOT NULL is_dependent` |
| `family_members_name_not_null` | NOT NULL | `NOT NULL name` |
| `family_members_relationship_not_null` | NOT NULL | `NOT NULL relationship` |
| `family_members_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `family_members_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_customer_family_members_customer_user_id` | btree | `(customer_user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_customer_family_members_customer_user_id ON customer.family_members USING btree (customer_user_id)` |
| `ix_customer_family_members_linked_user_id` | btree | `(linked_user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_customer_family_members_linked_user_id ON customer.family_members USING btree (linked_user_id)` |
| `pk_customer_family_members` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_customer_family_members ON customer.family_members USING btree (internal_id)` |
| `uq_customer_family_members_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_customer_family_members_id ON customer.family_members USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON customer.family_members FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON customer.family_members FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON customer.family_members FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
